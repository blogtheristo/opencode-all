#!/usr/bin/env node

/**
 * DWS Document Staleness Checker
 *
 * Scans docs/*.md and root *.md files for VERSION AND AGENT HISTORY blocks,
 * extracts Last Modified dates, and flags documents not updated in 90+ days.
 *
 * Usage:
 *   node scripts/check-doc-staleness.mjs          # Human-readable report
 *   node scripts/check-doc-staleness.mjs --json    # JSON output
 *
 * Exit code 1 if any documents are flagged as stale.
 */

import { readdir, readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const STALE_THRESHOLD_DAYS = 90;
const ROOT_DIR = resolve(import.meta.dirname, '..');
const DOCS_DIR = join(ROOT_DIR, 'docs');

const args = process.argv.slice(2);
const jsonMode = args.includes('--json');

/**
 * Parse a date string in DD.MM.YYYY or YYYY-MM-DD format.
 * Returns a Date object or null if unparseable.
 */
function parseDate(dateStr) {
  if (!dateStr) return null;
  const trimmed = dateStr.trim();

  // DD.MM.YYYY format
  const dotMatch = trimmed.match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/);
  if (dotMatch) {
    const [, day, month, year] = dotMatch;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  // YYYY-MM-DD format
  const isoMatch = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  return null;
}

/**
 * Extract the Last Modified date from a markdown file's VERSION AND AGENT HISTORY block.
 */
function extractLastModified(content) {
  // Look for "Last Modified:" inside the VERSION AND AGENT HISTORY block
  const historyMatch = content.match(
    /# VERSION AND AGENT HISTORY[\s\S]*?\*\*\*/
  );
  if (!historyMatch) return null;

  const block = historyMatch[0];
  const lastModMatch = block.match(/Last Modified:\s*(.+)/);
  if (lastModMatch) {
    return parseDate(lastModMatch[1]);
  }

  return null;
}

/**
 * Fallback: extract "Last Updated:" from document metadata outside the history block.
 */
function extractLastUpdated(content) {
  const match = content.match(/\*\*Last Updated:\*\*\s*(.+)/);
  if (match) return parseDate(match[1]);
  return null;
}

/**
 * Get all .md files from a directory (non-recursive).
 */
async function getMdFiles(dir) {
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    return entries
      .filter((e) => e.isFile() && e.name.endsWith('.md'))
      .map((e) => join(dir, e.name));
  } catch {
    return [];
  }
}

async function main() {
  const now = new Date();
  const results = [];

  // Collect root *.md and docs/*.md files
  const rootFiles = await getMdFiles(ROOT_DIR);
  const docsFiles = await getMdFiles(DOCS_DIR);
  const allFiles = [...rootFiles, ...docsFiles];

  for (const filePath of allFiles) {
    const content = await readFile(filePath, 'utf-8');
    const relativePath = filePath.replace(ROOT_DIR + '/', '');

    let lastModified = extractLastModified(content);
    if (!lastModified) {
      lastModified = extractLastUpdated(content);
    }

    let daysAgo = null;
    let status = 'NO_DATE';

    if (lastModified) {
      daysAgo = Math.floor((now - lastModified) / (1000 * 60 * 60 * 24));
      status = daysAgo >= STALE_THRESHOLD_DAYS ? 'REVIEW_NEEDED' : 'OK';
    }

    results.push({
      file: relativePath,
      lastModified: lastModified ? lastModified.toISOString().split('T')[0] : null,
      daysAgo,
      status,
    });
  }

  // Sort: REVIEW_NEEDED first, then NO_DATE, then OK
  const statusOrder = { REVIEW_NEEDED: 0, NO_DATE: 1, OK: 2 };
  results.sort((a, b) => {
    const orderDiff = statusOrder[a.status] - statusOrder[b.status];
    if (orderDiff !== 0) return orderDiff;
    // Within same status, sort by daysAgo descending (most stale first)
    return (b.daysAgo ?? 0) - (a.daysAgo ?? 0);
  });

  const flagged = results.filter((r) => r.status === 'REVIEW_NEEDED');
  const noDate = results.filter((r) => r.status === 'NO_DATE');
  const ok = results.filter((r) => r.status === 'OK');

  if (jsonMode) {
    const output = {
      generated: now.toISOString(),
      thresholdDays: STALE_THRESHOLD_DAYS,
      totalFiles: results.length,
      flaggedCount: flagged.length,
      noDateCount: noDate.length,
      okCount: ok.length,
      files: results,
    };
    console.log(JSON.stringify(output, null, 2));
  } else {
    console.log('=== DWS Document Staleness Report ===');
    console.log(`Date: ${now.toISOString().split('T')[0]}`);
    console.log(`Threshold: ${STALE_THRESHOLD_DAYS} days`);
    console.log(`Total files scanned: ${results.length}`);
    console.log('');

    if (flagged.length > 0) {
      console.log(`REVIEW NEEDED (${flagged.length} files, not modified in ${STALE_THRESHOLD_DAYS}+ days):`);
      console.log('-'.repeat(70));
      for (const r of flagged) {
        console.log(`  ${r.file}`);
        console.log(`    Last modified: ${r.lastModified} (${r.daysAgo} days ago)`);
      }
      console.log('');
    }

    if (noDate.length > 0) {
      console.log(`NO DATE FOUND (${noDate.length} files, missing Last Modified in VERSION AND AGENT HISTORY):`);
      console.log('-'.repeat(70));
      for (const r of noDate) {
        console.log(`  ${r.file}`);
      }
      console.log('');
    }

    if (ok.length > 0) {
      console.log(`OK (${ok.length} files, modified within ${STALE_THRESHOLD_DAYS} days):`);
      console.log('-'.repeat(70));
      for (const r of ok) {
        console.log(`  ${r.file} (${r.daysAgo} days ago)`);
      }
      console.log('');
    }

    console.log('---');
    console.log(`Summary: ${flagged.length} stale, ${noDate.length} missing date, ${ok.length} current`);
  }

  // Exit code 1 if any files are flagged
  if (flagged.length > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(2);
});
