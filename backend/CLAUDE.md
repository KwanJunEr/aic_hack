# CLAUDE.md — Autonomous Sales Engineer Backend

## Project Overview

**Product**: Autonomous Sales Engineer — AI-powered pre-sales proposal generation  
**Stack**: FastAPI · Python 3.13 · Motor (async MongoDB) · LangChain / LangGraph · LangSmith  
**Architecture**: 3-part multi-agent pipeline with HITL checkpoints and MongoDB state persistence  
**Users**: Technical Sales Consultants (TSC) interacting via HITL REST endpoints

---

## Project Structure

```
backend/
├── app/
│   ├── main.py                    # FastAPI app factory, lifespan, middleware registration
│   ├── config.py                  # Pydantic-settings: all env vars, secrets
│   ├── dependencies.py            # DI: get_db, get_langsmith_client, get_current_user
│   │
│   ├── api/v1/
│   │   ├── router.py              # Master v1 APIRouter — includes all sub-routers
│   │   ├── auth.py                # POST /auth/login, POST /auth/refresh
│   │   ├── pipeline.py            # POST /pipeline/start, GET /pipeline/{id}/status, GET /pipeline/{id}/result
│   │   ├── hitl.py                # POST + GET /hitl/{id}/checkpoint-1 and checkpoint-2
│   │   └── ingestion.py           # POST /ingest/audio, /ingest/pdf, /ingest/text
│   │
│   ├── agents/
│   │   ├── base.py                # BaseAgent: CoT contract, LangSmith trace wrapper, tenacity retry
│   │   ├── orchestrator.py        # LangGraph StateGraph — routes pipeline transitions
│   │   ├── extraction.py          # Whisper STT + LLM requirement parser
│   │   ├── budget_validator.py    # Rule-based + LLM budget/constraint validation
│   │   ├── catalog.py             # Agentic RAG + MCP vector search for SKUs
│   │   ├── compatibility.py       # A2A with catalog agent, conflict detection
│   │   ├── proposal.py            # Generates premium / standard / budget proposals
│   │   ├── refinement.py          # LangGraph loop: re-optimizes on TSC rejection
│   │   └── review.py              # CRM write, audit trail, delivery trigger
│   │
│   ├── modules/
│   │   └── ranking.py             # Pure function module — scores + ranks proposals, no LLM
│   │
│   ├── models/
│   │   ├── cot.py                 # CoTOutput shared by all agents: reasoning, output, confidence
│   │   ├── pipeline.py            # PipelineSession, PipelineStatus enum
│   │   ├── requirements.py        # ExtractedRequirements, BudgetConstraint, Timeline
│   │   ├── proposal.py            # ProposalVersion (tier enum), LineItem, ComponentMatch
│   │   ├── ranking.py             # RankingScores, RankedProposal
│   │   ├── hitl.py                # HITLCheckpoint, ApprovalPayload, EscalationPayload
│   │   ├── catalog.py             # SKU, CatalogSearchResult, CompatibilityMatrix
│   │   └── auth.py                # TSCUser, JWTPayload, TokenResponse
│   │
│   ├── db/
│   │   ├── client.py              # Motor AsyncIOMotorClient factory, registered in lifespan
│   │   └── repositories/
│   │       ├── session_repo.py    # Pipeline session CRUD (primary key: session_id UUID4)
│   │       ├── proposal_repo.py   # Proposal version read/write per session
│   │       ├── hitl_repo.py       # HITL decision records per checkpoint
│   │       └── audit_repo.py      # Append-only audit trail (never update, never delete)
│   │
│   ├── services/
│   │   ├── pipeline_service.py    # Drives agent execution order, pauses at HITL, resumes
│   │   ├── ingestion_service.py   # Validates + preprocesses audio/PDF/text before pipeline
│   │   ├── auth_service.py        # bcrypt verify, JWT sign/decode
│   │   └── notification_service.py# Async email/webhook on HITL decisions or escalation
│   │
│   ├── tracing/
│   │   └── langsmith.py           # get_langsmith_client(), @traced decorator for agent calls
│   │
│   └── core/
│       ├── exceptions.py          # AgentFailure, HITLTimeout, CompatibilityConflict, PipelineError
│       ├── middleware.py          # Request-ID injection, structured JSON logging
│       └── security.py           # JWT create/verify helpers, password hashing
│
├── tests/
│   ├── conftest.py                # Fixtures: mock Motor, mock LangSmith, TestClient
│   ├── test_agents/               # Unit tests per agent (mocked LLM + mocked repo)
│   ├── test_api/                  # Integration tests for all routes + HITL flow
│   └── test_modules/
│       └── test_ranking.py        # Pure function tests — no mocks needed
│
├── .env.example
├── pyproject.toml
└── CLAUDE.md
```

---

## MongoDB Collections

All collections use `session_id` (UUID4 string) as the cross-collection foreign key.

### `sessions`
Top-level pipeline state document — one per run.
```
session_id:      str (UUID4, unique index)
status:          str  # pending | part1_running | awaiting_hitl_1 | part2_running |
                      # awaiting_hitl_2 | part3_running | completed | failed
created_by:      str  # TSC user ID
created_at:      datetime
updated_at:      datetime
input_ref:       str  # GridFS file ID or storage key for uploaded file
part1_output:    object | null   # snapshot of ExtractedRequirements on Part 1 complete
part2_output:    object | null   # snapshot of RankedProposals on Part 2 complete
part3_output:    object | null   # final approved proposal on Part 3 complete
error:           str | null      # last agent failure message
```

### `requirements`
Extracted + validated requirements per session.
```
session_id:      str
raw_transcript:  str
budget_max:      float
budget_currency: str
location:        str
timeline_days:   int
technical_specs: list[{spec_key: str, value: any, confidence: float}]
constraints:     list[str]
validation_flags:list[str]    # warnings from budget_validator agent
cot_trace:       {reasoning: str, confidence_score: float}
extracted_at:    datetime
```

### `proposals`
Three versions per session (premium / standard / budget). Version increments on refinement re-runs.
```
session_id:      str
tier:            str   # premium | standard | budget
components:      list[{sku: str, name: str, qty: int, unit_price: float, compatibility_ok: bool}]
total_price:     float
scores:          {cost_fit: float, risk_score: float, confidence_score: float, margin_score: float, total: float}
rank:            int   # 1–3 after ranking module runs
cot_trace:       {reasoning: str, confidence_score: float}
generated_at:    datetime
version:         int
```

### `hitl_decisions`
One document per checkpoint per session.
```
session_id:      str
checkpoint:      int   # 1 or 2
decision:        str   # approved | rejected | escalated
decided_by:      str   # TSC user ID
decided_at:      datetime
modifications:   object | null   # TSC overrides applied to requirements or proposal
escalation_note: str | null
rejection_reason:str | null
```

### `audit_trail`
Append-only. Never update or delete documents in this collection.
```
session_id:      str
event:           str   # agent_started | agent_completed | hitl_triggered | hitl_decided |
                       # pipeline_resumed | pipeline_failed | delivered
actor:           str   # agent class name or TSC user ID
payload:         object   # full state snapshot relevant to this event
timestamp:       datetime
```

---

## API Routes (v1)

```
# Auth
POST   /api/v1/auth/login                      Body: {email, password} → TokenResponse
POST   /api/v1/auth/refresh                    Body: {refresh_token} → TokenResponse

# File ingestion — returns session_id to caller
POST   /api/v1/ingest/audio                    Multipart: WAV/MP3 → {session_id}
POST   /api/v1/ingest/pdf                      Multipart: PDF → {session_id}
POST   /api/v1/ingest/text                     Body: {text} → {session_id}

# Pipeline control
POST   /api/v1/pipeline/start                  Body: {session_id} → {status}
GET    /api/v1/pipeline/{session_id}/status    → PipelineSession
GET    /api/v1/pipeline/{session_id}/result    → final approved proposal (only when completed)

# HITL checkpoints — JWT required on all
GET    /api/v1/hitl/{session_id}/checkpoint-1  → ExtractedRequirements for TSC review
POST   /api/v1/hitl/{session_id}/checkpoint-1  Body: ApprovalPayload → {status: "resumed"}
GET    /api/v1/hitl/{session_id}/checkpoint-2  → RankedProposals for TSC review
POST   /api/v1/hitl/{session_id}/checkpoint-2  Body: ApprovalPayload | EscalationPayload → {status}
```

---

## Agent Conventions

### Every agent MUST:
- Extend `BaseAgent` from `app/agents/base.py`
- Implement `async def _execute(self, input: BaseModel) -> CoTOutput`
- Never import LangSmith directly — tracing is injected by `BaseAgent.run()`
- Never touch Motor directly — use injected repository instances
- Use `tenacity` retry via `BaseAgent._with_retry()` for all LLM calls

### BaseAgent contract
```python
class BaseAgent:
    def __init__(self, session_id: str, db: AsyncIOMotorDatabase, ls_client: Client): ...
    async def run(self, input: BaseModel) -> CoTOutput:
        # wraps _execute with LangSmith trace + audit write + retry
    async def _execute(self, input: BaseModel) -> CoTOutput:
        raise NotImplementedError
```

### CoTOutput — shared model for ALL agent outputs
```python
class CoTOutput(BaseModel):
    reasoning: str           # agent's chain-of-thought explanation
    output: dict             # agent-specific structured result
    confidence: float        # 0.0 – 1.0
    agent_name: str
    duration_ms: int
```

### A2A communication
Compatibility agent calls catalog agent directly as a Python async method call (in-process).
Do NOT use HTTP for A2A — both agents are instantiated in the same pipeline execution context.

---

## HITL Pause / Resume Pattern

The pipeline does NOT block on HITL. It suspends by writing status to MongoDB and returning.

```
Part 1 completes
  → session_repo.set_status(session_id, "awaiting_hitl_1")
  → pipeline_service returns, background task ends

Frontend polls GET /pipeline/{id}/status until status == "awaiting_hitl_1"
TSC reviews requirements at GET /hitl/{id}/checkpoint-1
TSC POSTs approval to POST /hitl/{id}/checkpoint-1
  → hitl_repo.record_decision(...)
  → session_repo.set_status(session_id, "part2_running")
  → background_tasks.add_task(run_part2, session_id)   ← resumes pipeline
```

**Production note**: `BackgroundTasks` does not survive process restarts.
Swap to Celery + Redis before any multi-instance deployment. The interface is identical —
only the task dispatch mechanism changes.

---

## Ranking Module

Located at `app/modules/ranking.py`. This is NOT an agent class — it is a pure Python module.

```python
# Function signatures
def score_proposal(
    proposal: ProposalVersion,
    requirements: ExtractedRequirements,
    weights: dict[str, float] | None = None,
) -> RankingScores: ...

def rank_proposals(
    proposals: list[ProposalVersion],
    requirements: ExtractedRequirements,
) -> list[tuple[ProposalVersion, RankingScores]]: ...
    # Returns sorted descending by RankingScores.total — index 0 is rank 1

# RankingScores fields
cost_fit:         float   # 0–100: closeness of total_price to budget_max
risk_score:       float   # 0–100: compatibility confidence (higher = lower risk)
confidence_score: float   # 0–100: mean confidence from proposal CoT trace
margin_score:     float   # 0–100: estimated profit margin
total:            float   # weighted composite (default weights: cost 30%, risk 25%, confidence 25%, margin 20%)
```

---

## LangSmith Tracing

```python
# app/tracing/langsmith.py
from langsmith import Client, traceable

def get_langsmith_client() -> Client:
    return Client(api_key=settings.LANGSMITH_API_KEY)

def traced(agent_name: str):
    """Decorator applied inside BaseAgent.run() — agents never call this directly."""
    def decorator(func):
        @traceable(name=agent_name, project_name=settings.LANGSMITH_PROJECT)
        async def wrapper(*args, **kwargs):
            return await func(*args, **kwargs)
        return wrapper
    return decorator
```

- Injected into pipeline via `Depends(get_langsmith_client)` on pipeline routes
- `pipeline_service.py` passes `ls_client` to every agent at construction time
- One trace per `BaseAgent.run()` call — nested spans visible in LangSmith UI

---

## Key Dependencies

```toml
[project.dependencies]
fastapi = ">=0.115"
uvicorn = {extras = ["standard"]}
motor = ">=3.5"              # async MongoDB
pydantic = ">=2.7"
pydantic-settings = ">=2.3"
langchain = ">=0.3"
langchain-openai = ">=0.2"
langgraph = ">=0.2"
langsmith = ">=0.1"
openai-whisper = "*"         # STT for extraction agent
python-multipart = "*"       # file upload
python-jose = {extras = ["cryptography"]}   # JWT
passlib = {extras = ["bcrypt"]}
httpx = ">=0.27"             # async HTTP
celery = {extras = ["redis"]}  # durable background tasks (replace BackgroundTasks in prod)
redis = ">=5.0"
pymupdf = "*"                # PDF parsing
tenacity = ">=8.3"           # retry logic in BaseAgent
structlog = ">=24.2"         # structured JSON logging
```

---

## Key Rules

### Do
- One file per agent minimum — never merge agents
- Use `async/await` throughout; no synchronous DB or HTTP calls in agent code
- All pipeline state lives in MongoDB under `session_id` — nothing in memory across requests
- Write to `audit_trail` on every agent completion and every HITL decision
- Return `CoTOutput` from every agent `_execute()` — no exceptions
- Use Pydantic v2 models for all request/response schemas

### Do Not
- Do not let agents import Motor or LangSmith directly — use injected deps
- Do not put orchestration logic in route handlers — that belongs in `pipeline_service.py`
- Do not add LLM calls to `modules/ranking.py` — it must remain a pure function module
- Do not update or delete documents in `audit_trail`
- Do not use `Math.random()` equivalents (i.e. non-deterministic values) in any server-rendered output

---

## Running Locally

```bash
# Install dependencies (uv recommended)
uv sync

# Copy env
cp .env.example .env

# Run dev server
uvicorn app.main:app --reload --port 8000
```
