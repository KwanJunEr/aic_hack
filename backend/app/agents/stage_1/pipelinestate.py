from typing import TypedDict, Annotated
import operator
 
 
class PipelineState(TypedDict):
    # ── Identity ──────────────────────────────────────────────────────────
    session_id:    str
    user_id:       str   # required for MCP upload-session fetch
    transcript_id: str   # upload session ID — A1 fetches combined_text via MCP
    transcript:    str   # populated by A1 after MCP fetch (or direct input)
    current_stage: str   # "stage1" | "stage2" | "stage3" | "complete"
 
    # ── Stage 1 agent outputs (A1 → A7) ──────────────────────────────────
    requirements:      dict   # A1
    gaps:              dict   # A2
    budget_validation: dict   # A3
    past_deals:        dict   # A4
    sentiment:         dict   # A5
    objections:        dict   # A6
    session_saved:     bool   # A7
    missing_info:      dict   # supplementary MissingInfoAgent (optional)
 
    # ── Chain-of-Thought traces — one entry per agent, appended ──────────
    # Keyed by agent_name: { "a1_requirement_extractor": CoTOutput.dict(), ... }
    # Uses operator.add so each agent appends its own entry without overwriting
    cot_traces: Annotated[list, operator.add]
 
    # ── A2A message log — every agent appends a compact summary ──────────
    a2a_messages: Annotated[list, operator.add]
 
    # ── Stage 1 HITL ─────────────────────────────────────────────────────
    hitl_stage1_decision:   str    # "" | "accepted" | "edited" | "rejected"
    hitl_stage1_user_edits: dict
 
    # ── Stage 2 placeholders ─────────────────────────────────────────────
    deal_score:         dict
    sales_suggestions:  dict
    industry_benchmark: dict
    objection_ranking:  dict
    hitl_stage2_decision:   str
    hitl_stage2_user_edits: dict
 
    # ── Stage 3 placeholders ─────────────────────────────────────────────
    proposal:         dict
    crm_write_status: dict
    hitl_stage3_decision:   str
    hitl_stage3_user_edits: dict
 