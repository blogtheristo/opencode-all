// Evidence: Tool=Claude Code Model=undisclosed-in-source (see commit trailer) Agent=claude Date=2026-09-13
// Audit trail: git log -- scripts/lib/agent-files.mjs
/**
 * agent-files.mjs — the one place that answers "which agents exist?"
 *
 * `scripts/sync-agents-md.mjs` (generator) and `scripts/verify-agents-md.mjs`
 * (verifier) both used a flat `readdirSync(src/agents)`. `src/agents/` holds 75
 * `*.agent.ts` files, 32 of them in subdirectories — so both saw 57% of the tree
 * under a heading that reads "Platform Agents (`src/agents/`)", and AGENTS.md
 * carried the claim "verified against the filesystem" for a check that could not
 * see 32 of the files it claimed to verify.
 *
 * Shared rather than duplicated: the defect was two copies of one traversal
 * drifting from the directory they describe. A third copy would reintroduce it.
 */

import { readdirSync } from 'fs';
import { join } from 'path';

/** Files in `src/agents/` that are infrastructure, not agents. */
const NOT_AGENTS = ['base', 'types', 'index'];

/**
 * Every `*.agent.ts` under `dir`, at any depth, as `{ name, path }`.
 * `name` is the basename with `.agent.ts` stripped.
 */
export function* walkAgents(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walkAgents(full);
    } else if (entry.name.endsWith('.agent.ts')) {
      const name = entry.name.replace('.agent.ts', '');
      if (!NOT_AGENTS.includes(name)) yield { name, path: full };
    }
  }
}

/**
 * Map of bare agent name -> path on disk.
 *
 * Basenames are unique across the tree, so the bare name remains the key
 * AGENTS.md rows are matched on. A future collision would be silently lost
 * here, so it throws instead.
 */
export function agentPathsByName(dir) {
  const paths = new Map();
  for (const { name, path } of walkAgents(dir)) {
    const clash = paths.get(name);
    if (clash) {
      throw new Error(
        `Two agents share the basename "${name}" (${clash} and ${path}). ` +
          'AGENTS.md keys rows on the bare name; give one of them a distinct filename.',
      );
    }
    paths.set(name, path);
  }
  return paths;
}

/** Sorted bare agent names under `dir`, at any depth. */
export function agentNames(dir) {
  return [...agentPathsByName(dir).keys()].sort();
}
