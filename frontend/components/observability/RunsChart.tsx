import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
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
  { date: "Jun 5 (Yesterday)", success: 29, failed: 1 },
  { date: "Jun 6 (Today)",     success: 10, failed: 0 },
]

const chartConfig = {
  success: { label: "Success", color: "hsl(var(--chart-2))" },
  failed:  { label: "Failed",  color: "hsl(var(--chart-5))" },
} satisfies ChartConfig

export function RunsChart() {
  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Pipeline Runs</CardTitle>
        <CardDescription>Successful vs failed executions — yesterday &amp; today · gpt-4o-mini</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <BarChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} width={36} />
            <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
            <Bar dataKey="success" stackId="a" fill="var(--color-success)" radius={[0, 0, 0, 0]} />
            <Bar dataKey="failed"  stackId="a" fill="var(--color-failed)"  radius={[4, 4, 0, 0]} />
            <ChartLegend content={<ChartLegendContent />} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
