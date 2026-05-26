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
} from "lucide-react"

const extractedData = [
  {
    id: "budget",
    icon: DollarSign,
    label: "Budget",
    value: "RM50,000",
    confidence: 92,
    source: "Client mentioned budget around fifty thousand during discussion at 12:43",
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
]

const missingInfo = [
  "Budget flexibility: is it fixed or flexible?",
  "What legacy systems are currently in use?",
  "Who is the final decision maker?",
  "What is the procurement approval process?",
]

const aiSuggestions = [
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

export function ExtractedResults() {
  const [selectedField, setSelectedField] = useState<string | null>(null)

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
          {extractedData.map((item) => {
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

                {/* Source traceability */}
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
            {aiSuggestions.map((suggestion, index) => (
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
          <div className="flex flex-wrap gap-3">
            <Button className="brand-gradient text-white border-0">
              <Check className="h-4 w-4 mr-2" />
              Accept & Proceed
            </Button>
            <Button variant="outline" className="border-violet-200 hover:bg-violet-50">
              <Pencil className="h-4 w-4 mr-2" />
              Edit Manually
            </Button>
            <Button variant="outline" className="border-red-200 hover:bg-red-50 text-red-600">
              <X className="h-4 w-4 mr-2" />
              Reject & Re-run
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
