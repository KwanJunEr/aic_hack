from typing import TypedDict, Annotated
import operator


class Stage2PipelineState(TypedDict):
    # ── Identity ──────────────────────────────────────────────────────────
    session_id:        str
    user_id:           str
    stage1_session_id: str   # source Stage 1 session

    # ── Inputs from Stage 1 ───────────────────────────────────────────────
    combined_text:  str   # raw transcript / meeting notes
    stage1_result:  dict  # full Stage 1 pipeline output

    # ── Stage 2 agent outputs (B1 → B4) ──────────────────────────────────
    product_recommendations: dict  # B1: Nexus WMS modules + pricing
    resource_allocation:     dict  # B2: matched employees (1-3)
    system_architecture:     dict  # B3: deployment architecture
    integration_plan:        dict  # B4: API routes + best practices

    # ── HITL ─────────────────────────────────────────────────────────────
    hitl_decision:   str   # "" | "accepted" | "rejected" | "edited"
    hitl_user_edits: dict
    feedback_text:   str   # free-text feedback for "edited" path
    stage2_saved:    bool  # True after B5 persists to MongoDB

    # ── Rejection feedback ────────────────────────────────────────────────
    improvement_suggestions: list

    # ── Trace logs ────────────────────────────────────────────────────────
    cot_traces:   Annotated[list, operator.add]
    a2a_messages: Annotated[list, operator.add]
