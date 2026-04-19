/**
 * Sync File Index — Populates Supabase file_index from Document-index.md
 *
 * Reads the curated docs/Document-index.md, parses its markdown tables,
 * upserts each document into Supabase file_index, then triggers the
 * Cloudflare Worker /sync endpoint to rebuild the Upstash Redis index.
 *
 * Usage:
 *   npx tsx scripts/sync-file-index.ts
 *   npx tsx scripts/sync-file-index.ts --dry-run
 *   npx tsx scripts/sync-file-index.ts --skip-redis
 *
 * Required env vars:
 *   SUPABASE_URL, SUPABASE_SERVICE_KEY
 *   SEARCH_SYNC_API_KEY, SEARCH_WORKER_URL (for Redis sync)
 *
 * @version 1.0.0
 * @see docs/architecture/SEARCH_ARCHITECTURE.md
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

// ============================================================================
// Types
// ============================================================================

interface DocEntry {
  title: string;
  slug: string;
  path: string;
  category: string;
  tags: string[];
  description: string | null;
  status: string;
  language: string;
  github_url: string;
  doc_modified: string | null;
}

// ============================================================================
// Config
// ============================================================================

const GITHUB_BASE = 'https://github.com/blogtheristo/dws6/blob/main';

const DRY_RUN = process.argv.includes('--dry-run');
const SKIP_REDIS = process.argv.includes('--skip-redis');

// ============================================================================
// Parse Document-index.md tables
// ============================================================================

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Extract rows from a markdown table. Returns array of cell arrays. */
function parseMarkdownTable(text: string): string[][] {
  const rows: string[][] = [];
  const lines = text.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('|') || !trimmed.endsWith('|')) continue;
    // Skip separator rows (|---|---|)
    if (/^\|[\s\-:|]+\|$/.test(trimmed)) continue;

    const cells = trimmed
      .slice(1, -1)        // remove outer pipes
      .split('|')
      .map((c) => c.trim());

    rows.push(cells);
  }

  // Remove header row (first row)
  if (rows.length > 0) rows.shift();
  return rows;
}

/**
 * Build tags from document path, category, and description.
 * Extracts meaningful keywords.
 */
function inferTags(
  path: string,
  category: string,
  description: string | null,
  title: string
): string[] {
  const tags = new Set<string>();

  // Category is always a tag
  tags.add(category);

  // Extract from path segments
  const segments = path.split('/').filter(Boolean);
  for (const seg of segments) {
    const lower = seg.toLowerCase();
    if (lower === 'admin' || lower === 'docs' || lower === 'md') continue;
    if (lower.endsWith('.md')) continue;
    tags.add(lower);
  }

  // Keywords from description
  const keywords = [
    'supabase', 'auth', 'cloudflare', 'docker', 'security', 'deployment',
    'mcp', 'firehorse', 'react', 'vite', 'python', 'revolut', 'payments',
    'ai', 'agent', 'llm', 'compliance', 'gdpr', 'ets', 'cbam', 'csrd',
    'sap', 'ifs', 'dynamics', 'erp', 'nvidia', 'jetson', 'temporal',
    'linkedin', 'omnichannel', 'report', 'automation', 'testing',
    'construction', 'manufacturing', 'energy', 'healthcare', 'mining',
    'logistics', 'investor', 'sales', 'thesis', 'metropolia',
  ];

  const allText = `${title} ${description || ''} ${path}`.toLowerCase();
  for (const kw of keywords) {
    if (allText.includes(kw)) tags.add(kw);
  }

  return [...tags].slice(0, 10); // Cap at 10 tags
}

function parseDocumentIndex(filePath: string): DocEntry[] {
  const content = readFileSync(filePath, 'utf-8');
  const entries: DocEntry[] = [];

  // Split by section headers (## ...)
  const sections = content.split(/^## /m).slice(1); // skip preamble

  for (const section of sections) {
    const headerLine = section.split('\n')[0].trim();
    const category = sectionToCategory(headerLine);
    if (!category) continue;

    const rows = parseMarkdownTable(section);

    for (const cells of rows) {
      const entry = parseRow(cells, category, headerLine);
      if (entry) entries.push(entry);
    }
  }

  return entries;
}

function sectionToCategory(header: string): string | null {
  const map: Record<string, string> = {
    'Admin Manuals': 'admin',
    'Architecture Docs': 'architecture',
    'Field Notes': 'field-notes',
    'Firehorse Product': 'firehorse',
    'Core Documentation': 'firehorse',
    'Templates & Standards': 'firehorse',
    'Sub-Products': 'firehorse',
    'Control Views': 'firehorse',
    'Situation Rooms': 'firehorse',
    'Standards & Guidelines': 'standards',
    'Security': 'security',
    'Agent Documentation': 'agents',
    'Deployment & DevOps': 'devops',
    'Thesis & Academic': 'thesis',
    'Configuration': 'config',
    'Industry Documentation': 'industry',
    'Scripts & Automation': 'devops',
    'Sales & Marketing': 'sales',
    'Reports & Evaluations': 'reports',
    'MCP (Model Context Protocol)': 'mcp',
    'Miscellaneous': 'misc',
  };

  return map[header] || null;
}

function parseRow(cells: string[], category: string, _sectionHeader: string): DocEntry | null {
  // Tables have varying column structures. Common patterns:
  // | Document | Path | Status | Last Modified | Description |
  // | Document | Path | Status | Description |
  // | Document | Path | Date | Topic | Ontology Tags |
  // | Script   | Path | Version | Last Modified | Description |

  if (cells.length < 2) return null;

  const title = cells[0].replace(/\*\*/g, '').trim();
  let path = cells[1].replace(/`/g, '').trim();

  // Skip glob patterns or folder-only references
  if (path.includes('*') || (!path.endsWith('.md') && !path.endsWith('.yml') && !path.endsWith('.sh'))) {
    // Some entries are folder references like /mcp-hub/ — still index them
    if (!path.endsWith('/')) return null;
  }

  // Normalize path
  if (!path.startsWith('/')) path = `/${path}`;

  const slug = slugify(title);
  if (!slug) return null;

  // Extract description — last meaningful column usually
  let description: string | null = null;
  let status = 'ACTIVE';
  let docModified: string | null = null;
  let language = 'en';

  // Try to find Status, Description, Last Modified from cells
  for (let i = 2; i < cells.length; i++) {
    const cell = cells[i].trim();
    if (['ACTIVE', 'DRAFT', 'ARCHIVED', 'DEPRECATED'].includes(cell.toUpperCase())) {
      status = cell.toUpperCase();
    } else if (/^\d{4}-\d{2}-\d{2}/.test(cell)) {
      docModified = cell;
    } else if (['EN', 'FI'].includes(cell.toUpperCase())) {
      language = cell.toLowerCase();
    } else if (cell.length > 5 && cell !== '-') {
      // Likely description or topic
      description = cell;
    }
  }

  // Check if Finnish
  if (title.includes('_FI') || title.includes(' FI') || path.includes('/fi/')) {
    language = 'fi';
  }

  const githubUrl = `${GITHUB_BASE}${path}`;
  const tags = inferTags(path, category, description, title);

  return {
    title,
    slug,
    path,
    category,
    tags,
    description,
    status,
    language,
    github_url: githubUrl,
    doc_modified: docModified ? `${docModified}T00:00:00Z` : null,
  };
}

// ============================================================================
// Supabase upsert
// ============================================================================

async function upsertToSupabase(
  entries: DocEntry[],
  supabaseUrl: string,
  serviceKey: string
): Promise<{ upserted: number; errors: string[] }> {
  let upserted = 0;
  const errors: string[] = [];

  // Batch upsert using Supabase's UPSERT (on_conflict=slug)
  const batchSize = 50;

  for (let i = 0; i < entries.length; i += batchSize) {
    const batch = entries.slice(i, i + batchSize).map((e) => ({
      title: e.title,
      slug: e.slug,
      path: e.path,
      category: e.category,
      tags: e.tags,
      language: e.language,
      description: e.description,
      status: e.status,
      github_url: e.github_url,
      doc_modified: e.doc_modified,
    }));

    const res = await fetch(
      `${supabaseUrl}/rest/v1/file_index?on_conflict=slug`,
      {
        method: 'POST',
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          'Content-Type': 'application/json',
          Prefer: 'resolution=merge-duplicates,return=minimal',
        },
        body: JSON.stringify(batch),
      }
    );

    if (res.ok) {
      upserted += batch.length;
    } else {
      const text = await res.text();
      errors.push(`Batch ${i / batchSize + 1} failed: ${res.status} - ${text}`);
    }
  }

  return { upserted, errors };
}

// ============================================================================
// Trigger Redis sync
// ============================================================================

async function triggerRedisSync(
  workerUrl: string,
  apiKey: string
): Promise<{ ok: boolean; data?: unknown; error?: string }> {
  try {
    const res = await fetch(`${workerUrl}/sync`, {
      method: 'POST',
      headers: { 'X-API-Key': apiKey },
    });

    if (res.ok) {
      const data = await res.json();
      return { ok: true, data };
    } else {
      return { ok: false, error: `Worker returned ${res.status}: ${await res.text()}` };
    }
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

// ============================================================================
// Main
// ============================================================================

async function main(): Promise<void> {
  console.log('=== DWS File Index Sync ===\n');

  // Validate env
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!DRY_RUN && (!supabaseUrl || !serviceKey)) {
    console.error('ERROR: Missing SUPABASE_URL or SUPABASE_SERVICE_KEY');
    console.error('Set them in .env or use --dry-run to preview.');
    process.exit(1);
  }

  // 1. Parse Document-index.md
  const indexPath = resolve(__dirname, '../docs/Document-index.md');
  console.log(`Parsing: ${indexPath}`);

  const entries = parseDocumentIndex(indexPath);
  console.log(`Found ${entries.length} documents across categories:\n`);

  // Summary by category
  const catCounts: Record<string, number> = {};
  for (const e of entries) {
    catCounts[e.category] = (catCounts[e.category] || 0) + 1;
  }
  for (const [cat, count] of Object.entries(catCounts).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${cat.padEnd(15)} ${count}`);
  }
  console.log();

  if (DRY_RUN) {
    console.log('--- DRY RUN: Preview of entries ---\n');
    for (const e of entries.slice(0, 10)) {
      console.log(`  ${e.slug}`);
      console.log(`    title:    ${e.title}`);
      console.log(`    path:     ${e.path}`);
      console.log(`    category: ${e.category}`);
      console.log(`    tags:     ${e.tags.join(', ')}`);
      console.log(`    status:   ${e.status}`);
      console.log(`    desc:     ${e.description || '(none)'}`);
      console.log();
    }
    if (entries.length > 10) {
      console.log(`  ... and ${entries.length - 10} more\n`);
    }
    console.log('Run without --dry-run to upsert to Supabase.');
    return;
  }

  // 2. Upsert to Supabase
  console.log('Upserting to Supabase file_index...');
  const { upserted, errors } = await upsertToSupabase(
    entries,
    supabaseUrl!,
    serviceKey!
  );
  console.log(`  Upserted: ${upserted}`);
  if (errors.length > 0) {
    console.error(`  Errors: ${errors.length}`);
    for (const e of errors) console.error(`    ${e}`);
  }

  // 3. Trigger Redis sync
  if (!SKIP_REDIS) {
    const workerUrl = process.env.SEARCH_WORKER_URL;
    const syncKey = process.env.SEARCH_SYNC_API_KEY;

    if (workerUrl && syncKey) {
      console.log('\nTriggering Redis index rebuild...');
      const syncResult = await triggerRedisSync(workerUrl, syncKey);
      if (syncResult.ok) {
        console.log('  Redis sync complete:', syncResult.data);
      } else {
        console.error('  Redis sync failed:', syncResult.error);
      }
    } else {
      console.log('\nSkipping Redis sync (SEARCH_WORKER_URL or SEARCH_SYNC_API_KEY not set).');
      console.log('Run the Worker /sync endpoint manually when ready.');
    }
  } else {
    console.log('\nSkipping Redis sync (--skip-redis flag).');
  }

  console.log('\nDone.');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
