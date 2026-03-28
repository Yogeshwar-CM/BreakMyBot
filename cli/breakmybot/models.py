from __future__ import annotations

from dataclasses import dataclass
from typing import Literal

ProviderName = Literal["openai", "anthropic", "groq"]


@dataclass(slots=True)
class ProviderCatalogEntry:
    name: ProviderName
    display_name: str
    default_model: str
    base_url: str


@dataclass(slots=True)
class RuntimeConfig:
    provider: ProviderName
    api_key: str
    model: str
    base_url: str
    created_at: str
    updated_at: str


@dataclass(slots=True)
class RuntimeConfigSummary:
    configured: bool
    config_path: str
    provider: ProviderName | None = None
    model: str | None = None


PROVIDER_CATALOG: dict[ProviderName, ProviderCatalogEntry] = {
    "openai": ProviderCatalogEntry(
        name="openai",
        display_name="OpenAI",
        default_model="gpt-4o-mini",
        base_url="https://api.openai.com/v1",
    ),
    "anthropic": ProviderCatalogEntry(
        name="anthropic",
        display_name="Anthropic",
        default_model="claude-3-5-haiku-latest",
        base_url="https://api.anthropic.com/v1",
    ),
    "groq": ProviderCatalogEntry(
        name="groq",
        display_name="Groq",
        default_model="llama-3.3-70b-versatile",
        base_url="https://api.groq.com/openai/v1",
    ),
}
