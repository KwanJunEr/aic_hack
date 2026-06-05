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
  { date: "Jun 5 (Yesterday)", p50: 0.81, p90: 1.52, p99: 2.70 },
  { date: "Jun 6 (Today)",     p50: 0.75, p90: 1.38, p99: 2.45 },
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
        <CardDescription>P50 / P90 / P99 in seconds — yesterday &amp; today · gpt-4o-mini</CardDescription>
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
