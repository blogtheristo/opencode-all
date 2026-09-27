---
title: Internal organization boundary for back-office authorization
version: 1.0
date: 2026-09-27
author: GitHub Copilot CLI
language: EN
status: PENDING_REVIEW
category: security
tags: [authorization, rls, supabase, multi-tenancy, backoffice]
---

# Internal organization boundary for back-office authorization

## Document Status

- **Date:** 2026-09-27
- **Author:** GitHub Copilot CLI
- **Location:** Espoo, Finland
- **Context:** DWS IQ 6 back-office authorization and external organization onboarding
- **Last Modified:** 2026-09-27
- **Languages Available:** English
- **Publication Status:** INTERNAL

**Standards loaded:** `docs/system-config/STANDARDS_ROUTING.md`, `DWS_TRUTH_STANDARD.md`, `DWS_ROLES_REGISTRY.md`, `DWS_SECURITY_STANDARD.md`, `DWS_DOCUMENT_STANDARD.md`, `DWS_LEARNING_STANDARD.md`.

## Ontology Tags

- **Geography:** Europe > Finland
- **Sector:** Software > Multi-tenant SaaS > Administration
- **Entities:** DWS IQ 6, Supabase, PostgreSQL RLS, DWS AB
- **Temporal Context:** 2026-Q3
- **Confidence:** High

## The Story

Back-office authorization was based on active `owner` or `admin` membership in any organization. That rule was shared by the PostgreSQL `is_backoffice_admin()` RLS helper, the Express `requireBackofficeAdmin` middleware, and the dashboard bootstrap endpoint `GET /api/v1/backoffice/me`. External customer onboarding therefore turned each customer organization owner into a cross-tenant DWS back-office administrator.

Migration 096 introduces `organizations.is_internal boolean NOT NULL DEFAULT false`, marks the production organization named `DWS AB` during the same transaction when exactly one matching row exists, and guards future marker changes so only the PostgreSQL `service_role` can make them. The migration also replaces `is_backoffice_admin()` with an internal-organization join while retaining `SECURITY DEFINER` and pinning `search_path = public`.

The Express middleware and `/me` endpoint now share one lookup and calculate access only from active memberships in internal organizations. Tests cover both required outcomes: an external-organization owner receives `isAdmin: false` and is denied protected routes, while an internal-organization owner receives `isAdmin: true`.

On HIC instruction, migration 096 was applied to production through Supabase CLI on 2026-09-27. The production apply used fatal preflight and postflight checks for exactly one `DWS AB` row, completed successfully, and the remote migration history was aligned to repository version `096`.

## The Insight

Tenant role and platform role are separate authorities. An organization owner may administer that tenant, but only a server-designated internal organization may confer DWS platform administration. The internal marker must therefore remain database-controlled and must be enforced consistently in both RLS and the service-role-backed API, because either layer alone leaves a bypass surface.

## Next Steps

1. Monitor the back-office dashboard and RLS-dependent internal surfaces after PR #2143 deploys the matching API rule.
2. Run `supabase/tests/096_internal_organization_backoffice_verification.sql` against a throwaway database after migration 096.
3. **Q1 (two-way door, RECOMMEND: one internal organization):** Should DWS keep exactly one internal organization as an operational invariant, or explicitly support multiple internal organizations later? Status: PENDING_REVIEW.

## HIC Learning Outcome

- **Step 1 — KB:** N/A — the KB CLI rejected ingestion with HTTP 401 because this runtime has no KB authentication token; the field note remains the repository source.
- **Step 2 — Field note:** Complete in this document.
- **Step 3 — Learn HTML:** Rendered to `Learn/2026-09-27-internal-organization-backoffice-boundary.html`.
- **Step 4 — Drive export:** N/A — no Google Drive tool is available in this runtime.
- **Step 5 — HIC decision:** Q1 is queued above with `Status: PENDING_REVIEW`.
- **Step 6 — Calendar:** N/A — the change introduces no dated commitment; production apply is event-driven and HIC-controlled.

---

Version 1.0 · 2026-09-27
Copyright © 2026 Lifetime Oy. Internal.
