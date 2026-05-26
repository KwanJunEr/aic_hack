"use client"

import { useState, useMemo, useEffect } from "react"
import { EmployeeCard } from "@/components/employees/EmployeeCard"
import { EmployeeFilters, type FilterState } from "@/components/employees/EmployeeFilter"
import type { Employee, HeadcountSummary } from "@/types/employee"
import { Users, CheckCircle2, Clock, XCircle, AlertCircle, UserX } from "lucide-react"


function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  // lucide-react icons are SVG components
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  label: string
  value: number
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

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [summary, setSummary] = useState<HeadcountSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    seniority: [],
    status: [],
    modules: [],
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        const [empRes, sumRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/employees/`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/employees/summary`),
        ])
        if (!empRes.ok || !sumRes.ok) throw new Error("Failed to fetch team data")
        const [empData, sumData]: [Employee[], HeadcountSummary] = await Promise.all([
          empRes.json(),
          sumRes.json(),
        ])
        setEmployees(empData)
        setSummary(sumData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load team")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const availableModules = useMemo(() => {
    const modules = new Set<string>()
    employees.forEach((e) => e.wms_modules.forEach((m) => modules.add(m)))
    return Array.from(modules).sort()
  }, [employees])

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesSearch =
          employee.name.toLowerCase().includes(searchLower) ||
          employee.role.toLowerCase().includes(searchLower) ||
          employee.specialisation.some((s) => s.toLowerCase().includes(searchLower)) ||
          employee.certifications.some((c) => c.toLowerCase().includes(searchLower)) ||
          employee.wms_modules.some((m) => m.toLowerCase().includes(searchLower))
        if (!matchesSearch) return false
      }
      if (filters.seniority.length > 0 && !filters.seniority.includes(employee.seniority)) {
        return false
      }
      if (filters.status.length > 0 && !filters.status.includes(employee.status)) {
        return false
      }
      if (filters.modules.length > 0) {
        const hasModule = filters.modules.some((m) => employee.wms_modules.includes(m))
        if (!hasModule) return false
      }
      return true
    })
  }, [employees, filters])

  return (
    <main className="bg-background">
      <div className="container mx-auto px-4 py-2">
        <div className="mb-5">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Engineering Team</h1>
          <p className="text-muted-foreground text-lg">
            Implements, integrates, and supports the WMS platform for clients
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-5">
          <StatCard
            icon={Users}
            label="Total"
            value={summary?.total_employees ?? 0}
            color="bg-slate-100 text-slate-700"
          />
          <StatCard
            icon={CheckCircle2}
            label="Available"
            value={summary?.available ?? 0}
            color="bg-emerald-100 text-emerald-700"
          />
          <StatCard
            icon={Clock}
            label="Occupied"
            value={summary?.occupied ?? 0}
            color="bg-amber-100 text-amber-700"
          />
          <StatCard
            icon={AlertCircle}
            label="On Leave"
            value={summary?.on_leave ?? 0}
            color="bg-slate-100 text-slate-600"
          />
          <StatCard
            icon={XCircle}
            label="Unavailable"
            value={summary?.unavailable ?? 0}
            color="bg-rose-100 text-rose-700"
          />
        </div>

        <hr className="px-2 h-5 mb-4" />

        {loading && <p className="text-gray-500">Loading team...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
          <>
            <div className="mb-8">
              <EmployeeFilters
                filters={filters}
                onFiltersChange={setFilters}
                availableModules={availableModules}
              />
            </div>

            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-medium text-foreground">{filteredEmployees.length}</span> of{" "}
                <span className="font-medium text-foreground">{employees.length}</span> team members
              </p>
            </div>

            {filteredEmployees.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEmployees.map((employee) => (
                  <EmployeeCard key={employee.id} employee={employee} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="p-4 rounded-full bg-muted mb-4">
                  <UserX className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-1">No employees found</h3>
                <p className="text-muted-foreground max-w-sm">
                  Try adjusting your search or filters to find what you&apos;re looking for.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}
