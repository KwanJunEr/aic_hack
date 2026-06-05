"use client"

import { useState, useMemo } from "react"
import {
  Check,
  X,
  Pencil,
  Package,
  CheckCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Zap,
  Shield,
  Layers,
  GitBranch,
  Users,
  Brain,
  Loader2,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type {
  Stage2PipelineData,
} from "@/lib/stage2Api"

// ── Fallback display data (kept for when API data is unavailable) ──────────

interface ModuleDisplay {
  code: string
  name: string
  included: boolean
  price?: { monthly: number; annual: number }
  matchReason: string
  confidence: number
}

const FALLBACK_MODULES: ModuleDisplay[] = [
  {
    code: "WMS-CORE",
    name: "Core Warehouse Operations",
    included: true,
    matchReason: "Matches: inventory tracking, barcode scanning, multi-site management",
    confidence: 95,
  },
  {
    code: "WMS-YARD",
    name: "Yard Management",
    included: false,
    price: { monthly: 8800, annual: 95000 },
    matchReason: "Matches: 15+ dock doors, yard management requirement",
    confidence: 92,
  },
  {
    code: "WMS-ANALYTICS",
    name: "Advanced Analytics & BI",
    included: false,
    price: { monthly: 12400, annual: 133900 },
    matchReason: "Matches: labor productivity tracking, KPI reporting",
    confidence: 88,
  },
  {
    code: "WMS-3PL",
    name: "3PL Billing & Client Portal",
    included: false,
    price: { monthly: 11200, annual: 121000 },
    matchReason: "Not required: client is not a 3PL provider",
    confidence: 15,
  },
]

// ── Component props ───────────────────────────────────────────────────────

interface Props {
  data?: Stage2PipelineData | null
  hitlStatus: "pending" | "accepted" | "rejected" | "edited"
  isSubmitting?: boolean
  onAccept: () => void
  onReject: (reason?: string) => void
  onEdit: (userEdits: Record<string, unknown>, feedbackText?: string) => void
}

// ── Component ─────────────────────────────────────────────────────────────

export function ProductRecommendations({
  data,
  hitlStatus,
  isSubmitting,
  onAccept,
  onReject,
  onEdit,
}: Props) {
  const [expanded, setExpanded] = useState(true)
  const [editNote, setEditNote] = useState("")
  const [showEditInput, setShowEditInput] = useState(false)
  // Track user-deselected modules (by code)
  const [deselected, setDeselected] = useState<Set<string>>(new Set())

  // ── Derive display modules (API data → fallback) ───────────────────────
  const modules = useMemo<ModuleDisplay[]>(() => {
    const apiMods = data?.product_recommendations?.recommended_modules
    if (apiMods && apiMods.length > 0) {
      return apiMods.map((m) => ({
        code: m.module_code,
        name: m.name ?? m.module_code,
        included: m.module_code === "WMS-CORE",
        price:
          m.monthly_price != null
            ? { monthly: m.monthly_price, annual: m.annual_price ?? m.monthly_price * 12 }
            : undefined,
        matchReason: m.match_reason ?? "",
        confidence: m.confidence ?? 80,
      }))
    }
    return FALLBACK_MODULES
  }, [data?.product_recommendations?.recommended_modules])

  const displayModules = useMemo(
    () => modules.map((m) => ({ ...m, selected: m.included || !deselected.has(m.code) })),
    [modules, deselected],
  )

  const selectedModules = displayModules.filter((m) => m.selected)

  const toggleModule = (code: string) => {
    const mod = modules.find((m) => m.code === code)
    if (mod?.included) return
    setDeselected((prev) => {
      const next = new Set(prev)
      if (next.has(code)) next.delete(code)
      else next.add(code)
      return next
    })
  }

  // ── Derived agent outputs ─────────────────────────────────────────────
  const employees = data?.resource_allocation?.selected_employees ?? []
  const arch = data?.system_architecture
  const integration = data?.integration_plan
  const cotTraces = data?.cot_traces ?? []
  const productSummary = data?.product_recommendations?.recommendation_summary
  const archSummary = arch?.architecture_summary
  const integrationSummary = integration?.integration_summary
  const apiRoutes = integration?.api_routes ?? []

  // ── Edit submit helper ────────────────────────────────────────────────
  const submitEdit = () => {
    onEdit({}, editNote.trim() || undefined)
    setEditNote("")
    setShowEditInput(false)
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="recommendation">
        <TabsList className="mb-6 h-10 gap-1 bg-white/60 border border-border/50 rounded-xl shadow-sm backdrop-blur-sm p-1">
          <TabsTrigger
            value="recommendation"
            className="flex items-center gap-1.5 rounded-lg text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <Package className="h-3.5 w-3.5" />
            AI Decision &amp; Recommendation
          </TabsTrigger>
          <TabsTrigger
            value="architecture"
            className="flex items-center gap-1.5 rounded-lg text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <Layers className="h-3.5 w-3.5" />
            Product Architecture
          </TabsTrigger>
          <TabsTrigger
            value="integration"
            className="flex items-center gap-1.5 rounded-lg text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <GitBranch className="h-3.5 w-3.5" />
            Integration Flow
          </TabsTrigger>
        </TabsList>

        {/* ── Tab 1: AI Decision & Recommendation ─────────────────────── */}
        <TabsContent value="recommendation">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {/* AI Decision Trace */}
              <div className="rounded-2xl border border-white/20 bg-white/60 backdrop-blur-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg surface-violet">
                      <Zap className="h-4 w-4 text-violet-600" />
                    </div>
                    <h3 className="font-semibold text-foreground">AI Decision Trace</h3>
                  </div>
                  <button
                    onClick={() => setExpanded(!expanded)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                </div>

                {expanded && (
                  <div className="space-y-2 text-sm">
                    {productSummary ? (
                      <div className="flex items-start gap-2 text-emerald-600">
                        <CheckCircle className="h-4 w-4 mt-0.5 shrink-0" />
                        <span>{productSummary}</span>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 text-emerald-600">
                          <CheckCircle className="h-4 w-4" />
                          <span>Interpreted client requirement: Enterprise WMS with multi-site support</span>
                        </div>
                        <div className="flex items-center gap-2 text-emerald-600">
                          <CheckCircle className="h-4 w-4" />
                          <span>Queried catalog via Agentic RAG - matched 2 products</span>
                        </div>
                        <div className="flex items-center gap-2 text-emerald-600">
                          <CheckCircle className="h-4 w-4" />
                          <span>Selected Nexus WMS (highest compatibility: 94%)</span>
                        </div>
                        <div className="flex items-center gap-2 text-emerald-600">
                          <CheckCircle className="h-4 w-4" />
                          <span>Validated SAP S/4HANA integration compatibility</span>
                        </div>
                        <div className="flex items-center gap-2 text-amber-600">
                          <AlertTriangle className="h-4 w-4" />
                          <span>WMS-3PL module excluded - not applicable for direct operator</span>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Product card */}
              <div className="rounded-2xl border border-border/50 bg-card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
                      <Package className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Nexus WMS</h3>
                      <p className="text-sm text-muted-foreground">Warehouse Management System v7.4.2</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                    <CheckCircle className="h-3 w-3" />
                    Best Match
                  </span>
                </div>

                <p className="text-sm text-muted-foreground mb-4">
                  Enterprise-grade WMS for high-throughput, multi-site distribution operations. Supports your requirements for inventory tracking, barcode scanning, and SAP integration.
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs text-emerald-700">
                    <Check className="h-3 w-3" />SAP S/4HANA
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs text-emerald-700">
                    <Check className="h-3 w-3" />Multi-site
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs text-emerald-700">
                    <Check className="h-3 w-3" />Barcode/RFID
                  </span>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-foreground">Recommended Modules</h4>
                  {displayModules.map((module) => (
                    <div
                      key={module.code}
                      className={`rounded-xl border p-4 transition-all ${
                        module.selected
                          ? "border-rose-200 bg-rose-50/50"
                          : "border-border bg-muted/30"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => toggleModule(module.code)}
                            disabled={module.included}
                            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                              module.selected
                                ? "border-rose-400 bg-rose-400 text-white"
                                : "border-border bg-background"
                            } ${module.included ? "opacity-60 cursor-not-allowed" : "cursor-pointer hover:border-rose-300"}`}
                          >
                            {module.selected && <Check className="h-3 w-3" />}
                          </button>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-foreground">{module.name}</span>
                              {module.included && (
                                <span className="text-xs text-muted-foreground">(Included)</span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">{module.matchReason}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          {module.price ? (
                            <p className="text-sm font-medium text-foreground">
                              RM {module.price.monthly.toLocaleString()}/mo
                            </p>
                          ) : (
                            <p className="text-sm text-muted-foreground">Base</p>
                          )}
                          <div className="flex items-center gap-1 mt-1">
                            <div className="h-1.5 w-12 rounded-full bg-muted overflow-hidden">
                              <div
                                className={`h-full ${module.confidence > 70 ? "bg-emerald-500" : "bg-amber-500"}`}
                                style={{ width: `${module.confidence}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground">{module.confidence}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {data?.product_recommendations?.pricing_total_monthly && (
                  <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Monthly Total</span>
                    <span className="font-medium text-foreground">
                      RM {data.product_recommendations.pricing_total_monthly.toLocaleString()}/mo
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar — CoT summary */}
            <div className="lg:col-span-1 space-y-6">
              <div className="rounded-2xl border border-white/20 bg-white/60 backdrop-blur-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg surface-violet">
                    <Brain className="h-4 w-4 text-violet-600" />
                  </div>
                  <h3 className="font-semibold text-foreground">Chain of Thought</h3>
                </div>
                <div className="space-y-3">
                  {cotTraces.length > 0
                    ? cotTraces.slice(0, 2).map((trace, i) => (
                        <div key={i} className="rounded-xl bg-muted/40 p-3">
                          <p className="text-xs font-medium text-foreground mb-1 capitalize">
                            {trace.agent_name?.replace(/_/g, " ") ?? `Agent ${i + 1}`}
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-3">
                            {trace.reasoning ?? "Processing complete."}
                          </p>
                        </div>
                      ))
                    : (
                        <div className="rounded-xl bg-muted/40 p-3">
                          <p className="text-xs font-medium text-foreground mb-1">B1 Catalog RAG</p>
                          <p className="text-xs text-muted-foreground">
                            Analyzed requirements and matched WMS modules using semantic search across the product catalog.
                          </p>
                        </div>
                      )}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ── Tab 2: Product Architecture ──────────────────────────────── */}
        <TabsContent value="architecture">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {/* System Architecture diagram */}
              <div className="rounded-2xl border border-white/20 bg-white/60 backdrop-blur-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg brand-gradient">
                    <Layers className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground">System Architecture</h3>
                  {arch?.deployment_model && (
                    <span className="ml-auto text-xs rounded-full bg-violet-100 text-violet-700 px-2.5 py-0.5 capitalize">
                      {arch.deployment_model.replace(/_/g, " ")}
                    </span>
                  )}
                </div>

                {archSummary && (
                  <p className="text-sm text-muted-foreground mb-4">{archSummary}</p>
                )}

                <div className="relative py-4">
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-2xl brand-gradient flex items-center justify-center shadow-lg shadow-rose-500/25">
                        <div className="text-center text-white">
                          <Package className="h-6 w-6 mx-auto mb-1" />
                          <span className="text-xs font-medium">Nexus WMS</span>
                        </div>
                      </div>
                      <div className="absolute inset-0 rounded-2xl brand-gradient opacity-30 animate-ping" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {selectedModules.map((module) => (
                      <div key={module.code} className="relative">
                        <div className="absolute -top-3 left-1/2 w-px h-3 bg-gradient-to-b from-rose-300 to-transparent" />
                        <div
                          className={`rounded-xl border p-3 text-center transition-all ${
                            module.included
                              ? "border-emerald-200 bg-emerald-50"
                              : "border-rose-200 bg-rose-50"
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-lg mx-auto mb-2 flex items-center justify-center ${
                              module.included ? "bg-emerald-100" : "bg-rose-100"
                            }`}
                          >
                            <CheckCircle
                              className={`h-4 w-4 ${module.included ? "text-emerald-600" : "text-rose-600"}`}
                            />
                          </div>
                          <p className="text-xs font-medium text-foreground truncate">{module.code}</p>
                          <p className="text-[10px] text-muted-foreground truncate">
                            {module.name.split(" ")[0]}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border/50">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Connected Modules</span>
                    <span className="font-medium text-foreground">{selectedModules.length}</span>
                  </div>
                </div>
              </div>

              {/* Architecture components (from B3) */}
              {arch?.architecture_components && arch.architecture_components.length > 0 && (
                <div className="rounded-2xl border border-border/50 bg-card p-6">
                  <h4 className="text-sm font-medium text-foreground mb-3">Architecture Components</h4>
                  <div className="space-y-2">
                    {arch.architecture_components.map((comp, i) => (
                      <div key={i} className="flex items-start gap-3 rounded-xl bg-muted/40 p-3">
                        <div className="w-6 h-6 rounded bg-violet-100 flex items-center justify-center shrink-0 mt-0.5">
                          <Layers className="h-3 w-3 text-violet-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{comp.name}</p>
                          {comp.layer && (
                            <p className="text-xs text-muted-foreground">{comp.layer}</p>
                          )}
                          {comp.description && (
                            <p className="text-xs text-muted-foreground mt-0.5">{comp.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar — Human Resource Requirement */}
            <div className="lg:col-span-1 space-y-6">
              <div className="rounded-2xl border border-border/50 bg-card p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-foreground">Human Resource Requirements</h3>
                </div>

                {data?.resource_allocation?.team_summary && (
                  <p className="text-sm text-muted-foreground mb-4">
                    {data.resource_allocation.team_summary}
                  </p>
                )}

                <div className="space-y-3">
                  {employees.length > 0
                    ? employees.map((emp) => (
                        <div
                          key={emp.id}
                          className="rounded-xl border border-border/50 bg-muted/30 p-3"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-sm font-medium text-foreground">{emp.name}</p>
                              <p className="text-xs text-muted-foreground">{emp.role}</p>
                              {emp.seniority && (
                                <span className="mt-1 inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-600 capitalize">
                                  {emp.seniority}
                                </span>
                              )}
                              {emp.reason && (
                                <p className="text-xs text-muted-foreground mt-1">{emp.reason}</p>
                              )}
                            </div>
                            {emp.daily_rate_myr != null && (
                              <div className="text-right shrink-0">
                                <p className="text-xs font-medium text-foreground">
                                  {/* RM {emp.daily_rate_myr.toLocaleString()} */}
                                 RM {Math.max(300, Math.min(emp.daily_rate_myr, 300))} / day
                                </p>
                                <p className="text-[10px] text-muted-foreground">/day</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    : (
                        <>
                          <div className="rounded-xl border border-border/50 bg-muted/30 p-3">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="text-sm font-medium text-foreground">Senior WMS Engineer</p>
                                <p className="text-xs text-muted-foreground">Integration Lead</p>
                                <span className="mt-1 inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-600">
                                  Senior
                                </span>
                              </div>
                              <div className="text-right shrink-0">
                                <p className="text-xs font-medium text-foreground">RM 450</p>
                                <p className="text-[10px] text-muted-foreground">/day</p>
                              </div>
                            </div>
                          </div>
                          <div className="rounded-xl border border-border/50 bg-muted/30 p-3">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <p className="text-sm font-medium text-foreground">WMS Consultant</p>
                                <p className="text-xs text-muted-foreground">Implementation</p>
                                <span className="mt-1 inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-600">
                                  Mid
                                </span>
                              </div>
                              <div className="text-right shrink-0">
                                <p className="text-xs font-medium text-foreground">RM 265</p>
                                <p className="text-[10px] text-muted-foreground">/day</p>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                </div>

                <div className="mt-4 pt-4 border-t border-border/50 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Est. Project Days</span>
                    <span className="font-medium text-foreground">9d</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Resource Cost</span>
                    <span className="font-medium text-foreground">RM 12,000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ── Tab 3: Integration Flow ───────────────────────────────────── */}
        <TabsContent value="integration">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {/* Integration Flow diagram */}
              <div className="rounded-2xl border border-white/20 bg-white/60 backdrop-blur-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg surface-violet">
                    <GitBranch className="h-4 w-4 text-violet-600" />
                  </div>
                  <h3 className="font-semibold text-foreground">Integration Flow</h3>
                </div>

                {integrationSummary && (
                  <p className="text-sm text-muted-foreground mb-4">{integrationSummary}</p>
                )}

                <div className="space-y-4">
                  <div className="relative">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-blue-600">SAP</span>
                      </div>
                      <div className="flex-1">
                        <div className="h-1 bg-gradient-to-r from-blue-400 to-emerald-400 rounded-full" />
                      </div>
                      <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                        <Package className="h-4 w-4 text-emerald-600" />
                      </div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-[10px] text-muted-foreground">S/4HANA</span>
                      <span className="text-[10px] text-emerald-600">Real-time sync</span>
                      <span className="text-[10px] text-muted-foreground">WMS</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-2">
                    <div className="rounded-lg border border-border/50 bg-background p-2 text-center">
                      <div className="w-6 h-6 rounded bg-rose-100 mx-auto mb-1 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-rose-600">IN</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">Inbound</p>
                    </div>
                    <div className="rounded-lg border border-violet-200 bg-violet-50 p-2 text-center">
                      <div className="w-6 h-6 rounded bg-violet-100 mx-auto mb-1 flex items-center justify-center">
                        <Layers className="h-3 w-3 text-violet-600" />
                      </div>
                      <p className="text-[10px] text-violet-600 font-medium">Process</p>
                    </div>
                    <div className="rounded-lg border border-border/50 bg-background p-2 text-center">
                      <div className="w-6 h-6 rounded bg-emerald-100 mx-auto mb-1 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-emerald-600">OUT</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">Outbound</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-1 py-1">
                    <div className="w-4 h-px bg-border" />
                    <div className="w-2 h-2 rounded-full bg-rose-400" />
                    <div className="w-8 h-px bg-gradient-to-r from-rose-400 to-violet-400" />
                    <div className="w-2 h-2 rounded-full bg-violet-400" />
                    <div className="w-8 h-px bg-gradient-to-r from-violet-400 to-emerald-400" />
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <div className="w-4 h-px bg-border" />
                  </div>

                  {/* API endpoints — backend routes + hardcoded */}
                  <div className="rounded-lg border border-border/50 bg-muted/30 p-3">
                    <p className="text-xs font-medium text-foreground mb-2">API Endpoints</p>
                    <div className="space-y-1.5">
                      {apiRoutes.slice(0, 5).map((r, i) => (
                        <div key={`api-${i}`} className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                              r.method === "GET"
                                ? "bg-emerald-100 text-emerald-700"
                                : r.method === "POST"
                                ? "bg-blue-100 text-blue-700"
                                : r.method === "PUT"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {r.method}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-mono truncate">
                            {r.route}
                          </span>
                        </div>
                      ))}
                      {apiRoutes.length > 0 && (
                        <div className="my-1 border-t border-border/30" />
                      )}
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700">GET</span>
                        <span className="text-[10px] text-muted-foreground font-mono">/api/inventory/items</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700">GET</span>
                        <span className="text-[10px] text-muted-foreground font-mono">/api/inventory/locations</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">POST</span>
                        <span className="text-[10px] text-muted-foreground font-mono">/api/orders/inbound</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">POST</span>
                        <span className="text-[10px] text-muted-foreground font-mono">/api/orders/outbound</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">PUT</span>
                        <span className="text-[10px] text-muted-foreground font-mono">/api/orders/&#123;id&#125;/status</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700">GET</span>
                        <span className="text-[10px] text-muted-foreground font-mono">/api/warehouse/zones</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">POST</span>
                        <span className="text-[10px] text-muted-foreground font-mono">/api/sap/webhook/inventory-sync</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700">GET</span>
                        <span className="text-[10px] text-muted-foreground font-mono">/api/reports/daily-summary</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">POST</span>
                        <span className="text-[10px] text-muted-foreground font-mono">/api/warehouse/putaway</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700">GET</span>
                        <span className="text-[10px] text-muted-foreground font-mono">/api/warehouse/picking/tasks</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700">GET</span>
                        <span className="text-[10px] text-muted-foreground font-mono">/api/barcode/scan/&#123;barcode&#125;</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">POST</span>
                        <span className="text-[10px] text-muted-foreground font-mono">/api/receiving/dock/confirm</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700">GET</span>
                        <span className="text-[10px] text-muted-foreground font-mono">/api/stock/transfers</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-100 text-red-700">DEL</span>
                        <span className="text-[10px] text-muted-foreground font-mono">/api/orders/&#123;id&#125;/cancel</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Integration details */}
                <div className="mt-4 pt-4 border-t border-border/50 flex flex-wrap gap-4">
                  <div className="rounded-xl bg-muted/40 p-3">
                    <p className="text-xs text-muted-foreground">Complexity</p>
                    <p className="text-sm font-medium text-foreground capitalize">
                      {integration?.estimated_integration_complexity ?? "Medium"}
                    </p>
                  </div>
                  <div className="rounded-xl bg-muted/40 p-3 flex-1 min-w-[160px]">
                    <p className="text-xs text-muted-foreground mb-2">Timeline — 2 Months</p>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded bg-blue-100 flex items-center justify-center shrink-0">
                          <span className="text-[9px] font-bold text-blue-600">M1</span>
                        </div>
                        <span className="text-xs text-muted-foreground">Building &amp; Configuration</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded bg-violet-100 flex items-center justify-center shrink-0">
                          <span className="text-[9px] font-bold text-violet-600">M2</span>
                        </div>
                        <span className="text-xs text-muted-foreground">Monitoring &amp; Checking</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar — Full Chain of Thought */}
            <div className="lg:col-span-1 space-y-6">
              <div className="rounded-2xl border border-white/20 bg-white/60 backdrop-blur-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg surface-violet">
                    <Brain className="h-4 w-4 text-violet-600" />
                  </div>
                  <h3 className="font-semibold text-foreground">Full Chain of Thought</h3>
                </div>
                <div className="space-y-3">
                  {cotTraces.length > 0
                    ? cotTraces.map((trace, i) => (
                        <div key={i} className="rounded-xl bg-muted/40 p-3">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-xs font-medium text-foreground capitalize">
                              {trace.agent_name?.replace(/_/g, " ") ?? `Agent ${i + 1}`}
                            </p>
                            {trace.confidence != null && (
                              <span className="text-[10px] text-muted-foreground">
                                {Math.round(trace.confidence * 100)}%
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {trace.reasoning ?? "Processing complete."}
                          </p>
                          {trace.steps && trace.steps.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {trace.steps.map((step, si) => (
                                <div
                                  key={si}
                                  className="flex items-start gap-1.5 text-[10px] text-muted-foreground"
                                >
                                  <span className="shrink-0 font-medium">{step.step}.</span>
                                  <span>{step.thought}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))
                    : (
                        <>
                          {[
                            { name: "B1 Catalog RAG", text: "Analyzed requirements, retrieved WMS modules using semantic search." },
                            { name: "B2 Resource Matching", text: "Selected engineers based on WMS expertise and availability." },
                            { name: "B3 System Architecture", text: "Determined cloud SaaS deployment with API integration layer." },
                            { name: "B4 Integration Planning", text: "Mapped API routes and integration strategy with SAP S/4HANA." },
                          ].map((item) => (
                            <div key={item.name} className="rounded-xl bg-muted/40 p-3">
                              <p className="text-xs font-medium text-foreground mb-1">{item.name}</p>
                              <p className="text-xs text-muted-foreground">{item.text}</p>
                            </div>
                          ))}
                        </>
                      )}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* ── Global HITL Review — visible across all tabs ──────────────────── */}
      <div className="rounded-2xl border border-border/50 bg-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg surface-rose">
            <Shield className="h-4 w-4 text-rose-600" />
          </div>
          <h3 className="font-semibold text-foreground">Human Review Required</h3>
          {hitlStatus !== "pending" && (
            <span
              className={`ml-auto text-xs rounded-full px-2.5 py-0.5 capitalize font-medium ${
                hitlStatus === "accepted"
                  ? "bg-emerald-100 text-emerald-700"
                  : hitlStatus === "rejected"
                  ? "bg-red-100 text-red-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {hitlStatus}
            </span>
          )}
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          Review the AI recommendations above. Accept to save and unlock Stage 3, or provide
          feedback to re-run the pipeline.
        </p>

        {showEditInput && (
          <div className="mb-4">
            <textarea
              value={editNote}
              onChange={(e) => setEditNote(e.target.value)}
              placeholder="Describe what to change or improve..."
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-rose-300"
              rows={3}
            />
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            onClick={onAccept}
            disabled={isSubmitting || hitlStatus === "accepted"}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
              hitlStatus === "accepted"
                ? "bg-emerald-100 text-emerald-700 ring-2 ring-emerald-500"
                : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
            }`}
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            Accept
          </button>

          <button
            onClick={() => {
              if (showEditInput && editNote.trim()) {
                submitEdit()
              } else {
                setShowEditInput((v) => !v)
              }
            }}
            disabled={isSubmitting}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
              hitlStatus === "edited" || showEditInput
                ? "bg-amber-100 text-amber-700 ring-2 ring-amber-500"
                : "bg-amber-50 text-amber-600 hover:bg-amber-100"
            }`}
          >
            <Pencil className="h-4 w-4" />
            {showEditInput && editNote.trim()
              ? "Submit Edit"
              : hitlStatus === "edited"
              ? "Edited"
              : "Edit"}
          </button>

          <button
            onClick={() => onReject()}
            disabled={isSubmitting || hitlStatus === "rejected"}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
              hitlStatus === "rejected"
                ? "bg-red-100 text-red-700 ring-2 ring-red-500"
                : "bg-red-50 text-red-600 hover:bg-red-100"
            }`}
          >
            <X className="h-4 w-4" />
            Reject
          </button>
        </div>
      </div>
    </div>
  )
}
