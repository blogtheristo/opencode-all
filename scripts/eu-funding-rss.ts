/**
 * EU Funding & Tenders → live grants/funding list (SEDIA Search API).
 *
 * Sibling of the TED pipeline (scripts/ted-fetch.ts). Queries the EU Funding &
 * Tenders Portal SEDIA search API for grant/tender topics, derives a normalised
 * status (Open / Forthcoming / Closed), and emits a human-readable Markdown
 * list plus a machine-readable JSON file (Agent Productization rule).
 *
 * Replaces the legacy callupdates-rss.xml source, which served only a static
 * Horizon 2020 (2014-2015) snapshot with no live/open opportunities. The RSS
 * feed is still reachable via --url but is not the default.
 *
 * Dependency-free (native fetch + FormData on Node >= 18).
 *
 * Usage:
 *   node --import tsx scripts/eu-funding-rss.ts [options]
 *
 * Options:
 *   --status <s>   Comma-separated: open,forthcoming,closed
 *                  (default: open,forthcoming — the "available" set).
 *   --text <q>     Full-text query sent to SEDIA (default: *** = match all).
 *   --grep <t>     Extra client-side substring filter on title+identifier.
 *   --limit <n>    Stop after N results.
 *   --out <dir>    Output directory (default: data/eu-funding).
 *   --format <f>   "md" | "json" | "both" (default: both).
 *   --url <url>    Fetch the legacy RSS feed instead of SEDIA (diagnostic).
 *   --debug-raw    Log the raw SEDIA response shape (keys, first result).
 *   --verbose      Log one line per result.
 *   --quiet        Suppress the per-item stdout (still writes files).
 *
 * Env:
 *   EU_FT_SEDIA_URL   Override the SEDIA endpoint.
 *   EU_FT_RSS_URL     Override the legacy RSS URL used with --url.
 *   EU_FUNDING_STATUS / EU_FUNDING_GREP / EU_FUNDING_LIMIT / EU_FUNDING_VERBOSE
 *
 * Note: ec.europa.eu / api.tech.ec.europa.eu may be blocked in restricted-egress
 * environments. Run where EU endpoints are reachable (same runtime as TED).
 */

const SEDIA_URL =
  process.env.EU_FT_SEDIA_URL || 'https://api.tech.ec.europa.eu/search-api/prod/rest/search';
const RSS_URL =
  process.env.EU_FT_RSS_URL ||
  'https://ec.europa.eu/info/funding-tenders/opportunities/data/referenceData/callupdates-rss.xml';

// SEDIA topic-status facet codes.
const STATUS_NAME_TO_CODE: Record<string, string> = {
  forthcoming: '31094501',
  open: '31094502',
  closed: '31094503',
};
const STATUS_CODE_TO_NAME: Record<string, string> = {
  '31094501': 'Forthcoming',
  '31094502': 'Open',
  '31094503': 'Closed',
};

interface FundingItem {
  identifier: string | null;
  title: string;
  status: string | null;
  programme: string | null;
  openingDate: string | null;
  deadline: string | null;
  url: string;
}

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 && i + 1 < process.argv.length ? process.argv[i + 1] : undefined;
}
function flag(name: string): boolean {
  return process.argv.includes(`--${name}`);
}

/** First value of a SEDIA metadata field (values are arrays of strings). */
function meta(md: Record<string, unknown> | undefined, ...keys: string[]): string | null {
  if (!md) return null;
  for (const k of keys) {
    const v = md[k];
    if (Array.isArray(v) && v.length && v[0] != null && String(v[0]).trim()) return String(v[0]).trim();
    if (typeof v === 'string' && v.trim()) return v.trim();
  }
  return null;
}

function isoDate(raw: string | null): string | null {
  if (!raw) return null;
  const t = Date.parse(raw);
  return Number.isNaN(t) ? raw : new Date(t).toISOString().slice(0, 10);
}

interface SediaResponse {
  totalResults?: number;
  pageNumber?: number;
  pageSize?: number;
  results?: Array<{ url?: string; reference?: string; metadata?: Record<string, unknown> }>;
}

// SEDIA card-type facet codes. 1/2/8 = Grants, 0 = Tenders.
const GRANT_TYPE_CODES = ['1', '2', '8'];

/**
 * POST one page to the SEDIA search API.
 *
 * The endpoint expects multipart/form-data with exactly two fields — `query`
 * and `sort`, each a minified JSON string — and the apiKey/text/paging params
 * in the URL query string. A raw application/json body is silently ignored
 * (returns the whole corpus), and adding extra form fields (e.g. `languages`)
 * makes it return HTTP 500. Do NOT set Content-Type — fetch sets the multipart
 * boundary from the FormData body.
 */
async function fetchSediaPage(
  url: string,
  statusCodes: string[],
  text: string,
  pageSize: number,
  pageNumber: number,
): Promise<SediaResponse> {
  const query = {
    bool: {
      must: [{ terms: { type: GRANT_TYPE_CODES } }, { terms: { status: statusCodes } }],
    },
  };
  const sort = { order: 'DESC', field: 'startDate' };
  const queryStr = JSON.stringify(query);
  const sortStr = JSON.stringify(sort);
  const qs = new URLSearchParams({
    apiKey: 'SEDIA',
    text: text || '***',
    pageSize: String(pageSize),
    pageNumber: String(pageNumber),
  });
  const target = `${url}?${qs.toString()}`;

  // The endpoint accepts form data (query + sort as minified JSON strings), but
  // is picky about the exact wire format. Node's undici multipart is not always
  // accepted, so try x-www-form-urlencoded first, then multipart. Do NOT set
  // Content-Type manually — the runtime derives it (and the multipart boundary).
  const urlencoded = new URLSearchParams();
  urlencoded.append('query', queryStr);
  urlencoded.append('sort', sortStr);
  const makeMultipart = () => {
    const f = new FormData();
    f.append('query', queryStr);
    f.append('sort', sortStr);
    return f;
  };
  const encodings: Array<{ label: string; body: BodyInit }> = [
    { label: 'urlencoded', body: urlencoded },
    { label: 'multipart', body: makeMultipart() },
  ];

  let lastErr = '';
  for (const enc of encodings) {
    const res = await fetch(target, { method: 'POST', body: enc.body });
    if (res.ok) {
      if (pageNumber === 1) console.error(`[eu-funding] SEDIA accepted encoding: ${enc.label}`);
      return (await res.json()) as SediaResponse;
    }
    lastErr = `${enc.label} → HTTP ${res.status} ${(await res.text()).slice(0, 150).replace(/\s+/g, ' ')}`;
  }
  throw new Error(`SEDIA rejected all encodings — last: ${lastErr}`);
}

function mapResult(r: { url?: string; metadata?: Record<string, unknown> }): FundingItem {
  const md = r.metadata;
  const statusCode = meta(md, 'status');
  return {
    identifier: meta(md, 'identifier', 'callIdentifier'),
    title: meta(md, 'title') || '(untitled)',
    status: statusCode ? STATUS_CODE_TO_NAME[statusCode] || statusCode : null,
    programme: meta(md, 'frameworkProgramme', 'programmeName', 'programmePeriod'),
    openingDate: isoDate(meta(md, 'startDate', 'plannedOpeningDate', 'openingDate')),
    deadline: isoDate(meta(md, 'deadlineDate', 'deadlineDate1', 'deadline')),
    url: r.url || '',
  };
}

async function fetchSedia(
  statuses: string[],
  text: string,
  limit: number | undefined,
  debugRaw: boolean,
): Promise<FundingItem[]> {
  const statusCodes = statuses.map((s) => {
    if (!STATUS_NAME_TO_CODE[s]) throw new Error(`Unknown status "${s}" (use: open, forthcoming, closed)`);
    return STATUS_NAME_TO_CODE[s];
  });

  const pageSize = 50;
  const MAX_PAGES = 60; // backstop: 3000 results
  const items: FundingItem[] = [];
  let total = Infinity;

  for (let page = 1; page <= MAX_PAGES; page++) {
    const data = await fetchSediaPage(SEDIA_URL, statusCodes, text, pageSize, page);
    if (page === 1) {
      total = typeof data.totalResults === 'number' ? data.totalResults : 0;
      if (debugRaw) {
        const first = data.results?.[0];
        console.error(`[debug] totalResults=${data.totalResults} pageSize=${data.pageSize} topKeys=${Object.keys(data)}`);
        console.error(`[debug] result[0].metadata keys=${first?.metadata ? Object.keys(first.metadata) : 'none'}`);
        console.error(`[debug] result[0]=${JSON.stringify(first).slice(0, 1400)}`);
      }
    }
    const batch = data.results || [];
    if (batch.length === 0) break;
    for (const r of batch) {
      // Server already filtered by type+status; map every result.
      items.push(mapResult(r));
      if (limit && items.length >= limit) return items;
    }
    if (items.length >= total) break;
    if (page === MAX_PAGES && items.length < total) {
      console.error(`[eu-funding] WARNING: hit ${MAX_PAGES}-page cap with ${items.length}/${total} results.`);
    }
  }
  return items;
}

/**
 * Diagnostic: try several SEDIA request encodings and log status + body head
 * for each, so we can identify the accepted format in a single run.
 */
async function probeSedia(): Promise<void> {
  const base = SEDIA_URL;
  // Transport is fixed (JSON body works); vary the query DSL to find one that
  // filters to Open grants without a 500.
  const jsonBody = (query: unknown) =>
    fetch(`${base}?apiKey=SEDIA&text=***&pageSize=5&pageNumber=1`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(query),
    });
  const variants: Array<{ name: string; query: unknown }> = [
    { name: 'Q1 match-all', query: { bool: { must: [] } } },
    { name: 'Q2 terms.status', query: { bool: { must: [{ terms: { status: ['31094502'] } }] } } },
    { name: 'Q3 term.status', query: { bool: { must: [{ term: { status: '31094502' } }] } } },
    { name: 'Q4 filter.terms.status', query: { bool: { filter: [{ terms: { status: ['31094502'] } }] } } },
    { name: 'Q5 terms.type', query: { bool: { must: [{ terms: { type: ['1'] } }] } } },
    { name: 'Q6 terms.status.keyword', query: { bool: { must: [{ terms: { 'status.keyword': ['31094502'] } }] } } },
    { name: 'Q7 query_string', query: { query_string: { query: 'status:31094502' } } },
  ];
  for (const v of variants) {
    try {
      const res = await jsonBody(v.query);
      const raw = await res.text();
      let note = raw.slice(0, 160).replace(/\s+/g, ' ');
      try {
        const j = JSON.parse(raw);
        if (typeof j.totalResults === 'number') {
          const st = j.results?.[0]?.metadata?.status;
          note = `totalResults=${j.totalResults} first.status=${JSON.stringify(st)}`;
        }
      } catch {
        /* keep raw slice */
      }
      console.error(`[probe] ${v.name} → HTTP ${res.status} · ${note}`);
    } catch (e) {
      console.error(`[probe] ${v.name} → THREW ${e instanceof Error ? e.message : String(e)}`);
    }
  }
}

// ---- legacy RSS path (diagnostic, via --url) --------------------------------

function stripHtml(s: string): string {
  return s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}
function decodeEntities(s: string): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&amp;/g, '&');
}
function rssTag(block: string, name: string): string | null {
  const m = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, 'i'));
  return m ? decodeEntities(m[1]).trim() : null;
}
async function fetchRss(url: string, now: Date): Promise<FundingItem[]> {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'DWS-IQ-FundingBot/1.0 (+https://onelifetime.world)',
      Accept: 'application/rss+xml, application/xml, text/xml, */*',
    },
  });
  if (!res.ok) throw new Error(`RSS HTTP ${res.status} ${res.statusText} for ${url}`);
  const xml = await res.text();
  const blocks = xml.match(/<item\b[\s\S]*?<\/item>/gi) || [];
  const labels = ['Identifier', 'Pillar', 'Opening Date', 'Deadline', 'Modification Date', 'Latest information'];
  const field = (desc: string, label: string): string | null => {
    const next = labels.filter((l) => l !== label).map((l) => l.replace(/ /g, '\\s')).join('|');
    const re = new RegExp(`${label.replace(/ /g, '\\s')}\\s*:\\s*(.*?)\\s*(?:${next})\\s*:|${label.replace(/ /g, '\\s')}\\s*:\\s*(.*)$`, 'i');
    const m = desc.match(re);
    return ((m?.[1] ?? m?.[2] ?? '').trim()) || null;
  };
  const items: FundingItem[] = [];
  for (const b of blocks) {
    const desc = stripHtml(rssTag(b, 'description') || '');
    const opening = field(desc, 'Opening Date');
    const deadline = field(desc, 'Deadline');
    const openD = opening ? new Date(opening.replace(/\([^)]*\)/g, '')) : null;
    const dlD = deadline ? new Date(deadline.replace(/\([^)]*\)/g, '')) : null;
    const status =
      dlD && !Number.isNaN(dlD.getTime()) && dlD < now
        ? 'Closed'
        : openD && !Number.isNaN(openD.getTime()) && openD > now
          ? 'Forthcoming'
          : dlD && !Number.isNaN(dlD.getTime())
            ? 'Open'
            : null;
    items.push({
      identifier: field(desc, 'Identifier'),
      title: rssTag(b, 'title') || '(untitled)',
      status,
      programme: field(desc, 'Pillar'),
      openingDate: openD && !Number.isNaN(openD.getTime()) ? openD.toISOString().slice(0, 10) : null,
      deadline: dlD && !Number.isNaN(dlD.getTime()) ? dlD.toISOString().slice(0, 10) : null,
      url: rssTag(b, 'link') || '',
    });
  }
  return items;
}

// ---- output -----------------------------------------------------------------

function toMarkdown(items: FundingItem[], source: string, generatedAt: string): string {
  const cell = (s: string | null) => (s ? s.replace(/\|/g, '\\|') : '—');
  const lines = [
    '# EU Funding & Tenders — Grants & Funding',
    '',
    `_Source: ${source}_`,
    `_Generated: ${generatedAt} · ${items.length} opportunity(ies)_`,
    '',
    '| # | Call / Topic ID | Title | Status | Opening | Deadline | Programme | Link |',
    '|---|---|---|---|---|---|---|---|',
  ];
  items.forEach((it, i) => {
    lines.push(
      `| ${i + 1} | ${cell(it.identifier)} | ${cell(it.title)} | ${cell(it.status)} | ${cell(it.openingDate)} | ${cell(it.deadline)} | ${cell(it.programme)} | ${it.url ? `[open](${it.url})` : '—'} |`,
    );
  });
  lines.push('');
  return lines.join('\n');
}

async function main(): Promise<void> {
  const rssUrl = arg('url'); // presence switches to legacy RSS mode
  const statuses = (arg('status') || process.env.EU_FUNDING_STATUS || 'open,forthcoming')
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  const text = arg('text') || '***';
  const grep = (arg('grep') || process.env.EU_FUNDING_GREP || '').toLowerCase();
  const limitRaw = arg('limit') || process.env.EU_FUNDING_LIMIT;
  const limit = limitRaw ? Number(limitRaw) : undefined;
  const format = (arg('format') || 'both').toLowerCase();
  const outDir = arg('out') || 'data/eu-funding';
  const quiet = flag('quiet');
  const verbose = flag('verbose') || process.env.EU_FUNDING_VERBOSE === 'true';
  const debugRaw = flag('debug-raw');

  if (flag('probe')) {
    await probeSedia();
    return;
  }

  const now = new Date();
  let items: FundingItem[];
  let source: string;
  if (rssUrl) {
    source = rssUrl;
    items = await fetchRss(rssUrl, now);
    // RSS carries every status; apply the status filter client-side.
    const wanted = new Set(statuses.map((s) => s[0].toUpperCase() + s.slice(1)));
    items = items.filter((it) => it.status !== null && wanted.has(it.status));
  } else {
    source = SEDIA_URL;
    items = await fetchSedia(statuses, text, limit, debugRaw);
  }

  if (grep) {
    items = items.filter((it) => `${it.title} ${it.identifier || ''}`.toLowerCase().includes(grep));
  }
  if (limit && limit > 0) items = items.slice(0, limit);

  // Fail loud: no open/forthcoming opportunities is unusual for a live query.
  if (items.length === 0) {
    console.error(
      `[eu-funding] WARNING: 0 results for status=[${statuses.join(',')}] text="${text}" from ${source}. ` +
        `Verify the query/endpoint before trusting an empty list (re-run with --debug-raw).`,
    );
  }

  const generatedAt = now.toISOString();
  const fs = await import('node:fs/promises');
  await fs.mkdir(outDir, { recursive: true });
  const written: string[] = [];
  if (format === 'json' || format === 'both') {
    const p = `${outDir}/grants-funding.json`;
    await fs.writeFile(p, JSON.stringify({ source, generatedAt, statuses, count: items.length, items }, null, 2));
    written.push(p);
  }
  if (format === 'md' || format === 'both') {
    const p = `${outDir}/grants-funding.md`;
    await fs.writeFile(p, toMarkdown(items, source, generatedAt));
    written.push(p);
  }

  if (!quiet) {
    for (const it of items) {
      console.log(`• ${it.title}`);
      const parts = [it.identifier || '(no id)', it.status ? `[${it.status}]` : '', it.deadline ? `deadline ${it.deadline}` : '']
        .filter(Boolean)
        .join(' · ');
      if (parts) console.log(`    ${parts}`);
      if (verbose && it.programme) console.log(`    programme: ${it.programme}`);
      if (it.url) console.log(`    ${it.url}`);
    }
    console.log('');
  }

  const breakdown = items.reduce<Record<string, number>>((acc, it) => {
    const k = it.status || 'Unknown';
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});
  const breakdownStr = Object.entries(breakdown).map(([k, v]) => `${k}=${v}`).join(' ') || 'none';
  console.error(`[eu-funding] ${items.length} opportunity(ies) (${breakdownStr}) → ${written.join(', ')}`);
}

main().catch((err) => {
  console.error(`[eu-funding] ERROR: ${err instanceof Error ? err.message : String(err)}`);
  process.exitCode = 1;
});
