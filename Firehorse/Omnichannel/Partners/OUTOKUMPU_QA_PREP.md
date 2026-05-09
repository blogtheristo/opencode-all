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

---

VERSION AND AGENT HISTORY

| Version | Date       | Agent / Author      | Change                              |
| ------- | ---------- | ------------------- | ----------------------------------- |
| 1.0     | 2026-05-07 | Claude (Sonnet 4.6) | Initial Q&A prep for Outokumpu call |

---
