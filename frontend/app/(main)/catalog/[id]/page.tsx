"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Building2,
  Cloud,
  Server,
  Layers,
  Shield,
  Clock,
  CheckCircle2,
  Package,
  Plug,
  ExternalLink,
} from "lucide-react"
import type { Product, ProductModule } from "@/types/product"

const deploymentIcons: Record<string, React.ReactNode> = {
  cloud_saas: <Cloud className="h-4 w-4" />,
  on_premise: <Server className="h-4 w-4" />,
  hybrid: <Layers className="h-4 w-4" />,
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

function formatCurrency(amount: number, currency = "MYR") {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function ModuleCard({ module }: { module: ProductModule }) {
  return (
    <Card className={module.included ? "border-primary/50 bg-primary/5" : ""}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant={module.included ? "default" : "outline"} className="text-xs">
                {module.included ? "Included" : "Add-on"}
              </Badge>
              <span className="text-xs text-muted-foreground font-mono">{module.moduleCode}</span>
            </div>
            <CardTitle className="text-base">{module.moduleName}</CardTitle>
          </div>
          {module.pricing && (
            <div className="text-right shrink-0">
              <p className="font-semibold">{formatCurrency(module.pricing.monthly)}</p>
              <p className="text-xs text-muted-foreground">/month</p>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <CardDescription className="text-sm">{module.description}</CardDescription>
        <div className="space-y-2">
          <p className="text-sm font-medium">Features:</p>
          <ul className="grid gap-1.5">
            {module.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        {module.compatibleSystems && (
          <div className="pt-2">
            <p className="text-sm font-medium mb-1.5">Compatible Systems:</p>
            <div className="flex flex-wrap gap-1">
              {module.compatibleSystems.map((system) => (
                <Badge key={system} variant="secondary" className="text-xs">
                  {system}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function SolutionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [missing, setMissing] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
          { credentials: "include" }
        )
        if (!res.ok) {
          setMissing(true)
          return
        }
        const data: Product = await res.json()
        setProduct(data)
      } catch {
        setMissing(true)
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id])

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </main>
    )
  }

  if (missing || !product) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/catalog">
          <Button variant="ghost" size="sm" className="mb-6 -ml-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Catalog
          </Button>
        </Link>

        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge
              variant="outline"
              className={`capitalize ${tierColors[product!.tier] || "bg-muted"}`}
            >
              {product!.tier}
            </Badge>
            <Badge variant="secondary">{categoryLabels[product!.category] || product!.category}</Badge>
            <span className="text-sm text-muted-foreground">v{product!.version}</span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight mb-2">{product!.productName}</h1>

          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <Building2 className="h-4 w-4" />
            <span>{product!.vendor}</span>
          </div>

          <p className="text-muted-foreground max-w-4xl leading-relaxed">{product!.description}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Deployment Options */}
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Cloud className="h-5 w-5" />
                Deployment Options
              </h2>
              <div className="flex flex-wrap gap-2">
                {product!.deploymentOptions.map((option) => (
                  <Badge key={option} variant="outline" className="gap-1.5 py-1.5 px-3">
                    {deploymentIcons[option]}
                    <span className="capitalize">{option.replace(/_/g, " ")}</span>
                  </Badge>
                ))}
              </div>
            </section>

            {/* Target Segments */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Target Segments</h2>
              <div className="flex flex-wrap gap-2">
                {product!.targetSegment.map((segment) => (
                  <Badge key={segment} variant="secondary" className="capitalize">
                    {segment}
                  </Badge>
                ))}
              </div>
            </section>

            <Separator />

            {/* Modules */}
            <section>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Package className="h-5 w-5" />
                Available Modules
              </h2>
              <div className="grid gap-4">
                {product!.modules.map((module) => (
                  <ModuleCard key={module.moduleCode} module={module} />
                ))}
              </div>
            </section>

            <Separator />

            {/* Integrations */}
            {product!.integrations && (
              <section>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Plug className="h-5 w-5" />
                  Integrations
                </h2>
                <div className="grid gap-6 sm:grid-cols-2">
                  {product!.integrations.erpConnectors && product!.integrations.erpConnectors.length > 0 && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">ERP Connectors</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-1.5">
                          {product!.integrations.erpConnectors.map((erp) => (
                            <Badge key={erp} variant="outline" className="text-xs">
                              {erp}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {product!.integrations.tmsConnectors && product!.integrations.tmsConnectors.length > 0 && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">TMS Connectors</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-1.5">
                          {product!.integrations.tmsConnectors.map((tms) => (
                            <Badge key={tms} variant="outline" className="text-xs">
                              {tms}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {product!.integrations.marketplaces && product!.integrations.marketplaces.length > 0 && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Marketplaces</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-1.5">
                          {product!.integrations.marketplaces.map((marketplace) => (
                            <Badge key={marketplace} variant="outline" className="text-xs">
                              {marketplace}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {product!.integrations.protocols && product!.integrations.protocols.length > 0 && (
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Protocols</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-1.5">
                          {product!.integrations.protocols.map((protocol) => (
                            <Badge key={protocol} variant="outline" className="text-xs">
                              {protocol}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
                <CardDescription>Subscription + modules model</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Base License</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">
                      {formatCurrency(product!.pricing.baseLicense.monthly)}
                    </span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    or {formatCurrency(product!.pricing.baseLicense.annual)}/year (save{" "}
                    {product!.pricing.baseLicense.annualDiscountPct}%)
                  </p>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Included Users</span>
                    <span className="font-medium">{product!.pricing.baseLicense.includedUsers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Additional User</span>
                    <span className="font-medium">
                      {formatCurrency(product!.pricing.baseLicense.perAdditionalUser)}/mo
                    </span>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium mb-2">Implementation Fee</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Standard</span>
                      <span>{formatCurrency(product!.pricing.implementationFee.standard)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Enterprise</span>
                      <span>{formatCurrency(product!.pricing.implementationFee.enterprise)}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {product!.pricing.implementationFee.note}
                  </p>
                </div>

                <Button className="w-full" size="lg">
                  Request Quote
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>

            {/* SLA Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  SLA
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Uptime</span>
                  <span className="font-medium">{product!.sla.uptime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Support Hours</span>
                  <span className="font-medium">{product!.sla.supportHours}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Critical Response</span>
                  <span className="font-medium">{product!.sla.responseTimeCritical}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Standard Response</span>
                  <span className="font-medium">{product!.sla.responseTimeStandard}</span>
                </div>
              </CardContent>
            </Card>

            {/* Compliance Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Compliance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {product!.compliance.map((cert) => (
                    <Badge key={cert} variant="outline" className="gap-1">
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                      {cert}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {product!.tags.slice(0, 15).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {product!.tags.length > 15 && (
                    <Badge variant="secondary" className="text-xs">
                      +{product!.tags.length - 15} more
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
