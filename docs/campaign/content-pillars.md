# DWS IQ 800-Day Campaign — Content Pillars

VERSION AND AGENT HISTORY
- Version: 1.0
- Date: 2026-03-15
- Agent: Claude Opus 4.6
- Action: Created campaign content pillars document

## Campaign Overview

- Duration: 800 days (March 16, 2026 — May 25, 2028)
- Posts per day: 1 EN + 1 FI = 2 posts/day, 1,600 total
- Distribution: Blog (primary), Newsletter (weekly digest), LinkedIn (best 2-3/week)
- SEO targets: Google organic + AI search (Perplexity, ChatGPT, Gemini)

## 7 Content Pillars (Rooted in Real Engineering Decisions)

The content moat is not AI-generated fluff — it's 2,000 real commits and 1,500 real PRs, each a technical decision with a business reason. These pillars are organized by git history themes, then enriched with legal, industry, and AI news.

"Why we chose GL journal entries over a native ESG endpoint" is a better post than any generic CSRD explainer. We have 1,500 more like it.

### Pillar 1: ERP Integration & Transition (~115 posts)
**Git source:** commits in `src/integrations/erp/`, SAP/Visma/IFS/Dynamics connectors
**Focus:** Real engineering decisions from ERP integration work + Visma sale disruption
**Content pattern:** "We had to connect to SAP S/4HANA's OData API. Here's what actually works."
**Audience:** CIOs, IT directors, CFOs at Nordic mid-market (50-500 employees)
**Keywords:** ERP migration, Visma alternative, SAP integration, IFS connector, ERP data migration
**CTA:** Book ERP transition consultation (dws10.com/contact)

### Pillar 2: Compliance Automation (~115 posts)
**Git source:** commits in `src/agents/`, compliance scoring, CSRD/ETS/CBAM calculations
**Focus:** How compliance code actually works, regulation article-by-article implementation
**Content pattern:** "CSRD Article 19a(2) requires double materiality. Here's how we automated it."
**Audience:** Compliance officers, sustainability managers, CFOs
**Keywords:** CSRD automation, ETS Phase 4, CBAM calculator, double materiality, Fit for 55
**CTA:** DWS IQ compliance dashboard (dws10.com/buy)

### Pillar 3: Agent Architecture & AI (~115 posts)
**Git source:** commits in `src/mcp/`, `mcp-servers/`, agent orchestration, KYA governance
**Focus:** MCP protocol decisions, agent swarm architecture, LLM choice rationale
**Content pattern:** "Why we chose MCP over REST for agent-to-ERP communication."
**Audience:** CTOs, tech leads, innovation managers
**Keywords:** MCP protocol, agent swarm, industrial AI, KYA standard, AI orchestration
**CTA:** DWS IQ Platform demo (dws10.com/products/dwsiq.html)

### Pillar 4: Industry Deep-Dives (~115 posts)
**Git source:** commits per industry (`construction/`, `manufacturing/`, `energy/`) + 16-INDUSTRIES.md
**Focus:** Sector-specific compliance math, carbon tracking, regulation mapping
**Content pattern:** "EN 15978 lifecycle stages A1-D: how we calculate embodied carbon for Nordic construction."
**Audience:** Industry-specific decision makers
**Keywords:** construction carbon, steel ETS, CBAM steel imports, EPBD real estate
**CTA:** Industry solutions (dws10.com/construction, /manufacturing, etc.)

### Pillar 5: Security & Sovereignty (~115 posts)
**Git source:** commits in security hardening, KYA standard, RLS policies, data residency
**Focus:** CLOUD Act risk, sovereign infrastructure decisions, GDPR engineering
**Content pattern:** "We moved from Supabase hosted to self-hosted PostgreSQL. Here's the sovereignty math."
**Audience:** CISOs, DPOs, IT directors
**Keywords:** EU data sovereignty, CLOUD Act risk, sovereign database, GDPR ERP, RLS
**CTA:** Sovereignty assessment (dws10.com/products/sovereignty-cloud-consulting.html)

### Pillar 6: ESG Data & Performance (~115 posts)
**Git source:** commits in `src/integrations/esg/`, Worldfavor/PositionGreen, pgvector, embeddings
**Focus:** ESG data pipeline engineering, climate LLM, measurement methodology
**Content pattern:** "Why we chose GL journal entries over a native ESG endpoint."
**Audience:** Technical buyers, ESG data teams, sustainability engineers
**Keywords:** ESG data pipeline, climate intelligence, pgvector, Firehorse reports, edge AI
**CTA:** Climate Reporting Bundle (dws10.com/products/bundle.html)

### Pillar 7: Business & Industry News (~115 posts)
**Focus:** Legal compliance updates, AI news impact analysis, industry news, Nordic market trends
**Content mix:**
- Legal compliance news: New EU regulations, deadline changes, enforcement actions
- AI news: Model releases, agent frameworks, tool announcements — analyzed for business impact
- Industry news: M&A (Visma sale), market shifts, Nordic digitalization trends
- Behind the Build: Real DWS engineering decisions turned into business stories
**Audience:** CEOs, founders, board members, investors
**Keywords:** Nordic digital transformation, EU AI Act news, B2B content strategy
**CTA:** Expert advisory (dws10.com/products/expert-advisory.html)

## Rotation Pattern

Posts rotate through pillars cyclically to catch both new and returning readers:

| Day | Pillar |
|-----|--------|
| 1, 8, 15, 22... | ERP Transition |
| 2, 9, 16, 23... | EU Compliance |
| 3, 10, 17, 24... | AI & Automation |
| 4, 11, 18, 25... | Industry Deep-Dives |
| 5, 12, 19, 26... | Sovereign Technology |
| 6, 13, 20, 27... | Product Knowledge |
| 7, 14, 21, 28... | Business Strategy |

This means every week covers all 7 pillars. A reader who discovers the blog on any day gets exposed to the full breadth of topics within their first week of reading.

## Phase Structure

- Phase 1 (Days 1-100): Foundation — establish authority, core SEO keywords
- Phase 2 (Days 101-300): Depth — industry-specific, case studies, comparisons
- Phase 3 (Days 301-500): Engagement — interactive content, webinar recaps, customer stories
- Phase 4 (Days 501-800): Authority — thought leadership, regulation updates, predictions

## Editorial Standards (CRITICAL)

### Depth: New York Times Level
- Minimum 1,500 words per post (target 2,000-2,500)
- Named sources: EU regulation article numbers, named companies, specific data points
- No filler paragraphs. Every section must add insight the reader cannot get elsewhere
- Structure: Problem → Data → Analysis → DWS angle → Fair comparison → Action

### Autoresearch Integration
- Pull real market data from DWS autoresearch pipeline (competitor pricing, market signals)
- Reference Clawdbot/DWS IQ agent outputs where meaningful (compliance scores, carbon calculations)
- Cite specific regulation articles (e.g., "CSRD Article 19a(2)" not just "CSRD")
- Include industry benchmarks from public sources (Eurostat, EEA, national statistics)

### DWS Benefit Areas
- Each post MUST clearly articulate where DWS IQ adds value to the topic
- Show the DWS solution in context of the problem (not just "buy our product")
- Include concrete examples: "DWS IQ calculates this in 2 minutes vs 40 hours manually"
- Link to specific product pages, not generic homepage

### Honest Competition
- Acknowledge when competitors have good solutions. Credibility > promotion
- "If you're already using [Competitor X] for [use case], that's a solid choice. DWS IQ adds value specifically for [specific gap]"
- Never trash competitors. Compare objectively on features, pricing, EU compliance, data residency
- Readers who see honest analysis trust you more and convert at higher rates

### Writing Style
- Professional but accessible. No jargon without explanation
- Active voice. Short sentences for complex topics
- Lead with the insight, not the background. Busy executives skim
- Include "What this means for your business" sections
- End every article with a specific, actionable next step

## Unique Content Advantage: 2000 Commits / 1500 PRs

DWS has ~2,000 commits and ~1,500 PRs in its git history. Each one is a real technical decision with a real business reason behind it. This is a content goldmine that no competitor can replicate.

### How to Mine Commits for Content
- Pull interesting PRs/commits and turn them into "Behind the Build" posts
- Pattern: "We had to decide between X and Y. Here's why we chose X."
- Shows real engineering depth (builds trust with technical buyers)
- Unique to DWS — no competitor can copy your actual engineering decisions
- Example: "Why We Built a Sovereign Database Layer Instead of Using Supabase Directly"
- Example: "How We Chose MCP Over REST for Agent-to-ERP Communication"

### Content Types from Git History
1. Architecture Decision Records (ADRs) turned into blog posts
2. "Lessons from Production" — real bugs, real fixes, real learnings
3. ERP integration stories — what SAP/Visma/IFS integration actually looks like
4. Compliance implementation — how CSRD reporting code actually works
5. Security incidents → lessons learned (anonymized)

This is Phase 2+ content (Days 101+) that adds genuine depth impossible to fake.

## SEO Strategy

- Each post targets 1 primary keyword + 2-3 long-tail variants
- hreflang tags on every post (EN↔FI) for Google multilingual indexing
- Schema.org Article structured data
- Internal linking between related posts (pillar cluster model)
- AI search optimization: structured data, FAQ sections, clear definitions

## Newsletter Integration

- Weekly digest every Friday: top 5 posts of the week
- Separate EN and FI editions
- Supabase table: newsletter_subscribers (email, lang, subscribed_at, active)
- Transport: Amazon SES (primary) → Resend (fallback)

## LinkedIn Promotion

- 2-3 posts per week promoted to LinkedIn
- Format: hook paragraph + key insight + link + 3-5 hashtags
- Tag posts with linkedin: true in campaign tracker
- Focus on Pillar 1 (ERP Transition) and Pillar 2 (EU Compliance) for LinkedIn
