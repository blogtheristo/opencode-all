"""
DWS IQ 6 Google Cloud Run MCP Server
Manages Cloud Run services: list, deploy, logs, traffic, metrics, env updates.

Port: 8769
CORS: env-driven explicit origins (DWS_SECURITY_STANDARD.md §13.3.1)
"""

import logging
import os
from datetime import datetime
from typing import Any

from fastapi import Depends, FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Authentication — Bearer token gate (matches mcp-hub pattern)
# ---------------------------------------------------------------------------
_API_KEY: str = os.getenv("MCP_HUB_API_KEY", "")
_bearer_scheme = HTTPBearer(auto_error=False)
_AUTH_EXEMPT_PATHS: set[str] = {"/", "/health", "/docs", "/openapi.json", "/redoc"}


async def require_api_key(
    request: Request,
    credentials: HTTPAuthorizationCredentials | None = Depends(_bearer_scheme),  # noqa: B008
) -> None:
    """Reject requests without a valid API key when MCP_HUB_API_KEY is set."""
    if request.url.path in _AUTH_EXEMPT_PATHS:
        return
    if not _API_KEY:
        return
    if credentials is None or credentials.credentials != _API_KEY:
        raise HTTPException(status_code=401, detail="Invalid or missing API key")


app = FastAPI(
    title="DWS Cloud Run MCP Server",
    version="1.0.0",
    dependencies=[Depends(require_api_key)],
)

# CORS — explicit origins only (DWS_SECURITY_STANDARD.md §13.3.1)
_CORS_ORIGINS: list[str] = os.getenv(
    "CORS_ALLOWED_ORIGINS",
    "http://localhost:3000,http://localhost:3002,https://dws10.com,https://onelifetime.world",
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-Request-ID"],
)

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
GCP_PROJECT_ID: str = os.getenv("GCP_PROJECT_ID", "")
GCP_REGION: str = os.getenv("GCP_REGION", "europe-north1")
GCP_ARTIFACT_REGISTRY: str = os.getenv(
    "GCP_ARTIFACT_REGISTRY", "europe-north1-docker.pkg.dev"
)
GCP_REPOSITORY: str = os.getenv("GCP_REPOSITORY", "dws-iq")
CLOUDRUN_MCP_PORT: int = int(os.getenv("CLOUDRUN_MCP_PORT", "8769"))

# Lazy-init GCP clients — only import if credentials are present
_run_client = None
_logging_client = None


def _get_run_client():
    global _run_client
    if _run_client is None:
        try:
            from google.cloud import run_v2
            creds_json = os.getenv("GOOGLE_APPLICATION_CREDENTIALS_JSON")
            if creds_json:
                import tempfile
                with tempfile.NamedTemporaryFile(
                    mode="w", suffix=".json", delete=False
                ) as f:
                    f.write(creds_json)
                    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = f.name
            _run_client = run_v2.ServicesClient()
        except Exception as e:
            logger.warning("Google Cloud Run client unavailable: %s", e)
    return _run_client


def _get_logging_client():
    global _logging_client
    if _logging_client is None:
        try:
            from google.cloud import logging as gcp_logging
            _logging_client = gcp_logging.Client(project=GCP_PROJECT_ID)
        except Exception as e:
            logger.warning("Google Cloud Logging client unavailable: %s", e)
    return _logging_client


# ---------------------------------------------------------------------------
# Models
# ---------------------------------------------------------------------------
class DeployRequest(BaseModel):
    image: str  # e.g. "europe-north1-docker.pkg.dev/project/repo/service:sha"
    env_vars: dict[str, str] | None = None
    memory: str = "512Mi"
    cpu: str = "1"
    min_instances: int = 0
    max_instances: int = 10


class TrafficRequest(BaseModel):
    # e.g. {"LATEST": 90, "revision-name": 10}
    splits: dict[str, int]


class EnvUpdateRequest(BaseModel):
    env_vars: dict[str, str]


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def _parent() -> str:
    return f"projects/{GCP_PROJECT_ID}/locations/{GCP_REGION}"


def _service_name(name: str) -> str:
    return f"{_parent()}/services/{name}"


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------
@app.get("/health")
async def health():
    connected = bool(GCP_PROJECT_ID) and _get_run_client() is not None
    return {
        "service": "DWS Cloud Run MCP Server",
        "version": "1.0.0",
        "status": "operational",
        "gcp_connected": connected,
        "project": GCP_PROJECT_ID,
        "region": GCP_REGION,
        "timestamp": datetime.utcnow().isoformat(),
    }


@app.get("/services")
async def list_services():
    """List all Cloud Run services in project/region."""
    client = _get_run_client()
    if not client:
        raise HTTPException(503, "GCP client not available — check credentials")
    try:
        services = []
        for svc in client.list_services(parent=_parent()):
            services.append(
                {
                    "name": svc.name.split("/")[-1],
                    "uri": svc.uri,
                    "generation": svc.generation,
                    "create_time": str(svc.create_time),
                    "update_time": str(svc.update_time),
                    "conditions": [
                        {
                            "type": svc.terminal_condition.type_,
                            "state": str(svc.terminal_condition.state),
                            "message": svc.terminal_condition.message,
                            "reason": svc.terminal_condition.reason,
                        }
                    ] if svc.terminal_condition else [],
                }
            )
        return {"services": services, "count": len(services)}
    except Exception as e:
        logger.error("Failed to list services: %s", e)
        raise HTTPException(500, "Failed to list Cloud Run services")


@app.get("/services/{name}")
async def get_service(name: str):
    """Get Cloud Run service status, URL, latest revision."""
    client = _get_run_client()
    if not client:
        raise HTTPException(503, "GCP client not available")
    try:
        svc = client.get_service(name=_service_name(name))
        return {
            "name": name,
            "uri": svc.uri,
            "generation": svc.generation,
            "latest_ready_revision": svc.latest_ready_revision,
            "latest_created_revision": svc.latest_created_revision,
            "update_time": str(svc.update_time),
            "observed_generation": svc.observed_generation,
        }
    except Exception as e:
        logger.error("Service %s lookup failed: %s", name, e)
        raise HTTPException(404, f"Service '{name}' not found")


@app.post("/services/{name}/deploy")
async def deploy_service(name: str, req: DeployRequest):
    """Trigger a new deployment with the given image."""
    client = _get_run_client()
    if not client:
        raise HTTPException(503, "GCP client not available")
    try:
        svc = client.get_service(name=_service_name(name))
        container = svc.template.containers[0]
        container.image = req.image
        if req.env_vars:
            from google.cloud.run_v2.types import EnvVar
            container.env = [EnvVar(name=k, value=v) for k, v in req.env_vars.items()]
        svc.template.containers[0] = container
        op = client.update_service(service=svc)
        return {
            "status": "deploying",
            "service": name,
            "image": req.image,
            "operation": op.operation.name,
        }
    except Exception as e:
        logger.error("Deploy failed for %s: %s", name, e)
        raise HTTPException(500, f"Failed to deploy service '{name}'")


@app.get("/services/{name}/logs")
async def get_logs(name: str, limit: int = 50):
    """Fetch recent Cloud Logging entries for a Cloud Run service."""
    lc = _get_logging_client()
    if not lc:
        raise HTTPException(503, "Cloud Logging client not available")
    try:
        filter_str = (
            f'resource.type="cloud_run_revision" '
            f'resource.labels.service_name="{name}" '
            f'resource.labels.location="{GCP_REGION}"'
        )
        entries = []
        for entry in lc.list_entries(filter_=filter_str, order_by="timestamp desc",
                                     page_size=limit):
            entries.append({
                "timestamp": str(entry.timestamp),
                "severity": str(entry.severity),
                "payload": str(entry.payload),
            })
        return {"service": name, "entries": entries}
    except Exception as e:
        logger.error("Failed to fetch logs for %s: %s", name, e)
        raise HTTPException(500, f"Failed to fetch logs for service '{name}'")


@app.patch("/services/{name}/traffic")
async def update_traffic(name: str, req: TrafficRequest):
    """Update traffic splits between revisions (canary/rollback)."""
    client = _get_run_client()
    if not client:
        raise HTTPException(503, "GCP client not available")
    try:
        from google.cloud.run_v2.types import TrafficTarget, TrafficTargetAllocationType
        svc = client.get_service(name=_service_name(name))
        traffic = []
        for target, pct in req.splits.items():
            t = TrafficTarget()
            if target == "LATEST":
                t.type_ = TrafficTargetAllocationType.TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST
            else:
                t.type_ = TrafficTargetAllocationType.TRAFFIC_TARGET_ALLOCATION_TYPE_REVISION
                t.revision = target
            t.percent = pct
            traffic.append(t)
        svc.traffic = traffic
        op = client.update_service(service=svc)
        return {"status": "updating", "splits": req.splits, "operation": op.operation.name}
    except Exception as e:
        logger.error("Traffic update failed for %s: %s", name, e)
        raise HTTPException(500, f"Failed to update traffic for service '{name}'")


@app.get("/services/{name}/metrics")
async def get_metrics(name: str):
    """Request count, CPU, memory from Cloud Monitoring (last 15 min)."""
    if not GCP_PROJECT_ID:
        raise HTTPException(503, "GCP_PROJECT_ID not configured")
    try:
        import time

        from google.cloud import monitoring_v3
        from google.protobuf.timestamp_pb2 import Timestamp

        mc = monitoring_v3.MetricServiceClient()
        project_name = f"projects/{GCP_PROJECT_ID}"
        now = time.time()
        interval = monitoring_v3.TimeInterval({
            "end_time": Timestamp(seconds=int(now)),
            "start_time": Timestamp(seconds=int(now - 900)),
        })
        results: dict[str, Any] = {"service": name, "window_minutes": 15}
        for metric_type, label in [
            ("run.googleapis.com/request_count", "request_count"),
            ("run.googleapis.com/container/cpu/utilizations", "cpu_utilization"),
            ("run.googleapis.com/container/memory/utilizations", "memory_utilization"),
        ]:
            try:
                ts = mc.list_time_series(
                    name=project_name,
                    filter=(
                        f'metric.type="{metric_type}" AND '
                        f'resource.labels.service_name="{name}"'
                    ),
                    interval=interval,
                    view=monitoring_v3.ListTimeSeriesRequest.TimeSeriesView.FULL,
                )
                points = []
                for series in ts:
                    for p in series.points:
                        points.append(p.value.double_value or p.value.int64_value)
                results[label] = sum(points) if points else 0
            except Exception:
                results[label] = None
        return results
    except Exception as e:
        logger.error("Metrics fetch failed for %s: %s", name, e)
        raise HTTPException(500, f"Failed to fetch metrics for service '{name}'")


@app.patch("/services/{name}/env")
async def update_env(name: str, req: EnvUpdateRequest):
    """Update environment variables for a Cloud Run service."""
    client = _get_run_client()
    if not client:
        raise HTTPException(503, "GCP client not available")
    try:
        from google.cloud.run_v2.types import EnvVar
        svc = client.get_service(name=_service_name(name))
        container = svc.template.containers[0]
        existing = {e.name: e.value for e in container.env}
        existing.update(req.env_vars)
        container.env = [EnvVar(name=k, value=v) for k, v in existing.items()]
        svc.template.containers[0] = container
        op = client.update_service(service=svc)
        return {
            "status": "updating",
            "service": name,
            "updated_keys": list(req.env_vars.keys()),
            "operation": op.operation.name,
        }
    except Exception as e:
        logger.error("Env update failed for %s: %s", name, e)
        raise HTTPException(500, f"Failed to update env for service '{name}'")


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=CLOUDRUN_MCP_PORT)
