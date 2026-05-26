"use client"

import { useState, useCallback, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Upload, FileText, Sparkles, Loader2 } from "lucide-react"

interface UploadPanelProps {
  transcript: string
  setTranscript: (value: string) => void
  onProceed: () => void
  onFileUpload: (file: File) => Promise<void>
}

export function UploadPanel({ transcript, setTranscript, onProceed, onFileUpload }: UploadPanelProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [isExtracting, setIsExtracting] = useState(false)
  const [extractError, setExtractError] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const processFile = useCallback(async (file: File) => {
    setFileName(file.name)
    setExtractError(null)
    setIsExtracting(true)
    try {
      await onFileUpload(file)
    } catch (err) {
      setExtractError(err instanceof Error ? err.message : "Failed to extract text from file.")
      setFileName(null)
    } finally {
      setIsExtracting(false)
    }
  }, [onFileUpload])

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    await processFile(file)
    // Reset input so the same file can be re-selected
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

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      await processFile(file)
    }
  }, [processFile])

  const hasContent = transcript.trim().length > 0

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Upload Zone */}
      <Card className="border-0 bg-white/60 backdrop-blur-sm shadow-lg shadow-rose-100/20">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Upload className="h-5 w-5 text-rose-500" />
            Upload Document
          </h3>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.doc,.txt"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Drag & Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative rounded-xl border-2 border-dashed p-8 text-center transition-all duration-200 ${
              isDragging
                ? "border-rose-400 bg-rose-50/50"
                : "border-border hover:border-rose-300 hover:bg-rose-50/30"
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-rose-100 to-violet-100">
                {isExtracting ? (
                  <Loader2 className="h-7 w-7 text-rose-500 animate-spin" />
                ) : (
                  <FileText className="h-7 w-7 text-rose-500" />
                )}
              </div>
              <div>
                <p className="font-medium text-foreground">
                  {isDragging ? "Drop your file here" : isExtracting ? "Extracting text…" : "Drag & drop your file"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  PDF, DOCX, or TXT files supported
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleClick}
                disabled={isExtracting}
                className="mt-2 border-rose-200 hover:bg-rose-50 hover:border-rose-300"
              >
                {isExtracting ? "Processing…" : "Browse Files"}
              </Button>
            </div>
          </div>

          {fileName && !isExtracting && (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
              <FileText className="h-4 w-4 shrink-0" />
              <span className="font-medium truncate">{fileName}</span>
              <span className="text-emerald-600 shrink-0">uploaded</span>
            </div>
          )}

          {extractError && (
            <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {extractError}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Paste Transcript */}
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

      {/* Proceed Button */}
      <div className="lg:col-span-2">
        <Card className="border-0 bg-gradient-to-r from-rose-50/80 to-violet-50/80 backdrop-blur-sm">
          <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-semibold text-foreground">Ready to analyze?</h4>
              <p className="text-sm text-muted-foreground">
                {hasContent
                  ? "Click proceed to start AI-powered requirements extraction"
                  : "Upload a document or paste transcript to continue"}
              </p>
            </div>
            <Button
              onClick={onProceed}
              disabled={!hasContent || isExtracting}
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
