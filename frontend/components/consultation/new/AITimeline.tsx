"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Brain, Search, AlertTriangle, Puzzle, CheckCircle2 } from "lucide-react"

const steps = [
  {
    id: 1,
    label: "Ingesting document",
    icon: FileText,
    duration: 800,
  },
  {
    id: 2,
    label: "Extracting entities (budget, timeline, stakeholders)",
    icon: Brain,
    duration: 1200,
  },
  {
    id: 3,
    label: "Detecting missing information",
    icon: Search,
    duration: 1000,
  },
  {
    id: 4,
    label: "Evaluating risks",
    icon: AlertTriangle,
    duration: 1000,
  },
  {
    id: 5,
    label: "Structuring sales brief",
    icon: Puzzle,
    duration: 1500,
  },
]

export function AiTimeline() {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  useEffect(() => {
    let totalDelay = 0

    steps.forEach((step, index) => {
      // Start step
      setTimeout(() => {
        setCurrentStep(index + 1)
      }, totalDelay)

      totalDelay += step.duration

      // Complete step
      setTimeout(() => {
        setCompletedSteps((prev) => [...prev, step.id])
      }, totalDelay)
    })
  }, [])

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="w-full max-w-xl border-0 bg-white/70 backdrop-blur-md shadow-xl shadow-violet-100/30">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl brand-gradient mb-4">
              <Brain className="h-8 w-8 text-white animate-pulse" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">AI Processing</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Analyzing your document with advanced NLP
            </p>
          </div>

          <div className="space-y-4">
            {steps.map((step) => {
              const isActive = currentStep === step.id
              const isCompleted = completedSteps.includes(step.id)
              const isPending = currentStep < step.id

              const Icon = step.icon

              return (
                <div
                  key={step.id}
                  className={`flex items-center gap-4 rounded-xl p-4 transition-all duration-500 ${
                    isActive
                      ? "bg-gradient-to-r from-rose-50 to-violet-50 shadow-md"
                      : isCompleted
                      ? "bg-emerald-50/50"
                      : "bg-muted/30"
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
                      isActive
                        ? "brand-gradient"
                        : isCompleted
                        ? "bg-emerald-500"
                        : "bg-muted"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-white" />
                    ) : (
                      <Icon
                        className={`h-5 w-5 ${
                          isActive ? "text-white animate-pulse" : "text-muted-foreground"
                        }`}
                      />
                    )}
                  </div>

                  {/* Label */}
                  <div className="flex-1">
                    <p
                      className={`font-medium transition-colors ${
                        isActive
                          ? "text-foreground"
                          : isCompleted
                          ? "text-emerald-700"
                          : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>

                  {/* Status */}
                  {isActive && (
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-rose-400 animate-pulse" />
                      <div className="h-2 w-2 rounded-full bg-rose-400 animate-pulse delay-75" />
                      <div className="h-2 w-2 rounded-full bg-rose-400 animate-pulse delay-150" />
                    </div>
                  )}
                  {isCompleted && (
                    <span className="text-xs font-medium text-emerald-600">Done</span>
                  )}
                  {isPending && (
                    <span className="text-xs text-muted-foreground">Pending</span>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
