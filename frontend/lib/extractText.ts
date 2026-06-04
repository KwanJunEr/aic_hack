/**
 * hooks/useFileExtraction.ts
 *
 * Orchestrates the full upload flow:
 *  1. PDF / DOCX / TXT  → extracted locally in the browser (instant, no server)
 *  2. Audio files        → POST /upload/transcribe  (Whisper on backend)
 *  3. All results merged → POST /upload/sessions    (saved to MongoDB)
 *
 * Returns a single `extract(files)` function plus reactive state.
 */

import { useState, useCallback } from "react"

// ── Types ─────────────────────────────────────────────────────────────────

export interface FileExtractionResult {
  filename: string
  file_type: "pdf" | "docx" | "txt" | "audio" | "unknown"
  extracted_text: string
  char_count: number
  success: boolean
  error?: string
}

export interface ExtractionSession {
  session_id: string
  session_name: string
  total_files: number
  successful: number
  failed: number
  results: FileExtractionResult[]
  combined_text: string | null
  created_at: string
}

export interface ExtractionState {
  loading: boolean
  error: string | null
  session: ExtractionSession | null
}

// ── Audio detection ────────────────────────────────────────────────────────

const AUDIO_EXTENSIONS = new Set(["mp3", "wav", "ogg", "flac", "m4a", "mp4"])

function isAudio(file: File): boolean {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? ""
  return AUDIO_EXTENSIONS.has(ext) || file.type.startsWith("audio/") || file.type === "video/mp4"
}

// ── Local extractors (your existing code, unchanged) ──────────────────────

async function extractFromPdf(file: File): Promise<string> {
  const pdfjsLib = await import("pdfjs-dist")
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs"

  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

  const pages: string[] = []
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const pageText = content.items
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((item: any) => ("str" in item ? item.str : ""))
      .join(" ")
    pages.push(pageText)
  }
  return pages.join("\n\n")
}

async function extractFromDocx(file: File): Promise<string> {
  const mammoth = await import("mammoth")
  const arrayBuffer = await file.arrayBuffer()
  const { value } = await mammoth.extractRawText({ arrayBuffer })
  return value
}

async function extractLocalFile(file: File): Promise<FileExtractionResult> {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? ""
  const filename = file.name

  try {
    let text = ""
    let file_type: FileExtractionResult["file_type"] = "unknown"

    if (ext === "txt") {
      text = await file.text()
      file_type = "txt"
    } else if (ext === "pdf") {
      text = await extractFromPdf(file)
      file_type = "pdf"
    } else if (ext === "docx" || ext === "doc") {
      text = await extractFromDocx(file)
      file_type = "docx"
    } else {
      return {
        filename,
        file_type: "unknown",
        extracted_text: "",
        char_count: 0,
        success: false,
        error: `Unsupported file type: .${ext}`,
      }
    }

    return {
      filename,
      file_type,
      extracted_text: text,
      char_count: text.length,
      success: true,
    }
  } catch (err) {
    return {
      filename,
      file_type: "unknown",
      extracted_text: "",
      char_count: 0,
      success: false,
      error: err instanceof Error ? err.message : "Local extraction failed",
    }
  }
}

// ── Backend audio transcription ────────────────────────────────────────────

async function transcribeAudioFiles(audioFiles: File[]): Promise<FileExtractionResult[]> {
  if (audioFiles.length === 0) return []

  const form = new FormData()
  audioFiles.forEach((f) => form.append("files", f))

  const base = process.env.NEXT_PUBLIC_API_URL ?? ""
  const res = await fetch(`${base}/upload/transcribe`, {
    method: "POST",
    body: form,
    credentials: "include",   // sends the auth cookie
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Transcription request failed" }))
    throw new Error(err.detail ?? "Transcription failed")
  }

  const data: { results: FileExtractionResult[] } = await res.json()
  return data.results
}

// ── Save session to MongoDB ────────────────────────────────────────────────

async function saveSession(
  results: FileExtractionResult[],
  sessionName?: string,
): Promise<ExtractionSession> {
  const combined_text = results
    .filter((r) => r.success && r.extracted_text)
    .map((r) => `[${r.filename}]\n${r.extracted_text}`)
    .join("\n\n---\n\n") || null

  const base = process.env.NEXT_PUBLIC_API_URL ?? ""
  const res = await fetch(`${base}/upload/sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      session_name: sessionName ?? null,
      results,
      combined_text,
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Failed to save session" }))
    throw new Error(err.detail ?? "Failed to save session")
  }

  return res.json()
}

// ── Main hook ──────────────────────────────────────────────────────────────

export function useFileExtraction() {
  const [state, setState] = useState<ExtractionState>({
    loading: false,
    error: null,
    session: null,
  })

  const extract = useCallback(async (files: File[], sessionName?: string) => {
    if (files.length === 0) return

    setState({ loading: true, error: null, session: null })

    try {
      // Split: audio → backend, everything else → browser
      const audioFiles  = files.filter((f) =>  isAudio(f))
      const localFiles  = files.filter((f) => !isAudio(f))

      // Run local extraction + audio transcription in parallel
      const [localResults, audioResults] = await Promise.all([
        Promise.all(localFiles.map(extractLocalFile)),
        transcribeAudioFiles(audioFiles),
      ])

      // Merge — preserve original file order
      const fileIndexMap = new Map(files.map((f, i) => [f.name, i]))
      const allResults = [...localResults, ...audioResults].sort(
        (a, b) => (fileIndexMap.get(a.filename) ?? 0) - (fileIndexMap.get(b.filename) ?? 0)
      )

      // Persist to MongoDB
      const session = await saveSession(allResults, sessionName)

      setState({ loading: false, error: null, session })
      return session

    } catch (err) {
      const message = err instanceof Error ? err.message : "Extraction failed"
      setState({ loading: false, error: message, session: null })
      throw err
    }
  }, [])

  const reset = useCallback(() => {
    setState({ loading: false, error: null, session: null })
  }, [])

  return { ...state, extract, reset }
}