"use client"

import { use, useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { AiTimeline } from "@/components/consultation/new/AITimeline"
import { ExtractedResults } from "@/components/consultation/new/ExtractedResults"
import { DealReadinessCard } from "@/components/consultation/new/DealReadinessCard"
import { ChainOfThoughtsCard } from "@/components/consultation/new/ChainOfThoughtsCard"
import { useCurrentUser } from "@/context/UserContext"
import {
  runStage1,
  editStage1,
  rejectStage1,
  confirmStage1,
  type Stage1PipelineData,
} from "@/lib/stage1Api"

export default function ConsultationResultsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const { user } = useCurrentUser()

  const [stage, setStage] = useState<"processing" | "results">("processing")
  const [pipelineData, setPipelineData] = useState<Stage1PipelineData | null>(null)
  const [pipelineSessionId, setPipelineSessionId] = useState<string | null>(null)
  const [obstruction, setObstruction] = useState<{ detected: boolean; reason: string | null }>({
    detected: false,
    reason: null,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fire pipeline on mount once user is resolved — do NOT block navigation
  useEffect(() => {
    if (!user?.id) return
    let cancelled = false

    const run = async () => {
      try {
        const response = await runStage1({ transcript_id: id, user_id: user.id })
        if (cancelled) return
        setPipelineData(response.data ?? null)
        setPipelineSessionId(response.session_id)
        setObstruction({
          detected: response.obstruction_detected ?? false,
          reason: response.obstruction_reason ?? null,
        })
        setStage("results")
        toast.success("AI confirmed successfully")
      } catch (err) {
        if (cancelled) return
        console.error("[stage1] pipeline error:", err)
        setStage("results") // show fallback UI, never leave user on blank screen
        toast.error("There is an error in AI processing")
      }
    }

    run()
    return () => {
      cancelled = true
    }
  }, [id, user?.id])

  const handleAccept = useCallback(async () => {
    if (!pipelineSessionId) return
    setIsSubmitting(true)
    try {
      await confirmStage1({ session_id: pipelineSessionId })
      toast.success("AI confirmed successfully")
      router.push(`/consult/${id}/build`)
    } catch {
      toast.error("There is an error in AI processing")
    } finally {
      setIsSubmitting(false)
    }
  }, [pipelineSessionId, id, router])

  const handleEdit = useCallback(
    async (additionalText: string) => {
      if (!pipelineSessionId) return
      setIsSubmitting(true)
      setStage("processing")
      try {
        const response = await editStage1({
          session_id: pipelineSessionId,
          additional_text: additionalText,
        })
        setPipelineData(response.data ?? null)
        setPipelineSessionId(response.session_id)
        setObstruction({
          detected: response.obstruction_detected ?? false,
          reason: response.obstruction_reason ?? null,
        })
        setStage("results")
        toast.success("AI confirmed successfully")
      } catch {
        setStage("results")
        toast.error("There is an error in AI processing")
      } finally {
        setIsSubmitting(false)
      }
    },
    [pipelineSessionId],
  )

  const handleReject = useCallback(async () => {
    if (!pipelineSessionId) return
    setIsSubmitting(true)
    setStage("processing")
    try {
      const response = await rejectStage1({ session_id: pipelineSessionId })
      setPipelineData(response.data ?? null)
      setPipelineSessionId(response.session_id)
      setObstruction({
        detected: response.obstruction_detected ?? false,
        reason: response.obstruction_reason ?? null,
      })
      setStage("results")
      toast.success("AI confirmed successfully")
    } catch {
      setStage("results")
      toast.error("There is an error in AI processing")
    } finally {
      setIsSubmitting(false)
    }
  }, [pipelineSessionId])

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

        {obstruction.detected && stage === "results" && (
          <div className="mb-6 rounded-xl border border-amber-300 bg-amber-50 p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800">Obstruction Detected</p>
              <p className="text-sm text-amber-700 mt-0.5">{obstruction.reason}</p>
            </div>
          </div>
        )}

        {stage === "processing" && <AiTimeline />}

        {stage === "results" && (
          <div className="grid gap-6 lg:grid-cols-[1fr_480px]">
            <ExtractedResults
              data={pipelineData}
              onAccept={handleAccept}
              onEdit={handleEdit}
              onReject={handleReject}
              isSubmitting={isSubmitting}
            />
            <div className="flex flex-col gap-6">
              <DealReadinessCard data={pipelineData} />
              <ChainOfThoughtsCard data={pipelineData} />
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
