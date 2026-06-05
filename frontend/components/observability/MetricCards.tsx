import { Card, CardContent } from "@/components/ui/card"
import { Zap, Clock, Activity, AlertTriangle } from "lucide-react"

const metrics = [
  {
    title: "Total Tokens",
    value: "52,140",
    change: "+6%",
    changeType: "positive" as const,
    icon: Zap,
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-500",
    sub: "yesterday – today",
  },
  {
    title: "Avg Latency",
    value: "0.78s",
    change: "-4%",
    changeType: "positive" as const,
    icon: Clock,
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-500",
    sub: "p50 response",
  },
  {
    title: "Total Runs",
    value: "40",
    change: "+8%",
    changeType: "positive" as const,
    icon: Activity,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    sub: "pipeline executions",
  },
  {
    title: "Error Rate",
    value: "2.5%",
    change: "+0.5%",
    changeType: "negative" as const,
    icon: AlertTriangle,
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-500",
    sub: "yesterday – today",
  },
]

export function MetricCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((m) => (
        <Card key={m.title} className="border-border/60 bg-card shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{m.title}</p>
                <p className="text-2xl font-semibold tracking-tight">{m.value}</p>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${m.iconBg}`}>
                <m.icon className={`h-5 w-5 ${m.iconColor}`} />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1.5">
              <span className="text-sm font-medium text-emerald-600">{m.change}</span>
              <span className="text-sm text-muted-foreground">{m.sub}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
