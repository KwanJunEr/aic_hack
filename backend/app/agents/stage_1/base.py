"""
BaseAgent
=========
Every Stage 1–3 agent inherits from this class.

Chain-of-Thought (CoT) design
------------------------------
Each agent makes TWO LLM calls per execution:

  Call 1 — _call_cot()
    Asks the LLM to reason step-by-step about the task before answering.
    Returns a CoTOutput with: reasoning, steps[], confidence, duration_ms.
    The reasoning text is then injected into Call 2 as context.

  Call 2 — _call_llm()
    Uses the CoT reasoning as a "scratchpad" prefix so the final structured
    JSON answer is grounded in the reasoning rather than produced cold.

CoT output is stored in two places:
  - PipelineState.cot_traces  : full trace list, visible to the HITL panel
                                 and carried into Stage 2/3
  - A2A message log           : compact summary (agent, confidence, steps, ms)
                                 so downstream agents know how certain A1–A6 were

LangSmith tracing
-----------------
Both LLM calls appear as nested spans under the agent's node span.
Set LANGCHAIN_TRACING_V2=true to activate.
"""

import time
import json
import re
import logging
from abc import ABC, abstractmethod
from typing import Optional

from tenacity import retry, stop_after_attempt, wait_exponential
from app.agents.stage_1.cot import CoTOutput

logger = logging.getLogger(__name__)

# ── CoT system prompt injected before every agent's own system prompt ─────
COT_SYSTEM_PREFIX = """
Before producing your final answer you MUST reason step by step.

Use this exact format for your reasoning — do NOT skip it:

<reasoning>
Step 1: [what you are examining]
Conclusion 1: [what you found]

Step 2: [what you are examining]
Conclusion 2: [what you found]

... (as many steps as needed)

Overall confidence: [0-100] — how confident are you in your final answer?
Confidence reasoning: [one sentence explaining the score]
</reasoning>

After the </reasoning> block, emit ONLY the JSON output described in the task.
Do not add any text after the JSON.
"""


class BaseAgent(ABC):
    agent_name: str = "base_agent"

    # ── Subclasses implement this ─────────────────────────────────────────
    @abstractmethod
    async def run(self, state: dict) -> dict:
        """
        Receives the full PipelineState dict.
        Returns a PARTIAL dict — only the keys this agent writes.
        Must include 'cot_traces' with one CoTOutput entry.
        """

    # ── LangGraph node entry point ────────────────────────────────────────
    async def __call__(self, state: dict) -> dict:
        """Called by LangGraph as a graph node."""
        start = time.time()
        try:
            result = await self._run_with_retry(state)
            duration_ms = int((time.time() - start) * 1000)
            logger.info(f"[{self.agent_name}] OK — {duration_ms}ms")

            # Patch duration into the CoT trace this agent wrote
            if "cot_traces" in result and result["cot_traces"]:
                result["cot_traces"][-1]["duration_ms"] = duration_ms

            # Emit A2A message with CoT confidence summary
            cot_confidence = None
            if result.get("cot_traces"):
                cot_confidence = result["cot_traces"][-1].get("confidence")

            result.setdefault("a2a_messages", [])
            result["a2a_messages"].append({
                "from":        self.agent_name,
                "status":      "ok",
                "duration_ms": duration_ms,
                "confidence":  cot_confidence,
                "wrote":       [k for k in result if k not in ("a2a_messages", "cot_traces")],
            })
            return result

        except Exception as exc:
            logger.error(f"[{self.agent_name}] ERROR — {exc}")
            return {
                "a2a_messages": [{
                    "from":   self.agent_name,
                    "status": "error",
                    "error":  str(exc),
                }],
                "cot_traces": [{
                    "agent_name":  self.agent_name,
                    "reasoning":   f"Agent failed: {exc}",
                    "steps":       [],
                    "output":      {},
                    "confidence":  0.0,
                    "duration_ms": int((time.time() - start) * 1000),
                }],
            }

    # ── Retry: 3 attempts, exponential backoff ────────────────────────────
    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
        reraise=True,
    )
    async def _run_with_retry(self, state: dict) -> dict:
        return await self.run(state)

    # ── CoT call — Call 1 of 2 ───────────────────────────────────────────
    async def _call_cot(
        self,
        system_prompt: str,
        user_content:  str,
        max_tokens:    int = 2000,
    ) -> CoTOutput:
        """
        First LLM call: asks the model to reason step-by-step before answering.
        Returns a CoTOutput containing the reasoning, parsed steps, and confidence.
        The reasoning text is then passed to _call_llm_with_cot() as context.
        """
        cot_system = COT_SYSTEM_PREFIX + "\n\n" + system_prompt
        start = time.time()

        raw = await self._call_llm_raw(
            system_prompt=cot_system,
            user_content=user_content,
            max_tokens=max_tokens,
        )

        reasoning_text, output_json, confidence = self._parse_cot_response(raw)
        steps = self._parse_cot_steps(reasoning_text)
        duration_ms = int((time.time() - start) * 1000)

        cot = CoTOutput(
            agent_name=self.agent_name,
            reasoning=reasoning_text,
            steps=steps,
            output=output_json,
            confidence=confidence,
            duration_ms=duration_ms,
        )
        logger.info(
            f"[{self.agent_name}] CoT complete — "
            f"{len(steps)} steps, confidence={confidence:.2f}"
        )
        return cot

    # ── Plain LLM call — Call 2 of 2 (used when CoT already ran) ─────────
    async def _call_llm(
        self,
        system_prompt: str,
        user_content:  str,
        max_tokens:    int = 1500,
    ) -> str:
        """
        Second LLM call: produces final structured output, optionally
        prefixed with CoT reasoning from Call 1.
        """
        return await self._call_llm_raw(system_prompt, user_content, max_tokens)

    # ── Raw OpenAI SDK call — LangSmith traces this span ────────────────
    async def _call_llm_raw(
        self,
        system_prompt: str,
        user_content:  str,
        max_tokens:    int = 1500,
    ) -> str:
        from openai import AsyncOpenAI
        client = AsyncOpenAI()          # reads OPENAI_API_KEY from env
        response = await client.chat.completions.create(
            model="gpt-4o",
            max_tokens=max_tokens,
            messages=[
                {"role": "system",  "content": system_prompt},
                {"role": "user",    "content": user_content},
            ],
        )
        return response.choices[0].message.content

    # ── CoT response parser ───────────────────────────────────────────────
    def _parse_cot_response(self, raw: str) -> tuple[str, dict, float]:
        """
        Splits the LLM response into:
          (reasoning_text, output_dict, confidence_float)
        """
        reasoning_text = ""
        confidence = 0.8   # default if not found

        # Extract <reasoning>...</reasoning> block
        reasoning_match = re.search(
            r"<reasoning>(.*?)</reasoning>",
            raw, re.DOTALL | re.IGNORECASE
        )
        if reasoning_match:
            reasoning_text = reasoning_match.group(1).strip()
            # Pull confidence score from reasoning block
            conf_match = re.search(r"Overall confidence:\s*(\d+)", reasoning_text)
            if conf_match:
                confidence = min(float(conf_match.group(1)) / 100.0, 1.0)

        # Everything after </reasoning> is the JSON output
        after_reasoning = re.sub(
            r"<reasoning>.*?</reasoning>", "", raw,
            flags=re.DOTALL | re.IGNORECASE
        ).strip()

        output_dict = self._parse_json(after_reasoning)
        return reasoning_text, output_dict, confidence

    # ── CoT steps parser ─────────────────────────────────────────────────
    def _parse_cot_steps(self, reasoning_text: str) -> list:
        """
        Parses 'Step N: ... Conclusion N: ...' pairs from reasoning text.
        Returns a list of CoTStep-compatible dicts.
        """
        steps = []
        step_matches = re.finditer(
            r"Step\s+(\d+):\s*(.*?)(?=Step\s+\d+:|Overall confidence:|$)",
            reasoning_text, re.DOTALL | re.IGNORECASE
        )
        for m in step_matches:
            step_num = int(m.group(1))
            block = m.group(2).strip()
            # Split block into thought / conclusion
            conc_match = re.search(
                r"Conclusion\s+\d+:\s*(.*?)$", block,
                re.DOTALL | re.IGNORECASE
            )
            if conc_match:
                thought = block[:conc_match.start()].strip()
                conclusion = conc_match.group(1).strip()
            else:
                thought = block
                conclusion = ""
            steps.append({
                "step":       step_num,
                "thought":    thought,
                "conclusion": conclusion,
            })
        return steps

    # ── JSON parse with fallback ──────────────────────────────────────────
    def _parse_json(self, raw: str) -> dict:
        raw = raw.strip()
        raw = re.sub(r"^```json\s*", "", raw)
        raw = re.sub(r"\s*```$", "", raw)
        try:
            return json.loads(raw)
        except json.JSONDecodeError as exc:
            logger.warning(f"[{self.agent_name}] JSON parse failed: {exc}")
            return {"raw_response": raw, "parse_error": str(exc)}

    # ── Helper: build CoT-enriched user content for Call 2 ───────────────
    def _with_cot_context(self, cot: CoTOutput, user_content: str) -> str:
        """
        Prepends the agent's own reasoning to the user content for Call 2,
        so the final structured answer is grounded in the CoT scratchpad.
        """
        return (
            f"MY REASONING (from prior analysis):\n{cot.reasoning}\n\n"
            f"Now produce the final structured JSON output.\n\n"
            f"{user_content}"
        )