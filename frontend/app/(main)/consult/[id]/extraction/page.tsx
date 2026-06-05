"use client"

import { use, useState, useEffect } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"
import { AiTimeline } from "@/components/consultation/new/AITimeline"
import { ExtractedResults } from "@/components/consultation/new/ExtractedResults"
import { DealReadinessCard } from "@/components/consultation/new/DealReadinessCard"
import { ChainOfThoughtsCard } from "@/components/consultation/new/ChainOfThoughtsCard"

export default function ConsultationResultsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [stage, setStage] = useState<"processing" | "results">("processing")

  useEffect(() => {
    const timer = setTimeout(() => setStage("results"), 5500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-2">
        <Link
          href="/consult/new"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Upload
        </Link>

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
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
                  Intelligent Requirements Extraction
                </h1>
                <p className="text-sm text-muted-foreground">Step 1 of 3</p>
              </div>
            </div>
            {stage === "results" && (
              <Link
                href={`/consult/${id}/build`}
                className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white brand-gradient shadow-lg shadow-rose-500/25 hover:opacity-90 transition-opacity"
              >
                Next: Step 2
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Upload meeting notes or transcripts. The AI will extract constraints, detect gaps, and
            prepare a structured sales brief to help you close deals faster.
          </p>
        </div>

        {stage === "processing" && <AiTimeline />}

        {stage === "results" && (
          <div className="grid gap-6 lg:grid-cols-[1fr_480px]">
            <ExtractedResults />
            <div className="flex flex-col gap-6">
              <DealReadinessCard />
              <ChainOfThoughtsCard />
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
