/**
 * Daily Tool Telemetry Report — DWS IQ 6/7 (ASTA Phase 1)
 *
 * Auto-discovered by DGX Spark day-runner.sh (scripts/daily/).
 * Queries tool_telemetry for the past 24 hours, computes per-agent metrics,
 * and emits a summary event to the event bus.
 *
 * Code-Version: 1.0
 * Introduced-In: PR-TBD (ASTA Phase 1)
 * Branch: claude/agent-tool-adaptation-7jpgj
 * Date: 2026-04-03
 * Owner: Lifetime Oy
 */

import { createClient } from '@supabase/supabase-js';

async function main() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;

  if (!url || !key) {
    console.log(JSON.stringify({ status: 'skipped', reason: 'Supabase not configured' }));
    return;
  }

  const client = createClient(url, key);
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await client
    .from('tool_telemetry')
    .select('agent_name, tool_name, outcome, duration_ms, session_id')
    .gte('created_at', since);

  if (error) {
    console.error(JSON.stringify({ status: 'error', error: error.message }));
    process.exit(1);
  }

  if (!data || data.length === 0) {
    console.log(JSON.stringify({ status: 'ok', message: 'No telemetry data in last 24h', agents: {} }));
    return;
  }

  // Aggregate per agent
  const agentMap = new Map<string, {
    total: number;
    success: number;
    error: number;
    timeout: number;
    partial: number;
    skip: number;
    totalDuration: number;
    sessions: Set<string>;
    failingTools: Map<string, number>;
  }>();

  for (const row of data) {
    const agent = row.agent_name;
    if (!agentMap.has(agent)) {
      agentMap.set(agent, {
        total: 0, success: 0, error: 0, timeout: 0, partial: 0, skip: 0,
        totalDuration: 0, sessions: new Set(), failingTools: new Map(),
      });
    }
    const m = agentMap.get(agent)!;
    m.total++;
    m.sessions.add(row.session_id);
    m.totalDuration += row.duration_ms;

    switch (row.outcome) {
      case 'success': m.success++; break;
      case 'error': m.error++; break;
      case 'timeout': m.timeout++; break;
      case 'partial': m.partial++; break;
      case 'skip': m.skip++; break;
    }

    if (row.outcome === 'error' || row.outcome === 'timeout') {
      m.failingTools.set(row.tool_name, (m.failingTools.get(row.tool_name) || 0) + 1);
    }
  }

  const report: Record<string, unknown> = {};
  for (const [agent, m] of agentMap) {
    const invocations = m.total - m.skip;
    report[agent] = {
      totalEvents: m.total,
      invocations,
      skipCount: m.skip,
      skipRate: m.total > 0 ? (m.skip / m.total).toFixed(3) : '0',
      failureRate: invocations > 0 ? ((m.error + m.timeout) / invocations).toFixed(3) : '0',
      partialFailures: m.partial,
      avgDurationMs: invocations > 0 ? Math.round(m.totalDuration / invocations) : 0,
      sessions: m.sessions.size,
      topFailingTools: Object.fromEntries(
        [...m.failingTools.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5),
      ),
    };
  }

  console.log(JSON.stringify({
    status: 'ok',
    since,
    totalEvents: data.length,
    agents: report,
  }, null, 2));
}

main().catch((err) => {
  console.error(JSON.stringify({ status: 'error', error: String(err) }));
  process.exit(1);
});
