/**
 * EU Regulation Monitor Module
 *
 * Monitors CBAM, CSRD, Fit for 55, EPBD, EU AI Act news.
 * Feeds into morning briefing and social scheduler.
 */

export { fetchRegulationNews } from './fetcher.js';
export { buildRegulationDigestHtml, buildRegulationDigestPlainText } from './digest-template.js';
export { REGULATORY_SOURCES, REGULATION_KEYWORDS } from './sources.js';
export type {
  NewsItem,
  MonitorDigest,
  RegulationType,
  AlertSeverity,
  RegulatorySource,
} from './types.js';
