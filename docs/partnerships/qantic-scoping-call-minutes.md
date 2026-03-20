---
VERSION AND AGENT HISTORY
Document: Qantic x Lifetime Oy — Scoping Call Meeting Minutes
Version: 1.0
Created: 2026-03-19
Author: Claude Opus 4.6 (DWS IQ 6 Agent)
Reviewed by: Risto Päärni (Founder & CEO, Lifetime Oy)
Status: TEMPLATE
---

# Meeting Minutes — Qantic x Lifetime Oy Scoping Call

**Date:** [YYYY-MM-DD]
**Time:** [HH:MM] CET, 20 min
**Participants:**
- Risto Päärni, Founder & CEO, Lifetime Oy (Espoo)
- Thomas Kalitzky, Managing Director, Qantic GmbH (Berlin)

## 1. Background

Qantic develops Q-System for BESS revenue modelling (dispatch optimization, degradation, multi-market stacking). Lifetime Oy develops DWS IQ 6 compliance engine (CSRD, ETS, EU Taxonomy, CBAM). Neither delivers full bankability picture alone.

Initial contact: Thomas suggested data centers as additional vertical. Risto built BESS compliance API with PUE + facility Scope 2 support.

## 2. Demo Shown

BESS compliance cost output for 50MW/200MWh installation in Germany:
- Scope 2 carbon cost: €5,005/year
- Roundtrip efficiency loss: €488/year
- CSRD reporting: €12,000/year
- EU Taxonomy certification: €4,200/year
- Total: €21,693/year
- PUE threshold check for data centers: binary PASS/BLOCK

Status: code written, 19 unit tests passing, pushed to repository.

## 3. Key Question: JSON Export Format

Question asked: "What does your Q-System JSON export look like for a dispatch schedule?"

Thomas's answer: [ ]

Fields needed by DWS IQ 6:
- timestamp (ISO 8601)
- chargedMwh (number)
- dischargedMwh (number)
- market (fcr/afrr/mfrr/day-ahead/intraday/idle)
- gridEmissionFactor (gCO2/kWh)

Q-System API readiness: [ ] JSON ready / [ ] CSV only / [ ] Not yet

## 4. Data Centers

Thomas's position on data centers as second vertical: [ ]

Key points discussed:
- [ ]
- [ ]

## 5. Commercial Model

Option discussed: [ ] A (Referral 15%) / [ ] B (API per asset) / [ ] C (Co-sell)

Pricing: €500–2,000/asset/year (API usage-based)

Thomas's preference: [ ]

## 6. Agreed Next Steps

| Action | Owner | Deadline |
|--------|-------|----------|
| [ ] | Thomas | [ ] |
| [ ] | Risto | [ ] |
| [ ] | Both | [ ] |

NDA: [ ] Agreed to sign / [ ] Needs review / [ ] Not discussed
LOI: [ ] Agreed to sign / [ ] Needs review / [ ] Not discussed

## 7. Open Questions

- [ ]
- [ ]

## 8. Next Meeting

**Date:** [ ]
**Purpose:** [ ]

---

Minutes taken by: Risto Päärni
Distribution: Thomas Kalitzky, Risto Päärni
