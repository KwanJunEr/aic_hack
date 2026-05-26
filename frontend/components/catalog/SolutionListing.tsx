"use client";

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, ArrowUpDown } from "lucide-react"
import { SolutionCard } from "@/components/catalog/SolutionCard"
import type { Product } from "@/types/product";

type SortOption = "name-asc" | "name-desc" | "price-asc" | "price-desc" | "tier"

interface SolutionListProps {
  solutions: Product[]
}

const sortLabels: Record<SortOption, string> = {
  "name-asc": "Name (A-Z)",
  "name-desc": "Name (Z-A)",
  "price-asc": "Price (Low to High)",
  "price-desc": "Price (High to Low)",
  "tier": "Tier",
}

const tierOrder: Record<string, number> = {
  enterprise: 1,
  professional: 2,
  starter: 3,
}

export function SolutionList({ solutions }: SolutionListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<SortOption>("name-asc")

  const filteredAndSortedSolutions = useMemo(() => {
    let result = [...solutions]

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (solution) =>
          solution.productName.toLowerCase().includes(query) ||
          solution.vendor.toLowerCase().includes(query) ||
          solution.description.toLowerCase().includes(query) ||
          solution.category.toLowerCase().includes(query) ||
          solution.targetSegment.some((segment) => segment.toLowerCase().includes(query))
      )
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.productName.localeCompare(b.productName)
        case "name-desc":
          return b.productName.localeCompare(a.productName)
        case "price-asc":
          return a.pricing.baseLicense.monthly - b.pricing.baseLicense.monthly
        case "price-desc":
          return b.pricing.baseLicense.monthly - a.pricing.baseLicense.monthly
        case "tier":
          return (tierOrder[a.tier] || 99) - (tierOrder[b.tier] || 99)
        default:
          return 0
      }
    })

    return result
  }, [solutions, searchQuery, sortBy])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, vendor, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2 sm:w-56">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground shrink-0" />
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
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

      {filteredAndSortedSolutions.length > 0 ? (
        <>
          <p className="text-sm text-muted-foreground">
            Showing {filteredAndSortedSolutions.length} of {solutions.length} solutions
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAndSortedSolutions.map((solution) => (
              <SolutionCard key={solution.id} solution={solution} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-12 border rounded-lg bg-muted/30">
          <p className="text-muted-foreground">No solutions found matching &quot;{searchQuery}&quot;</p>
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
