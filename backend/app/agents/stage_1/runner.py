"""
Stage 1 LangGraph runner
========================

Graph flow
----------

  START
    |
    v
  a1_extract -> a2_gaps -> a3_budget -> a4_past_deals -> a5_sentiment -> a6_objections
    |
    v
  hitl_review     <- interrupt() -- graph pauses here, awaits human decision
    |
    v
  route_decision  (conditional edge)
    |-- "accepted" --> a7_persist --> END
    |-- "edited"   --> apply_edits --> a1_extract  (re-run all agents with merged context)
    `-- "rejected" --> a1_extract                  (full retry, no persist)

Key design:
- A7 (MongoDB persist) ONLY runs when human confirms (accepted).
- Both "edited" and "rejected" re-trigger the full A1-A6 pipeline.
- "edited" first merges user corrections into state; "rejected" discards nothing
  (old outputs are overwritten when agents re-run).
- transcript_id + user_id are passed in at start; A1 fetches combined_text via MCP.
- Raw transcript text can also be passed directly (fallback for testing).
"""

import os
import uuid
import logging
from typing import Literal

from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
from langgraph.types import interrupt, Command
from langsmith import traceable

from app.agents.stage_1.pipelinestate import PipelineState
from app.agents.stage_1.requirement_extractor_agent import RequirementExtractor
from app.agents.stage_1.gap_detector_agent import GapDetector
from app.agents.stage_1.budget_validator_agent import BudgetValidator
from app.agents.stage_1.deal_readiness_agent import PastDealComparator
from app.agents.stage_1.sentiment_urgency import SentimentUrgencyDetector
from app.agents.stage_1.objection_anticipation import ObjectionAnticipator
from app.agents.stage_1.stage1_session_persistence import SessionPersistence

logger = logging.getLogger(__name__)

# ── Agent singletons ──────────────────────────────────────────────────────
_a1 = RequirementExtractor()
_a2 = GapDetector()
_a3 = BudgetValidator()
_a4 = PastDealComparator()
_a5 = SentimentUrgencyDetector()
_a6 = ObjectionAnticipator()
_a7 = SessionPersistence()


# ── HITL node -- pauses graph, waits for human decision ──────────────────
async def hitl_review_node(state: PipelineState) -> dict:
    """
    interrupt() suspends the graph here.
    Frontend polls /session/{id} to display all agent outputs.
    User reviews, then POSTs to /confirm, /edit, or /reject.
    The resume value is {"decision": "...", "user_edits": {...}}.
    A7 has NOT run yet -- nothing is in MongoDB at this point.
    """
    decision_data = interrupt({
        "message":    "Stage 1 complete. Awaiting human review.",
        "session_id": state["session_id"],
        "review_data": {
            "requirements":      state.get("requirements", {}),
            "gaps":              state.get("gaps", {}),
            "budget_validation": state.get("budget_validation", {}),
            "past_deals":        state.get("past_deals", {}),
            "sentiment":         state.get("sentiment", {}),
            "objections":        state.get("objections", {}),
        },
    })
    return {
        "hitl_stage1_decision":   decision_data.get("decision", ""),
        "hitl_stage1_user_edits": decision_data.get("user_edits", {}),
    }


# ── Apply edits node -- merges user corrections before re-running agents ─
async def apply_edits_node(state: PipelineState) -> dict:
    """
    Merges user_edits from the HITL edit request into state.
    Field-level edits patch individual agent outputs.
    additional_text (if present) is appended to the transcript so
    A1 re-processes the enriched content on its next pass.
    """
    edits = state.get("hitl_stage1_user_edits", {})
    patch = {}

    for field in ("requirements", "gaps", "budget_validation",
                  "past_deals", "sentiment", "objections"):
        if field in edits:
            patch[field] = {**state.get(field, {}), **edits[field]}

    if edits.get("additional_text"):
        current = state.get("transcript", "")
        patch["transcript"] = (
            current + "\n\n[USER ADDITIONAL CONTEXT]:\n" + edits["additional_text"]
        )

    logger.info(f"[hitl] applied edits to: {list(patch.keys())}")
    return patch


# ── Decision router -- conditional edge after HITL ────────────────────────
def route_decision(
    state: PipelineState,
) -> Literal["a7_persist", "apply_edits", "a1_extract"]:
    """
    accepted -> a7_persist  (persist to MongoDB then END)
    edited   -> apply_edits (merge corrections, then re-run full pipeline)
    rejected -> a1_extract  (full retry from A1 -- no persist)
    """
    decision = state.get("hitl_stage1_decision", "")
    logger.info(f"[route_decision] decision='{decision}'")

    if decision == "accepted":
        return "a7_persist"
    elif decision == "edited":
        return "apply_edits"
    elif decision == "rejected":
        return "a1_extract"
    else:
        logger.warning(f"[route_decision] unknown decision '{decision}' -- defaulting to a7_persist")
        return "a7_persist"


# ── Build graph ───────────────────────────────────────────────────────────
def _build_graph() -> StateGraph:
    graph = StateGraph(PipelineState)

    graph.add_node("a1_extract",    _a1)
    graph.add_node("a2_gaps",       _a2)
    graph.add_node("a3_budget",     _a3)
    graph.add_node("a4_past_deals", _a4)
    graph.add_node("a5_sentiment",  _a5)
    graph.add_node("a6_objections", _a6)
    graph.add_node("a7_persist",    _a7)

    graph.add_node("hitl_review", hitl_review_node)
    graph.add_node("apply_edits", apply_edits_node)

    # A1 -> A2 -> A3 -> A4 -> A5 -> A6 -> HITL
    graph.set_entry_point("a1_extract")
    graph.add_edge("a1_extract",    "a2_gaps")
    graph.add_edge("a2_gaps",       "a3_budget")
    graph.add_edge("a3_budget",     "a4_past_deals")
    graph.add_edge("a4_past_deals", "a5_sentiment")
    graph.add_edge("a5_sentiment",  "a6_objections")
    graph.add_edge("a6_objections", "hitl_review")

    # After HITL: route by decision
    graph.add_conditional_edges(
        "hitl_review",
        route_decision,
        {
            "a7_persist":  "a7_persist",   # accepted -> persist -> END
            "apply_edits": "apply_edits",  # edited -> merge -> re-run
            "a1_extract":  "a1_extract",   # rejected -> full retry
        },
    )

    # accepted path: persist then done
    graph.add_edge("a7_persist", END)

    # edited path: apply edits then re-run full pipeline
    graph.add_edge("apply_edits", "a1_extract")

    return graph


# ── Checkpointer -- interrupt() requires persistent state ─────────────────
_checkpointer = MemorySaver()
stage1_graph = _build_graph().compile(
    checkpointer=_checkpointer,
    interrupt_before=["hitl_review"],  # pause before the HITL node
)


# ── Start Stage 1 ─────────────────────────────────────────────────────────
@traceable(
    name="stage1_pipeline",
    project_name=os.getenv("LANGCHAIN_PROJECT", "sales-pipeline"),
)
async def run_stage1(
    session_id:    str = None,
    user_id:       str = "",
    transcript_id: str = None,
    transcript:    str = None,
) -> dict:
    """
    Start Stage 1. Runs A1->A6 then pauses at HITL interrupt.
    A7 does NOT run until human confirms (accepted/edited path confirmed).
    Returns state dict paused at hitl_review.
    """
    if not session_id:
        session_id = str(uuid.uuid4())

    if not transcript_id and not transcript:
        raise ValueError("Provide either transcript_id or transcript text.")

    initial_state: PipelineState = {
        "session_id":    session_id,
        "user_id":       user_id,
        "transcript_id": transcript_id or "",
        "transcript":    transcript or "",
        "current_stage": "stage1",

        "requirements":      {},
        "gaps":              {},
        "budget_validation": {},
        "past_deals":        {},
        "sentiment":         {},
        "objections":        {},
        "missing_info":      {},
        "session_saved":     False,

        "cot_traces":   [],
        "a2a_messages": [],

        "hitl_stage1_decision":   "",
        "hitl_stage1_user_edits": {},

        # Stage 2 + 3 placeholders
        "deal_score":             {},
        "sales_suggestions":      {},
        "industry_benchmark":     {},
        "objection_ranking":      {},
        "hitl_stage2_decision":   "",
        "hitl_stage2_user_edits": {},
        "proposal":               {},
        "crm_write_status":       {},
        "hitl_stage3_decision":   "",
        "hitl_stage3_user_edits": {},
    }

    config = {"configurable": {"thread_id": session_id}}
    result = await stage1_graph.ainvoke(initial_state, config=config)
    return result


# ── Resume after HITL decision ────────────────────────────────────────────
async def resume_stage1(
    session_id: str,
    decision:   str,
    user_edits: dict = None,
) -> dict:
    """
    Resume the paused graph with the human's decision.

    accepted -> A7 persists to MongoDB -> END    (status: ready_for_stage2)
    edited   -> apply_edits -> full re-run -> HITL pause again (status: awaiting_review)
    rejected -> full re-run from A1 -> HITL pause again       (status: awaiting_review)
    """
    config = {"configurable": {"thread_id": session_id}}
    resume_value = {
        "decision":   decision,
        "user_edits": user_edits or {},
    }
    result = await stage1_graph.ainvoke(
        Command(resume=resume_value),
        config=config,
    )
    return result
