"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import {
  TrendingUp,
  FileText,
  Target,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  Sparkles,
  Users,
} from "lucide-react"
import Link from "next/link"

// ── Data ────────────────────────────────────────────────────────────────────

const monthlyProposals = [
  { month: "Dec", proposals: 18, approved: 13 },
  { month: "Jan", proposals: 22, approved: 15 },
  { month: "Feb", proposals: 19, approved: 14 },
  { month: "Mar", proposals: 28, approved: 20 },
  { month: "Apr", proposals: 31, approved: 22 },
  { month: "May", proposals: 34, approved: 24 },
]

const revenueTrend = [
  { month: "Dec", revenue: 1820 },
  { month: "Jan", revenue: 2150 },
  { month: "Feb", revenue: 1950 },
  { month: "Mar", revenue: 2680 },
  { month: "Apr", revenue: 3120 },
  { month: "May", revenue: 3450 },
]

const tierDistribution = [
  { name: "Standard", value: 18, fill: "#8b5cf6" },
  { name: "Premium", value: 9, fill: "#f43f5e" },
  { name: "Budget", value: 7, fill: "#10b981" },
]

const agentPerformance = [
  { agent: "Budget Validator", confidence: 94 },
  { agent: "Compatibility", confidence: 92 },
  { agent: "Extraction", confidence: 91 },
  { agent: "Catalog RAG", confidence: 89 },
  { agent: "Proposal Gen", confidence: 88 },
]

const recentConsultations = [
  {
    id: "1",
    client: "Acme Logistics Corp",
    product: "Nexus WMS",
    value: "RM 436,500",
    status: "completed",
    statusLabel: "Completed",
    time: "2h ago",
  },
  {
    id: "2",
    client: "SkyMall Retail Sdn Bhd",
    product: "Nexus OMS",
    value: "RM 195,800",
    status: "hitl",
    statusLabel: "Awaiting Review",
    time: "4h ago",
  },
  {
    id: "3",
    client: "Petron Chem Bhd",
    product: "Nexus TMS",
    value: "RM 312,000",
    status: "processing",
    statusLabel: "AI Processing",
    time: "6h ago",
  },
  {
    id: "4",
    client: "FreshMart Distribution",
    product: "WMS + TMS Bundle",
    value: "RM 589,000",
    status: "completed",
    statusLabel: "Completed",
    time: "1d ago",
  },
  {
    id: "5",
    client: "MyStore Group Bhd",
    product: "Nexus OMS",
    value: "RM 178,400",
    status: "draft",
    statusLabel: "Draft",
    time: "1d ago",
  },
]

const statusStyle: Record<string, string> = {
  completed: "bg-emerald-100 text-emerald-700",
  hitl: "bg-amber-100 text-amber-700",
  processing: "bg-violet-100 text-violet-700",
  draft: "bg-muted text-muted-foreground",
}

// ── Chart configs ────────────────────────────────────────────────────────────

const proposalsChartConfig: ChartConfig = {
  proposals: { label: "Generated", color: "#f43f5e" },
  approved: { label: "Approved", color: "#8b5cf6" },
}

const revenueChartConfig: ChartConfig = {
  revenue: { label: "Revenue (RM '000)", color: "#f43f5e" },
}

const agentChartConfig: ChartConfig = {
  confidence: { label: "Confidence %", color: "#8b5cf6" },
}

const tierChartConfig: ChartConfig = {
  Standard: { label: "Standard", color: "#8b5cf6" },
  Premium: { label: "Premium", color: "#f43f5e" },
  Budget: { label: "Budget", color: "#10b981" },
}

// ── Stats ────────────────────────────────────────────────────────────────────

const stats = [
  {
    label: "Active Consultations",
    value: "12",
    sub: "+3 this week",
    icon: Users,
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-500",
    trend: true,
  },
  {
    label: "Proposals This Month",
    value: "34",
    sub: "+10% vs last month",
    icon: FileText,
    iconBg: "bg-rose-500/10",
    iconColor: "text-rose-500",
    trend: true,
  },
  {
    label: "Avg Deal Value",
    value: "RM 218.5k",
    sub: "Across all tiers",
    icon: Target,
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-500",
    trend: false,
  },
  {
    label: "Pipeline Win Rate",
    value: "71%",
    sub: "+4pp vs last quarter",
    icon: TrendingUp,
    iconBg: "bg-violet-500/10",
    iconColor: "text-violet-500",
    trend: true,
  },
  {
    label: "Avg Time to Proposal",
    value: "14 min",
    sub: "Down from 3.2 hrs manual",
    icon: Clock,
    iconBg: "bg-amber-500/10",
    iconColor: "text-amber-500",
    trend: false,
  },
  {
    label: "Proposals Approved",
    value: "24",
    sub: "This month · 71% approval",
    icon: CheckCircle2,
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-500",
    trend: true,
  },
]

// ── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-2">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl brand-gradient">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Dashboard</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Live overview of your AI-powered sales pipeline — proposals generated, deals in progress, and agent performance.
          </p>
        </div>

        {/* KPI Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-6">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-0 bg-white/60 backdrop-blur-sm shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${stat.iconBg}`}>
                    <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
                  </div>
                  {stat.trend && (
                    <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" />
                  )}
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
                <p className="text-[11px] text-emerald-600 mt-1">{stat.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid gap-6 lg:grid-cols-[1fr_320px] mb-6">
          {/* Monthly Proposals Bar Chart */}
          <Card className="border-0 bg-white/60 backdrop-blur-sm shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-foreground">
                Proposals Generated vs Approved
              </CardTitle>
              <p className="text-xs text-muted-foreground">Last 6 months</p>
            </CardHeader>
            <CardContent>
              <ChartContainer config={proposalsChartConfig} className="h-[220px] w-full">
                <BarChart data={monthlyProposals} barGap={4}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="proposals" fill="var(--color-proposals)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="approved" fill="var(--color-approved)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Tier Distribution Pie */}
          <Card className="border-0 bg-white/60 backdrop-blur-sm shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-foreground">
                Proposal Tier Distribution
              </CardTitle>
              <p className="text-xs text-muted-foreground">34 proposals this month</p>
            </CardHeader>
            <CardContent>
              <ChartContainer config={tierChartConfig} className="h-[180px] w-full">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Pie
                    data={tierDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={78}
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="name"
                  />
                </PieChart>
              </ChartContainer>
              <div className="flex items-center justify-center gap-4 pt-1">
                {tierDistribution.map((t) => (
                  <div key={t.name} className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-[2px] shrink-0" style={{ backgroundColor: t.fill }} />
                    <span className="text-xs text-muted-foreground">{t.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2 */}
        <div className="grid gap-6 lg:grid-cols-2 mb-6">
          {/* Revenue Trend Area Chart */}
          <Card className="border-0 bg-white/60 backdrop-blur-sm shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-foreground">
                Pipeline Revenue Trend
              </CardTitle>
              <p className="text-xs text-muted-foreground">Total proposal value, RM '000</p>
            </CardHeader>
            <CardContent>
              <ChartContainer config={revenueChartConfig} className="h-[200px] w-full">
                <AreaChart data={revenueTrend}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}`} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    fill="url(#revenueGrad)"
                    dot={{ fill: "#f43f5e", r: 3 }}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Agent Confidence Bar Chart */}
          <Card className="border-0 bg-white/60 backdrop-blur-sm shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-foreground">
                Agent Confidence Scores
              </CardTitle>
              <p className="text-xs text-muted-foreground">Average across all sessions this month</p>
            </CardHeader>
            <CardContent>
              <ChartContainer config={agentChartConfig} className="h-[200px] w-full">
                <BarChart
                  data={agentPerformance}
                  layout="vertical"
                  margin={{ left: 8, right: 16 }}
                >
                  <CartesianGrid horizontal={false} strokeDasharray="3 3" />
                  <XAxis type="number" domain={[80, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                  <YAxis
                    dataKey="agent"
                    type="category"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 10 }}
                    width={88}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    formatter={(value) => [`${value}%`, "Confidence"]}
                  />
                  <Bar dataKey="confidence" fill="var(--color-confidence)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Consultations */}
        <Card className="border-0 bg-white/60 backdrop-blur-sm shadow-sm">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold text-foreground">Recent Consultations</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Latest AI-generated proposals</p>
            </div>
            <Link
              href="/consult"
              className="text-xs font-medium text-rose-500 hover:text-rose-600 transition-colors"
            >
              View all →
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {recentConsultations.map((c) => (
                <div key={c.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-muted/30 transition-colors">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{c.client}</p>
                    <p className="text-xs text-muted-foreground">{c.product}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-foreground">{c.value}</p>
                    <p className="text-xs text-muted-foreground">{c.time}</p>
                  </div>
                  <span className={`shrink-0 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyle[c.status]}`}>
                    {c.statusLabel}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
