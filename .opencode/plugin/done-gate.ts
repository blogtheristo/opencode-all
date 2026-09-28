// Evidence: Tool=Claude Code Model=anthropic Agent=agent-done-gate Date=2026-09-28
// Audit trail: git log -- .opencode/plugin/done-gate.ts
/**
 * done-gate.ts — verify "done" claims before the HIC reads them.
 *
 * When a session goes idle and its last answer claims completion ("done", "fixed",
 * "all tests pass", ✅ …) while the checkout has work in it, run
 * scripts/agent-done-gate.mjs --full. On failure the gate's output is sent back into
 * the same session as a new prompt, so the model has to fix the FAILs instead of the
 * HIC finding them. At most MAX_ROUNDS per session, then it stops and says so.
 * On success the gate's evidence is appended to the session (no model reply), so the
 * HIC sees facts next to the claim.
 *
 * Opt out for one session: DWS_DONE_GATE=0 opencode
 */
import type { Plugin } from '@opencode-ai/plugin';
import { execFileSync, spawnSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

const CLAIM_RE =
  /\b(done|completed?|finished|fixed|resolved|implemented|fully (closed|satisfied)|all tests pass(ed)?|successfully|ready (to|for) (merge|review|ship))\b|✅/i;
const MAX_ROUNDS = 3;

function hasWork(dir: string): boolean {
  const git = (...a: string[]) =>
    execFileSync('git', a, {
      cwd: dir,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  try {
    if (git('status', '--porcelain', '--untracked-files=no')) return true;
    return Number(git('rev-list', '--count', 'origin/main..HEAD')) > 0;
  } catch {
    return false;
  }
}

export const DoneGate = (async ({ client, directory }) => {
  const rounds = new Map<string, number>();
  const checked = new Map<string, string>(); // sessionID → last assistant message already gated
  const since = new Map<string, string>(); // sessionID → HEAD when this run of the session began
  const busy = new Set<string>();

  return {
    // First user message of a run: remember where the work starts, so the gate judges
    // only what this session did, not what the branch already contained.
    'chat.message': async ({ sessionID }) => {
      if (since.has(sessionID)) return;
      try {
        since.set(
          sessionID,
          execFileSync('git', ['rev-parse', 'HEAD'], { cwd: directory, encoding: 'utf8' }).trim(),
        );
      } catch {
        /* not a git checkout — gate falls back to the merge base */
      }
    },
    event: async ({ event }) => {
      if (event.type !== 'session.idle' || process.env.DWS_DONE_GATE === '0') return;
      const sessionID = (event as { properties: { sessionID: string } }).properties.sessionID;
      if (busy.has(sessionID) || (rounds.get(sessionID) ?? 0) > MAX_ROUNDS) return;
      const gate = join(directory, 'scripts', 'agent-done-gate.mjs');
      if (!existsSync(gate) || !hasWork(directory)) return;

      const res = await client.session.messages({ path: { id: sessionID } });
      const msgs = (res.data ?? []) as Array<{
        info: { id: string; role: string };
        parts: Array<{ type: string; text?: string }>;
      }>;
      const last = [...msgs].reverse().find((m) => m.info.role === 'assistant');
      const text = (last?.parts ?? [])
        .filter((p) => p.type === 'text')
        .map((p) => p.text ?? '')
        .join('\n');
      // Our own noReply messages also end in session.idle: never gate the same answer twice.
      if (!last || checked.get(sessionID) === last.info.id || !CLAIM_RE.test(text)) return;
      checked.set(sessionID, last.info.id);

      busy.add(sessionID);
      try {
        const base = since.get(sessionID);
        const r = spawnSync('node', [gate, '--full', ...(base ? ['--since', base] : [])], {
          cwd: directory,
          encoding: 'utf8',
          maxBuffer: 64 * 1024 * 1024,
          timeout: 20 * 60 * 1000,
        });
        const out = `${r.stdout ?? ''}${r.stderr ?? ''}`.trim();
        const n = (rounds.get(sessionID) ?? 0) + 1;

        if (r.status === 0) {
          rounds.delete(sessionID);
          await client.session.promptAsync({
            path: { id: sessionID },
            body: {
              noReply: true,
              parts: [{ type: 'text', text: `[done-gate] verified:\n${out}` }],
            },
          });
          return;
        }

        rounds.set(sessionID, n);
        const text =
          n > MAX_ROUNDS
            ? `[done-gate] still NOT DONE after ${MAX_ROUNDS} rounds — stopping. HIC: read the FAILs below; the last summary is not accurate.\n\n${out}`
            : [
                `[done-gate] Your last message claims the work is done. The repository says otherwise (round ${n}/${MAX_ROUNDS}):`,
                '',
                out,
                '',
                'Fix every FAIL. Do not summarise or restate success. When fixed, run `node scripts/agent-done-gate.mjs --full` yourself and paste its raw output as your final answer.',
              ].join('\n');
        await client.session.promptAsync({
          path: { id: sessionID },
          body: { noReply: n > MAX_ROUNDS, parts: [{ type: 'text', text }] },
        });
      } finally {
        busy.delete(sessionID);
      }
    },
  };
}) satisfies Plugin;

export default DoneGate;
