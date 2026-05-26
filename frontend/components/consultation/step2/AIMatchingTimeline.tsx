"use client"

import { useState, useEffect } from "react"
import { Check, Loader2, Search, Layers, GitBranch, CheckCircle } from "lucide-react"

const steps = [
  {
    id: 1,
    label: "Loading requirement context",
    icon: Layers,
    detail: "Parsing 5 extracted requirements...",
  },
  {
    id: 2,
    label: "Querying catalog via Agentic RAG",
    icon: Search,
    detail: "Searching across 156 product SKUs...",
  },
  {
    id: 3,
    label: "Matched 2 relevant products",
    icon: CheckCircle,
    detail: "Nexus WMS, Nexus TMS identified...",
  },
  {
    id: 4,
    label: "Validating compatibility matrix",
    icon: GitBranch,
    detail: "Checking module dependencies...",
  },
  {
    id: 5,
    label: "Building optimized solution set",
    icon: Check,
    detail: "Generating recommendation with 4 modules...",
  },
]

export function AiMatchingTimeline() {
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length) {
          return prev + 1
        }
        return prev
      })
    }, 800)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-full max-w-xl">
        {/* Glassmorphic card */}
        <div className="rounded-2xl border border-white/20 bg-white/60 backdrop-blur-xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl brand-gradient">
              <Search className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">AI Catalog Matching</h2>
              <p className="text-sm text-muted-foreground">Analyzing requirements and finding best products...</p>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            {steps.map((step, index) => {
              const isComplete = index < currentStep
              const isActive = index === currentStep
              const isPending = index > currentStep
              const Icon = step.icon

              return (
                <div
                  key={step.id}
                  className={`flex items-start gap-4 transition-all duration-300 ${
                    isPending ? "opacity-40" : "opacity-100"
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-300 ${
                      isComplete
                        ? "bg-emerald-100 text-emerald-600"
                        : isActive
                        ? "brand-gradient text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isComplete ? (
                      <Check className="h-4 w-4" />
                    ) : isActive ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-0.5">
                    <p
                      className={`text-sm font-medium ${
                        isComplete || isActive ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </p>
                    {(isActive || isComplete) && (
                      <p className="text-xs text-muted-foreground mt-0.5">{step.detail}</p>
                    )}
                  </div>

                  {/* Connector line */}
                  {index < steps.length - 1 && (
                    <div
                      className={`absolute left-4 mt-8 h-4 w-px ${
                        isComplete ? "bg-emerald-300" : "bg-border"
                      }`}
                    />
                  )}
                </div>
              )
            })}
          </div>

          {/* Progress bar */}
          <div className="mt-6 pt-4 border-t border-border/50">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <span>Processing</span>
              <span>{Math.round((currentStep / steps.length) * 100)}%</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full brand-gradient transition-all duration-500 ease-out"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
