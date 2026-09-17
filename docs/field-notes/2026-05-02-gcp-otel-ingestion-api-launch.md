# Field Note: GCP Cloud Observability — New OTel Ingestion API (telemetry.googleapis.com)

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Claude Sonnet 4.6) | Session: claude/add-otel-api-docs-fU7r0 | Date: 06.05.2026 | Changes: Initial field note. Documents Google Cloud Observability OTel ingestion API launch — telemetry.googleapis.com auto-activation, impact on dws6run6 project, and required documentation updates across arch docs and admin manual.

Session Links & References:

- Source: Google Cloud Observability announcement (received 2026-05-06)
- GCP API reference: https://cloud.google.com/monitoring/api/ref_v3/rest
- OTLP spec: https://opentelemetry.io/docs/specs/otlp/
- Claude Code session branch: claude/add-otel-api-docs-fU7r0

Document Status:

- Created: 06.05.2026
- Last Modified: 06.05.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE
- Document Type: Field Note / Infrastructure Change

Related Documents:

- docs/CLOUD_ENVIRONMENTS.md (Section 7 — Full Sovereignty / Aegis)
- docs/architecture/09-PRODUCTION-DEPLOYMENT.md (Section 2.1)
- Admin/ADMIN_MANUAL.md (Google Cloud Run section)
- DWS_ARTICLE_12_LOGGING_STANDARD.md
- AgentFoundry/GOOGLE_CLOUD_RUN_SETUP.md

---

- **Date:** 06.05.2026
- **Author:** Risto Anton Päärni (risto.paarni@lifetime.fi)
- **Location:** EU — Finland
- **Context:** DWS dws6run6 Cloud Run project — Google Cloud Observability infrastructure change affecting all GCP projects.

## Ontology Tags

- **Geography:** Global > EU > Finland
- **Sector:** Cloud Infrastructure > Observability > OpenTelemetry
- **Entities:** Google Cloud, Lifetime Oy, dws6run6, telemetry.googleapis.com, logging.googleapis.com, monitoring.googleapis.com, cloudtrace.googleapis.com
- **Standards:** OpenTelemetry Protocol (OTLP), EU AI Act Article 12, DWS CLOUD_ENVIRONMENTS v2.1
- **Temporal Context:** 2026-Q2, March 4 2026 change; logged 2026-05-06
- **Confidence:** High — official Google Cloud announcement

---

## What Happened

Google Cloud announced the launch of a new unified OpenTelemetry (OTel) ingestion API endpoint:

**`telemetry.googleapis.com`**

This endpoint supports native OpenTelemetry Protocol (OTLP) for:

- Logs
- Trace spans
- Metrics

### Key Behavioural Changes

| Change                                             | Detail                                                                                                                                                                                |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Auto-activation (new projects via console/CLI)** | Starting March 4, 2026, `telemetry.googleapis.com` activates automatically whenever `logging.googleapis.com`, `cloudtrace.googleapis.com`, or `monitoring.googleapis.com` are enabled |
| **Auto-activation (existing projects)**            | All existing projects that already have any of the three legacy ingestion APIs active are being retroactively auto-enabled for `telemetry.googleapis.com`                             |
| **Projects created via API only**                  | Behaviour unchanged — these do not have ingestion APIs enabled by default; `telemetry.googleapis.com` follows the same rule                                                           |

### What Is NOT Changing

- `logging.googleapis.com`, `cloudtrace.googleapis.com`, and `monitoring.googleapis.com` continue to work as before
- Existing integrations require no migration — this is an additive dependency, not a replacement
- No billing changes announced

---

## DWS Impact

### dws6run6 (Active Cloud Run project)

The `dws6run6` project in `europe-north1` has `logging.googleapis.com` and `monitoring.googleapis.com` enabled (both granted via IAM roles `roles/logging.logWriter` and enabled in production deployment scripts). Per the announcement, **`telemetry.googleapis.com` is now auto-enabled** on this project.

This is **net positive** for DWS because:

1. **Architecture alignment:** DWS already standardises on `OTEL_EXPORTER_OTLP_ENDPOINT` env var across all Cloud Run services (see `docs/architecture/09-PRODUCTION-DEPLOYMENT.md` and `docs/architecture/03-ORCHESTRATION-LAYER.md`). The new GCP endpoint provides a first-party OTLP ingestion target that removes the need for a self-hosted OTEL Collector sidecar at the ingestion layer.

2. **Article 12 logging pipeline:** The Q2 2026 Aegis/Sovereignty roadmap (Section 7, `docs/CLOUD_ENVIRONMENTS.md`) targets OpenTelemetry integration for EU AI Act Article 12 trace collection. `telemetry.googleapis.com` can serve as the GCP-native OTLP endpoint for this pipeline, keeping telemetry data in `europe-north1` (Finland).

3. **No cost surprise:** `telemetry.googleapis.com` is a dependency auto-activation, not a new billable service launch. Existing Cloud Monitoring/Logging pricing applies.

### Sovereignty Assessment

| Criterion                | Status                                                                                                           |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| **Data residency**       | EU Finland (`europe-north1`) — compliant                                                                         |
| **CLOUD Act exposure**   | Google LLC is a US entity; same exposure as existing Cloud Logging. Sovereignty Tier 1 (Aegis) mitigations apply |
| **EU AI Act Article 12** | OTLP endpoint is suitable for Article 12 trace logging pipeline (immutable storage layer TBD separately)         |

---

## The Insight

Google is consolidating three legacy observability APIs (`logging`, `cloudtrace`, `monitoring`) under a single unified OTLP endpoint. This is the cloud vendor confirming the OTLP standard as the long-term collection protocol — the same bet DWS made when standardising `OTEL_EXPORTER_OTLP_ENDPOINT`.

**Action window:** DWS is early in OTel deployment (Q2 2026 roadmap). Updating documentation now to reference `telemetry.googleapis.com` as the first-party GCP OTLP endpoint ensures the Article 12 pipeline implementation targets the right endpoint from day one, avoiding a future migration from a self-hosted collector to the GCP-native one.

---

## Required Actions

| #   | Action                                                           | File                                            | Priority |
| --- | ---------------------------------------------------------------- | ----------------------------------------------- | -------- |
| 1   | Add `telemetry.googleapis.com` to `gcloud services enable` block | `docs/architecture/09-PRODUCTION-DEPLOYMENT.md` | HIGH     |
| 2   | Add OTel API note to Cloud Run section                           | `Admin/ADMIN_MANUAL.md`                         | HIGH     |
| 3   | Update Trace Collection row in Sovereignty section               | `docs/CLOUD_ENVIRONMENTS.md`                    | MEDIUM   |
| 4   | Add auto-activation note to quick-start guide                    | `AgentFoundry/GOOGLE_CLOUD_RUN_SETUP.md`        | LOW      |

All actions completed in the same commit as this field note (branch: `claude/add-otel-api-docs-fU7r0`).

---

## Next Steps

- [ ] When DWS implements the Article 12 Aegis logging pipeline (Q2 2026), evaluate `telemetry.googleapis.com` as the OTLP ingestion endpoint vs a self-hosted Collector — GCP-native keeps data in `europe-north1` without additional infra
- [ ] Update `OTEL_EXPORTER_OTLP_ENDPOINT` in `.env.example` when the endpoint is confirmed for production use
- [ ] Monitor Google Cloud release notes for `telemetry.googleapis.com` pricing changes (currently implied free under existing Monitoring/Logging quotas)
