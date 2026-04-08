# ASTA Phase 1 — Risk Audit & Failover Procedure

VERSION AND AGENT HISTORY
Version: 1.0
Date: 2026-04-03
Author: Claude Opus 4.6 + Human Review
Branch: claude/agent-tool-adaptation-7jpgj
Owner: Lifetime Oy
Status: Active
Related: docs/field-notes/2026-04-03-agent-tool-adaptation-stanford-harvard.md
---

## Risk Matrix

| # | Risk | Severity | Likelihood | Mitigation |
|---|------|----------|-----------|------------|
| R1 | Telemetry buffer memory leak under high load | Medium | Low | Buffer caps at 50 events; 30s flush interval |
| R2 | tool_telemetry table grows unbounded | High | High | No retention policy yet — add pg_cron in Phase 2 |
| R3 | 30s tool timeout kills legitimate long-running tools | Medium | Medium | Make timeout configurable per-tool in Phase 2 |
| R4 | Checkpoint JSONB too large for Supabase row | Medium | Low | Add message windowing in Phase 2 |
| R5 | Checkpoint recovery replays stale context | Medium | Medium | 24h TTL; add staleness check in Phase 2 |
| R6 | Partial failure context injection causes hallucination | Low | Low | Monitor via skip rate; revert injection if needed |
| R7 | Promise.allSettled changes error propagation | Low | Low | executeTool catches internally; defensive handling added |
| R8 | Telemetry flush blocks event loop | Low | Low | Fire-and-forget with .catch(); no retry on failure |

## Failover Procedures

### F1: Telemetry Performance Degradation

```
1. Check agent response time elevation
2. Verify telemetry flush duration in logs (> 5s = problem)
3. Emergency: Comment out telemetryService.recordInvocation() in tools.ts
4. Root cause: Likely Supabase connection pool — check dashboard
5. Fix: Add connection pooling or reduce flush frequency
```

### F2: Checkpoint Infinite Loop

```
1. Symptom: Agent repeatedly recovers and fails at same iteration
2. Verify: SELECT * FROM session_checkpoints WHERE session_id = '<id>';
3. Emergency: DELETE FROM session_checkpoints WHERE session_id = '<id>';
4. Permanent: Add max-recovery-attempts counter (Phase 2)
```

### F3: Telemetry Table Disk Exhaustion

```
1. Check: SELECT pg_total_relation_size('tool_telemetry');
2. Emergency: DELETE FROM tool_telemetry WHERE created_at < NOW() - INTERVAL '7 days';
3. Permanent: pg_cron retention (30-day default)
   SELECT cron.schedule('cleanup-telemetry', '0 3 * * *',
     $$DELETE FROM tool_telemetry WHERE created_at < NOW() - INTERVAL '30 days'$$);
```

### F4: Full ASTA Phase 1 Rollback

```
1. git revert <asta-phase1-commit>
2. Tables remain dormant (no writes without service code)
3. Singleton services have zero runtime cost when unused
4. No data migration needed — tables are additive
```

## Phase 2 Hardening Checklist

- [ ] ASTA_TELEMETRY_ENABLED env var kill switch
- [ ] Per-tool configurable timeout via ToolDefinition.timeout
- [ ] pg_cron retention for tool_telemetry (30 days)
- [ ] Message windowing in checkpoint serialization (last 20 messages)
- [ ] Max recovery attempts counter (prevent infinite checkpoint loops)
- [ ] Checkpoint staleness check (reject if > 1h old for time-sensitive tools)
- [ ] Telemetry connection pooling (reuse Supabase client singleton)
