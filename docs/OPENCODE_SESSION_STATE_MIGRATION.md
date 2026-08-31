# OpenCode-all Session State Migration to Supabase

## Overview

Session state has been migrated from `.workflows/opencode-all/queue.jsonl` (file-based) to a Supabase `opencode_sessions` table for reliability, queryability, and observability.

## Benefits

✅ **Transactional safety** — No more merge conflicts or partial updates  
✅ **Proper querying** — Filter by state, branch, failure reason  
✅ **Lifecycle tracking** — Automatic timestamps, audit trail  
✅ **Observability** — Query session stats, retry patterns, failure analysis  
✅ **RLS enforcement** — Service role isolation, audit-safe  
✅ **Indexed performance** — O(1) lookups by state, branch, idempotency key

## Schema

```sql
opencode_sessions
├── id (TEXT, PRIMARY KEY)
├── title (TEXT)
├── state (PENDING | RUNNING | DONE | FAILED)
├── status (pending | running | completed)
├── idempotency_key (TEXT, UNIQUE)
├── baseline_commit (TEXT)
├── branch (TEXT)
├── worktree_path (TEXT)
├── attempts (INTEGER)
├── failure_code (TEXT)
├── failure_detail (JSONB)
├── created_at (TIMESTAMP)
├── last_run (TIMESTAMP)
└── [8 more fields...]
```

## Deployment Steps

### 1. Apply migration

```bash
# Option A: Via Supabase CLI
supabase migration up

# Option B: Manual SQL
psql $DATABASE_URL < supabase/migrations/076_opencode_session_state.sql
```

### 2. Verify table exists

```sql
SELECT COUNT(*) FROM opencode_sessions;
```

### 3. Migrate existing sessions (optional)

```bash
npx tsx scripts/migrate-opencode-queue-to-supabase.ts
```

This reads `.workflows/opencode-all/queue.jsonl`, loads all sessions into the table, and backs up the original file.

### 4. Update OpenCode orchestrator

Replace JSONL I/O with `SessionManager`:

```typescript
import { sessionManager } from "@src/opencode/session-manager";

// Instead of: readFileSync(queue.jsonl)
const pending = await sessionManager.getPendingSessions();

// Instead of: writeFileSync(queue.jsonl)
await sessionManager.updateSession(id, { state: "RUNNING" });
```

### 5. Archive old queue

```bash
# Keep as backup
mv .workflows/opencode-all/queue.jsonl .workflows/opencode-all/queue.jsonl.archived-2026-08-31
```

## Usage Examples

### Create a session

```typescript
const session = await sessionManager.createSession({
  id: "ses_abc123",
  title: "My OpenCode session",
  source: "detect",
  branch: "feature/my-work",
  baseline_commit: "abc123",
});
```

### Get pending sessions

```typescript
const pending = await sessionManager.getPendingSessions(limit: 10);
```

### Update on success

```typescript
await sessionManager.completeSession(sessionId);
```

### Handle failure with retry

```typescript
await sessionManager.failSession(sessionId, "worktree_not_found", { path: "/repo/.worktrees/..." });
// Automatically increments attempts, marks for retry
```

### Clean up stale worktrees

```typescript
// Query sessions with removed worktrees older than 72 hours
const stale = await sessionManager.getStaleWorktrees(72);

// Delete them
const deleted = await sessionManager.deleteStaleWorktrees(72);
console.log(`Cleaned up ${deleted} sessions`);
```

### Get stats dashboard

```typescript
const stats = await sessionManager.getSessionStats();
// { DONE: 120, FAILED: 8, PENDING: 2, RUNNING: 0 }
```

## Querying with Supabase client

```typescript
// Raw queries (if needed)
const { data } = await supabase
  .from("opencode_sessions")
  .select("*")
  .eq("state", "FAILED")
  .order("last_run", { ascending: true })
  .limit(10);
```

## Troubleshooting

### Migration fails on duplicate idempotency_key

The table uses `UNIQUE(idempotency_key)`. If you're migrating and get a conflict, remove duplicates from the JSONL first:

```typescript
const seen = new Set();
const lines = fs.readFileSync("queue.jsonl", "utf-8").split("\n");
const unique = lines.filter((line) => {
  const { idempotencyKey } = JSON.parse(line);
  if (seen.has(idempotencyKey)) return false;
  seen.add(idempotencyKey);
  return true;
});
```

### Sessions not appearing in DB

Check Supabase connection:

```bash
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="eyJ..."
npx tsx -e "
import { SessionManager } from '@src/opencode/session-manager';
const sm = new SessionManager();
console.log(await sm.getSessionStats());
"
```

## Performance Notes

- Indexes on `state`, `status`, `branch`, `last_run` enable fast filtering
- Compound index `(state, status)` for the most common query pattern
- Archival: sessions older than 90 days can be moved to a `opencode_sessions_archive` table for long-term retention

## Next: Observability Dashboard

Once sessions are in Supabase, create a monitoring dashboard:

```sql
-- Session success rate (last 7 days)
SELECT
  DATE(created_at) as date,
  COUNT(*) as total,
  SUM(CASE WHEN state = 'DONE' THEN 1 ELSE 0 END) as success,
  SUM(CASE WHEN state = 'FAILED' THEN 1 ELSE 0 END) as failed
FROM opencode_sessions
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY DATE(created_at);

-- Retry distribution
SELECT
  failure_code,
  COUNT(*) as count,
  AVG(attempts) as avg_attempts
FROM opencode_sessions
WHERE state = 'FAILED'
GROUP BY failure_code
ORDER BY count DESC;
```

## Rollback Plan

If needed to revert:

1. Stop OpenCode orchestrator
2. Export current state: `SELECT * FROM opencode_sessions` → JSON
3. Convert back to JSONL format
4. Restore old queue.jsonl
5. Restart with file-based system

Rollback is safe because old queue.jsonl is archived.
