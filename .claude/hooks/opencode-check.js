#!/usr/bin/env node
// Check for OpenCode upstream updates at session start
// Non-blocking; runs silently if no updates available

const { execSync } = require('child_process');
const path = require('path');

function silentExec(cmd) {
  try {
    return execSync(cmd, { stdio: 'pipe', encoding: 'utf-8' }).trim();
  } catch {
    return null;
  }
}

try {
  const opencodeDir = path.join(process.cwd(), 'opencode-all');

  // Check if directory exists
  if (!require('fs').existsSync(opencodeDir)) {
    process.exit(0);
  }

  process.chdir(opencodeDir);

  // Fetch latest upstream
  silentExec('git fetch origin main:opencode-check-upstream 2>/dev/null');

  const current = silentExec('git rev-parse HEAD');
  const upstream = silentExec('git rev-parse opencode-check-upstream');

  if (!current || !upstream) {
    process.exit(0);
  }

  // If they match, we're current
  if (current === upstream) {
    process.exit(0);
  }

  // Updates available - notify user
  console.log('');
  console.log('ℹ️  OpenCode updates available');
  console.log('');
  console.log(`   Current:  ${current.slice(0, 7)}`);
  console.log(`   Upstream: ${upstream.slice(0, 7)}`);
  console.log('');
  console.log('   To update: npm run opencode:update');
  console.log('');

  // Show commits available
  const commits = silentExec(`git log ${current}..${upstream} --oneline`);
  if (commits) {
    console.log('   Recent changes:');
    commits
      .split('\n')
      .slice(0, 3)
      .forEach((line) => console.log(`     ${line}`));
    if (commits.split('\n').length > 3) {
      console.log(`     ... and ${commits.split('\n').length - 3} more`);
    }
    console.log('');
  }

  // Cleanup
  silentExec('git branch -D opencode-check-upstream 2>/dev/null');
} catch (e) {
  // Silently ignore errors - this is just a notification
  process.exit(0);
}
