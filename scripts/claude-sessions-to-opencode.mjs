#!/usr/bin/env node
// Evidence: Tool=OpenCode 1.18.21 Model=opencode/x-preview-f-free (ox-alpha) Date=2026-08-24
// Audit trail: git log -- scripts/claude-sessions-to-opencode.mjs
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, basename } from 'node:path';
import { homedir } from 'node:os';

const args = process.argv.slice(2);
const doImport = !args.includes('--no-import');
const projectDir = args.find((a) => !a.startsWith('--')) ?? join(homedir(), '.claude', 'projects', '-home-admin100-dws6');
const outDir = '/tmp/opencode/claude-import';
const DIR = process.cwd();
const PROVIDER = 'claude-code';
const MODEL = 'claude-code-import';

mkdirSync(outDir, { recursive: true });

const textOf = (content) => {
  if (typeof content === 'string') return content;
  if (!Array.isArray(content)) return '';
  return content
    .filter((b) => b.type === 'text' && b.text)
    .map((b) => b.text)
    .join('\n')
    .trim();
};

const part = (mid, sid, text) => ({
  type: 'text',
  text,
  id: `prt_${mid}`,
  sessionID: sid,
  messageID: mid,
});

let converted = 0;

for (const f of readdirSync(projectDir)) {
  if (!f.endsWith('.jsonl')) continue;
  const path = join(projectDir, f);
  const uuid = basename(f, '.jsonl');
  const sid = `ses_${uuid.replaceAll('-', '')}`;

  const messages = [];
  let created = Date.now();
  let updated = 0;
  let prevMid = null;

  for (const line of readFileSync(path, 'utf8').split('\n')) {
    if (!line.trim()) continue;
    let rec;
    try {
      rec = JSON.parse(line);
    } catch {
      continue;
    }
    if (rec.isSidechain) continue;
    if (rec.type !== 'user' && rec.type !== 'assistant') continue;
    const msg = rec.message;
    if (!msg || msg.role !== rec.type) continue;
    const text = textOf(msg.content);
    if (!text) continue;
    const ts = rec.timestamp ? Date.parse(rec.timestamp) : Date.now();
    created = Math.min(created, ts);
    updated = Math.max(updated, ts);
    const mid = `msg_${uuid.slice(0, 12)}${String(messages.length).padStart(6, '0')}`;

    if (rec.type === 'user') {
      messages.push({
        info: {
          role: 'user',
          time: { created: ts },
          agent: 'build',
          model: { providerID: PROVIDER, modelID: MODEL },
          summary: { diffs: [] },
          id: mid,
          sessionID: sid,
        },
        parts: [part(mid, sid, text)],
      });
    } else {
      messages.push({
        info: {
          parentID: prevMid ?? mid,
          role: 'assistant',
          mode: 'build',
          agent: 'build',
          path: { cwd: DIR, root: DIR },
          cost: 0,
          tokens: { total: 0, input: 0, output: 0, reasoning: 0, cache: { write: 0, read: 0 } },
          modelID: MODEL,
          providerID: PROVIDER,
          time: { created: ts, completed: ts },
          finish: 'stop',
          id: mid,
          sessionID: sid,
        },
        parts: [part(mid, sid, text)],
      });
    }
    prevMid = mid;
  }

  if (messages.length === 0) continue;

  const firstUser = messages.find((m) => m.info.role === 'user');
  const title = (firstUser ? firstUser.parts[0].text : 'Claude Code import').split('\n')[0].slice(0, 80);

  const payload = {
    info: {
      id: sid,
      slug: uuid.slice(0, 12),
      projectID: '6f82607c0d1f54e37a2d63c86c32d7c1dab9e422',
      directory: DIR,
      path: '',
      title,
      agent: 'build',
      model: { id: MODEL, providerID: PROVIDER, variant: 'default' },
      version: '1.18.21',
      summary: { additions: 0, deletions: 0, files: 0 },
      cost: 0,
      tokens: { input: 0, output: 0, reasoning: 0, cache: { read: 0, write: 0 } },
      time: { created, updated },
    },
    messages,
  };

  const outFile = join(outDir, `${sid}.json`);
  writeFileSync(outFile, JSON.stringify(payload));

  if (doImport) {
    const { execFileSync } = await import('node:child_process');
    execFileSync('opencode', ['import', outFile], { stdio: 'pipe' });
  }
  converted++;
}

console.log(`converted ${converted} claude code session(s) -> ${doImport ? 'imported into opencode' : outDir}`);
