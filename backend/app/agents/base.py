from __future__ import annotations

import time
from abc import ABC, abstractmethod

from pydantic import BaseModel

from app.models.cot import CoTOutput


class BaseAgent(ABC):
    """
    Contract all agents must satisfy.

    Subclasses implement _execute() only.
    run() wraps it with timing and (in production) LangSmith tracing + audit writes.
    """

    name: str = "BaseAgent"

    def __init__(self, session_id: str) -> None:
        self.session_id = session_id

    async def run(self, input: BaseModel) -> CoTOutput:
        start = time.monotonic()
        result = await self._execute(input)
        result.duration_ms = int((time.monotonic() - start) * 1000)
        return result

    @abstractmethod
    async def _execute(self, input: BaseModel) -> CoTOutput:
        """Agents implement their logic here and return a CoTOutput."""
        raise NotImplementedError
