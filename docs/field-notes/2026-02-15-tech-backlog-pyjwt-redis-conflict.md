# Tech Backlog: PyJWT Dependency Conflict (redis ↔ supabase-auth)

**Date:** 2026-02-15
**Priority:** Low
**Status:** Open (runtime-safe, pip warning only)
**Component:** `mcp-hub/requirements.txt`, Python venv

---

## Issue

`redis[hiredis]==5.3.0` pins `PyJWT~=2.9.0`, but `supabase-auth 2.27.2` requires `pyjwt[crypto]>=2.10.1`.

Both packages work correctly at runtime with **PyJWT 2.11.0** — the `~=2.9.0` pin in redis is overly strict and only triggers a pip resolver warning, not an actual incompatibility.

## Current State

```
redis[hiredis]==5.3.0   → wants PyJWT~=2.9.0
supabase-auth==2.27.2   → wants PyJWT[crypto]>=2.10.1
installed:              → PyJWT==2.11.0 (works for both)
```

pip emits a dependency-conflict warning on install but everything runs fine.

## Resolution

This resolves itself when either:

1. **redis** releases a version that relaxes the PyJWT pin (likely next minor)
2. **We upgrade redis** past 5.3.0 once a newer version is available

## Action

- No code change needed now
- Revisit when bumping `mcp-hub/requirements.txt` dependencies
- Track upstream: https://github.com/redis/redis-py/issues
