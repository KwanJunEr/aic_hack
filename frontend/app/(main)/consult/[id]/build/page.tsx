"use client"

import { use, useState, useEffect, useCallback } from "react"
import { ArrowLeft, ArrowRight, Compass } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { RequirementsSummary } from "@/components/consultation/step2/RequirementsSummary"
import { AiMatchingTimeline } from "@/components/consultation/step2/AIMatchingTimeline"
import { ProductRecommendations } from "@/components/consultation/step2/ProductRecommendations"
import {
  getLatestSession,
  getSessionByTranscriptId,
  type Stage1SessionDocument,
} from "@/lib/stage1Api"
import {
  runStage2,
  acceptStage2,
  rejectStage2,
  editStage2,
  type Stage2PipelineData,
} from "@/lib/stage2Api"
import { useCurrentUser } from "@/context/UserContext"

export default function Step2Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { user } = useCurrentUser()

  const [stage, setStage] = useState<"summary" | "processing" | "results">("summary")
  const [sessionData, setSessionData] = useState<Stage1SessionDocument | null>(null)
  const [sessionLoading, setSessionLoading] = useState(true)

  const [stage2Data, setStage2Data] = useState<Stage2PipelineData | null>(null)
  const [stage2SessionId, setStage2SessionId] = useState<string | null>(null)
  const [hitlStatus, setHitlStatus] = useState<"pending" | "accepted" | "rejected" | "edited">("pending")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    getSessionByTranscriptId(id)
      .then(setSessionData)
      .catch(() => getLatestSession().then(setSessionData).catch(console.error))
      .finally(() => setSessionLoading(false))
  }, [id])

  const handleAnalyze = useCallback(async () => {
    if (!user?.id) {
      toast.error("User not loaded yet, please wait.")
      return
    }
    setStage("processing")
    toast("Running Stage 2 AI…")
    try {
      const resp = await runStage2({
        user_id: user.id,
        stage1_session_id: sessionData?.session_id ?? "",
      })
      setStage2Data(resp.data ?? null)
      setStage2SessionId(resp.session_id)
      setHitlStatus("pending")
      setStage("results")
      toast.success("Stage 2 completed")
    } catch (err) {
      console.error("[stage2] pipeline error:", err)
      setStage("results")
      toast.error("Stage 2 failed")
    }
  }, [user?.id, sessionData?.session_id])

  const handleAccept = useCallback(async () => {
    if (!stage2SessionId) return
    setIsSubmitting(true)
    try {
      await acceptStage2({ session_id: stage2SessionId })
      setHitlStatus("accepted")
      toast.success("Stage 2 approved & saved")
    } catch {
      toast.error("Failed to accept Stage 2 results")
    } finally {
      setIsSubmitting(false)
    }
  }, [stage2SessionId])

  const handleReject = useCallback(async (reason?: string) => {
    if (!stage2SessionId) return
    setIsSubmitting(true)
    try {
      await rejectStage2({ session_id: stage2SessionId, rejection_reason: reason })
      setHitlStatus("rejected")
      toast.error("Stage 2 rejected")
    } catch {
      toast.error("Failed to reject Stage 2 results")
    } finally {
      setIsSubmitting(false)
    }
  }, [stage2SessionId])

  const handleEdit = useCallback(
    async (userEdits: Record<string, unknown>, feedbackText?: string) => {
      if (!stage2SessionId) return
      setIsSubmitting(true)
      setStage("processing")
      toast("Running Stage 2 AI…")
      try {
        const resp = await editStage2({
          session_id: stage2SessionId,
          user_edits: userEdits,
          feedback_text: feedbackText,
        })
        setStage2Data(resp.data ?? null)
        setStage2SessionId(resp.session_id)
        setHitlStatus("pending")
        setStage("results")
        toast.success("Stage 2 updated successfully")
      } catch {
        setStage("results")
        toast.error("Failed to update Stage 2 results")
      } finally {
        setIsSubmitting(false)
      }
    },
    [stage2SessionId],
  )

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
              hitlStatus === "accepted" ? (
                <Link
                  href={`/consult/${id}/proposal-create`}
                  className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white brand-gradient shadow-lg shadow-rose-500/25 hover:opacity-90 transition-opacity"
                >
                  Next: Step 3
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <button
                  disabled
                  title="Accept Stage 2 results to unlock Step 3"
                  className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground bg-muted cursor-not-allowed opacity-60"
                >
                  Next: Step 3
                  <ArrowRight className="h-4 w-4" />
                </button>
              )
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

        {stage === "results" && (
          <ProductRecommendations
            data={stage2Data}
            hitlStatus={hitlStatus}
            isSubmitting={isSubmitting}
            onAccept={handleAccept}
            onReject={handleReject}
            onEdit={handleEdit}
          />
        )}
      </div>
    </div>
  )
}
