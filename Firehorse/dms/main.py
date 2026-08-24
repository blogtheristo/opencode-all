"""
Firehorse Content DMS API
=========================

FastAPI service for managing construction documents:
- Upload to Supabase Storage
- Track metadata & versions in Supabase Postgres
- List & filter documents
- Generate signed download URLs

Author: DWS IQ 6 Platform Team
Version: 1.0.0
"""

from __future__ import annotations

import logging
import os
import uuid
from datetime import datetime, timedelta

from fastapi import FastAPI, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.params import File as FileParam
from pydantic import BaseModel

from supabase import Client, create_client

# ---------------------------------------------------------------------------
# Configuration & clients
# ---------------------------------------------------------------------------

_file_required = FileParam(...)

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("firehorse-dms")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv(
    "SUPABASE_KEY"
)  # fallback for dev
SUPABASE_BUCKET = os.getenv("SUPABASE_BUCKET", "firehorse-documents")
SIGNED_URL_EXPIRY = int(os.getenv("SIGNED_URL_EXPIRY_SECONDS", "900"))

if not SUPABASE_URL or not SUPABASE_KEY:
    logger.warning("Supabase credentials not configured. DMS operations will fail.")

supabase: Client | None = None
try:
    if SUPABASE_URL and SUPABASE_KEY:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
except Exception as exc:  # pragma: no cover - init failure
    logger.error("Failed to initialize Supabase client: %s", exc)

# ---------------------------------------------------------------------------
# FastAPI setup
# ---------------------------------------------------------------------------

app = FastAPI(
    title="Firehorse Content DMS",
    description="Document upload, storage, and metadata service for DWS IQ 6",
    version="1.0.0",
)

# CORS - Follow DWS_SECURITY_STANDARD.md Section 13.3
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


# ---------------------------------------------------------------------------
# Pydantic Models
# ---------------------------------------------------------------------------


class DocumentCategory(str):
    STANDARD_TEMPLATE = "standard_template"
    PROJECT_CONTRACT = "project_contract"
    COMPLIANCE_REPORT = "compliance_report"
    SAFETY_DOCUMENT = "safety_document"
    CARBON_REPORT = "carbon_report"
    CUSTOM = "custom"


class DocumentStatus(str):
    DRAFT = "draft"
    IN_REVIEW = "in_review"
    APPROVED = "approved"
    ARCHIVED = "archived"


class DocumentResponse(BaseModel):
    id: str
    organization_id: str
    project_id: str | None
    folder_id: str | None
    title: str
    category: str
    standard_code: str | None
    language: str
    status: str
    file_type: str
    file_size_bytes: int
    storage_path: str
    download_url: str | None = None
    created_at: str
    updated_at: str
    current_version_id: str | None = None


class DocumentListResponse(BaseModel):
    items: list[DocumentResponse]
    total: int


class PreviewResponse(BaseModel):
    document_id: str
    preview_url: str
    expires_at: str
    file_type: str


class DocumentFilter(BaseModel):
    organization_id: str
    project_id: str | None = None
    category: str | None = None
    standard_code: str | None = None
    status: str | None = None


# ---------------------------------------------------------------------------
# Helper functions
# ---------------------------------------------------------------------------


def _ensure_supabase() -> Client:
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase not configured")
    return supabase


def _ensure_bucket(client: Client) -> None:
    """Create bucket if it doesn't exist (idempotent)."""
    try:
        buckets = client.storage.list_buckets()
        if not any(bucket.get("name") == SUPABASE_BUCKET for bucket in buckets):
            client.storage.create_bucket(SUPABASE_BUCKET, {"public": False})
            logger.info("Created Supabase bucket %s", SUPABASE_BUCKET)
    except Exception as exc:  # pragma: no cover - best effort
        logger.warning("Bucket verification failed: %s", exc)


def _generate_storage_path(
    organization_id: str, project_id: str | None, filename: str
) -> str:
    safe_name = filename.replace(" ", "_")
    project_segment = project_id or "shared"
    return f"{organization_id}/{project_segment}/{uuid.uuid4()}_{safe_name}"


def _table_insert(client: Client, table: str, record: dict) -> dict:
    response = client.table(table).insert(record).execute()
    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to insert record")
    return response.data[0]


def _table_update(client: Client, table: str, record_id: str, updates: dict) -> dict:
    response = client.table(table).update(updates).eq("id", record_id).execute()
    if not response.data:
        raise HTTPException(status_code=500, detail="Failed to update record")
    return response.data[0]


def _generate_signed_url(client: Client, path: str) -> str:
    try:
        signed = client.storage.from_(SUPABASE_BUCKET).create_signed_url(
            path, expires_in=SIGNED_URL_EXPIRY
        )
        return signed.get("signedURL")
    except Exception as exc:
        logger.error("Failed to generate signed URL: %s", exc)
        return ""


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "firehorse-dms",
        "bucket": SUPABASE_BUCKET,
        "supabase_connected": supabase is not None,
        "timestamp": datetime.utcnow().isoformat(),
    }


@app.post(
    "/v1/documents",
    response_model=DocumentResponse,
    summary="Upload new document",
)
async def upload_document(
    organization_id: str = Form(...),
    project_id: str | None = Form(None),
    folder_id: str | None = Form(None),
    title: str = Form(...),
    category: str = Form(DocumentCategory.CUSTOM),
    standard_code: str | None = Form(None),
    language: str = Form("en"),
    description: str | None = Form(None),
    file: UploadFile = _file_required,
    created_by: str = Form(...),
):
    """
    Upload a document to Supabase Storage and record metadata.
    """
    client = _ensure_supabase()
    _ensure_bucket(client)

    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Empty file upload")

    storage_path = _generate_storage_path(organization_id, project_id, file.filename)

    try:
        client.storage.from_(SUPABASE_BUCKET).upload(
            storage_path,
            contents,
            {"contentType": file.content_type or "application/octet-stream"},
        )
    except Exception as exc:
        logger.error("Upload failed: %s", exc)
        raise HTTPException(
            status_code=500, detail="Failed to upload document"
        ) from exc

    document_id = uuid.uuid4()
    version_id = uuid.uuid4()

    version_record = {
        "id": str(version_id),
        "document_id": str(document_id),
        "version_number": 1,
        "storage_path": storage_path,
        "file_type": file.content_type or "application/octet-stream",
        "file_size_bytes": len(contents),
        "checksum": None,
        "change_log": "Initial upload",
        "uploaded_by": created_by,
    }

    document_record = {
        "id": str(document_id),
        "organization_id": organization_id,
        "project_id": project_id,
        "folder_id": folder_id,
        "title": title,
        "description": description,
        "category": category,
        "standard_code": standard_code,
        "language": language,
        "status": DocumentStatus.DRAFT,
        "current_version_id": str(version_id),
        "storage_path": storage_path,
        "file_type": file.content_type or "application/octet-stream",
        "file_size_bytes": len(contents),
        "checksum": None,
        "created_by": created_by,
    }

    _table_insert(client, "document_versions", version_record)
    inserted = _table_insert(client, "documents", document_record)

    signed_url = _generate_signed_url(client, storage_path)

    return DocumentResponse(
        download_url=signed_url,
        created_at=inserted["created_at"],
        updated_at=inserted["updated_at"],
        **{k: inserted.get(k) for k in DocumentResponse.model_fields if k in inserted},
    )


@app.get(
    "/v1/documents",
    response_model=DocumentListResponse,
    summary="List documents with optional filters",
)
async def list_documents(
    organization_id: str,
    project_id: str | None = None,
    category: str | None = None,
    standard_code: str | None = None,
    status: str | None = None,
    limit: int = 50,
    offset: int = 0,
):
    client = _ensure_supabase()

    query = (
        client.table("documents")
        .select("*")
        .eq("organization_id", organization_id)
        .order("updated_at", desc=True)
        .range(offset, offset + limit - 1)
    )

    if project_id:
        query = query.eq("project_id", project_id)
    if category:
        query = query.eq("category", category)
    if standard_code:
        query = query.eq("standard_code", standard_code)
    if status:
        query = query.eq("status", status)

    response = query.execute()
    documents = response.data or []

    items: list[DocumentResponse] = []
    for record in documents:
        signed_url = _generate_signed_url(client, record["storage_path"])
        items.append(
            DocumentResponse(
                download_url=signed_url,
                created_at=record["created_at"],
                updated_at=record["updated_at"],
                **{
                    k: record.get(k)
                    for k in DocumentResponse.model_fields
                    if k in record
                },
            )
        )

    (
        client.rpc(
            "documents_count",
            {"p_organization_id": organization_id, "p_project_id": project_id},
        ).execute()
        if False
        else None
    )  # placeholder for future RPC

    return DocumentListResponse(items=items, total=len(items))


@app.get("/v1/documents/{document_id}", response_model=DocumentResponse)
async def get_document(document_id: str):
    client = _ensure_supabase()
    response = (
        client.table("documents").select("*").eq("id", document_id).single().execute()
    )
    record = response.data
    if not record:
        raise HTTPException(status_code=404, detail="Document not found")

    signed_url = _generate_signed_url(client, record["storage_path"])
    return DocumentResponse(
        download_url=signed_url,
        created_at=record["created_at"],
        updated_at=record["updated_at"],
        **{k: record.get(k) for k in DocumentResponse.model_fields if k in record},
    )


@app.get("/v1/documents/{document_id}/preview", response_model=PreviewResponse)
async def get_preview(document_id: str):
    """
    Generate a signed URL suitable for embedding in PDF.js viewer.
    """
    client = _ensure_supabase()
    response = (
        client.table("documents")
        .select("id, storage_path, file_type")
        .eq("id", document_id)
        .single()
        .execute()
    )
    record = response.data
    if not record:
        raise HTTPException(status_code=404, detail="Document not found")

    signed_url = _generate_signed_url(client, record["storage_path"])
    expires_at = (datetime.utcnow() + timedelta(seconds=SIGNED_URL_EXPIRY)).isoformat()

    return PreviewResponse(
        document_id=document_id,
        preview_url=signed_url,
        expires_at=expires_at,
        file_type=record["file_type"],
    )


@app.post("/v1/documents/{document_id}/status", response_model=DocumentResponse)
async def update_status(document_id: str, status: str = Form(...)):
    if status not in {
        DocumentStatus.DRAFT,
        DocumentStatus.IN_REVIEW,
        DocumentStatus.APPROVED,
        DocumentStatus.ARCHIVED,
    }:
        raise HTTPException(status_code=400, detail="Invalid status")

    client = _ensure_supabase()
    updated = _table_update(
        client,
        "documents",
        document_id,
        {"status": status, "updated_at": datetime.utcnow().isoformat()},
    )
    signed_url = _generate_signed_url(client, updated["storage_path"])

    return DocumentResponse(
        download_url=signed_url,
        created_at=updated["created_at"],
        updated_at=updated["updated_at"],
        **{k: updated.get(k) for k in DocumentResponse.model_fields if k in updated},
    )


@app.get("/")
async def root():
    return {
        "service": "Firehorse Content DMS",
        "version": "1.0.0",
        "documentation": "/docs",
        "health": "/health",
    }


# ---------------------------------------------------------------------------
# Main entry
# ---------------------------------------------------------------------------


if __name__ == "__main__":  # pragma: no cover
    import uvicorn

    port = int(os.getenv("PORT", "8086"))
    uvicorn.run(app, host="0.0.0.0", port=port)
