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
    minCluster: 3,
    lookbackDays: 90,
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
    } else if (a === '--dream-prune') args.command = 'dream-prune';
    else if (a === '--dream-curate') args.command = 'dream-curate';
    else if (a === '--dream-propose') args.command = 'dream-propose';
    else if (a === '--min-cluster') args.minCluster = parseInt(argv[++i], 10);
    else if (a === '--lookback-days') args.lookbackDays = parseInt(argv[++i], 10);
    else if (a === '--model') args.model = argv[++i];
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

// Classify a file path into a trust zone per CLAUDE.md "Auto-Mode Trust Boundary".
// RED  — applying migrations (psql/supabase db push), thesis, store sync, secrets, deploys
// YELLOW — MCP config, agent skills, docker, gh CLI scripts, mcp-servers
// GREEN — everything else (code, tests, docs, lint config, MIGRATION FILES per se)
// Note: authoring a migration FILE is GREEN; applying it is RED. The scanner
// classifies the file artifact, not the apply action — so supabase/migrations/
// is intentionally NOT in RED_PATTERNS.
const RED_PATTERNS = [
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

// =================== dream-* modes ========================================
// "Dreaming" = offline reflection over transcripts that curates / proposes /
// prunes, never auto-applies. All output lands in .claude/clawdbot/proposals/
// for HIL review and promotion.

const PROPOSALS_DIR = join(CLAWD_DIR, 'proposals');
const MEMORY_DIR = join(CLAWD_DIR, 'memory');

function ensureDreamDirs() {
  for (const d of [PROPOSALS_DIR, MEMORY_DIR]) {
    if (!existsSync(d)) mkdirSync(d, { recursive: true });
  }
}

function listSkills() {
  const skillsDir = join(REPO_ROOT, 'skills');
  if (!existsSync(skillsDir)) return [];
  return readdirSync(skillsDir).filter((n) => {
    try {
      return statSync(join(skillsDir, n)).isDirectory();
    } catch {
      return false;
    }
  });
}

// A folder is a "conventional skill" only if it contains a top-level SKILL.md.
// Folders without one are discoverability bugs (the auto-loader won't index
// them) — NOT archival candidates. dream-prune learned this the hard way on
// skills/risto/ which had Risto_Skills.md instead of SKILL.md. See
// .claude/clawdbot/proposals/archival-2026-05-12.md for the case study.
function hasConventionalSkillFile(skillName) {
  return existsSync(join(REPO_ROOT, 'skills', skillName, 'SKILL.md'));
}

function listTranscripts(lookbackDays) {
  if (!existsSync(TRANSCRIPT_DIR)) return [];
  const cutoff = Date.now() - lookbackDays * 86400 * 1000;
  return readdirSync(TRANSCRIPT_DIR)
    .filter((f) => f.endsWith('.jsonl'))
    .map((f) => ({
      file: join(TRANSCRIPT_DIR, f),
      mtime: statSync(join(TRANSCRIPT_DIR, f)).mtimeMs,
    }))
    .filter((x) => x.mtime >= cutoff)
    .map((x) => x.file);
}

// --- dream-prune: pure grep, no LLM --------------------------------------
function cmdDreamPrune(args) {
  ensureDreamDirs();
  const skills = listSkills();
  const transcripts = listTranscripts(args.lookbackDays);

  const results = [];
  const discoverabilityBugs = [];
  for (const skill of skills) {
    let hits = 0;
    for (const t of transcripts) {
      const r = spawnSync('grep', ['-ciw', skill, t], { encoding: 'utf8' });
      if (r.status === 0) hits += parseInt((r.stdout || '0').trim(), 10) || 0;
    }
    const hasSkillMd = hasConventionalSkillFile(skill);
    results.push({ skill, hits, hasSkillMd });
    if (!hasSkillMd) discoverabilityBugs.push(skill);
  }
  results.sort((a, b) => a.hits - b.hits);

  // Only treat a folder as a real archival candidate if it has a SKILL.md
  // AND zero invocations. Folders missing SKILL.md are discoverability bugs
  // (the auto-loader can't see them), surfaced separately for the dreamer
  // to fix-not-archive. Learned from skills/risto/ false-positive (2026-05-12).
  const unused = results.filter((r) => r.hits === 0 && r.hasSkillMd);
  const lowUse = results.filter((r) => r.hits > 0 && r.hits <= 2 && r.hasSkillMd);

  // Write a single proposal file dated today.
  const today = new Date().toISOString().slice(0, 10);
  const proposalPath = join(PROPOSALS_DIR, `archival-${today}.md`);
  const md = `# Archival proposal — ${today}

> Generated by \`clawdbot --dream-prune\`
> Lookback: ${args.lookbackDays} days (${transcripts.length} transcripts scanned)
> Skills inventoried: ${skills.length}

## Unused (0 invocations in window) — candidates for \`_OLD\`

${
  unused.length
    ? unused
        .map((r) => `- [ ] \`skills/${r.skill}/\` → propose rename to \`skills/${r.skill}_OLD/\``)
        .join('\n')
    : '_(none — every skill was invoked at least once)_'
}

## Low-use (1–2 invocations) — informational

${
  lowUse.length
    ? lowUse.map((r) => `- \`skills/${r.skill}/\` — ${r.hits} hit(s)`).join('\n')
    : '_(none)_'
}

## Discoverability bugs (no \`SKILL.md\` — auto-loader misses these)

${
  discoverabilityBugs.length
    ? discoverabilityBugs
        .map(
          (s) =>
            `- \`skills/${s}/\` — has no top-level \`SKILL.md\`. **Fix, do not archive**: rename the existing skill file (e.g. \`Foo_Skills.md\`) to \`SKILL.md\` so the auto-loader indexes it. Excluded from archival candidates above. See \`.claude/clawdbot/proposals/archival-2026-05-12.md\` for the case study (\`skills/risto/\`).`,
        )
        .join('\n')
    : '_(none — every skill folder has a conventional SKILL.md)_'
}

## Full counts (asc)

| Skill | Hits | SKILL.md? |
| --- | --- | --- |
${results.map((r) => `| ${r.skill} | ${r.hits} | ${r.hasSkillMd ? 'yes' : '**no**'} |`).join('\n')}

## Action

Per CLAUDE.md "Never use destructive git/file actions" — propose **rename to \`_OLD\`**,
never delete. If a skill is genuinely obsolete, also remove its entry from
\`docs/DWS_SKILLS_GUIDE.md\` and any \`.claude/commands/<name>.md\` slash command
in the same commit. HIL must approve.

Folders listed under "Discoverability bugs" should NOT be archived — they
are auto-loader misses caused by non-standard filenames. Rename the skill
file to \`SKILL.md\` and the next prune pass will count them correctly.
`;
  writeFileSync(proposalPath, md);

  console.log(
    JSON.stringify(
      {
        ok: true,
        mode: 'dream-prune',
        lookbackDays: args.lookbackDays,
        transcriptsScanned: transcripts.length,
        skillsInventoried: skills.length,
        unused: unused.map((r) => r.skill),
        lowUse: lowUse.map((r) => ({ skill: r.skill, hits: r.hits })),
        discoverabilityBugs,
        proposal: proposalPath.replace(REPO_ROOT + '/', ''),
      },
      null,
      2,
    ),
  );
}

// --- dream-curate: cluster recurring corrections into KB notes (LLM) -----
function cmdDreamCurate(args) {
  ensureDreamDirs();
  const state = loadState();
  const queueItems = Object.values(state.sessions)
    .filter((v) => v.status === 'pending' || v.status === 'done')
    .map((v) => ({
      shortId: v.shortId,
      branch: v.branch,
      summary: v.summary,
      llmSummary: v.llmSummary,
      lastTs: v.lastTs,
    }))
    .sort((a, b) => (b.lastTs || '').localeCompare(a.lastTs || ''))
    .slice(0, 50);

  if (queueItems.length === 0) {
    console.log(
      JSON.stringify({ ok: true, mode: 'dream-curate', note: 'No queue items to curate.' }),
    );
    return;
  }

  const items = queueItems
    .map((q) => `- [${q.shortId}] (${q.branch}) ${q.llmSummary || q.summary}`)
    .join('\n');

  const prompt = `You are clawdbot in dream-curate mode. Read this list of recent Claude Code
session summaries from one repo and identify recurring corrections, repeated
user pushback, or rules that come up often enough to deserve being written
down. Emit ONLY a JSON object with this exact shape:

{
  "memory_notes": [
    {"topic": "<kebab-case-filename>", "title": "<title>", "body": "<3-10 line markdown summary of the recurring pattern and what to do about it>"}
  ],
  "claude_md_edits": [
    {"section": "<which CLAUDE.md section to amend>", "proposed_rule": "<exact one-line rule to add>"}
  ],
  "queue_closeable": ["<shortId>", "..."]
}

If there is nothing to consolidate, return empty arrays.

Recent session summaries:
${items}
`;

  if (args.dryRun) {
    console.log(
      JSON.stringify(
        {
          ok: true,
          mode: 'dream-curate',
          dryRun: true,
          sessionsConsidered: queueItems.length,
          promptChars: prompt.length,
          prompt,
        },
        null,
        2,
      ),
    );
    return;
  }

  const result = spawnSync('bash', [join(REPO_ROOT, 'scripts/ollama-spark.sh'), args.model, '-'], {
    input: prompt,
    encoding: 'utf8',
    timeout: 180000,
  });
  if (result.error || result.status !== 0) {
    console.log(
      JSON.stringify(
        {
          ok: false,
          mode: 'dream-curate',
          error: result.error?.message || `exit ${result.status}`,
          stderr: (result.stderr || '').slice(0, 500),
          hint: 'ollama-spark unavailable. Use --dry-run to inspect the prompt.',
        },
        null,
        2,
      ),
    );
    process.exit(5);
  }

  const parsed = tryParseJson(result.stdout);
  const today = new Date().toISOString().slice(0, 10);
  const proposalPath = join(PROPOSALS_DIR, `curate-${today}.md`);
  const md = `# Curation proposal — ${today}

> Generated by \`clawdbot --dream-curate\` (model: ${args.model})
> Sessions considered: ${queueItems.length}

## Raw model output

\`\`\`json
${parsed ? JSON.stringify(parsed, null, 2) : result.stdout.trim()}
\`\`\`

## HIL actions

1. Review \`memory_notes[]\` — for each, create \`.claude/clawdbot/memory/<topic>.md\` with the body.
2. Review \`claude_md_edits[]\` — manually apply to CLAUDE.md if you agree.
3. Review \`queue_closeable[]\` — \`node scripts/clawdbot-scan.mjs --done <shortId>\` for each you accept.
4. Delete this proposal file after promotion.
`;
  writeFileSync(proposalPath, md);

  console.log(
    JSON.stringify(
      {
        ok: true,
        mode: 'dream-curate',
        parsed: !!parsed,
        proposal: proposalPath.replace(REPO_ROOT + '/', ''),
        digest: parsed,
      },
      null,
      2,
    ),
  );
}

// --- dream-propose: detect skill candidates from queue clusters (LLM) ----
function cmdDreamPropose(args) {
  ensureDreamDirs();
  const state = loadState();
  const items = Object.values(state.sessions)
    .filter((v) => v.status === 'pending')
    .map((v) => ({ shortId: v.shortId, summary: v.llmSummary || v.summary, branch: v.branch }))
    .slice(0, 50);

  if (items.length < args.minCluster) {
    console.log(
      JSON.stringify({
        ok: true,
        mode: 'dream-propose',
        note: `Need at least ${args.minCluster} pending queue items to look for clusters; have ${items.length}.`,
      }),
    );
    return;
  }

  const prompt = `You are clawdbot in dream-propose mode. Look at this set of pending session
summaries and decide whether any **${args.minCluster}+** of them share a common
verb / file pattern / intent that would justify a new reusable Claude Code
slash command + skill. If yes, draft it. If no clusters meet the bar, return
an empty array.

Emit ONLY a JSON object with this exact shape:

{
  "proposals": [
    {
      "name": "<kebab-case-name>",
      "description": "<one-line skill description>",
      "trigger_phrases": ["<phrase>", "..."],
      "skill_md_body": "<full markdown body for skills/<name>/SKILL.md, including yaml frontmatter>",
      "slash_command_body": "<full markdown body for .claude/commands/<name>.md>",
      "supporting_session_ids": ["<shortId>", "..."]
    }
  ]
}

Pending session summaries (${items.length}):
${items.map((q) => `- [${q.shortId}] (${q.branch}) ${q.summary}`).join('\n')}
`;

  if (args.dryRun) {
    console.log(
      JSON.stringify(
        {
          ok: true,
          mode: 'dream-propose',
          dryRun: true,
          sessionsConsidered: items.length,
          promptChars: prompt.length,
          prompt,
        },
        null,
        2,
      ),
    );
    return;
  }

  const result = spawnSync('bash', [join(REPO_ROOT, 'scripts/ollama-spark.sh'), args.model, '-'], {
    input: prompt,
    encoding: 'utf8',
    timeout: 180000,
  });
  if (result.error || result.status !== 0) {
    console.log(
      JSON.stringify(
        {
          ok: false,
          mode: 'dream-propose',
          error: result.error?.message || `exit ${result.status}`,
          stderr: (result.stderr || '').slice(0, 500),
          hint: 'ollama-spark unavailable. Use --dry-run to inspect the prompt.',
        },
        null,
        2,
      ),
    );
    process.exit(5);
  }

  const parsed = tryParseJson(result.stdout);
  const proposals = parsed?.proposals || [];
  const written = [];
  for (const p of proposals) {
    if (!p?.name) continue;
    const path = join(PROPOSALS_DIR, `skill-${p.name}.md`);
    const md = `# Skill proposal — ${p.name}

> Generated by \`clawdbot --dream-propose\` (model: ${args.model})
> Supporting sessions: ${(p.supporting_session_ids || []).join(', ') || '(none listed)'}
> Description: ${p.description || ''}
> Triggers: ${(p.trigger_phrases || []).join(', ')}

## Proposed \`skills/${p.name}/SKILL.md\`

${p.skill_md_body || '_(model did not provide a body)_'}

## Proposed \`.claude/commands/${p.name}.md\`

${p.slash_command_body || '_(model did not provide a body)_'}

## HIL actions

1. Review carefully — clawdbot does **not** auto-create skills.
2. If approved: \`mkdir -p skills/${p.name} && cp\` the bodies above into place.
3. Register in \`docs/DWS_SKILLS_GUIDE.md\` per the Agent Productization Rule.
4. Delete this proposal file after promotion.
`;
    writeFileSync(path, md);
    written.push(path.replace(REPO_ROOT + '/', ''));
  }

  console.log(
    JSON.stringify(
      {
        ok: true,
        mode: 'dream-propose',
        parsed: !!parsed,
        proposalCount: written.length,
        proposals: written,
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

Dream modes (offline reflection — output to .claude/clawdbot/proposals/):
  node scripts/clawdbot-scan.mjs --dream-prune [--lookback-days 90]
                                                 grep skill usage across transcripts;
                                                 propose archival for unused skills
  node scripts/clawdbot-scan.mjs --dream-curate [--dry-run] [--model M]
                                                 LLM cluster recurring corrections into
                                                 memory notes + CLAUDE.md edit proposals
  node scripts/clawdbot-scan.mjs --dream-propose [--min-cluster 3] [--dry-run] [--model M]
                                                 LLM draft candidate skill MD when
                                                 N+ pending sessions cluster by intent

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
  case 'dream-prune':
    cmdDreamPrune(args);
    break;
  case 'dream-curate':
    cmdDreamCurate(args);
    break;
  case 'dream-propose':
    cmdDreamPropose(args);
    break;
  case 'help':
    cmdHelp();
    break;
  default:
    cmdScan(args);
}
