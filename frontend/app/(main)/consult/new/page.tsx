"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { UploadPanel } from "@/components/consultation/new/UploadPanel"
import { useFileExtraction, type ExtractionSession } from "@/lib/extractText"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewConsultationPage() {
  const router = useRouter()
  const [session, setSession] = useState<ExtractionSession | null>(null)
  const { loading: isExtracting, error: extractError, extract } = useFileExtraction()

  const handleExtract = async (files: File[], transcript: string) => {
    const allFiles = [...files]
    if (transcript.trim()) {
      const blob = new Blob([transcript.trim()], { type: "text/plain" })
      allFiles.push(new File([blob], "pasted_transcript.txt", { type: "text/plain" }))
    }
    if (allFiles.length === 0) return

    try {
      const result = await extract(allFiles, files[0]?.name ?? "Consultation")
      if (result) setSession(result)
    } catch {
      // extractError from the hook is surfaced in UploadPanel
    }
  }

  const handleAnalyze = () => {
    if (session?.session_id) {
      router.push(`/consult/${session.session_id}/extraction`)
    }
  }

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

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
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
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
              Intelligent Requirements Extraction
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Upload meeting notes or transcripts. The AI will extract constraints, detect gaps, and
            prepare a structured sales brief to help you close deals faster.
          </p>
        </div>

        <UploadPanel
          onExtract={handleExtract}
          onAnalyze={handleAnalyze}
          isExtracting={isExtracting}
          session={session}
          extractError={extractError}
        />
      </div>
    </main>
  )
}
