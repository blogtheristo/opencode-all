<!--
VERSION AND AGENT HISTORY
Document: Investor Captain-tier pricing reconciliation (LD-2026-014)
Version: 1.0
Date: 2026-07-31
Author: Risto Anton Päärni (risto.paarni@lifetime.fi), Founder, CEO, Lifetime Oy
Owner: Lifetime Oy
Status: Active
Agent: Claude Code, session claude/redact-aegis-customer-names (continuation of the 2026-07-26/27 boss-session PR-backlog cleanup, claude/ollama-orchestration-merge-047pj7)
Purpose: DWS Learning Standard closing record for reconciling three conflicting investor
         seat-pricing documents surfaced while triaging PR #1122. Legal basis: EU AI Act
         Article 14 (human oversight) — HIC = Human-In-Command.
Related: docs/LOCKED_DECISIONS.md (LD-2026-007 superseded, LD-2026-014 new),
         docs/INVESTOR_HOOK_DECK.md, dws10.com/investor-relations/index.html,
         docs/investor/boardy-2026-07-29/BOARDY_INVESTOR_STRATEGY_2026Q2_V3.md,
         docs/Investor/DWS_LIQUIDITY_ENGINE_v1.md (flagged, not fixed — see §4)

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Sonnet 5) | Session: claude/redact-aegis-customer-names | Date: 31.07.2026 | Changes: Initial record. Documents the three-way pricing conflict found while triaging PR #1122, the HIC's decision on which source is canonical, and the fix applied.
-->

# Investor Captain-tier pricing reconciliation — 2026-07-31

## 1. What happened

While triaging the KEEP_REVIEW backlog PR #1122 ("fix: Captain = Industry Captain = €50K —
remove phantom €150K Captain…") as part of continuing the 2026-07-26 boss-session PR-backlog
cleanup, a read-only review agent found that the PR's premise — that the €150K "Captain" line
is a duplicate/bug — was contradicted by the repo's own most-authoritative source, and that a
third structure existed that neither the PR nor the live site reflected.

## 2. The three conflicting sources

| Source                                                                                                                         | Structure                                                                                              | Status                                                                                                 |
| ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| `docs/LOCKED_DECISIONS.md` LD-2026-007 (2026-03-15)                                                                            | Fleet Admiral €500K / Captain €150K / Industry Captain €50K×8 / Deputy unlimited                       | LOCKED — required Risto approval to change                                                             |
| Live `dws10.com/investor-relations/index.html` + mirror                                                                        | Fleet Admiral €200,000 / Captain €150,000 / Industry Captain €50,000 (8 seats) / Deputy Captain €5,000 | Live in production, already drifted from the LOCKED entry (Fleet Admiral price) without a new LD entry |
| `docs/investor/boardy-2026-07-29/BOARDY_INVESTOR_STRATEGY_2026Q2_V3.md` + `docs/board/2026-07-29-boardy/investor-strategy.csv` | Fleet Admiral €200k · Captain €50k (9 seats; up to €150k triple) · Deputy €5k                          | Most recent; the pack actually used at the last real investor meeting                                  |

PR #1122 would have merged the live site's four-line structure down to three lines by deleting
the €150K "Captain" row outright — losing the €150K "triple" bundling option that the most
recent, actually-used board pack shows is still a live concept, just expressed as 3×€50K under
one SAFE rather than a separate tier.

## 3. HIC decision

**Q: Which of the three is the real current structure?**

**A (Risto, 2026-07-31): the 2026-07-29 Boardy pack is canonical** — most recent, and the one
actually presented to investors. Fleet Admiral €200,000 (1 seat) / Captain €50,000 × 9 seats,
with a €150,000 "triple" bundling option (3 seats under one SAFE) / Deputy Captain €5,000,
unlimited. The separate "Industry Captain" label is retired: it named the same €50K seat as
"Captain," and the split label is what let the two numbers drift into "phantom duplicate"
territory in the first place.

## 4. What was fixed, and what wasn't

**Fixed** (this session):

- `docs/LOCKED_DECISIONS.md` — LD-2026-007 marked `SUPERSEDED by LD-2026-014`; new LD-2026-014
  entry records the reconciled structure and rationale.
- `docs/INVESTOR_HOOK_DECK.md` — seat table, seat-count callouts, and the Slide-4 CTA line
  updated to the 3-tier + triple-bundle structure; version bumped 3.1 → 3.2.
- `dws10.com/investor-relations/index.html` + `landing-pages/dws10-com/investor-relations/index.html`
  — both seat-structure lists updated identically (dual-folder sync maintained).
- PR #1122 closed as based on a now-superseded premise (see PR comment for detail).

**Explicitly NOT fixed** (flagged for a separate pass, scope was limited to the files PR #1122
and the investor-relations site touched):

- `docs/Investor/DWS_LIQUIDITY_ENGINE_v1.md` carries a _fourth_ variant — Fleet Admiral €250,000
  (not €200K) and Deputy Captain €25,000 (not €5K) — discovered during this reconciliation but
  out of scope for this pass. Needs its own review.
- Historical version-history mentions of the old structure in `docs/CEO_PROFILE_RISTO_PAARNI_2026.md`,
  `docs/FOUNDER_CREDIBILITY_PLAYBOOK.md`, `docs/LINKEDIN_ORIGIN_STORY_POST.md` — left as history,
  not live claims.
- `docs/LOCKED_DECISIONS.md` LD-2026-007's own detail record body text is left intact (not
  rewritten) per the "don't edit LOCKED entries, supersede them" convention this session
  introduced — LD-2026-014 is the new source of truth.

**Fifth framework discovered mid-fix, not reconciled:** CI (`truth-lint`) flagged a pre-existing industry-count phrase
on the investor-relations page as deprecated (the site said "20"; the registry says 25). Tracing the registry led
to `INDUSTRIES.md`, which declares itself "canonical registry — single source of truth" and
explicitly lists dws10.com pages as required to reconcile against it — and its structured mirror
`dws10.com/config/industries.json` describes a **"16 captain hats / 32 seats (16 platinum €50K +
16 deputy €25K)"** fundraising framework, unrelated in structure to both LD-2026-007 and the
Boardy pack. Raised to HIC mid-session: **decision was that the Boardy pack (this entry's
structure) still governs investor-relations/index.html and the hook deck; the captain-hat
framework in `INDUSTRIES.md` is a separate, likely-stale artifact the HIC will reconcile or
deprecate separately.** Only the industry-_count_ portion of that drift was fixed here (20 → 25,
using the registry's approved phrase, since that specific fact isn't in dispute) — the "16
captain hats / 32 seats" framework itself is untouched and still lives in `INDUSTRIES.md` /
`dws10.com/config/industries.json`, now contradicting LD-2026-014. Not resolved by this entry.

## 5. Process note — a governance convention introduced

`docs/LOCKED_DECISIONS.md` had no prior example of a `SUPERSEDED` status; every existing entry
was still `LOCKED`, even ones whose content had visibly drifted (LD-2026-007 itself was already
inconsistent with the live site before this session touched anything). Introduced the
`SUPERSEDED by LD-YYYY-NNN` status value so a reader can follow the chain instead of finding two
`LOCKED` entries that contradict each other with no way to tell which one is current.

## 6. Verification

- Confirmed live-page content before editing: both `dws10.com/investor-relations/index.html`
  and its landing-pages mirror had the four-line structure with the €150K/€50K Captain split,
  byte-identical to each other.
- Confirmed no other `Industry Captain` / stray `8 seats` / orphaned `€150,000` references
  remain on the investor-relations page post-edit (`grep` swept clean; the one remaining
  `€150k` occurrence is an unrelated exit-scenario ROI figure, correctly left untouched).
- Dual-folder mirrors verified byte-identical after the edit.
