# CLAUDE.md — AICHack Backend

## Project Overview

**Product**: Autonomous Sales Engineer — AI-powered pre-sales proposal generation  
**Stack**: FastAPI · Python 3.13 · Motor (async MongoDB Atlas) · LangChain / LangGraph · FastMCP  
**Auth**: Cookie-based JWT (httponly, samesite=lax)  
**Data**: Users in MongoDB Atlas; products / employees / sales cases from JSON seed files

---

## Project Structure

```
backend/
├── main.py                        # FastAPI app, CORS, api_router mount, MCP + uvicorn startup
├── requirements.txt
├── .env / .env.example
│
└── app/
    ├── api/
    │   ├── router.py              # Master APIRouter — includes all sub-routers (no version prefix)
    │   ├── auth_router.py         # /auth: register, login, logout, /me
    │   ├── product_router.py      # /products: list all, get by id
    │   ├── employee_router.py     # /employees: list, filter, cost estimation
    │   ├── sales_router.py        # /sales: list cases, get by id
    │   └── stage1_router.py       # /pipeline/stage1: run pipeline, HITL confirm
    │
    ├── services/
    │   ├── auth_service.py        # register (bcrypt hash + create user), login (verify + JWT)
    │   ├── product_service.py     # thin wrapper over ProductSeedLoader
    │   ├── employee_service.py    # thin wrapper over EmployeeSeedLoader + cost estimation
    │   ├── sales_service.py       # get_all_cases, get_case_by_id
    │   └── stage1_service.py      # start_pipeline, confirm_hitl, load_session, transcript CRUD
    │
    ├── core/
    │   ├── config.py              # Pydantic-settings: JWT_SECRET, JWT_ALGORITHM, mongo_url, db_name
    │   ├── auth.py                # create_access_token (JWT, 7-day expiry, reads from .env directly)
    │   ├── security.py            # hash_password, verify_password (bcrypt), get_current_user (cookie)
    │   └── seeds/
    │       ├── product_loader.py  # loads product seed data from JSON
    │       ├── employee_loader.py # loads employee seed data from JSON
    │       └── sales_loader.py    # loads sales case seed data from JSON
    │
    ├── db/
    │   ├── client.py              # AsyncIOMotorClient — exposes `users_collection` (reads .env directly)
    │   └── repositories/
    │       ├── user_repo.py       # create_user, find_by_email, find_by_id
    │       └── stage1_repo.py     # (stub) Stage 1 session persistence repo
    │
    ├── models/
    │   ├── user_model.py          # UserModel: profile fields + performance tracking
    │   └── cot.py                 # CoTOutput: reasoning, output, confidence, agent_name, duration_ms
    │
    ├── schema/
    │   ├── auth_schema.py         # UserRegisterSchema, UserLoginSchema, UserResponseSchema
    │   ├── product_schema.py      # ProductResponse
    │   ├── employee_schema.py     # EngineerSchema, TeamCostEstimateSchema, HeadcountSummarySchema
    │   ├── sales_schema.py        # SalesCase, CaseSummary, SummaryStats
    │   └── stage1_schema.py       # Stage1RunRequest, HITLConfirmRequest, Stage1Response, TranscriptSchemas
    │
    ├── agents/
    │   ├── base.py                # BaseAgent: CoT contract, LangSmith trace wrapper, tenacity retry
    │   ├── orchestrator.py        # LangGraph StateGraph — routes pipeline transitions
    │   ├── extraction.py          # LLM requirement parser
    │   ├── budget_validator.py    # Rule-based + LLM budget/constraint validation
    │   ├── catalog.py             # RAG + MCP vector search for SKUs
    │   ├── compatibility.py       # Conflict detection (calls catalog agent in-process)
    │   ├── proposal.py            # Generates premium / standard / budget proposals
    │   ├── refinement.py          # LangGraph loop: re-optimizes on rejection
    │   ├── review.py              # CRM write, audit trail, delivery trigger
    │   ├── qualification.py       # Lead qualification agent
    │   ├── mock_rag.py            # Mock RAG for local dev/testing
    │   │
    │   └── stage_1/               # Stage 1 LangGraph pipeline (A1 → A7 + HITL)
    │       ├── pipelinestate.py   # PipelineState TypedDict — shared across Stage 1/2/3
    │       ├── runner.py          # LangGraph runner: build/compile graph, run_stage1, resume_stage1
    │       ├── orchestrator.py    # (stub) future cross-stage orchestration
    │       ├── base.py            # Stage 1 BaseAgent
    │       ├── cot.py             # CoTOutput model for Stage 1 agents
    │       ├── requirement_extractor_agent.py   # A1 — parses transcript → requirements
    │       ├── gap_detector_agent.py            # A2 — detects missing info gaps
    │       ├── budget_validator_agent.py        # A3 — validates budget/constraints
    │       ├── deal_readiness_agent.py          # A4 — compares against past deals
    │       ├── sentiment_urgency.py             # A5 — detects sentiment & urgency signals
    │       ├── objection_anticipation.py        # A6 — anticipates likely objections
    │       ├── stage1_session_persistence.py   # A7 — writes final state to MongoDB (post-HITL only)
    │       ├── missing_info_agent.py            # supplementary: flags missing info
    │       └── ai_upsell_suggestions.py         # supplementary: upsell/cross-sell suggestions
    │
    └── mcp/
        └── mcp_server.py          # FastMCP server with ping + get_user_info tools
```

---

## API Routes

No `/api/v1` prefix — all routes are flat.

```
# Auth
POST   /auth/register              Body: UserRegisterSchema → {message}
POST   /auth/login                 Body: UserLoginSchema → sets httponly cookie + {message}
POST   /auth/logout                → clears cookie + {message}
GET    /auth/me                    JWT cookie required → UserResponseSchema

# Products (seed data, read-only)
GET    /products/                  → list[ProductResponse]
GET    /products/{product_id}      → ProductResponse

# Employees (seed data, read-only)
GET    /employees/                 → list[EngineerSchema]
GET    /employees/summary          → HeadcountSummarySchema
GET    /employees/names            → list[str]
GET    /employees/available        → list[EngineerSchema]
GET    /employees/filter/seniority?level=junior|mid|senior  → list[EngineerSchema]
GET    /employees/filter/module?module=<keyword>            → list[EngineerSchema]
GET    /employees/filter/specialisation?keyword=<keyword>   → list[EngineerSchema]
POST   /employees/estimate-cost?days=<int>  Body: list[str] (employee IDs) → TeamCostEstimateSchema
GET    /employees/{employee_id}    → EngineerSchema

# Sales cases (seed data, read-only)
GET    /sales/                     → list of SalesCase
GET    /sales/id/{case_id}         → SalesCase

# Stage 1 Pipeline
POST   /pipeline/stage1/run        Body: Stage1RunRequest → Stage1Response (status: awaiting_review)
POST   /pipeline/stage1/hitl/confirm  Body: HITLConfirmRequest → Stage1Response (status: ready_for_stage2 | awaiting_review)
```

---

## Pipeline Architecture

The sales pipeline is split into three HITL-gated stages. Each stage runs a LangGraph and pauses for human review before persisting output to MongoDB.

```
Transcript (MongoDB or raw text)
    │
    ▼
┌─────────────────────────────────────────────┐
│  STAGE 1 — Extraction & Analysis            │
│  A1 RequirementExtractor                    │
│  A2 GapDetector                             │
│  A3 BudgetValidator                         │
│  A4 PastDealComparator (deal_readiness)     │
│  A5 SentimentUrgencyDetector                │
│  A6 ObjectionAnticipator                    │
│       ↓                                     │
│  HITL Review — accept / edit / reject       │
│       ↓ (accepted or edited only)           │
│  A7 SessionPersistence → MongoDB            │
└─────────────────────────────────────────────┘
    │  status: ready_for_stage2
    ▼
┌─────────────────────────────────────────────┐
│  STAGE 2 — Scoring & Recommendations        │
│  (planned) deal_score, sales_suggestions,  │
│  industry_benchmark, objection_ranking      │
│       ↓                                     │
│  HITL Review (hitl_stage2_decision)         │
└─────────────────────────────────────────────┘
    │  status: ready_for_stage3
    ▼
┌─────────────────────────────────────────────┐
│  STAGE 3 — Proposal & CRM                  │
│  (planned) proposal generation,            │
│  crm_write_status, delivery trigger         │
│       ↓                                     │
│  HITL Review (hitl_stage3_decision)         │
└─────────────────────────────────────────────┘
```

### PipelineState (`agents/stage_1/pipelinestate.py`)

Single `TypedDict` shared across all stages. Stage 2 and 3 fields are pre-declared as placeholders.

| Field group | Fields |
|---|---|
| Identity | `session_id`, `transcript_id`, `transcript`, `current_stage` |
| Stage 1 outputs | `requirements`, `gaps`, `budget_validation`, `past_deals`, `sentiment`, `objections`, `session_saved` |
| Stage 1 HITL | `hitl_stage1_decision`, `hitl_stage1_user_edits` |
| Stage 2 (planned) | `deal_score`, `sales_suggestions`, `industry_benchmark`, `objection_ranking`, `hitl_stage2_decision`, `hitl_stage2_user_edits` |
| Stage 3 (planned) | `proposal`, `crm_write_status`, `hitl_stage3_decision`, `hitl_stage3_user_edits` |
| Tracing | `cot_traces` (append-only), `a2a_messages` (append-only) |

### Stage 1 Graph (`agents/stage_1/runner.py`)

- `run_stage1(session_id, transcript_id, transcript)` — starts graph, returns state paused at HITL
- `resume_stage1(session_id, decision, user_edits)` — resumes graph with HITL decision
- Checkpointer: `MemorySaver` (swap for `AsyncSqliteSaver` in production)
- **A7 never runs before HITL acceptance** — on rejection the graph retries from A1 with no MongoDB write

---

## Auth Flow

- Login sets `access_token` as an **httponly cookie** (`samesite=lax`, `secure=False`, `max_age=86400`)
- `get_current_user` (in `core/security.py`) reads `request.cookies.get("access_token")`
- JWT payload: `{user_id, email, exp}` — token expiry is **7 days** (cookie expires in 1 day)
- Password hashing: bcrypt via `passlib`

---

## MongoDB

- Atlas-hosted cluster (`MONGO_URL` in `.env`)
- Only the **`users`** collection is in MongoDB — all other data is seed-loaded from JSON
- `db/client.py` loads env vars via `python-dotenv` directly (not via `config.py`)
- `core/auth.py` also loads env vars via `python-dotenv` directly (not via `config.py`)

### `users` collection fields
```
email:          str (unique)
password:       str (bcrypt hash)
full_name:      str
phone_number:   str
organization:   str
position:       str
department:     str (default: "Sales")
employee_id:    str | null
region:         str | null
territory:      str | null
is_active:      bool (default: true)
total_sales:    float (default: 0.0)
total_deals_closed: int (default: 0)
rating:         float | null
created_at:     datetime
updated_at:     datetime | null
```

---

## Environment Variables

```env
MONGO_URL=mongodb+srv://<user>:<pass>@cluster0.xxx.mongodb.net/?appName=Cluster0
DB_NAME=aichack
JWT_SECRET=supersecretkey
JWT_ALGORITHM=HS256
```

**Important**: `db/client.py` and `core/auth.py` load env vars with `python-dotenv` / `os.getenv` directly.  
`core/config.py` uses `pydantic-settings` (`Settings` class) — only used in `core/security.py`.

---

## MCP Server

`app/mcp/mcp_server.py` runs a FastMCP server alongside FastAPI via `asyncio.gather` in `main.py`.  
Current tools: `ping()` → `"pong"`, `get_user_info(email)` → `{email, status}`.

---

## Running Locally

```bash
# Install dependencies
pip install -r requirements.txt

# Copy and fill in env
cp .env.example .env

# Run (starts FastAPI + MCP together)
python main.py

# Or run FastAPI only
uvicorn main:app --reload --port 8000
```

CORS is configured for `http://localhost:3000` and `http://127.0.0.1:3000`.

---

## Key Rules

- Routes have **no version prefix** — do not add `/api/v1/`
- Products, employees, and sales data are **read-only seed data** — never write them to MongoDB
- Only `users` collection and Stage 1 session data are in MongoDB
- All agents must extend `BaseAgent` and return `CoTOutput`
- Never call Motor or LangSmith directly in agents — use injected deps
- **A7 (session persistence) must only run after HITL accepts or edits** — never on rejection
- Stage 2 and Stage 3 fields are pre-declared in `PipelineState` — add agents in their own `stage_2/` and `stage_3/` directories following the same pattern as `stage_1/`
- The HITL flow is: `run` → `status: awaiting_review` → frontend polls/displays → user decides → `hitl/confirm` → `status: ready_for_stage2` (or `awaiting_review` on reject)
