# Handoff: claude/dws-sovereign-intelligence-wwho6h

## Task

"Introducing DWS Sovereign Intelligence (SI)." Then: "Audit term coinability and GTM value."

## State — DONE (self-corrected mid-branch)

**Part 1** — Promoted "Sovereign Intelligence (SI)" from a draft field note to a positioning thesis in `DWS_MARKET_RESEARCH_STANDARD.md` §8.3 and `DWS_TRUTH_STANDARD.md` row 27.

**Part 2** — User asked for a coinability/GTM audit of that same term. Findings required correcting Part 1's own framing (Rule 12, fail loud — don't leave a wrong claim standing):

- **Coinability: NOT a clean coinage.** Sovereign Intelligence, LLC (`sovereign.ai`, product Aurora) has held the exact name in an adjacent AI-intelligence/gov-intel vertical since ~2013 — real collision risk, especially against DWS's own Aegis defence/dual-use tier. Two funded 2026 competitors (StirlingX $20M Series A, Octostar) use near-identical phrasing as of this year, not historically.
- **Internal collision (self-inflicted):** `DWS_MARKET_RESEARCH_STANDARD.md` §8.1 already used "SI" = NVIDIA System Integrator partner network, 85 lines from the new §8.3. Fixed by spelling out "System Integrator (SI)" at first use in §8.1 and dropping "(SI)" entirely from the Sovereign Intelligence thesis.
- **GTM: moderate, not strong.** Market's entrenched buyer-search term is "sovereign AI" (NVIDIA/IBM/Microsoft/McKinsey/etc., $40B→$148B by 2032), not "sovereign intelligence." The CLOUD Act thesis sentence itself ("San Francisco stays in San Francisco") is the real distinctive asset — not found in competitor use — independent of the label wrapped around it.

**Files:**

- `docs/field-notes/2026-07-09-sovereign-intelligence-coinability-gtm-audit.md` — new, full audit + sources.
- `DWS_MARKET_RESEARCH_STANDARD.md` v1.4→1.5 — §8.3 corrected (no "(SI)" abbreviation, no coinage/exclusivity claims, reframed as positioning within the "sovereign AI" category); §8.1 NVIDIA row disambiguated; §11 table updated.
- `DWS_TRUTH_STANDARD.md` v2.9→3.0 — row 27 corrected to match.
- `docs/field-notes/2026-07-05-san-francisco-sovereign-intelligence-industries.md` v1.1→1.2 — correction note added; thesis/tweet copy itself still valid and usable.

`node scripts/lint-truth-claims.mjs`: 0 fail (35 pre-existing warns, unrelated).

## Next steps

- User said "do it" re: the flagged trademark-search gap. Attempted direct queries against USPTO tmsearch/TSDR, EUIPO eSearch, WIPO Global Brand DB, TMview, and 4 commercial aggregators — **all returned HTTP 403** (JS-walled/bot-protected, unreachable by this tool environment). Documented as an honest attempt, not a completed clearance, in audit v1.1 §2.5/§5.1. Also surfaced: "SOVEREIGN AI" itself is a registered USPTO mark held by ioXt, LLC (serial 99344034) — filing details unreachable.
- If DWS ever wants exclusive/trademark rights to any variant of this phrase, a real clearance still requires a human running the search in-browser, a paid clearance API/service, or IP counsel — none reachable from this environment.
- Otherwise none required — the thesis and tweet copy remain usable as positioning language, just not as a claimed DWS coinage.

## Blockers

None.
