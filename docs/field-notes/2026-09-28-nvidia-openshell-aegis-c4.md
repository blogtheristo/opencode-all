# NVIDIA OpenShell as the Aegis Pilot containment layer (C4)

---

# VERSION AND AGENT HISTORY

Version: 1.0 [Latest]

Sessions & Modifications:

- Version: 1.0 [Latest] | Tool: Claude Code (web) | Session: claude/aegis-pilot-openshell-03ist6 | Date: 28.09.2026 | Changes: HIC summary of the NVIDIA Open Agent Safety Platform; go/no-go facts; spike status; corrections to the draft public copy. | Harness: Claude Code + CLAUDE.md + DWS_TRUTH_STANDARD | HIC-approved-drift: none

Session Links & References:

- Source: https://github.com/NVIDIA/OpenShell (cloned 28.09.2026, commit 36b0386)
- Signal: PhD §14.55 (PR #2228); plan C4 (PR #2226, §5.4 decision record); driver branch `claude/aegis-pilot-openshell-03ist6`

Document Status:

- Created: 28.09.2026
- Status: PENDING_REVIEW

---

## 1. HIC summary (28.09.2026, preserved as given)

- NVIDIA OpenShell provides an open-source secure runtime that executes autonomous AI agents in sandboxed environments with kernel-level isolation.
- The NVIDIA Open Agent Safety Platform combines OpenShell on NVIDIA Vera CPUs with NVIDIA Sentry on BlueField-4 DPUs to create a layered safety architecture.
- Five core principles guide the platform: verifiable policy, out-of-band enforcement, controlling the path to the model, scaling agent authority with reasoning visibility, and applying a shared responsibility model across labs, enterprises, and hardware providers.
- NVIDIA Sentry extends monitoring and enforcement into BlueField hardware using NVIDIA DOCA to correlate agent interactions, policy decisions, and tool access for contextual activity records.
- In NVIDIA Vera Rubin POD systems, BlueField-4 DPUs sit on the node's only path to the model, providing continuous out-of-band observability and real-time policy enforcement at line speed.

**Next steps (HIC):**

- Get started with NVIDIA OpenShell to run agents in sandboxed environments with kernel-level isolation.
- Explore the NVIDIA Open Agent Safety Platform to understand the layered safety architecture for AI agents.
- Read the technical walkthrough on adding runtime controls to AI agents with NVIDIA OpenShell for implementation details.

## 2. Verified facts (from the source repository, 28.09.2026)

| Fact                                                                                | Evidence                                        |
| ----------------------------------------------------------------------------------- | ----------------------------------------------- |
| Apache 2.0, mostly Rust                                                             | `LICENSE`, `Cargo.toml`                         |
| arm64 and x86 Linux supported                                                       | `docs/about/support-matrix.mdx`                 |
| Air-gapped installs documented (static binaries, deb/rpm)                           | support matrix; `deploy/deb`, `deploy/rpm`      |
| **Requires Linux 6.2+ with Landlock ABI 3+; fails closed without it**               | support matrix, "Kernel Requirements"           |
| Needs Docker, Podman or host virtualisation, plus a local gateway                   | README quickstart                               |
| Anonymous telemetry on by default; can be compiled out                              | README "Telemetry"; gateway `telemetry` feature |
| Extension points are gRPC services (any language); only isolation backends are Rust | `docs/extensibility/`                           |
| Version 0.1.x, "Development Status :: 3 - Alpha"                                    | PyPI metadata `openshell 0.1.2`                 |
| This container: Landlock ABI 7; Docker 29 runs                                      | Landlock syscall probe; `docker info`           |
| Built from source here, without telemetry, with system Z3                           | `cargo build --release --no-default-features`   |

## 3. Go / no-go

**Engineering (C4): GO, gated.** Integration is not considered done until the network-cut rehearsal passes with `--containment openshell` on the real binary. Until that gate passes, the acceptance record and all public copy must not claim OpenShell containment.

**Public copy: NO-GO as first drafted.** Five statements overclaim:

- "Sentry & BlueField … quarantine in milliseconds" as part of the pilot. The pilot's hardware (existing customer hardware or a compact edge appliance, e.g. GN100 or DGX Spark) is not a Vera/BlueField-4 system. Sentry is an optional tier, not the pilot.
- "Grace Blackwell clusters and Jetson edge sensors" are not the pilot's stated hardware, and Jetson with OpenShell is unverified.
- "Mechanical or digital emergency stop": ours is digital (a signed command that terminates the agent). Mechanical stops belong to the customer's plant safety system.
- "The pilot tests autonomous supply-chain monitoring, robotics control and industrial logistics" is wrong. The pilot is one site and one control-room workflow, and the Physical (perception → action) layer is Planned (`src/agents/aegis.agent.ts`).
- "Now building Enterprise Grade Aegis Pilot with it" (X) must not imply an NVIDIA partnership. DWS is not on the launch partner wall; we use open-source OpenShell.

Corrected drafts: `docs/blog-drafts/aegis-pilot-nvidia-openshell.md` (Status: DRAFT, Rule 13) and the X text in the session reply.

## 4. Learning outcome steps

1. KB: `kb/raw/articles/2026-09-28-nvidia-open-agent-safety-platform.md` (PR #2228).
2. Field note: this file.
3. `Learn/` HTML: N/A until the HIC reviews.
4. Drive export: N/A in this session.
5. HIC decision: approve the corrected blog and X text after the rehearsal gate passes?
6. Calendar: N/A (no dated external commitment).
