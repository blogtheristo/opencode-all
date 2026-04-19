---
VERSION AND AGENT HISTORY
Document: Qantic x Lifetime Oy — 20 Min Scoping Call Agenda
Version: 1.0
Created: 2026-03-19
Author: Claude Opus 4.6 (DWS IQ 6 Agent)
Reviewed by: Risto Päärni (Founder & CEO, Lifetime Oy)
Status: FINAL
---

# Qantic x Lifetime Oy — 20 Min Scoping Call Agenda

## 1. INTROS (2 min)

- Risto Päärni, Lifetime Oy — DWS IQ 6 compliance engine
- Thomas Kalitzky, Qantic GmbH — Q-System BESS revenue modelling

## 2. THE GAP + DEMO (3 min)

- Q-System: "How much will this BESS earn?"
- DWS IQ 6: "What will compliance cost?"
- Without compliance cost: 5–15% of costs missing from investment case
- Show: 50MW/200MWh BESS Germany = €21,693/year compliance cost
- Breakdown: Scope 2 carbon + roundtrip loss + CSRD + Taxonomy

## 3. THE KEY QUESTION (3 min)

- "What does your JSON export look like for a dispatch schedule?"
- We need: timestamp, chargedMwh, dischargedMwh, market, gridEmissionFactor
- If yes: integration starts immediately, 4–6 weeks to production
- If no: tells us whether Q-System is API-ready
- Code is written, tested, pushed. 19 unit tests. Not a roadmap item.

## 4. DATA CENTERS AS SECOND VERTICAL (3 min)

- Thomas's insight: hyperscale data centers need BESS + RES
- Same API handles both BESS and data center compliance
- PUE + facility Scope 2 already built
- EU Taxonomy 8.1 binary threshold: PUE < 1.5 or green financing BLOCKED

## 5. COMMERCIAL MODEL (3 min)

- Option A: Referral (15% first-year) — low commitment
- Option B: Integrated API (per asset priced) — RECOMMENDED
- Option C: Co-sell at conferences — no contract needed
- Pricing: €500–2,000/asset/year

## 6. NEXT STEPS (3 min)

- Thomas sends: sample dispatch JSON or confirms format
- Risto sends: API documentation + test endpoint
- Timeline: 4–6 weeks from JSON format confirmation
- First customer: pick one Qantic client with CSRD obligation

## Muistilista Ristolle

- Jos Thomas näyttää JSON:n heti: kysy saako testidata-samplen mukaan
- Jos Thomas sanoo "ei vielä JSON exportia": ehdota CSV-to-JSON wrapperia
- Jos aika loppuu: varmista että kohta 3 (JSON-kysymys) on vastattu
