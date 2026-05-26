import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Award, Briefcase, CircleCheck, Layers } from "lucide-react"
import type { Employee } from "@/types/employee"

export type { Employee }

interface EmployeeCardProps {
  employee: Employee
}

const seniorityColors = {
  junior: "bg-emerald-100 text-emerald-700 border-emerald-200",
  mid: "bg-violet-100 text-violet-700 border-violet-200",
  senior: "bg-rose-100 text-rose-700 border-rose-200",
}

const statusColors = {
  available: "bg-emerald-500",
  occupied: "bg-amber-500",
  on_leave: "bg-slate-400",
  unavailable: "bg-rose-500",
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function EmployeeCard({ employee }: EmployeeCardProps) {
  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-rose-100 hover:-translate-y-1 border-border/60">
      {/* Gradient accent bar */}
      <div className="absolute inset-x-0 top-0 h-1 brand-gradient" />

      <CardContent className="p-6">
        {/* Header with Avatar */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-full brand-gradient flex items-center justify-center text-white font-semibold text-lg shadow-md">
              {getInitials(employee.name)}
            </div>
            {/* Status indicator */}
            <div
              className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white ${statusColors[employee.status as keyof typeof statusColors] || statusColors.available}`}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate text-lg">{employee.name}</h3>
            <p className="text-sm text-muted-foreground truncate">{employee.role}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge
                variant="outline"
                className={`text-xs font-medium capitalize ${seniorityColors[employee.seniority]}`}
              >
                {employee.seniority}
              </Badge>
              <Badge variant="outline" className="text-xs font-medium capitalize bg-emerald-50 text-emerald-700 border-emerald-200">
                <CircleCheck className="w-3 h-3 mr-1" />
                {employee.status}
              </Badge>
            </div>
          </div>
        </div>

        {/* Daily Rate */}
        <div className="mb-4 p-3 rounded-lg surface-rose">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Daily Rate</span>
            <span className="font-semibold text-foreground">
              RM {employee.daily_rate_myr.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Specialisations */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="w-4 h-4 text-rose-500" />
            <span className="text-sm font-medium text-foreground">Specialisations</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {employee.specialisation.slice(0, 3).map((spec) => (
              <Badge key={spec} variant="secondary" className="text-xs capitalize">
                {spec}
              </Badge>
            ))}
            {employee.specialisation.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{employee.specialisation.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* WMS Modules */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="w-4 h-4 text-violet-500" />
            <span className="text-sm font-medium text-foreground">WMS Modules</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {employee.wms_modules.slice(0, 3).map((module) => (
              <Badge key={module} variant="outline" className="text-xs capitalize surface-violet border-0">
                {module}
              </Badge>
            ))}
            {employee.wms_modules.length > 3 && (
              <Badge variant="outline" className="text-xs surface-violet border-0">
                +{employee.wms_modules.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Certifications */}
        {employee.certifications.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium text-foreground">Certifications</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {employee.certifications.map((cert) => (
                <Badge
                  key={cert}
                  variant="outline"
                  className="text-xs bg-amber-50 text-amber-700 border-amber-200"
                >
                  {cert}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
