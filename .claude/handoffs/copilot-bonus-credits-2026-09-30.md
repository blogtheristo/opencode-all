# Copilot Work Order — Bonus-Credit Burn to 30.09.2026

Version: 1.10 [Latest]

Sessions & Modifications:

- Version: 1.10 [Latest] | Tool: GitHub Copilot CLI 1.0.88 | Session: docs/session5-audit-20260927 | Date: 27.09.2026 | Changes: Session 5 reviewer audit; merged approved documentation PRs #2150, #2153, and #2155, held #2156, and recorded five follow-up findings in previously merged work.
- Version: 1.9 [not latest] | Tool: GitHub Copilot CLI 1.0.88 | Session: opencode/copilot-post-merge-log | Date: 27.09.2026 | Changes: Verified external merges of #2148 and #2152, updated Lane C status, and reran focused tests on merged main.
- Version: 1.8 [not latest] | Tool: GitHub Copilot CLI 1.0.88 | Session: opencode/copilot-bonus-log-b1-b4 | Date: 27.09.2026 | Changes: Recorded completed Lane C coverage measurement and tests.
- Version: 1.7 [not latest] | Tool: GitHub Copilot CLI 1.0.88 | Session: opencode/copilot-bonus-log-b1-b4 | Date: 27.09.2026 | Changes: Recorded completed Lane B11 stale-PR triage.
- Version: 1.6 [not latest] | Tool: GitHub Copilot CLI 1.0.88 | Session: opencode/copilot-bonus-log-b1-b4 | Date: 27.09.2026 | Changes: Recorded completed Lane B10 site-PR reconciliation.
- Version: 1.5 [not latest] | Tool: GitHub Copilot CLI 1.0.88 | Session: opencode/copilot-bonus-log-b1-b4 | Date: 27.09.2026 | Changes: Recorded completed Lane B5-B9 backlog work.
- Version: 1.4 [not latest] | Tool: GitHub Copilot CLI 1.0.88 | Session: opencode/copilot-bonus-log-b1-b4 | Date: 27.09.2026 | Changes: Recorded completed Lane B1-B4 backlog work and final Lane D validation.
- Version: 1.3 [not latest] | Tool: Claude Code | Session: opencode/lane-d-dgx-persistence | Date: 27.09.2026 | Changes: Merged main into #2144; kept the §5 log and added rows D1–D2 (#2144) and the admin-scoping fix (#2143). Folds in the Lane D entry: "Completed Lane D inventory and migrated the top three scheduled workflows to DGX-primary execution" (GitHub Copilot CLI 1.0.88).
- Version: 1.2 [not latest] | Tool: Claude Code | Session: claude/copilot-pro-bonus-credits-9jptij | Date: 27.09.2026 | Changes: Added §5 Execution log (Lane A run, verified against PRs and main); #2139, which carried Copilot's own log, was closed unmerged.
- Version: 1.1 [not latest] | Tool: Claude Code | Session: claude/copilot-pro-bonus-credits-9jptij | Date: 27.09.2026 | Changes: HIC decision — use the $210 credit in full; persistent work lands on DGX (`DWS_COST_POLICY_STANDARD.md` v1.1). Budget confirmed from GitHub billing page; Lane D added.
- Version: 1.0 [not latest] | Tool: Claude Code | Session: claude/copilot-pro-bonus-credits-9jptij | Date: 27.09.2026 | Changes: Initial work order. HIC moved use cases 1–3 to GitHub Copilot (GPT-5.6), budget 21,000 bonus credits, deadline 30.09.2026 23:59 UTC.

---

## 0. Scope and budget

- **Executor:** GitHub Copilot coding agent, model GPT-5.6 (HIC choice, 27.09.2026). Model name not verified by this session.
- **Budget:** $210.00 Copilot promotional credit = 21,000 AI credits (1 credit = $0.01). GitHub billing page, HIC screenshot 27.09.2026: $0 of it applied so far. HIC decision: use all of it. Per-request cost of GPT-5.6 is not known here; the split below is by share. Stop each lane when its share is spent; stop all work at $210 (no paid overage).
- **Deadline:** 30.09.2026 23:59 UTC (email) / 01.10.2026 (billing page). Plan to the earlier one. Unused credit is lost.
- **Persistence Rule:** Copilot delivers one-off output only. Anything that must keep running (cron, agent, service, state store, recurring pipeline) is delivered as DGX-deployable code — DGX cron, DGX runner or DGX service — never as a GitHub Actions schedule or cloud runtime.
- **Output rule:** One PR per work item, base `main`, never auto-merge. HIC or Claude Code reviews and merges.
- **Out of bounds for Copilot (RED):** applying Supabase migrations, merging anything that edits `dws10.com/config/products.json` (prices go live on merge), publishing or merging blog posts (Rule 13), sending any outreach, touching secrets or `.env*`, force-push.

## 1. Corrections to the 26.09 proposal (checked 27.09)

- #2064 and #2002 are no longer open → removed from lane 1.
- KYA tool-call gate and attestation stub already have tests (`src/__tests__/tools-kya-verdict.test.ts`, `src/__tests__/verified-done-attestation.test.ts`) → lane 3 retargeted to the open KYA PRs.
- The `user_metadata.role` gap already has three open PRs (#2016, #2035, #2075) → lane 2 is consolidate-and-finish, not a new fix.

## 2. Work list

### Lane A — Security: server-owned dashboard roles (35 % ≈ 7,350 credits) — do first

| #   | Item                                                                                                                                                                                                                                                                                                                                                       | Done when                                                                                                 |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| A1  | Consolidate #2016, #2035, #2075 into one PR from fresh `main`: page gates in `dws6.com/dashboard/{backoffice,control-room,situation-room}/`, `admin/backoffice/`, `dashboard/index.html` use `GET /api/v1/backoffice/me` (server check on `organization_members`) instead of `user_metadata.role`. Mirror to `landing-pages/dws6-com/` in the same commit. | No `user_metadata.role` read in any gate (`grep` clean); case-insensitive section match; `npm test` green |
| A2  | Add tests for `/api/v1/backoffice/me`: non-member → `isAdmin:false`, member → `true`, spoofed `user_metadata.role` → `false`.                                                                                                                                                                                                                              | Tests fail on old code, pass on new                                                                       |
| A3  | Close #2016, #2035, #2075 as superseded, linking A1.                                                                                                                                                                                                                                                                                                       | Old PRs closed with pointer                                                                               |

### Lane B — PR backlog drain (40 % ≈ 8,400 credits)

Source: `.claude/handoffs/pr-backlog-2026-09-25.md`. Merge `main` into each branch (no rebase), fix, push, leave for review.

| #   | PR(s)                                                                              | Work                                                                                      | Done when                                                       |
| --- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| B1  | #2131, #2130                                                                       | ABB claims wording + docs: run `scripts/lint-truth-claims.mjs`                            | Truth-lint + CI green                                           |
| B2  | #2129, #2127, #2126, #2124, #2123, #2057                                           | Field notes: resolve conflicts, format with Prettier                                      | CI green, mergeable                                             |
| B3  | #2125                                                                              | Jev field notes + `/browse` step-advisor pilot: code review + tests                       | `npm test` green                                                |
| B4  | #2113, #2112                                                                       | Dependency security batches: verify pins, run tests                                       | CI green, no new advisories                                     |
| B5  | #2109                                                                              | AGENTS.md auto-sync: regenerate from `main`                                               | Mergeable                                                       |
| B6  | #1993                                                                              | KYA-S1 conformance baseline: bring up to `main`, keep the three corrected assertions      | Tests green                                                     |
| B7  | #1716                                                                              | KYA v2.0 attestation signing: bring up to `main`, confirm migration number free after 091 | Tests green; migration file only, not applied                   |
| B8  | #2009                                                                              | External auth + migration 080: renumber to next free, standard GRANT + RLS block          | `filename` + soak checks green; not applied                     |
| B9  | #1762, #1836                                                                       | Model routing (`src/agents/llm-client.ts`, `opencode.json`): resolve conflicts            | Typecheck + tests green                                         |
| B10 | #2022, #2021, #1829                                                                | Site PRs (Aegis 5-lang, i18n, contact form): conflicts + dual-folder sync                 | Root and `landing-pages/` identical; no `.md` in public folders |
| B11 | #2004, #2034, #1990, #1769, #1782, #1759, #1498, #1549, #1837, #1830, #1828, #1819 | Docs/draft PRs: bring up to `main` or report "stale — recommend close" in a PR comment    | Each PR has green CI or a close recommendation                  |

### Lane C — Test coverage (15 % ≈ 3,150 credits)

| #   | Item                                                                                                                | Done when                                                                  |
| --- | ------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| C1  | Coverage report for `src/` (`npm test -- --coverage`); list the 10 least-covered files on security or billing paths | Report committed to `docs/field-notes/2026-09-30-copilot-coverage-gaps.md` |
| C2  | Add tests for the top 3 files from C1                                                                               | Tests merged-ready, green                                                  |

### Priority switch (decided 27.09.2026)

If less than $100 of the credit is spent by 29.09 at 18:00 UTC, run Lane D before the remaining Lane B items. Lane A always goes first. Reasons: Lane D stops recurring GitHub Actions cost, while Lane B can move to OpenCode on DGX at no cloud cost. See `docs/field-notes/2026-09-27-copilot-credit-dgx-persistence.md` §5.

### Lane D — Move persistent cloud work to DGX (from reserve if A–C finish early)

| #   | Item                                                                                                                                                                                                                                    | Done when                                                                              |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| D1  | Inventory every scheduled GitHub Actions workflow (`on: schedule`) and bot PR generator (e.g. the AGENTS.md auto-sync behind #2109); list each with its DGX target (DGX cron path under `scripts/{daily,weekly,hourly}/` or DGX runner) | Table committed to `docs/field-notes/2026-09-30-cloud-to-dgx-persistence-inventory.md` |
| D2  | For the top 3 by run count, write the DGX cron entry + script and switch the workflow to `workflow_dispatch` only                                                                                                                       | Scripts run locally; workflow no longer scheduled                                      |

### Reserve (10 % ≈ 2,100 credits)

Review fixes on Lane A–C PRs. Spend nothing new from reserve after 30.09 18:00 UTC.

## 3. HIC-only items (not for Copilot)

- #2096, #2054, #2122 — `products.json` pricing: HIC approves before merge.
- #2086 — lifetime.fi homepage proposal: marked "do not merge yet".
- #2121, #1810, #1495 — blog/journal content: Rule 13 approval.
- #1643, #2060 — sales/GTM positioning: HIC decision.
- Applying migrations from B7, B8: RED.

## 4. Audit

Log each Copilot PR number against its lane in this file. Per `DWS_COST_POLICY_STANDARD.md`, cloud-agent use in the window needs this trail. After 30.09, verify every claimed PR exists (`git log`, PR list) — earlier Copilot summaries contained fabricated PR numbers (see `.claude/handoffs/` audit note).

## 5. Execution log

Verified by Claude Code on 27.09.2026 against the PR list, PR comments and `git log origin/main`. Copilot session 1 ran GitHub Copilot CLI 1.0.88 with `openai/gpt-5.6-sol` (provenance headers), under an 18,000-token cap. Credit use is not visible from the repo; read it from the GitHub billing page.

| Item              | PR                                                      | Status                      | Tests                                           | Note                                                                                                                                                                                                     |
| ----------------- | ------------------------------------------------------- | --------------------------- | ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A1                | [#2138](https://github.com/blogtheristo/dws6/pull/2138) | merged `f3f5669`            | green locally (9/9 backoffice tests, typecheck) | `GET /api/v1/backoffice/me`; five dashboard gates use it; `landing-pages/dws6-com/` mirrored. CI `test`/`lint` skipped: no runner picks up jobs. Claude Code resolved a conflict with #2137 (`ffb2d63`). |
| A2                | [#2138](https://github.com/blogtheristo/dws6/pull/2138) | merged `f3f5669`            | green locally                                   | Non-member, admin member, spoofed `user_metadata.role` cases.                                                                                                                                            |
| A3                | #2016, #2035, #2075                                     | commented                   | n/a                                             | "Superseded by #2138" confirmed on #2016. PRs left open.                                                                                                                                                 |
| — (outside order) | [#2137](https://github.com/blogtheristo/dws6/pull/2137) | merged `3c84001`            | not run in CI                                   | Old 1–3 list: KYA tests + `CLAUDE.md` path fix. Its misplaced version row was corrected in #2142.                                                                                                        |
| — (outside order) | [#2135](https://github.com/blogtheristo/dws6/pull/2135) | merged `a77fb28`            | not run in CI                                   | Weekly public truth drift audit (issue #1846). Its GHA schedule was removed in #2145 (Persistence Rule); DGX runs it weekly.                                                                             |
| —                 | [#2139](https://github.com/blogtheristo/dws6/pull/2139) | closed unmerged             | n/a                                             | Copilot's own execution log; replaced by this section.                                                                                                                                                   |
| —                 | [#2141](https://github.com/blogtheristo/dws6/pull/2141) | closed, superseded by #2145 | n/a                                             | Duplicate drift-audit implementation.                                                                                                                                                                    |
| D1                | [#2144](https://github.com/blogtheristo/dws6/pull/2144) | merged `60c173b`            | green locally                                   | Inventory of scheduled workflows: `docs/field-notes/2026-09-30-cloud-to-dgx-persistence-inventory.md`.                                                                                                   |
| D2                | [#2144](https://github.com/blogtheristo/dws6/pull/2144) | merged `60c173b`            | green locally                                   | `cost-audit-sync`, `dora-weekly`, `flake-detector`: GHA `schedule:` removed, DGX scripts in `scripts/{daily,weekly}/`, workflows manual-dispatch only.                                                   |
| B1                | [#2131](https://github.com/blogtheristo/dws6/pull/2131), [#2130](https://github.com/blogtheristo/dws6/pull/2130) | merged | green | Both ABB truth-claims PRs had already merged with successful truth-lint and check histories; no branch update was needed. |
| B2                | [#2129](https://github.com/blogtheristo/dws6/pull/2129), [#2127](https://github.com/blogtheristo/dws6/pull/2127), [#2126](https://github.com/blogtheristo/dws6/pull/2126), [#2124](https://github.com/blogtheristo/dws6/pull/2124), [#2123](https://github.com/blogtheristo/dws6/pull/2123), [#2057](https://github.com/blogtheristo/dws6/pull/2057) | updated | green locally | Merged current `main`, resolved formatting where required, and pushed all six branches after local pre-push CI. |
| B3                | [#2125](https://github.com/blogtheristo/dws6/pull/2125) | updated | green locally | Hardened malformed snapshot handling, capped browse history, removed redundant runner detection, added regressions, and pushed. |
| B4                | [#2113](https://github.com/blogtheristo/dws6/pull/2113), [#2112](https://github.com/blogtheristo/dws6/pull/2112) | updated | green locally | Updated Redis/PyJWT resolution; repaired dashboard lock metadata, verified the ARM build and mirror parity, and reached zero npm production advisories. |
| B5                | [#2109](https://github.com/blogtheristo/dws6/pull/2109) | updated | green locally | Regenerated AGENTS.md from current `main`; freshness grade A (82/89, seven existing warnings). |
| B6                | [#1993](https://github.com/blogtheristo/dws6/pull/1993) | updated | green locally | Preserved all three corrected KYA-S1 assertions; 32/32 focused tests and full local pre-push CI passed. |
| B7                | [#1716](https://github.com/blogtheristo/dws6/pull/1716) | updated | green locally | Reconciled KYA v2.0 with the later ATS formula; 51/51 focused tests and build passed. No migration is added or applied by this PR. |
| B8                | [#2009](https://github.com/blogtheristo/dws6/pull/2009) | updated | green locally | Preserved the strict address allowlist, removed client-selected role escalation, restored dual-folder parity, and retained #2147's archived duplicate migrations. |
| B9                | [#1762](https://github.com/blogtheristo/dws6/pull/1762), [#1836](https://github.com/blogtheristo/dws6/pull/1836) | updated | green locally | Added explicit Baseten endpoint routing without default-slate promotion; reconciled OpenCode config with Nemotron primary and Qwen coder fallback. |
| B10               | [#2022](https://github.com/blogtheristo/dws6/pull/2022), [#2021](https://github.com/blogtheristo/dws6/pull/2021), [#1829](https://github.com/blogtheristo/dws6/pull/1829) | updated | green locally | Removed superseded truncated Aegis locale pages and stale i18n rollout drafts; retained the verified structured contact-email send path and restored briefing mailto actions. Root/mirror files match, and pricing catalogs are unchanged from `main`. |
| B11               | [#2004](https://github.com/blogtheristo/dws6/pull/2004), [#2034](https://github.com/blogtheristo/dws6/pull/2034), [#1990](https://github.com/blogtheristo/dws6/pull/1990), [#1769](https://github.com/blogtheristo/dws6/pull/1769), [#1782](https://github.com/blogtheristo/dws6/pull/1782), [#1759](https://github.com/blogtheristo/dws6/pull/1759), [#1498](https://github.com/blogtheristo/dws6/pull/1498), [#1549](https://github.com/blogtheristo/dws6/pull/1549), [#1837](https://github.com/blogtheristo/dws6/pull/1837), [#1830](https://github.com/blogtheristo/dws6/pull/1830), [#1828](https://github.com/blogtheristo/dws6/pull/1828), [#1819](https://github.com/blogtheristo/dws6/pull/1819) | stale — recommend close | review not applicable | Posted evidence-based close recommendations for all twelve superseded, mixed-scope, or obsolete branches; no PR was closed or merged. |
| C1                | [#2152](https://github.com/blogtheristo/dws6/pull/2152) | merged `4a889b5` | coverage measured | Recorded the ten lowest-covered security/billing files. Baseline was 33.05% lines; final suite coverage is 33.75% lines. |
| C2                | [#2152](https://github.com/blogtheristo/dws6/pull/2152) | merged `4a889b5` | green locally + post-merge | Added 18 tests for the top three files; target line coverage rose from 0% to 40.21%, 43.75%, and 33.85%. Full local pre-push CI and 18/18 tests on merged `main` passed. |
| Post-session HIC merges | [#2148](https://github.com/blogtheristo/dws6/pull/2148), [#1829](https://github.com/blogtheristo/dws6/pull/1829), [#1762](https://github.com/blogtheristo/dws6/pull/1762), [#2152](https://github.com/blogtheristo/dws6/pull/2152) | merged externally | post-merge tests green | These PRs were merged after the prior status check. Lane C files and log are present on current `main`; the three focused suites passed 18/18 on merged `main`, and `npm run build` passed. No Copilot auto-merge was used. |
| Admin scope       | [#2143](https://github.com/blogtheristo/dws6/pull/2143) | merged `e421737`            | green locally (11/11 backoffice tests)          | Back-office admin limited to `organizations.is_internal`; migration 096 applied to production on HIC instruction.                                                                                        |

### Session 5 audit — 27.09.2026

| PR | Merged (SHA) / held / needs-HIC / stale | Evidence | Note |
| --- | --- | --- | --- |
| [#2155](https://github.com/blogtheristo/dws6/pull/2155) | merged `b82f0bb` | Tested head `6ceb5cb`; clean merge tree; TypeScript clean; 164/164 test files and 1,687/1,687 tests passed | Documentation-only reconciliation. This audit supersedes its incomplete status summary: #1836 was also merged, and B2–B10 entries that still say `updated` are historical pre-merge states. |
| [#2153](https://github.com/blogtheristo/dws6/pull/2153) | merged `082af79` | Tested head `4407842`; clean merge tree; TypeScript clean; 164/164 test files and 1,687/1,687 tests passed; truth lint 0 fail / 0 warn | Draft ABB audit preserved for HIC review; no runtime or public-site changes. |
| [#2150](https://github.com/blogtheristo/dws6/pull/2150) | merged `31382e3` | Tested head `e400de3`; clean merge tree; TypeScript clean; 164/164 test files and 1,687/1,687 tests passed | Admin-only record of the Actions billing outage and DGX CI decision. |
| [#2156](https://github.com/blogtheristo/dws6/pull/2156) | held | Owner hold in Session 5 handover; head `04c1259` unchanged | Do not merge until the owner confirms OpenClaw Phase 1 is complete. |
| [#2009](https://github.com/blogtheristo/dws6/pull/2009) | needs-HIC | `dws6.com/shared/js/auth-handler.js:339-343,564-573`; `dws6.com/shared/js/supabase-client.js:161-169`; `dws6.com/login/index.html:639-641` | **High:** OAuth callback copies a URL/session-storage role into editable user metadata; roles outside the two-name privileged blocklist remain client-authorizable. Follow-up must move every protected role to server-owned entitlement data. |
| [#2144](https://github.com/blogtheristo/dws6/pull/2144) | needs-HIC | `infrastructure/dgx-spark/day-runner.sh:70-80,213-245` | **High:** `run_script` logs failures but returns success, and callers always write completion markers. Failed daily/weekly/hourly jobs can be suppressed until the next period. |
| [#1716](https://github.com/blogtheristo/dws6/pull/1716) | needs-HIC | `src/identity/attestation-issuance.ts:60-77`; `src/identity/attestation-store.ts:104-140`; migration 079 has a non-unique session/mandate index | **Medium:** credential/event persistence is non-atomic, and concurrent signing can overwrite revocation. Follow-up requires transactional/idempotent issuance and conditional state transitions. |
| [#1762](https://github.com/blogtheristo/dws6/pull/1762) | needs-HIC | `src/agents/model-selector.ts:335-402` | **Medium:** the heavy-tier catalog has no Baseten Kimi K3 entry, so endpoint resolution alone cannot select the model as the PR claimed. |
| [#1829](https://github.com/blogtheristo/dws6/pull/1829) | needs-HIC | `dws10.com/functions/api/contact.js:19-25` | **Medium:** Cloudflare KV read-then-write rate limiting is non-atomic and eventually consistent, so concurrent requests can exceed the advertised limit. |
| Session 4 Lane C/D | held | Session transcript at 27.09.2026 07:56 UTC | No PR was produced; the resumed session remained blocked before implementation. |

**Not reached in session 1:** B1–B9, C1–C2. D1–D2 are in #2144 and the admin-scoping fix is merged as #2143.

**Session 2 status:** Lanes B and C completed (B1-B11, C1-C2); #2148, #1829, #1762, and #2152 were subsequently merged by HIC/another session. Exact promotional-credit usage remains unavailable through the CLI or attempted authenticated billing endpoint. Continue under the $210 and 30.09.2026 18:00 UTC hard stops.

**Findings for the next session:**

- Commits were signed `Unit Fixture <dev@lifetime.fi>` from a repo-local git config left by the 2026-08-25 fixture leak. Fixed on DGX 27.09; rule in `CLAUDE.md` v1.5 (Tool Git Identity).
- Model choice: Luna for Lane B, Terra for C and D, Sol only for security/database work (GPT-5.6 Sol $5/$30, Terra $2.50/$15, Luna $1/$6 per million input/output tokens).
- Repo CI does not run tests right now (`detect-runner` gets no runner). Run `npm test` locally before every push.
