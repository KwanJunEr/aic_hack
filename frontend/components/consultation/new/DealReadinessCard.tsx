"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"
import type { Stage1PipelineData } from "@/lib/stage1Api"

// ── Hardcoded fallback ────────────────────────────────────────────────────

const FALLBACK_METRICS = [
  { label: "Requirements clarity", value: 78, color: "bg-emerald-500" },
  { label: "Stakeholder clarity", value: 45, color: "bg-amber-500" },
  { label: "Budget alignment", value: 85, color: "bg-emerald-500" },
  { label: "Technical feasibility", value: 72, color: "bg-emerald-500" },
]

const FALLBACK_SCORE = 74
const FALLBACK_RISK = "Medium"
const FALLBACK_CONFIDENCE = 87
const FALLBACK_COMPLETENESS = 72
const FALLBACK_RISK_EXPLANATION = "Unclear technical ownership and small IT team may affect implementation."

// ── Helpers ───────────────────────────────────────────────────────────────

function scoreColor(value: number) {
  if (value >= 70) return "bg-emerald-500"
  if (value >= 50) return "bg-amber-500"
  return "bg-red-500"
}

interface DealReadinessCardProps {
  data?: Stage1PipelineData | null
}

export function DealReadinessCard({ data }: DealReadinessCardProps) {
  const pd = data?.past_deals

  const overallScore = pd?.deal_readiness_score ?? FALLBACK_SCORE
  const riskLevel = pd?.risk_level
    ? String(pd.risk_level).charAt(0).toUpperCase() + String(pd.risk_level).slice(1).toLowerCase()
    : FALLBACK_RISK
  const riskExplanation = pd?.risk_explanation ?? FALLBACK_RISK_EXPLANATION
  const confidence = pd?.confidence ?? FALLBACK_CONFIDENCE
  const completeness = pd?.completeness ?? FALLBACK_COMPLETENESS
  const label = pd?.label ?? "Ready to proceed"

  const metrics = pd?.sub_scores
    ? [
        { label: "Requirements clarity", value: pd.sub_scores.requirements_clarity ?? 78, color: scoreColor(pd.sub_scores.requirements_clarity ?? 78) },
        { label: "Stakeholder clarity", value: pd.sub_scores.stakeholder_clarity ?? 45, color: scoreColor(pd.sub_scores.stakeholder_clarity ?? 45) },
        { label: "Budget alignment", value: pd.sub_scores.budget_alignment ?? 85, color: scoreColor(pd.sub_scores.budget_alignment ?? 85) },
        { label: "Technical feasibility", value: pd.sub_scores.technical_feasibility ?? 72, color: scoreColor(pd.sub_scores.technical_feasibility ?? 72) },
      ]
    : FALLBACK_METRICS

  const riskBadgeColor =
    riskLevel.toLowerCase() === "low"
      ? "bg-emerald-200 text-emerald-800"
      : riskLevel.toLowerCase() === "high" || riskLevel.toLowerCase() === "critical"
        ? "bg-red-200 text-red-800"
        : "bg-amber-200 text-amber-800"

  const riskBgColor =
    riskLevel.toLowerCase() === "low"
      ? "bg-emerald-50 border-emerald-200"
      : riskLevel.toLowerCase() === "high" || riskLevel.toLowerCase() === "critical"
        ? "bg-red-50 border-red-200"
        : "bg-amber-50 border-amber-200"

  const riskTextColor =
    riskLevel.toLowerCase() === "low"
      ? "text-emerald-800"
      : riskLevel.toLowerCase() === "high" || riskLevel.toLowerCase() === "critical"
        ? "text-red-800"
        : "text-amber-800"

  return (
    <Card className="border-0 bg-white/70 backdrop-blur-md shadow-xl shadow-rose-100/30 overflow-hidden">
      <div className="brand-gradient p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Deal Readiness</h3>
          <TrendingUp className="h-5 w-5 opacity-80" />
        </div>
        <div className="flex items-end gap-2">
          <span className="text-5xl font-bold">{overallScore}</span>
          <span className="text-2xl font-medium opacity-80 mb-1">%</span>
        </div>
        <p className="text-sm opacity-80 mt-1">{label}</p>
      </div>

      <CardContent className="p-6 space-y-5">
        <div className="space-y-4">
          {metrics.map((metric) => (
            <div key={metric.label}>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="text-muted-foreground">{metric.label}</span>
                <span className="font-medium text-foreground">{metric.value}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${metric.color}`}
                  style={{ width: `${metric.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className={`rounded-xl p-4 border ${riskBgColor}`}>
          <div className="flex items-center justify-between">
            <span className={`text-sm font-medium ${riskTextColor}`}>Risk Level</span>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${riskBadgeColor}`}>
              {riskLevel}
            </span>
          </div>
          <p className={`text-xs mt-2 ${riskTextColor} opacity-80`}>{riskExplanation}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-rose-50/50 p-3 text-center">
            <p className="text-2xl font-bold text-rose-600">{confidence}%</p>
            <p className="text-xs text-muted-foreground">Confidence</p>
          </div>
          <div className="rounded-lg bg-violet-50/50 p-3 text-center">
            <p className="text-2xl font-bold text-violet-600">{completeness}%</p>
            <p className="text-xs text-muted-foreground">Completeness</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
