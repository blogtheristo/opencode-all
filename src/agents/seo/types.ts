/**
 * SEO Sales Agent Pipeline — Shared Types
 *
 * Defines input/output contracts for the 5 SEO sales agents:
 * - keyword-intent: Classify search queries into funnel stages
 * - competitor-surveillance: Monitor competitor content changes
 * - content-brief: Generate content briefs and drafts
 * - seo-audit: Technical SEO audit on deploy
 * - lead-feedback: Closed-won CRM → keyword feedback loop
 *
 * All agents extend BaseAgent and return AgentResponse.
 * See docs/SEO_SALES_AGENT_SPECIFICATION.md for full specification.
 */

// ============ KEYWORD INTENT AGENT ============

export interface SearchConsoleQuery {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface ExternalKeyword {
  keyword: string;
  searchVolume: number;
  difficulty: number;
  cpc: number;
  trend: 'rising' | 'stable' | 'declining';
}

export interface IcpProfile {
  industries: string[];
  companySize: string;
  regions: string[];
  painPoints: string[];
  regulations: string[];
}

export interface KeywordIntentInput {
  searchConsoleData: {
    queries: SearchConsoleQuery[];
    dateRange: { start: string; end: string };
    siteUrl: string;
  };
  externalKeywords?: ExternalKeyword[];
  icpProfile: IcpProfile;
}

export type FunnelStage = 'tofu' | 'mofu' | 'bofu';
export type ContentType = 'blog' | 'landing-page' | 'case-study' | 'product-page' | 'comparison';

export interface PriorityKeyword {
  keyword: string;
  funnelStage: FunnelStage;
  currentPosition: number | null;
  searchVolume: number;
  difficulty: number;
  icpRelevance: number;
  quickWin: boolean;
  compositeScore: number;
  cluster: string;
  suggestedContentType: ContentType;
}

export interface KeywordIntentOutput {
  priorityQueue: PriorityKeyword[];
  funnelDistribution: Record<FunnelStage, { count: number; avgPosition: number }>;
  quickWins: Array<{
    keyword: string;
    currentPosition: number;
    estimatedClicksGain: number;
    effort: 'low' | 'medium' | 'high';
  }>;
  clusters: Record<string, string[]>;
}

// ============ COMPETITOR SURVEILLANCE AGENT ============

export interface CompetitorEntry {
  id: string;
  name: string;
  domain: string;
  category: 'direct' | 'indirect' | 'adjacent' | 'substitute';
  trackingUrls: string[];
  lastCrawlDate: string;
  lastCrawlHash: string;
}

export interface OwnContentEntry {
  url: string;
  title: string;
  keywords: string[];
  lastUpdated: string;
  wordCount: number;
}

export interface CompetitorSurveillanceInput {
  competitors: CompetitorEntry[];
  ownContent: OwnContentEntry[];
  targetClusters: Record<string, string[]>;
}

export type ChangeType = 'new-page' | 'content-update' | 'pricing-change' | 'meta-change' | 'new-feature';
export type Severity = 'low' | 'medium' | 'high';

export interface CompetitorChange {
  competitorId: string;
  competitorName: string;
  changeType: ChangeType;
  url: string;
  summary: string;
  detectedAt: string;
  severity: Severity;
  contentHash: string;
}

export interface ContentGap {
  topic: string;
  competitorsCovering: string[];
  estimatedSearchVolume: number;
  relevanceToIcp: number;
  suggestedAction: 'create-new' | 'expand-existing' | 'ignore';
  relatedCluster: string;
}

export interface CompetitorSurveillanceOutput {
  changes: CompetitorChange[];
  contentGaps: ContentGap[];
  pricingChanges: Array<{
    competitorId: string;
    product: string;
    previousPrice: string;
    currentPrice: string;
    changePercent: number;
    detectedAt: string;
  }>;
  backlinkAlerts: Array<{
    competitorId: string;
    newBacklinks: number;
    topReferringDomains: string[];
    estimatedDomainAuthority: number;
  }>;
}

// ============ CONTENT BRIEF AGENT ============

export interface ContentBriefInput {
  targetKeyword: {
    keyword: string;
    funnelStage: FunnelStage;
    searchVolume: number;
    cluster: string;
    suggestedContentType: ContentType;
  };
  competitorContent?: Array<{
    competitorName: string;
    url: string;
    title: string;
    headings: string[];
    wordCount: number;
    keyTakeaways: string[];
  }>;
  lwmContext: {
    regulations: Array<{
      name: string;
      relevantArticles: string[];
      keyRequirements: string[];
    }>;
    industries: Array<{
      name: string;
      complianceRequirements: string[];
      dwsSolutions: string[];
    }>;
    fieldNotes?: Array<{
      date: string;
      insight: string;
      source: string;
    }>;
  };
  relevantProducts: Array<{
    name: string;
    sku: string;
    price: string;
    features: string[];
    ctaUrl: string;
  }>;
}

export interface ContentOutlineSection {
  heading: string;
  level: 2 | 3;
  keyPoints: string[];
  regulatoryReferences: string[];
  wordCountTarget: number;
}

export interface ContentBriefOutput {
  brief: {
    title: string;
    metaDescription: string;
    targetKeyword: string;
    secondaryKeywords: string[];
    funnelStage: string;
    contentType: string;
    targetWordCount: number;
    outline: ContentOutlineSection[];
    internalLinks: Array<{
      anchorText: string;
      targetUrl: string;
      context: string;
    }>;
    ctaPlacement: Array<{
      position: 'intro' | 'mid' | 'conclusion';
      type: 'demo-request' | 'free-trial' | 'download' | 'contact';
      product: string;
      text: string;
    }>;
    schemaMarkup: {
      type: 'Article' | 'HowTo' | 'FAQ' | 'Product';
      properties: Record<string, string>;
    };
  };
  draft: {
    html: string;
    markdown: string;
    wordCount: number;
    readabilityScore: number;
    keywordDensity: number;
  };
  differentiators: string[];
}

// ============ SEO AUDIT AGENT ============

export interface SeoAuditInput {
  site: {
    baseUrl: string;
    sitemapUrl?: string;
    pages: string[];
  };
  scope: 'full' | 'deploy-check' | 'single-page';
  previousAudit?: {
    date: string;
    scores: Record<string, number>;
    issues: Array<{ type: string; url: string; severity: string }>;
  };
  pagespeedApiKey?: string;
}

export type SeoIssueType =
  | 'missing-canonical'
  | 'duplicate-title'
  | 'missing-alt'
  | 'broken-link'
  | 'missing-schema'
  | 'slow-page'
  | 'missing-meta'
  | 'redirect-chain'
  | 'missing-hreflang'
  | 'orphan-page'
  | 'thin-content';

export type IssueSeverity = 'critical' | 'warning' | 'info';

export interface SeoAuditOutput {
  healthScore: number;
  coreWebVitals: Array<{
    url: string;
    lcp: number;
    fid: number;
    cls: number;
    ttfb: number;
    status: 'good' | 'needs-improvement' | 'poor';
  }>;
  issues: Array<{
    type: SeoIssueType;
    url: string;
    severity: IssueSeverity;
    description: string;
    fix: string;
  }>;
  schemaMarkup: Array<{
    url: string;
    schemas: string[];
    valid: boolean;
    errors: string[];
  }>;
  deployGate: {
    pass: boolean;
    blockers: string[];
    warnings: string[];
  };
  delta?: {
    healthScoreChange: number;
    newIssues: number;
    resolvedIssues: number;
    regressions: string[];
  };
}

// ============ LEAD FEEDBACK AGENT ============

export interface ClosedWonDeal {
  dealId: string;
  companyName: string;
  industry: string;
  dealSize: number;
  closedDate: string;
  attribution: {
    channel: 'organic' | 'paid' | 'referral' | 'outbound' | 'event';
    landingPage?: string;
    searchQuery?: string;
    referralSource?: string;
  };
  buyerLanguage: string[];
  painPoints: string[];
  products: Array<{
    sku: string;
    name: string;
    price: number;
  }>;
}

export interface LeadFeedbackInput {
  closedWonDeals: ClosedWonDeal[];
  currentKeywords: Array<{
    keyword: string;
    funnelStage: string;
    compositeScore: number;
  }>;
  contentPerformance: Array<{
    url: string;
    organicSessions: number;
    conversions: number;
    conversionRate: number;
    avgTimeOnPage: number;
    bounceRate: number;
  }>;
}

export interface LeadFeedbackOutput {
  newKeywordSuggestions: Array<{
    keyword: string;
    source: 'buyer-language' | 'pain-point' | 'product-inquiry';
    frequency: number;
    suggestedFunnelStage: FunnelStage;
    dealValueAssociated: number;
    priority: 'high' | 'medium' | 'low';
  }>;
  scoreAdjustments: Array<{
    keyword: string;
    currentScore: number;
    adjustedScore: number;
    reason: string;
  }>;
  contentInsights: Array<{
    url: string;
    conversionRate: number;
    recommendation: 'boost' | 'optimize' | 'retire' | 'repurpose';
    suggestedChanges: string[];
  }>;
  industryCorrelation: Array<{
    industry: string;
    dealCount: number;
    totalArv: number;
    topKeywords: string[];
    contentGaps: string[];
  }>;
  loopMetrics: {
    organicLeadToClose: number;
    avgDealSizeOrganic: number;
    avgDealSizePaid: number;
    topConvertingContent: string[];
    keywordToRevenue: Record<string, number>;
  };
}

// ============ PIPELINE EVENTS ============

export type SeoEventType =
  | 'keyword.quick-win-found'
  | 'competitor.content-gap'
  | 'competitor.pricing-change'
  | 'audit.critical-issue'
  | 'feedback.new-keyword'
  | 'feedback.score-adjustment';

export interface SeoPipelineEvent {
  id: string;
  sourceAgent: string;
  eventType: SeoEventType;
  payload: Record<string, unknown>;
  consumedBy: string[];
  createdAt: string;
  consumedAt: string | null;
}

// ============ PIPELINE SCHEDULE ============

export const SEO_PIPELINE_SCHEDULE = {
  'keyword-intent': '0 2 * * *',
  'competitor-surveillance': '0 3 * * 0',
  'seo-audit': 'on-deploy',
  'seo-audit-weekly': '0 4 * * 1',
  'content-brief': 'on-demand',
  'lead-feedback': '0 6 1 * *',
} as const;
