"use client"

import { useState } from "react"
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
} from "lucide-react"

interface Module {
  code: string
  name: string
  included: boolean
  selected: boolean
  price?: { monthly: number; annual: number }
  matchReason: string
  confidence: number
}

const initialModules: Module[] = [
  {
    code: "WMS-CORE",
    name: "Core Warehouse Operations",
    included: true,
    selected: true,
    matchReason: "Matches: inventory tracking, barcode scanning, multi-site management",
    confidence: 95,
  },
  {
    code: "WMS-YARD",
    name: "Yard Management",
    included: false,
    selected: true,
    price: { monthly: 8800, annual: 95000 },
    matchReason: "Matches: 15+ dock doors, yard management requirement",
    confidence: 92,
  },
  {
    code: "WMS-ANALYTICS",
    name: "Advanced Analytics & BI",
    included: false,
    selected: true,
    price: { monthly: 12400, annual: 133900 },
    matchReason: "Matches: labor productivity tracking, KPI reporting",
    confidence: 88,
  },
  {
    code: "WMS-3PL",
    name: "3PL Billing & Client Portal",
    included: false,
    selected: false,
    price: { monthly: 11200, annual: 121000 },
    matchReason: "Not required: client is not a 3PL provider",
    confidence: 15,
  },
]

export function ProductRecommendations() {
  const [modules, setModules] = useState(initialModules)
  const [expanded, setExpanded] = useState(true)
  const [reviewStatus, setReviewStatus] = useState<"pending" | "accepted" | "edited">("pending")

  const toggleModule = (code: string) => {
    setModules((prev) =>
      prev.map((m) => (m.code === code && !m.included ? { ...m, selected: !m.selected } : m))
    )
    setReviewStatus("edited")
  }

  const selectedModules = modules.filter((m) => m.selected)

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Main panel - Product recommendation */}
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

          {/* Compatibility badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs text-emerald-700">
              <Check className="h-3 w-3" />
              SAP S/4HANA
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs text-emerald-700">
              <Check className="h-3 w-3" />
              Multi-site
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-xs text-emerald-700">
              <Check className="h-3 w-3" />
              Barcode/RFID
            </span>
          </div>

          {/* Modules */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Recommended Modules</h4>
            {modules.map((module) => (
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
        </div>

        {/* Human in the loop */}
        <div className="rounded-2xl border border-border/50 bg-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg surface-rose">
              <Shield className="h-4 w-4 text-rose-600" />
            </div>
            <h3 className="font-semibold text-foreground">Human Review Required</h3>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            Please review the AI recommendations above. You can toggle modules on/off before proceeding.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setReviewStatus("accepted")}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                reviewStatus === "accepted"
                  ? "bg-emerald-100 text-emerald-700 ring-2 ring-emerald-500"
                  : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
              }`}
            >
              <Check className="h-4 w-4" />
              Accept
            </button>
            <button
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                reviewStatus === "edited"
                  ? "bg-amber-100 text-amber-700 ring-2 ring-amber-500"
                  : "bg-amber-50 text-amber-600 hover:bg-amber-100"
              }`}
            >
              <Pencil className="h-4 w-4" />
              {reviewStatus === "edited" ? "Edited" : "Edit"}
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
              <X className="h-4 w-4" />
              Reject
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar - Two diagram cards */}
      <div className="lg:col-span-1 space-y-6">
        {/* System Architecture Diagram */}
        <div className="rounded-2xl border border-white/20 bg-white/60 backdrop-blur-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg brand-gradient">
              <Layers className="h-4 w-4 text-white" />
            </div>
            <h3 className="font-semibold text-foreground">System Architecture</h3>
          </div>

          {/* Visual diagram of connected modules */}
          <div className="relative py-4">
            {/* Central node */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl brand-gradient flex items-center justify-center shadow-lg shadow-rose-500/25">
                  <div className="text-center text-white">
                    <Package className="h-6 w-6 mx-auto mb-1" />
                    <span className="text-xs font-medium">Nexus WMS</span>
                  </div>
                </div>
                {/* Pulse animation */}
                <div className="absolute inset-0 rounded-2xl brand-gradient opacity-30 animate-ping" />
              </div>
            </div>

            {/* Connected modules */}
            <div className="grid grid-cols-2 gap-3">
              {selectedModules.map((module, index) => (
                <div key={module.code} className="relative">
                  {/* Connection line */}
                  <div 
                    className="absolute -top-3 left-1/2 w-px h-3 bg-gradient-to-b from-rose-300 to-transparent"
                  />
                  <div
                    className={`rounded-xl border p-3 text-center transition-all ${
                      module.included
                        ? "border-emerald-200 bg-emerald-50"
                        : "border-rose-200 bg-rose-50"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg mx-auto mb-2 flex items-center justify-center ${
                      module.included ? "bg-emerald-100" : "bg-rose-100"
                    }`}>
                      <CheckCircle className={`h-4 w-4 ${module.included ? "text-emerald-600" : "text-rose-600"}`} />
                    </div>
                    <p className="text-xs font-medium text-foreground truncate">{module.code}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{module.name.split(" ")[0]}</p>
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

        {/* Integration Flow Diagram */}
        <div className="rounded-2xl border border-white/20 bg-white/60 backdrop-blur-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg surface-violet">
              <GitBranch className="h-4 w-4 text-violet-600" />
            </div>
            <h3 className="font-semibold text-foreground">Integration Flow</h3>
          </div>

          {/* Technical integration diagram */}
          <div className="space-y-4">
            {/* SAP Integration */}
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

            {/* Data flow nodes */}
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

            {/* Connection arrows */}
            <div className="flex items-center justify-center gap-1 py-1">
              <div className="w-4 h-px bg-border" />
              <div className="w-2 h-2 rounded-full bg-rose-400" />
              <div className="w-8 h-px bg-gradient-to-r from-rose-400 to-violet-400" />
              <div className="w-2 h-2 rounded-full bg-violet-400" />
              <div className="w-8 h-px bg-gradient-to-r from-violet-400 to-emerald-400" />
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <div className="w-4 h-px bg-border" />
            </div>

            {/* API endpoints */}
            <div className="rounded-lg border border-border/50 bg-muted/30 p-3">
              <p className="text-xs font-medium text-foreground mb-2">API Endpoints</p>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700">GET</span>
                  <span className="text-[10px] text-muted-foreground font-mono">/api/inventory</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">POST</span>
                  <span className="text-[10px] text-muted-foreground font-mono">/api/orders</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">SYNC</span>
                  <span className="text-[10px] text-muted-foreground font-mono">/api/sap/webhook</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
