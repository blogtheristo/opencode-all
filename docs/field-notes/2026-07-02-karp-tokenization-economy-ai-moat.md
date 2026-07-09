# Field Note: Karp on the Tokenization Economy — "Stealing the Weights and Alpha of My Business"

---

VERSION AND AGENT HISTORY

- Version: 1.7
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
- Version: 1.3 | Tool: Claude Code (claude-sonnet-5) | Date: 02.07.2026 | Changes: Web-search verification pass — confirmed Karp quote via CNBC primary source + 4 corroborating outlets (upgraded confidence MEDIUM→HIGH); confirmed §6 distillation mechanism via Anthropic's public DeepSeek/Moonshot/MiniMax and Alibaba/Qwen accusations. Added §7 Sources & Verification. Flagged the "exposed Altman/Amodei" viral-framing as unverified commentary, distinct from the sourced quote.
- Version: 1.4 | Tool: Claude Code (claude-sonnet-5) | Date: 02.07.2026 | Changes: Added §8 The Application Layer Is the Trust Layer (via `/dialog`, HIC-confirmed §8.1–§8.6, all agreed) — new Karp quote from the same 01.07.2026 interview ("that application layer is our ontology"), sourced via @amitisinvesting; ties trust-as-architecture and forward-deployed-engineering framing back to the 21.01.2026 ontology field note and the DWS Article 12 / HIL-phase capital-formation thesis.
- Version: 1.5 | Tool: Claude Code (claude-sonnet-5) | Date: 02.07.2026 | Changes: Added §9 The Figma Precedent (via `/dialog`, HIC-confirmed §9.1–§9.9, all agreed) — verified Karp "means of production" quote (same interview); dated, sourced Anthropic/Figma Claude Design incident (Krieger board resignation, stock drop, Dylan Field "not consistently candid"); confirmed Claude Science/Security/Legal as real products; Dario Amodei "dangerous" open-source quote with commercial-interest caveat. §9.1 applies the precedent as a live architectural risk to DWS's own Claude-dependent Premium Agent strategy, not just competitor commentary.
- Version: 1.6 | Tool: Claude Code (claude-sonnet-5) | Date: 02.07.2026 | Changes: Corrected §9.1 per Risto — DWS is not single-sourced to Claude. Production tooling already spans Claude, GitHub Copilot (OpenAI models), and self-hosted Ollama on DGX Spark (NVIDIA/open models). Reframed §9.1 from "gap to close" to "existing posture verified correct by the Figma precedent."
- Version: 1.7 | Tool: Claude Code (claude-sonnet-5) | Date: 02.07.2026 | Changes: Added Google Gemini as a fourth confirmed model-layer relationship per Risto — verified live in `src/agents/model-selector.ts`'s tier-based router (Gemini 2.5 Flash-Lite/Flash, Gemini 3 Pro across low/mid/high tiers).

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

Alex Karp, on CNBC's _Squawk Box_, 01.07.2026 — announcing the expanded Palantir-Nvidia partnership (Nemotron models into Palantir's Sovereign AI platform) and, in the same appearance, criticizing OpenAI's and Anthropic's token-based pricing:

> **"Every single enterprise in this country, these people are LIVID. They are paying for tokens that create no value. These people are stealing the weights and alpha of my business."**
>
> **"If it was so valuable, and I can make you a billion dollars, wouldn't I say I'll make you a billion dollars and I want 30%? Why are they charging for tokens if it's so valuable?"**
>
> **"These people are stealing the weights and alpha of my business, and they're creating a wealth tax that does not help the poor. It just punishes."**

> ✅ **Verified 02.07.2026.** Confirmed via CNBC's own report of the interview plus independent coverage (SiliconANGLE, Yahoo Finance, 24/7 Wall St, Mediaite) — see §7 Sources & Verification. Confidence upgraded from MEDIUM to **HIGH** on both wording and strategic argument. The original framing in this note ("circulating clip/paraphrase") is superseded; kept below for the audit trail only.

## Ontology Tags

- **Geography:** Global > United States (Palantir, OpenAI, Anthropic) > Europe (DWS positioning)
- **Sector:** Enterprise AI > Frontier model pricing > Competitive intelligence
- **Entities:** Alex Karp (Palantir), Sam Altman (OpenAI), Dario Amodei (Anthropic), Fortune 500 enterprise buyers, Lifetime Oy / DWS IQ 6
- **Temporal Context:** 2026-Q3, ongoing frontier-lab pricing/value debate
- **Confidence:** HIGH (exact quote wording, verified) / HIGH (structural argument)

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
- **Wording is now verified** (see §7 Sources & Verification) — direct external quotation of Karp is permitted with attribution to CNBC's 01.07.2026 _Squawk Box_ interview. Still run `/truth-check` before publishing DWS-external copy that pairs the quote with a DWS claim, per `DWS_TRUTH_STANDARD.md`.

## 3. Product / Positioning Implication

- Sales/positioning language may now reference the **structural argument** and directly attribute the quote to Karp externally (source verified — see §7); still avoid pairing it with an unreviewed DWS pricing claim per §2.3.
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

> ✅ **Verified 02.07.2026.** The "open-source copies which also learn from you" half of this claim is independently corroborated: Anthropic has publicly accused DeepSeek, Moonshot, and MiniMax (Feb 2026) and Alibaba's Qwen lab (Jun 2026) of running large-scale adversarial distillation campaigns against Claude — millions of fraudulent-account exchanges specifically targeting software-engineering and agentic-reasoning outputs. This confirms the mechanism (open-source labs training on frontier-model outputs) is real and actively contested, not speculative. See §7.

---

## 7. Sources & Verification

- Karp quote (§0/"The Quote"): CNBC, ["Palantir's Karp bashes OpenAI, Anthropic token model: 'Something has gone completely wrong'"](https://www.cnbc.com/2026/07/01/palantir-karp-open-ai-anthropic-tokens.html), 01.07.2026 — primary source, Squawk Box interview.
- Corroborating coverage: [SiliconANGLE](https://siliconangle.com/2026/07/01/palantir-ceo-alex-karp-doesnt-hold-back-interview-rails-ai-industry/), [Yahoo Finance](https://finance.yahoo.com/technology/ai/articles/palantir-ceo-alex-karp-enterprises-175255513.html), [24/7 Wall St](https://247wallst.com/investing/2026/07/01/palantir-ceo-alex-karp-enterprises-are-livid-over-ai-models-that-steal-their-business-value/), [Mediaite](https://www.mediaite.com/media/tv/you-sound-pretty-angry-cnbc-anchor-left-stunned-as-palantir-ceo-blows-his-stack-during-wild-interview/).
- Distillation corroboration (§6): CNBC, ["Anthropic accuses DeepSeek, Moonshot and MiniMax of distillation attacks on Claude"](https://www.cnbc.com/2026/02/24/anthropic-openai-china-firms-distillation-deepseek.html), 24.02.2026; NBC News, ["Chinese AI companies 'distilled' Claude to improve own models, Anthropic says"](https://www.nbcnews.com/world/asia/chinese-ai-companies-distilled-claude-improve-models-anthropic-says-rcna260386) (Alibaba/Qwen campaign, ~28.8M exchanges via ~25,000 fraudulent accounts, Apr–Jun 2026).
- **Not independently verified here:** the specific claim that Karp's remarks were made "within two minutes" or constituted him "exposing" Altman/Amodei by name — that framing originates from a viral X paraphrase ([@Ric_RTP](https://x.com/Ric_RTP/status/2072403984304984202)), not the primary CNBC transcript. Treat the summarizing/viral framing as commentary, not sourced fact.

---

## 8. The Application Layer Is the Trust Layer

> Alex Karp, CNBC Squawk Box, 01.07.2026 (same interview as §"The Quote"; via @amitisinvesting on X): "I've been in business for a very long time. The reality is, critical infrastructure does not run these models without an application layer. That application layer is our ontology. There's a reason for it. Some people love me and some people hate me. They're not buying it because of that. They're buying it because they have to be made safe. The 'I'm gonna trust you because you've never lied' bs thing, that just doesn't cut it at this level."

> ✅ HIGH confidence on the "application layer is our ontology" line (independently corroborated, same verified interview as §The Quote). MEDIUM confidence on exact wording of the "never lied" line — found only via the sourcing tweet, no independent transcript excerpt located.

This sharpens, rather than repeats, the 21.01.2026 field note thesis ("If you just buy LLMs off the shelf... it won't work") — Karp is now stating the ontology/application-layer requirement as a _trust and safety_ condition for critical infrastructure, not only a value-creation condition. Raw model trust ("I've never lied") is explicitly rejected as insufficient at this level; trust has to be architectural, not reputational.

This is structurally the same claim DWS makes with Article 12 reasoning lineage: a model is not trusted because a vendor has a good track record, it is trusted because every decision is traceable through an ontology/orchestration layer that a regulator or customer can audit independently of the vendor's word.

It also reframes the forward-deployed-engineering point from the shared @amitisinvesting commentary: months-to-years of unpaid, outcome-focused customer engagement is what the token-metered frontier labs structurally cannot offer, because their business model is metered from message one. DWS's own HIL-phase capital formation (cf. §2.1, and the 19.06.2026 Prompt Capital field note) is the same long-horizon, outcome-first posture — the trust is earned by time invested in the customer's specific context, not asserted by brand.

> **"Karp: 'That application layer is our ontology... they're buying it because they have to be made safe.' DWS's answer is the same claim, EU-sovereign: trust is architectural (ontology + Article 12 lineage), not reputational — and it is earned the same way Karp says it is earned, through sustained, outcome-focused engagement rather than a metered token relationship."**

---

## 9. The Figma Precedent — Verified Evidence for the Extraction Mechanism

> Alex Karp, same 01.07.2026 CNBC interview: "What aligns me with Nvidia, and I think is what the technical customers want, is control over their compute, their models, their data stack, and their alpha. They want to know they own the means of production, it's not being transferred to someone else." He added that companies "are not interested in some fake deploy co that somehow is deploying tokens that transfers the alpha to a third party."

> ✅ HIGH confidence — same verified interview as §The Quote, sourced via @PalantirTech's own account of the interview.

The concrete case: Anthropic's CPO, Mike Krieger, resigned from Figma's board on 14.04.2026. Three days later, on 17.04.2026, Anthropic launched Claude Design — a prompt-to-prototype tool competing directly with Figma's core product. Figma's stock fell 6-7.7% same day (~$1.2B market cap). An investor called for an independent board investigation into whether Anthropic used Figma's confidential information ahead of the launch. Figma CEO Dylan Field: Anthropic "were not consistently candid in their communications."

This is not an isolated incident in the pattern sense, though each instance needs its own scrutiny before being cited as equivalent: Anthropic has also launched Claude Science (research/drug-discovery tooling), Claude Security (vulnerability scanning), and Claude Legal (law-firm workflow plug-ins) — each entering a category previously served by companies building on top of Claude. Confirmed as real, shipped products, not exaggeration; whether each launch involved a Figma-style trust breach is not verified here and should not be assumed.

Dario Amodei has separately argued open-source models approaching Claude's capability are "dangerous" — a safety claim that may be genuinely held and also happens to describe the exact competitive threat to Anthropic's own API business. Both can be true at once; the alignment between the safety argument and the commercial interest is a relevant data point, not proof the argument is made in bad faith.

Karp's "means of production" framing crystallizes §1-2 and §8 into one sentence: real enterprise AI safety is not trusting a lab's roadmap, it is retaining the ability to choose, at the model layer, who sees your alpha. Figma had a board seat, a joint feature launch two months prior ("Code to Canvas"), and three days' notice — and still could not see it coming. Contractual and relationship proximity did not substitute for structural control.

### 9.1 This is a live risk category to weigh — and DWS's actual posture is already multi-sourced, not single-vendor

**Correction (Risto, 02.07.2026):** DWS is not single-sourced to Claude. Production tooling already spans four model layers: Claude (Anthropic), GitHub Copilot (OpenAI models), self-hosted Ollama on DGX Spark (NVIDIA/open models — cf. the `ollama-spark` skill, used specifically "when Anthropic/Groq limits hit or the prompt must stay in EU," and the `2026-07-02-nemotron-twotower-ontology-stage1-throughput.md` field note's Stage 1 use of a self-hosted, EU-resident model), and Google Gemini (confirmed live in `src/agents/model-selector.ts`'s tier-based router — Gemini 2.5 Flash-Lite/Flash and Gemini 3 Pro are wired options across the low/mid/high reasoning tiers alongside Claude, Llama, and Qwen). The Figma precedent still stands as the reason model-layer optionality matters — but as a **verification that DWS's existing posture is the right one**, not as a gap DWS needs to close. §6's "Premium Agents ride Claude's quality edge" describes one product surface's current default, not the org's only model dependency.

The Figma precedent is the concrete version of the abstract risk §2.2's sovereignty table already names: a deep, trusted, board-adjacent relationship with a frontier lab did not protect Figma from the lab entering its category with three days' notice. DWS's mitigations are the same ones §2.2 already lists — EU-sovereign deployment, no cross-customer retraining exposure, owning the ontology/orchestration layer rather than being a thin wrapper — plus, concretely, the multi-model posture above: no single frontier lab's roadmap decision can unilaterally strand a DWS product surface the way Claude Design stranded Figma's.

> **"Figma had a board seat and two months' collaboration. Anthropic still moved into its category with three days' notice. The lesson generalizes to anyone building a premium layer on top of a frontier model: proximity and trust are not control. DWS's answer isn't hypothetical — Claude, OpenAI (via Copilot), Google Gemini, and self-hosted open models on owned NVIDIA hardware are already four separate model-layer relationships, none of which can unilaterally strand a DWS product the way Claude Design stranded Figma."**

---

**Status:** ✅ Processed → 🟢 Published externally (see §5) → 🔵 Verified (see §7)
**Confidence:** HIGH (quote wording, verified) / HIGH (strategic read) / HIGH (§6 distillation mechanism, corroborated) / HIGH+MEDIUM (§8, split per-line) / HIGH (§9, verified)
**Impact:** Strategic (sharpens DWS non-extractive, EU-sovereign pricing/positioning narrative; now in public circulation, source-verified; §9.1 confirms DWS's existing multi-model posture — Claude, OpenAI/Copilot, Google Gemini, self-hosted Ollama on NVIDIA — already answers the Figma-precedent risk)
