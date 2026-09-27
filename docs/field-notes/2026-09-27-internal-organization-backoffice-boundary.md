---
title: Internal organization boundary for back-office authorization
version: 1.2
date: 2026-09-27
author: GitHub Copilot CLI
language: EN
status: ACTIVE
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

On HIC instruction, migration 096 was applied to production through Supabase CLI on 2026-09-27. The production apply used fatal preflight and postflight checks for exactly one `DWS AB` row, completed successfully, and the remote migration history was aligned to repository version `096`. PR #2143 merged to `main` the same day.

Because GitHub Actions is billing-blocked, the matching API rule was deployed on DGX Spark directly rather than through the `Deploy DGX Spark` workflow. That surfaced a second defect: `infrastructure/dgx-spark/Dockerfile.backend` installs dependencies with `--omit=dev` but starts the service with `npx tsx src/app.ts`, and `tsx` is a devDependency. The previously running container predated the change, so the fault only appears on a fresh build: `npx` tries to fetch `tsx` at start-up as the non-root `dws` user, which has no writable HOME, and the container crash-loops on `EACCES`. The Dockerfile now installs `tsx` explicitly at the version `package.json` declares.

Post-deploy verification against production found two active owners of `DWS AB`, who retain back-office access, and one active owner of `NCC Suomi Oy`, who is now correctly denied. That external owner held cross-tenant DWS back-office administration in production before migration 096 — the escalation was live, not merely prospective.

## The Insight

Tenant role and platform role are separate authorities. An organization owner may administer that tenant, but only a server-designated internal organization may confer DWS platform administration. The internal marker must therefore remain database-controlled and must be enforced consistently in both RLS and the service-role-backed API, because either layer alone leaves a bypass surface.

## The Verification Run

Running the suite for the first time on 2026-09-27 (throwaway `supabase/postgres:17.6.1.167`, migrations 007 → 011 → 096) surfaced three things. The migration itself was not at fault in any of them.

**1. The suite double-inserted `user_profiles` (real defect, fixed).** Migration 007 installs an `auth.users` trigger, `handle_new_user()`, which creates the matching `public.user_profiles` row automatically. The suite then inserted it again and aborted on the primary key. Fixed with `ON CONFLICT (id) DO NOTHING`, which keeps the statement meaningful on a database without that trigger.

**2. The `authenticated` UPDATE assertion could never reach the trigger (real defect, fixed).** Migration 007 defines self-referential RLS on `organization_members` — a policy *on* `organization_members` whose `USING` clause selects *from* `organization_members`. An `authenticated` UPDATE of `public.organizations` evaluates the "Org admins can update their organization" policy, which subqueries `organization_members` and raises `infinite recursion detected in policy for relation "organization_members"` before the 096 trigger is ever consulted.

This is a **pre-existing defect in migration 007, independent of this work.** It has gone unnoticed because every server path reaches these tables as `service_role`, which has its own non-recursive `USING (true)` policy, so the application never evaluates the recursive branch.

The security property still holds — an `authenticated` owner cannot set `is_internal` — but it holds via RLS failure rather than via the guard the test was written to prove. The assertion now runs as a role that bypasses RLS, which isolates the trigger and is the stronger claim: the guard is `current_user <> 'service_role'`, so passing proves even a superuser cannot set the column. A fourth assertion was added for the positive case, that `service_role` can.

**3. `auth.users` lacked `email_confirmed_at` (environment artifact, not a defect).** The Supabase Postgres image ships the pre-gotrue-migration `auth.users` skeleton, which has `confirmed_at` but not `email_confirmed_at`; real projects gain the column from a later gotrue migration. The column was added to the scratch database to match production before applying 007.

The pre-existing `organization_members` recursion is **not fixed here** — it is out of scope for this change and touching it would alter tenant-visibility semantics across every consumer of those policies. It is recorded as Next Steps item 5.

## Next Steps

1. ~~Monitor the back-office dashboard and RLS-dependent internal surfaces after PR #2143 deploys the matching API rule.~~ Done 2026-09-27: deployed on DGX Spark and verified (see The Story).
2. ~~Run `supabase/tests/096_internal_organization_backoffice_verification.sql` against a throwaway database after migration 096.~~ Done 2026-09-27: run against a throwaway `supabase/postgres:17.6.1.167` container with migrations 007 → 011 → 096 applied. All four assertions pass, exit 0. Two defects in the suite itself were found and fixed in the process — see The Verification Run.
3. **Q1 (two-way door) — DECIDED 2026-09-27 by HIC: DWS supports several internal organizations.** The marker is therefore a set membership test, not a singleton. Both enforcement points already satisfy this: `is_backoffice_admin()` uses an `EXISTS` join over every organization with `is_internal = true`, and `loadBackofficeAccess` filters memberships to all internal organizations and returns their names as a list. No code change is required. The "exactly one `DWS AB`" condition in migration 096 governs only the one-time bootstrap of the first internal organization and must not be read as a schema invariant. Additional internal organizations are flagged by `service_role` at any time.
4. Restore GitHub Actions billing so `Deploy DGX Spark`, `Tree Gate`, `DoD Gate`, `pr-security-check` and `truth-lint` run again; until then, deploys and gates are manual on DGX.
5. **Pre-existing, unfixed:** migration 007's `organization_members` RLS policies are self-referential and raise `infinite recursion detected in policy` for the `authenticated` role. Not triggered in production because server paths use `service_role`. Needs its own scoped change — rewriting the policies to avoid self-reference (for example via a `SECURITY DEFINER` membership helper) — with a review of every consumer of tenant visibility.

## HIC Learning Outcome

- **Step 1 — KB:** N/A — the KB CLI rejected ingestion with HTTP 401 because this runtime has no KB authentication token; the field note remains the repository source.
- **Step 2 — Field note:** Complete in this document.
- **Step 3 — Learn HTML:** Rendered to `Learn/2026-09-27-internal-organization-backoffice-boundary.html`.
- **Step 4 — Drive export:** N/A — no Google Drive tool is available in this runtime.
- **Step 5 — HIC decision:** Q1 answered by the HIC on 2026-09-27 — DWS supports several internal organizations. Recorded in Next Steps item 3.
- **Step 6 — Calendar:** N/A — the change introduces no dated commitment; production apply is event-driven and HIC-controlled.

---

Version 1.2 · 2026-09-27
Copyright © 2026 Lifetime Oy. Internal.
