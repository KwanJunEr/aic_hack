"use client"

import { useState } from "react"
import {
  FileText,
  Download,
  Eye,
  Calendar,
  Building2,
  Banknote,
  Clock,
  Shield,
  CheckCircle,
  TrendingUp,
  AlertTriangle,
  Users,
  GitBranch,
  Layers,
  Package,
  DollarSign,
  Star,
  Zap,
  Lock,
  Server,
  Globe,
  BarChart3,
  Award,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// ── Pricing constants (aligned with Stage 2 HR cost = RM 10,000) ─────────
const BASE_LICENSE = 28_000
const INTEGRATION_COST = 8_000
const MAINTENANCE_COST = 4_000
const RESOURCE_COST = 10_000
const DISCOUNT = 2_500
const TOTAL = BASE_LICENSE + INTEGRATION_COST + MAINTENANCE_COST + RESOURCE_COST - DISCOUNT // 47,500

// ── Gantt tasks (8-week timeline) ─────────────────────────────────────────
const GANTT = [
  { name: "Requirements Finalization", start: 1, end: 1, phase: "build" as const },
  { name: "System Design", start: 2, end: 2, phase: "build" as const },
  { name: "Backend / API Development", start: 2, end: 4, phase: "build" as const },
  { name: "Core Integration Setup", start: 3, end: 4, phase: "build" as const },
  { name: "WMS ↔ SAP S/4HANA Integration", start: 5, end: 6, phase: "test" as const },
  { name: "QA + UAT Testing", start: 5, end: 7, phase: "test" as const },
  { name: "Optimization", start: 7, end: 7, phase: "test" as const },
  { name: "Deployment & Go-Live", start: 8, end: 8, phase: "test" as const },
]

// ── API endpoints (from Integration Flow step) ────────────────────────────
const API_ENDPOINTS = [
  { method: "GET", route: "/api/inventory/items" },
  { method: "GET", route: "/api/inventory/locations" },
  { method: "POST", route: "/api/orders/inbound" },
  { method: "POST", route: "/api/orders/outbound" },
  { method: "PUT", route: "/api/orders/{id}/status" },
  { method: "GET", route: "/api/warehouse/zones" },
  { method: "POST", route: "/api/sap/webhook/inventory-sync" },
  { method: "GET", route: "/api/barcode/scan/{barcode}" },
]

const METHOD_COLOR: Record<string, string> = {
  GET: "bg-emerald-100 text-emerald-700",
  POST: "bg-blue-100 text-blue-700",
  PUT: "bg-amber-100 text-amber-700",
  DELETE: "bg-red-100 text-red-700",
}

// ── Competitor data ───────────────────────────────────────────────────────
const COMPETITORS = [
  {
    name: "Nexus WMS",
    ours: true,
    sapIntegration: "Native",
    cloud: "SaaS",
    mobile: true,
    priceRange: "RM 28k–50k/yr",
    deployment: "2 Months",
    support: "24/7",
    score: 95,
  },
  {
    name: "SAP EWM",
    ours: false,
    sapIntegration: "Native",
    cloud: "Hybrid",
    mobile: true,
    priceRange: "RM 150k+/yr",
    deployment: "6–12 Months",
    support: "Business Hours",
    score: 72,
  },
  {
    name: "Oracle WMS",
    ours: false,
    sapIntegration: "API",
    cloud: "Cloud",
    mobile: true,
    priceRange: "RM 90k+/yr",
    deployment: "4–6 Months",
    support: "Standard",
    score: 68,
  },
  {
    name: "Manhattan WMS",
    ours: false,
    sapIntegration: "Middleware",
    cloud: "On-Prem",
    mobile: false,
    priceRange: "RM 200k+/yr",
    deployment: "9–12 Months",
    support: "Business Hours",
    score: 61,
  },
  {
    name: "Infor WMS",
    ours: false,
    sapIntegration: "API",
    cloud: "Hybrid",
    mobile: true,
    priceRange: "RM 70k+/yr",
    deployment: "4–8 Months",
    support: "Standard",
    score: 65,
  },
]

// ── PDF export — full document ─────────────────────────────────────────────
async function exportPdf() {
  const mod = await import("jspdf")
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const JsPDF = (mod as any).default ?? (mod as any).jsPDF
  const doc = new JsPDF({ orientation: "portrait", unit: "mm", format: "a4" })

  let y = 20
  const lm = 18
  const pw = 174
  const pageH = 275

  function newPage() { doc.addPage(); y = 20 }
  function checkY(n = 10) { if (y + n > pageH) newPage() }
  function gap(n = 4) { y += n }

  function h2(text: string) {
    checkY(12)
    doc.setFontSize(12); doc.setFont("helvetica", "bold"); doc.setTextColor(20, 20, 20)
    doc.text(text, lm, y); y += 8
  }
  function h3(text: string, indent = 0) {
    checkY(8)
    doc.setFontSize(10); doc.setFont("helvetica", "bold"); doc.setTextColor(50, 50, 50)
    doc.text(text, lm + indent, y); y += 5
  }
  function body(text: string, indent = 0) {
    doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(80, 80, 80)
    const lines = doc.splitTextToSize(text, pw - indent)
    checkY(lines.length * 4.5)
    doc.text(lines, lm + indent, y); y += lines.length * 4.5 + 1
  }
  function bullet(text: string, indent = 6) {
    doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(80, 80, 80)
    const lines = doc.splitTextToSize(`- ${text}`, pw - indent)
    checkY(lines.length * 4.5)
    doc.text(lines, lm + indent, y); y += lines.length * 4.5 + 1
  }
  function divider() {
    checkY(5); doc.setDrawColor(200, 200, 200); doc.line(lm, y, lm + pw, y); y += 4
  }

  // Cover
  doc.setFontSize(20); doc.setFont("helvetica", "bold"); doc.setTextColor(20, 20, 20)
  doc.text("Technical Proposal — Nexus WMS Core", lm, y); y += 12
  divider()
  doc.setFontSize(10); doc.setFont("helvetica", "normal"); doc.setTextColor(80, 80, 80)
  doc.text("Client:      Acme Logistics Corp", lm, y); y += 6
  doc.text("Ref:         PROP-2024-00847", lm, y); y += 6
  doc.text(`Date:        ${new Date().toLocaleDateString("en-MY")}`, lm, y); y += 6
  doc.text("Prepared by: Reqtify AI Sales Copilot", lm, y); y += 6
  doc.text("Valid Until: March 15, 2026", lm, y); y += 14

  // 1. Executive Summary
  h2("1. Executive Summary")
  body(
    "Acme Logistics Corp faces rising operational costs from manual dispatch workflows and " +
    "fragmented inventory visibility across multiple warehouse sites. This proposal presents " +
    "Nexus WMS Core — a cloud-native Warehouse Management System engineered for enterprise logistics " +
    "— delivering real-time inventory control, automated dispatch, and native SAP S/4HANA bi-directional sync."
  )
  gap(3)
  body(
    `Deployed within 2 months by a lean 2-person specialist team at a total investment of RM ${TOTAL.toLocaleString()}, ` +
    `the solution targets a 30%+ reduction in warehouse operation costs and full Q2 readiness — ` +
    `well within the approved budget envelope of RM 45,000–50,000.`
  )
  gap(3)
  body("Key Outcomes:")
  bullet("30%+ reduction in warehouse operational costs")
  bullet("Real-time inventory visibility across all warehouse sites")
  bullet("Native SAP S/4HANA bi-directional integration — eliminates manual data entry")
  bullet(`2-month deployment timeline; Q2 go-live achievable`)
  bullet(`Total investment RM ${TOTAL.toLocaleString()} — within approved budget`)
  gap(8)

  // 2. Scope of Work
  h2("2. Scope of Work")
  const scopeBlocks = [
    { title: "System Modules", items: ["WMS-CORE: Inventory, Receiving, Putaway, Dispatch", "Real-time barcode & RFID scanning", "Multi-site warehouse coordination", "Mobile-first operator interface (iOS & Android)"] },
    { title: "Integration Scope", items: ["SAP S/4HANA bi-directional real-time sync", "Inventory & order data flow with conflict resolution", "Webhook-based real-time event streaming", "REST API + scheduled 15-min batch sync"] },
    { title: "API & Data Flow", items: ["13 REST endpoints deployed and documented", "Inbound + outbound order management APIs", "Barcode scan & stock transfer APIs", "SAP webhook inventory sync pipeline"] },
    { title: "Deliverables", items: ["Production-ready WMS on AWS ap-southeast-1", "Integration test suite & UAT sign-off docs", "Runbook + admin documentation package", "2-week hypercare support post go-live"] },
  ]
  for (const block of scopeBlocks) {
    checkY(32)
    h3(block.title + ":", 3)
    for (const item of block.items) bullet(item, 8)
    gap(2)
  }
  gap(6)

  // 3. Pricing Summary
  checkY(60)
  h2("3. Pricing Summary")
  divider()
  const priceRows = [
    { label: "Base Software License (Annual)", amount: BASE_LICENSE },
    { label: "SAP S/4HANA Integration Services (One-time)", amount: INTEGRATION_COST },
    { label: "Maintenance & Support (Annual)", amount: MAINTENANCE_COST },
    { label: "Resource Cost (2-week deployment team)", amount: RESOURCE_COST },
    { label: "Enterprise Discount (5%)", amount: -DISCOUNT },
  ]
  for (const row of priceRows) {
    checkY(7)
    doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.setTextColor(80, 80, 80)
    doc.text(row.label, lm + 3, y)
    const amt = row.amount < 0 ? `-RM ${Math.abs(row.amount).toLocaleString()}` : `RM ${row.amount.toLocaleString()}`
    doc.text(amt, lm + pw, y, { align: "right" }); y += 6
  }
  divider()
  checkY(8)
  doc.setFontSize(11); doc.setFont("helvetica", "bold"); doc.setTextColor(20, 20, 20)
  doc.text("TOTAL INVESTMENT", lm + 3, y)
  doc.text(`RM ${TOTAL.toLocaleString()}`, lm + pw, y, { align: "right" }); y += 12

  // 4. Implementation Roadmap
  checkY(50)
  h2("4. Implementation Roadmap (8 Weeks)")
  h3("Month 1 — Build & Configuration (Weeks 1–4):", 3)
  for (const t of GANTT.filter(g => g.phase === "build"))
    bullet(`Week ${t.start}${t.end !== t.start ? `–${t.end}` : ""}: ${t.name}`, 8)
  gap(3)
  h3("Month 2 — Test & Deploy (Weeks 5–8):", 3)
  for (const t of GANTT.filter(g => g.phase === "test"))
    bullet(`Week ${t.start}${t.end !== t.start ? `–${t.end}` : ""}: ${t.name}`, 8)
  gap(8)

  // 5. Technical Architecture
  checkY(70)
  h2("5. Technical Architecture")
  const archBlocks = [
    { title: "Infrastructure", items: ["Cloud SaaS on AWS ap-southeast-1", "Auto-scaling via ECS Fargate", "PostgreSQL RDS + Redis cache", "99.9% SLA uptime guarantee"] },
    { title: "Data Flow — WMS to SAP", items: ["Real-time webhook on stock events", "Scheduled batch sync every 15 min", "Bi-directional order lifecycle updates", "Conflict resolution via optimistic locking"] },
    { title: "Security", items: ["OAuth 2.0 + JWT session tokens", "AES-256 encryption at rest & in transit (TLS 1.3)", "RBAC warehouse-level access control", "SOC 2 Type II + ISO 27001 certified"] },
    { title: "API Endpoints (Sample)", items: API_ENDPOINTS.map(ep => `${ep.method}  ${ep.route}`) },
  ]
  for (const block of archBlocks) {
    checkY(30); h3(block.title + ":", 3)
    for (const item of block.items) bullet(item, 8)
    gap(2)
  }
  gap(6)

  // 6. Risk & Support Plan
  checkY(60)
  h2("6. Risk & Support Plan")
  const risks = [
    { risk: "SAP integration data mapping mismatch", severity: "Medium", mitigation: "Pre-migration field mapping workshop in Week 1; automated diff checks before go-live." },
    { risk: "End-user adoption resistance", severity: "Low", mitigation: "On-site training + video walkthroughs; dedicated hypercare team for 2 weeks post go-live." },
    { risk: "Scope creep during UAT", severity: "Medium", mitigation: "48-hr change request assessment SLA; fixed-scope core deliverables contract." },
  ]
  for (const r of risks) {
    checkY(20); h3(`[${r.severity}] ${r.risk}`, 3)
    body(`Mitigation: ${r.mitigation}`, 8); gap(2)
  }
  gap(3); h3("Support & Maintenance Model:", 3)
  bullet("24/7 critical incident response", 8)
  bullet("Monthly system health reports", 8)
  bullet("Quarterly minor version updates + annual major upgrade included", 8)
  gap(8)

  // 7. Competitor Comparison — fresh page
  newPage()
  h2("7. Competitor Comparison — WMS Market Analysis")

  const cW = [33, 22, 18, 14, 34, 27, 22] // total = 170
  const cHdrs = ["Vendor", "SAP Integ.", "Cloud", "Mobile", "Annual Price", "Deploy", "Match"]
  doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(40, 40, 40)
  let cx = lm
  for (let i = 0; i < cHdrs.length; i++) { doc.text(cHdrs[i], cx, y); cx += cW[i] }
  y += 2; doc.setDrawColor(160, 160, 160); doc.line(lm, y, lm + cW.reduce((a, b) => a + b, 0), y); y += 5

  for (const c of COMPETITORS) {
    checkY(7)
    cx = lm
    if (c.ours) { doc.setFont("helvetica", "bold"); doc.setTextColor(180, 40, 40) }
    else { doc.setFont("helvetica", "normal"); doc.setTextColor(80, 80, 80) }
    const maxC = (w: number, s: string) => s.length > Math.floor(w / 2) ? s.slice(0, Math.floor(w / 2) - 1) + ".." : s
    const row = [
      c.ours ? `${c.name} (*)` : c.name,
      c.sapIntegration, c.cloud, c.mobile ? "Yes" : "No",
      c.priceRange, c.deployment, `${c.score}%`,
    ]
    for (let i = 0; i < row.length; i++) { doc.text(maxC(cW[i], row[i]), cx, y); cx += cW[i] }
    y += 6
  }
  gap(4)
  body("(*) Nexus WMS offers native SAP integration, 2-month deployment, and the lowest TCO — optimal for Acme Logistics Corp.", 3)
  gap(10)

  // 8. Detailed Feature Matrix
  checkY(80)
  h2("8. Detailed Feature Matrix")

  const features = [
    "Real-time Inventory Sync", "Multi-warehouse Support", "Barcode / RFID Scanning",
    "Yard & Dock Management", "Advanced Analytics & BI", "Low-code Configuration",
    "Offline Mode (Mobile)", "API-first Architecture",
  ]
  const fW = [56, 22, 22, 24, 26, 24] // total = 174
  const fHdrs = ["Capability", "Nexus WMS", "SAP EWM", "Oracle WMS", "Manhattan", "Infor WMS"]
  doc.setFontSize(8); doc.setFont("helvetica", "bold"); doc.setTextColor(40, 40, 40)
  cx = lm
  for (let i = 0; i < fHdrs.length; i++) { doc.text(fHdrs[i], cx, y); cx += fW[i] }
  y += 2; doc.setDrawColor(160, 160, 160); doc.line(lm, y, lm + fW.reduce((a, b) => a + b, 0), y); y += 5

  for (let fi = 0; fi < features.length; fi++) {
    checkY(7); cx = lm
    doc.setFont("helvetica", "normal"); doc.setTextColor(70, 70, 70)
    doc.text(features[fi], cx, y); cx += fW[0]
    for (let ci = 0; ci < COMPETITORS.length; ci++) {
      const has = COMPETITORS[ci].ours
        || (ci === 1 && fi < 5) || (ci === 2 && fi < 4)
        || (ci === 3 && [0, 1, 3].includes(fi)) || (ci === 4 && fi < 5)
      if (has) { doc.setFont("helvetica", "bold"); doc.setTextColor(40, 150, 80); doc.text("Y", cx + 4, y) }
      else { doc.setFont("helvetica", "normal"); doc.setTextColor(180, 180, 180); doc.text("-", cx + 4, y) }
      cx += fW[ci + 1]
    }
    y += 6
  }
  gap(5); divider(); gap(3)
  doc.setFontSize(8); doc.setFont("helvetica", "italic"); doc.setTextColor(130, 130, 130)
  doc.text("Generated by Reqtify AI Sales Copilot  |  Confidential — For Acme Logistics Corp Only", lm, y)

  doc.save("nexus-wms-proposal.pdf")
}

// ── Component ─────────────────────────────────────────────────────────────
export function ProposalDocument() {
  const [roiEfficiency, setRoiEfficiency] = useState(30)
  const [annualOpsCost, setAnnualOpsCost] = useState(500_000)

  const annualSavings = Math.round(annualOpsCost * (roiEfficiency / 100))
  const roi = Math.round(((annualSavings - TOTAL) / TOTAL) * 100)
  const paybackMonths = annualSavings > 0 ? Math.ceil((TOTAL / annualSavings) * 12) : 0

  return (
    <Tabs defaultValue="proposal">
      <TabsList className="mb-6 h-10 gap-1 bg-white/60 border border-border/50 rounded-xl shadow-sm backdrop-blur-sm p-1">
        <TabsTrigger
          value="proposal"
          className="flex items-center gap-1.5 rounded-lg text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm"
        >
          <FileText className="h-3.5 w-3.5" />
          Proposal Preview
        </TabsTrigger>
        <TabsTrigger
          value="comparison"
          className="flex items-center gap-1.5 rounded-lg text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm"
        >
          <BarChart3 className="h-3.5 w-3.5" />
          Competitor Comparison
        </TabsTrigger>
        <TabsTrigger
          value="financial"
          className="flex items-center gap-1.5 rounded-lg text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm"
        >
          <TrendingUp className="h-3.5 w-3.5" />
          Financial Analysis
        </TabsTrigger>
      </TabsList>

      {/* ── Tab 1: Proposal Preview ────────────────────────────────────── */}
      <TabsContent value="proposal" className="space-y-4">
        {/* Header card — pinned outside scroll area */}
        <div className="glass-card rounded-2xl p-5 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl brand-gradient">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">Technical Proposal — Nexus WMS</h3>
                <p className="text-xs text-muted-foreground">
                  PROP-2024-00847 &nbsp;·&nbsp; Acme Logistics Corp &nbsp;·&nbsp; Valid until Mar 15, 2026
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors">
                <Eye className="h-4 w-4" />
                Preview
              </button>
              <button
                onClick={exportPdf}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white brand-gradient hover:opacity-90 transition-opacity"
              >
                <Download className="h-4 w-4" />
                Export PDF
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto pr-1" style={{ maxHeight: "calc(100vh - 340px)" }}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-5">
            {/* 1. Executive Summary */}
            <div className="glass-card rounded-2xl p-6 space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100">
                  <Zap className="h-3.5 w-3.5 text-violet-600" />
                </div>
                <h4 className="font-semibold text-foreground text-sm">1. Executive Summary</h4>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Acme Logistics Corp faces rising operational costs from manual dispatch workflows
                and fragmented inventory visibility across multiple warehouse sites. This proposal
                presents <strong className="text-foreground">Nexus WMS Core</strong> — a cloud-native
                Warehouse Management System engineered for enterprise logistics — delivering
                real-time inventory control, automated dispatch, and native SAP S/4HANA
                bi-directional sync.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Deployed within <strong className="text-foreground">2 months</strong> by a lean
                2-person specialist team at a total investment of{" "}
                <strong className="text-foreground">RM {TOTAL.toLocaleString()}</strong>, the
                solution targets a 30%+ reduction in warehouse operation costs and full Q2
                readiness — well within the approved budget envelope.
              </p>
              <div className="grid grid-cols-3 gap-3 pt-2">
                {[
                  { label: "Efficiency Gain", value: "30%+", color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
                  { label: "Deployment", value: "2 Months", color: "text-blue-600 bg-blue-50 border-blue-200" },
                  { label: "Total Investment", value: `RM ${TOTAL.toLocaleString()}`, color: "text-rose-600 bg-rose-50 border-rose-200" },
                ].map((kpi) => (
                  <div key={kpi.label} className={`rounded-xl border p-3 text-center ${kpi.color}`}>
                    <p className="text-sm font-semibold">{kpi.value}</p>
                    <p className="text-[11px] mt-0.5 opacity-75">{kpi.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Scope of Work */}
            <div className="glass-card rounded-2xl p-6 space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100">
                  <Package className="h-3.5 w-3.5 text-blue-600" />
                </div>
                <h4 className="font-semibold text-foreground text-sm">2. Scope of Work</h4>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { title: "System Modules", items: ["WMS-CORE: Inventory, Receiving, Putaway", "Real-time barcode & RFID scanning", "Multi-site warehouse coordination", "Mobile-first operator interface"] },
                  { title: "Integration Scope", items: ["SAP S/4HANA bi-directional sync", "Inventory & order data flow", "Webhook-based real-time events", "REST API + scheduled batch sync"] },
                  { title: "API & Data Flow", items: ["13 REST endpoints deployed", "Inbound + outbound order APIs", "Barcode scan & stock transfer APIs", "SAP webhook inventory sync"] },
                  { title: "Deliverables", items: ["Production-ready WMS environment", "Integration test suite & UAT sign-off", "Runbook + admin documentation", "2-week hypercare post go-live"] },
                ].map((block) => (
                  <div key={block.title} className="rounded-xl bg-muted/40 p-3">
                    <p className="text-xs font-semibold text-foreground mb-2">{block.title}</p>
                    <ul className="space-y-1">
                      {block.items.map((item) => (
                        <li key={item} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                          <CheckCircle className="h-3 w-3 mt-0.5 text-emerald-500 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Pricing Summary */}
            <div className="glass-card rounded-2xl p-6 space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100">
                  <DollarSign className="h-3.5 w-3.5 text-amber-600" />
                </div>
                <h4 className="font-semibold text-foreground text-sm">3. Pricing Summary</h4>
              </div>
              <div className="space-y-2">
                {[
                  { label: "Base Software License (Annual)", amount: BASE_LICENSE, type: "base" },
                  { label: "SAP S/4HANA Integration Services (One-time)", amount: INTEGRATION_COST, type: "integration" },
                  { label: "Maintenance & Support (Annual)", amount: MAINTENANCE_COST, type: "maintenance" },
                  { label: "Resource Cost (2-week deployment team)", amount: RESOURCE_COST, type: "resource" },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between text-sm py-1.5 border-b border-border/40">
                    <span className="text-muted-foreground">{row.label}</span>
                    <span className="font-medium text-foreground">RM {row.amount.toLocaleString()}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between text-sm py-1.5 border-b border-border/40">
                  <span className="text-emerald-600">Enterprise Discount (5%)</span>
                  <span className="font-medium text-emerald-600">−RM {DISCOUNT.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between pt-2 mt-1">
                  <span className="font-semibold text-foreground">Total Investment</span>
                  <span className="text-lg font-bold text-foreground">RM {TOTAL.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* 4. Implementation Roadmap — 8-week Gantt */}
            <div className="glass-card rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100">
                  <Calendar className="h-3.5 w-3.5 text-emerald-600" />
                </div>
                <h4 className="font-semibold text-foreground text-sm">4. Implementation Roadmap (8 Weeks)</h4>
                <div className="ml-auto flex items-center gap-3 text-[11px]">
                  <span className="flex items-center gap-1"><span className="w-3 h-2 rounded bg-blue-400 inline-block" /> Month 1: Build</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-2 rounded bg-violet-400 inline-block" /> Month 2: Test & Deploy</span>
                </div>
              </div>
              {/* Week headers */}
              <div className="overflow-x-auto">
                <div className="min-w-[520px]">
                  <div className="grid" style={{ gridTemplateColumns: "180px repeat(8, 1fr)" }}>
                    <div className="text-[10px] text-muted-foreground pb-1" />
                    {[1,2,3,4,5,6,7,8].map((w) => (
                      <div key={w} className={`text-center text-[10px] pb-1 font-medium ${w <= 4 ? "text-blue-600" : "text-violet-600"}`}>
                        W{w}
                      </div>
                    ))}
                  </div>
                  <div className="space-y-1.5">
                    {GANTT.map((task) => (
                      <div key={task.name} className="grid items-center" style={{ gridTemplateColumns: "180px repeat(8, 1fr)" }}>
                        <span className="text-[11px] text-muted-foreground pr-3 truncate">{task.name}</span>
                        {[1,2,3,4,5,6,7,8].map((w) => {
                          const active = w >= task.start && w <= task.end
                          const isFirst = w === task.start
                          const isLast = w === task.end
                          return (
                            <div
                              key={w}
                              className={`h-5 ${
                                active
                                  ? task.phase === "build"
                                    ? "bg-blue-400"
                                    : "bg-violet-400"
                                  : "bg-transparent"
                              } ${isFirst ? "rounded-l-full" : ""} ${isLast ? "rounded-r-full" : ""}`}
                            />
                          )
                        })}
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 grid" style={{ gridTemplateColumns: "180px 1fr 1fr" }}>
                    <div />
                    <div className="text-center text-[11px] font-medium text-blue-600 border-t-2 border-blue-300 pt-1">Month 1: Building &amp; Configuration</div>
                    <div className="text-center text-[11px] font-medium text-violet-600 border-t-2 border-violet-300 pt-1">Month 2: Monitoring &amp; Checking</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Technical Architecture */}
            <div className="glass-card rounded-2xl p-6 space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-100">
                  <Layers className="h-3.5 w-3.5 text-rose-600" />
                </div>
                <h4 className="font-semibold text-foreground text-sm">5. Technical Architecture</h4>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-muted/40 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Server className="h-3.5 w-3.5 text-violet-600" />
                    <p className="text-xs font-semibold text-foreground">Infrastructure</p>
                  </div>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    <li>Cloud SaaS deployment (AWS ap-southeast-1)</li>
                    <li>Auto-scaling containers (ECS Fargate)</li>
                    <li>PostgreSQL RDS + Redis cache layer</li>
                    <li>99.9% SLA uptime guarantee</li>
                  </ul>
                </div>
                <div className="rounded-xl bg-muted/40 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <GitBranch className="h-3.5 w-3.5 text-blue-600" />
                    <p className="text-xs font-semibold text-foreground">Data Flow — WMS ↔ SAP</p>
                  </div>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    <li>Real-time webhook on stock events</li>
                    <li>Scheduled batch sync every 15 min</li>
                    <li>Bi-directional order lifecycle updates</li>
                    <li>Conflict resolution via optimistic locking</li>
                  </ul>
                </div>
                <div className="rounded-xl bg-muted/40 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="h-3.5 w-3.5 text-emerald-600" />
                    <p className="text-xs font-semibold text-foreground">Security Architecture</p>
                  </div>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    <li>OAuth 2.0 + JWT session tokens</li>
                    <li>AES-256 encryption at rest & in transit</li>
                    <li>RBAC with granular warehouse-level ACL</li>
                    <li>SOC 2 Type II + ISO 27001 certified</li>
                  </ul>
                </div>
                <div className="rounded-xl bg-muted/40 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="h-3.5 w-3.5 text-amber-600" />
                    <p className="text-xs font-semibold text-foreground">API Endpoints</p>
                  </div>
                  <div className="space-y-1">
                    {API_ENDPOINTS.slice(0, 5).map((ep) => (
                      <div key={ep.route} className="flex items-center gap-1.5">
                        <span className={`text-[9px] font-mono px-1 py-0.5 rounded shrink-0 ${METHOD_COLOR[ep.method] ?? "bg-muted text-muted-foreground"}`}>
                          {ep.method}
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground truncate">{ep.route}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 6. Risk & Support Plan */}
            <div className="glass-card rounded-2xl p-6 space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                </div>
                <h4 className="font-semibold text-foreground text-sm">6. Risk &amp; Support Plan</h4>
              </div>
              <div className="space-y-2">
                {[
                  {
                    risk: "SAP integration data mapping mismatch",
                    severity: "Medium",
                    mitigation: "Pre-migration field mapping workshop in Week 1; automated diff checks before go-live",
                  },
                  {
                    risk: "End-user adoption resistance",
                    severity: "Low",
                    mitigation: "On-site training sessions + video walkthrough library; dedicated hypercare team for 2 weeks post go-live",
                  },
                  {
                    risk: "Scope creep during UAT",
                    severity: "Medium",
                    mitigation: "Change request process with 48-hr assessment SLA; fixed-scope core deliverables contract",
                  },
                ].map((row) => (
                  <div key={row.risk} className="rounded-xl border border-border/50 bg-muted/30 p-3 grid grid-cols-[1fr_auto] gap-3">
                    <div>
                      <p className="text-xs font-medium text-foreground">{row.risk}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{row.mitigation}</p>
                    </div>
                    <span className={`h-fit self-start text-[10px] font-medium rounded-full px-2 py-0.5 ${
                      row.severity === "Low" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                    }`}>
                      {row.severity}
                    </span>
                  </div>
                ))}
              </div>
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 mt-2">
                <p className="text-xs font-semibold text-blue-700 mb-1.5">Support &amp; Maintenance Model</p>
                <div className="grid grid-cols-2 gap-2 text-xs text-blue-700">
                  <span>24/7 critical incident response</span>
                  <span>Monthly system health reports</span>
                  <span>Quarterly minor version updates</span>
                  <span>Annual major upgrade included</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="glass-card rounded-2xl p-5">
              <h4 className="text-sm font-semibold text-foreground mb-4">Proposal Details</h4>
              <div className="space-y-4">
                {[
                  { icon: <Building2 className="h-4 w-4 text-blue-500" />, bg: "bg-blue-500/10", label: "Client", value: "Acme Logistics Corp" },
                  { icon: <Banknote className="h-4 w-4 text-emerald-500" />, bg: "bg-emerald-500/10", label: "Total Value", value: `RM ${TOTAL.toLocaleString()} / yr` },
                  { icon: <Calendar className="h-4 w-4 text-violet-500" />, bg: "bg-violet-500/10", label: "Valid Until", value: "March 15, 2026" },
                  { icon: <Clock className="h-4 w-4 text-amber-500" />, bg: "bg-amber-500/10", label: "Implementation", value: "8 Weeks" },
                  { icon: <Users className="h-4 w-4 text-rose-500" />, bg: "bg-rose-500/10", label: "Team Size", value: "2 Specialists" },
                ].map((d) => (
                  <div key={d.label} className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${d.bg} shrink-0`}>{d.icon}</div>
                    <div>
                      <p className="text-xs text-muted-foreground">{d.label}</p>
                      <p className="text-sm font-medium text-foreground">{d.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5">
              <h4 className="text-sm font-semibold text-foreground mb-4">AI Generation Quality</h4>
              <div className="space-y-3">
                {[
                  { label: "Content Accuracy", pct: 96 },
                  { label: "Pricing Validation", pct: 100 },
                  { label: "Compliance Check", pct: 94 },
                ].map((q) => (
                  <div key={q.label}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{q.label}</span>
                      <span className="font-medium text-foreground">{q.pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: `${q.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
                  <Shield className="h-4 w-4 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Compliance Verified</p>
                  <p className="text-xs text-muted-foreground">All checks passed</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {["SOC 2", "GDPR", "ISO 27001", "HIPAA"].map((badge) => (
                  <span key={badge} className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600">
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        </div>{/* end overflow-y-auto */}
      </TabsContent>

      {/* ── Tab 2: Competitor Comparison ──────────────────────────────────── */}
      <TabsContent value="comparison">
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg brand-gradient">
                <Award className="h-4 w-4 text-white" />
              </div>
              <h3 className="font-semibold text-foreground">WMS Market Comparison</h3>
              <span className="ml-auto text-xs text-muted-foreground">Nexus WMS highlighted as recommended solution</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 text-xs font-semibold text-muted-foreground w-40">Feature</th>
                    {COMPETITORS.map((c) => (
                      <th
                        key={c.name}
                        className={`text-center py-2 px-3 text-xs font-semibold ${
                          c.ours ? "text-rose-600" : "text-muted-foreground"
                        }`}
                      >
                        {c.ours && <Star className="h-3 w-3 inline mr-0.5 text-rose-500" />}
                        {c.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {[
                    {
                      feature: "SAP Integration",
                      key: "sapIntegration",
                      render: (v: string, ours: boolean) => (
                        <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${ours ? "bg-emerald-100 text-emerald-700" : v === "Native" ? "bg-emerald-50 text-emerald-600" : "bg-muted text-muted-foreground"}`}>{v}</span>
                      ),
                    },
                    {
                      feature: "Deployment Model",
                      key: "cloud",
                      render: (v: string, ours: boolean) => (
                        <span className={`text-xs ${ours ? "font-medium text-foreground" : "text-muted-foreground"}`}>{v}</span>
                      ),
                    },
                    {
                      feature: "Mobile Support",
                      key: "mobile",
                      render: (v: boolean, ours: boolean) => (
                        v ? <CheckCircle className={`h-4 w-4 mx-auto ${ours ? "text-emerald-600" : "text-emerald-400"}`} />
                          : <span className="text-muted-foreground text-xs">—</span>
                      ),
                    },
                    {
                      feature: "Annual Price",
                      key: "priceRange",
                      render: (v: string, ours: boolean) => (
                        <span className={`text-xs font-medium ${ours ? "text-rose-600" : "text-muted-foreground"}`}>{v}</span>
                      ),
                    },
                    {
                      feature: "Deployment Time",
                      key: "deployment",
                      render: (v: string, ours: boolean) => (
                        <span className={`text-xs ${ours ? "font-medium text-foreground" : "text-muted-foreground"}`}>{v}</span>
                      ),
                    },
                    {
                      feature: "Support Hours",
                      key: "support",
                      render: (v: string, ours: boolean) => (
                        <span className={`text-xs ${ours ? "font-medium text-foreground" : "text-muted-foreground"}`}>{v}</span>
                      ),
                    },
                    {
                      feature: "Match Score",
                      key: "score",
                      render: (v: number, ours: boolean) => (
                        <div className="flex items-center gap-1 justify-center">
                          <div className="h-1.5 w-10 rounded-full bg-muted overflow-hidden">
                            <div className={`h-full rounded-full ${ours ? "bg-rose-500" : "bg-muted-foreground/50"}`} style={{ width: `${v}%` }} />
                          </div>
                          <span className={`text-[11px] font-medium ${ours ? "text-rose-600" : "text-muted-foreground"}`}>{v}%</span>
                        </div>
                      ),
                    },
                  ].map((row) => (
                    <tr key={row.feature} className="hover:bg-muted/20 transition-colors">
                      <td className="py-2.5 pr-4 text-xs text-muted-foreground font-medium">{row.feature}</td>
                      {COMPETITORS.map((c) => (
                        <td
                          key={c.name}
                          className={`text-center py-2.5 px-3 ${c.ours ? "bg-rose-50/50" : ""}`}
                        >
                          {row.render((c as Record<string, unknown>)[row.key] as never, c.ours)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-rose-500 shrink-0" />
                <p className="text-xs text-rose-700">
                  <strong>Nexus WMS</strong> offers native SAP integration, the fastest deployment (2 months), and the lowest total cost of ownership — making it the clear choice for Acme Logistics Corp&apos;s budget and timeline constraints.
                </p>
              </div>
            </div>
          </div>

          {/* Feature Matrix */}
          <div className="glass-card rounded-2xl p-6">
            <h4 className="text-sm font-semibold text-foreground mb-4">Detailed Feature Matrix</h4>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-xs">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 text-muted-foreground w-48">Capability</th>
                    {COMPETITORS.map((c) => (
                      <th key={c.name} className={`text-center py-2 px-2 ${c.ours ? "text-rose-600" : "text-muted-foreground"}`}>
                        {c.ours ? "★ " : ""}{c.name.split(" ")[0]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {[
                    "Real-time Inventory Sync",
                    "Multi-warehouse Support",
                    "Barcode / RFID Scanning",
                    "Yard & Dock Management",
                    "Advanced Analytics & BI",
                    "Low-code Configuration",
                    "Offline Mode (Mobile)",
                    "API-first Architecture",
                  ].map((feat, fi) => (
                    <tr key={feat} className="hover:bg-muted/20">
                      <td className="py-2 pr-4 text-muted-foreground">{feat}</td>
                      {COMPETITORS.map((c, ci) => {
                        const has = c.ours || (ci === 1 && fi < 5) || (ci === 2 && fi < 4) || (ci === 3 && [0,1,3].includes(fi)) || (ci === 4 && fi < 5)
                        return (
                          <td key={c.name} className={`text-center py-2 ${c.ours ? "bg-rose-50/50" : ""}`}>
                            {has
                              ? <CheckCircle className={`h-3.5 w-3.5 mx-auto ${c.ours ? "text-emerald-600" : "text-emerald-400/70"}`} />
                              : <span className="text-muted-foreground/40">—</span>}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </TabsContent>

      {/* ── Tab 3: Financial Analysis ─────────────────────────────────────── */}
      <TabsContent value="financial">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-5">
            {/* ROI Calculator */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                </div>
                <h4 className="font-semibold text-foreground text-sm">ROI Calculator</h4>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 mb-5">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1.5">
                    Annual Operations Cost (RM)
                  </label>
                  <input
                    type="number"
                    value={annualOpsCost}
                    onChange={(e) => setAnnualOpsCost(Number(e.target.value))}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
                    min={0}
                    step={10000}
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1.5">
                    Expected Efficiency Gain (%)
                  </label>
                  <input
                    type="range"
                    value={roiEfficiency}
                    onChange={(e) => setRoiEfficiency(Number(e.target.value))}
                    min={5}
                    max={60}
                    step={5}
                    className="w-full accent-rose-500 mt-2"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-0.5">
                    <span>5%</span>
                    <span className="font-medium text-rose-600">{roiEfficiency}%</span>
                    <span>60%</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Annual Savings", value: `RM ${annualSavings.toLocaleString()}`, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
                  { label: "ROI", value: `${roi}%`, color: roi > 0 ? "text-emerald-600 bg-emerald-50 border-emerald-200" : "text-red-600 bg-red-50 border-red-200" },
                  { label: "Payback Period", value: `${paybackMonths}m`, color: "text-blue-600 bg-blue-50 border-blue-200" },
                  { label: "Total Investment", value: `RM ${TOTAL.toLocaleString()}`, color: "text-rose-600 bg-rose-50 border-rose-200" },
                ].map((m) => (
                  <div key={m.label} className={`rounded-xl border p-3 text-center ${m.color}`}>
                    <p className="text-base font-bold">{m.value}</p>
                    <p className="text-[10px] mt-0.5 opacity-70">{m.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Breakdown */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100">
                  <DollarSign className="h-4 w-4 text-violet-600" />
                </div>
                <h4 className="font-semibold text-foreground text-sm">Pricing Breakdown</h4>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-3">One-time Costs</p>
                  <div className="space-y-2">
                    {[
                      { label: "SAP S/4HANA Integration", amount: INTEGRATION_COST },
                      { label: "2-Week Deployment Team", amount: RESOURCE_COST },
                    ].map((r) => (
                      <div key={r.label} className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2">
                        <span className="text-xs text-muted-foreground">{r.label}</span>
                        <span className="text-xs font-medium text-foreground">RM {r.amount.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between px-3 py-1 text-xs font-semibold text-foreground">
                      <span>One-time Total</span>
                      <span>RM {(INTEGRATION_COST + RESOURCE_COST).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-3">Annual Recurring</p>
                  <div className="space-y-2">
                    {[
                      { label: "Software License", amount: BASE_LICENSE },
                      { label: "Maintenance & Support", amount: MAINTENANCE_COST },
                      { label: "Enterprise Discount", amount: -DISCOUNT },
                    ].map((r) => (
                      <div key={r.label} className={`flex items-center justify-between rounded-lg px-3 py-2 ${r.amount < 0 ? "bg-emerald-50" : "bg-muted/40"}`}>
                        <span className={`text-xs ${r.amount < 0 ? "text-emerald-600" : "text-muted-foreground"}`}>{r.label}</span>
                        <span className={`text-xs font-medium ${r.amount < 0 ? "text-emerald-600" : "text-foreground"}`}>
                          {r.amount < 0 ? "−" : ""}RM {Math.abs(r.amount).toLocaleString()}
                        </span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between px-3 py-1 text-xs font-semibold text-foreground">
                      <span>Annual Total</span>
                      <span>RM {(BASE_LICENSE + MAINTENANCE_COST - DISCOUNT).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Visual bar */}
              <div className="mt-5 pt-4 border-t border-border/50">
                <p className="text-xs text-muted-foreground mb-2">Cost Composition</p>
                <div className="flex h-4 rounded-full overflow-hidden">
                  <div className="bg-blue-400 transition-all" style={{ width: `${(BASE_LICENSE / TOTAL) * 100}%` }} title="License" />
                  <div className="bg-violet-400" style={{ width: `${(INTEGRATION_COST / TOTAL) * 100}%` }} title="Integration" />
                  <div className="bg-amber-400" style={{ width: `${(RESOURCE_COST / TOTAL) * 100}%` }} title="Resource" />
                  <div className="bg-emerald-400" style={{ width: `${(MAINTENANCE_COST / TOTAL) * 100}%` }} title="Maintenance" />
                </div>
                <div className="flex gap-3 mt-2 flex-wrap">
                  {[
                    { label: "License", color: "bg-blue-400" },
                    { label: "Integration", color: "bg-violet-400" },
                    { label: "Resource", color: "bg-amber-400" },
                    { label: "Maintenance", color: "bg-emerald-400" },
                  ].map((l) => (
                    <div key={l.label} className="flex items-center gap-1">
                      <div className={`w-2.5 h-2.5 rounded-sm ${l.color}`} />
                      <span className="text-[10px] text-muted-foreground">{l.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Discount Logic */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100">
                  <Award className="h-4 w-4 text-rose-600" />
                </div>
                <h4 className="font-semibold text-foreground text-sm">Discount &amp; Volume Pricing</h4>
              </div>
              <div className="space-y-2">
                {[
                  { tier: "Starter (1–2 warehouses)", discount: "0%", note: "Standard pricing", active: false },
                  { tier: "Business (3–5 warehouses)", discount: "5%", note: "Applied — current engagement", active: true },
                  { tier: "Enterprise (6–10 warehouses)", discount: "10%", note: "Unlocked at renewal", active: false },
                  { tier: "Scale (10+ warehouses)", discount: "15%", note: "Custom negotiation", active: false },
                ].map((tier) => (
                  <div
                    key={tier.tier}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm ${
                      tier.active ? "border border-rose-200 bg-rose-50" : "bg-muted/40"
                    }`}
                  >
                    <div>
                      <p className={`text-sm font-medium ${tier.active ? "text-rose-700" : "text-foreground"}`}>{tier.tier}</p>
                      <p className="text-xs text-muted-foreground">{tier.note}</p>
                    </div>
                    <span className={`text-sm font-bold ${tier.active ? "text-rose-600" : "text-muted-foreground"}`}>
                      {tier.discount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar — Key Financial Metrics */}
          <div className="space-y-5">
            <div className="glass-card rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                </div>
                <h4 className="text-sm font-semibold text-foreground">Key Financial Metrics</h4>
              </div>
              <div className="space-y-4">
                <div className="rounded-xl bg-muted/40 p-3">
                  <p className="text-xs text-muted-foreground">Payback Period</p>
                  <p className="text-xl font-bold text-foreground mt-0.5">{paybackMonths}m</p>
                  <p className="text-[10px] text-muted-foreground">at {roiEfficiency}% efficiency gain</p>
                </div>
                <div className="rounded-xl bg-muted/40 p-3">
                  <p className="text-xs text-muted-foreground">Cost Efficiency Score</p>
                  <p className="text-xl font-bold text-emerald-600 mt-0.5">A+</p>
                  <p className="text-[10px] text-muted-foreground">Lowest TCO vs. competitors</p>
                </div>
                <div className="rounded-xl bg-muted/40 p-3">
                  <p className="text-xs text-muted-foreground">3-Year Value Realization</p>
                  <p className="text-xl font-bold text-foreground mt-0.5">
                    RM {(annualSavings * 3 - TOTAL).toLocaleString()}
                  </p>
                  <p className="text-[10px] text-muted-foreground">net savings over 3 years</p>
                </div>
                <div className="rounded-xl bg-muted/40 p-3">
                  <p className="text-xs text-muted-foreground">Year 1 Net ROI</p>
                  <p className={`text-xl font-bold mt-0.5 ${roi >= 0 ? "text-emerald-600" : "text-red-500"}`}>
                    {roi}%
                  </p>
                  <p className="text-[10px] text-muted-foreground">vs. total investment</p>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5">
              <h4 className="text-sm font-semibold text-foreground mb-3">Value Summary</h4>
              <ul className="space-y-2">
                {[
                  "Eliminates manual dispatch spreadsheets",
                  "Real-time inventory across all sites",
                  "SAP sync removes duplicate data entry",
                  "Mobile app reduces floor-to-office lag",
                  "Q2 go-live achievable within budget",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}
