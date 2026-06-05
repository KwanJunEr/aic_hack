from __future__ import annotations

from datetime import datetime
from typing import Any

from bson import ObjectId
from pydantic import BaseModel, ConfigDict, Field, GetCoreSchemaHandler, field_validator
from pydantic_core import core_schema


class PyObjectId(str):
    @classmethod
    def __get_pydantic_core_schema__(
        cls, _source_type: Any, _handler: GetCoreSchemaHandler
    ) -> core_schema.CoreSchema:
        return core_schema.no_info_plain_validator_function(cls.validate)

    @classmethod
    def validate(cls, value: Any) -> str:
        if isinstance(value, ObjectId):
            return str(value)
        if isinstance(value, str) and ObjectId.is_valid(value):
            return value
        raise ValueError(f"Invalid ObjectId: {value!r}")
 
 
# ---------------------------------------------------------------------------
# Nested object schemas
# Objects whose internal shape can vary are typed as dict[str, Any].
# Tighten these to concrete models as your data contracts solidify.
# ---------------------------------------------------------------------------
 
class BudgetValidation(BaseModel):
    model_config = ConfigDict(extra="allow")
 
 
class DealScore(BaseModel):
    model_config = ConfigDict(extra="allow")
 
 
class Gaps(BaseModel):
    model_config = ConfigDict(extra="allow")
 
 
class HitlStageEdits(BaseModel):
    model_config = ConfigDict(extra="allow")
 
 
class IndustryBenchmark(BaseModel):
    model_config = ConfigDict(extra="allow")
 
 
class MissingInfo(BaseModel):
    model_config = ConfigDict(extra="allow")
 
 
class ObjectionRanking(BaseModel):
    model_config = ConfigDict(extra="allow")
 
 
class Objections(BaseModel):
    model_config = ConfigDict(extra="allow")
 
 
class PastDeals(BaseModel):
    model_config = ConfigDict(extra="allow")
 
 
class Proposal(BaseModel):
    model_config = ConfigDict(extra="allow")
 
 
class Requirements(BaseModel):
    model_config = ConfigDict(extra="allow")
 
 
class SalesSuggestions(BaseModel):
    model_config = ConfigDict(extra="allow")
 
 
class Sentiment(BaseModel):
    model_config = ConfigDict(extra="allow")
 
 
class CrmWriteStatus(BaseModel):
    model_config = ConfigDict(extra="allow")
 



class Stage1SessionBase(BaseModel):
    """Fields shared across create / read operations."""
 
    session_id: str
    a2a_messages: list[Any] = Field(default_factory=list)
    budget_validation: BudgetValidation | None = None
    cot_traces: list[Any] = Field(default_factory=list)
    crm_write_status: CrmWriteStatus | None = None
    current_stage: str | None = None
    deal_score: DealScore | None = None
    gaps: Gaps | None = None
    hitl_stage1_decision: str | None = None
    hitl_stage1_user_edits: HitlStageEdits | None = None
    hitl_stage2_decision: str | None = None
    hitl_stage2_user_edits: HitlStageEdits | None = None
    hitl_stage3_decision: str | None = None
    hitl_stage3_user_edits: HitlStageEdits | None = None
    industry_benchmark: IndustryBenchmark | None = None
    missing_info: MissingInfo | None = None
    objection_ranking: ObjectionRanking | None = None
    objections: Objections | None = None
    past_deals: PastDeals | None = None
    proposal: Proposal | None = None
    requirements: Requirements | None = None
    sales_suggestions: SalesSuggestions | None = None
    sentiment: Sentiment | None = None
    session_saved: bool = False
    status: str | None = None
    transcript: str | None = None
    transcript_id: str | None = None
    user_id: str | None = None

    
 

 
class Stage1SessionResponse(Stage1SessionBase):
    """The response model — includes `id` and timestamps."""

    id: PyObjectId = Field(alias="_id")
    created_at: datetime | None = None
    updated_at: datetime | None = None

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str},
    )

    @field_validator("id", mode="before")
    @classmethod
    def coerce_object_id(cls, v: Any) -> str:
        if isinstance(v, ObjectId):
            return str(v)
        return v


class Stage1SessionListResponse(BaseModel):
    items: list[Stage1SessionResponse]
    total: int
    skip: int
    limit: int
