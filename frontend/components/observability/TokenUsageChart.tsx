import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
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
  { date: "Jun 5 (Yesterday)", input: 37200, output: 11800 },
  { date: "Jun 6 (Today)",     input: 2480,  output: 660   },
]

const chartConfig = {
  input: {
    label: "Input Tokens",
    color: "hsl(var(--chart-1))",
  },
  output: {
    label: "Output Tokens",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

const formatK = (v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`

export function TokenUsageChart() {
  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Token Usage Over Time</CardTitle>
        <CardDescription>Input vs output tokens — yesterday &amp; today · gpt-4o-mini</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <AreaChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="fillInput" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-input)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-input)" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="fillOutput" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-output)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-output)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={formatK} tickLine={false} axisLine={false} tick={{ fontSize: 11 }} width={36} />
            <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
            <Area
              type="monotone"
              dataKey="input"
              stroke="var(--color-input)"
              strokeWidth={2}
              fill="url(#fillInput)"
            />
            <Area
              type="monotone"
              dataKey="output"
              stroke="var(--color-output)"
              strokeWidth={2}
              fill="url(#fillOutput)"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
