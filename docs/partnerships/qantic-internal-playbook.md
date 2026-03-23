---
VERSION AND AGENT HISTORY
Document: Qantic Partnership — Internal Playbook
Version: 1.1
Created: 2026-03-21
Author: Claude Opus 4.6 (DWS IQ 6 Agent)
Reviewed by: Risto Päärni (Founder & CEO, Lifetime Oy)
Status: INTERNAL ONLY — Never share with Qantic

Sessions & Modifications:
  - Version: 1.1 | Tool: Claude Code (Opus 4.6) | Session: claude/qantic-energy-analysis-Yjg00 | Date: 23.03.2026 | Changes: Added DocuSign readiness to call cheat sheet. NDA can be sent digitally within minutes of call ending.
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/qantic-energy-analysis-Yjg00 | Date: 21.03.2026 | Changes: Created from expansion strategy removed from deal proposal. Separate internal-only playbook for Risto's eyes only.

Document Status:
  - Last Modified: 23.03.2026
  - Classification: STRICTLY INTERNAL — Lifetime Oy Strategy
  - Publication Status: NEVER SHARE WITH QANTIC OR CLIENTS
---

# Qantic Partnership — Internal Playbook

**This document is for Risto only.** Nothing here goes to Thomas or any client. The deal proposal (qantic-deal-proposal-v5.md) and prospectus (qantic-deal-prospectus.md) are what Thomas sees.

---

## 1. Call Cheat Sheet (26.03)

Three lines. That's it.

1. **Credibility:** "Your clients will research both of us. DWS10 gives them confidence."
2. **Expansion:** "We cover 20 EU-regulated industries — as your client base grows beyond energy, you don't need a new vendor."
3. **Close:** "Name one pilot client. We send the NDA same day."

### DocuSign Ready

NDA is ready to send via DocuSign immediately after the call:
- Template: `Partners/NDA_TEMPLATE_EU_2026.md` (EU Trade Secrets Directive 2016/943 compliant)
- Integration: `src/integrations/docusign/` (built 21-22.03)
- Verification: `scripts/verify-nda-signatures.ts`
- Thomas signs digitally — no printing, scanning, or mailing
- Signature status trackable programmatically

### What NOT to say on 26.03

- Don't mention LWM by name
- Don't mention 15,000+ regulations or 82 ESRS disclosures
- Don't mention QLoRA, Climate LLM, or NVIDIA
- Don't show the industry list
- Don't discuss expansion pricing or platform licensing
- Don't put the expansion strategy in any document Thomas sees

---

## 2. Expansion Strategy (Post-Pilot)

**Trigger:** BESS pilot proves itself (month 2-3). Client asks "can you also cover our factory/logistics/construction emissions?" That's when the 20-industry conversation opens naturally, with leverage.

### 6-Industry Expansion Path for MAN-Type Clients

MAN Energy Solutions spans all six. This is real, not hypothetical.

| Industry | MAN Relevance | DWS Model | Regulation |
|----------|--------------|-----------|------------|
| Power & Heat | Core — BESS, gas turbines | Energy model | ETS Phase 4 |
| Iron & Steel | Supply chain — turbine components | Manufacturing model | ETS + CBAM |
| Maritime Shipping | MAN marine engines | Maritime model | ETS (from 2024) |
| Road Transport | MAN trucks, logistics | Logistics model | ETS2 (from 2027) |
| Construction | Plant construction, installations | Construction model | EPBD, EN 15978 |
| Chemicals | Turbine coatings, coolants | Chemicals model | ETS + REACH |

### Revenue Expansion Per Client

| Phase | Scope | Revenue | Timing |
|-------|-------|---------|--------|
| Phase 1 | Energy (BESS) | €99/asset/month | Now |
| Phase 2 | +1-2 industries | €500/seat/month per industry | Month 3-6 |
| Phase 3 | Full LWM platform license | €25,000+/year | Month 6-12 |

### How to Open Phase 2

Don't pitch it. Wait for the question. When the pilot client's CFO sees the BESS compliance report and asks "do you cover our manufacturing plants too?" — that's the door.

If the question doesn't come organically, prompt it in the quarterly review: "We noticed your CSRD report will need to cover [manufacturing/logistics/maritime] by Wave 2. We already have models for those industries."

---

## 3. Mutual Credibility — Why This Matters

| Direction | What it proves |
|-----------|---------------|
| Qantic → Lifetime | Energy domain, BESS simulation IP, German market, client network |
| Lifetime → Qantic | Technical depth (dws10.com/csrd/), EU compliance credibility, working product, EU-hosted infra |

Qantic's web presence is weak. Ours is strong. Their clients Google both parties — DWS10.com is Qantic's credibility layer whether Thomas realizes it or not.

After the deal: Qantic becomes our energy reference. We become their compliance credibility. Both logos strengthen each other's pitch decks.

---

## 4. Strategic Priorities

1. **Close the BESS deal.** Everything else is theory until the first invoice is paid.
2. **Get the MAN logo.** One MAN Energy Solutions reference changes every subsequent sales conversation — energy, construction, industrial.
3. **Don't let Qantic delay construction.** ERP connectors (SAP, IFS, Dynamics) are our strongest asset and nobody is building them. First construction pilot should run parallel, not after.
4. **Fund with Qantic, validate with Qantic, but build the moat in construction.** Qantic wins on speed and certainty. Construction wins on scale and moat.

---

## 5. Revenue Path to €7k/month

| Source | Monthly | When |
|--------|---------|------|
| Qantic setup (€15,990 spread over 12mo) | €1,333 | April 2026 |
| Qantic API (5 assets) | €495 | July 2026 |
| 2nd deal (Qantic referral or direct) | €1,200-€1,800 | Q3 2026 |
| 3rd deal | €1,200-€1,800 | Q3-Q4 2026 |
| Qantic referral network (20 assets) | €1,380 | Q4 2026 |
| **Total path** | **€5,600-€6,800** | **End of 2026** |

Gap to €7k: 1-2 more direct clients or construction pilot revenue. This is tight but achievable if Qantic delivers referrals and the construction pilot starts by Q3.

---

**Document Owner:** Risto Päärni — Personal Strategy
**Distribution:** STRICTLY INTERNAL — Lifetime Oy founder only

© 2026 Lifetime Oy · Internal Playbook · Confidential
