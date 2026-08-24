***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/openai-harness-documentation-3QVGZ | Date: 14.03.2026 | Changes: Extracted from AGENTS.md §18 as part of agents-md-slim refactoring

Document Status:
  - Created: 14.03.2026
  - Last Modified: 14.03.2026
  - Language: English
  - Publication Status: ACTIVE

***

# Bring Your Own Agent (BYO) Lifecycle & KYA Trust Framework

Extracted from AGENTS.md §18. The DWS10 Control Room manages 16 industrial-grade models in isolated sandboxes.

---

## KYA Three Pillars

| Pillar | Name | Function |
|--------|------|----------|
| 1 | **Identity Attribution** (The Anchor) | Cryptographically binds agent session to KYC-verified human/entity |
| 2 | **Capability Gating** (The Leash) | Real-time risk telemetry dynamically adjusts agent permissions |
| 3 | **Forensic Observability** (The Firehorse Audit Trail) | Sub-second syscall + network telemetry, immutable audit chain |

## BYO Agent Registration (6-Stage Gate)

```
Customer Request
    │
    ▼
┌──────────────────────────────────┐
│ Stage 1: Registration            │  Agent manifest submitted to DWS Agent Registry
│ (No identity gate)               │  Manifest: name, version, provider, requested MCP tools
└──────────────┬───────────────────┘
               ▼
┌──────────────────────────────────┐
│ Stage 2: Identity Binding        │  ← IDV GATE (BLOCKING)
│ Human operator verified          │  Document + face match + AML screen
└──────────────┬───────────────────┘
               ▼
┌──────────────────────────────────┐
│ Stage 3: Org Verification        │  ← KYB GATE (BLOCKING for BYO)
│ Organization behind agent        │  Business verification, UBO checks
└──────────────┬───────────────────┘
               ▼
┌──────────────────────────────────┐
│ Stage 4: Capability Review       │  MCP tool approval against org policy
│ What tools does it need?         │  DWS IQ admin reviews requested capabilities
└──────────────┬───────────────────┘
               ▼
┌──────────────────────────────────┐
│ Stage 5: Sandbox Entry           │  ← KYA SCORE CHECK (≥ 50 to enter)
│ Firecracker MicroVM spun up      │  Isolated runtime, tier-based limits
└──────────────┬───────────────────┘
               ▼
┌──────────────────────────────────┐
│ Stage 6: Runtime Monitoring      │  Continuous telemetry (Firehorse)
│ + Dynamic Restriction            │  ← WEBHOOK on risk change
│                                  │  Sandbox permissions adjust in real-time
└──────────────────────────────────┘
```

## KYA Trust Score

| Score | Sandbox Tier | Description |
|-------|-------------|-------------|
| ≥ 80 | **Full Agency** | Egress, filesystem, all MCP tools, write to models |
| 50–79 | **Restricted** | No egress, read-only FS, curated MCP tools |
| < 50 | **Suspended** | Human review required, agent paused |
| = 0 | **Quarantine** | Agent terminated, Firehorse forensic dump triggered |

**Dynamic adjustment:** If an identity provider webhook signals a risk change, the hypervisor adjusts sandbox permissions in < 5 seconds.

## Hardware Isolation (Firecracker MicroVMs)

| Property | Value |
|----------|-------|
| Boot time | < 125 ms |
| Memory overhead | < 5 MB per MicroVM |
| Guest kernel | Isolated per sandbox |
| Host kernel access | None (paravirtualized) |
| Egress control | Hypervisor-level, per-session whitelist |

## BYO Agent Manifest Schema

```json
{
  "agent": {
    "name": "Clawbot",
    "version": "2.1.0",
    "provider": "OpenClaw Ltd",
    "provider_country": "DE"
  },
  "capabilities": {
    "mcp_tools_requested": ["material-oracle", "schedule-genius"],
    "egress_endpoints": ["api.openclaw.io"],
    "filesystem": "read-write",
    "max_tokens_per_request": 16000
  },
  "identity": {
    "operator_email": "ops@example.com",
    "org_registration_id": "HRB-12345-DE"
  }
}
```

## Sandbox Stages

| Stage | Runtime | Isolation | KYA Gate |
|-------|---------|-----------|----------|
| 1 | SDK native | No network, read-only FS | L1 IDV only |
| 1.5 | Acer Veriton GN100 (Helsinki) | Ephemeral Docker, air-gapped EU | L1 + L2 |
| 2 | Cloud Run ephemeral | Sandboxed by default | L1 + L2 + L3 |
| 3 | Production (Firecracker MicroVM) | Full hardware isolation | All 5 layers |

## Firehorse Forensic Logging

| Layer | Data Captured | Retention |
|-------|---------------|-----------|
| Syscall | File I/O, process spawns, IPC | 90 days |
| Network | Egress/ingress, DNS lookups | 90 days |
| MCP Tool | Invocations, parameters, responses | 1 year |
| Token Usage | Input/output tokens per agent per session | 1 year |
| Identity Events | KYA score changes, permission adjustments | 5 years (EU AI Act Art. 12) |

## Related Standards

| Standard | Section | Scope |
|----------|---------|-------|
| `DWS_SECURITY_STANDARD.md` | §14, §18 | Security controls, trust model |
| `Legal/KYA_STANDARD_v1.md` | v1.0–v1.1 | Public foundational KYA document |
| `Legal/KYA_SECURITY_v1.2.md` | v1.2 | Identity, isolation, forensics, guardrails |
| `Legal/KYA_OPTIMIZATION_v1.4.md` | v1.4 | Autoresearch, financial value, orchestrator |
| `src/cloudflare/tenant-sandbox.ts` | Implementation | Sandbox tiers, rate limiting |
