/**
 * Cost Audit Sync to Supabase
 * Evidence: Tool=Claude Code 1.0 Model=claude-haiku-4-5-20251001 Agent=cost-audit-persistence Date=2026-09-19
 * Audit trail: git log -- scripts/cost-audit-sync-supabase.ts
 *
 * Syncs .claude/hooks/audit/cost-policy.log to Supabase public.cost_audit table.
 * Idempotent: tracks synced entries via session_id to avoid duplicates.
 */

import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

interface CostAuditEntry {
  session_datetime: string;
  session_id: string;
  agent_type: string;
  sandbox: string;
  workload_category: string;
  decision: string;
  rationale: string;
}

interface SupabaseRow {
  session_datetime: string;
  session_id: string;
  agent_type: string;
  sandbox: string;
  workload_category: string;
  decision: string;
  rationale?: string;
  estimated_tokens?: number;
  actual_cost_usd?: number;
  created_by?: string;
  notes?: string;
}

async function syncCostAuditLog(): Promise<void> {
  // Validate Supabase credentials
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables required');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Read local audit log
  const auditLogPath = path.join(process.cwd(), '.claude/hooks/audit/cost-policy.log');
  if (!fs.existsSync(auditLogPath)) {
    console.log('⚠️  No cost audit log found at', auditLogPath);
    return;
  }

  const logContent = fs.readFileSync(auditLogPath, 'utf-8');
  const lines = logContent.split('\n').filter((line) => line.trim());

  console.log(`📝 Read ${lines.length} entries from ${auditLogPath}`);

  // Parse entries
  const entries: CostAuditEntry[] = [];
  for (const line of lines) {
    const parts = line.split('|').map((p) => p.trim());
    if (parts.length !== 7) continue;

    const [datetime, sessionId, agentType, sandbox, workload, decision, rationale] = parts;
    entries.push({
      session_datetime: datetime,
      session_id: sessionId,
      agent_type: agentType,
      sandbox,
      workload_category: workload,
      decision,
      rationale,
    });
  }

  console.log(`✅ Parsed ${entries.length} valid entries`);

  // Get existing session IDs to avoid duplicates
  const { data: existing, error: fetchError } = await supabase
    .from('cost_audit')
    .select('session_id')
    .then((result) => result);

  if (fetchError) {
    console.error('❌ Error fetching existing entries:', fetchError);
    process.exit(1);
  }

  const existingSessionIds = new Set(existing?.map((row: { session_id: string }) => row.session_id) || []);
  console.log(`🔍 Found ${existingSessionIds.size} existing entries in Supabase`);

  // Filter new entries
  const newEntries = entries.filter((entry) => !existingSessionIds.has(entry.session_id));
  console.log(`➕ ${newEntries.length} new entries to sync`);

  if (newEntries.length === 0) {
    console.log('✅ Sync complete: no new entries');
    return;
  }

  // Transform to Supabase rows
  const rows: SupabaseRow[] = newEntries.map((entry) => ({
    session_datetime: entry.session_datetime,
    session_id: entry.session_id,
    agent_type: entry.agent_type,
    sandbox: entry.sandbox,
    workload_category: entry.workload_category,
    decision: entry.decision,
    rationale: entry.rationale || undefined,
    created_by: process.env.USER || 'sync-script',
    notes: 'Synced from .claude/hooks/audit/cost-policy.log',
  }));

  // Batch insert (Supabase limit: 1000 per request)
  const batchSize = 1000;
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    const { error } = await supabase.from('cost_audit').insert(batch);

    if (error) {
      console.error(`❌ Error inserting batch ${i / batchSize + 1}:`, error);
      process.exit(1);
    }

    console.log(`✅ Inserted batch ${Math.floor(i / batchSize) + 1} (${batch.length} rows)`);
  }

  console.log(`✅ Sync complete: ${newEntries.length} entries synced to Supabase`);
}

syncCostAuditLog().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
