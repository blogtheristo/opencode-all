# Handoff — claude/noux-sales-rooms-setup-wu73bq

**Session:** 2026-08-30 · Noux sales rooms · demo automation plan · investor deck V4 → V5 → **V6**

## State

- **`sales-rooms/`** mirrors the three live Noux rooms (01 partners, 02 investor, 03 trial). Each has
  `README.md`, `DOCUMENTS.md`, `OUTREACH.md`. Plus `DEMO_TENANTS.md` (`dev.<slug>@dws10.com`) and
  `DEMO_AUTOMATION_PLAN.md` (5 phases, workflows W1–W4). Nothing uploaded to Noux yet.
- **Deck of record: `investor-outreach/DWS-INVESTOR-DECK-V6-2026Q3.md`** — two GTM scenarios, A (SME
  Essentials) labelled an untested hypothesis, B (enterprise workforce) carrying the only contracted
  revenue. V4 and V5 retained and superseded; V5's approval was withdrawn on HIC review the same day.
  Artifact: https://claude.ai/code/artifact/52ecdcb5-0c8d-429f-bfbe-6dffac236505
- **Pricing:** Essentials SKUs live in `dws10.com/config/products.json` **priceVersion 1.29** (+ mirror):
  `DWS-IQ-ESS-SETUP` €799, `-SUB-SELF` €49/mo, `-SUB-MANAGED` €249/mo. Roadmap §7/§8's €750+€200 beta
  language corrected (roadmap v1.1). Standalone Themis SKUs (`TH-T2`, `LAND-THEMIS`) discontinued into
  `discontinuedProducts` — Themis is the internal engine, not a brand.
- **Round record settled (HIC, 30.08.2026):** `DWS_TRUTH_STANDARD.md` v5.0 — row 37 sub-item (a) marked
  **superseded**; the authoritative record is the investor-round-structure row (€650k SAFE, €3.8M cap,
  20%, 24 mo, 1 Admiral €250k + 8 Captain €50k). Captain = investor position, not a board seat, client
  position or "hat". Two conditions carried: no capital raised against the structure, and **counsel
  confirmation of instrument language is pending, date TBA**.

## Open / next

1. **V6 does not circulate and does not go to Noux until counsel confirms the instrument language.**
   HIC will announce the timing.
2. HIC's review order still to run: canonical data pass → legal/instrument pass → technical launch-gate
   pass → narrative pass.
3. Unreconciled data items named in V6 Appendix B: 80% stress floor vs modeled 73%/55%; ~€7k/month
   transport-vs-consulting split without a bookkeeping export; 5-vs-6 accounts at Dec 2025; account-level
   Azure commitment evidence and naming permission; Scenario A has no market evidence at all.
4. Trial Centre still has 1 visitor and 0 attachments — identify the visitor, produce P0 docs.
5. Automation Phase 1 (demo_tenants migration + provision script) unblocked; Phase 3 needs Cloudflare
   account/zone IDs; Phase 4 needs a verified answer on whether Noux has an API.
6. Environment: `scripts/render-doc.sh` cannot run from a cloud session (no ssh/scp binary; DGX is on a
   LAN address). PDFs here are rendered headless with Chromium. Run the pandoc path from Win11 or the DGX.
7. Deferred: `dws10.com/investor-relations/index.html:405` "Request Access" is a `mailto:` that opens a
   blank tab, on a non-canonical address, on a page mixing three addresses. Mirror must change with it.
