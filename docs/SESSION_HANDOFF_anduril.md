# Next-Session Prompt — continue from claude/anduril-case-study-iridtj

Paste this to start the next session.

---

Continue the DWS investor/positioning work from branch `claude/anduril-case-study-iridtj` (now merged to main). **Read `DWS_TRUTH_STANDARD.md` first** — it is at v2.5 and is the canonical record for everything below.

## State (locked & canonical, v2.5)

- **Positioning pillars (§2A):** Doctrine Shift · Orchestration-over-components · Buyer-Side Truth (Ari test).
- **Moats (§2 row 21):** 19 moats + Layer 0, buyer×investor, `docs/20-MOAT-FORTRESS.md` v3.0.
- **Team (§2 row 23):** two humans — Risto (Founder/CEO) + **Lucille Santiago** (Office Chief / HIC, partner-track Lifetime AB). Rocky/Marcus/Adrian are AI agent personas. CTO = governed agent workflows + **Cubet Techno Labs** partner + funded senior search (NOT a gap, NOT solo).
- **Industries:** 25 platform / 21 Aegis-tier.
- **CSRD (§2C):** post-Omnibus = **fewer than ~5,000 large EU companies** (>1,000 employees AND >€450M turnover) + value-chain Scope-3 pull. "49,000/50,000 must file" is DEPRECATED.
- **Never market on agent count** (Pillar 2). **No tailoring meta in exports** (§2B): clean copy in `DECKS_SEND_READY.md`, strategy in `DECKS_TAILORED.md`.

## Investor set (7) — clean send-ready decks in `investor-outreach/DECKS_SEND_READY.md`

Wilke (42CAP) · Maciej (Hard2beat) · Arthur (Plug&Play) · Salim (Plug&Play Paris) · Malte (Venista) · Budday (Venture Stars) · Shim (Breega). Each has an `INTRO_*.md` with fund intel. TAM build in `TAM_BUILD.md`; 42CAP principles in `docs/field-notes/2026-06-29-42cap-investment-principles.md`.

## PENDING (pick up here)

### Done on `claude/anduril-session-handoff-u8tigx` (2026-06-29)

- ✅ **Non-thesis straggler:** `docs/EXECUTIVE-SUMMARY-2026-TRENDS.md` CSRD figure → post-Omnibus "<5,000 large EU cos" (commit `4c48d50`). `docs/architecture/10-DELIVERY-LAUNCH.md` checked — **no** company-count CSRD claim (only € amounts; was a false positive).
- ✅ **`products.json` leaks** (both dual-folder mirrors): "80+ agent capabilities" → "full agent-capability library"; tier counts "3/8/18 AI agents" → named capabilities (commit `511a052`).
- ✅ **BLOCK71** "21 production AI agents" de-counted across 5 files; MRR/customer/industry figures left untouched pending confirmation (commit `5b389d6`).
- ✅ **Category 5 (blogs):** `18+ AI agents for EU compliance automation` footer de-counted across 56 onelifetime.world posts + 2 in-body counts; both mirrors synced, CRLF preserved (commit `e2ea6a3`).
- ✅ **`/truth-check --changed`:** 0 FAIL on all changes. 2 pre-existing WARNs noted below.
- ✅ **`/learn` plan applied** (commit `2560e3b`): the 3 rules added to `.claude/commands/truth-check.md` (sweep-completeness, context-aware-replace) and `DWS_TRUTH_STANDARD.md` §3A (register-or-it-drifts). NB: the plan's `skills/truth-check/SKILL.md` path does not exist — real home is `.claude/commands/truth-check.md`.

### Done (round 2, 2026-06-29)

- ✅ **KYA header 21 → 25** (platform-wide) in `kya-standard-v1.html` both mirrors; lint now 0 warn (commit `ea20596`).
- ✅ **CI gate flipped to blocking** — `.github/workflows/lint-truth-claims.yml` no longer `continue-on-error`; captures node exit via `PIPESTATUS` so the job summary still writes on failure. Diff-scoped (commit `f82c36c`).
- ✅ **Investor SOURCE CSRD sweep** — deprecated "50,000 companies must file CSRD" fixed across 11 investor-outreach decks/memos + the alden-biesen field note, context-aware per §2C (direct → "<5,000 large EU cos post-Omnibus"; addressable/carbon-ledger → "~5,000 filers + their value chains") (commit `c7d35e7`). 0 fail / 0 warn.

### Still open

1. **Learn/ HTML rebuild (Pandoc — unavailable in-session).** The upstream `.md` SOURCES are now correct (thesis + investor decks + field note). `Learn/*.html` renders still show the old figure and only update via the Pandoc build. Thesis renders (`V3Thesis_*`, `PHD_FIREHORSE_*` current) are RED-zone regardless; versioned archives (v3.70/71/73) are correctly frozen — do **not** retro-edit them. **Optional interim:** hand-patch the 5 non-thesis investor renders (`Learn/{2026-02-11-eu-alden-biesen…, investor-pitch-deck, V4.1-…, V3-…, lifetime-fi-home_v1.0}.html`) before a rebuild — not done (a rebuild redoes it; some are versioned snapshots).
2. **Owner review — two adjacent figures left intentionally:** (a) `ECOSUMMIT_PITCH_DECK_2026.md:48` "50,000+ EU companies … across four interlocking regulations" — multi-reg population, not the CSRD-direct figure; (b) "150,000 companies affected by CSRD/Fit for 55/EPBD" lines in `investor-pitch-deck.html`/`V3-…` renders — reads as value-chain/addressable, not direct filing. Both need a canonical call, not a blind swap.
3. **Confirm before external use:** MRR/ARR vs 6 customers; Kemira €29,990 Climate Intelligence scope (offer filed 27.6, **internal — not sent**); Nokia/Defence/NCC procurement contacts marked `[confirm]`. BLOCK71's €7K-MRR / 6-customer figures still unverified. _(2026-06-29: user confirmed traction figures are internal-only; Kemira bid not sent.)_

## Style rules that bit us this session (don't repeat)

- Don't paste working drafts with tailoring notes to counterparties (the Wilke leak → §2B).
- Don't mass-replace canonical numbers without context — check for false positives (LOC, "150,000 EUR" CBAM, "249,000 packages") and intentional before/after baselines.
- Surface conflicts, don't average; register canonical facts or they drift.
