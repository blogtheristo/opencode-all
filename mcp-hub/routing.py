"""
Agent task routing for MCP Hub.
Routes tasks to registered MCP servers.
"""

import httpx
from datetime import datetime
from typing import Any

from .llm_mesh import resolve_routes


MCP_SERVERS: dict[str, str] = {
    "github": "http://localhost:8767",
    "gemini": "http://localhost:8768",
    "carbon-api": "http://carbon-api:8766",
    "cloudrun-mcp": "http://cloudrun-mcp:8769",
    "dws-gateway": "",
    "lwm-mcp": "http://lwm-mcp:8770",
    "claude-mcp": "http://claude-mcp:8771",
    "backend": "http://localhost:3002",
    "prometheus": "http://localhost:9091",
    "grafana": "http://localhost:3001",
    "agent-foundry": "http://localhost:8082",
}


class AgentTask:
    def __init__(
        self,
        agent: str,
        task: str,
        endpoint: str | None = None,
        method: str = "POST",
        context: dict[str, Any] | None = None,
        priority: str = "normal",
        model_tier: str | None = None,
        ollama_preset: str | None = None,
    ):
        self.agent = agent
        self.task = task
        self.endpoint = endpoint
        self.method = method
        self.context = context or {}
        self.priority = priority
        self.model_tier = model_tier
        self.ollama_preset = ollama_preset


def _validate_agent_endpoint(task: AgentTask) -> None:
    """Ensure task.endpoint is within MCP_SERVERS base URLs."""
    if task.endpoint is None:
        return
    allowed_bases = [b for b in MCP_SERVERS.values() if b]
    if not any(task.endpoint.startswith(base) for base in allowed_bases):
        raise ValueError(
            f"endpoint '{task.endpoint}' is not within any registered MCP_SERVERS base URL. "
            f"Allowed prefixes: {allowed_bases}"
        )


async def execute_task_async(
    client: httpx.AsyncClient | None, task: AgentTask
) -> dict[str, Any]:
    """Route a task to the appropriate service over HTTP."""
    base_url = MCP_SERVERS.get(task.agent)
    if not base_url and not task.endpoint:
        return {
            "agent": task.agent,
            "status": "error",
            "error": f"Unknown agent '{task.agent}' — not in MCP_SERVERS registry",
            "timestamp": datetime.now().isoformat(),
        }

    url = task.endpoint or f"{base_url}/agent/task"
    ctx: dict[str, Any] = dict(task.context or {})
    if task.model_tier or task.ollama_preset:
        ctx["llm_routing"] = {
            "model_tier": task.model_tier,
            "ollama_preset": task.ollama_preset,
        }

    # Resolve LLM routes and inject if agent is backend
    if task.agent == "backend" and (task.model_tier or task.ollama_preset):
        routes = resolve_routes("", task.model_tier or "standard", task.ollama_preset, "agent")
        if routes:
            ctx["llm_routes"] = routes

    payload = {
        "agent": task.agent,
        "task": task.task,
        "context": ctx,
        "priority": task.priority,
    }

    _own_client = client is None
    if _own_client:
        client = httpx.AsyncClient(timeout=120.0)

    try:
        method = task.method.upper()
        if method == "GET":
            resp = await client.get(url, params={"task": task.task})
        else:
            resp = await client.post(url, json=payload)

        if resp.status_code < 400:
            try:
                body = resp.json()
            except Exception:
                body = resp.text
            return {
                "agent": task.agent,
                "status": "completed",
                "http_status": resp.status_code,
                "result": body,
                "timestamp": datetime.now().isoformat(),
            }
        return {
            "agent": task.agent,
            "status": "error",
            "http_status": resp.status_code,
            "error": resp.text[:500],
            "timestamp": datetime.now().isoformat(),
        }
    except httpx.TimeoutException:
        return {
            "agent": task.agent,
            "status": "timeout",
            "error": f"Request to {url} timed out",
            "timestamp": datetime.now().isoformat(),
        }
    except Exception as e:
        return {
            "agent": task.agent,
            "status": "error",
            "error": f"{type(e).__name__}: {e}",
            "timestamp": datetime.now().isoformat(),
        }
    finally:
        if _own_client:
            await client.aclose()