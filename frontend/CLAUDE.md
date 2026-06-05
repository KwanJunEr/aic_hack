@AGENTS.md

# CLAUDE.md — Reqtify Frontend

## Project Overview

**Product**: Reqtify — AI Sales Agent Copilot for sales engineers  
**App title**: "Reqtify" (`app/layout.tsx`)  
**Stack**: Next.js 16 (App Router) · React 19 · TypeScript 5 · Tailwind CSS v4 · shadcn/ui  
**Backend**: FastAPI at `NEXT_PUBLIC_API_URL`, cookie-based auth (`credentials: "include"` on all fetches)

---

## Route Structure

```
app/
├── (auth)/           # Unauthenticated — no sidebar
│   ├── sign-in/
│   └── sign-up/
└── (main)/           # Authenticated — wraps in UserProvider + SidebarProvider
    ├── dashboard/
    ├── catalog/
    │   └── [id]/
    ├── team/
    ├── past_sales/
    │   └── [id]/
    ├── proposal/
    │   └── [id]/
    └── consult/
        ├── page.tsx          # Consultation list
        ├── new/              # Step 0: upload files
        └── [id]/
            ├── extraction/   # Step 1: requirements extraction (Stage 1 pipeline)
            ├── build/        # Step 2: catalog matching (Stage 2)
            └── proposal-create/  # Step 3: proposal generation (Stage 3)
```

---

## 3-Step Consultation Flow

### Step 0 — Upload (`/consult/new`)
- `useFileExtraction` hook (`lib/extractText.ts`)
- PDF/DOCX/TXT extracted **in-browser** (pdfjs-dist, mammoth)
- Audio (mp3/wav/ogg/flac/m4a/mp4) → POST `/upload/transcribe` (backend Whisper)
- All results → POST `/upload/sessions` → saved to MongoDB, returns `ExtractionSession` with `session_id`
- On success, navigates to `/consult/[session_id]/extraction`

### Step 1 — Requirements Extraction (`/consult/[id]/extraction`)
- Calls `runStage1({ transcript_id, user_id })` → POST `/pipeline/stage1/run`
- Shows `AiTimeline` while processing, tabs when done:
  - **Extraction & Readiness** — `ExtractedResults` + `DealReadinessCard`
  - **Sentiment & Urgency** — `SentimentUrgencyCard`
  - **Objections & Insights** — `ObjectionAnticipatorCard` + `ChainOfThoughtsCard`
  - **Sales Insights** — `SalesInsightsPanel`
- HITL review via `ReviewCard` (accept / edit / reject) → `confirmStage1`, `editStage1`, `rejectStage1`

### Step 2 — Catalog Matching (`/consult/[id]/build`)
- Shows `RequirementsSummary` (loaded from `getLatestSession`)
- Triggers `AiMatchingTimeline` then `ProductRecommendations`

### Step 3 — Proposal (`/consult/[id]/proposal-create`)
- `ProposalTimeline` → `HumanReview` → `ProposalDocument` + `SolutionSummary`

---

## Key Files

| File | Purpose |
|------|---------|
| `lib/extractText.ts` | `useFileExtraction` hook — full upload/transcription/session flow |
| `lib/stage1Api.ts` | Typed API client for all Stage 1 endpoints + shared types |
| `lib/common.ts` | `getInitials(name)` utility |
| `context/UserContext.tsx` | `UserProvider` + `useCurrentUser()` — fetches `/auth/me`, redirects to `/sign-in` on 401 |
| `app/(main)/layout.tsx` | Main shell: `UserProvider` > `SidebarProvider` > `AppSidebar` + `DashboardHeader` + `Toaster` |
| `app/layout.tsx` | Root: Geist fonts, `TooltipProvider` |

---

## Component Map

```
components/
├── ui/              shadcn primitives + 3d-globe, meteors, border-beam, background-beams-with-collision
├── landing/         LandingHeader, hero-section-with-gradient, About, Features, CTA, LandingFooter
├── main/            AppSidebar, DashboardHeader
├── catalog/         SolutionCard, SolutionListing
├── employees/       EmployeeCard, EmployeeFilter
├── past_sales/      CaseCard, CaseListing
└── consultation/
    ├── new/         UploadPanel, AITimeline, ExtractedResults, DealReadinessCard,
    │                ChainOfThoughtsCard, SentimentUrgencyCard, ObjectionAnticipatorCard,
    │                ReviewCard, SalesInsightsPanel
    ├── step2/       RequirementsSummary, AIMatchingTimeline, ProductRecommendations
    └── step3/       ProposalTimeline, HumanReview, ProposalDocument, SolutionSummary
```

---

## Dependencies Worth Knowing

```
next ^16.2.6        App Router, use(params) for async params
react 19.2.4        Concurrent features
tailwindcss ^4      New config format (postcss plugin, no tailwind.config.js)
framer-motion       Page/component animations
gsap ^3.15.0        Advanced animations
three + @react-three/fiber + @react-three/drei   3D globe in landing
recharts ^3.8.0     Charts in proposal/dashboard
pdfjs-dist ^5       Client-side PDF text extraction (worker at /pdf.worker.min.mjs)
mammoth ^1.12.0     Client-side DOCX text extraction
sonner ^2           Toast notifications — use toast.success/error from "sonner"
next-themes         Dark/light mode
```

---

## Env Vars

| Variable | Usage |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | Backend base URL — all fetches prefix with this |

---

## Key Conventions

- All `(main)` pages use `"use client"` — the layout itself is a client component
- Async route params use `use(params)` (Next.js 16 pattern), not `await params`
- All fetch calls include `credentials: "include"` to send auth cookie
- Toast notifications: `import { toast } from "sonner"` — never use `alert()`
- `brand-gradient` CSS class for the pink/rose accent gradient used on CTAs and icon backgrounds
- `useCurrentUser()` from `context/UserContext` to access the authenticated user

---

## Getting Started

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Lint
npm run lint
```
