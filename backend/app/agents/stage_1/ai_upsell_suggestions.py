"""
Agent 3 — Sales Suggester

Reads extracted requirements + budget validation and produces actionable
AI sales suggestions: opportunities, risks, upsell angles, and next actions.

Runs in parallel with Gap Detector and Deal Scorer.
"""

from langchain_core.messages import HumanMessage, SystemMessage

from app.agents.state import SalesAnalysisState, SalesSuggestion
from app.agents.utils import get_llm, parse_json, agent_log

_SYSTEM = """
You are an expert B2B sales strategist. Based on requirements extracted from a
sales call, generate targeted, actionable sales suggestions.

Return ONLY a valid JSON object — no prose, no markdown fences:

{
  "suggestions": [
    {
      "text": "<the suggestion, written as a concise actionable insight>",
      "type": "opportunity|risk|upsell|action"
    }
  ],
  "thoughts": [
    "<thought 1>",
    "<thought 2>",
    "<thought 3>"
  ]
}

Type guide:
  opportunity — a deal angle or opening to exploit
  risk        — something that could kill or delay the deal
  upsell      — an additional product/module/service to propose
  action      — a specific next step the rep should take

Return 4–7 suggestions, mix of types. Be specific to the context — avoid generic sales advice.
""".strip()


async def sales_suggester_node(state: SalesAnalysisState) -> dict:
    llm = get_llm(temperature=0.3)

    reqs = state.get("extracted_requirements")
    budget_val = state.get("budget_validation")

    if reqs is None:
        return {
            "sales_suggestions": [],
            "agent_thoughts": [agent_log("Sales Suggester", ["Skipped — no requirements extracted."])],
        }

    prompt = f"""
Extracted Requirements:
{reqs}

Budget Validation:
{budget_val}

Original Transcript:
{state['transcript']}
""".strip()

    messages = [
        SystemMessage(content=_SYSTEM),
        HumanMessage(content=prompt),
    ]

    try:
        response = await llm.ainvoke(messages)
        data = parse_json(response.content)

        suggestions = [SalesSuggestion(**s) for s in data["suggestions"]]
        thoughts = data.get("thoughts", [])

        return {
            "sales_suggestions": suggestions,
            "agent_thoughts": [agent_log("Sales Suggester", thoughts)],
        }

    except Exception as e:
        return {
            "sales_suggestions": [],
            "agent_thoughts": [agent_log("Sales Suggester", [f"Error: {e}"])],
            "errors": [f"sales_suggester: {e}"],
        }