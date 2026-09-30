# NVIDIA OpenShell as the Aegis Pilot containment layer (C4)

---

# VERSION AND AGENT HISTORY

Version: 1.3 [Latest]

Sessions & Modifications:

- Version: 1.3 [Latest] | Tool: Claude Code (web) | Session: claude/aegis-pilot-implementation-03ist6 | Date: 29.09.2026 | Changes: §7 core-step egress verified on the real sandbox with a control (HIC: the offer's 'no network for core steps' is the first thing customer IT tests). | Harness: Claude Code + CLAUDE.md + DWS_SECURITY_STANDARD | HIC-approved-drift: none
- Version: 1.2 [not latest] | Tool: Claude Code (web) | Session: claude/aegis-pilot-openshell-03ist6 | Date: 28.09.2026 | Changes: Security review FAIL → fixes → re-review PASS; residual items recorded (§6). | Harness: Claude Code + CLAUDE.md + DWS_SECURITY_STANDARD | HIC-approved-drift: none
- Version: 1.1 [not latest] | Tool: Claude Code (web) | Session: claude/aegis-pilot-openshell-03ist6 | Date: 28.09.2026 | Changes: Real-binary gate passed: severed-uplink rehearsal PASS with --containment openshell on an OpenShell build from source; five driver defects found and fixed; stop latency measured. | Harness: Claude Code + CLAUDE.md + DWS_TRUTH_STANDARD | HIC-approved-drift: none
- Version: 1.0 [not latest] | Tool: Claude Code (web) | Session: claude/aegis-pilot-openshell-03ist6 | Date: 28.09.2026 | Changes: HIC summary of the NVIDIA Open Agent Safety Platform; go/no-go facts; spike status; corrections to the draft public copy. | Harness: Claude Code + CLAUDE.md + DWS_TRUTH_STANDARD | HIC-approved-drift: none

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

**Gate result (28.09.2026, §5): PASSED** in rehearsal. Security review: PASS after fixes (§6). Still open before customer use: a run on the pilot's edge hardware (M4).

**Public copy: NO-GO as first drafted.** Five statements overclaim:

- "Sentry & BlueField … quarantine in milliseconds" as part of the pilot. The pilot's hardware (existing customer hardware or a compact edge appliance, e.g. GN100 or DGX Spark) is not a Vera/BlueField-4 system. Sentry is an optional tier, not the pilot.
- "Grace Blackwell clusters and Jetson edge sensors" are not the pilot's stated hardware, and Jetson with OpenShell is unverified.
- "Mechanical or digital emergency stop": ours is digital (a signed command that terminates the agent). Mechanical stops belong to the customer's plant safety system.
- "The pilot tests autonomous supply-chain monitoring, robotics control and industrial logistics" is wrong. The pilot is one site and one control-room workflow, and the Physical (perception → action) layer is Planned (`src/agents/aegis.agent.ts`).
- "Now building Enterprise Grade Aegis Pilot with it" (X) must not imply an NVIDIA partnership. DWS is not on the launch partner wall; we use open-source OpenShell.

Corrected drafts: `docs/blog-drafts/aegis-pilot-nvidia-openshell.md` (Status: DRAFT, Rule 13) and the X text in the session reply.

## 5. Real-binary spike (28.09.2026)

**Setup.** OpenShell built from source (`36b0386`, `openshell 0.0.1-dev.1`): CLI, gateway, sandbox and supervisor binaries. Gateway on the host with the Docker compute driver, gateway JWT for launch-scoped sandbox credentials, telemetry off (`OPENSHELL_TELEMETRY_ENABLED=false`). Workload image: a minimal local Node 22 root filesystem. `ghcr.io` and `nvcr.io` image pulls are blocked in this environment, so the supervisor image was built locally from the compiled binary.

**Result.** `AEGIS_CONTAINMENT=openshell scripts/aegis-pilot-isolated-rehearsal.sh`: the run executes inside `unshare --net`, and reaches the local gateway through one Unix-socket bridge. Outcome **PASS**, all three conditions:

| Measure                                                | Value                             |
| ------------------------------------------------------ | --------------------------------- |
| Operator command accepted                              | 44 ms after issue                 |
| Sandbox deletion confirmed (`sandbox get` → not found) | 5,159 ms                          |
| Ticks from the stopped agent after termination         | 0                                 |
| Ledger                                                 | valid, no gaps, all events signed |
| Deferred step replayed on reconnect                    | yes                               |

Observed inside the sandbox under the generated policy: the step runs as uid 1000; writes to `/etc` and `/usr` fail (EACCES); `/proc/1/environ` is unreadable (EACCES); outbound TCP to 1.1.1.1:443 fails (EACCES).

**Defects the fake CLI could not show, all fixed:**

1. `sandbox create --upload … -- <cmd>` is rejected; the driver now creates, stages files over `sandbox exec` stdin (no ssh client needed on the host), executes and packs outputs back.
2. `sandbox delete` returns on acceptance, not completion; a stop now counts only when `sandbox get` reports not found.
3. The generated policy omitted `/lib64`; no dynamically linked binary could start under Landlock.
4. Sandbox names are capped at 19 characters.
5. Step results named files by their sandbox path, so reconcile on the host could not find the report; paths are now mapped between sandbox and host.

Condition (iii) under OpenShell containment now stops a stubborn agent in its own sandbox, not a worker thread, so the record proves the same containment the workflow used.

**Stop latency.** About 5.2 s, against 5 ms for the worker-thread stop. The stubborn agent ignores SIGTERM, and deletion waits for the container to be killed. During that window the agent cannot write to the host (outputs are copied back only when no stop was accepted), core steps have no network, and the ledger refuses its work. Shortening it (kill before delete) is a hardening candidate, not done.

**Workload image requirements** (the runbook has the steps): a default command, `/tmp` (1777) and `/sandbox`, and a `sandbox` user in `/etc/passwd`.

## 6. Security review of the driver (28.09.2026)

First review: **FAIL** (1 critical, 3 high, 2 medium). All were fixed, and the re-review returned **PASS**, with no critical or high findings left.

- Critical: a stop was counted as proven whenever `sandbox get` failed with text containing "not found". Now absence is proven only by a complete, successful `sandbox list -o json` (all pages read) that omits the name.
- High: my own loopback-proxy exception in the uplink probe failed open. It has been reverted, and a refused proxy fails closed again.
- High: forged second result lines; unbounded capture of sandbox output. Fixed by an exit right after the result is written, a single-marker rule, output and file caps, and memory and CPU limits.

Residual items, tracked rather than hidden:

1. **Result channel.** The handler and the result writer share one process and stdout. A fully compromised handler can print one forged result and exit before its real result. The blast radius is limited to that step's own reported output. It cannot forge containment evidence or a stop, which are produced on the host. The fix is a result channel the handler cannot write to (for example a pre-opened descriptor, or a result sealed by the runner). Hardening candidate.
2. **Disk.** The policy does not cap `/sandbox` and `/tmp`. Size the host disk, or add host-level limits. Tracked as an open item.
3. **Stop latency** of about 5.2 s (§5).

## 7. Core-step egress verified (29.09.2026)

The HIC asked on 29.09.2026 whether "Ydinvaiheilla ei ole verkkoyhteyttä" is a setting we can keep. The earlier rehearsal ran inside `unshare --net`, which cut everything, so it could not prove the sandbox's own rule. This test ran outside that namespace, with the network reachable.

| Target                                | Plain container (control) | OpenShell, core-step policy          |
| ------------------------------------- | ------------------------- | ------------------------------------ |
| TCP 1.1.1.1:443                       | CONNECTED                 | EACCES                               |
| TCP 169.254.169.254:80 (metadata)     | CONNECTED                 | EACCES                               |
| TCP Docker host bridge                | CONNECTED (listener)      | EACCES                               |
| UDP to the same targets               | sent                      | EDESTADDRREQ; host listener got none |
| IPv6                                  | not available             | EAFNOSUPPORT                         |
| DNS for an unlisted name              | real address              | synthetic 198.18.x.x                 |
| TCP to that synthetic address         | —                         | EACCES                               |
| Non-core policy allowing one endpoint | —                         | that endpoint CONNECTED, rest EACCES |

DNS: OpenShell's policy resolver answers names absent from the policy with a local synthetic address and makes no upstream query (`openshell-supervisor-network/src/policy_dns/mod.rs`, `stage_observation`; test `stages_unknown_name_without_upstream_resolution` asserts zero resolver calls). So a name cannot be used to exfiltrate through DNS from a core step.

The positive control (last row) shows the probe can connect when the policy allows it, so the refusals are the policy, not a broken probe.

**Limit.** This holds with `--containment openshell`. In worker-thread mode core steps share the host process's network; the offers (Kemira and Outokumpu 1.1, generic 1.6, A.1) now say so, and the runbook §6.1 step 5 gives the site's IT the same probe (`scripts/aegis-pilot-egress-probe.sh`).

## 4. Learning outcome steps

1. KB: `kb/raw/articles/2026-09-28-nvidia-open-agent-safety-platform.md` (PR #2228).
2. Field note: this file.
3. `Learn/` HTML: N/A until the HIC reviews.
4. Drive export: N/A in this session.
5. HIC decision: the rehearsal gate has passed. Approve the corrected blog and X text now, or after the M4 run on edge hardware?
6. Calendar: N/A (no dated external commitment).
