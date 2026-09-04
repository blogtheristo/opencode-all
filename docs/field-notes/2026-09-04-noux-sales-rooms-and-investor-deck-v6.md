# Noux sales rooms, demo-tenant automation, and the investor deck that had to be rewritten three times

**Date:** 2026-09-04 (session ran 30.08–04.09.2026)
**Branch:** `claude/noux-sales-rooms-setup-wu73bq` · PR #1826
**Owner:** Risto Anton Päärni, Founder, CEO · Lifetime Oy

---

## What happened

Three live Noux sales rooms existed with no repo-side counterpart. The session built one — and in the
process turned up a chain of canon problems in the investor material that took three deck rewrites to
resolve.

### 1. `sales-rooms/` — the rooms now have a source of truth

`01-certified-partners-centre/`, `02-investor-centre/`, `03-trial-centre/`, each with the same three
files: a room card (audience, visitor journey, demo-stage checklist), a document manifest (repo source →
room format → upload status), and outreach wiring (feeding pipeline, invite list, a signal→action
follow-up table, a dated signal log). Repository-first: the `.md` is master, the Noux room is the
published copy.

Plus `DEMO_TENANTS.md` (`dev.<customer>@dws10.com`, synthetic data only, enforced expiry) and
`DEMO_AUTOMATION_PLAN.md` — five phases and four workflow definitions (W1 provision · W2 daily expiry
flow · W3 room document sync · W4 room signals), built on the `organizations` table, the `scripts/daily`
runner and SES rather than new infrastructure.

### 2. The deck line: V4 → V5 → V6

- **V4** replaced the Dec-2025 deck. Three canon violations fixed: Boardy.ai was named as a competitor in
  four places (it is our warm-intro and review channel, and every `INTRO_*` doc carries a standing rule
  not to mention it externally); the moat count mixed "19-Moat" headings with a "20 moats" bullet, and
  "20 moats" is deprecated; positioning was superseded by the labor lens.
- **V5** rebuilt on the DWS IQ Essentials positioning decision that landed the same day — Essentials →
  Pro → Enterprise on one contract model, Themis as the internal engine rather than a brand.
- **V6** is the deck of record. The HIC review rejected V5 for reading as a validated SME business when
  the SME motion is an untested scenario. V6 presents **two GTM scenarios**: A (SME entry) labelled a
  hypothesis with no shipped product, no customer and no measured demand — with pre-committed validation
  metrics and a stated failure condition — and B (enterprise workforce) carrying the only contracted
  software revenue. The ask funds the six-week launch gate and one paid referenceable beta, not the
  scaling of a proven motion.

### 3. Canon and catalogue corrections that fell out of it

| Finding                                                                                                | Resolution                                                                                                                            |
| ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| Essentials pricing contradicted itself inside its own roadmap (§3/§5 €799+€49/€249 vs §7/§8 €750+€200) | §3/§5 confirmed canonical (HIC); §7/§8 corrected, roadmap → v1.1                                                                      |
| Essentials pricing absent from the single pricing source                                               | Three SKUs added to `dws10.com/config/products.json` (priceVersion 1.29) + landing-pages mirror                                       |
| Catalogue still sold "Themis Coordinator — Pro" and a workshop                                         | `TH-T2` and `LAND-THEMIS` moved to `discontinuedProducts` with reason and date; struck through in the marketing catalogue             |
| Two truth-registry rows disagreed about the same round                                                 | Row 37(a) marked **superseded**; the investor-round-structure row is the single authoritative record (`DWS_TRUTH_STANDARD.md` → v5.0) |
| "Captain seat" meant three different things across three documents                                     | Settled: **investor position**, not a board seat, client position, or "captain hat"                                                   |
| Deck v3.0 carried Business ID 3180098-3                                                                | Corrected to the canonical **0772407-9**                                                                                              |
| Two pitch-deck HTML files, byte-identical renders                                                      | Both renamed `_OLD`; the `.md` is master                                                                                              |

---

## The insight

**A deck is a canon consumer, not a canon source — and it fails loudly when the canon underneath it
disagrees with itself.** Every problem this session found had been sitting in the repository for weeks:
a price contradicting itself two sections apart, a discontinued brand still sellable in the catalogue,
two current registry rows asserting opposite things about the same €650k. None surfaced until something
had to be written that depended on all of them at once.

The second lesson is about labelling. V5 was factually accurate and still wrong to circulate, because it
presented an untested commercial hypothesis in the same voice as contracted revenue. The fix was not new
data — it was saying which is which. **Scenario A is a hypothesis with a stated failure condition**, and
writing that down costs nothing with an investor who was going to ask anyway.

---

## HIC Learning Outcome — six-step status

1. **Knowledge base** — updated: `kb/raw/articles/2026-09-04-noux-sales-rooms.md`.
2. **Field note** — this file.
3. **`Learn/` HTML** — `Learn/2026-09-04-noux-sales-rooms-and-investor-deck-v6.html`.
   _Generated with the Chromium fallback, not `scripts/render-doc.sh`:_ that script cannot run in a
   Claude Code cloud session — it shells out over SSH to a LAN address and the container has no `ssh`
   or `scp` binary. Re-render from Win11 or the DGX for the pandoc-templated version.
4. **Drive export** — exported: [Google Doc](https://docs.google.com/document/d/1t07e3NWEOfY6tLRhILG8zTXl0-cH817X83-rMkUXZx8/edit) (repo stays source of truth).
5. **HIC question** — below.
6. **Calendar** — `N/A — no dated commitment was produced or discovered.` The one pending date (counsel
   confirmation of the SAFE instrument language) has **no date yet**; the HIC will announce it. Calendar
   it in the session that learns the date.

---

## The question for the HIC

The V6 diligence appendix carries five unreconciled data items, and they are not equal. Two are
cosmetic in diligence (5-vs-6 accounts at Dec 2025; AppExchange publication status). Three would be
quoted back at us in a term-sheet conversation:

- the **80% gross-margin stress floor** asserted in Budget V3 against the pricing model's 73% / 55%,
- the **~€7k/month transport-vs-consulting split** with no bookkeeping export attached,
- **account-level evidence** for the Azure Consumption Commitment claim, plus permission to name those
  accounts.

**Which of those three do we close first, and who owns closing it?** The margin conflict is the one an
investor is most likely to find on their own — but the bookkeeping export is the one that turns a
paragraph of hedging into a number. Both are yours to decide; neither is an agent task.

---

## Next steps

1. Counsel confirmation of the SAFE instrument language — **blocks V6 circulation and the Noux upload.**
2. Trial Centre has one visitor and zero attachments. Produce the four P0 documents.
3. Demo automation Phase 1 (`demo_tenants` migration + provisioning script) is unblocked; Phase 3 needs
   Cloudflare account and zone IDs; Phase 4 needs a verified answer on whether Noux has an API at all.
4. `dws10.com/investor-relations/` "Request Access" is a `mailto:` that opens a blank tab, on a
   non-canonical address, on a page mixing three addresses. Deferred to its own session.
