/**
 * apply-model-updates.ts
 *
 * Takes ACTION on the model drift that llm-currency-check.sh reports: rewrites
 * every deprecated model id referenced in src/agents/* to its registry
 * `replacement`. This is the counterpart to the report — the report tells you
 * what is stale; this changes it.
 *
 * HIC-gated by design (swapping a production model is a behavior + cost change,
 * a RED-zone action in the auto-mode trust boundary):
 *   npx tsx scripts/apply-model-updates.ts            # DRY-RUN (default) — shows the diff, writes nothing
 *   npx tsx scripts/apply-model-updates.ts --apply    # writes the changes
 *   npx tsx scripts/apply-model-updates.ts --apply --only claude-sonnet-4-6
 *
 * Only migrates models the registry marks `deprecated` AND gives a `replacement`.
 * `suspended` models are reported but NOT auto-rewritten — a suspension needs a
 * fallback decision, not a blind swap. `retired` with a replacement is migrated.
 *
 * Never touches products.json / customer copy. Never sends email.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const REGISTRY = path.join(ROOT, 'config', 'llm-registry.json');
const AGENTS_DIR = path.join(ROOT, 'src', 'agents');

const argv = process.argv.slice(2);
const APPLY = argv.includes('--apply');
const onlyIdx = argv.indexOf('--only');
const ONLY = onlyIdx >= 0 ? argv[onlyIdx + 1] : null;

interface RegistryModel {
  id: string;
  status: string;
  replacement?: string;
}

function walkTs(dir: string): string[] {
  let out: string[] = [];
  let entries: fs.Dirent[] = [];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out = out.concat(walkTs(p));
    else if (e.isFile() && p.endsWith('.ts')) out.push(p);
  }
  return out;
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function main() {
  const registry = JSON.parse(fs.readFileSync(REGISTRY, 'utf8')) as { models: RegistryModel[] };

  const migrations = registry.models.filter(
    (m) =>
      (m.status === 'deprecated' || m.status === 'retired') &&
      m.replacement &&
      (!ONLY || m.id === ONLY),
  );

  if (!migrations.length) {
    console.log(
      '[apply] no deprecated/retired models with a replacement to migrate' +
        (ONLY ? ` (filter: ${ONLY})` : ''),
    );
    return;
  }

  const files = walkTs(AGENTS_DIR);
  let totalEdits = 0;
  const changedFiles: string[] = [];

  for (const file of files) {
    const original = fs.readFileSync(file, 'utf8');
    let updated = original;
    let fileEdits = 0;

    for (const m of migrations) {
      const re = new RegExp(escapeRe(m.id), 'g');
      const count = (updated.match(re) || []).length;
      if (count > 0) {
        updated = updated.replace(re, m.replacement as string);
        fileEdits += count;
        console.log(`  ${path.relative(ROOT, file)}: ${m.id} -> ${m.replacement} (${count}x)`);
      }
    }

    if (fileEdits > 0) {
      totalEdits += fileEdits;
      changedFiles.push(path.relative(ROOT, file));
      if (APPLY) fs.writeFileSync(file, updated);
    }
  }

  console.log('');
  if (totalEdits === 0) {
    console.log('[apply] nothing to change — no deprecated ids found in src/agents');
    return;
  }

  if (APPLY) {
    console.log(
      `[apply] WROTE ${totalEdits} replacement(s) across ${changedFiles.length} file(s).`,
    );
    console.log('[apply] Review with: git diff -- src/agents');
    console.log('[apply] Then build + test before committing (npm run build && npm test).');
  } else {
    console.log(
      `[apply] DRY-RUN — ${totalEdits} replacement(s) across ${changedFiles.length} file(s). Nothing written.`,
    );
    console.log('[apply] Re-run with --apply to write these changes.');
  }
  console.log(
    '[apply] NOTE: suspended models (e.g. claude-fable-5) are reported by the weekly task but NOT auto-migrated — they need a fallback decision.',
  );
}

main();
