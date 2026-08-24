# Field Note: Wendy Agent × Lifetime Fleet — Five CLI Patterns Worth Stealing

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Sonnet 4.6) | Session: claude/lifetime-fleet-field-note-0UFIM | Date: 14.04.2026 | Changes: Initial — researches wendylabsinc/wendy-agent as a reference implementation for edge device agent management; extracts five CLI patterns applicable to Lifetime Fleet; proposes the full `dws fleet` command surface; documents the safety/compliance delta between Wendy and DWS; references existing `dws edge` stubs in cli/src/cli.ts and the logistics agent for KELA patient transport.

Document Status:

- Created: 14.04.2026
- Last Modified: 14.04.2026
- Language: English
- Publication Status: INTERNAL
- Document Type: Competitive Intelligence / CLI Architecture Gap

Related Documents:

- cli/src/cli.ts (existing `dws edge` stubs — lines ~1668+)
- src/agents/logistics.agent.ts (KELA patient transport dispatch)
- Lifetime Fleet/Fleet Admiral/README.md (investor GTM package)
- Lifetime Fleet/Fleet Admiral/KYA_STANDARD_v1.4_MANIFEST.md (Firecracker MicroVM + kill-switch spec)
- docs/field-notes/2026-03-10-acer-dgx-sandbox-strategy.md (GDX Spark edge device strategy)
- docs/field-notes/2026-04-10-dws-docs-cli-gap-aspire-pattern.md (parent pattern — "external tool reveals our gap")
- AGENTS.md v2.2 (Brain-Memory-Body-Hands architecture, Lifetime Fleet specification phase)

---

## Ontology Tags

- **Geography:** Global > Finland (Helsinki) > Edge Devices > Healthcare Robotics
- **Sector:** Technology > Edge Computing > Physical AI > Healthcare Logistics
- **Entities:** Lifetime Fleet, Wendy Labs (wendylabsinc), DWS IQ 6, NVIDIA Jetson Orin Nano, Acer Veriton GN100, KYA v1.4, KELA, Firecracker MicroVMs
- **Temporal Context:** 2026-Q2, Lifetime Fleet specification phase, Wendy Agent active development
- **Confidence:** High (Wendy Agent verified via WebFetch; DWS CLI state verified against cli/src/cli.ts; fleet architecture from Fleet Admiral README v3.0)

---

## 1. What Wendy Agent Is

**wendylabsinc/wendy-agent** is a Go-based application manager that pairs with WendyOS — a specialized Linux distribution pre-configured on Raspberry Pi and NVIDIA Jetson Orin Nano devices. It uses **containerd** to run containerized workloads on embedded hardware, exposes a CLI for remote deployment and device management, and targets industrial/IoT edge environments.

It is not a compliance tool, not a safety-critical system, and not healthcare-specific. It is a clean implementation of the "manage software on a fleet of ARM64 Linux boxes" problem — which is exactly the infrastructure primitive Lifetime Fleet will need.

The reason to study it: Wendy is at the same hardware tier (Jetson Orin Nano) as the Lifetime Fleet edge node. Its CLI surface area is the closest public reference implementation for what `dws fleet` will look like.

---

## 2. Five Patterns Worth Stealing

### 2.1 Device Discovery — Dynamic Over Hardcoded

Wendy uses automatic device discovery: the CLI finds devices on the local network without requiring the user to pre-configure IP addresses or device IDs.

**Why it matters for Lifetime Fleet:** The current DWS remote-control skill hardcodes the Acer edge device by IPv6 (`2001:14ba:a1b0:...`). That works for a single dev sandbox. A fleet of patient transport robots in Helsinki, Tampere, and Turku hospitals cannot be managed by hardcoded addresses. When a robot is replaced, docked, or reassigned to a new hospital network, the CLI must find it — not require a config file update.

**The pattern:** `dws fleet scan [--network <cidr>]` — broadcast mDNS/SSDP on the subnet, return JSON array of `{ id, hostname, ip, model, firmware, agents[] }`.

### 2.2 Containerized Agent Deployment — Push, Don't SSH

Wendy deploys applications to edge devices as OCI containers via containerd. The CLI user never SSH's into the device; they push a container image reference and Wendy handles pull + run.

**Why it matters for Lifetime Fleet:** Healthcare robots cannot have open SSH access from field engineer laptops — EU AI Act Article 13 and hospital IT security policies prohibit it. The DWS model (Firecracker MicroVMs per agent) maps exactly onto this pattern: each agent update is a new MicroVM image, deployed via a signed push command, not a shell session.

**The pattern:** `dws fleet deploy <robot-id> <agent-name> [--version <tag>]` — signs the deployment with the KYA governance key, pushes the Firecracker MicroVM image, returns `{ deploymentId, robotId, agent, status, kya_signature }`.

### 2.3 Remote Debug Injection — Field Engineering Without SSH

Wendy's `--debug` flag automatically injects a debugpy server into a running Python container and opens a port for remote debugger attachment. The field engineer gets a live Python REPL inside the running process without modifying the container image.

**Why it matters for Lifetime Fleet:** When a patient transport robot behaves unexpectedly mid-route (misses a pickup, wrong mobility class assigned), the field engineer needs to inspect the running logistics agent state — not kill and restart it. DWS equivalent: inject a read-only inspection endpoint into the running Firecracker MicroVM, stream agent state as JSON, without terminating the KYA session.

**The pattern:** `dws fleet debug <robot-id> <agent-name> [--stream]` — opens a read-only state channel to the running agent, streams `{ timestamp, agent, state, last_decision, kya_trust_score }`. No write access. KYA kill-switch remains armed.

### 2.4 Network Stack Auto-Detection — Don't Ask, Sense

Wendy automatically detects whether the host OS is using ConnMan (IoT/embedded) or NetworkManager (server/desktop) and adapts its network configuration commands accordingly. The user never specifies the network stack; the agent figures it out.

**Why it matters for Lifetime Fleet:** A patient transport robot may be on three different network stacks depending on where it is: hospital WiFi (802.1x EAP-TLS, NetworkManager), 5G cellular when in transit (ConnMan + ModemManager), or wired ethernet when docked (simple DHCP). The `dws fleet net` command needs to report connectivity without requiring the caller to know which stack is active.

**The pattern:** `dws fleet net <robot-id>` — returns `{ networkStack, interface, ssid?, signal?, ip, latency_ms, connected_to_cloud }`. The robot-side agent auto-detects and reports; the CLI just formats and displays.

### 2.5 Privacy-Preserving Telemetry — Sanitize at Source

Wendy's analytics pipeline collects only: command names, sanitized error types, CLI version, OS version. It explicitly excludes: file paths, hostnames, IP addresses, and user-generated content. Sanitization happens on-device before any data leaves.

**Why it matters for Lifetime Fleet:** Patient transport robots handle KELA patient IDs, mobility classifications, appointment times, and pickup/dropoff addresses. GDPR Article 25 (data protection by design) requires that none of this reaches the DWS telemetry pipeline — not even accidentally. The Wendy pattern (sanitize at source, not at the collector) is the right architecture: the robot's telemetry agent strips all PII fields before the event leaves the Firecracker MicroVM boundary.

**The pattern:** A `TelemetryFilter` type in the fleet telemetry agent that defines an explicit allowlist of fields that may leave the device. Everything not on the allowlist is zeroed before transmission. Audit log of filtered fields is kept locally on the robot for GDPR Article 30 records.

---

## 3. Proposed `dws fleet` Command Surface

These commands do not exist yet. They are a design proposal derived from Wendy patterns + DWS safety requirements.

| Command                                                 | Description                                              | Wendy Equivalent       | DWS Delta                                                          |
| ------------------------------------------------------- | -------------------------------------------------------- | ---------------------- | ------------------------------------------------------------------ |
| `dws fleet scan [--network <cidr>]`                     | Discover fleet robots on network, return JSON array      | Yes — device discovery | DWS adds agent list + KYA trust score per device                   |
| `dws fleet ps [<robot-id>]`                             | List running agents across all robots (or one)           | Yes — process list     | DWS adds Firecracker MicroVM state + KYA session ID                |
| `dws fleet deploy <robot-id> <agent> [--version <tag>]` | Push signed agent container to robot                     | Yes — container deploy | DWS requires KYA governance signature; Firecracker, not containerd |
| `dws fleet logs <robot-id> [--agent <name>] [--tail N]` | Stream robot logs, optionally filtered by agent          | Yes — log streaming    | DWS adds PII filter: patient IDs never appear in log output        |
| `dws fleet debug <robot-id> <agent> [--stream]`         | Read-only state inspection of running agent              | Yes — debugpy inject   | DWS is read-only; kill-switch stays armed; no write access         |
| `dws fleet net <robot-id>`                              | Report network stack, connectivity, signal strength      | Yes — network mgmt     | DWS adds cloud-link status + last KYA heartbeat timestamp          |
| `dws fleet kya snap <robot-id>`                         | Take KYA safety snapshot — trust score + active sessions | **No equivalent**      | DWS-only: captures KYA v1.4 governance state as signed JSON        |
| `dws fleet kill <robot-id> <agent>`                     | Firecracker MicroVM kill-switch — terminate agent        | **No equivalent**      | DWS-only: sub-5ms hardware-enforced termination via KYA v1.4       |

**Output contract (all commands):** JSON by default (`--format table` for human use). All responses include `{ robotId, timestamp, kya_session_id }` in the envelope — never patient identifiers.

**Example workflow — field engineer responding to a missed pickup:**

```
# 1. Find the robot
dws fleet scan --network 10.44.0.0/24
# → [{ id: "fleet-007", hostname: "robot-hus-laakso", ip: "10.44.0.7", agents: ["logistics-agent", "telemetry"] }]

# 2. Inspect the running logistics agent
dws fleet debug fleet-007 logistics-agent --stream
# → { timestamp: "...", state: "dispatching", last_decision: "assign_route", kya_trust_score: 0.94 }

# 3. Check logs for the last 50 lines
dws fleet logs fleet-007 --agent logistics-agent --tail 50
# → (PII-stripped log lines — no patient IDs, no addresses)

# 4. If agent is stuck — kill and redeploy
dws fleet kill fleet-007 logistics-agent
dws fleet deploy fleet-007 logistics-agent --version v1.4.2
```

---

## 4. What Wendy Does NOT Offer

These are the gaps that make Wendy a reference implementation, not a dependency. DWS must build its own fleet CLI rather than fork Wendy.

| Capability                       | Wendy                           | DWS Requirement                                                                  |
| -------------------------------- | ------------------------------- | -------------------------------------------------------------------------------- |
| Safety-critical governance       | None — no kill-switch primitive | KYA v1.4 kill-switches, sub-5ms, hardware-enforced via Firecracker               |
| EU AI Act Article 13 compliance  | Not applicable (not healthcare) | Required for patient transport robots — logging, explainability, human oversight |
| Healthcare regulatory layer      | None                            | KELA transport classes, EC 561/2006 driver hours, ADR routing                    |
| MCP surface for agent delegation | None                            | All DWS fleet operations exposed via `/mcp` for agent-to-agent calls             |
| Signed deployments               | None — unsigned container pulls | Every `dws fleet deploy` must carry a KYA governance signature                   |
| PII-at-source filtering          | Partial (CLI analytics only)    | Full GDPR Article 25 filter on all telemetry leaving the robot                   |
| Compliance scoring pipeline      | None                            | EU ETS2, CBAM, CSRD constraints on route optimization                            |

**One-sentence summary:** Wendy solves device management; DWS Fleet solves device management + physical AI safety governance + healthcare regulatory compliance. Wendy's CLI surface is a 60% overlap — borrow the patterns, build the delta.

---

## 5. Lifetime Fleet Physical Robot Context

Lifetime Fleet is the **"Hands"** layer of the DWS Brain-Memory-Body-Hands architecture. As of AGENTS.md v2.2 (April 13, 2026), it is in specification phase.

Current deployment:

- **Revenue:** €10k MRR from KELA patient transport dispatch (Uber, Bolt, Taksi Helsinki partnerships)
- **Hardware target:** NVIDIA Jetson Orin Nano (7–15W, ARM64) per robot; Acer Veriton GN100 as zero-budget Helsinki Sandbox
- **Safety standard:** KYA v1.4 — 11% Efficiency Law, Firecracker MicroVMs per agent, hardware kill-switches
- **Investor close:** €1M first close target, April 15, 2026 (Fleet Admiral convertible note)
- **Moat:** KELA-backed revenue + 17 years operator relationships + pay-as-you-go robotics (Hardware + SaaS + regulated payer in one stack)

The `dws fleet` command surface proposed in Section 3 is the CLI primitive that turns the Helsinki Sandbox demo from a slides loop into a live operational command — `dws fleet scan` finding real robots, `dws fleet kya snap` showing live governance state to investors in the room.

Full investor context: `Lifetime Fleet/Fleet Admiral/README.md`

---

## 6. Next Steps

| Priority  | Action                                                                                                                                            | Owner                     | When                               |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- | ---------------------------------- |
| **P0**    | Design decision: Firecracker MicroVM image format for fleet agents — OCI-compatible or proprietary? This blocks `dws fleet deploy` implementation | Risto (architecture gate) | Before any fleet CLI coding        |
| **P1**    | Implement `dws fleet scan` — mDNS/SSDP device discovery, JSON output, add to cli/src/cli.ts alongside existing `dws edge` stubs                   | Claude Code               | After P0 decision                  |
| **P1**    | Define `TelemetryFilter` allowlist type in fleet telemetry agent — GDPR Article 25 compliance, no patient identifiers leave device                | Claude Code               | Before any telemetry code          |
| **P2**    | `dws fleet kya snap` — expose KYA v1.4 governance state via CLI, maps to existing `dws kya snap` but scoped to a specific robot ID                | Claude Code               | After KYA v1.4 MicroVM integration |
| **P2**    | Update `dws edge` stubs in cli/src/cli.ts — the existing `edge status/agents/sync` stubs are the precursor to `dws fleet`; rename or scope them   | Claude Code               | Coordinate with fleet CLI design   |
| **P3**    | MCP surface: expose `dws fleet scan` + `dws fleet kya snap` as MCP tools via `/mcp` endpoint                                                      | Claude Code               | After CLI works end-to-end         |
| **WATCH** | Wendy Labs activity — if they add kill-switch or safety governance, re-evaluate fork vs build-own decision                                        | Risto                     | Quarterly                          |

---

## CHANGES MADE

- `docs/field-notes/2026-04-14-wendy-agent-lifetime-fleet-cli-patterns.md`: created — field note documenting five CLI patterns from wendylabsinc/wendy-agent applicable to Lifetime Fleet, proposing the full `dws fleet` command surface (8 commands), and documenting the safety/compliance delta between Wendy and DWS requirements.

## THINGS I DIDN'T TOUCH

- `cli/src/cli.ts`: no changes — this is a design proposal. Implementing `dws fleet` before the Firecracker image format architecture decision (P0) would be premature.
- `src/agents/logistics.agent.ts`: no changes — the logistics agent is production; referenced for context only.
- `Lifetime Fleet/` folder: no changes — Fleet Admiral docs are locked at v3.0.
- `AGENTS.md`: no changes — the "Hands: Lifetime Fleet (specification phase)" status is accurate until fleet CLI ships.

## POTENTIAL CONCERNS

- **Wendy uses containerd; DWS uses Firecracker.** The CLI patterns transfer; the runtime does not. Any engineer reading this note should not assume `dws fleet deploy` can pull Wendy-format container images. The MicroVM image format is an unsolved architecture decision (P0 above).
- **`dws fleet scan` assumes mDNS/SSDP availability.** Hospital networks (especially HUS) often block multicast. Fallback: DNS-SD over unicast, or a robot registry in Supabase that robots self-register to on boot. Both approaches need design before implementation.
- **The `--debug` pattern gives read-only access, but the stream includes agent state.** In a KELA transport context, agent state may include the patient's mobility class or appointment time. The `dws fleet debug` command must route through the same `TelemetryFilter` as telemetry — not bypass it.
- **This note is the action.** No code changes, no CLI additions. The value is naming the patterns and the P0 blocker before anyone starts coding `dws fleet` from scratch.
