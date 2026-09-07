# Handoff — claude/noux-sales-rooms-setup-wu73bq

**Session:** 2026-08-30 → 04.09.2026 · Noux sales rooms · demo automation plan · investor deck V4 → V5 → **V6**

## Merged (PR #1826)

Everything from this session up to `75a91eda` is in `main`:

- **`sales-rooms/`** — three room folders (01 partners, 02 investor, 03 trial), each with `README.md`,
  `DOCUMENTS.md`, `OUTREACH.md`; plus `DEMO_TENANTS.md` (`dev.<slug>@dws10.com`) and
  `DEMO_AUTOMATION_PLAN.md` (5 phases, workflows W1–W4).
- **Deck of record: `investor-outreach/DWS-INVESTOR-DECK-V6-2026Q3.md`** — two GTM scenarios; A (SME
  Essentials) labelled an untested hypothesis, B (enterprise workforce) carrying the only contracted
  revenue. V4, V5 and the Dec-2025 v3.0 retained as superseded predecessors.
  Artifact: https://claude.ai/code/artifact/52ecdcb5-0c8d-429f-bfbe-6dffac236505
- **Pricing** — Essentials SKUs in `dws10.com/config/products.json` priceVersion **1.29** + mirror
  (`DWS-IQ-ESS-SETUP` €799, `-SUB-SELF` €49/mo, `-SUB-MANAGED` €249/mo). Roadmap v1.1 corrected the
  contradicting €750+€200 lines. Standalone Themis SKUs discontinued into `discontinuedProducts`.
- **Round record** — `DWS_TRUTH_STANDARD.md` v5.0: the sweep row listing €650k/€3.8M as unverified is
  superseded; the investor-round-structure row is authoritative. Captain = investor position.
- **Public pages** — `dws10.com/investor-centre/` (+ mirror): "Captain seats" → "Captain allocations",
  ninth-seat paragraph removed. Live on merge via Cloudflare.

## Open PR #1964 (this branch, restarted from main)

One commit correcting agent overreach: `main` still says V6 is "cleared for ... the Noux Investor
Centre". The HIC made V6 **official** but instructed no upload. PR fixes the publication status, the
6.2 history entry and the room manifest. **Nothing has been uploaded to Noux; all three rooms have 0
attachments.**

## Open / next

1. Distribution of V6 is an unmade HIC decision — do not upload or circulate without an explicit instruction.
2. Diligence items standing in V6 Appendix B: 80% Budget V3 stress floor vs modeled 73%/55%; ~€7k/month
   transport-vs-consulting split without a bookkeeping export; 5-vs-6 accounts at Dec 2025; account-level
   Azure commitment evidence and naming permission; AppExchange status; Scenario A has no market evidence.
3. Trial Centre: 1 visitor, 0 attachments — identify the visitor, produce P0 docs.
4. Automation Phase 1 (demo_tenants migration + provision script) unblocked; Phase 3 needs Cloudflare
   account/zone IDs; Phase 4 needs a verified answer on whether Noux has an API.
5. Environment: `scripts/render-doc.sh` cannot run from a cloud session (no ssh/scp binary; DGX is on a
   LAN address) — run the pandoc path from Win11 or the DGX. PDFs here are Chromium-rendered.
6. Deferred: `dws10.com/investor-relations/index.html` "Request Access" is a `mailto:` that opens a blank
   tab, on a non-canonical address, on a page mixing three addresses. Mirror must change with it.
