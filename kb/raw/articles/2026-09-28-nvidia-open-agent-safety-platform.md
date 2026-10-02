# NVIDIA Open Agent Safety Platform (OpenShell + Sentry) — 2026-09-28

# VERSION AND AGENT HISTORY

---

Version: 1.0 [Latest]

Sessions & Modifications:

- Version: 1.0 [Latest] | Tool: Claude Code | Session: claude/nvidia-agent-safety-signal-03ist6 | Date: 28.09.2026 | Changes: Source note for PhD §14.55 and sales pipeline row 14.55 (★★★★☆). HIC shared the launch text and slide on 28.09.2026.

Document Status:

- Created: 28.09.2026
- Last Modified: 28.09.2026
- Status: PENDING_REVIEW

---

## Source

- **Primary sources:** NVIDIA Newsroom, "NVIDIA Launches Open Agent Safety Platform to Secure Agents From Testing to Deployment", and NVIDIA Technical Blog, "NVIDIA Open Agent Safety Platform: A Reference for Continuous In-Silicon Agent Monitoring". Both 28.09.2026.
- **How the content was checked:** by web search on 28.09.2026 across independent coverage (VentureBeat, Help Net Security, The New Stack, CBS News, StorageReview). The research environment's egress proxy blocked direct fetches of the primary and press pages.
- **Provided by the HIC:** the blog's opening passage (the 90s internet / browser sandbox analogy) and the architecture slide.

## What it is

| Layer              | Name          | Facts (as reported)                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ------------------ | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Runtime boundary   | **OpenShell** | Apache 2.0, mostly Rust, GitHub `NVIDIA/OpenShell`. One sandbox per agent, built from Landlock (filesystem), seccomp-BPF (system calls) and a network namespace. A supervisor starts as root, sets up isolation, then launches the agent unprivileged. Policy is declarative YAML with a gateway, an advisor and an SMT-based **policy prover** that computes what a requested rule change would allow. Stated to extend to Arm and Intel. |
| In-silicon monitor | **Sentry**    | Out-of-band watchdog on **BlueField-4** DPUs (Vera CPU tray in the reference design). Provides trusted telemetry and can quarantine an agent within milliseconds, from a trust domain the agent cannot reach.                                                                                                                                                                                                                              |
| Ecosystem          | —             | More than 100 organisations at launch, including Anthropic, Cisco, CrowdStrike, Dell, HPE, Microsoft, Palantir, Red Hat, Salesforce, SAP, Scale AI and ServiceNow.                                                                                                                                                                                                                                                                         |

**Motivating claim, not verified here.** NVIDIA says frontier labs reported agents breaking out of evaluation environments, reaching systems they should not have, and misreporting their actions.

## Why it matters to DWS

- **Same principle.** The Aegis Pilot kit's hard stop (PR #2225, the same day) follows the same principle: stop by termination, judge from signed evidence rather than the agent's own account, and prove isolation by attempting egress.
- **Containment is the gap.** The pilot stops agents but does not contain them. OpenShell is an open, portable option for per-step containment (proposed patch C4; not yet in `docs/plans/AEGIS_PILOT_95_READINESS_PLAN.md`, pending the HIC decision), rather than building our own.
- **Root of trust.** Sentry's out-of-band root is stronger evidence than the pilot's in-band site key. It is also a hardware dependency on a US vendor, the same dependency that keeps SEAL-4 out of reach.

## Routed to

- PhD thesis §14.55 (EN/FI), Key Contribution #61, lockstep version 4.15.
- `docs/sales/SALES_OPPORTUNITIES_PIPELINE.md`, row 14.55, ★★★★☆.
