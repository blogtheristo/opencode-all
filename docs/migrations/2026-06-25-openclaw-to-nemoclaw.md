# Migration Plan — OpenClaw → NVIDIA NemoClaw

---

# VERSION AND AGENT HISTORY

Version: 1.1

Sessions & Modifications:

- Version: 1.1 | Tool: Claude Code | Session: claude/nvidia-vera-rubin-card-be8g7t | Date: 25.06.2026 | Changes: Reconciled status — Phases 1, 2, and 4 (cleanup) DONE and build/test-verified; Phase 3 infra files DONE, only the live deploy + secret-loader (permission-gated) remain. Closed DWS-owned config/code refs in cli/src/cli.ts, scripts/on-deploy/firehorse-snap-benchmark.ts, mcp-hub/config/\*.json. Added a Human Action Items section (secret-loader diff, hook RED→GREEN, live deploy) and refined the done-condition.
- Version: 1.0 | Tool: Claude Code | Session: claude/nvidia-vera-rubin-card-be8g7t | Date: 25.06.2026 | Changes: Initial migration plan. Phase 1 (backward-compatible env aliases) implemented.

---

**Status:** Phases 1–2 done · Phases 3–4 staged
**Owner:** Lifetime Oy / DWS IQ 6 Engineering

## Why

NemoClaw is NVIDIA's enterprise reference stack that runs the OpenClaw agent framework **inside the OpenShell kernel-level sandbox** (Seccomp BPF, policy-based filesystem/network/privilege controls, inference routing). Bare OpenClaw gives an agent shell access — a prompt-injection and supply-chain liability. Standardising DWS on NemoClaw closes that gap and removes an unsandboxed consumer-tool name from customer-facing material (cf. KYA whitepaper v1.1).

Verified real (NVIDIA primary sources): github.com/NVIDIA/NemoClaw · nvidianews.nvidia.com · docs.nvidia.com/nemoclaw · github.com/NVIDIA/NeMo-Agent-Toolkit.

## Scope (occurrence map, 2026-06-25)

| Area                                        | Hits | Disposition                                                                               |
| ------------------------------------------- | ---- | ----------------------------------------------------------------------------------------- |
| `docs/` (thesis history, dated field notes) | 293  | **Leave** — immutable historical record. Do not rewrite version histories or dated notes. |
| `Learn/` (generated thesis/WP snapshots)    | 222  | **Leave** — versioned snapshots; never edit/delete (Doc Standard §18/§20).                |
| `src/`                                      | 97   | **Migrate** (Phases 1–2).                                                                 |
| root `*.md` standards                       | 23   | **Migrate where current-state**; leave version-history lines.                             |
| `infrastructure/`                           | 17   | **Migrate** (Phase 3 — risky: live infra).                                                |
| public sites                                | 15   | KYA whitepaper customer-facing ref already fixed (v1.1); rest are mirrors.                |
| `sales-outreach/`                           | 10   | **Leave** — `Branch:` provenance metadata only, not product claims.                       |

**Rule:** never rewrite historical records (thesis `VERSION AND AGENT HISTORY`, dated field notes, generated snapshots, git branch names). Migrate only current-state runtime references and live code/infra.

## Phases

### Phase 1 — Backward-compatible aliases (DONE, additive, zero-risk)

- `src/mcp/openclaw-bridge.ts` `fromEnv()` now prefers `NEMOCLAW_*` and falls back to `OPENCLAW_*`. Existing deployments keep working unchanged.
- Add `NEMOCLAW_*` descriptors alongside `OPENCLAW_*` in `src/middleware/env-validation.ts` (optional vars) and key mappings in `src/config/secret-loader.ts` (`nemoclaw-endpoint`, `nemoclaw-api-key`).
- No removals. No infra change.

### Phase 2 — Source rename (DONE, verified)

- Renamed `src/sandbox/openclaw-sandbox.ts` → `nemoclaw-sandbox.ts`; class `OpenClawSandbox` → `NemoClawSandbox` (+ `export { NemoClawSandbox as OpenClawSandbox }` back-compat alias).
- Renamed `src/mcp/openclaw-bridge.ts` → `nemoclaw-bridge.ts`; class `OpenClawBridge` → `NemoClawBridge` (+ back-compat alias).
- Renamed + updated `src/__tests__/openclaw-bridge.test.ts` → `nemoclaw-bridge.test.ts` (new path/class; legacy `OPENCLAW_*` env vars retained in the test to exercise the Phase-1 fallback).
- **Verified:** `npm run build` (full `tsc`) green; `vitest run nemoclaw-bridge.test.ts` 2/2 green.
- **Left intentionally:** the runtime audit-event-ID prefix `openclaw-bridge-…` (log consumers may key on it) and the `openclawEndpoint`/`openclawApiKey` `BridgeConfig` field names → Phase 4, to avoid breaking observability/config consumers.

### Phase 3 — Secrets + live infra (files DONE; live deploy + secret-loader are human-gated)

- **Secret store — confirmed empty (owner, 25.06.2026): no `openclaw-*` secrets are provisioned.** With none set, `fromEnv()` falls back to `DEFAULT_BRIDGE_CONFIG`, so the secret-side cutover is a **no-op**.
- **Infra files — DONE.** `infrastructure/dgx-spark/` identifiers renamed: compose service `openclaw`→`nemoclaw`, `dws-openclaw`→`dws-nemoclaw`, `NEMOCLAW_IMAGE`/`NEMOCLAW_*` env, volumes, `CHECK_NEMOCLAW`, `heartbeat.ts`, `deploy.sh`. `NEMOCLAW_IMAGE` still defaults to the upstream OpenClaw harness image (documented).
- **Remaining (human):** the live **deploy cutover** (bring up the `nemoclaw` service, cut health checks over, retire old) and repointing `NEMOCLAW_IMAGE` at the NVIDIA-published image. See Human Action Items.

### Phase 4 — Cleanup (mostly DONE)

- **DONE:** removed the `OpenClawBridge`/`OpenClawSandbox` re-export aliases; dropped the `OPENCLAW_*` env fallback; renamed `BridgeConfig` fields (`nemoclawEndpoint`/`nemoclawApiKey`), the audit-event-ID prefix, `NemoClawSkillManifest`, `parseNemoClawAllowedSkills`, log labels, broker agent-id fixtures, and DWS-owned config/code refs (`cli/src/cli.ts`, `scripts/on-deploy/firehorse-snap-benchmark.ts`, `mcp-hub/config/*.json`).
- **Intentionally retained:** references to the external **OpenClaw framework / harness** (it is a valid NemoClaw harness — e.g. the `ghcr.io/openclaw/openclaw` image default and the `openclaw configure` harness CLI), comparison/research docs (`docs/compare-openclaw-autoresearch.md`, `docs/research/openclaw-nemoclaw-dws6-integration-research.md`), and all **historical records** (thesis version history, dated field notes, generated `Learn/` snapshots, `CHANGELOG.md`, `LOCKED_DECISIONS.md`, git branch names). Renaming these would falsify history or misstate the external project.

## Human Action Items (gated; the agent cannot do these)

1. **`src/config/secret-loader.ts`** (permission-gated to the agent) — rename the key-name declarations to match the runtime, which now reads `NEMOCLAW_*` only:
   ```
   - OPENCLAW_ENDPOINT: 'openclaw-endpoint',
   - OPENCLAW_API_KEY: 'openclaw-api-key',
   - EXA_API_KEY_OPENCLAW: 'exa-api-key-openclaw',
   + NEMOCLAW_ENDPOINT: 'nemoclaw-endpoint',
   + NEMOCLAW_API_KEY: 'nemoclaw-api-key',
   + NEMOCLAW_NGC_KEY: 'nemoclaw-ngc-key',   // NIM/Nemotron pull token (see §NemoClaw secrets)
   ```
   No runtime impact today (no secrets provisioned), but keeps the loader consistent with `nemoclaw-bridge.ts`.
2. **`.claude/hooks/session-start.sh`** — the RED→GREEN trust-boundary change for PhD market-signal edits (blocked by the self-modification guard). Apply the diff from the session notes.
3. **Live DGX-Spark deploy** — cut the `nemoclaw` service over per Phase 3.

## Done-condition

`grep -rin openclaw src/ infrastructure/` returns only intentional external-harness references (the upstream image default + `openclaw configure` CLI) and migration-doc-path comments; build + tests green (✅ verified); live infra healthy on the `nemoclaw` service (pending deploy); no customer-facing `OpenClaw` product claims (✅ whitepaper fixed). Historical records remain untouched by design.
