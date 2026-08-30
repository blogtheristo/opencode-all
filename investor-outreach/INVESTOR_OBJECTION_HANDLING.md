# Investor Objection Handling — DWS IQ 6

***
# VERSION AND AGENT HISTORY

Version: 2.0

Sessions & Modifications:
  - Version: 2.0 | Tool: Claude Code (Opus 5) | Session: claude/traction-truth-reconciliation | Date: 29.07.2026 | Changes: Reconciled to `docs/TRACTION_CANONICAL.md`. Objection 3 rewritten — the six-name "customer" list (KELA, Taksi Helsinki, Uber Finland, Bolt Finland, Limo Helsinki, Sixt) is retired: those are dispatch operators and commercial counterparties of the licensed transport operation, not software customers. €7K MRR reframed as services and transport revenue. Customer Reference Card replaced with the redacted LAND-* software accounts. "100% retention" and the €84K ARR comparable row removed. Closes audit Gap 9 for this file.
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/research-leworldmodel-r3VRA | Date: 25.03.2026 | Changes: Initial version — 9 objections, locked to Story A (carbon balance sheet infrastructure), sequenced roadmap to fleet/Physical AI. Validated customer list (6 customers), compliance SaaS comparables (Persefoni, Sweep), LeWorldModel research context.

Session Links & References:
  - Claude Code (claude/research-leworldmodel-r3VRA): https://github.com/blogtheristo/dws6/commits/claude/research-leworldmodel-r3VRA
  - Canonical traction source: docs/TRACTION_CANONICAL.md
  - LeWorldModel research: docs/LeWorldModel.md
  - Investor Hook Deck: docs/INVESTOR_HOOK_DECK.md
  - Fleet Admiral Pitch: Lifetime Fleet/Fleet Admiral/FLEET_ADMIRAL_PITCH.md

Document Status:
  - Created: 25.03.2026
  - Last Modified: 29.07.2026
  - Language: English
  - Publication Status: ACTIVE

***

## Context

**Round:** EUR 650K SAFE at EUR 3.8M cap
**Story:** Carbon balance sheet infrastructure for industrial Europe
**Sequence:** Compliance revenue (now) → Fleet pilots (next) → Series A (2027)

This document is locked to Story A for the current fundraise. Fleet and Physical AI are in the roadmap (Objection 9), not the lead pitch.

---

## Objection Table

### 1. "What exactly are you building?"

Double-entry bookkeeping for CO2. Every compliance event produces a journal entry in both EUR and tCO2e.

A steel mill's ETS surrender flows through to a construction company's CBAM import, becomes their CSRD Scope 3 disclosure, and determines their Taxonomy alignment. Same carbon, four regulatory touchpoints, one auditable ledger.

Fewer than ~5,000 large EU companies file directly post-Omnibus, and their value chains need this by 2028. We are shipping it now.

### 2. "Why can't a Big 4 consultancy or SAP do this?"

Big 4 sells hours. We sell infrastructure. Their output is a PDF report once a year. Ours is a live ledger that updates when regulations change.

SAP has ERP data but no regulatory intelligence graph. We index 15,000+ EU regulatory documents across 25 industries and map obligations across ETS, CBAM, CSRD, EPBD, and Taxonomy simultaneously.

Seven years and six platform versions to build. 3-5 years to replicate.

### 3. "Where is the revenue?"

Two lines, and we keep them apart deliberately.

**Services and transport revenue: ~EUR 7,000/month.** Lifetime Oy runs a licensed passenger-transport operation plus a small consulting practice. That revenue puts the company at cash break-even with a founder salary of EUR 0 — it is what funds product development. It is **not** software revenue and we do not present it as MRR.

Ride orders reach our vehicles through dispatch operators — Uber, Bolt, Kela, Taksi Helsinki — in the dispatch-service role defined by Traficom. They charge commission on completed jobs and buy transport capacity. They are commercial counterparties of the transport business, **not customers of DWS IQ**.

**Software: EUR 59,900 booked in Q1/2026** — two enterprise pilots at EUR 29,950 each, plus four smaller landed accounts tracked under redacted LAND-* codes in the data room. Outokumpu and Kemira are active discussions with documented inbound replies; we say "in discussion", not "filed".

So the honest answer to "the revenue is tiny" is: yes, the software revenue is early. What the transport line buys us is that we are not burning — we can run at zero salary while the pilots convert.

The market is forced. CSRD, ETS expansion, CBAM, EPBD — EUR 25B compliance spend over 10 years. These are not discretionary purchases.

### 4. "How do you make money?"

Edge AI compliance platform: EUR 17K/year per customer vs EUR 350K/year for cloud-based alternatives.

NVIDIA Jetson Orin Nano at EUR 500 per device, 7-15 watts, runs at construction sites and factories where cloud does not reach.

Network effect: when customer A's verified emissions become customer B's actual CBAM import factor instead of regulatory defaults, both ledgers improve. More customers = more accurate data = higher switching cost.

### 5. "What is the moat?"

Three pillars. Each takes years to build. Together they are a moat.

**Pillar 1: Carbon balance sheet with network effects.** No competitor has cross-customer carbon flow. One customer's verified emissions improve another's CBAM factor. That is a network effect. 3-5 years to replicate.

**Pillar 2: Regulatory intelligence graph.** 15,000+ EU documents, 25 industries, a fleet of skilled agents. Not a fine-tuned GPT on PDFs. A structured knowledge graph built over 7 years across 6 platform versions. 3-5 years to replicate.

**Pillar 3: Edge deployment + model-agnostic orchestration.** AI inference on-premise at EUR 17K/year. Swap any LLM — the intelligence lives in the knowledge graph and the ledger, not the model provider. Built on Model Context Protocol (MCP). 2-3 years to replicate.

### 6. "What about AI companies like OpenAI or Anthropic entering compliance?"

They build general-purpose models. We build domain-specific infrastructure.

Our value is not the LLM. Our value is 15,000+ indexed regulatory documents, Nordic ERP connectors (SAP, IFS, Visma, Monitor), and two decades of operating inside EU-regulated industry — including running a licensed transport business under Finnish transport regulation, which is where the founder learned what compliance actually costs an operator.

Silicon Valley cannot disrupt that domain time.

### 7. "What is the world model I keep seeing in your materials?"

Our regulatory intelligence engine. It maps how obligations flow across regulations — ETS to CBAM to CSRD to Taxonomy — so one data input satisfies multiple reporting requirements.

We use open-source models (Llama, Mistral, Qwen) fine-tuned on proprietary EU regulatory data. We are not training a foundation model. We are building the domain-specific intelligence layer on top of commodity AI.

The architecture is validated by the broader world models category (LeCun's AMI Labs, World Labs both raised USD 1B+ in early 2026), but our product is vertical regulatory infrastructure, not general-purpose physics simulation.

### 8. "Why EUR 3.8M cap?"

Persefoni raised $9.7M Series A on $1.8M ARR in carbon accounting (April 2021). Sweep raised $22M Series A pre-meaningful-revenue in carbon management (December 2021). Both pure-play compliance SaaS without edge deployment or regulatory knowledge graphs.

Lifetime has EUR 59,900 of Q1/2026 pilot contract value, a services-and-transport line that covers the burn at a EUR 0 founder salary, a 7-year head start on a regulatory intelligence engine spanning 25 EU-regulated industries, and edge deployment economics that a cloud-only competitor cannot match.

EUR 3.8M cap is below early-stage carbon SaaS benchmarks. Persefoni raised at a higher implied valuation pre-revenue. What Lifetime adds is edge deployment, a 7-year knowledge graph, and a company that does not need the round to survive the next quarter.

### 9. "What is the roadmap beyond this round?"

**This round (EUR 650K SAFE):** Ship DWS 7 with persistent carbon balance sheet (July 2026). Grow to EUR 900K ARR.

**Next phase:** Helsinki healthcare logistics pilot using the same compliance platform, sold to a transport operator as software. Edge deployment on NVIDIA hardware already in-house (Acer GN-100).

**Series A (2027):** Expand from compliance infrastructure to autonomous industrial operations. The carbon ledger becomes the data backbone for physical AI — fleet management, site logistics, predictive maintenance.

**Sequence:** Compliance revenue funds fleet pilots. Fleet pilots fund Series A. Each phase de-risks the next.

---

## Software Account Card

Names stay redacted until each customer signs the public-name authorization form. Source: `docs/investor/data-room-2026Q2/PROOF_POINTS_2026Q2.md` §3.

| Account | Sector | Bundle landed | Year-1 ACV |
|---------|--------|---------------|-----------|
| LAND-001 | Nordic Tier-1 constructor | DWS IQ 6 Enterprise Pilot (Q1/26) | EUR 29,950 |
| LAND-002 | Central-Europe Tier-1 constructor | DWS IQ 6 Enterprise Pilot (Q1/26) | EUR 29,950 |
| LAND-003 | Nordic engineering consultancy | Material Oracle T2 + Emissions T1 | ~EUR 34k |
| LAND-004 | DACH industrial OEM | Compliance T2 | ~EUR 30k |
| LAND-005 | Nordic facilities operator | Sovereignty Monitor T1 | ~EUR 16k |
| LAND-006 | Nordic infrastructure ops | SiteSense T1 | ~EUR 18k |

**Active discussions with documented inbound replies:** Outokumpu, Kemira.

**Reference calls:** available on request, subject to each customer's authorization. Do not name a reference before authorization is on file.

**Not customers.** Uber, Bolt, Kela and Taksi Helsinki are dispatch operators — commercial counterparties of the licensed transport operation. They must never be presented as software customers. See `docs/TRACTION_CANONICAL.md`.

---

## Comparable Companies

| Company | Round | Amount | Revenue | Year | Category |
|---------|-------|--------|---------|------|----------|
| Persefoni | Seed | $3.5M | Pre-revenue | 2020 | Carbon accounting |
| Persefoni | Series A | $9.7M | $1.8M ARR | 2021 | Carbon accounting |
| Persefoni | Series B | $101M | ~$3M ARR | 2021 | Carbon accounting |
| Sweep | Seed | $5M | Pre-revenue | 2021 | Carbon management |
| Sweep | Series A | $22M | Early revenue | 2021 | Carbon management |
| Sweep | Series B | $73M | Early revenue | 2022 | Carbon management |
| Workiva | IPO | NYSE:WK | ~$100M ARR | 2014 | SEC compliance |
| Workiva | Today | $3B mkt cap | $739M revenue | 2026 | Compliance platform |
| **Lifetime** | **SAFE** | **EUR 650K** | **EUR 59.9K Q1/26 pilot contract value (software); services & transport revenue covers burn** | **2026** | **Carbon balance sheet** |

---

## Sources

- LeWorldModel paper: https://arxiv.org/abs/2603.19312
- Persefoni Series A: https://techcrunch.com/2021/04/15/persefonis-carbon-accounting-platform-raises-9-7-million/
- Persefoni Series B: https://techcrunch.com/2021/10/28/climate-accounting-platform-persefoni-raises-101m-series-b-led-by-prelude-and-tpg/
- Sweep Series A: https://techcrunch.com/2021/12/16/sweep-raises-a-22m-to-aim-at-large-corporates-scrambling-to-deal-with-carbon/
- Sweep Series B: https://techcrunch.com/2022/04/04/sweep-series-b-investment/
