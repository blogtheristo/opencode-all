# Handoff — opencode/aegis-pilot-doctor

**Branch:** opencode/aegis-pilot-doctor  
**Commit:** c2803d66c27a  
**Date:** 2026-09-29

## Task

Add a read-only 'doctor' command to `scripts/aegis-pilot.ts` backed by a new `src/aegis/pilot/doctor.ts` (export it from `src/aegis/pilot/index.ts`).

## Changes Made

### `src/aegis/pilot/doctor.ts`
- Added 6 checks: `state-dir-mode`, `site-key-mode`, `ledger-local-fs`, `ledger-verifies`, `key-pinned`, `isolation-tool`
- Each check returns `{check, ok, detail}` in the result array
- Returns `{ok, checks}`; exits 0 only if every check passes
- Never modifies state

### `src/__tests__/aegis-pilot-doctor.test.ts`
- 15 tests covering all 6 check types
- Uses tmp dirs, no network
- Creates ledger with genesis event before sealing for `ledger-verifies` tests
- Fixed lint: removed unused imports, prefixed unused vars with `_`

### `scripts/aegis-pilot.ts`
- `doctor --state-dir D [--scope F]` prints one JSON document and exits 0 only if every check passes

## Done Gate

All checks passed:
- ✅ committed
- ✅ pushed
- ✅ format
- ✅ todo
- ✅ typecheck
- ✅ lint
- ✅ tests
- ✅ spec: doctor ok on fresh site
- ✅ spec: doctor flags world-writable state dir
- ✅ spec: doctor suite passes

## Notes

- `ledger-verifies` calls `verifySegments(stateDir, site)` which checks sealed segments, seals, links, and active ledger
- `key-pinned` requires `--scope` option; missing pin = fail
- `isolation-tool` warns-only on non-Linux systems (`ok:true` with detail)
