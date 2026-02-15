"""
DWS IQ 6 MCP Coordination Hub
Central orchestration server for multi-agent development workflow
Coordinates Cursor AI, Claude Code, and Gemini Pro via MCP

Protected by ZenFree - Free Runtime Application Firewall
"""

import asyncio
import logging
import os
import sys
from datetime import datetime
from typing import Any

# Security: Initialize ZenFree before any other code
# zen_free.py lives at repo root; add parent dir to path if needed
for _candidate in [os.path.join(os.path.dirname(__file__), ".."), os.path.dirname(__file__)]:
    if os.path.isfile(os.path.join(_candidate, "zen_free.py")):
        sys.path.insert(0, os.path.abspath(_candidate))
        break

try:
    import zen_free
    zen_free.protect()
    _zenfree_ok = True
except ImportError:
    _zenfree_ok = False

import httpx
from fastapi import BackgroundTasks, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
if _zenfree_ok:
    logger.info("🔒 ZenFree runtime protection initialized")
else:
    logger.warning("⚠️  ZenFree not available — running without runtime protection")

app = FastAPI(
    title="DWS MCP Coordination Hub",
    description="Multi-agent orchestration for DWS IQ 6 development",
    version="2.0.0",
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv(
        "CORS_ALLOWED_ORIGINS",
        "http://localhost:3000,http://localhost:3002,https://dws10.com,https://onelifetime.world",
    ).split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Service Registry
# ---------------------------------------------------------------------------
# All services on the dws-hybrid-network.  When running inside Docker the
# container hostnames resolve; when running on the host use localhost + mapped
# ports from docker-compose.hybrid.yml.

MCP_SERVERS: dict[str, str] = {
    "github": os.getenv("GITHUB_MCP_URL", "http://localhost:8767"),
    # "gemini": os.getenv("GEMINI_MCP_URL", "http://localhost:8768"),  # Not used at this stage
    "supabase-mcp": os.getenv("SUPABASE_MCP_URL", "http://mcp-supabase:8766"),
    "backend": os.getenv("BACKEND_URL", "http://localhost:3002"),
    "prometheus": os.getenv("PROMETHEUS_URL", "http://localhost:9091"),
    "grafana": os.getenv("GRAFANA_URL", "http://localhost:3001"),
    "agent-foundry": os.getenv("AGENT_FOUNDRY_URL", "http://localhost:8082"),
}

# Redis URL — the compose redis service maps 6380:6379 on the host
REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6380")

# Supabase direct connection (bypass MCP server)
SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
SUPABASE_SERVICE_KEY: str = os.getenv("SUPABASE_SERVICE_KEY", "")

# ---------------------------------------------------------------------------
# Optional integrations — initialised at startup, graceful when unavailable
# ---------------------------------------------------------------------------
_redis: Any = None  # redis.asyncio.Redis instance or None
_supabase: Any = None  # supabase.AsyncClient or None


# ---------------------------------------------------------------------------
# Models
# ---------------------------------------------------------------------------


class AgentTask(BaseModel):
    agent: str  # github, backend, agent-foundry, claude-code, cursor
    task: str
    endpoint: str | None = None  # optional explicit endpoint path
    method: str = "POST"  # HTTP method
    context: dict[str, Any] | None = None
    priority: str = "normal"  # low, normal, high, critical


class WorkflowRequest(BaseModel):
    workflow_type: str  # fan-out, reflection, sequential
    tasks: list[AgentTask]
    metadata: dict[str, Any] | None = None


# ---------------------------------------------------------------------------
# Startup / Shutdown
# ---------------------------------------------------------------------------


@app.on_event("startup")
async def startup():
    """Initialise optional Redis + Supabase connections.

    Both are non-critical — the hub runs in degraded mode without them.
    """
    global _redis, _supabase

    # --- Redis ---
    try:
        import redis.asyncio as aioredis

        _redis = aioredis.from_url(
            REDIS_URL,
            decode_responses=True,
            socket_connect_timeout=3,
        )
        await _redis.ping()
        logger.info("✅ Redis connected (%s)", REDIS_URL)
    except Exception as exc:
        _redis = None
        logger.warning("⚠️  Redis unavailable — streams disabled (%s)", exc)

    # --- Supabase ---
    if SUPABASE_URL and SUPABASE_SERVICE_KEY:
        try:
            from supabase._async.client import AsyncClient, create_async_client

            _supabase = await create_async_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
            logger.info("✅ Supabase connected (%s)", SUPABASE_URL[:40])
        except Exception as exc:
            _supabase = None
            logger.warning("⚠️  Supabase unavailable — direct logging disabled (%s)", exc)
    else:
        logger.info("ℹ️  Supabase env vars not set — direct logging disabled")


@app.on_event("shutdown")
async def shutdown():
    global _redis, _supabase
    if _redis:
        await _redis.aclose()
        _redis = None
    _supabase = None
    logger.info("MCP Hub shutdown complete")


# ---------------------------------------------------------------------------
# Health / Info
# ---------------------------------------------------------------------------


@app.get("/")
async def root():
    """Root endpoint with service information"""
    return {
        "service": "DWS MCP Coordination Hub",
        "version": "2.0.0",
        "status": "operational",
        "services": list(MCP_SERVERS.keys()),
        "integrations": {
            "redis": _redis is not None,
            "supabase": _supabase is not None,
            "zenfree": _zenfree_ok,
        },
        "timestamp": datetime.now().isoformat(),
    }


@app.get("/health")
async def health_check():
    """Health check with service status.

    Always returns 200 so Docker healthcheck passes even when dependencies
    are unavailable (graceful degradation).
    """
    health: dict[str, Any] = {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "services": {},
        "integrations": {},
    }

    # Probe each registered service
    async with httpx.AsyncClient(timeout=3.0) as client:
        for name, url in MCP_SERVERS.items():
            try:
                resp = await client.get(f"{url}/health", timeout=3.0)
                health["services"][name] = {
                    "status": "healthy" if resp.status_code < 400 else "unhealthy",
                    "url": url,
                }
            except Exception as e:
                health["services"][name] = {
                    "status": "unreachable",
                    "error": str(e)[:100],
                    "url": url,
                }

    # Redis
    if _redis:
        try:
            await _redis.ping()
            health["integrations"]["redis"] = "healthy"
        except Exception:
            health["integrations"]["redis"] = "unhealthy"
    else:
        health["integrations"]["redis"] = "not_configured"

    # Supabase
    health["integrations"]["supabase"] = "healthy" if _supabase else "not_configured"

    # Aggregate
    svc_healthy = sum(1 for s in health["services"].values() if s["status"] == "healthy")
    total = len(health["services"])
    if svc_healthy == total:
        health["status"] = "healthy"
    elif svc_healthy > 0:
        health["status"] = "degraded"
    else:
        health["status"] = "isolated"

    return health


# ---------------------------------------------------------------------------
# Real Agent Routing
# ---------------------------------------------------------------------------


async def execute_task_async(
    client: httpx.AsyncClient | None, task: AgentTask
) -> dict[str, Any]:
    """Route a task to the appropriate service over HTTP.

    Resolution order:
    1. If task.endpoint is set, use it as-is (absolute URL).
    2. Else look up task.agent in MCP_SERVERS and POST to /agent/task.
    3. If the service is unknown, return an error dict instead of raising.

    A shared client is used when provided (fan-out); otherwise a new one is
    created per call (reflection / sequential workflows pass None).
    """
    base_url = MCP_SERVERS.get(task.agent)
    if not base_url and not task.endpoint:
        return {
            "agent": task.agent,
            "status": "error",
            "error": f"Unknown agent '{task.agent}' — not in MCP_SERVERS registry",
            "timestamp": datetime.now().isoformat(),
        }

    url = task.endpoint or f"{base_url}/agent/task"
    payload = {
        "agent": task.agent,
        "task": task.task,
        "context": task.context or {},
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
        else:
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


# ---------------------------------------------------------------------------
# Redis Streams
# ---------------------------------------------------------------------------

STREAM_AGENT_TASKS = "agent:tasks"
STREAM_AGENT_RESULTS = "agent:results"
CONSUMER_GROUP = "mcp-hub-workers"


async def _ensure_streams():
    """Create consumer groups if they don't already exist."""
    if not _redis:
        return
    for stream in [STREAM_AGENT_TASKS, STREAM_AGENT_RESULTS]:
        try:
            await _redis.xgroup_create(stream, CONSUMER_GROUP, id="0", mkstream=True)
        except Exception:
            pass  # group already exists


@app.post("/stream/publish")
async def publish_to_stream(
    stream: str = STREAM_AGENT_TASKS,
    message: dict[str, Any] = {},
):
    """Publish a message to a Redis Stream.

    Used to enqueue agent tasks or results for async processing.
    """
    if not _redis:
        raise HTTPException(status_code=503, detail="Redis not available")

    await _ensure_streams()
    # Redis XADD: all values must be strings
    flat = {k: str(v) if not isinstance(v, str) else v for k, v in message.items()}
    msg_id = await _redis.xadd(stream, flat)
    return {"stream": stream, "message_id": msg_id}


@app.get("/stream/read")
async def read_from_stream(
    stream: str = STREAM_AGENT_RESULTS,
    count: int = 10,
):
    """Read the latest messages from a Redis Stream (non-blocking peek)."""
    if not _redis:
        raise HTTPException(status_code=503, detail="Redis not available")

    messages = await _redis.xrevrange(stream, count=count)
    return {
        "stream": stream,
        "count": len(messages),
        "messages": [{"id": mid, "data": data} for mid, data in messages],
    }


@app.get("/stream/info")
async def stream_info():
    """Return length / consumer-group info for known streams."""
    if not _redis:
        return {"status": "redis_unavailable"}

    info: dict[str, Any] = {}
    for stream in [STREAM_AGENT_TASKS, STREAM_AGENT_RESULTS, "email:outbox", "email:inbox"]:
        try:
            length = await _redis.xlen(stream)
            info[stream] = {"length": length}
        except Exception:
            info[stream] = {"length": 0, "note": "stream does not exist yet"}
    return info


# ---------------------------------------------------------------------------
# Supabase Direct Logging
# ---------------------------------------------------------------------------


async def log_agent_activity(
    agent_name: str,
    task_desc: str,
    status: str,
    metadata: dict[str, Any] | None = None,
):
    """Log agent activity.

    Writes to Supabase `agent_activity` table when available, falls back to
    Redis stream `agent:results`, and finally to stderr if both are down.
    """
    record = {
        "agent_name": agent_name,
        "task": task_desc,
        "status": status,
        "metadata": metadata or {"source": "mcp-hub"},
        "created_at": datetime.now().isoformat(),
    }

    # 1. Supabase direct
    if _supabase:
        try:
            await _supabase.table("agent_activity").insert(record).execute()
            return
        except Exception as exc:
            logger.warning("Supabase log failed: %s", exc)

    # 2. Redis stream fallback
    if _redis:
        try:
            flat = {k: str(v) for k, v in record.items()}
            await _redis.xadd(STREAM_AGENT_RESULTS, flat)
            return
        except Exception as exc:
            logger.warning("Redis log failed: %s", exc)

    # 3. Stderr fallback
    logger.info("[ACTIVITY] %s | %s | %s", agent_name, status, task_desc)


# ---------------------------------------------------------------------------
# Agent Task Endpoint
# ---------------------------------------------------------------------------


@app.post("/agent/task")
async def api_execute_agent_task(task: AgentTask, background_tasks: BackgroundTasks):
    """Execute a single agent task.

    Routes to the real container via httpx, logs to Supabase/Redis in background.
    """
    result = await execute_task_async(None, task)

    background_tasks.add_task(
        log_agent_activity,
        agent_name=task.agent,
        task_desc=task.task,
        status=result.get("status", "unknown"),
        metadata={"result_summary": str(result.get("result", ""))[:500]},
    )

    # Also push to Redis stream if available
    if _redis:
        background_tasks.add_task(_push_result_to_stream, task, result)

    return {
        "task_id": f"{task.agent}_{datetime.now().timestamp()}",
        "agent": task.agent,
        "status": result.get("status", "unknown"),
        "priority": task.priority,
        "result": result,
        "timestamp": datetime.now().isoformat(),
    }


async def _push_result_to_stream(task: AgentTask, result: dict[str, Any]):
    """Fire-and-forget push of task result to Redis stream."""
    if not _redis:
        return
    try:
        await _redis.xadd(
            STREAM_AGENT_RESULTS,
            {
                "agent": task.agent,
                "task": task.task[:200],
                "status": result.get("status", "unknown"),
                "timestamp": datetime.now().isoformat(),
            },
        )
    except Exception as exc:
        logger.warning("Failed to push result to stream: %s", exc)


# ---------------------------------------------------------------------------
# Workflow Endpoints
# ---------------------------------------------------------------------------


@app.post("/workflow/fan-out")
async def execute_fan_out_workflow(workflow: WorkflowRequest):
    """Fan-out: execute tasks in parallel, aggregate results."""
    if workflow.workflow_type != "fan-out":
        raise HTTPException(status_code=400, detail="Invalid workflow type")

    async with httpx.AsyncClient(timeout=300.0) as client:
        coros = [execute_task_async(client, t) for t in workflow.tasks]
        results = await asyncio.gather(*coros, return_exceptions=True)

    # Serialise exceptions
    clean_results = []
    for r in results:
        if isinstance(r, Exception):
            clean_results.append({"status": "error", "error": str(r)})
        else:
            clean_results.append(r)

    return {
        "workflow_id": f"fanout_{datetime.now().timestamp()}",
        "workflow_type": "fan-out",
        "tasks_count": len(workflow.tasks),
        "results": clean_results,
        "completed_at": datetime.now().isoformat(),
    }


@app.post("/workflow/sequential")
async def execute_sequential_workflow(workflow: WorkflowRequest):
    """Sequential: execute tasks one by one, passing each result as context to the next."""
    if workflow.workflow_type != "sequential":
        raise HTTPException(status_code=400, detail="Invalid workflow type")

    results: list[dict[str, Any]] = []
    prev_result: dict[str, Any] | None = None

    for task in workflow.tasks:
        if prev_result:
            task.context = {**(task.context or {}), "previous_result": prev_result}
        result = await execute_task_async(None, task)
        results.append(result)
        prev_result = result

    return {
        "workflow_id": f"sequential_{datetime.now().timestamp()}",
        "workflow_type": "sequential",
        "tasks_count": len(workflow.tasks),
        "results": results,
        "completed_at": datetime.now().isoformat(),
    }


@app.post("/workflow/reflection")
async def execute_reflection_workflow(workflow: WorkflowRequest):
    """Reflection: iterative implementation + evaluation loop."""
    if workflow.workflow_type != "reflection":
        raise HTTPException(status_code=400, detail="Invalid workflow type")

    max_iterations = (workflow.metadata or {}).get("max_iterations", 3)
    threshold = (workflow.metadata or {}).get("threshold", 0.85)
    implementation_task = workflow.tasks[0]
    evaluation_criteria = (workflow.metadata or {}).get("criteria", [])

    iterations: list[dict[str, Any]] = []
    final_score = 0.0

    for i in range(max_iterations):
        impl = await execute_task_async(None, implementation_task)

        eval_task = AgentTask(
            agent=workflow.tasks[1].agent if len(workflow.tasks) > 1 else "backend",
            task=f"Evaluate against criteria: {evaluation_criteria}",
            context={"implementation": impl, "criteria": evaluation_criteria},
        )
        evaluation = await execute_task_async(None, eval_task)

        iterations.append({"iteration": i + 1, "implementation": impl, "evaluation": evaluation})

        score = evaluation.get("score", 0.0)
        if isinstance(score, str):
            try:
                score = float(score)
            except ValueError:
                score = 0.0
        if score >= threshold:
            final_score = score
            break

        implementation_task.context = {
            "previous_implementation": impl,
            "feedback": evaluation.get("feedback", []),
        }

    return {
        "workflow_id": f"reflection_{datetime.now().timestamp()}",
        "workflow_type": "reflection",
        "iterations_executed": len(iterations),
        "final_score": final_score,
        "results": iterations,
        "completed_at": datetime.now().isoformat(),
    }


# ---------------------------------------------------------------------------
# Backend Bridge
# ---------------------------------------------------------------------------


@app.get("/backend/health")
async def backend_health():
    """Proxy health check to the Express backend."""
    url = MCP_SERVERS["backend"]
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.get(f"{url}/health")
            return {"backend_status": resp.status_code, "body": resp.json() if resp.status_code < 400 else resp.text[:200]}
    except Exception as e:
        return {"backend_status": "unreachable", "error": str(e)[:200]}


@app.get("/backend/auth/status")
async def backend_auth_status():
    """Quick probe of the backend auth system."""
    url = MCP_SERVERS["backend"]
    routes = ["register", "login", "verify-email", "refresh", "forgot-password"]
    return {
        "auth_base": f"{url}/api/auth",
        "routes": routes,
        "note": "POST to each route via the backend directly; this is an info endpoint",
    }


# ---------------------------------------------------------------------------
# BIM-Carbon Pipeline (domain-specific sequential workflow)
# ---------------------------------------------------------------------------


@app.post("/pipelines/bim-carbon")
async def execute_bim_carbon_pipeline(project_id: str, bim_file_url: str):
    """Specialised BIM → Carbon pipeline.

    Steps route to real services where available:
    1. backend: extract IFC geometry
    2. backend: calculate embodied carbon (EN 15978)
    3. backend: validate EU Fit-for-55 compliance
    4. Log results to Supabase
    """
    workflow_id = f"bim_carbon_{project_id}_{datetime.now().timestamp()}"

    steps = [
        AgentTask(
            agent="backend",
            task=f"Extract geometry data from BIM file: {bim_file_url}",
            endpoint=f"{MCP_SERVERS['backend']}/api/bim/extract",
            context={"project_id": project_id, "file_url": bim_file_url},
        ),
        AgentTask(
            agent="backend",
            task="Calculate embodied carbon using EN 15978 methodology",
            endpoint=f"{MCP_SERVERS['backend']}/api/bim/carbon",
            context={"project_id": project_id},
        ),
        AgentTask(
            agent="backend",
            task="Validate against EU Fit for 55 compliance",
            endpoint=f"{MCP_SERVERS['backend']}/api/bim/validate",
            context={"project_id": project_id, "country": "FI"},
        ),
    ]

    results = {"workflow_id": workflow_id, "project_id": project_id, "steps": []}
    for step in steps:
        r = await execute_task_async(None, step)
        results["steps"].append({"agent": step.agent, "task": step.task, "result": r})

    # Log to Supabase
    await log_agent_activity(
        agent_name="bim-carbon-pipeline",
        task_desc=f"Complete pipeline for project {project_id}",
        status="completed",
        metadata=results,
    )

    return results


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", "8765"))
    logger.info("Starting MCP Hub v2.0.0 on port %d", port)
    uvicorn.run(app, host="0.0.0.0", port=port)
