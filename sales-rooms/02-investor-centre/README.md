# Room 2 — Investor Centre

**Noux title:** `Investor Centre | DWS IQ tuoteperhe | Firehorse tuoteperhe | Investor Support`
**Noux tags:** `Investor Centre | DWS IQ tuoteperhe | Firehorse tuoteperhe | Investor Support | Admiral Lounge | Captain's Lounge`
**Noux status:** Luonnos / Käynnissä — 0 visitors, 0 invites, 0 attachments (2026-08-30)
**Room owner:** Risto Anton Päärni, Founder, CEO · Lifetime Oy

---

## Purpose

The data room for the SAFE round. Replaces "here is a deck PDF" with a tracked room where we see which
investor opened the cap table, how long they spent on the traction section, and who came back twice.

## Two lounges, one room

The `Admiral Lounge` and `Captain's Lounge` tags separate access levels — same room, different
attachment sets. Do not put lounge-gated material in the open section.

**The lounges are named after the round's seat classes, not invented for the room.** The live structure
registered in `DWS_TRUTH_STANDARD.md` (from `dws10.com/investor-centre/`, 19.08.2026) is **1 Admiral
seat at €250,000 + 8 Captain seats at €50,000 = €650,000**, with a 9th seat as reserve only. **Caveat
carried, not resolved:** the same registry holds an unresolved three-way disagreement on whether a
Captain is an investor seat (live site), a client position with no investor tier (`INVESTOR_MEMO.md`),
or one of 16 "captain hats" (`FOUNDER_CREDIBILITY_PLAYBOOK.md`) — and a separate row lists the
€650k/€3.8M claim itself as unverified against `TRACTION_CANONICAL.md`. Do not let room copy pick a
side before the HIC decides.

| Lounge               | Who                                                       | Gets                                                                     |
| -------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------ |
| **Captain's Lounge** | Committed / term-sheet-stage investors, existing captains | Cap table, SAFE terms, full financial model, customer contracts, DD pack |
| **Admiral Lounge**   | Advisors, strategic/anchor-level counterparts             | The above plus roadmap and partnership/defence material                  |
| _Open section_       | First-touch investors, intros via Boardy                  | Deck, one-pager, market thesis, product family, public traction          |

## Audience

Pre-seed/seed deep-tech and climate-tech investors, Nordic + EU sovereignty-thesis funds, angel
captains. Per-target research lives in [`../../investor-outreach/`](../../investor-outreach/).

## Visitor journey

1. Warm intro (Boardy.ai) or direct outreach → open-section room link.
2. Deck + one-pager + market thesis.
3. Product proof: DWS IQ + Firehorse, live demo tenant rather than screenshots.
4. Interest → lounge upgrade → DD pack and SAFE terms.
5. eSignature via DocuSign (`/sign-document`).

## Demo-stage checklist

- [ ] Investor deck exported (current version only — retire the `OPTIMIZE`/`OPTIMIZED` duplicates)
- [ ] One-pager EN + FI
- [ ] SAFE terms summary (round size, cap, discount) — figures verified against the closing plan
- [ ] DD pack assembled behind the Captain's Lounge tag
- [ ] Cap table **not** in the open section
- [ ] Demo tenant link live
- [ ] Room tags match this file exactly

## Guardrails

- No unverified metric enters an investor document — every number cites a source
  (`DWS_TRUTH_STANDARD.md`), and a claim with no source is marked `unverified` before it ships.
- Financial/legal documents use the legal identity block (`CLAUDE.md` → Legal Identity Rule) and
  `risto.paarni@lifetime.fi`.
- Nothing containing personal financial data or a live token goes into an attachment.
