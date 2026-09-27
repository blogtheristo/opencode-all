<!-- Evidence: Tool=GitHub Copilot CLI 1.0.88 Model=openai/gpt-5.6-sol Agent=lane-c-coverage Date=2026-09-27 -->
<!-- Audit trail: git log -- docs/field-notes/2026-09-30-copilot-coverage-gaps.md -->

# Copilot coverage gaps — security and billing

---

# VERSION AND AGENT HISTORY

Version: 1.2 [Latest]

Sessions & Modifications:

- Version: 1.2 [Latest] | Tool: GitHub Copilot CLI 1.0.88 | Model: openai/gpt-5.6-sol | Session: lane-c-coverage | Date: 27.09.2026 | Changes: Rebased the final coverage report onto the merged C2 and C3 work, reran the complete suite, and replaced isolated-branch measurements with combined results. | Harness: GitHub Copilot CLI + CLAUDE.md + AGENTS.md + matched DWS standards | HIC-approved-drift: none
- Version: 1.1 | Tool: GitHub Copilot CLI 1.0.88 | Model: openai/gpt-5.6-sol | Session: lane-c-coverage | Date: 27.09.2026 | Changes: Reran repository coverage and added authentication-boundary coverage for the admin cost-audit routes. | Harness: GitHub Copilot CLI + CLAUDE.md + AGENTS.md + matched DWS standards | HIC-approved-drift: none
- Version: 1.0 | Tool: GitHub Copilot CLI 1.0.88 | Model: openai/gpt-5.6-sol | Session: opencode/lane-c-coverage | Date: 27.09.2026 | Changes: Measured `src/` coverage, ranked the ten lowest-covered security and billing files, and added tests for the top three. | Harness: GitHub Copilot CLI + CLAUDE.md + AGENTS.md + matched DWS standards | HIC-approved-drift: none

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
- **System:** TypeScript backend security and billing test coverage
- **Location:** Finland / DGX development environment
- **Requested artifact:** `docs/field-notes/2026-09-30-copilot-coverage-gaps.md`
- **Measurement date:** 27.09.2026

## Ontology Tags

- **Geography:** EU > Finland
- **Sector:** Enterprise_Software > Security_and_Billing > Test_Coverage
- **Entities:** DWS-IQ6, Vitest, Stripe, PayPal, Cloudflare Workers, Supabase
- **Temporal Context:** 2026-Q3
- **Confidence:** High

## The Story

The first full coverage attempt was blocked by inherited Git configuration variables in four poisoned-tree fixture suites. A clean-environment retry reached the application suites but hit one pre-existing five-second timeout in `src/__tests__/agents/aegis.test.ts`. The authoritative measurement therefore ran the remaining suite with that one flaky test file explicitly excluded: 157 test files passed, four were skipped, 1,615 tests passed, and 33 were skipped.

Before the new tests, `src/` coverage was 32.81% statements, 26.96% branches, 36.91% functions, and 33.05% lines. The ten lowest-covered security or billing files were all at 0% line coverage; ranking ties by uncovered executable lines produced:

| Rank | File                                         | Executable lines | Covered before |
| ---: | -------------------------------------------- | ---------------: | -------------: |
|    1 | `src/cloudflare/billing-integration.ts`      |              184 |             0% |
|    2 | `src/routes/payment.routes.ts`               |              144 |             0% |
|    3 | `src/routes/b2b-payment.routes.ts`           |              127 |             0% |
|    4 | `src/routes/stripe-webhook.routes.ts`        |              122 |             0% |
|    5 | `src/services/billing.service.ts`            |               94 |             0% |
|    6 | `src/autoresearch/kya-tuner.ts`              |               76 |             0% |
|    7 | `src/identity/kya-engine.ts`                 |               66 |             0% |
|    8 | `src/services/redis-rate-limiter.service.ts` |               63 |             0% |
|    9 | `src/middleware/rate-limiter.middleware.ts`  |               59 |             0% |
|   10 | `src/routes/admin-cost-audit.routes.ts`      |               59 |             0% |

Three new suites add 18 behavior tests. They cover the Cloudflare billing worker's public routing, usage aggregation, unsigned-webhook rejection, missing-billing failures, and scheduled error isolation; the payment proxy's authentication, validation, verified-identity forwarding, and HMAC webhook path; and the B2B routes' authentication boundary, profile creation/listing, ownership filter, and no-op event behavior.

Lane C2–C4 adds 31 behavior tests across the billing worker and five C3 targets. The final admin suite proves that all three cost-audit endpoints reject unauthenticated callers before reading audit data. After rebasing onto the merged C2 and C3 changes, the complete rerun measured 35.17% statements, 29.03% branches, 39.26% functions, and 35.47% lines. The original ten targets measured:

| File                                         | Lines covered after |    Change |
| -------------------------------------------- | ------------------: | --------: |
| `src/cloudflare/billing-integration.ts`      |     43.58% (85/195) | +43.58 pp |
| `src/routes/payment.routes.ts`               |     43.75% (63/144) | +43.75 pp |
| `src/routes/b2b-payment.routes.ts`           |     39.09% (43/110) | +39.09 pp |
| `src/routes/stripe-webhook.routes.ts`        |     24.59% (30/122) | +24.59 pp |
| `src/services/billing.service.ts`            |      46.80% (44/94) | +46.80 pp |
| `src/autoresearch/kya-tuner.ts`              |        0.00% (0/76) |  +0.00 pp |
| `src/identity/kya-engine.ts`                 |      65.15% (43/66) | +65.15 pp |
| `src/services/redis-rate-limiter.service.ts` |        0.00% (0/63) |  +0.00 pp |
| `src/middleware/rate-limiter.middleware.ts`  |     100.00% (59/59) |   +100 pp |
| `src/routes/admin-cost-audit.routes.ts`      |       10.16% (6/59) | +10.16 pp |

The billing-worker denominator increased from 184 to 195 executable lines because the C2 allowlist implementation replaced wildcard CORS. The B2B denominator is now 110 executable lines under the current coverage instrumentation.

The repository-wide coverage thresholds remain unmet: 60% statements, 50% branches, 55% functions, and 60% lines. This is existing debt, not a failure introduced by the new tests.

## The Insight

Percentage-only ranking hides risk. Sorting equal-zero files by uncovered executable lines surfaced the billing worker and payment routes first. The combined lane now covers 373 executable lines across the ten ranked targets, including complete line coverage of the in-memory rate limiter. C2 also closed the billing worker's wildcard-CORS risk with an explicit production allowlist. The remaining architectural risk is that the B2B webhook accepts events without an endpoint-local signature check; changing that behavior requires an explicit integration decision because it can break deployed webhook callers.

## Verification

- Lane C2–C4 additions: 31 behavior tests across six target suites.
- Admin-focused suite: three tests passed.
- TypeScript typecheck: passed.
- Full Vitest run: 172 files passed, four skipped; 1,757 tests passed, 33 skipped.
- Full coverage run completed all test files and exited non-zero only because the repository-wide thresholds remain unmet.
- Final coverage: 35.17% statements (9,648/27,430), 29.03% branches (5,455/18,785), 39.26% functions (1,666/4,243), and 35.47% lines (9,109/25,675).
- Generated report: `coverage/coverage-summary.json` (local ignored artifact, not committed).

## Next Steps

**Q1 (two-way door; RECOMMEND: yes):** Should the next security slice add endpoint-local signature verification to `/api/v1/b2b/webhook`, with compatibility tests for deployed callers?

## Learning-outcome steps

- Step 1 — KB: N/A — coverage percentages are branch-scoped engineering measurements, not durable domain facts.
- Step 2 — Field note: this document.
- Step 3 — Learn HTML: generated as `Learn/2026-09-30-copilot-coverage-gaps.html`.
- Step 4 — Drive export: N/A — no Google Drive tool is available in this session.
- Step 5 — HIC decision: Q1 above, queued as `PENDING_REVIEW`.
- Step 6 — Calendar: N/A — no new dated commitment was created; the work-order cutoff remains recorded in its canonical handoff.

---

Version 1.2 | 27.09.2026 | © 2026 Lifetime Oy | INTERNAL
