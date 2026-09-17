"""
Federated LLM endpoint registry + resolve logic for MCP Hub.

Backend (Express) and Cursor bridge call POST /llm/resolve with agent + tier;
optional JSON registry overrides defaults (MCP_HUB_LLM_REGISTRY_JSON).
"""

from __future__ import annotations

import json
import logging
import os
from pathlib import Path
from typing import Any

import httpx

logger = logging.getLogger(__name__)

_HUB_DIR = Path(__file__).resolve().parent
_DEFAULT_REGISTRY_FILE = _HUB_DIR / "config" / "llm_endpoints.default.json"


def _strip_slash(url: str) -> str:
    return url.rstrip("/")


def _ollama_host() -> str:
    raw = (os.getenv("OLLAMA_BASE_URL") or os.getenv("OLLAMA_HOST") or "").strip()
    if raw:
        return _strip_slash(raw)
    return "http://localhost:11434"


def _ollama_model_for_tier(tier: str, ollama_preset: str | None) -> str:
    preset = (ollama_preset or "").lower().strip()
    base = os.getenv("OLLAMA_MODEL") or "llama3.3:70b"
    if preset == "fast":
        return os.getenv("OLLAMA_MODEL_FAST") or base
    if preset == "agent":
        return os.getenv("OLLAMA_MODEL_AGENT") or base
    if preset == "quality":
        return os.getenv("OLLAMA_MODEL_QUALITY") or base
    if preset == "vision":
        return os.getenv("OLLAMA_MODEL_VISION") or os.getenv("OLLAMA_MODEL_AGENT") or base
    if preset == "coding":
        return os.getenv("OLLAMA_MODEL_CODING") or os.getenv("OLLAMA_MODEL_FAST") or base
    tier_l = tier.lower()
    if tier_l == "lite":
        return os.getenv("OLLAMA_MODEL_FAST") or base
    if tier_l == "standard":
        return os.getenv("OLLAMA_MODEL_AGENT") or base
    if tier_l == "heavy":
        return os.getenv("OLLAMA_MODEL_QUALITY") or base
    return base


def _builtin_registry() -> dict[str, Any]:
    """Default mesh when no JSON file present."""
    ollama = _ollama_host()
    return {
        "endpoints": [
            {
                "id": "dgx_ollama",
                "provider_kind": "ollama_openai",
                "base_url": ollama,
                "enabled": True,
                "api_key_env": None,
            },
            {
                "id": "groq_cloud",
                "provider_kind": "groq",
                "base_url": "https://api.groq.com/openai/v1",
                "enabled": bool(os.getenv("GROQ_API_KEY")),
                "api_key_env": "GROQ_API_KEY",
                "model_override": os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile"),
            },
            {
                "id": "anthropic_cloud",
                "provider_kind": "anthropic",
                "base_url": "https://api.anthropic.com/v1",
                "enabled": bool(os.getenv("ANTHROPIC_API_KEY")),
                "api_key_env": "ANTHROPIC_API_KEY",
                "model_override": os.getenv(
                    "ANTHROPIC_MODEL", "claude-sonnet-4-20250514"
                ),
            },
        ],
        "tier_fallback": {
            "lite": ["dgx_ollama", "groq_cloud", "anthropic_cloud"],
            "standard": ["dgx_ollama", "groq_cloud", "anthropic_cloud"],
            "heavy": ["dgx_ollama", "anthropic_cloud", "groq_cloud"],
        },
    }


def load_registry() -> dict[str, Any]:
    path = Path(os.getenv("MCP_HUB_LLM_REGISTRY_JSON", str(_DEFAULT_REGISTRY_FILE)))
    if path.is_file():
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
            eps = data.get("endpoints")
            if isinstance(eps, list) and len(eps) > 0:
                return data
        except json.JSONDecodeError as exc:
            logger.warning("Invalid LLM registry JSON — using builtin: %s", exc)
    return _builtin_registry()


def resolve_routes(
    agent_name: str,
    model_tier: str,
    ollama_preset: str | None,
    mode: str,
) -> list[dict[str, Any]]:
    """Return ordered route dicts for Express llm-client hub cache."""
    del agent_name  # reserved for per-agent overrides in registry v2
    _ = mode
    reg = load_registry()
    tier = (model_tier or "standard").lower()
    order = reg.get("tier_fallback", {}).get(tier)
    if not order:
        order = ["dgx_ollama", "groq_cloud", "anthropic_cloud"]

    eps = {e["id"]: e for e in reg.get("endpoints", [])}
    routes: list[dict[str, Any]] = []

    for eid in order:
        ep = eps.get(eid)
        if not ep or not ep.get("enabled", True):
            continue
        pk = ep["provider_kind"].lower()
        base_url = ep.get("base_url") or ""
        model: str | None = ep.get("model_override")

        if pk in ("ollama_openai", "ollama-local", "ollama"):
            base_url = base_url or _ollama_host()
            model = model or _ollama_model_for_tier(tier, ollama_preset)
        elif model is None:
            mdl = ep.get("models")
            model = mdl.get(tier) if isinstance(mdl, dict) else None
        if not model:
            continue

        routes.append(
            {
                "provider_kind": ep["provider_kind"],
                "base_url": base_url,
                "model": model,
                "api_key_env": ep.get("api_key_env"),
                "endpoint_id": eid,
            }
        )

    return routes


def redact_endpoints_for_list(registry: dict[str, Any]) -> list[dict[str, Any]]:
    out = []
    for ep in registry.get("endpoints", []):
        out.append(
            {
                "id": ep.get("id"),
                "provider_kind": ep.get("provider_kind"),
                "base_url": ep.get("base_url"),
                "enabled": ep.get("enabled", True),
                "api_key_env": ep.get("api_key_env"),
            }
        )
    return out


async def probe_openai_compatible(base_url: str, timeout: float = 5.0) -> dict[str, Any]:
    """GET /v1/models against Ollama OpenAI shim or compatible servers."""
    root = _strip_slash(base_url)
    if not root.endswith("/v1"):
        probe_url = f"{root}/v1/models"
    else:
        probe_url = f"{root}/models"
    try:
        async with httpx.AsyncClient(timeout=timeout) as client:
            r = await client.get(probe_url)
            body: Any
            try:
                body = r.json()
            except Exception:
                body = r.text[:500]
            return {"ok": r.status_code < 400, "status": r.status_code, "body_preview": body}
    except Exception as exc:
        return {"ok": False, "error": str(exc)}
