# SEO-to-CRM Handoff Schema

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/seo-sales-agent-pipeline-7et5F | Date: 20.02.2026 | Changes: Initial handoff schema — organic visitor to sales agent trigger, data contracts, scoring rules

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
**Scope:** Data handoff from SEO pipeline to Firehorse sales pipeline
**Depends on:** `docs/SEO_SALES_AGENT_SPECIFICATION.md`, `src/firehorse/sales-pipeline.ts`

---

## 1. Purpose

Defines the exact data that passes from an organic website visitor to the sales agent trigger in Firehorse. This schema bridges the SEO Content Agent output to the existing `sales-pipeline.ts` infrastructure.

---

## 2. Visitor-to-Lead Data Flow

```
Organic Search → dws10.com page → GA4 event tracking
                                        │
                                        ▼
                              ┌──────────────────┐
                              │  Visitor Profile  │
                              │  (anonymous)      │
                              └────────┬─────────┘
                                       │
                              Scoring threshold met?
                                       │
                              ┌────────▼─────────┐
                              │  MQL Created      │
                              │  (Supabase)       │
                              └────────┬─────────┘
                                       │
                              ┌────────▼─────────┐
                              │  Firehorse Sales  │
                              │  Pipeline         │
                              └──────────────────┘
```

---

## 3. Handoff Data Schema

### 3.1 Organic Visitor Record

Written to `seo_organic_visitors` on first page view.

```typescript
interface OrganicVisitorRecord {
  /** Anonymous visitor ID (GA4 client_id or cookie-based) */
  visitorId: string;
  /** First-touch attribution */
  firstTouch: {
    landingPage: string;         // e.g., "/blog/csrd-reporting-guide"
    searchQuery: string | null;  // from Search Console (if available)
    referrer: string | null;
    medium: 'organic' | 'direct';
    timestamp: string;           // ISO 8601
  };
  /** Pages viewed in this session */
  pageViews: Array<{
    url: string;
    title: string;
    duration: number;            // seconds on page
    scrollDepth: number;         // 0-100%
    timestamp: string;
  }>;
  /** Keyword cluster inferred from content consumed */
  inferredCluster: string;       // e.g., "csrd-reporting"
  /** Funnel stage inferred from content types consumed */
  inferredFunnelStage: 'tofu' | 'mofu' | 'bofu';
  /** Lead score (0-100) */
  leadScore: number;
  /** Whether scoring threshold is met */
  mqReady: boolean;
}
```

### 3.2 Marketing Qualified Lead (MQL)

Created when `leadScore >= 60`. Bridges to Firehorse sales pipeline.

```typescript
interface SeoMql {
  /** Unique MQL ID */
  id: string;
  /** Link back to visitor record */
  visitorId: string;
  /** Company information (if identifiable via reverse IP or form fill) */
  company?: {
    name: string;
    domain: string;
    industry: string;
    size: string;              // e.g., "50-200"
    country: string;
  };
  /** Contact info (only if form was filled) */
  contact?: {
    email: string;
    name: string;
    role: string;
  };
  /** SEO attribution data */
  attribution: {
    channel: 'organic';
    firstTouchKeyword: string | null;
    firstTouchPage: string;
    conversionPage: string;    // page where they became MQL
    pagesViewed: number;
    totalTimeOnSite: number;   // seconds
    sessions: number;
  };
  /** Content consumption profile */
  contentProfile: {
    clustersViewed: string[];  // e.g., ["csrd-reporting", "fit-for-55"]
    contentTypes: string[];    // e.g., ["blog", "product-page", "comparison"]
    productPagesViewed: string[];
    downloadedAssets: string[];
  };
  /** Lead score at time of qualification */
  leadScore: number;
  /** Recommended products based on content consumption */
  recommendedProducts: Array<{
    sku: string;
    name: string;
    matchReason: string;       // e.g., "viewed CSRD product page + read 3 CSRD articles"
  }>;
  /** Suggested outreach approach */
  outreachSuggestion: {
    channel: 'email' | 'linkedin' | 'phone';
    template: string;          // template ID from Firehorse Omnichannel
    timing: string;            // e.g., "within 2 hours"
    personalization: string[]; // talking points based on content consumed
  };
  /** Timestamps */
  createdAt: string;
  qualifiedAt: string;
}
```

---

## 4. Lead Scoring Rules

### 4.1 Page-Based Scoring

| Action | Points | Rationale |
|--------|--------|-----------|
| View any page | +2 | Basic engagement |
| View product page (`/buy/`, `/products/`) | +10 | Purchase intent |
| View pricing page | +15 | High purchase intent |
| View comparison page | +8 | Active evaluation |
| View industry-specific page (`/construction/`) | +5 | Industry fit signal |
| Read blog post (>60s on page) | +3 | Content engagement |
| Download asset (whitepaper, template) | +12 | Information seeking |
| Visit 3+ pages in one session | +5 | Active research |
| Return visit (within 7 days) | +8 | Sustained interest |

### 4.2 Content-Based Scoring

| Content Cluster | Bonus Points | Rationale |
|-----------------|-------------|-----------|
| BOFU content (pricing, demo, buy) | +10 | Direct purchase intent |
| MOFU content (comparison, how-to) | +5 | Active evaluation |
| TOFU content (overview, explainer) | +1 | Awareness stage |
| Multiple clusters viewed | +5 per additional | Breadth of interest |

### 4.3 Company-Based Scoring (if identifiable)

| Signal | Points | Rationale |
|--------|--------|-----------|
| Company in Top 30 target list | +20 | Named account |
| Industry in Tier 1 (critical) | +10 | High regulatory pressure |
| Industry in Tier 2 (important) | +5 | Moderate regulatory need |
| Company size 50-5000 | +5 | ICP match |
| Nordic/DACH region | +5 | Primary market |

### 4.4 Qualification Thresholds

| Score | Status | Action |
|-------|--------|--------|
| 0–29 | Cold | No action, continue nurturing via content |
| 30–59 | Warm | Add to email nurture sequence |
| 60–79 | MQL | Create MQL record, notify SDR |
| 80+ | Hot MQL | Priority SDR outreach within 2 hours |

---

## 5. Firehorse Sales Pipeline Integration

### 5.1 MQL → Firehorse Meeting

When an MQL is created, the handoff triggers:

```typescript
// Integration point in src/firehorse/sales-pipeline.ts
interface SeoToFirehorseHandoff {
  /** Create a new lead in the pipeline */
  action: 'create-lead';
  /** Source identification */
  source: 'seo-pipeline';
  /** MQL data */
  mql: SeoMql;
  /** Suggested Firehorse actions */
  suggestedActions: Array<{
    type: 'schedule-meeting' | 'send-email' | 'linkedin-connect' | 'assign-sdr';
    priority: 'urgent' | 'normal';
    details: Record<string, string>;
  }>;
}
```

### 5.2 Mapping to Existing Pipeline Stages

| SEO Pipeline Stage | Firehorse Pipeline Stage | Trigger |
|-------------------|-------------------------|---------|
| Organic visitor (cold) | — | No pipeline entry |
| Warm lead (30-59) | Email nurture | Automated |
| MQL (60-79) | Meeting request | SDR assigns |
| Hot MQL (80+) | Priority contact | SDR contacts within 2h |
| Form fill / demo request | Proposal prep | Immediate SDR + AE |

---

## 6. Supabase Tables

```sql
-- Organic visitor tracking
CREATE TABLE seo_organic_visitors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_id TEXT NOT NULL UNIQUE,
  first_touch JSONB NOT NULL,
  page_views JSONB DEFAULT '[]',
  inferred_cluster TEXT,
  inferred_funnel_stage TEXT,
  lead_score INTEGER DEFAULT 0,
  mq_ready BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Marketing Qualified Leads from SEO
CREATE TABLE seo_mqls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_id TEXT REFERENCES seo_organic_visitors(visitor_id),
  company JSONB,
  contact JSONB,
  attribution JSONB NOT NULL,
  content_profile JSONB NOT NULL,
  lead_score INTEGER NOT NULL,
  recommended_products JSONB,
  outreach_suggestion JSONB,
  firehorse_lead_id TEXT,           -- FK to Firehorse pipeline
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'meeting', 'proposal', 'won', 'lost')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  qualified_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast lookups
CREATE INDEX idx_seo_visitors_score ON seo_organic_visitors(lead_score) WHERE lead_score >= 30;
CREATE INDEX idx_seo_mqls_status ON seo_mqls(status);
CREATE INDEX idx_seo_visitors_cluster ON seo_organic_visitors(inferred_cluster);
```

---

## 7. Event Tracking Requirements

GA4 events to implement on dws10.com for the scoring system:

| Event Name | Parameters | Trigger |
|-----------|------------|---------|
| `page_view` | `page_location`, `page_title` | Every page load |
| `scroll` | `percent_scrolled` | 25%, 50%, 75%, 100% |
| `engagement_time` | `engagement_time_msec` | Every 10s |
| `product_view` | `item_id`, `item_name`, `price` | Product page view |
| `download` | `file_name`, `file_extension` | Asset download |
| `form_submit` | `form_id`, `form_name` | Contact/demo form |
| `cta_click` | `cta_text`, `cta_location`, `destination` | CTA button click |
