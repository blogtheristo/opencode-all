<!-- Evidence: Tool=Claude-Code-2.1.283 Model=anthropic/claude-opus-5-5 Agent=claude-code-web Date=2026-09-27 -->
<!-- Audit trail: git log -- docs/field-notes/2026-09-27-themis-bridge-principal-boundary.md -->

# Themis bridge verdicts — authenticated-principal boundary

---

# VERSION AND AGENT HISTORY

Version: 1.0 [Latest]

Sessions & Modifications:

- Version: 1.0 [Latest] | Tool: Claude Code 2.1.283 | Session: claude/festive-newton-1qvp0q | Date: 27.09.2026 | Changes: Traced Themis bridge verdict creation and consumption; bound operator, tenant and agent identity to verified credentials; recorded the decision, remaining gaps and the call-site plan. | Harness: Claude Code on the web + CLAUDE.md + DWS standards | HIC-approved-drift: none

Document Status:

- Created: 27.09.2026
- Last Modified: 27.09.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE
- Classification: INTERNAL

---

## Question

Handoff gate 1 (`docs/handoff/2026-09-27-nemoclaw-phase2-claude-handoff.md`): `issueThemisBridgeVerdict()` accepted `callerAgentId` and `operatorId` as free strings. Can those values come from authenticated runtime context instead of caller or harness input?

## Trace (code at `origin/main` b00f319)

| Step           | Location                                                    | Finding                                                                                                                  |
| -------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Issue          | `src/security/runtime-auth.ts` `issueThemisBridgeVerdict()` | Operator, agent and tenant were copied from caller input into the signed scope.                                          |
| Issue (bypass) | `issueKyaVerdict()`, exported                               | Any in-process caller could sign `gate: 'themis-policy-gate'` with an arbitrary scope. Two test suites did exactly that. |
| Consume        | `src/mcp/nemoclaw-bridge.ts` `verifyBridgeAuthorization()`  | String equality between request fields and signed scope. Sound only if the signed scope was sound.                       |
| Call sites     | whole `src/`                                                | None. Neither the issuer nor `NemoClawBridge.invoke()` has a production caller.                                          |

## Authenticated principal sources that already exist

1. **Operator and tenant — DWS access JWT.** `AuthService.verifyAccessToken()` (`src/services/auth.service.ts`): HS256 pinned, revocation list, refresh tokens rejected. Claims `userId` and `organizationId`/`orgId`. The same verifier backs `authenticateToken` middleware.
2. **Agent — capability bearer token.** `authenticateBrokerToken()` (`src/broker/capability-tokens.ts`): registry `BROKER_AGENT_TOKENS` of SHA-256 hashes, timing-safe comparison, per-agent scopes. Built for NemoClaw/Hermes runtimes calling the credential broker.

Neither is invented here. Both are in production code paths today (auth middleware, broker routes).

## Decision

- New module `src/security/themis-principal.ts`. `resolveThemisPrincipal({ operatorAccessToken, agentBearerToken })` verifies both credentials and returns a frozen `ThemisPrincipal { operatorId, orgId, agentId }`. Tenant comes from the operator token, never from the request.
- An agent token must carry the new `themis-bridge` scope. Existing broker-only tokens cannot obtain a bridge verdict (narrowing, not widening).
- `issueThemisBridgeVerdict()` now takes `principal` instead of `callerAgentId`/`operatorId`. It throws unless the principal is the exact object the resolver minted (module-private `WeakSet`), and unless `context.orgId` equals the operator's tenant.
- `issueKyaVerdict()` refuses to sign the reserved `themis-policy-gate`; only `issueThemisBridgeVerdict()` can.

## Verification (code-level only)

- `src/__tests__/security/themis-principal.test.ts`, 15 tests: forged operator token, refresh token, revoked token, missing tenant, unregistered agent token, broker-only agent token, hand-built principal, copied principal with swapped operator, cross-tenant context, bridge request claiming a different agent or operator (with a positive control).
- Mutation check: removing each guard (principal check, tenant check, reserved gate) makes at least one test fail.
- Typecheck and ESLint clean. Full Vitest: 1,769 passed, 20 skipped; 4 `scripts/__tests__/*tree-gate*` files fail on this branch **and on baseline** because the container exports `GIT_CONFIG_COUNT`.

No live runtime, DGX host, migration, secret or traffic was touched.

## What this does not prove

1. **No production call site.** The boundary is enforced at the API, but nothing calls it yet. Until a route does, runtime identity provenance is unverified.
2. **In-process trust.** Any code in the API process can read `KYA_VERDICT_SIGNING_SECRET` and sign directly. The `WeakSet` and reserved gate stop accidental misuse, not malicious in-process code.
3. **Agent ↔ operator binding.** Any `themis-bridge` agent can pair with any authenticated operator. `DWS_SECURITY_STANDARD.md` §18.4 G2 (identity binding) is not enforced here.
4. **Caller-supplied fields remain:** `sessionId`, `trustScore`, `policyVersion`. Trust score should come from the ATS engine, not the caller.
5. **Tenant membership.** The JWT org claim is trusted as issued; `requireOrgAdmin` notes that `organization_members` is not queried.
6. Handoff gates 2–5 (runtime bearer validation, image/SBOM, OpenShell isolation, pilot/audit/rollback, unapplied migrations) are unchanged.

## Plan for the first call site (not implemented)

1. A Themis route under `src/routes/` behind `authenticateToken`, accepting the harness capability token in a separate header (e.g. `X-DWS-Agent-Token`), never in the body.
2. Route calls `resolveThemisPrincipal()`, then `issueThemisBridgeVerdict()` with `context.orgId = principal.orgId` and `trustScore` from the ATS engine, then `bridge.invoke()` with request fields copied from `verdict.scope`.
3. Provision a `themis-bridge` scoped entry in `BROKER_AGENT_TOKENS` (secret operation — HIC approval).
4. Add agent ↔ operator/tenant binding (G2) before any partner tenant is admitted.
5. Route-level impersonation tests (supertest), then a read-only Athena pilot under the existing gates.

## HIC decision

See the PR description / session chat for the open question on agent ↔ operator binding.
