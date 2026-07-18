/**
 * EU Funding & Tenders "call updates" RSS → grants/funding list.
 *
 * Sibling of the TED pipeline (scripts/ted-fetch.ts). Fetches the EU
 * Funding & Tenders Portal call-updates RSS feed, parses each item, derives
 * the call/topic identifier, and emits a human-readable Markdown list plus a
 * machine-readable JSON file (Agent Productization rule).
 *
 * Dependency-free parser (no XML lib) — the feed is flat RSS 2.0.
 *
 * Usage:
 *   node --import tsx scripts/eu-funding-rss.ts [options]
 *
 * Options:
 *   --url <url>       Override feed URL (default: EU F&T call-updates RSS).
 *   --out <dir>       Output directory (default: data/eu-funding).
 *   --status <s>      Case-insensitive substring filter on item text
 *                     (e.g. "open", "forthcoming"). Repeatable via comma.
 *   --grep <text>     Case-insensitive substring filter on title+description.
 *   --limit <n>       Keep only the first N items after filtering.
 *   --format <f>      "md" | "json" | "both" (default: both).
 *   --quiet           Suppress the stdout table (still writes files).
 *
 * Env:
 *   EU_FT_RSS_URL     Alternative way to set the feed URL.
 *
 * Note: In restricted-egress environments ec.europa.eu may be blocked. This
 * script is meant to run where EU endpoints are reachable (the same runtime
 * as the TED pipeline).
 */

const DEFAULT_URL =
  process.env.EU_FT_RSS_URL ||
  'https://ec.europa.eu/info/funding-tenders/opportunities/data/referenceData/callupdates-rss.xml';

interface FundingItem {
  title: string;
  link: string;
  topicId: string | null;
  pillar: string | null;
  status: string | null; // derived: Open | Forthcoming | Closed | null
  openingDate: string | null; // ISO date or null
  deadline: string | null; // ISO date or null
  pubDate: string | null;
  description: string;
  guid: string | null;
}

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 && i + 1 < process.argv.length ? process.argv[i + 1] : undefined;
}
function flag(name: string): boolean {
  return process.argv.includes(`--${name}`);
}

/** Decode the small set of XML entities that appear in feed text. */
function decodeEntities(s: string): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');
}

function stripHtml(s: string): string {
  return s
    .replace(/<br\s*\/?>(?=\S)/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tag(block: string, name: string): string | null {
  const m = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, 'i'));
  return m ? decodeEntities(m[1]).trim() : null;
}

/**
 * EU F&T call/topic identifiers look like HORIZON-CL5-2024-D3-01-05,
 * ERASMUS-EDU-2025-..., CEF-T-2024-..., H2020-NMP-2014-2015, etc. The
 * call-updates feed links use matrix params (topic-search;programCode=…;
 * callCode=…) rather than a topic-details path, so probe those first, then
 * fall back to a topic-details segment or an ID-shaped token in the title.
 */
function deriveTopicId(title: string, link: string): string | null {
  const callCode = link.match(/[;&?]callCode=([^;&?#/]+)/i);
  if (callCode) return decodeURIComponent(callCode[1]);
  const topicDetails = link.match(/topic-details\/([^;/?#]+)/i);
  if (topicDetails) return decodeURIComponent(topicDetails[1]).toUpperCase();
  const programCode = link.match(/[;&?]programCode=([^;&?#/]+)/i);
  if (programCode) return decodeURIComponent(programCode[1]);
  const fromTitle = title.match(/\b([A-Z][A-Z0-9]+(?:-[A-Z0-9]+){2,})\b/);
  return fromTitle ? fromTitle[1] : null;
}

/**
 * The call-updates feed carries no status field — descriptions are labelled
 * "Identifier : … Pillar : … Opening Date : … Deadline : … Modification Date : …".
 * Pull a single labelled value, bounded by the next known label.
 */
const FIELD_LABELS = ['Identifier', 'Pillar', 'Opening Date', 'Deadline', 'Modification Date', 'Latest information'];
function labelledField(desc: string, label: string): string | null {
  const next = FIELD_LABELS.filter((l) => l !== label)
    .map((l) => l.replace(/ /g, '\\s'))
    .join('|');
  const re = new RegExp(`${label.replace(/ /g, '\\s')}\\s*:\\s*(.*?)\\s*(?:${next})\\s*:|${label.replace(/ /g, '\\s')}\\s*:\\s*(.*)$`, 'i');
  const m = desc.match(re);
  const val = (m?.[1] ?? m?.[2] ?? '').trim();
  return val || null;
}

/** Parse feed dates like "Thu, 7 May 2015 17:00:00 (Brussels local time)" or ISO. */
function parseFeedDate(raw: string | null): Date | null {
  if (!raw) return null;
  const cleaned = raw.replace(/\((?:Brussels local time|[^)]*)\)/gi, '').trim();
  const t = Date.parse(cleaned);
  return Number.isNaN(t) ? null : new Date(t);
}

/** Derive status from opening/deadline dates relative to now. */
function deriveStatus(opening: Date | null, deadline: Date | null, now: Date): string | null {
  if (deadline && deadline.getTime() < now.getTime()) return 'Closed';
  if (opening && opening.getTime() > now.getTime()) return 'Forthcoming';
  if (deadline && deadline.getTime() >= now.getTime()) return 'Open';
  return null;
}

function isoDate(d: Date | null): string | null {
  return d ? d.toISOString().slice(0, 10) : null;
}

function parseFeed(xml: string, now: Date): FundingItem[] {
  const items: FundingItem[] = [];
  const blocks = xml.match(/<item\b[\s\S]*?<\/item>/gi) || [];
  for (const block of blocks) {
    const title = tag(block, 'title') || '(untitled)';
    const link = tag(block, 'link') || '';
    const description = stripHtml(tag(block, 'description') || '');
    const opening = parseFeedDate(labelledField(description, 'Opening Date'));
    const deadline = parseFeedDate(labelledField(description, 'Deadline'));
    items.push({
      title,
      link,
      topicId: labelledField(description, 'Identifier') || deriveTopicId(title, link),
      pillar: labelledField(description, 'Pillar'),
      status: deriveStatus(opening, deadline, now),
      openingDate: isoDate(opening),
      deadline: isoDate(deadline),
      pubDate: tag(block, 'pubDate'),
      description,
      guid: tag(block, 'guid'),
    });
  }
  return items;
}

function toMarkdown(items: FundingItem[], sourceUrl: string, generatedAt: string): string {
  const lines: string[] = [];
  lines.push('# EU Funding & Tenders — Call Updates');
  lines.push('');
  lines.push(`_Source: ${sourceUrl}_`);
  lines.push(`_Generated: ${generatedAt} · ${items.length} item(s)_`);
  lines.push('');
  lines.push('| # | Call / Topic ID | Title | Status | Opening | Deadline | Pillar | Link |');
  lines.push('|---|---|---|---|---|---|---|---|');
  items.forEach((it, i) => {
    const cell = (s: string | null) => (s ? s.replace(/\|/g, '\\|') : '—');
    lines.push(
      `| ${i + 1} | ${cell(it.topicId)} | ${cell(it.title)} | ${cell(it.status)} | ${cell(it.openingDate)} | ${cell(it.deadline)} | ${cell(it.pillar)} | ${it.link ? `[open](${it.link})` : '—'} |`,
    );
  });
  lines.push('');
  return lines.join('\n');
}

async function main(): Promise<void> {
  const url = arg('url') || DEFAULT_URL;
  const outDir = arg('out') || 'data/eu-funding';
  const statusFilters = (arg('status') || '')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  const grep = (arg('grep') || '').toLowerCase();
  const limit = arg('limit') ? Number(arg('limit')) : undefined;
  const format = (arg('format') || 'both').toLowerCase();
  const quiet = flag('quiet');

  const res = await fetch(url, {
    headers: {
      // The portal rejects blank/agent user-agents with 403.
      'User-Agent': 'DWS-IQ-FundingBot/1.0 (+https://onelifetime.world)',
      Accept: 'application/rss+xml, application/xml, text/xml, */*',
    },
  });
  if (!res.ok) {
    throw new Error(`Fetch failed: HTTP ${res.status} ${res.statusText} for ${url}`);
  }
  const xml = await res.text();
  const now = new Date();
  const allItems = parseFeed(xml, now);

  // Fail loud: an empty parse against a 200 body means the feed shape changed.
  if (allItems.length === 0) {
    throw new Error(
      `Parsed 0 items from a ${xml.length}-byte response. The feed format may have changed — inspect the raw XML before trusting this output.`,
    );
  }

  let items = allItems;
  if (statusFilters.length) {
    // Match the derived status field exactly — the description text contains
    // words like "Opening" that would false-match a substring search.
    items = items.filter((it) => it.status !== null && statusFilters.includes(it.status.toLowerCase()));
  }
  if (grep) {
    items = items.filter((it) => `${it.title} ${it.description}`.toLowerCase().includes(grep));
  }
  if (limit && limit > 0) items = items.slice(0, limit);

  const generatedAt = new Date().toISOString();
  const fs = await import('node:fs/promises');
  await fs.mkdir(outDir, { recursive: true });

  const payload = {
    source: url,
    generatedAt,
    count: items.length,
    items,
  };

  const written: string[] = [];
  if (format === 'json' || format === 'both') {
    const p = `${outDir}/grants-funding.json`;
    await fs.writeFile(p, JSON.stringify(payload, null, 2));
    written.push(p);
  }
  if (format === 'md' || format === 'both') {
    const p = `${outDir}/grants-funding.md`;
    await fs.writeFile(p, toMarkdown(items, url, generatedAt));
    written.push(p);
  }

  const verbose = flag('verbose');
  if (!quiet) {
    for (const it of items) {
      const parts = [
        it.topicId || '(no id)',
        it.status ? `[${it.status}]` : '',
        it.deadline ? `deadline ${it.deadline}` : '',
      ].filter(Boolean);
      console.log(`• ${it.title}`);
      if (parts.length) console.log(`    ${parts.join(' · ')}`);
      if (verbose && it.description) console.log(`    desc: ${it.description.slice(0, 200)}`);
      if (it.link) console.log(`    ${it.link}`);
    }
    console.log('');
  }
  const breakdown = allItems.reduce<Record<string, number>>((acc, it) => {
    const k = it.status || 'Unknown';
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});
  const breakdownStr = Object.entries(breakdown)
    .map(([k, v]) => `${k}=${v}`)
    .join(' ');
  console.error(
    `[eu-funding-rss] feed=${allItems.length} (${breakdownStr}) · written=${items.length} → ${written.join(', ')}`,
  );
}

main().catch((err) => {
  console.error(`[eu-funding-rss] ERROR: ${err instanceof Error ? err.message : String(err)}`);
  process.exitCode = 1;
});
