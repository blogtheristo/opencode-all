# DWS IQ 6 — STATUS (Rolling)

> Single source of truth for current repo/platform state. Update this file instead of
> creating new SESSION_SUMMARY_*/WEEKLY_PROGRESS_*/audit files. Historical detail lives
> in `docs/archive/` and `Admin/ADMIN_MANUAL_SESSION_DIGEST.md`.

**Last updated:** 2026-08-22 | **Maintainer:** update on every merge to main

---

## Health snapshot (2026-08-22)

| Check            | Status                                              |
| ---------------- | --------------------------------------------------- |
| Tests (`vitest`) | GREEN — 102 files / 1164 tests passed, 3 skipped    |
| Typecheck        | GREEN — `tsc --noEmit` clean (`npm run typecheck`)  |
| Backend lint     | GREEN — ESLint flat config, 0 errors / **8 warnings** (all documented exceptions; debt rules promoted to `error` — see `eslint.config.mjs` "Legacy-debt" block) |
| npm audit        | CLEAN — 0 vulnerabilities (sharp 0.35.3, nanoid fixed) |
| Local CI hook    | ACTIVE — vitest + gitleaks + npm audit + ruff on push |
| CI gates         | test-on-pr.yml: tsc + vitest + eslint + secret scan; DGX→GHA runner failover |
| Test tiers       | `test:unit` (fast gate) / `test:integration` (`tests/integration/`) / `test:coverage` (v8, thresholds 60/50/55/60) |
| Flake detection  | Weekly flake-detector.yml: suite ×3 shuffled |

## Recent changes

- **2026-08-22** — Code-quality hardening pass: replaced all 186 stray
  `console.*` calls in `src/` with the pino logger (edge-runtime
  `src/cloudflare/` and the Article-12 fallback intentionally excluded);
  eliminated the ESLint warning debt from ~766 → 8 (all remaining warnings are
  documented exceptions — static-only classes with test-coupled APIs, Express
  `namespace` type augmentation, one Cloudflare edge console) and promoted the
  paid-off rules to `error`; centralized env loading in `src/config/env.ts`
  (zod-validated, dotenv loads at first import — fixes the module-load-ordering
  bug that required pre-exported JWT_SECRET for `npm run dev`); triaged all 26
  real code TODOs into `docs/backlog/CODE_TODO_LEDGER.md`; archived dead weight
  (`worktrees_OLD/`, `merge_tmp/`, `dws6.com.backup_now/`, root
  `Blogisarja_OLD.jpg`, `_OLD` route/service files) under
  `Archive/deprecated-2026-08/`; added `standards/README.md` index (root-level
  standard docs deliberately NOT moved — 800+ name references).
- **2026-08-22** — Housekeeping pass (PR #1869): committed 54 files of pending content/docs work; removed root edit-conflict files; sharp/nanoid CVE fixes; branch audit vs stale local `main` ref (root-caused); ~40 merged branches + 25 stale worktrees removed; deprecated dirs → `Archive/deprecated-2026-8`; dated reports/audits → `docs/archive/2026/`; real backend linter wired; AGENTS.md corrected (v1.2).

## Open follow-ups

1. ~~Pay down ESLint warning debt~~ DONE 2026-08-22 (~766 → 8; paid rules promoted to `error`). Remaining 8 are documented exceptions in `eslint.config.mjs`.
2. Human decision needed: `dws6/new-pr-sovereign-session` branch (PR #1774 closed without merging).
3. Kept-but-unmerged branches with plausible unique work: `claude/mirror-sync-test-gate-x7kq` (one small SES-wording commit), `claude/v1-firehorse-recovery-NKpsn`, `claude/25-industries-company-list-tea0bb`, `claude/pki-ownership-blog-redo`, OPEN PRs #1849 / #1771.
4. Remaining root-level markdown still needs a second decluttering pass (101 files; standards + active guides kept intentionally — see `standards/README.md` for why standards stay at root).
5. Dashboard (v10-react) ESLint upstream dep issue (`parent-module`) — unresolved.
6. RESOLVED 2026-08-22: flaky `error-middleware.test.ts` tests rewritten as isolated, per-test-mock versions in the 'errorHandler sanitization (isolated)' block — no shared helpers, immune to cross-file pollution under parallelism.
7. **Direct Postgres creds stale**: `DATABASE_URL` in `.env.local` fails auth (`password authentication failed`) — the app itself uses the REST API and is unaffected. Provision fresh direct-Postgres creds to enable the RLS gate: `npm run db:test:rls` (runner + pgTAP twin in `supabase/tests/rls/`). Runner exits 2 on bad creds (fail loud, no fake green).
7. Billing TODO cluster is the largest tracked gap — 13 unwired Stripe lifecycle notifications in `docs/backlog/CODE_TODO_LEDGER.md` (Cluster 1).
