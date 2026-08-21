/**
 * Weekly Sales Manager Newsletter — Stage 3 of the sales-manager newsletter automation
 * Auto-discovered by day-runner.sh (scripts/weekly/ convention)
 *
 * Invokes the sales-manager-newsletter agent (Stage 2) via the CLI's HTTP API — requires
 * the dws-backend service running locally (DGX Spark's dws-docker.service keeps it up;
 * see infrastructure/dgx-spark/docker-compose.yml). If the agent reports insufficient
 * live signal data, this exits cleanly without writing anything — a week with too little
 * real data should produce no edition, not a fabricated one.
 *
 * On success: replaces the content between the EDITION-CONTENT-START/END markers in
 * docs/market-research/sales-manager.md, bumps the document version (+0.1 per
 * DWS_DOCUMENT_STANDARD.md §5.2 "updating existing content"), inserts a new VERSION AND
 * AGENT HISTORY entry, writes a fresh row to Supabase knowledge_base (one row per edition,
 * preserving history rather than overwriting), then commits and pushes directly — mirrors
 * scripts/weekly/market-research.sh's self-commit pattern.
 */

import { execFileSync, execSync } from 'child_process';
import { readFile, writeFile } from 'fs/promises';
import { resolve } from 'path';
import { fileURLToPath } from 'url';

const CURRENT_DIR = resolve(fileURLToPath(import.meta.url), '..');
const REPO_ROOT = resolve(CURRENT_DIR, '..', '..');
const SALES_MANAGER_PATH = resolve(REPO_ROOT, 'docs', 'market-research', 'sales-manager.md');

const START_MARKER =
  '<!-- EDITION-CONTENT-START — scripts/weekly/sales-manager-newsletter.ts replaces everything between these two markers on each automated run. Do not remove the markers; hand edits inside this block will be overwritten by the next scheduled run. -->';
const END_MARKER = '<!-- EDITION-CONTENT-END -->';

interface AgentResponseShape {
  result?: {
    insufficientData?: boolean;
    edition?: string | null;
    storiesUsed?: number;
    signalsScanned?: number;
  };
  reasoning?: string;
  confidence?: number;
}

function log(msg: string): void {
  console.log(`[${new Date().toISOString()}] [sales-manager-newsletter] ${msg}`);
}

function runAgent(): AgentResponseShape {
  const input = JSON.stringify({ lookbackDays: 7, minStories: 3 });
  const cmd = `cd "${resolve(REPO_ROOT, 'cli')}" && npx tsx src/cli.ts run sales-manager-newsletter --input '${input.replace(/'/g, "'\\''")}'`;
  const stdout = execSync(cmd, { encoding: 'utf-8', timeout: 300_000 });
  return JSON.parse(stdout) as AgentResponseShape;
}

function bumpVersion(current: string): string {
  const [major, minor] = current.split('.').map(Number);
  if (Number.isNaN(major) || Number.isNaN(minor)) return current;
  return `${major}.${minor + 1}`;
}

async function updateSalesManagerFile(edition: string, editionDate: string): Promise<string> {
  const content = await readFile(SALES_MANAGER_PATH, 'utf-8');

  const startIdx = content.indexOf(START_MARKER);
  const endIdx = content.indexOf(END_MARKER);
  if (startIdx === -1 || endIdx === -1) {
    throw new Error(
      `EDITION-CONTENT markers not found in ${SALES_MANAGER_PATH} — refusing to blind-overwrite. Add the markers manually first.`,
    );
  }

  const versionMatch = content.match(/^Version:\s*([\d.]+)/m);
  const currentVersion = versionMatch ? versionMatch[1] : '1.0';
  const newVersion = bumpVersion(currentVersion);
  const dateStr = new Date().toLocaleDateString('en-GB').split('/').join('.'); // DD.MM.YYYY

  let updated =
    content.slice(0, startIdx + START_MARKER.length) +
    '\n\n' +
    edition +
    '\n\n' +
    content.slice(endIdx);

  updated = updated.replace(/^Version:\s*[\d.]+/m, `Version: ${newVersion}`);

  const historyEntry = `- Version: ${newVersion} | Tool: sales-manager-newsletter agent (automated) | Session: scripts/weekly/sales-manager-newsletter.ts | Date: ${dateStr} | Changes: Edition ${editionDate} auto-generated from live market_signals (Stage 1: scripts/collect_regulatory_signals.py) + news-to-signal.sh incident data. Not yet run through /truth-check — see Provenance note.`;
  updated = updated.replace(/(Sessions & Modifications:\n\n)/, `$1${historyEntry}\n`);

  updated = updated.replace(/^- Last Modified:.*$/m, `- Last Modified: ${dateStr}`);

  await writeFile(SALES_MANAGER_PATH, updated, 'utf-8');
  return newVersion;
}

async function writeToKnowledgeBase(edition: string, editionDate: string): Promise<void> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) {
    log('SUPABASE_URL/SUPABASE_SERVICE_KEY not set — skipping knowledge_base write');
    return;
  }

  const resp = await fetch(`${url}/rest/v1/knowledge_base`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: key,
      Authorization: `Bearer ${key}`,
      Prefer: 'return=representation',
    },
    body: JSON.stringify({
      category: 'market-intelligence',
      title: `Sales Manager — Custom Industrial Intelligence Newsletter — Edition ${editionDate} (auto)`,
      content: edition,
      metadata: {
        edition_date: editionDate,
        source: 'sales-manager-newsletter agent (automated, Stage 2+3)',
        verified: false,
        verification_note:
          'Not yet run through /truth-check — automated synthesis from market_signals + news-to-signal.sh',
        repo_file: 'docs/market-research/sales-manager.md',
        generated_by: 'scripts/weekly/sales-manager-newsletter.ts',
      },
    }),
  });

  if (!resp.ok) {
    const body = await resp.text();
    log(`knowledge_base write failed: ${resp.status} ${body}`);
    return;
  }
  log('knowledge_base row written');
}

function commitAndPush(version: string, editionDate: string): void {
  try {
    execFileSync('git', ['config', 'user.name', 'DGX Spark'], { cwd: REPO_ROOT });
    execFileSync('git', ['config', 'user.email', 'risto@onelifetime.world'], { cwd: REPO_ROOT });
    execFileSync('git', ['add', 'docs/market-research/sales-manager.md'], { cwd: REPO_ROOT });

    const hasStagedChanges = (() => {
      try {
        execFileSync('git', ['diff', '--cached', '--quiet'], { cwd: REPO_ROOT });
        return false;
      } catch {
        return true;
      }
    })();
    if (!hasStagedChanges) {
      log('No changes to commit');
      return;
    }

    execFileSync(
      'git',
      ['commit', '-m', `chore(sales-manager): auto edition ${editionDate} (v${version})`],
      { cwd: REPO_ROOT },
    );
    execFileSync('git', ['push', 'origin', 'main'], { cwd: REPO_ROOT });
    log(`Committed and pushed v${version}`);
  } catch (err) {
    log(
      `Commit/push failed (will retry next run): ${err instanceof Error ? err.message : String(err)}`,
    );
  }
}

async function main(): Promise<void> {
  log('Starting weekly sales-manager newsletter generation...');

  let agentResponse: AgentResponseShape;
  try {
    agentResponse = runAgent();
  } catch (err) {
    log(`Agent invocation failed: ${err instanceof Error ? err.message : String(err)}`);
    log('Check dws-backend is running: docker compose ps (infrastructure/dgx-spark/)');
    process.exitCode = 1;
    return;
  }

  if (agentResponse.result?.insufficientData || !agentResponse.result?.edition) {
    log(`No edition generated: ${agentResponse.reasoning || 'insufficient data'}`);
    log('This is expected behavior, not a failure — see agent recommendations for what to check.');
    return;
  }

  const editionDate = new Date().toISOString().split('T')[0];
  const edition = agentResponse.result.edition;

  try {
    const newVersion = await updateSalesManagerFile(edition, editionDate);
    await writeToKnowledgeBase(edition, editionDate);
    commitAndPush(newVersion, editionDate);
    log(
      `Done: ${agentResponse.result.storiesUsed ?? 0} stories from ${agentResponse.result.signalsScanned ?? 0} signals -> v${newVersion}`,
    );
  } catch (err) {
    log(`File update failed: ${err instanceof Error ? err.message : String(err)}`);
    process.exitCode = 1;
  }
}

main();
