# Q&A Preparation — Outokumpu Partnership Call

Anticipated questions from Heidi Peltonen (VP Sustainability) or her team.
Prepared for first call or written follow-up.

---

## Q1: What exactly does DWS IQ 6 do with our PCF certificate?

**A:** Your ISO 14067 certificate contains batch-level embedded emissions data (Scope 1–3,
kgCO2e per tonne of steel). DWS IQ 6 ingests that as a verified emission factor. When a
fabricator imports steel, they enter the tonnage and grade, and the platform automatically
calculates the embedded emissions, applies the CBAM EU ETS carbon price, and produces a
draft CBAM declaration. The output is what your customer's compliance team submits to the
EU CBAM registry — with your certificate attached as the data source.

---

## Q2: How is this different from what our customers already do manually?

**A:** Currently most downstream customers either use EU default emission values (which are
deliberately conservative and penalize them) or try to process your PDF certificate manually
in a spreadsheet. DWS IQ 6 automates the calculation, checks it against current EU ETS carbon
pricing, flags when CBAM certificates need to be purchased, and archives the evidence chain
for the mandatory annual verified report (due September 2027 for 2026 imports). The time
saving is roughly 80–90% on the declaration workflow per shipment.

---

## Q3: Do we have to change anything on our end?

**A:** No. We consume what you already produce. Your current TÜV-validated PDF certificates
are sufficient for a pilot. For a production integration, the ideal path would be a structured
data export (JSON or XML per grade/batch) rather than PDF parsing — but that is a Phase 2
decision, not a pilot requirement.

---

## Q4: What is your data residency and security posture?

**A:** DWS IQ 6 is EU-hosted exclusively (Finland/Germany). GDPR-compliant. Data never leaves
the EU. We do not use any US-cloud AI API for compliance data — all sensitive processing runs
on EU infrastructure. Full GDPR data processing agreement available. Relevant for NIS2 audit
trail requirements Outokumpu's enterprise customers face.

---

## Q5: How do you handle the annual verified report requirement?

**A:** CBAM's definitive phase requires importers to submit one verified annual report per year
(first deadline: 30 September 2027 for calendar year 2026). DWS IQ 6 aggregates all import
events across the year, maps them against the verified carbon data, and produces a CBAM-format
annual summary. Third-party verifier access can be granted directly in the platform — they see
the data, methodology, and source certificate without needing a separate audit process.

---

## Q6: Why would our customers trust a small Finnish startup over a Big 4 firm?

**A:** Fair challenge. Two answers: First, the Big 4 are doing CBAM advisory, not tooling —
they charge €50–200k for a CBAM readiness assessment, then hand clients a spreadsheet.
DWS IQ 6 is the tool the Big 4 consultants would want to hand their clients after the advisory.
Second, for a pilot with 2–3 fabricator accounts, trust is earned through results, not brand.
We propose a 60-day pilot at no cost — if the output is not verifiable and submission-ready,
there is no deal.

---

## Q7: What is the commercial model — is this a cost to Outokumpu or a co-sell?

**A:** We are not asking Outokumpu for money. The partnership model we propose:

- Outokumpu recommends DWS IQ 6 to their fabricator customers as the preferred CBAM compliance tool
- DWS IQ 6 lists Outokumpu as a verified upstream data source ("CBAM-ready supply chain partner")
- Joint co-marketing (webinar, case study, press release) positions Outokumpu as the most
  compliance-friendly choice in stainless steel

Revenue flows from fabricator subscriptions (they pay DWS). Outokumpu gets zero cost,
differentiated positioning, and a concrete commercial argument for premium-grade pricing.

---

## Q8: Which Outokumpu grades/products are in scope?

**A:** All grades for which you currently issue ISO 14067 PCF certificates are in scope.
From your public PCF page, this covers the core stainless grades. Ferrochrome and chromium
metal (the new low-CO2 initiative) could be added in Phase 2 as Outokumpu expands its
EVOLVE strategy into advanced materials.

---

## Q9: What happens if CBAM scope expands to more downstream products?

**A:** This is actually the upside scenario. CBAM is currently focused on direct steel imports.
Outokumpu's lobbying position (which we support) is to expand scope to all steel-intensive
downstream goods by 2027. Every expansion of scope creates more fabricators and manufacturers
who need the DWS IQ 6 + Outokumpu PCF integration. The partnership scales with the regulation.

---

## Q10: Can you show us a demo before we decide on a pilot?

**A:** Yes. We can run a demo using publicly available Outokumpu grade data and a synthetic
fabricator import scenario. Output: a complete CBAM annual report draft showing near-zero
liability versus the same tonnage imported from a non-EU mill. Demo available within 2 weeks
of agreement to proceed.

---

## Q11: We already have a CBAM Q&A page for our customers. How is DWS different from what we already provide?

**A:** Your Q&A page is excellent at explaining what CBAM is, what it covers, and why sourcing
from Outokumpu changes the calculation. It is an education layer — and it's working, because
your customers are reading it and asking the right questions. DWS IQ 6 is the execution layer
that comes after the Q&A. It takes a fabricator from "I understand CBAM" to "I have a filed,
verified, auditor-ready annual declaration." Concretely: your Q&A tells them that using your
ISO 14067 data instead of EU default values saves money. Our platform does the calculation,
generates the declaration, attaches your certificate as the source document, and archives
the audit trail for the 30 September 2027 deadline. Q&A and DWS are complementary — the Q&A
creates the demand, DWS closes it.

---

## Q12: What exactly are the EU punitive default values, and how bad are they for a fabricator buying Outokumpu steel?

**A:** The EU default emission factors under Commission Implementing Regulation (EU) 2023/1773
are set conservatively — they represent approximately the upper range of carbon intensity for
each sector globally. For steel, the hot-rolled default is 1.852 tCO₂e per tonne; cold-rolled
is 2.143 tCO₂e/t. These are calibrated for worst-case non-EU production, not for a mill
running on 97% recycled scrap and hydropower.

For a fabricator importing 1,000 tonnes of steel from a non-EU supplier who cannot provide
verified data, the CBAM certificate bill at today's ETS price (~€65/tCO₂e) is approximately
€120,000–€139,000 per 1,000 tonnes — before any carbon price credit from the country of origin.

If the same fabricator had bought from Outokumpu (EU-produced, no CBAM triggered) or had
documented a non-EU supplier's actual low-carbon data, that bill drops to near zero.

The punitive default is not a technicality. It is a five- to six-figure annual liability
per 1,000 tonnes that shows up in a fabricator's CFO meeting. That is the conversation DWS
enables — in numbers, not in sustainability language.

---

## Q13: What happens to the CBAM advantage if CBAM scope expands to downstream goods?

**A:** This is the upside scenario for both Outokumpu and DWS. Currently CBAM targets direct
steel imports. Outokumpu's public position is to expand scope to all steel-intensive downstream
goods — meaning automotive parts, white goods, construction components made from imported steel
would also carry a CBAM obligation tied to the embedded emissions of the steel input.

If that expansion happens (Outokumpu is actively lobbying for it), the fabricator network
already using DWS IQ 6 and sourcing from Outokumpu will be the only one able to document
a near-zero embedded emissions chain all the way to the final product. Their downstream
customers — OEMs, construction companies — gain a CBAM-clean supply chain argument.
The DWS + Outokumpu integration scales with every scope expansion Outokumpu advocates for.

---

## Q14: Our customers are large enterprises — do they not already have SAP or Tietoevry tools for this?

**A:** Outokumpu uses Microsoft Fabric + Sustainability Manager (via Tietoevry/TCS) for
internal CSRD reporting. Your fabricator customers may use SAP, Oracle, or other ERP systems.
None of those currently produce a CBAM annual declaration — they are not designed for it.
CBAM declarations require: embedded emissions calculation per CN code, ETS price lookup,
carbon price credit verification per country of origin, and formatted submission to the EU
CBAM registry. SAP's CBAM module (released late 2025) handles part of this but requires
a license tier most mid-size fabricators do not have. DWS IQ 6 is purpose-built for the
CBAM declaration workflow, integrates Outokumpu's PCF data as a verified source, and is
priced for mid-market (€2,400–9,600/year) — the exact segment that SAP underserves.

---

---

VERSION AND AGENT HISTORY

| Version | Date       | Agent / Author      | Change                                                                    |
| ------- | ---------- | ------------------- | ------------------------------------------------------------------------- |
| 1.0     | 2026-05-07 | Claude (Sonnet 4.6) | Initial Q&A prep for Outokumpu call                                       |
| 2.0     | 2026-05-10 | Claude (Sonnet 4.6) | Added Q11–Q14: Q&A page gap, punitive defaults math, scope expansion, SAP |

---
