"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Zap, ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react"
import type { Stage1PipelineData, SentimentData } from "@/lib/stage1Api"

// ── Hardcoded fallback ────────────────────────────────────────────────────

const FALLBACK: SentimentData = {
  sentiment: "cautious",
  sentiment_reasoning:
    "Client is interested but concerned about implementation complexity and team capacity.",
  urgency_level: "high",
  urgency_score: 78,
  urgency_signals: [
    "Hard deadline: before Q2",
    "CFO involvement suggests budget scrutiny",
    "Current system causing significant delays",
  ],
  deal_pressure: "medium-high",
  negative_signals: ["Small IT team may resist change", "Legacy system complexity"],
  positive_signals: ["Budget already allocated", "Strong executive sponsorship"],
  recommended_tone:
    "Reassuring — lead with phased plan and 90-day support commitment.",
}

// ── Config maps ───────────────────────────────────────────────────────────

const SENTIMENT_CONFIG: Record<string, { label: string; emoji: string; bar: string; badge: string }> = {
  positive: { label: "Positive",  emoji: "😊", bar: "bg-emerald-500", badge: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  neutral:  { label: "Neutral",   emoji: "😐", bar: "bg-blue-500",    badge: "bg-blue-100 text-blue-800 border-blue-200"          },
  cautious: { label: "Cautious",  emoji: "🤔", bar: "bg-amber-500",   badge: "bg-amber-100 text-amber-800 border-amber-200"       },
  negative: { label: "Negative",  emoji: "😟", bar: "bg-red-500",     badge: "bg-red-100 text-red-800 border-red-200"             },
}

const URGENCY_CONFIG: Record<string, { label: string; bar: string; badge: string }> = {
  critical: { label: "Critical", bar: "bg-red-500",     badge: "bg-red-100 text-red-800 border-red-200"           },
  high:     { label: "High",     bar: "bg-orange-500",  badge: "bg-orange-100 text-orange-800 border-orange-200"  },
  medium:   { label: "Medium",   bar: "bg-amber-500",   badge: "bg-amber-100 text-amber-800 border-amber-200"     },
  low:      { label: "Low",      bar: "bg-emerald-500", badge: "bg-emerald-100 text-emerald-800 border-emerald-200"},
}

// ── Component ─────────────────────────────────────────────────────────────

interface SentimentUrgencyCardProps {
  data?: Stage1PipelineData | null
}

export function SentimentUrgencyCard({ data }: SentimentUrgencyCardProps) {
  const s: SentimentData = data?.sentiment && Object.keys(data.sentiment).length ? data.sentiment : FALLBACK

  const sentimentKey = (s.sentiment ?? "cautious").toLowerCase()
  const urgencyKey   = (s.urgency_level ?? "high").toLowerCase()

  const sentimentCfg = SENTIMENT_CONFIG[sentimentKey] ?? SENTIMENT_CONFIG.cautious
  const urgencyCfg   = URGENCY_CONFIG[urgencyKey]     ?? URGENCY_CONFIG.medium

  const urgencyScore    = s.urgency_score ?? 0
  const urgencySignals  = s.urgency_signals ?? []
  const positiveSignals = s.positive_signals ?? []
  const negativeSignals = s.negative_signals ?? []

  return (
    <div className="space-y-5">
      {/* ── Sentiment & Urgency overview ─── */}
      <Card className="border-0 bg-white/70 backdrop-blur-md shadow-xl shadow-rose-100/30 overflow-hidden">
        <div className="brand-gradient p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Sentiment Analysis</h3>
            <TrendingUp className="h-5 w-5 opacity-80" />
          </div>
          <div className="flex items-end gap-3">
            <span className="text-5xl">{sentimentCfg.emoji}</span>
            <div className="mb-1">
              <p className="text-2xl font-bold">{sentimentCfg.label}</p>
              <p className="text-sm opacity-80">Deal pressure: {s.deal_pressure ?? "—"}</p>
            </div>
          </div>
        </div>

        <CardContent className="p-6 space-y-5">
          {/* Sentiment reasoning */}
          {s.sentiment_reasoning && (
            <p className="text-sm text-muted-foreground italic leading-relaxed">
              &ldquo;{s.sentiment_reasoning}&rdquo;
            </p>
          )}

          {/* Urgency */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium text-foreground">Urgency Level</span>
              </div>
              <Badge className={`text-xs font-semibold border ${urgencyCfg.badge}`}>
                {urgencyCfg.label}
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2.5 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${urgencyCfg.bar}`}
                  style={{ width: `${urgencyScore}%` }}
                />
              </div>
              <span className="text-sm font-bold text-foreground w-10 text-right">{urgencyScore}</span>
            </div>
          </div>

          {/* Urgency signals */}
          {urgencySignals.length > 0 && (
            <div className="rounded-xl bg-orange-50 border border-orange-200 p-4 space-y-2">
              <p className="text-xs font-semibold text-orange-700 uppercase tracking-wide">Urgency Signals</p>
              <ul className="space-y-1.5">
                {urgencySignals.map((signal, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-orange-800">
                    <span className="h-1.5 w-1.5 rounded-full bg-orange-400 mt-1.5 flex-shrink-0" />
                    {signal}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Positive / Negative signals */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 space-y-2">
              <div className="flex items-center gap-1.5">
                <ThumbsUp className="h-3.5 w-3.5 text-emerald-600" />
                <p className="text-xs font-semibold text-emerald-700">Positive</p>
              </div>
              {positiveSignals.length > 0 ? (
                <ul className="space-y-1">
                  {positiveSignals.map((sig, i) => (
                    <li key={i} className="text-xs text-emerald-800 leading-snug">{sig}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-muted-foreground">None detected</p>
              )}
            </div>
            <div className="rounded-xl bg-red-50 border border-red-200 p-3 space-y-2">
              <div className="flex items-center gap-1.5">
                <ThumbsDown className="h-3.5 w-3.5 text-red-600" />
                <p className="text-xs font-semibold text-red-700">Negative</p>
              </div>
              {negativeSignals.length > 0 ? (
                <ul className="space-y-1">
                  {negativeSignals.map((sig, i) => (
                    <li key={i} className="text-xs text-red-800 leading-snug">{sig}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-muted-foreground">None detected</p>
              )}
            </div>
          </div>

          {/* Recommended tone */}
          {s.recommended_tone && (
            <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 flex items-start gap-3">
              <MessageSquare className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-blue-700 mb-0.5">Recommended Tone</p>
                <p className="text-sm text-blue-800">{s.recommended_tone}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
