# Firehorse Content DMS
## Document Management Service (Backend Design)

**Goal:** Provide secure document upload, storage, versioning, and preview for construction-standard paperwork (RT Cards, EN 15978 reports, contracts, etc.) as part of the Firehorse suite.

---

## ✅ Architecture Overview

```
┌────────────────────────────────────────────────────────────┐
│  Clients                                                   │
│  ├── Firehorse Web Admin (Next.js)                         │
│  ├── DWS IQ Dashboard                                      │
│  └── Mobile Dashboard (React Native)                       │
└────────────────────────────────────────────────────────────┘
                    │ HTTPS (JWT / API Key)
┌────────────────────────────────────────────────────────────┐
│  Firehorse DMS API (FastAPI)                               │
│  ├── POST /v1/documents            (upload metadata)       │
│  ├── POST /v1/documents/upload     (signed URL flow)       │
│  ├── GET  /v1/documents            (list/filter)           │
│  ├── GET  /v1/documents/{id}       (metadata + presign)    │
│  ├── GET  /v1/documents/{id}/preview (PDF proxy)           │
│  ├── POST /v1/documents/{id}/tags  (categorisation)        │
│  └── GET  /v1/documents/standards  (seeded templates)      │
└────────────────────────────────────────────────────────────┘
                    │ Supabase client / HTTP
┌────────────────────────────────────────────────────────────┐
│  Supabase                                                │
│  ├── Storage bucket: firehorse-documents                  │
│  │    ├── standard-templates/EN15978/...                  │
│  │    └── org-{id}/project-{id}/...                       │
│  └── Postgres (see `supabase-schema-dms.sql`)             │
└────────────────────────────────────────────────────────────┘
```

### PDF Preview Flow
1. User opens document in dashboard
2. Frontend requests `GET /v1/documents/{id}/preview`
3. API validates access and generates signed Supabase URL
4. Response includes short-lived URL and metadata
5. Frontend loads PDF.js viewer with signed URL (expires in 5 minutes)

Optional: backend can proxy PDF bytes to avoid exposing storage URLs by streaming via FastAPI.

---

## 📦 Supabase Schema

Schema defined in `Firehorse/supabase-schema-dms.sql` includes:
- `document_folders`: nested folder hierarchy per organization/project
- `documents`: high-level metadata + current version pointer
- `document_versions`: immutable uploads (checksum, storage path, preview)
- `document_tags` & `document_tag_map`: tagging/filters
- `document_access_logs`: audit trail (GDPR/NIS2)
- Views: `v_document_summary`, `v_recent_documents`

Storage buckets (configure via Supabase Studio):
- `firehorse-documents` (private)
- Optional `firehorse-previews` for generated thumbnails

---

## 🔐 Security Model

- JWT or service API key required for every call
- RLS policies enforce `organization_id` membership
- Every download goes through API (no direct public URLs)
- Access logs written for every view/download
- Signed URLs expire in 5 minutes
- Optional watermarking flag per document

---

## 🧪 API Specification (MVP)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/v1/documents/upload-url` | POST | Returns signed URL for direct-to-Supabase upload |
| `/v1/documents` | POST | Create document metadata + version record |
| `/v1/documents` | GET | Filter by project, standard, tag, status |
| `/v1/documents/{id}` | GET | Full metadata, version history, presigned download |
| `/v1/documents/{id}/preview` | GET | Signed URL or proxied PDF bytes |
| `/v1/documents/{id}/versions` | POST | Upload new version |
| `/v1/documents/{id}/tags` | POST | Add/remove tags |
| `/v1/documents/standards/seed` | POST (admin) | Import baseline RT/EN templates |

### Upload Sequence
1. Client requests `POST /v1/documents/upload-url` with filename, size, MIME
2. API calls Supabase storage to create signed URL
3. Client uploads file directly to storage
4. Client calls `POST /v1/documents` with metadata + storage path
5. API writes rows to `documents` + `document_versions` and updates `current_version_id`

### Preview Endpoint
```http
GET /v1/documents/{id}/preview
Response:
{
  "document_id": "...",
  "version": 3,
  "preview_url": "https://storage.supabase.co/.../token",
  "expires_at": "2026-01-03T12:34:56Z",
  "content_type": "application/pdf"
}
```

Frontend loads PDF.js component with `preview_url`.

---

## 🧰 Technology Choices

- **FastAPI + httpx** for backend
- **Supabase Python client** for storage + Postgres
- **Azure/AWS-compatible signed URLs** (Supabase Storage)
- **Mozilla PDF.js** for preview in web apps
- **Optional**: pdf2image / PyMuPDF to generate thumbnails server-side

---

## ⏱️ Implementation Roadmap

| Day | Deliverable |
|-----|-------------|
| Day 1 | Supabase schema migration + storage buckets |
| Day 2 | FastAPI service skeleton + upload URL endpoint |
| Day 3 | Metadata endpoints + version history |
| Day 4 | Preview endpoint + PDF.js integration in frontend |
| Day 5 | Tagging, access logs, seed standard templates |

---

## Seed Standard Documents

1. Export Firehorse templates to PDF (RT, EN, etc.)
2. Run seeding script:
```bash
python tools/seed_standard_documents.py \
  --bucket firehorse-documents \
  --input Firehorse/templates/pdf \
  --standard EN15978 --country FI
```
3. Documents appear under `standard-templates/{standard}/{language}/...`

---

## Next Steps
1. Apply `supabase-schema-dms.sql` in Supabase
2. Create `firehorse-documents` bucket (privacy: private)
3. Implement FastAPI service (`Firehorse/dms/main.py`)
4. Connect to Supabase using service role key (server-side)
5. Add PDF.js viewer to admin dashboard

Once backend is live we can integrate with Firehorse Automation for scheduled archival and notifications.

