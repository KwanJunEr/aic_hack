# Autonomous Sales Engineer (ASE)

An AI-powered pre-sales proposal generation system built for enterprise software consultancies. Given a client meeting transcript (text, PDF, or audio), the system autonomously extracts requirements, matches product catalog SKUs, generates tiered proposals, and delivers a client-ready document — with Human-in-the-Loop (HITL) checkpoints at every critical decision point.

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Agent Pipeline](#agent-pipeline)
4. [Tech Stack](#tech-stack)
5. [System Requirements](#system-requirements)
6. [Repository Structure](#repository-structure)
7. [Environment Variables](#environment-variables)
8. [Installation](#installation)
   - [Backend Setup](#backend-setup)
   - [Frontend Setup](#frontend-setup)
9. [Running the Application](#running-the-application)
10. [API Reference](#api-reference)
11. [HITL Checkpoint Flow](#hitl-checkpoint-flow)
12. [Docker](#docker)
13. [Contributing](#contributing)

---

## System Overview

The Autonomous Sales Engineer replaces the manual, multi-hour process of producing sales proposals with a three-stage multi-agent pipeline. A Technical Sales Consultant (TSC) uploads a client meeting transcript, reviews two AI-generated checkpoints, and receives a completed, client-ready proposal — in under 15 minutes.

**Key capabilities:**

- Transcript ingestion: plain text, PDF, and audio (WAV/MP3 via Whisper STT)
- Automated requirement extraction with Chain-of-Thought (CoT) reasoning
- Agentic RAG catalog search using MCP vector tools
- Three-tier proposal generation: Premium, Standard, Budget
- Scoring and ranking of proposals across cost fit, risk, confidence, and margin
- Human-in-the-Loop approval gates at Steps 1 and 3
- Full LangSmith tracing for every agent call
- Append-only audit trail persisted in MongoDB

---

## Architecture

```
Client Transcript (text / PDF / audio)
           │
           ▼
┌─────────────────────────────────────────────────────┐
│  Step 1 · Requirement Analysis                      │
│                                                     │
│  ┌──────────────┐  ┌──────────────┐                │
│  │  Extraction  │→ │ Qualification│                 │
│  │   Agent      │  │   Agent      │                 │
│  │  Constraints │  │ Missing info │                 │
│  │  & risks     │  │    flags     │                 │
│  └──────────────┘  └──────────────┘                │
│         │                                           │
│  ┌──────────────┐  ┌──────────────┐                │
│  │   Budget     │→ │ Deal Scorer  │                 │
│  │  Validator   │  │  Readiness   │                 │
│  │Cost alignment│  │    score     │                 │
│  └──────────────┘  └──────────────┘                │
│                                                     │
│  ─────── HITL Checkpoint 1: Approve sales brief ──  │
└─────────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────┐
│  Step 2 · Catalog Match                             │
│                                                     │
│  ┌──────────────────┐  ┌────────────────────────┐  │
│  │  Catalog Search  │  │  Architecture Diagram  │  │
│  │     Agent        │  │        Agent           │  │
│  │  Agentic RAG /   │  │  Integration map /     │  │
│  │  Module selection│  │  API flow generation   │  │
│  └──────────────────┘  └────────────────────────┘  │
│                                                     │
│  ─────── HITL Checkpoint 2: Approve solution ─────  │
└─────────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────┐
│  Step 3 · Proposal Generation                       │
│                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────┐  │
│  │   Summary    │  │  Compliance  │  │ Pricing  │  │
│  │    Agent     │  │    Agent     │  │  Agent   │  │
│  │ Exec summary │  │ SOC2, GDPR,  │  │ Pricing  │  │
│  │ Scope of work│  │  ISO 27001   │  │breakdown │  │
│  └──────────────┘  └──────────────┘  └──────────┘  │
│                                                     │
│  ─────── HITL Checkpoint 3: Final approval ───────  │
└─────────────────────────────────────────────────────┘
           │
           ▼
     PDF Proposal — Client-ready export
```

---

## Agent Pipeline

| # | Agent | Stage | Responsibility |
|---|-------|-------|----------------|
| 1 | `ExtractionAgent` | Part 1 | Parses transcript (Whisper STT for audio), extracts client name, budget, timeline, technical specs, and constraints |
| 2 | `QualificationAgent` | Part 1 | Identifies information gaps, flags ambiguous requirements, generates HITL-1 clarification questions |
| 3 | `BudgetValidatorAgent` | Part 1 | Rule-based + LLM validation of budget feasibility; assigns risk level (LOW / MEDIUM / HIGH / CRITICAL) |
| 4 | `CatalogAgent` | Part 2 | Agentic RAG over the product SKU catalog using MCP vector search tools; returns ranked module recommendations |
| 5 | `CompatibilityAgent` | Part 2 | A2A call to `CatalogAgent` results; detects component conflicts, version clashes, integration gaps |
| 6 | `ProposalAgent` | Part 3 | Generates three proposal tiers (Premium / Standard / Budget) with full line-item breakdown |
| 7 | `ReviewAgent` | Part 3 | Scores and ranks all three proposals; pauses pipeline at HITL-2 with ranked comparison for TSC review |
| 8 | `RefinementAgent` | Part 3 | Re-optimizes proposals on TSC rejection; loops up to 3 iterations before auto-escalation |

Every agent extends `BaseAgent`, returns a `CoTOutput` (reasoning, output, confidence, duration_ms), and is traced automatically via LangSmith.

---

## Tech Stack

### Backend
| Layer | Technology |
|-------|-----------|
| Web framework | FastAPI 0.136+ |
| Language | Python 3.13 |
| Async DB driver | Motor (async MongoDB) |
| Agent framework | LangChain + LangGraph |
| Observability | LangSmith |
| MCP server | `mcp` (FastMCP) |
| Auth | JWT via `python-jose` + bcrypt |
| HTTP client | httpx |
| Retry logic | tenacity |
| Settings | pydantic-settings |
| Server | Uvicorn (standard) |

### Frontend
| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS v4 |
| UI components | shadcn/ui (New York style) + Radix UI |
| Charts | Recharts |
| 3D / animations | Three.js, @react-three/fiber, Framer Motion, GSAP |
| Document parsing | mammoth (DOCX), pdfjs-dist (PDF) |

### Infrastructure
| Component | Technology |
|-----------|-----------|
| Database | MongoDB (Atlas or self-hosted) |
| AI backbone | Claude (Anthropic API) + OpenAI (Whisper STT) |
| Tracing | LangSmith |
| Containerisation | Docker |

---

## System Requirements

| Requirement | Minimum |
|-------------|---------|
| Python | 3.13+ |
| Node.js | 20.x LTS or 22.x |
| npm | 10+ (bundled with Node 20+) |
| MongoDB | 7.0+ (local) or MongoDB Atlas free tier |
| uv (recommended) | latest — `pip install uv` |
| OS | macOS 13+, Ubuntu 22.04+, Windows 11 (WSL2 recommended) |
| RAM | 4 GB minimum, 8 GB recommended |
| Disk | 2 GB free (excludes Python venv packages) |

> **Windows note:** The backend runs best under WSL2. Native PowerShell is supported but Python 3.13 must be installed from python.org — the Microsoft Store version may not expose the correct executable.

---

## Repository Structure

```
aic_hack/
├── backend/                        # FastAPI + LangChain multi-agent backend
│   ├── app/
│   │   ├── main.py                 # FastAPI app factory + Uvicorn entry point
│   │   ├── api/
│   │   │   ├── router.py           # Master APIRouter — mounts all sub-routers
│   │   │   ├── auth_router.py      # POST /auth/register, /login, /logout, GET /auth/me
│   │   │   ├── product_router.py   # GET /products — catalog endpoint
│   │   │   ├── employee_router.py  # GET /employees — seeded employee data
│   │   │   └── sales_router.py     # GET /sales, /sales/id/{id} — consultation cases
│   │   ├── agents/
│   │   │   ├── base.py             # BaseAgent ABC: run() + _execute() contract
│   │   │   ├── orchestrator.py     # LangGraph-style pipeline: run_part1/2/3
│   │   │   ├── extraction.py       # Whisper STT + LLM requirement parser
│   │   │   ├── qualification.py    # Gap detector + HITL-1 question generator
│   │   │   ├── budget_validator.py # Rule-based + LLM budget risk scoring
│   │   │   ├── catalog.py          # Agentic RAG catalog search (MCP tools)
│   │   │   ├── compatibility.py    # A2A compatibility checker
│   │   │   ├── proposal.py         # 3-tier proposal generator
│   │   │   ├── review.py           # Proposal scorer + ranker
│   │   │   ├── refinement.py       # Rejection → re-optimisation loop
│   │   │   └── mock_rag.py         # In-memory RAG stub for local dev / tests
│   │   ├── models/
│   │   │   └── cot.py              # CoTOutput: reasoning, output, confidence, duration_ms
│   │   ├── mcp/
│   │   │   └── mcp_server.py       # FastMCP server (runs alongside Uvicorn)
│   │   ├── core/
│   │   │   ├── config.py           # Pydantic-settings: all env vars
│   │   │   ├── auth.py             # JWT decode middleware
│   │   │   └── security.py        # JWT create/verify, password hashing
│   │   ├── db/
│   │   │   ├── client.py           # Motor AsyncIOMotorClient factory
│   │   │   └── repositories/       # session, proposal, hitl, audit repositories
│   │   ├── services/               # Business logic layer (auth, product, sales…)
│   │   ├── schema/                 # Pydantic request/response schemas
│   │   └── store/                  # Seeded product / employee / sales data
│   ├── .env.example                # Template — copy to .env before running
│   ├── pyproject.toml              # Project metadata + Python dependencies
│   ├── requirements.txt            # pip-compatible dependency list
│   └── Dockerfile                  # Backend container image
│
├── frontend/                       # Next.js 16 App Router frontend
│   ├── app/
│   │   ├── (main)/
│   │   │   ├── dashboard/page.tsx  # KPI dashboard with charts
│   │   │   └── proposal/page.tsx   # Generated proposal viewer
│   │   └── layout.tsx
│   ├── components/
│   │   ├── consultation/           # Step-by-step consultation wizard components
│   │   ├── main/                   # Sidebar + shell layout
│   │   └── ui/                     # shadcn/ui primitives
│   ├── .env.example                # Template — copy to .env before running
│   ├── package.json
│   └── next.config.ts
│
└── README.md
```

---

## Environment Variables

### Backend — `backend/.env`

Copy `backend/.env.example` to `backend/.env` and fill in every value.

```dotenv
# ─────────────────────────────────────────────
# JWT Authentication
# ─────────────────────────────────────────────

# Secret used to sign and verify JWTs — use a long, random string in production
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Signing algorithm — HS256 is the default
JWT_ALGORITHM=HS256

# ─────────────────────────────────────────────
# MongoDB
# ─────────────────────────────────────────────

# Local MongoDB
mongo_url=mongodb://localhost:27017

# OR MongoDB Atlas (recommended for production)
# mongo_url=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority

# Name of the database this application uses
db_name=aic_hack

# ─────────────────────────────────────────────
# Anthropic / Claude API
# ─────────────────────────────────────────────

# Get your key at https://console.anthropic.com/
ANTHROPIC_API_KEY=sk-ant-api03-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Model to use for all LLM agent calls
ANTHROPIC_MODEL=claude-sonnet-4-6

# ─────────────────────────────────────────────
# OpenAI (used by Whisper STT for audio ingestion)
# ─────────────────────────────────────────────

# Get your key at https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-proj-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# ─────────────────────────────────────────────
# LangSmith Tracing (optional but recommended)
# ─────────────────────────────────────────────

# Sign up at https://smith.langchain.com/
LANGSMITH_API_KEY=lsv2_pt_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Project name visible in the LangSmith UI
LANGSMITH_PROJECT=aic-hack-dev

# Enable LangSmith tracing (set to "false" to disable in CI)
LANGCHAIN_TRACING_V2=true

# ─────────────────────────────────────────────
# CORS / Server
# ─────────────────────────────────────────────

# Frontend origin allowed by the CORS middleware
FRONTEND_URL=http://localhost:3000

# Port Uvicorn listens on
PORT=8000
```

### Frontend — `frontend/.env`

Copy `frontend/.env.example` to `frontend/.env` and fill in every value.

```dotenv
# ─────────────────────────────────────────────
# Backend API
# ─────────────────────────────────────────────

# Base URL of the FastAPI backend (no trailing slash)
NEXT_PUBLIC_API_URL=http://localhost:8000

# ─────────────────────────────────────────────
# App settings
# ─────────────────────────────────────────────

# Environment label shown in the UI (development | staging | production)
NEXT_PUBLIC_ENV=development
```

> **Never commit real API keys.** Both `.env` files are in `.gitignore`. Only the `.env.example` template files are tracked.

---

## Installation

### Prerequisites

1. **Python 3.13** — [python.org/downloads](https://www.python.org/downloads/)
2. **Node.js 20 LTS** — [nodejs.org](https://nodejs.org/)
3. **MongoDB** — [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community) or a free Atlas cluster
4. **uv** (Python package manager, faster than pip):
   ```bash
   pip install uv
   ```
   Or via the official installer:
   ```bash
   # macOS / Linux
   curl -LsSf https://astral.sh/uv/install.sh | sh
   # Windows (PowerShell)
   powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
   ```

---

### Backend Setup

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Create a virtual environment and install all dependencies
uv sync

# If you prefer plain pip:
# python -m venv .venv
# source .venv/bin/activate   # macOS/Linux
# .venv\Scripts\activate      # Windows
# pip install -r requirements.txt

# 3. Copy the environment template
cp .env.example .env        # macOS/Linux
copy .env.example .env      # Windows

# 4. Fill in your keys in backend/.env  (see Environment Variables above)

# 5. Verify MongoDB is running (local)
#    mongod --dbpath /your/data/path
#    OR connect to Atlas — just update mongo_url in .env

# 6. Start the development server
uv run python main.py
# OR with uvicorn directly:
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`.  
Interactive Swagger docs: `http://localhost:8000/docs`  
ReDoc: `http://localhost:8000/redoc`

The **MCP server** starts automatically alongside Uvicorn via `asyncio.gather()` in `main.py`.

---

### Frontend Setup

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install Node dependencies
npm install

# 3. Install shadcn/ui components (only needed once)
npx shadcn@latest init
npx shadcn@latest add button card badge dialog sheet progress separator skeleton tabs tooltip popover form input label textarea select alert scroll-area

# 4. Copy the environment template
cp .env.example .env        # macOS/Linux
copy .env.example .env      # Windows

# 5. Fill in NEXT_PUBLIC_API_URL in frontend/.env

# 6. Start the development server
npm run dev
```

The frontend will be available at `http://localhost:3000`.

---

## Running the Application

Start both services in separate terminal sessions:

**Terminal 1 — Backend**
```bash
cd backend
uv run python main.py
```

**Terminal 2 — Frontend**
```bash
cd frontend
npm run dev
```

Then open `http://localhost:3000` in your browser.

### Production builds

```bash
# Backend — run with Gunicorn (multi-worker) in production
pip install gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000

# Frontend — static production build
npm run build
npm run start
```

---

## API Reference

All backend routes are prefixed with the base URL (default `http://localhost:8000`).

### Authentication

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/auth/register` | Register a new TSC user account |
| `POST` | `/auth/login` | Login — sets `access_token` HTTP-only cookie |
| `POST` | `/auth/logout` | Clears the auth cookie |
| `GET` | `/auth/me` | Returns the currently authenticated user (JWT required) |

**Register request body:**
```json
{
  "email": "kumar@nexussales.com",
  "password": "SecurePassword123!",
  "full_name": "Mr Kumar"
}
```

**Login request body:**
```json
{
  "email": "kumar@nexussales.com",
  "password": "SecurePassword123!"
}
```

---

### Product Catalog

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/products` | List all seeded product SKUs available for proposals |
| `GET` | `/products/{id}` | Get a single product by ID |

---

### Sales Intelligence

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/sales` | List all consultation case records |
| `GET` | `/sales/id/{case_id}` | Get a specific consultation case |

---

### Pipeline — Proposal Generation

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/pipeline/start` | Start a new pipeline run with a transcript |
| `GET` | `/pipeline/{session_id}/status` | Poll pipeline status |
| `GET` | `/pipeline/{session_id}/result` | Retrieve the final approved proposal (status must be `completed`) |

**Start pipeline request body:**
```json
{
  "transcript": "Client mentioned they need a WMS solution for 5 warehouse sites...",
  "source_type": "text"
}
```

**Pipeline status values:**

| Status | Meaning |
|--------|---------|
| `pending` | Session created, not yet started |
| `part1_running` | Extraction → Qualification → Budget Validation in progress |
| `awaiting_hitl_1` | Part 1 complete — awaiting TSC approval at Checkpoint 1 |
| `part2_running` | Catalog search + compatibility check in progress |
| `part3_running` | Proposal generation in progress |
| `awaiting_hitl_2` | Proposals ready — awaiting TSC approval at Checkpoint 2 |
| `refining` | TSC rejected proposals — Refinement Agent re-optimising |
| `completed` | TSC approved — proposal finalised |
| `escalated` | Escalated to senior manager after max refinement iterations |
| `failed` | Unrecoverable agent error |

---

### HITL Checkpoints

All HITL routes require a valid `access_token` cookie.

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/hitl/{session_id}/checkpoint-1` | Retrieve extracted requirements for TSC review |
| `POST` | `/hitl/{session_id}/checkpoint-1` | Approve / reject / modify the extracted requirements |
| `GET` | `/hitl/{session_id}/checkpoint-2` | Retrieve ranked proposals for TSC review |
| `POST` | `/hitl/{session_id}/checkpoint-2` | Approve, reject, or escalate the proposals |

**Checkpoint 1 approval body:**
```json
{
  "decision": "approved",
  "modifications": {
    "budget_max": 450000,
    "timeline_days": 120
  }
}
```

**Checkpoint 2 approval body:**
```json
{
  "decision": "approved",
  "selected_tier": "standard"
}
```

**Checkpoint 2 rejection body:**
```json
{
  "decision": "rejected",
  "rejection_reason": "Standard tier is over budget — please reduce component count",
  "overrides": {
    "remove_skus": ["WMS-3PL"]
  }
}
```

---

### Health Check

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/` | Root — confirms backend is running |
| `GET` | `/health` | Health check — returns `{"status": "healthy"}` |

---

## HITL Checkpoint Flow

The pipeline does **not** block on human review. It suspends itself by writing status to MongoDB and releasing the background worker. The frontend polls `/pipeline/{id}/status` until a checkpoint is reached.

```
┌─────────────────────────────────────────────────────────────┐
│  Part 1 completes (Extraction → Qualification → Budget)     │
│  → status set to "awaiting_hitl_1"                         │
│  → background task ends, server is non-blocking            │
└───────────────────────┬─────────────────────────────────────┘
                        │
         Frontend polls status every 2 s
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  TSC reviews requirements at GET /hitl/{id}/checkpoint-1    │
│  TSC POSTs approval to POST /hitl/{id}/checkpoint-1         │
│  → status set to "part2_running"                           │
│  → Part 2 background task spawned                          │
└───────────────────────┬─────────────────────────────────────┘
                        │
                  (same pattern)
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│  Part 3 completes (Proposal → Review)                       │
│  → status set to "awaiting_hitl_2"                         │
│  TSC reviews ranked proposals at GET /hitl/{id}/checkpoint-2│
│  TSC approves → status = "completed"                       │
│  TSC rejects  → RefinementAgent loops (max 3 iterations)   │
│  TSC escalates → status = "escalated"                      │
└─────────────────────────────────────────────────────────────┘
```

> **Production note:** `BackgroundTasks` (FastAPI built-in) does not survive process restarts. Before multi-instance deployment, replace with Celery + Redis. The interface remains identical — only the task dispatch mechanism changes.

---

## Docker

### Backend only

```dockerfile
# backend/Dockerfile
FROM python:3.13-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

```bash
docker build -t ase-backend ./backend
docker run -p 8000:8000 --env-file backend/.env ase-backend
```

### Full stack with Docker Compose

Create a `docker-compose.yml` in the project root:

```yaml
version: "3.9"

services:
  mongo:
    image: mongo:7
    restart: always
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  backend:
    build: ./backend
    restart: always
    ports:
      - "8000:8000"
    env_file: ./backend/.env
    environment:
      - mongo_url=mongodb://mongo:27017
    depends_on:
      - mongo

  frontend:
    build:
      context: ./frontend
      args:
        - NEXT_PUBLIC_API_URL=http://backend:8000
    restart: always
    ports:
      - "3000:3000"
    depends_on:
      - backend

volumes:
  mongo_data:
```

```bash
docker compose up --build
```

---

## MongoDB Collections Reference

| Collection | Purpose |
|------------|---------|
| `sessions` | Top-level pipeline state per run; holds `status`, part outputs, error |
| `requirements` | Extracted + validated requirements per session |
| `proposals` | Three versioned tier proposals per session |
| `hitl_decisions` | One decision record per checkpoint per session |
| `audit_trail` | Append-only event log — never updated or deleted |

All collections use `session_id` (UUID4 string) as the cross-collection foreign key.

---

## LangSmith Tracing

Every agent call is wrapped with a LangSmith trace automatically via `BaseAgent.run()`. No agent imports LangSmith directly.

To view traces:

1. Set `LANGSMITH_API_KEY` and `LANGCHAIN_TRACING_V2=true` in `backend/.env`
2. Set a project name with `LANGSMITH_PROJECT=aic-hack-dev`
3. Open [smith.langchain.com](https://smith.langchain.com/) and navigate to your project

Each trace shows the full CoT reasoning, confidence score, input/output payload, and duration for every agent in the pipeline.

---

## Development Tips

### Running agents standalone (no server needed)

```python
import asyncio
from app.agents.orchestrator import OrchestratorAgent

async def demo():
    orchestrator = OrchestratorAgent(session_id="demo-001")
    state = await orchestrator.run_full_pipeline(
        transcript="Client needs a WMS for 5 sites, budget MYR 500k, go-live in 90 days.",
        auto_approve_hitl=True,
    )
    print(state.status)          # "completed"
    print(state.proposal_output) # full 3-tier proposals

asyncio.run(demo())
```

### Seeding the database

```bash
cd backend
uv run python -m app.core.seeds.product_loader
uv run python -m app.core.seeds.employee_loader
uv run python -m app.core.seeds.sales_loader
```

### Linting and type-checking

```bash
# Backend
cd backend
uv run mypy app/

# Frontend
cd frontend
npm run lint
npx tsc --noEmit
```

---

## Contributing

1. Fork the repository and create a feature branch: `git checkout -b feature/my-feature`
2. Make changes — run impact analysis via GitNexus before editing any symbol (see `CLAUDE.md`)
3. Test locally: backend health check + frontend `npm run build` must pass
4. Open a pull request against `main` with a clear description of what changed and why

---

## License

This project was built for the AIC Hackathon. All rights reserved.
