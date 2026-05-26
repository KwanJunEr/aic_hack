// Mirrors backend app/schema/product_schema.py ProductResponse

export interface ProductBaseLicense {
  monthly: number
  annual: number
  annualDiscountPct: number
  includedUsers: number
  perAdditionalUser: number
}

export interface ProductImplementationFee {
  standard: number
  enterprise: number
  note: string
}

export interface ProductPricing {
  baseLicense: ProductBaseLicense
  implementationFee: ProductImplementationFee
}

export interface ProductModule {
  moduleCode: string
  moduleName: string
  description: string
  included: boolean
  features: string[]
  compatibleSystems?: string[]
  pricing?: {
    monthly: number
  }
}

export interface ProductIntegrations {
  erpConnectors?: string[]
  tmsConnectors?: string[]
  marketplaces?: string[]
  protocols?: string[]
  [key: string]: string[] | undefined
}

export interface ProductSLA {
  uptime: string
  supportHours: string
  responseTimeCritical: string
  responseTimeStandard: string
}

export interface Product {
  id: string
  productCode: string
  productName: string
  category: string
  vendor: string
  version: string
  tier: string
  deploymentOptions: string[]
  targetSegment: string[]
  description: string
  thumbnail: string
  pricing: ProductPricing
  modules: ProductModule[]
  integrations: ProductIntegrations
  sla: ProductSLA
  compliance: string[]
  tags: string[]
  active: boolean
}

// Aliases used by catalog detail page
export type Solution = Product
export type SolutionModule = ProductModule
