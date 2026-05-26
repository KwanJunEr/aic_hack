"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Brain, ChevronDown, ChevronUp, Sparkles } from "lucide-react"

const steps = [
  {
    agent: "Requirement Extractor",
    color: "text-rose-500",
    bg: "bg-rose-50",
    border: "border-rose-100",
    dot: "bg-rose-400",
    thoughts: [
      "Identified 3 hard constraints: budget RM50k, 3-month deadline, legacy Oracle integration.",
      "Detected soft constraint: small IT team implies low-maintenance solution preference.",
      "Flagged missing info: no mention of concurrent users or uptime SLA.",
    ],
  },
  {
    agent: "Gap Detector",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
    dot: "bg-amber-400",
    thoughts: [
      "Cross-referenced extracted requirements against standard discovery checklist.",
      "Gap found: security & compliance requirements not discussed — flagged as HIGH priority.",
      "Gap found: post-deployment support expectations unclear.",
    ],
  },
  {
    agent: "Deal Scorer",
    color: "text-violet-500",
    bg: "bg-violet-50",
    border: "border-violet-100",
    dot: "bg-violet-400",
    thoughts: [
      "Budget RM50k is below average for Oracle integration projects — risk of scope creep.",
      "Q2 deadline is achievable only with phased delivery — recommended to flag to client.",
      "Overall confidence 87% based on clarity of budget and timeline signals.",
    ],
  },
]

export function ChainOfThoughtsCard() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <Card className="border-0 bg-white/70 backdrop-blur-md shadow-xl shadow-violet-100/30 overflow-hidden">
      <div className="px-6 py-4 border-b border-border/50 flex items-center gap-2">
        <Brain className="h-4 w-4 text-violet-500" />
        <h3 className="font-semibold text-foreground text-sm">Agent Chain of Thought</h3>
        <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700">
          <Sparkles className="h-3 w-3" />
          3 agents
        </span>
      </div>

      <CardContent className="p-4 space-y-2">
        {steps.map((step, i) => {
          const isOpen = openIndex === i
          return (
            <div
              key={step.agent}
              className={`rounded-xl border transition-all duration-200 overflow-hidden ${step.border} ${isOpen ? step.bg : "bg-white/60"}`}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex items-center justify-between px-4 py-3 text-left"
              >
                <div className="flex items-center gap-2.5">
                  <span className={`h-2 w-2 rounded-full shrink-0 ${step.dot}`} />
                  <span className={`text-sm font-medium ${step.color}`}>{step.agent}</span>
                </div>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-4 pb-4 space-y-2">
                  {step.thoughts.map((thought, j) => (
                    <div key={j} className="flex gap-2.5 text-xs">
                      <span className="text-muted-foreground font-mono mt-0.5 shrink-0">{j + 1}.</span>
                      <p className="text-foreground/80 leading-relaxed">{thought}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
