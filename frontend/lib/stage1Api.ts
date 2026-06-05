const BASE = process.env.NEXT_PUBLIC_API_URL ?? ""

// ── Agent output shapes ───────────────────────────────────────────────────

export interface RequirementField {
  value: string | number | string[] | null
  confidence: number | null
  currency?: string
}

export interface Requirements {
  budget?: RequirementField
  timeline?: RequirementField
  location?: RequirementField
  technical_requirements?: RequirementField
  constraints?: RequirementField
  goals?: RequirementField
  key_points?: RequirementField
  summary?: RequirementField
}

export interface MissingQuestion {
  question: string
  urgency: "high" | "medium" | "low"
}

export interface GapData {
  missing_questions?: MissingQuestion[]
  requirements_clarity?: number
  stakeholder_clarity?: number
}

export interface BudgetValidation {
  risk_level?: string
  budget_alignment_score?: number
  risk_explanation?: string
  client_budget?: number
  estimated_range_min?: number
  estimated_range_max?: number
  budget_gap?: number
  recommendations?: string[]
  [key: string]: unknown
}

export interface SubScores {
  requirements_clarity?: number
  stakeholder_clarity?: number
  budget_alignment?: number
  technical_feasibility?: number
  timeline_realism?: number
}

export interface PastDeals {
  deal_readiness_score?: number
  label?: string
  sub_scores?: SubScores
  risk_level?: string
  risk_explanation?: string
  confidence?: number
  completeness?: number
  recommended_next_action?: string
}

export interface CotStep {
  step: number
  thought: string
  conclusion: string
}

export interface CotTrace {
  agent_name: string
  reasoning: string
  steps: CotStep[]
  output: Record<string, unknown>
  confidence: number
  duration_ms?: number | null
}

export interface Stage1PipelineData {
  requirements?: Requirements
  gaps?: GapData
  budget_validation?: BudgetValidation
  past_deals?: PastDeals
  sentiment?: Record<string, unknown>
  objections?: Record<string, unknown>
  cot_traces?: CotTrace[]
  session_id?: string
}

export interface Stage1ApiResponse {
  session_id: string
  status: string
  data?: Stage1PipelineData
  obstruction_detected?: boolean
  obstruction_reason?: string | null
  message?: string
}

// ── API helpers ───────────────────────────────────────────────────────────

async function post<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Request failed" }))
    throw new Error(err.detail ?? "Request failed")
  }
  return res.json()
}

// ── Stage 1 endpoints ─────────────────────────────────────────────────────

export function runStage1(body: {
  transcript_id?: string
  transcript?: string
  session_id?: string
  user_id: string
}): Promise<Stage1ApiResponse> {
  return post("/pipeline/stage1/run", body)
}

export function editStage1(body: {
  session_id: string
  user_edits?: Record<string, unknown>
  additional_text?: string
}): Promise<Stage1ApiResponse> {
  return post("/pipeline/stage1/edit", body)
}

export function rejectStage1(body: {
  session_id: string
  rejection_reason?: string
}): Promise<Stage1ApiResponse> {
  return post("/pipeline/stage1/reject", body)
}

export function confirmStage1(body: {
  session_id: string
}): Promise<Stage1ApiResponse> {
  return post("/pipeline/stage1/confirm", body)
}
