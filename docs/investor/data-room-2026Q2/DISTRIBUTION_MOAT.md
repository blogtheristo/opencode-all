# Data Room 2026 Q2 — Distribution Moat (MACC + AppExchange)

***

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Opus 4.7) | Session: claude/investor-labor-pricing-thesis-rWS2b | Date: 14.05.2026 | Changes: Initial creation — distribution math for Microsoft Azure MACC-burn and Salesforce AppExchange co-sell. Take-rate analysis, gross-up math, co-sell projection, channel-conflict avoidance. Sourced from docs/marketing/SKILLED-AGENTS-PRICE-LIST-2026.md §§5–7. Spine: labor-anchored pricing · regulation drives demand · MACC + AppExchange drive distribution.

Session Links & References:

- Claude Code (claude/investor-labor-pricing-thesis-rWS2b): https://github.com/blogtheristo/dws6/commits/claude/investor-labor-pricing-thesis-rWS2b
- Source: docs/marketing/SKILLED-AGENTS-PRICE-LIST-2026.md
- View on GitHub: https://github.com/blogtheristo/dws6/blob/claude/investor-labor-pricing-thesis-rWS2b/docs/investor/data-room-2026Q2/DISTRIBUTION_MOAT.md

Document Status:

- Created: 14.05.2026
- Last Modified: 14.05.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE — investor data room, under NDA

***

## 1. Two Channels, One Anchor

We list **DWS 365 Skilled Agents** on Azure Marketplace (Microsoft Agent 365 plane) and Salesforce AppExchange (Agentforce plane). Both channels keep the price anchored to **labor** — never per-seat, never per-conversation as the customer-facing sticker. Channel conflict is avoided by listing marketplace SKUs at a small gross-up above direct, so marketplace never undercuts direct.

---

## 2. Microsoft Azure Marketplace — MACC-Burn Math

### The wedge

Every Tier-1 named account in the Q1/26 manifesto pipeline sits on an active **Microsoft Azure Consumption Commitment (MACC)** — a multi-year cloud commitment ranging from low single-digit €M to €100M+ depending on enterprise size. Significant portions of MACC sit **committed-but-unspent** by Q3 of the commitment year. Marketplace-eligible third-party SKUs **burn down MACC** when transacted on Azure invoice.

For our customer, our sticker pays out of committed cloud spend they have already signed for and would otherwise leak as use-it-or-lose-it. For us, MACC-burn collapses the customer's biggest procurement objection: "this isn't in budget."

### Take-rate and gross-up

| Scenario                              | Marketplace take | Net to DWS @ list | Net to DWS @ gross-up (+3%) |
|---------------------------------------|-----------------:|------------------:|----------------------------:|
| Marketplace transactable              |        3%        |        97%        |   ~100% (the +3% offsets)   |
| IP co-sell with multiplier credit     |        0%        |       100%        | 100%                        |
| Strategic ISV + co-sell (negotiable)  |     0 – 3%       |   97 – 100%       | ~100%                       |

We design for the 3% case. The +3% gross-up on the marketplace listing covers the take. The customer doesn't feel it because MACC-burn is the larger move.

### Microsoft co-sell credit

Microsoft pays its enterprise field credit on MACC-burn marketplace transactions toward seller quota (≥1× multiplier on eligible SKUs). That turns the **Microsoft enterprise field into a distribution arm for DWS 365 Skilled Agents.** Their AE is incentivized to bring us into Tier-1 conversations to clear their own MACC overhang — which is exactly the conversation we want.

### MACC-burn pipeline projection

| Pipeline cohort               | Accounts | Avg MACC commitment | Committed-but-unspent (typical share) | DWS addressable from MACC pool (yr 1) |
|-------------------------------|---------:|---------------------:|----------------------------------------|--------------------------------------:|
| Manifesto ULTRA (top 5)       |    5     |    €40M – €100M      | 20 – 40%                               | €2M – €8M / yr (we capture small slice) |
| Manifesto HIGH (next 10)      |   10     |    €5M – €40M        | 20 – 40%                               | €1M – €4M / yr addressable             |
| Manifesto MEDIUM/LOW (next 15)|   15     |    €1M – €10M        | 20 – 40%                               | Variable; secondary motion             |

For investor framing: **we are addressing the seam between Microsoft's enterprise commitment problem and the EU regulator's labor demand.** That seam is wide and structural.

---

## 3. Salesforce AppExchange — Agentforce "Digital Labor" Math

### The wedge

Salesforce markets its own agentic stack as **"digital labor"** — vocabulary that is **on-narrative for us**. Buyers landing on Agentforce already accept that agents are priced as labor units; they do not need to be educated.

### Take-rate and gross-up

| Scenario                          | AppExchange take | Net to DWS @ list | Net to DWS @ gross-up (+18%) |
|-----------------------------------|-----------------:|------------------:|------------------------------:|
| Managed package / agent SKU       |       15%        |        85%        |   ~100% (the +18% offsets, ~3pp buffer for ops) |
| Strategic ISV with co-sell        |       10%        |        90%        |   ~106% (buffer becomes margin) |

We list at +18% gross-up on AppExchange. Standard take consumes most of the buffer. Negotiated co-sell take (10%) leaves a small upside.

### Per-conversation trap (and how we avoid it)

Salesforce's Agentforce has a **per-conversation / per-action platform meter** sitting underneath any agent SKU listed in AppExchange. If a third-party ISV lists with their own metered pricing on top, the customer's all-in cost is meter-on-meter — procurement pushes back, deals stall.

We list flat **per-agent-month** on AppExchange — never per-conversation as the customer-facing sticker. The Salesforce platform meter is the customer's infra cost (invisible to our pricing), our per-agent-month sticker is the labor unit. Clean.

### Co-sell projection

| Lever                                                         | Target by Q4 2026                 |
|---------------------------------------------------------------|-----------------------------------|
| AppExchange listing live (managed package, ~5 Skilled Agents) | Q2 2026 — CSAT, Lead Feedback, Competitor Surveil., SEO Audit, Themis |
| Co-sell agreement signed (10% take negotiated)                | Q4 2026                          |
| Co-marketed launches with Salesforce                          | 2 launches in 2026                |
| Year-1 AppExchange ACV (low-touch SMB + co-sell mid-market)   | €120k – €260k                     |

---

## 4. Channel Comparison At-A-Glance

| Dimension                   | Direct (DWS)                   | Microsoft Agent 365 / Azure Marketplace             | Salesforce Agentforce / AppExchange       |
|-----------------------------|--------------------------------|------------------------------------------------------|-------------------------------------------|
| Take rate                   | 0%                             | 3% (marketplace) / 0% (co-sell IP)                   | 15% (10% strategic ISV)                   |
| Customer pays via           | DWS invoice                    | Azure invoice (MACC-burn eligible)                   | Salesforce invoice                        |
| Best listing shape          | Per-outcome + per-agent-month  | Per-outcome metered + per-agent-month                | Per-agent-month flat                      |
| Underlying platform meter   | None                           | Azure consumption (invisible to buyer)               | Agentforce per-conversation / action      |
| Best agents to lead with    | All                            | Material Oracle, SiteSense, Compliance, Sovereignty  | CSAT, Lead Feedback, Competitor Surveil., SEO Audit, Themis |
| Buyer mental model          | Hire a function                | Burn down committed cloud spend                      | Hire digital labor                        |
| Net to DWS (per-agent-month)| 100%                           | ~100% after MACC tailwind + 3% gross-up              | ~100% after 18% gross-up @ 15% take       |
| Distribution leverage       | Low                            | Very high (M365 field + MACC)                        | High (CRM ISV ecosystem)                  |
| Sales-cycle compression     | n/a                            | ~30 – 50%                                            | ~20 – 40%                                 |

---

## 5. Why This Is a Moat, Not a Channel Mix

- The MACC-burn motion **only works for sellers who list correctly on Azure Marketplace** and **only converts at scale when Microsoft co-sell credit is active**. Both gates take 6–12 months to clear; we have cleared the first and are mid-second.
- "Digital labor" vocabulary on AppExchange is a **buyer-education shortcut we did not have to build**. Salesforce educates the buyer; we collect the labor-priced revenue.
- We are listing the **same SKUs** at marketplace-uplifted prices on both. The price ceiling stays anchored to human labor cost on direct; channels never undercut direct. Channel conflict is structurally avoided.
- The Tier-1 EU industrial / construction buyer base **already uses both Microsoft and Salesforce as enterprise infrastructure**. We meet them where they buy.

---

## 6. Risks & Mitigations

| Risk                                                         | Mitigation                                                                                              |
|--------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|
| Microsoft raises marketplace take from 3% → 5–10%            | Our gross-up absorbs up to ~7% before margin compresses below 80%. Re-price gross-up on policy change.   |
| Salesforce drops the 15% take across the board               | Upside — buffer becomes pure margin.                                                                     |
| Hyperscaler ships a competing first-party agent in our domain | Their first-party stays horizontal; our moat is the signed regulatory artifact. Re-emphasize moat in INTRO copy. |
| MACC overhang shrinks (enterprises rightsizing commitments)   | Slows the wedge but does not eliminate it; pivot to direct EU residency / sovereignty motion for those accounts. |

---

## 7. Companion Documents

- `docs/marketing/SKILLED-AGENTS-PRICE-LIST-2026.md` §§5–7
- `docs/investor/data-room-2026Q2/PRICING_MODEL.md`
- `docs/investor/data-room-2026Q2/REGULATORY_TAILWIND.md`
- `docs/investor/data-room-2026Q2/PROOF_POINTS_2026Q2.md`
