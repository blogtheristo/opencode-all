#!/usr/bin/env node
// Evidence: Tool=OpenCode 1.18.21 Model=opencode/x-preview-f-free (ox-alpha) Date=2026-08-27
// Audit trail: git log -- scripts/create-failed-sessions-prs.mjs

/**
 * Script to reprocess failed OpenCode sessions and create GitHub PRs
 * for sessions that failed early in processing (before worktrees were created)
 */

import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const REPO = process.cwd();
const QUEUE_DIR = join(REPO, '.workflows', 'opencode-all');
const QUEUE_FILE = join(QUEUE_DIR, 'queue.jsonl');
const HANDOFF_DIR = join(REPO, '.claude', 'handoffs', 'opencode-batch');

// The three sessions that failed early and need PRs created
const SESSIONS_TO_PROCESS = [
  'ses_fce609dc3ffen8EgwnPwl4zcJp',
  'ses_0aa6c1f3b5444183ac040ba00660dc61', 
  'ses_fc4563e0effeahl1FqlhxvOuDz'
];

// Function to check if gh CLI is available
function checkGHCLI() {
  const result = spawnSync('which', ['gh'], { encoding: 'utf8' });
  return result.status === 0;
}

// Function to get session handoff info
function getSessionHandoff(sessionId) {
  const handoffPath = join(HANDOFF_DIR, `${sessionId}.md`);
  try {
    return readFileSync(handoffPath, 'utf8');
  } catch (err) {
    return null;
  }
}

// Function to create a GitHub PR for a session
function createPRForSession(sessionId, title, description, branchName) {
  console.log(`\nCreating PR from ${branchName}...`);
  
  try {
    // Use gh command to create PR
    const result = spawnSync('gh', [
      'pr', 'create',
      '--title', title,
      '--body', description,
      '--base', 'main',
      '--head', branchName,
      '--draft'
    ], { encoding: 'utf8' });
    
    if (result.status === 0) {
      console.log('✅ PR created successfully');
      console.log(result.stdout);
      return true;
    } else {
      console.error('❌ Failed to create PR:');
      console.error(result.stderr);
      return false;
    }
  } catch (err) {
    console.error('❌ Error creating PR:', err.message);
    return false;
  }
}

// Main execution
async function main() {
  console.log('🔍 Checking GitHub CLI availability...');
  if (!checkGHCLI()) {
    console.error('❌ GitHub CLI (gh) not found. Please install it first.');
    process.exit(1);
  }

  console.log('🔍 Processing failed sessions that need PRs...');
  let prCount = 0;
  
  for (const sessionId of SESSIONS_TO_PROCESS) {
    console.log(`\n📍 Processing session: ${sessionId}`);
    
    // Get handoff information
    const handoff = getSessionHandoff(sessionId);
    if (!handoff) {
      console.warn(`⚠️  No handoff file found for ${sessionId}`);
      continue;
    }
    
    // Extract session title from handoff
    let title = `OpenCode Session: ${sessionId}`;
    if (handoff.includes('title:')) {
      const match = handoff.match(/title:\s*"(.+?)"/);
      if (match) title = match[1];
    }
    
    const description = `This PR was automatically generated from OpenCode session ${sessionId}. The session failed during processing but contained valid changes that should be merged to main. Please review, approve, and merge.`;
    const branchName = `opencode/${sessionId}`;
    
    // Create the PR
    if (createPRForSession(sessionId, title, description, branchName)) {
      prCount++;
    }
  }
  
  console.log(`\n📊 Results: ${prCount}/${SESSIONS_TO_PROCESS.length} PRs created successfully`);
  
  if (prCount > 0) {
    console.log('\n💡 Instructions:');
    console.log('1. Review the auto-drafted PRs in GitHub');
    console.log('2. Approve and merge them to complete the process');
    console.log('3. The batch worker will then process these as DONE sessions');
  }
  
  console.log('\n📝 Session processing complete.');
}

// Run main function
main().catch(console.error);
