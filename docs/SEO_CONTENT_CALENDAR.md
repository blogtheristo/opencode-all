# SEO Content Calendar Template

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/seo-sales-agent-pipeline-7et5F | Date: 20.02.2026 | Changes: Initial content calendar — agent-generated, PM-reviewed, weekly cadence with 12-week plan

Session Links & References:
  - Claude Code (claude/seo-sales-agent-pipeline-7et5F): https://github.com/blogtheristo/dws6/commits/claude/seo-sales-agent-pipeline-7et5F

Document Status:
  - Created: 20.02.2026
  - Last Modified: 20.02.2026
  - Language: EN
  - Languages Available: EN
  - Publication Status: ACTIVE

***

**Effective Date:** February 2026
**Scope:** Content production for dws10.com SEO pipeline
**Maintained by:** Content Brief Agent + PM review
**Depends on:** `docs/SEO_KEYWORD_SEED_LIST.md`, `docs/SEO_SALES_AGENT_SPECIFICATION.md`

---

## 1. Calendar Process

```
Monday AM: Content Brief Agent generates 2 brief proposals
               ↓
Tuesday AM: PM reviews & approves/modifies briefs
               ↓
Tue-Thu:    Content Brief Agent drafts approved pieces
               ↓
Thursday:   PM reviews drafts, requests revisions
               ↓
Friday:     Publish + SEO Audit Agent validates
               ↓
Following Mon: Performance data feeds back to Keyword Agent
```

---

## 2. Content Mix (Weekly Target: 2 pieces)

| Type | Frequency | Funnel | Typical Length | Purpose |
|------|-----------|--------|---------------|---------|
| Regulatory deep-dive | 2x/month | TOFU/MOFU | 2,000-3,000 words | Authority building |
| Industry use case | 2x/month | MOFU | 1,500-2,000 words | Vertical targeting |
| Product comparison | 1x/month | BOFU | 1,500-2,500 words | Conversion |
| Buyer guide | 1x/month | MOFU/BOFU | 2,500-3,500 words | Lead magnet |
| News/update | 2x/month | TOFU | 500-800 words | Freshness signal |
| Case study | 1x/quarter | BOFU | 1,000-1,500 words | Social proof |

---

## 3. 12-Week Launch Calendar (March–May 2026)

### Month 1: Foundation (March 2026)

| Week | Mon | Content 1 | Content 2 | Cluster |
|------|-----|-----------|-----------|---------|
| W1 | Mar 2 | "Complete Guide to Fit for 55 Compliance 2026" (TOFU, 3000w) | Optimize dws10.com homepage meta tags | fit-for-55 |
| W2 | Mar 9 | "CSRD Reporting: What Your Company Needs to Know" (TOFU, 2500w) | "DWS IQ vs Normative vs Persefoni: CSRD Tools Compared" (BOFU, 2000w) | csrd-reporting |
| W3 | Mar 16 | "NIS2 Directive: AI Compliance Requirements" (MOFU, 2000w) | Optimize /construction/ page for "construction AI Finland" | nis2-compliance |
| W4 | Mar 23 | "CBAM Reporting Requirements Starting 2026" (MOFU, 2000w) | "How to Choose Carbon Reporting Software" (BOFU, 2500w) | cbam |

### Month 2: Depth (April 2026)

| Week | Mon | Content 1 | Content 2 | Cluster |
|------|-----|-----------|-----------|---------|
| W5 | Mar 30 | "EU AI Act Article 12: Automatic Logging Explained" (MOFU, 2000w) | "ETS Phase 4: Free Allowance Phase-Out Timeline" (MOFU, 1500w) | eu-ai-act, ets |
| W6 | Apr 6 | "Steel Industry ETS Compliance: Practical Guide" (MOFU, 2000w) | Optimize existing product pages SEO | steel-compliance |
| W7 | Apr 13 | "EPBD Embodied Carbon: What Construction Companies Need" (MOFU, 2000w) | "5 Climate Reporting Mistakes That Cost Companies Fines" (TOFU, 1200w) | construction-carbon |
| W8 | Apr 20 | "Maritime FuelEU Compliance: Software Solutions" (MOFU, 1800w) | "CSRD Double Materiality Assessment Step-by-Step" (MOFU, 2500w) | maritime, csrd |

### Month 3: Conversion (May 2026)

| Week | Mon | Content 1 | Content 2 | Cluster |
|------|-----|-----------|-----------|---------|
| W9 | Apr 27 | "Best CSRD Reporting Software 2026: Buyer's Guide" (BOFU, 3000w) | "Construction Carbon Tracking: EN 15978 Calculator" (MOFU, 1500w) | csrd-reporting, construction |
| W10 | May 4 | "EU Sovereign Cloud for AI: Why It Matters" (MOFU, 1800w) | "Logistics Fleet Emissions: Tracking and Reporting Guide" (MOFU, 2000w) | sovereignty, fleet |
| W11 | May 11 | "Fit for 55 Compliance Automation: ROI Calculator" (BOFU, 1500w) | "Manufacturing Carbon Accounting EU Guide" (MOFU, 2000w) | fit-for-55, manufacturing |
| W12 | May 18 | Case study: "How [Customer] Reduced CSRD Reporting Time by 90%" (BOFU, 1200w) | "Green Claims Directive: Avoid Greenwashing Penalties" (TOFU, 1500w) | csrd-reporting, green-claims |

---

## 4. Content Template Structure

Every piece produced by the Content Brief Agent must follow this structure:

```markdown
# [Title with Primary Keyword]

Meta description: [160 chars max, includes primary keyword]
Primary keyword: [from seed list]
Secondary keywords: [2-3 related terms]
Funnel stage: [TOFU/MOFU/BOFU]
Target word count: [number]

## Introduction
- Hook with regulatory urgency or industry pain point
- Clear value proposition: what reader will learn
- [CTA #1 if BOFU: "Request a demo of DWS IQ 6"]

## H2: [Keyword-rich heading]
### H3: [Supporting section]
- Regulatory references (specific article numbers)
- Industry-specific data or examples
- DWS differentiation point

## H2: [Next section]
...

## H2: How DWS IQ 6 Addresses This
- Product features mapped to the problem
- Pricing transparency (link to /buy/)
- Technical specs (EU data residency, response time)

## Conclusion
- Summary of key points
- [CTA #2: "Start your free assessment" or "Download the compliance checklist"]

## Schema Markup
- type: Article/HowTo/FAQ
- datePublished, dateModified
- author: "Lifetime Oy"
```

---

## 5. Review Checklist (PM Gate)

Before publishing, PM verifies:

- [ ] Primary keyword in title, H1, meta description, first paragraph
- [ ] At least 2 internal links to DWS product pages
- [ ] At least 1 CTA with tracked UTM parameters
- [ ] Regulatory references cite specific articles (not vague "compliance")
- [ ] Industry terminology matches `16-INDUSTRIES.md` vocabulary
- [ ] No generic AI/compliance language that competitors could copy
- [ ] Schema markup valid (test with Google Rich Results)
- [ ] Images have alt text with keyword variations
- [ ] Published URL follows site structure (`/blog/[slug]/`)
- [ ] Content synced to `landing-pages/dws10-com/` (Dual Folder Rule)

---

## 6. Performance Tracking

After publication, the Keyword Intent Agent tracks weekly:

| Metric | Target (30 days) | Target (90 days) |
|--------|-------------------|-------------------|
| Google indexed | Within 48 hours | — |
| Target keyword position | Top 20 | Top 10 |
| Organic impressions | 100+ | 500+ |
| Organic clicks | 10+ | 50+ |
| Avg time on page | >2 minutes | >2 minutes |
| Scroll depth | >60% | >60% |
| Leads generated | 0-1 | 2-5 |
