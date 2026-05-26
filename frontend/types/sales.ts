// Mirrors backend store/sales_seed.py SALES_SEED structure

export interface SalesClient {
  name: string
  industry: string
  segment: string
  employeeCount: number
  annualRevenue_MYR: number
  country: string
  city: string
  warehouseCount?: number
  warehouseSizeSqFt?: number
  clientsManaged?: number
  storeCount?: number
  fulfilmentNodes?: number
  shipmentsPerMonth?: number
  [key: string]: string | number | boolean | undefined
}

export interface DealValueMYR {
  annualLicense?: number
  addOnModulesAnnual?: number
  addOnWMSModulesAnnual?: number
  tmsAnnualLicense?: number
  addOnTMSModulesAnnual?: number
  implementationFee: number
  totalFirstYear: number
  [key: string]: number | undefined
}

export interface DealSummary {
  productsLicensed: string[]
  modulesSold: string[]
  contractTerm: string
  deploymentOption: string
  dealValueMYR: DealValueMYR
  namedUsers: number
  additionalUsers: number
  goLiveWeeks: number
}

export interface ModuleDecision {
  module: string
  decision: string
  rationale: string
}

export interface TeamMember {
  role: string
  headcount: number
  effortDays: number
}

export interface ImplementationTeam {
  vendorSide: TeamMember[]
  clientSide: TeamMember[]
}

export interface IssueFaced {
  issue: string
  resolution: string
}

export interface CaseOutcomes {
  paybackMonths?: number
  [key: string]: string | number | boolean | undefined
}

export interface SalesCase {
  id: string
  caseCode: string
  title: string
  closedDate: string
  accountExecutive: string
  solutionEngineer: string
  client: SalesClient
  dealSummary: DealSummary
  clientBackground: string
  requirementsAndPainPoints: string[]
  moduleDecisionRationale: ModuleDecision[]
  implementationTeam: ImplementationTeam
  issuesFaced: IssueFaced[]
  outcomes: CaseOutcomes
  tags: string[]
}
