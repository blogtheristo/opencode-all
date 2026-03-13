# V1 Aiven Plan Decision — Developer + Startup

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code | Session: claude/amazon-ses-google-drive | Date: 10.03.2026 | Changes: Decision to use Aiven Developer + Startup for V1 EU-sovereign migration

Document Status:
  - Created: 10.03.2026
  - Last Modified: 10.03.2026
  - Language: English
  - Publication Status: ACTIVE

***

## Decision

**For V1 EU-sovereign migration:** Use Aiven **Developer** ($5/mo) and **Startup** ($75/mo) plans.

| Plan | Use Case | Price | Resources |
|------|----------|-------|-----------|
| **Developer** | Dev/staging, lighter workloads | $5/mo | 8 GB storage, 1 GB RAM, 1 CPU |
| **Startup** | Production | $75/mo | 99.99% SLA, HA options |

**Total:** ~$80/mo for V1 database layer (vs Supabase Pro $25/mo for MVP).

## Rationale

- **Developer** — Cost-effective for non-production; always on (no power-off when idle)
- **Startup** — Production-grade SLA, high availability for customer data
- **EU sovereignty** — Aiven is Finnish (Helsinki), ISO 27001, no CLOUD Act exposure
- **pgvector** — Same extension as Supabase; minimal migration friction

## V1 Feature List

Added to V1_FEATURE_LIST.md as **Category 11: V1 EU-Sovereign Migration**.

## Related

- DWS_SOVEREIGNTY_STANDARD.md — Section 5 (Aiven analysis), Section 6 (Suositus)
- V1_FEATURE_LIST.md — Category 11 (Aiven migration track)
- docs/field-notes/2026-02-16-zvec-embedded-vector-db-european-alternatives.md

---

(c) 2026 Lifetime Oy — Field Note
