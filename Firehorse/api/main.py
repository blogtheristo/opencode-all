"""
Firehorse Report Engine API
===========================

FastAPI service exposing the Firehorse Report Engine for generating
European construction documents with EN 15978 carbon tracking.

Endpoints:
- POST /v1/reports/generate - Generate report from template
- POST /v1/reports/carbon - Generate EN 15978 carbon report
- GET /v1/templates - List available templates
- GET /v1/templates/{template_id} - Get template details
- POST /v1/reports/validate - Validate report compliance
- GET /v1/reports/{report_id} - Get generated report
- GET /health - Health check

Author: DWS IQ 6 Platform Team
Version: 1.0.0
"""

import logging
import os
import sys
import uuid
from datetime import datetime
from enum import StrEnum
from io import BytesIO
from pathlib import Path

from fastapi import BackgroundTasks, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

# Add parent directory to path for report_engine import
sys.path.insert(0, str(Path(__file__).parent.parent))
from report_engine import FirehorseReportEngine

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Firehorse Report Engine API",
    description="Generate European construction documents with EN 15978 carbon tracking",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS configuration - Follow DWS_SECURITY_STANDARD.md Section 13.3
_CORS_ORIGINS: list[str] = os.getenv(
    "CORS_ALLOWED_ORIGINS",
    "http://localhost:3000,https://dws10.com,https://onelifetime.world",
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

# Initialize report engine
engine = FirehorseReportEngine(
    supabase_url=os.getenv("SUPABASE_URL"),
    supabase_key=os.getenv("SUPABASE_KEY"),
    templates_dir=os.getenv(
        "TEMPLATES_DIR", str(Path(__file__).parent.parent / "templates")
    ),
)

# In-memory report storage (replace with Redis/Supabase in production)
report_storage: dict[str, dict] = {}


# ============================================================================
# Enums and Models
# ============================================================================


class OutputFormat(StrEnum):
    PDF = "PDF"
    DOCX = "DOCX"
    XLSX = "XLSX"
    PPTX = "PPTX"
    HTML = "HTML"
    JSON = "JSON"


class Standard(StrEnum):
    EN_15978 = "EN 15978"
    RT_CARD = "RT Card"
    VOB_B = "VOB/B"
    INFRARYL = "InfraRYL"
    NS_8405 = "NS 8405"


class Language(StrEnum):
    EN = "en"
    FI = "fi"
    SV = "sv"
    NO = "no"
    DA = "da"
    DE = "de"


class ReportRequest(BaseModel):
    """Request model for generating a report"""

    project_id: str = Field(..., description="Project identifier")
    template_id: str | None = Field(
        None, description="Template ID (optional, uses standard default)"
    )
    standard: Standard = Field(Standard.EN_15978, description="Construction standard")
    language: Language = Field(Language.EN, description="Report language")
    output_format: OutputFormat = Field(OutputFormat.PDF, description="Output format")
    branding: dict | None = Field(None, description="Custom branding options")
    metadata: dict | None = Field(None, description="Additional metadata")


class CarbonReportRequest(BaseModel):
    """Request model for EN 15978 carbon report"""

    project_id: str = Field(..., description="Project identifier")
    language: Language = Field(Language.EN, description="Report language")
    output_format: OutputFormat = Field(OutputFormat.PDF, description="Output format")
    include_materials: bool = Field(
        True, description="Include material-level breakdown"
    )
    include_charts: bool = Field(True, description="Include visualization charts")
    fit_for_55_validation: bool = Field(
        True, description="Include Fit for 55 compliance check"
    )


class ValidationRequest(BaseModel):
    """Request model for validating report compliance"""

    report_data: dict = Field(..., description="Report data to validate")
    standard: Standard = Field(
        Standard.EN_15978, description="Standard to validate against"
    )


class ReportResponse(BaseModel):
    """Response model for report generation"""

    report_id: str
    status: str
    message: str
    download_url: str | None = None
    created_at: str
    metadata: dict | None = None


class TemplateInfo(BaseModel):
    """Template information model"""

    template_id: str
    template_name: str
    standard: str
    region: str
    category: str
    languages: list[str]
    output_formats: list[str]
    carbon_enabled: bool
    description: str


class ValidationResponse(BaseModel):
    """Validation response model"""

    valid: bool
    errors: list[str]
    warnings: list[str]
    standard: str
    checked_at: str


# ============================================================================
# Health Check
# ============================================================================


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "firehorse-report-engine",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat(),
        "supabase_connected": engine.supabase is not None,
        "templates_available": engine.templates_dir.exists(),
    }


@app.get("/")
async def root():
    """Root endpoint with service info"""
    return {
        "service": "Firehorse Report Engine API",
        "version": "1.0.0",
        "documentation": "/docs",
        "health": "/health",
    }


# ============================================================================
# Templates Endpoints
# ============================================================================


@app.get("/v1/templates", response_model=list[TemplateInfo])
async def list_templates():
    """List all available templates"""
    templates = []

    # Template definitions (would come from database in production)
    template_defs = [
        {
            "template_id": "EN15978-FULL-REPORT-V1",
            "template_name": "EN 15978 Life Cycle Assessment",
            "standard": "EN 15978",
            "region": "Pan-European",
            "category": "Carbon Assessment",
            "languages": ["en", "fi", "sv", "de"],
            "output_formats": ["PDF", "DOCX", "XLSX"],
            "carbon_enabled": True,
            "description": "Complete life cycle carbon assessment per EN 15978:2011 with Fit for 55 compliance",
        },
        {
            "template_id": "FI-RT-CARD-V1",
            "template_name": "RT Card - Project Management",
            "standard": "RT Card",
            "region": "Nordic",
            "category": "Project Management",
            "languages": ["fi", "en"],
            "output_formats": ["PDF", "DOCX"],
            "carbon_enabled": False,
            "description": "Finnish RT 10-11224 project management card template",
        },
        {
            "template_id": "DE-VOB-B-V1",
            "template_name": "VOB/B Construction Contract",
            "standard": "VOB/B",
            "region": "Central Europe",
            "category": "Contract Documentation",
            "languages": ["de", "en"],
            "output_formats": ["PDF", "DOCX"],
            "carbon_enabled": False,
            "description": "German VOB/B construction contract template",
        },
        {
            "template_id": "FI-RT-WORKSITE-DIARY-V1",
            "template_name": "RT Worksite Diary",
            "standard": "RT Card",
            "region": "Nordic",
            "category": "Project Management",
            "languages": ["fi", "en"],
            "output_formats": ["PDF", "XLSX"],
            "carbon_enabled": False,
            "description": "Finnish RT 16-10660 worksite diary template",
        },
        {
            "template_id": "FI-RT-ACCEPTANCE-V1",
            "template_name": "RT Acceptance Inspection",
            "standard": "RT Card",
            "region": "Nordic",
            "category": "Quality Management",
            "languages": ["fi", "en"],
            "output_formats": ["PDF"],
            "carbon_enabled": False,
            "description": "Finnish RT acceptance inspection protocol template",
        },
    ]

    for t in template_defs:
        templates.append(TemplateInfo(**t))

    return templates


@app.get("/v1/templates/{template_id}", response_model=TemplateInfo)
async def get_template(template_id: str):
    """Get template details by ID"""
    templates = await list_templates()

    for template in templates:
        if template.template_id == template_id:
            return template

    raise HTTPException(status_code=404, detail=f"Template not found: {template_id}")


# ============================================================================
# Report Generation Endpoints
# ============================================================================


@app.post("/v1/reports/generate", response_model=ReportResponse)
async def generate_report(request: ReportRequest, background_tasks: BackgroundTasks):
    """
    Generate a report from template.

    This endpoint queues report generation and returns immediately.
    Use the report_id to check status and download.
    """
    report_id = str(uuid.uuid4())

    # Store initial status
    report_storage[report_id] = {
        "status": "processing",
        "request": request.model_dump(),
        "created_at": datetime.now().isoformat(),
        "content": None,
        "error": None,
    }

    # Queue background generation
    background_tasks.add_task(
        _generate_report_background,
        report_id,
        request,
    )

    return ReportResponse(
        report_id=report_id,
        status="processing",
        message="Report generation started",
        download_url=f"/v1/reports/{report_id}/download",
        created_at=datetime.now().isoformat(),
        metadata={"project_id": request.project_id, "format": request.output_format},
    )


async def _generate_report_background(report_id: str, request: ReportRequest):
    """Background task for report generation"""
    try:
        logger.info(f"Generating report {report_id} for project {request.project_id}")

        # Map standard enum to string
        standard_map = {
            Standard.EN_15978: "EN 15978",
            Standard.RT_CARD: "RT Card",
            Standard.VOB_B: "VOB/B",
        }

        standard = standard_map.get(request.standard, "EN 15978")

        # Generate report using engine
        content = engine.generate_carbon_report(
            project_id=request.project_id,
            standard=standard,
            language=request.language.value,
            output_format=request.output_format.value,
        )

        # Update storage
        report_storage[report_id]["status"] = "completed"
        report_storage[report_id]["content"] = content
        report_storage[report_id]["completed_at"] = datetime.now().isoformat()

        logger.info(f"Report {report_id} generated successfully")

    except Exception as e:
        logger.error(f"Report generation failed for {report_id}: {e}")
        report_storage[report_id]["status"] = "failed"
        report_storage[report_id]["error"] = str(e)


@app.post("/v1/reports/carbon", response_model=ReportResponse)
async def generate_carbon_report(
    request: CarbonReportRequest, background_tasks: BackgroundTasks
):
    """
    Generate EN 15978 carbon assessment report.

    Specialized endpoint for carbon reports with additional options
    for material breakdown and Fit for 55 validation.
    """
    report_id = str(uuid.uuid4())

    # Store initial status
    report_storage[report_id] = {
        "status": "processing",
        "type": "carbon",
        "request": request.model_dump(),
        "created_at": datetime.now().isoformat(),
        "content": None,
        "error": None,
    }

    # Queue background generation
    background_tasks.add_task(
        _generate_carbon_report_background,
        report_id,
        request,
    )

    return ReportResponse(
        report_id=report_id,
        status="processing",
        message="Carbon report generation started",
        download_url=f"/v1/reports/{report_id}/download",
        created_at=datetime.now().isoformat(),
        metadata={
            "project_id": request.project_id,
            "format": request.output_format,
            "type": "EN 15978 Carbon Assessment",
        },
    )


async def _generate_carbon_report_background(
    report_id: str, request: CarbonReportRequest
):
    """Background task for carbon report generation"""
    try:
        logger.info(
            f"Generating carbon report {report_id} for project {request.project_id}"
        )

        # Generate carbon report
        content = engine.generate_carbon_report(
            project_id=request.project_id,
            standard="EN 15978",
            language=request.language.value,
            output_format=request.output_format.value,
        )

        # Update storage
        report_storage[report_id]["status"] = "completed"
        report_storage[report_id]["content"] = content
        report_storage[report_id]["completed_at"] = datetime.now().isoformat()

        logger.info(f"Carbon report {report_id} generated successfully")

    except Exception as e:
        logger.error(f"Carbon report generation failed for {report_id}: {e}")
        report_storage[report_id]["status"] = "failed"
        report_storage[report_id]["error"] = str(e)


@app.get("/v1/reports/{report_id}")
async def get_report_status(report_id: str):
    """Get report generation status"""
    if report_id not in report_storage:
        raise HTTPException(status_code=404, detail=f"Report not found: {report_id}")

    report = report_storage[report_id]

    return {
        "report_id": report_id,
        "status": report["status"],
        "created_at": report["created_at"],
        "completed_at": report.get("completed_at"),
        "error": report.get("error"),
        "download_available": report["content"] is not None,
    }


@app.get("/v1/reports/{report_id}/download")
async def download_report(report_id: str):
    """Download generated report"""
    if report_id not in report_storage:
        raise HTTPException(status_code=404, detail=f"Report not found: {report_id}")

    report = report_storage[report_id]

    if report["status"] != "completed":
        raise HTTPException(
            status_code=400, detail=f"Report not ready. Status: {report['status']}"
        )

    content = report["content"]
    if content is None:
        raise HTTPException(status_code=500, detail="Report content not available")

    # Determine content type and filename
    request_data = report.get("request", {})
    output_format = request_data.get("output_format", "PDF")
    project_id = request_data.get("project_id", "unknown")

    content_types = {
        "PDF": "application/pdf",
        "DOCX": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "XLSX": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "PPTX": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    }

    extensions = {
        "PDF": "pdf",
        "DOCX": "docx",
        "XLSX": "xlsx",
        "PPTX": "pptx",
    }

    content_type = content_types.get(output_format, "application/octet-stream")
    extension = extensions.get(output_format, "bin")
    filename = f"report_{project_id}_{report_id[:8]}.{extension}"

    return StreamingResponse(
        BytesIO(content),
        media_type=content_type,
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


# ============================================================================
# Validation Endpoint
# ============================================================================


@app.post("/v1/reports/validate", response_model=ValidationResponse)
async def validate_report(request: ValidationRequest):
    """
    Validate report data against standard requirements.

    Checks required fields, data types, and compliance rules.
    """
    standard_str = request.standard.value

    # Validate using engine
    errors = engine.validate_compliance(request.report_data, standard_str)

    # Separate errors from warnings
    warnings = [e for e in errors if "warning" in e.lower()]
    errors = [e for e in errors if "warning" not in e.lower()]

    return ValidationResponse(
        valid=len(errors) == 0,
        errors=errors,
        warnings=warnings,
        standard=standard_str,
        checked_at=datetime.now().isoformat(),
    )


# ============================================================================
# Batch Operations
# ============================================================================


class BatchReportRequest(BaseModel):
    """Request for batch report generation"""

    project_ids: list[str] = Field(..., description="List of project IDs")
    standard: Standard = Field(Standard.EN_15978)
    output_format: OutputFormat = Field(OutputFormat.PDF)
    language: Language = Field(Language.EN)


@app.post("/v1/reports/batch")
async def generate_batch_reports(
    request: BatchReportRequest, background_tasks: BackgroundTasks
):
    """
    Generate reports for multiple projects.

    Returns a batch ID to track all reports.
    """
    batch_id = str(uuid.uuid4())
    report_ids = []

    for project_id in request.project_ids:
        report_request = ReportRequest(
            project_id=project_id,
            standard=request.standard,
            output_format=request.output_format,
            language=request.language,
        )

        report_id = str(uuid.uuid4())
        report_ids.append(report_id)

        # Store initial status
        report_storage[report_id] = {
            "status": "queued",
            "batch_id": batch_id,
            "request": report_request.model_dump(),
            "created_at": datetime.now().isoformat(),
            "content": None,
            "error": None,
        }

        # Queue generation
        background_tasks.add_task(
            _generate_report_background,
            report_id,
            report_request,
        )

    return {
        "batch_id": batch_id,
        "report_ids": report_ids,
        "total": len(report_ids),
        "status": "processing",
        "created_at": datetime.now().isoformat(),
    }


@app.get("/v1/reports/batch/{batch_id}")
async def get_batch_status(batch_id: str):
    """Get status of all reports in a batch"""
    batch_reports = [
        {"report_id": rid, **data}
        for rid, data in report_storage.items()
        if data.get("batch_id") == batch_id
    ]

    if not batch_reports:
        raise HTTPException(status_code=404, detail=f"Batch not found: {batch_id}")

    completed = sum(1 for r in batch_reports if r["status"] == "completed")
    failed = sum(1 for r in batch_reports if r["status"] == "failed")
    processing = sum(
        1 for r in batch_reports if r["status"] in ["processing", "queued"]
    )

    return {
        "batch_id": batch_id,
        "total": len(batch_reports),
        "completed": completed,
        "failed": failed,
        "processing": processing,
        "reports": [
            {
                "report_id": r["report_id"],
                "project_id": r["request"]["project_id"],
                "status": r["status"],
            }
            for r in batch_reports
        ],
    }


# ============================================================================
# Main Entry Point
# ============================================================================

if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", "8084"))
    host = os.getenv("HOST", "0.0.0.0")

    logger.info(f"Starting Firehorse Report Engine API on {host}:{port}")

    uvicorn.run(app, host=host, port=port)
