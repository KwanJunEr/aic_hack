"use client"

import {
  FileText, Target, Shield, Zap, DollarSign, Clock, MapPin,
  Wrench, AlertTriangle, List, Brain, TrendingUp, CheckCircle,
} from "lucide-react"
import type { Stage1SessionDocument, RequirementField } from "@/lib/stage1Api"

interface RequirementsSummaryProps {
  onAnalyze: () => void
  sessionData?: Stage1SessionDocument | null
  loading?: boolean
}

// ── Helpers ───────────────────────────────────────────────────────────────

function scoreToLabel(score: number | undefined | null): { label: string; color: string } {
  if (score == null) return { label: "N/A", color: "text-muted-foreground" }
  if (score <= 40)   return { label: "Low",    color: "text-red-600"     }
  if (score <= 80)   return { label: "Medium", color: "text-amber-600"   }
  return                    { label: "High",   color: "text-emerald-600" }
}

function riskToStyle(risk: string | undefined | null): { label: string; color: string } {
  const r = (risk ?? "").toUpperCase()
  if (r === "CRITICAL") return { label: "Critical", color: "text-red-700"        }
  if (r === "HIGH")     return { label: "High",     color: "text-red-600"        }
  if (r === "MEDIUM")   return { label: "Medium",   color: "text-amber-600"      }
  if (r === "LOW")      return { label: "Low",      color: "text-emerald-600"    }
  return                       { label: risk ?? "N/A", color: "text-muted-foreground" }
}

function sentimentStyle(sentiment: string | undefined): { color: string; bg: string } {
  const s = (sentiment ?? "").toLowerCase()
  if (s === "positive") return { color: "text-emerald-700", bg: "bg-emerald-50" }
  if (s === "negative") return { color: "text-red-700",     bg: "bg-red-50"     }
  if (s === "cautious") return { color: "text-amber-700",   bg: "bg-amber-50"   }
  return                       { color: "text-blue-700",    bg: "bg-blue-50"    }
}

function urgencyStyle(level: string | undefined): { color: string; bg: string } {
  const l = (level ?? "").toLowerCase()
  if (l === "high")   return { color: "text-red-700",     bg: "bg-red-50"     }
  if (l === "medium") return { color: "text-amber-700",   bg: "bg-amber-50"   }
  return                     { color: "text-emerald-700", bg: "bg-emerald-50" }
}

function fmtField(field: RequirementField | undefined): string {
  if (!field?.value && field?.value !== 0) return "Not specified"
  if (typeof field.value === "number")
    return `${field.currency ?? "RM"} ${field.value.toLocaleString()}`
  if (Array.isArray(field.value)) return field.value.join(", ")
  return String(field.value).trim() || "Not specified"
}

function detectIntent(data: Stage1SessionDocument | null | undefined): string {
  const goals = data?.requirements?.goals?.value
  if (!goals) return "Not detected"
  const str = Array.isArray(goals) ? goals[0] : String(goals)
  return str.length > 28 ? str.slice(0, 25) + "…" : str
}

// ── Color map ─────────────────────────────────────────────────────────────

const COLOR: Record<string, { bg: string; text: string; dot: string }> = {
  emerald: { bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-400" },
  blue:    { bg: "bg-blue-50",    text: "text-blue-600",    dot: "bg-blue-400"    },
  violet:  { bg: "bg-violet-50",  text: "text-violet-600",  dot: "bg-violet-400"  },
  indigo:  { bg: "bg-indigo-50",  text: "text-indigo-600",  dot: "bg-indigo-400"  },
  red:     { bg: "bg-red-50",     text: "text-red-600",     dot: "bg-red-400"     },
  rose:    { bg: "bg-rose-50",    text: "text-rose-600",    dot: "bg-rose-400"    },
  amber:   { bg: "bg-amber-50",   text: "text-amber-600",   dot: "bg-amber-400"   },
  slate:   { bg: "bg-slate-50",   text: "text-slate-600",   dot: "bg-slate-400"   },
}

// ── Component ─────────────────────────────────────────────────────────────

export function RequirementsSummary({ onAnalyze, sessionData, loading }: RequirementsSummaryProps) {
  const req       = sessionData?.requirements
  const pastDeals = sessionData?.past_deals
  const sentiment = sessionData?.sentiment

  const dealLabel     = scoreToLabel(pastDeals?.deal_readiness_score)
  const riskStyle     = riskToStyle(pastDeals?.risk_level)
  const confRaw       = pastDeals?.confidence
  const confScore     = confRaw != null && confRaw <= 1 ? Math.round(confRaw * 100) : confRaw
  const confLabel     = scoreToLabel(confScore)
  const completLabel  = scoreToLabel(pastDeals?.completeness)

  const sStyle = sentimentStyle(sentiment?.sentiment)
  const uStyle = urgencyStyle(sentiment?.urgency_level)

  const reqFields = req
    ? [
        {
          id: "budget", icon: DollarSign, label: "Budget", color: "emerald",
          value: req.budget?.value != null
            ? `${req.budget.currency ?? "RM"} ${Number(req.budget.value).toLocaleString()}`
            : "Not specified",
          confidence: req.budget?.confidence,
        },
        {
          id: "timeline", icon: Clock, label: "Timeline", color: "blue",
          value: fmtField(req.timeline), confidence: req.timeline?.confidence,
        },
        {
          id: "location", icon: MapPin, label: "Location", color: "violet",
          value: fmtField(req.location), confidence: req.location?.confidence,
        },
        {
          id: "technical", icon: Wrench, label: "Technical Requirements", color: "indigo",
          value: fmtField(req.technical_requirements), confidence: req.technical_requirements?.confidence,
        },
        {
          id: "constraints", icon: AlertTriangle, label: "Constraints", color: "red",
          value: fmtField(req.constraints), confidence: req.constraints?.confidence,
        },
        {
          id: "goals", icon: Target, label: "Goals", color: "rose",
          value: fmtField(req.goals), confidence: req.goals?.confidence,
        },
        {
          id: "key_points", icon: List, label: "Key Points", color: "amber",
          value: Array.isArray(req.key_points?.value)
            ? `${(req.key_points!.value as string[]).length} key points captured`
            : fmtField(req.key_points),
          confidence: req.key_points?.confidence,
          items: Array.isArray(req.key_points?.value)
            ? (req.key_points!.value as string[])
            : undefined,
        },
        {
          id: "summary", icon: FileText, label: "Summary", color: "slate",
          value: fmtField(req.summary), confidence: req.summary?.confidence,
        },
      ]
    : []

  if (loading) {
    return (
      <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 animate-pulse space-y-6">
        <div className="h-6 w-56 bg-muted rounded" />
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="rounded-xl bg-muted h-16" />
          ))}
        </div>
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-12 bg-muted rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">

        {/* Header */}
        <div className="flex items-center gap-2 mb-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg surface-rose">
            <FileText className="h-4 w-4 text-rose-600" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">Client Requirement Summary</h2>
        </div>

        {/* Metrics row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <div className="rounded-xl surface-violet p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Target className="h-3.5 w-3.5 text-violet-600" />
              <span className="text-xs text-muted-foreground">Detected Intent</span>
            </div>
            <p className="text-sm font-medium text-foreground leading-tight">Enterprise Systems </p>
          </div>

          <div className="rounded-xl surface-rose p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingUp className="h-3.5 w-3.5 text-rose-600" />
              <span className="text-xs text-muted-foreground">Deal Readiness</span>
            </div>
            <p className={`text-sm font-semibold ${dealLabel.color}`}>
              {dealLabel.label}
              {/* {pastDeals?.deal_readiness_score != null && (
                <span className="ml-1 text-xs font-normal text-muted-foreground">
                  ({pastDeals.deal_readiness_score})
                </span>
              )} */}
            </p>
          </div>

          <div className="rounded-xl surface-violet p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Shield className="h-3.5 w-3.5 text-violet-600" />
              <span className="text-xs text-muted-foreground">Risk Level</span>
            </div>
            <p className={`text-sm font-semibold ${riskStyle.color}`}>{riskStyle.label}</p>
          </div>

          <div className="rounded-xl surface-rose p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Zap className="h-3.5 w-3.5 text-rose-600" />
              <span className="text-xs text-muted-foreground">Confidence</span>
            </div>
            <p className={`text-sm font-semibold ${confLabel.color}`}>
              {confLabel.label}
              {/* {confScore != null && (
                <span className="ml-1 text-xs font-normal text-muted-foreground">({confScore})</span>
              )} */}
            </p>
          </div>

          <div className="rounded-xl surface-violet p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <CheckCircle className="h-3.5 w-3.5 text-violet-600" />
              <span className="text-xs text-muted-foreground">Completeness</span>
            </div>
            <p className={`text-sm font-semibold ${completLabel.color}`}>
              {completLabel.label}
              {/* {pastDeals?.completeness != null && (
                <span className="ml-1 text-xs font-normal text-muted-foreground">
                  ({pastDeals.completeness})
                </span>
              )} */}
            </p>
          </div>
        </div>

        {/* Extracted Requirements */}
        <div className="space-y-2 mb-6">
          <h3 className="text-sm font-medium text-foreground mb-3">Extracted Requirements</h3>
          {reqFields.length > 0 ? reqFields.map((field) => {
            const c = COLOR[field.color] ?? COLOR.slate
            const Icon = field.icon
            return (
              <div key={field.id} className={`rounded-xl p-3 ${c.bg}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5 flex-1 min-w-0">
                    <div className="h-7 w-7 rounded-lg bg-white/70 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className={`h-3.5 w-3.5 ${c.text}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground mb-0.5">{field.label}</p>
                      {field.items ? (
                        <ul className="space-y-1 mt-1">
                          {field.items.map((pt, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-foreground/80">
                              <span className={`h-1.5 w-1.5 rounded-full mt-1.5 flex-shrink-0 ${c.dot}`} />
                              {pt}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm font-medium text-foreground leading-snug">{field.value}</p>
                      )}
                    </div>
                  </div>
                  {field.confidence != null && (
                    <span className="flex-shrink-0 text-xs font-medium text-muted-foreground bg-white/70 rounded-full px-2 py-0.5">
                      {field.confidence}%
                    </span>
                  )}
                </div>
              </div>
            )
          }) : (
            <p className="text-sm text-muted-foreground">No requirements data available.</p>
          )}
        </div>

        {/* Sentiment */}
        {sentiment && (
          <div className="rounded-xl border border-border/50 bg-muted/30 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium text-foreground">Client Sentiment</h3>
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              {sentiment.sentiment && (
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${sStyle.bg} ${sStyle.color}`}>
                  {sentiment.sentiment}
                </span>
              )}
              {sentiment.urgency_level && (
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${uStyle.bg} ${uStyle.color}`}>
                  Urgency: {sentiment.urgency_level}
                  {sentiment.urgency_score != null && ` (${sentiment.urgency_score})`}
                </span>
              )}
            </div>
            {sentiment.sentiment_reasoning && (
              <p className="text-sm text-muted-foreground italic">
                &ldquo;{sentiment.sentiment_reasoning}&rdquo;
              </p>
            )}
          </div>
        )}
      </div>

      {/* Analyze button */}
      <div className="flex justify-center">
        <button
          onClick={onAnalyze}
          className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium text-white brand-gradient shadow-lg shadow-rose-500/25 hover:opacity-90 transition-opacity"
        >
          <Zap className="h-4 w-4" />
          Analyze &amp; Match Products
        </button>
      </div>
    </div>
  )
}
