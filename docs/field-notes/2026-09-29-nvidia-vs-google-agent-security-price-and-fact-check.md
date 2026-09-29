# NVIDIA vs Google agent security — price and fact-check of an AI-generated summary

---

# VERSION AND AGENT HISTORY

Version: 1.0 [Latest]

Sessions & Modifications:

- Version: 1.0 [Latest] | Tool: Claude Code (web) | Session: claude/nvidia-google-agent-security-mnxmlb | Date: 29.09.2026 | Changes: Fact-check of an HIC-pasted Finnish summary (price + "Google's answer"); corrections; sales angle added to §14.55 pipeline row. | Harness: Claude Code + CLAUDE.md + DWS_TRUTH_STANDARD | HIC-approved-drift: none

Session Links & References:

- Parent signal: PhD `docs/PHD_FIREHORSE_EN.md` §14.55; field note `2026-09-28-nvidia-openshell-aegis-c4.md`
- Sales: `docs/sales/SALES_OPPORTUNITIES_PIPELINE.md` §14.55 row (v1.3)

Document Status:

- Created: 29.09.2026
- Status: PENDING_REVIEW

---

## 1. Input

HIC pasted (29.09.2026) a Finnish two-part answer, origin not stated, on (1) the price of NVIDIA's agent security stack and (2) Google's counterpart. Checked by web search 29.09.2026. Primary NVIDIA pages (nvidianews.nvidia.com) and storagereview.com were egress-blocked; claims below rest on search-result excerpts of those pages and on Google Cloud documentation titles.

## 2. Verdict per claim

| Claim in the pasted text                                               | Verdict                   | Correct statement                                                                                                                                                                                   |
| ---------------------------------------------------------------------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| No single price; enterprise infrastructure                             | Correct                   | —                                                                                                                                                                                                   |
| BlueField-4 sold inside servers (Dell, HPE, Lenovo) or via cloud       | Plausible                 | Dell, HPE, Lenovo are named launch partners. No public BlueField-4 list price found. Internal estimate €6,000/card (`docs/plans/DOCA_MICROSERVICES_PLAN.md` §3.1) is an estimate, not a quote.      |
| OpenShell and Sentry "usually tied to NVIDIA AI Enterprise licences"   | **Wrong for OpenShell**   | OpenShell is Apache 2.0, v0.1.0, free, runs on Vera, Arm and Intel CPUs, no new hardware. Sentry is a reference-system component, **not generally available**, no published price or licence model. |
| NVIDIA AI Enterprise priced per year per GPU/CPU                       | Correct (price not given) | List: $4,500/GPU/year self-managed (EU ~€5,800 ex VAT); $1/GPU-hour on cloud marketplaces; Inception/EDU −75% ($1,125). Not a prerequisite for OpenShell.                                           |
| Hardware-level monitoring always needs a physical BlueField investment | Correct                   | Sentry only. OpenShell alone needs none.                                                                                                                                                            |
| Google uses gVisor and isolated runtimes                               | Correct, incomplete       | Main product is **GKE Agent Sandbox** (Cloud Next '26): gVisor isolation, default-deny network policy, Kata pluggable, open source (Kubernetes SIG Apps), runs on any Kubernetes cluster.           |
| Vertex AI Agent Builder: IAM + API gateways                            | Correct, incomplete       | Add **Model Armor** (prompt-injection, jailbreak, data-leak filtering at runtime).                                                                                                                  |
| SAIF defines real-time monitoring and automatic cut-off of agents      | Overstated                | SAIF is a principles framework, not an enforcement mechanism.                                                                                                                                       |
| SCC detects abnormal agent behaviour centrally                         | Correct, name missing     | Product is **Agent Engine Threat Detection** in Security Command Center: container escapes, reverse shells, malicious binaries in Vertex AI Agent Engine.                                           |
| (Not in text) Is Google a launch partner?                              | Added                     | Search summaries list Microsoft, Oracle, CoreWeave but **not Google Cloud or AWS**. Single-source; not verified against the primary partner list.                                                   |

**Name collision:** gVisor's user-space kernel is also called "Sentry". NVIDIA Sentry (DPU watchdog) and gVisor Sentry (syscall interceptor) are unrelated. Any DWS copy must qualify the name.

## 3. What the comparison means

| Layer                        | NVIDIA                                   | Google                                           | DWS Aegis Pilot                                  |
| ---------------------------- | ---------------------------------------- | ------------------------------------------------ | ------------------------------------------------ |
| Containment (can it escape?) | OpenShell: Landlock, seccomp, netns      | GKE Agent Sandbox: gVisor, network policy        | Uses OpenShell (C4, HIC 28.09.2026)              |
| Out-of-band watcher          | Sentry on BlueField-4 (not GA)           | None in silicon; SCC detection runs in the cloud | Signed ledger, site key pinned off-host          |
| Input/output filtering       | —                                        | Model Armor                                      | KYA capability manifest                          |
| Works with uplink severed    | OpenShell yes; Sentry on-prem yes        | No — managed cloud services                      | Yes, tested (severed-uplink rehearsal PASS)      |
| Evidence a third party signs | Telemetry, not an acceptance record      | Findings in SCC, held by Google                  | Signed Art. 12 record per run                    |
| Cost of entry                | €0 (OpenShell); DPU + servers for Sentry | Pay-per-use on GCP                               | Pilot price per `dws10.com/config/products.json` |

Two strategies: NVIDIA roots trust in its own silicon; Google roots it in its own cloud. Both put the root of trust with the vendor. Neither gives an EU operator a record it controls and can show an auditor after the network is cut. That is the gap H14.55 predicted, and Google's stack is a data point for RQ14.55c: software-only containment (gVisor) is production-grade at hyperscale, so sovereign deployments can reach containment without DPUs — the open question stays evidence, not isolation.

## 4. Sales angle (routed to pipeline §14.55 row)

- Score unchanged ★★★★☆. Google adds a second buyer segment: EU firms already running agents on GKE / Vertex AI.
- Message: "Containment from NVIDIA or Google. Evidence you hold yourself from DWS." Aegis Pilot runs on top of either sandbox.
- Price argument (honest): OpenShell is free, so the containment layer is not where money goes; the paid line is audit-grade evidence and site control.
- Do not claim Google is absent from the NVIDIA partner list in public copy until the primary list is read.

## 5. Session learning outcome

1. KB update: N/A — pending HIC decision below.
2. Field note: this file.
3. Learn/ HTML render: N/A — Status PENDING_REVIEW.
4. Drive export: N/A — after HIC review.
5. HIC decision question: add §14.55.5 "Google's software-rooted counterpart" to the PhD thesis (four-file version bump), or keep this as field-note evidence only?
6. Calendar: none — no dated commitment.

## 6. Impact on DWS IQ products (HIC question 29.09.2026)

Core finding: **containment is becoming free.** OpenShell (Apache 2.0) and GKE Agent Sandbox (open source, Kubernetes SIG Apps) both give away the sandbox. What stays paid is (a) evidence a third party can sign, (b) control that survives a severed uplink, and (c) vendor-neutral policy. DWS must price those three, never isolation.

| Product (products.json id)                      | Effect                      | Why                                                                                                                                                                | Action                                                                                                                                                               |
| ----------------------------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Aegis Pilot `DWS-AEGIS-PILOT-001` (€19,990)     | Stronger                    | Its binary KPI (severed uplink: runs, Art. 12 record written, operator stop) is exactly what neither NVIDIA (Sentry not GA) nor Google (cloud-dependent) delivers. | Keep price. Pre-empt the objection "OpenShell is free, why pay?" in the one-pager: OpenShell is included; the €19,990 buys the tested, signed acceptance result.     |
| Aegis `DWS-AEGIS-001` (€59,990 + €999–4,999/mo) | Stronger, one copy defect   | Sovereign tier: Google's stack cannot run air-gapped; Sentry ties the root of trust to NVIDIA silicon. Aegis is the vendor-neutral evidence layer on top.          | **Truth drift:** `Store/PRODUCT_AEGIS.md:88,158` claim "Firecracker MicroVM per agent"; the pilot kit uses OpenShell (Landlock/seccomp). Align copy before outreach. |
| KYA / `KYA-JEV-001` (€99/mo)                    | Pressure + opportunity      | NVIDIA's policy prover and Google IAM/Model Armor overlap with capability control. KYA's edge: one signed manifest, portable across runtimes.                      | Position KYA as the policy source that compiles to OpenShell policy (done in Aegis C4) and to GKE Agent Sandbox network policy (not built).                          |
| `LF-K8S-T4`, `LF-DOCA-SECURITY` (€1,000/mo)     | Weaker unless re-positioned | Priced on BlueField-3 + NVAIE. Sentry runs on BlueField-4 only and is not GA. DOCA Argus watches network traffic, not agent behaviour.                             | State plainly that BlueField-3 does not run Sentry. Do not sell Sentry before GA. Revisit package when Sentry ships.                                                 |
| Kubernetes tiers `LF-K8S-T1…T3`                 | Opportunity                 | GKE Agent Sandbox is an open Kubernetes primitive that runs on any cluster, including on-prem.                                                                     | Evaluate adopting the agent-sandbox CRD as the K8s-native isolation option (gVisor/Kata).                                                                            |

Risk to watch: if NVIDIA or Google add signed, customer-held audit records to their stacks, the Aegis evidence wedge narrows. Neither has announced this as of 29.09.2026.
