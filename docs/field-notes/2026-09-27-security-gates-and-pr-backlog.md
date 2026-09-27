# Security gates and PR backlog closure — 2026-09-27

---

# VERSION AND AGENT HISTORY

Version: 1.0 [Latest]

Sessions & Modifications:

- Version: 1.0 [Latest] | Tool: GitHub Copilot CLI 1.0.88 | Model: openai/gpt-5.6-sol | Session: fix/security-gates-tests-20260927 | Date: 27.09.2026 | Changes: Recorded PR disposition, privileged browser-role hardening, and KYA/migration test coverage. | Harness: GitHub Copilot CLI + CLAUDE.md + AGENTS.md + matched DWS standards | HIC-approved-drift: none

Document Status:

- Created: 27.09.2026
- Last Modified: 27.09.2026
- Language: English
- Languages Available: English
- Publication Status: PENDING_REVIEW
- Classification: INTERNAL

---

## Context

- **Project:** DWS IQ 6
- **System:** Back-Office dashboard authorization, KYA runtime tool gate, Supabase migration 079
- **Location:** Finland / EU-hosted platform
- **Requested deadline:** Before 30.09.2026; completed and verified on 27.09.2026

## Ontology Tags

- **Geography:** EU > Finland
- **Sector:** Enterprise_Software > Security_and_Compliance
- **Entities:** DWS-IQ6, Supabase Auth, KYA, GitHub pull requests
- **Temporal Context:** 2026-Q3
- **Confidence:** High

## The Story

The open-PR list was stale. PR #2002 had already merged with its required CI checks successful. PR #2064 had been closed because its content was reapplied in #2105; #2105 merged with the audit, Definition of Done, Tree Gate, truth-lint, and deployment checks successful.

The browser role helper still returned `user.user_metadata.role`. Supabase users can edit that metadata, so a user could present `backoffice_admin` or `hub_admin` to client-side gates. The server-side Back-Office API already rejected that claim and independently required an active `organization_members` owner/admin row, so protected data was not exposed through that API. The browser gate was still misleading and unsafe as a control.

The shared role resolver now accepts `hub_admin` only from server-controlled `app_metadata`. A legacy `backoffice_admin` claim is accepted only after the browser confirms an active `organization_members` owner/admin row, matching the Back-Office API and RLS source of truth. Non-privileged legacy roles continue to resolve from `user_metadata`, avoiding an unrelated migration of all dashboard roles. Root and landing-page copies are synchronized. Tests cover both copies and reject unverified Back-Office and Mission Control claims.

KYA tests now prove that handlers are not invoked when runtime authorization requires approval or denies a call above the blast-radius ceiling. Migration 079 now has a static contract suite covering the `mandate.attest` lifecycle value, unsigned signing stub, RLS, service-role-only writes, and append-only DELETE/TRUNCATE revocations.

The standards router and `CLAUDE.md` now point to the existing `docs/DWS_COST_POLICY_STANDARD.md` path.

## The Insight

A client-side role check is navigation UX, not authorization. Privileged claims must be issued by a server-controlled source, and every sensitive API/RLS path must continue enforcing authorization independently. Security tests must verify non-execution, not merely an error-shaped response: a blocked tool handler being called would still be a breach.

## Verification

- Focused security tests: 5 files, 27 tests passed.
- Full Vitest suite with inherited Git config variables removed: 154 files passed, 4 skipped; 1,591 tests passed, 33 skipped.
- TypeScript build: passed.
- ESLint: 0 errors; 16 existing warnings.
- Evidence audit: 5 executable files compliant.
- Root/landing role helpers: functionally identical except for their audit-path header.

## Next Steps

**Q1 (two-way door; RECOMMEND: yes):** Should the remaining non-privileged dashboard roles also move from legacy `user_metadata` to server-controlled `app_metadata` in a separate migration and rollout, after confirming current user provisioning?

## Learning-outcome steps

- Step 1 — KB: N/A — no new domain fact; this implements existing Supabase authorization and KYA controls already represented in the KB.
- Step 2 — Field note: this document.
- Step 3 — Learn HTML: generated as `Learn/2026-09-27-security-gates-and-pr-backlog.html`.
- Step 4 — Drive export: N/A — no Google Drive tool is available in this session.
- Step 5 — HIC decision: Q1 above, queued as `PENDING_REVIEW`.
- Step 6 — Calendar: N/A — the only dated commitment was the 30.09.2026 completion request, completed on 27.09.2026; no future action date remains.

---

Version 1.0 | 27.09.2026 | © 2026 Lifetime Oy | INTERNAL
