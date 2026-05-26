// Mirrors backend app/schema/employee_schema.py EngineerSchema + HeadcountSummarySchema

export interface Employee {
  id: string
  name: string
  role: string
  seniority: "junior" | "mid" | "senior"
  status: string
  specialisation: string[]
  wms_modules: string[]
  daily_rate_myr: number
  certifications: string[]
}

export interface HeadcountSummary {
  total_employees: number
  available: number
  occupied: number
  on_leave: number
  unavailable: number
}
