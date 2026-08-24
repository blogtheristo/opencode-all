# Sentris Capital Rejection — Post-Mortem

VERSION AND AGENT HISTORY
Version: 1.0
Date: 2026-04-01
Author: Claude Opus 4.6 + Human Review
Branch: claude/review-investment-decision-0zTSR
Owner: Lifetime Oy
Status: Active
Related: investor-outreach/INTRO_ERIK_KURIST_SENTRIS.md, investor-outreach/INVESTOR_MEMO_AEGIS.md
---

## What Happened

Erik Kurist (Investment Associate, Sentris Capital — EU Defence & Resilience VC, Estonia) passed on DWS6 after reviewing the investor deck and memo.

**His words:** "Unfortunately, after further review, the DWS6 solution does not appear to align directly with our defense and resilience investment mandate."

**Timeline:**
- 2026-03-30: Warm inbound via Boardy — Erik reached out first
- 2026-03-30: Replied with Nordkalk case study + general INVESTOR_MEMO.md (v4.0)
- 2026-04-01: Rejection received

## Why It Happened

**Root cause: framing mismatch.** The general investor memo (INVESTOR_MEMO.md v4.0) opens with:

> **Sector:** Climate Tech / Carbon Balance Sheet Infrastructure / EU Compliance Automation

A defence VC reads "Climate Tech" and immediately pattern-matches to "not my mandate." The Nordkalk case study in the email body was the right angle, but the attached memo told a climate story with defence as a footnote.

**The memo said:** "We build carbon balance sheets. Also works for defence."
**It should have said:** "We give EU defence supply chains sovereign AI intelligence. Carbon compliance is a defence capability."

## The Fix

Created `investor-outreach/INVESTOR_MEMO_AEGIS.md` — a defence-first investor memo with:

1. Sector line: "Defence & Resilience / Sovereign AI Infrastructure / Dual-Use Supply Chain Intelligence"
2. Leads with EU defence supply chain regulatory collision (ETS, CBAM, CSRD, NIS2, KRITIS, EU AI Act)
3. Frames carbon as a supply chain weapon (CBAM), not a green initiative
4. Competitive table vs Palantir/Anduril/C3.ai with EU certification roadmap column
5. Sovereignty credentials front and center
6. Same company, same numbers, same SAFE — different lens

## Pipeline Impact — Who Gets Which Memo

### Defence/Sovereignty VCs → Aegis Memo

| Investor | Status | Action |
|----------|--------|--------|
| Sentris Capital (Erik Kurist) | PASSED | Lesson learned — no re-approach |
| Olof Faxander (Gungnir Capital) | Sent climate memo | **FOLLOW-UP NEEDED — resend with Aegis memo** |
| Olof Hernell (Investor AB) | Sent climate memo | **FOLLOW-UP NEEDED — resend with Aegis memo** |
| Keen Venture Partners (Giuseppe Lacerenza) | In pipeline | Send Aegis memo from start |
| Join Capital (Jan Borgstadt) | Not contacted | Send Aegis memo from start |
| Vsquared Ventures | Not contacted | Send Aegis memo from start |
| NATO Innovation Fund | Not contacted | Send Aegis memo from start |
| OTB Ventures | Not contacted | Send Aegis memo from start |
| DEFINE Finland | Not contacted | Send Aegis memo from start |
| Tesi | Not contacted | Send Aegis memo from start |
| Lifeline Ventures | Not contacted | Send Aegis memo from start |
| FiBAN DEFSEC | Not contacted | Send Aegis memo from start |

### Climate/Compliance VCs → General Memo (INVESTOR_MEMO.md)

All climate tech, ESG, and general enterprise SaaS investors continue to receive the general memo.

## Lesson

**Two memos for two markets.** Same company, same product, different buyer psychology:

- Climate/compliance investors want to hear: "Mandatory regulatory spend, 50,000+ companies affected, carbon balance sheet infrastructure"
- Defence/resilience investors want to hear: "Sovereign AI, supply chain resilience, CLOUD Act immunity, KRITIS, dual-use intelligence"

Both are true. The question is which story leads. From now on, every defence investor gets the Aegis memo first.
