import { notFound } from "next/navigation"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Building2,
  Cloud,
  Server,
  Layers,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  ClipboardList,
  Wrench,
} from "lucide-react"
import type { SalesCase, ModuleDecision, IssueFaced, TeamMember } from "@/types/sales"

const deploymentIcons: Record<string, React.ReactNode> = {
  cloud_saas: <Cloud className="h-4 w-4" />,
  on_premise: <Server className="h-4 w-4" />,
  hybrid: <Layers className="h-4 w-4" />,
}

const segmentColors: Record<string, string> = {
  SME: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  Startup: "bg-violet-500/10 text-violet-600 border-violet-500/20",
  "Mid-Market": "bg-blue-500/10 text-blue-600 border-blue-500/20",
  MNC: "bg-amber-500/10 text-amber-600 border-amber-500/20",
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^./, (c) => c.toUpperCase())
    .trim()
}

function decisionIcon(decision: string) {
  const d = decision.toUpperCase()
  if (d.startsWith("INCLUDED")) return <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
  if (d.startsWith("NOT SOLD")) return <XCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
  return <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
}

function ModuleRationaleRow({ item }: { item: ModuleDecision }) {
  return (
    <div className="flex gap-3 py-3 border-b last:border-0">
      {decisionIcon(item.decision)}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className="font-mono text-sm font-semibold">{item.module}</span>
          <Badge
            variant="outline"
            className={`text-xs ${
              item.decision.toUpperCase().startsWith("INCLUDED")
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-rose-50 text-rose-600 border-rose-200"
            }`}
          >
            {item.decision}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{item.rationale}</p>
      </div>
    </div>
  )
}

function IssueRow({ item }: { item: IssueFaced }) {
  return (
    <div className="space-y-2 py-3 border-b last:border-0">
      <div className="flex gap-2">
        <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-sm font-medium">{item.issue}</p>
      </div>
      <div className="flex gap-2 pl-6">
        <Lightbulb className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground">{item.resolution}</p>
      </div>
    </div>
  )
}

function TeamTable({ members, label }: { members: TeamMember[]; label: string }) {
  const total = members.reduce((s, m) => s + m.headcount * m.effortDays, 0)
  return (
    <div>
      <p className="text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wide text-xs">
        {label}
      </p>
      <div className="space-y-1">
        {members.map((m, i) => (
          <div key={i} className="flex justify-between text-sm py-1 border-b last:border-0">
            <span className="text-muted-foreground">{m.role}</span>
            <span className="font-medium tabular-nums">
              {m.headcount} × {m.effortDays}d
            </span>
          </div>
        ))}
        <div className="flex justify-between text-sm pt-1 font-semibold">
          <span>Total effort</span>
          <span>{total} days</span>
        </div>
      </div>
    </div>
  )
}

async function getCase(id: string): Promise<SalesCase | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/sales/id/${id}`,
      { cache: "no-store" }
    )
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export default async function SalesCaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const salesCase = await getCase(id)

  if (!salesCase) {
    notFound()
  }

  const dealValue = salesCase.dealSummary.dealValueMYR

  return (
    <main className="bg-background">
      <div className="container mx-auto px-4 py-8">
        <Link href="/past_sales">
          <Button variant="ghost" size="sm" className="mb-6 -ml-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Past Sales
          </Button>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge
              variant="outline"
              className={`capitalize ${segmentColors[salesCase.client.segment] ?? "bg-muted"}`}
            >
              {salesCase.client.segment}
            </Badge>
            <Badge variant="outline" className="gap-1.5">
              {deploymentIcons[salesCase.dealSummary.deploymentOption]}
              <span className="capitalize">
                {salesCase.dealSummary.deploymentOption.replace(/_/g, " ")}
              </span>
            </Badge>
            <span className="text-sm text-muted-foreground font-mono">{salesCase.caseCode}</span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight mb-2">{salesCase.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Building2 className="h-4 w-4" />
              <span>{salesCase.client.name}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>Closed {salesCase.closedDate}</span>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Client Background */}
            <section>
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Client Background
              </h2>
              <p className="text-muted-foreground leading-relaxed">{salesCase.clientBackground}</p>
            </section>

            <Separator />

            {/* Requirements & Pain Points */}
            <section>
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <ClipboardList className="h-5 w-5" />
                Requirements & Pain Points
              </h2>
              <ul className="space-y-2">
                {salesCase.requirementsAndPainPoints.map((point, i) => (
                  <li key={i} className="flex gap-3 text-sm text-muted-foreground">
                    <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </section>

            <Separator />

            {/* Module Decision Rationale */}
            <section>
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Module Decision Rationale
              </h2>
              <div>
                {salesCase.moduleDecisionRationale.map((item, i) => (
                  <ModuleRationaleRow key={i} item={item} />
                ))}
              </div>
            </section>

            <Separator />

            {/* Implementation Team */}
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Users className="h-5 w-5" />
                Implementation Team
              </h2>
              <div className="grid gap-6 sm:grid-cols-2">
                <Card>
                  <CardContent className="pt-5">
                    <TeamTable
                      members={salesCase.implementationTeam.vendorSide}
                      label="Vendor Side"
                    />
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-5">
                    <TeamTable
                      members={salesCase.implementationTeam.clientSide}
                      label="Client Side"
                    />
                  </CardContent>
                </Card>
              </div>
            </section>

            {salesCase.issuesFaced.length > 0 && (
              <>
                <Separator />
                <section>
                  <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <Wrench className="h-5 w-5" />
                    Issues & Resolutions
                  </h2>
                  <div>
                    {salesCase.issuesFaced.map((item, i) => (
                      <IssueRow key={i} item={item} />
                    ))}
                  </div>
                </section>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Deal Summary */}
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Deal Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total First Year</p>
                  <p className="text-2xl font-bold">{formatCurrency(dealValue.totalFirstYear)}</p>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  {Object.entries(dealValue)
                    .filter(([k]) => k !== "totalFirstYear")
                    .map(([k, v]) =>
                      v !== undefined ? (
                        <div key={k} className="flex justify-between">
                          <span className="text-muted-foreground">{formatLabel(k)}</span>
                          <span className="font-medium">{formatCurrency(v as number)}</span>
                        </div>
                      ) : null
                    )}
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Contract</span>
                    <span className="font-medium capitalize">{salesCase.dealSummary.contractTerm}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Named Users</span>
                    <span className="font-medium">{salesCase.dealSummary.namedUsers}</span>
                  </div>
                  {salesCase.dealSummary.additionalUsers > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Additional Users</span>
                      <span className="font-medium">+{salesCase.dealSummary.additionalUsers}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Go-live</span>
                    <span className="font-medium">{salesCase.dealSummary.goLiveWeeks} weeks</span>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium mb-2">Modules Sold</p>
                  <div className="flex flex-wrap gap-1.5">
                    {salesCase.dealSummary.modulesSold.map((mod) => (
                      <Badge key={mod} variant="outline" className="text-xs font-mono">
                        {mod}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Account Executive</span>
                    <span className="font-medium text-right max-w-[60%]">{salesCase.accountExecutive}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Solution Engineer</span>
                    <span className="font-medium text-right max-w-[60%]">{salesCase.solutionEngineer}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Outcomes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Outcomes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                {Object.entries(salesCase.outcomes).map(([k, v]) =>
                  v !== undefined ? (
                    <div key={k} className="flex justify-between gap-2 py-1 border-b last:border-0">
                      <span className="text-muted-foreground">{formatLabel(k)}</span>
                      <span className="font-medium text-right">
                        {k === "paybackMonths" ? `${v} months` : String(v)}
                      </span>
                    </div>
                  ) : null
                )}
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {salesCase.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
