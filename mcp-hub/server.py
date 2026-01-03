"""
DWS IQ 6 MCP Coordination Hub
Central orchestration server for multi-agent development workflow
Coordinates Cursor AI, Claude Code, and Gemini Pro via MCP

Protected by Aikido Zen - Runtime Application Firewall
"""

import asyncio
import logging
import os
from datetime import datetime
from typing import Any

# Security: Initialize Aikido Zen before any other code
import aikido_zen
import httpx
from fastapi import BackgroundTasks, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

aikido_zen.protect()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
logger.info("🔒 Aikido Zen runtime protection initialized")

app = FastAPI(
    title="DWS MCP Coordination Hub",
    description="Multi-agent orchestration for DWS IQ 6 development",
    version="1.0.0",
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MCP Server endpoints
MCP_SERVERS = {
    "supabase": "http://mcp-supabase:8766",
    "github": os.getenv("GITHUB_MCP_URL", "http://localhost:8767"),
    "gemini": os.getenv("GEMINI_MCP_URL", "http://localhost:8768"),
}


class AgentTask(BaseModel):
    agent: str  # cursor, claude-code, gemini
    task: str
    context: dict[str, Any] | None = None
    priority: str = "normal"  # low, normal, high, critical


class WorkflowRequest(BaseModel):
    workflow_type: str  # fan-out, reflection, sequential
    tasks: list[AgentTask]
    metadata: dict[str, Any] | None = None


@app.get("/")
async def root():
    """Root endpoint with service information"""
    return {
        "service": "DWS MCP Coordination Hub",
        "version": "1.0.0",
        "status": "operational",
        "mcp_servers": list(MCP_SERVERS.keys()),
        "timestamp": datetime.now().isoformat(),
    }


@app.get("/health")
async def health_check():
    """Health check endpoint with MCP server status

    Returns 200 OK even if dependent services are unavailable (graceful degradation).
    The service can operate with reduced functionality if dependencies aren't ready.
    """
    health_status = {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "mcp_servers": {},
        "note": "Hub is operational; external services may be unavailable",
    }

    # Check each MCP server with timeout and no exception propagation
    async with httpx.AsyncClient(timeout=3.0) as client:
        for server_name, server_url in MCP_SERVERS.items():
            try:
                response = await client.get(f"{server_url}/health", timeout=3.0)
                health_status["mcp_servers"][server_name] = {
                    "status": "healthy" if response.status_code == 200 else "unhealthy",
                    "url": server_url,
                }
            except Exception as e:
                # Unavailable services don't cause overall failure
                health_status["mcp_servers"][server_name] = {
                    "status": "unreachable",
                    "error": str(e)[:100],  # Truncate error for brevity
                    "url": server_url,
                }

    # Determine overall status without failing on unavailable dependencies
    healthy_count = sum(
        1 for s in health_status["mcp_servers"].values() if s["status"] == "healthy"
    )
    total_count = len(health_status["mcp_servers"])

    if healthy_count == total_count:
        health_status["status"] = "healthy"
    elif healthy_count > 0:
        health_status["status"] = "degraded"
    else:
        health_status["status"] = "isolated"  # No external services available yet

    # Always return 200 OK so Docker healthcheck passes
    # The hub itself is operational even if dependencies aren't ready
    return health_status


@app.post("/agent/task")
async def execute_agent_task(task: AgentTask, background_tasks: BackgroundTasks):
    """
    Execute a single agent task

    Routes tasks to appropriate agents based on specialization:
    - cursor: Fast coding, rapid prototyping
    - claude-code: Complex refactoring, exploratory tasks
    - gemini: Architectural validation, deep analysis
    """
    # Log task to Supabase
    background_tasks.add_task(
        log_agent_activity, agent_name=task.agent, task_desc=task.task, status="started"
    )

    return {
        "task_id": f"{task.agent}_{datetime.now().timestamp()}",
        "agent": task.agent,
        "status": "queued",
        "priority": task.priority,
        "timestamp": datetime.now().isoformat(),
    }



@app.post("/workflow/fan-out")
async def execute_fan_out_workflow(workflow: WorkflowRequest):
    """
    Fan-out workflow pattern: Execute tasks in parallel

    Use for feature development where independent tasks can run simultaneously
    (e.g., DB schema + API routes + UI components)
    """
    if workflow.workflow_type != "fan-out":
        raise HTTPException(
            status_code=400, detail="Invalid workflow type for this endpoint"
        )

    # Execute all tasks in parallel
    results = []
    async with httpx.AsyncClient(timeout=300.0) as client:
        tasks = [execute_task_async(client, task) for task in workflow.tasks]
        results = await asyncio.gather(*tasks, return_exceptions=True)

    # Fan-in: Aggregate results
    return {
        "workflow_id": f"fanout_{datetime.now().timestamp()}",
        "workflow_type": "fan-out",
        "tasks_count": len(workflow.tasks),
        "results": results,
        "completed_at": datetime.now().isoformat(),
    }


@app.post("/workflow/reflection")
async def execute_reflection_workflow(workflow: WorkflowRequest):
    """
    Reflection workflow pattern: Iterative refinement with evaluation

    Use for quality assurance where implementation is iteratively improved
    based on evaluator feedback
    """
    if workflow.workflow_type != "reflection":
        raise HTTPException(
            status_code=400, detail="Invalid workflow type for this endpoint"
        )

    max_iterations = 3
    implementation_task = workflow.tasks[0]  # First task is implementation
    evaluation_criteria = workflow.metadata.get("criteria", [])

    results = {"iterations": [], "final_score": 0.0}

    # Reflection loop
    for iteration in range(max_iterations):
        # Execute implementation task
        impl_result = await execute_task_async(None, implementation_task)

        # Evaluate with Gemini
        eval_task = AgentTask(
            agent="gemini",
            task=f"Evaluate implementation against criteria: {evaluation_criteria}",
            context={"implementation": impl_result, "criteria": evaluation_criteria},
        )

        eval_result = await execute_task_async(None, eval_task)

        results["iterations"].append(
            {
                "iteration": iteration + 1,
                "implementation": impl_result,
                "evaluation": eval_result,
            }
        )

        # Check if score meets threshold
        score = eval_result.get("score", 0.0)
        if score >= 0.85:
            results["final_score"] = score
            break

        # Update implementation task with feedback
        implementation_task.context = {
            "previous_implementation": impl_result,
            "feedback": eval_result.get("feedback", []),
        }

    return {
        "workflow_id": f"reflection_{datetime.now().timestamp()}",
        "workflow_type": "reflection",
        "iterations_executed": len(results["iterations"]),
        "final_score": results["final_score"],
        "results": results,
        "completed_at": datetime.now().isoformat(),
    }


@app.post("/workflow/bim-carbon-pipeline")
async def execute_bim_carbon_pipeline(project_id: str, bim_file_url: str):
    """
    Specialized workflow for BIM → Carbon Calculation pipeline

    1. Cursor: Extract IFC geometry
    2. Claude Code: Calculate embodied carbon
    3. Gemini: Validate against EU compliance rules
    4. Store results in Supabase
    """
    workflow_id = f"bim_carbon_{project_id}_{datetime.now().timestamp()}"

    # Step 1: Extract BIM geometry (simulated - would call Cursor agent)
    geometry_task = AgentTask(
        agent="cursor",
        task=f"Extract geometry data from BIM file: {bim_file_url}",
        context={"project_id": project_id, "file_url": bim_file_url},
    )

    # Step 2: Calculate carbon (simulated - would call Claude Code agent)
    carbon_task = AgentTask(
        agent="claude-code",
        task="Calculate embodied carbon from BIM geometry using EN 15978 methodology",
        context={"project_id": project_id},
    )

    # Step 3: Validate compliance (simulated - would call Gemini agent)
    validation_task = AgentTask(
        agent="gemini",
        task="Validate carbon calculations against EU Fit for 55 compliance rules",
        context={"project_id": project_id, "country": "FI"},
    )

    # Execute sequential pipeline
    results = {"workflow_id": workflow_id, "project_id": project_id, "steps": []}

    # In real implementation, these would be actual agent calls
    for task in [geometry_task, carbon_task, validation_task]:
        step_result = await execute_task_async(None, task)
        results["steps"].append(
            {"agent": task.agent, "task": task.task, "result": step_result}
        )

    # Store results to Supabase
    async with httpx.AsyncClient() as client:
        await client.post(
            f"{MCP_SERVERS['supabase']}/tools/log_agent_activity",
            json={
                "agent_name": "bim-carbon-pipeline",
                "task": f"Complete pipeline for project {project_id}",
                "status": "completed",
                "metadata": results,
            },
        )

    return results


async def execute_task_async(
    client: httpx.AsyncClient | None, task: AgentTask
) -> dict[str, Any]:
    """
    Execute a single task asynchronously

    In production, this would route to actual agent implementations
    """
    # Simulated task execution
    # In real implementation, would call agent-specific endpoints
    await asyncio.sleep(0.1)  # Simulate work

    return {
        "agent": task.agent,
        "task": task.task,
        "status": "completed",
        "result": f"Task executed by {task.agent}",
        "timestamp": datetime.now().isoformat(),
    }


async def log_agent_activity(agent_name: str, task_desc: str, status: str):
    """Log agent activity to Supabase for observability

    Non-blocking background task that doesn't affect main request flow.
    Failures are logged but don't interrupt processing.
    """
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            await client.post(
                f"{MCP_SERVERS['supabase']}/tools/log_agent_activity",
                json={
                    "agent_name": agent_name,
                    "task": task_desc,
                    "status": status,
                    "metadata": {"source": "mcp-hub"},
                },
            )
    except Exception as e:
        # Gracefully handle logging failures without disrupting the hub
        import sys

        print(
            f"[WARNING] Failed to log {agent_name} activity: {type(e).__name__}",
            file=sys.stderr,
        )


if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", "8765"))
    uvicorn.run(app, host="0.0.0.0", port=port)
