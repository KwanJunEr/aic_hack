import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Cloud, Server, Layers, TrendingUp, DollarSign, Calendar } from "lucide-react"
import type { SalesCase } from "@/types/sales"

interface CaseCardProps {
  salesCase: SalesCase
}

const deploymentIcons: Record<string, React.ReactNode> = {
  cloud_saas: <Cloud className="h-3.5 w-3.5" />,
  on_premise: <Server className="h-3.5 w-3.5" />,
  hybrid: <Layers className="h-3.5 w-3.5" />,
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
    notation: "compact",
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(amount)
}

export function CaseCard({ salesCase }: CaseCardProps) {
  const totalValue = salesCase.dealSummary.dealValueMYR.totalFirstYear

  return (
    <Link href={`/past_sales/${salesCase.id}`}>
      <Card className="group h-full transition-all duration-200 hover:shadow-lg hover:border-primary/50 cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start gap-2 mb-2">
            <Badge
              variant="outline"
              className={`text-xs shrink-0 ${segmentColors[salesCase.client.segment] ?? "bg-muted"}`}
            >
              {salesCase.client.segment}
            </Badge>
            <Badge variant="secondary" className="text-xs gap-1 shrink-0">
              {deploymentIcons[salesCase.dealSummary.deploymentOption]}
              <span className="capitalize">
                {salesCase.dealSummary.deploymentOption.replace(/_/g, " ")}
              </span>
            </Badge>
          </div>
          <CardTitle className="text-base leading-tight group-hover:text-primary transition-colors">
            {salesCase.title}
          </CardTitle>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
            <Building2 className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate font-medium">{salesCase.client.name}</span>
            <span className="text-muted-foreground/40">·</span>
            <span className="text-xs truncate">{salesCase.client.industry}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-1">
            {salesCase.dealSummary.modulesSold.slice(0, 3).map((mod) => (
              <Badge key={mod} variant="outline" className="text-xs font-mono">
                {mod}
              </Badge>
            ))}
            {salesCase.dealSummary.modulesSold.length > 3 && (
              <Badge variant="outline" className="text-xs text-muted-foreground">
                +{salesCase.dealSummary.modulesSold.length - 3} more
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap gap-1">
            {salesCase.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="pt-2 border-t grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="flex items-center justify-center mb-0.5 text-muted-foreground">
                <DollarSign className="h-3 w-3" />
              </div>
              <p className="text-xs font-semibold">{formatCurrency(totalValue)}</p>
              <p className="text-xs text-muted-foreground">Deal Value</p>
            </div>
            <div>
              <div className="flex items-center justify-center mb-0.5 text-muted-foreground">
                <TrendingUp className="h-3 w-3" />
              </div>
              <p className="text-xs font-semibold">
                {salesCase.outcomes.paybackMonths ? `${salesCase.outcomes.paybackMonths}mo` : "—"}
              </p>
              <p className="text-xs text-muted-foreground">Payback</p>
            </div>
            <div>
              <div className="flex items-center justify-center mb-0.5 text-muted-foreground">
                <Calendar className="h-3 w-3" />
              </div>
              <p className="text-xs font-semibold">{salesCase.dealSummary.goLiveWeeks}w</p>
              <p className="text-xs text-muted-foreground">Go-live</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
