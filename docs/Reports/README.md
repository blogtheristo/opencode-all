# Weekly Reports – DWS IQ 6
**Operational Progress Tracking for Investors, Partners, and Metropolia**

---

## Purpose

This folder contains weekly progress reports for DWS6 development, organized by language (English + Finnish).

**Audiences:**
- **Investors:** Track burn rate, MVP completion %, customer metrics
- **Partners:** Monitor feature development, integration readiness
- **Metropolia University:** Document thesis progress, learnings

**Reporting cadence:** Every Friday by 5pm EET

---

## Folder Structure

```
docs/Reports/
├── README.md (this file)
├── en/
│   ├── TEMPLATE.md (English report template)
│   ├── 2025-W49.md (Week 49, Dec 2-8, 2025)
│   ├── 2025-W50.md (Week 50, Dec 9-15, 2025)
│   └── ... (52 weeks)
└── fi/
    ├── TEMPLATE.md (Finnish report template / Suomalainen raporttipohjateplate)
    ├── 2025-W49.md (Viikko 49)
    ├── 2025-W50.md (Viikko 50)
    └── ... (52 viikkoa)
```

**Naming convention:** `YYYY-WWW.md` (ISO 8601 week numbers)
- Example: `2025-W49.md` = Week 49 of 2025 (Dec 2-8)
- Use https://www.epochconverter.com/weeknumbers to find week numbers

---

## Report Sections

### 1. Summary (2-3 bullet points)
**What:** Highest-level achievements
**For whom:** Busy readers (investors skimming)

### 2. Progress by Kanban Category
**What:** Tasks moved between columns (Backlog → This Week → In Progress → Done)
**For whom:** Project managers, Metropolia supervisor (tracking velocity)

### 3. MVP Build Percentage
**What:** Completion % for each roadmap/product
**For whom:** Investors (fundraising progress), Metropolia (thesis data)
**Formula:** (Done tasks / Total tasks) × 100

### 4. Costs Summary
**What:** Weekly and month-to-date costs, startup credits used
**For whom:** Investors (burn rate), Metropolia (cost model validation)

### 5. Risks & Next Steps
**What:** Top 1-2 risks + next week priorities
**For whom:** All stakeholders (proactive communication)

### 6-9. Optional Sections
- Customer & Business Development (if applicable)
- Team & Hiring
- Technical Highlights
- Appendices (links to GitHub Projects, docs)

---

## How to Generate Reports

### MVP Phase (Month 1-3): Manual

**Friday workflow (Risto):**
1. Open all GitHub Projects, count tasks by column
2. Copy `en/TEMPLATE.md` to `en/2025-W{week}.md`
3. Fill in sections using data from:
   - GitHub Projects (task counts)
   - Google Sheets (cost tracking)
   - Slack (customer feedback)
   - Calendar (investor meetings)
4. Write narrative (Summary, Risks, Next Steps)
5. Translate to Finnish: Copy to `fi/2025-W{week}.md`, translate
6. Commit both files to Git
7. Share links in Slack (investors channel, Metropolia channel)

**Time:** ~2 hours/week

### Alpha Phase (Month 4-6): Semi-Automated

**Python script generates draft:**
1. Script fetches GitHub Projects data via API
2. Script fetches cost data from Google Sheets API
3. Script populates template with numbers
4. Risto reviews, adds narrative, publishes

**Time:** ~30 minutes/week

### V1 Phase (Month 7-12): AI-Assisted

**Product & Reporting Agent (Claude) generates full draft:**
1. Agent fetches all data sources (GitHub, Sheets, Slack)
2. Agent generates draft report using template
3. Agent translates to Finnish
4. Risto reviews, edits (~10% changes), approves
5. Agent commits to Git, posts to Slack

**Time:** ~15 minutes/week (review only)

---

## Weekly Report Checklist

**Before publishing, verify:**
- [ ] All sections filled in (no "TBD" or "[X]" placeholders)
- [ ] Numbers are accurate (double-check GitHub Projects, cost dashboard)
- [ ] Completion % matches GitHub Projects (recalculate weekly)
- [ ] Risks are specific, not generic ("Risk: Customer churn" is bad; "Risk: Customer A reported bug in Viability Agent, 50% probability they churn if not fixed by next week" is good)
- [ ] Next week priorities are actionable (not "Work on agents" but "Deploy Manufacturing Energy Optimization Agent to staging")
- [ ] Finnish translation is accurate (use formal business language, not Google Translate)
- [ ] Sensitive data is redacted (customer names anonymized, financials rounded)
- [ ] Links work (GitHub Projects URLs, document links)
- [ ] File is committed to Git (not just saved locally)
- [ ] Report shared in Slack channels (investors, Metropolia)

---

## Report Distribution

### Internal (Lifetime Oy Team)
**Slack channel:** `#dws6-weekly-reports`
**Format:** Link to GitHub file
**Example:**
> **Week 49 Report Published!** 📊
>
> EN: https://github.com/blogtheristo/dws6/blob/main/docs/Reports/en/2025-W49.md
> FI: https://github.com/blogtheristo/dws6/blob/main/docs/Reports/fi/2025-W49.md
>
> **TL;DR:** MVP 35% complete, €0 burn rate, 5 pilot customers recruited

### Investors
**Email:** risto@lifetime.fi → investor mailing list
**Subject:** `[DWS6] Week 49 Update: MVP 35% Complete`
**Body:**
```
Hi [Investor],

Quick update on DWS6 progress for Week 49 (Dec 2-8):

KEY METRICS:
- MVP Completion: 35% (15/43 tasks done)
- Burn Rate: €0 (100% free tier, as planned)
- Customers: 5 pilot customers recruited
- NPS Score: 40 (excellent for pilot phase)

HIGHLIGHTS:
- Deployed Groq API router to Cloud Run (infrastructure ready)
- Onboarded first 2 pilot customers (Construction vertical)
- Raised €30K of €150K seed round (20% complete)

RISKS:
- Customer A reported bug in Viability Agent (P0, fixing this week)

Full report: https://github.com/blogtheristo/dws6/blob/main/docs/Reports/en/2025-W49.md

Questions? Reply or book a call: https://cal.com/ristopaarni

Cheers,
Risto
```

**Frequency:** Weekly (Fridays)

### Partners (e.g., Atlassian, NVIDIA)
**Slack/Email:** Case-by-case
**Content:** Filtered version of investor report (hide financials, show technical progress)

### Metropolia University
**Thesis supervisor email:** [supervisor]@metropolia.fi
**Subject:** `Thesis Progress Week 49: Data Collection in Progress`
**Body:**
```
Hi [Supervisor],

Weekly thesis update (Week 49):

THESIS STATUS:
- Data collection: 2/12 weeks complete (MVP phase)
- Customer interviews: 2/5 completed
- Cost tracking: On target (€0 actual vs €0 budget)
- Reflective logs: Week 1, Week 2 complete

ACADEMIC PROGRESS:
- Chapter 5 (Implementation): 15% drafted (documenting infrastructure deployment)
- Literature review: 10 sources reviewed, 5 more needed

NEXT WEEK:
- Interview Customers 3, 4, 5
- Write Week 3 reflective log
- Draft cost analysis section (Chapter 6)

Full weekly report (includes business context): https://github.com/blogtheristo/dws6/blob/main/docs/Reports/en/2025-W49.md

Questions? Let's discuss in our next meeting (Dec 12).

Best,
Risto
```

**Frequency:** Weekly (Fridays)

---

## Metrics to Track Over Time

### Key Performance Indicators (KPIs)

| Metric | Target | Source |
|--------|--------|--------|
| **MVP Completion %** | 100% by Week 12 | GitHub Projects |
| **Weekly Burn Rate** | €0 (MVP), €50 (Alpha) | Google Sheets |
| **Startup Credits Used** | <10% by Month 3 | Cloud dashboards |
| **Customer NPS** | ≥30 | Typeform surveys |
| **Customer Churn** | 0% (MVP), <5% (Alpha) | Customer database |
| **Agent Invocations/Day** | ≥10/customer | Usage logs |
| **Uptime** | >99% | Uptime Robot |
| **Response Time** | <2s (cloud), <100ms (edge) | Sentry |
| **Development Velocity** | 5 tasks/week | GitHub Projects |
| **Fundraising Progress** | €150K by Month 3 | Investor CRM |

### Trend Analysis (Monthly)

**Google Sheets dashboard:**
- Chart: MVP Completion % over 12 weeks (target: linear growth to 100%)
- Chart: Burn rate over time (target: stay at €0 until Alpha)
- Chart: Customer count (target: 5 by Week 3, 50 by Month 6)
- Chart: NPS score trend (target: maintain ≥30)

---

## Examples

### Good Report (Specific, Actionable, Honest)

**Summary:**
- ✅ Deployed Groq API router to Cloud Run, achieving €0 infrastructure cost as planned
- ✅ Onboarded first 2 pilot customers (Construction), both gave NPS 9/10
- ⚠️ Customer A reported bug in Viability Agent (P0), fixing this week to prevent churn

**Risks:**
- **Risk 1: Customer A churn due to Viability Agent bug**
  - Impact: High (lose 20% of pilot customers)
  - Probability: Medium (50% if not fixed by next week)
  - Mitigation: Risto working full-time on fix, deploying hotfix by Wed Dec 6

### Bad Report (Vague, No Actionable Insights)

**Summary:**
- Made progress on infrastructure
- Talked to some customers
- Working on agents

**Risks:**
- Some technical issues
- Might need more time

---

## Integration with Thesis (Metropolia)

**How reports feed into thesis:**

### Chapter 5 (Implementation)
**Data source:** Weekly reports (Weeks 1-12)
**Use:** Narrative timeline of MVP development
**Example:**
> "Week 2 marked a critical infrastructure milestone with the deployment of the Groq API router to Cloud Run, achieving the target €0 operational cost (Report 2025-W50). This validated the free-tier bootstrap strategy outlined in Chapter 4."

### Chapter 6 (Results & Analysis)
**Data source:** Aggregated metrics from 12 weeks of reports
**Use:** Cost model validation, velocity analysis
**Example:**
> "Over 12 weeks, actual burn rate remained at €0 (100% free tier utilization), validating the hypothesis that startup credits can fund MVP phase. Average development velocity was 5.2 tasks/week (σ = 1.3), aligning with Lean Startup literature on solo founder productivity (Ries, 2011)."

### Appendices
**Data source:** All 12 weekly reports
**Use:** Raw data for reproducibility
**Example:**
> "See Appendix D for complete weekly reports (2025-W49 through 2026-W08)."

---

## FAQ

### Q: What if I miss a week?

**A:** Don't skip weeks (creates gaps in thesis data). If you can't write a full report:
- Minimum viable report: Summary + Costs + Risks (5 min)
- Backfill later if needed (but mark as "Retroactive")

### Q: How detailed should technical sections be?

**A:** Tailor to audience:
- **Investors:** High-level (don't explain what Docker is)
- **Metropolia:** Moderate detail (explain architecture decisions)
- **Partners:** Deep technical (show code snippets if relevant)

**Solution:** Use expandable sections in Markdown:
```md
<details>
<summary>Technical deep dive (optional)</summary>

Deployed FastAPI service using Cloud Run with the following config:
- Runtime: Python 3.11
- Memory: 512 MB
- CPU: 1 vCPU
- Min instances: 0 (scale to zero)
- Max instances: 10

Cost: €0 (within 2M requests/month free tier)
</details>
```

### Q: Should I redact sensitive data?

**A:** Yes, for public reports (GitHub is public):
- Customer names → "Customer A", "Customer B"
- Financial details → Round to nearest €10K ("€150K target" not "€147,328.41")
- Employee details → "Team member" not names
- IP → Don't share proprietary code or algorithms

**For private investor updates:** Can include full details (send via email, not GitHub)

### Q: What if completion % goes down (new tasks added)?

**A:** This is normal! Explain in report:
> "Completion % decreased from 35% to 33% this week due to 5 new tasks discovered during Customer A onboarding. While percentage decreased, absolute progress increased (18 done vs 15 last week)."

---

## Roadmap

### MVP Phase (Month 1-3)
- ✅ Create report templates (EN + FI)
- ☐ Generate 12 weekly reports (2025-W49 through 2026-W08)
- ☐ Build trend analysis dashboard (Google Sheets)

### Alpha Phase (Month 4-6)
- ☐ Automate data fetching (GitHub Projects API, Google Sheets API)
- ☐ Python script generates draft reports
- ☐ Reduce report writing time from 2h → 30min

### V1 Phase (Month 7-12)
- ☐ Deploy Product & Reporting Agent (Claude generates drafts)
- ☐ Fully automated translation (EN → FI)
- ☐ Auto-post to Slack, email investors

---

**Document Status:** v1.0
**Last Updated:** December 3, 2025
**Owner:** Risto Anton Päärni
**Next Review:** After first weekly report (Week 49, Dec 2025)
