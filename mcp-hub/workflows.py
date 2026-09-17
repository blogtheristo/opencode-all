"""
Workflow orchestration for MCP Hub.
Supports fan-out, sequential, pipeline, and reflection patterns.
"""

import asyncio
import httpx
from datetime import datetime
from typing import Any

from .routing import AgentTask, execute_task_async, _validate_agent_endpoint


class WorkflowRequest:
    def __init__(
        self,
        workflow_type: str,
        tasks: list[AgentTask],
        metadata: dict[str, Any] | None = None,
    ):
        self.workflow_type = workflow_type
        self.tasks = tasks
        self.metadata = metadata or {}


class PipelineStage:
    def __init__(self, tasks: list[AgentTask]):
        self.tasks = tasks


class PipelineRequest:
    def __init__(self, stages: list[PipelineStage], metadata: dict[str, Any] | None = None):
        self.stages = stages
        self.metadata = metadata or {}


async def execute_fan_out_workflow(workflow: WorkflowRequest) -> dict[str, Any]:
    """Fan-out: execute tasks in parallel, aggregate results."""
    if workflow.workflow_type != "fan-out":
        raise ValueError("Invalid workflow type")

    for t in workflow.tasks:
        _validate_agent_endpoint(t)

    async with httpx.AsyncClient(timeout=300.0) as client:
        coros = [execute_task_async(client, t) for t in workflow.tasks]
        results = await asyncio.gather(*coros, return_exceptions=True)

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


async def execute_sequential_workflow(workflow: WorkflowRequest) -> dict[str, Any]:
    """Sequential: execute tasks one by one, passing each result as context to the next."""
    if workflow.workflow_type != "sequential":
        raise ValueError("Invalid workflow type")

    for t in workflow.tasks:
        _validate_agent_endpoint(t)

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


async def execute_pipeline_workflow(pipeline: PipelineRequest) -> dict[str, Any]:
    """Staged pipeline: parallel within each stage, sequential between stages."""
    for stage in pipeline.stages:
        for t in stage.tasks:
            _validate_agent_endpoint(t)

    stage_results: list[dict[str, Any]] = []
    prev_stage_output: list[dict[str, Any]] | None = None

    async with httpx.AsyncClient(timeout=300.0) as client:
        for idx, stage in enumerate(pipeline.stages):
            if prev_stage_output:
                for task in stage.tasks:
                    task.context = {
                        **(task.context or {}),
                        "previous_stage_results": prev_stage_output,
                    }

            coros = [execute_task_async(client, t) for t in stage.tasks]
            results = await asyncio.gather(*coros, return_exceptions=True)

            clean = []
            for r in results:
                if isinstance(r, Exception):
                    clean.append({"status": "error", "error": str(r)})
                else:
                    clean.append(r)

            stage_results.append(
                {
                    "stage": idx + 1,
                    "tasks_count": len(stage.tasks),
                    "results": clean,
                }
            )
            prev_stage_output = clean

    return {
        "workflow_id": f"pipeline_{datetime.now().timestamp()}",
        "workflow_type": "pipeline",
        "stages_count": len(pipeline.stages),
        "stage_results": stage_results,
        "completed_at": datetime.now().isoformat(),
    }


async def execute_reflection_workflow(workflow: WorkflowRequest) -> dict[str, Any]:
    """Reflection: iterative implementation + evaluation loop."""
    if workflow.workflow_type != "reflection":
        raise ValueError("Invalid workflow type")
    if not workflow.tasks:
        raise ValueError(
            "Reflection workflow requires at least 1 task (implementation). "
            "An optional 2nd task specifies the evaluation agent."
        )

    for t in workflow.tasks:
        _validate_agent_endpoint(t)

    max_iterations = workflow.metadata.get("max_iterations", 3)
    threshold = workflow.metadata.get("threshold", 0.85)
    implementation_task = workflow.tasks[0]
    evaluation_criteria = workflow.metadata.get("criteria", [])

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

        iterations.append(
            {"iteration": i + 1, "implementation": impl, "evaluation": evaluation}
        )

        eval_body = evaluation.get("result", {})
        if isinstance(eval_body, dict):
            score = eval_body.get("score", evaluation.get("score", 0.0))
            feedback = eval_body.get("feedback", evaluation.get("feedback", []))
        else:
            score = evaluation.get("score", 0.0)
            feedback = evaluation.get("feedback", [])

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
            "feedback": feedback,
        }

    return {
        "workflow_id": f"reflection_{datetime.now().timestamp()}",
        "workflow_type": "reflection",
        "iterations_executed": len(iterations),
        "final_score": final_score,
        "results": iterations,
        "completed_at": datetime.now().isoformat(),
    }