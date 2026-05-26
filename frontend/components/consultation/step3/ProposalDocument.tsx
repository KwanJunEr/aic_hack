"use client"

import { FileText, Download, Eye, Calendar, Building2, Banknote, Clock, Shield } from "lucide-react"

export function ProposalDocument() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Main Proposal Preview */}
      <div className="lg:col-span-2 space-y-6">
        {/* Document Header */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl brand-gradient">
                <FileText className="h-7 w-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground">
                  Technical Proposal
                </h3>
                <p className="text-sm text-muted-foreground">
                  PROP-2024-00847 | Generated just now
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors">
                <Eye className="h-4 w-4" />
                Preview
              </button>
              <button className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white brand-gradient hover:opacity-90 transition-opacity">
                <Download className="h-4 w-4" />
                Export PDF
              </button>
            </div>
          </div>

          {/* Document Sections Preview */}
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <h4 className="text-sm font-semibold text-foreground mb-2">1. Executive Summary</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This proposal outlines a comprehensive Warehouse Management Solution for Acme Logistics Corp, 
                designed to address your requirements for real-time inventory visibility, multi-warehouse 
                coordination, and seamless SAP S/4HANA integration. The proposed Nexus WMS Suite will 
                enable operational efficiency gains of up to 35% while providing enterprise-grade scalability.
              </p>
            </div>

            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <h4 className="text-sm font-semibold text-foreground mb-2">2. Scope of Work</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <span className="text-rose-500">&#8226;</span>
                  <span>Implementation of WMS-CORE across 5 warehouse locations</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-rose-500">&#8226;</span>
                  <span>Yard Management module deployment with dock scheduling</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-rose-500">&#8226;</span>
                  <span>Advanced Analytics dashboard with predictive capabilities</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-rose-500">&#8226;</span>
                  <span>3PL multi-tenant configuration for client management</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <h4 className="text-sm font-semibold text-foreground mb-2">3. Pricing Summary</h4>
              <div className="space-y-2">
                {[
                  { item: "Software License (Annual)", amount: "RM 395,000" },
                  { item: "Implementation Services", amount: "RM 65,000" },
                  { item: "Training & Onboarding", amount: "RM 25,000" },
                  { item: "Enterprise Discount (10%)", amount: "-RM 48,500", isDiscount: true },
                ].map((line, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{line.item}</span>
                    <span className={`font-medium ${line.isDiscount ? "text-emerald-500" : "text-foreground"}`}>
                      {line.amount}
                    </span>
                  </div>
                ))}
                <div className="pt-2 mt-2 border-t border-border flex items-center justify-between">
                  <span className="font-semibold text-foreground">Total Investment</span>
                  <span className="text-lg font-bold text-foreground">RM 436,500</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <h4 className="text-sm font-semibold text-foreground mb-2">4. Terms & Conditions</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Payment Terms:</span>
                  <p className="text-foreground">Net 30, Quarterly billing</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Contract Duration:</span>
                  <p className="text-foreground">36 months</p>
                </div>
                <div>
                  <span className="text-muted-foreground">SLA Guarantee:</span>
                  <p className="text-foreground">99.9% uptime</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Support Level:</span>
                  <p className="text-foreground">24/7 Enterprise</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Proposal Details */}
        <div className="glass-card rounded-2xl p-5">
          <h4 className="text-sm font-semibold text-foreground mb-4">Proposal Details</h4>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10">
                <Building2 className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Client</p>
                <p className="text-sm font-medium text-foreground">Acme Logistics Corp</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10">
                <Banknote className="h-4 w-4 text-emerald-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Value</p>
                <p className="text-sm font-medium text-foreground">RM 436,500 / year</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10">
                <Calendar className="h-4 w-4 text-violet-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Valid Until</p>
                <p className="text-sm font-medium text-foreground">March 15, 2025</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10">
                <Clock className="h-4 w-4 text-amber-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Implementation</p>
                <p className="text-sm font-medium text-foreground">12-16 weeks</p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Confidence */}
        <div className="glass-card rounded-2xl p-5">
          <h4 className="text-sm font-semibold text-foreground mb-4">AI Generation Quality</h4>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-muted-foreground">Content Accuracy</span>
                <span className="font-medium text-foreground">96%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: "96%" }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-muted-foreground">Pricing Validation</span>
                <span className="font-medium text-foreground">100%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: "100%" }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-muted-foreground">Compliance Check</span>
                <span className="font-medium text-foreground">94%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: "94%" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Compliance Badge */}
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10">
              <Shield className="h-4 w-4 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Compliance Verified</p>
              <p className="text-xs text-muted-foreground">All checks passed</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {["SOC 2", "GDPR", "ISO 27001", "HIPAA"].map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
