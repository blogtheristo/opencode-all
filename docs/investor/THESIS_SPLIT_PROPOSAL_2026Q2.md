# Thesis Split Proposal — Labor-Pricing Category Shift (2026 Q2)

***

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Opus 4.7) | Session: claude/investor-labor-pricing-thesis-rWS2b | Date: 14.05.2026 | Changes: Initial creation — proposal for how the labor-pricing thesis splits between the Metropolia master's thesis (implementation evidence) and the LUT PhD thesis (market signals + scientific framing), per CLAUDE.md Thesis Content Scope Rule. **NO commits to thesis files in this PR** — proposal awaits explicit Risto signoff before applying the +0.01 version bump across all four files (V3Thesis_EN, V3Thesis_FI, PHD_FIREHORSE_EN, PHD_FIREHORSE_FI) and regenerating Learn/ versioned HTML outputs.

Session Links & References:

- Claude Code (claude/investor-labor-pricing-thesis-rWS2b): https://github.com/blogtheristo/dws6/commits/claude/investor-labor-pricing-thesis-rWS2b
- CLAUDE.md Thesis Content Scope Rule
- Companion: docs/investor/INVESTOR_ONE_PAGER_2026Q2.md
- View on GitHub: https://github.com/blogtheristo/dws6/blob/claude/investor-labor-pricing-thesis-rWS2b/docs/investor/THESIS_SPLIT_PROPOSAL_2026Q2.md

Document Status:

- Created: 14.05.2026
- Last Modified: 14.05.2026
- Language: English
- Languages Available: English
- Publication Status: PROPOSAL — pending Risto signoff. Do not apply to thesis files until approved.

***

## 0. Why This Is a Proposal, Not a Commit

The task spec for this sprint explicitly blocks commits to thesis files until Risto signs off:

> "NO commits to thesis files Greenlit until Risto signs off." — sprint brief

This proposal captures exactly what would be added to each of the four thesis files. After Risto's signoff, a follow-up PR applies the +0.01 version bump and the Learn/ HTML regeneration in lockstep across all four files per the CLAUDE.md Thesis Rule.

---

## 1. Split Per the CLAUDE.md Thesis Content Scope Rule

> **Master's thesis (V3Thesis_EN / V3Thesis_FI — Metropolia):** product- and implementation-focused, tightly coupled to current and next DWS IQ product version. Documents engineering decisions, architecture, PRs, operational results. **Does not contain market intelligence, competitive signals, or long-horizon roadmap speculation.**
>
> **PhD thesis (PHD_FIREHORSE_EN / PHD_FIREHORSE_FI — LUT):** scientific perspective with a longer roadmap view (3–7 years). Updated with **market signal data**: competitor movements, regulatory pipeline, standardization body activity, partnership signals. Contains research questions, theoretical framing, and societal impact — **not sprint-level implementation detail.**

Applied to the labor-pricing thesis:

- **Implementation evidence → master's thesis.** The catalog (T0–T4 ladder), the SKU list, the MACC integration, the engineering decisions behind Themis case coordination and KYA runtime trust, the deployment pricing standard governance.
- **Market signal and scientific framing → PhD thesis.** The tool→labor category shift, @dhaber attribution, the EU regulatory pipeline as a demand engine, the comparison to vertical AI labor companies (Cognition, Sierra, Harvey, Decagon), the long-horizon thesis on how AI labor reshapes EU industrial work.

---

## 2. Proposed Insert — Master's Thesis (V3Thesis_EN, V3Thesis_FI)

Add a new section under "Implementation Evidence" (or equivalent) — implementation-only, no market intelligence.

### Proposed section title (EN)

> **"Product Catalog & Pricing Implementation — DWS 365 Skilled Agents (DWS IQ 6 release train)"**

### Proposed section content (EN, ~700–900 words after expansion)

The section documents:

1. **The T0–T4 upsell tier ladder** as implemented in the product catalog and the dws10.com/config/products.json source-of-truth file. Reference the SKU codes (e.g., CMP-T0, CMP-T1, CMP-T2, MO-T1…T2, SS-T1…T2) and the pricing bands per tier.
2. **The 16 Skilled Agents in production** (SiteSense, Material Oracle, Compliance, Schedule Genius, Emissions Data, Logistics, Construction, Customer Sat, Viability, Deepwiki Extractor, Quality Gate, Sovereignty Monitor, Competitor Surveillance, SEO Audit, Lead Feedback, Themis-as-Coordinator) — with the role each replaces and the per-agent-month list price.
3. **MACC integration** — implementation of Azure Marketplace listing pipeline, the +3% gross-up logic, the MACC-burn eligibility flag, and the Microsoft co-sell credit recording mechanics.
4. **AppExchange managed-package pipeline** — implementation of Salesforce AppExchange listing (5 SKUs in the initial wave: CSAT, Lead Feedback, Competitor Surveillance, SEO Audit, Themis), the +18% gross-up, the per-agent-month flat-SKU pattern to avoid per-conversation meter stacking.
5. **Consulting-plus-keep-the-agent bundles** — implementation of the land-motion engagement SKUs (AI Literacy Bridge, EU AI Act Compliance Sprint, CSRD Reporting Accelerator, Site Safety Bootcamp, Sovereignty & NIS2 Sprint, Construction Ops Pilot, Carbon Reporting Sprint, Go-to-Market Sprint, Themis Coordinator Workshop, Full Workforce Onboarding) and the attach mechanics that flip a Y1 engagement into a Y2+ recurring agent subscription.
6. **Dynamic Deployment Pricing Standard (Blue/Green) governance hook** — how each SKU's Blue→Green ratification flows through priceVersion bumps in `dws10.com/config/products.json` and its `landing-pages/dws10-com/config/products.json` mirror.

**Excluded from the master's thesis section** (these go to the PhD instead): the category-shift narrative, @dhaber attribution, vertical AI labor comp set, regulatory tailwind as a demand engine, valuation framing. Those are market signals, not implementation evidence.

### Proposed section title (FI)

> **"Tuoteluettelo ja hinnoittelun toteutus — DWS 365 Skilled Agents (DWS IQ 6 -julkaisulinja)"**

### Proposed section content (FI)

Käännös yllä olevasta englanninkielisestä sisällöstä. Sama rakenne, sama rajaus implementaatioon — markkinasignaalit eivät kuulu master-versioon.

---

## 3. Proposed Insert — PhD Thesis (PHD_FIREHORSE_EN, PHD_FIREHORSE_FI)

Add a new market-signal section under the existing competitive-intelligence / regulatory-pipeline thread.

### Proposed section title (EN)

> **"Market Signal: The Tool-to-Labor Category Shift in Enterprise AI (3–7 year horizon)"**

### Proposed section content (EN, ~1,000–1,400 words after expansion)

The section documents:

1. **The category shift.** When software stops helping humans do the work and starts doing the work itself, that is a business-model shift from tool to labor. Frame credit to **@dhaber** on what happens when software stops helping humans do the work and starts doing the work itself. The shift moves the price ceiling from "other software" to "loaded cost of a billable hour" — SaaS multiples ceiling out where labor multiples start.
2. **EU regulatory pipeline as the demand engine.** CSRD (waves 1–3 through 2028), CBAM (definitive period from Jan 2026, financial liability from May 2027), EU AI Act (high-risk obligations Aug 2026, full applicability Aug 2027), NIS2 (operational Q4 2025), Fit-for-55 / ETS2 (2027+) — each creates labor demand for a signed artifact that a pure tool cannot produce.
3. **Vertical AI labor company comp set** (3–7 year horizon). Cognition, Sierra, Decagon, Harvey, Adept-era successors — pricing models, traction signals, fundraise multiples. The PhD-level framing is that vertical AI labor companies are converging on a similar pricing model (per-outcome / per-agent-month anchored to human cost) across domains, and that EU industrial regulation is one of the highest-value verticals because the regulator mandates the work.
4. **Standardization body and partnership signals.** EFRAG (ESRS sector standards), CEN-CENELEC (EU AI Act harmonised standards), CINEA (Innovation Fund), Notified Body designations for AI Act conformity assessment. These are the "where does an EU AI labor company need to be present" map.
5. **Long-horizon (3–7 year) research questions.** How does the regulatory labor demand stabilize as automation matures? What is the relationship between sovereign labor pools and trans-national AI labor providers? What are the societal impacts of EU industrial roles being met by AI labor at 20–30% of human cost — labor-market effects, training pipeline shifts, GDPR / AI Act protections for affected workers?
6. **Theoretical framing.** Position the labor-priced AI labor company as a new firm type — neither a SaaS firm (no per-seat scaling) nor a consultancy (no human-headcount scaling). Citing both the pricing-power literature (anchor-based pricing, value-based pricing) and the AI-as-economic-actor literature.

### Proposed section title (FI)

> **"Markkinasignaali: Yritystekoälyn siirtymä työkalusta työvoimaksi (3–7 vuoden aikajänne)"**

### Proposed section content (FI)

Käännös yllä olevasta. Sama rakenne, sama painotus: kategoriasiirtymä, EU-sääntelyn pipeline kysynnän moottorina, vertical AI labor -vertaisryhmä, standardointielimet, tutkimuskysymykset, teoreettinen kehystys.

---

## 4. Lockstep Versioning Rule

When applied:

- All four files (V3Thesis_EN, V3Thesis_FI, PHD_FIREHORSE_EN, PHD_FIREHORSE_FI) move from current version → **+0.01**.
- VERSION AND AGENT HISTORY entries added to all four, citing the labor-pricing source branch (`claude/ai-pricing-labor-model-GeqbE`) and this proposal branch (`claude/investor-labor-pricing-thesis-rWS2b`).
- `Learn/` versioned HTML outputs regenerated; older HTML versions preserved (never deleted), per CLAUDE.md Thesis Rule.
- All four commits land in a **single PR** per Thesis Rule.

---

## 5. Why The Split Matters

Mixing the implementation catalog and the market-signal framing into either file dilutes both:

- Master's thesis with market intelligence would fail the Metropolia content-scope expectation and reduce the credibility of the implementation evidence.
- PhD thesis with sprint-level SKU lists would clutter the long-horizon scientific framing LUT expects.

Keeping them separated **also** makes both theses more useful to investors and customers — the master's becomes a defensible product story, the PhD becomes a defensible market story.

---

## 6. Greenlight Checklist (For Risto)

- [ ] Approve the master's-thesis section title and scope.
- [ ] Approve the PhD-thesis section title and scope.
- [ ] Approve the +0.01 lockstep version bump across all four files.
- [ ] Approve the follow-up PR to land the actual thesis content (separate from this investor outreach PR).

Once all four boxes are ticked, a follow-up PR titled `docs: thesis split — labor-pricing category shift v+0.01` carries out the changes against all four thesis files in a single commit, plus the Learn/ HTML regeneration.

---

## 7. Companion Documents

- `docs/marketing/AI-AS-LABOR-PRICING-STRATEGY.md` — source of the @dhaber-credited frame.
- `docs/marketing/SKILLED-AGENTS-PRICE-LIST-2026.md` — source of the SKU list for the master's-thesis insert.
- `docs/investor/data-room-2026Q2/REGULATORY_TAILWIND.md` — source of the regulatory pipeline data for the PhD-thesis insert.
- `CLAUDE.md` — Thesis Rule + Thesis Content Scope Rule.
