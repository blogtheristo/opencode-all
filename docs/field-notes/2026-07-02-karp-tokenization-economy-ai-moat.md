# Field Note: Karp on the Tokenization Economy — "Stealing the Weights and Alpha of My Business"

---

VERSION AND AGENT HISTORY

- Version: 1.2
- Status: ACTIVE
- Classification: INTERNAL
- Document type: Field Note / Competitive Intelligence
- Author: Claude Code (claude-sonnet-5) + risto.paarni2024@lifetime.fi
- Date: 2026-07-02
- Location: Espoo, FI (Lifetime Oy HQ)
- Session: claude/tokenization-economy-ai-moat-zwfrr8

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (claude-sonnet-5) | Date: 02.07.2026 | Changes: Initial field note — Palantir CEO Alex Karp's televised critique of per-token frontier-model pricing as IP extraction; mapped to the DWS 4P Capital Classes model and DWS's non-extractive, EU-sovereign positioning.
- Version: 1.1 | Tool: Claude Code (claude-sonnet-5) | Date: 02.07.2026 | Changes: Added §5 External Publication Record — @blogtheristo tweeted the §2.2 structural-argument paraphrase tagging @DWS10_com and @PalantirTech; status updated to Published externally.
- Version: 1.2 | Tool: Claude Code (claude-sonnet-5) | Date: 02.07.2026 | Changes: Added §6 The Counterpoint (via `/dialog`, HIC-confirmed §6.1–§6.6, all agreed) — elite-usage-as-quality-moat claim from @blogtheristo, reconciled with the §1–2 Karp extraction critique, DWS "Premium Agents" positioning response.

Document Status:

- Created: 02.07.2026
- Last Modified: 02.07.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE

Related Documents:

- `docs/field-notes/2026-01-21-karp-enterprise-ai-ontology.md` (Karp on ontology/orchestration as the value layer)
- `docs/field-notes/2026-06-19-token-capital-human-capital-control-room-capital.md` (4P Capital Classes — Prompt/People/Plant/Perception)
- `DWS_MARKET_RESEARCH_STANDARD.md` (competitor tracking)
- `DWS_TRUTH_STANDARD.md` (claim verification before external use)

---

## The Quote

Alex Karp, in a televised interview, on frontier-lab token pricing (as reported / paraphrased in a circulating clip):

> **"Every single enterprise in this country, these people are LIVID. They are paying for tokens that create no value. These people are stealing the weights and alpha of my business."**
>
> **"If it was so valuable, let's say I can make you $1 billion tomorrow. Wouldn't I say I'll make you $1 billion and I want 30 percent? Why are they charging for tokens if it's so valuable?"**
>
> **"A wealth tax that does not help the poor. It just punishes."**

> ⚠️ These lines are drawn from a circulating clip/paraphrase, not a primary transcript sourced and verified here. Treat as **MEDIUM confidence** on exact wording, **HIGH confidence** on the strategic argument (it is consistent with Karp's public positioning elsewhere — cf. the earlier ontology-layer field note). Run `/truth-check` before any DWS-external quotation of Karp derived from this note, per `DWS_TRUTH_STANDARD.md`.

## Ontology Tags

- **Geography:** Global > United States (Palantir, OpenAI, Anthropic) > Europe (DWS positioning)
- **Sector:** Enterprise AI > Frontier model pricing > Competitive intelligence
- **Entities:** Alex Karp (Palantir), Sam Altman (OpenAI), Dario Amodei (Anthropic), Fortune 500 enterprise buyers, Lifetime Oy / DWS IQ 6
- **Temporal Context:** 2026-Q3, ongoing frontier-lab pricing/value debate
- **Confidence:** MEDIUM (exact quote wording) / HIGH (structural argument)

---

## 1. The Argument, Restated

Karp's claim decomposes into three linked points:

1. **Pricing reveals belief.** A vendor that priced by value (equity, profit share) would be signaling durable, attributable value creation. A vendor that prices by token is signaling that value is neither durable nor attributable — so it falls back to metering the input (compute), not the output (result).
2. **Token metering is a confession.** If a model reliably delivered $1B in enterprise value, the rational vendor move is to take a percentage of that value, not sell access by the million tokens. The fact that no frontier lab does this is evidence the labs themselves do not trust their own value claims at the per-engagement level.
3. **The extraction mechanism.** Enterprises route proprietary workflows, customer data, and strategic documents through frontier models to get any value out of them at all. The lab keeps the token fee _and_ the compounding signal about how that specific business operates — which, at retrain time, can resurface as a feature sold to that customer's competitors. Karp's word for this is "stealing."

This is not a new critique in form — "pay for outcomes, not inputs" is an old enterprise-software argument — but Karp is naming the specific mechanism (retrain-on-customer-data as competitive leakage) and giving it a moral frame ("wealth tax") rather than just a pricing-model frame.

## 2. Why This Matters for DWS

### 2.1 It validates the non-token-metered thesis already in the 4P Capital model

`docs/field-notes/2026-06-19-token-capital-human-capital-control-room-capital.md` already draws the line Karp is drawing, from the other side: **Prompt Capital is not the tokens consumed — those are cost. It is what a company owns after the tokens are spent** (skills, validated agent configs, ontology, evaluated datasets). Karp's critique is the mirror image: token billing without a capital-formation mechanism on the customer's side is pure extraction, because the customer pays for compute and walks away with nothing durable.

DWS's answer to "why are they charging for tokens if it's so valuable" is structural, not rhetorical: DWS's engagement model is explicitly built so the customer **retains** the compounding asset — skills, ontology templates, calibrated Control Room thresholds — rather than renting access to someone else's model and forfeiting the exhaust.

### 2.2 The "stealing the alpha" mechanism is exactly what EU sovereignty positioning exists to prevent

Karp's sharpest point — that a customer's workflows, once run through a frontier model, can become that vendor's next enterprise product sold to a competitor — is precisely the CLOUD Act / data-residency exposure DWS's sovereignty thesis (cf. `2026-06-29-anduril-software-native-defense-case-study.md` §2.4, `skills/sovereignty-pillars-assess/SKILL.md`) is built against. The DWS-relevant reframe:

| Karp's critique (of US frontier labs)                      | DWS structural answer                                                                                     |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Token fee + customer data both flow to the vendor          | EU-sovereign deployment — customer data does not leave customer/EU control to train a third-party model   |
| Customer's alpha can resurface as a competitor's feature   | No cross-customer retraining; ontology/skills built per engagement stay the customer's asset              |
| Pricing is for compute, not for durable value              | Engagement produces capital the customer keeps (Prompt/Plant/Perception Capital) — not a subscription     |
| "Stealing weights and alpha" — no attribution, no recourse | Article 12-grade reasoning lineage — every decision traceable, nothing silently absorbed into a black box |

DWS does not need to invent a counter-argument to Karp — it needs to state, explicitly, that the DWS engagement model is what an enterprise gets when it takes his critique seriously and shops for the alternative.

### 2.3 Caution: do not overclaim

Two things this field note should **not** do:

- **Do not repeat the $1B/30% framing as a DWS pricing model** without a deliberate pricing decision — it is Karp's rhetorical device against frontier labs charging _him_ for base models, not a proposal DWS should adopt uncritically for its own customer contracts. Outcome/equity-based pricing has its own risks (attribution disputes, cash-flow timing for a smaller vendor) that a larger, profitable incumbent can absorb more easily than DWS can today.
- **Do not use the quote externally** (blog, sales deck, investor material) until wording is confirmed against a primary source per `DWS_TRUTH_STANDARD.md`. This note is for internal positioning use.

## 3. Product / Positioning Implication

- Sales/positioning language may reference the **structural argument** (token billing without customer-owned capital formation is extractive) without directly attributing the exact phrasing to Karp externally, until sourced.
- Reinforces that DWS pricing should keep leaning toward **capital-transfer and outcome framing** (per §5.3 of the Prompt Capital field note) rather than raw per-token resale — DWS is not reselling frontier tokens; it is selling the ontology/orchestration layer and the capital the customer keeps.
- Add to sales-hook pattern (cf. Anduril field note §"Signal-based sales hooks"): a prospect anxious about a US frontier vendor's data-retention/training terms is a live sovereignty-thesis lead.

---

## 4. Key Takeaway

> **Karp: "Why are they charging for tokens if it's so valuable?"**
>
> Token metering without customer-owned capital formation is extraction dressed as a subscription. DWS's answer is structural: the customer keeps the ontology, the skills, and the sovereignty — not just the invoice.

---

## 5. External Publication Record

- **Channel:** X/Twitter, @blogtheristo (Risto Anton), 02.07.2026
- **Content used:** the §2.2 structural-argument paraphrase — "maps directly onto the existing 4P Capital Classes thesis (customer keeps Prompt/Plant/Perception capital, not just an invoice) and the EU-sovereignty positioning (no cross-customer retraining, Article 12 lineage, data residency) — DWS is structurally the answer to Karp's critique rather than needing to argue against it" — tagging @DWS10_com and @PalantirTech.
- **Guardrail compliance:** consistent with §2.3 — this is the DWS structural-argument framing, not a direct quotation of Karp's original words; no unsourced Karp quote was published externally.
- **Follow-up:** monitor the thread for any Palantir/Karp response; if engagement warrants a longer treatment, elevate this field note toward a Core Artifact per the field-note lifecycle (`docs/field-notes/README.md`).

---

## 6. The Counterpoint — Elite Usage as a Quality Moat, and DWS's Premium Agent Response

> @blogtheristo, X/Twitter, follow-up to this note: "When the Best companies and their engineer use the Best Models @AnthropicAI it learns from us but then in return the quality stays on Top against open-source copies which also learn from you. Keep building Premium Agents!"

This is not a contradiction of §1–2. It is the other half of the same mechanism: elite usage — best companies, best engineers — generates the highest-quality signal a frontier lab receives, and that signal is what keeps the frontier model's quality ahead of open-source models that distill or copy its outputs.

Both effects run concurrently: the enterprise-specific extraction risk Karp names (§1) is real at the level of one customer's workflows, while the aggregate elite-usage feedback loop (§6) is what sustains frontier-model quality for every user of that model, including the open-source copies trying to keep pace.

DWS's structural answer is therefore not to avoid frontier models but to sit on top of the best available model while keeping the sovereignty guardrails of §2.2 in place — capturing the state-of-the-art quality benefit through Premium Agents, without becoming the raw workflow signal that leaks a specific customer's alpha.

> **"Best companies using the best models keep that model's quality ahead of open-source copies. DWS's Premium Agents ride that quality edge — while the sovereignty layer keeps the customer's own alpha from being part of the signal given away."**

---

**Status:** ✅ Processed → 🟢 Published externally (see §5)
**Confidence:** MEDIUM (exact quote wording) / HIGH (strategic read)
**Impact:** Strategic (sharpens DWS non-extractive, EU-sovereign pricing/positioning narrative; now in public circulation)
