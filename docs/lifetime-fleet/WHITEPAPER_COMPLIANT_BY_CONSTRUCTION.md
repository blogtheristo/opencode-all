# Compliant by Construction: Governing Physical-AI Fleets Across a 10-Year Lifecycle

---

# VERSION AND AGENT HISTORY

Version: 1.1

Sessions & Modifications:

- Version: 1.1 | Tool: Claude Code (claude-sonnet-5) | Session: claude/nvidia-halos-robotics-suqayg | Date: 10.07.2026 | Changes: PR review fix — added the required VERSION AND AGENT HISTORY header block (was missing per `DWS_DOCUMENT_STANDARD.md` §2.1); softened the unsourced quantified performance/insurance/liability claims (42% / up to 60% / 8–15%) to qualitative language pending a registered canonical source; corrected the AI Act Omnibus source citation to distinguish the reported/proposed timeline relief from the enacted EUR-Lex text.
- Version: 1.0 | Tool: Claude Code (Opus 4.8) | Session: claude/nvidia-halos-robotics-suqayg | Date: 23.06.2026 | Changes: Initial publication — whitepaper on NVIDIA Halos for Robotics, the EU regulatory gauntlet (Machinery Regulation, AI Act embedded high-risk, Revised Product Liability Directive), and the Lifetime Fleet Control Room as the governance/evidence layer. Companion to `docs/regulatory-radar/NVIDIA_HALOS_ROBOTICS_BRIEF.md`.

Session Links & References:

- Claude Code (claude/nvidia-halos-robotics-suqayg): see branch commits
- Related: docs/regulatory-radar/NVIDIA_HALOS_ROBOTICS_BRIEF.md; docs/lifetime-fleet/TORNIO_CONTROL_ROOM_IMPLEMENTATION_PLAN.md

Document Status:

- Created: 23.06.2026
- Last Modified: 10.07.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE

---

### A DWS IQ Whitepaper on NVIDIA Halos, the EU Regulatory Gauntlet, and the Lifetime Fleet Control Room

**Lifetime Oy · DWS IQ 6 · June 2026**

---

## Executive summary

Physical AI is moving from a single, heavily chaperoned robot prototype to **heterogeneous fleets** — humanoids, autonomous forklifts, quadrupeds, and AMRs — operating across multiple factories over a 5-to-10-year lifecycle. At that scale the binding constraint is no longer _initial certification_. It is **maintaining compliance over time** amid continuous OTA updates, model drift, layout churn, and a tightening EU regulatory pipeline.

Two complementary layers solve this. **NVIDIA Halos for Robotics** (announced 22 June 2026) provides the functional-safety substrate that keeps each robot's certified safety envelope intact while its AI evolves. **DWS IQ's Lifetime Fleet Control Room** provides the governance and evidence layer that proves the _fleet_ stays compliant over its lifetime — the immutable audit trail, the drift evidence, the anonymization proof, and the EU-sovereign data plane an enterprise needs to satisfy a Notified Body, a works council, and a court.

This paper maps both layers to the three EU instruments that bite between 2026 and 2028 and presents a reference deployment at Outokumpu's Tornio Works.

---

## 1. The EU regulatory gauntlet (2026–2028)

| Instrument                                             | Applies                                                               | What it requires of a physical-AI fleet                                                                                                                                                                                                                   |
| ------------------------------------------------------ | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Machinery Regulation (EU) 2023/1230**                | **20 Jan 2027**                                                       | AI safety components with self-evolving / machine-learning behaviour (Annex I, Part A, Nos 5–6) require **mandatory third-party Notified Body conformity assessment**. With 6–12 month assessment lead times, the runway is already effectively negative. |
| **EU AI Act (EU) 2024/1689** — embedded high-risk      | **2 Aug 2028** (reported/proposed Omnibus relief; not yet on EUR-Lex) | High-risk obligations for AI safety components embedded in machinery: Art. 9 risk management, **Art. 12 automatic logging over the operational lifetime**, Art. 14 human oversight, Art. 15 robustness.                                                   |
| **Revised Product Liability Directive (EU) 2024/2853** | Transposition by **9 Dec 2026**                                       | Brings software and AI explicitly within strict (no-fault) liability and eases the claimant's burden of proof — sharply raising the cost of an _unevidenced_ safety failure years after deployment.                                                       |

The strategic consequence: every OTA update, every layout change, and every year of model drift is a potential compliance event. An architecture that treats these as routine — rather than as re-certification triggers — is worth more than the hardware it runs on.

---

## 2. The safety substrate: NVIDIA Halos

Halos is the industry's first full-stack functional-safety system for physical AI. Four layers matter for lifecycle compliance:

- **Hardware (IGX Thor + Safety Island):** a physically isolated, IEC 61508 **SIL-3** safety module alongside the Holoscan Sensor Bridge for real-time multimodal sensing; 22,000+ internal hardware safety mechanisms run continuous diagnostics.
- **Software (Halos OS / Core on QNX 8.0):** a hardened, deterministic, certified execution environment that backs real-time AI decisions and commands a fail-safe state if the AI layer glitches.
- **Hypervisor partitioning:** a Type-1 hypervisor splits IGX Thor into an **agile AI VM** (perception, models — OTA-updatable nightly) and a **frozen safety VM** (Halos Core, QNX — locked and certified). Updating the AI layer does not touch the safety envelope, so it does not trigger re-certification.
- **Outside-In Safety Blueprint:** infrastructure-mounted cameras map the facility once and broadcast global safety zones to the **whole heterogeneous fleet** simultaneously — no per-asset firmware re-flash.
- **Halos AI Systems Inspection Lab:** the world's first ANAB-accredited program for functional and AI safety in physical AI, pre-validating integrations before third-party certification by TÜV Rheinland, UL Solutions, and TÜV SÜD.

Three lifecycle "unlocks" follow directly:

1. **OTA without recertification** — the agile/anchor split keeps the certified kernel static while capabilities improve.
2. **Mutation-surface isolation** — layout change is confined to the infrastructure mesh config; each asset's safety kernel only executes _"if mesh says Zone X restricted, do not enter."_ A layout edit is an infrastructure configuration change, not a per-asset modification of the Safety-Related Parts of the Control System across N machines — keeping it clear of an Annex I "substantial modification" trigger.
3. **Edge-anonymized Art-12 telemetry** — kernel-level logging records vector discrepancies and state changes (not raw video), producing an audit-ready trail without overwhelming the network or worker privacy.

---

## 3. Where DWS fits: the governance & evidence layer

**Halos governs the robot; DWS evidences the fleet.** This is a complementary boundary, not a competitive one. Halos secures the per-asset safety envelope; DWS IQ proves — continuously, signed, and audit-ready — that the _fleet of assets_ remains compliant across its operational lifetime.

DWS maps to the four-part Brain–Memory–Body–Hands architecture:

- **Brain:** DWS agents reason about _compliance and the regulatory pipeline_; Halos makes the robot's _real-time safety_ decision. Different decision domains, no overlap.
- **Memory:** the regulatory-pipeline ontology tracks the live instruments (Machinery Reg, AI Act embedded, PLD) with in-force dates and customer-impact rules.
- **Body:** signed, **Article-12-auditable** evidence reports — the artifact a Halos-certified deployer hands its auditor.
- **Hands:** the Outside-In infrastructure mesh and IGX/Holoscan telemetry are ingestion surfaces for the DWS Control Room.

Across all of it runs **KYA** (Know-Your-Agent) trust governance: every agent and proposal carries a trust tier (TC-0…TC-4); a functional-safety fault maps to a tier drop. Halos's SIL-3 Safety Island is the hardware analogue of KYA's sandbox isolation. Action stays **human-in-the-loop by construction** — the governance layer proposes, it never autonomously actuates — aligning with AI Act Art. 14 and keeping the layer outside the Machinery-Reg safety-component scope.

---

## 4. Reference deployment: the Lifetime Fleet Mobile Control Room at Outokumpu Tornio

**Outokumpu Tornio Works** — the world's largest fully EAF-based integrated stainless mill (~1.6 Mt/yr, ~1.6 tCO₂e/t, 100% fossil-free electricity) — already operates an ANYbotics ANYmal quadruped ("Jokkeri") for safety inspection on its ferrochrome floor. It is the ideal first site for a governed physical-AI fleet.

The **Lifetime Fleet Mobile Control Room** turns live mill and robot-fleet signals into governed situational awareness and HIL-gated action proposals:

- **Edge:** an IGX mill-floor brain (perception, edge-anonymization) feeds a GN100 control brain (governance, KYA signing, API) — the Halos agile/anchor split, in non-actuating form.
- **Signals:** ANYmal Jokkeri telemetry + weather + grid-carbon, extensible to mill historians; a versioned, audited **mesh-zone config** as the single locus of layout change.
- **Surface:** an installable mobile PWA (and native field app) showing live state, anomalies, heterogeneous fleet status, and Accept/Override proposal cards that feed a reward loop.
- **Governance:** every ingest and decision is Article-12 immutable-logged (vectors, not video), KYA-tiered, on an EU-sovereign data plane with no US CLOUD Act surface — provable to both a Notified Body and the works council.

The result: a fleet that adapts to a layout change in minutes with zero downtime, improves nightly via OTA without recertification, and carries a continuously signed compliance trail across its entire lifecycle.

---

## 5. The financial engine of compliance

The shift from experimental AI to regulated enterprise operations is not merely a technical challenge — it is a strategic pivot to **monetize industrial certified assets**. By decoupling AI innovation from safety-critical kernels, enterprises transition from a cycle of continuous re-certification costs to a repeatable, scalable asset model.

Integrating DWS IQ transforms compliance from a cost center into a driver of **"Financial Alpha"** — the point where efficiency gains exceed compute costs. Swarms running under DWS IQ governance are architected to reach this threshold faster than unmanaged, single-agent deployments. This architecture also lets industrial enterprises automate compliance, reducing re-certification cost and liability exposure compared to manual processes. Beyond internal efficiencies, DWS IQ-governed operations are designed to lower insurance risk through compliance-by-design, and provide a defensible, auditable trail that mitigates the long-tail risks of the Revised Product Liability Directive.

---

## 6. Conclusion

By decoupling perception from the individual machine and confining change to versioned infrastructure config, physical AI starts to behave like cloud software: the warehouse or mill floor becomes a software-defined canvas, and a layout change is as routine as updating an API config. Halos makes the robot safe; DWS IQ makes the fleet **provably, continuously compliant**. Together they convert an unpredictable regulatory liability into a defensible, auditable, multi-year asset.

---

_Sources: NVIDIA Halos for Robotics announcement (nvidianews.nvidia.com, 22 Jun 2026); Regulation (EU) 2023/1230; Regulation (EU) 2024/1689, Art. 113 (Annex I products) — 2 Aug 2028 date reflects the reported/proposed Omnibus timeline relief (provisional agreement, 7 May 2026), not yet reflected in the EUR-Lex text of the base Regulation; Directive (EU) 2024/2853. Lifetime Oy, Business ID 0772407-9, Espoo, Finland._
