"use client"

import { useState, useEffect } from "react"
import {
  ArrowLeft,
  FileText,
  Download,
  Eye,
  X,
  Calendar,
  Clock,
  CheckCircle2,
  Archive,
  Sparkles,
} from "lucide-react"
import Link from "next/link"

interface ProposalEntry {
  id: string
  title: string
  subtitle: string
  file: string
  createdLabel: string
  isCurrentTime: boolean
  badge: string
  badgeColor: string
  badgeDot: string
  description: string
}

const PROPOSALS: ProposalEntry[] = [
  {
    id: "previous",
    title: "Technical Proposal — Nexus WMS",
    subtitle: "PROP-2024-00847 · Acme Logistics Corp",
    file: "/nexus-wms-proposal_previous.pdf",
    createdLabel: "5 Jun 2026, 14:32",
    isCurrentTime: false,
    badge: "Previous",
    badgeColor: "bg-muted text-muted-foreground border border-border",
    badgeDot: "bg-muted-foreground/50",
    description: "Initial proposal draft generated from Stage 2 catalog matching session.",
  },
  {
    id: "latest",
    title: "Technical Proposal — Nexus WMS (v2)",
    subtitle: "PROP-2024-00847 · Acme Logistics Corp · Updated",
    file: "/nexus-wms-proposal_latest.pdf",
    createdLabel: "",
    isCurrentTime: true,
    badge: "Latest",
    badgeColor: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    badgeDot: "bg-emerald-500",
    description: "Revised proposal with updated pricing, competitor analysis, and 3-tab financial breakdown.",
  },
]

export default function ProposalListPage() {
  const [preview, setPreview] = useState<ProposalEntry | null>(null)
  const [currentTime, setCurrentTime] = useState("6 Jun 2026")

  useEffect(() => {
    const now = new Date()
    setCurrentTime(
      now.toLocaleString("en-MY", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    )
  }, [])

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-2">
        <Link
          href="/consult"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Consultations
        </Link>

        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl brand-gradient">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
                Proposal Documents
              </h1>
              <p className="text-sm text-muted-foreground">
                Acme Logistics Corp &nbsp;·&nbsp; PROP-2024-00847
              </p>
            </div>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            AI-generated proposal documents for review, preview, and download. The latest version includes competitor comparison and financial analysis.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 sm:grid-cols-2 max-w-4xl">
          {PROPOSALS.map((p) => {
            const createdAt = p.isCurrentTime ? currentTime : p.createdLabel
            return (
              <div
                key={p.id}
                className="glass-card rounded-2xl p-6 flex flex-col gap-5"
              >
                {/* Card header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl brand-gradient shrink-0">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-foreground leading-tight">
                        {p.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {p.subtitle}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${p.badgeColor}`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${p.badgeDot}`} />
                    {p.badge}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-muted-foreground leading-relaxed -mt-1">
                  {p.description}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    {p.isCurrentTime ? (
                      <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
                    ) : (
                      <Archive className="h-3.5 w-3.5" />
                    )}
                    {p.badge === "Latest" ? "Current version" : "Archived"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {createdAt}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-1 border-t border-border/40">
                  <button
                    onClick={() => setPreview(p)}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    Preview
                  </button>
                  <a
                    href={p.file}
                    download
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-white brand-gradient hover:opacity-90 transition-opacity"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </a>
                </div>
              </div>
            )
          })}
        </div>

        {/* Summary row */}
        <div className="mt-8 max-w-4xl rounded-2xl border border-border/50 bg-muted/30 p-4">
          <div className="flex items-center gap-6 flex-wrap text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              2 proposals generated
            </span>
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Latest updated {currentTime}
            </span>
            <span className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Nexus WMS Core · RM 47,500
            </span>
          </div>
        </div>
      </div>

      {/* Preview modal */}
      {preview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setPreview(null)}
        >
          <div
            className="relative w-full max-w-5xl h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-background shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg brand-gradient">
                  <FileText className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{preview.title}</p>
                  <p className="text-xs text-muted-foreground">{preview.subtitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={preview.file}
                  download
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download
                </a>
                <button
                  onClick={() => setPreview(null)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            {/* PDF embed */}
            <iframe
              src={preview.file}
              className="flex-1 w-full"
              title={preview.title}
            />
          </div>
        </div>
      )}
    </main>
  )
}
