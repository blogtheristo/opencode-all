#!/usr/bin/env node
// Evidence: Tool=Claude-Code Model=claude-haiku-4-5 Agent=claude-code Date=2026-08-27
// Audit trail: git log -- scripts/session-recovery.mjs

/**
 * Session Recovery & Bidirectional Handoff System
 *
 * Recovers sessions from:
 * - Copilot (GitHub CLI sessions)
 * - Continue (VS Code AI plugin)
 * - Claude Code (local transcripts)
 * - OpenCode (batch queue)
 *
 * Converts to unified queue format for cross-platform handoff.
 */

import { existsSync, readFileSync, writeFileSync, appendFileSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

const HOME = process.env.HOME || '/home/admin100';
const REPO = process.cwd();
const UNIFIED_QUEUE = join(REPO, '.workflows', 'sessions', 'unified.jsonl');
const SESSION_ARCHIVE = join(REPO, '.workflows', 'sessions', 'archive');

// Session recovery sources
const SOURCES = {
  copilot: join(HOME, '.copilot', 'session-state'),
  claude_code: join(HOME, '.claude', 'projects'),
  continue: join(HOME, '.continue'),
};

function recoverCopilotSessions() {
  console.log('[recovery] scanning Copilot sessions...');
  const sessions = [];

  if (!existsSync(SOURCES.copilot)) {
    console.log('[copilot] no session store found');
    return sessions;
  }

  const sessionDirs = execFileSync('ls', [SOURCES.copilot], { encoding: 'utf8' })
    .trim()
    .split('\n')
    .filter(Boolean);

  for (const sessionId of sessionDirs) {
    const sessionPath = join(SOURCES.copilot, sessionId);
    const workspacePath = join(sessionPath, 'workspace.yaml');
    const eventsPath = join(sessionPath, 'events.jsonl');

    if (!existsSync(workspacePath) || !existsSync(eventsPath)) continue;

    try {
      const workspace = readFileSync(workspacePath, 'utf8');
      const events = readFileSync(eventsPath, 'utf8')
        .split('\n')
        .filter(Boolean)
        .map((l) => JSON.parse(l));

      const firstEvent = events[0];
      const lastEvent = events[events.length - 1];

      sessions.push({
        id: `copilot_${sessionId.slice(0, 12)}`,
        platform: 'copilot',
        source_id: sessionId,
        state: 'RECOVERED',
        title: workspace.match(/name: (.+)/)?.[1] || 'Copilot Session',
        context: firstEvent?.data?.context || {},
        branch: workspace.match(/branch: (.+)/)?.[1] || 'unknown',
        event_count: events.length,
        created_at: firstEvent?.timestamp,
        last_activity: lastEvent?.timestamp,
        transcript_lines: events.length,
      });
    } catch (err) {
      console.error(`[copilot] error parsing ${sessionId}: ${err.message}`);
    }
  }

  console.log(`[copilot] recovered ${sessions.length} sessions`);
  return sessions;
}

function recoverClaudeCodeSessions() {
  console.log('[recovery] scanning Claude Code transcripts...');
  const sessions = [];

  if (!existsSync(SOURCES.claude_code)) {
    console.log('[claude-code] no project cache found');
    return sessions;
  }

  try {
    const projectDirs = execFileSync(
      'find',
      [SOURCES.claude_code, '-maxdepth', '1', '-type', 'd'],
      {
        encoding: 'utf8',
      },
    )
      .trim()
      .split('\n')
      .filter((d) => d !== SOURCES.claude_code);

    for (const projectDir of projectDirs) {
      const jsonlFiles = execFileSync('find', [projectDir, '-name', '*.jsonl', '-type', 'f'], {
        encoding: 'utf8',
      })
        .trim()
        .split('\n')
        .filter(Boolean);

      for (const jsonlFile of jsonlFiles) {
        const lines = readFileSync(jsonlFile, 'utf8').split('\n').filter(Boolean);
        if (lines.length === 0) continue;

        const firstLine = JSON.parse(lines[0]);
        const sessionName = jsonlFile.split('/').pop().replace('.jsonl', '');

        sessions.push({
          id: `claude_${sessionName.slice(0, 12)}`,
          platform: 'claude-code',
          source_id: jsonlFile,
          state: 'RECOVERED',
          title: `Claude Code Session: ${sessionName}`,
          transcript_lines: lines.length,
          created_at: firstLine?.timestamp || new Date().toISOString(),
        });
      }
    }
  } catch (err) {
    console.error(`[claude-code] error scanning: ${err.message}`);
  }

  console.log(`[claude-code] recovered ${sessions.length} session transcripts`);
  return sessions;
}

function recoverContinueSessions() {
  console.log('[recovery] scanning Continue sessions...');
  const sessions = [];

  // Continue doesn't store persistent sessions like Copilot, but we can check for history
  const configPath = join(SOURCES.continue, '.continuerc.json');
  if (existsSync(configPath)) {
    const config = JSON.parse(readFileSync(configPath, 'utf8'));
    if (config.remoteConfig?.history?.length > 0) {
      sessions.push({
        id: `continue_history`,
        platform: 'continue',
        state: 'RECOVERED',
        title: 'Continue Plugin History',
        event_count: config.remoteConfig.history.length,
      });
    }
  }

  console.log(`[continue] recovered ${sessions.length} session records`);
  return sessions;
}

function writeUnifiedQueue(allSessions) {
  console.log(`[queue] writing ${allSessions.length} recovered sessions to unified queue...`);

  // Append to unified queue (don't overwrite)
  const queueEntries = allSessions.map((session) => ({
    ...session,
    recovered_at: new Date().toISOString(),
    handoff_ready: true,
  }));

  for (const entry of queueEntries) {
    appendFileSync(UNIFIED_QUEUE, JSON.stringify(entry) + '\n');
  }

  console.log(`[queue] appended to ${UNIFIED_QUEUE}`);
}

function generateReport(allSessions) {
  const byPlatform = {};
  for (const s of allSessions) {
    byPlatform[s.platform] = (byPlatform[s.platform] || 0) + 1;
  }

  const report = {
    timestamp: new Date().toISOString(),
    total_recovered: allSessions.length,
    by_platform: byPlatform,
    sessions: allSessions.map((s) => ({
      id: s.id,
      platform: s.platform,
      title: s.title,
      event_count: s.event_count || s.transcript_lines,
    })),
  };

  writeFileSync(join(SESSION_ARCHIVE, 'recovery-report.json'), JSON.stringify(report, null, 2));

  console.log('\n=== Recovery Report ===');
  console.log(`Total sessions recovered: ${report.total_recovered}`);
  for (const [platform, count] of Object.entries(byPlatform)) {
    console.log(`  ${platform}: ${count}`);
  }
}

async function main() {
  console.log('🔍 Starting session recovery...\n');

  // Create output directories
  if (!existsSync(SESSION_ARCHIVE)) {
    execFileSync('mkdir', ['-p', SESSION_ARCHIVE]);
  }

  // Recover from all sources
  const copilotSessions = recoverCopilotSessions();
  const claudeCodeSessions = recoverClaudeCodeSessions();
  const continueSessions = recoverContinueSessions();

  const allSessions = [...copilotSessions, ...claudeCodeSessions, ...continueSessions];

  if (allSessions.length === 0) {
    console.log('No sessions recovered.');
    process.exit(0);
  }

  // Write to unified queue
  writeUnifiedQueue(allSessions);

  // Generate report
  generateReport(allSessions);

  console.log('\n✅ Session recovery complete.');
  console.log(`📦 To claim a session for Claude Code:\n  claude claim-session <session-id>`);
}

main().catch(console.error);
