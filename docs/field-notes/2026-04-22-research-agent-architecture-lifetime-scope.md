# Field Note: Research Agent Architecture — Lifetime Scope Journal Multi-Channel Integration

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Claude Haiku 4.5) | Session: claude/obsidian-cli-integration-Agfxl | Date: 22.04.2026 | Changes: Initial creation - research agent design for 5-capability system integrating market research, blog, PhD, white papers, and video/journaling

Session Links & References:
  - Claude Code (claude/obsidian-cli-integration-Agfxl): https://github.com/blogtheristo/dws6
  - View on GitHub: https://github.com/blogtheristo/dws6/blob/main/docs/field-notes/2026-04-22-research-agent-architecture-lifetime-scope.md

Document Status:
  - Created: 22.04.2026
  - Last Modified: 22.04.2026
  - Language: English
  - Languages Available: English
  - Publication Status: ACTIVE
  - Document Type: Field Note / Architecture Design

Related Documents:
  - docs/field-notes/2026-04-22-obsidian-cli-claude-code-integration.md
  - DWS7_ROADMAP.md (PhD thesis planning)
  - DWS_MARKET_RESEARCH_STANDARD.md
  - Firehorse/ContentMS/ (content management)

***

## Ontology Tags

- **Geography:** Europe > Finland > Lifetime World Ecosystem
- **Sector:** Technology > Research > AI-Native Knowledge Management
- **Entities:** Professor Kari Smolander, Lifetime Scope Journal, DWS IQ 6/7, LinkedIn, YouTube (@LSJ_2026), onelifetime.world
- **Temporal Context:** 2026-Q2, PhD program under review, Multi-channel launch planned
- **Confidence:** High (derived from existing DWS7 roadmap + current capabilities)

---

## Executive Summary

The **Research Agent** is a multi-capability system that consolidates enterprise research output across five parallel channels: market research (monthly 4P/7P analysis), content distribution (blog + LinkedIn + YouTube + social), PhD thesis work, academic white papers, and video/journaling.

The system is powered by:
- **Obsidian vault** (via CLI) as the research knowledge hub
- **Claude Code agents** for content generation and analysis
- **Firehorse ContentMS** for content versioning and approval
- **Supabase** for market intelligence and PhD phase tracking
- **LinkedIn/YouTube APIs** for multi-channel distribution

This consolidation enables Risto Anton to:
1. Capture research once in Obsidian
2. Route insights to 4 destination channels simultaneously  
3. Track PhD thesis progress through structured phases
4. Generate monthly market competitive analysis (4P/7P)
5. Publish videos and journal entries without context-switching

---

## The Five Capabilities

### 1. Market Research — Monthly 4P/7P Analysis

**Cadence:** Monthly (automated weekly signals, manual analysis monthly)

**What it does:**
- Collects competitive intelligence on DWS IQ 6, Firehorse, and adjacent platforms
- Analyzes via **4Ps** (Product, Price, Place, Promotion) for Firehorse
- Analyzes via **7Ps** (+ People, Process, Physical Evidence) for DWS IQ 6 (service platform)
- Feeds gaps into product improvement proposals (PIPs)

**Current infrastructure:**
- `DWS_MARKET_RESEARCH_STANDARD.md` defines the weekly collection cycle
- Supabase: `market_intelligence` database with `competitors`, `competitor_products`, `market_signals` tables
- Weekly automation: scraping, API feeds, field notes collection

**Agent enhancement:**
```
Obsidian Vault (competitive intel notes)
    ↓ [Claude Code agent — monthly]
CSV analysis of 4P/7P
    ↓ [Agent analysis]
Market Research Report + PIPs
    ↓ [Publish to]
GitHub Issues [PIP] + Lifetime Scope blog entry
```

**Agents needed:**
- `market-research-analyzer` — Reads Obsidian competitive intelligence, generates 4P/7P matrix
- `pip-generator` — Converts insights into GitHub Issues with [PIP] label
- `blog-publisher` — Formats analysis as Lifetime Scope blog entry

---

### 2. Content Distribution — 4-Channel Blog System

**Channels:**
1. **Lifetime Scope Journal Blog** — https://onelifetime.world/blog (Supabase-powered, 767+ posts)
2. **LinkedIn Newsletter** — https://www.linkedin.com/newsletters/lifetime-scope-journal-monthly-7191306524177154048
3. **YouTube Channel** — @LSJ_2026 (Lifetime Scope Journal video)
4. **Social Media** — Repurposing for X (formerly Twitter), Instagram

**Current infrastructure:**
- `onelifetime.world/blog/` — Supabase-driven dynamic blog (index.html, post.html templates)
- `src/firehorse/linkedin-service.ts` — LinkedIn API integration
- `src/firehorse/linkedin-workflow.ts` — Automated LinkedIn DM workflows
- YouTube channel descriptor: `docs/Channels/@LSJ_2026_Youtube.md`

**Content pipeline:**
```
Obsidian Research Note (market research, product insights, PhD learnings)
    ↓ [Claude Code — content-formatter]
Lifetime Scope blog post (markdown)
    ↓ [Agent — multi-format]
├─ LinkedIn: 1,300-char summary + newsletter link
├─ YouTube: Video transcript/description (video created separately)
├─ Social: 280-char X thread, carousel for Instagram
└─ Blog: Full post with metadata (tags, categories, SEO)
    ↓ [Firehorse ContentMS approval]
Published across all 4 channels
```

**Agents needed:**
- `content-formatter` — Converts Obsidian notes to blog post markdown (SEO metadata, word count)
- `linkedin-publisher` — Formats for newsletter + LinkedIn Company page
- `social-adapter` — Creates short-form versions for X, Instagram, TikTok
- `video-coordinator` — Organizes video assets, manages YouTube description and captions

**Current limitations to address:**
- YouTube videos must be recorded separately (CLI doesn't do recording)
- LinkedIn API has rate limits (300 requests/min for publishing)
- Social media has platform-specific character/format limits

---

### 3. PhD Study Work — Structured Phase Tracking

**Status:** Under review to start. Professor Kari Smolander (likely LUT University) leading discussion.

**Target:**
- Doctoral dissertation on "Agentic AI for Autonomous Climate Compliance"
- Defense timeline: **Dec 2027**
- 6 planned papers/chapters covering:
  1. Foundation: Climate compliance regulatory landscape
  2. LWM architecture for industrial compliance
  3. Agentic AI (multi-agent orchestration with Temporal.io)
  4. Case study: DWS IQ 6 platform
  5. DWS IQ 7 evolution and lessons learned
  6. Full dissertation

**Current infrastructure:**
- DWS7_ROADMAP.md defines PhD phases (Q1-Q4 2026, Q1-Q4 2027)
- `docs/thesis/` — Existing multi-agent coordination work
- `docs/Metropolia/master-thesis/` — Foundation thesis (reference)
- Academy of Finland funding application: €150K (4 years)
- Business Finland: "Research to Business" track (up to €500K)

**Agent architecture for PhD work:**
```
Obsidian Vault (research notes, literature, experiments)
    ↓ [Claude Code — literature-analyzer]
Literature review section (per chapter)
    ↓ [Agent — synthesis]
Chapter draft with citations + references
    ↓ [Agent — peer-review-simulator]
Feedback on arguments + logical gaps
    ↓ [Human review with Prof. Smolander]
Chapter revision
    ↓ [Agent — formatting]
Publication-ready chapter (APA/IEEE format)
    ↓ [Publish to]
Academic conference (2-3 papers) + thesis repo
```

**Paper timeline:**
- **Q2 2026:** Paper 1 (Climate compliance landscape) → submission
- **Q3 2026:** Paper 2 (LWM architecture) + Paper 3 (Agentic AI) → dual submission
- **Q4 2026:** Paper 4 (DWS IQ 6 case study)
- **2027:** Papers 5-6 + dissertation compilation

**Agents needed:**
- `literature-synthesizer` — Reads Obsidian research notes, generates literature review sections
- `chapter-drafter` — Structures arguments, identifies gaps
- `academic-critic` — Simulates peer review (finds weak claims, suggests citations)
- `thesis-compiler` — Formats final dissertation (TOC, bibliography, cross-references)

---

### 4. White Papers — Academic & Product

**Two tracks:**

**Track A: Academic White Papers**
- Topics: AI safety, agentic systems, LWM orchestration
- Audience: Researchers, PhD programs, academic conferences
- Publication: arXiv, IEEE, ACM, JMLR
- Cadence: 2-3 per year (aligned with PhD chapter pipeline)

**Track B: Product White Papers**
- Topics: Firehorse features, DWS IQ 6 use cases, EU compliance
- Audience: Enterprise buyers, CFOs, compliance officers
- Publication: onelifetime.world/resources, dws10.com, LinkedIn
- Cadence: Monthly (one per major release or research finding)

**Agent architecture:**
```
Research insights (from market analysis, PhD work, product releases)
    ↓ [Claude Code — white-paper-generator]
Outline + key sections
    ↓ [Agent — executive-summary]
1-2 page executive brief
    ↓ [Agent — full-draft]
10-15 page white paper (with citations)
    ↓ [Firehorse ContentMS approval]
├─ PDF generation (pandoc, matching DWS_DOCUMENT_STANDARD.md)
├─ Landing page (onelifetime.world/white-papers/)
└─ Distribution (email, LinkedIn, blog)
```

**Agents needed:**
- `white-paper-generator` — Structures arguments, writes first draft
- `citation-manager` — Tracks academic vs. product sources, formats bibliography
- `pdf-renderer` — Converts to PDF with DWS branding (matches DWS_DOCUMENT_STANDARD.md Section 8)
- `distribution-coordinator` — Posts to blog, email list, LinkedIn, landing pages

---

### 5. Videos & Journaling — Lifetime Scope Media

**Video Types:**
1. **Research Journaling** — Weekly 5-10 min screencast of Obsidian vault, research progress
2. **Product Tutorials** — Firehorse features, DWS IQ 6 capabilities
3. **Thought Leadership** — 15-20 min essays on AI, climate, industrial compliance
4. **PhD Progress** — Quarterly thesis milestones, conference presentations

**Journaling Types:**
1. **Daily Obsidian Notes** — Research thoughts, discoveries, blockers (in vault)
2. **Weekly Reflections** — Meta-notes on research direction, emerging patterns
3. **Monthly Recap Video** — Summarizes month's research + videos + blog posts

**Current infrastructure:**
- YouTube: @LSJ_2026 channel (empty, ready to populate)
- Obsidian vault: Daily notes structure exists
- Recording tool: Claude Code can assist with scripting, not recording

**Agent architecture:**
```
Daily Obsidian notes (research, experiments, thoughts)
    ↓ [Claude Code — week-compiler]
Weekly research summary
    ↓ [Agent — script-writer]
Video script + talking points
    ↓ [Human recording]
Raw video file
    ↓ [Agent — editor-coordinator]
├─ Generate captions (can use Claude + Whisper API)
├─ Create YouTube description + SEO metadata
├─ Suggest thumbnail text
└─ Tag and organize
    ↓ [Publish to]
YouTube + cross-post clips to social
```

**Agents needed:**
- `journal-compiler` — Reads weekly Obsidian entries, generates digest
- `script-writer` — Converts research digest to video script (conversational, ~10-15 min)
- `caption-generator` — Uses Whisper API to transcribe, Claude to improve captions
- `metadata-creator` — YouTube descriptions, video tags, thumbnail copy
- `social-clipper` — Extracts key moments from videos, creates 30-60 sec clips for TikTok/Instagram

---

## System Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                    RESEARCH AGENT SYSTEM (dws7)                   │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│                    OBSIDIAN VAULT (Research Hub)                 │
│                  - Market research notes                          │
│                  - Competitive intelligence                       │
│                  - PhD research + literature review               │
│                  - Daily journaling                               │
│                  - Ideas + blockers                               │
│                         │                                         │
│                         │ (Obsidian CLI queries)                  │
│                         ▼                                         │
│   ┌──────────────────────────────────────────────────────────┐   │
│   │        CLAUDE CODE AGENTS (5 Parallel Threads)           │   │
│   ├──────────────────────────────────────────────────────────┤   │
│   │                                                           │   │
│   │  1. market-research-analyzer    → 4P/7P monthly          │   │
│   │  2. content-formatter           → blog + 4 channels      │   │
│   │  3. chapter-drafter             → PhD chapters           │   │
│   │  4. white-paper-generator       → academic + product     │   │
│   │  5. script-writer + caption-gen → videos + captions      │   │
│   │                                                           │   │
│   │         All agents share:                                │   │
│   │         - Obsidian CLI for research context              │   │
│   │         - Firehorse ContentMS for approval               │   │
│   │         - DWS Document Standard for formatting           │   │
│   │                                                           │   │
│   └──────────────────────────────────────────────────────────┘   │
│         │              │              │              │            │
│         ▼              ▼              ▼              ▼            │
│   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐    │
│   │ Market   │   │ Blog +   │   │   PhD    │   │  White   │    │
│   │ Research │   │ 4 Social │   │  Thesis  │   │ Papers + │    │
│   │ Reports  │   │ Channels │   │ Chapters │   │ Videos   │    │
│   │ (PIPs)   │   │          │   │          │   │          │    │
│   └────┬─────┘   └────┬─────┘   └────┬─────┘   └────┬─────┘    │
│        │              │              │              │            │
│        └──────────────┼──────────────┼──────────────┘            │
│                       │ [Published]  │                           │
│                       ▼              ▼                           │
│        ┌─────────────────────────────────────────┐              │
│        │  DISTRIBUTION CHANNELS                  │              │
│        ├─────────────────────────────────────────┤              │
│        │ • GitHub Issues [PIP]                   │              │
│        │ • onelifetime.world/blog                │              │
│        │ • LinkedIn Newsletter + Company Page    │              │
│        │ • YouTube (@LSJ_2026)                   │              │
│        │ • Social Media (X, Instagram, TikTok)   │              │
│        │ • Academic publishers (arXiv, IEEE)     │              │
│        │ • Conference submissions                │              │
│        └─────────────────────────────────────────┘              │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## Implementation Roadmap

### Phase 1: Foundation (Q2 2026 — May-June)

**Goals:**
- Set up Obsidian vault structure for research capture
- Enable Obsidian CLI integration with Claude Code
- Build first 2 agents (market-research-analyzer, content-formatter)

**Tasks:**
- [ ] Design Obsidian vault ontology (tags, properties, folder structure)
- [ ] Configure Obsidian properties for: research-type, confidence, status, publish-channels
- [ ] Set up Obsidian CLI with Claude Code (test queries on vault)
- [ ] Implement market-research-analyzer agent
- [ ] Implement content-formatter agent (blog post generation)
- [ ] Publish first 2 blog entries via system
- [ ] Set up YouTube channel (@LSJ_2026) with intro video

**Resources:**
- `docs/field-notes/2026-04-22-obsidian-cli-claude-code-integration.md` (reference)
- `DWS_MARKET_RESEARCH_STANDARD.md` (market analysis process)
- `Firehorse/ContentMS/` (content templates)

### Phase 2: Expansion (Q3 2026 — July-Sept)

**Goals:**
- Add PhD thesis tracking
- Implement white-paper pipeline
- Begin weekly video journaling

**Tasks:**
- [ ] Formalize PhD agreement with Prof. Smolander + LUT University
- [ ] Structure DWS7 roadmap into PhD chapter template
- [ ] Implement chapter-drafter and thesis-compiler agents
- [ ] Build white-paper-generator agent
- [ ] Record first 4 research journaling videos
- [ ] Set up LinkedIn Newsletter automation (dual publication: blog → LinkedIn)

**Resources:**
- `DWS7_ROADMAP.md` (phases and timeline)
- `docs/thesis/` (multi-agent coordination foundation)

### Phase 3: Maturity (Q4 2026-Q1 2027)

**Goals:**
- Full 5-agent system operational
- PhD papers submitted (2-3 simultaneous)
- Monthly market research + white paper cadence

**Tasks:**
- [ ] Complete Phase 1 + Phase 2 tasks
- [ ] Implement social-media-adapter + video-clipper agents
- [ ] Formalize monthly market research report schedule
- [ ] Submit Paper 1 (climate compliance landscape)
- [ ] Launch regular YouTube content schedule (biweekly)
- [ ] Monitor agent efficiency, token costs, output quality

---

## Dependencies & Integrations

| Dependency | Status | Notes |
|-----------|--------|-------|
| **Obsidian CLI** | ✅ Available | Tested on 4,663-file vault; ready for integration |
| **Claude Code + Agents** | ✅ Ready | Subagent + Agent Teams architecture available |
| **Firehorse ContentMS** | ✅ Active | Content approval workflows, templates |
| **LinkedIn API** | ✅ Integrated | linkedin-service.ts, linkedin-workflow.ts exist |
| **YouTube Data API** | ⚠️ Setup needed | Channel exists (@LSJ_2026), API key needed |
| **Supabase DB** | ✅ Active | market_intelligence, PhD tracking tables ready |
| **Prof. Kari Smolander** | ⏳ Under review | PhD advisor agreement to be formalized |
| **Academy of Finland** | ⏳ Pending | PhD funding application, €150K (4 years) |
| **LUT University** | ⏳ Pending | Doctoral program enrollment |

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| **PhD program delays** | Medium | High | Establish timeline with Prof. Smolander ASAP |
| **AI agent hallucination in white papers** | Medium | High | Mandatory human review before publication |
| **LinkedIn rate limits** | Low | Medium | Implement queue + backoff; use scheduling |
| **Video production bottleneck** | High | Medium | Pre-script all videos; consider template recordings |
| **Obsidian vault complexity** | Medium | Low | Start with simple structure; iterate based on use |
| **Multi-channel inconsistency** | Medium | Low | Use master template in vault; agents adapt it |

---

## Success Metrics (First 6 Months)

| Metric | Target | Tracking |
|--------|--------|----------|
| **Field notes captured** | 60+ (weekly) | Obsidian vault count |
| **Blog posts published** | 24 (2/month) | onelifetime.world analytics |
| **LinkedIn newsletter subscribers** | 1,000+ | LinkedIn newsletter dashboard |
| **YouTube videos uploaded** | 12 (biweekly) | YouTube Studio analytics |
| **Market research reports** | 6 (monthly) | GitHub Issues [PIP] count |
| **PhD chapter drafts** | 2 (by end Q3) | DWS7 roadmap progress |
| **Agent efficiency (tokens/task)** | <100K | MCP Hub metrics |

---

## Related Field Notes

- `2026-04-22-obsidian-cli-claude-code-integration.md` — Knowledge vault integration enabler
- `2026-02-04-qwen3-coder-next-agentic-llm.md` — Local LLM option for edge research
- `2026-02-05-claude-code-agent-teams-vs-subagents.md` — Architecture decision for parallel agents

## Related Core Artifacts

- **Pending:** `ART-2026-XXX-multi-channel-content-distribution-architecture.md`
- **Pending:** `ART-2026-XXX-phd-thesis-integration-pattern.md`
- **Pending:** `ART-2026-XXX-market-research-to-product-pipeline.md`

---

## References

1. DWS Market Research Standard. Section 2: Competitive Intelligence Architecture.
2. DWS7 Roadmap. PhD Thesis Output / Tohtorinväitöskirjan tuotos (sections 611-679).
3. Firehorse ContentMS: Email templates, approval workflows.
4. Lifetime Scope Journal: LinkedIn Newsletter, YouTube Channel @LSJ_2026.
5. Obsidian CLI Testing Results: Field note 2026-04-22.
6. Claude Code Agent Teams Documentation: Multi-agent orchestration patterns.

---

## Next Steps

1. **This week:** Schedule meeting with Prof. Kari Smolander to formalize PhD collaboration
2. **Next 2 weeks:** Implement Phase 1 agents (market-research-analyzer, content-formatter)
3. **End of month:** Publish first 5 blog posts via automated system
4. **By June 30:** Complete Phase 1 + begin Phase 2

---

**Author:** DWS Research Agent Design Team  
**Review Status:** Pending team validation + Prof. Smolander review  
**Next Review:** 2026-05-22 (one month)
