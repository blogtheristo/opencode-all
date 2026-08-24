---
VERSION AND AGENT HISTORY
Document: BESS Compliance API — Product Summary
Version: 1.0
Created: 2026-03-19
Author: Claude Opus 4.6 (DWS IQ 6 Agent)
Reviewed by: Risto Päärni (Founder & CEO, Lifetime Oy)
Status: FINAL
---

# BESS Compliance API — Product Summary

## What It Produces

One number: €/year/asset — compliance cost as a line item next to Q-System revenue projections.

### Example: 50MW / 200MWh BESS in Germany

| Cost Component | EUR/year | Who Needs It |
|----------------|----------|-------------|
| Scope 2 carbon cost | €5,005 | CFO — investment model |
| Roundtrip loss cost | €488 | CFO — operational cost |
| CSRD reporting cost | €12,000 | Sustainability lead — budget |
| Taxonomy certification | €4,200 | Financier — green bond eligible? |
| PUE threshold | PASS/BLOCK | Data center — EU Taxonomy 8.1 binary |
| **Total compliance cost** | **€21,693** | **Investor bankability model** |

Without this: investor models revenue (Q-System) but forgets compliance costs. 5–15% of costs missing from bankability calculation.

## Who Sells

Option B: Qantic sells, DWS bills API usage.

- **Sells:** Qantic (Thomas) — Q-System includes "Compliance Cost" module
- **Produces:** DWS IQ 6 API (Lifetime Oy) — calculates compliance cost, returns JSON
- **Pays:** BESS developer / data center — API usage fee per asset modelled
- **Pricing:** €500–2,000/asset/year

## Revenue Estimate

- Qantic customer base: 50–100 BESS projects
- Data centers: additional 20–50 customers
- €500–2,000/asset × 100 customers = €50k–200k ARR first year
- Scales: 45 GW BESS pipeline in EU by 2030

Lifetime Oy does not need its own sales. Qantic is the distribution channel. DWS IQ 6 is an API product that sits inside Qantic's product.

## Technical Readiness

| Feature | Status | What Exists | What's Missing |
|---------|--------|-------------|---------------|
| BESS dispatch → compliance cost | Code, tested | Calculator + agent + 15 tests | Q-System JSON format (from Thomas) |
| PUE threshold (EU Taxonomy 8.1) | Code, tested | Binary PASS/BLOCK, PUE < 1.5 | Nothing |
| Facility Scope 2 | Code, tested | annualMwh × gridFactor → tCO2e → EUR | Nothing |
| Hourly grid factors (ENTSO-E) | Hardcoded per country | 18 EU country annual averages | Phase 2: real-time ENTSO-E API |
| Q-System JSON ingestion | Scaffold ready | Agent accepts DispatchEntry[] | Blocked: need Thomas's JSON spec |

Repository: commit da893d6, branch claude/add-bess-docs-pdf-dgbBf, 19 unit tests passing.
