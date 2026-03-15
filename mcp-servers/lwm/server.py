"""
DWS IQ 6 LWM (Lifetime World Model) MCP Server
Bridges the dws-hybrid-network to the Acer GN-100 training infrastructure.

Port: 8770
Training orchestrator API: http://GN100_HOST:8890 (docker-compose.training.yml)
CORS: env-driven explicit origins (DWS_SECURITY_STANDARD.md §13.3.1)
"""

import logging
import os
import uuid
from datetime import datetime
from typing import Any

import httpx
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
    title="DWS LWM MCP Server",
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
LWM_MCP_PORT: int = int(os.getenv("LWM_MCP_PORT", "8770"))

# GN-100 training orchestrator (from docker-compose.training.yml — port 8890)
GN100_HOST: str = os.getenv("GN100_HOST", "192.168.1.100")
GN100_PORT: int = int(os.getenv("GN100_PORT", "8890"))
GN100_TRAINING_URL: str = f"http://{GN100_HOST}:{GN100_PORT}"

# MLflow tracking (from training compose)
MLFLOW_URL: str = os.getenv("MLFLOW_URL", f"http://{GN100_HOST}:5000")

# GCS bucket for checkpoints (training sync-to-gcp.ps1 target)
GCS_CHECKPOINTS_BUCKET: str = os.getenv(
    "GCS_CHECKPOINTS_BUCKET", "lifetime-llm-checkpoints"
)

# HTTP client timeout (training jobs are slow to respond)
_HTTP_TIMEOUT = httpx.Timeout(30.0)


async def _gn100_get(path: str) -> Any:
    async with httpx.AsyncClient(timeout=_HTTP_TIMEOUT) as client:
        r = await client.get(f"{GN100_TRAINING_URL}{path}")
        r.raise_for_status()
        return r.json()


async def _gn100_post(path: str, payload: dict) -> Any:
    async with httpx.AsyncClient(timeout=_HTTP_TIMEOUT) as client:
        r = await client.post(f"{GN100_TRAINING_URL}{path}", json=payload)
        r.raise_for_status()
        return r.json()


async def _gn100_reachable() -> bool:
    try:
        async with httpx.AsyncClient(timeout=httpx.Timeout(3.0)) as client:
            r = await client.get(f"{GN100_TRAINING_URL}/health")
            return r.status_code < 500
    except Exception:
        return False


# ---------------------------------------------------------------------------
# Models
# ---------------------------------------------------------------------------
class TrainingJobRequest(BaseModel):
    model_name: str = "meta-llama/Llama-3.3-70B-Instruct"
    dataset_path: str                   # path inside /datasets on GN-100
    experiment_name: str = "lwm-v1"
    use_lora: bool = True
    lora_r: int = 64
    lora_alpha: int = 128
    use_4bit: bool = True
    max_steps: int = 1000
    per_device_train_batch_size: int = 2
    learning_rate: float = 2e-4
    output_dir: str = "/checkpoints/lwm-v1"
    wandb_project: str = "lifetime-world-model"
    notes: str = ""


class QuantizeRequest(BaseModel):
    format: str = "gguf"          # "gguf" | "awq" | "gptq"
    quantization_bits: int = 4
    output_path: str | None = None


class DeployCheckpointRequest(BaseModel):
    target: str = "gcs"           # "gcs" | "artifact-registry" | "local"
    tag: str | None = None
    registry_path: str | None = None


class DatasetValidateRequest(BaseModel):
    dataset_path: str
    format: str = "jsonl"         # "jsonl" | "csv" | "parquet"
    required_columns: list[str] = ["instruction", "output"]


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------
@app.get("/health")
async def health():
    gn100_up = await _gn100_reachable()
    return {
        "service": "DWS LWM MCP Server",
        "version": "1.0.0",
        "status": "operational",
        "gn100_reachable": gn100_up,
        "gn100_url": GN100_TRAINING_URL,
        "mlflow_url": MLFLOW_URL,
        "gcs_bucket": GCS_CHECKPOINTS_BUCKET,
        "timestamp": datetime.utcnow().isoformat(),
    }


@app.post("/jobs")
async def launch_job(req: TrainingJobRequest):
    """Launch a training job on the GN-100 orchestrator."""
    if not await _gn100_reachable():
        raise HTTPException(
            503,
            f"GN-100 training orchestrator not reachable at {GN100_TRAINING_URL}. "
            "Ensure docker-compose.training.yml is running on the GN-100.",
        )
    job_id = str(uuid.uuid4())[:8]
    payload = req.model_dump()
    payload["job_id"] = job_id
    try:
        result = await _gn100_post("/jobs/launch", payload)
        return {"job_id": job_id, "status": "launched", **result}
    except Exception as e:
        logger.error("Failed to launch job: %s", e)
        raise HTTPException(500, "Failed to launch training job — check server logs")


@app.get("/jobs")
async def list_jobs():
    """List all training jobs."""
    if not await _gn100_reachable():
        raise HTTPException(503, "GN-100 not reachable")
    try:
        return await _gn100_get("/jobs")
    except Exception as e:
        logger.error("LWM operation failed: %s", e)
        raise HTTPException(500, "Internal server error — check server logs")


@app.get("/jobs/{job_id}")
async def get_job(job_id: str):
    """Get training job details: status, loss, GPU utilization, ETA."""
    if not await _gn100_reachable():
        raise HTTPException(503, "GN-100 not reachable")
    try:
        return await _gn100_get(f"/jobs/{job_id}")
    except httpx.HTTPStatusError as e:
        raise HTTPException(e.response.status_code, f"Job {job_id} not found")
    except Exception as e:
        logger.error("LWM operation failed: %s", e)
        raise HTTPException(500, "Internal server error — check server logs")


@app.delete("/jobs/{job_id}")
async def cancel_job(job_id: str):
    """Cancel a running training job."""
    if not await _gn100_reachable():
        raise HTTPException(503, "GN-100 not reachable")
    try:
        return await _gn100_post(f"/jobs/{job_id}/cancel", {})
    except Exception as e:
        logger.error("LWM operation failed: %s", e)
        raise HTTPException(500, "Internal server error — check server logs")


@app.get("/checkpoints")
async def list_checkpoints():
    """List checkpoints available on GN-100 and/or GCS."""
    if not await _gn100_reachable():
        raise HTTPException(503, "GN-100 not reachable")
    try:
        return await _gn100_get("/checkpoints")
    except Exception as e:
        logger.error("LWM operation failed: %s", e)
        raise HTTPException(500, "Internal server error — check server logs")


@app.post("/checkpoints/{checkpoint_id}/quantize")
async def quantize_checkpoint(checkpoint_id: str, req: QuantizeRequest):
    """Trigger GGUF/AWQ/GPTQ quantization via the GN-100 quantizer service."""
    if not await _gn100_reachable():
        raise HTTPException(503, "GN-100 not reachable")
    if req.format not in ("gguf", "awq", "gptq"):
        raise HTTPException(400, "format must be 'gguf', 'awq', or 'gptq'")
    try:
        payload = req.model_dump()
        payload["checkpoint_id"] = checkpoint_id
        return await _gn100_post("/checkpoints/quantize", payload)
    except Exception as e:
        logger.error("LWM operation failed: %s", e)
        raise HTTPException(500, "Internal server error — check server logs")


@app.post("/checkpoints/{checkpoint_id}/deploy")
async def deploy_checkpoint(checkpoint_id: str, req: DeployCheckpointRequest):
    """Push quantized model to GCS / Artifact Registry."""
    if not await _gn100_reachable():
        raise HTTPException(503, "GN-100 not reachable")
    try:
        payload = req.model_dump()
        payload["checkpoint_id"] = checkpoint_id
        payload["gcs_bucket"] = GCS_CHECKPOINTS_BUCKET
        return await _gn100_post("/checkpoints/deploy", payload)
    except Exception as e:
        logger.error("LWM operation failed: %s", e)
        raise HTTPException(500, "Internal server error — check server logs")


@app.get("/metrics")
async def get_metrics():
    """Live training metrics from MLflow: loss, GPU util, memory, throughput."""
    try:
        async with httpx.AsyncClient(timeout=_HTTP_TIMEOUT) as client:
            r = await client.get(f"{MLFLOW_URL}/api/2.0/mlflow/experiments/list")
            r.raise_for_status()
            experiments = r.json().get("experiments", [])
        return {
            "mlflow_url": MLFLOW_URL,
            "experiments": [
                {"id": e["experiment_id"], "name": e["name"]}
                for e in experiments
            ],
        }
    except Exception as e:
        logger.error("MLflow not reachable: %s", e)
        raise HTTPException(503, "MLflow not reachable — check server logs")


@app.get("/datasets")
async def list_datasets():
    """List available training datasets on GN-100."""
    if not await _gn100_reachable():
        raise HTTPException(503, "GN-100 not reachable")
    try:
        return await _gn100_get("/datasets")
    except Exception as e:
        logger.error("LWM operation failed: %s", e)
        raise HTTPException(500, "Internal server error — check server logs")


@app.post("/datasets/validate")
async def validate_dataset(req: DatasetValidateRequest):
    """Validate dataset format before launching a training job."""
    if not await _gn100_reachable():
        raise HTTPException(503, "GN-100 not reachable")
    try:
        return await _gn100_post("/datasets/validate", req.model_dump())
    except Exception as e:
        logger.error("LWM operation failed: %s", e)
        raise HTTPException(500, "Internal server error — check server logs")


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=LWM_MCP_PORT)
