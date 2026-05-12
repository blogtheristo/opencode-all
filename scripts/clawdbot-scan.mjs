#!/usr/bin/env node
// clawdbot-scan.mjs — Mine Claude Code session transcripts for unfinished work.
//
// Reads ~/.claude/projects/<encoded-repo-path>/*.jsonl, digests each session,
// and writes one Markdown plan per session with pending work to
// .claude/clawdbot/queue/<short-id>.md. State (processed/dismissed/done)
// is kept in .claude/clawdbot/state.json.
//
// Usage:
//   node scripts/clawdbot-scan.mjs            # scan + write queue
//   node scripts/clawdbot-scan.mjs --list     # print current queue (json)
//   node scripts/clawdbot-scan.mjs --status   # print summary counts
//   node scripts/clawdbot-scan.mjs --dismiss <id>
//   node scripts/clawdbot-scan.mjs --done <id>
//   node scripts/clawdbot-scan.mjs --max-age 30   # ignore sessions older than N days

import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { join, resolve, basename } from 'node:path';
import { homedir } from 'node:os';
import { spawnSync } from 'node:child_process';

const REPO_ROOT = resolve(process.cwd());
const PROJECT_ENCODED = REPO_ROOT.replace(/[\/\\]/g, '-'); // "-home-user-dws6"
const TRANSCRIPT_DIR = join(homedir(), '.claude', 'projects', PROJECT_ENCODED);
const CLAWD_DIR = join(REPO_ROOT, '.claude', 'clawdbot');
const QUEUE_DIR = join(CLAWD_DIR, 'queue');
const STATE_FILE = join(CLAWD_DIR, 'state.json');

function ensureDirs() {
  for (const d of [CLAWD_DIR, QUEUE_DIR]) {
    if (!existsSync(d)) mkdirSync(d, { recursive: true });
  }
}

function loadState() {
  if (!existsSync(STATE_FILE)) return { sessions: {} };
  try {
    return JSON.parse(readFileSync(STATE_FILE, 'utf8'));
  } catch {
    return { sessions: {} };
  }
}

function saveState(state) {
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function shortId(sid) {
  return sid.slice(0, 8);
}

function parseArgs(argv) {
  const args = {
    command: 'scan',
    maxAgeDays: 30,
    target: null,
    exclude: [],
    liveWindowSec: 300,
    model: 'llama3.1:70b',
    dryRun: false,
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--list') args.command = 'list';
    else if (a === '--status') args.command = 'status';
    else if (a === '--dismiss') {
      args.command = 'dismiss';
      args.target = argv[++i];
    } else if (a === '--done') {
      args.command = 'done';
      args.target = argv[++i];
    } else if (a === '--preview') {
      args.command = 'preview';
      args.target = argv[++i];
    } else if (a === '--enrich') {
      args.command = 'enrich';
      args.target = argv[++i];
    } else if (a === '--model') args.model = argv[++i];
    else if (a === '--dry-run') args.dryRun = true;
    else if (a === '--max-age') args.maxAgeDays = parseInt(argv[++i], 10);
    else if (a === '--exclude') args.exclude.push(argv[++i]);
    else if (a === '--live-window') args.liveWindowSec = parseInt(argv[++i], 10);
    else if (a === '--help' || a === '-h') args.command = 'help';
  }
  return args;
}

// Identify the currently-running session so we don't queue ourselves.
// Strategy (in order):
//   1. CLAUDE_SESSION_ID env var (set by Claude Code in some environments).
//   2. --exclude <id> flags (caller-supplied; may be short or full id).
//   3. Heuristic: the jsonl file whose mtime is within liveWindowSec of now.
function detectLiveSession(transcriptDir, liveWindowSec) {
  const env = process.env.CLAUDE_SESSION_ID;
  if (env) return { id: env, source: 'env' };
  if (!existsSync(transcriptDir)) return null;
  const now = Date.now();
  let newest = null;
  for (const f of readdirSync(transcriptDir)) {
    if (!f.endsWith('.jsonl')) continue;
    const full = join(transcriptDir, f);
    const mtime = statSync(full).mtimeMs;
    if (now - mtime > liveWindowSec * 1000) continue;
    if (!newest || mtime > newest.mtime) {
      newest = { id: basename(f, '.jsonl'), mtime, source: 'mtime' };
    }
  }
  return newest;
}

function matchesId(sid, target) {
  if (!target) return false;
  return sid === target || shortId(sid) === target;
}

// --- transcript parsing ---------------------------------------------------

function readJsonl(file) {
  const lines = readFileSync(file, 'utf8').split('\n').filter(Boolean);
  const events = [];
  for (const line of lines) {
    try {
      events.push(JSON.parse(line));
    } catch {
      /* skip malformed */
    }
  }
  return events;
}

// Heuristic: a session has "pending work" if any of:
//  - last assistant message contains follow-up phrasing
//  - last TodoWrite call has pending/in_progress items
//  - session ended mid-tool-use (no final assistant text after last tool)
const FOLLOWUP_PATTERNS = [
  /\bnext step/i,
  /\bwould you like\b/i,
  /\bshould I\b/i,
  /\bfollow[- ]?up/i,
  /\bremaining\b/i,
  /\bTODO\b/,
  /\bnot yet\b/i,
  /\bto do\b/i,
  /\bcontinue\b/i,
  /\bpending\b/i,
];

function extractText(content) {
  if (!content) return '';
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    return content
      .map((c) => (typeof c === 'string' ? c : c?.text || ''))
      .filter(Boolean)
      .join('\n');
  }
  return content?.text || '';
}

function digest(events, sessionId) {
  const userMsgs = [];
  const assistantMsgs = [];
  let lastTodos = null;
  const filesTouched = new Set();
  let firstTs = null;
  let lastTs = null;
  let branch = null;

  for (const ev of events) {
    if (ev.timestamp) {
      if (!firstTs) firstTs = ev.timestamp;
      lastTs = ev.timestamp;
    }
    if (ev.gitBranch && !branch) branch = ev.gitBranch;
    if (ev.cwd && ev.cwd.includes('worktree')) branch = branch || 'worktree';

    if (ev.type === 'user' && ev.message?.content) {
      const text = extractText(ev.message.content).trim();
      if (text && !text.startsWith('<')) userMsgs.push(text);
    }
    if (ev.type === 'assistant' && ev.message?.content) {
      const text = extractText(ev.message.content).trim();
      if (text) assistantMsgs.push(text);
    }
    // Track file edits
    if (ev.type === 'tool_use' || ev.toolUseResult) {
      const name = ev.message?.content?.find?.((c) => c?.type === 'tool_use')?.name;
      const input = ev.message?.content?.find?.((c) => c?.type === 'tool_use')?.input;
      if (name && /^(Edit|Write|Read|NotebookEdit)$/.test(name) && input?.file_path) {
        filesTouched.add(input.file_path);
      }
      if (name === 'TodoWrite' && input?.todos) {
        lastTodos = input.todos;
      }
    }
    if (ev.message?.content && Array.isArray(ev.message.content)) {
      for (const c of ev.message.content) {
        if (c?.type === 'tool_use') {
          if (/^(Edit|Write|NotebookEdit)$/.test(c.name) && c.input?.file_path) {
            filesTouched.add(c.input.file_path);
          }
          if (c.name === 'TodoWrite' && c.input?.todos) {
            lastTodos = c.input.todos;
          }
        }
      }
    }
  }

  const firstUser = userMsgs[0] || '(no user prompt)';
  const lastUser = userMsgs[userMsgs.length - 1] || '';
  const lastAssistant = assistantMsgs[assistantMsgs.length - 1] || '';

  const pendingTodos = (lastTodos || []).filter(
    (t) => t.status === 'pending' || t.status === 'in_progress',
  );
  const followupHit = FOLLOWUP_PATTERNS.some((re) => re.test(lastAssistant));
  const hasPending = pendingTodos.length > 0 || followupHit;

  return {
    sessionId,
    firstTs,
    lastTs,
    branch: branch || 'unknown',
    firstUser: firstUser.slice(0, 500),
    lastUser: lastUser.slice(0, 500),
    lastAssistant: lastAssistant.slice(0, 1500),
    filesTouched: [...filesTouched].slice(0, 20),
    pendingTodos,
    hasPending,
    eventCount: events.length,
    userMsgCount: userMsgs.length,
  };
}

// --- queue file format ----------------------------------------------------

function renderQueueMd(d) {
  const sid = d.sessionId;
  const todoBlock = d.pendingTodos.length
    ? d.pendingTodos.map((t) => `- [ ] ${t.content} _(${t.status})_`).join('\n')
    : '_(no explicit TODOs — inferred from follow-up phrasing)_';

  const filesBlock = d.filesTouched.length
    ? d.filesTouched.map((f) => `- \`${f.replace(REPO_ROOT + '/', '')}\``).join('\n')
    : '_(none recorded)_';

  return `# Clawdbot Plan — session ${shortId(sid)}

> Generated: ${new Date().toISOString()}
> Source session: \`${sid}\`
> Branch at end: \`${d.branch}\`
> First seen: ${d.firstTs} → Last seen: ${d.lastTs}
> Events: ${d.eventCount} | User turns: ${d.userMsgCount}

## Original ask

> ${d.firstUser.replace(/\n/g, '\n> ')}

## Pending TODOs

${todoBlock}

## Last assistant signal (why this is queued)

> ${d.lastAssistant.replace(/\n/g, '\n> ')}

## Files touched in that session

${filesBlock}

## Proposed continuation plan

_Fill in or accept defaults before approving:_

1. Re-read the files above to confirm current state.
2. Resume from the pending TODO list (top item first).
3. Run the project build + test sequence per CLAUDE.md before commit.
4. Commit to branch \`${d.branch}\` only if it matches the active claude/* branch.

## HIL Approval

To run this in a fresh session, paste the contents of this file as the first prompt
and start the new session in **plan mode** (so the agent confirms the plan before
touching files). After the run completes, mark this item done:

\`\`\`
node scripts/clawdbot-scan.mjs --done ${shortId(sid)}
\`\`\`

To dismiss without running:

\`\`\`
node scripts/clawdbot-scan.mjs --dismiss ${shortId(sid)}
\`\`\`
`;
}

// --- commands -------------------------------------------------------------

function isFresh(d, maxAgeDays) {
  if (!d.lastTs) return false;
  const ageMs = Date.now() - new Date(d.lastTs).getTime();
  return ageMs <= maxAgeDays * 24 * 60 * 60 * 1000;
}

function cmdScan(args) {
  ensureDirs();
  const state = loadState();

  if (!existsSync(TRANSCRIPT_DIR)) {
    console.log(JSON.stringify({ ok: false, error: `No transcript dir: ${TRANSCRIPT_DIR}` }));
    return;
  }

  const files = readdirSync(TRANSCRIPT_DIR).filter((f) => f.endsWith('.jsonl'));
  const live = detectLiveSession(TRANSCRIPT_DIR, args.liveWindowSec);
  const queued = [];
  let scanned = 0;
  let skippedStale = 0;
  let skippedNoWork = 0;
  let skippedHandled = 0;
  let skippedLive = 0;

  for (const f of files) {
    const full = join(TRANSCRIPT_DIR, f);
    const sid = basename(f, '.jsonl');
    if (live && sid === live.id) {
      skippedLive++;
      continue;
    }
    if (args.exclude.some((t) => matchesId(sid, t))) {
      skippedLive++;
      continue;
    }

    const entry = state.sessions[sid];
    if (entry && (entry.status === 'dismissed' || entry.status === 'done')) {
      skippedHandled++;
      continue;
    }

    let events;
    try {
      events = readJsonl(full);
    } catch {
      continue;
    }
    if (events.length < 2) continue;

    const d = digest(events, sid);
    scanned++;

    if (!isFresh(d, args.maxAgeDays)) {
      skippedStale++;
      continue;
    }
    if (!d.hasPending) {
      skippedNoWork++;
      continue;
    }

    const queueFile = join(QUEUE_DIR, `${shortId(sid)}.md`);
    writeFileSync(queueFile, renderQueueMd(d));

    state.sessions[sid] = {
      status: 'pending',
      shortId: shortId(sid),
      queueFile: queueFile.replace(REPO_ROOT + '/', ''),
      branch: d.branch,
      lastTs: d.lastTs,
      summary: d.firstUser.slice(0, 120),
    };
    queued.push(shortId(sid));
  }

  saveState(state);
  console.log(
    JSON.stringify(
      {
        ok: true,
        scanned,
        queued: queued.length,
        skippedStale,
        skippedNoWork,
        skippedHandled,
        skippedLive,
        liveSession: live ? { id: live.id, source: live.source } : null,
        queueDir: QUEUE_DIR.replace(REPO_ROOT + '/', ''),
        items: queued,
      },
      null,
      2,
    ),
  );
}

function cmdList() {
  const state = loadState();
  const items = Object.entries(state.sessions)
    .filter(([, v]) => v.status === 'pending')
    .map(([sid, v]) => ({ sessionId: sid, ...v }))
    .sort((a, b) => (b.lastTs || '').localeCompare(a.lastTs || ''));
  console.log(JSON.stringify({ ok: true, count: items.length, items }, null, 2));
}

function cmdStatus() {
  const state = loadState();
  const counts = { pending: 0, dismissed: 0, done: 0 };
  for (const v of Object.values(state.sessions)) {
    counts[v.status] = (counts[v.status] || 0) + 1;
  }
  console.log(
    JSON.stringify({ ok: true, counts, total: Object.keys(state.sessions).length }, null, 2),
  );
}

// Classify a file path into a trust zone per .claude SessionStart hook policy.
// RED  — DB migrations, deploys, thesis, store sync, secrets
// YELLOW — MCP config, agent skills, docker, gh CLI scripts, mcp-servers
// GREEN — everything else (code, tests, docs, lint config)
const RED_PATTERNS = [
  /^supabase\/migrations\//i,
  /^docs\/metropolia\/master-thesis\//i,
  /^docs\/PHD_FIREHORSE_(EN|FI)\.md$/i,
  /^Store\//i,
  /^Learn\/.*thesis/i,
  /\.env(\.|$)/i,
  /(credentials|service-account|secrets?)\..*$/i,
  /^scripts\/on-deploy\//i,
  /Deploy[-_]/i,
];
const YELLOW_PATTERNS = [
  /^\.mcp\.json$/i,
  /^mcp-hub\//i,
  /^mcp-servers\//i,
  /^\.claude\/(hooks|commands)\//i,
  /^skills\//i,
  /Dockerfile|docker-compose/i,
  /^\.github\/workflows\//i,
];

function classifyPath(p) {
  const rel = p.replace(REPO_ROOT + '/', '');
  if (RED_PATTERNS.some((re) => re.test(rel))) return 'RED';
  if (YELLOW_PATTERNS.some((re) => re.test(rel))) return 'YELLOW';
  return 'GREEN';
}

function cmdPreview(target) {
  if (!target) {
    console.error('Missing target id');
    process.exit(2);
  }
  const state = loadState();
  let matched = null;
  for (const sid of Object.keys(state.sessions)) {
    if (sid === target || shortId(sid) === target) {
      matched = sid;
      break;
    }
  }
  if (!matched) {
    console.error(`No session matches: ${target}`);
    process.exit(3);
  }

  const transcriptPath = join(TRANSCRIPT_DIR, `${matched}.jsonl`);
  if (!existsSync(transcriptPath)) {
    console.error(`Transcript missing: ${transcriptPath}`);
    process.exit(4);
  }
  const events = readJsonl(transcriptPath);
  const d = digest(events, matched);

  const zones = { GREEN: 0, YELLOW: 0, RED: 0 };
  const perFile = d.filesTouched.map((p) => {
    const z = classifyPath(p);
    zones[z]++;
    return { path: p.replace(REPO_ROOT + '/', ''), zone: z };
  });
  const highest = zones.RED > 0 ? 'RED' : zones.YELLOW > 0 ? 'YELLOW' : 'GREEN';
  const branchOk = (d.branch || '').startsWith('claude/');

  console.log(
    JSON.stringify(
      {
        ok: true,
        sessionId: matched,
        shortId: shortId(matched),
        branch: d.branch,
        branchOk,
        zoneCounts: zones,
        highestZone: highest,
        autoResumeEligible: highest === 'GREEN' && branchOk,
        files: perFile,
        pendingTodos: d.pendingTodos.length,
      },
      null,
      2,
    ),
  );
}

// Build the LLM enrichment prompt from a session digest.
function buildEnrichPrompt(d) {
  const todos = d.pendingTodos.length
    ? d.pendingTodos.map((t) => `- (${t.status}) ${t.content}`).join('\n')
    : '(none)';
  const files = d.filesTouched.length
    ? d.filesTouched.map((f) => `- ${f.replace(REPO_ROOT + '/', '')}`).join('\n')
    : '(none)';
  return `You are clawdbot, an internal session-janitor LLM. Read the Claude Code session
excerpt below and emit ONLY a JSON object with this exact shape (no prose
around it, no markdown fences):

{
  "summary": "<one sentence, what the session was doing>",
  "proposed_next": ["<short imperative>", "..."],
  "blockers": ["<known obstacles or open questions>", "..."],
  "risk_notes": "<one line on risk: any thesis/migration/secret/store hits?>"
}

Session excerpt
---------------
First user prompt:
${d.firstUser}

Last user prompt:
${d.lastUser}

Last assistant signal:
${d.lastAssistant}

Pending todos:
${todos}

Files touched:
${files}

Branch: ${d.branch}
`;
}

function tryParseJson(text) {
  if (!text) return null;
  const m = text.match(/\{[\s\S]*\}/);
  if (!m) return null;
  try {
    return JSON.parse(m[0]);
  } catch {
    return null;
  }
}

function cmdEnrich(target, model, dryRun) {
  if (!target) {
    console.error('Missing target id');
    process.exit(2);
  }
  const state = loadState();
  let matched = null;
  for (const sid of Object.keys(state.sessions)) {
    if (sid === target || shortId(sid) === target) {
      matched = sid;
      break;
    }
  }
  if (!matched) {
    console.error(`No session matches: ${target}`);
    process.exit(3);
  }

  const transcriptPath = join(TRANSCRIPT_DIR, `${matched}.jsonl`);
  if (!existsSync(transcriptPath)) {
    console.error(`Transcript missing: ${transcriptPath}`);
    process.exit(4);
  }
  const events = readJsonl(transcriptPath);
  const d = digest(events, matched);
  const prompt = buildEnrichPrompt(d);

  if (dryRun) {
    console.log(
      JSON.stringify(
        { ok: true, dryRun: true, sessionId: matched, model, promptChars: prompt.length, prompt },
        null,
        2,
      ),
    );
    return;
  }

  // Shell out to ollama-spark. 120s timeout — large local models can be slow.
  const result = spawnSync('bash', [join(REPO_ROOT, 'scripts/ollama-spark.sh'), model, '-'], {
    input: prompt,
    encoding: 'utf8',
    timeout: 120000,
  });

  if (result.error || result.status !== 0) {
    console.log(
      JSON.stringify(
        {
          ok: false,
          sessionId: matched,
          model,
          error: result.error?.message || `exit ${result.status}`,
          stderr: (result.stderr || '').slice(0, 500),
          hint: 'Check `ssh dgx-spark` works and Ollama is running on the Spark.',
        },
        null,
        2,
      ),
    );
    process.exit(5);
  }

  const raw = result.stdout.trim();
  const parsed = tryParseJson(raw);

  // Append the enrichment to the queue file (preserve the original).
  const queueFile = join(QUEUE_DIR, `${shortId(matched)}.md`);
  if (existsSync(queueFile)) {
    const existing = readFileSync(queueFile, 'utf8');
    const block =
      `\n\n## LLM Digest (model: ${model})\n` +
      `> Generated: ${new Date().toISOString()}\n\n` +
      (parsed
        ? '```json\n' + JSON.stringify(parsed, null, 2) + '\n```\n'
        : '```\n' + raw + '\n```\n_(model did not return valid JSON — raw response above)_\n');
    // Strip any prior LLM Digest section so re-enrichment replaces it.
    const stripped = existing.replace(/\n\n## LLM Digest[\s\S]*$/, '');
    writeFileSync(queueFile, stripped + block);
  }

  // Update state with enrichment metadata.
  state.sessions[matched].llmEnriched = true;
  state.sessions[matched].llmEnrichedAt = new Date().toISOString();
  state.sessions[matched].llmModel = model;
  if (parsed?.summary) {
    state.sessions[matched].llmSummary = parsed.summary.slice(0, 240);
  }
  saveState(state);

  console.log(
    JSON.stringify(
      {
        ok: true,
        sessionId: matched,
        model,
        parsed: !!parsed,
        queueFile: queueFile.replace(REPO_ROOT + '/', ''),
        digest: parsed,
      },
      null,
      2,
    ),
  );
}

function cmdMark(target, status) {
  if (!target) {
    console.error('Missing target id');
    process.exit(2);
  }
  const state = loadState();
  let matched = null;
  for (const sid of Object.keys(state.sessions)) {
    if (sid === target || shortId(sid) === target) {
      matched = sid;
      break;
    }
  }
  if (!matched) {
    console.error(`No session matches: ${target}`);
    process.exit(3);
  }
  state.sessions[matched].status = status;
  state.sessions[matched].markedAt = new Date().toISOString();
  saveState(state);
  console.log(JSON.stringify({ ok: true, sessionId: matched, status }));
}

function cmdHelp() {
  console.log(`clawdbot-scan — mine Claude Code transcripts for unfinished work

Usage:
  node scripts/clawdbot-scan.mjs [--max-age N] [--live-window S] [--exclude <id>]
                                                 scan + write queue (default)
  node scripts/clawdbot-scan.mjs --list          list pending queue items (json)
  node scripts/clawdbot-scan.mjs --status        counts: pending/dismissed/done
  node scripts/clawdbot-scan.mjs --dismiss <id>  mark queue item dismissed
  node scripts/clawdbot-scan.mjs --done <id>     mark queue item done
  node scripts/clawdbot-scan.mjs --preview <id>  classify trust zone of files touched
  node scripts/clawdbot-scan.mjs --enrich <id> [--model llama3.1:70b] [--dry-run]
                                                 LLM-pass via ollama-spark; appends
                                                 ## LLM Digest section to the queue file

Live-session skip order: CLAUDE_SESSION_ID env → --exclude flags → newest
jsonl modified within --live-window seconds (default 300).

Queue lives in .claude/clawdbot/queue/<short-id>.md
State lives in .claude/clawdbot/state.json
`);
}

const args = parseArgs(process.argv);
switch (args.command) {
  case 'list':
    cmdList();
    break;
  case 'status':
    cmdStatus();
    break;
  case 'dismiss':
    cmdMark(args.target, 'dismissed');
    break;
  case 'done':
    cmdMark(args.target, 'done');
    break;
  case 'preview':
    cmdPreview(args.target);
    break;
  case 'enrich':
    cmdEnrich(args.target, args.model, args.dryRun);
    break;
  case 'help':
    cmdHelp();
    break;
  default:
    cmdScan(args);
}
