"use client"

import { FileText, Target, Gauge, Shield, Zap } from "lucide-react"

interface RequirementsSummaryProps {
  onAnalyze: () => void
}

export function RequirementsSummary({ onAnalyze }: RequirementsSummaryProps) {
  const requirements = [
    "Multi-site warehouse management across 3 distribution centers",
    "Real-time inventory tracking with barcode scanning",
    "Integration with existing SAP S/4HANA ERP system",
    "Yard management for 15+ dock doors",
    "Labor productivity tracking and KPI reporting",
  ]

  return (
    <div className="space-y-6">
      {/* Context Intelligence Card */}
      <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg surface-rose">
            <FileText className="h-4 w-4 text-rose-600" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">Client Requirement Summary</h2>
        </div>

        {/* Metrics row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="rounded-xl surface-violet p-4">
            <div className="flex items-center gap-2 mb-1">
              <Target className="h-4 w-4 text-violet-600" />
              <span className="text-xs text-muted-foreground">Detected Intent</span>
            </div>
            <p className="text-sm font-medium text-foreground">Enterprise WMS</p>
          </div>
          <div className="rounded-xl surface-rose p-4">
            <div className="flex items-center gap-2 mb-1">
              <Gauge className="h-4 w-4 text-rose-600" />
              <span className="text-xs text-muted-foreground">Complexity</span>
            </div>
            <p className="text-sm font-medium text-foreground">High</p>
          </div>
          <div className="rounded-xl surface-violet p-4">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-4 w-4 text-violet-600" />
              <span className="text-xs text-muted-foreground">Confidence</span>
            </div>
            <p className="text-sm font-medium text-foreground">87%</p>
          </div>
          <div className="rounded-xl surface-rose p-4">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="h-4 w-4 text-rose-600" />
              <span className="text-xs text-muted-foreground">Risk Level</span>
            </div>
            <p className="text-sm font-medium text-foreground">Medium</p>
          </div>
        </div>

        {/* Requirements list */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-foreground">Extracted Requirements</h3>
          <ul className="space-y-2">
            {requirements.map((req, index) => (
              <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100 text-xs font-medium text-rose-600">
                  {index + 1}
                </span>
                {req}
              </li>
            ))}
          </ul>
        </div>

        {/* Source files */}
        <div className="mt-6 pt-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground mb-2">Source Documents</p>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
              <FileText className="h-3 w-3" />
              RFP_Acme_Logistics.pdf
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
              <FileText className="h-3 w-3" />
              Meeting_Transcript_May15.txt
            </span>
          </div>
        </div>
      </div>

      {/* Analyze button */}
      <div className="flex justify-center">
        <button
          onClick={onAnalyze}
          className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium text-white brand-gradient shadow-lg shadow-rose-500/25 hover:opacity-90 transition-opacity"
        >
          <Zap className="h-4 w-4" />
          Analyze & Match Products
        </button>
      </div>
    </div>
  )
}
