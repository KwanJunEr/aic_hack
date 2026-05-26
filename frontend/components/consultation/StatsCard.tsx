import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Users, FileCheck, Target } from "lucide-react"

const stats = [
  {
    title: "Total Consultations",
    value: "20",
    change: "+12%",
    changeType: "positive" as const,
    icon: Users,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    title: "Deals Closed",
    value: "156",
    change: "+8.2%",
    changeType: "positive" as const,
    icon: FileCheck,
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-600",
  },
  {
    title: "Win Rate",
    value: "62.9%",
    change: "+4.1%",
    changeType: "positive" as const,
    icon: Target,
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-600",
  },
  {
    title: "Avg. Deal Size",
    value: "$42.5K",
    change: "+15%",
    changeType: "positive" as const,
    icon: TrendingUp,
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-600",
  },
]

export function StatsCards() {
  return (
    <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="border-border/60 bg-card shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-semibold tracking-tight text-foreground">
                  {stat.value}
                </p>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.iconBg}`}>
                <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1">
              <span className="text-sm font-medium text-emerald-600">
                {stat.change}
              </span>
              <span className="text-sm text-muted-foreground">vs last month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
