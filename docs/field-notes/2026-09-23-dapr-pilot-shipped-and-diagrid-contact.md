---
Status: PENDING_REVIEW
Date: 2026-09-23
Branch: claude/dapr-dws-use-cases-049za6
PR: https://github.com/blogtheristo/dws6/pull/2066
Author: Claude Fable 5.1 (Claude Code, standby runtime)
---

# Dapr pilot shipped; Diagrid co-founder contact

## What happened

1. **Dapr pub/sub pilot implemented and pushed** (HIC approved 2026-09-22).
   Full technical capture is in the previous day's note — this note does
   not repeat it: `docs/field-notes/2026-09-22-dapr-use-cases-dws.md` §3a.
   Summary of the code surface, for the record:
   - `src/agents/event-bus.ts` — feature-flagged publish of
     `agent.task_complete` to a local Dapr sidecar; local dispatch stays
     unconditional; `dispatchFromDapr()` prevents a publish loop.
   - `src/routes/dapr-pubsub.routes.ts` + `src/app.ts` — `/dapr/subscribe`
     and delivery callback.
   - `dapr/` — Redis component template + run/rollback README.
   - 8 new tests, all green. `DAPR_PUBSUB_PILOT_ENABLED` unset everywhere.
2. **Inbound from Mark Fussell** (Dapr co-creator, Diagrid co-founder)
   after the Dapr University course. Reply drafted (chat, 2026-09-23);
   sending is RED — HIC sends from `risto.paarni@lifetime.fi`.

## Insight

- The pilot is a **credibility asset for the Diagrid conversation only if
  it is switched on**. A flag-off pilot is a code review; a two-week live
  window is a case study. Enable before the call.
- Two questions worth Mark's time were identified: (a) Dapr virtual actors
  as the lifecycle model for long-lived AI agents; (b) how far Dapr
  tracing/CloudEvents metadata can carry an EU AI Act Art. 12 evidence
  trail before DWS's own KYA hash chain has to take over.

## Next steps

- HIC: send the reply; pick pilot Redis (isolated instance recommended,
  `dapr/README.md`); flip `DAPR_PUBSUB_PILOT_ENABLED=true` to start the
  2-week window; book the Diagrid call after that.
- Decision gate at window end → follow-up field note.

## Learning-outcome checklist

- KB update: N/A — no new canonical concept; the 09-22 note is the KB
  source for Dapr-at-DWS until the pilot decision gate produces data.
- Drive export: N/A — repo is source-of-truth; no cloud session Drive
  write for a PENDING_REVIEW note (HIC batch-reviews at /retro).
- Calendar: N/A — no dated commitment yet; the 2-week window starts when
  the HIC flips the flag, and the call date depends on Mark's reply.
- Standards: N/A — pilot adds a feature-flagged optional path; no standard
  changed. If the decision gate passes, `DWS_ARCHITECTURE` docs get a
  Dapr section then, not now.
- Blog drafts flagged by the stop hook (13 files in `docs/blog-drafts/`):
  parked, unchanged by this session — not this branch's scope.

## HIC decision question

Do you want the pilot flag on **before** the Diagrid call (live numbers,
small risk on a non-production Redis) or **after** (safer, but the call is
then a design conversation rather than a results conversation)?
