/**
 * Regulation Monitor — Types
 *
 * Monitors CBAM, CSRD, Fit for 55, EPBD, and EU AI Act news.
 * Feeds into morning briefing and social scheduler.
 */

export type RegulationType = 'CBAM' | 'CSRD' | 'FITFOR55' | 'EPBD' | 'EU_AI_ACT' | 'ETS' | 'GREEN_CLAIMS';

export type AlertSeverity = 'info' | 'important' | 'urgent';

export interface RegulatorySource {
  name: string;
  url: string;
  type: 'rss' | 'api' | 'webpage';
  regulations: RegulationType[];
}

export interface NewsItem {
  /** Unique hash of title + source for deduplication */
  hash: string;
  title: string;
  url: string;
  source: string;
  published_at: string;
  regulations: RegulationType[];
  severity: AlertSeverity;
  summary: string;
  /** Whether this affects DWS customers directly */
  customer_impact: boolean;
}

export interface MonitorDigest {
  date: string;
  items: NewsItem[];
  /** Grouped by regulation */
  byRegulation: Record<string, NewsItem[]>;
  /** High-priority items that should go into morning briefing */
  urgentItems: NewsItem[];
  /** Items suitable for LinkedIn posts */
  contentItems: NewsItem[];
}
