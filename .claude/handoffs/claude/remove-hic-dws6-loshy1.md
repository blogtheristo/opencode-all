# Handoff — claude/remove-hic-dws6-loshy1

## State (26.09.2026, end of session)

- PR #2128 (merged by HIC request): production backend moves to DGX Spark;
  Scaleway retired for cost. `day-runner.sh` rebuilds on app changes and
  health-checks; `deploy-scaleway.yml` and `deploy-dgx-spark.yml` (false
  green) are `.disabled`.
- Plan and evidence: `docs/field-notes/2026-09-26-hic-out-of-the-routine-path.md`
  v1.1 — §2 gaps, §4 fix list F1–F12, §7 DGX cutover C1–C5, §8 cost-dropped
  solutions with €0 replacements. Status: PENDING_REVIEW.

## Blockers (HIC)

1. C2 — Cloudflare Zero Trust: route `api.dws6.com` → `http://dws-backend:8080`;
   `CLOUDFLARE_TUNNEL_TOKEN` in DGX `.env`; start `gateway` profile.
2. Confirm `DEPLOY OK` in the DGX day-runner log after merge.
3. C5 — after 7 green days: delete Scaleway container, namespace, images; stop billing.

## Next session — paste this prompt

```
Continue DWS6 "HIC out of the routine path" (field note
docs/field-notes/2026-09-26-hic-out-of-the-routine-path.md v1.1, PR #2128 merged).
Read the field note §4, §7, §8 first. Work on a new claude/ branch, one PR per item,
in this order; skip any item whose blocker is not cleared:

1. C3 (only if https://api.dws6.com/health answers): switch every frontend and
   mirror from dwsiqcontainersjwyssm4e-dws-iq-backend.functions.fnc.fr-par.scw.cloud
   to https://api.dws6.com (13 base URLs: site + assistant pages in dws6.com,
   dws10.com, onelifetime.world and landing-pages mirrors, public/chat-widget.js,
   public/climate-assistant.html, src/app.ts). Dual-folder sync in the same commit.
2. C4: Cloudflare Worker cron uptime check on https://api.dws6.com/livez that opens
   a GitHub issue on failure. Not a GitHub Actions schedule (minutes cost).
3. §8: move test.yml, gitleaks, ruff to required checks on [self-hosted, dgx-spark];
   fix the 68 ruff-format files so the pre-push hook stops needing --no-verify.
4. §8: scripts/daily/cron-coverage.sh — expected DGX jobs vs
   logs/day-runner-state.json, gaps posted to Mission Control.
5. §8: scripts/weekly/zap-scan.sh — ZAP container from the day-runner.
6. F10: rewrite .claude/commands/email.md and .opencode/command/email.md from Resend to SES.
7. F12: fix the 12 Rules numbering in CLAUDE.md.
8. F7: triage the 40 PENDING_REVIEW field notes into decision vs FYI; one Artifact.

Open HIC decisions to ask, not assume: F5+F8 sprint (migration approve pipeline +
Decision Inbox) vs backlog only; F11 DGX vs cloud exception before 2026-10-12;
the 7 unapplied migrations (065, 066, 086, 087, 088, 094, 095) are RED — prepare a
risk sheet, do not apply.
```

## History

- 2026-09-26 | Claude Code | Audit of HIC bottlenecks → field note v1.0. Plan only.
- 2026-09-26 | Claude Code | HIC: Scaleway too expensive → DGX. day-runner.sh rebuild + health check (simulated 6/6). Deploy workflows `.disabled`. Field note v1.1 §7–§8.
