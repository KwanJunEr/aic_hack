"use client"

import { FileText, Package, DollarSign, Building2, Sparkles } from "lucide-react"

interface SolutionSummaryProps {
  onGenerate: () => void
}

export function SolutionSummary({ onGenerate }: SolutionSummaryProps) {
  return (
    <div className="space-y-6">
      {/* Summary Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Client Info */}
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10">
              <Building2 className="h-4 w-4 text-blue-500" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Client</span>
          </div>
          <p className="text-lg font-semibold text-foreground">Acme Logistics Corp</p>
          <p className="text-sm text-muted-foreground mt-1">Enterprise - Logistics</p>
        </div>

        {/* Requirements Count */}
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10">
              <FileText className="h-4 w-4 text-violet-500" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Requirements</span>
          </div>
          <p className="text-lg font-semibold text-foreground">12 Validated</p>
          <p className="text-sm text-muted-foreground mt-1">High confidence extraction</p>
        </div>

        {/* Products Selected */}
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10">
              <Package className="h-4 w-4 text-emerald-500" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Products</span>
          </div>
          <p className="text-lg font-semibold text-foreground">4 Modules</p>
          <p className="text-sm text-muted-foreground mt-1">Nexus WMS Suite</p>
        </div>

        {/* Estimated Value */}
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10">
              <DollarSign className="h-4 w-4 text-amber-500" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">Est. Value</span>
          </div>
          <p className="text-lg font-semibold text-foreground">RM 436,500</p>
          <p className="text-sm text-muted-foreground mt-1">Annual contract</p>
        </div>
      </div>

      {/* Detailed Summary Card */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Solution Overview</h3>
        
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Selected Modules */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Selected Modules</h4>
            <div className="space-y-2">
              {[
                { code: "WMS-CORE", name: "Core Warehouse Management", price: "RM 180,000" },
                { code: "WMS-YARD", name: "Yard Management", price: "RM 95,000" },
                { code: "WMS-ANALYTICS", name: "Advanced Analytics", price: "RM 120,000" },
                { code: "WMS-3PL", name: "3PL Multi-tenant", price: "RM 90,000" },
              ].map((module) => (
                <div
                  key={module.code}
                  className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-rose-500">{module.code}</span>
                    <span className="text-sm text-foreground">{module.name}</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">{module.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Requirements */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Key Requirements Addressed</h4>
            <div className="space-y-2">
              {[
                "Real-time inventory tracking across 5 warehouses",
                "SAP S/4HANA integration with bi-directional sync",
                "Multi-tenant 3PL client management",
                "Advanced yard scheduling and dock management",
                "Predictive analytics for demand forecasting",
              ].map((req, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <span className="text-emerald-500 mt-0.5">&#10003;</span>
                  <span>{req}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="mt-6 pt-6 border-t border-border">
          <button
            onClick={onGenerate}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-medium text-white brand-gradient shadow-lg shadow-rose-500/25 hover:opacity-90 transition-opacity"
          >
            <Sparkles className="h-4 w-4" />
            Generate Proposal Document
          </button>
          <p className="text-xs text-center text-muted-foreground mt-3">
            AI will compile all validated data into a professional proposal
          </p>
        </div>
      </div>
    </div>
  )
}
