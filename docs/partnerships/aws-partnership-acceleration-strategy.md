---

VERSION AND AGENT HISTORY
Document: AWS Partnership Acceleration Strategy — Lifetime Oy
Version: 1.0
Created: 2026-06-29
Author: Claude (DWS IQ 6 Agent)
Reviewed by: Risto Päärni (Founder & CEO, Lifetime Oy)
Status: DRAFT

---

# AWS Partnership Acceleration — Lifetime Oy

**Context:** The AWS EMEA Scale Consulting Partner Development Team (host: Andrea Zhang, yazhangg@amazon.es) invited us to a partner-growth webinar covering AWS Distributors, partner-tier/funding mechanics, reselling, and AWS Marketplace. This document frames how Lifetime Oy should approach the AWS Partner Network (APN) relationship — what to pursue, what to question, and the one tension to resolve first.

> **Assumptions stated up front (Rule 1).** Our exact current APN tier and any existing distributor relationship are not captured in this repo. This strategy treats us as a **Registered / early-stage Services partner with an ISV product (DWS IQ)** and flags every program specific that must be verified against AWS's live partner terms rather than asserted. Figures attributed to AWS programs below are illustrative framing of _what to ask_, not confirmed entitlements.

## 1. Why this matters now

DWS IQ 6 sells EU regulatory-compliance intelligence (CSRD, ETS, CBAM, EU AI Act) to enterprise buyers whose procurement increasingly runs through cloud marketplaces and approved-vendor lists. Three of the webinar's four topics map to concrete revenue levers for us:

- **Marketplace listing** → removes procurement friction for enterprise buyers who already have AWS spend commitments (EDP/PPA drawdown).
- **Partner tier movement** → may unlock co-sell motion, MDF/funding, and visibility to AWS field sellers.
- **Distributor route** → can compress onboarding/enablement effort for a small EU team.

## 2. The four webinar topics, mapped to our decisions

| Webinar topic               | Our open question                                                            | What "good" looks like                                                                                       |
| --------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| **Why AWS Distributors?**   | Does a distributor accelerate EMEA onboarding/enablement vs. staying direct? | A named EMEA distributor that handles billing/enablement so our small team doesn't carry APN admin overhead. |
| **Growth / tier + funding** | What does moving tiers unlock — funding type, amount, qualifying effort?     | A concrete tier→funding map (MDF, POC/credits, migration funding) with realistic effort for a 1-product ISV. |
| **Why reselling?**          | Does a resale motion add momentum with our compliance customers?             | Resale only if it shortens enterprise procurement, not if it adds margin leakage with no GTM lift.           |
| **Why Marketplace?**        | Benefits of transacting DWS IQ via AWS Marketplace?                          | Private Offers + co-sell eligibility; buyers draw down committed AWS spend on our SaaS.                      |

## 3. The three questions to bring to the session

1. **Funding:** For an EU-based ISV at our tier, what funding is actually accessible (MDF, POC credits, migration/build funding), how much, and what is the qualifying effort? Tie the answer to a tier-movement plan.
2. **Marketplace + sovereignty:** Can we list DWS IQ on AWS Marketplace while contractually guaranteeing EU-region residency and a sovereignty posture our customers can audit? What does Marketplace add re: co-sell and Private Offers?
3. **Distributor vs. direct:** For a small EU team, does a distributor reduce net effort, or add a layer? Which EMEA distributors fit a compliance-ISV profile?

## 4. The tension to resolve first — sovereignty vs. hyperscaler dependency

**Surface it, don't average it (Rule 7).** Lifetime Oy / DWS IQ markets EU **data sovereignty** and flags **US CLOUD Act exposure** (see `DWS_SECURITY_STANDARD.md` and the `sovereignty-assess` / `sovereignty-pillars-assess` skills). Deepening a US-hyperscaler commercial dependency (reselling AWS, listing on Marketplace, taking AWS funding) sits in visible tension with that positioning.

This is **resolvable, not disqualifying**:

- AWS operates **EU-region** infrastructure and an **AWS European Sovereign Cloud** offering — verify whether these satisfy our customers' residency and operational-autonomy requirements.
- A **Marketplace listing** describes a _procurement channel_, not necessarily where data resides; our product can remain EU-resident while being transactable via Marketplace. Confirm this distinction explicitly.
- Decide deliberately whether to position AWS as: (a) a procurement/GTM channel only, or (b) an underlying infrastructure dependency. These carry very different sovereignty messaging.

**Action:** Treat the webinar as fact-gathering. Make the sovereignty-posture decision separately, with `DWS_SECURITY_STANDARD.md` as the governing standard, before committing to any reselling or infrastructure-level motion.

## 5. Recommended motion (sequenced, low-regret first)

1. **Attend the webinar** (Option 1, 9 Jul; Option 2, 14 Jul fallback) and fill the survey so the agenda serves our priorities.
2. **Confirm current APN status/tier** and any existing distributor link.
3. **Prioritise Marketplace listing** as the lowest-sovereignty-risk, highest-procurement-value step — it is a channel decision, largely decoupled from where data lives.
4. **Scope a tier→funding plan** only after the funding mechanics are confirmed live; do not assume entitlements.
5. **Evaluate distributor vs. direct** as a net-effort question for a small team, not a default.
6. **Resolve the sovereignty posture** (channel-only vs. infra dependency) before any reselling/infra commitment.

## 6. Owners & next checkpoint

- **Owner:** Risto Päärni
- **Next checkpoint:** Post-webinar debrief (week of 14 Jul) — capture funding map, distributor names, and Marketplace eligibility answers; then make the sovereignty-posture call.

## Related documents

- `docs/partnerships/aws-webinar-decision-memo.md` — attendance decision + pre-work.
- `DWS_SECURITY_STANDARD.md` — governs the sovereignty/CLOUD-Act decision.
- `DWS_ROLES_REGISTRY.md` — for any downstream partner/customer outreach matrix.
