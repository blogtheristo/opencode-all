"""
DWS IQ 6 Carbon API
Custom REST wrapper for carbon and compliance operations on Supabase
"""

import os
from datetime import datetime
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from supabase import Client, create_client

app = FastAPI(title="DWS Carbon API", version="1.0.0")

# Enable CORS — explicit origins only (never wildcard per DWS_SECURITY_STANDARD.md)
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

# Initialize Supabase client
supabase: Client = create_client(
    os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_SERVICE_KEY")
)


class CarbonQuery(BaseModel):
    project_id: str | None = None
    date_from: str | None = None
    date_to: str | None = None
    limit: int = 100


class BIMMetadata(BaseModel):
    project_id: str
    file_url: str | None = None
    extracted_data: dict[str, Any]


class ComplianceQuery(BaseModel):
    country: str = "FI"
    regulation_type: str | None = None


class AgentLog(BaseModel):
    agent_name: str
    task: str
    status: str
    metadata: dict | None = None


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "dws-carbon-api",
        "timestamp": datetime.now().isoformat(),
    }


@app.post("/tools/query_carbon_calculations")
async def query_carbon_calculations(query: CarbonQuery) -> dict[str, Any]:
    """
    Query carbon calculation history for construction projects

    Returns aggregated carbon data with statistical summaries
    """
    try:
        db_query = supabase.table("carbon_calculations").select("*")

        if query.project_id:
            db_query = db_query.eq("project_id", query.project_id)
        if query.date_from:
            db_query = db_query.gte("created_at", query.date_from)
        if query.date_to:
            db_query = db_query.lte("created_at", query.date_to)

        response = db_query.limit(query.limit).execute()

        calculations = response.data
        summary = _summarize_emissions(calculations)

        return {
            "count": len(calculations),
            "calculations": calculations,
            "summary": summary,
            "query": query.dict(),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Query failed: {str(e)}")


@app.post("/tools/upsert_bim_metadata")
async def upsert_bim_metadata(data: BIMMetadata) -> dict[str, Any]:
    """
    Store or update BIM model metadata extracted by agents

    Used when agents process IFC, Revit, or other BIM files
    """
    try:
        upsert_data = {
            "project_id": data.project_id,
            "file_url": data.file_url,
            "extracted_data": data.extracted_data,
            "processing_agent": "mcp-agent",
            "last_updated": datetime.now().isoformat(),
        }

        response = supabase.table("bim_metadata").upsert(upsert_data).execute()

        return {
            "success": True,
            "project_id": data.project_id,
            "metadata": response.data[0] if response.data else None,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upsert failed: {str(e)}")


@app.post("/tools/get_compliance_rules")
async def get_compliance_rules(query: ComplianceQuery) -> list[dict[str, Any]]:
    """
    Retrieve EU construction compliance rules from knowledge base

    Supports filtering by country and regulation type (Fit for 55, ETS, CBAM, etc.)
    """
    try:
        db_query = (
            supabase.table("compliance_rules").select("*").eq("country", query.country)
        )

        if query.regulation_type:
            db_query = db_query.eq("type", query.regulation_type)

        response = db_query.execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Query failed: {str(e)}")


@app.post("/tools/log_agent_activity")
async def log_agent_activity(log: AgentLog) -> dict[str, Any]:
    """
    Log multi-agent orchestration activity for observability

    Tracks all agent interactions, tasks, and outcomes
    """
    try:
        log_data = {
            "agent_name": log.agent_name,
            "task": log.task,
            "status": log.status,
            "metadata": log.metadata,
            "timestamp": datetime.now().isoformat(),
        }

        response = supabase.table("agent_logs").insert(log_data).execute()

        return {"logged": True, "id": response.data[0]["id"] if response.data else None}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Logging failed: {str(e)}")


@app.get("/resources/projects")
async def get_projects() -> dict[str, Any]:
    """
    List all construction projects in DWS system

    Returns project metadata including carbon targets and status
    """
    try:
        response = (
            supabase.table("projects")
            .select("id, name, status, start_date, carbon_target")
            .execute()
        )

        return {
            "count": len(response.data),
            "projects": response.data,
            "markdown": _format_as_markdown(response.data),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Query failed: {str(e)}")


@app.get("/resources/construction-standards")
async def get_construction_standards() -> dict[str, Any]:
    """
    EU construction standards knowledge base

    Returns EN standards, building codes, and compliance requirements
    """
    try:
        response = (
            supabase.table("knowledge_base")
            .select("*")
            .eq("category", "standards")
            .execute()
        )

        return {
            "count": len(response.data),
            "standards": response.data,
            "markdown": _format_as_markdown(response.data),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Query failed: {str(e)}")


@app.post("/tools/semantic_search")
async def semantic_project_search(
    query: str, project_id: str | None = None, limit: int = 5
) -> list[dict[str, Any]]:
    """
    Search project documentation using semantic similarity (pgvector)

    Enables agents to find relevant context across documents, emails, and meetings
    """
    try:
        # TODO: Implement embeddings generation with OpenAI/Anthropic
        # For now, fallback to full-text search
        search_query = supabase.table("project_embeddings").select("content, metadata")

        if project_id:
            search_query = search_query.eq("project_id", project_id)

        response = search_query.limit(limit).execute()

        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")


def _summarize_emissions(calculations: list[dict]) -> dict[str, float]:
    """Calculate emission statistics from carbon calculations"""
    if not calculations:
        return {"total": 0, "average": 0, "count": 0}

    total = sum(c.get("co2_kg", 0) for c in calculations)
    return {
        "total_co2_kg": total,
        "average_co2_kg": total / len(calculations) if calculations else 0,
        "count": len(calculations),
        "min_co2_kg": min(c.get("co2_kg", 0) for c in calculations)
        if calculations
        else 0,
        "max_co2_kg": max(c.get("co2_kg", 0) for c in calculations)
        if calculations
        else 0,
    }


def _format_as_markdown(data: list[dict]) -> str:
    """Format data as markdown table for LLM consumption"""
    if not data:
        return "No data found."

    # Create markdown table
    keys = list(data[0].keys())
    header = "| " + " | ".join(keys) + " |"
    separator = "|" + "|".join(["---"] * len(keys)) + "|"

    rows = []
    for item in data:
        row = "| " + " | ".join(str(item.get(k, "")) for k in keys) + " |"
        rows.append(row)

    return "\n".join([header, separator] + rows)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8766)
