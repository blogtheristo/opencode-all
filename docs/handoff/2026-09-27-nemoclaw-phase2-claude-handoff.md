# Claude Cloud Handoff — NemoClaw Phase 2

**Prepared:** 2026-09-27 16:43 EEST
**Repository:** `blogtheristo/dws6`
**State:** Phase 2 code and documentation are merged; no runtime rollout has occurred.

## Copy-paste prompt for Claude

```text
You are continuing the DWS Themis-to-NemoClaw Phase 2 work. Start from the
current origin/main; do not resume an old branch without checking it. First
read docs/handoff/2026-09-27-nemoclaw-phase2-claude-handoff.md,
docs/architecture/openclaw-nemoclaw-adoption.md,
Admin/ADMIN_MANUAL.md (NemoClaw section), DWS_DEPLOYMENT_STANDARD.md
(NemoClaw Runtime), and the merged PRs #2175 and #2176.

The next priority is a code-level trust-boundary investigation, not Phase 3
or deployment. Trace the path for creating and consuming Themis bridge
verdicts. In particular, issueThemisBridgeVerdict currently takes
callerAgentId and operatorId as string inputs, and no production call site
was found at handoff. Establish whether those values can be derived from
authenticated runtime context rather than caller/harness input. Add an
enforced boundary and impersonation tests only if you can do so without
inventing an identity provider or weakening compatibility. If an authenticated
principal source does not exist, stop at a documented architecture decision
and implementation plan instead of fabricating identity or claiming it is
verified.

Do not apply migrations, deploy to DGX, provision or rotate secrets, change
customer traffic, or run a live pilot without separate explicit approval.
Keep the Phase 3 partner workflows, Teams adapter, signed-skill rollout, and
reversible writes deferred. Runtime-side bearer-token validation, pinned
image/SBOM, OpenShell host/network/process isolation, a read-only Athena pilot,
audit reconstruction, and rollback evidence are still unverified.

Use a fresh branch from current main, inspect status and PR/check state before
editing, follow CLAUDE.md and repository standards, test focused changes plus
typecheck/full tests as appropriate, and commit/push/open a PR only for
verified, scoped work. Report blockers and distinguish code-level tests from
live runtime evidence.
```

## Merged work

- **PR #2175** — Themis-to-NemoClaw invocation binding; merge commit
  `5d506e5a19d3be0228457d1079abf88b181a6ce0`.
- **PR #2176** — Admin/deployment/architecture guidance and synchronized
  recovery Learn artifact; merge commit
  `ed0ec9c41b01576c063fd05d4461037af327790d`.
- `origin/main` was at `ed0ec9c41` when this handoff was prepared. Verify
  the current branch and remote state before continuing.
- Local push-time CI passed on the merged code and documentation commits.
  Some GitHub checks remained queued at merge; inspect current checks rather
  than assuming they later completed.

## What Phase 2 added

- `src/security/runtime-auth.ts` exports `issueThemisBridgeVerdict()`, which
  applies the existing per-tool authorization gate and signs a short-lived,
  request-scoped KYA verdict.
- `src/mcp/nemoclaw-bridge.ts` requires a valid verdict matching operator,
  tenant, agent, session, skill, and canonical parameter digest; requires the
  runtime bearer credential and Article 12 sink; and fails closed before
  dispatch when authorization or audit fails.
- `src/mcp/command-audit-logger.ts` writes a single-use authorization ID.
  Mirrored migrations add that ID plus `hash_version`; pre-migration rows
  remain version 1 and new rows use version 2.
- Migration files:
  `supabase/migrations/101_270926_nemoclaw_kya_invocation_binding.sql` and
  `infrastructure/dgx-spark/migrations/024_nemoclaw_kya_invocation_binding.sql`.
  They are committed only and **must remain unapplied** absent explicit
  approval.
- Documentation: `docs/architecture/openclaw-nemoclaw-adoption.md`,
  `Admin/ADMIN_MANUAL.md`, `DWS_DEPLOYMENT_STANDARD.md`, and the synchronized
  pair `docs/field-notes/2026-09-27-four-session-recovery-remediation.md` /
  `Learn/2026-09-27-four-session-recovery-remediation.html`.

## Unresolved trust and rollout gates

1. **Identity provenance is not proven.** The verdict issuer currently accepts
   `callerAgentId` and `operatorId` from its caller. No production call site
   was found at handoff, and no upstream binding to an authenticated principal
   was verified. Do not represent string equality in the bridge as proof of
   identity.
2. **Runtime authentication is unverified.** The bridge sends a bearer token,
   but the NemoClaw RPC server's validation behavior was not inspected or
   proven.
3. **Sandbox and supply chain are unverified.** The current deployment image
   is not proven pinned/signed, and environment egress flags do not prove
   OpenShell/OS-level file, network, or process isolation.
4. **Pilot and operations are unverified.** No read-only Athena workflow was
   selected or tested; no complete live audit reconstruction or rollback
   measurement was performed.
5. **Migrations are unapplied.** Keep both copies identical and do not run
   `supabase db push` or apply either migration without approval.

## Validation record

- Full Vitest run on the Phase 2 implementation: **1,777 passed, 33 skipped**.
- Focused KYA/NemoClaw tests: **29 passed**.
- TypeScript typecheck and targeted ESLint passed.
- Push-time local CI passed on the final Phase 2 code and documentation
  commits; the Learn HTML was regenerated with Pandoc and byte-compared with
  a fresh render of its Markdown source.
- Migration naming and mirrored migration bodies were checked. No migration
  was applied; no DGX deployment, secret provisioning, or production traffic
  change occurred.
