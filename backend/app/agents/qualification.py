"""
Qualification Agent — Part 1, Step 2.  HITL Checkpoint #1.

Validates extracted requirements for completeness and generates a set of
clarification questions for the TSC to confirm before Part 2 begins.
In production this output is surfaced at GET /hitl/{session_id}/checkpoint-1.
"""

from __future__ import annotations

from pydantic import BaseModel

from app.agents.base import BaseAgent
from app.models.cot import CoTOutput


class QualificationInput(BaseModel):
    extracted_requirements: dict


class QualificationAgent(BaseAgent):
    name = "QualificationAgent"

    # Fields we require before proceeding — missing ones become clarification questions
    _REQUIRED_FIELDS = [
        "budget_max",
        "timeline_days",
        "location",
        "technical_specs",
        "client_name",
    ]

    async def _execute(self, input: QualificationInput) -> CoTOutput:  # type: ignore[override]
        req = input.extracted_requirements
        missing = [f for f in self._REQUIRED_FIELDS if not req.get(f)]

        clarification_questions = []

        if missing:
            for field in missing:
                clarification_questions.append(
                    f"Could not extract '{field}' from the transcript — please confirm."
                )

        # Additional domain-specific validation questions always raised
        clarification_questions += [
            "Has the client confirmed the go-live date is a hard deadline or a preference?",
            "Are there any data-residency or compliance requirements (e.g., PDPA, ISO 27001)?",
            "What is the expected peak concurrent user count for the WMS?",
            "Will the Oracle DB be decommissioned post-migration or kept permanently?",
        ]

        validation_flags = []
        budget = req.get("budget_max", 0)
        timeline = req.get("timeline_days", 0)

        if budget and budget < 200_000:
            validation_flags.append("WARN: Budget below MYR 200k — may not cover full implementation scope.")
        if timeline and timeline < 60:
            validation_flags.append("WARN: Timeline under 60 days is high risk for multi-site deployment.")

        qualified = {
            **req,
            "qualification_status": "awaiting_hitl" if clarification_questions else "qualified",
            "clarification_questions": clarification_questions,
            "validation_flags": validation_flags,
            "missing_fields": missing,
        }

        reasoning = (
            f"Cross-referenced {len(req)} extracted fields against required schema. "
            f"{len(missing)} missing fields detected. "
            f"Generated {len(clarification_questions)} clarification questions for TSC review. "
            f"{len(validation_flags)} validation flags raised. "
            "Pipeline will pause at HITL checkpoint-1 until TSC confirms or overrides."
        )

        return CoTOutput(
            reasoning=reasoning,
            output=qualified,
            confidence=0.87,
            agent_name=self.name,
        )
