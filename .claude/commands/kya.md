---
name: kya
version: 2.0
date: 2026-05-07
description: 'KYA+I runtime safety controls for agent sessions and inference jurisdiction. Check trust score, IJS, provider chain, or trigger a TC-4 leash snap. Use when user says "kya status", "trust score", "leash snap", "kill the agent", "IJS score", or "inference jurisdiction".'
---

Execute KYA+I safety controls against a running agent session via the DWS CLI.

KYA answers: _who is this agent, can I trust it?_
KYA+I extends: _where does this agent think, and can I legally trust that location?_

Input: $ARGUMENTS (session ID + subcommand — see table below)

Also triggers on: "terminate agent chain", "kya snap", "revoke agent", "TC-4",
"where is inference running", "CLOUD Act check", "EU inference" — trimmed from
the frontmatter `description` by `/skill-cleaner` (2026-08-20, budget was at
94.7% of the 2% skills cap) but the capability is unchanged; these phrases
still route here.

## Subcommands

| Form                                                           | What it does                                                                             |
| -------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `/kya status <session_id>`                                     | Trust score + identity binding for a session                                             |
| `/kya inference <session_id>`                                  | ⚠️ **Planned — not yet implemented.** Will provide IJS, provider chain, CLOUD Act flags. |
| `/kya snap <session_id> --reason <CODE>`                       | TC-4 Leash Snap — chain termination with forensic dump. DESTRUCTIVE.                     |
| `/kya snap <session_id> --reason <CODE> --force-cascade --yes` | Cascade termination to all child agents, skip confirmation                               |
| `/kya snap <session_id> --reason <CODE> --dry-run`             | Preview termination payload without executing — SAFE, use first                          |

## Steps

1. Parse `$ARGUMENTS` into `{subcommand, sessionId, reason, flags}`.
2. If destructive (`snap` without `--dry-run`), ALWAYS:
   - Confirm the session ID once more in plain text
   - Default to `--dry-run` first if the user hasn't seen a dry-run preview
   - Require the user to type the session ID back before running without `--dry-run`
3. Run the CLI:
   - Status: `cd cli && npx tsx src/cli.ts kya status <sessionId>`
   - Inference: **not yet available** — `kya inference` is not yet implemented in the CLI; inform the user and suggest using `/kya status` instead.
   - Dry-run snap: `cd cli && npx tsx src/cli.ts kya snap <sessionId> --reason <CODE> --dry-run`
   - Real snap: `cd cli && npx tsx src/cli.ts kya snap <sessionId> --reason <CODE> [--force-cascade] --yes`
4. Report the result:
   - For `status`: trust score, identity binding, last verification, active policies
   - For `inference`: inform the user this subcommand is not yet available
   - For `snap`: `agentsTerminated`, `durationMs`, reason, forensic dump location

## Inference Jurisdiction Score (IJS)

IJS is 0-100, computed at session start and re-evaluated on every provider switch.

| IJS    | Tier      | EU AI Act posture                                    | KYA+I action                                 |
| ------ | --------- | ---------------------------------------------------- | -------------------------------------------- |
| 90–100 | Sovereign | Fully EU-compliant, on-prem or EU-only inference     | None                                         |
| 70–89  | Compliant | Meets Art. 12 + GDPR for high-risk AI                | Minor gap remediation                        |
| 40–69  | Partial   | OK for limited-risk AI; not for high-risk            | Disclose to customer, get written acceptance |
| 0–39   | Exposed   | CLOUD Act or no DPA — unacceptable for EU enterprise | Block or escalate to C-level                 |

## Three-jurisdiction model

| Zone        | Typical providers                                       | CLOUD Act          | IJS ceiling | Default posture                                   |
| ----------- | ------------------------------------------------------- | ------------------ | ----------- | ------------------------------------------------- |
| **EU**      | Scaleway (FR), UpCloud (FI), OVHcloud (FR), on-prem DGX | No                 | 100         | Primary for all EU customers                      |
| **US**      | OpenAI, Anthropic, Groq, AWS, Azure, GCP                | **YES**            | 15          | Dev/demo/admin only. Blocked for EU customer data |
| **ASEAN**   | AWS SG region, GCP SG, local DCs                        | Varies per country | 58          | Per-country scoring required                      |
| **ON_PREM** | DGX Spark Espoo, Jetson fleet                           | No                 | 100         | Sovereign tier — zero CLOUD Act                   |

## Reason codes — identity

| Code                 | When to use                                                      |
| -------------------- | ---------------------------------------------------------------- |
| `MANUAL_SNAP`        | Human-triggered, no specific policy violation                    |
| `TRUST_VIOLATION`    | Agent behavior no longer consistent with bound human intent      |
| `POLICY_BREACH`      | Agent broke an explicit policy rule (e.g. touched RED-zone file) |
| `IDENTITY_REVOKED`   | Upstream IdP (Shufti Pro) revoked the human identity             |
| `CONTAINMENT_BREACH` | Agent attempted to escape MicroVM / sandbox boundary             |
| `KILL_SWITCH`        | Emergency stop from ops dashboard or incident response           |

## Reason codes — inference (KYA+I v2.0)

| Code                               | When to use                                                                     |
| ---------------------------------- | ------------------------------------------------------------------------------- |
| `INFERENCE_JURISDICTION_BREACH`    | Agent switched to non-EU provider without authorisation for EU customer session |
| `CLOUD_ACT_EXPOSURE`               | Inference routing through US-parent provider, CLOUD Act flag triggered          |
| `PROMPT_RETENTION_DETECTED`        | Provider began retaining prompts after session DPA declared no-retention        |
| `DPA_LAPSED`                       | Data processing agreement expired or revoked by provider                        |
| `INFERENCE_FALLBACK_POLICY_BREACH` | Fallback chain stepped outside approved jurisdictions                           |

## DWS inference stack (IJS by provider)

| Provider                     | Zone    | IJS | Notes                                   |
| ---------------------------- | ------- | --- | --------------------------------------- |
| Scaleway `fr-par` / `nl-ams` | EU      | 95  | Primary; DPA auto-bound; no retention   |
| On-prem DGX Spark (Espoo)    | ON_PREM | 100 | Sovereign; own hardware; zero CLOUD Act |
| NVIDIA NIM EU region         | EU/US   | 55  | US parent offsets EU DC — Partial tier  |
| Groq (api.groq.com)          | US      | 12  | CLOUD Act exposed; dev/demo only        |
| OpenAI / Azure OpenAI        | US      | 10  | Blocked for EU customer data            |

## Backend

- Implemented: `POST /api/v1/kya/snap` → `terminateChain()` in `src/identity/kya-engine.ts`
- Planned/future: `GET /api/v1/kya/status/:sessionId`
- Planned/future: `GET /api/v1/kya/inference/:sessionId` → intended to return an `inference` block with IJS once the route is added
- Auth: `Bearer $DWS_API_TOKEN` or `x-admin-key: $ADMIN_API_KEY` (timing-safe)
- Webhooks: Shufti Pro → `/api/v1/kya/*` (`src/routes/kya-webhook.routes.ts`)
- Planned/future: Art. 12 inference log archival to Scaleway Object Storage WORM (`dws-iq-aegis` project) once the log writer is implemented

## When NOT to use

- Suspending a scheduled job — use job-runner controls instead
- Database-level rollback — use migration tooling
- Revoking a user's platform access — use Supabase Auth admin tools
- General "agent isn't working" debugging — use `/dws health` first
- EU data sovereignty of the database layer — use `/sovereignty-assess`

## Safety

- `kya snap` is a DESTRUCTIVE action listed in `Admin/SECURITY_COMPLIANCE.md`
- Every run is audit-logged server-side with `source: 'cli'`
- Forensic dumps are retained per `docs/KYA_BYO_LIFECYCLE.md`
- Do NOT run `kya snap` without `--dry-run` first unless the situation is an active incident
- Full KYA+I concept: `docs/field-notes/2026-05-07-kyai-european-inference-sovereignty.md`
