"use client"

import { use, useState, useEffect } from "react"
import { ArrowLeft, ArrowRight, Compass } from "lucide-react"
import Link from "next/link"
import { RequirementsSummary } from "@/components/consultation/step2/RequirementsSummary"
import { AiMatchingTimeline } from "@/components/consultation/step2/AIMatchingTimeline"
import { ProductRecommendations } from "@/components/consultation/step2/ProductRecommendations"
import { getLatestSession, type Stage1SessionDocument } from "@/lib/stage1Api"

export default function Step2Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [stage, setStage] = useState<"summary" | "processing" | "results">("summary")
  const [sessionData, setSessionData] = useState<Stage1SessionDocument | null>(null)
  const [sessionLoading, setSessionLoading] = useState(true)

  useEffect(() => {
    getLatestSession()
      .then(setSessionData)
      .catch(console.error)
      .finally(() => setSessionLoading(false))
  }, [])

  const handleAnalyze = () => {
    setStage("processing")
    setTimeout(() => {
      setStage("results")
    }, 4000)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-2">
        <Link
          href={`/consult/${id}/extraction`}
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Step 1
        </Link>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl brand-gradient">
                <Compass className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
                Catalog Navigation &amp; Matching
              </h1>
            </div>
            {stage === "results" && (
              <Link
                href={`/consult/${id}/proposal-create`}
                className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white brand-gradient shadow-lg shadow-rose-500/25 hover:opacity-90 transition-opacity"
              >
                Next: Step 3
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
          <p className="text-muted-foreground max-w-2xl">
            AI-driven navigation across our software catalog to find the best matching products and modules for your client&apos;s requirements.
          </p>

          <div className="mt-4 flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs text-muted-foreground">Step 1: Requirements</span>
            </div>
            <div className="h-px w-4 bg-border" />
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full brand-gradient" />
              <span className="text-xs font-medium text-foreground">Step 2: Catalog Match</span>
            </div>
            <div className="h-px w-4 bg-border" />
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
              <span className="text-xs text-muted-foreground">Step 3: Proposal</span>
            </div>
          </div>
        </div>

        {stage === "summary" && (
          <RequirementsSummary
            onAnalyze={handleAnalyze}
            sessionData={sessionData}
            loading={sessionLoading}
          />
        )}

        {stage === "processing" && <AiMatchingTimeline />}

        {stage === "results" && <ProductRecommendations />}
      </div>
    </div>
  )
}
