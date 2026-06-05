"use client"

import { MetricCards } from "@/components/observability/MetricCards"
import { TokenUsageChart } from "@/components/observability/TokenUsageChart"
import { LatencyChart } from "@/components/observability/LatencyChart"
import { ModelBreakdownChart } from "@/components/observability/ModelBreakdownChart"
import { RunsChart } from "@/components/observability/RunsChart"

export default function ObservabilityPage() {
  return (
    <div className="flex flex-col gap-8 p-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Observability</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Monitor token usage, latency, and pipeline health across all AI runs.
        </p>
      </div>

      <MetricCards />

      <div className="grid gap-6 lg:grid-cols-2">
        <TokenUsageChart />
        <LatencyChart />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RunsChart />
        </div>
        <ModelBreakdownChart />
      </div>
    </div>
  )
}
