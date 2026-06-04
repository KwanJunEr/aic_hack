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
    │   └── sales_router.py        # /sales: list cases, get by id
    │
    ├── services/
    │   ├── auth_service.py        # register (bcrypt hash + create user), login (verify + JWT)
    │   ├── product_service.py     # thin wrapper over ProductSeedLoader
    │   ├── employee_service.py    # thin wrapper over EmployeeSeedLoader + cost estimation
    │   └── sales_service.py       # get_all_cases, get_case_by_id
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
    │       └── user_repo.py       # create_user, find_by_email, find_by_id
    │
    ├── models/
    │   ├── user_model.py          # UserModel: profile fields + performance tracking
    │   └── cot.py                 # CoTOutput: reasoning, output, confidence, agent_name, duration_ms
    │
    ├── schema/
    │   ├── auth_schema.py         # UserRegisterSchema, UserLoginSchema, UserResponseSchema
    │   ├── product_schema.py      # ProductResponse
    │   ├── employee_schema.py     # EngineerSchema, TeamCostEstimateSchema, HeadcountSummarySchema
    │   └── sales_schema.py        # SalesCase, CaseSummary, SummaryStats
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
    │   └── mock_rag.py            # Mock RAG for local dev/testing
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
```

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
- Only `users` collection is in MongoDB
- All agents must extend `BaseAgent` and return `CoTOutput`
- Never call Motor or LangSmith directly in agents — use injected deps
