import { Cell, Pie, PieChart } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const data = [
  { model: "claude-sonnet-4-6", runs: 4210, fill: "hsl(var(--chart-1))" },
  { model: "claude-haiku-4-5",  runs: 2880, fill: "hsl(var(--chart-2))" },
  { model: "claude-opus-4-8",   runs: 890,  fill: "hsl(var(--chart-3))" },
  { model: "claude-sonnet-3-7", runs: 332,  fill: "hsl(var(--chart-4))" },
]

const total = data.reduce((s, d) => s + d.runs, 0)

const chartConfig = {
  runs: { label: "Runs" },
  "claude-sonnet-4-6": { label: "Sonnet 4.6", color: "hsl(var(--chart-1))" },
  "claude-haiku-4-5":  { label: "Haiku 4.5",  color: "hsl(var(--chart-2))" },
  "claude-opus-4-8":   { label: "Opus 4.8",   color: "hsl(var(--chart-3))" },
  "claude-sonnet-3-7": { label: "Sonnet 3.7", color: "hsl(var(--chart-4))" },
} satisfies ChartConfig

export function ModelBreakdownChart() {
  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Runs by Model</CardTitle>
        <CardDescription>Share of pipeline runs per model</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="model" hideLabel />} />
            <Pie
              data={data}
              dataKey="runs"
              nameKey="model"
              cx="50%"
              cy="50%"
              innerRadius="55%"
              outerRadius="75%"
              paddingAngle={3}
            >
              {data.map((entry) => (
                <Cell key={entry.model} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2">
          {data.map((d) => (
            <div key={d.model} className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: d.fill }} />
              <span className="truncate text-xs text-muted-foreground">
                {chartConfig[d.model as keyof typeof chartConfig]?.label}
              </span>
              <span className="ml-auto text-xs font-medium tabular-nums">
                {((d.runs / total) * 100).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
