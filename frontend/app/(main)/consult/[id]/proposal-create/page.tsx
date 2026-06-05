"use client"

import { use, useState } from "react"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { SolutionSummary } from "@/components/consultation/step3/SolutionSummary"
import { ProposalTimeline } from "@/components/consultation/step3/ProposalTimeline"
import { ProposalDocument } from "@/components/consultation/step3/ProposalDocument"
import { HumanReview } from "@/components/consultation/step3/HumanReview"

export default function Step3Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [stage, setStage] = useState<"summary" | "generating" | "results">("summary")

  const handleGenerate = () => {
    setStage("generating")
    setTimeout(() => {
      setStage("results")
    }, 4000)
  }

  const handleRerun = () => {
    setStage("generating")
    setTimeout(() => {
      setStage("results")
    }, 4000)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-2">
        {/* Back Link */}
        <Link
          href={`/consult/${id}/build`}
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Step 2
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl brand-gradient">
                <svg
                  className="h-5 w-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
                  Automated Proposal & Quote Generation
                </h1>
                <p className="text-sm text-muted-foreground">Step 3 of 3</p>
              </div>
            </div>
            {stage === "results" && (
              <Link
                href="/proposal"
                className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white bg-emerald-500 shadow-lg shadow-emerald-500/25 hover:bg-emerald-600 transition-colors"
              >
                <CheckCircle2 className="h-4 w-4" />
                Complete Consultation
              </Link>
            )}
          </div>
          <p className="text-muted-foreground max-w-3xl">
            AI-powered proposal generation that compiles requirements, product recommendations, and pricing into a professional client-ready document.
          </p>
        </div>

        {/* Content */}
        {stage === "summary" && (
          <SolutionSummary onGenerate={handleGenerate} />
        )}

        {stage === "generating" && (
          <ProposalTimeline />
        )}

        {stage === "results" && (
          <div className="space-y-6">
            <ProposalDocument />
            <HumanReview onRerun={handleRerun} />
          </div>
        )}
      </div>
    </div>
  )
}
