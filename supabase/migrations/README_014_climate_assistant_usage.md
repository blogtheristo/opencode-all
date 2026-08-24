# Migration 014: Climate Assistant Usage Tracking

**Created:** 2026-01-28  
**Issue:** https://github.com/blogtheristo/dws6/pull/300#discussion_r2737911476

## Problem

The Climate Assistant service was using in-memory (`module-level`) daily usage tracking, which caused issues in serverless/multi-instance deployments:

1. **Cold starts**: Usage counters reset to zero on every cold start
2. **Multiple instances**: Each Cloud Run instance maintains separate counters
3. **Budget overruns**: The $1/day cap could be exceeded across instances
4. **Inaccurate stats**: Usage statistics incomplete and unreliable

## Solution

Persist usage tracking in **Supabase** (PostgreSQL) for reliable budget enforcement:

### Database Schema

```sql
CREATE TABLE climate_assistant_usage (
  id uuid PRIMARY KEY,
  date date NOT NULL UNIQUE,
  input_tokens bigint DEFAULT 0,
  output_tokens bigint DEFAULT 0,
  requests integer DEFAULT 0,
  cost_usd numeric(10, 6) DEFAULT 0.0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### Helper Functions

1. **`get_or_create_usage_for_date(date)`**: Gets existing record or creates new one
2. **`increment_climate_usage(date, input_tokens, output_tokens, cost)`**: Atomically increments usage counters (safe for concurrent calls)

### Service Changes

Modified `src/services/climate-assistant.service.ts`:

- ✅ Replaced in-memory `dailyUsage` with Supabase queries
- ✅ Made `isBudgetExceeded()` async to query database
- ✅ Made `trackUsage()` async to persist to database
- ✅ Made `getUsageStats()` async to fetch from database
- ✅ Added fail-open behavior: if Supabase is unavailable, allow requests (logged as warning)

### Route Changes

Modified `src/routes/climate-assistant.routes.ts`:

- ✅ Updated `/api/climate-assistant/usage` endpoint to `async` handler

## Testing

```bash
# 1. Apply migration to Supabase
psql $DATABASE_URL -f supabase/migrations/014_climate_assistant_usage.sql

# 2. Test budget tracking
curl -X POST http://localhost:8080/api/climate-assistant \
  -H "Content-Type: application/json" \
  -d '{"message": "What is CSRD?"}'

# 3. Check usage stats
curl http://localhost:8080/api/climate-assistant/usage

# Expected output:
# {
#   "service": "climate-assistant",
#   "date": "2026-01-28",
#   "requests": 1,
#   "inputTokens": 150,
#   "outputTokens": 200,
#   "cost": 0.0001,
#   "budget": 1.0,
#   "remaining": 0.9999,
#   "percentUsed": 0,
#   "provider": "groq",
#   "model": "llama-3.3-70b-versatile"
# }
```

## Deployment

### Cloud Run

No additional configuration needed. Existing secrets are sufficient:
- ✅ `SUPABASE_URL` (already configured)
- ✅ `SUPABASE_SERVICE_KEY` (already configured)
- ✅ `GROQ_API_KEY` (already configured)

### Supabase

1. Apply migration via Supabase CLI or SQL Editor:
   ```bash
   supabase db push
   ```

2. Verify table exists:
   ```sql
   SELECT * FROM climate_assistant_usage;
   ```

## Monitoring

### Logging

The service logs all usage tracking events:

```
INFO  Usage tracked in Supabase {
  inputTokens: 150,
  outputTokens: 200,
  dailyCost: '$0.0001',
  dailyBudget: '$1.0000',
  remainingBudget: '$0.9999',
  requests: 1
}
```

### Alerts

Set up alerts for:
- Daily cost approaching $0.80 (80% of budget)
- Budget exceeded (cost >= $1.00)
- Supabase connection failures

## Rollback

If issues arise, revert by:

1. Checkout previous commit:
   ```bash
   git checkout <previous-commit>
   ```

2. Redeploy service

3. Migration does NOT need to be rolled back (table is harmless if unused)

## Security

- **RLS Policies**: Only `service_role` can access the table
- **No public access**: Anonymous and authenticated users blocked
- **Atomic operations**: `increment_climate_usage()` prevents race conditions

## Performance

- **Single query per request**: `increment_climate_usage()` uses UPSERT
- **Indexed lookups**: `date` column indexed for fast queries
- **Minimal overhead**: ~10-20ms per request for database operations

## References

- Original PR: #300
- Review comment: https://github.com/blogtheristo/dws6/pull/300#discussion_r2737911476
- Migration file: `supabase/migrations/014_climate_assistant_usage.sql`
- Service file: `src/services/climate-assistant.service.ts`
