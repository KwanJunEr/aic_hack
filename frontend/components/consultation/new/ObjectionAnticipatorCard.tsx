"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, ChevronDown, ChevronUp, AlertCircle } from "lucide-react"
import type { Stage1PipelineData, Objection } from "@/lib/stage1Api"

// ── Hardcoded fallback ────────────────────────────────────────────────────

const FALLBACK_OBJECTIONS: Objection[] = [
  {
    category: "resource",
    objection: "Our IT team is too small to handle implementation.",
    likelihood: "high",
    counter_response:
      "We deploy with teams as small as 2 people. 90-day dedicated support is included in every package.",
    evidence: "A1 constraints=small IT team; A5 negative_signals=IT resistance",
  },
  {
    category: "technical",
    objection: "We are worried about Oracle DB compatibility.",
    likelihood: "high",
    counter_response:
      "Certified Oracle integration layer — 12 live deployments with zero data migration issues.",
    evidence: "A1 technical_requirements=Oracle DB integration",
  },
  {
    category: "budget",
    objection: "The full cost might exceed our allocation.",
    likelihood: "medium",
    counter_response:
      "Phased rollout keeps Phase 1 within RM 50k. Phase 2 can be scoped after the next budget cycle.",
    evidence: "A3 potential_gap=RM 30k; risk_level=medium",
  },
  {
    category: "procurement",
    objection: "We need CFO sign-off before committing.",
    likelihood: "medium",
    counter_response:
      "I can prepare a one-page CFO executive summary with ROI projections within 24 hours.",
    evidence: "A5 urgency_signals=CFO involvement",
  },
]

// ── Config maps ───────────────────────────────────────────────────────────

const CATEGORY_CONFIG: Record<string, { label: string; bg: string; text: string; border: string }> = {
  budget:      { label: "Budget",      bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200"  },
  technical:   { label: "Technical",   bg: "bg-violet-50",  text: "text-violet-700",  border: "border-violet-200" },
  resource:    { label: "Resource",    bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200"   },
  timeline:    { label: "Timeline",    bg: "bg-orange-50",  text: "text-orange-700",  border: "border-orange-200" },
  trust:       { label: "Trust",       bg: "bg-rose-50",    text: "text-rose-700",    border: "border-rose-200"   },
  procurement: { label: "Procurement", bg: "bg-slate-50",   text: "text-slate-700",   border: "border-slate-200"  },
}

const LIKELIHOOD_CONFIG: Record<string, { badge: string }> = {
  high:   { badge: "bg-red-100 text-red-800 border-red-200"           },
  medium: { badge: "bg-amber-100 text-amber-800 border-amber-200"     },
  low:    { badge: "bg-emerald-100 text-emerald-800 border-emerald-200"},
}

// ── Component ─────────────────────────────────────────────────────────────

interface ObjectionAnticipatorCardProps {
  data?: Stage1PipelineData | null
}

export function ObjectionAnticipatorCard({ data }: ObjectionAnticipatorCardProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const od = data?.objections
  const objections: Objection[] =
    od?.objections?.length ? od.objections : FALLBACK_OBJECTIONS

  const highestRisk = od?.highest_risk_objection ?? FALLBACK_OBJECTIONS[0].objection

  return (
    <Card className="border-0 bg-white/70 backdrop-blur-md shadow-xl shadow-rose-100/30 overflow-hidden">
      <div className="px-6 py-4 border-b border-border/50 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-rose-500" />
          <h3 className="font-semibold text-foreground text-sm">Objection Anticipator</h3>
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700">
            {objections.length} objection{objections.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Highest risk callout */}
        {highestRisk && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-3 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-red-700 mb-0.5">Highest Risk Objection</p>
              <p className="text-xs text-red-800">{highestRisk}</p>
            </div>
          </div>
        )}

        {/* Objection list */}
        {objections.map((obj, i) => {
          const isOpen = openIndex === i
          const catKey = (obj.category ?? "budget").toLowerCase()
          const likeKey = (obj.likelihood ?? "medium").toLowerCase()
          const cat = CATEGORY_CONFIG[catKey] ?? CATEGORY_CONFIG.budget
          const lik = LIKELIHOOD_CONFIG[likeKey] ?? LIKELIHOOD_CONFIG.medium

          return (
            <div
              key={i}
              className={`rounded-xl border transition-all duration-200 overflow-hidden ${cat.border} ${isOpen ? cat.bg : "bg-white/60"}`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex items-start justify-between px-4 py-3 text-left gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <Badge className={`text-xs border capitalize ${cat.text} ${cat.bg} ${cat.border}`}>
                      {cat.label}
                    </Badge>
                    <Badge className={`text-xs border capitalize ${lik.badge}`}>
                      {(obj.likelihood ?? "medium")} risk
                    </Badge>
                  </div>
                  <p className={`text-sm font-medium leading-snug ${cat.text}`}>
                    {obj.objection}
                  </p>
                </div>
                <div className="flex-shrink-0 mt-0.5">
                  {isOpen
                    ? <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    : <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  }
                </div>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 space-y-2.5">
                  <div className="rounded-lg bg-white/80 border border-border p-3">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Counter Response</p>
                    <p className="text-sm text-foreground leading-relaxed">{obj.counter_response}</p>
                  </div>
                  {obj.evidence && (
                    <p className="text-xs text-muted-foreground italic">
                      Evidence: {obj.evidence}
                    </p>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
