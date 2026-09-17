# Early Input Email - 5 Emails Per Day Outreach System

***
**VERSION AND AGENT HISTORY**

Version: 1.1
Sessions & Modifications:
- Version: 1.1 | Tool: Claude Code (Opus 5) | Session: claude/traction-truth-reconciliation | Date: 29.07.2026 | Changes: Traction claims reconciled to docs/TRACTION_CANONICAL.md — retired the "6 paying customers / EUR 7k MRR / 100% retention / EUR 84k ARR" formulation, removed dispatch operators (Uber/Bolt/Kela/Taksi Helsinki/Limo Helsinki/Sixt) from software-customer lists, and restated traction as ~EUR 7,000/month services and transport revenue (not software revenue) plus two enterprise pilots contracted Q1/2026 at EUR 29,950 each (EUR 59,900 booked).
  - Version: 1.0 | Tool: Claude Code | Session: claude/add-investor-timeline-01LiEEtWsrRpjMyKADA3jpHe | Date: 12.02.2026 | Changes: Created Early Input Email template for 5-emails-per-day investor outreach system, integrated with Fundraising-Automation.md (025 metrics script)

Session Links & References:
  - Claude Code (01LiEEtWsrRpjMyKADA3jpHe): https://github.com/blogtheristo/dws6/commits/claude/add-investor-timeline-01LiEEtWsrRpjMyKADA3jpHe
  - View on GitHub: https://github.com/blogtheristo/dws6/blob/main/investor-outreach/EARLY-INPUT-EMAIL-5-DAY-SYSTEM.md

Document Status:
  - Created: 12.02.2026
  - Last Modified: 12.02.2026
  - Language: English
  - Languages Available: English
  - Publication Status: ✅ ACTIVE
***

---

## Overview

This document provides the **Early Input Email template** for the 5-emails-per-day investor outreach system, referenced in the Fundraising-Automation.md workflow (025 metrics: 1,025 emails sent per week target).

**Purpose**: Enable rapid investor outreach with minimal friction
**Target**: Send from `risto@lifetime.fi`
**Daily Goal**: 5 emails minimum, every day
**Weekly Target**: 25 emails (low friction) → scales to 1,025 emails over 10 weeks

---

## Input Email Template (Copy-Paste Ready)

**From**: risto@lifetime.fi
**To**: [Investor Email]
**Subject**: DWS IQ 6 – €150K SAFE closing Q1

---

**Body**:

```
Hi [First Name],

I'm raising €150K SAFE for DWS IQ 6 (edge AI for EU carbon compliance).

Current traction:
• ~€7,000/month services and transport revenue (not software revenue) — cash break-even, founder salary €0
• Two enterprise pilots contracted Q1/2026 at €29,950 each (€59,900 booked)
• Path to €281K profit in 12 months

15-min call to share pilot results? [Calendly link]

Best,
Risto Päärni
CEO, Lifetime Oy
+358 400 319 010
https://dws10.com/
```

---

## Ultra-Short Variants (50 words max)

### Variant A: Climate Tech Angle
```
Hi [First Name],

DWS IQ 6: Edge AI for EU carbon compliance (CSRD, Fit for 55).

Two enterprise pilots contracted Q1/2026 at €29,950 each (€59,900 booked); ~€7,000/month services and transport revenue (not software revenue). Raising €150K SAFE @ €3.8M cap.

15-min call? [Calendly]

Best,
Risto
```

### Variant B: Traction Angle
```
Hi [First Name],

€150K SAFE for DWS IQ 6 (climate AI platform).

Traction: two enterprise pilots contracted Q1/2026 at €29,950 each (€59,900 booked); ~€7,000/month services and transport revenue (not software revenue).

Quick call? [Calendly]

Best,
Risto
```

### Variant C: Regulatory Urgency
```
Hi [First Name],

EU CSRD deadline = forced purchase cycle for climate reporting.

DWS IQ 6: two enterprise pilots contracted Q1/2026 at €29,950 each (€59,900 booked). Raising €150K SAFE.

15 min? [Calendly]

Best,
Risto
```

### Variant D: Nordic Construction
```
Hi [First Name],

DWS IQ 6: Real-time SPI/CPI + carbon compliance for Nordic construction.

Two enterprise pilots contracted Q1/2026 at €29,950 each (€59,900 booked). Raising €150K SAFE.

Call? [Calendly]

Best,
Risto
```

---

## 5-Email Daily Workflow (Copy This Process)

### Morning (8:30-9:30am): Send 5 Emails

**Step 1**: Open `investor-outreach/contacts-angel-investors.csv` or your contact list

**Step 2**: Pick 5 investors you haven't contacted yet (prioritize warm connections)

**Step 3**: For each investor:
1. Open Gmail to risto@lifetime.fi
2. Copy template above
3. Replace `[First Name]` and `[Calendly link]`
4. Add 1 sentence of personalization (optional but recommended)
5. Send

**Step 4**: Mark in `daily-outreach-tracker.md`:
```
| Day | 5 Emails Sent? | Names Contacted | Responses | Notes |
|-----|----------------|-----------------|-----------|-------|
| Mon | ✅ | [Name1, Name2, Name3, Name4, Name5] | | Sent using Variant A |
```

**Time required**: 30 minutes (6 min per email)

---

## Personalization Quick Tips (30 seconds each)

If you have 30 extra seconds, add ONE of these personalization lines after "Hi [First Name],":

**Climate tech investors:**
```
I saw your investment in [Portfolio Company] focused on [climate problem]. DWS IQ 6 tackles the same challenge for construction (40% of EU CO₂).
```

**Nordic investors:**
```
I noticed your focus on Nordic B2B SaaS. DWS IQ 6 is Finland-based with customers in FI/SE/NO.
```

**Construction tech investors:**
```
I saw your investment in [Construction Company]. We're building similar infrastructure for carbon compliance.
```

**LinkedIn connection (warm):**
```
We connected on LinkedIn after [event/intro from X]. Following up on my climate AI platform.
```

**Angel syndicate member:**
```
I'm part of [FIBAN/Green Angel Syndicate] and saw you're active in the network. Would love to share DWS IQ 6 opportunity.
```

---

## Integration with Fundraising Automation (025 Script)

This Early Input Email system connects to **Fundraising-Automation.md** workflow:

### Week 1-2: Manual 5/day (50 emails)
- Use this template
- Send manually from risto@lifetime.fi
- Track in `daily-outreach-tracker.md`
- **Goal**: Test messaging, get 10-15 responses

### Week 3-4: Semi-automated (100 emails)
- Use SmartLead or similar tool
- Upload this template
- Automated sending from risto@lifetime.fi
- **Goal**: Scale to 10 emails/day, 50 responses

### Week 5-10: Full automation (875 emails)
- Use AI agent from Fundraising-Automation.md
- Automated personalization via Claude API
- Multi-variant A/B testing
- **Goal**: 1,025 total emails sent (025 metrics), 200+ responses, 50+ meetings

---

## Required Setup (5 minutes)

### 1. Email Account Configuration
- **Primary**: risto@lifetime.fi (Google Workspace)
- **Sending limit**: 500 emails/day (Gmail limit)
- **Warmup required**: No (existing account with history)
- **Signature**: Include at bottom of every email

```
---
Risto Anton Päärni
Founder & CEO, Lifetime Oy
DWS IQ 6 Platform

📧 risto@lifetime.fi
📱 +358 400 319 010
🌐 https://dws10.com/
🎯 Demo: https://j6prmljgpvnia.ok.kimi.link/
```

### 2. Calendly Link
- Create dedicated "Investor Call - 15 min" booking page
- URL: https://calendly.com/risto-lifetime/investor-15min (or similar)
- Replace `[Calendly]` in templates with actual link

### 3. Contact List Prioritization
Open `contacts-angel-investors.csv` and sort by:
1. **Warm Intro Path** (not empty) = send first
2. **Focus Area** = Climate tech, construction, Nordic = send second
3. **Check Size (EUR)** = 25000-100000 = send third

---

## Success Metrics (Track Weekly)

| Week | Emails Sent | Responses | Response Rate | Meetings | Commits |
|------|-------------|-----------|---------------|----------|---------|
| 1 | 25 | 5 | 20% | 2 | 0 |
| 2 | 50 | 12 | 24% | 5 | 1 |
| 3 | 100 | 22 | 22% | 10 | 2 |
| 4 | 200 | 40 | 20% | 18 | 4 |
| 5-10 | 1,025 | 195 | 19% | 47 | 12 |

**Target by Week 10:**
- 1,025 emails sent (025 metrics)
- 195 responses (19% response rate)
- 47 meetings (47% conversion from 100 initial investors)
- 12 verbal commits
- **€150K SAFE closed** ✅

---

## Troubleshooting

### "I don't have 30 minutes in the morning"
→ Send 2 emails now (12 min), 3 emails at lunch (18 min). Still counts.

### "I'm getting no responses"
→ Check:
1. Is subject line too long? (Keep under 50 chars)
2. Is email in spam? (Send test to yourself first)
3. Is Calendly link working? (Click it yourself)
4. Is personalization too generic? (Add 1 sentence about their portfolio)

### "I ran out of warm connections after 10 emails"
→ Good! Now use cold outreach with personalization from section above.

### "Response rate dropped below 15%"
→ Switch to different variant (A → B → C → D rotation).

### "I want to automate this now"
→ Read `Fundraising-Automation.md` for full automation setup (Week 3+).

---

## Required Next Steps (From Previous Session)

Based on the previous session discussion, here are the **required steps still open**:

### 1. ✅ Create Early Input Email template
- **Status**: Complete (this document)
- **Location**: `investor-outreach/EARLY-INPUT-EMAIL-5-DAY-SYSTEM.md`

### 2. ⏳ Send first 5 emails TODAY
- **Action**: Use template above to send 5 emails before 10am
- **Track**: Mark in `daily-outreach-tracker.md`
- **Target**: Complete by end of today

### 3. ⏳ Set up Calendly booking page
- **Action**: Create "Investor Call - 15 min" page
- **URL**: https://calendly.com/risto-lifetime/investor-15min
- **Settings**: 15-min slots, 9am-5pm EET, buffer 15min between calls

### 4. ⏳ Configure email signature
- **Action**: Add signature block (see above) to Gmail settings
- **Account**: risto@lifetime.fi
- **Format**: Include name, title, phone, demo link

### 5. ⏳ Review Fundraising-Automation.md
- **Action**: Read full automation workflow (025 metrics script)
- **Location**: `sales-outreach/Fundraising-Automation.md`
- **Purpose**: Understand scaling from 5/day (manual) → 150/day (automated)

---

## Quick Reference Card (Print This)

```
┌─────────────────────────────────────────────────────┐
│ DAILY INVESTOR OUTREACH - 5 EMAILS MINIMUM         │
├─────────────────────────────────────────────────────┤
│ TIME: 8:30-9:00am (30 minutes)                      │
│ FROM: risto@lifetime.fi                             │
│ TEMPLATE: Use EARLY-INPUT-EMAIL-5-DAY-SYSTEM.md    │
│                                                     │
│ PROCESS:                                            │
│ 1. Pick 5 investors from contact list              │
│ 2. Copy template (50 words)                        │
│ 3. Replace [First Name] + [Calendly]               │
│ 4. Add 1 sentence personalization (optional)       │
│ 5. Send                                             │
│ 6. Mark in daily-outreach-tracker.md               │
│                                                     │
│ GOAL: 25 emails/week → 1,025 emails in 10 weeks    │
│                                                     │
│ MILESTONE: €150K SAFE closed by Week 14-16         │
└─────────────────────────────────────────────────────┘
```

---

## Related Documents

- `START-HERE-DAY-1.md` - First day action plan (30 min to send 5 emails)
- `daily-outreach-tracker.md` - Daily tracking sheet
- `00-WHY-ZERO-OUTREACH.md` - Root cause analysis of 0 emails/day problem
- `Fundraising-Automation.md` - Full automation workflow (025 metrics script)
- `contacts-angel-investors.csv` - Angel investor contact list

---

**Document Version:** 1.0
**Created:** February 12, 2026
**Author:** Risto Päärni + Claude Code
**Purpose:** Enable 5-emails-per-day minimum investor outreach
**Target:** €150K SAFE closed in 16 weeks
**Status:** ✅ ACTIVE - Ready to use TODAY
