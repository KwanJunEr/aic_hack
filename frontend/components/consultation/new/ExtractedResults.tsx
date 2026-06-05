"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DollarSign,
  Clock,
  MapPin,
  Target,
  AlertTriangle,
  Wrench,
  HelpCircle,
  Lightbulb,
  ExternalLink,
  RefreshCw,
  Check,
  Pencil,
  X,
  ShieldAlert,
} from "lucide-react"
import type { Stage1PipelineData, RequirementField } from "@/lib/stage1Api"

// ── Hardcoded fallback data ───────────────────────────────────────────────

const FALLBACK_EXTRACTED = [
  {
    id: "budget",
    icon: DollarSign,
    label: "Budget",
    value: "RM 220,000",
    confidence: 82,
    source: 'Client mentioned hoping to keep it under RM 220K to start, may have gone up due to new Johor site opening',
    color: "emerald",
  },
  {
    id: "timeline",
    icon: Clock,
    label: "Timeline",
    value: "3 months (before Q2)",
    confidence: 88,
    source: 'Need this deployed within 3 months, ideally before Q2 ends',
    color: "blue",
  },
  {
    id: "location",
    icon: MapPin,
    label: "Location",
    value: "Not specified",
    confidence: 0,
    source: "No location information detected in transcript",
    color: "gray",
  },
  {
    id: "technical",
    icon: Wrench,
    label: "Technical Requirements",
    value: "Oracle DB integration, low maintenance",
    confidence: 85,
    source: 'Running legacy Oracle databases that need to be integrated... easy to maintain',
    color: "violet",
  },
  {
    id: "constraints",
    icon: AlertTriangle,
    label: "Constraints",
    value: "Small IT team, legacy systems",
    confidence: 78,
    source: 'IT team is small... current system causing significant delays',
    color: "red",
  },
  {
    id: "goals",
    icon: Target,
    label: "Goals",
    value: "Replace current system, reduce delays",
    confidence: 81,
    source: 'Current system is causing significant delays',
    color: "rose",
  },
]

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

const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
  emerald: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200" },
  blue: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
  violet: { bg: "bg-violet-50", text: "text-violet-600", border: "border-violet-200" },
  red: { bg: "bg-red-50", text: "text-red-600", border: "border-red-200" },
  rose: { bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-200" },
  gray: { bg: "bg-gray-50", text: "text-gray-500", border: "border-gray-200" },
}

// ── Data mapping helpers ──────────────────────────────────────────────────

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

function buildExtractedItems(data: Stage1PipelineData | null | undefined) {
  const req = data?.requirements
  if (!req) return null

  return [
    {
      id: "budget",
      icon: DollarSign,
      label: "Budget",
      value: fieldValue(req.budget),
      confidence: req.budget?.confidence ?? 0,
      source: "AI extracted from transcript",
      color: "emerald",
    },
    {
      id: "timeline",
      icon: Clock,
      label: "Timeline",
      value: fieldValue(req.timeline),
      confidence: req.timeline?.confidence ?? 0,
      source: "AI extracted from transcript",
      color: "blue",
    },
    {
      id: "location",
      icon: MapPin,
      label: "Location",
      value: fieldValue(req.location),
      confidence: req.location?.confidence ?? 0,
      source: "AI extracted from transcript",
      color: "gray",
    },
    {
      id: "technical",
      icon: Wrench,
      label: "Technical Requirements",
      value: fieldValue(req.technical_requirements),
      confidence: req.technical_requirements?.confidence ?? 0,
      source: "AI extracted from transcript",
      color: "violet",
    },
    {
      id: "constraints",
      icon: AlertTriangle,
      label: "Constraints",
      value: fieldValue(req.constraints),
      confidence: req.constraints?.confidence ?? 0,
      source: "AI extracted from transcript",
      color: "red",
    },
    {
      id: "goals",
      icon: Target,
      label: "Goals",
      value: fieldValue(req.goals),
      confidence: req.goals?.confidence ?? 0,
      source: "AI extracted from transcript",
      color: "rose",
    },
  ]
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

function buildEditPrefill(data: Stage1PipelineData | null | undefined): string {
  const req = data?.requirements
  if (!req) return ""
  const lines: string[] = []
  if (req.budget) lines.push(`Budget: ${fieldValue(req.budget)}`)
  if (req.timeline) lines.push(`Timeline: ${fieldValue(req.timeline)}`)
  if (req.constraints) lines.push(`Constraints: ${fieldValue(req.constraints)}`)
  if (req.goals) lines.push(`Goals: ${fieldValue(req.goals)}`)
  if (req.technical_requirements) lines.push(`Technical: ${fieldValue(req.technical_requirements)}`)
  if (req.summary) lines.push(`\nSummary: ${fieldValue(req.summary)}`)
  return lines.join("\n")
}

// ── Component ─────────────────────────────────────────────────────────────

interface ExtractedResultsProps {
  data?: Stage1PipelineData | null
  onAccept?: () => void
  onEdit?: (additionalText: string) => void
  onReject?: () => void
  isSubmitting?: boolean
}

export function ExtractedResults({
  data,
  onAccept,
  onEdit,
  onReject,
  isSubmitting = false,
}: ExtractedResultsProps) {
  const [selectedField, setSelectedField] = useState<string | null>(null)
  const [editOpen, setEditOpen] = useState(false)
  const [editText, setEditText] = useState("")

  const extractedItems = buildExtractedItems(data) ?? FALLBACK_EXTRACTED
  const missingInfo = buildMissingInfo(data) ?? FALLBACK_MISSING
  const budgetRisk = buildBudgetRisk(data)

  function openEdit() {
    setEditText(buildEditPrefill(data))
    setEditOpen(true)
  }

  function submitEdit() {
    onEdit?.(editText)
    setEditOpen(false)
    setEditText("")
  }

  return (
    <div className="space-y-6">
      {/* Extracted Requirements Panel */}
      <Card className="border-0 bg-white/70 backdrop-blur-md shadow-xl shadow-rose-100/20">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Check className="h-4 w-4 text-emerald-600" />
            </div>
            Extracted Requirements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {extractedItems.map((item) => {
            const Icon = item.icon
            const colors = colorClasses[item.color]
            const isSelected = selectedField === item.id

            return (
              <div
                key={item.id}
                onClick={() => setSelectedField(isSelected ? null : item.id)}
                className={`rounded-xl p-4 border transition-all cursor-pointer ${
                  isSelected
                    ? `${colors.bg} ${colors.border}`
                    : "bg-white/50 border-border hover:border-rose-200"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`h-9 w-9 rounded-lg ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`h-4 w-4 ${colors.text}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                      <p className="font-semibold text-foreground mt-0.5">{item.value}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.confidence > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {item.confidence}%
                      </Badge>
                    )}
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                  </div>
                </div>

                {isSelected && (
                  <div className="mt-3 pt-3 border-t border-dashed border-current/20">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Source:</p>
                    <p className={`text-sm italic ${colors.text}`}>{`"${item.source}"`}</p>
                  </div>
                )}
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Budget Validator Panel */}
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
                    : "RM 220,000"}
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
                <span className="font-semibold text-amber-600">RM 195,000 – RM 250,000 / yr</span>
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
              {budgetRisk?.recommendations && Array.isArray(budgetRisk.recommendations) && budgetRisk.recommendations.length > 0
                ? String(budgetRisk.recommendations[0])
                : "Confirm final CFO sign-off and consider a phased rollout option as a fallback."}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Missing Information Panel */}
      <Card className="border-0 bg-white/70 backdrop-blur-md shadow-xl shadow-amber-100/20">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center">
                <HelpCircle className="h-4 w-4 text-amber-600" />
              </div>
              Missing Information
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

      {/* AI Suggestions Panel */}
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

      {/* Human-in-the-Loop Control */}
      <Card className="border-0 bg-gradient-to-r from-rose-50/80 to-violet-50/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <h4 className="font-semibold text-foreground mb-4">Review Before Proceeding</h4>

          {/* Edit textarea — hidden by default, shown on Edit click */}
          {editOpen && (
            <div className="mb-4 space-y-2">
              <p className="text-sm text-muted-foreground">
                Add corrections or additional context below. The pipeline will re-run with your
                input.
              </p>
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows={6}
                className="w-full rounded-lg border border-border bg-white/80 p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none"
                placeholder="Enter corrections or additional context…"
              />
              <div className="flex gap-2">
                <Button
                  onClick={submitEdit}
                  disabled={isSubmitting || !editText.trim()}
                  className="brand-gradient text-white border-0"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Submit Edits
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {!editOpen && (
            <div className="flex flex-wrap gap-3">
              <Button
                className="brand-gradient text-white border-0"
                onClick={onAccept}
                disabled={isSubmitting}
              >
                <Check className="h-4 w-4 mr-2" />
                Accept & Proceed
              </Button>
              <Button
                variant="outline"
                className="border-violet-200 hover:bg-violet-50"
                onClick={openEdit}
                disabled={isSubmitting}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit Manually
              </Button>
              <Button
                variant="outline"
                className="border-red-200 hover:bg-red-50 text-red-600"
                onClick={onReject}
                disabled={isSubmitting}
              >
                <X className="h-4 w-4 mr-2" />
                Reject & Re-run
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
