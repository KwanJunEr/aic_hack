"""
B4 — Integration Planning Agent
=================================
Produces the full integration plan: required API routes, integration
strategy, and hardened best practices for authentication, data flow,
service communication, and error handling.

Input: B1 module recommendations + B3 system architecture + Stage 1 requirements.
"""

import json
import logging

from app.agents.stage_1.base import BaseAgent

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """
You are the Integration Planning Agent for Nexus WMS deployments.

You receive:
1. The system architecture produced by the Architecture Agent (B3)
2. The recommended WMS modules (B1) and integration touchpoints
3. Client technical requirements from Stage 1

YOUR TASK:
Produce a complete, production-grade integration plan for connecting Nexus WMS
to the client's existing systems.

REQUIRED OUTPUTS:
1. api_routes — the key REST endpoints the integration will expose or consume
2. integration_strategy — how data flows between systems
3. best_practices — concrete guidance on auth, data flow, communication, and errors

BEST PRACTICE CATEGORIES:
- authentication: OAuth2, API keys, JWT, mTLS guidance
- data_flow: sync vs async, batching, idempotency
- service_communication: retry logic, circuit breakers, timeouts
- error_handling: dead-letter queues, alerting, rollback

After your reasoning, emit ONLY this JSON (no markdown fences):
{
  "api_routes": [
    {
      "route": "/api/v1/wms/inbound/receiving",
      "method": "POST",
      "description": "Create an inbound receiving record from ERP PO",
      "integration_target": "ERP",
      "auth": "OAuth2 Bearer",
      "data_format": "JSON",
      "notes": "..."
    }
  ],
  "integration_strategy": {
    "approach": "...",
    "data_flow": "...",
    "middleware": "...",
    "sync_mode": "event-driven"
  },
  "best_practices": {
    "authentication": ["Use OAuth2 client-credentials for service-to-service", "..."],
    "data_flow": ["..."],
    "service_communication": ["..."],
    "error_handling": ["..."]
  },
  "estimated_integration_complexity": "medium",
  "integration_timeline_weeks": 8,
  "integration_summary": "..."
}
"""


class IntegrationPlanningAgent(BaseAgent):
    agent_name = "b4_integration_planning"

    async def run(self, state: dict) -> dict:
        stage1   = state.get("stage1_result", {})
        reqs     = stage1.get("requirements", stage1.get("output", {}))
        arch     = state.get("system_architecture", {})
        prod_rec = state.get("product_recommendations", {})

        def _extract(field: str) -> str:
            val = reqs.get(field, {})
            return val.get("value", "") if isinstance(val, dict) else str(val or "")

        tech_reqs   = _extract("technical_requirements")
        constraints = _extract("constraints")
        modules     = prod_rec.get("recommended_modules", [])
        touchpoints = arch.get("integration_touchpoints", [])
        deployment  = arch.get("deployment_model", "cloud_saas")

        user_content = (
            f"TECHNICAL REQUIREMENTS: {tech_reqs}\n"
            f"CONSTRAINTS: {constraints}\n"
            f"DEPLOYMENT MODEL: {deployment}\n\n"
            f"INTEGRATION TOUCHPOINTS:\n"
            f"{json.dumps(touchpoints, default=str, indent=2)}\n\n"
            f"SELECTED MODULES:\n"
            f"{json.dumps(modules, default=str, indent=2)}\n\n"
            f"SYSTEM ARCHITECTURE COMPONENTS:\n"
            f"{json.dumps(arch.get('architecture_components', []), default=str, indent=2)}\n\n"
            f"Generate the full integration plan with API routes and best practices."
        )

        cot = await self._call_cot(
            system_prompt=SYSTEM_PROMPT,
            user_content=user_content,
            max_tokens=3000,
        )

        return {
            "integration_plan": cot.output,
            "cot_traces":       [cot.model_dump()],
        }
