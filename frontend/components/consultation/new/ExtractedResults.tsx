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
  ExternalLink,
  Check,
  List,
  FileText,
} from "lucide-react"
import type { Stage1PipelineData, RequirementField } from "@/lib/stage1Api"

// ── Item type ─────────────────────────────────────────────────────────────

interface ExtractedItem {
  id: string
  icon: React.ElementType
  label: string
  value: string
  confidence: number
  source: string
  color: string
  items?: string[]
}

// ── Hardcoded fallback data ───────────────────────────────────────────────

const FALLBACK_EXTRACTED: ExtractedItem[] = [
  {
    id: "budget",
    icon: DollarSign,
    label: "Budget",
    value: "RM 50,000",
    confidence: 82,
    source: "Client mentioned a budget of around RM 50k for the project",
    color: "emerald",
  },
  {
    id: "timeline",
    icon: Clock,
    label: "Timeline",
    value: "3 months (before Q2)",
    confidence: 88,
    source: "Need this deployed within 3 months, ideally before Q2 ends",
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
    source: "Running legacy Oracle databases that need to be integrated... easy to maintain",
    color: "violet",
  },
  {
    id: "constraints",
    icon: AlertTriangle,
    label: "Constraints",
    value: "Small IT team, legacy systems",
    confidence: 78,
    source: "IT team is small... current system causing significant delays",
    color: "red",
  },
  {
    id: "goals",
    icon: Target,
    label: "Goals",
    value: "Replace current system, reduce delays",
    confidence: 81,
    source: "Current system is causing significant delays",
    color: "rose",
  },
  {
    id: "key_points",
    icon: List,
    label: "Key Points",
    value: "5 key points captured",
    confidence: 85,
    source: "AI extracted from transcript",
    color: "indigo",
    items: [
      "Legacy Oracle DB integration required",
      "Small IT team — low-maintenance solution preferred",
      "3-month deadline before Q2",
      "Budget around RM 50k",
      "Goal: reduce delays and replace current system",
    ],
  },
  {
    id: "summary",
    icon: FileText,
    label: "Summary",
    value: "The client is looking to modernise their operations by replacing their legacy system.",
    confidence: 80,
    source: "AI extracted from transcript",
    color: "slate",
  },
]

const colorClasses: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  emerald: { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200", dot: "bg-emerald-400" },
  blue:    { bg: "bg-blue-50",    text: "text-blue-600",    border: "border-blue-200",    dot: "bg-blue-400"    },
  violet:  { bg: "bg-violet-50",  text: "text-violet-600",  border: "border-violet-200",  dot: "bg-violet-400"  },
  red:     { bg: "bg-red-50",     text: "text-red-600",     border: "border-red-200",     dot: "bg-red-400"     },
  rose:    { bg: "bg-rose-50",    text: "text-rose-600",    border: "border-rose-200",    dot: "bg-rose-400"    },
  gray:    { bg: "bg-gray-50",    text: "text-gray-500",    border: "border-gray-200",    dot: "bg-gray-400"    },
  indigo:  { bg: "bg-indigo-50",  text: "text-indigo-600",  border: "border-indigo-200",  dot: "bg-indigo-400"  },
  slate:   { bg: "bg-slate-50",   text: "text-slate-600",   border: "border-slate-200",   dot: "bg-slate-400"   },
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

function buildExtractedItems(data: Stage1PipelineData | null | undefined): ExtractedItem[] | null {
  const req = data?.requirements
  if (!req) return null

  const kpValue = req.key_points?.value
  const kpItems = Array.isArray(kpValue) ? (kpValue as string[]) : undefined

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
    {
      id: "key_points",
      icon: List,
      label: "Key Points",
      value: kpItems
        ? `${kpItems.length} key point${kpItems.length !== 1 ? "s" : ""} captured`
        : fieldValue(req.key_points),
      confidence: req.key_points?.confidence ?? 0,
      source: "AI extracted from transcript",
      color: "indigo",
      items: kpItems,
    },
    {
      id: "summary",
      icon: FileText,
      label: "Summary",
      value: fieldValue(req.summary),
      confidence: req.summary?.confidence ?? 0,
      source: "AI extracted from transcript",
      color: "slate",
    },
  ]
}

// ── Component ─────────────────────────────────────────────────────────────

interface ExtractedResultsProps {
  data?: Stage1PipelineData | null
}

export function ExtractedResults({ data }: ExtractedResultsProps) {
  const [selectedField, setSelectedField] = useState<string | null>(null)

  const extractedItems = buildExtractedItems(data) ?? FALLBACK_EXTRACTED

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
                    ? `${String(colors.bg)} ${String(colors.border)}`
                    : "bg-white/50 border-border hover:border-rose-200"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`h-9 w-9 rounded-lg ${String(colors.bg)} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`h-4 w-4 ${String(colors.text)}`} />
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
                    {item.items?.length ? (
                      <ul className="space-y-1.5">
                        {item.items.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs">
                            <span className={`h-1.5 w-1.5 rounded-full mt-1.5 flex-shrink-0 ${String(colors.dot)}`} />
                            <p className="text-foreground/80 leading-relaxed">{point}</p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Source:</p>
                        <p className={`text-sm italic ${colors.text}`}>{`"${item.source}"`}</p>
                      </>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </CardContent>
      </Card>

    </div>
  )
}
