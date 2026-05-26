"""
Mock RAG (Retrieval-Augmented Generation) for the catalog agent.
Simulates vector-search over the product SKU catalog without any real embeddings or LLM calls.
In production this would call a vector store (e.g. MongoDB Atlas Vector Search, Pinecone, etc.)
via the MCP server.
"""

from __future__ import annotations

MOCK_CATALOG: list[dict] = [
    {
        "sku": "WMS-CORE",
        "name": "Core Warehouse Operations",
        "description": "Real-time inventory tracking, barcode/RFID scanning, multi-site management. Included in base license.",
        "price_monthly": 0,
        "price_annual": 180_000,
        "currency": "MYR",
        "included_in_base": True,
        "tags": ["inventory", "warehouse", "multi-site", "barcode", "rfid", "core"],
        "compatibility": ["WMS-YARD", "WMS-ANALYTICS", "WMS-3PL", "WMS-MOBILE"],
        "requires": [],
    },
    {
        "sku": "WMS-YARD",
        "name": "Yard Management",
        "description": "Dock scheduling, gate management, yard visibility for 15+ dock doors.",
        "price_monthly": 8_800,
        "price_annual": 95_000,
        "currency": "MYR",
        "included_in_base": False,
        "tags": ["yard", "dock", "gate", "scheduling", "logistics"],
        "compatibility": ["WMS-CORE", "WMS-ANALYTICS"],
        "requires": ["WMS-CORE"],
    },
    {
        "sku": "WMS-ANALYTICS",
        "name": "Advanced Analytics & BI",
        "description": "Labor productivity KPIs, demand forecasting, custom dashboards.",
        "price_monthly": 10_000,
        "price_annual": 120_000,
        "currency": "MYR",
        "included_in_base": False,
        "tags": ["analytics", "bi", "reporting", "kpi", "forecasting", "dashboard"],
        "compatibility": ["WMS-CORE", "WMS-YARD", "WMS-3PL"],
        "requires": ["WMS-CORE"],
    },
    {
        "sku": "WMS-3PL",
        "name": "3PL Billing & Client Portal",
        "description": "Multi-tenant billing, client self-service portal for 3PL operators.",
        "price_monthly": 7_500,
        "price_annual": 90_000,
        "currency": "MYR",
        "included_in_base": False,
        "tags": ["3pl", "billing", "multi-tenant", "client-portal"],
        "compatibility": ["WMS-CORE", "WMS-ANALYTICS"],
        "requires": ["WMS-CORE"],
    },
    {
        "sku": "WMS-MOBILE",
        "name": "Mobile Workforce",
        "description": "iOS/Android apps for floor staff: pick, pack, receive, cycle count.",
        "price_monthly": 4_200,
        "price_annual": 48_000,
        "currency": "MYR",
        "included_in_base": False,
        "tags": ["mobile", "ios", "android", "pick", "pack", "receive", "floor"],
        "compatibility": ["WMS-CORE"],
        "requires": ["WMS-CORE"],
    },
    {
        "sku": "WMS-SAP",
        "name": "SAP S/4HANA Connector",
        "description": "Bi-directional real-time sync with SAP S/4HANA via certified RFC/IDoc adapter.",
        "price_monthly": 6_000,
        "price_annual": 68_000,
        "currency": "MYR",
        "included_in_base": False,
        "tags": ["sap", "s4hana", "erp", "integration", "connector", "sync"],
        "compatibility": ["WMS-CORE", "WMS-ANALYTICS"],
        "requires": ["WMS-CORE"],
    },
]


def search(query: str, top_k: int = 4) -> list[dict]:
    """
    Mock semantic search: scores each SKU by keyword overlap with the query.
    Returns top_k results sorted by descending score with a mock confidence value.
    """
    query_tokens = set(query.lower().split())
    scored: list[tuple[float, dict]] = []

    for item in MOCK_CATALOG:
        tag_tokens = set(item["tags"])
        desc_tokens = set(item["description"].lower().split())
        overlap = len(query_tokens & (tag_tokens | desc_tokens))
        score = min(overlap / max(len(query_tokens), 1), 1.0)
        scored.append((score, item))

    scored.sort(key=lambda x: x[0], reverse=True)
    return [
        {**item, "relevance_score": round(score, 2)}
        for score, item in scored[:top_k]
    ]


def get_by_sku(sku: str) -> dict | None:
    for item in MOCK_CATALOG:
        if item["sku"] == sku:
            return item
    return None
