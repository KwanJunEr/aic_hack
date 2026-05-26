"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, Loader2 } from "lucide-react"

const steps = [
  {
    id: 1,
    label: "Loading validated context",
    description: "Retrieving requirements, products, and pricing data",
  },
  {
    id: 2,
    label: "Structuring proposal sections",
    description: "Organizing executive summary, scope, and deliverables",
  },
  {
    id: 3,
    label: "Generating pricing breakdown",
    description: "Calculating SKU pricing, discounts, and payment terms",
  },
  {
    id: 4,
    label: "Compiling legal terms",
    description: "Adding standard terms, SLAs, and compliance clauses",
  },
  {
    id: 5,
    label: "Finalizing document",
    description: "Formatting and preparing for review",
  },
]

export function ProposalTimeline() {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1
        }
        clearInterval(stepInterval)
        return prev
      })
    }, 700)

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 100) {
          return prev + 2
        }
        clearInterval(progressInterval)
        return 100
      })
    }, 70)

    return () => {
      clearInterval(stepInterval)
      clearInterval(progressInterval)
    }
  }, [])

  return (
    <div className="max-w-2xl mx-auto">
      <div className="glass-card rounded-2xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl brand-gradient mb-4">
            <svg
              className="h-8 w-8 text-white animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Generating Proposal
          </h3>
          <p className="text-sm text-muted-foreground">
            AI is compiling your professional proposal document
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium text-foreground">{progress}%</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full brand-gradient transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const isComplete = index < currentStep
            const isCurrent = index === currentStep
            const isPending = index > currentStep

            return (
              <div
                key={step.id}
                className={`flex items-start gap-4 p-4 rounded-xl transition-all duration-300 ${
                  isCurrent
                    ? "bg-rose-500/10 border border-rose-500/20"
                    : isComplete
                    ? "bg-emerald-500/5"
                    : "bg-muted/30"
                }`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${
                    isComplete
                      ? "bg-emerald-500 text-white"
                      : isCurrent
                      ? "brand-gradient text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isComplete ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : isCurrent ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <span className="text-xs font-medium">{step.id}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium ${
                      isPending ? "text-muted-foreground" : "text-foreground"
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {step.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
