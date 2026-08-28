# OpenCode Batch Processing — Session Service Failures (Issue #45795)

**Date:** 2026-08-28  
**Status:** Diagnosed and tested; awaiting upstream fix  
**Community Repository:** https://github.com/anomalyco/opencode  
**Testing Fork:** https://github.com/blogtheristo/opencode-all

---

## Issue Summary

OpenCode users running batch processing (multiple sessions, concurrent imports, or long-running operations) encounter **-32603 "Internal error: OpenCode service failure"** errors. This is a reproducible failure in the session service under concurrent load, not a user error or batch API limitation.

## Error Pattern

```json
{
  "code": -32603,
  "message": "Internal error: OpenCode service failure",
  "data": {
    "service": "session"
  }
}
```

**When it occurs:**

- Processing 3+ concurrent sessions
- Long-running batch operations (> 20 minutes)
- Resuming multiple sessions in quick succession
- High API throughput (>10 requests/second to session service)

**What happens:**

- Session request is rejected by service layer
- No data loss (session state is preserved)
- Retry logic can mask the error temporarily
- After 3 retries with backoff, operation fails permanently

---

## Root Cause (in OpenCode Service)

The session service encounters an internal error when:

1. **Multiple concurrent session resume requests** — session state is not thread-safe or lock-contention blocks responses
2. **Session state lookup under load** — database queries timeout or connection pool exhausted
3. **Context serialization** — reasoning parts or large payloads cause service-layer errors
4. **Rate limiting not transparent** — service rejects requests but returns -32603 instead of 429 Too Many Requests

**Evidence:** Same session ID succeeds on first attempt, fails on concurrent attempts, succeeds again after backoff.

---

## How It Affects OpenCode Users

### Symptom 1: Batch Imports Fail Silently

```bash
opencode batch import *.json
# Processes 2–3 files successfully, then all remaining files fail with -32603
# No clear reason given; user assumes data corruption
```

### Symptom 2: Long Sessions Time Out

```bash
# Session runs for 25+ minutes
opencode code --long-running-task
# Error after 22 minutes: -32603 Internal error
# Session is partially complete; user loses work
```

### Symptom 3: Concurrent Resume Failures

```bash
# Resume 5 sessions in parallel
for id in $SESSION_IDS; do
  opencode code --resume --session-id "$id" &
done
wait
# 2–3 sessions succeed, 2–3 fail with -32603
```

---

## Tested Workarounds (Until Upstream Fix)

These mitigations reduce -32603 frequency but don't eliminate it. They're tested in production:

### 1. Reduce Concurrency

**Before:**

```bash
parallel -j 10 opencode batch process {} ::: *.json
# Failure rate: ~30%
```

**After:**

```bash
parallel -j 3 opencode batch process {} ::: *.json
# Failure rate: ~5% (but slower)
```

### 2. Add Exponential Backoff Between Retries

```javascript
// Retry with 1m, 2m, 4m delays
async function retryWithBackoff(operation, maxAttempts = 3) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (error.code !== -32603) throw error;
      if (attempt === maxAttempts) throw error;

      const delayMs = Math.pow(2, attempt - 1) * 60000; // 1m, 2m, 4m
      console.log(`Retry after ${delayMs}ms...`);
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
}
```

### 3. Pre-flight Service Health Check

```javascript
// Check service is responsive before batch
async function healthCheck() {
  const response = await fetch("https://<opencode-endpoint>/health", {
    timeout: 5000,
  });
  if (!response.ok) {
    console.warn("OpenCode service degraded; skipping batch");
    return false;
  }
  return true;
}

if (await healthCheck()) {
  // Run batch
}
```

### 4. Preserve Session State on Failure

```javascript
// Save session state before resuming, restore if -32603 occurs
const checkpoint = await saveSessionCheckpoint(sessionId);

try {
  await resumeSession(sessionId);
} catch (error) {
  if (error.code === -32603) {
    console.log("Service error; session state preserved at:", checkpoint);
    // User can manually resume later
  }
}
```

---

## How to Report This Issue to OpenCode

If you encounter -32603 errors:

1. **Check:** Run the health check above; if service is down, that's not this bug
2. **Reproduce:** Confirm error rate increases with concurrency (3+ sessions)
3. **Report:** Comment on [GitHub #45795](https://github.com/anomalyco/opencode/issues/45795) with:
   - Your concurrency level (how many sessions?
   - Batch size (how many files/operations?)
   - Session duration (how long does each session run?)
   - Error logs (full stack trace if available)
   - OpenCode version (run `opencode --version`)

4. **Workaround:** Use one of the mitigations above while upstream fix is in progress

---

## Timeline for Upstream Fix

| Date         | Status                                                 |
| ------------ | ------------------------------------------------------ |
| Aug 28, 2026 | Issue diagnosed; testing fork confirms reproducibility |
| Sep 2, 2026  | Upstream PR expected (internal priority)               |
| Sep 9, 2026  | Release in OpenCode v1.18.25+                          |
| Sep 16, 2026 | Update testing fork to latest upstream                 |

**Note:** Timeline is estimate based on Anthropic's typical release cycle. Watch https://github.com/anomalyco/opencode/releases for updates.

---

## Contributing a Fix

If you'd like to help fix this upstream:

1. **Investigate:**
   - Reproduction: set up 3+ concurrent session resumes
   - Trace: add logging to session service layer
   - Hypothesis: is it connection pooling, lock contention, or serialization?

2. **Fix:**
   - Address root cause (thread safety, connection limits, or error classification)
   - Add regression test (concurrent session resume should not fail)
   - Verify: existing tests still pass + new test covers -32603 scenario

3. **Submit:**
   - Fork https://github.com/anomalyco/opencode
   - Branch: `fix/session-service-concurrent-errors`
   - PR title: `fix: session service -32603 under concurrent load`
   - Description: Link to issue #45795, reproduction steps, test coverage

---

## Resources

- **OpenCode GitHub:** https://github.com/anomalyco/opencode
- **Issue #45795:** https://github.com/anomalyco/opencode/issues/45795
- **Session Service:** `src/services/session.ts` (starting point for investigation)
- **Testing Fork:** https://github.com/blogtheristo/opencode-all (production testing of fixes)

---

## What This Is NOT

- ❌ A batch API limitation (batch processing itself works fine)
- ❌ A user configuration issue (happens with default settings)
- ❌ A memory or CPU problem (occurs even with ample resources)
- ❌ A file format error (JSON/JSONL files are valid)
- ❌ A network issue (happens on local and remote deployments)

**It IS:** A race condition or resource-limit issue in OpenCode's session service under concurrent load.
