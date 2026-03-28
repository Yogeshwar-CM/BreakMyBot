from __future__ import annotations

import json
import os
from dataclasses import asdict
from datetime import UTC, datetime
from pathlib import Path

from breakmybot.models import (
    PROVIDER_CATALOG,
    ProviderCatalogEntry,
    ProviderName,
    RuntimeConfig,
    RuntimeConfigSummary,
)


class RuntimeConfigError(ValueError):
    pass


def resolve_config_home(override: str | None = None) -> Path:
    if override:
        return Path(override).expanduser().resolve()

    env_override = os.environ.get("BREAKMYBOT_CONFIG_HOME")
    if env_override:
        return Path(env_override).expanduser().resolve()

    xdg_home = os.environ.get("XDG_CONFIG_HOME")
    base = Path(xdg_home).expanduser() if xdg_home else Path.home() / ".config"
    return (base / "breakmybot").resolve()


def resolve_runtime_config_path(override: str | None = None) -> Path:
    return resolve_config_home(override) / "runtime.json"


def save_runtime_config(config: RuntimeConfig, override: str | None = None) -> Path:
    config_path = resolve_runtime_config_path(override)
    config_path.parent.mkdir(parents=True, exist_ok=True)
    config_path.write_text(json.dumps(asdict(config), indent=2), encoding="utf-8")
    os.chmod(config_path, 0o600)
    return config_path


def load_runtime_config(override: str | None = None) -> RuntimeConfig:
    config_path = resolve_runtime_config_path(override)
    if not config_path.exists():
        raise RuntimeConfigError(
            f"Provider runtime config was not found at {config_path}. Run `breakmybot setup` first."
        )

    try:
        raw = json.loads(config_path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as error:
        raise RuntimeConfigError(f"Provider runtime config is not valid JSON: {error}") from error

    if not isinstance(raw, dict):
        raise RuntimeConfigError("Provider runtime config must be a JSON object.")

    provider = _require_provider_name(raw.get("provider"))
    api_key = _require_non_empty_string(raw.get("api_key"), "api_key")
    model = _require_non_empty_string(raw.get("model"), "model")
    base_url = _require_non_empty_string(raw.get("base_url"), "base_url")
    created_at = _require_non_empty_string(raw.get("created_at"), "created_at")
    updated_at = _require_non_empty_string(raw.get("updated_at"), "updated_at")

    return RuntimeConfig(
        provider=provider,
        api_key=api_key,
        model=model,
        base_url=base_url,
        created_at=created_at,
        updated_at=updated_at,
    )


def load_runtime_summary(override: str | None = None) -> RuntimeConfigSummary:
    config_path = resolve_runtime_config_path(override)
    if not config_path.exists():
        return RuntimeConfigSummary(configured=False, config_path=str(config_path))

    config = load_runtime_config(override)
    return RuntimeConfigSummary(
        configured=True,
        config_path=str(config_path),
        provider=config.provider,
        model=config.model,
    )


def build_runtime_config(
    provider: ProviderName,
    api_key: str,
    model: str | None = None,
    base_url: str | None = None,
) -> RuntimeConfig:
    provider_entry = get_provider(provider)
    now = _utc_now()
    return RuntimeConfig(
        provider=provider,
        api_key=api_key.strip(),
        model=(model or provider_entry.default_model).strip(),
        base_url=(base_url or provider_entry.base_url).strip(),
        created_at=now,
        updated_at=now,
    )


def get_provider(provider: ProviderName) -> ProviderCatalogEntry:
    return PROVIDER_CATALOG[provider]


def mask_secret(secret: str) -> str:
    if len(secret) <= 6:
        return "*" * len(secret)
    return f"{secret[:3]}{'*' * max(4, len(secret) - 6)}{secret[-3:]}"


def _utc_now() -> str:
    return datetime.now(UTC).replace(microsecond=0).isoformat()


def _require_provider_name(value: object) -> ProviderName:
    if not isinstance(value, str) or value not in PROVIDER_CATALOG:
        raise RuntimeConfigError("provider must be one of: openai, anthropic, groq.")
    return value


def _require_non_empty_string(value: object, field_name: str) -> str:
    if not isinstance(value, str) or not value.strip():
        raise RuntimeConfigError(f"{field_name} must be a non-empty string.")
    return value.strip()
