"""
Firehorse Automation Service
============================

FastAPI service for workflow automation, triggers, and scheduled tasks.
Part of the Firehorse product suite for DWS IQ 6 platform.

Features:
- Workflow definitions and execution
- Scheduled report generation
- Webhook triggers
- Email/Slack notifications
- Integration with Report Engine

Endpoints:
- POST /v1/workflows - Create workflow
- GET /v1/workflows - List workflows
- POST /v1/workflows/{id}/execute - Execute workflow
- POST /v1/triggers - Create trigger
- GET /v1/schedules - List scheduled tasks
- POST /v1/notify - Send notification
- GET /health - Health check

Author: DWS IQ 6 Platform Team
Version: 1.0.0
"""

import logging
import os
import uuid
from datetime import datetime
from enum import StrEnum

import httpx
from fastapi import BackgroundTasks, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Firehorse Automation Service",
    description="Workflow automation and scheduled tasks for DWS IQ 6",
    version="1.0.0",
    docs_url="/docs",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
REPORT_ENGINE_URL = os.getenv("REPORT_ENGINE_URL", "http://localhost:8084")
SLACK_WEBHOOK_URL = os.getenv("SLACK_WEBHOOK_URL")
EMAIL_API_URL = os.getenv("EMAIL_API_URL")

# In-memory storage (replace with database in production)
workflows: dict[str, dict] = {}
triggers: dict[str, dict] = {}
executions: dict[str, dict] = {}


# ============================================================================
# Enums and Models
# ============================================================================

class TriggerType(StrEnum):
    SCHEDULE = "schedule"
    WEBHOOK = "webhook"
    EVENT = "event"
    THRESHOLD = "threshold"
    MANUAL = "manual"


class ActionType(StrEnum):
    GENERATE_REPORT = "generate_report"
    SEND_EMAIL = "send_email"
    SEND_SLACK = "send_slack"
    CALL_WEBHOOK = "call_webhook"
    UPDATE_DATABASE = "update_database"


class ScheduleFrequency(StrEnum):
    HOURLY = "hourly"
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"
    QUARTERLY = "quarterly"


class WorkflowStatus(StrEnum):
    ACTIVE = "active"
    PAUSED = "paused"
    DRAFT = "draft"


class ExecutionStatus(StrEnum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"


# ============================================================================
# Workflow Models
# ============================================================================

class WorkflowAction(BaseModel):
    """Single action in a workflow"""
    action_id: str = Field(default_factory=lambda: str(uuid.uuid4())[:8])
    action_type: ActionType
    config: dict = Field(default_factory=dict)
    order: int = 1


class WorkflowTrigger(BaseModel):
    """Workflow trigger configuration"""
    trigger_type: TriggerType
    config: dict = Field(default_factory=dict)


class WorkflowCreate(BaseModel):
    """Create workflow request"""
    name: str = Field(..., min_length=3, max_length=100)
    description: str | None = None
    trigger: WorkflowTrigger
    actions: list[WorkflowAction]
    enabled: bool = True


class WorkflowResponse(BaseModel):
    """Workflow response"""
    workflow_id: str
    name: str
    description: str | None
    trigger: WorkflowTrigger
    actions: list[WorkflowAction]
    status: WorkflowStatus
    created_at: str
    last_executed: str | None = None
    execution_count: int = 0


class ExecutionResponse(BaseModel):
    """Workflow execution response"""
    execution_id: str
    workflow_id: str
    status: ExecutionStatus
    started_at: str
    completed_at: str | None = None
    results: list[dict] = []
    error: str | None = None


# ============================================================================
# Notification Models
# ============================================================================

class NotificationRequest(BaseModel):
    """Send notification request"""
    channel: str = Field(..., description="slack, email, or webhook")
    recipient: str = Field(..., description="Email, Slack channel, or webhook URL")
    subject: str | None = None
    message: str
    metadata: dict | None = None


# ============================================================================
# Health Check
# ============================================================================

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "firehorse-automation",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat(),
        "workflows_count": len(workflows),
        "triggers_count": len(triggers),
    }


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "Firehorse Automation Service",
        "version": "1.0.0",
        "documentation": "/docs",
    }


# ============================================================================
# Workflow Endpoints
# ============================================================================

@app.post("/v1/workflows", response_model=WorkflowResponse)
async def create_workflow(request: WorkflowCreate):
    """Create a new workflow"""
    workflow_id = str(uuid.uuid4())

    workflow = {
        "workflow_id": workflow_id,
        "name": request.name,
        "description": request.description,
        "trigger": request.trigger.model_dump(),
        "actions": [a.model_dump() for a in request.actions],
        "status": WorkflowStatus.ACTIVE if request.enabled else WorkflowStatus.DRAFT,
        "created_at": datetime.now().isoformat(),
        "last_executed": None,
        "execution_count": 0,
    }

    workflows[workflow_id] = workflow
    logger.info(f"Created workflow: {workflow_id} - {request.name}")

    return WorkflowResponse(**workflow)


@app.get("/v1/workflows", response_model=list[WorkflowResponse])
async def list_workflows():
    """List all workflows"""
    return [WorkflowResponse(**w) for w in workflows.values()]


@app.get("/v1/workflows/{workflow_id}", response_model=WorkflowResponse)
async def get_workflow(workflow_id: str):
    """Get workflow by ID"""
    if workflow_id not in workflows:
        raise HTTPException(status_code=404, detail=f"Workflow not found: {workflow_id}")

    return WorkflowResponse(**workflows[workflow_id])


@app.delete("/v1/workflows/{workflow_id}")
async def delete_workflow(workflow_id: str):
    """Delete a workflow"""
    if workflow_id not in workflows:
        raise HTTPException(status_code=404, detail=f"Workflow not found: {workflow_id}")

    del workflows[workflow_id]
    logger.info(f"Deleted workflow: {workflow_id}")

    return {"message": f"Workflow {workflow_id} deleted"}


@app.post("/v1/workflows/{workflow_id}/execute", response_model=ExecutionResponse)
async def execute_workflow(workflow_id: str, background_tasks: BackgroundTasks):
    """Execute a workflow"""
    if workflow_id not in workflows:
        raise HTTPException(status_code=404, detail=f"Workflow not found: {workflow_id}")

    workflow = workflows[workflow_id]
    execution_id = str(uuid.uuid4())

    execution = {
        "execution_id": execution_id,
        "workflow_id": workflow_id,
        "status": ExecutionStatus.PENDING,
        "started_at": datetime.now().isoformat(),
        "completed_at": None,
        "results": [],
        "error": None,
    }

    executions[execution_id] = execution

    # Queue background execution
    background_tasks.add_task(_execute_workflow_background, execution_id, workflow)

    return ExecutionResponse(**execution)


async def _execute_workflow_background(execution_id: str, workflow: dict):
    """Background task for workflow execution"""
    try:
        executions[execution_id]["status"] = ExecutionStatus.RUNNING
        results = []

        for action in workflow["actions"]:
            action_type = action["action_type"]
            config = action.get("config", {})

            logger.info(f"Executing action: {action_type}")

            result = await _execute_action(action_type, config)
            results.append({
                "action_id": action["action_id"],
                "action_type": action_type,
                "result": result,
                "timestamp": datetime.now().isoformat(),
            })

        executions[execution_id]["status"] = ExecutionStatus.COMPLETED
        executions[execution_id]["results"] = results
        executions[execution_id]["completed_at"] = datetime.now().isoformat()

        # Update workflow stats
        workflow["last_executed"] = datetime.now().isoformat()
        workflow["execution_count"] = workflow.get("execution_count", 0) + 1

        logger.info(f"Workflow execution completed: {execution_id}")

    except Exception as e:
        logger.error(f"Workflow execution failed: {execution_id} - {e}")
        executions[execution_id]["status"] = ExecutionStatus.FAILED
        executions[execution_id]["error"] = str(e)
        executions[execution_id]["completed_at"] = datetime.now().isoformat()


async def _execute_action(action_type: str, config: dict) -> dict:
    """Execute a single action"""

    if action_type == ActionType.GENERATE_REPORT.value:
        # Call Report Engine API
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{REPORT_ENGINE_URL}/v1/reports/generate",
                json={
                    "project_id": config.get("project_id"),
                    "standard": config.get("standard", "EN 15978"),
                    "output_format": config.get("output_format", "PDF"),
                    "language": config.get("language", "en"),
                },
                timeout=60.0,
            )
            return response.json()

    elif action_type == ActionType.SEND_SLACK.value:
        if SLACK_WEBHOOK_URL:
            async with httpx.AsyncClient() as client:
                await client.post(
                    SLACK_WEBHOOK_URL,
                    json={"text": config.get("message", "Automation notification")},
                    timeout=10.0,
                )
        return {"sent": True, "channel": "slack"}

    elif action_type == ActionType.SEND_EMAIL.value:
        # Placeholder for email integration
        return {
            "sent": True,
            "to": config.get("to"),
            "subject": config.get("subject"),
        }

    elif action_type == ActionType.CALL_WEBHOOK.value:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                config.get("url"),
                json=config.get("payload", {}),
                timeout=30.0,
            )
            return {"status_code": response.status_code}

    else:
        return {"message": f"Action type {action_type} not implemented"}


@app.get("/v1/executions/{execution_id}", response_model=ExecutionResponse)
async def get_execution(execution_id: str):
    """Get execution status"""
    if execution_id not in executions:
        raise HTTPException(status_code=404, detail=f"Execution not found: {execution_id}")

    return ExecutionResponse(**executions[execution_id])


# ============================================================================
# Notification Endpoints
# ============================================================================

@app.post("/v1/notify")
async def send_notification(request: NotificationRequest):
    """Send a notification"""

    if request.channel == "slack":
        if not SLACK_WEBHOOK_URL:
            raise HTTPException(status_code=400, detail="Slack webhook not configured")

        async with httpx.AsyncClient() as client:
            await client.post(
                SLACK_WEBHOOK_URL,
                json={"text": f"*{request.subject or 'Notification'}*\n{request.message}"},
                timeout=10.0,
            )

        return {"status": "sent", "channel": "slack"}

    if request.channel == "email":
        # Placeholder for email integration (Resend, SendGrid, etc.)
        logger.info(f"Email notification to {request.recipient}: {request.subject}")
        return {"status": "queued", "channel": "email", "to": request.recipient}

    if request.channel == "webhook":
        async with httpx.AsyncClient() as client:
            await client.post(
                request.recipient,
                json={
                    "subject": request.subject,
                    "message": request.message,
                    "metadata": request.metadata,
                },
                timeout=30.0,
            )

        return {"status": "sent", "channel": "webhook"}

    raise HTTPException(status_code=400, detail=f"Unknown channel: {request.channel}")


# ============================================================================
# Schedule Endpoints (Placeholder)
# ============================================================================

@app.get("/v1/schedules")
async def list_schedules():
    """List scheduled workflows"""
    scheduled = [
        w for w in workflows.values()
        if w["trigger"].get("trigger_type") == TriggerType.SCHEDULE.value
    ]

    return {
        "schedules": [
            {
                "workflow_id": w["workflow_id"],
                "name": w["name"],
                "frequency": w["trigger"].get("config", {}).get("frequency", "unknown"),
                "next_run": "TBD",  # Would calculate from schedule
            }
            for w in scheduled
        ]
    }


# ============================================================================
# Webhook Trigger Endpoint
# ============================================================================

@app.post("/v1/webhooks/{webhook_id}")
async def trigger_webhook(webhook_id: str, payload: dict, background_tasks: BackgroundTasks):
    """Trigger workflows by webhook"""

    # Find workflows with matching webhook trigger
    matching_workflows = [
        w for w in workflows.values()
        if (
            w["trigger"].get("trigger_type") == TriggerType.WEBHOOK.value
            and w["trigger"].get("config", {}).get("webhook_id") == webhook_id
        )
    ]

    if not matching_workflows:
        raise HTTPException(status_code=404, detail=f"No workflows for webhook: {webhook_id}")

    execution_ids = []
    for workflow in matching_workflows:
        execution_id = str(uuid.uuid4())
        execution = {
            "execution_id": execution_id,
            "workflow_id": workflow["workflow_id"],
            "status": ExecutionStatus.PENDING,
            "started_at": datetime.now().isoformat(),
            "completed_at": None,
            "results": [],
            "error": None,
            "trigger_payload": payload,
        }
        executions[execution_id] = execution
        execution_ids.append(execution_id)

        background_tasks.add_task(_execute_workflow_background, execution_id, workflow)

    return {
        "webhook_id": webhook_id,
        "triggered_workflows": len(matching_workflows),
        "execution_ids": execution_ids,
    }


# ============================================================================
# Pre-built Workflow Templates
# ============================================================================

@app.get("/v1/templates")
async def list_workflow_templates():
    """List pre-built workflow templates"""
    return {
        "templates": [
            {
                "template_id": "daily-carbon-report",
                "name": "Daily Carbon Report",
                "description": "Generate EN 15978 carbon report daily and send to Slack",
                "trigger": {"trigger_type": "schedule", "config": {"frequency": "daily", "time": "08:00"}},
                "actions": [
                    {"action_type": "generate_report", "config": {"standard": "EN 15978"}},
                    {"action_type": "send_slack", "config": {"message": "Daily carbon report ready"}},
                ],
            },
            {
                "template_id": "threshold-alert",
                "name": "Carbon Threshold Alert",
                "description": "Alert when carbon budget exceeds 90%",
                "trigger": {"trigger_type": "threshold", "config": {"metric": "carbon_budget_percent", "operator": ">=", "value": 90}},
                "actions": [
                    {"action_type": "send_slack", "config": {"message": "⚠️ Carbon budget at 90%!"}},
                    {"action_type": "send_email", "config": {"subject": "Carbon Budget Alert"}},
                ],
            },
            {
                "template_id": "weekly-summary",
                "name": "Weekly Project Summary",
                "description": "Generate and email weekly project summary report",
                "trigger": {"trigger_type": "schedule", "config": {"frequency": "weekly", "day": "monday"}},
                "actions": [
                    {"action_type": "generate_report", "config": {"standard": "RT Card"}},
                    {"action_type": "send_email", "config": {"subject": "Weekly Project Summary"}},
                ],
            },
        ]
    }


# ============================================================================
# Main Entry Point
# ============================================================================

if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", "8085"))
    host = os.getenv("HOST", "0.0.0.0")

    logger.info(f"Starting Firehorse Automation Service on {host}:{port}")

    uvicorn.run(app, host=host, port=port)
