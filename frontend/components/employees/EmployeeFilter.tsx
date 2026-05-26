"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, X, Filter } from "lucide-react"

export interface FilterState {
  search: string
  seniority: string[]
  status: string[]
  modules: string[]
}

interface EmployeeFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  availableModules: string[]
}

const seniorityOptions = [
  { value: "junior", label: "Junior", color: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" },
  { value: "mid", label: "Mid", color: "bg-violet-100 text-violet-700 hover:bg-violet-200" },
  { value: "senior", label: "Senior", color: "bg-rose-100 text-rose-700 hover:bg-rose-200" },
]

const statusOptions = [
  { value: "available", label: "Available", color: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" },
  { value: "occupied", label: "Occupied", color: "bg-amber-100 text-amber-700 hover:bg-amber-200" },
  { value: "on_leave", label: "On Leave", color: "bg-slate-100 text-slate-600 hover:bg-slate-200" },
  { value: "unavailable", label: "Unavailable", color: "bg-rose-100 text-rose-700 hover:bg-rose-200" },
]

export function EmployeeFilters({ filters, onFiltersChange, availableModules }: EmployeeFiltersProps) {
  const toggleFilter = (type: "seniority" | "status" | "modules", value: string) => {
    const current = filters[type]
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]
    onFiltersChange({ ...filters, [type]: updated })
  }

  const clearFilters = () => {
    onFiltersChange({ search: "", seniority: [], status: [], modules: [] })
  }

  const hasActiveFilters =
    filters.search || filters.seniority.length > 0 || filters.status.length > 0 || filters.modules.length > 0

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search by name, role, specialisation, or certification..."
          value={filters.search}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
          className="pl-10 h-12 text-base bg-background border-border/60 focus-visible:ring-rose-500/20 focus-visible:border-rose-400"
        />
        {filters.search && (
          <button
            onClick={() => onFiltersChange({ ...filters, search: "" })}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Filter Sections */}
      <div className="p-4 rounded-xl bg-muted/30 border border-border/60 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Filters</span>
          </div>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 h-8">
              <X className="w-3 h-3 mr-1" />
              Clear all
            </Button>
          )}
        </div>

        {/* Seniority Filter */}
        <div>
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
            Seniority
          </label>
          <div className="flex flex-wrap gap-2">
            {seniorityOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => toggleFilter("seniority", option.value)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  filters.seniority.includes(option.value)
                    ? `${option.color} ring-2 ring-offset-1 ring-current`
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        {/* <div>
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
            Status
          </label>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => toggleFilter("status", option.value)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  filters.status.includes(option.value)
                    ? `${option.color} ring-2 ring-offset-1 ring-current`
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div> */}

        {/* WMS Modules Filter */}
        {/* <div>
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
            WMS Modules
          </label>
          <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
            {availableModules.map((module) => (
              <button
                key={module}
                onClick={() => toggleFilter("modules", module)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all capitalize ${
                  filters.modules.includes(module)
                    ? "bg-violet-100 text-violet-700 ring-2 ring-offset-1 ring-violet-400"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {module}
              </button>
            ))}
          </div>
        </div> */}
      </div>

      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {filters.search && (
            <Badge variant="secondary" className="gap-1">
              Search: {filters.search}
              <button onClick={() => onFiltersChange({ ...filters, search: "" })}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {filters.seniority.map((s) => (
            <Badge key={s} variant="secondary" className="gap-1 capitalize">
              {s}
              <button onClick={() => toggleFilter("seniority", s)}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          {filters.status.map((s) => (
            <Badge key={s} variant="secondary" className="gap-1 capitalize">
              {s.replace("_", " ")}
              <button onClick={() => toggleFilter("status", s)}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          {filters.modules.map((m) => (
            <Badge key={m} variant="secondary" className="gap-1 capitalize">
              {m}
              <button onClick={() => toggleFilter("modules", m)}>
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
