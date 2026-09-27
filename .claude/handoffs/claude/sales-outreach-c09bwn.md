# Handoff — claude/sales-outreach-c09bwn

**Date:** 2026-09-22
**Status:** Code complete on branch, daily schedule registered. Awaiting HIC: apply migration 093 (RED zone) + first sync run.
**Parent plan:** `.claude/handoffs/claude/mission-control-ops.md`

---

## What shipped

Sales Mission Control gains a **Hilma lane** — Finnish public procurement notices
(hankintailmoitukset.fi) alongside the existing TED lane in the Sales Centre.

| File                                                 | Change                                                      |
| ---------------------------------------------------- | ----------------------------------------------------------- |
| `supabase/migrations/093_250926_hilma_tenders.sql`          | New `public.hilma_tenders` + open-tenders view, grants, RLS |
| `skills/hilma-watch/sync-to-supabase.mjs`            | Upsert scan results → `hilma_tenders` (fail-loud guards)    |
| `dws6.com/dashboard/mission-control/*`               | `fetchHilmaTenders`, `safeHilmaHref`, card link, queue wire |
| `landing-pages/dws6-com/dashboard/mission-control/*` | Dual-folder mirror (same commit)                            |
| `skills/hilma-watch/SKILL.md`                        | Mission Control section + access-vs-reachability note       |
| `scripts/daily/hilma-watch.sh`                       | Daily Mon–Sat scan + sync (HIC decision 2026-09-22)         |

## Key decisions (do not re-litigate)

- **Access rights ≠ reachability.** Hilma's `ContractNotices` search is public. The cloud session
  fails on egress policy (`ERR_TUNNEL_CONNECTION_FAILED`), not authentication. Signing in as
  `risto.paarni2024@lifetime.fi` does not make the scan run from a cloud session. That account
  matters for Mission Control access and for `tarjouspalvelu.fi` submissions.
- **Scan runs where Hilma is reachable** (DGX Spark / local), then syncs to Supabase. The dashboard
  reads the table. No agent-side scraping from cloud.
- **Scoring stays deterministic** (Rule 5): `min(100, keywordHits*10 + cpvHits*15)`, no model.
- **Re-scan never resets triage** — `status`/`notes` are excluded from the upsert payload.
- **Sync refuses on a partial run or zero notices** (exit 3) rather than reporting "no tenders".
- **Daily cadence, Mon–Sat (HIC, 2026-09-22 — revised from weekly the same day).**
  `scripts/daily/hilma-watch.sh` is auto-discovered by `day-runner.sh` (~03–06:00 UTC) — the
  directory IS the schedule. Weekly was rejected because Finnish _national_ tenders can have
  two-week response windows, so a 7-day gap could burn half of one; the run is idempotent and
  runs on free local compute, so the cost of daily is ~zero. Deliberately **no `cron-runner.ts`
  entry**: that container is `node:24-slim` with no Chromium and the scan drives Playwright.
  Runs on the DGX host. Aborts (exit 2) if Supabase env is unset.

## Verified

- `scripts/evidence-audit.mjs` — 4/4 compliant (also fixed a pre-existing block-comment header).
- `safeHilmaHref` rejects other hosts and `http:`; `fetchHilmaTenders(null)` returns `[]`.
- Deadline parser: `Määräaika: 15.10.2026 12:00` → `2026-10-15T09:00:00Z`; date-only → 23:59 local;
  no match → `null`. Partial-run guard exits 3.
- Dual folders byte-identical.

- **Pre-push local CI: vitest PASSED** (32s), prettier passed, npm-audit passed.
  Record: `.ci-audit/runs/20260922T102745Z_0f5453983d45.json`.

## Not verified

- **`gitleaks-full` failed with exit=2** — the binary is not installed in this cloud sandbox
  (`gitleaks: command not found`); exit 2 is a tool error, not a leak finding. Pushed with the
  hook's documented `SKIP_LOCAL_CI=1` after a manual secret-pattern scan of the diff came back
  clean (no keys, JWTs, DSNs, or bearer tokens; the sync script reads the service key from env
  and never logs it). **Re-run the full hook on a host with gitleaks installed.**
- Migration 093 not applied (RED zone — HIC only).
- Lane not seen with real rows; table is empty until the first sync.

## Next

1. HIC applies `093_250926_hilma_tenders.sql`.
2. On DGX/local: `node hilma-watch.mjs --top 40 && node sync-to-supabase.mjs`.
3. Open Mission Control → Sales Centre, triage, then draft bids under the Lifetime Oy signature.
4. Confirm the DGX host has Chromium + `SUPABASE_URL`/`SUPABASE_SERVICE_KEY` in `.env`, then check
   `logs/hilma-watch.log` after the first firing (next: tomorrow ~03–06:00 UTC).
