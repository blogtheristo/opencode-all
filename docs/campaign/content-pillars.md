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

## 10 Content Pillars

The content moat is not AI-generated fluff — it's 2,000 real commits and 1,500 real PRs, each a technical decision with a business reason. These pillars are organized by git history themes.

"Why we chose GL journal entries over a native ESG endpoint" is a better post than any generic CSRD explainer. We have 1,500 more like it.

### Pillar 1: ERP Integration (~115 posts)
**Git source:** commits in `src/integrations/erp/`, SAP/Visma/IFS/Monitor/Dynamics connectors
**Focus:** Real engineering stories from ERP integration, Visma sale disruption, Monitor, IFS Cloud
**Content pattern:** "We had to connect to SAP S/4HANA's OData API. Here's what actually works."
**Audience:** CIOs, IT directors, CFOs at Nordic mid-market (50-500 employees)
**Keywords:** ERP migration, Visma alternative, SAP integration, IFS connector, Monitor ERP
**CTA:** Book ERP transition consultation (dws10.com/contact)

### Pillar 2: Compliance Automation (~115 posts)
**Git source:** commits in `src/agents/`, compliance scoring, CSRD/EPBD/ETS/CBAM calculations
**Focus:** How compliance code actually works — CSRD, EPBD, Fit for 55, regulation-driven engineering
**Content pattern:** "CSRD Article 19a(2) requires double materiality. Here's how we automated it."
**Audience:** Compliance officers, sustainability managers, CFOs
**Keywords:** CSRD automation, EPBD compliance, Fit for 55, ETS Phase 4, CBAM calculator
**CTA:** DWS IQ compliance dashboard (dws10.com/buy)

### Pillar 3: Legal & Governance (~115 posts)
**Git source:** commits in KYA standard, Legal/, D&O safe harbor, RLS policies, security hardening
**Focus:** KYA Standard governance, D&O safe harbor for AI decisions, EU AI Act implementation, data sovereignty
**Content pattern:** "KYA Standard v1: why we built hardware-level governance before the EU AI Act required it."
**Audience:** Legal teams, CISOs, DPOs, board-level governance
**Keywords:** KYA standard, EU AI Act, D&O safe harbor, AI governance, sovereign database, CLOUD Act
**CTA:** Sovereignty consulting (dws10.com/products/sovereignty-cloud-consulting.html)

### Pillar 4: Business News (~115 posts)
**Focus:** Nordic industry M&A, ERP market disruption (Visma sale), market shifts, funding rounds, competitive intelligence
**Content pattern:** "Visma acquisition: what Hg Capital's bid means for 500,000 Nordic ERP customers."
**Audience:** CEOs, founders, board members, investors, industry analysts
**Keywords:** Visma sale, Nordic ERP market, construction tech M&A, B2B Nordic, digital transformation
**CTA:** Expert advisory (dws10.com/products/expert-advisory.html)

### Pillar 5: AI News (~115 posts)
**Focus:** Agent architecture, MCP protocol, agentic efficiency, model releases, AI Act enforcement
**Content pattern:** "Claude 4.6 launched. Here's what it means for industrial compliance agents."
**Audience:** CTOs, AI leads, innovation managers, developers
**Keywords:** MCP protocol, AI agent, agentic AI, agent swarm, industrial AI, EU AI Act
**CTA:** DWS IQ Platform (dws10.com/products/dwsiq.html)

### Pillar 6: Industry News (~115 posts)
**Focus:** Construction, logistics, healthcare, manufacturing — vertical-specific news, regulation impact, sector benchmarks
**Content pattern:** "EN 15978 lifecycle stages A1-D: how we calculate embodied carbon for Nordic construction."
**Audience:** Industry-specific decision makers, sector analysts
**Keywords:** construction carbon, steel ETS, CBAM steel, EPBD real estate, logistics ETS
**CTA:** Industry solutions (dws10.com/construction, /manufacturing, etc.)

### Pillar 7: KYA / Agent Architecture (~115 posts)
**Git source:** commits in `src/mcp/`, `mcp-servers/`, KYA standard, agent orchestration
**Focus:** Technical depth from commit history — MCP decisions, agent swarm architecture, KYA governance, ESG data pipelines
**Content pattern:** "Why we chose MCP over REST for agent-to-ERP communication." / "Why GL journal entries over a native ESG endpoint."
**Audience:** CTOs, tech leads, solution architects, AI engineers
**Keywords:** MCP protocol, KYA standard, agent architecture, pgvector, edge AI, Firehorse
**CTA:** Climate Reporting Bundle (dws10.com/products/bundle.html)

### Pillar 8: Brain News — DWS IQ Platform (~80 posts)
**Architecture layer:** Brain (DWS IQ 6 — Agent Swarm Training & Orchestration)
**Focus:** Platform updates, new agent capabilities, compliance dashboard features, KYA governance releases
**Content pattern:** "DWS IQ now supports automatic CBAM quarterly reporting. Here's how it works."
**Audience:** Existing customers, technical evaluators, platform adopters
**Keywords:** DWS IQ update, compliance dashboard, agent training, platform release
**CTA:** DWS IQ Platform (dws10.com/products/dwsiq.html)

### Pillar 9: Body News — Firehorse Suite (~80 posts)
**Architecture layer:** Body (Firehorse — Forensic Telemetry, Reports, Automation, Content DMS, Omnichannel)
**Focus:** Firehorse module releases, automation workflows, report templates, content management, omnichannel marketing
**Content pattern:** "Firehorse Automation: new CSRD double materiality workflow saves 30 hours per quarter."
**Audience:** Operations teams, marketing teams, report consumers
**Keywords:** Firehorse automation, compliance reports, content DMS, omnichannel, ESG reporting
**CTA:** Firehorse products (dws10.com/buy)

### Pillar 10: Hands News — Lifetime Fleet & Edge AI (~80 posts)
**Architecture layer:** Hands (Lifetime Fleet — IoT/Robots for physical execution)
**Focus:** Edge AI hardware, NVIDIA ISV partnership, Jetson/Acer Veriton deployments, sovereign inference, IoT integration
**Content pattern:** "We deployed Qwen 72B on an Acer Veriton GN100. Here's the inference latency vs cloud."
**Audience:** Infrastructure teams, edge computing engineers, fleet managers
**Keywords:** edge AI, NVIDIA Jetson, sovereign inference, Lifetime Fleet, IoT compliance
**CTA:** Edge Node (dws10.com/products/edge-node.html)

## Rotation Pattern (10-Day Cycle)

Posts rotate through 10 pillars cyclically. Every 10 days covers all pillars.
A reader who discovers the blog gets exposed to the full breadth within 10 days.

| Day | Pillar | Layer |
|-----|--------|-------|
| 1, 11, 21, 31... | ERP Integration | Core |
| 2, 12, 22, 32... | Compliance Automation | Core |
| 3, 13, 23, 33... | Legal & Governance | Core |
| 4, 14, 24, 34... | Business News | News |
| 5, 15, 25, 35... | AI News | News |
| 6, 16, 26, 36... | Industry News | News |
| 7, 17, 27, 37... | KYA / Agent Architecture | Core |
| 8, 18, 28, 38... | Brain News (DWS IQ Platform) | Product |
| 9, 19, 29, 39... | Body News (Firehorse Suite) | Product |
| 10, 20, 30, 40... | Hands News (Fleet & Edge AI) | Product |

**Per pillar over 800 days: 80 posts each = 800 posts per language, 1,600 total**

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
- Transport: Amazon SES only (Resend permanently banned — LOCKED_DECISIONS LD-2026-008)

## LinkedIn Promotion

- 2-3 posts per week promoted to LinkedIn
- Format: hook paragraph + key insight + link + 3-5 hashtags
- Tag posts with linkedin: true in campaign tracker
- Focus on Pillar 1 (ERP Transition) and Pillar 2 (EU Compliance) for LinkedIn
