"""
B3 — System Architecture Agent
================================
Generates a structured, high-level Nexus WMS deployment architecture
from the B1 module recommendations and Stage 1 technical requirements.
"""

import json
import logging

from app.agents.stage_1.base import BaseAgent

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """
You are the System Architecture Agent for Nexus WMS deployments.

You receive:
1. The Nexus WMS modules recommended by the Catalog Agent (B1)
2. Client technical requirements and constraints from Stage 1

YOUR TASK:
Produce a clear, structured system architecture for the Nexus WMS deployment
tailored to this client's needs.

RULES:
- Choose deployment_model based on client constraints:
    cloud_saas  = small IT team / low maintenance preference
    on_premise  = data residency / security requirements
    hybrid      = partial cloud + on-premise mix
- List each recommended module in selected_modules with its functional layer
- List all integration touchpoints (ERP, TMS, Marketplace, Hardware)
- Map Nexus WMS SLA and compliance standards to the architecture

After your reasoning, emit ONLY this JSON (no markdown fences):
{
  "deployment_model": "cloud_saas",
  "selected_modules": [
    {
      "module_code": "WMS-CORE",
      "module_name": "Core Warehouse Operations",
      "layer": "core",
      "dependencies": []
    }
  ],
  "architecture_components": [
    {
      "component": "Nexus WMS Core Engine",
      "description": "...",
      "layer": "application"
    }
  ],
  "integration_touchpoints": [
    {
      "system": "SAP S/4HANA",
      "type": "ERP",
      "protocol": "REST API",
      "direction": "bidirectional"
    }
  ],
  "security_compliance": ["SOC 2 Type II", "ISO 27001"],
  "sla": {
    "uptime": "99.9%",
    "support_hours": "24/7",
    "critical_response": "1 hour"
  },
  "scalability_notes": "...",
  "architecture_summary": "..."
}
"""


class SystemArchitectureAgent(BaseAgent):
    agent_name = "b3_system_architecture"

    async def run(self, state: dict) -> dict:
        stage1   = state.get("stage1_result", {})
        reqs     = stage1.get("requirements", stage1.get("output", {}))
        prod_rec = state.get("product_recommendations", {})
        modules  = prod_rec.get("recommended_modules", [])

        def _extract(field: str) -> str:
            val = reqs.get(field, {})
            return val.get("value", "") if isinstance(val, dict) else str(val or "")

        tech_reqs   = _extract("technical_requirements")
        constraints = _extract("constraints")
        location    = _extract("location")

        user_content = (
            f"RECOMMENDED WMS MODULES:\n{json.dumps(modules, default=str, indent=2)}\n\n"
            f"TECHNICAL REQUIREMENTS: {tech_reqs}\n"
            f"CONSTRAINTS: {constraints}\n"
            f"LOCATIONS: {location}\n\n"
            f"NEXUS WMS INTEGRATIONS AVAILABLE:\n"
            f"  ERP: SAP S/4HANA, Oracle ERP Cloud, Microsoft Dynamics 365, NetSuite\n"
            f"  TMS: Nexus TMS, MercuryGate, Oracle TMS\n"
            f"  Marketplaces: Amazon, Shopify, WooCommerce\n"
            f"  Protocols: REST API, SOAP, EDI (AS2/SFTP), Webhooks\n\n"
            f"Generate the full system architecture for this Nexus WMS deployment."
        )

        cot = await self._call_cot(
            system_prompt=SYSTEM_PROMPT,
            user_content=user_content,
            max_tokens=2500,
        )

        return {
            "system_architecture": cot.output,
            "cot_traces":          [cot.model_dump()],
        }
