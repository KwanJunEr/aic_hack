import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Cloud, Server, Layers } from "lucide-react"
import type { Product } from "@/types/product"

interface SolutionCardProps {
  solution: Product
}

const deploymentIcons: Record<string, React.ReactNode> = {
  cloud_saas: <Cloud className="h-3.5 w-3.5" />,
  on_premise: <Server className="h-3.5 w-3.5" />,
  hybrid: <Layers className="h-3.5 w-3.5" />,
}

const tierColors: Record<string, string> = {
  enterprise: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  professional: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  starter: "bg-green-500/10 text-green-600 border-green-500/20",
}

const categoryLabels: Record<string, string> = {
  warehouse_management: "Warehouse Management",
  transportation: "Transportation",
  order_management: "Order Management",
  inventory: "Inventory",
}

export function SolutionCard({ solution }: SolutionCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-MY", {
      style: "currency",
      currency: "MYR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <Link href={`/catalog/${solution.id}`}>
      <Card className="group h-full transition-all duration-200 hover:shadow-lg hover:border-primary/50 cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  variant="outline"
                  className={`text-xs capitalize ${tierColors[solution.tier] || "bg-muted"}`}
                >
                  {solution.tier}
                </Badge>
                <span className="text-xs text-muted-foreground">v{solution.version}</span>
              </div>
              <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                {solution.productName}
              </CardTitle>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
            <Building2 className="h-3.5 w-3.5" />
            <span>{solution.vendor}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <CardDescription className="line-clamp-3">
            {solution.description}
          </CardDescription>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Category:</span>
              <span>{categoryLabels[solution.category] || solution.category}</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {solution.deploymentOptions.map((option) => (
                <Badge key={option} variant="secondary" className="text-xs gap-1">
                  {deploymentIcons[option]}
                  {option.replace(/_/g, " ")}
                </Badge>
              ))}
            </div>

            <div className="flex flex-wrap gap-1">
              {solution.targetSegment.slice(0, 4).map((segment) => (
                <Badge key={segment} variant="outline" className="text-xs capitalize">
                  {segment}
                </Badge>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">Starting at</span>
              <div className="text-right">
                <span className="text-lg font-semibold">
                  {formatCurrency(solution.pricing.baseLicense.monthly)}
                </span>
                <span className="text-sm text-muted-foreground">/mo</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {solution.pricing.baseLicense.includedUsers} users included
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
