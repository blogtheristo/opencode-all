---
name: kya
description: Use when checking a session trust score or triggering a TC-4 Leash Snap for a compromised agent chain.
---

Execute KYA safety controls against a running agent session via the DWS CLI.

Input: $ARGUMENTS (session ID — and optionally `snap` with a reason code, or `status` to read the trust score)

## Subcommands

| Form                                                            | What it does                                                                        |
| --------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `/kya status <session_id>`                                      | Read trust score + identity binding for a session                                   |
| `/kya snap <session_id> --reason <CODE>`                        | Trigger a TC-4 Leash Snap (chain termination with forensic dump). DESTRUCTIVE.      |
| `/kya snap <session_id> --reason <CODE> --force-cascade --yes`  | Cascade termination to all child agents, skip confirmation                          |
| `/kya snap <session_id> --reason <CODE> --dry-run`              | Preview the termination payload without executing — SAFE, use first                 |

## Steps

1. Parse `$ARGUMENTS` into `{subcommand, sessionId, reason, flags}`.
2. If destructive (`snap` without `--dry-run`), ALWAYS:
   - Confirm the session ID once more in plain text
   - Default to `--dry-run` first if the user hasn't already seen a dry-run preview
   - Require the user to type the session ID back before running without `--dry-run`
3. Run the CLI:
   - Status: `cd cli && npx tsx src/cli.ts kya status <sessionId>`
   - Dry-run snap: `cd cli && npx tsx src/cli.ts kya snap <sessionId> --reason <CODE> --dry-run`
   - Real snap: `cd cli && npx tsx src/cli.ts kya snap <sessionId> --reason <CODE> [--force-cascade] --yes`
4. Report the result:
   - For `status`: show trust score, identity binding, last verification, active policies
   - For `snap`: show `agentsTerminated`, `durationMs`, reason, forensic dump location

## Reason codes

| Code                 | When to use                                                       |
| -------------------- | ----------------------------------------------------------------- |
| `MANUAL_SNAP`        | Default — human-triggered, no specific policy violation           |
| `TRUST_VIOLATION`    | Agent behavior no longer consistent with bound human intent       |
| `POLICY_BREACH`      | Agent broke an explicit policy rule (e.g., touched RED-zone file) |
| `IDENTITY_REVOKED`   | Upstream IdP (Shufti Pro) revoked the human identity              |
| `CONTAINMENT_BREACH` | Agent attempted to escape MicroVM / sandbox boundary              |
| `KILL_SWITCH`        | Emergency stop from ops dashboard or incident response            |

## Backend

- `POST /api/v1/kya/snap` → `terminateChain()` in `src/identity/kya-engine.ts`
- `GET  /api/v1/kya/status/:sessionId`
- Auth: `Bearer $DWS_API_TOKEN` or `x-admin-key: $ADMIN_API_KEY` (timing-safe)
- Webhooks: Shufti Pro → `/api/v1/kya/*` (`src/routes/kya-webhook.routes.ts`)

## When NOT to use

- Suspending a scheduled job — use job-runner controls instead
- Database-level rollback — use migration tooling
- Revoking a user's platform access — use Supabase Auth admin tools
- General "agent isn't working" debugging — use `/dws health` first

## Safety

- `kya snap` is a DESTRUCTIVE action listed in `Admin/SECURITY_COMPLIANCE.md`
- Every run is audit-logged server-side with `source: 'cli'`
- Forensic dumps are retained per `docs/KYA_BYO_LIFECYCLE.md`
- Do NOT run `kya snap` without `--dry-run` first unless the situation is an active incident
