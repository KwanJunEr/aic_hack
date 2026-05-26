"use client"

import { ArrowLeft, CheckCircle2, Download, Send, FileText, Building2, Banknote, Calendar, Clock, ExternalLink } from "lucide-react"
import Link from "next/link"

const proposalDetails = [
  {
    icon: Building2,
    color: "bg-blue-500/10",
    iconColor: "text-blue-500",
    label: "Client",
    value: "Acme Logistics Corp",
  },
  {
    icon: Banknote,
    color: "bg-emerald-500/10",
    iconColor: "text-emerald-500",
    label: "Total Value",
    value: "RM 436,500 / year",
  },
  {
    icon: Calendar,
    color: "bg-violet-500/10",
    iconColor: "text-violet-500",
    label: "Valid Until",
    value: "March 15, 2025",
  },
  {
    icon: Clock,
    color: "bg-amber-500/10",
    iconColor: "text-amber-500",
    label: "Implementation",
    value: "12–16 weeks",
  },
]

const modules = [
  { code: "WMS-CORE", name: "Core Warehouse Management", price: "RM 180,000" },
  { code: "WMS-YARD", name: "Yard Management", price: "RM 95,000" },
  { code: "WMS-ANALYTICS", name: "Advanced Analytics", price: "RM 120,000" },
]

export default function ProposalCreatedPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-2">
        {/* Back */}
        <Link
          href="/consult"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Consultations
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl brand-gradient">
              <CheckCircle2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
                Proposal Created
              </h1>
              <p className="text-sm text-muted-foreground">PROP-2024-00847 · Generated just now</p>
            </div>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Your AI-generated proposal for Acme Logistics Corp has been compiled and is ready for review, editing, or delivery to the client.
          </p>
        </div>

        {/* Success Banner */}
        <div className="mb-8 rounded-2xl border border-emerald-200 bg-emerald-50/60 backdrop-blur-sm p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500 shadow-lg shadow-emerald-500/30 shrink-0">
              <CheckCircle2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="font-semibold text-emerald-800">Proposal Successfully Generated</p>
              <p className="text-sm text-emerald-700 mt-0.5">
                All 5 sections compiled · Pricing validated · Compliance verified
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button className="inline-flex items-center gap-2 rounded-lg border border-emerald-300 bg-white px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50 transition-colors">
              <Download className="h-4 w-4" />
              Export PDF
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-emerald-500/25 hover:bg-emerald-600 transition-colors">
              <Send className="h-4 w-4" />
              Send to Client
            </button>
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left: Proposal preview card */}
          <div className="lg:col-span-2 space-y-6">
            {/* Document card */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl brand-gradient">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Technical Proposal</h3>
                    <p className="text-sm text-muted-foreground">Nexus WMS Suite · Acme Logistics Corp</p>
                  </div>
                </div>
                <Link
                  href="/proposal/1"
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  View Full
                </Link>
              </div>

              {/* Section index */}
              <div className="space-y-2">
                {[
                  { num: "1", title: "Executive Summary", status: "complete" },
                  { num: "2", title: "Scope of Work", status: "complete" },
                  { num: "3", title: "Pricing Summary", status: "complete" },
                  { num: "4", title: "Terms & Conditions", status: "complete" },
                  { num: "5", title: "Implementation Timeline", status: "complete" },
                ].map((section) => (
                  <div
                    key={section.num}
                    className="flex items-center gap-3 rounded-xl bg-muted/40 px-4 py-3"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">
                      {section.num}
                    </span>
                    <span className="text-sm font-medium text-foreground flex-1">{section.title}</span>
                    <span className="text-xs text-emerald-600 font-medium">Complete</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modules included */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-semibold text-foreground mb-4">Modules Included</h3>
              <div className="space-y-2">
                {modules.map((m) => (
                  <div
                    key={m.code}
                    className="flex items-center justify-between rounded-xl bg-muted/40 px-4 py-3"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span className="text-xs font-mono text-rose-500">{m.code}</span>
                      <span className="text-sm text-foreground">{m.name}</span>
                    </div>
                    <span className="text-sm font-medium text-foreground">{m.price}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3 mt-2">
                  <span className="text-sm font-semibold text-foreground">Total Investment</span>
                  <span className="text-base font-bold text-foreground">RM 436,500 / yr</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {/* Proposal details */}
            <div className="glass-card rounded-2xl p-5">
              <h4 className="text-sm font-semibold text-foreground mb-4">Proposal Details</h4>
              <div className="space-y-4">
                {proposalDetails.map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${item.color}`}>
                      <item.icon className={`h-4 w-4 ${item.iconColor}`} />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="text-sm font-medium text-foreground">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI quality */}
            <div className="glass-card rounded-2xl p-5">
              <h4 className="text-sm font-semibold text-foreground mb-4">AI Generation Quality</h4>
              <div className="space-y-3">
                {[
                  { label: "Content Accuracy", value: 96 },
                  { label: "Pricing Validation", value: 100 },
                  { label: "Compliance Check", value: 94 },
                ].map((metric) => (
                  <div key={metric.label}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">{metric.label}</span>
                      <span className="font-medium text-foreground">{metric.value}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-emerald-500 transition-all" style={{ width: `${metric.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Next steps */}
            <div className="glass-card rounded-2xl p-5">
              <h4 className="text-sm font-semibold text-foreground mb-4">Next Steps</h4>
              <div className="space-y-3">
                {[
                  { step: "1", label: "Review proposal sections", done: true },
                  { step: "2", label: "Send to client for approval", done: false },
                  { step: "3", label: "Schedule follow-up call", done: false },
                ].map((item) => (
                  <div key={item.step} className="flex items-center gap-3">
                    <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      item.done ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"
                    }`}>
                      {item.done ? <CheckCircle2 className="h-3.5 w-3.5" /> : item.step}
                    </div>
                    <span className={`text-sm ${item.done ? "text-muted-foreground line-through" : "text-foreground"}`}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
