from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any


@dataclass(slots=True)
class EndpointConfig:
    url: str
    method: str = "POST"
    headers: dict[str, str] = field(default_factory=dict)


@dataclass(slots=True)
class RequestConfig:
    template: dict[str, Any]
    variable: str


@dataclass(slots=True)
class ExpectationsConfig:
    response_schema: dict[str, Any] | None = None


@dataclass(slots=True)
class RunConfig:
    iterations: int = 10
    mutations: list[str] = field(default_factory=list)


@dataclass(slots=True)
class BreakMyBotConfig:
    endpoint: EndpointConfig
    request: RequestConfig
    expectations: ExpectationsConfig
    run: RunConfig
    sample_inputs: list[str]
