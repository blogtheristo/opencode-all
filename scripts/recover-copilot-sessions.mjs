#!/usr/bin/env node
// Evidence: Tool=Claude-Code Model=claude-haiku-4-5 Agent=claude-code Date=2026-08-27
// Audit trail: git log -- scripts/recover-copilot-sessions.mjs

/**
 * Recover specific Copilot sessions to handoff-ready state
 * Extracts full event logs, context, and workspace state
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const HOME = process.env.HOME || '/home/admin100';
const RECOVERY_DIR = '.workflows/sessions/recovered';
const COPILOT_STATE = join(HOME, '.copilot', 'session-state');

// Top 3 sessions to recover
const SESSIONS_TO_RECOVER = [
  'deddef51-4377-4c41-9b35-f20148e25e61', // 2,463 events
  'dbab1ef1-b889-481d-bd82-b8485342d40d', // 2,196 events
  'c459ea34-4500-4598-bca1-6288aa03f43d', // 892 events
];

function recoverSession(sessionId) {
  console.log(`\n🔄 Recovering: ${sessionId.slice(0, 8)}...`);

  const sessionPath = join(COPILOT_STATE, sessionId);
  const workspacePath = join(sessionPath, 'workspace.yaml');
  const eventsPath = join(sessionPath, 'events.jsonl');
  const dbPath = join(sessionPath, 'session.db');

  if (!existsSync(workspacePath) || !existsSync(eventsPath)) {
    console.error(`   ❌ Missing files for ${sessionId}`);
    return null;
  }

  try {
    // Read workspace metadata
    const workspace = readFileSync(workspacePath, 'utf8');

    // Read all events
    const eventsRaw = readFileSync(eventsPath, 'utf8');
    const events = eventsRaw
      .split('\n')
      .filter(Boolean)
      .map((line, idx) => {
        try {
          return JSON.parse(line);
        } catch (e) {
          console.warn(`   ⚠️  Event ${idx} parse error`);
          return null;
        }
      })
      .filter(Boolean);

    // Extract key metadata
    const firstEvent = events[0];
    const lastEvent = events[events.length - 1];

    const sessionName = workspace.match(/name: (.+)/)?.[1] || 'Copilot Session';
    const branch = workspace.match(/branch: (.+)/)?.[1] || 'unknown';
    const repo = workspace.match(/repository: (.+)/)?.[1] || 'unknown';
    const cwd = workspace.match(/cwd: (.+)/)?.[1] || '/home/admin100/dws6';

    const recovery = {
      id: `copilot_${sessionId.slice(0, 12)}`,
      platform: 'copilot',
      source_id: sessionId,
      title: sessionName,
      repository: repo,
      branch: branch,
      cwd: cwd,
      event_count: events.length,
      created_at: firstEvent?.timestamp,
      last_activity: lastEvent?.timestamp,

      // Workspace state
      workspace: workspace,

      // Event log
      events: events,

      // Summary
      summary: {
        session_length_hours:
          (new Date(lastEvent?.timestamp).getTime() - new Date(firstEvent?.timestamp).getTime()) /
          (1000 * 60 * 60),
        model_used: firstEvent?.data?.context?.model || 'unknown',
        context_tier: firstEvent?.data?.contextTier || 'standard',
      },

      // Recovery timestamp
      recovered_at: new Date().toISOString(),
    };

    // Write recovery file
    const recoveryPath = join(RECOVERY_DIR, `${recovery.id}.json`);
    mkdirSync(RECOVERY_DIR, { recursive: true });
    writeFileSync(recoveryPath, JSON.stringify(recovery, null, 2));

    console.log(`   ✅ Recovered: ${sessionName}`);
    console.log(`      Branch: ${branch}`);
    console.log(`      Events: ${events.length}`);
    console.log(`      Duration: ${recovery.summary.session_length_hours.toFixed(1)}h`);
    console.log(`      File: ${recoveryPath}`);

    return recovery;
  } catch (err) {
    console.error(`   ❌ Error: ${err.message}`);
    return null;
  }
}

function createRecoveryGuide(recoveries) {
  const guide = `# Recovered Copilot Sessions

${recoveries
  .map(
    (r) => `
## ${r.title}

**Session ID:** \`${r.id}\`
**Repository:** ${r.repository}
**Branch:** \`${r.branch}\`
**Created:** ${new Date(r.created_at).toLocaleString()}
**Last Activity:** ${new Date(r.last_activity).toLocaleString()}
**Events:** ${r.event_count}
**Duration:** ${r.summary.session_length_hours.toFixed(1)} hours
**Model:** ${r.summary.model_used}

### To Resume This Session

\`\`\`bash
claude claim-session ${r.id}
\`\`\`

This will:
1. Load the full event history (${r.event_count} events)
2. Restore the workspace context (${r.repository} on branch \`${r.branch}\`)
3. Show the work that was being done
4. Let you continue from where it left off

### What Was Being Worked On

Check the events log to see:
- What model changes were made
- What code changes were attempted
- What prompts were used
- What the outcome was
`,
  )
  .join('\n')}

---

## Next Steps

1. **Claim a session:** \`claude claim-session <session-id>\`
2. **Review the work:** Check the events and status
3. **Continue or handoff:** Either keep working or hand off to batch
4. **When done:** \`claude handoff-to-batch --mode review\`
`;

  writeFileSync(join(RECOVERY_DIR, 'RECOVERY_GUIDE.md'), guide);
  console.log(`\n📖 Recovery guide: ${join(RECOVERY_DIR, 'RECOVERY_GUIDE.md')}`);
}

async function main() {
  console.log('🔍 Recovering top 3 Copilot sessions...');

  const recoveries = SESSIONS_TO_RECOVER.map(recoverSession).filter(Boolean);

  if (recoveries.length === 0) {
    console.error('\n❌ No sessions recovered');
    process.exit(1);
  }

  console.log(`\n✅ Recovered ${recoveries.length} sessions`);

  // Create guide
  createRecoveryGuide(recoveries);

  // Summary
  console.log('\n=== Recovery Summary ===');
  console.log(`Total events recovered: ${recoveries.reduce((sum, r) => sum + r.event_count, 0)}`);
  console.log(
    `Total session time: ${recoveries.reduce((sum, r) => sum + r.summary.session_length_hours, 0).toFixed(1)} hours`,
  );
  console.log('\n📋 Ready to claim:');
  recoveries.forEach((r) => {
    console.log(`   ${r.id}: ${r.title}`);
  });

  console.log(`\n▶️  Next: cd ${RECOVERY_DIR} && cat RECOVERY_GUIDE.md`);
}

main().catch(console.error);
