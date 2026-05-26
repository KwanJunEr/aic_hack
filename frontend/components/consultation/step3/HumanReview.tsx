"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle2, RotateCcw, Edit3, MessageSquare } from "lucide-react"

interface HumanReviewProps {
  onRerun: () => void
}

export function HumanReview({ onRerun }: HumanReviewProps) {
  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
          <MessageSquare className="h-5 w-5 text-violet-500" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Human-in-the-Loop Review</h3>
          <p className="text-sm text-muted-foreground">Review the generated proposal before finalizing</p>
        </div>
      </div>

      {/* Review Checklist */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {[
          { label: "Executive Summary", status: "verified" },
          { label: "Scope Accuracy", status: "verified" },
          { label: "Pricing Correct", status: "verified" },
          { label: "Terms & SLAs", status: "needs-review" },
        ].map((item) => (
          <div
            key={item.label}
            className={`rounded-xl p-4 ${
              item.status === "verified"
                ? "bg-emerald-500/10 border border-emerald-500/20"
                : "bg-amber-500/10 border border-amber-500/20"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              {item.status === "verified" ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              ) : (
                <Edit3 className="h-4 w-4 text-amber-500" />
              )}
              <span className="text-sm font-medium text-foreground">{item.label}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {item.status === "verified" ? "Auto-verified by AI" : "Manual review suggested"}
            </p>
          </div>
        ))}
      </div>

      {/* Feedback Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-2">
          Add Notes or Feedback (Optional)
        </label>
        <textarea
          placeholder="Enter any adjustments, comments, or special instructions for this proposal..."
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-rose-500/50 resize-none"
          rows={3}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <button
          onClick={onRerun}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          Regenerate Proposal
        </button>
        <div className="flex items-center gap-3">
          <Button className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors">
            <Edit3 className="h-4 w-4" />
            Edit Manually
          </Button>
          <button className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white bg-emerald-500 shadow-lg shadow-emerald-500/25 hover:bg-emerald-600 transition-colors">
            <CheckCircle2 className="h-4 w-4" />
            Approve Proposal
          </button>
        </div>
      </div>
    </div>
  )
}
