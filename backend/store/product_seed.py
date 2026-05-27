PRODUCT_SEED = [
  {
    "id": "665a1f0000000000000001a1",
    "productCode": "NEXUS-WMS",
    "productName": "Nexus WMS — Warehouse Management System",
    "category": "warehouse_management",
    "vendor": "Nexus Supply Chain Solutions",
    "version": "7.4.2",
    "tier": "enterprise",
    "deploymentOptions": [
      "cloud_saas",
      "on_premise",
      "hybrid"
    ],
    "targetSegment": [
      "3PL",
      "retail",
      "manufacturing",
      "ecommerce"
    ],
    "description": "Nexus WMS is an enterprise-grade Warehouse Management System designed for high-throughput, multi-site distribution operations. It is the correct choice when a client needs to manage physical inventory movement inside one or more warehouse or distribution centre (DC) facilities. Choose this product when the client requirement mentions any of: inbound receiving, putaway, pick-pack-ship, cycle counting, slotting optimisation, labour productivity, yard management, or warehouse robotics. It supports 3PL operators who manage inventory on behalf of multiple clients, as well as retailers, manufacturers, and e-commerce brands running their own DCs. Not suitable as a standalone solution for transportation planning, order orchestration, or demand forecasting — pair with Nexus TMS for carrier management and Nexus OMS for order routing. Minimum viable deployment requires the WMS-CORE module. Additional modules unlock yard control, robotics orchestration, BI analytics, and 3PL billing. Supports cloud SaaS, on-premise, and hybrid deployment. Certified for SOC 2 Type II and ISO 27001. Base license includes 25 named users.",
    "thumbnail": "https://placehold.co/400x240/0F6E56/FFFFFF?text=Nexus+WMS",
    "pricing": {
      "model": "subscription_plus_modules",
      "currency": "MYR",
      "billingCycles": [
        "monthly",
        "annual"
      ],
      "baseLicense": {
        "monthly": 37000,
        "annual": 396000,
        "annualDiscountPct": 11,
        "includedUsers": 25,
        "perAdditionalUser": 250,
        "monthly_usd": 9250,
        "annual_usd": 99000,
        "perAdditionalUser_usd": 60
      },
      "implementationFee": {
        "standard": 90000,
        "enterprise": 240000,
        "note": "Includes 8-week guided deployment, data migration, and 3 training sessions",
        "standard_usd": 22500,
        "enterprise_usd": 60000
      },
      "exchangeRateUsed": {
        "from": "USD",
        "to": "MYR",
        "rate": 4.0,
        "rateDate": "2026-05-25"
      }
    },
    "modules": [
      {
        "moduleCode": "WMS-CORE",
        "moduleName": "Core Warehouse Operations",
        "included": True,
        "description": "The foundational module included with every Nexus WMS license. Covers the complete inbound-to-outbound warehouse execution cycle: receiving purchase orders and ASNs, directed putaway to bin locations, wave and batch pick planning, pack verification, shipment manifesting, and carrier label generation. Manages inventory at the licence plate number (LPN) level for full unit-level traceability. Supports barcode scanning (1D/2D) and RFID readers. Includes a real-time inventory dashboard showing stock by location, zone, and status. Select this module for any client that needs to physically manage inventory inside a warehouse or DC. This module alone is sufficient for a single-site, single-client warehouse with no yard, robotics, or 3PL billing requirements.",
        "features": [
          "Barcode & RFID scanning",
          "Multi-location slotting",
          "Wave & batch picking",
          "LPN (license plate number) tracking",
          "Standard carrier label printing",
          "Real-time inventory dashboard"
        ],
        "tags": ["wms_core"]
      },
      {
        "moduleCode": "WMS-YARD",
        "moduleName": "Yard Management",
        "included": False,
        "pricing": {
          "monthly": 4400,
          "annual": 47500,
          "monthly_usd": 1100,
          "annual_usd": 11880
        },
        "description": "Add-on module required when the client needs to manage the area outside the warehouse building: the yard, gates, and truck doors. Digitises the full gate-in to gate-out trailer lifecycle. Provides dock appointment scheduling so inbound carriers book time slots in advance, reducing wait times and detention charges. Tracks trailers and containers by location within the yard. Integrates driver ETA feeds so dock staff can proactively stage doors. Recommend this module when the client has: a large yard with 10+ dock doors, high trailer dwell-time issues, multiple inbound carriers arriving daily, or cross-docking operations where trailer sequencing is critical. Not required for small single-dock facilities.",
        "features": [
          "Digital gate kiosk",
          "Dock appointment scheduling",
          "Trailer & container tracking",
          "Driver ETA integration"
        ],
        "tags": ["wms_yard"]
      },
      {
        "moduleCode": "WMS-ROBOT",
        "moduleName": "Robotics & Automation Interface",
        "included": False,
        "pricing": {
          "monthly": 9600,
          "annual": 103700,
          "monthly_usd": 2400,
          "annual_usd": 25920
        },
        "description": "Add-on integration layer that connects Nexus WMS to autonomous mobile robots (AMRs), automated storage and retrieval systems (AS/RS), sorters, and conveyors. Acts as the middleware orchestration engine — WMS sends work orders, the robot layer executes them, and results are confirmed back to WMS in real time. Pre-certified integrations with Locus Robotics, Geek+, AutoStore, SSI Schaefer, and Dematic. Includes a robot fleet dashboard showing unit utilisation, task queues, and exception alerts. Select this module when the client already operates or plans to deploy warehouse automation hardware. Without this module, WMS can only direct human pickers. Requires the client to have a compatible automation vendor — validate against the compatibleSystems list.",
        "compatibleSystems": [
          "Locus Robotics",
          "Geek+",
          "AutoStore",
          "SSI Schaefer",
          "Dematic"
        ],
        "features": [
          "Real-time task orchestration",
          "Robot fleet dashboard",
          "Exception & collision alerts",
          "Throughput analytics"
        ],
        "tags": ["wms_robot"]
      },
      {
        "moduleCode": "WMS-ANALYTICS",
        "moduleName": "Advanced Analytics & BI",
        "included": False,
        "pricing": {
          "monthly": 6200,
          "annual": 66950,
          "monthly_usd": 1550,
          "annual_usd": 16740
        },
        "description": "Add-on BI and analytics module providing warehouse performance visibility beyond the standard operational dashboard included in WMS-CORE. Delivers 50+ pre-built KPIs covering receiving productivity, putaway accuracy, pick rates, order cycle time, dock-to-stock time, and inventory accuracy. Includes a labour management engine that compares actual task times against engineered labour standards to identify productivity gaps and drive performance-based incentive pay. Slotting optimisation engine analyses pick frequency and product velocity to recommend bin relocations that reduce travel distance. Includes a drag-and-drop report builder for custom reports and scheduled PDF/email exports.",
        "features": [
          "50+ pre-built warehouse KPIs",
          "Labor management & engineered standards",
          "Slotting optimisation engine",
          "Drag-and-drop report builder",
          "Scheduled email / PDF exports"
        ],
        "tags": ["wms_analytics"]
      },
      {
        "moduleCode": "WMS-3PL",
        "moduleName": "3PL Billing & Client Portal",
        "included": False,
        "pricing": {
          "monthly": 5600,
          "annual": 60500,
          "monthly_usd": 1400,
          "annual_usd": 15120
        },
        "description": "Add-on module specifically designed for third-party logistics (3PL) providers who manage inventory on behalf of multiple client companies. Adds a multi-client billing engine on top of WMS-CORE that captures all billable events — pallet storage, case handling, pick fees, value-added services — and applies client-specific rate cards. Generates invoices automatically at configurable billing cycles. Includes a self-service web portal where each 3PL client can log in to view their own real-time inventory, order status, and billing statements. Supports EDI 940/945.",
        "features": [
          "Per-client rate cards (storage, handling, value-added)",
          "Automated invoice generation",
          "Client web portal with real-time inventory view",
          "EDI 940/945 support"
        ],
        "tags": ["wms_3pl"]
      }
    ],
    "integrations": {
      "erpConnectors": ["SAP S/4HANA", "Oracle ERP Cloud", "Microsoft Dynamics 365", "NetSuite"],
      "tmsConnectors": ["Nexus TMS", "MercuryGate", "Oracle TMS"],
      "marketplaces": ["Amazon Seller Central", "Shopify", "WooCommerce"],
      "protocols": ["REST API", "SOAP", "EDI (AS2, SFTP)", "Webhooks"]
    },
    "sla": {
      "uptime": "99.9%",
      "supportHours": "24/7",
      "responseTimeCritical": "1 hour",
      "responseTimeStandard": "8 hours"
    },
    "compliance": ["SOC 2 Type II", "ISO 27001", "GDPR", "CCPA"],
    "createdAt": {"$date": "2024-01-15T08:00:00Z"},
    "updatedAt": {"$date": "2025-05-01T12:00:00Z"},
    "active": True,
    "tags": [
      "3PL", "3pl", "automation", "barcode", "cloud-saas", "cycle-count",
      "ecommerce", "enterprise", "hybrid", "inventory", "manufacturing",
      "multi-site", "on-premise", "picking", "receiving", "retail",
      "rfid", "robotics", "shipping", "slotting", "warehouse", "wms", "yard-management"
    ]
  },
  {
    "id": "665a1f0000000000000002b2",
    "productCode": "NEXUS-TMS",
    "productName": "Nexus TMS — Transportation Management System",
    "category": "transportation_management",
    "vendor": "Nexus Supply Chain Solutions",
    "version": "5.1.0",
    "tier": "enterprise",
    "deploymentOptions": ["cloud_saas", "hybrid"],
    "targetSegment": ["shipper", "3PL", "retailer", "distributor"],
    "description": "Nexus TMS is an enterprise Transportation Management System that manages the movement of goods between facilities — from supplier to DC, DC to store, or DC to end customer. Choose this product when the client requirement mentions any of: freight planning, carrier selection, load optimisation, shipment booking, track and trace, freight audit, customs clearance, cross-border trade, or supply chain visibility across multiple legs and modes. Supports all freight modes: full truckload (FTL), less-than-truckload (LTL), parcel, ocean, and air. Base license includes 20 named users and a carrier rate engine pre-loaded with 500+ carrier tariffs. Cloud SaaS and hybrid deployment only.",
    "thumbnail": "https://placehold.co/400x240/185FA5/FFFFFF?text=Nexus+TMS",
    "pricing": {
      "model": "subscription_plus_modules",
      "currency": "MYR",
      "billingCycles": ["monthly", "annual"],
      "baseLicense": {
        "monthly": 28400,
        "annual": 304300,
        "annualDiscountPct": 11,
        "includedUsers": 20,
        "perAdditionalUser": 200,
        "monthly_usd": 7100,
        "annual_usd": 76080,
        "perAdditionalUser_usd": 48
      },
      "implementationFee": {
        "standard": 76000,
        "enterprise": 190000,
        "note": "Includes carrier onboarding, rate loading, and EDI configuration",
        "standard_usd": 19000,
        "enterprise_usd": 47500
      },
      "exchangeRateUsed": {
        "from": "USD",
        "to": "MYR",
        "rate": 4.0,
        "rateDate": "2026-05-25"
      }
    },
    "modules": [
      {
        "moduleCode": "TMS-CORE",
        "moduleName": "Core Planning & Execution",
        "included": True,
        "description": "The foundational module included with every Nexus TMS license. Provides the complete transportation planning and execution cycle: building loads from shipment orders, selecting the lowest-cost or fastest carrier using a pre-loaded rate engine covering 500+ carrier tariffs across FTL, LTL, parcel, ocean, and air modes. Handles tender, booking confirmation, and shipment tracking from pickup to delivery. Captures proof of delivery (POD) documents. Performs basic freight audit by matching carrier invoices against contracted rates and flagging discrepancies.",
        "features": [
          "Multi-modal load optimisation (FTL, LTL, parcel, ocean, air)",
          "Carrier rate engine with 500+ pre-loaded tariffs",
          "Real-time shipment visibility",
          "POD capture & document management",
          "Basic freight audit & GL coding"
        ],
        "tags": ["tms_core"]
      },
      {
        "moduleCode": "TMS-AI",
        "moduleName": "AI Carrier & Route Optimisation",
        "included": False,
        "pricing": {
          "monthly": 7800,
          "annual": 84250,
          "monthly_usd": 1950,
          "annual_usd": 21060
        },
        "description": "Add-on AI optimisation module that upgrades carrier selection from rules-based rate shopping to a machine-learning scoring engine. Scores every available carrier option in real time across three dimensions: landed cost, predicted transit time, and carrier reliability score. Provides predictive ETA for every in-transit shipment with delay probability alerts. Re-optimises routes dynamically when disruptions occur. Calculates CO₂ emissions per shipment for sustainability reporting.",
        "features": [
          "Predictive ETA & delay alerts",
          "Dynamic route re-optimisation",
          "Carrier scorecard & performance ranking",
          "CO₂ emissions estimation per shipment"
        ],
        "tags": ["tms_ai"]
      },
      {
        "moduleCode": "TMS-CONTROL",
        "moduleName": "Control Tower",
        "included": False,
        "pricing": {
          "monthly": 9000,
          "annual": 97200,
          "monthly_usd": 2250,
          "annual_usd": 24300
        },
        "description": "Add-on Control Tower module providing end-to-end supply chain visibility in a single screen, aggregating shipment status across all carriers, modes, and geographies. Configurable exception rules engine generates alerts when shipments deviate from plan. Includes a supplier and carrier collaboration portal. Tracks SLA adherence per lane, carrier, and business unit with escalation workflows.",
        "features": [
          "Unified shipment map (multi-carrier, multi-mode)",
          "Configurable exception rules engine",
          "Supplier & carrier collaboration portal",
          "SLA adherence tracking & escalation workflows"
        ],
        "tags": ["tms_control"]
      },
      {
        "moduleCode": "TMS-AUDIT",
        "moduleName": "Advanced Freight Audit & Pay",
        "included": False,
        "pricing": {
          "monthly": 5200,
          "annual": 56150,
          "monthly_usd": 1300,
          "annual_usd": 14040
        },
        "description": "Add-on freight audit and payment module that automates end-to-end invoice reconciliation. Uses AI to match carrier invoices line-by-line against contracted rates, identifying overcharges, duplicate invoices, and billing errors. Automatically files disputes and tracks resolution. Generates savings opportunity reports.",
        "features": [
          "AI-powered invoice discrepancy detection",
          "Automated dispute filing & resolution tracking",
          "Carrier payment portal",
          "Savings opportunity reporting"
        ],
        "tags": ["tms_audit"]
      },
      {
        "moduleCode": "TMS-INTL",
        "moduleName": "Global Trade & Customs",
        "included": False,
        "pricing": {
          "monthly": 6800,
          "annual": 73450,
          "monthly_usd": 1700,
          "annual_usd": 18360
        },
        "description": "Add-on global trade and customs module required for any client moving goods across international borders. Provides HTS/HS code classification assistance, screens all parties against OFAC denied-party lists, auto-generates customs documents, and calculates estimated import duties and taxes at time of booking.",
        "features": [
          "HTS / HS code classification assistant",
          "OFAC & denied-party screening",
          "Customs document generation (CI, PL, COO)",
          "Duty & tax estimation",
          "Broker connectivity (CHB integration)"
        ],
        "tags": ["tms_intl"]
      }
    ],
    "integrations": {
      "erpConnectors": ["SAP S/4HANA", "Oracle ERP Cloud", "Microsoft Dynamics 365", "NetSuite"],
      "wmsConnectors": ["Nexus WMS", "Manhattan WMS", "Blue Yonder WMS"],
      "carrierNetworks": ["FedEx", "UPS", "DHL", "XPO", "SAIA", "MoLo Solutions", "Flexport"],
      "protocols": ["REST API", "EDI (AS2, SFTP)", "Webhooks", "FTP"]
    },
    "sla": {
      "uptime": "99.9%",
      "supportHours": "24/7",
      "responseTimeCritical": "1 hour",
      "responseTimeStandard": "8 hours"
    },
    "compliance": ["SOC 2 Type II", "ISO 27001", "GDPR"],
    "createdAt": {"$date": "2024-03-01T08:00:00Z"},
    "updatedAt": {"$date": "2025-05-01T12:00:00Z"},
    "active": True,
    "tags": [
      "3PL", "air", "carrier", "cloud-saas", "control-tower", "customs",
      "distributor", "enterprise", "freight", "freight-audit", "ftl",
      "hybrid", "ltl", "multi-modal", "ocean", "parcel", "retailer",
      "routing", "shipper", "tms", "track-trace", "trade-compliance", "transportation"
    ]
  },
  {
    "id": "665a1f0000000000000003c3",
    "productCode": "NEXUS-OMS",
    "productName": "Nexus OMS — Order Management System",
    "category": "order_management",
    "vendor": "Nexus Supply Chain Solutions",
    "version": "4.0.1",
    "tier": "professional",
    "deploymentOptions": ["cloud_saas"],
    "targetSegment": ["retail", "ecommerce", "dtc_brand", "omnichannel"],
    "description": "Nexus OMS is a professional-tier Order Management System built for omnichannel retailers, e-commerce brands, and direct-to-consumer (DTC) businesses that sell through multiple channels and fulfil from multiple nodes. Choose this product when the client requirement mentions any of: order routing, available-to-promise (ATP), omnichannel fulfilment, ship-from-store, BOPIS, endless aisle, returns management, delivery promise, or unified inventory visibility across stores and DCs. Available as cloud SaaS only. PCI DSS Level 1 certified.",
    "thumbnail": "https://placehold.co/400x240/533AB7/FFFFFF?text=Nexus+OMS",
    "pricing": {
      "model": "subscription_plus_modules",
      "currency": "MYR",
      "billingCycles": ["monthly", "annual"],
      "baseLicense": {
        "monthly": 19600,
        "annual": 211700,
        "annualDiscountPct": 10,
        "includedUsers": 15,
        "perAdditionalUser": 150,
        "monthly_usd": 4900,
        "annual_usd": 52920,
        "perAdditionalUser_usd": 40
      },
      "implementationFee": {
        "standard": 50000,
        "enterprise": 140000,
        "note": "Includes channel mapping, routing rule setup, and go-live support",
        "standard_usd": 12500,
        "enterprise_usd": 35000
      },
      "exchangeRateUsed": {
        "from": "USD",
        "to": "MYR",
        "rate": 4.0,
        "rateDate": "2026-05-25"
      }
    },
    "modules": [
      {
        "moduleCode": "OMS-CORE",
        "moduleName": "Core Order Orchestration",
        "included": True,
        "description": "The foundational module included with every Nexus OMS license. Captures orders from all sales channels — website, mobile app, physical store POS, marketplace, and EDI trading partners — into a single unified order repository. Validates each order before routing it to the optimal fulfilment node based on configurable business rules. Provides real-time available-to-promise (ATP) so the storefront always shows accurate stock availability. Includes a customer-facing order status portal and a returns/exchange workflow.",
        "features": [
          "Multi-channel order ingestion (web, store, marketplace, EDI)",
          "Configurable order routing rules engine",
          "Real-time available-to-promise (ATP)",
          "Order splitting & consolidation",
          "Customer order status portal",
          "Returns & exchange management"
        ],
        "tags": ["oms_core"]
      },
      {
        "moduleCode": "OMS-INVENTORY",
        "moduleName": "Distributed Inventory Management",
        "included": False,
        "pricing": {
          "monthly": 4800,
          "annual": 51850,
          "monthly_usd": 1200,
          "annual_usd": 12960
        },
        "description": "Add-on distributed inventory module that extends OMS-CORE with network-wide inventory visibility and control across every fulfilment node simultaneously — distribution centres, physical stores, 3PL partners, and supplier drop-ship locations. Creates a single pooled inventory position, enables ship-from-store and BOPIS, and manages inventory reservations.",
        "features": [
          "Single inventory pool across DCs, stores, 3PLs",
          "Safety stock & min/max replenishment",
          "Ship-from-store & pick-up-in-store (BOPIS)",
          "Inventory reservation & hold management",
          "Shrinkage & adjustment workflows"
        ],
        "tags": ["oms_inventory"]
      },
      {
        "moduleCode": "OMS-PROMISE",
        "moduleName": "AI Promising & Demand Sensing",
        "included": False,
        "pricing": {
          "monthly": 6400,
          "annual": 69100,
          "monthly_usd": 1600,
          "annual_usd": 17280
        },
        "description": "Add-on AI delivery promising module that shows customers an accurate, personalised delivery date at the product detail page and checkout. Uses a machine-learning model trained on historical order, fulfilment, and carrier performance data. Supports A/B testing of different promise strategies to measure conversion impact.",
        "features": [
          "Contextual delivery date promise at PDP / checkout",
          "Cost-to-serve aware routing",
          "Demand signal ingestion (search, cart, historical)",
          "A/B testing for promise strategies"
        ],
        "tags": ["oms_promise"]
      },
      {
        "moduleCode": "OMS-POS",
        "moduleName": "Store Operations & POS Integration",
        "included": False,
        "pricing": {
          "monthly": 3800,
          "annual": 41050,
          "monthly_usd": 950,
          "annual_usd": 10260
        },
        "description": "Add-on store operations and POS integration module for clients who operate physical retail stores alongside their e-commerce channel. Enables endless aisle selling, provides an associate clienteling dashboard, enables in-store returns of online purchases, and is pre-integrated with NCR Counterpoint, Lightspeed, and Shopify POS.",
        "features": [
          "Endless aisle ordering from store",
          "Real-time store inventory lookup",
          "Associate dashboard (clienteling)",
          "In-store return to any channel"
        ],
        "tags": ["oms_pos"]
      },
      {
        "moduleCode": "OMS-FRAUD",
        "moduleName": "Fraud & Risk Management",
        "included": False,
        "pricing": {
          "monthly": 3600,
          "annual": 38900,
          "monthly_usd": 900,
          "annual_usd": 9720
        },
        "description": "Add-on fraud and risk management module that intercepts high-risk orders before they enter the fulfilment pipeline. Scores every order in real time using a machine-learning model evaluating device fingerprint, behavioural signals, order velocity, and shipping address anomalies. Manages the chargeback workflow when disputes are filed.",
        "features": [
          "ML fraud scoring (device, behaviour, velocity)",
          "Address & identity verification",
          "Configurable risk rules & auto-hold",
          "Chargeback workflow & dispute management"
        ],
        "tags": ["oms_fraud"]
      }
    ],
    "integrations": {
      "erpConnectors": ["SAP S/4HANA", "Oracle ERP Cloud", "NetSuite", "Microsoft Dynamics 365"],
      "wmsConnectors": ["Nexus WMS", "Manhattan WMS", "Deposco"],
      "ecomPlatforms": ["Shopify Plus", "Salesforce Commerce Cloud", "Magento / Adobe Commerce", "BigCommerce"],
      "marketplaces": ["Amazon", "eBay", "Walmart Marketplace", "TikTok Shop"],
      "posConnectors": ["NCR Counterpoint", "Lightspeed", "Shopify POS"],
      "protocols": ["REST API", "GraphQL", "Webhooks", "EDI (AS2)"]
    },
    "sla": {
      "uptime": "99.95%",
      "supportHours": "24/7",
      "responseTimeCritical": "30 minutes",
      "responseTimeStandard": "4 hours"
    },
    "compliance": ["SOC 2 Type II", "PCI DSS Level 1", "GDPR", "CCPA"],
    "createdAt": {"$date": "2024-06-10T08:00:00Z"},
    "updatedAt": {"$date": "2025-05-01T12:00:00Z"},
    "active": True,
    "tags": [
      "atp", "bopis", "cloud-saas", "demand-sensing", "dtc", "dtc_brand",
      "ecommerce", "fraud-detection", "fulfilment", "inventory-network",
      "omnichannel", "oms", "order-management", "professional", "retail",
      "returns", "ship-from-store"
    ]
  }
]
