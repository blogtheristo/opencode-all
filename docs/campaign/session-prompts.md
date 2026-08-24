# 800-Day Campaign — Session Delivery Plan

VERSION AND AGENT HISTORY
- Version: 1.0
- Date: 2026-03-15
- Agent: Claude Opus 4.6
- Action: Created session delivery plan for 800 bilingual blog posts

## Launch Date

**Day 001 Launch: Monday, March 16, 2026**
**Day 800 End: Saturday, May 25, 2028**

## Current Inventory (Day 0)

| Language | Posts Done | Remaining |
|----------|-----------|-----------|
| English  | 22 (Day 001-021 + market signal) | 778 |
| Finnish  | 11 (Day 001-004, 008-010, 015-017 + market signal) | 789 |

**Total done: 33 / 1,600 (2%)**

## Data Sources for Content

### 1. Git Commit Summaries (1,821 commits since 2024)
Mine with: `git log --oneline --since="2024-01-01" | grep -i "<keyword>"`

Key folders → content pillars:
- `src/integrations/erp/` → Pillar 1 (ERP Integration)
- `src/agents/`, `src/firehorse/` → Pillar 2 (Compliance Automation)
- `supabase/migrations/`, `docs/` → Pillar 3 (Legal & Governance)
- `src/mcp/`, `mcp-servers/` → Pillar 7 (KYA / Agent Architecture)
- `dws6.com/dashboard/` → Pillar 8 (Brain / DWS IQ Platform)
- `Firehorse/` → Pillar 9 (Body / Firehorse Suite)
- `scripts/`, IoT references → Pillar 10 (Hands / Fleet & Edge)

### 2. PR Summaries (525 merge commits)
Mine with: `git log --merges --oneline --since="2024-01-01" | grep -i "<keyword>"`

Each PR is a technical decision with business context. Pattern:
"We had to decide between X and Y. Here's why we chose X."

### 3. Autoresearch Pipeline
- Competitor pricing from DWS autoresearch agents
- Market signals from industry feeds
- EU regulation updates (CSRD, EPBD, ETS, CBAM timeline data)
- Nordic industry benchmarks (Eurostat, EEA, Statistics Finland)

### 4. OpenClawd / DWS IQ Agents
- Compliance scoring outputs → real data for Pillar 2 posts
- Carbon calculations → real data for Pillar 6 (Industry) posts
- Agent discovery results → content for Pillar 5 (AI News)
- SiteSense safety scores → Pillar 6 construction content
- Material Oracle LCA data → Pillar 6 manufacturing content

## 10-Day Rotation (Pillar Assignment)

| Day mod 10 | Pillar | Data Sources |
|------------|--------|-------------|
| 1 | ERP Integration | git: `src/integrations/erp/`, PR: SAP/Visma/IFS commits |
| 2 | Compliance Automation | git: `src/agents/`, autoresearch: CSRD/ETS data |
| 3 | Legal & Governance | git: `supabase/migrations/`, docs: KYA standard |
| 4 | Business News | autoresearch: M&A, market data, Nordic industry |
| 5 | AI News | git: `src/mcp/`, PR: model/agent decisions, OpenClawd |
| 6 | Industry News | autoresearch: sector data, OpenClawd: carbon calcs |
| 7 | KYA / Agent Architecture | git: `mcp-servers/`, PR: architecture decisions |
| 8 | Brain (DWS IQ Platform) | git: `dws6.com/dashboard/`, PR: platform features |
| 9 | Body (Firehorse Suite) | git: `Firehorse/`, PR: automation/report features |
| 0 | Hands (Fleet & Edge AI) | git: IoT/edge commits, autoresearch: NVIDIA updates |

## Session Delivery Plan

### Session Structure
- Each session produces **21 posts** (EN + FI = 42 files)
- That covers **21 days** of the campaign (3 weeks)
- Total sessions needed: 800 / 21 = **38 sessions** + catchup for existing gaps

### Batch Prompts

---

### SESSION 1 — Days 022-042 (Already done: Days 001-021)
**FI Catchup + New batch**

```
CONTINUE 800-DAY CAMPAIGN — SESSION 1
Branch: claude/bilingual-marketing-campaign-SCC4g
Start: git pull origin claude/bilingual-marketing-campaign-SCC4g

TASK 1: Complete missing Finnish translations (Days 005-007, 011-014, 018-021)
- Read each EN post, create matching FI version
- Sync to landing-pages/

TASK 2: Create Days 022-042 (EN + FI = 42 files)
Pillar rotation (day mod 10):
- Day 022: Compliance Automation
- Day 023: Legal & Governance
- Day 024: Business News
- Day 025: AI News
- Day 026: Industry News
- Day 027: KYA / Agent Architecture
- Day 028: Brain (DWS IQ Platform)
- Day 029: Body (Firehorse Suite)
- Day 030: Hands (Fleet & Edge AI)
- Day 031: ERP Integration
- Day 032: Compliance Automation
- Day 033: Legal & Governance
- Day 034: Business News
- Day 035: AI News
- Day 036: Industry News
- Day 037: KYA / Agent Architecture
- Day 038: Brain (DWS IQ Platform)
- Day 039: Body (Firehorse Suite)
- Day 040: Hands (Fleet & Edge AI)
- Day 041: ERP Integration
- Day 042: Compliance Automation

DATA INTEGRATION:
- Run: git log --oneline --since="2024-01-01" | grep -i "<pillar keyword>"
- Pull relevant commit messages and PR descriptions as content seeds
- Use /compliance-check for Pillar 2 posts (real compliance data)
- Use /carbon-analysis for Pillar 6 posts (real LCA data)
- Use /discover-agents for Pillar 5/7/8 posts (agent capabilities)
- Reference autoresearch data: competitor pricing, market signals

EDITORIAL STANDARDS:
- Minimum 1,500 words per post
- Oxford notation citations with links (min 1 per post)
- Cross-links to other campaign posts + DWS product pages
- 10-pillar ontology tags at bottom
- Like button + email feedback section
- hreflang EN↔FI cross-references
- Schema.org Article JSON-LD
- Honest competitor acknowledgment where relevant

FILE NAMING:
- EN: onelifetime.world/posts/en/day-NNN-slug.html
- FI: onelifetime.world/posts/fi/day-NNN-slug-fi.html
- Sync BOTH to landing-pages/onelifetime-world/posts/{en,fi}/

COMMIT + PUSH after each batch of 7 posts (weekly chunks).
```

---

### SESSION 2 — Days 043-063

```
CONTINUE 800-DAY CAMPAIGN — SESSION 2
Branch: claude/bilingual-marketing-campaign-SCC4g
Start: git pull origin claude/bilingual-marketing-campaign-SCC4g

Create Days 043-063 (EN + FI = 42 files)
Pillar rotation: Day 043 = Legal & Governance (43 mod 10 = 3)

DATA SEEDS — mine these commits:
git log --oneline --all --since="2024-01-01" | grep -iE "erp|sap|visma|ifs|monitor"
git log --oneline --all --since="2024-01-01" | grep -iE "compliance|csrd|epbd|ets|cbam"
git log --oneline --all --since="2024-01-01" | grep -iE "legal|governance|kya|rls|security"
git log --oneline --all --since="2024-01-01" | grep -iE "mcp|agent|swarm|orchestr"
git log --oneline --all --since="2024-01-01" | grep -iE "firehorse|report|automation|content"
git log --oneline --all --since="2024-01-01" | grep -iE "edge|jetson|iot|fleet|nvidia"

AGENT DATA:
- /compliance-check steel — for CBAM/ETS posts
- /carbon-analysis "concrete 1000kg, steel 500kg" — for construction posts
- /discover-agents compliance — for AI agent posts

Same editorial standards as Session 1.
Commit + push after each batch of 7.
```

---

### SESSION TEMPLATE (Sessions 3-38)

```
CONTINUE 800-DAY CAMPAIGN — SESSION {{N}}
Branch: claude/bilingual-marketing-campaign-SCC4g
Start: git pull origin claude/bilingual-marketing-campaign-SCC4g

Create Days {{START}}-{{END}} (EN + FI = 42 files)
First day pillar: {{START}} mod 10 → Pillar {{PILLAR}}

PHASE: {{1|2|3|4}} ({{Foundation|Depth|Engagement|Authority}})
- Phase 1 (Days 1-100): Foundation — core SEO, establish authority
- Phase 2 (Days 101-300): Depth — case studies, comparisons, git history deep-dives
- Phase 3 (Days 301-500): Engagement — interactive, webinar recaps, customer stories
- Phase 4 (Days 501-800): Authority — thought leadership, predictions, regulation updates

DATA INTEGRATION:
1. Git commits: git log --oneline --since="2024-01-01" | grep -i "<keyword>"
2. PR summaries: git log --merges --oneline | grep -i "<keyword>"
3. Autoresearch: market data, competitor pricing, EU regulation timelines
4. OpenClawd agents: /compliance-check, /carbon-analysis, /discover-agents
5. Phase 2+: Turn specific PRs/commits into "Behind the Build" stories

STANDARDS: 1,500+ words, Oxford citations, cross-links, ontology tags,
like button, feedback section, hreflang, Schema.org, honest competition.

FILE NAMING: day-NNN-slug.html (EN) + day-NNN-slug.html (FI)
Sync to landing-pages/. Commit + push after each 7-post batch.
```

## Full Session Schedule

| Session | Days | Dates (2026-2028) | Phase | Posts |
|---------|------|-------------------|-------|-------|
| 0 (done) | 001-021 | Mar 16 – Apr 5, 2026 | Phase 1 | 22 EN, 11 FI |
| 1 | 022-042 + FI catchup | Apr 6 – Apr 26 | Phase 1 | 42 + 20 FI |
| 2 | 043-063 | Apr 27 – May 17 | Phase 1 | 42 |
| 3 | 064-084 | May 18 – Jun 7 | Phase 1 | 42 |
| 4 | 085-100 | Jun 8 – Jun 23 | Phase 1 end | 32 |
| 5 | 101-121 | Jun 24 – Jul 14 | Phase 2 | 42 |
| 6 | 122-142 | Jul 15 – Aug 4 | Phase 2 | 42 |
| 7 | 143-163 | Aug 5 – Aug 25 | Phase 2 | 42 |
| 8 | 164-184 | Aug 26 – Sep 15 | Phase 2 | 42 |
| 9 | 185-205 | Sep 16 – Oct 6 | Phase 2 | 42 |
| 10 | 206-226 | Oct 7 – Oct 27 | Phase 2 | 42 |
| 11 | 227-247 | Oct 28 – Nov 17 | Phase 2 | 42 |
| 12 | 248-268 | Nov 18 – Dec 8 | Phase 2 | 42 |
| 13 | 269-289 | Dec 9 – Dec 29 | Phase 2 | 42 |
| 14 | 290-300 | Dec 30 – Jan 8, 2027 | Phase 2 end | 22 |
| 15 | 301-321 | Jan 9 – Jan 29, 2027 | Phase 3 | 42 |
| 16 | 322-342 | Jan 30 – Feb 19 | Phase 3 | 42 |
| 17 | 343-363 | Feb 20 – Mar 12 | Phase 3 | 42 |
| 18 | 364-384 | Mar 13 – Apr 2 | Phase 3 | 42 |
| 19 | 385-405 | Apr 3 – Apr 23 | Phase 3 | 42 |
| 20 | 406-426 | Apr 24 – May 14 | Phase 3 | 42 |
| 21 | 427-447 | May 15 – Jun 4 | Phase 3 | 42 |
| 22 | 448-468 | Jun 5 – Jun 25 | Phase 3 | 42 |
| 23 | 469-489 | Jun 26 – Jul 16 | Phase 3 | 42 |
| 24 | 490-500 | Jul 17 – Jul 27 | Phase 3 end | 22 |
| 25 | 501-521 | Jul 28 – Aug 17 | Phase 4 | 42 |
| 26 | 522-542 | Aug 18 – Sep 7 | Phase 4 | 42 |
| 27 | 543-563 | Sep 8 – Sep 28 | Phase 4 | 42 |
| 28 | 564-584 | Sep 29 – Oct 19 | Phase 4 | 42 |
| 29 | 585-605 | Oct 20 – Nov 9 | Phase 4 | 42 |
| 30 | 606-626 | Nov 10 – Nov 30 | Phase 4 | 42 |
| 31 | 627-647 | Dec 1 – Dec 21 | Phase 4 | 42 |
| 32 | 648-668 | Dec 22 – Jan 11, 2028 | Phase 4 | 42 |
| 33 | 669-689 | Jan 12 – Feb 1 | Phase 4 | 42 |
| 34 | 690-710 | Feb 2 – Feb 22 | Phase 4 | 42 |
| 35 | 711-731 | Feb 23 – Mar 14 | Phase 4 | 42 |
| 36 | 732-752 | Mar 15 – Apr 4 | Phase 4 | 42 |
| 37 | 753-773 | Apr 5 – Apr 25 | Phase 4 | 42 |
| 38 | 774-800 | Apr 26 – May 25 | Phase 4 FINAL | 54 |

**Total: 38 sessions × ~42 posts = 1,600 posts (800 EN + 800 FI)**

## Commit/PR Data Mining Guide

### How to Extract Content Seeds

```bash
# ERP Integration stories
git log --oneline --all | grep -iE "erp|sap|visma|ifs|monitor|dynamics|jeeves"

# Compliance engineering decisions
git log --oneline --all | grep -iE "compliance|csrd|epbd|ets|cbam|fit.for.55"

# Security & governance decisions
git log --oneline --all | grep -iE "rls|security|kya|governance|audit|gdpr|cloud.act"

# MCP & agent architecture
git log --oneline --all | grep -iE "mcp|agent|swarm|orchestr|tool|skill"

# Firehorse product evolution
git log --oneline --all | grep -iE "firehorse|report|automation|omnichannel|content.dms"

# Edge AI & fleet
git log --oneline --all | grep -iE "edge|jetson|nvidia|iot|fleet|acer|veriton"

# Database & infrastructure
git log --oneline --all | grep -iE "supabase|postgres|migration|pgvector|sovereign"
```

### PR Deep-Dive (for "Behind the Build" posts — Phase 2+)
```bash
# Get PR with full description
git log --merges --format="%H %s" | head -20

# Read specific PR commit details
git show <commit-hash> --stat
```

### OpenClawd Agent Data Integration
```
# Run these skills to get real data for posts:
/compliance-check <industry>     → Pillar 2 (Compliance) posts
/carbon-analysis <materials>     → Pillar 6 (Industry) posts
/discover-agents <capability>    → Pillar 5, 7, 8 posts
/site-safety <conditions>        → Pillar 6 (Construction) posts
/sovereignty-assess              → Pillar 3 (Legal) posts
```

### Autoresearch Data
- Competitor pricing: Pull from DWS autoresearch pipeline
- Market signals: Nordic ERP M&A, Visma deal updates
- Regulation timelines: EU Commission published schedules
- Industry benchmarks: Eurostat, EEA, Statistics Finland, Tilastokeskus
