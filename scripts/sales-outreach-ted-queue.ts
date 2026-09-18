/**
 * Print Mission Control Sales TED items from the public TED API.
 *
 * No Google login, no Grok login, no ADMIN_API_KEY.
 * Dashboard requireHicAuth is unchanged — this is the CLI/machine path.
 *
 * Usage:
 *   npx tsx scripts/sales-outreach-ted-queue.ts
 *   npx tsx scripts/sales-outreach-ted-queue.ts --limit=10
 *
 * Evidence: Tool=Cursor Grok 4.6 Model=cursor-grok-4.6 Agent=Cursor Agent Date=2026-09-18
 * Audit trail: git log -- scripts/sales-outreach-ted-queue.ts
 */
import { listLiveTedSalesQueue } from '../src/construction-leads/sales-queue.js';

function parseLimit(argv: string[]): number {
  const flag = argv.find((a) => a.startsWith('--limit='));
  if (!flag) return 25;
  const n = Number.parseInt(flag.slice('--limit='.length), 10);
  if (!Number.isFinite(n)) return 25;
  return Math.min(Math.max(n, 1), 50);
}

const limit = parseLimit(process.argv.slice(2));
const items = await listLiveTedSalesQueue(limit);
process.stdout.write(
  `${JSON.stringify(
    {
      source: 'ted-live',
      login: 'none',
      googleLogin: false,
      grokLogin: false,
      count: items.length,
      items,
    },
    null,
    2,
  )}\n`,
);
