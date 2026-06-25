# Migration Plan — OpenClaw → NVIDIA NemoClaw

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

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

### Phase 3 — Secrets + live infra (RED zone — human-gated cutover)

- **Secret store — confirmed empty (owner, 25.06.2026): no `openclaw-*` secrets are provisioned.** The only references are _key-name declarations_ in `src/config/secret-loader.ts` (`OPENCLAW_ENDPOINT → 'openclaw-endpoint'`, `OPENCLAW_API_KEY → 'openclaw-api-key'`, `EXA_API_KEY_OPENCLAW → 'exa-api-key-openclaw'`) that load only if a value exists. With none set, `fromEnv()` falls back to `DEFAULT_BRIDGE_CONFIG`. **Therefore the secret-side cutover is a no-op** — nothing to preserve or retire. When a real NemoClaw runtime is wired, add `nemoclaw-endpoint` / `nemoclaw-api-key` keys (and rename the declaration `EXA_API_KEY_OPENCLAW`); no coordinated retirement needed.
- `infrastructure/dgx-spark/`: docker service `openclaw` → `nemoclaw` (`heartbeat.ts` `CHECK_OPENCLAW`/`http://openclaw:8090`, `deploy.sh` health check). This is the **only real Phase-3 risk** — a named service in a live compose/deploy. Coordinated deploy: add new service alongside, cut health checks over, remove old. **Never** rename a live service blind.
- Env: set `NEMOCLAW_*` in deploy env if/when a real runtime exists; `OPENCLAW_*` can be dropped freely since nothing depends on it today.

### Phase 4 — Current-state docs + cleanup

- Update current-state runtime references in root standards / current docs to NemoClaw (leave history).
- Remove the `OpenClawBridge` re-export alias and `OPENCLAW_*` fallback one release after Phase 3 cutover.

## Done-condition

`grep -rin openclaw src/ infrastructure/` returns only intentional back-compat aliases (clearly commented), build + tests green, live infra healthy on `nemoclaw` service, no customer-facing `OpenClaw` references. Historical records remain untouched by design.
