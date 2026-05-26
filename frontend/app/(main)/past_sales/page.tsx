"use client"

import React, { useEffect, useState } from "react"
import { CaseListing } from "@/components/past_sales/CaseListing"
import type { SalesCase } from "@/types/sales"
import { Briefcase, DollarSign, Clock, TrendingUp } from "lucide-react"

function formatCurrencyCompact(amount: number) {
  return new Intl.NumberFormat("en-MY", {
    style: "currency",
    currency: "MYR",
    notation: "compact",
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(amount)
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  label: string
  value: string
  color: string
}) {
  return (
    <div className={`flex items-center gap-3 p-4 rounded-xl ${color}`}>
      <div className="p-2 rounded-lg bg-white/80">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm opacity-80">{label}</p>
      </div>
    </div>
  )
}

export default function PastSalesPage() {
  const [cases, setCases] = useState<SalesCase[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sales/`)
        if (!res.ok) throw new Error("Failed to fetch sales cases")
        const data: SalesCase[] = await res.json()
        setCases(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load cases")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const totalDealValue = cases.reduce(
    (sum, c) => sum + c.dealSummary.dealValueMYR.totalFirstYear,
    0
  )
  const avgPayback =
    cases.length > 0
      ? Math.round(
          cases.reduce((sum, c) => sum + (c.outcomes.paybackMonths ?? 0), 0) / cases.length
        )
      : 0

  return (
    <main className="bg-background">
      <div className="container mx-auto px-4 py-2">
        <div className="mb-5">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Past Sales Cases</h1>
          <p className="text-muted-foreground text-lg">
            Reference case studies from closed deals across WMS, TMS, and OMS implementations
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
          <StatCard
            icon={Briefcase}
            label="Total Cases"
            value={String(cases.length || "—")}
            color="bg-slate-100 text-slate-700"
          />
          <StatCard
            icon={DollarSign}
            label="Total Deal Value"
            value={cases.length > 0 ? formatCurrencyCompact(totalDealValue) : "—"}
            color="bg-emerald-100 text-emerald-700"
          />
          <StatCard
            icon={Clock}
            label="Avg Payback"
            value={cases.length > 0 ? `${avgPayback} mo` : "—"}
            color="bg-amber-100 text-amber-700"
          />
          <StatCard
            icon={TrendingUp}
            label="Win Rate"
            value="100%"
            color="bg-violet-100 text-violet-700"
          />
        </div>

        <hr className="px-2 h-5 mb-4" />

        {loading && <p className="text-gray-500">Loading cases...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && <CaseListing cases={cases} />}
      </div>
    </main>
  )
}
