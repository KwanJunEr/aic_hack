"""
Stage 2 base — re-exports Stage 1 BaseAgent so all Stage 2 agents
inherit the same CoT + retry + A2A machinery.
"""

from app.agents.stage_1.base import BaseAgent, COT_SYSTEM_PREFIX

__all__ = ["BaseAgent", "COT_SYSTEM_PREFIX"]
