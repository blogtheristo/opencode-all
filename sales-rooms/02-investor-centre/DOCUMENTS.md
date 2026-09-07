# Room 2 — Document Manifest

Status: `todo` · `ready` (exists in repo) · `uploaded` (live in room).
Lounge: `open` · `captain` · `admiral`.

| #   | Title shown in room                | Repo source                                                                                                                                      | Lounge  | Format | Status                                                                                                |
| --- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------- | ------ | ----------------------------------------------------------------------------------------------------- |
| 1b2 | ~~Investor deck V5 (2026 Q3)~~         | [`../../investor-outreach/DWS-INVESTOR-DECK-V5-2026Q3.md`](../../investor-outreach/DWS-INVESTOR-DECK-V5-2026Q3.md)                               | open    | PDF    | **NOT for upload** — approval withdrawn on HIC review 30.08.2026 |
| 1   | Investor deck V6 (2026 Q3, two GTM scenarios) | [`../../investor-outreach/DWS-INVESTOR-DECK-V6-2026Q3.md`](../../investor-outreach/DWS-INVESTOR-DECK-V6-2026Q3.md) | open | PDF | **OFFICIAL (HIC 04.09.2026)** — upload not instructed; nothing uploaded |
| 1b  | ~~Investor deck V4~~               | [`../../investor-outreach/DWS-INVESTOR-DECK-V4-2026Q3.md`](../../investor-outreach/DWS-INVESTOR-DECK-V4-2026Q3.md)                               | —       | —      | superseded — predates the 30.08.2026 Essentials positioning |
| 1c  | ~~DWS IQ 6 deck v3.0 (Dec 2025)~~  | [`../../investor-outreach/DWS-IQ6-Investor-Pitch-Deck-2025-OPTIMIZED.md`](../../investor-outreach/DWS-IQ6-Investor-Pitch-Deck-2025-OPTIMIZED.md) | —       | —      | superseded by V4 — do not upload (see review)                                                         |
| 2   | One-pager (EN) 2026 Q2             | [`../../docs/investor/INVESTOR_ONE_PAGER_2026Q2.md`](../../docs/investor/INVESTOR_ONE_PAGER_2026Q2.md) (v1.4)                                    | open    | PDF    | ready — **lead asset, newer than the deck**                                                           |
| 3   | One-pager (FI)                     | [`../../investor-outreach/DWS6IQ_ Ennustava sääntely -äly ja rakennusalan hiilivelka_V1.md`](<../../investor-outreach/DWS6IQ_ Ennustava sääntely -äly ja rakennusalan hiilivelka_V1.md>) | open    | PDF    | ready                                                                                                 |
| 4   | Market thesis / TAM–SAM–SOM        | `../../DWS_MARKET_RESEARCH_STANDARD.md` (derive)                                                                                                 | open    | PDF    | todo                                                                                                  |
| 5   | Product family: DWS IQ + Firehorse | `../../docs/DWS_PRODUCT_STANDARD.md` (derive)                                                                                                    | open    | PDF    | todo                                                                                                  |
| 6   | SAFE round terms                   | `../../docs/investor/INVESTOR_ONE_PAGER_2026Q2.md` §The Ask — canonical €650k / €3.8M cap / 20% / 24 mo                                          | captain | PDF    | ready — **do not use** `sales-outreach/150kSAFE-closing-plan.md`, it is the stale Jan-2025 €150k plan |
| 7   | Moat / defensibility evidence      | [`../../investor-outreach/AEGIS_MOAT_EVIDENCE.md`](../../investor-outreach/AEGIS_MOAT_EVIDENCE.md)                                               | captain | PDF    | ready                                                                                                 |
| 8   | Founder DD pack                    | `../../investor-outreach/` (DD docs)                                                                                                             | captain | PDF    | ready → assemble                                                                                      |
| 9   | Cap table                          | not in repo (HIC holds)                                                                                                                          | captain | PDF    | HIC action                                                                                            |
| 10  | Defence & sovereignty thesis       | [`../../investor-outreach/DEFENSE_SOVEREIGNTY_INVESTORS_2026.md`](../../investor-outreach/DEFENSE_SOVEREIGNTY_INVESTORS_2026.md)                 | admiral | PDF    | ready                                                                                                 |
| 11  | Roadmap 3–7 y                      | `../../docs/DWS9_ROADMAP.md` / `DWS10`                                                                                                           | admiral | PDF    | ready → export                                                                                        |
| 12  | Demo tenant link                   | `../DEMO_TENANTS.md`                                                                                                                             | open    | Link   | todo                                                                                                  |

## Deck version review (2026-08-30) — resolved + blocking findings

**Decision: the `.md` is canonical. Both HTML files were renamed `_OLD`.**

The two HTML files were **byte-identical** (`md5 b3b3e919…`) — the same Pandoc render of the `.md` under
two filenames, one a typo (`-OPTIMIZE`). Nothing was lost by retiring both: the `.md` is the master and
the HTML is regenerable with `scripts/render-doc.sh` (repository-first, `DWS_TRUTH_STANDARD.md` §2E).
Renamed, not deleted (Non-Negotiable Rule 6):

- `DWS-IQ6-Investor-Pitch-Deck-2025-OPTIMIZE_OLD.html`
- `DWS-IQ6-Investor-Pitch-Deck-2025-OPTIMIZED_OLD.html`

**The winning file is still blocked from upload.** It is v3.0 dated 30.12.2025 and carries three canon
violations that must be fixed before an investor sees it:

1. **Boardy.ai is named as a competitor in 4 places** (slides 1, 4, the founder line, and the competitor
   table: "Boardy.ai raised €11M … cannot compete"). Boardy is our **warm-intro and review channel** —
   every investor intro doc in `investor-outreach/` carries the standing instruction _"Do NOT mention
   Boardy in external communication"_, and `DWS_TRUTH_STANDARD.md` v2.6 registers Boardy AI as an
   independent review layer plus intro channel. Naming the network that supplies our intros as a
   competitor we beat is the single highest-risk line in this deck.
2. **Moat count is internally inconsistent and deprecated.** Headings say "19-Moat Fortress", a bullet
   says "20 competitive moats". Canonical is **19 numbered moats + 5-element Layer 0**
   (`docs/20-MOAT-FORTRESS.md` v3.0, registered `DWS_TRUTH_STANDARD.md` §2 row 21, which explicitly
   deprecates the "20 moats" / "21 moats" headline counts).
3. **Positioning and figures are superseded.** The buyer-facing offer is now **DWS 365 Skilled Agents**
   (`docs/investor/INVESTOR_ONE_PAGER_2026Q2.md` v1.4), and the locked revenue/pricing frame is
   `docs/investor/boardy-2026-07-29/BOARDY_REVENUE_SCENARIOS_2026-2029_V3.md` (LOCKED 22.07.2026) +
   `docs/investor/data-room-2026Q2/PRICING_MODEL.md`. The Dec-2025 deck predates all of it.

**Consequence for the room:** lead with the 2026 Q2 one-pager and the `data-room-2026Q2/` set (items 2,
4, 7). The deck is a v4 rewrite job, not an upload job.

## V5 supersedes V4 (2026-08-30, same day)

V4 was written hours before the **DWS IQ Essentials positioning decision**
(`docs/field-notes/2026-08-30-dws-iq-essentials-positioning.md` + `docs/DWS_IQ_ESSENTIALS_ROADMAP.md`
v1.0) and therefore leads with the enterprise labor-lens motion alone. **V5 rebuilds on the ladder:**
Essentials (SME entry, €799 + €49/mo self-hosted or €249/mo managed) → Pro (governance +€249/mo,
analytics +€149/mo) → Enterprise (the €199,990/yr skilled workforce), on one contract model with an
identical evidence chain, with Themis as the internal engine rather than a customer-facing brand.

**All three conflicts V5 surfaced were decided by the HIC the same day (30.08.2026) and are closed:**

1. **Pricing:** §3/§5 is canonical — €799 setup + €49/mo self-hosted, €249/mo managed. The roadmap's
   contradicting §7/§8 lines ("€750/month + €200/month hosting") were corrected in v1.1.
2. **Single pricing source:** the three Essentials SKUs (`DWS-IQ-ESS-SETUP`, `DWS-IQ-ESS-SUB-SELF`,
   `DWS-IQ-ESS-SUB-MANAGED`) are registered in `dws10.com/config/products.json` at priceVersion 1.26 and
   mirrored to `landing-pages/dws10-com/`. Pro add-ons are deliberately not listed — roadmap items are
   not catalogue items.
3. **Themis:** the positioning wins. `TH-T2` and `LAND-THEMIS` are discontinued, moved to
   `discontinuedProducts` with the reason recorded, and struck through in the marketing catalogue.

## Rendering note (2026-08-30)

`scripts/render-doc.sh` **cannot run from a Claude Code cloud session**, and installing pandoc on the
DGX does not change that: the script's fallback path shells out over SSH to `192.168.101.113`, but the
cloud container has **no `ssh`/`scp` binary at all**, and that address is a LAN IP with no route from
the cloud in any case. Run `scripts/render-doc.sh` from the Win11 host or on the DGX itself, where both
the SSH path and the local-pandoc path work.

Interim: the V5 PDF handed to the HIC was rendered headless with Chromium from the same approved
source, which is fine for a room attachment but produces no `.docx` and does not use the Document
Standard's pandoc template.

## Rules

- Every figure traced to a source; unverified figures are marked or removed, never smoothed.
- Legal identity block on all round documents.
- Lounge-gated files never appear in the open section — check after every room edit.
