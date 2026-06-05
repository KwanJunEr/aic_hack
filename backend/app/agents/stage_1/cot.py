from pydantic import BaseModel, Field
from typing import Optional, List


class CoTStep(BaseModel):
    """One reasoning step in the chain of thought."""
    step:       int
    thought:    str   # what the agent is reasoning about
    conclusion: str   # what it decided from that thought


class CoTOutput(BaseModel):
    """
    Full chain-of-thought record for one agent execution.
    Stored in PipelineState.cot_traces keyed by agent_name.
    Visible in LangSmith as a structured annotation on the node span.
    """
    agent_name:   str
    reasoning:    str              # raw free-form reasoning from the LLM
    steps:        List[CoTStep]    # parsed reasoning steps
    output:       dict             # the final structured output the agent produced
    confidence:   float            # 0.0 – 1.0 overall confidence in the output
    duration_ms:  Optional[int] = None
    model:        str = "gpt-4o"

    def to_a2a_summary(self) -> dict:
        """Compact summary emitted into the A2A message log."""
        return {
            "agent":      self.agent_name,
            "confidence": self.confidence,
            "steps":      len(self.steps),
            "duration_ms": self.duration_ms,
        }