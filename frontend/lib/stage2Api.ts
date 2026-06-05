const BASE = process.env.NEXT_PUBLIC_API_URL ?? ""

// ── Stage 2 output types ──────────────────────────────────────────────────

export interface Stage2Module {
  module_code: string
  name?: string
  description?: string
  monthly_price?: number
  annual_price?: number
  match_reason?: string
  confidence?: number
}

export interface Stage2Employee {
  id: string
  name: string
  role: string
  seniority?: string
  daily_rate_myr?: number
  reason?: string
  status?: string
  specialisation?: string[]
  wms_modules?: string[]
}

export interface Stage2ArchComponent {
  name: string
  layer?: string
  description?: string
}

export interface Stage2IntegrationTouchpoint {
  system: string
  type?: string
  description?: string
}

export interface Stage2ApiRoute {
  route: string
  method: string
  description?: string
  integration_target?: string
  auth?: string
  data_format?: string
}

export interface Stage2ProductRecommendations {
  recommended_modules?: Stage2Module[]
  recommendation_summary?: string
  pricing_total_monthly?: number
  pricing_total_annual?: number
  [key: string]: unknown
}

export interface Stage2ResourceAllocation {
  selected_employees?: Stage2Employee[]
  team_summary?: string
  estimated_project_days?: number
  estimated_resource_cost_myr?: number
  [key: string]: unknown
}

export interface Stage2SystemArchitecture {
  deployment_model?: string
  selected_modules?: Stage2Module[]
  architecture_components?: Stage2ArchComponent[]
  integration_touchpoints?: Stage2IntegrationTouchpoint[]
  security_compliance?: string[]
  sla?: Record<string, unknown>
  scalability_notes?: string
  architecture_summary?: string
  [key: string]: unknown
}

export interface Stage2IntegrationPlan {
  api_routes?: Stage2ApiRoute[]
  integration_strategy?: Record<string, unknown>
  best_practices?: Record<string, unknown>
  estimated_integration_complexity?: string
  integration_timeline_weeks?: number
  integration_summary?: string
  [key: string]: unknown
}

export interface Stage2CotTrace {
  agent_name?: string
  reasoning?: string
  steps?: Array<{ step: number; thought: string; conclusion: string }>
  confidence?: number
  duration_ms?: number | null
}

export interface Stage2PipelineData {
  session_id?: string
  product_recommendations?: Stage2ProductRecommendations
  resource_allocation?: Stage2ResourceAllocation
  system_architecture?: Stage2SystemArchitecture
  integration_plan?: Stage2IntegrationPlan
  cot_traces?: Stage2CotTrace[]
  improvement_suggestions?: string[]
  hitl_decision?: string
  stage2_saved?: boolean
}

export interface Stage2ApiResponse {
  session_id: string
  status: string
  data?: Stage2PipelineData
  message?: string
  improvement_suggestions?: string[]
}

// ── helpers ───────────────────────────────────────────────────────────────

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

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { credentials: "include" })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Request failed" }))
    throw new Error(err.detail ?? "Request failed")
  }
  return res.json()
}

// ── Stage 2 endpoints ─────────────────────────────────────────────────────

export function runStage2(body: {
  user_id: string
  session_id?: string
  stage1_session_id?: string
  stage1_result?: Record<string, unknown>
  combined_text?: string
}): Promise<Stage2ApiResponse> {
  return post("/pipeline/stage2/run", body)
}

export function acceptStage2(body: {
  session_id: string
}): Promise<Stage2ApiResponse> {
  return post("/pipeline/stage2/accept", body)
}

export function rejectStage2(body: {
  session_id: string
  rejection_reason?: string
}): Promise<Stage2ApiResponse> {
  return post("/pipeline/stage2/reject", body)
}

export function editStage2(body: {
  session_id: string
  user_edits?: Record<string, unknown>
  feedback_text?: string
}): Promise<Stage2ApiResponse> {
  return post("/pipeline/stage2/edit", body)
}

export function getStage2Session(sessionId: string): Promise<Stage2ApiResponse> {
  return get(`/pipeline/stage2/session/${sessionId}`)
}
