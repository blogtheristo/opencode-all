# SEO Sales Agent Pipeline — Agent Specification

***

# VERSION AND AGENT HISTORY

Version: 1.2

Sessions & Modifications:

- Version: 1.2 | Tool: Claude Code (Sonnet 5) | Session: claude/sales-outreach-supermetrics-zr3kmb | Date: 31.07.2026 | Changes: Merged PR #1548 onto main (rebase/merge + build fix). Restored `***` VERSION AND AGENT HISTORY delimiters (the PR had swapped them for `---`, which breaks Pandoc's YAML front-matter parsing per the Markdown Delimiter Rule). No content change beyond the v1.1 entry below.
- Version: 1.1 | Tool: Claude Code (Sonnet 5) | Session: claude/sales-outreach-supermetrics-zr3kmb | Date: 04.07.2026 | Changes: §4 — replaced the bespoke Google Search Console + GA4 + DataForSEO integration plan with the Supermetrics MCP connector (one auth flow across all three). Added `src/integrations/supermetrics/transform.ts` (deterministic row normalization, unit tested) and the `supermetrics-seo-sync` skill pack that performs the P0 instrumentation step end-to-end.
- Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/seo-sales-agent-pipeline-7et5F | Date: 20.02.2026 | Changes: Initial specification — 5 SEO sales agents with input/output contracts, orchestration architecture, integration points

Session Links & References:

- Claude Code (claude/seo-sales-agent-pipeline-7et5F): https://github.com/blogtheristo/dws6/commits/claude/seo-sales-agent-pipeline-7et5F

Document Status:

- Created: 20.02.2026
- Last Modified: 31.07.2026
- Language: EN
- Languages Available: EN
- Publication Status: ACTIVE

***

**Effective Date:** February 2026
**Scope:** DWS IQ 6 SEO-to-Sales pipeline across dws10.com, dws6.com, onelifetime.world
**Maintained by:** Product Strategy
**Depends on:** `DWS_MARKET_RESEARCH_STANDARD.md`, `DWS_BRAND_STANDARD.md`, `AGENTS.md`

---

## 1. Overview

This specification defines five agents that form a continuous SEO-to-Sales pipeline for DWS IQ 6. Unlike traditional SEO campaigns (6–12 week waterfall), these agents operate as a real-time pipeline, treating SEO signals as intent data that feeds directly into the sales process.

### Architecture

```
┌─────────────────────────────────────────────────────────┐
│              INTENT SIGNAL COLLECTION                   │
│  Search Console → Keyword Agent → ICP Matching         │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│              CONTENT AGENT LAYER                        │
│  Competitor Agent → Content Brief Agent → SEO Audit    │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│              SALES ACTIVATION LAYER                     │
│  Lead Scoring → Outreach Sequencer → CRM Write         │
└─────────────────────────────────────────────────────────┘
```

### Integration with Existing Agent System

All SEO agents extend `BaseAgent` from `src/agents/base.agent.ts` and follow the existing contract:

- **Input:** `AgentContext` + agent-specific `Record<string, unknown>`
- **Output:** `AgentResponse` with `confidence`, `reasoning`, `recommendations`
- **Logging:** Supabase `agent_executions` table
- **LLM:** Groq API via `callLLM()` with graceful fallback

---

## 2. Agent Specifications

### 2.1 Keyword Intent Agent (`keyword-intent`)

**Purpose:** Classify search queries into funnel stages, identify quick-win keywords (rank 8–15), and produce a prioritized keyword queue aligned to DWS ICP.

**Execution Cadence:** Nightly (via node-cron)

#### Input Contract

```typescript
interface KeywordIntentInput {
  /** Google Search Console data for the reporting period */
  searchConsoleData: {
    queries: Array<{
      query: string;
      clicks: number;
      impressions: number;
      ctr: number;
      position: number;
    }>;
    dateRange: { start: string; end: string };
    siteUrl: string; // e.g., "https://dws10.com"
  };
  /** Optional: external keyword data from DataForSEO */
  externalKeywords?: Array<{
    keyword: string;
    searchVolume: number;
    difficulty: number;
    cpc: number;
    trend: "rising" | "stable" | "declining";
  }>;
  /** ICP definition for relevance scoring */
  icpProfile: {
    industries: string[]; // e.g., ["construction", "manufacturing", "logistics"]
    companySize: string; // e.g., "50-5000 employees"
    regions: string[]; // e.g., ["nordics", "dach", "eu"]
    painPoints: string[]; // e.g., ["csrd-reporting", "ets-compliance"]
    regulations: string[]; // e.g., ["fit-for-55", "csrd", "nis2"]
  };
}
```

#### Output Contract

```typescript
interface KeywordIntentOutput {
  /** Prioritized keyword queue, sorted by composite score */
  priorityQueue: Array<{
    keyword: string;
    funnelStage: "tofu" | "mofu" | "bofu";
    currentPosition: number | null;
    searchVolume: number;
    difficulty: number;
    icpRelevance: number; // 0-1
    quickWin: boolean; // true if position 8-15
    compositeScore: number; // weighted aggregate
    cluster: string; // e.g., "nis2-compliance", "construction-carbon"
    suggestedContentType: "blog" | "landing-page" | "case-study" | "product-page" | "comparison";
  }>;
  /** Funnel stage distribution summary */
  funnelDistribution: {
    tofu: { count: number; avgPosition: number };
    mofu: { count: number; avgPosition: number };
    bofu: { count: number; avgPosition: number };
  };
  /** Quick-win opportunities (rank 8-15 with high volume) */
  quickWins: Array<{
    keyword: string;
    currentPosition: number;
    estimatedClicksGain: number;
    effort: "low" | "medium" | "high";
  }>;
  /** Keyword clusters grouped by topic */
  clusters: Record<string, string[]>;
}
```

#### Classification Rules

| Signal           | TOFU                           | MOFU                                 | BOFU                                       |
| ---------------- | ------------------------------ | ------------------------------------ | ------------------------------------------ |
| Query contains   | "what is", "guide", "overview" | "vs", "comparison", "best", "how to" | "pricing", "demo", "buy", "implementation" |
| Regulatory terms | General regulation name        | Specific article/requirement         | Compliance tool + regulation               |
| Example          | "EU AI Act overview"           | "CSRD vs GRI reporting"              | "CSRD reporting automation pricing"        |

---

### 2.2 Competitor Surveillance Agent (`competitor-surveillance`)

**Purpose:** Monitor competitor websites, detect content changes, new pages, pricing shifts, and backlink growth. Generate content gap alerts.

**Execution Cadence:** Weekly (Sunday night)

#### Input Contract

```typescript
interface CompetitorSurveillanceInput {
  /** Competitor registry from Supabase competitors table */
  competitors: Array<{
    id: string;
    name: string;
    domain: string;
    category: "direct" | "indirect" | "adjacent" | "substitute";
    trackingUrls: string[]; // specific pages to monitor
    lastCrawlDate: string;
    lastCrawlHash: string; // content hash for change detection
  }>;
  /** Our current content inventory */
  ownContent: Array<{
    url: string;
    title: string;
    keywords: string[];
    lastUpdated: string;
    wordCount: number;
  }>;
  /** Keyword clusters we're targeting (from Keyword Intent Agent) */
  targetClusters: Record<string, string[]>;
}
```

#### Output Contract

```typescript
interface CompetitorSurveillanceOutput {
  /** Detected changes per competitor */
  changes: Array<{
    competitorId: string;
    competitorName: string;
    changeType: "new-page" | "content-update" | "pricing-change" | "meta-change" | "new-feature";
    url: string;
    summary: string;
    detectedAt: string;
    severity: "low" | "medium" | "high";
    contentHash: string;
  }>;
  /** Content gaps — topics competitors cover that we don't */
  contentGaps: Array<{
    topic: string;
    competitorsCovering: string[];
    estimatedSearchVolume: number;
    relevanceToIcp: number; // 0-1
    suggestedAction: "create-new" | "expand-existing" | "ignore";
    relatedCluster: string;
  }>;
  /** Pricing intelligence */
  pricingChanges: Array<{
    competitorId: string;
    product: string;
    previousPrice: string;
    currentPrice: string;
    changePercent: number;
    detectedAt: string;
  }>;
  /** Backlink growth alerts */
  backlinkAlerts: Array<{
    competitorId: string;
    newBacklinks: number;
    topReferringDomains: string[];
    estimatedDomainAuthority: number;
  }>;
}
```

#### Competitor Registry (Default)

Per `DWS_MARKET_RESEARCH_STANDARD.md`, the default competitor set:

| Competitor   | Category | Domain       | Focus              |
| ------------ | -------- | ------------ | ------------------ |
| Boardy.ai    | Direct   | boardy.ai    | AI networking      |
| Normative.io | Direct   | normative.io | Carbon accounting  |
| Persefoni    | Direct   | persefoni.ai | Climate management |
| Sweep        | Indirect | sweep.net    | Carbon management  |
| Plan A       | Indirect | plana.earth  | Decarbonization    |

---

### 2.3 Content Brief & Draft Agent (`content-brief`)

**Purpose:** Generate structured content briefs and first drafts using keyword data, competitor analysis, and LWM domain knowledge as RAG context.

**Execution Cadence:** On-demand (triggered by Keyword Agent or Competitor Agent findings)

#### Input Contract

```typescript
interface ContentBriefInput {
  /** Target keyword from priority queue */
  targetKeyword: {
    keyword: string;
    funnelStage: "tofu" | "mofu" | "bofu";
    searchVolume: number;
    cluster: string;
    suggestedContentType: "blog" | "landing-page" | "case-study" | "product-page" | "comparison";
  };
  /** Competitor content for this keyword (from Surveillance Agent) */
  competitorContent?: Array<{
    competitorName: string;
    url: string;
    title: string;
    headings: string[];
    wordCount: number;
    keyTakeaways: string[];
  }>;
  /** LWM context — regulatory domain knowledge */
  lwmContext: {
    /** Relevant regulatory articles/sections */
    regulations: Array<{
      name: string; // e.g., "CSRD"
      relevantArticles: string[];
      keyRequirements: string[];
    }>;
    /** Industry-specific context */
    industries: Array<{
      name: string;
      complianceRequirements: string[];
      dwsSolutions: string[];
    }>;
    /** Field notes relevant to this topic */
    fieldNotes?: Array<{
      date: string;
      insight: string;
      source: string;
    }>;
  };
  /** DWS products to reference in content */
  relevantProducts: Array<{
    name: string;
    sku: string;
    price: string;
    features: string[];
    ctaUrl: string;
  }>;
}
```

#### Output Contract

```typescript
interface ContentBriefOutput {
  /** Structured content brief */
  brief: {
    title: string;
    metaDescription: string; // max 160 chars
    targetKeyword: string;
    secondaryKeywords: string[];
    funnelStage: string;
    contentType: string;
    targetWordCount: number;
    outline: Array<{
      heading: string; // H2/H3
      level: 2 | 3;
      keyPoints: string[];
      regulatoryReferences: string[];
      wordCountTarget: number;
    }>;
    internalLinks: Array<{
      anchorText: string;
      targetUrl: string;
      context: string;
    }>;
    ctaPlacement: Array<{
      position: "intro" | "mid" | "conclusion";
      type: "demo-request" | "free-trial" | "download" | "contact";
      product: string;
      text: string;
    }>;
    schemaMarkup: {
      type: "Article" | "HowTo" | "FAQ" | "Product";
      properties: Record<string, string>;
    };
  };
  /** First draft of the content */
  draft: {
    html: string;
    markdown: string;
    wordCount: number;
    readabilityScore: number; // Flesch-Kincaid
    keywordDensity: number; // target keyword frequency
  };
  /** Differentiation notes — what makes this unique vs competitors */
  differentiators: string[];
}
```

#### Content Differentiation Rules

1. **Regulatory depth** — every article must reference specific EU regulation articles (not generic "compliance" language)
2. **Industry specificity** — use terminology from `16-INDUSTRIES.md` (e.g., "embodied carbon per EN 15978", not "carbon footprint")
3. **LWM authority** — cite DWS's 15,000+ regulation knowledge base as credibility signal
4. **Product integration** — naturally reference DWS products with pricing (transparent, not salesy)
5. **Sovereignty positioning** — EU data residency, CLOUD Act free infrastructure as trust signals

---

### 2.4 Technical SEO Audit Agent (`seo-audit`)

**Purpose:** Crawl DWS sites on deploy, check Core Web Vitals, canonical tags, schema markup, and block deployment if critical issues are found.

**Execution Cadence:** On every deploy (CI/CD integration) + weekly full crawl

#### Input Contract

```typescript
interface SeoAuditInput {
  /** Site to audit */
  site: {
    baseUrl: string; // e.g., "https://dws10.com"
    sitemapUrl?: string; // e.g., "https://dws10.com/sitemap.xml"
    pages: string[]; // specific pages to audit (or all if empty)
  };
  /** Audit scope */
  scope: "full" | "deploy-check" | "single-page";
  /** Previous audit results for comparison */
  previousAudit?: {
    date: string;
    scores: Record<string, number>;
    issues: Array<{ type: string; url: string; severity: string }>;
  };
  /** PageSpeed Insights API key (free tier) */
  pagespeedApiKey?: string;
}
```

#### Output Contract

```typescript
interface SeoAuditOutput {
  /** Overall site health score (0-100) */
  healthScore: number;
  /** Core Web Vitals per page */
  coreWebVitals: Array<{
    url: string;
    lcp: number; // Largest Contentful Paint (ms)
    fid: number; // First Input Delay (ms)
    cls: number; // Cumulative Layout Shift
    ttfb: number; // Time to First Byte (ms)
    status: "good" | "needs-improvement" | "poor";
  }>;
  /** Technical issues found */
  issues: Array<{
    type:
      | "missing-canonical"
      | "duplicate-title"
      | "missing-alt"
      | "broken-link"
      | "missing-schema"
      | "slow-page"
      | "missing-meta"
      | "redirect-chain"
      | "missing-hreflang"
      | "orphan-page"
      | "thin-content";
    url: string;
    severity: "critical" | "warning" | "info";
    description: string;
    fix: string;
  }>;
  /** Schema markup coverage */
  schemaMarkup: Array<{
    url: string;
    schemas: string[]; // e.g., ["Organization", "Product", "Article"]
    valid: boolean;
    errors: string[];
  }>;
  /** Deploy gate decision */
  deployGate: {
    pass: boolean;
    blockers: string[]; // critical issues that block deploy
    warnings: string[]; // non-blocking but should fix
  };
  /** Comparison with previous audit */
  delta?: {
    healthScoreChange: number;
    newIssues: number;
    resolvedIssues: number;
    regressions: string[];
  };
}
```

#### Deploy Gate Rules

| Condition                      | Action                 |
| ------------------------------ | ---------------------- |
| Any page LCP > 4000ms          | **BLOCK** deploy       |
| Missing canonical on > 3 pages | **BLOCK** deploy       |
| Broken internal links > 5      | **BLOCK** deploy       |
| Missing meta description       | **WARN** (don't block) |
| Missing alt text on images     | **WARN** (don't block) |
| Schema validation errors       | **WARN** (don't block) |

---

### 2.5 Lead-to-SEO Feedback Agent (`lead-feedback`)

**Purpose:** Read closed-won CRM records, extract language patterns from converted customers, and feed these back to the Keyword Intent Agent. This closes the SEO-to-sales loop.

**Execution Cadence:** Monthly (1st of each month)

#### Input Contract

```typescript
interface LeadFeedbackInput {
  /** Closed-won deals from the sales pipeline */
  closedWonDeals: Array<{
    dealId: string;
    companyName: string;
    industry: string;
    dealSize: number; // EUR
    closedDate: string;
    /** How the lead originally found DWS */
    attribution: {
      channel: "organic" | "paid" | "referral" | "outbound" | "event";
      landingPage?: string;
      searchQuery?: string; // if organic
      referralSource?: string;
    };
    /** Key phrases used by the buyer during sales process */
    buyerLanguage: string[]; // e.g., ["we need CSRD automation", "ETS reporting is killing us"]
    /** Pain points that led to purchase */
    painPoints: string[];
    /** Products purchased */
    products: Array<{
      sku: string;
      name: string;
      price: number;
    }>;
  }>;
  /** Current keyword priority queue (from Keyword Intent Agent) */
  currentKeywords: Array<{
    keyword: string;
    funnelStage: string;
    compositeScore: number;
  }>;
  /** Content performance data */
  contentPerformance: Array<{
    url: string;
    organicSessions: number;
    conversions: number;
    conversionRate: number;
    avgTimeOnPage: number;
    bounceRate: number;
  }>;
}
```

#### Output Contract

```typescript
interface LeadFeedbackOutput {
  /** New keyword suggestions derived from buyer language */
  newKeywordSuggestions: Array<{
    keyword: string;
    source: "buyer-language" | "pain-point" | "product-inquiry";
    frequency: number; // how many deals used this language
    suggestedFunnelStage: "tofu" | "mofu" | "bofu";
    dealValueAssociated: number; // total ARR from deals using this term
    priority: "high" | "medium" | "low";
  }>;
  /** Keyword score adjustments based on conversion data */
  scoreAdjustments: Array<{
    keyword: string;
    currentScore: number;
    adjustedScore: number;
    reason: string; // e.g., "3 closed-won deals originated from this keyword"
  }>;
  /** Content conversion insights */
  contentInsights: Array<{
    url: string;
    conversionRate: number;
    recommendation: "boost" | "optimize" | "retire" | "repurpose";
    suggestedChanges: string[];
  }>;
  /** Industry-deal correlation */
  industryCorrelation: Array<{
    industry: string;
    dealCount: number;
    totalArv: number;
    topKeywords: string[];
    contentGaps: string[];
  }>;
  /** Closed-loop metrics */
  loopMetrics: {
    organicLeadToClose: number; // % of organic leads that closed
    avgDealSizeOrganic: number; // avg deal size for organic-sourced
    avgDealSizePaid: number; // avg deal size for paid-sourced
    topConvertingContent: string[]; // URLs with highest deal attribution
    keywordToRevenue: Record<string, number>; // keyword → attributed ARR
  };
}
```

---

## 3. Agent Orchestration

### Execution Flow

```
                    ┌──────────────┐
                    │  node-cron   │
                    │  scheduler   │
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
              ▼            ▼            ▼
     ┌────────────┐ ┌──────────┐ ┌──────────┐
     │  Keyword   │ │Competitor│ │ SEO      │
     │  Intent    │ │Surveill. │ │ Audit    │
     │  (nightly) │ │(weekly)  │ │(deploy)  │
     └─────┬──────┘ └────┬─────┘ └──────────┘
           │              │
           └──────┬───────┘
                  ▼
         ┌────────────────┐
         │ Content Brief  │
         │ (on-demand)    │
         └────────┬───────┘
                  │
                  ▼
         ┌────────────────┐
         │ Lead Feedback  │
         │ (monthly)      │
         └────────────────┘
```

### Scheduling Configuration

```typescript
// In src/cron/seo-pipeline.ts
const SEO_PIPELINE_SCHEDULE = {
  "keyword-intent": "0 2 * * *", // Daily at 02:00 UTC
  "competitor-surveillance": "0 3 * * 0", // Sundays at 03:00 UTC
  "seo-audit": "on-deploy", // CI/CD trigger
  "seo-audit-weekly": "0 4 * * 1", // Mondays at 04:00 UTC
  "content-brief": "on-demand", // Triggered by other agents
  "lead-feedback": "0 6 1 * *", // 1st of month at 06:00 UTC
};
```

### Inter-Agent Communication

Agents communicate via Supabase tables (event-driven):

| Source Agent            | Event                       | Target Agent   | Trigger                                    |
| ----------------------- | --------------------------- | -------------- | ------------------------------------------ |
| keyword-intent          | `keyword.quick-win-found`   | content-brief  | Quick-win keyword detected (position 8–15) |
| competitor-surveillance | `competitor.content-gap`    | content-brief  | Content gap with high ICP relevance        |
| competitor-surveillance | `competitor.pricing-change` | —              | Alert to PM (Slack/email)                  |
| seo-audit               | `audit.critical-issue`      | —              | Block deploy, notify engineering           |
| lead-feedback           | `feedback.new-keyword`      | keyword-intent | New keyword from buyer language            |
| lead-feedback           | `feedback.score-adjustment` | keyword-intent | Adjust keyword priority scores             |

### Supabase Schema

```sql
-- SEO Pipeline Events (inter-agent communication)
CREATE TABLE seo_pipeline_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source_agent TEXT NOT NULL,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  consumed_by TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  consumed_at TIMESTAMPTZ
);

-- Keyword Priority Queue (Keyword Intent Agent output)
CREATE TABLE seo_keyword_queue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  keyword TEXT NOT NULL,
  funnel_stage TEXT NOT NULL CHECK (funnel_stage IN ('tofu', 'mofu', 'bofu')),
  current_position REAL,
  search_volume INTEGER,
  difficulty REAL,
  icp_relevance REAL,
  quick_win BOOLEAN DEFAULT FALSE,
  composite_score REAL NOT NULL,
  cluster TEXT,
  suggested_content_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content Briefs (Content Brief Agent output)
CREATE TABLE seo_content_briefs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  keyword_id UUID REFERENCES seo_keyword_queue(id),
  title TEXT NOT NULL,
  meta_description TEXT,
  outline JSONB,
  draft_markdown TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'approved', 'published')),
  published_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SEO Audit Results
CREATE TABLE seo_audit_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  site_url TEXT NOT NULL,
  health_score REAL,
  core_web_vitals JSONB,
  issues JSONB,
  deploy_gate_pass BOOLEAN,
  audit_scope TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lead-to-SEO Feedback
CREATE TABLE seo_lead_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  deal_id TEXT,
  buyer_language TEXT[],
  pain_points TEXT[],
  attributed_keyword TEXT,
  deal_value REAL,
  industry TEXT,
  feedback_processed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 4. External API Dependencies

| API                       | Purpose                                                      | Cost                  | Rate Limits           |
| ------------------------- | ------------------------------------------------------------ | --------------------- | --------------------- |
| Supermetrics              | Unified connector: Search Console + GA4 (+150 other sources) | Per Supermetrics plan | Per Supermetrics plan |
| Google PageSpeed Insights | Core Web Vitals, performance scores                          | Free                  | 25,000 req/day        |
| Groq API                  | LLM inference for classification, drafting                   | Existing              | Per-token             |
| Supabase                  | Data persistence, event bus                                  | Existing              | Existing plan limits  |

**Supermetrics replaces the separate Google Search Console OAuth app, GA4 API
setup, and DataForSEO subscription** originally planned for P0 — one
connector covers `keyword-intent`'s Search Console input and
`lead-feedback`'s GA4-derived `contentPerformance` input (§2.1, §2.5). See
`skills/supermetrics-seo-sync/SKILL.md` for the discovery → query → normalize
→ run-agent procedure, and `src/integrations/supermetrics/transform.ts` for
the deterministic row-normalization functions (unit tested in
`src/__tests__/supermetrics-transform.test.ts`). DataForSEO remains a future
option only if backlink/SERP-volume data beyond what Supermetrics' sources
offer is needed.

### API Key Management

Supermetrics is accessed via its MCP connector (session-level OAuth — no
`.env` key needed for the connector itself). Remaining keys stored in
`.env`:

```env
# SEO Pipeline APIs
GOOGLE_PAGESPEED_API_KEY=...
```

---

## 5. ROI Tracking

### KPIs per Agent

| Agent                   | Primary KPI                       | Target (Month 6) |
| ----------------------- | --------------------------------- | ---------------- |
| Keyword Intent          | Quick-win keywords actioned       | 10/month         |
| Competitor Surveillance | Content gaps identified & filled  | 4/month          |
| Content Brief           | Articles published                | 8/month          |
| SEO Audit               | Critical issues caught pre-deploy | 100%             |
| Lead Feedback           | Keywords adjusted from buyer data | 5/month          |

### Pipeline Metrics

| Metric                             | Baseline | Month 3 Target | Month 6 Target |
| ---------------------------------- | -------- | -------------- | -------------- |
| Organic MQLs                       | 0–2/mo   | 3/mo           | 5/mo           |
| Organic traffic                    | ~500/mo  | 2,000/mo       | 5,000/mo       |
| Keyword positions (page 1)         | ~5       | 15             | 30             |
| Content published (agent-assisted) | 0        | 4/mo           | 8/mo           |
| Organic-attributed ARR             | €0       | €15,000        | €90,000        |

---

## 6. Implementation Phases

| Phase                        | Duration | Deliverables                                                                                        | Cost           |
| ---------------------------- | -------- | --------------------------------------------------------------------------------------------------- | -------------- |
| **P0: Instrument**           | 2 weeks  | Supermetrics connector wired to Search Console + GA4, keyword data flowing, Supabase tables created | €0             |
| **P1: Keyword Agent**        | 3 weeks  | Keyword Intent Agent live, nightly runs, priority queue populated                                   | ~€50/mo LLM    |
| **P2: Competitor + Content** | 4 weeks  | Competitor Surveillance Agent + Content Brief Agent, weekly gap analysis                            | ~€100/mo       |
| **P3: SEO Audit**            | 2 weeks  | Technical SEO Audit Agent in CI/CD pipeline                                                         | €0 (free APIs) |
| **P4: Lead Feedback**        | 4 weeks  | Lead-to-SEO Feedback Agent, closed-loop metrics                                                     | Internal       |
| **P5: Full Orchestration**   | 2 weeks  | All agents coordinated, ROI dashboard, alerting                                                     | €200/mo total  |

---

## 7. File Locations

| Artifact                       | Path                                              |
| ------------------------------ | ------------------------------------------------- |
| Agent types                    | `src/agents/seo/types.ts`                         |
| Keyword Intent Agent           | `src/agents/seo/keyword-intent.agent.ts`          |
| Competitor Surveillance Agent  | `src/agents/seo/competitor-surveillance.agent.ts` |
| Content Brief Agent            | `src/agents/seo/content-brief.agent.ts`           |
| SEO Audit Agent                | `src/agents/seo/seo-audit.agent.ts`               |
| Lead Feedback Agent            | `src/agents/seo/lead-feedback.agent.ts`           |
| Pipeline scheduler             | `src/cron/seo-pipeline.ts`                        |
| Supabase migration             | `supabase/migrations/YYYYMMDD_seo_pipeline.sql`   |
| This specification             | `docs/SEO_SALES_AGENT_SPECIFICATION.md`           |
| Keyword seed list              | `docs/SEO_KEYWORD_SEED_LIST.md`                   |
| Content calendar               | `docs/SEO_CONTENT_CALENDAR.md`                    |
| CRM handoff schema             | `docs/SEO_CRM_HANDOFF_SCHEMA.md`                  |
| Supermetrics sync procedure    | `skills/supermetrics-seo-sync/SKILL.md`           |
| Supermetrics row normalization | `src/integrations/supermetrics/transform.ts`      |
