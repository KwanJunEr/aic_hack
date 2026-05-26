"""
Orchestrator Agent — master pipeline controller.

Drives all agents in sequence, pauses at HITL checkpoints,
and resumes on TSC approval. In production this is a LangGraph
StateGraph; here it is a simplified async orchestration class
that can be called directly for demos and testing.

Pipeline topology:

  [input]
     │
     ▼
  ExtractionAgent          ← Part 1
     │
     ▼
  QualificationAgent       ← Part 1  (generates HITL-1 questions)
     │
     ▼
  BudgetValidatorAgent     ← Part 1
     │
     ▼
  ── HITL CHECKPOINT 1 ──  (TSC reviews & approves requirements)
     │
     ▼
  CatalogAgent             ← Part 2
     │
     ▼
  CompatibilityAgent       ← Part 2
     │
     ▼
  ProposalAgent            ← Part 3
     │
     ▼
  ReviewAgent              ← Part 3  (generates HITL-2 ranked proposals)
     │
     ▼
  ── HITL CHECKPOINT 2 ──  (TSC approves or rejects)
     │         │
     │ reject  │ approve
     ▼         ▼
  RefinementAgent        [DONE]
     │
     └──► ReviewAgent  (loop, max 3 iterations)
"""

from __future__ import annotations

import logging
from dataclasses import dataclass, field
from typing import Literal

from pydantic import BaseModel

from app.agents.base import BaseAgent
from app.agents.extraction import ExtractionAgent, ExtractionInput
from app.agents.qualification import QualificationAgent, QualificationInput
from app.agents.budget_validator import BudgetValidatorAgent, BudgetValidatorInput
from app.agents.catalog import CatalogAgent, CatalogInput
from app.agents.compatibility import CompatibilityAgent, CompatibilityInput
from app.agents.proposal import ProposalAgent, ProposalInput
from app.agents.review import ReviewAgent, ReviewInput
from app.agents.refinement import RefinementAgent, RefinementInput
from app.models.cot import CoTOutput

logger = logging.getLogger(__name__)

PipelineStatus = Literal[
    "pending",
    "part1_running",
    "awaiting_hitl_1",
    "part2_running",
    "part3_running",
    "awaiting_hitl_2",
    "refining",
    "completed",
    "failed",
    "escalated",
]


@dataclass
class PipelineState:
    session_id: str
    status: PipelineStatus = "pending"
    trace: list[CoTOutput] = field(default_factory=list)

    # Intermediate outputs — populated as pipeline progresses
    extraction_output: dict = field(default_factory=dict)
    qualification_output: dict = field(default_factory=dict)
    budget_validation_output: dict = field(default_factory=dict)
    catalog_output: dict = field(default_factory=dict)
    compatibility_output: dict = field(default_factory=dict)
    proposal_output: dict = field(default_factory=dict)
    review_output: dict = field(default_factory=dict)
    refinement_output: dict = field(default_factory=dict)

    # HITL decisions (written by external route handler before resume)
    hitl_1_approved: bool = False
    hitl_2_decision: Literal["approved", "rejected", "escalated"] | None = None
    hitl_2_overrides: dict = field(default_factory=dict)
    hitl_2_rejection_reason: str = ""

    error: str | None = None


class OrchestratorAgent(BaseAgent):
    """
    Drives the full pipeline end-to-end for demos.
    In production, each part runs as a separate background task,
    pausing at HITL checkpoints by writing status to MongoDB.
    """

    name = "OrchestratorAgent"

    def __init__(self, session_id: str) -> None:
        super().__init__(session_id)
        self.state = PipelineState(session_id=session_id)

    def _agent(self, cls: type[BaseAgent]) -> BaseAgent:
        return cls(session_id=self.session_id)

    async def _execute(self, _input: BaseModel) -> CoTOutput:  # type: ignore[override]
        raise NotImplementedError("Use run_part1 / run_part2 / run_part3 directly.")

    # ------------------------------------------------------------------ #
    #  Part 1: Extraction → Qualification → BudgetValidation             #
    # ------------------------------------------------------------------ #

    async def run_part1(self, transcript: str, source_type: str = "text") -> PipelineState:
        self.state.status = "part1_running"
        logger.info("[%s] Part 1 started", self.session_id)

        try:
            # Step 1 — Extraction
            ext_result = await self._agent(ExtractionAgent).run(
                ExtractionInput(transcript=transcript, source_type=source_type)
            )
            self.state.trace.append(ext_result)
            self.state.extraction_output = ext_result.output
            logger.info("[%s] ExtractionAgent done (conf=%.2f)", self.session_id, ext_result.confidence)

            # Step 2 — Qualification
            qual_result = await self._agent(QualificationAgent).run(
                QualificationInput(extracted_requirements=ext_result.output)
            )
            self.state.trace.append(qual_result)
            self.state.qualification_output = qual_result.output
            logger.info("[%s] QualificationAgent done (conf=%.2f)", self.session_id, qual_result.confidence)

            # Step 3 — Budget Validation
            bv_result = await self._agent(BudgetValidatorAgent).run(
                BudgetValidatorInput(qualified_requirements=qual_result.output)
            )
            self.state.trace.append(bv_result)
            self.state.budget_validation_output = bv_result.output
            logger.info("[%s] BudgetValidatorAgent done (risk=%s)", self.session_id, bv_result.output.get("risk_level"))

            # Pause for HITL-1
            self.state.status = "awaiting_hitl_1"
            logger.info("[%s] Paused at HITL checkpoint-1", self.session_id)

        except Exception as exc:
            self.state.status = "failed"
            self.state.error = str(exc)
            logger.exception("[%s] Part 1 failed: %s", self.session_id, exc)

        return self.state

    # ------------------------------------------------------------------ #
    #  Part 2: Catalog → Compatibility                                    #
    # ------------------------------------------------------------------ #

    async def run_part2(self) -> PipelineState:
        if not self.state.hitl_1_approved:
            self.state.status = "failed"
            self.state.error = "Part 2 called before HITL-1 approval."
            return self.state

        self.state.status = "part2_running"
        logger.info("[%s] Part 2 started", self.session_id)

        try:
            qualified = self.state.qualification_output

            # Step 4 — Catalog RAG search
            cat_result = await self._agent(CatalogAgent).run(
                CatalogInput(qualified_requirements=qualified)
            )
            self.state.trace.append(cat_result)
            self.state.catalog_output = cat_result.output
            logger.info("[%s] CatalogAgent done — %d SKUs recommended", self.session_id, len(cat_result.output.get("recommended_skus", [])))

            # Step 5 — Compatibility check (A2A: calls catalog data in-process)
            compat_result = await self._agent(CompatibilityAgent).run(
                CompatibilityInput(catalog_output=cat_result.output)
            )
            self.state.trace.append(compat_result)
            self.state.compatibility_output = compat_result.output
            logger.info("[%s] CompatibilityAgent done (ok=%s)", self.session_id, compat_result.output.get("compatibility_ok"))

        except Exception as exc:
            self.state.status = "failed"
            self.state.error = str(exc)
            logger.exception("[%s] Part 2 failed: %s", self.session_id, exc)

        return self.state

    # ------------------------------------------------------------------ #
    #  Part 3: Proposal → Review (→ optional Refinement loop)            #
    # ------------------------------------------------------------------ #

    async def run_part3(self) -> PipelineState:
        self.state.status = "part3_running"
        logger.info("[%s] Part 3 started", self.session_id)

        try:
            qualified = self.state.qualification_output

            # Step 6 — Proposal generation (3 tiers)
            prop_result = await self._agent(ProposalAgent).run(
                ProposalInput(
                    compatibility_output=self.state.compatibility_output,
                    qualified_requirements=qualified,
                )
            )
            self.state.trace.append(prop_result)
            self.state.proposal_output = prop_result.output
            logger.info("[%s] ProposalAgent done — recommended=%s", self.session_id, prop_result.output.get("recommended_tier"))

            # Step 7 — Review + ranking for HITL-2
            await self._run_review()

        except Exception as exc:
            self.state.status = "failed"
            self.state.error = str(exc)
            logger.exception("[%s] Part 3 failed: %s", self.session_id, exc)

        return self.state

    async def _run_review(self) -> None:
        rev_result = await self._agent(ReviewAgent).run(
            ReviewInput(
                proposals=self.state.proposal_output,
                compatibility_output=self.state.compatibility_output,
                qualified_requirements=self.state.qualification_output,
            )
        )
        self.state.trace.append(rev_result)
        self.state.review_output = rev_result.output
        self.state.status = "awaiting_hitl_2"
        logger.info("[%s] Paused at HITL checkpoint-2", self.session_id)

    async def resume_after_hitl2(
        self,
        decision: Literal["approved", "rejected", "escalated"],
        overrides: dict | None = None,
        rejection_reason: str = "",
        iteration: int = 1,
    ) -> PipelineState:
        self.state.hitl_2_decision = decision
        self.state.hitl_2_overrides = overrides or {}
        self.state.hitl_2_rejection_reason = rejection_reason

        if decision == "approved":
            self.state.status = "completed"
            logger.info("[%s] Pipeline COMPLETED — proposal approved by TSC", self.session_id)
            return self.state

        if decision == "escalated":
            self.state.status = "escalated"
            logger.info("[%s] Pipeline ESCALATED", self.session_id)
            return self.state

        # Rejected → Refinement loop
        self.state.status = "refining"
        ref_result = await self._agent(RefinementAgent).run(
            RefinementInput(
                previous_proposals=self.state.proposal_output,
                rejection_reason=rejection_reason,
                tsc_overrides=self.state.hitl_2_overrides,
                iteration=iteration,
            )
        )
        self.state.trace.append(ref_result)
        self.state.refinement_output = ref_result.output

        if ref_result.output.get("status") == "escalated":
            self.state.status = "escalated"
        else:
            # Merge refined proposals back and re-run review
            self.state.proposal_output["proposals"] = ref_result.output.get("refined_proposals", {})
            await self._run_review()

        return self.state

    # ------------------------------------------------------------------ #
    #  Convenience: run entire pipeline end-to-end (for demos / tests)   #
    # ------------------------------------------------------------------ #

    async def run_full_pipeline(
        self,
        transcript: str,
        source_type: str = "text",
        auto_approve_hitl: bool = True,
    ) -> PipelineState:
        """
        Runs Parts 1–3 with automatic HITL approval — useful for demos and unit tests.
        Set auto_approve_hitl=False to inspect the pause state at each checkpoint.
        """
        await self.run_part1(transcript=transcript, source_type=source_type)
        if self.state.status == "failed":
            return self.state

        if auto_approve_hitl:
            self.state.hitl_1_approved = True

        await self.run_part2()
        if self.state.status == "failed":
            return self.state

        await self.run_part3()
        if self.state.status == "failed":
            return self.state

        if auto_approve_hitl:
            await self.resume_after_hitl2(decision="approved")

        return self.state
