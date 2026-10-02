# Field Note — Signed Work first-touch fence applied (Q1 = A)

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Opus 5) | Session: claude/continue-session-v5c3vj | Date: 22.09.2026 | Changes: HIC answered Q1 = A on `docs/plans/2026-09-21-signed-work-gtm-pivot.md`. Applied the three fenced items from the previous session's handoff: Brand §22 First-Touch Fence (+ §23.5 outreach noun fence, Offensive block annotated as superseded at first-touch), Roles §4 public-sector productisation append, and the DWS-IQ-006 store lede rewrite in both folders. No SKU, no price, no publish. Harness: Claude Code on the web. HIC-approved-drift: none.

Document Status:

- Created: 22.09.2026
- Last Modified: 22.09.2026
- Language: English
- Publication Status: INTERNAL
- Document Type: Field Note / execution record
- Owner: Risto Anton Päärni
- Classification: Business Confidential
- Harness: Claude Code on the web
- HIC-approved-drift: none

Related Documents:

- `docs/plans/2026-09-21-signed-work-gtm-pivot.md` (the proposal; Q1)
- `docs/field-notes/2026-09-21-trophy-effect-stop-selling-compliance.md` (the signal)
- `DWS_BRAND_STANDARD.md` §22, §23.5 (v3.14)
- `DWS_ROLES_REGISTRY.md` §4 (v1.4)
- `dws10.com/config/products.json` + `landing-pages/dws10-com/config/products.json`

---

**Date:** 2026-09-22
**Author:** Claude Code + risto.paarni@lifetime.fi
**Location:** Espoo, FI (Lifetime Oy HQ)
**Context:** Second session on the Signed Work GTM pivot; the cooling gap the 21.09 note required
**Branch:** `cursor/signed-work-gtm-pivot-ced6` (PR #2060)
**Highest HIC question on this branch:** Q2

---

## Decision recorded

**Q1 = A (HIC, 22.09.2026).** Lock first-touch as signed work that releases money; never lead with the noun _compliance_; treat funded AI-compliance task forces as closed doors. Two-way door for the internal lock; publishing store copy and sending offers remains the one-way step.

## What was applied

| Fenced item                   | Where                                                   | State                                                            |
| ----------------------------- | ------------------------------------------------------- | ---------------------------------------------------------------- |
| Brand §22 first-touch fence   | `DWS_BRAND_STANDARD.md` v3.13 → v3.14                   | Applied. EN/FI lockstep across all five lines.                   |
| Offensive block collision     | Same file, DWS10 Offensive / Commercial-Edge block      | Original door sentence preserved; superseding note appended.     |
| Outreach noun fence           | `DWS_BRAND_STANDARD.md` §23.5 Banned Phrases            | Applied — subject lines and first sentences covered.             |
| Roles §4 public-sector append | `DWS_ROLES_REGISTRY.md` v1.3 → v1.4                     | Applied. R05 pre-trophy row unchanged (append, not replacement). |
| DWS-IQ-006 store lede         | `dws10.com/config/products.json` + landing-pages mirror | Applied in the same commit. Price €4,999 unchanged.              |

Store copy now leads with signed work. Two claims were dropped from the card rather than reworded: "Stop risking fines" (trophy-adjacent) and "90% reduction in manual compliance hours" (replaced by "days, not quarters", per the Brand §22 speed fence — no contractual hour-count without a Product-signed SLA).

## Not done, and why

- **Blog** — no draft exists. An earlier line in this session claimed one at `docs/blog-drafts/trophy-effect-stop-selling-compliance.md`; that path was never created (the 21.09 commit wrote the KB concept at `kb/wiki/concepts/` under a similar name). Nothing to hold and nothing to approve. Rule 13 applies whenever one is written.
- **Thesis** — no edit. The pivot is a market signal, so it belongs in `PHD_FIREHORSE_EN/FI` §14.x, and that is a four-file lockstep job with its own version bump. Deliberately not bundled into a copy commit.
- **Outreach sends** — RED (outbound email). The three Captain Day offers in the plan's 30-day motion are drafted only when the HIC opens that lane.
- **Named public-sector copy** — unchanged by design. The mechanic ships; the anecdote, the euro figure and the copy accusation stay internal.

## Verification

- `node scripts/lint-truth-claims.mjs` on both standards: 2 fail / 10 warn, byte-identical to the pre-change baseline (both failures are the pre-existing quoted anti-patterns in the §22 sovereignty fence). No new deprecated phrase introduced.
- Both `products.json` files parse and are byte-identical to each other (dual-folder rule).
- Prettier run on the two standards; JSON left in its committed formatting to avoid a 1,600-line reformat diff.

## Six-step learning outcome

| Step           | Status                                                                                                                                 |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| 1 KB           | N/A — 21.09 session already landed the signal and concept; this session adds no new concept.                                           |
| 2 Field note   | This file                                                                                                                              |
| 3 Learn HTML   | N/A — `scripts/render-doc.sh` needs pandoc; unavailable locally and on the DGX host from this web session. Render on next DGX session. |
| 4 Drive        | N/A — no Google Drive export from this web session; repo is source-of-truth.                                                           |
| 5 HIC question | Q2 below                                                                                                                               |
| 6 Calendar     | N/A — no dated third-party commitment. The 30-day motion starts when Q2 opens the lane.                                                |

---

## HIC Decision — Q2

**Q2.** The internal lock is applied. Open the one-way lane?

- **A — Open it.** Approve the blog draft (I show you the full text first), and draft the three Captain Day offers — one industrial R19/R10, one plant R12, one public-sector programme owner — for your send.
- **B — Standards only.** Merge PR #2060 as the internal lock, hold public copy and outreach until the first signed-artifact reference exists to cite.

(RECOMMEND: **B** for the blog, **A** for the three offers — the offers are private first-touch and test the line against a real buyer before it is broadcast; the blog broadcasts the doctrine and, per Track A, is what gets copied.)

Reversibility: store copy is already live-on-merge (two-way — revert is a commit). Outreach sends and a published post are one-way.

Rests on: **Verified** — the five file changes above and their lint/parse checks. **Propagated** — the Valtori anecdote from 21.09, still not independently verified and still not in any public surface.
