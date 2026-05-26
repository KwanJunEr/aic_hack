
SALES_SEED = [
  {
    "id": "case_001",
    "caseCode": "SC-2024-001",
    "title": "Single-Site SME Distributor — WMS Core Rollout",
    "closedDate": "2024-03-18",
    "accountExecutive": "Farah Nadia Binti Kamarudin",
    "solutionEngineer": "Rajan Krishnaswamy",
    "client": {
      "name": "Teguh Maju Sdn Bhd",
      "industry": "Consumer Goods Distribution",
      "segment": "SME",
      "employeeCount": 85,
      "annualRevenue_MYR": 18000000,
      "country": "Malaysia",
      "city": "Shah Alam, Selangor",
      "warehouseCount": 1,
      "warehouseSizeSqFt": 28000
    },
    "dealSummary": {
      "productsLicensed": [
        "NEXUS-WMS"
      ],
      "modulesSold": [
        "WMS-CORE"
      ],
      "contractTerm": "annual",
      "deploymentOption": "cloud_saas",
      "dealValueMYR": {
        "annualLicense": 792000,
        "implementationFee": 180000,
        "totalFirstYear": 972000
      },
      "namedUsers": 25,
      "additionalUsers": 0,
      "goLiveWeeks": 8
    },
    "clientBackground": "Teguh Maju is a regional distributor of household cleaning products supplying hypermarkets and independent grocers across Selangor and Negeri Sembilan. Prior to Nexus WMS, all inventory movements were tracked in Microsoft Excel spreadsheets, supplemented by handwritten bin cards. Stock discrepancies were discovered only during monthly physical counts, causing frequent stockouts and customer complaints.",
    "requirementsAndPainPoints": [
      "No real-time visibility of stock by bin location — pickers wasted 20–30 minutes per shift searching for misplaced SKUs.",
      "Manual receiving process meant PO discrepancies were only caught days after delivery, by which time carriers had left.",
      "Pick errors rate of approximately 3.2% causing return credits that eroded margins.",
      "Single warehouse, single client — no complexity around 3PL billing, yard management, or robotics.",
      "Budget-constrained: owner-managed business requiring ROI justification within 12 months.",
      "IT team consists of one part-time IT executive; required a cloud-hosted, low-maintenance solution."
    ],
    "moduleDecisionRationale": [
      {
        "module": "WMS-CORE",
        "decision": "INCLUDED",
        "rationale": "Covers all identified requirements: barcode scanning for receiving accuracy, directed putaway to eliminate search time, wave picking to reduce pick errors, and real-time inventory dashboard. Single-site, single-client operation — no additional modules warranted."
      },
      {
        "module": "WMS-YARD",
        "decision": "NOT SOLD",
        "rationale": "Only 2 dock doors; inbound deliveries are 3–4 trucks per day maximum. Yard management overhead not justified."
      },
      {
        "module": "WMS-ROBOT",
        "decision": "NOT SOLD",
        "rationale": "No automation hardware deployed or planned. Manual pick-pack operation."
      },
      {
        "module": "WMS-ANALYTICS",
        "decision": "NOT SOLD — flagged for Year 2 upsell",
        "rationale": "Owner expressed interest in KPI dashboards but wished to first stabilise operations on WMS-CORE. AE to revisit at Month 9 QBR."
      },
      {
        "module": "WMS-3PL",
        "decision": "NOT SOLD",
        "rationale": "Client manages only its own inventory. Not a 3PL operator."
      }
    ],
    "implementationTeam": {
      "vendorSide": [
        {
          "role": "Project Manager",
          "headcount": 1,
          "effortDays": 15
        },
        {
          "role": "WMS Functional Consultant",
          "headcount": 1,
          "effortDays": 30
        },
        {
          "role": "Integration / IT Consultant",
          "headcount": 1,
          "effortDays": 10
        }
      ],
      "clientSide": [
        {
          "role": "Project Sponsor (Owner-Director)",
          "headcount": 1,
          "effortDays": 5
        },
        {
          "role": "Warehouse Supervisor (key user)",
          "headcount": 1,
          "effortDays": 20
        },
        {
          "role": "IT Executive",
          "headcount": 1,
          "effortDays": 12
        }
      ]
    },
    "issuesFaced": [
      {
        "issue": "Legacy item master data in Excel had inconsistent UOM (unit-of-measure) definitions — 40% of SKUs had conflicting case/each ratios across sheets.",
        "resolution": "Dedicated 3-day data cleansing workshop with warehouse supervisor before migration. Added UOM validation rules to import template."
      },
      {
        "issue": "Warehouse staff (average age 45+) had low smartphone/scanner literacy; initial scan accuracy was poor during UAT.",
        "resolution": "Replaced planned handheld RF guns with larger-screen ruggedised tablets. Conducted an extra half-day training session in Bahasa Malaysia."
      },
      {
        "issue": "Owner requested a custom report showing daily stock movement by supplier that was outside standard WMS-CORE dashboards.",
        "resolution": "Built report using WMS-CORE's built-in report builder at no extra charge. Documented as a template for similar SME clients."
      }
    ],
    "outcomes": {
      "pickErrorRateAfter": "0.4%",
      "stockAccuracyAfter": "99.1%",
      "receivingTimeReductionPct": 45,
      "manualHeadcountRedeployed": 1,
      "paybackMonths": 10
    },
    "tags": [
      "SME",
      "WMS",
      "single-site",
      "malaysia",
      "distributor",
      "cloud-saas",
      "excel-migration",
      "no-automation"
    ]
  },
  {
    "id": "case_002",
    "caseCode": "SC-2024-002",
    "title": "E-Commerce Startup — OMS Core + Fraud + AI Promising",
    "closedDate": "2024-05-07",
    "accountExecutive": "Darren Lim Wei Jian",
    "solutionEngineer": "Priya Subramaniam",
    "client": {
      "name": "Kloset Commerce Sdn Bhd",
      "industry": "Fashion E-Commerce (DTC)",
      "segment": "Startup",
      "employeeCount": 32,
      "annualRevenue_MYR": 9500000,
      "country": "Malaysia",
      "city": "Bangsar South, Kuala Lumpur",
      "warehouseCount": 1,
      "warehouseSizeSqFt": 6000,
      "fulfilmentNodes": 1
    },
    "dealSummary": {
      "productsLicensed": [
        "NEXUS-OMS"
      ],
      "modulesSold": [
        "OMS-CORE",
        "OMS-FRAUD",
        "OMS-PROMISE"
      ],
      "contractTerm": "annual",
      "deploymentOption": "cloud_saas",
      "dealValueMYR": {
        "annualLicense": 423400,
        "addOnModulesAnnual": 216000,
        "implementationFee": 100000,
        "totalFirstYear": 739400
      },
      "namedUsers": 15,
      "additionalUsers": 0,
      "goLiveWeeks": 6
    },
    "clientBackground": "Kloset Commerce is a fast-growing DTC fashion brand selling premium modest wear (hijab, baju kurung, abaya) primarily through its own Shopify Plus website, with secondary channels on TikTok Shop and Zalora. Founded in 2022, the brand grew 280% YoY in 2023 driven by viral social media campaigns. The rapid growth exposed critical gaps: the Shopify native order management could not handle multi-channel order routing, and the team was losing MYR 40,000–60,000 per month to fraudulent card-not-present orders. Delivery date visibility was also identified as a key conversion bottleneck — customers frequently abandoned carts after failing to find a delivery estimate.",
    "requirementsAndPainPoints": [
      "Multi-channel order chaos: Shopify, TikTok Shop, and Zalora orders managed in 3 separate admin panels — fulfilment team was manually copy-pasting orders.",
      "Fraud losses: high-value orders (abayas priced MYR 800–1,500) were being placed with stolen cards and shipped before chargebacks were raised.",
      "Cart abandonment: A/B test showed 18% drop in checkout conversion when no delivery date was shown.",
      "Single fulfilment node (own warehouse in KL) — no need for distributed inventory module at this stage.",
      "No physical retail stores — POS module not required.",
      "Startup cashflow sensitivity: team evaluated 6-month break-even threshold."
    ],
    "moduleDecisionRationale": [
      {
        "module": "OMS-CORE",
        "decision": "INCLUDED",
        "rationale": "Unifies Shopify Plus, TikTok Shop, and Zalora orders into a single pipeline. Handles routing to the single warehouse and provides customer order status portal, replacing manual Shopify admin work."
      },
      {
        "module": "OMS-FRAUD",
        "decision": "INCLUDED",
        "rationale": "MYR 40,000–60,000/month fraud losses provided clear ROI: module cost MYR 7,200/month = positive payback within 2 months. Essential for DTC brand selling high-value fashion items with card-not-present transactions. Chargeback management workflow also reduces ops team time."
      },
      {
        "module": "OMS-PROMISE",
        "decision": "INCLUDED",
        "rationale": "Client A/B test data showed 18% checkout conversion uplift opportunity. At average order value MYR 650 and 5,000 monthly orders, even a 5% improvement = MYR 162,500 incremental monthly revenue. Decision made on conversion economics, not just operational need."
      },
      {
        "module": "OMS-INVENTORY",
        "decision": "NOT SOLD — flagged for Year 2",
        "rationale": "Single fulfilment node. OMS-INVENTORY adds value only when 3+ nodes are live. Client has plans to open a second warehouse in Johor in mid-2025; AE to trigger upsell conversation at that point."
      },
      {
        "module": "OMS-POS",
        "decision": "NOT SOLD",
        "rationale": "Pure-play e-commerce; no physical retail stores in roadmap within 18 months."
      }
    ],
    "implementationTeam": {
      "vendorSide": [
        {
          "role": "Project Manager",
          "headcount": 1,
          "effortDays": 10
        },
        {
          "role": "OMS Functional Consultant",
          "headcount": 1,
          "effortDays": 20
        },
        {
          "role": "Shopify Integration Specialist",
          "headcount": 1,
          "effortDays": 8
        }
      ],
      "clientSide": [
        {
          "role": "Co-Founder / COO (sponsor)",
          "headcount": 1,
          "effortDays": 6
        },
        {
          "role": "Head of Operations",
          "headcount": 1,
          "effortDays": 15
        },
        {
          "role": "In-house developer (Shopify)",
          "headcount": 1,
          "effortDays": 10
        }
      ]
    },
    "issuesFaced": [
      {
        "issue": "TikTok Shop API rate limits caused order sync delays of up to 4 hours during peak campaign periods (Hariraya flash sale).",
        "resolution": "Implemented webhook-based push from TikTok Shop supplemented by 15-minute polling fallback. Documented TikTok Shop connector limitations in implementation guide."
      },
      {
        "issue": "OMS-PROMISE ML model had insufficient local Malaysia carrier performance history to generate accurate ETAs for East Malaysia (Sabah, Sarawak) routes.",
        "resolution": "Manually seeded 6 months of historical Pos Laju and J&T Express delivery scan data. Promise accuracy for East Malaysia improved to within 1-day accuracy at Month 2."
      },
      {
        "issue": "Fraud module initially flagged 12% of legitimate orders from new customers as high-risk (high false-positive rate), causing fulfilment delays and customer complaints.",
        "resolution": "Tuned risk score thresholds during Week 1 hypercare. Adjusted device fingerprint weighting; false-positive rate settled at 1.8% by Week 3."
      }
    ],
    "outcomes": {
      "fraudLossReductionPct": 87,
      "checkoutConversionUplift": "6.2%",
      "manualOrderProcessingTimeReductionPct": 70,
      "paybackMonths": 4
    },
    "tags": [
      "startup",
      "OMS",
      "ecommerce",
      "DTC",
      "fashion",
      "fraud",
      "ai-promising",
      "shopify",
      "malaysia",
      "tiktok-shop"
    ]
  },
  {
    "id": "case_003",
    "caseCode": "SC-2024-003",
    "title": "Mid-Market 3PL — WMS Full Suite + TMS Core",
    "closedDate": "2024-07-22",
    "accountExecutive": "Hafizuddin Roslan",
    "solutionEngineer": "Cheong Wai Kit",
    "client": {
      "name": "Mutiara Logistik Sdn Bhd",
      "industry": "Third-Party Logistics (3PL)",
      "segment": "Mid-Market",
      "employeeCount": 320,
      "annualRevenue_MYR": 72000000,
      "country": "Malaysia",
      "city": "Pulau Indah, Selangor (Port Klang)",
      "warehouseCount": 3,
      "warehouseSizeSqFt": 380000,
      "clientsManaged": 18
    },
    "dealSummary": {
      "productsLicensed": [
        "NEXUS-WMS",
        "NEXUS-TMS"
      ],
      "modulesSold": [
        "WMS-CORE",
        "WMS-YARD",
        "WMS-3PL",
        "WMS-ANALYTICS",
        "TMS-CORE"
      ],
      "contractTerm": "annual",
      "deploymentOption": "hybrid",
      "dealValueMYR": {
        "annualLicense": 792000,
        "addOnWMSModulesAnnual": 349900,
        "tmsAnnualLicense": 608600,
        "implementationFee": 480000,
        "totalFirstYear": 2230500
      },
      "namedUsers": 60,
      "additionalUsers": 35,
      "goLiveWeeks": 16
    },
    "clientBackground": "Mutiara Logistik operates three bonded warehouses near Port Klang, providing import/export freight storage, order fulfilment, and last-mile coordination for 18 shipper clients spanning FMCG, automotive parts, and electronics. The business was growing rapidly but running on a legacy WMS from 2011 that could not support multi-client billing. Monthly invoicing to shipper clients was entirely manual (Excel + email), taking 3 full-time staff 5 days each month to complete. The GM also flagged that a major e-commerce client (8% of revenue) had threatened to leave unless Mutiara could provide a self-service inventory portal.",
    "requirementsAndPainPoints": [
      "Legacy WMS could not segregate inventory by client within shared bin locations — picking errors frequently crossed client boundaries.",
      "Manual billing: 3 staff × 5 days/month to generate 18 client invoices. High error rate causing disputes.",
      "No client self-service portal — account managers spent 2+ hours/day answering inventory queries from clients.",
      "Yard had 28 dock doors handling 60–80 inbound/outbound trucks per day; no digital gate management causing daily congestion.",
      "Needed domestic transportation planning capability to coordinate last-mile delivery to client end-customers.",
      "Senior management wanted KPI dashboards for labour productivity to support incentive pay programme."
    ],
    "moduleDecisionRationale": [
      {
        "module": "WMS-CORE",
        "decision": "INCLUDED",
        "rationale": "Foundation for all warehouse execution. Multi-client inventory segregation at LPN level resolves cross-client picking errors."
      },
      {
        "module": "WMS-YARD",
        "decision": "INCLUDED",
        "rationale": "28 dock doors, 60–80 trucks/day — classic yard management use case. Dock appointment scheduling expected to reduce truck wait time and detention charges by 30–40%."
      },
      {
        "module": "WMS-3PL",
        "decision": "INCLUDED",
        "rationale": "Core business requirement. Automated billing engine replaces 3-staff manual process. Client self-service portal directly addresses e-commerce client retention risk. EDI 940/945 required by 3 clients."
      },
      {
        "module": "WMS-ANALYTICS",
        "decision": "INCLUDED",
        "rationale": "GM specifically requested labour management and engineered standards to support incentive pay. SLA performance reports for 3PL clients are a contractual requirement with 4 clients."
      },
      {
        "module": "WMS-ROBOT",
        "decision": "NOT SOLD",
        "rationale": "No automation hardware. Manual pick operation across all three sites. Flagged for discussion if client invests in AMRs in 2026."
      },
      {
        "module": "TMS-CORE",
        "decision": "INCLUDED",
        "rationale": "Mutiara coordinates last-mile delivery using 6 third-party carriers. TMS-CORE consolidates carrier rate shopping and POD capture, replacing manual booking via WhatsApp and phone calls."
      },
      {
        "module": "TMS-AI",
        "decision": "NOT SOLD — below volume threshold",
        "rationale": "Mutiara ships approximately 280 domestic shipments/month. TMS-AI is recommended for 500+/month. Will revisit in Year 2 as client volume grows."
      },
      {
        "module": "TMS-INTL",
        "decision": "NOT SOLD",
        "rationale": "Mutiara's 3PL clients manage their own customs brokerage. Mutiara itself does not file customs declarations. Domestic last-mile only at TMS level."
      }
    ],
    "implementationTeam": {
      "vendorSide": [
        {
          "role": "Programme Manager",
          "headcount": 1,
          "effortDays": 40
        },
        {
          "role": "WMS Lead Consultant",
          "headcount": 1,
          "effortDays": 60
        },
        {
          "role": "WMS-3PL Billing Specialist",
          "headcount": 1,
          "effortDays": 25
        },
        {
          "role": "TMS Functional Consultant",
          "headcount": 1,
          "effortDays": 30
        },
        {
          "role": "Integration Engineer",
          "headcount": 2,
          "effortDays": 35
        },
        {
          "role": "Data Migration Specialist",
          "headcount": 1,
          "effortDays": 20
        }
      ],
      "clientSide": [
        {
          "role": "General Manager (Sponsor)",
          "headcount": 1,
          "effortDays": 10
        },
        {
          "role": "IT Manager",
          "headcount": 1,
          "effortDays": 40
        },
        {
          "role": "Warehouse Operations Manager",
          "headcount": 1,
          "effortDays": 50
        },
        {
          "role": "Finance / Billing Lead",
          "headcount": 1,
          "effortDays": 30
        },
        {
          "role": "Key Users (supervisors)",
          "headcount": 6,
          "effortDays": 15
        }
      ]
    },
    "issuesFaced": [
      {
        "issue": "Migrating 18 client inventory records from the legacy WMS produced duplicate LPN numbers across clients — a data integrity issue that would have caused mis-shipments in production.",
        "resolution": "Built a custom de-duplication script. Added a client-prefix to all LPN numbers during migration. Added this as a standard 3PL data migration step in the implementation playbook."
      },
      {
        "issue": "Three legacy shipper clients had highly customised rate card structures (tiered pallet rates with seasonal surcharges) that the WMS-3PL billing engine could not map directly.",
        "resolution": "Configured custom billing rules using the scripting layer in WMS-3PL. Required 8 additional consultant days beyond original SOW — managed as a change order at MYR 24,000."
      },
      {
        "issue": "Yard module's digital gate kiosk required stable internet at the gate booth; client's Port Klang site had unreliable 4G coverage at the perimeter.",
        "resolution": "Installed a dedicated fibre line to the gate house. Nexus pre-sales team should add site connectivity assessment to the WMS-YARD checklist."
      },
      {
        "issue": "Two shipper clients refused to adopt the EDI 940/945 format, preferring to send Excel order files via email.",
        "resolution": "Built a lightweight Excel-to-EDI converter utility. Documented as a reusable asset for 3PL clients with non-EDI shippers."
      }
    ],
    "outcomes": {
      "billingCycleReductionDays": "5 days → 4 hours",
      "clientDisputeReductionPct": 74,
      "truckDwellTimeReductionMinutes": 38,
      "clientRetentionRisk": "Resolved — e-commerce client renewed 2-year contract after portal launch",
      "paybackMonths": 14
    },
    "tags": [
      "mid-market",
      "3PL",
      "WMS",
      "TMS",
      "yard-management",
      "3pl-billing",
      "analytics",
      "port-klang",
      "malaysia",
      "hybrid"
    ]
  },
  {
    "id": "case_004",
    "caseCode": "SC-2024-004",
    "title": "Omnichannel Retailer — OMS Full Suite",
    "closedDate": "2024-09-05",
    "accountExecutive": "Darren Lim Wei Jian",
    "solutionEngineer": "Priya Subramaniam",
    "client": {
      "name": "Parkson Lifestyle Group Berhad",
      "industry": "Omnichannel Retail (Fashion & Lifestyle)",
      "segment": "Mid-Market",
      "employeeCount": 1100,
      "annualRevenue_MYR": 420000000,
      "country": "Malaysia",
      "city": "Kuala Lumpur (HQ), nationwide stores",
      "warehouseCount": 2,
      "warehouseSizeSqFt": 120000,
      "storeCount": 34,
      "fulfilmentNodes": 36
    },
    "dealSummary": {
      "productsLicensed": [
        "NEXUS-OMS"
      ],
      "modulesSold": [
        "OMS-CORE",
        "OMS-INVENTORY",
        "OMS-PROMISE",
        "OMS-POS",
        "OMS-FRAUD"
      ],
      "contractTerm": "annual",
      "deploymentOption": "cloud_saas",
      "dealValueMYR": {
        "annualLicense": 423400,
        "addOnModulesAnnual": 401800,
        "implementationFee": 280000,
        "totalFirstYear": 1105200
      },
      "namedUsers": 80,
      "additionalUsers": 65,
      "goLiveWeeks": 20
    },
    "clientBackground": "Parkson Lifestyle Group operates 34 fashion and lifestyle retail stores across Peninsular Malaysia and 2 distribution centres (KL and Penang). E-commerce launched in 2021 on Shopify Plus but remained siloed from store inventory. Store managers reported frequent customer frustration when online showed items as in-stock that were actually in store stockrooms. The group's Chief Digital Officer had a board mandate to achieve 'true omnichannel' by Q1 2025, including ship-from-store, BOPIS, and endless aisle capabilities. An 18% online cart abandonment rate was traced primarily to the absence of delivery date promises.",
    "requirementsAndPainPoints": [
      "Inventory fragmentation: 36 inventory pools (2 DCs + 34 stores) operating independently causing overselling online and missed fulfilment opportunities.",
      "No ship-from-store or BOPIS — customer requests fulfilled sub-optimally from DC even when store held stock closer to customer.",
      "Endless aisle not possible: store associates had no visibility of other store/DC inventory to rescue lost in-store sales.",
      "No delivery promise at checkout — board-level metric showing 18% cart abandonment partially attributable to this gap.",
      "Fraud exposure: 12,000+ monthly online transactions with 2.1% chargeback rate (industry average 0.6%).",
      "Store POS (NCR Counterpoint) operated completely independently of e-commerce stack."
    ],
    "moduleDecisionRationale": [
      {
        "module": "OMS-CORE",
        "decision": "INCLUDED",
        "rationale": "Unifies Shopify Plus, marketplace, and in-store orders into a single routing engine. Provides ATP across all 36 nodes."
      },
      {
        "module": "OMS-INVENTORY",
        "decision": "INCLUDED — mandatory",
        "rationale": "36 fulfilment nodes (far above the 3-node threshold). Creating a single pooled inventory position is the foundational requirement for ship-from-store, BOPIS, and endless aisle. Without this module, all other omnichannel capabilities are impossible."
      },
      {
        "module": "OMS-PROMISE",
        "decision": "INCLUDED",
        "rationale": "Board-level mandate to address 18% cart abandonment. ML-based delivery promise at PDP and checkout. Requires OMS-INVENTORY as prerequisite — both purchased together."
      },
      {
        "module": "OMS-POS",
        "decision": "INCLUDED",
        "rationale": "34 NCR Counterpoint POS terminals. POS module provides the endless aisle and store-associate clienteling dashboard. Pre-certified NCR Counterpoint integration eliminates custom development."
      },
      {
        "module": "OMS-FRAUD",
        "decision": "INCLUDED",
        "rationale": "2.1% chargeback rate vs 0.6% industry benchmark. At 12,000 transactions/month and average MYR 380 order value, excess fraud costs ~MYR 600,000/year in chargebacks. OMS-FRAUD cost = MYR 86,400/year. Clear ROI."
      }
    ],
    "implementationTeam": {
      "vendorSide": [
        {
          "role": "Programme Manager",
          "headcount": 1,
          "effortDays": 50
        },
        {
          "role": "OMS Lead Consultant",
          "headcount": 2,
          "effortDays": 70
        },
        {
          "role": "POS Integration Specialist",
          "headcount": 1,
          "effortDays": 30
        },
        {
          "role": "Inventory / Distributed Node Specialist",
          "headcount": 1,
          "effortDays": 35
        },
        {
          "role": "Integration Engineer",
          "headcount": 2,
          "effortDays": 45
        }
      ],
      "clientSide": [
        {
          "role": "Chief Digital Officer (Sponsor)",
          "headcount": 1,
          "effortDays": 8
        },
        {
          "role": "Head of E-Commerce",
          "headcount": 1,
          "effortDays": 40
        },
        {
          "role": "IT Director",
          "headcount": 1,
          "effortDays": 30
        },
        {
          "role": "Retail Operations Manager",
          "headcount": 1,
          "effortDays": 25
        },
        {
          "role": "Store Champion Leads",
          "headcount": 8,
          "effortDays": 10
        }
      ]
    },
    "issuesFaced": [
      {
        "issue": "NCR Counterpoint POS had not been patched in 3 years; the pre-certified OMS-POS connector required POS firmware v8.2+ but 22 of 34 stores were on v7.9.",
        "resolution": "Client IT team conducted a 3-week POS firmware upgrade programme across all stores before OMS-POS go-live. Nexus team provided remote validation support. Store rollout sequenced in 4 waves of 8–9 stores."
      },
      {
        "issue": "33 of 34 stores had no reliable inventory counting process — physical stock figures in the legacy system were 15–25% inaccurate, making the pooled inventory pool unreliable at launch.",
        "resolution": "Triggered a cycle count programme in all stores 4 weeks before OMS-INVENTORY go-live. Used WMS-CORE barcode scanning in the 2 DCs; stores used a lightweight mobile count app. Accuracy improved to 97.2% before cutover."
      },
      {
        "issue": "OMS-PROMISE ML model initially over-promised delivery for East Coast Peninsular stores due to traffic congestion on Route 2 (Karak Highway) affecting J&T Express SLAs.",
        "resolution": "Added a lane-level override rule for East Coast routes. Carrier historical data re-weighted by route corridor rather than region. Promise accuracy for East Coast reached 94% within 6 weeks."
      }
    ],
    "outcomes": {
      "cartAbandonmentReductionPct": 11,
      "shipFromStoreVolumeMonth3": "18% of online orders fulfilled from stores",
      "bopisAdoptionMonth3": "2,200 orders/month",
      "chargebackRateAfter": "0.7%",
      "paybackMonths": 16
    },
    "tags": [
      "mid-market",
      "OMS",
      "omnichannel",
      "retail",
      "ship-from-store",
      "BOPIS",
      "endless-aisle",
      "fraud",
      "malaysia",
      "cloud-saas"
    ]
  },
  {
    "id": "case_005",
    "caseCode": "SC-2025-001",
    "title": "Manufacturing MNC — WMS Multi-Site + TMS Full Suite",
    "closedDate": "2025-01-30",
    "accountExecutive": "Hafizuddin Roslan",
    "solutionEngineer": "Rajan Krishnaswamy",
    "client": {
      "name": "Berjaya Precision Components Berhad",
      "industry": "Precision Engineering & Electronics Manufacturing",
      "segment": "MNC",
      "employeeCount": 4800,
      "annualRevenue_MYR": 1200000000,
      "country": "Malaysia (HQ), with operations in Vietnam and Thailand",
      "city": "Shah Alam (HQ DC), Penang (Plant DC), Ho Chi Minh City, Bangkok",
      "warehouseCount": 4,
      "warehouseSizeSqFt": 920000,
      "shipmentsPerMonth": 3200
    },
    "dealSummary": {
      "productsLicensed": [
        "NEXUS-WMS",
        "NEXUS-TMS"
      ],
      "modulesSold": [
        "WMS-CORE",
        "WMS-YARD",
        "WMS-ROBOT",
        "WMS-ANALYTICS",
        "TMS-CORE",
        "TMS-AI",
        "TMS-CONTROL",
        "TMS-INTL"
      ],
      "contractTerm": "annual",
      "deploymentOption": "hybrid",
      "dealValueMYR": {
        "annualLicense": 792000,
        "addOnWMSModulesAnnual": 436300,
        "tmsAnnualLicense": 608600,
        "addOnTMSModulesAnnual": 509800,
        "implementationFee": 860000,
        "totalFirstYear": 3206700
      },
      "namedUsers": 120,
      "additionalUsers": 95,
      "goLiveWeeks": 30
    },
    "clientBackground": "Berjaya Precision Components manufactures PCBs and precision mechanical components for Japanese and Korean OEM clients. They operate 4 distribution centres (Shah Alam, Penang, Ho Chi Minh City, Bangkok) and ship finished goods internationally to Japan, South Korea, Germany, and the United States. The supply chain team was operating with 4 different legacy WMS systems (one per site) and no TMS — freight was booked by a team of 6 freight coordinators using carrier portals and email. The Group CSCO had a mandate from the board to reduce freight costs by 12% and improve on-time delivery from 81% to 95%+ within 18 months.",
    "requirementsAndPainPoints": [
      "4 incompatible WMS systems across 4 sites with no unified inventory view — inter-site stock transfer orders were managed in SAP with 48-hour latency.",
      "No TMS: 3,200 shipments/month managed manually across 12 carriers — freight coordinators had no rate comparison tool, leading to an estimated MYR 2.8M/year in carrier overspend.",
      "International shipping to 5 countries required customs documentation that was produced manually in Word/Excel — OFAC screening not performed, creating compliance exposure.",
      "Shah Alam DC had deployed 24 Geek+ AMRs 18 months prior but they were not connected to the WMS — robot tasking was managed through a separate vendor console.",
      "CSCO required a single control tower screen showing all 4 sites and all in-transit shipments globally.",
      "Penang DC had 42 dock doors with severe congestion during semiconductor component inbound peak (Monday–Tuesday)."
    ],
    "moduleDecisionRationale": [
      {
        "module": "WMS-CORE",
        "decision": "INCLUDED — across all 4 sites",
        "rationale": "Replaces 4 legacy WMS systems with a single platform. Multi-site architecture provides unified inventory visibility via SAP S/4HANA integration."
      },
      {
        "module": "WMS-YARD",
        "decision": "INCLUDED — Shah Alam & Penang only",
        "rationale": "Shah Alam (36 doors) and Penang (42 doors) both qualify. Vietnam and Thailand sites have 8 and 6 doors respectively — below threshold. Dock appointment scheduling critical for Penang Monday–Tuesday inbound peak."
      },
      {
        "module": "WMS-ROBOT",
        "decision": "INCLUDED — Shah Alam only",
        "rationale": "24 Geek+ AMRs already deployed in Shah Alam. Geek+ is a pre-certified compatible system. Connecting AMRs to WMS eliminates dual-console operation and expected to increase robot utilisation from 62% to 85%+."
      },
      {
        "module": "WMS-ANALYTICS",
        "decision": "INCLUDED — all sites",
        "rationale": "CSCO requires cross-site KPI benchmarking. Labour management module supports Malaysian and Vietnamese shift incentive pay schemes. Slotting optimisation needed for Shah Alam DC which has 48,000 bin locations."
      },
      {
        "module": "TMS-CORE",
        "decision": "INCLUDED",
        "rationale": "Foundation for freight planning across FTL, LTL, ocean, and air modes. Pre-loaded carrier tariffs include all 12 carriers currently used."
      },
      {
        "module": "TMS-AI",
        "decision": "INCLUDED",
        "rationale": "3,200 shipments/month far exceeds the 500/month threshold. ML carrier scoring expected to capture a significant share of the MYR 2.8M annual overspend. CO₂ emissions reporting required for Japanese OEM clients' Scope 3 sustainability disclosures."
      },
      {
        "module": "TMS-CONTROL",
        "decision": "INCLUDED",
        "rationale": "Board and CSCO requirement for a single global visibility screen. Multi-country, multi-carrier, multi-mode operation is the textbook Control Tower use case. Supplier collaboration portal required by 3 OEM clients who need to track inbound component shipments."
      },
      {
        "module": "TMS-INTL",
        "decision": "INCLUDED — mandatory",
        "rationale": "Shipping to Japan, South Korea, Germany, and US from Malaysia, Vietnam, and Thailand. Cross-border shipments on every lane. OFAC screening is mandatory given trade with Japanese/Korean OEM clients who have US-entity relationships. HTS classification assistant critical for correct HS codes across 5 destination countries."
      },
      {
        "module": "TMS-AUDIT",
        "decision": "NOT SOLD — Phase 2",
        "rationale": "Client currently has a 3-person freight audit team doing this manually. Decision made to stabilise on TMS-CORE and TMS-AI first before automating the audit layer. Earmarked for Month 12 expansion."
      }
    ],
    "implementationTeam": {
      "vendorSide": [
        {
          "role": "Programme Director",
          "headcount": 1,
          "effortDays": 80
        },
        {
          "role": "WMS Lead Consultant (MY)",
          "headcount": 1,
          "effortDays": 90
        },
        {
          "role": "WMS Consultant (VN/TH)",
          "headcount": 2,
          "effortDays": 60
        },
        {
          "role": "Robotics Integration Engineer",
          "headcount": 1,
          "effortDays": 30
        },
        {
          "role": "TMS Lead Consultant",
          "headcount": 1,
          "effortDays": 70
        },
        {
          "role": "TMS-INTL / Customs Specialist",
          "headcount": 1,
          "effortDays": 35
        },
        {
          "role": "SAP Integration Architect",
          "headcount": 1,
          "effortDays": 50
        },
        {
          "role": "Data Migration Lead",
          "headcount": 1,
          "effortDays": 40
        },
        {
          "role": "Training Lead",
          "headcount": 1,
          "effortDays": 25
        }
      ],
      "clientSide": [
        {
          "role": "Group CSCO (Sponsor)",
          "headcount": 1,
          "effortDays": 15
        },
        {
          "role": "Group IT Director",
          "headcount": 1,
          "effortDays": 50
        },
        {
          "role": "SAP Programme Manager",
          "headcount": 1,
          "effortDays": 60
        },
        {
          "role": "DC Managers (all 4 sites)",
          "headcount": 4,
          "effortDays": 40
        },
        {
          "role": "Freight & Trade Compliance Manager",
          "headcount": 1,
          "effortDays": 35
        },
        {
          "role": "Key Users / Super Users",
          "headcount": 20,
          "effortDays": 15
        }
      ]
    },
    "issuesFaced": [
      {
        "issue": "SAP S/4HANA integration at Shah Alam used a custom ABAP Z-programme for inventory postings that did not conform to the standard Nexus WMS REST API connector. SAP team was unavailable for 6 weeks due to a parallel S4 upgrade project.",
        "resolution": "Deployed a middleware adapter (MuleSoft) to translate between the custom SAP Z-programme outputs and Nexus WMS API schema. Added 3 weeks to timeline and MYR 85,000 to integration cost (change order)."
      },
      {
        "issue": "Vietnam DC staff had no prior WMS experience and limited English proficiency; training materials were English-only.",
        "resolution": "Contracted a bilingual (Vietnamese/English) WMS trainer for 2 weeks on-site. Translated key SOPs and quick-reference cards into Vietnamese. Flagged to product team: Vietnamese language pack needed for SEA expansion."
      },
      {
        "issue": "Geek+ AMR integration required firmware version 3.2.1 on the robots; 8 of 24 AMRs were on 3.1.0. Geek+ firmware upgrade required a 48-hour maintenance window.",
        "resolution": "Scheduled firmware upgrade during Chinese New Year shutdown (warehouse closed). Robot integration went live on schedule."
      },
      {
        "issue": "TMS-INTL HS code classification assistant had low confidence scores for Malaysia-origin precision components (HS Chapter 85) due to limited training data for SEA manufacturing categories.",
        "resolution": "Client's trade compliance manager manually verified and approved HS codes for the top 200 SKUs by shipment volume. Used these verified codes to fine-tune the classification model. Accuracy improved to 94% within 8 weeks."
      }
    ],
    "outcomes": {
      "freightCostReductionPct": 14.2,
      "onTimeDeliveryAfter": "93.8%",
      "robotUtilisationAfter": "84%",
      "interSiteInventoryLatencyReductionHours": "48h → 4min",
      "manualFreightCoordinatorRedeployed": 4,
      "paybackMonths": 18
    },
    "tags": [
      "MNC",
      "manufacturing",
      "WMS",
      "TMS",
      "multi-site",
      "robotics",
      "global-trade",
      "control-tower",
      "SAP",
      "Malaysia",
      "Vietnam",
      "Thailand"
    ]
  },
#   {
#     "id": "case_006",
#     "caseCode": "SC-2025-002",
#     "title": "Regional Retailer Startup — OMS + WMS Greenfield",
#     "closedDate": "2025-02-14",
#     "accountExecutive": "Farah Nadia Binti Kamarudin",
#     "solutionEngineer": "Cheong Wai Kit",
#     "client": {
#       "name": "Nuri Health & Wellness Sdn Bhd",
#       "industry": "Health Supplement & Wellness Retail",
#       "segment": "Startup / Growth",
#       "employeeCount": 48,
#       "annualRevenue_MYR": 14000000,
#       "country": "Malaysia",
#       "city": "Petaling Jaya, Selangor",
#       "warehouseCount": 1,
#       "warehouseSizeSqFt": 9000,
#       "storeCount": 6,
#       "fulfilmentNodes": 7
#     },
#     "dealSummary": {
#       "productsLicensed": [
#         "NEXUS-OMS",
#         "NEXUS-WMS"
#       ],
#       "modulesSold": [
#         "OMS-CORE",
#         "OMS-INVENTORY",
#         "OMS-FRAUD",
#         "WMS-CORE"
#       ],
#       "contractTerm": "annual",
#       "deploymentOption": "cloud_saas",
#       "dealValueMYR": {
#         "omsAnnualLicense": 423400,
#         "omsAddOnModulesAnnual": 185200,
#         "wmsAnnualLicense": 792000,
#         "implementationFee": 280000,
#         "totalFirstYear": 1680600
#       },
#       "namedUsers": 40,
#       "additionalUsers": 0,
#       "goLiveWeeks": 12
#     },
#     "clientBackground": "Nuri Health & Wellness is a home-grown Malaysian health supplement brand that sells proprietary collagen, probiotic, and immunity products. Launched in 2022, it had grown to 6 standalone concept stores (Klang Valley and Johor Bahru) plus a Shopify Plus online store. Despite the multi-channel presence, technology infrastructure was non-existent — each store ran a standalone POS with no central inventory, and the online store had no integration with the warehouse. The founders were pre-Series A and had just closed an MYR 8M seed round with a mandate to build scalable operations before a planned Series A in 18 months.",
#     "requirementsAndPainPoints": [
#       "Overselling: online store sold products that were physically in store stockrooms but not available for DC fulfilment, triggering cancellations and negative reviews.",
#       "Manual warehouse: receiving, picking, and packing managed with pen and paper in a 9,000 sq ft warehouse; 1–2 mis-picks per day.",
#       "No unified inventory: 7 inventory pools (1 DC + 6 stores) with no single view — monthly stock takes took 3 days.",
#       "Fraud exposure: 3 confirmed fraudulent orders in past 6 months totalling MYR 14,000 in high-value collagen bundles.",
#       "Founders wanted a platform that could scale to 20+ stores and additional DCs without re-platforming.",
#       "Budget-conscious: Series A runway constraints required phased spend — no modules beyond immediate need."
#     ],
#     "moduleDecisionRationale": [
#       {
#         "module": "OMS-CORE",
#         "decision": "INCLUDED",
#         "rationale": "Unifies Shopify Plus and in-store orders. Routes online orders to the DC; enables store order visibility."
#       },
#       {
#         "module": "OMS-INVENTORY",
#         "decision": "INCLUDED",
#         "rationale": "7 fulfilment nodes — above 3-node threshold. Creates single pooled inventory to resolve overselling. Also enables ship-from-store once stores have sufficient stock discipline, planned for Month 4 post go-live."
#       },
#       {
#         "module": "OMS-FRAUD",
#         "decision": "INCLUDED",
#         "rationale": "High-value supplement bundles (MYR 800–2,000) are frequent fraud targets. Three confirmed past incidents. Module cost justified by loss prevention even at startup volumes."
#       },
#       {
#         "module": "OMS-PROMISE",
#         "decision": "NOT SOLD — Year 2",
#         "rationale": "Startup lacks sufficient historical carrier data for ML model training. Will revisit once 6+ months of Nexus OMS order data has accumulated. AE to trigger at Month 9."
#       },
#       {
#         "module": "OMS-POS",
#         "decision": "NOT SOLD",
#         "rationale": "Stores use Shopify POS — pre-integrated via OMS-CORE's native Shopify connector. OMS-POS module adds value for more complex in-store operations (clienteling, endless aisle) which Nuri does not yet need."
#       },
#       {
#         "module": "WMS-CORE",
#         "decision": "INCLUDED",
#         "rationale": "Single warehouse with no automation or yard complexity. WMS-CORE eliminates the pen-and-paper receiving and picking process, resolves mis-pick rate, and provides real-time DC inventory to feed OMS-INVENTORY's pooled view."
#       }
#     ],
#     "implementationTeam": {
#       "vendorSide": [
#         {
#           "role": "Project Manager",
#           "headcount": 1,
#           "effortDays": 20
#         },
#         {
#           "role": "OMS Functional Consultant",
#           "headcount": 1,
#           "effortDays": 25
#         },
#         {
#           "role": "WMS Functional Consultant",
#           "headcount": 1,
#           "effortDays": 20
#         },
#         {
#           "role": "Integration Engineer",
#           "headcount": 1,
#           "effortDays": 15
#         }
#       ],
#       "clientSide": [
#         {
#           "role": "Co-Founder / CEO (Sponsor)",
#           "headcount": 1,
#           "effortDays": 8
#         },
#         {
#           "role": "Operations Manager",
#           "headcount": 1,
#           "effortDays": 30
#         },
#         {
#           "role": "In-house developer",
#           "headcount": 1,
#           "effortDays": 15
#         },
#         {
#           "role": "Store Managers (key users)",
#           "headcount": 6,
#           "effortDays": 5
#         }
#       ]
#     },
#     "issuesFaced": [
#       {
#         "issue": "Each of the 6 stores maintained its own informal product naming convention (e.g., 'Collagen Gold 30s', 'Gold Collagen 30 sachet', 'CG30') for the same SKU, making SKU master data consolidation difficult.",
#         "resolution": "Conducted a 2-day SKU rationalisation workshop with founders and store managers. Established a canonical product naming standard. Master data loaded centrally into OMS with store-specific alias mapping."
#       },
#       {
#         "issue": "Store managers resisted the inventory accuracy requirement (cycle counts) needed before OMS-INVENTORY could go live, perceiving it as extra workload.",
#         "resolution": "Co-Founder personally communicated the business case to store managers. Simplified the cycle count to a 30-minute weekly task using a mobile app. Framed as 'knowing what you actually have to sell online.'"
#       }
#     ],
#     "outcomes": {
#       "oversellCancellationRateAfter": "0.2% (down from 4.8%)",
#       "warehousePickAccuracyAfter": "99.3%",
#       "stockTakeDurationReductionDays": "3 days → 4 hours",
#       "fraudIncidentsSince": 0,
#       "paybackMonths": 13
#     },
#     "tags": [
#       "startup",
#       "growth",
#       "OMS",
#       "WMS",
#       "retail",
#       "health-wellness",
#       "omnichannel",
#       "shopify",
#       "malaysia",
#       "cloud-saas",
#       "pre-series-a"
#     ]
#   },
#   {
#     "id": "case_007",
#     "caseCode": "SC-2025-003",
#     "title": "MNC Freight Forwarder — TMS Full Suite Cross-Border",
#     "closedDate": "2025-03-21",
#     "accountExecutive": "Hafizuddin Roslan",
#     "solutionEngineer": "Rajan Krishnaswamy",
#     "client": {
#       "name": "Orientlink Global Logistics Pte Ltd",
#       "industry": "Freight Forwarding & 3PL",
#       "segment": "MNC",
#       "employeeCount": 2200,
#       "annualRevenue_MYR": 680000000,
#       "country": "Singapore (HQ), Malaysia, Indonesia, Thailand, Vietnam",
#       "city": "Singapore HQ; Subang Jaya MY, Jakarta ID, Bangkok TH, Hanoi VN",
#       "shipmentsPerMonth": 8400,
#       "modesManaged": [
#         "ocean_fcl",
#         "ocean_lcl",
#         "air",
#         "road_ftl",
#         "road_ltl",
#         "parcel"
#       ]
#     },
#     "dealSummary": {
#       "productsLicensed": [
#         "NEXUS-TMS"
#       ],
#       "modulesSold": [
#         "TMS-CORE",
#         "TMS-AI",
#         "TMS-CONTROL",
#         "TMS-AUDIT",
#         "TMS-INTL"
#       ],
#       "contractTerm": "annual",
#       "deploymentOption": "cloud_saas",
#       "dealValueMYR": {
#         "annualLicense": 608600,
#         "addOnModulesAnnual": 621600,
#         "implementationFee": 380000,
#         "totalFirstYear": 1610200
#       },
#       "namedUsers": 20,
#       "additionalUsers": 110,
#       "goLiveWeeks": 22
#     },
#     "clientBackground": "Orientlink is a pan-ASEAN freight forwarder with offices in 5 countries, managing ocean, air, and road freight on behalf of 340+ shipper clients. At 8,400 shipments/month across 6 modes and 22 trade lanes, the operations team was drowning in manual work: carrier bookings via email/portal, manual invoice checking against rate sheets, and no consolidated visibility across all shipments. A major shipper client (contributing 11% of revenue) threatened to switch to a competitor that provided a real-time tracking portal. The CFO identified freight overbilling recovery as a high-priority initiative after an external audit found MYR 1.8M in overcharges billed in FY2024.",
#     "requirementsAndPainPoints": [
#       "8,400 shipments/month managed across 22 trade lanes with no TMS — operations team of 45 coordinators working in silos by mode and country.",
#       "No consolidated shipment visibility — operations director could not see all in-transit shipments without logging into 8 different carrier portals.",
#       "Freight audit was entirely manual: 3-person team cross-checking carrier invoices against Excel rate sheets. External audit found MYR 1.8M overbilling in FY2024.",
#       "Cross-border shipments across 5 ASEAN countries + export to US and EU required customs documentation in each jurisdiction.",
#       "Major shipper client demanded real-time shipment tracking portal accessible without contacting Orientlink operations.",
#       "No OFAC screening process — compliance risk flagged by internal legal team."
#     ],
#     "moduleDecisionRationale": [
#       {
#         "module": "TMS-CORE",
#         "decision": "INCLUDED",
#         "rationale": "Foundation for all 8,400 monthly shipments across 6 modes. Pre-loaded tariffs for all major ASEAN carriers. Replaces manual carrier booking workflow."
#       },
#       {
#         "module": "TMS-AI",
#         "decision": "INCLUDED",
#         "rationale": "8,400 shipments/month — 16× above the 500/month recommendation threshold. ML carrier scoring expected to deliver significant cost reduction across 22 lanes. Predictive ETA supports proactive customer communication. CO₂ reporting required by 3 EU-based shipper clients under CSRD scope."
#       },
#       {
#         "module": "TMS-CONTROL",
#         "decision": "INCLUDED",
#         "rationale": "Directly addresses the major client retention risk: supplier collaboration portal gives the shipper client real-time shipment tracking without Orientlink coordinator involvement. Also resolves ops director visibility gap across 5 countries and 8 carrier portals."
#       },
#       {
#         "module": "TMS-AUDIT",
#         "decision": "INCLUDED",
#         "rationale": "MYR 1.8M overbilling found in FY2024 makes this the highest-ROI module in the deal. AI invoice matching eliminates 3-person manual audit team. Module cost MYR 112,300/year against MYR 1.8M annual recovery opportunity. CFO signed off immediately on ROI basis alone."
#       },
#       {
#         "module": "TMS-INTL",
#         "decision": "INCLUDED — mandatory",
#         "rationale": "Operations span Malaysia, Singapore, Indonesia, Thailand, Vietnam + US and EU exports. Every shipment crosses at least one border. OFAC screening is non-negotiable given legal team's compliance flag. HS code classification required across all 5 ASEAN jurisdictions."
#       }
#     ],
#     "implementationTeam": {
#       "vendorSide": [
#         {
#           "role": "Programme Manager",
#           "headcount": 1,
#           "effortDays": 55
#         },
#         {
#           "role": "TMS Lead Consultant",
#           "headcount": 2,
#           "effortDays": 75
#         },
#         {
#           "role": "TMS-INTL / Customs Specialist",
#           "headcount": 1,
#           "effortDays": 40
#         },
#         {
#           "role": "TMS-AUDIT Specialist",
#           "headcount": 1,
#           "effortDays": 30
#         },
#         {
#           "role": "Carrier Onboarding Specialist",
#           "headcount": 1,
#           "effortDays": 25
#         },
#         {
#           "role": "Integration Engineer",
#           "headcount": 2,
#           "effortDays": 40
#         }
#       ],
#       "clientSide": [
#         {
#           "role": "COO (Sponsor)",
#           "headcount": 1,
#           "effortDays": 10
#         },
#         {
#           "role": "CFO (Audit module champion)",
#           "headcount": 1,
#           "effortDays": 8
#         },
#         {
#           "role": "Group IT Manager",
#           "headcount": 1,
#           "effortDays": 45
#         },
#         {
#           "role": "Operations Director",
#           "headcount": 1,
#           "effortDays": 40
#         },
#         {
#           "role": "Trade Compliance Officer",
#           "headcount": 1,
#           "effortDays": 30
#         },
#         {
#           "role": "Country Operations Leads",
#           "headcount": 4,
#           "effortDays": 20
#         }
#       ]
#     },
#     "issuesFaced": [
#       {
#         "issue": "Rate loading for 22 trade lanes across 6 modes involved 340+ individual carrier rate sheets in inconsistent formats (Excel, PDF, email text). Carrier onboarding took 6 weeks — 2 weeks longer than planned.",
#         "resolution": "Built a rate extraction utility that parsed PDF rate sheets using a template-matching approach. Reduced manual data entry by 60%. Flagged to product team: a carrier rate ingestion wizard would reduce implementation time for freight forwarder clients significantly."
#       },
#       {
#         "issue": "Indonesia country operations ran a proprietary local TMS (Kereta Logistik platform) that Nexus TMS had no pre-built connector for. Indonesian team resisted replacing it, citing local regulatory reporting requirements.",
#         "resolution": "Deployed Nexus TMS as the global system of record; built a REST API bridge to Kereta Logistik for Indonesia-specific regulatory reports. Indonesia operates in a hybrid mode — Nexus for global visibility, Kereta for local filings."
#       },
#       {
#         "issue": "TMS-AUDIT AI initially flagged 22% of legitimate invoices as discrepancies due to carrier accessorial charge structures that varied by ASEAN country (e.g., Malaysia fuel surcharge calculated differently from Singapore).",
#         "resolution": "Country-specific accessorial rate tables built into the audit engine. False-positive rate fell to 4.1% within 4 weeks. Genuine discrepancy detection rate settled at 96.3%."
#       },
#       {
#         "issue": "Major shipper client (11% revenue) demanded early access to the Control Tower portal 8 weeks before go-live, creating pressure to deliver a partial deployment.",
#         "resolution": "Delivered a limited read-only Control Tower view for the specific client's shipments only, using a sandbox dataset. Managed expectations clearly: full live data available at Week 22 go-live. Client accepted the timeline."
#       }
#     ],
#     "outcomes": {
#       "freightAuditRecoveryYear1MYR": 1620000,
#       "carrierPortalLoginsEliminated": 8,
#       "coordinatorProductivityGainPct": 35,
#       "majorClientRetained": true,
#       "ofacScreeningImplemented": true,
#       "paybackMonths": 12
#     },
#     "tags": [
#       "MNC",
#       "TMS",
#       "freight-forwarding",
#       "3PL",
#       "cross-border",
#       "ASEAN",
#       "control-tower",
#       "freight-audit",
#       "global-trade",
#       "singapore",
#       "malaysia"
#     ]
#   },
#   {
#     "id": "case_008",
#     "caseCode": "SC-2025-004",
#     "title": "SME Frozen Food Manufacturer — WMS with Analytics",
#     "closedDate": "2025-04-03",
#     "accountExecutive": "Farah Nadia Binti Kamarudin",
#     "solutionEngineer": "Cheong Wai Kit",
#     "client": {
#       "name": "Sejuk Maju Food Industries Sdn Bhd",
#       "industry": "Frozen Food Manufacturing & Distribution",
#       "segment": "SME",
#       "employeeCount": 145,
#       "annualRevenue_MYR": 38000000,
#       "country": "Malaysia",
#       "city": "Nilai, Negeri Sembilan",
#       "warehouseCount": 1,
#       "warehouseSizeSqFt": 42000,
#       "coldChain": true
#     },
#     "dealSummary": {
#       "productsLicensed": [
#         "NEXUS-WMS"
#       ],
#       "modulesSold": [
#         "WMS-CORE",
#         "WMS-ANALYTICS"
#       ],
#       "contractTerm": "annual",
#       "deploymentOption": "on_premise",
#       "dealValueMYR": {
#         "annualLicense": 792000,
#         "addOnModulesAnnual": 133900,
#         "implementationFee": 180000,
#         "totalFirstYear": 1105900
#       },
#       "namedUsers": 25,
#       "additionalUsers": 8,
#       "goLiveWeeks": 10
#     },
#     "clientBackground": "Sejuk Maju produces and distributes frozen dim sum, dumplings, and ready-to-cook products to hypermarkets (Aeon, Giant, Lotus's), foodservice distributors, and a growing online channel via Shopee. The warehouse is a full cold-chain facility operating at -18°C in the freezer zone and 2–4°C in the chiller zone. Prior to Nexus WMS, FEFO (First Expired First Out) compliance was managed manually by supervisors marking cartons with masking tape dates — a method that was failing as SKU count grew from 45 to 180 SKUs in 18 months. A Malaysia Retail Chain Association audit had flagged FEFO non-compliance as a risk to the client's supply agreements with Aeon.",
#     "requirementsAndPainPoints": [
#       "FEFO non-compliance: manual date management was failing with 180 SKUs — 3 incidents in 6 months of near-expired stock reaching hypermarket shelves.",
#       "Cold chain operations: system must support freezer (-18°C) and chiller (2–4°C) zone management with appropriate hardware (frozen-rated scanners, tablets).",
#       "MD wanted labour productivity data by shift to support a performance bonus scheme — current supervisors tracked this in handwritten sheets.",
#       "Nexus WMS needed to run on-premise due to MD's concern about cloud data sovereignty for recipes and production formulations (though these are not in WMS — a misunderstanding clarified during presales).",
#       "Single warehouse, no 3PL clients, no yard complexity, no robotics.",
#       "Shopee channel orders needed to feed into WMS pick workflow directly."
#     ],
#     "moduleDecisionRationale": [
#       {
#         "module": "WMS-CORE",
#         "decision": "INCLUDED",
#         "rationale": "Provides FEFO-enforced directed putaway and pick — system directs pickers to the earliest-expiry LPN first, regardless of location. Barcode scanning at receiving captures lot number and expiry date. Resolves the core FEFO compliance risk."
#       },
#       {
#         "module": "WMS-ANALYTICS",
#         "decision": "INCLUDED",
#         "rationale": "MD's labour productivity KPI requirement and shift-level performance bonus scheme directly maps to WMS-ANALYTICS labour management and engineered standards module. Without this, the MD would need to continue manual supervisor tracking."
#       },
#       {
#         "module": "WMS-YARD",
#         "decision": "NOT SOLD",
#         "rationale": "6 dock doors, 10–15 inbound vehicles/day. Below yard management threshold."
#       },
#       {
#         "module": "WMS-3PL",
#         "decision": "NOT SOLD",
#         "rationale": "Own inventory only. Not a 3PL operator."
#       },
#       {
#         "module": "WMS-ROBOT",
#         "decision": "NOT SOLD",
#         "rationale": "No automation hardware. Cold chain environments also require specialised robot certification — flagged as a consideration if client explores automation in future."
#       }
#     ],
#     "implementationTeam": {
#       "vendorSide": [
#         {
#           "role": "Project Manager",
#           "headcount": 1,
#           "effortDays": 18
#         },
#         {
#           "role": "WMS Functional Consultant",
#           "headcount": 1,
#           "effortDays": 35
#         },
#         {
#           "role": "On-Premise Infrastructure Specialist",
#           "headcount": 1,
#           "effortDays": 12
#         }
#       ],
#       "clientSide": [
#         {
#           "role": "Managing Director (Sponsor)",
#           "headcount": 1,
#           "effortDays": 6
#         },
#         {
#           "role": "Warehouse Manager",
#           "headcount": 1,
#           "effortDays": 25
#         },
#         {
#           "role": "IT Executive",
#           "headcount": 1,
#           "effortDays": 18
#         },
#         {
#           "role": "QA / Food Safety Executive",
#           "headcount": 1,
#           "effortDays": 10
#         }
#       ]
#     },
#     "issuesFaced": [
#       {
#         "issue": "Standard WMS barcode scanners were not rated for prolonged use at -18°C — the battery died within 20 minutes in the freezer zone during UAT.",
#         "resolution": "Procured 8 units of Zebra TC52ax-HC cold storage scanners (rated to -30°C) at client's cost. Nexus pre-sales team to add hardware cold-chain specification guide to SME WMS proposal toolkit."
#       },
#       {
#         "issue": "On-premise server sizing was initially undersized — the client's IT executive had specified a server with 8 CPU cores and 32GB RAM based on a generic spec; WMS-ANALYTICS BI engine required 16 cores and 64GB for acceptable report generation times.",
#         "resolution": "Client upgraded server before go-live at an additional MYR 18,000 hardware cost. Nexus solution engineer to include server sizing calculator in on-premise proposals."
#       },
#       {
#         "issue": "FEFO configuration required the WMS to recognise both YYYY-MM-DD and DD/MM/YY date formats on supplier carton labels (different suppliers use different standards), causing receiving errors during UAT.",
#         "resolution": "Configured a dual date-format parser at the receiving scan station. QA executive created a supplier label standard requirement letter to migrate all suppliers to a single format by 2026."
#       }
#     ],
#     "outcomes": {
#       "fefoComplianceRate": "100% post go-live (0 near-expiry incidents in 3 months)",
#       "aeonAuditResult": "Passed with no findings",
#       "labourProductivityGainPct": 22,
#       "stockAccuracyAfter": "99.4%",
#       "paybackMonths": 11
#     },
#     "tags": [
#       "SME",
#       "WMS",
#       "manufacturing",
#       "cold-chain",
#       "frozen-food",
#       "FEFO",
#       "on-premise",
#       "analytics",
#       "malaysia",
#       "labour-management"
#     ]
#   },
#   {
#     "id": "case_009",
#     "caseCode": "SC-2025-005",
#     "title": "Startup TMS-Only — Domestic Last Mile Aggregator",
#     "closedDate": "2025-04-28",
#     "accountExecutive": "Darren Lim Wei Jian",
#     "solutionEngineer": "Priya Subramaniam",
#     "client": {
#       "name": "SwiftNode Sdn Bhd",
#       "industry": "Last-Mile Delivery Technology (Startup)",
#       "segment": "Startup",
#       "employeeCount": 22,
#       "annualRevenue_MYR": 6200000,
#       "country": "Malaysia",
#       "city": "Cyberjaya, Selangor",
#       "shipmentsPerMonth": 680,
#       "modesManaged": [
#         "parcel",
#         "road_ltl"
#       ]
#     },
#     "dealSummary": {
#       "productsLicensed": [
#         "NEXUS-TMS"
#       ],
#       "modulesSold": [
#         "TMS-CORE",
#         "TMS-AI"
#       ],
#       "contractTerm": "monthly",
#       "deploymentOption": "cloud_saas",
#       "dealValueMYR": {
#         "monthlyLicense": 56800,
#         "addOnModulesMonthly": 15600,
#         "implementationFee": 152000,
#         "totalFirstYear": 1065600
#       },
#       "namedUsers": 20,
#       "additionalUsers": 2,
#       "goLiveWeeks": 7
#     },
#     "clientBackground": "SwiftNode is a tech-enabled last-mile delivery aggregator founded in 2023, providing a single API for e-commerce merchants to access multiple parcel and LTL carriers (Pos Laju, J&T Express, Ninja Van, DHL eCommerce, Lalamove). The founding team came from logistics operations and identified that SME merchants were overpaying for parcel delivery by 18–30% due to not having consolidated volume to negotiate tariffs. SwiftNode aggregates volume across hundreds of merchants to negotiate better rates, then charges a small margin on each shipment. They needed a TMS to automate carrier selection, track all shipments in one dashboard, and prove carrier performance to merchant clients.",
#     "requirementsAndPainPoints": [
#       "Manual carrier selection: operations team selecting carriers via individual carrier portals — no rate comparison tool. Estimated 15–20 minutes per shipment decision.",
#       "No consolidated tracking: merchant customers demanded a single tracking dashboard; SwiftNode had to log into 5 carrier portals separately.",
#       "At 680 shipments/month and growing, the manual process was not scalable. CTO estimated breakeven of the current manual model at 1,000 shipments/month.",
#       "Needed to produce carrier performance reports for merchant SLA reporting.",
#       "Monthly billing preferred due to startup runway uncertainty.",
#       "No international shipments — purely domestic Malaysia parcel and LTL."
#     ],
#     "moduleDecisionRationale": [
#       {
#         "module": "TMS-CORE",
#         "decision": "INCLUDED",
#         "rationale": "Core carrier rate engine and shipment tracking resolves the manual carrier selection and portal-hopping problems. Pre-loaded Pos Laju, J&T, Ninja Van, DHL eCommerce, and Lalamove tariffs directly relevant."
#       },
#       {
#         "module": "TMS-AI",
#         "decision": "INCLUDED — borderline case",
#         "rationale": "At 680 shipments/month, the client is just above the 500/month threshold. Decision made because: (a) client is growing rapidly and will exceed 1,000/month within 6 months per CTO projection, (b) carrier scorecard and performance ranking is a product differentiator SwiftNode sells to merchant clients, (c) CO₂ emissions estimation is a feature merchants are requesting. AE flagged that TMS-AI ROI will increase significantly as volume grows."
#       },
#       {
#         "module": "TMS-CONTROL",
#         "decision": "NOT SOLD — evaluated but deferred",
#         "rationale": "The Control Tower collaboration portal could serve as a merchant-facing visibility tool. However, startup budget constraints and the fact that TMS-CORE already provides shipment tracking meant the additional cost was not justified at current scale. Flagged for Month 6 review."
#       },
#       {
#         "module": "TMS-AUDIT",
#         "decision": "NOT SOLD",
#         "rationale": "SwiftNode negotiates consolidated rate contracts with carriers — invoice discrepancies are minimal. Audit module ROI insufficient at current volume."
#       },
#       {
#         "module": "TMS-INTL",
#         "decision": "NOT SOLD",
#         "rationale": "Purely domestic Malaysia operations. No cross-border shipments in current or 12-month roadmap."
#       }
#     ],
#     "implementationTeam": {
#       "vendorSide": [
#         {
#           "role": "Project Manager",
#           "headcount": 1,
#           "effortDays": 12
#         },
#         {
#           "role": "TMS Functional Consultant",
#           "headcount": 1,
#           "effortDays": 20
#         },
#         {
#           "role": "Carrier Onboarding Specialist",
#           "headcount": 1,
#           "effortDays": 10
#         }
#       ],
#       "clientSide": [
#         {
#           "role": "CTO / Co-Founder (technical sponsor)",
#           "headcount": 1,
#           "effortDays": 15
#         },
#         {
#           "role": "Head of Operations",
#           "headcount": 1,
#           "effortDays": 20
#         }
#       ]
#     },
#     "issuesFaced": [
#       {
#         "issue": "Lalamove API required OAuth 2.0 authentication with a 15-minute token expiry, which the standard TMS-CORE Lalamove connector did not handle correctly — causing booking failures after idle periods.",
#         "resolution": "Nexus integration team patched the Lalamove connector to implement token refresh logic. Patch deployed within 3 days. Added to the standard connector library."
#       },
#       {
#         "issue": "Ninja Van's real-time tracking webhook had a 4–6 hour delay for outstation (non-Klang Valley) deliveries, making TMS tracking dashboard appear stale for merchant clients.",
#         "resolution": "Added a polling fallback for Ninja Van outstation shipments on a 2-hour interval. Displayed a 'regional delivery in progress' status indicator for affected shipments to manage merchant expectations."
#       }
#     ],
#     "outcomes": {
#       "carrierSelectionTimeReductionMinutes": "18 min → 45 sec",
#       "estimatedAnnualCarrierCostSavingMYR": 180000,
#       "merchantPortalLogins": "Single dashboard replaces 5 portals",
#       "shipmentsMonth6": 1140,
#       "paybackMonths": 9
#     },
#     "tags": [
#       "startup",
#       "TMS",
#       "last-mile",
#       "parcel",
#       "aggregator",
#       "malaysia",
#       "cloud-saas",
#       "monthly-billing",
#       "ai-optimisation",
#       "tech-startup"
#     ]
#   },
#   {
#     "id": "case_010",
#     "caseCode": "SC-2025-006",
#     "title": "Large Retailer MNC — Full Nexus Suite (WMS + TMS + OMS)",
#     "closedDate": "2025-05-12",
#     "accountExecutive": "Hafizuddin Roslan",
#     "solutionEngineer": "Rajan Krishnaswamy",
#     "client": {
#       "name": "ParsonsCo Retail Asia Pacific Sdn Bhd",
#       "industry": "Mass Market Retail (FMCG & General Merchandise)",
#       "segment": "MNC",
#       "employeeCount": 12500,
#       "annualRevenue_MYR": 4800000000,
#       "country": "Malaysia (regional HQ), Singapore, Thailand, Indonesia, Philippines",
#       "city": "Multiple; MY HQ in Petaling Jaya",
#       "warehouseCount": 9,
#       "warehouseSizeSqFt": 2100000,
#       "storeCount": 210,
#       "fulfilmentNodes": 219,
#       "shipmentsPerMonth": 14200
#     },
#     "dealSummary": {
#       "productsLicensed": [
#         "NEXUS-WMS",
#         "NEXUS-TMS",
#         "NEXUS-OMS"
#       ],
#       "modulesSold": [
#         "WMS-CORE",
#         "WMS-YARD",
#         "WMS-ROBOT",
#         "WMS-ANALYTICS",
#         "WMS-3PL",
#         "TMS-CORE",
#         "TMS-AI",
#         "TMS-CONTROL",
#         "TMS-AUDIT",
#         "TMS-INTL",
#         "OMS-CORE",
#         "OMS-INVENTORY",
#         "OMS-PROMISE",
#         "OMS-POS",
#         "OMS-FRAUD"
#       ],
#       "contractTerm": "annual",
#       "deploymentOption": "hybrid",
#       "dealValueMYR": {
#         "wmsAnnualLicense": 792000,
#         "wmsAddOnModulesAnnual": 872200,
#         "tmsAnnualLicense": 608600,
#         "tmsAddOnModulesAnnual": 621600,
#         "omsAnnualLicense": 423400,
#         "omsAddOnModulesAnnual": 401800,
#         "implementationFee": 1800000,
#         "totalFirstYear": 5519600
#       },
#       "namedUsers": 350,
#       "additionalUsers": 280,
#       "goLiveWeeks": 52,
#       "phased": true,
#       "phases": [
#         {
#           "phase": 1,
#           "scope": "WMS-CORE at 3 MY DCs + OMS-CORE",
#           "targetWeek": 16
#         },
#         {
#           "phase": 2,
#           "scope": "WMS add-on modules + TMS-CORE + TMS-AI",
#           "targetWeek": 32
#         },
#         {
#           "phase": 3,
#           "scope": "OMS full modules + TMS-CONTROL + TMS-INTL + TMS-AUDIT + regional rollout",
#           "targetWeek": 52
#         }
#       ]
#     },
#     "clientBackground": "ParsonsCo Retail Asia Pacific is the APAC arm of a global mass-market retailer. In Malaysia, it operates hypermarkets, supermarkets, and petrol convenience stores. The group had been running a patchwork of country-specific legacy systems — a 2008-vintage WMS in Malaysia, Oracle OTM (not fully implemented) for transport, and Salesforce Commerce Cloud for e-commerce with no OMS. The Group CIO had a board mandate to consolidate onto a single supply chain platform across 5 ASEAN markets. Malaysia was designated the pilot market. The deal was the largest in Nexus's ASEAN history and required executive-level governance.",
#     "requirementsAndPainPoints": [
#       "9 warehouses on 4 different legacy WMS versions — no unified inventory or warehouse KPI visibility.",
#       "3 MY DCs operating Dematic AS/RS and Locus Robotics AMRs with no WMS integration — automation was under-utilised.",
#       "210 stores with Shopify POS and an e-commerce platform that had no OMS — online orders fulfilled manually from a single DC.",
#       "14,200 shipments/month across 5 countries with no TMS — 22 freight coordinators managing bookings via email and WhatsApp.",
#       "Cross-border freight to/from Singapore, Thailand, Indonesia, and Philippines with manual customs documentation.",
#       "3 of 9 warehouses operated as internal 3PL nodes for subsidiary brands — internal billing was an annual manual exercise.",
#       "Group CIO required 99.9% WMS uptime SLA aligned to retail trading hours (no overnight maintenance windows in MY)."
#     ],
#     "moduleDecisionRationale": [
#       {
#         "module": "WMS-CORE",
#         "decision": "INCLUDED — all 9 DCs",
#         "rationale": "Full platform consolidation across 9 warehouses. Multi-site architecture required."
#       },
#       {
#         "module": "WMS-YARD",
#         "decision": "INCLUDED — 6 of 9 DCs",
#         "rationale": "6 DCs have 20+ dock doors. 3 smaller DCs (8–12 doors) excluded."
#       },
#       {
#         "module": "WMS-ROBOT",
#         "decision": "INCLUDED",
#         "rationale": "Dematic AS/RS (pre-certified) in 2 DCs and Locus Robotics AMRs (pre-certified) in 1 DC. Connecting all 3 eliminates dual-console operations and unlocks full automation ROI."
#       },
#       {
#         "module": "WMS-ANALYTICS",
#         "decision": "INCLUDED",
#         "rationale": "Group CIO requires cross-DC KPI benchmarking. Labour management module for 3,200 warehouse staff. Slotting optimisation across 9 DCs with combined 400,000+ bin locations."
#       },
#       {
#         "module": "WMS-3PL",
#         "decision": "INCLUDED",
#         "rationale": "3 DCs operate as internal 3PL for subsidiary brands. Multi-client billing engine and client portal required for internal chargeback accuracy."
#       },
#       {
#         "module": "TMS-CORE",
#         "decision": "INCLUDED",
#         "rationale": "14,200 shipments/month requires a full TMS platform. Replaces 22 freight coordinators' manual workflow."
#       },
#       {
#         "module": "TMS-AI",
#         "decision": "INCLUDED",
#         "rationale": "14,200 shipments/month — massive optimisation opportunity. CO₂ emissions reporting for Group ESG reporting. Predictive ETA for delivery promise."
#       },
#       {
#         "module": "TMS-CONTROL",
#         "decision": "INCLUDED",
#         "rationale": "5-country operation requires a single control tower. Supplier collaboration portal needed by 80+ suppliers."
#       },
#       {
#         "module": "TMS-AUDIT",
#         "decision": "INCLUDED",
#         "rationale": "At 14,200 shipments/month, even a 1% overbilling rate represents significant annual recovery. Group CFO required automated freight audit as a governance control."
#       },
#       {
#         "module": "TMS-INTL",
#         "decision": "INCLUDED — mandatory",
#         "rationale": "Cross-border freight across 5 ASEAN countries. OFAC screening for all supplier and carrier parties required by Group compliance policy."
#       },
#       {
#         "module": "OMS-CORE",
#         "decision": "INCLUDED",
#         "rationale": "First true OMS for the group. Unifies Shopify Plus, marketplace (Lazada, Shopee), and store orders."
#       },
#       {
#         "module": "OMS-INVENTORY",
#         "decision": "INCLUDED — mandatory",
#         "rationale": "219 fulfilment nodes (9 DCs + 210 stores). Essential prerequisite for omnichannel."
#       },
#       {
#         "module": "OMS-PROMISE",
#         "decision": "INCLUDED",
#         "rationale": "Competing with Lazada and Shopee native fulfilment speed. Delivery promise at checkout is a conversion requirement."
#       },
#       {
#         "module": "OMS-POS",
#         "decision": "INCLUDED",
#         "rationale": "210 Shopify POS stores. Endless aisle and ship-from-store critical for hypermarket format where store inventory can fulfil online orders from 210 locations."
#       },
#       {
#         "module": "OMS-FRAUD",
#         "decision": "INCLUDED",
#         "rationale": "High-volume e-commerce across 5 markets with high-value general merchandise. Fraud module required to protect margins."
#       }
#     ],
#     "implementationTeam": {
#       "vendorSide": [
#         {
#           "role": "Programme Director",
#           "headcount": 1,
#           "effortDays": 200
#         },
#         {
#           "role": "WMS Lead Consultant",
#           "headcount": 2,
#           "effortDays": 120
#         },
#         {
#           "role": "WMS Regional Consultants",
#           "headcount": 3,
#           "effortDays": 80
#         },
#         {
#           "role": "TMS Lead Consultant",
#           "headcount": 1,
#           "effortDays": 100
#         },
#         {
#           "role": "OMS Lead Consultant",
#           "headcount": 1,
#           "effortDays": 90
#         },
#         {
#           "role": "Robotics Integration Engineer",
#           "headcount": 2,
#           "effortDays": 50
#         },
#         {
#           "role": "SAP / ERP Integration Architect",
#           "headcount": 1,
#           "effortDays": 80
#         },
#         {
#           "role": "Data Migration Lead",
#           "headcount": 2,
#           "effortDays": 70
#         },
#         {
#           "role": "TMS-INTL Customs Specialist",
#           "headcount": 1,
#           "effortDays": 50
#         },
#         {
#           "role": "Training Lead",
#           "headcount": 2,
#           "effortDays": 60
#         },
#         {
#           "role": "QA & Testing Lead",
#           "headcount": 1,
#           "effortDays": 80
#         }
#       ],
#       "clientSide": [
#         {
#           "role": "Group CIO (Executive Sponsor)",
#           "headcount": 1,
#           "effortDays": 25
#         },
#         {
#           "role": "APAC Supply Chain Director",
#           "headcount": 1,
#           "effortDays": 80
#         },
#         {
#           "role": "Group IT Programme Manager",
#           "headcount": 1,
#           "effortDays": 150
#         },
#         {
#           "role": "DC Managers (9 sites)",
#           "headcount": 9,
#           "effortDays": 50
#         },
#         {
#           "role": "E-Commerce Director",
#           "headcount": 1,
#           "effortDays": 40
#         },
#         {
#           "role": "Trade Compliance Manager",
#           "headcount": 1,
#           "effortDays": 40
#         },
#         {
#           "role": "Super Users / Champions",
#           "headcount": 45,
#           "effortDays": 20
#         }
#       ]
#     },
#     "issuesFaced": [
#       {
#         "issue": "Phase 1 go-live coincided with the client's year-end stock count obligation under Malaysian Companies Act. A 72-hour system freeze was required, conflicting with the WMS cut-over plan.",
#         "resolution": "Rescheduled Phase 1 go-live by 3 weeks to avoid the stock count window. Updated project plan with client's finance team to map all regulatory freeze periods across all 5 markets for Phases 2 and 3."
#       },
#       {
#         "issue": "Indonesia and Philippines regulatory environments required specific customs document formats not covered by TMS-INTL's standard document templates.",
#         "resolution": "Engaged two local customs house broker partners to provide country-specific document templates. Built as configurable document templates within TMS-INTL. Flagged to product team for inclusion in the standard template library."
#       },
#       {
#         "issue": "Locus Robotics AMRs in 1 DC were on a firmware version with a known API authentication bug that caused WMS-ROBOT integration to drop connections every 6–8 hours.",
#         "resolution": "Locus Robotics deployed a patch firmware version on-site within 2 weeks. Nexus added a firmware pre-certification check to the WMS-ROBOT integration checklist."
#       },
#       {
#         "issue": "OMS-INVENTORY pooling across 219 nodes caused a 400ms latency spike on ATP queries during flash sales (Shopee 12.12 event) — Shopify Plus PDP was timing out.",
#         "resolution": "Deployed a Redis caching layer for ATP responses with a 90-second TTL. Flash sale ATP accuracy reduced to ±2 minutes but latency dropped to 28ms. Documented as standard architecture for clients with 100+ nodes."
#       },
#       {
#         "issue": "22 freight coordinators displaced by TMS-CORE automation raised an internal HR concern about redundancies. Union representation was involved.",
#         "resolution": "Client HR and supply chain director designed a redeployment programme: 14 coordinators retrained as TMS system administrators and carrier relationship managers; 8 moved to other business units. Nexus provided 40 hours of TMS administrator training at no charge as goodwill."
#       }
#     ],
#     "outcomes": {
#       "freightCostReductionPct": 11.8,
#       "onTimeDeliveryAfter": "94.1%",
#       "warehousePickAccuracyAfter": "99.7%",
#       "robotUtilisationAfter": "88%",
#       "omniChannelFulfilmentShare": "23% of online orders fulfilled from stores",
#       "checkoutConversionUplift": "8.4%",
#       "chargebackRateAfter": "0.5%",
#       "freightAuditRecoveryYear1MYR": 3800000,
#       "paybackMonths": 20,
#       "largestDealInNexusASEANHistory": true
#     },
#     "tags": [
#       "MNC",
#       "WMS",
#       "TMS",
#       "OMS",
#       "full-suite",
#       "retail",
#       "omnichannel",
#       "robotics",
#       "global-trade",
#       "ASEAN",
#       "multi-site",
#       "enterprise",
#       "malaysia",
#       "hybrid"
#     ]
#   }
]