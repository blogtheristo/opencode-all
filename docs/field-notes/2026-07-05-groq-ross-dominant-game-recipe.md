# Field Note: Ross on Choosing the Dominant Game — The DWS Winning Recipe

---

VERSION AND AGENT HISTORY

- Version: 1.0
- Status: ACTIVE
- Classification: INTERNAL
- Document type: Field Note / Strategy
- Author: Claude Code (claude-fable-5) + risto.paarni2024@lifetime.fi
- Date: 2026-07-05
- Location: Espoo, FI (Lifetime Oy HQ)
- Session: claude/dominant-game-strategy-cjstn5

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (claude-fable-5) | Date: 05.07.2026 | Changes: Initial field note — Groq founder Jonathan Ross's "choose the dominant game" framing (MySpace accounts vs Facebook MAU), mapped to the DWS metric hierarchy. Names the games DWS refuses to play, proposes the dominant-game metric (Monthly Governed Decisions + Customer-Retained Capital), and writes the 8-step recipe for committing the company to it. Quote confidence MEDIUM (user-supplied X paraphrase; verification pending — no primary transcript located via web search on 05.07.2026).

Document Status:

- Created: 05.07.2026
- Last Modified: 05.07.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE

Related Documents:

- `docs/field-notes/2026-07-02-karp-tokenization-economy-ai-moat.md` (token metering vs customer-owned capital formation — the pricing half of the same argument)
- `docs/field-notes/2026-06-19-token-capital-human-capital-control-room-capital.md` (4P Capital Classes — what the customer keeps)
- `docs/field-notes/2026-06-01-simon-willison-pmf-api-cost-edge-moat.md` (PMF/moat metric discussion)
- `docs/20-MOAT-FORTRESS.md` (19 moats + Layer 0 — the evidence layer the dominant game feeds)
- `DWS_TRUTH_STANDARD.md` §2A (Canonical Positioning Pillars — the drift guards this note operationalizes as a metric)
- `config/truth/mgd-crc-metrics.json` (structured mirror of §3, enforced by `/truth-check`)

> **Canonical registry — §3 is the single source of truth for the MGD / CRC north-star metric definitions.** Registered in `DWS_TRUTH_STANDARD.md` §2 row 29; structured mirror `config/truth/mgd-crc-metrics.json` (metric definitions copied verbatim from §3). If the mirror and §3 disagree, §3 wins.

---

## The Quote

Jonathan Ross (Groq founder, @JonathanRoss321), on what determines whether a company succeeds — via X, 05.07.2026:

> **"MySpace was focused on number of accounts signed up. Facebook focused on monthly active users — it was the dominant game."**
>
> **"If you maximize the monthly active, you're going to beat someone who's maximizing accounts signed up. You're playing a better game."**
>
> **"What most really successful founders and entrepreneurs do is, everyone else is playing this game, and they realize that if you play this higher level game, you win."**

> ⚠️ **MEDIUM confidence, verification pending (05.07.2026).** Wording supplied via a circulating X paraphrase; a web-search pass found no primary transcript. The structural argument (metric choice as strategy) stands on its own; do not quote Ross's exact wording externally until a primary source is located, per `DWS_TRUTH_STANDARD.md`.

## Ontology Tags

- **Geography:** Global > United States (Groq) > Europe (DWS positioning)
- **Sector:** Enterprise AI > Strategy > North-star metrics > Competitive intelligence
- **Entities:** Jonathan Ross (Groq), MySpace, Facebook/Meta, Lifetime Oy / DWS IQ 6
- **Temporal Context:** 2026-Q3
- **Confidence:** MEDIUM (quote wording) / HIGH (structural argument)

---

## 1. The Argument, Restated

Ross's claim decomposes into three points:

1. **The metric is the strategy.** A company optimizes what it measures. Two companies in the same market with different north-star metrics are, in effect, playing different games — and one of those games dominates the other.
2. **The dominant game measures the value moment, not the acquisition moment.** "Accounts signed up" counts the moment a user arrives; "monthly active users" counts the moment the product delivers value. A company maximizing value moments compounds; a company maximizing arrival moments plateaus and hollows out.
3. **Game selection precedes execution.** MySpace did not lose on execution within its game — it lost because its game was the wrong one. The winning move is available before the first sprint: notice which game everyone else is playing, and choose the game one level up.

This is the demand-side twin of the Karp field note (02.07.2026). Karp attacks the wrong game on the **pricing** axis (metering tokens = metering the input, not the value). Ross names the wrong game on the **metric** axis (counting acquisition, not value delivery). Same disease: measuring activity instead of outcome.

## 2. The Games Everyone Else Is Playing (and DWS Refuses To)

The enterprise-AI market in 2026 is saturated with acquisition-moment and activity metrics. Each has an internal DWS drift guard already registered against it:

| The game (what competitors maximize)      | Why it's the losing game                                                                     | Existing DWS guard                                                                   |
| ----------------------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| **Agent / skill / workflow count**        | Implementation detail dressed as progress; buyer cannot procure "50 agents"                  | Positioning Pillar 2 — agent count is never a headline (`DWS_TRUTH_STANDARD.md` §2A) |
| **Tokens consumed / API throughput**      | Meters the input; Karp's "wealth tax" — value extraction, not value delivery                 | Karp field note §1–2; 4P model (tokens are cost, not capital)                        |
| **Benchmark scores / model rankings**     | The frontier labs' game — a layer DWS deliberately does not compete in (multi-model posture) | §2D model-dependency posture — DWS is not its model vendor                           |
| **Logos / sign-ups / pilot count**        | Accounts-signed-up, literally — pilots that never reach a governed production decision       | Ari test (Pillar 3): a pilot that removes no risk is not quotable in procurement     |
| **Engineering poetry** (Gödel loops etc.) | The "bigger drift" already logged 2026-06-29 — capability narrative substituted for the moat | §2 row 21 drift guard                                                                |

Every one of these guards was written reactively, to stop a drift after it happened. Ross's framing turns them into one proactive rule: **they are all the same mistake — playing an acquisition/activity game in a market whose dominant game is outcomes.**

## 3. The Dominant Game DWS Plays

The dominant game is found by asking what the **buyer** is forced to maximize. Under the Doctrine Shift (Pillar 1), EU industrial compliance is moving from voluntary ESG to mandatory sovereign infrastructure: the buyer in DWS's 25 EU-regulated industries is not shopping for AI — they are compelled, by CBAM/CSRD/EU AI Act enforcement, to produce **compliance decisions that survive audit**, at bounded risk and cost. That is the buyer's game. DWS wins by making the buyer's game its own metric:

> **The MAU of DWS is the governed decision.**

| Era                 | Losing game (acquisition moment)                         | Dominant game (value moment)                                                                                                                                           |
| ------------------- | -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Social, 2008        | Accounts signed up (MySpace)                             | Monthly active users (Facebook)                                                                                                                                        |
| Enterprise AI, 2026 | Agents shipped, tokens consumed, benchmarks, pilot logos | **Monthly Governed Decisions (MGD)** — decisions through the DWS outcome layer, under Article 12 lineage, that survive audit — plus the **capital the customer keeps** |

**Proposed metric pair:**

1. **Monthly Governed Decisions (MGD)** — primary. A decision counts only when it (a) flows through the governed outcome layer, (b) carries full Article 12 reasoning lineage, and (c) is audit-grade (would survive regulator or internal-audit scrutiny). Pilots, demos, and ungoverned agent runs do not count — exactly as MySpace's dormant accounts did not count for Facebook.
2. **Customer-Retained Capital (CRC)** — secondary/compounding. The 4P assets (ontology, skills, calibrated Control Room thresholds, evaluated datasets) the customer owns after the engagement. This is the anti-Karp metric: proof DWS's game is capital formation, not extraction.

**Why MGD compounds like MAU did.** Every governed decision enriches the customer's ontology and Lifetime World Model (Prompt Capital) → richer ontology makes the next decision cheaper and more reliable → more decision classes get routed through the layer → switching cost rises (program-of-record dynamics, Layer 0 of the moat fortress). Activity metrics plateau; this loop compounds. That is what "playing a better game" means mechanically, not rhetorically.

**Why competitors maximizing their games lose to it.** A competitor maximizing agent count ships breadth the buyer can't procure. One maximizing token throughput invoices activity the buyer's CFO resents (Karp's "livid" enterprises). One maximizing benchmarks wins a leaderboard the buyer's auditor never reads. DWS maximizing audit-surviving decisions is the only one accumulating the exact evidence the buyer's regulator, board, and procurement gate demand — and per Ross, the one playing the dominant game wins even against better-executed losing games.

## 4. The Recipe

Eight steps — the repeatable procedure, not a one-off insight:

1. **Name the game being played.** Write down, explicitly, the metric competitors and the market currently maximize (§2 table). Unnamed games get played by default.
2. **Find what the buyer is forced to maximize.** Not what they _want_ — what regulation, procurement, and their board _compel_. The Doctrine Shift means the compulsion is durable ("non-expiring why-now").
3. **Move one level up.** The dominant game is the buyer's compulsory outcome, measured on DWS's side of the relationship: audit-surviving governed decisions, not compliance-software seats.
4. **Pass it through the Ari test (Pillar 3).** The metric must be risk removed or leverage gained, quotable verbatim in a procurement meeting. "We route 12,000 audit-grade governed decisions per month for stainless-steel CBAM filings" passes. "We have 50 agents" does not.
5. **Register it or it drifts.** Per `DWS_TRUTH_STANDARD.md` §3A: once ratified, MGD/CRC definitions get a §2 registry row, a structured mirror, and a deprecated-metrics list (§2 table above becomes the deprecated list). An unregistered north-star metric will be quietly replaced by an easier-to-inflate one within a quarter — that is exactly how the agent-count drift happened.
6. **Instrument it.** Control Room dashboard tile + agent execution logging already capture the raw events; the work is the audit-grade filter (which decisions count), not new plumbing.
7. **Route everything through it.** Roadmap, pricing, and sales hooks each answer one question: does this raise MGD or CRC for a named customer? Pricing follows the Karp note §3 — charge on the outcome layer where MGD lives, never resell metered tokens. Sales hooks lead with the buyer's own game ("your CBAM filing survives audit"), not DWS's internals.
8. **Re-check the game quarterly.** Dominant games shift (Facebook itself later moved from MAU to time-spent to revenue-per-user). Fold into the existing `/retro` → `/learn` loop: is MGD still the metric the buyer is compelled to maximize, or has enforcement/regulation moved the game again?

## 5. Guardrails — Do Not Overclaim

- **The quote is not yet verified** (§The Quote). Externally publish only the structural argument in DWS's own words; no direct Ross quotation until a primary source is found. Run `/truth-check` on any external copy pairing this framing with a DWS claim.
- **MGD/CRC are proposals, not canonical facts.** Registering a company north-star metric is a founder decision (Truth Standard §9: CEO sign-off on §2 registry changes). Until ratified and registered, do not assert "DWS's north-star metric is MGD" in investor or customer copy.
- **Do not let the metric become the drift.** A governed decision that would not actually survive audit but gets counted anyway is the same disease as counting sign-ups — the audit-grade filter (step 6) is the integrity of the whole game. Fail loud on uncountable or partially-governed decisions; never pad the number.

---

## 6. Key Takeaway

> **Ross: everyone else is playing this game; if you play the higher-level game, you win.**
>
> The enterprise-AI market counts agents, tokens, benchmarks, and logos — acquisition moments. The buyer, under mandatory EU compliance doctrine, is compelled to maximize exactly one thing: decisions that survive audit. DWS wins by making that its number — Monthly Governed Decisions plus the capital the customer keeps — registering it so it cannot drift, and routing roadmap, pricing, and sales through it. The recipe is §4; the discipline is step 5.

---

**Status:** ✅ Processed → ⚪ Not yet published externally (quote verification pending) → 🟡 Metric proposal awaiting founder ratification (§5)
**Confidence:** MEDIUM (quote wording) / HIGH (strategic read)
**Impact:** Strategic (converts the reactive drift guards — agent count, token metering, capability narrative — into one proactive metric doctrine; defines the MGD/CRC candidate north-star pair for founder decision)
