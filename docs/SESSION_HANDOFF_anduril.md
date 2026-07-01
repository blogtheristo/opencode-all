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

1. **Learn/ HTML regeneration (Pandoc build)** — thesis MD sources (V3Thesis_EN/FI, PHD_FIREHORSE_EN/FI, all v3.74) are correct, but `Learn/*.html` outputs still show the old CSRD figure. Needs the Pandoc build step (can't run in-session).
2. **Non-thesis stale-figure stragglers:** `docs/EXECUTIVE-SUMMARY-2026-TRENDS.md`, `docs/architecture/10-DELIVERY-LAUNCH.md`, and older Learn investor HTML still carry "49,000/50,000".
3. **Other `products.json` leaks** flagged earlier: "80+ agent capabilities", "3/8 AI agents" on other products; `partners-outreach/BLOCK71` ("21 production AI agents").
4. **Category 5 (LinkedIn/blogs)** agent-count sweep — was held.
5. **Confirm before external use:** MRR/ARR vs 6 customers; Kemira €29,990 Climate Intelligence scope (offer filed 27.6); Nokia/Defence/NCC procurement contacts marked `[confirm]`.
6. **Run `/truth-check`** on any copy before it goes external.
7. **Apply the `/learn` plan** (`docs/learning-loops/2026-06-29-this-session.md`): 3 rules (sweep-completeness, context-aware-replace, register-or-it-drifts) — and consider flipping the truth-claims CI gate to blocking + adding a canonical-anchor digest to the session-start hook.

## Style rules that bit us this session (don't repeat)

- Don't paste working drafts with tailoring notes to counterparties (the Wilke leak → §2B).
- Don't mass-replace canonical numbers without context — check for false positives (LOC, "150,000 EUR" CBAM, "249,000 packages") and intentional before/after baselines.
- Surface conflicts, don't average; register canonical facts or they drift.
