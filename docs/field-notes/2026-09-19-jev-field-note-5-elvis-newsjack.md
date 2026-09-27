<!-- Evidence: Tool=Cursor Grok 4.6 Date=2026-09-19 -->

# Field Note 5 — Jev over a morning news pile (Elvis / newsjack.sh)

<!-- prettier-ignore -->
***

# VERSION AND AGENT HISTORY

Version: 1.0 [Latest]

Sessions & Modifications:

- Version: 1.0 | Tool: Cursor Grok 4.6 | Session: cursor/dws10-i18n-25-dictionary-c0ce | Date: 19.09.2026 | Changes: Fifth Jev field note. HIC-supplied X post attributed to Elvis (@elvissun), ~10h before ask. Signal only. Did not fetch x.com. Did not clone newsjack. Optional fetch of http://newsjack.sh for existence/title only — no demo/ or skills copied into this repo.

Session Links & References:

- Field note 1: `docs/field-notes/2026-09-18-jev-typed-decision-layer-signal.md`
- Field note 2: `docs/field-notes/2026-09-19-jev-field-note-2-unlocks.md` (expensive queue)
- Field note 3: `docs/field-notes/2026-09-19-jev-field-note-3-smash.md`
- Field note 4: `docs/field-notes/2026-09-19-jev-field-note-4-cj-zafir.md`
- Use-case map: `docs/field-notes/2026-09-19-jev-typesafe-use-case-map.md` (vendor **AI Map Reduce** + Search / Retrieval / Ranking)
- Spec: `docs/KYA_JEV_SPECIFICATION.md` (v0.8 — not bumped this note)
- Named URL in source (existence/title only this session): `http://newsjack.sh` — GitHub landing **elvisun/newsjack**, README title **Newsjack.sh** / “The open-source skills that turn your agent into a full PR team.”

Document Status:

- Created: 19.09.2026
- Last Modified: 19.09.2026
- Language: English
- Publication Status: INTERNAL — field note, not for public-site publication

<!-- prettier-ignore -->
***

**Date:** 2026-09-19
**Session:** Cursor, branch `cursor/dws10-i18n-25-dictionary-c0ce`
**Status:** PENDING_REVIEW — market signal. No vendor API. No spec bump. No 087 apply. No newsjack import.

**Source:** HIC-pasted X post attributed to Elvis (@elvissun). Quote is user-supplied; this session did **not** fetch x.com. **MEDIUM** on attribution. **LOW** on 24.9s, 384 headlines, 15 brands, $0.19, 4/384, $0.77, and ~390× (Rule 12 — UNVERIFIED user claims). Do not put those figures on a public DWS surface (`dws10.com`, landing-pages mirrors, or `AGENTS.md`).

## What the post says

Jev is claimed to have read **384** morning news items in **24.9 seconds**, then told **15 brands** which stories to hop onto, for **$0.19**. Claude Opus 5 on the same feed at the same time: **4/384** and **$0.77**. Per headline that is claimed **~390× cheaper**, with an answer before a human finishes reading the headline. Forward look: find trending stories, find journalists, get press coverage. Video said open-sourced at http://newsjack.sh (`demo/` + 30+ skills for a “PR team”).

**This session:** did not copy `demo/` or those skills. Existence of the site/repo title is enough.

## Shape (bind — not a fifth consumer)

Typed **rank / score / choice** over a headline pile is the same “expensive queue” as field note 2 plus TypeSafe **map-reduce** and **search/rank** (use-case map: Search / Retrieval / Ranking is **not first-class** on `makeTypedDecision()` today — many `score`/`boolean` calls or stay embeddings). kya-jev remains `LLMClient` structured JSON. It is **not** proven at 384 items in ~25s. US vendor Jev remains **CLOUD Act–blocked**.

No new `advise*` function this note.

## Bind (HIC four lanes — existing objects only)

| HIC lane                   | Claim in post / implied product        | DWS bind (repo evidence)                                                                                                                                                                                  | Do not                                                  |
| -------------------------- | -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| Shape                      | Sort a headline pile; hop onto stories | Field note 2 expensive queue + map-reduce / search-rank. Advisory typed pick over **our** piles.                                                                                                          | Do not treat 384/25s as a kya-jev SLA                   |
| Sales signals              | Newsjack / brand story hop             | Existing `Market Signal` path, `sales-manager-newsletter`, `competitor-surveillance`, `keyword-intent`. kya-jev **advisory only**.                                                                        | Do not auto-publish newsletters or outreach             |
| Investor signals           | “Stories that matter today”            | Existing briefing corpus only: `docs/investor/*`, `docs/INVESTOR_HOOK_DECK.md`, `docs/INVESTOR_ROADMAP_2026.md`, regulatory-radar investor/board briefs. Advisory **sort** of which brief/signal to read. | Do not invent an investor-newsjack product              |
| Control room sensors       | Flood of items, pick which to hop      | SiteSense, `signal-catalogue` 2×2 “worth interrupting”, nudge service. Sensor flood vs typed interrupt.                                                                                                   | kya-jev must **not** auto-nudge below **advisor** phase |
| Situation room big picture | 15 brands / one morning feed           | `atlas`, `skills/briefing`, `/api/situation-room` — **aggregate after** sensors.                                                                                                                          | Not a 384-headline vendor demo on the board wall        |
| Open source PR team        | newsjack.sh 30+ skills                 | Title confirmed. Skills stay **outside** this repo.                                                                                                                                                       | Do **not** import newsjack skills or add a PR-team SKU  |

**Sovereignty:** US vendor Jev remains CLOUD Act–blocked for Ledger-Native / customer-regulatory workloads (`docs/KYA_JEV_SPECIFICATION.md` §1; field note 1). Keep `makeTypedDecision()` on DGX/Groq/Anthropic behind `issueKyaVerdict()`.

## Decision recorded

Log as a **pile-sorter** signal (typed rank over many headlines), mapped onto **sales / investor / sensor / situation-room** objects already in the repo. Do not bump the spec. Do not apply `087_kya_jev_calls.sql`. Do not publish 24.9s / 384 / $0.19 / 4/384 / $0.77 / ~390× as DWS claims. Do not ship newsjack.

## Learning outcome (Art. 14)

1. KB: N/A.
2. Field note: this file.
3. Learn/ HTML: N/A.
4. Drive: N/A.
5. **HIC question:** none this note — Wave 3 trio and apply 087 stay open from earlier notes. No fifth advisory consumer.
6. Calendar: N/A.
