"""
Extraction Agent — Part 1, Step 1.

In production: runs Whisper STT on audio uploads, then an LLM requirement parser.
Mock: parses a plain-text transcript and returns structured requirements directly.
"""

from __future__ import annotations

from pydantic import BaseModel

from app.agents.base import BaseAgent
from app.models.cot import CoTOutput


class ExtractionInput(BaseModel):
    transcript: str
    source_type: str = "text"  # "text" | "pdf" | "audio"


class ExtractionAgent(BaseAgent):
    name = "ExtractionAgent"

    async def _execute(self, input: ExtractionInput) -> CoTOutput:  # type: ignore[override]
        word_count = len(input.transcript.split())

        # Mock extraction — in production an LLM parses the transcript
        extracted = {
            "client_name": "Acme Logistics Corp",
            "industry": "Logistics & Distribution",
            "budget_max": 500_000,
            "budget_currency": "MYR",
            "timeline_days": 90,
            "location": "Kuala Lumpur, Malaysia",
            "technical_specs": [
                {"spec_key": "warehouse_sites", "value": 5, "confidence": 0.97},
                {"spec_key": "erp_integration", "value": "SAP S/4HANA", "confidence": 0.95},
                {"spec_key": "dock_doors", "value": 18, "confidence": 0.88},
                {"spec_key": "daily_order_volume", "value": 2000, "confidence": 0.82},
                {"spec_key": "mobile_workforce", "value": True, "confidence": 0.79},
            ],
            "constraints": [
                "Small IT team — solution must be low-maintenance",
                "Legacy Oracle DB must remain alongside new system",
                "Go-live before end of Q2",
            ],
            "raw_word_count": word_count,
            "source_type": input.source_type,
        }

        reasoning = (
            f"Processed {word_count}-word {input.source_type} transcript. "
            "Identified client as Acme Logistics Corp in the logistics sector. "
            "Extracted budget ceiling of MYR 500,000 with 90-day delivery constraint. "
            "Detected SAP S/4HANA integration requirement (confidence 0.95) and 5-site scope. "
            "Flagged small IT team as a soft constraint influencing product selection. "
            "No ambiguous budget ranges detected — single hard ceiling stated by client."
        )

        return CoTOutput(
            reasoning=reasoning,
            output=extracted,
            confidence=0.91,
            agent_name=self.name,
        )
