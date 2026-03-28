from __future__ import annotations

from pathlib import Path
from typing import Any

import yaml

from breakmybot.models import (
    BreakMyBotConfig,
    EndpointConfig,
    ExpectationsConfig,
    RequestConfig,
    RunConfig,
)


class ConfigError(ValueError):
    pass


def load_config(path: Path) -> BreakMyBotConfig:
    if not path.exists():
        raise ConfigError(f"Config file does not exist: {path}")

    raw = yaml.safe_load(path.read_text(encoding="utf-8")) or {}

    if not isinstance(raw, dict):
        raise ConfigError("Config root must be a YAML mapping.")

    endpoint_raw = _require_mapping(raw.get("endpoint"), "endpoint")
    request_raw = _require_mapping(raw.get("request"), "request")
    expectations_raw = _optional_mapping(raw.get("expectations"))
    run_raw = _optional_mapping(raw.get("run")) or {}
    sample_inputs = _require_text_list(raw.get("sample_inputs"), "sample_inputs")

    endpoint = EndpointConfig(
        url=_require_string(endpoint_raw.get("url"), "endpoint.url"),
        method=_require_string(endpoint_raw.get("method", "POST"), "endpoint.method"),
        headers=_optional_string_mapping(endpoint_raw.get("headers")),
    )
    request = RequestConfig(
        template=_require_mapping(request_raw.get("template"), "request.template"),
        variable=_require_string(request_raw.get("variable"), "request.variable"),
    )
    if not isinstance(request.template, dict):
        raise ConfigError("request.template must be a YAML mapping.")

    expectations = ExpectationsConfig(
        response_schema=_optional_mapping(expectations_raw.get("response_schema"))
        if expectations_raw
        else None
    )
    run = RunConfig(
        iterations=_require_positive_int(run_raw.get("iterations", 10), "run.iterations"),
        mutations=_optional_string_list(run_raw.get("mutations")),
    )

    return BreakMyBotConfig(
        endpoint=endpoint,
        request=request,
        expectations=expectations,
        run=run,
        sample_inputs=sample_inputs,
    )


def _require_mapping(value: Any, field_name: str) -> dict[str, Any]:
    if not isinstance(value, dict):
        raise ConfigError(f"{field_name} must be a YAML mapping.")
    return value


def _optional_mapping(value: Any) -> dict[str, Any] | None:
    if value is None:
        return None
    if not isinstance(value, dict):
        raise ConfigError("Expected a YAML mapping.")
    return value


def _require_string(value: Any, field_name: str) -> str:
    if not isinstance(value, str) or not value.strip():
        raise ConfigError(f"{field_name} must be a non-empty string.")
    return value.strip()


def _require_positive_int(value: Any, field_name: str) -> int:
    if not isinstance(value, int) or value <= 0:
        raise ConfigError(f"{field_name} must be a positive integer.")
    return value


def _optional_string_mapping(value: Any) -> dict[str, str]:
    if value is None:
        return {}
    if not isinstance(value, dict):
        raise ConfigError("endpoint.headers must be a YAML mapping.")

    parsed: dict[str, str] = {}
    for key, item in value.items():
        if not isinstance(key, str) or not isinstance(item, str):
            raise ConfigError("endpoint.headers keys and values must be strings.")
        parsed[key] = item
    return parsed


def _require_string_list(value: Any, field_name: str) -> list[str]:
    items = _optional_string_list(value)
    if not items:
        raise ConfigError(f"{field_name} must contain at least one string.")
    return items


def _optional_string_list(value: Any) -> list[str]:
    if value is None:
        return []
    if not isinstance(value, list):
        raise ConfigError("Expected a YAML list.")

    parsed: list[str] = []
    for item in value:
        if not isinstance(item, str) or not item.strip():
            raise ConfigError("List items must be non-empty strings.")
        parsed.append(item.strip())
    return parsed


def _require_text_list(value: Any, field_name: str) -> list[str]:
    if not isinstance(value, list) or not value:
        raise ConfigError(f"{field_name} must contain at least one string.")

    parsed: list[str] = []
    for item in value:
        if not isinstance(item, str):
            raise ConfigError(f"{field_name} must contain only string values.")
        parsed.append(item)
    return parsed
