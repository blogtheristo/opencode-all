# Copilot coverage gaps — security and billing

---

# VERSION AND AGENT HISTORY

Version: 1.0 [Latest]

Sessions & Modifications:

- Version: 1.0 [Latest] | Tool: GitHub Copilot CLI 1.0.88 | Model: openai/gpt-5.6-sol | Session: opencode/lane-c-coverage | Date: 27.09.2026 | Changes: Measured `src/` coverage, ranked the ten lowest-covered security and billing files, and added tests for the top three. | Harness: GitHub Copilot CLI + CLAUDE.md + AGENTS.md + matched DWS standards | HIC-approved-drift: none

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

After the tests, coverage increased to 33.50% statements, 27.48% branches, 37.40% functions, and 33.75% lines. The three target files reached:

| File                                    | Lines covered after |    Change |
| --------------------------------------- | ------------------: | --------: |
| `src/cloudflare/billing-integration.ts` |     40.21% (74/184) | +40.21 pp |
| `src/routes/payment.routes.ts`          |     43.75% (63/144) | +43.75 pp |
| `src/routes/b2b-payment.routes.ts`      |     33.85% (43/127) | +33.85 pp |

The repository-wide coverage thresholds remain unmet: 60% statements, 50% branches, 55% functions, and 60% lines. This is existing debt, not a failure introduced by the new tests.

## The Insight

Percentage-only ranking hides risk. Sorting equal-zero files by uncovered executable lines surfaced the billing worker and payment routes first, which added 180 covered lines in one bounded change. The tests also made two architectural risks visible without silently changing production behavior: the B2B webhook accepts events without an endpoint-local signature check, and the Cloudflare billing worker exposes broad CORS headers. Both require an explicit integration decision because changing them can break deployed webhook or browser clients.

## Verification

- New focused suites: 3 files, 18 tests passed.
- TypeScript build: passed before the final full coverage rerun.
- Full coverage run excluding one pre-existing flaky Aegis suite: 157 files passed, four skipped; 1,615 tests passed, 33 skipped.
- Final coverage: 33.50% statements, 27.48% branches, 37.40% functions, 33.75% lines.
- Generated report: `coverage/coverage-summary.json` (local ignored artifact, not committed).

## Next Steps

**Q1 (two-way door; RECOMMEND: yes):** Should the next security slice add endpoint-local signature verification to `/api/v1/b2b/webhook` and replace wildcard CORS in the Cloudflare billing worker with an explicit production-origin allowlist, with compatibility tests for deployed callers?

## Learning-outcome steps

- Step 1 — KB: N/A — coverage percentages are branch-scoped engineering measurements, not durable domain facts.
- Step 2 — Field note: this document.
- Step 3 — Learn HTML: generated as `Learn/2026-09-30-copilot-coverage-gaps.html`.
- Step 4 — Drive export: N/A — no Google Drive tool is available in this session.
- Step 5 — HIC decision: Q1 above, queued as `PENDING_REVIEW`.
- Step 6 — Calendar: N/A — no new dated commitment was created; the work-order cutoff remains recorded in its canonical handoff.

---

Version 1.0 | 27.09.2026 | © 2026 Lifetime Oy | INTERNAL
