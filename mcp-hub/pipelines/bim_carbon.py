"""
BIM-Carbon Pipeline for MCP Hub.
Domain-specific sequential workflow for construction carbon compliance.
"""

from datetime import datetime
from typing import Any

from pydantic import BaseModel

from .routing import AgentTask, execute_task_async
from .observability import log_agent_activity


class BIMPipelineRequest(BaseModel):
    """Schema for BIM-Carbon pipeline requests."""

    project_id: str
    bim_file_url: str
    country: str = "FI"
    callback_url: str | None = None

    @classmethod
    def _validate_project_id(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("project_id must not be empty")
        if len(v) > 128:
            raise ValueError("project_id exceeds 128 chars")
        return v.strip()

    @classmethod
    def _validate_bim_file_url(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("bim_file_url must not be empty")
        v = v.strip()
        if not v.startswith(("http://", "https://", "s3://", "gs://")):
            raise ValueError(
                "bim_file_url must start with http://, https://, s3://, or gs://"
            )
        ALLOWED_EXTENSIONS = (".ifc", ".ifczip", ".json", ".xml", ".bcf")
        lower = v.split("?")[0].lower()
        if not any(lower.endswith(ext) for ext in ALLOWED_EXTENSIONS):
            raise ValueError(f"bim_file_url must end with one of {ALLOWED_EXTENSIONS}")
        return v

    @classmethod
    def _validate_country(cls, v: str) -> str:
        if len(v) != 2 or not v.isalpha():
            raise ValueError("country must be a 2-letter ISO 3166-1 code")
        return v.upper()


async def execute_bim_carbon_pipeline(req: BIMPipelineRequest) -> dict[str, Any]:
    """Execute the BIM-Carbon compliance pipeline."""
    workflow_id = f"bim_carbon_{req.project_id}_{datetime.now().timestamp()}"

    steps = [
        AgentTask(
            agent="backend",
            task=f"Extract geometry data from BIM file: {req.bim_file_url}",
            endpoint=f"/api/bim/extract",
            context={"project_id": req.project_id, "file_url": req.bim_file_url},
        ),
        AgentTask(
            agent="backend",
            task="Calculate embodied carbon using EN 15978 methodology",
            endpoint="/api/bim/carbon",
            context={"project_id": req.project_id},
        ),
        AgentTask(
            agent="backend",
            task="Validate against EU Fit for 55 compliance",
            endpoint="/api/bim/validate",
            context={"project_id": req.project_id, "country": req.country},
        ),
    ]

    results = {"workflow_id": workflow_id, "project_id": req.project_id, "steps": []}
    for step in steps:
        r = await execute_task_async(None, step)
        results["steps"].append({"agent": step.agent, "task": step.task, "result": r})

    # Step 4: Push to Situation Room for report generation
    situation_room_step = AgentTask(
        agent="backend",
        task="Push BIM-Carbon results to Situation Room report feed",
        endpoint="/api/situation-room/report",
        context={
            "project_id": req.project_id,
            "report_type": "bim-carbon",
            "pipeline_results": results["steps"],
            "country": req.country,
        },
    )
    sr_result = await execute_task_async(None, situation_room_step)
    results["steps"].append(
        {
            "agent": "backend",
            "task": "Situation Room report feed",
            "result": sr_result,
        }
    )
    results["situation_room"] = sr_result.get("status", "unknown")

    # Optional async callback
    if req.callback_url:
        try:
            import httpx

            async with httpx.AsyncClient(timeout=10.0) as cb_client:
                await cb_client.post(req.callback_url, json=results)
        except Exception as exc:
            import logging

            logger = logging.getLogger(__name__)
            logger.warning("BIM callback to %s failed: %s", req.callback_url, exc)

    # Log to Supabase
    await log_agent_activity(
        agent_name="bim-carbon-pipeline",
        task_desc=f"Complete pipeline for project {req.project_id}",
        status="completed",
        metadata=results,
    )

    return results