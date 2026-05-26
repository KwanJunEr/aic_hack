from pydantic import BaseModel, Field


class CoTOutput(BaseModel):
    reasoning: str
    output: dict
    confidence: float = Field(ge=0.0, le=1.0)
    agent_name: str
    duration_ms: int = 0
