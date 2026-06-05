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
  { date: "Jun 1", input: 42000, output: 18000 },
  { date: "Jun 2", input: 61000, output: 24000 },
  { date: "Jun 3", input: 55000, output: 21000 },
  { date: "Jun 4", input: 78000, output: 31000 },
  { date: "Jun 5", input: 92000, output: 38000 },
  { date: "Jun 6", input: 84000, output: 35000 },
  { date: "Jun 7", input: 110000, output: 44000 },
  { date: "Jun 8", input: 97000, output: 40000 },
  { date: "Jun 9", input: 125000, output: 51000 },
  { date: "Jun 10", input: 118000, output: 48000 },
  { date: "Jun 11", input: 143000, output: 57000 },
  { date: "Jun 12", input: 136000, output: 54000 },
  { date: "Jun 13", input: 158000, output: 63000 },
  { date: "Jun 14", input: 172000, output: 69000 },
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

const formatK = (v: number) => `${(v / 1000).toFixed(0)}k`

export function TokenUsageChart() {
  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Token Usage Over Time</CardTitle>
        <CardDescription>Daily input vs output tokens — last 14 days</CardDescription>
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
