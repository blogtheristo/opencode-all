# FCD Pitch Validation Framework — Anna Gueorguieva Session

## What "Validate FCD Pitch" Actually Means

Anna isn't validating the math. She's validating whether the **pitch lands** with institutional investors. She's sat on investment committees at €48B portfolio scale — she knows exactly what questions get asked and what kills a proposal.

## The 8 Validation Parameters

### 1. Financial Materiality (Does It Move Money?)

**What Anna evaluates:** Does FCD produce a number that changes an investment decision?

| Test | Pass | Fail |
|------|------|------|
| Can FCD produce a € figure per asset? | "Building X has €2.3M forward carbon debt maturing by 2030" | "Building X has high climate risk" |
| Does it affect NAV/valuation? | "FCD reduces estimated fair value by 8%" | "FCD provides a risk score of 7/10" |
| Is it portfolio-aggregable? | "Portfolio-wide FCD exposure: €147M across 340 assets" | "Each asset gets its own report" |

**Key question Anna will ask:** *"If I put this number in front of an investment committee, does it change the allocation decision — yes or no?"*

### 2. Regulatory Credibility (Which Framework Alignment?)

**What Anna evaluates:** Does FCD fit into the frameworks her clients already use?

| Framework | FCD Must Show |
|-----------|---------------|
| TCFD/ISSB (IFRS S2) | Maps to Strategy pillar — climate-related risks over short/medium/long term |
| EU Taxonomy | Asset classification impact on FCD score (aligned vs. not aligned) |
| CSRD (ESRS E1) | Direct input to climate-related financial disclosures |
| EPBD | Building energy performance trajectory feeds FCD calculation |

**Key question:** *"Can my clients include FCD outputs in their CSRD disclosure without additional translation?"*

### 3. Data Defensibility (Can It Withstand Audit?)

**What Anna evaluates:** Will the numbers survive when a Big 4 auditor asks "where did this come from?"

| Criterion | Requirement |
|-----------|-------------|
| Source traceability | Every FCD value traces to specific regulation + carbon price + CAPEX estimate |
| Assumption transparency | All assumptions explicitly stated (carbon price curve, discount rate, regulatory timeline) |
| Sensitivity analysis | FCD value under 1.5°C, 2°C, 3°C+ scenarios |
| Update frequency | Real-time regulatory updates vs. static annual reports |

**Key question:** *"If my auditor asks me to justify this number, can I show them the entire calculation chain in 5 minutes?"*

### 4. Competitive Differentiation (Why Not MSCI/Bloomberg?)

**What Anna evaluates:** Why would her 50+ asset manager clients switch from what they already use?

| Competitor | Their Limitation | FCD Advantage |
|------------|-----------------|---------------|
| MSCI Climate VaR | Backward-looking scores, annual updates | Forward-looking €, real-time regulatory tracking |
| Bloomberg ESG | Generic, not EU-regulation-specific | EU regulatory knowledge graph (10,000+ rules) |
| Sustainalytics | Risk ratings (1-100), not financial | Financial liability in € per asset |
| Manual consultants | 6-month reports, €50K+ per project | Automated, continuous, fraction of cost |
| ISS STOXX | Recently launched real assets platform | FCD is predictive, not descriptive |

**Key question:** *"My clients already pay for MSCI and Bloomberg. What does this give them that they can't get from adding a climate module to what they already have?"*

### 5. Integration Feasibility (Can It Plug In?)

**What Anna evaluates:** Can this work with the systems her clients already use?

| Integration Point | Required |
|-------------------|----------|
| API access | RESTful API for portfolio management systems |
| Data format | JSON/CSV export compatible with FactSet, Bloomberg Terminal |
| SSO/Auth | Enterprise SSO (SAML/OIDC) for institutional clients |
| Bulk processing | Handle 500+ assets per portfolio in batch |
| GreeniumDC input | Accept GreeniumDC's aggregated climate data as input |

**Key question:** *"Can my team feed GreeniumDC data in and get FCD values out without manual steps?"*

### 6. Pricing Credibility (Is the Unit Economics Right?)

**What Anna evaluates:** Does the price make sense for institutional buyers?

| Aspect | What She Checks |
|--------|----------------|
| Price vs. value | €10,000 for FCD concept — what's the proven ROI? |
| Enterprise pricing model | Per-asset, per-portfolio, or platform license? |
| Pilot path | Is there a €5K-€20K pilot that proves value before full commitment? |
| Competitor pricing | MSCI Climate: ~$50K-$200K/year. Bloomberg: $24K+/year. Where does FCD sit? |

**Key question:** *"What's the smallest possible engagement that proves this works for one of my clients?"*

### 7. Scientific Rigor (Is the Methodology Sound?)

**What Anna evaluates:** Would this survive peer review or academic scrutiny?

| Component | Validation Method |
|-----------|-------------------|
| Carbon price curve | Aligned with ETS futures + NGFS scenarios? |
| Causal reasoning | Does the cause-effect chain hold under stress test? |
| Temporal decay | How does risk change over 5/10/20 year horizons? |
| Cross-validation | Source data cross-checked against satellite/sensor data? |
| Backtesting | Can you show FCD predictions vs. actual regulatory outcomes? |

**Key question:** *"Show me one asset where FCD predicted a regulatory cost that actually materialized."*

### 8. Team Credibility (Can You Deliver?)

**What Anna evaluates:** Is the team capable of building and maintaining this at scale?

| Factor | What She Looks For |
|--------|-------------------|
| Domain expertise | Climate science + regulatory + financial modeling on the team |
| IP protection | Patents filed? Trade secrets managed? (Tier 1-3 classification) |
| Track record | Existing customers, pilot results, revenue |
| Scalability | Can this serve 50+ asset managers without breaking? |

---

## Example: How to Run the Validation Session

### Pre-Session (Risto Prepares)

1. **One-pager**: FCD concept explained in institutional investor language (not tech language)
2. **Worked example**: Pick one real building/asset, show complete FCD calculation:
   - Input data (energy consumption, building type, location, current EPC rating)
   - Regulatory parameters (ETS price at €80/tCO₂, EPBD 2028 deadline, Rakentamislaki changes)
   - FCD output: €X forward carbon debt, maturing by 20XX
   - Sensitivity: FCD under 1.5°C vs 2°C vs 3°C scenarios
3. **Integration sketch**: How GreeniumDC data → DWS IQ 6 → FCD value (one diagram)

### Session Structure (30 min)

| Time | Topic | Goal |
|------|-------|------|
| 0-5 min | Context | Explain FCD in one sentence. Show the worked example. |
| 5-15 min | Anna's reaction | Let her poke holes. Listen. Don't defend — learn. |
| 15-20 min | Integration discussion | "If GreeniumDC feeds us data, what would your clients want back?" |
| 20-25 min | Pricing/packaging | "What format would your clients buy this in?" |
| 25-30 min | Next steps | Pilot with one of her asset manager clients? Joint paper? |

### Key Phrases to Use

- "We're not trying to replace MSCI — we add the predictive layer they don't have"
- "Your data is our input. Our FCD value makes your data more valuable to your clients"
- "What questions does your investment committee ask about forward-looking climate risk that nobody can answer today?"

### Key Phrases to AVOID

- "Our AI agent orchestration..." (she doesn't care about architecture)
- "Our knowledge graph has 10,000 nodes..." (too technical)
- "We're patent-pending..." (save for later — she's evaluating market fit, not IP)

### Post-Session Checklist

After the call with Anna, answer these:

| Question | Answer |
|----------|--------|
| Does FCD produce a number institutional investors would use? | Yes/No + why |
| Which regulatory framework alignment is most important? | TCFD / CSRD / EU Taxonomy / EPBD |
| What's the competitive gap FCD fills? | Specific gap Anna identified |
| What pricing model makes sense? | Per-asset / per-portfolio / platform license |
| Is there a pilot opportunity? | Which client, what scope, what timeline |
| What needs to change in the pitch? | Specific feedback from Anna |

---

**Created**: 2026-02-20
**Purpose**: Structured validation framework for Anna Gueorguieva session
**Classification**: Tier 1 (shareable)
