"""
DWS IQ 6 MCP Coordination Hub
Central orchestration server for multi-agent development workflow.

Modular architecture:
- routing.py: Agent task routing to MCP servers
- workflows.py: Fan-out, sequential, pipeline, reflection workflows
- llm_mesh.py: Federated LLM endpoint registry + resolve logic
- observability.py: Logging, Redis streams, Supabase logging
- pipelines/bim_carbon.py: Domain-specific BIM-Carbon pipeline
- review.py: Gemini code review (HIL automation)
- sandbox.py: OpenSandbox MCP endpoints
"""

import os
import sys
from datetime import datetime
from typing import Any

# Security: Initialize ZenFree before any other code
for _candidate in [
    os.path.join(os.path.dirname(__file__), ".."),
    os.path.dirname(__file__),
]:
    if os.path.isfile(os.path.join(_candidate, "zen_free.py")):
        sys.path.insert(0, os.path.abspath(_candidate))
        break

try:
    import zen_free

    zen_free.protect()
    _zenfree_ok = True
except ImportError:
    _zenfree_ok = False
except Exception as _zf_err:
    _zenfree_ok = False
    logging.getLogger(__name__).warning(
        "ZenFree imported but protect() failed — running unprotected: %s", _zf_err
    )

import logging

import httpx
from fastapi import (
    BackgroundTasks,
    Depends,
    FastAPI,
    HTTPException,
    Request,
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel

from . import llm_mesh
from . import observability
from . import pipelines
from . import review
from . import sandbox
from . import workflows
from .routing import AgentTask, MCP_SERVERS, execute_task_async, _validate_agent_endpoint

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
if _zenfree_ok:
    logger.info("ZenFree runtime protection initialized")
else:
    logger.warning("ZenFree not available — running without runtime protection")

# ---------------------------------------------------------------------------
# API Key Authentication
# ---------------------------------------------------------------------------
MCP_HUB_API_KEY: str = os.getenv("MCP_HUB_API_KEY", "")
_bearer_scheme = HTTPBearer(auto_error=False)

_AUTH_EXEMPT_PATHS: set[str] = {
    "/", "/health", "/docs", "/openapi.json", "/redoc"
}


async def require_api_key(
    request: Request,
    credentials: HTTPAuthorizationCredentials | None = Depends(_bearer_scheme),
) -> None:
    """Reject requests without a valid API key when MCP_HUB_API_KEY is set."""
    if request.url.path in _AUTH_EXEMPT_PATHS:
        return
    if not MCP_HUB_API_KEY:
        return
    if credentials is None or credentials.credentials != MCP_HUB_API_KEY:
        raise HTTPException(status_code=401, detail="Invalid or missing API key")


# ---------------------------------------------------------------------------
# FastAPI App
# ---------------------------------------------------------------------------
app = FastAPI(
    title="DWS MCP Coordination Hub",
    description="Multi-agent orchestration for DWS IQ 6 development",
    version="2.1.0",
    dependencies=[Depends(require_api_key)],
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv(
        "CORS_ALLOWED_ORIGINS",
        "http://localhost:3000,http://localhost:3002,https://dws10.com,https://onelifetime.world",
    ).split(","),
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-Request-ID"],
)

# ---------------------------------------------------------------------------
# Startup / Shutdown
# ---------------------------------------------------------------------------


@app.on_event("startup")
async def startup():
    """Initialize optional Redis + Supabase connections."""
    if not MCP_HUB_API_KEY:
        logger.warning(
            "MCP_HUB_API_KEY is not set — all endpoints are publicly accessible. "
            "Set MCP_HUB_API_KEY in environment to enable authentication."
        )

    # Initialize observability (Redis + Supabase + fallback log sweep)
    await observability.init_redis()
    await observability.init_supabase()

    # Sweep buffered JSONL logs from previous crash / restart
    if observability._supabase or observability._redis:
        try:
            result = await observability.sweep_fallback_logs()
            if result.get("swept", 0) > 0:
                logger.info(
                    "🧹 Startup sweep: pushed %d buffered log(s)", result["swept"]
                )
        except Exception as exc:
            logger.warning("⚠️  Startup sweep failed: %s", exc)


@app.on_event("shutdown")
async def shutdown():
    await observability.shutdown()
    logger.info("MCP Hub shutdown complete")


# ---------------------------------------------------------------------------
# Health / Info
# ---------------------------------------------------------------------------


@app.get("/")
async def root():
    return {
        "service": "DWS MCP Coordination Hub",
        "version": "2.1.0",
        "status": "operational",
        "services": list(MCP_SERVERS.keys()),
        "integrations": {
            "redis": observability._redis is not None,
            "supabase": observability._supabase is not None,
            "zenfree": _zenfree_ok,
        },
        "timestamp": datetime.now().isoformat(),
    }


@app.get("/health")
async def health_check():
    health: dict[str, Any] = {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "services": {},
        "integrations": {},
    }

    async with httpx.AsyncClient(timeout=3.0) as client:
        for name, url in MCP_SERVERS.items():
            if not url:
                continue
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

    if observability._redis:
        try:
            await observability._redis.ping()
            health["integrations"]["redis"] = "healthy"
        except Exception:
            health["integrations"]["redis"] = "unhealthy"
    else:
        health["integrations"]["redis"] = "not_configured"

    health["integrations"]["supabase"] = (
        "healthy" if observability._supabase else "not_configured"
    )

    svc_healthy = sum(
        1 for s in health["services"].values() if s["status"] == "healthy"
    )
    total = len(health["services"])
    if svc_healthy == total:
        health["status"] = "healthy"
    elif svc_healthy > 0:
        health["status"] = "degraded"
    else:
        health["status"] = "isolated"

    return health


# ---------------------------------------------------------------------------
# Agent Task Endpoint
# ---------------------------------------------------------------------------


class AgentTaskRequest(BaseModel):
    agent: str
    task: str
    endpoint: str | None = None
    method: str = "POST"
    context: dict[str, Any] | None = None
    priority: str = "normal"
    model_tier: str | None = None
    ollama_preset: str | None = None


@app.post("/agent/task")
async def api_execute_agent_task(task: AgentTaskRequest, background_tasks: BackgroundTasks):
    """Execute a single agent task."""
    # Convert to internal AgentTask
    internal_task = AgentTask(
        agent=task.agent,
        task=task.task,
        endpoint=task.endpoint,
        method=task.method,
        context=task.context,
        priority=task.priority,
        model_tier=task.model_tier,
        ollama_preset=task.ollama_preset,
    )

    _validate_agent_endpoint(internal_task)
    result = await execute_task_async(None, internal_task)

    background_tasks.add_task(
        observability.log_agent_activity,
        agent_name=task.agent,
        task_desc=task.task,
        status=result.get("status", "unknown"),
        metadata={"result_summary": str(result.get("result", ""))[:500]},
    )

    if observability._redis:
        background_tasks.add_task(_push_result_to_stream, task.agent, result)

    return {
        "task_id": f"{task.agent}_{datetime.now().timestamp()}",
        "agent": task.agent,
        "status": result.get("status", "unknown"),
        "priority": task.priority,
        "result": result,
        "timestamp": datetime.now().isoformat(),
    }


async def _push_result_to_stream(agent: str, result: dict[str, Any]) -> None:
    if not observability._redis:
        return
    try:
        await observability._redis.xadd(
            observability.STREAM_AGENT_RESULTS,
            {
                "agent": agent,
                "task": str(result.get("task", ""))[:200],
                "status": result.get("status", "unknown"),
                "timestamp": datetime.now().isoformat(),
            },
        )
    except Exception as exc:
        logger.warning("Failed to push result to stream: %s", exc)


# ---------------------------------------------------------------------------
# Workflow Endpoints
# ---------------------------------------------------------------------------


class WorkflowRequest(BaseModel):
    workflow_type: str
    tasks: list[AgentTaskRequest]
    metadata: dict[str, Any] | None = None


class PipelineStageRequest(BaseModel):
    tasks: list[AgentTaskRequest]


class PipelineRequest(BaseModel):
    stages: list[PipelineStageRequest]
    metadata: dict[str, Any] | None = None


@app.post("/workflow/fan-out")
async def execute_fan_out_workflow(workflow: WorkflowRequest):
    """Fan-out: execute tasks in parallel, aggregate results."""
    internal_tasks = [
        AgentTask(
            agent=t.agent,
            task=t.task,
            endpoint=t.endpoint,
            method=t.method,
            context=t.context,
            priority=t.priority,
            model_tier=t.model_tier,
            ollama_preset=t.ollama_preset,
        )
        for t in workflow.tasks
    ]
    wf = workflows.WorkflowRequest(
        workflow_type=workflow.workflow_type,
        tasks=internal_tasks,
        metadata=workflow.metadata,
    )
    return await workflows.execute_fan_out_workflow(wf)


@app.post("/workflow/sequential")
async def execute_sequential_workflow(workflow: WorkflowRequest):
    """Sequential: execute tasks one by one."""
    internal_tasks = [
        AgentTask(
            agent=t.agent,
            task=t.task,
            endpoint=t.endpoint,
            method=t.method,
            context=t.context,
            priority=t.priority,
            model_tier=t.model_tier,
            ollama_preset=t.ollama_preset,
        )
        for t in workflow.tasks
    ]
    wf = workflows.WorkflowRequest(
        workflow_type=workflow.workflow_type,
        tasks=internal_tasks,
        metadata=workflow.metadata,
    )
    return await workflows.execute_sequential_workflow(wf)


@app.post("/workflow/pipeline")
async def execute_pipeline_workflow(pipeline: PipelineRequest):
    """Staged pipeline: parallel within each stage, sequential between stages."""
    internal_stages = [
        workflows.PipelineStage(
            tasks=[
                AgentTask(
                    agent=t.agent,
                    task=t.task,
                    endpoint=t.endpoint,
                    method=t.method,
                    context=t.context,
                    priority=t.priority,
                    model_tier=t.model_tier,
                    ollama_preset=t.ollama_preset,
                )
                for t in stage.tasks
            ]
        )
        for stage in pipeline.stages
    ]
    pr = workflows.PipelineRequest(
        stages=internal_stages,
        metadata=pipeline.metadata,
    )
    return await workflows.execute_pipeline_workflow(pr)


@app.post("/workflow/reflection")
async def execute_reflection_workflow(workflow: WorkflowRequest):
    """Reflection: iterative implementation + evaluation loop."""
    internal_tasks = [
        AgentTask(
            agent=t.agent,
            task=t.task,
            endpoint=t.endpoint,
            method=t.method,
            context=t.context,
            priority=t.priority,
            model_tier=t.model_tier,
            ollama_preset=t.ollama_preset,
        )
        for t in workflow.tasks
    ]
    wf = workflows.WorkflowRequest(
        workflow_type=workflow.workflow_type,
        tasks=internal_tasks,
        metadata=workflow.metadata,
    )
    return await workflows.execute_reflection_workflow(wf)


# ---------------------------------------------------------------------------
# LLM Mesh Endpoints
# ---------------------------------------------------------------------------


@app.get("/llm/endpoints")
async def llm_list_endpoints():
    """List configured LLM endpoint IDs (secrets via api_key_env only)."""
    reg = llm_mesh.load_registry()
    return {
        "endpoints": llm_mesh.redact_endpoints_for_list(reg),
        "tier_fallback": reg.get("tier_fallback", {}),
        "timestamp": datetime.now().isoformat(),
    }


@app.post("/llm/resolve")
async def llm_resolve(body: llm_mesh.LLMResolveRequest):
    """Ordered routes for an agent + tier."""
    routes = llm_mesh.resolve_routes(
        body.agent_name,
        body.model_tier,
        body.ollama_preset,
        body.mode,
    )
    return {"routes": routes, "timestamp": datetime.now().isoformat()}


@app.post("/llm/probe")
async def llm_probe(body: llm_mesh.LLMProbeRequest):
    """Reachability check for OpenAI-compatible /v1/models."""
    result = await llm_mesh.probe_openai_compatible(body.base_url)
    return {"target": body.base_url, **result, "timestamp": datetime.now().isoformat()}


# ---------------------------------------------------------------------------
# Redis Stream Endpoints
# ---------------------------------------------------------------------------


@app.post("/stream/publish")
async def publish_to_stream(
    stream: str = observability.STREAM_AGENT_TASKS,
    message: dict[str, Any] | None = None,
):
    return await observability.publish_to_stream(stream, message)


@app.get("/stream/read")
async def read_from_stream(
    stream: str = observability.STREAM_AGENT_RESULTS,
    count: int = 10,
):
    return await observability.read_from_stream(stream, count)


@app.get("/stream/info")
async def stream_info():
    return await observability.stream_info()


# ---------------------------------------------------------------------------
# Log Sweep
# ---------------------------------------------------------------------------


@app.post("/logs/sweep")
async def sweep_fallback_logs():
    return await observability.sweep_fallback_logs()


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
            return {
                "backend_status": resp.status_code,
                "body": resp.json() if resp.status_code < 400 else resp.text[:200],
            }
    except Exception as e:
        return {"backend_status": "unreachable", "error": str(e)[:200]}


@app.get("/backend/auth/status")
async def backend_auth_status():
    url = MCP_SERVERS["backend"]
    routes = ["register", "login", "verify-email", "refresh", "forgot-password"]
    return {
        "auth_base": f"{url}/api/auth",
        "routes": routes,
        "note": "POST to each route via the backend directly; this is an info endpoint",
    }


# ---------------------------------------------------------------------------
# BIM-Carbon Pipeline
# ---------------------------------------------------------------------------


@app.post("/pipelines/bim-carbon")
async def execute_bim_carbon_pipeline(req: pipelines.BIMPipelineRequest):
    return await pipelines.execute_bim_carbon_pipeline(req)


# ---------------------------------------------------------------------------
# Gemini Code Review
# ---------------------------------------------------------------------------


@app.post("/gemini/review")
async def gemini_code_review(req: review.GeminiReviewRequest):
    return await review.gemini_code_review(req)


# ---------------------------------------------------------------------------
# OpenSandbox MCP Endpoints
# ---------------------------------------------------------------------------


@app.get("/sandbox/ping")
async def mcp_sandbox_ping():
    return await sandbox.mcp_sandbox_ping()


@app.post("/sandbox/create")
async def mcp_sandbox_create(req: sandbox.SandboxCreateRequest):
    return await sandbox.mcp_sandbox_create(req)


@app.post("/sandbox/execute")
async def mcp_sandbox_execute(req: sandbox.SandboxExecuteRequest):
    return await sandbox.mcp_sandbox_execute(req)


@app.post("/sandbox/file/read")
async def mcp_sandbox_file_read(req: sandbox.SandboxFileReadRequest):
    return await sandbox.mcp_sandbox_file_read(req)


@app.post("/sandbox/file/write")
async def mcp_sandbox_file_write(req: sandbox.SandboxFileWriteRequest):
    return await sandbox.mcp_sandbox_file_write(req)


@app.post("/sandbox/destroy")
async def mcp_sandbox_destroy(req: sandbox.SandboxDestroyRequest):
    return await sandbox.mcp_sandbox_destroy(req)


@app.get("/sandbox/tools")
async def mcp_sandbox_tools_list():
    return await sandbox.mcp_sandbox_tools_list()


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", "8765"))
    logger.info("Starting MCP Hub v2.1.0 on port %d", port)
    uvicorn.run(app, host="0.0.0.0", port=port)