# 2026-09-24 — Kampanjasivun henkilökohtaistaminen: HIC-veto, ei muutoksia

**Status:** CLOSED — no repository change.

N/A — session made no substantive change. The Dapr files the stop hook lists (`src/agents/event-bus.ts`, `src/routes/dapr-pubsub.routes.ts`, tests) came in via merged PR #2066 on `main`, not from this session.

## What happened

- HIC shared an analysis: lifetime.fi is 80 % system / 20 % Risto; the A5 campaign page (`dws10.com/campaigns/a5-kampanja-kaksipuolinen.html`) should be 70 % Risto / 30 % technology, outcome-framed, with a real webstore view.
- Agent drafted the edits (bigger portrait, "Mitä sinulle tapahtuu" outcome list, "Esimerkkejä" cards, store mockup) and measured A5 fit with Playwright.
- HIC stopped the work: "älä muuta kampanjasivua, se on tässä se hyvä osio." Edits reverted; working tree clean, nothing committed.

## Insight

- The illustration images the earlier analysis called missing do exist in the repo: `dws10.com/static/images/campaign/kuvitus/` and `campaign/ominaisuudet/` (commit `ddd8c65`).
- The campaign page already carries the person-first structure; the personalisation gap is on lifetime.fi, not on the campaign page.

## Next steps

- Open HIC decision: apply the 70/30 person-first pattern to a lifetime.fi small-business section or a separate landing page, or leave lifetime.fi enterprise-only. Pending HIC answer.
