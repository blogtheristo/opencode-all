/**
 * Regulation Monitor — Feed Fetcher
 *
 * Fetches RSS feeds and web pages, extracts news items,
 * classifies by regulation type and severity.
 *
 * Uses native fetch only (no external RSS library).
 * Parses RSS XML with simple regex — good enough for structured feeds.
 */

import { createHash } from 'crypto';
import logger from '../utils/logger.js';
import { REGULATION_KEYWORDS, REGULATORY_SOURCES } from './sources.js';
import type {
  AlertSeverity,
  MonitorDigest,
  NewsItem,
  RegulationType,
  RegulatorySource,
} from './types.js';

// ============================================================================
// RSS PARSER (lightweight, no dependencies)
// ============================================================================

interface RssEntry {
  title: string;
  link: string;
  pubDate: string;
  description: string;
}

function parseRssXml(xml: string): RssEntry[] {
  const entries: RssEntry[] = [];

  // Match <item> blocks (RSS 2.0) or <entry> blocks (Atom)
  const itemRegex = /<(?:item|entry)[\s>]([\s\S]*?)<\/(?:item|entry)>/gi;
  let match: RegExpExecArray | null;

  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];

    const title = extractTag(block, 'title');
    const link = extractTag(block, 'link') || extractAtomLink(block);
    const pubDate = extractTag(block, 'pubDate') || extractTag(block, 'published') || extractTag(block, 'updated');
    const description = extractTag(block, 'description') || extractTag(block, 'summary') || extractTag(block, 'content');

    if (title && link) {
      entries.push({
        title: decodeHtmlEntities(title),
        link: decodeHtmlEntities(link),
        pubDate: pubDate || new Date().toISOString(),
        description: decodeHtmlEntities(stripHtml(description || '')).slice(0, 500),
      });
    }
  }

  return entries;
}

function extractTag(block: string, tag: string): string | null {
  // Handle CDATA: <title><![CDATA[...]]></title>
  const cdataRegex = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`, 'i');
  const cdataMatch = cdataRegex.exec(block);
  if (cdataMatch) return cdataMatch[1].trim();

  // Handle regular: <title>...</title>
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i');
  const match = regex.exec(block);
  return match ? match[1].trim() : null;
}

function extractAtomLink(block: string): string | null {
  // Atom: <link href="..." rel="alternate" />
  const linkRegex = /<link[^>]*href="([^"]*)"[^>]*(?:rel="alternate")?[^>]*\/?>/i;
  const match = linkRegex.exec(block);
  return match ? match[1] : null;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
}

// ============================================================================
// CLASSIFICATION
// ============================================================================

function classifyRegulations(
  text: string,
  sourceRegulations: RegulationType[]
): RegulationType[] {
  const lower = text.toLowerCase();
  const matched = new Set<RegulationType>(sourceRegulations);

  for (const [reg, keywords] of Object.entries(REGULATION_KEYWORDS)) {
    if (keywords.some(kw => lower.includes(kw))) {
      matched.add(reg as RegulationType);
    }
  }

  return [...matched];
}

function classifySeverity(title: string, description: string): AlertSeverity {
  const text = `${title} ${description}`.toLowerCase();

  // Urgent: deadlines, fines, enforcement, new requirements
  const urgentPatterns = [
    'deadline', 'fine', 'penalty', 'enforcement', 'mandatory',
    'effective date', 'entry into force', 'must comply',
    'non-compliance', 'infringement',
  ];
  if (urgentPatterns.some(p => text.includes(p))) return 'urgent';

  // Important: new proposals, amendments, consultations
  const importantPatterns = [
    'proposal', 'amendment', 'consultation', 'adopted',
    'regulation', 'directive', 'delegated act', 'implementing act',
    'new rules', 'revised',
  ];
  if (importantPatterns.some(p => text.includes(p))) return 'important';

  return 'info';
}

function assessCustomerImpact(title: string, description: string): boolean {
  const text = `${title} ${description}`.toLowerCase();
  const impactPatterns = [
    'reporting requirement', 'compliance obligation', 'deadline',
    'must report', 'new standard', 'mandatory disclosure',
    'construction', 'manufacturing', 'industry', 'sme',
    'penalty', 'fine', 'enforcement',
  ];
  return impactPatterns.some(p => text.includes(p));
}

function hashItem(title: string, source: string): string {
  return createHash('sha256')
    .update(`${title}:${source}`)
    .digest('hex')
    .slice(0, 16);
}

// ============================================================================
// FETCHER
// ============================================================================

async function fetchSource(source: RegulatorySource): Promise<NewsItem[]> {
  if (source.type === 'webpage') {
    // Skip webpage sources for now — RSS only in v1
    return [];
  }

  try {
    const response = await fetch(source.url, {
      headers: {
        'User-Agent': 'DWS-RegulationMonitor/1.0 (+https://dws10.com)',
        Accept: 'application/rss+xml, application/xml, text/xml',
      },
      signal: AbortSignal.timeout(15_000),
    });

    if (!response.ok) {
      logger.warn('Regulation monitor: feed fetch failed', {
        source: source.name,
        status: response.status,
      });
      return [];
    }

    const xml = await response.text();
    const entries = parseRssXml(xml);

    // Filter to last 7 days
    const sevenDaysAgo = Date.now() - 7 * 86_400_000;

    return entries
      .filter(entry => {
        const pubTime = new Date(entry.pubDate).getTime();
        return !isNaN(pubTime) && pubTime >= sevenDaysAgo;
      })
      .map(entry => {
        const fullText = `${entry.title} ${entry.description}`;
        return {
          hash: hashItem(entry.title, source.name),
          title: entry.title,
          url: entry.link,
          source: source.name,
          published_at: new Date(entry.pubDate).toISOString(),
          regulations: classifyRegulations(fullText, source.regulations),
          severity: classifySeverity(entry.title, entry.description),
          summary: entry.description.slice(0, 300),
          customer_impact: assessCustomerImpact(entry.title, entry.description),
        };
      });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    logger.warn('Regulation monitor: fetch error', { source: source.name, error: msg });
    return [];
  }
}

// ============================================================================
// MAIN
// ============================================================================

/**
 * Fetch all regulatory sources and build a digest.
 * Deduplicates by hash, sorts by severity then date.
 */
export async function fetchRegulationNews(): Promise<MonitorDigest> {
  logger.info('Regulation monitor: fetching from all sources...');

  // Fetch all sources in parallel with rate limiting
  const results: NewsItem[][] = [];
  for (const source of REGULATORY_SOURCES) {
    const items = await fetchSource(source);
    results.push(items);
    // 500ms between sources (be respectful)
    await new Promise(r => setTimeout(r, 500));
  }

  // Flatten and deduplicate
  const seen = new Set<string>();
  const allItems: NewsItem[] = [];

  for (const items of results) {
    for (const item of items) {
      if (!seen.has(item.hash)) {
        seen.add(item.hash);
        allItems.push(item);
      }
    }
  }

  // Sort: urgent first, then important, then by date
  const severityOrder: Record<AlertSeverity, number> = { urgent: 0, important: 1, info: 2 };
  allItems.sort((a, b) => {
    const sevDiff = severityOrder[a.severity] - severityOrder[b.severity];
    if (sevDiff !== 0) return sevDiff;
    return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
  });

  // Group by regulation
  const byRegulation: Record<string, NewsItem[]> = {};
  for (const item of allItems) {
    for (const reg of item.regulations) {
      if (!byRegulation[reg]) byRegulation[reg] = [];
      byRegulation[reg].push(item);
    }
  }

  // Filter urgent and content-worthy items
  const urgentItems = allItems.filter(i => i.severity === 'urgent' || (i.severity === 'important' && i.customer_impact));
  const contentItems = allItems.filter(i => i.severity !== 'info' && i.customer_impact).slice(0, 3);

  const digest: MonitorDigest = {
    date: new Date().toISOString().split('T')[0],
    items: allItems,
    byRegulation,
    urgentItems,
    contentItems,
  };

  logger.info('Regulation monitor: fetch complete', {
    total: allItems.length,
    urgent: urgentItems.length,
    sources: REGULATORY_SOURCES.length,
  });

  return digest;
}
