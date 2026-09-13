# Branch baton — claude/email-2-0-rewrite-74mtjq

**Task:** Stop stalled SES Outreach digest + Morning Brief schedules; ship Mission Control (Noux 3 centres) + Daily PWA.  
**State:** Plan locked in-repo. Implementation not started from this Cursor session.  
**Plan (canonical):** `.claude/handoffs/claude/mission-control-ops.md`  
**PR:** https://github.com/blogtheristo/dws6/pull/2002  
**Date:** 2026-09-13

---

## Version & Agent History

**For HIC tracking:** Each tool maintains its own version counter. When Cursor/OpenCode/Claude Code
edit this baton next, they each increment independently (1.2, 1.3, 1.4…). Read the table to see
which tool changed what. No coordination needed — dates + Agent + Changes tell the full story.

| Version          | Date       | Changes                                                                          | Agent       |
| ---------------- | ---------- | -------------------------------------------------------------------------------- | ----------- |
| [Latest] 1.1     | 2026-09-13 | Added Noux API blocker; Cursor start-here guidance; fallback (hardcoded centres) | Claude Code |
| [not latest] 1.0 | 2026-09-13 | Initial branch baton — link to canonical plan, next steps                        | OpenCode    |

---

## Next steps

1. Any tool: read `mission-control-ops.md`; append under `## Tool comments` if reviewing.
2. Execute Task 1 (stop schedules) then Tasks 2–3 (Mission Control + Daily PWA).
3. Push to this branch; update PR #2002; HIC redeploys backend.

## Blockers

- **Noux API verification (BLOCKING Task 2):** Confirm `sales-rooms/02|01|03-*-centre/` paths exist in repo and DEMO_AUTOMATION_PLAN.md Phase 4 Noux read capability is verified. If blocked: build Mission Control page with static/hardcoded centre data; defer Noux integration to Phase 2; flag in HIC report.
- Backend redeploy required after `app.ts` change (git alone does not stop 06:00 Outreach mail).
- Out-of-repo: Desktop `backup-morning-briefing` + Claude Routine — HIC only.

## Cursor: Start here

Read `mission-control-ops.md` fully. Then:

1. **Verify Noux API** — grep for `sales-rooms/` paths; check DEMO_AUTOMATION_PLAN.md Phase 4 status.
2. **If Noux ready:** Proceed Tasks 1–3 as planned.
3. **If Noux blocked:** Execute Task 1 (stop schedules); build Mission Control page with hardcoded centre data; flag blocker in PR comment.

Expected timeline: Tasks 1–2 ~4 hours (+ dual-sync). Task 3 (PWA) is optional v1.
