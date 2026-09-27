# OpenClaw and NemoClaw adoption — DWS control plane

<!-- Evidence: Tool=GitHub-Copilot-CLI-1.0.88 Model=auto Agent=openclaw-control-plane-plan Date=2026-09-27 -->
<!-- Audit trail: git log -- docs/architecture/openclaw-nemoclaw-adoption.md -->

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: GitHub Copilot CLI 1.0.88 | Model: Auto | Session: opencode/openclaw-control-plane-plan | Date: 27.09.2026 | Changes: Initial evidence-based adoption decision, phase gates and static runtime inventory. | Harness: Copilot CLI + DWS standards resolver | HIC-approved-drift: none

Document Status:

- Created: 27.09.2026
- Last Modified: 27.09.2026
- Language: English
- Languages Available: EN
- Publication Status: DRAFT
- Classification: INTERNAL

---

## Decision and evidence

**Adopt OpenClaw as an interchangeable harness, not as DWS's control plane.**
Microsoft [confirms Scout is powered by OpenClaw](https://www.microsoft.com/en-us/copilot/blog/2026/06/02/introducing-microsoft-scout-your-always-on-personal-agent/), and [Autopilot is the successor name](https://blogs.microsoft.com/blog/2026/09/25/introducing-the-new-copilot-with-home-code-and-autopilot/). Microsoft says it contributes policy-conformance work upstream; [OpenClaw lists concrete upstream contributions](https://openclaw.ai/blog/microsoft-autopilot-openclaw/). This is evidence of a substantial collaboration, **not** proof that Microsoft will abandon proprietary runtimes: its own announcement introduces Copilot Managed Runtime and metered agentic capabilities. The “Linux/Azure of agents” analogy is a strategic hypothesis, not a procurement premise.

DWS differentiation remains governed industrial outcomes: **Brain** = DWS Agent Registry, model routing and KYA authorization; **Memory** = tenant-scoped Lifetime World Model; **Body** = Firehorse reporting, Article 12 evidence, approvals and Temporal durable workflows; **Hands** = constrained harness/skills and, only after separate safety gates, fleet actuation. MCP is the interoperability boundary; Microsoft Entra/Graph/M365 is an optional Connect-tier adapter rather than a mandatory execution, audit or identity provider. Sovereignty is the primary segmentation axis, not the only one (`DWS_TRUTH_STANDARD.md` §2 row 39).

## Current state (repository inventory, not deployment attestation)

| Surface                          | Evidence                                                                                                | Status / gap                                                                                                                                                                                                                                |
| -------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| DWS agent and tool authorization | `src/agents/index.ts`, `src/agents/tools.ts`, `src/security/runtime-auth.ts`                            | Existing DWS control path; keep authoritative.                                                                                                                                                                                              |
| NemoClaw adapters and tests      | `src/mcp/nemoclaw-bridge.ts`, `src/mcp/nemoclaw-skill-host.ts`, `src/__tests__/nemoclaw-bridge.test.ts` | Code exists, but no demonstrated production caller or signed KYA-to-harness binding.                                                                                                                                                        |
| Local sandbox policy object      | `src/sandbox/nemoclaw-sandbox.ts`                                                                       | In-memory policy/specification does **not** demonstrate an OpenShell process boundary or real kill.                                                                                                                                         |
| DGX image and endpoint           | `infrastructure/dgx-spark/docker-compose.yml` (`nemoclaw` service)                                      | Defaults to bare OpenClaw `:latest`, publishes port 8090, lacks required runtime auth in compose and declares `NEMOCLAW_ALLOW_EGRESS=false` without proven network enforcement. Bridge defaults to port 3100. Live DGX status not verified. |
| Previous migration               | `docs/migrations/2026-06-25-openclaw-to-nemoclaw.md`                                                    | Source rename staged; live NVIDIA/OpenShell deployment remains pending.                                                                                                                                                                     |
| Model routing                    | `config/litellm-config.yaml`, `DWS_MODEL_STANDARD.md` §9                                                | Sovereign/Aegis use `local-sovereign`, no silent cloud fallback.                                                                                                                                                                            |

`config/nemoclaw/profiles.json` is a **proposal**, not active policy. `npm run diag:nemoclaw` checks its invariants and scans checked-in deployment declarations; it exits nonzero on the current unsafe/unverified baseline. `--json` provides a machine-readable report. The authentication check only verifies a required secret declaration, not that the runtime validates it. Neither a static PASS nor a healthy HTTP endpoint proves isolation, signed identity, audit durability or live adoption.

## Architecture and build/adopt boundary

| DWS owns                                                                                                                                                                                                                     | Adopt or evaluate                                                                                                                                                                                                                   |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| KYA identity, ATS, signed verdicts, per-tool authorization and HIC approvals; sovereignty classification and no-fallback rule; industry decisions, Lifetime World Model, Article 12 evidence and cost per governed decision. | OpenClaw/Hermes as swappable harnesses; NVIDIA NemoClaw packaging and OpenShell isolation only after verification; MCP transport; local Ollama/LiteLLM; Temporal for durable workflows; optional Microsoft channel/context adapter. |

Do not fork a general-purpose agent runtime, create a second MCP orchestration engine, install community skills automatically, or give the harness direct credentials to bypass DWS tools. Preserve the direct DWS execution route as rollback. Keep Firehorse Dreaming (`clawdbot`) distinct from the external OpenClaw project.

## Roadmap and gates

| Window                        | Work                                                                                                                                                                                                                                                                                                                                                                                                                   | Exit evidence                                                                                                                                                                                                                                                          |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Now / 0–30 days (Phase 1)** | This PR: ADR, three proposed profiles and read-only conformance CLI with tests. On DGX, inventory active digest, actual image/harness, exposed ports, OpenShell version, auth, model route, audit rows and kill behavior. Select one read-only Athena compliance workflow; design its authenticated MCP/KYA contract.                                                                                                  | CLI reports every known repository gap and `liveVerified: false`. Do not call the runtime deployed or secure. No changes to production traffic.                                                                                                                        |
| **30–90 days**                | Pin and verify vendor image digest/SBOM; constrain host exposure and authenticate runtime; require signed short-lived tenant/operator KYA context; route every harness call through existing tool authorization and fail-closed Article 12 preflight. Implement actual OpenShell lifecycle/egress/filesystem/process controls, Temporal checkpointing and a read-only Athena pilot. Bound duplicate MCP hubs by owner. | 100% denial for unsigned/wrong-tenant calls and unauthorized filesystem/egress probes; 0 cloud fallbacks for sovereign workloads; recover and rollback pilot in <15 minutes; trace every workflow step. No production promotion if any isolation or audit probe fails. |
| **3–12 months**               | Two design partners; signed skills and SBOM; optional Teams channel with consent, tenant-scoped data, approval and DPA review; reversible writes only after HIC gate; compare OpenClaw to Hermes and direct DWS.                                                                                                                                                                                                       | 90-day stability; at least 99.5% successful governed workflows excluding valid denials; 100% sampled audit reconstruction; no cross-tenant leakage; measure cost and operator time versus baseline.                                                                    |
| **12–24 months**              | Certify two harnesses; evaluate Microsoft and other adapters; separately assess Aegis air-gap and physical actuation. Contribute generic interoperability upstream where useful.                                                                                                                                                                                                                                       | Harness swap without altering DWS contracts; independent sandbox assessment; Aegis operates without an external control plane; fleet actions require safety interlock and human override.                                                                              |

Connect may use explicitly approved cloud adapters under tenant policy. Sovereign must use local-only inference and no external control plane. Aegis requires air-gap/deny-all network, no runtime skill installation and a separate independent security gate. The proposed JSON profiles are not wired to a runtime; configuration alone has no enforcement effect. Require live adversarial probes before changing their status.

## Risks and decisions deferred

- **Security theater:** `NEMOCLAW_ALLOW_EGRESS=false` and an in-memory sandbox are not OS isolation; enforce and probe at OpenShell/network/process boundary.
- **Distribution capture:** Microsoft can provide identity, context and metering, but DWS must retain KYA, evidence, tenant policy and direct/self-hosted access.
- **Supply chain and memory:** pin signed images/skills, prohibit unreviewed ClawHub installs, disable independent durable harness memory until retention and deletion match DWS Memory.
- **Operational cost:** account for local power, hardware and maintenance; do not label local inference “free.” Define cost per successful governed decision before rollout.
- **No speculative production migration:** live deployment, secret provision, customer data, outbound messaging and fleet actuation are out of scope for this PR. Revisit after Phase 2 gates and customer demand.

---

**Document version:** v1.0 · **Date:** 27.09.2026 · **Owner:** Lifetime Oy
© 2026 Lifetime Oy (Y-tunnus 0772407-9). All rights reserved.
**Business Confidential.** This document contains confidential and proprietary information of Lifetime Oy. It is disclosed solely to the intended recipient under an applicable NDA or business relationship and may not be copied, distributed, or disclosed to any third party without Lifetime Oy's prior written consent.
