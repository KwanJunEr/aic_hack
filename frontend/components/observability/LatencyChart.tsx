import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const data = [
  { date: "Jun 1",  p50: 0.92, p90: 1.84, p99: 3.10 },
  { date: "Jun 2",  p50: 1.05, p90: 2.01, p99: 3.45 },
  { date: "Jun 3",  p50: 0.88, p90: 1.72, p99: 2.90 },
  { date: "Jun 4",  p50: 1.20, p90: 2.34, p99: 4.01 },
  { date: "Jun 5",  p50: 1.34, p90: 2.56, p99: 4.30 },
  { date: "Jun 6",  p50: 1.18, p90: 2.22, p99: 3.80 },
  { date: "Jun 7",  p50: 1.42, p90: 2.71, p99: 4.55 },
  { date: "Jun 8",  p50: 1.10, p90: 2.10, p99: 3.60 },
  { date: "Jun 9",  p50: 1.28, p90: 2.45, p99: 4.10 },
  { date: "Jun 10", p50: 1.15, p90: 2.18, p99: 3.70 },
  { date: "Jun 11", p50: 1.35, p90: 2.60, p99: 4.40 },
  { date: "Jun 12", p50: 1.24, p90: 2.38, p99: 3.95 },
  { date: "Jun 13", p50: 1.30, p90: 2.50, p99: 4.20 },
  { date: "Jun 14", p50: 1.22, p90: 2.30, p99: 3.88 },
]

const chartConfig = {
  p50: { label: "P50", color: "hsl(var(--chart-2))" },
  p90: { label: "P90", color: "hsl(var(--chart-3))" },
  p99: { label: "P99", color: "hsl(var(--chart-5))" },
} satisfies ChartConfig

export function LatencyChart() {
  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Response Latency</CardTitle>
        <CardDescription>P50 / P90 / P99 in seconds — last 14 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
            <YAxis
              tickFormatter={(v) => `${v}s`}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11 }}
              width={36}
            />
            <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
            <Line type="monotone" dataKey="p50" stroke="var(--color-p50)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="p90" stroke="var(--color-p90)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="p99" stroke="var(--color-p99)" strokeWidth={2} dot={false} strokeDasharray="5 3" />
            <ChartLegend content={<ChartLegendContent />} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
