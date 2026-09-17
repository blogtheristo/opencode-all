# Design — DWS Skilled Agents as NemoClaw Autonomous Workflows

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.1 | Tool: Claude Code | Session: claude/nemoclaw-migration-agent-workflows-bkf97x | Date: 26.06.2026 | Changes: Breadth implemented — added src/mcp/nemoclaw-engines.ts (NEMOCLAW_ENGINES roster + buildEngineHost) wiring the athena/hephaestus/mercury/iris/apollo engineer personas from the agent registry into governed skill hosts, with tests. Updated §6–§8 to reflect shipped breadth.
- Version: 1.0 | Tool: Claude Code | Session: claude/nemoclaw-migration-agent-workflows-bkf97x | Date: 25.06.2026 | Changes: Initial architect pass for §4B of the NemoClaw migration handoff. Defines the contract adapter, the reverse skill-exposure host on top of nemoclaw-bridge.ts, the OpenShell/KYA-ATS governance envelope per skill and per workflow, and the orchestrator→engine mapping. Accompanies the thin spike that exposes ComplianceAgent as a NemoClaw skill end-to-end.

---

**Status:** Design + spike (compliance) + engineer-persona breadth implemented · live harness/deploy human-gated
**Owner:** Lifetime Oy / DWS IQ 6 Engineering
**Depends on:** `docs/migrations/2026-06-25-openclaw-to-nemoclaw.md` (migration complete, merged in PR #1500)

## 1. Goal

Compose existing **DWS Skilled Agents** (`src/agents/*.agent.ts`) into **NemoClaw long-running
autonomous workflows** — e.g. a "compliance engineer", "CSRD engineer", or "site-safety engineer"
that a NemoClaw harness (OpenClaw or Hermes) drives across many steps — while keeping every step
inside the DWS governance envelope: **KYA trust scoring (ATS) + EU AI Act Article-12 logging +
OpenShell/Firecracker sandbox + EU-sovereign data residency**.

The DWS agents already exist and produce ledger-native output. NemoClaw already exists as the
sandboxed runtime. What is missing is the **bidirectional contract** that lets a NemoClaw workflow
treat a DWS agent as a callable, governed skill — and lets the resulting evidence flow back into the
DWS Article-12 audit ledger. This document specifies that contract.

## 2. Direction of integration (the two bridges)

`src/mcp/nemoclaw-bridge.ts` (`NemoClawBridge`) already covers the **outbound** direction:

> **DWS Agent → NemoClaw skill** — a DWS agent invokes a NemoClaw-hosted skill over JSON-RPC,
> ATS-gated, response sanitized against prompt injection, logged to Firehorse.

This design adds the **reverse / inbound** direction, which is what "compose DWS agents into
NemoClaw workflows" actually requires:

> **NemoClaw harness → DWS Skilled Agent** — a NemoClaw workflow step invokes a DWS agent
> (e.g. `compliance`) as if it were a NemoClaw skill. The DWS agent runs locally inside the
> governance boundary; its `AgentResponse` is adapted back to the NemoClaw skill JSON-schema.

```
                 ┌─────────────────────────── NemoClaw governance boundary ──────────────────────────┐
                 │                                                                                    │
 NemoClaw        │   ┌──────────────────┐   register/invoke    ┌───────────────────┐                 │
 harness  ──────►│──►│ NemoClawSkillHost │ ───────────────────► │  DWS Skilled Agent │ ──► AgentResponse
 (OpenClaw/      │   │  (this design)    │ ◄─── skill result ─── │  (compliance, …)   │                 │
  Hermes)        │   └──────────────────┘                       └───────────────────┘                 │
                 │        │  ▲  │                                         │                            │
                 │   ATS gate │ sanitize inbound params          ledger-native output                 │
                 │        │  │  └────────► OpenShell/Firecracker tier (NemoClawSandbox)                │
                 │        ▼  │                                          │                              │
                 │   Article-12 step log  ◄─────────────────────────────┘ (per workflow step)         │
                 └────────────────────────────────────────────────────────────────────────────────────┘
```

The two directions share the same primitives — the **allowed-skills whitelist** (no community
skills), the **ATS gate**, the **NemoClawSandbox** tier model, and the **Firehorse/Article-12 audit
trail**. The reverse direction adds a **contract adapter** (§3) and a **skill host** (§4).

## 3. Contract adapter — DWS ledger output ↔ NemoClaw skill schema

DWS agents return the standardized `AgentResponse` (`src/agents/types.ts`):

```ts
interface AgentResponse {
  agentName: string;
  result: Record<string, unknown>; // agent-specific payload (compliance: scores, gaps, report, …)
  confidence: number; // 0–1
  reasoning: string; // decision lineage, human-readable
  recommendations: string[]; // actionable next steps
  metadata: Record<string, unknown>; // timings, model, tokens, scoring-engine version
}
```

NemoClaw skills are described by `NemoClawSkillManifest` (`src/mcp/nemoclaw-bridge.ts`):
`{ name, description, inputSchema, outputSchema, requiresNetwork, requiresFilesystem, minimumATS }`.

The adapter is a **pure, deterministic transform** (Rule 5 — no model in the loop) with two halves:

### 3a. Manifest projection — `agentToSkillManifest(agent, opts)`

Builds a `NemoClawSkillManifest` from an agent's `AgentConfig`:

| Manifest field       | Source                                                                               |
| -------------------- | ------------------------------------------------------------------------------------ |
| `name`               | `config.name` (e.g. `compliance`)                                                    |
| `description`        | `config.description`                                                                 |
| `inputSchema`        | `config.inputSchema` if present, else a permissive `{ type: 'object' }`              |
| `outputSchema`       | The **canonical skill-result envelope** (§3b) — same for every DWS agent skill       |
| `requiresNetwork`    | `opts.requiresNetwork` (default `false` — most agents are deterministic + local LLM) |
| `requiresFilesystem` | `opts.requiresFilesystem` (default `false`)                                          |
| `minimumATS`         | `opts.minimumATS` — derived from the agent's autonomy phase (§5)                     |

### 3b. Result projection — `adaptAgentResponseToSkillResult(response)`

Maps `AgentResponse` to a **stable, schema-versioned envelope** so every DWS-agent-as-skill returns
the same outer shape regardless of which agent ran. This is the `outputSchema` contract:

```jsonc
{
  "schemaVersion": "dws-skill-result/1",
  "status": "ok", // "ok" | "error"
  "agent": "compliance",
  "result": {
    /* AgentResponse.result verbatim */
  },
  "confidence": 0.9,
  "reasoning": "…", // lineage summary
  "recommendations": ["…"],
  "lineage": {
    // Article-12 cross-reference
    "traceId": "…",
    "inputHash": "sha256:…",
    "outputHash": "sha256:…",
  },
}
```

`lineage` is what makes the workflow auditable: every skill result carries the Article-12 `traceId`
and the input/output hashes, so a NemoClaw workflow's full step chain can be reconstructed from the
DWS audit ledger without storing raw payloads.

## 4. Reverse skill-exposure host — `NemoClawSkillHost`

A thin host layer (`src/mcp/nemoclaw-skill-host.ts`) that sits on top of the existing bridge
primitives and exposes DWS agents as governed NemoClaw skills. It deliberately does **not** make
network calls — the DWS agent runs in-process inside the governance boundary.

```ts
class NemoClawSkillHost {
  constructor(opts: { allowedSkills: string[]; logBasePath?: string });
  registerAgentSkill(agent: BaseAgent, opts: AgentSkillOptions): void; // whitelist-checked
  listSkills(): NemoClawSkillManifest[];
  async invokeAgentSkill(req: SkillInvocation): Promise<SkillInvocationResult>;
  getStepLog(): readonly WorkflowStepLog[]; // Article-12 step capture (observable/testable)
}
```

`invokeAgentSkill` enforces, in order:

1. **Whitelist** — skill must be registered; community skills are BLOCKED (mirrors
   `NemoClawBridge.registerSkill`). Unregistered → `status: 'error'`, no agent run.
2. **KYA ATS gate** — `callerATS >= manifest.minimumATS`. Below → blocked. The ATS also resolves a
   `NemoClawSandbox` tier (`resolveTier`); `suspended`/`quarantine` tiers block execution entirely.
3. **Inbound sanitization** — params arriving from the NemoClaw harness are **untrusted input**
   (CLAUDE.md). String values are scrubbed for prompt-injection patterns before reaching the agent.
4. **Sandboxed execution** — `agent.execute(context, sanitizedParams)` runs under the resolved
   sandbox tier; the invocation is recorded on the sandbox for audit.
5. **Result adaptation** — `AgentResponse` → canonical envelope (§3b).
6. **Article-12 step capture** — a `WorkflowStepLog` record (skill, caller, kyaSession, inputHash,
   outputHash, confidence, durationMs, status, traceId, timestamp) is appended to the host's step
   log and emitted to an optional `onStep` recorder. In production `onStep` is wired to
   `Article12Logger` (pre-flight + post-flight); in tests it is asserted in-memory (no Supabase
   dependency). This satisfies the handoff requirement: **Article-12 captures each NemoClaw step.**

A **workflow** is then an ordered/looping sequence of `invokeAgentSkill` calls driven by the NemoClaw
harness. The host is stateless across skills except for the append-only step log, so one host
instance == one auditable workflow trace (keyed by `kyaSessionId`).

## 5. OpenShell policy per skill + KYA ATS per workflow

Two governance layers compose:

**Per-skill (OpenShell / Firecracker tier).** Each skill declares `requiresNetwork` /
`requiresFilesystem` in its manifest. The `NemoClawSandbox` tier (resolved from ATS) caps what is
actually permitted (`getTierCapabilities`): `full_agency` (ATS ≥ 80) allows network + RW filesystem;
`restricted` (≥ 50) read-only, no network; `suspended` (> 0) and `quarantine` (0) block execution.
A skill that `requiresNetwork` but runs under a `restricted` tier is denied network at the
hypervisor level — the agent still runs, but its outbound tools are starved by sandbox policy.

**Per-workflow (KYA ATS).** `minimumATS` is derived from the agent's `autonomyPhase`:

| autonomyPhase  | minimumATS | Rationale                                                            |
| -------------- | ---------- | -------------------------------------------------------------------- |
| `silent_pilot` | 0          | Observe-only; safe to run at any trust level                         |
| `advisor`      | 50         | May surface nudges; requires `restricted`+ trust (e.g. `compliance`) |
| `autonomous`   | 80         | Acts within guardrails; requires `full_agency` trust                 |

The workflow's caller ATS is evaluated **per step**, so a mid-workflow `updateATS` drop (e.g. a
KYA TC-4 leash-snap on a compromised chain) immediately downgrades or blocks subsequent skills.

## 6. Orchestrator → NemoClaw engine mapping

The `src/agents/workflow/` orchestrators already fan out to Skilled Agents; each maps cleanly to a
NemoClaw "engineer" persona built from the skills it composes:

| Orchestrator   | DWS role                           | NemoClaw engineer              | Primary composed skills                              |
| -------------- | ---------------------------------- | ------------------------------ | ---------------------------------------------------- |
| **athena**     | Compliance Intelligence            | **Compliance / CSRD engineer** | `compliance`, `compliance-researcher`                |
| **hephaestus** | Field & Site Intelligence          | **Site-safety engineer**       | `sitesense`, `material-oracle`, `schedule-genius`    |
| **mercury**    | Logistics & Operations             | Operations engineer            | `logistics`, `schedule-genius`, `quality-gate`       |
| **iris**       | Research & Market Intelligence     | Research engineer              | `competitor-surveillance`, `deepwiki-extractor`, SEO |
| **apollo**     | Content & Outreach Intelligence    | Outreach engineer              | `sales-outreach`, SEO suite                          |
| **atlas**      | Cross-agent synthesis              | Briefing engineer (meta)       | `summarize_findings` over the others                 |
| **industry/**  | Sector verticals (vulcan, helios…) | Sector engineers               | Industry-specialised compositions                    |

The five leaf engineers (athena/hephaestus/mercury/iris/apollo) are shipped as data in
`NEMOCLAW_ENGINES` (§7b). `atlas` (meta-synthesis) and the `industry/` sector verticals remain
follow-on work — they compose the leaf engines rather than flat skills.

## 7. Implementation (this change)

### 7a. Spike — contract adapter + host

1. `src/mcp/nemoclaw-skill-host.ts` — the contract adapter (§3) + `NemoClawSkillHost` (§4).
2. `ComplianceAgent` registered as the `compliance` skill; `invokeAgentSkill` exercised end-to-end
   with a low-trust block, an unregistered-skill block, a happy-path run, and Article-12 step
   capture asserted.
3. `src/__tests__/nemoclaw-skill-host.test.ts` — covers the above.

### 7b. Breadth — engineer personas

4. `src/mcp/nemoclaw-engines.ts` — `NEMOCLAW_ENGINES` (the roster from §6) + `buildEngineHost()`,
   which wires an engine's declared agents from the registry (`AgentLookup`) into one governed,
   whitelisted `NemoClawSkillHost`. Missing agents are surfaced (`missing[]` + `logger.warn`),
   never silently dropped (Rule 12).
5. `src/__tests__/nemoclaw-engines.test.ts` — roster shape, unknown-engine guard, full wiring +
   whitelist, fail-loud on a missing agent, and a composed end-to-end compliance run.

Build (`tsc`) + `vitest` green. Everything runs **without** external NemoClaw infra or secrets
(none are provisioned — see migration plan Phase 3), so it is fully GREEN-zone and CI-verifiable.

## 8. Non-goals / deferred

- Live NemoClaw harness wiring (OpenClaw/Hermes process) and the DGX-Spark deploy — human-gated
  (migration plan Human Action Items).
- `atlas` meta-synthesis engine and `industry/` sector engineers — compose the shipped leaf engines.
- Persisting the step log to the `article12_audit_log` table in CI — the `onStep` recorder is the
  seam; production wires it to `Article12Logger`, which needs Supabase service credentials.
