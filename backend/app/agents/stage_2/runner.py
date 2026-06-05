"""
Stage 2 LangGraph runner
========================

Graph flow
----------

  START
    |
    v
  b1_catalog -> b2_resources -> b3_architecture -> b4_integration
    |
    v
  hitl_review     <- interrupt() -- graph pauses here, awaits human decision
    |
    v
  route_decision  (conditional edge)
    |-- "accepted" --> b5_persist --> END
    |-- "edited"   --> apply_edits --> b1_catalog  (full re-run with feedback)
    `-- "rejected" --> end_rejected --> END  (no persist, return suggestions)

Key design:
- B5 (MongoDB persist) ONLY runs on human acceptance.
- "edited" appends feedback_text to combined_text so all agents re-run
  with the enriched context.
- "rejected" returns improvement_suggestions without persisting anything.
"""

import os
import uuid
import logging
from typing import Literal

from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
from langgraph.types import interrupt, Command
from langsmith import traceable

from app.agents.stage_2.pipelinestate import Stage2PipelineState
from app.agents.stage_2.catalog import CatalogRAGAgent
from app.agents.stage_2.resources import ResourceMatchingAgent
from app.agents.stage_2.architecture import SystemArchitectureAgent
from app.agents.stage_2.integration import IntegrationPlanningAgent
from app.agents.stage_2.persistence import Stage2Persistence

logger = logging.getLogger(__name__)

# ── Agent singletons ──────────────────────────────────────────────────────
_b1 = CatalogRAGAgent()
_b2 = ResourceMatchingAgent()
_b3 = SystemArchitectureAgent()
_b4 = IntegrationPlanningAgent()
_b5 = Stage2Persistence()


# ── HITL node — pauses graph, waits for human decision ───────────────────
async def hitl_review_node(state: Stage2PipelineState) -> dict:
    """
    interrupt() suspends the graph here.
    Frontend polls /session/{id} to display all agent outputs.
    User then POSTs to /accept, /reject, or /edit.
    The resume value is {"decision": "...", "user_edits": {...}, "feedback_text": "..."}.
    B5 has NOT run yet — nothing is in MongoDB at this point.
    """
    decision_data = interrupt({
        "message":    "Stage 2 complete. Awaiting human review.",
        "session_id": state["session_id"],
        "review_data": {
            "product_recommendations": state.get("product_recommendations", {}),
            "resource_allocation":     state.get("resource_allocation", {}),
            "system_architecture":     state.get("system_architecture", {}),
            "integration_plan":        state.get("integration_plan", {}),
        },
    })
    return {
        "hitl_decision":   decision_data.get("decision", ""),
        "hitl_user_edits": decision_data.get("user_edits", {}),
        "feedback_text":   decision_data.get("feedback_text", ""),
    }


# ── Apply edits node — merges feedback before re-running agents ───────────
async def apply_edits_node(state: Stage2PipelineState) -> dict:
    """
    Merges user corrections into state and appends feedback_text to
    combined_text so every agent re-processes enriched context.
    """
    edits = state.get("hitl_user_edits", {})
    patch: dict = {}

    for field in ("product_recommendations", "resource_allocation",
                  "system_architecture", "integration_plan"):
        if field in edits:
            patch[field] = {**state.get(field, {}), **edits[field]}

    feedback = edits.get("feedback_text") or state.get("feedback_text", "")
    if feedback:
        current = state.get("combined_text", "")
        patch["combined_text"] = current + f"\n\n[USER FEEDBACK]:\n{feedback}"

    logger.info(f"[hitl_s2] applied edits to: {list(patch.keys())}")
    return patch


# ── Rejected path node — returns suggestions, no persist ─────────────────
async def end_rejected_node(_state: Stage2PipelineState) -> dict:
    return {
        "improvement_suggestions": [
            "Review recommended modules — check if all client use-cases are covered",
            "Verify employee allocations match the project's integration complexity",
            "Clarify deployment model preference (cloud SaaS / on-premise / hybrid)",
            "Confirm integration touchpoints with the client before finalising",
        ],
        "cot_traces": [],
    }


# ── Decision router — conditional edge after HITL ─────────────────────────
def route_decision(
    state: Stage2PipelineState,
) -> Literal["b5_persist", "apply_edits", "end_rejected"]:
    decision = state.get("hitl_decision", "")
    logger.info(f"[route_s2] decision='{decision}'")
    if decision == "accepted":
        return "b5_persist"
    elif decision == "edited":
        return "apply_edits"
    else:   # "rejected" or unknown
        return "end_rejected"


# ── Build graph ───────────────────────────────────────────────────────────
def _build_graph() -> StateGraph:
    graph = StateGraph(Stage2PipelineState)

    graph.add_node("b1_catalog",      _b1)
    graph.add_node("b2_resources",    _b2)
    graph.add_node("b3_architecture", _b3)
    graph.add_node("b4_integration",  _b4)
    graph.add_node("b5_persist",      _b5)
    graph.add_node("hitl_review",     hitl_review_node)
    graph.add_node("apply_edits",     apply_edits_node)
    graph.add_node("end_rejected",    end_rejected_node)

    # Sequential pipeline: B1 → B2 → B3 → B4 → HITL
    graph.set_entry_point("b1_catalog")
    graph.add_edge("b1_catalog",      "b2_resources")
    graph.add_edge("b2_resources",    "b3_architecture")
    graph.add_edge("b3_architecture", "b4_integration")
    graph.add_edge("b4_integration",  "hitl_review")

    # HITL routing
    graph.add_conditional_edges(
        "hitl_review",
        route_decision,
        {
            "b5_persist":   "b5_persist",
            "apply_edits":  "apply_edits",
            "end_rejected": "end_rejected",
        },
    )

    # Terminal edges
    graph.add_edge("b5_persist",   END)
    graph.add_edge("end_rejected", END)

    # Edited path: merge edits then re-run full pipeline
    graph.add_edge("apply_edits", "b1_catalog")

    return graph


# ── Checkpointer — interrupt() requires persistent state ─────────────────
_checkpointer = MemorySaver()
stage2_graph = _build_graph().compile(
    checkpointer=_checkpointer,
    interrupt_before=["hitl_review"],
)


# ── Start Stage 2 ─────────────────────────────────────────────────────────
@traceable(
    name="stage2_pipeline",
    project_name=os.getenv("LANGCHAIN_PROJECT", "sales-pipeline"),
)
async def run_stage2(
    session_id:        str = None,
    user_id:           str = "",
    stage1_session_id: str = "",
    stage1_result:     dict = None,
    combined_text:     str = "",
) -> dict:
    """
    Start Stage 2. Runs B1→B4 then pauses at HITL interrupt.
    B5 does NOT run until human confirms (accepted).
    Returns state dict paused at hitl_review.
    """
    if not session_id:
        session_id = str(uuid.uuid4())

    initial_state: Stage2PipelineState = {
        "session_id":        session_id,
        "user_id":           user_id,
        "stage1_session_id": stage1_session_id,
        "combined_text":     combined_text,
        "stage1_result":     stage1_result or {},

        "product_recommendations": {},
        "resource_allocation":     {},
        "system_architecture":     {},
        "integration_plan":        {},

        "hitl_decision":         "",
        "hitl_user_edits":       {},
        "feedback_text":         "",
        "stage2_saved":          False,
        "improvement_suggestions": [],

        "cot_traces":   [],
        "a2a_messages": [],
    }

    config = {"configurable": {"thread_id": session_id}}
    result = await stage2_graph.ainvoke(initial_state, config=config)
    return result


# ── Resume after HITL decision ─────────────────────────────────────────────
async def resume_stage2(
    session_id:    str,
    decision:      str,
    user_edits:    dict = None,
    feedback_text: str = None,
) -> dict:
    """
    Resume the paused graph with the human's decision.

    accepted -> B5 persists to MongoDB -> END       (status: accepted)
    edited   -> apply_edits -> full re-run -> HITL  (status: awaiting_review)
    rejected -> end_rejected -> END                 (status: rejected + suggestions)
    """
    config = {"configurable": {"thread_id": session_id}}
    resume_value = {
        "decision":     decision,
        "user_edits":   user_edits or {},
        "feedback_text": feedback_text or "",
    }
    result = await stage2_graph.ainvoke(
        Command(resume=resume_value),
        config=config,
    )
    return result
