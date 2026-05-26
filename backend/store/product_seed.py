from sqlalchemy import false, true


PRODUCT_SEED = [
  {
    "id": "665a1f0000000000000001a1",
    "productCode": "NEXUS-WMS",
    "productName": "Nexus WMS \u2014 Warehouse Management System",
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
    "description": "Nexus WMS is an enterprise-grade Warehouse Management System designed for high-throughput, multi-site distribution operations. It is the correct choice when a client needs to manage physical inventory movement inside one or more warehouse or distribution centre (DC) facilities. Choose this product when the client requirement mentions any of: inbound receiving, putaway, pick-pack-ship, cycle counting, slotting optimisation, labour productivity, yard management, or warehouse robotics. It supports 3PL operators who manage inventory on behalf of multiple clients, as well as retailers, manufacturers, and e-commerce brands running their own DCs. Not suitable as a standalone solution for transportation planning, order orchestration, or demand forecasting \u2014 pair with Nexus TMS for carrier management and Nexus OMS for order routing. Minimum viable deployment requires the WMS-CORE module. Additional modules unlock yard control, robotics orchestration, BI analytics, and 3PL billing. Supports cloud SaaS, on-premise, and hybrid deployment. Certified for SOC 2 Type II and ISO 27001. Base license includes 25 named users.",
    "thumbnail": "https://placehold.co/400x240/0F6E56/FFFFFF?text=Nexus+WMS",
    "pricing": {
      "model": "subscription_plus_modules",
      "currency": "MYR",
      "billingCycles": [
        "monthly",
        "annual"
      ],
      "baseLicense": {
        "monthly": 74000,
        "annual": 792000,
        "annualDiscountPct": 11,
        "includedUsers": 25,
        "perAdditionalUser": 500,
        "monthly_usd": 18500,
        "annual_usd": 198000,
        "perAdditionalUser_usd": 120
      },
      "implementationFee": {
        "standard": 180000,
        "enterprise": 480000,
        "note": "Includes 8-week guided deployment, data migration, and 3 training sessions",
        "standard_usd": 45000,
        "enterprise_usd": 120000
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
        "included": true,
        "description": "The foundational module included with every Nexus WMS license. Covers the complete inbound-to-outbound warehouse execution cycle: receiving purchase orders and ASNs, directed putaway to bin locations, wave and batch pick planning, pack verification, shipment manifesting, and carrier label generation. Manages inventory at the licence plate number (LPN) level for full unit-level traceability. Supports barcode scanning (1D/2D) and RFID readers. Includes a real-time inventory dashboard showing stock by location, zone, and status. Select this module for any client that needs to physically manage inventory inside a warehouse or DC. This module alone is sufficient for a single-site, single-client warehouse with no yard, robotics, or 3PL billing requirements.",
        "features": [
          "Barcode & RFID scanning",
          "Multi-location slotting",
          "Wave & batch picking",
          "LPN (license plate number) tracking",
          "Standard carrier label printing",
          "Real-time inventory dashboard"
        ],
        "tags": [
          "wms_core"
        ]
      },
      {
        "moduleCode": "WMS-YARD",
        "moduleName": "Yard Management",
        "included": false,
        "pricing": {
          "monthly": 8800,
          "annual": 95000,
          "monthly_usd": 2200,
          "annual_usd": 23760
        },
        "description": "Add-on module required when the client needs to manage the area outside the warehouse building: the yard, gates, and truck doors. Digitises the full gate-in to gate-out trailer lifecycle. Provides dock appointment scheduling so inbound carriers book time slots in advance, reducing wait times and detention charges. Tracks trailers and containers by location within the yard. Integrates driver ETA feeds so dock staff can proactively stage doors. Recommend this module when the client has: a large yard with 10+ dock doors, high trailer dwell-time issues, multiple inbound carriers arriving daily, or cross-docking operations where trailer sequencing is critical. Not required for small single-dock facilities.",
        "features": [
          "Digital gate kiosk",
          "Dock appointment scheduling",
          "Trailer & container tracking",
          "Driver ETA integration"
        ],
        "tags": [
          "wms_yard"
        ]
      },
      {
        "moduleCode": "WMS-ROBOT",
        "moduleName": "Robotics & Automation Interface",
        "included": false,
        "pricing": {
          "monthly": 19200,
          "annual": 207400,
          "monthly_usd": 4800,
          "annual_usd": 51840
        },
        "description": "Add-on integration layer that connects Nexus WMS to autonomous mobile robots (AMRs), automated storage and retrieval systems (AS/RS), sorters, and conveyors. Acts as the middleware orchestration engine \u2014 WMS sends work orders, the robot layer executes them, and results are confirmed back to WMS in real time. Pre-certified integrations with Locus Robotics, Geek+, AutoStore, SSI Schaefer, and Dematic. Includes a robot fleet dashboard showing unit utilisation, task queues, and exception alerts. Select this module when the client already operates or plans to deploy warehouse automation hardware. Without this module, WMS can only direct human pickers. Requires the client to have a compatible automation vendor \u2014 validate against the compatibleSystems list.",
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
          "throughput analytics"
        ],
        "tags": [
          "wms_robot"
        ]
      },
      {
        "moduleCode": "WMS-ANALYTICS",
        "moduleName": "Advanced Analytics & BI",
        "included": false,
        "pricing": {
          "monthly": 12400,
          "annual": 133900,
          "monthly_usd": 3100,
          "annual_usd": 33480
        },
        "description": "Add-on BI and analytics module providing warehouse performance visibility beyond the standard operational dashboard included in WMS-CORE. Delivers 50+ pre-built KPIs covering receiving productivity, putaway accuracy, pick rates, order cycle time, dock-to-stock time, and inventory accuracy. Includes a labour management engine that compares actual task times against engineered labour standards to identify productivity gaps and drive performance-based incentive pay. Slotting optimisation engine analyses pick frequency and product velocity to recommend bin relocations that reduce travel distance. Includes a drag-and-drop report builder for custom reports and scheduled PDF/email exports. Recommend for any client with a warehouse manager or operations director who needs to report warehouse KPIs to leadership, or a 3PL client who needs to provide SLA performance reports to their customers.",
        "features": [
          "50+ pre-built warehouse KPIs",
          "Labor management & engineered standards",
          "Slotting optimisation engine",
          "Drag-and-drop report builder",
          "Scheduled email / PDF exports"
        ],
        "tags": [
          "wms_analytics"
        ]
      },
      {
        "moduleCode": "WMS-3PL",
        "moduleName": "3PL Billing & Client Portal",
        "included": false,
        "pricing": {
          "monthly": 11200,
          "annual": 121000,
          "monthly_usd": 2800,
          "annual_usd": 30240
        },
        "description": "Add-on module specifically designed for third-party logistics (3PL) providers who manage inventory on behalf of multiple client companies (called 'clients' or 'shippers'). Adds a multi-client billing engine on top of WMS-CORE that captures all billable events \u2014 pallet storage, case handling, pick fees, value-added services \u2014 and applies client-specific rate cards. Generates invoices automatically at configurable billing cycles. Includes a self-service web portal where each 3PL client can log in to view their own real-time inventory, order status, and billing statements without accessing the main WMS. Supports EDI 940 (warehouse shipping orders) and 945 (warehouse shipping advice) for clients that send orders via EDI. Select this module only when the operator is a 3PL \u2014 not needed for retailers or brands running their own DC.",
        "features": [
          "Per-client rate cards (storage, handling, value-added)",
          "Automated invoice generation",
          "Client web portal with real-time inventory view",
          "EDI 940/945 support"
        ],
        "tags": [
          "wms_3pl"
        ]
      }
    ],
    "integrations": {
      "erpConnectors": [
        "SAP S/4HANA",
        "Oracle ERP Cloud",
        "Microsoft Dynamics 365",
        "NetSuite"
      ],
      "tmsConnectors": [
        "Nexus TMS",
        "MercuryGate",
        "Oracle TMS"
      ],
      "marketplaces": [
        "Amazon Seller Central",
        "Shopify",
        "WooCommerce"
      ],
      "protocols": [
        "REST API",
        "SOAP",
        "EDI (AS2, SFTP)",
        "Webhooks"
      ]
    },
    "sla": {
      "uptime": "99.9%",
      "supportHours": "24/7",
      "responseTimeCritical": "1 hour",
      "responseTimeStandard": "8 hours"
    },
    "compliance": [
      "SOC 2 Type II",
      "ISO 27001",
      "GDPR",
      "CCPA"
    ],
    "createdAt": {
      "$date": "2024-01-15T08:00:00Z"
    },
    "updatedAt": {
      "$date": "2025-05-01T12:00:00Z"
    },
    "active": true,
    "tags": [
      "3PL",
      "3pl",
      "automation",
      "barcode",
      "cloud-saas",
      "cycle-count",
      "ecommerce",
      "enterprise",
      "hybrid",
      "inventory",
      "manufacturing",
      "multi-site",
      "on-premise",
      "picking",
      "receiving",
      "retail",
      "rfid",
      "robotics",
      "shipping",
      "slotting",
      "warehouse",
      "wms",
      "yard-management"
    ]
  },
  {
    "id":  "665a1f0000000000000002b2",
    "productCode": "NEXUS-TMS",
    "productName": "Nexus TMS \u2014 Transportation Management System",
    "category": "transportation_management",
    "vendor": "Nexus Supply Chain Solutions",
    "version": "5.1.0",
    "tier": "enterprise",
    "deploymentOptions": [
      "cloud_saas",
      "hybrid"
    ],
    "targetSegment": [
      "shipper",
      "3PL",
      "retailer",
      "distributor"
    ],
    "description": "Nexus TMS is an enterprise Transportation Management System that manages the movement of goods between facilities \u2014 from supplier to DC, DC to store, or DC to end customer. Choose this product when the client requirement mentions any of: freight planning, carrier selection, load optimisation, shipment booking, track and trace, freight audit, customs clearance, cross-border trade, or supply chain visibility across multiple legs and modes. Supports all freight modes: full truckload (FTL), less-than-truckload (LTL), parcel, ocean, and air. Ideal for shippers, 3PLs, retailers, and distributors who move significant freight volumes and need to control cost-per-shipment. Not a warehouse execution tool \u2014 does not manage inventory within a facility. Pair with Nexus WMS for inbound/outbound warehouse execution. The AI Carrier Optimisation module is recommended for clients with 500+ shipments per month who want automated cost and SLA trade-off decisions. The Control Tower module is required if the client wants a single visibility screen across all shipments and suppliers. The Global Trade module is mandatory for any client moving goods across international borders. Base license includes 20 named users and a carrier rate engine pre-loaded with 500+ carrier tariffs. Cloud SaaS and hybrid deployment only.",
    "thumbnail": "https://placehold.co/400x240/185FA5/FFFFFF?text=Nexus+TMS",
    "pricing": {
      "model": "subscription_plus_modules",
      "currency": "MYR",
      "billingCycles": [
        "monthly",
        "annual"
      ],
      "baseLicense": {
        "monthly": 56800,
        "annual": 608600,
        "annualDiscountPct": 11,
        "includedUsers": 20,
        "perAdditionalUser": 400,
        "monthly_usd": 14200,
        "annual_usd": 152160,
        "perAdditionalUser_usd": 95
      },
      "implementationFee": {
        "standard": 152000,
        "enterprise": 380000,
        "note": "Includes carrier onboarding, rate loading, and EDI configuration",
        "standard_usd": 38000,
        "enterprise_usd": 95000
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
        "included": true,
        "description": "The foundational module included with every Nexus TMS license. Provides the complete transportation planning and execution cycle: building loads from shipment orders, selecting the lowest-cost or fastest carrier using a pre-loaded rate engine covering 500+ carrier tariffs across FTL, LTL, parcel, ocean, and air modes. Handles tender, booking confirmation, and shipment tracking from pickup to delivery. Captures proof of delivery (POD) documents. Performs basic freight audit by matching carrier invoices against contracted rates and flagging discrepancies. Applies GL cost centre coding for finance. This module alone is sufficient for a client with moderate freight volume who uses domestic carriers and needs basic visibility and cost control. Clients with 500+ shipments per month, international freight, or complex carrier SLA requirements should add specialised modules.",
        "features": [
          "Multi-modal load optimisation (FTL, LTL, parcel, ocean, air)",
          "Carrier rate engine with 500+ pre-loaded tariffs",
          "Real-time shipment visibility",
          "POD capture & document management",
          "Basic freight audit & GL coding"
        ],
        "tags": [
          "tms_core"
        ]
      },
      {
        "moduleCode": "TMS-AI",
        "moduleName": "AI Carrier & Route Optimisation",
        "included": false,
        "pricing": {
          "monthly": 15600,
          "annual": 168500,
          "monthly_usd": 3900,
          "annual_usd": 42120
        },
        "description": "Add-on AI optimisation module that upgrades carrier selection from rules-based rate shopping to a machine-learning scoring engine. Scores every available carrier option in real time across three dimensions: landed cost (rate + accessorials + expected exceptions), predicted transit time using historical performance data, and carrier reliability score based on on-time delivery, damage claims, and invoice accuracy. Provides predictive ETA for every in-transit shipment with delay probability alerts so operations teams can proactively notify customers or re-route. Re-optimises routes dynamically when disruptions occur (weather, port closures, carrier capacity). Calculates CO\u2082 emissions per shipment for sustainability reporting. Recommend when the client moves 500+ shipments per month and manual carrier selection is creating cost leakage or service failures. Not required for simple point-to-point domestic operations.",
        "features": [
          "Predictive ETA & delay alerts",
          "Dynamic route re-optimisation",
          "Carrier scorecard & performance ranking",
          "CO\u2082 emissions estimation per shipment"
        ],
        "tags": [
          "tms_ai"
        ]
      },
      {
        "moduleCode": "TMS-CONTROL",
        "moduleName": "Control Tower",
        "included": false,
        "pricing": {
          "monthly": 18000,
          "annual": 194400,
          "monthly_usd": 4500,
          "annual_usd": 48600
        },
        "description": "Add-on Control Tower module providing end-to-end supply chain visibility in a single screen, aggregating shipment status across all carriers, modes, and geographies. Replaces the need to log into multiple carrier portals. Configurable exception rules engine generates alerts when shipments deviate from plan \u2014 late pickup, customs hold, missed milestone, delivery failure. Includes a supplier and carrier collaboration portal where external parties can update shipment status, upload documents, and respond to exception alerts without needing a full TMS login. Tracks SLA adherence per lane, carrier, and business unit with escalation workflows that automatically notify the right person when a shipment is at risk. Select this module when the client has: supply chains spanning multiple countries or carriers, a dedicated logistics control team, or a need to share visibility with suppliers and customers. Often purchased together with TMS-AI.",
        "features": [
          "Unified shipment map (multi-carrier, multi-mode)",
          "Configurable exception rules engine",
          "Supplier & carrier collaboration portal",
          "SLA adherence tracking & escalation workflows"
        ],
        "tags": [
          "tms_control"
        ]
      },
      {
        "moduleCode": "TMS-AUDIT",
        "moduleName": "Advanced Freight Audit & Pay",
        "included": false,
        "pricing": {
          "monthly": 10400,
          "annual": 112300,
          "monthly_usd": 2600,
          "annual_usd": 28080
        },
        "description": "Add-on freight audit and payment module that automates the end-to-end invoice reconciliation process. Uses AI to match carrier invoices line-by-line against contracted rates, load records, and accessorial agreements \u2014 identifying overcharges, duplicate invoices, and billing errors without manual review. Automatically files disputes with carriers for identified discrepancies and tracks dispute status to resolution. Provides a carrier payment portal so approved invoices are paid on schedule without requiring AP team involvement. Generates savings opportunity reports showing audit recovery rates by carrier and lane. Recommend when the client pays freight invoices manually today, has a large carrier base (10+ carriers), or has experienced significant freight overbilling. Pairs well with TMS-CORE for clients who want a complete plan-execute-pay cycle.",
        "features": [
          "AI-powered invoice discrepancy detection",
          "Automated dispute filing & resolution tracking",
          "Carrier payment portal",
          "Savings opportunity reporting"
        ],
        "tags": [
          "tms_audit"
        ]
      },
      {
        "moduleCode": "TMS-INTL",
        "moduleName": "Global Trade & Customs",
        "included": false,
        "pricing": {
          "monthly": 13600,
          "annual": 146900,
          "monthly_usd": 3400,
          "annual_usd": 36720
        },
        "description": "Add-on global trade and customs module required for any client moving goods across international borders. Provides HTS/HS code classification assistance to correctly classify goods for customs. Screens all parties (suppliers, consignees, forwarders) against OFAC and international denied-party lists before shipment booking to ensure trade compliance. Auto-generates required customs documents: commercial invoice, packing list, certificate of origin, and shipper's export declaration. Calculates estimated import duties and taxes at time of booking to support landed cost decisions. Connects to licensed customs house brokers (CHBs) for electronic filing. This module is mandatory \u2014 not optional \u2014 for any client with cross-border shipments. Without it, Nexus TMS handles domestic moves only. Also required for clients in Malaysia importing from China, shipping to the US, or managing bonded warehouse operations.",
        "features": [
          "HTS / HS code classification assistant",
          "OFAC & denied-party screening",
          "Customs document generation (CI, PL, COO)",
          "Duty & tax estimation",
          "Broker connectivity (CHB integration)"
        ],
        "tags": [
          "tms_intl"
        ]
      }
    ],
    "integrations": {
      "erpConnectors": [
        "SAP S/4HANA",
        "Oracle ERP Cloud",
        "Microsoft Dynamics 365",
        "NetSuite"
      ],
      "wmsConnectors": [
        "Nexus WMS",
        "Manhattan WMS",
        "Blue Yonder WMS"
      ],
      "carrierNetworks": [
        "FedEx",
        "UPS",
        "DHL",
        "XPO",
        "SAIA",
        "MoLo Solutions",
        "Flexport"
      ],
      "protocols": [
        "REST API",
        "EDI (AS2, SFTP)",
        "Webhooks",
        "FTP"
      ]
    },
    "sla": {
      "uptime": "99.9%",
      "supportHours": "24/7",
      "responseTimeCritical": "1 hour",
      "responseTimeStandard": "8 hours"
    },
    "compliance": [
      "SOC 2 Type II",
      "ISO 27001",
      "GDPR"
    ],
    "createdAt": {
      "$date": "2024-03-01T08:00:00Z"
    },
    "updatedAt": {
      "$date": "2025-05-01T12:00:00Z"
    },
    "active": true,
    "tags": [
      "3PL",
      "air",
      "carrier",
      "cloud-saas",
      "control-tower",
      "customs",
      "distributor",
      "enterprise",
      "freight",
      "freight-audit",
      "ftl",
      "hybrid",
      "ltl",
      "multi-modal",
      "ocean",
      "parcel",
      "retailer",
      "routing",
      "shipper",
      "tms",
      "track-trace",
      "trade-compliance",
      "transportation"
    ]
  },
  {
    "id": "665a1f0000000000000003c3",
    "productCode": "NEXUS-OMS",
    "productName": "Nexus OMS \u2014 Order Management System",
    "category": "order_management",
    "vendor": "Nexus Supply Chain Solutions",
    "version": "4.0.1",
    "tier": "professional",
    "deploymentOptions": [
      "cloud_saas"
    ],
    "targetSegment": [
      "retail",
      "ecommerce",
      "dtc_brand",
      "omnichannel"
    ],
    "description": "Nexus OMS is a professional-tier Order Management System built for omnichannel retailers, e-commerce brands, and direct-to-consumer (DTC) businesses that sell through multiple channels and fulfil from multiple nodes. Choose this product when the client requirement mentions any of: order routing, available-to-promise (ATP), omnichannel fulfilment, ship-from-store, buy-online pick-up-in-store (BOPIS), endless aisle, returns management, delivery promise, or unified inventory visibility across stores and DCs. This is not a warehouse execution system \u2014 it decides WHERE and HOW to fulfil an order, but the physical execution inside a DC requires Nexus WMS. It is also not a transportation system \u2014 pair with Nexus TMS for carrier selection and freight management. The Distributed Inventory module is strongly recommended for any client with inventory spread across 3+ fulfilment nodes. The AI Promising module is required if the client wants to show dynamic delivery dates at checkout. The Fraud module is essential for high-volume e-commerce clients processing consumer payments. Available as cloud SaaS only. PCI DSS Level 1 certified, making it suitable for clients who process card payments directly through the OMS.",
    "thumbnail": "https://placehold.co/400x240/533AB7/FFFFFF?text=Nexus+OMS",
    "pricing": {
      "model": "subscription_plus_modules",
      "currency": "MYR",
      "billingCycles": [
        "monthly",
        "annual"
      ],
      "baseLicense": {
        "monthly": 39200,
        "annual": 423400,
        "annualDiscountPct": 10,
        "includedUsers": 15,
        "perAdditionalUser": 300,
        "monthly_usd": 9800,
        "annual_usd": 105840,
        "perAdditionalUser_usd": 80
      },
      "implementationFee": {
        "standard": 100000,
        "enterprise": 280000,
        "note": "Includes channel mapping, routing rule setup, and go-live support",
        "standard_usd": 25000,
        "enterprise_usd": 70000
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
        "included": true,
        "description": "The foundational module included with every Nexus OMS license. Captures orders from all sales channels \u2014 website, mobile app, physical store POS, marketplace (Amazon, Shopify, etc.), and EDI trading partners \u2014 into a single unified order repository. Validates each order (payment authorisation, address verification, inventory check) before routing it to the optimal fulfilment node based on configurable business rules: proximity to customer, available inventory, fulfilment cost, and carrier cut-off times. Supports order splitting across multiple nodes and order consolidation for efficiency. Provides real-time available-to-promise (ATP) so the storefront always shows accurate stock availability. Includes a customer-facing order status portal and a returns/exchange workflow. This module alone covers a client who sells online and fulfils from a single DC. Clients with physical stores, multiple DCs, or advanced promise requirements should add specialist modules.",
        "features": [
          "Multi-channel order ingestion (web, store, marketplace, EDI)",
          "Configurable order routing rules engine",
          "Real-time available-to-promise (ATP)",
          "Order splitting & consolidation",
          "Customer order status portal",
          "Returns & exchange management"
        ],
        "tags": [
          "oms_core"
        ]
      },
      {
        "moduleCode": "OMS-INVENTORY",
        "moduleName": "Distributed Inventory Management",
        "included": false,
        "pricing": {
          "monthly": 9600,
          "annual": 103700,
          "monthly_usd": 2400,
          "annual_usd": 25920
        },
        "description": "Add-on distributed inventory module that extends OMS-CORE with network-wide inventory visibility and control across every fulfilment node simultaneously \u2014 distribution centres, physical stores, 3PL partners, and supplier drop-ship locations. Creates a single pooled inventory position that the routing engine draws from, eliminating the siloed stock views that cause overselling or missed fulfilment opportunities. Automates safety stock calculation per node based on demand variability and replenishment lead time, and triggers replenishment when stock falls below threshold. Enables ship-from-store and BOPIS by making store inventory available to the online channel in real time. Manages inventory reservations and holds to prevent double-allocation. Select this module when the client has 3 or more fulfilment nodes, operates physical retail stores alongside e-commerce, or has experienced overselling due to fragmented inventory views.",
        "features": [
          "Single inventory pool across DCs, stores, 3PLs",
          "Safety stock & min/max replenishment",
          "Ship-from-store & pick-up-in-store (BOPIS)",
          "Inventory reservation & hold management",
          "Shrinkage & adjustment workflows"
        ],
        "tags": [
          "oms_inventory"
        ]
      },
      {
        "moduleCode": "OMS-PROMISE",
        "moduleName": "AI Promising & Demand Sensing",
        "included": false,
        "pricing": {
          "monthly": 12800,
          "annual": 138200,
          "monthly_usd": 3200,
          "annual_usd": 34560
        },
        "description": "Add-on AI delivery promising module that shows customers an accurate, personalised delivery date at the product detail page (PDP) and checkout \u2014 before the order is placed. Uses a machine-learning model trained on historical order, fulfilment, and carrier performance data to calculate realistic delivery windows per SKU, per destination, in real time. Balances customer experience (fastest promise) against fulfilment cost (cheapest node and carrier) using configurable business rules. Ingests demand signals \u2014 search trends, cart additions, promotional calendars \u2014 to sense future demand spikes and adjust promise thresholds proactively. Supports A/B testing of different promise strategies to measure conversion impact. Recommend for any client where delivery date visibility at checkout is a conversion driver \u2014 particularly e-commerce and DTC brands competing with Amazon-speed expectations. Requires OMS-CORE and OMS-INVENTORY to function correctly.",
        "features": [
          "Contextual delivery date promise at PDP / checkout",
          "Cost-to-serve aware routing",
          "Demand signal ingestion (search, cart, historical)",
          "A/B testing for promise strategies"
        ],
        "tags": [
          "oms_promise"
        ]
      },
      {
        "moduleCode": "OMS-POS",
        "moduleName": "Store Operations & POS Integration",
        "included": false,
        "pricing": {
          "monthly": 7600,
          "annual": 82100,
          "monthly_usd": 1900,
          "annual_usd": 20520
        },
        "description": "Add-on store operations and POS integration module for clients who operate physical retail stores alongside their e-commerce channel. Connects the OMS to in-store POS systems so store associates have real-time visibility of network-wide inventory \u2014 enabling endless aisle selling where a customer can order an out-of-stock item in-store for home delivery or pickup at another location. Provides an associate clienteling dashboard showing customer purchase history, preferences, and open orders across all channels. Enables in-store returns of online purchases and vice versa. Pre-integrated with NCR Counterpoint, Lightspeed, and Shopify POS. Select this module when the client has physical retail stores that need to participate in omnichannel fulfilment. Not required for pure-play e-commerce clients with no retail stores.",
        "features": [
          "Endless aisle ordering from store",
          "Real-time store inventory lookup",
          "Associate dashboard (clienteling)",
          "In-store return to any channel"
        ],
        "tags": [
          "oms_pos"
        ]
      },
      {
        "moduleCode": "OMS-FRAUD",
        "moduleName": "Fraud & Risk Management",
        "included": false,
        "pricing": {
          "monthly": 7200,
          "annual": 77800,
          "monthly_usd": 1800,
          "annual_usd": 19440
        },
        "description": "Add-on fraud and risk management module that intercepts high-risk orders before they enter the fulfilment pipeline, preventing chargebacks and inventory loss from fraudulent purchases. Scores every order in real time using a machine-learning model that evaluates device fingerprint, behavioural signals (typing speed, navigation path), order velocity per account and card, and shipping address anomalies. Verifies billing address against card issuer records and validates identity signals. Applies configurable risk rules \u2014 auto-approve, auto-cancel, or hold-for-review \u2014 based on score thresholds. Manages the chargeback workflow when disputes are filed, including evidence packaging and submission deadlines. Strongly recommended for any e-commerce or DTC client processing high volumes of card-not-present transactions. Also required for clients selling high-value goods (electronics, luxury, jewellery) that are frequent targets for friendly fraud.",
        "features": [
          "ML fraud scoring (device, behaviour, velocity)",
          "Address & identity verification",
          "Configurable risk rules & auto-hold",
          "Chargeback workflow & dispute management"
        ],
        "tags": [
          "oms_fraud"
        ]
      }
    ],
    "integrations": {
      "erpConnectors": [
        "SAP S/4HANA",
        "Oracle ERP Cloud",
        "NetSuite",
        "Microsoft Dynamics 365"
      ],
      "wmsConnectors": [
        "Nexus WMS",
        "Manhattan WMS",
        "Deposco"
      ],
      "ecomPlatforms": [
        "Shopify Plus",
        "Salesforce Commerce Cloud",
        "Magento / Adobe Commerce",
        "BigCommerce"
      ],
      "marketplaces": [
        "Amazon",
        "eBay",
        "Walmart Marketplace",
        "TikTok Shop"
      ],
      "posConnectors": [
        "NCR Counterpoint",
        "Lightspeed",
        "Shopify POS"
      ],
      "protocols": [
        "REST API",
        "GraphQL",
        "Webhooks",
        "EDI (AS2)"
      ]
    },
    "sla": {
      "uptime": "99.95%",
      "supportHours": "24/7",
      "responseTimeCritical": "30 minutes",
      "responseTimeStandard": "4 hours"
    },
    "compliance": [
      "SOC 2 Type II",
      "PCI DSS Level 1",
      "GDPR",
      "CCPA"
    ],
    "createdAt": {
      "$date": "2024-06-10T08:00:00Z"
    },
    "updatedAt": {
      "$date": "2025-05-01T12:00:00Z"
    },
    "active": true,
    "tags": [
      "atp",
      "bopis",
      "cloud-saas",
      "demand-sensing",
      "dtc",
      "dtc_brand",
      "ecommerce",
      "fraud-detection",
      "fulfilment",
      "inventory-network",
      "omnichannel",
      "oms",
      "order-management",
      "professional",
      "retail",
      "returns",
      "ship-from-store"
    ]
  }
]