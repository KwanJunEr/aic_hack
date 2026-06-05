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
  { date: "Jun 1",  success: 410, failed: 8  },
  { date: "Jun 2",  success: 530, failed: 12 },
  { date: "Jun 3",  success: 490, failed: 7  },
  { date: "Jun 4",  success: 620, failed: 15 },
  { date: "Jun 5",  success: 710, failed: 18 },
  { date: "Jun 6",  success: 680, failed: 11 },
  { date: "Jun 7",  success: 780, failed: 22 },
  { date: "Jun 8",  success: 740, failed: 14 },
  { date: "Jun 9",  success: 830, failed: 19 },
  { date: "Jun 10", success: 800, failed: 16 },
  { date: "Jun 11", success: 870, failed: 21 },
  { date: "Jun 12", success: 850, failed: 13 },
  { date: "Jun 13", success: 910, failed: 24 },
  { date: "Jun 14", success: 890, failed: 17 },
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
        <CardDescription>Daily successful vs failed executions — last 14 days</CardDescription>
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
