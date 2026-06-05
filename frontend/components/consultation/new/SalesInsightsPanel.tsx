"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, HelpCircle, Lightbulb, RefreshCw, ShieldAlert } from "lucide-react"
import type { Stage1PipelineData, RequirementField } from "@/lib/stage1Api"

// ── Hardcoded fallbacks ───────────────────────────────────────────────────

const FALLBACK_MISSING = [
  "Budget flexibility: is it fixed or flexible?",
  "What legacy systems are currently in use?",
  "Who is the final decision maker?",
  "What is the procurement approval process?",
]

const FALLBACK_SUGGESTIONS = [
  "This appears to be an ERP integration opportunity",
  "Ask about existing infrastructure stack",
  "Potential upsell: analytics / reporting module",
  "High risk: unclear technical ownership",
]

// ── Helpers ───────────────────────────────────────────────────────────────

function fieldValue(field?: RequirementField): string {
  if (!field?.value && field?.value !== 0) return "Not specified"
  if (Array.isArray(field.value)) return field.value.join(", ")
  if (typeof field.value === "number") {
    const currency = field.currency ?? "RM"
    return `${currency} ${field.value.toLocaleString()}`
  }
  const str = String(field.value).trim()
  return str || "Not specified"
}

function buildMissingInfo(data: Stage1PipelineData | null | undefined): string[] | null {
  const questions = data?.gaps?.missing_questions
  if (!questions?.length) return null
  return questions.map((q) => {
    const prefix = q.urgency === "high" ? "[High] " : q.urgency === "medium" ? "[Medium] " : ""
    return `${prefix}${q.question}`
  })
}

function buildBudgetRisk(data: Stage1PipelineData | null | undefined) {
  const bv = data?.budget_validation
  if (!bv || !Object.keys(bv).length) return null
  return bv
}

// ── Component ─────────────────────────────────────────────────────────────

interface SalesInsightsPanelProps {
  data?: Stage1PipelineData | null
}

export function SalesInsightsPanel({ data }: SalesInsightsPanelProps) {
  const missingInfo = buildMissingInfo(data) ?? FALLBACK_MISSING
  const budgetRisk  = buildBudgetRisk(data)

  return (
    <div className="grid grid-cols-2 gap-6 ">
      {/* Budget Validator */}
      <Card className="border-0 bg-white/70 backdrop-blur-md shadow-xl shadow-amber-100/20">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center">
                <ShieldAlert className="h-4 w-4 text-amber-600" />
              </div>
              Budget Validator
            </CardTitle>
            <Badge className="bg-amber-100 text-amber-700 border border-amber-200 text-xs font-semibold">
              {budgetRisk?.risk_level
                ? String(budgetRisk.risk_level).toUpperCase()
                : "MEDIUM RISK"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {budgetRisk?.risk_explanation ? (
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
              <p className="text-sm font-semibold text-amber-700 mb-1">
                {String(budgetRisk.risk_level ?? "Risk")} — Budget Assessment
              </p>
              <p className="text-xs text-amber-600/80">{String(budgetRisk.risk_explanation)}</p>
            </div>
          ) : (
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
              <p className="text-sm font-semibold text-amber-700 mb-1">
                Budget Slightly Below Estimated Range
              </p>
              <p className="text-xs text-amber-600/80">
                The stated budget is close but may fall short of the full solution cost. Client
                indicated flexibility — worth confirming approval headroom before finalising the
                proposal.
              </p>
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between rounded-lg bg-white/80 border border-border p-3">
              <span className="text-sm text-muted-foreground">Client stated budget</span>
              <span className="font-semibold text-foreground">
                {budgetRisk?.client_budget
                  ? `RM ${Number(budgetRisk.client_budget).toLocaleString()}`
                  : fieldValue(data?.requirements?.budget) !== "Not specified"
                    ? fieldValue(data?.requirements?.budget)
                    : "RM 50,000"}
              </span>
            </div>
            {(budgetRisk?.estimated_range_min || budgetRisk?.estimated_range_max) && (
              <div className="flex items-center justify-between rounded-lg bg-white/80 border border-amber-200 p-3">
                <span className="text-sm text-muted-foreground">Estimated solution cost</span>
                <span className="font-semibold text-amber-600">
                  RM {Number(budgetRisk.estimated_range_min ?? 0).toLocaleString()} –{" "}
                  RM {Number(budgetRisk.estimated_range_max ?? 0).toLocaleString()} / yr
                </span>
              </div>
            )}
            {!budgetRisk?.estimated_range_min && (
              <div className="flex items-center justify-between rounded-lg bg-white/80 border border-amber-200 p-3">
                <span className="text-sm text-muted-foreground">Estimated solution cost</span>
                <span className="font-semibold text-amber-600">RM 80,000 – RM 150,000 / yr</span>
              </div>
            )}
            <div className="flex items-center justify-between rounded-lg bg-amber-50 border border-amber-300 p-3">
              <span className="text-sm font-medium text-amber-700">Potential gap</span>
              <span className="font-bold text-amber-700">
                {budgetRisk?.budget_gap
                  ? `~ RM ${Number(budgetRisk.budget_gap).toLocaleString()}`
                  : "~ RM 30,000"}
              </span>
            </div>
          </div>

          <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700">
              {budgetRisk?.recommendations &&
              Array.isArray(budgetRisk.recommendations) &&
              budgetRisk.recommendations.length > 0
                ? String(budgetRisk.recommendations[0])
                : "Confirm final CFO sign-off and consider a phased rollout option as a fallback."}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Missing Information */}
      <Card className="border-0 bg-white/70 backdrop-blur-md shadow-xl shadow-amber-100/20">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center">
                <HelpCircle className="h-4 w-4 text-amber-600" />
              </div>
              Missing Information To Ask
            </CardTitle>
            <Button variant="outline" size="sm" className="text-xs">
              <RefreshCw className="h-3 w-3 mr-1" />
              Generate more
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {missingInfo.map((item, index) => (
              <li key={index} className="flex items-start gap-3 rounded-lg bg-amber-50/50 p-3">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-200 text-xs font-medium text-amber-700">
                  {index + 1}
                </span>
                <span className="text-sm text-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* AI Sales Suggestions */}
      <Card className="border-0 bg-white/70 backdrop-blur-md shadow-xl shadow-violet-100/20">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-violet-100 flex items-center justify-center">
              <Lightbulb className="h-4 w-4 text-violet-600" />
            </div>
            AI Sales Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {FALLBACK_SUGGESTIONS.map((suggestion, index) => (
              <li
                key={index}
                className="flex items-center gap-3 rounded-lg bg-gradient-to-r from-violet-50/50 to-rose-50/50 p-3"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-violet-400 flex-shrink-0" />
                <span className="text-sm text-foreground">{suggestion}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
