"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Pencil, X } from "lucide-react"
import type { Stage1PipelineData, RequirementField } from "@/lib/stage1Api"

// ── Helpers ───────────────────────────────────────────────────────────────

function fieldValue(field?: RequirementField): string {
  if (!field?.value && field?.value !== 0) return "Not specified"
  if (Array.isArray(field.value)) return field.value.join(", ")
  if (typeof field.value === "number") {
    const currency = field.currency ?? "RM"
    return `${currency} ${field.value.toLocaleString()}`
  }
  const str = String(field.value).trim()
  return str || "Not specified"
}

function buildEditPrefill(data: Stage1PipelineData | null | undefined): string {
  const req = data?.requirements
  if (!req) return ""
  const lines: string[] = []
  if (req.budget)                  lines.push(`Budget: ${fieldValue(req.budget)}`)
  if (req.timeline)                lines.push(`Timeline: ${fieldValue(req.timeline)}`)
  if (req.constraints)             lines.push(`Constraints: ${fieldValue(req.constraints)}`)
  if (req.goals)                   lines.push(`Goals: ${fieldValue(req.goals)}`)
  if (req.technical_requirements)  lines.push(`Technical: ${fieldValue(req.technical_requirements)}`)
  if (req.summary)                 lines.push(`\nSummary: ${fieldValue(req.summary)}`)
  return lines.join("\n")
}

// ── Component ─────────────────────────────────────────────────────────────

interface ReviewCardProps {
  data?: Stage1PipelineData | null
  onAccept?: () => void
  onEdit?: (additionalText: string) => void
  onReject?: () => void
  isSubmitting?: boolean
}

export function ReviewCard({
  data,
  onAccept,
  onEdit,
  onReject,
  isSubmitting = false,
}: ReviewCardProps) {
  const [editOpen, setEditOpen] = useState(false)
  const [editText, setEditText] = useState("")

  function openEdit() {
    setEditText(buildEditPrefill(data))
    setEditOpen(true)
  }

  function submitEdit() {
    onEdit?.(editText)
    setEditOpen(false)
    setEditText("")
  }

  return (
    <Card className="border-0 bg-gradient-to-r from-rose-50/80 to-violet-50/80 backdrop-blur-sm">
      <CardContent className="p-6">
        <h4 className="font-semibold text-foreground mb-4">Review Before Proceeding</h4>

        {editOpen && (
          <div className="mb-4 space-y-2">
            <p className="text-sm text-muted-foreground">
              Add corrections or additional context below. The pipeline will re-run with your input.
            </p>
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={6}
              className="w-full rounded-lg border border-border bg-white/80 p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none"
              placeholder="Enter corrections or additional context…"
            />
            <div className="flex gap-2">
              <Button
                onClick={submitEdit}
                disabled={isSubmitting || !editText.trim()}
                className="brand-gradient text-white border-0"
              >
                <Check className="h-4 w-4 mr-2" />
                Submit Edits
              </Button>
              <Button
                variant="outline"
                onClick={() => setEditOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {!editOpen && (
          <div className="flex flex-wrap gap-3">
            <Button
              className="brand-gradient text-white border-0"
              onClick={onAccept}
              disabled={isSubmitting}
            >
              <Check className="h-4 w-4 mr-2" />
              Accept & Proceed
            </Button>
            <Button
              variant="outline"
              className="border-violet-200 hover:bg-violet-50"
              onClick={openEdit}
              disabled={isSubmitting}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit Manually
            </Button>
            <Button
              variant="outline"
              className="border-red-200 hover:bg-red-50 text-red-600"
              onClick={onReject}
              disabled={isSubmitting}
            >
              <X className="h-4 w-4 mr-2" />
              Reject & Re-run
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
