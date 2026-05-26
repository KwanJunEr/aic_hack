"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp } from "lucide-react"

const metrics = [
  { label: "Requirements clarity", value: 78, color: "bg-emerald-500" },
  { label: "Stakeholder clarity", value: 45, color: "bg-amber-500" },
  { label: "Budget alignment", value: 85, color: "bg-emerald-500" },
  { label: "Technical feasibility", value: 72, color: "bg-emerald-500" },
]

export function DealReadinessCard() {
  const overallScore = 74
  const riskLevel = "Medium"

  return (
    <Card className="border-0 bg-white/70 backdrop-blur-md shadow-xl shadow-rose-100/30 overflow-hidden">
      {/* Header with gradient */}
      <div className="brand-gradient p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Deal Readiness</h3>
          <TrendingUp className="h-5 w-5 opacity-80" />
        </div>
        <div className="flex items-end gap-2">
          <span className="text-5xl font-bold">{overallScore}</span>
          <span className="text-2xl font-medium opacity-80 mb-1">%</span>
        </div>
        <p className="text-sm opacity-80 mt-1">Ready to proceed</p>
      </div>

      <CardContent className="p-6 space-y-5">
        {/* Breakdown metrics */}
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

        {/* Risk Level */}
        <div className="rounded-xl bg-amber-50 p-4 border border-amber-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-amber-800">Risk Level</span>
            <span className="inline-flex items-center rounded-full bg-amber-200 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
              {riskLevel}
            </span>
          </div>
          <p className="text-xs text-amber-700 mt-2">
            Unclear technical ownership and small IT team may affect implementation.
          </p>
        </div>

        {/* Confidence & Completeness */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-rose-50/50 p-3 text-center">
            <p className="text-2xl font-bold text-rose-600">87%</p>
            <p className="text-xs text-muted-foreground">Confidence</p>
          </div>
          <div className="rounded-lg bg-violet-50/50 p-3 text-center">
            <p className="text-2xl font-bold text-violet-600">72%</p>
            <p className="text-xs text-muted-foreground">Completeness</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
