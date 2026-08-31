#!/usr/bin/env tsx
// Migrate .workflows/opencode-all/queue.jsonl to Supabase
// Usage: npx tsx scripts/migrate-opencode-queue-to-supabase.ts

import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

if (!url || !key) {
  console.error('Missing Supabase credentials.');
  console.error('Set: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(url, key);

async function migrateQueue() {
  const queuePath = path.join(process.cwd(), '.workflows', 'opencode-all', 'queue.jsonl');

  if (!fs.existsSync(queuePath)) {
    console.log('No queue file found. Starting fresh.');
    return;
  }

  const content = fs.readFileSync(queuePath, 'utf-8');
  const lines = content.trim().split('\n').filter(Boolean);

  console.log(`Migrating ${lines.length} sessions from JSONL...`);

  let migrated = 0;
  let skipped = 0;

  for (const line of lines) {
    try {
      const session = JSON.parse(line);

      // Map old format to new schema
      const mapped = {
        id: session.id,
        title: session.title,
        source: session.source || 'detect',
        state: session.state,
        status: session.status || 'pending',
        idempotency_key: session.idempotencyKey,
        baseline_commit: session.baselineCommit,
        branch: session.branch,
        worktree_path: session.worktreePath,
        handoff_path: session.handoffPath,
        attempts: session.attempts || 0,
        max_attempts: session.maxAttempts || 5,
        stop_reason: session.stopReason,
        failure_code: session.failureCode,
        failure_detail: (() => {
          try {
            return session.failureDetail ? JSON.parse(session.failureDetail) : null;
          } catch {
            return { raw: session.failureDetail };
          }
        })(),
        worktree_state: session.worktreeState,
        worktree_resumed: session.worktreeResumed || false,
        last_run: session.lastRun,
        reconciled_at: session.reconciledAt,
        validation: session.validation,
        legacy: session.legacy || false,
      };

      const { error } = await supabase
        .from('opencode_sessions')
        .upsert([mapped], { onConflict: 'id' });

      if (error) {
        console.error(`Failed to migrate ${session.id}:`, error);
        skipped++;
      } else {
        migrated++;
      }
    } catch (e) {
      console.error('Parse error:', e);
      skipped++;
    }
  }

  console.log(`\n✅ Migration complete: ${migrated} sessions migrated, ${skipped} skipped`);

  // Backup original queue
  const backupPath = queuePath + '.backup-' + new Date().toISOString().split('T')[0];
  fs.copyFileSync(queuePath, backupPath);
  console.log(`📦 Backup saved to: ${backupPath}`);
}

migrateQueue().catch(console.error);
