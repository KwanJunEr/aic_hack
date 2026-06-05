import { Cell, Pie, PieChart } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const data = [
  { stage: "stage1", runs: 18, fill: "hsl(var(--chart-1))" },
  { stage: "stage2", runs: 14, fill: "hsl(var(--chart-2))" },
  { stage: "stage3", runs: 8,  fill: "hsl(var(--chart-3))" },
]

const total = data.reduce((s, d) => s + d.runs, 0)

const chartConfig = {
  runs:   { label: "Runs" },
  stage1: { label: "Stage 1 · Extraction", color: "hsl(var(--chart-1))" },
  stage2: { label: "Stage 2 · Matching",   color: "hsl(var(--chart-2))" },
  stage3: { label: "Stage 3 · Proposal",   color: "hsl(var(--chart-3))" },
} satisfies ChartConfig

export function ModelBreakdownChart() {
  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Runs by Pipeline Stage</CardTitle>
        <CardDescription>Share of runs per stage · gpt-4o-mini</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="stage" hideLabel />} />
            <Pie
              data={data}
              dataKey="runs"
              nameKey="stage"
              cx="50%"
              cy="50%"
              innerRadius="55%"
              outerRadius="75%"
              paddingAngle={3}
            >
              {data.map((entry) => (
                <Cell key={entry.stage} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="mt-3 grid grid-cols-1 gap-y-2">
          {data.map((d) => (
            <div key={d.stage} className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: d.fill }} />
              <span className="truncate text-xs text-muted-foreground">
                {chartConfig[d.stage as keyof typeof chartConfig]?.label}
              </span>
              <span className="ml-auto text-xs font-medium tabular-nums">
                {d.runs} runs · {((d.runs / total) * 100).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
