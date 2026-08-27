#!/usr/bin/env node
// Evidence: Tool=Claude-Code Model=claude-haiku-4-5 Agent=claude-code Date=2026-08-27
// Audit trail: git log -- scripts/session-coordinator.mjs

/**
 * Session Coordinator: Parallel Multi-Platform Resume
 *
 * Enables:
 * - One session resuming in Claude Code (interactive)
 * - Another session in OpenCode batch (automated)
 * - Prevents conflicts with locking
 * - Tracks state across platforms
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const SESSIONS_DIR = '.workflows/sessions';
const STATE_FILE = join(SESSIONS_DIR, 'coordinator-state.json');
const LOCKS_DIR = join(SESSIONS_DIR, 'locks');

const PLATFORMS = ['claude-code', 'opencode', 'cursor'];
const SESSION_STATES = ['RECOVERED', 'CLAIMED', 'PROCESSING', 'PAUSED', 'COMPLETED', 'ARCHIVED'];

function initializeState() {
  if (!existsSync(LOCKS_DIR)) {
    mkdirSync(LOCKS_DIR, { recursive: true });
  }

  if (!existsSync(STATE_FILE)) {
    const initialState = {
      version: '1.0.0',
      last_updated: new Date().toISOString(),
      active_claims: {},
      session_history: [],
    };
    writeFileSync(STATE_FILE, JSON.stringify(initialState, null, 2));
    return initialState;
  }

  return JSON.parse(readFileSync(STATE_FILE, 'utf8'));
}

function acquireLock(sessionId, platform) {
  mkdirSync(LOCKS_DIR, { recursive: true });
  const lockFile = join(LOCKS_DIR, `${sessionId}.lock`);

  if (existsSync(lockFile)) {
    const lock = JSON.parse(readFileSync(lockFile, 'utf8'));
    const ageMs = Date.now() - new Date(lock.acquired_at).getTime();

    // Lock expires after 24 hours
    if (ageMs > 24 * 60 * 60 * 1000) {
      console.log(`[lock] Expired lock for ${sessionId}, reclaiming...`);
      writeFileSync(
        lockFile,
        JSON.stringify({ sessionId, platform, acquired_at: new Date().toISOString() }),
      );
      return true;
    }

    console.error(`[lock] Session ${sessionId} already claimed by ${lock.platform}`);
    return false;
  }

  writeFileSync(
    lockFile,
    JSON.stringify({ sessionId, platform, acquired_at: new Date().toISOString() }),
  );
  return true;
}

function releaseLock(sessionId) {
  const lockFile = join(LOCKS_DIR, `${sessionId}.lock`);
  if (existsSync(lockFile)) {
    const lock = JSON.parse(readFileSync(lockFile, 'utf8'));
    const lockData = { ...lock, released_at: new Date().toISOString() };
    writeFileSync(lockFile, JSON.stringify(lockData));
  }
}

function claimSession(sessionId, platform) {
  if (!PLATFORMS.includes(platform)) {
    console.error(`Invalid platform: ${platform}. Must be one of: ${PLATFORMS.join(', ')}`);
    return false;
  }

  if (!acquireLock(sessionId, platform)) {
    return false;
  }

  const state = initializeState();
  const sessionFile = join(SESSIONS_DIR, 'recovered', `${sessionId}.json`);

  if (!existsSync(sessionFile)) {
    console.error(`Session file not found: ${sessionFile}`);
    releaseLock(sessionId);
    return false;
  }

  const session = JSON.parse(readFileSync(sessionFile, 'utf8'));

  state.active_claims[sessionId] = {
    platform,
    claimed_at: new Date().toISOString(),
    state: 'PROCESSING',
    branch: session.branch,
    repository: session.repository,
  };

  state.session_history.push({
    session_id: sessionId,
    action: 'CLAIMED',
    platform,
    timestamp: new Date().toISOString(),
  });

  state.last_updated = new Date().toISOString();
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));

  console.log(`✅ Claimed session ${sessionId} for ${platform}`);
  console.log(`   Branch: ${session.branch}`);
  console.log(`   Repository: ${session.repository}`);

  return true;
}

function releaseSession(sessionId, status = 'COMPLETED') {
  const state = initializeState();

  if (!state.active_claims[sessionId]) {
    console.error(`Session ${sessionId} not claimed`);
    return false;
  }

  const claim = state.active_claims[sessionId];
  claim.state = status;
  claim.released_at = new Date().toISOString();

  state.session_history.push({
    session_id: sessionId,
    action: 'RELEASED',
    platform: claim.platform,
    status,
    timestamp: new Date().toISOString(),
  });

  releaseLock(sessionId);
  state.last_updated = new Date().toISOString();
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));

  console.log(`✅ Released session ${sessionId} with status: ${status}`);
  return true;
}

function listActiveSessions() {
  const state = initializeState();

  console.log('\n=== Active Session Claims ===\n');

  const claims = Object.entries(state.active_claims);
  if (claims.length === 0) {
    console.log('No active sessions\n');
    return;
  }

  for (const [sessionId, claim] of claims) {
    const age = Date.now() - new Date(claim.claimed_at).getTime();
    const ageMin = (age / (1000 * 60)).toFixed(1);

    console.log(`${sessionId}`);
    console.log(`  Platform: ${claim.platform}`);
    console.log(`  Branch: ${claim.branch}`);
    console.log(`  State: ${claim.state}`);
    console.log(`  Claimed: ${ageMin}min ago`);
    console.log('');
  }
}

function getSessionStatus(sessionId) {
  const state = initializeState();
  const claim = state.active_claims[sessionId];

  if (!claim) {
    return { status: 'UNCLAIMED', message: `Session ${sessionId} is not currently claimed` };
  }

  return {
    status: claim.state,
    platform: claim.platform,
    branch: claim.branch,
    claimed_at: claim.claimed_at,
    message: `Session ${sessionId} is claimed by ${claim.platform}`,
  };
}

function createParallelWorkflow(session1Id, session1Platform, session2Id, session2Platform) {
  console.log('\n🔄 Setting up parallel session workflow...\n');

  // Claim first session
  if (!claimSession(session1Id, session1Platform)) {
    console.error(`Failed to claim session ${session1Id}`);
    return false;
  }

  // Claim second session
  if (!claimSession(session2Id, session2Platform)) {
    console.error(`Failed to claim session ${session2Id}`);
    releaseSession(session1Id, 'PAUSED');
    return false;
  }

  const state = initializeState();
  const session1 = JSON.parse(
    readFileSync(join(SESSIONS_DIR, 'recovered', `${session1Id}.json`), 'utf8'),
  );
  const session2 = JSON.parse(
    readFileSync(join(SESSIONS_DIR, 'recovered', `${session2Id}.json`), 'utf8'),
  );

  console.log('✅ Parallel workflow established:\n');
  console.log(`📌 Session 1 → ${session1Platform.toUpperCase()}`);
  console.log(`   ID: ${session1Id}`);
  console.log(`   Branch: ${session1.branch}`);
  console.log(`   Events: ${session1.event_count}`);
  console.log(`   Duration: ${session1.summary.session_length_hours.toFixed(1)}h`);
  console.log('');
  console.log(`📌 Session 2 → ${session2Platform.toUpperCase()}`);
  console.log(`   ID: ${session2Id}`);
  console.log(`   Branch: ${session2.branch}`);
  console.log(`   Events: ${session2.event_count}`);
  console.log(`   Duration: ${session2.summary.session_length_hours.toFixed(1)}h`);
  console.log('');
  console.log('Next steps:');
  console.log(`  1. Resume in ${session1Platform}: claude claim-session ${session1Id}`);
  console.log(
    `  2. Hand off to ${session2Platform}: node scripts/opencode-batch-worker.mjs --sessions ${session2Id}`,
  );
  console.log('');

  return true;
}

// CLI
const command = process.argv[2];
const args = process.argv.slice(3);

switch (command) {
  case 'claim':
    if (args.length < 2) {
      console.error('Usage: claim <session-id> <platform>');
      process.exit(1);
    }
    claimSession(args[0], args[1]);
    break;

  case 'release':
    if (args.length < 1) {
      console.error('Usage: release <session-id> [status]');
      process.exit(1);
    }
    releaseSession(args[0], args[1] || 'COMPLETED');
    break;

  case 'list':
    listActiveSessions();
    break;

  case 'status':
    if (args.length < 1) {
      console.error('Usage: status <session-id>');
      process.exit(1);
    }
    const status = getSessionStatus(args[0]);
    console.log(`\n${status.message}`);
    console.log(`Status: ${status.status}`);
    if (status.platform) {
      console.log(`Platform: ${status.platform}`);
      console.log(`Branch: ${status.branch}`);
      console.log(`Claimed: ${status.claimed_at}`);
    }
    console.log('');
    break;

  case 'parallel':
    if (args.length < 4) {
      console.error('Usage: parallel <session1-id> <platform1> <session2-id> <platform2>');
      process.exit(1);
    }
    createParallelWorkflow(args[0], args[1], args[2], args[3]);
    break;

  default:
    console.log(`
Session Coordinator - Parallel Multi-Platform Resume

Usage:
  claim <session-id> <platform>          Claim a session for a platform
  release <session-id> [status]          Release a session
  list                                   List all active claims
  status <session-id>                    Check session status
  parallel <s1> <p1> <s2> <p2>          Set up parallel workflow

Platforms: ${PLATFORMS.join(', ')}

Examples:
  node scripts/session-coordinator.mjs claim copilot_deddef51-437 claude-code
  node scripts/session-coordinator.mjs parallel copilot_deddef51-437 claude-code copilot_dbab1ef1-b88 opencode
  node scripts/session-coordinator.mjs list
  node scripts/session-coordinator.mjs status copilot_deddef51-437
`);
    break;
}
