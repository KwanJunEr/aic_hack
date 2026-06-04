"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Upload, FileText, Music, X, Sparkles, AlertCircle,
  Loader2, CheckCircle2, ScanText,
} from "lucide-react"
import type { ExtractionSession } from "@/lib/extractText"

// ── Types ──────────────────────────────────────────────────────────────────

interface UploadPanelProps {
  onExtract: (files: File[], transcript: string) => Promise<void>
  onAnalyze: () => void
  isExtracting: boolean
  session: ExtractionSession | null
  extractError?: string | null
}

type FileType = "pdf" | "docx" | "txt" | "audio" | "unknown"

// ── Helpers ────────────────────────────────────────────────────────────────

const ACCEPTED_EXTENSIONS = ".pdf,.docx,.doc,.txt,.mp3,.wav,.ogg,.flac,.m4a,.mp4"
const AUDIO_EXTENSIONS = new Set(["mp3", "wav", "ogg", "flac", "m4a", "mp4"])

function getFileType(file: File): FileType {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? ""
  if (AUDIO_EXTENSIONS.has(ext) || file.type.startsWith("audio/") || file.type === "video/mp4") return "audio"
  if (ext === "pdf") return "pdf"
  if (ext === "docx" || ext === "doc") return "docx"
  if (ext === "txt") return "txt"
  return "unknown"
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const FILE_TYPE_CONFIG: Record<FileType, { label: string; badgeClass: string }> = {
  pdf:     { label: "PDF",   badgeClass: "bg-rose-100 text-rose-700 border-rose-200" },
  docx:    { label: "DOCX",  badgeClass: "bg-blue-100 text-blue-700 border-blue-200" },
  txt:     { label: "TXT",   badgeClass: "bg-slate-100 text-slate-600 border-slate-200" },
  audio:   { label: "Audio", badgeClass: "bg-violet-100 text-violet-700 border-violet-200" },
  unknown: { label: "File",  badgeClass: "bg-slate-100 text-slate-600 border-slate-200" },
}

// ── Component ──────────────────────────────────────────────────────────────

export function UploadPanel({
  onExtract,
  onAnalyze,
  isExtracting,
  session,
  extractError,
}: UploadPanelProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [transcript, setTranscript] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (session?.combined_text) {
      setTranscript(session.combined_text)
    }
  }, [session])

  const addFiles = useCallback((incoming: File[]) => {
    setFiles((prev) => {
      const existingNames = new Set(prev.map((f) => f.name))
      return [...prev, ...incoming.filter((f) => !existingNames.has(f.name))]
    })
  }, [])

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? [])
    if (picked.length) addFiles(picked)
    e.target.value = ""
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const dropped = Array.from(e.dataTransfer.files)
      if (dropped.length) addFiles(dropped)
    },
    [addFiles],
  )

  // Analyze is ready when:
  //   • files were extracted (session exists), OR
  //   • no files queued but a transcript was pasted
  const canAnalyze =
    session !== null || (files.length === 0 && transcript.trim().length > 0)

  const summaryLabel = (() => {
    if (session) {
      return `${session.successful} file${session.successful !== 1 ? "s" : ""} extracted — ready to analyze`
    }
    if (files.length === 0 && transcript.trim()) return "Transcript ready — click Analyze Requirements"
    if (files.length > 0) return "Extract files first, then analyze"
    return "Upload documents or paste a transcript to continue"
  })()

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* ── Upload Zone ─────────────────────────────────────────────────── */}
      <Card className="border-0 bg-white/60 backdrop-blur-sm shadow-lg shadow-rose-100/20">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Upload className="h-5 w-5 text-rose-500" />
            Upload Documents
          </h3>

          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_EXTENSIONS}
            multiple
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Drop zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative rounded-xl border-2 border-dashed p-6 text-center transition-all duration-200 cursor-pointer select-none ${
              isDragging
                ? "border-rose-400 bg-rose-50/60"
                : "border-border hover:border-rose-300 hover:bg-rose-50/30"
            }`}
          >
            <div className="flex flex-col items-center gap-2 pointer-events-none">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-rose-100 to-violet-100">
                <Upload className="h-6 w-6 text-rose-500" />
              </div>
              <p className="font-medium text-foreground text-sm">
                {isDragging ? "Drop files here" : "Drag & drop files"}
              </p>
              <p className="text-xs text-muted-foreground">
                PDF, DOCX, TXT · MP3, WAV, OGG, FLAC, M4A
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click() }}
              className="mt-3 border-rose-200 hover:bg-rose-50 hover:border-rose-300 text-xs relative z-10"
            >
              Browse Files
            </Button>
          </div>

          {/* File list preview */}
          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {files.length} file{files.length > 1 ? "s" : ""} queued
              </p>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-0.5">
                {files.map((file, i) => {
                  const type = getFileType(file)
                  const cfg = FILE_TYPE_CONFIG[type]
                  const extractedResult = session?.results.find((r) => r.filename === file.name)
                  return (
                    <div
                      key={`${file.name}-${i}`}
                      className="flex items-center gap-2.5 rounded-lg bg-slate-50 border border-slate-100 px-3 py-2"
                    >
                      {type === "audio" ? (
                        <Music className="h-4 w-4 shrink-0 text-violet-500" />
                      ) : (
                        <FileText className="h-4 w-4 shrink-0 text-rose-500" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate leading-tight">
                          {file.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {extractedResult
                            ? `${extractedResult.char_count.toLocaleString()} chars extracted`
                            : formatSize(file.size)}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-[10px] px-1.5 py-0 shrink-0 font-medium ${cfg.badgeClass}`}
                      >
                        {cfg.label}
                      </Badge>
                      {extractedResult ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                      ) : (
                        <button
                          onClick={() => removeFile(i)}
                          disabled={isExtracting}
                          className="shrink-0 rounded p-0.5 text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          aria-label={`Remove ${file.name}`}
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Extract button — sits right below the file list */}
              {!session && (
                <Button
                  onClick={() => onExtract(files, transcript)}
                  disabled={isExtracting}
                  size="sm"
                  className="mt-1 w-full bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium"
                >
                  {isExtracting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                      Extracting…
                    </>
                  ) : (
                    <>
                      <ScanText className="h-3.5 w-3.5 mr-1.5" />
                      Extract Files
                    </>
                  )}
                </Button>
              )}

              {/* Extraction success banner */}
              {session && (
                <div className="mt-1 flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-100 px-3 py-2 text-sm text-emerald-700">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>
                    {session.successful} of {session.total_files} file{session.total_files !== 1 ? "s" : ""} extracted successfully
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Extraction error */}
          {extractError && (
            <div className="mt-4 flex items-start gap-2 rounded-lg bg-red-50 border border-red-100 p-3 text-sm text-red-600">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{extractError}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Paste Transcript ─────────────────────────────────────────────── */}
      <Card className="border-0 bg-white/60 backdrop-blur-sm shadow-lg shadow-violet-100/20">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-violet-500" />
            Paste Transcript
          </h3>
          <Textarea
            placeholder="Paste your meeting transcript or notes here..."
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            className="min-h-[220px] resize-none border-violet-100 focus:border-violet-300 focus:ring-violet-200 bg-white/80"
          />
        </CardContent>
      </Card>

      {/* ── Analyze Requirements Button ──────────────────────────────────── */}
      <div className="lg:col-span-2">
        <Card className="border-0 bg-gradient-to-r from-rose-50/80 to-violet-50/80 backdrop-blur-sm">
          <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-semibold text-foreground">Ready to analyze?</h4>
              <p className="text-sm text-muted-foreground">{summaryLabel}</p>
            </div>
            <Button
              onClick={onAnalyze}
              disabled={!canAnalyze}
              className="brand-gradient text-white border-0 px-8 py-2.5 font-medium shadow-lg shadow-rose-200/50 hover:shadow-rose-300/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Analyze Requirements
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
