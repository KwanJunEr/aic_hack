"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, ArrowUpDown } from "lucide-react"
import { CaseCard } from "@/components/past_sales/CaseCard"
import type { SalesCase } from "@/types/sales"

type SortOption = "date-desc" | "date-asc" | "value-desc" | "value-asc" | "payback-asc"

interface CaseListingProps {
  cases: SalesCase[]
}

const sortLabels: Record<SortOption, string> = {
  "date-desc": "Date (Newest First)",
  "date-asc": "Date (Oldest First)",
  "value-desc": "Deal Value (High to Low)",
  "value-asc": "Deal Value (Low to High)",
  "payback-asc": "Payback (Fastest First)",
}

export function CaseListing({ cases }: CaseListingProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("date-desc")

  const filteredAndSorted = useMemo(() => {
    let result = [...cases]

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.client.name.toLowerCase().includes(q) ||
          c.client.industry.toLowerCase().includes(q) ||
          c.client.segment.toLowerCase().includes(q) ||
          c.dealSummary.modulesSold.some((m) => m.toLowerCase().includes(q)) ||
          c.tags.some((t) => t.toLowerCase().includes(q))
      )
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return b.closedDate.localeCompare(a.closedDate)
        case "date-asc":
          return a.closedDate.localeCompare(b.closedDate)
        case "value-desc":
          return b.dealSummary.dealValueMYR.totalFirstYear - a.dealSummary.dealValueMYR.totalFirstYear
        case "value-asc":
          return a.dealSummary.dealValueMYR.totalFirstYear - b.dealSummary.dealValueMYR.totalFirstYear
        case "payback-asc":
          return (a.outcomes.paybackMonths ?? 999) - (b.outcomes.paybackMonths ?? 999)
        default:
          return 0
      }
    })

    return result
  }, [cases, searchQuery, sortBy])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by client, industry, module, tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2 sm:w-64">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground shrink-0" />
          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(sortLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredAndSorted.length > 0 ? (
        <>
          <p className="text-sm text-muted-foreground">
            Showing {filteredAndSorted.length} of {cases.length} cases
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAndSorted.map((c) => (
              <CaseCard key={c.id} salesCase={c} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-12 border rounded-lg bg-muted/30">
          <p className="text-muted-foreground">
            No cases found matching &quot;{searchQuery}&quot;
          </p>
          <button
            onClick={() => setSearchQuery("")}
            className="mt-2 text-sm text-primary hover:underline"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  )
}
