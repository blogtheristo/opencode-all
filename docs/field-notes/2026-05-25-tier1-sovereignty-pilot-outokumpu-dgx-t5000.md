# Field Note: Tier-1 Sovereignty Pilot for Outokumpu — robotics stack intel + DGX / Jetson T5000 sovereignty assessment

***

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (claude-opus-4-7) | Session: claude/tier1-sovereignty-pilot-L6JYr | Date: 25.05.2026 | Changes: Initial field note. Three-part deliverable agreed in session: (1) confirm Tier-1 sovereignty pilot is the right next-step annex to the Outokumpu partnership offer; (2) open-source intelligence on what robotics / AI / digital-platform vendors Outokumpu uses today; (3) honest assessment of whether NVIDIA DGX (data-centre) and NVIDIA Jetson Thor T5000 (edge / robot brain) qualify as sovereign enough for a Tier-1 RFP under `DWS_SOVEREIGNTY_STANDARD.md` v1.2 and the Sovereignty Tier Map in `DWS_STANDARDS_LIBRARY.md` §3.6.

Document Status:

- Created: 25.05.2026
- Last Modified: 25.05.2026
- Language: English
- Languages Available: English
- Publication Status: INTERNAL — competitive / customer intelligence + sovereignty assessment, not a customer-facing document
- Document Type: Field Note / Sovereignty Assessment / Pilot Scoping

Related Documents:

- `Firehorse/Omnichannel/Partners/OUTOKUMPU_PARTNERSHIP_OFFER.md` v3.0 (CBAM partnership — this pilot is the Tier-1 sovereignty annex)
- `DWS_SOVEREIGNTY_STANDARD.md` v1.2 (Tier-1 definition, CLOUD Act / FISA 702 framing)
- `DWS_STANDARDS_LIBRARY.md` §3.6 (Sovereignty Tier Map — Tier 1 / 2 / 3)
- `docs/field-notes/2026-05-22-outokumpu-sustainability-customers-engagements.md` (Outokumpu customer-engagement campaign intel)
- `sales-outreach/LETTER_ARI_HIRVONEN_OUTOKUMPU.md` (Ari Hirvonen outreach thread)
- `.claude/commands/sovereignty-assess.md` (the scoring skill)

Source Links:

- Outokumpu × ANYbotics partnership announcement (Sep 2023): https://www.anybotics.com/news/outokumpu-anybotics-partnership/
- ANYmal "Jokkeri" deployment at Tornio: https://bssa.org.uk/outokumpu-to-expand-the-use-of-robotics-in-safety-management-first-anymal-robot-jokkeri-started-operating-at-the-companys-site-in-tornio-finland/
- Outokumpu × TCS cloud-first transformation: https://www.tcs.com/who-we-are/newsroom/press-release/outokumpu-partners-tcs-cloud-first-transformation-journey
- Outokumpu × Solita ML platform / digital innovation hub: https://www.solita.fi/work/outokumpu-digital-innovation-hub-drives-ai-solutions-in-sustainable-stainless-steel/
- Outokumpu × Nortal surface-defect detection AI: https://nortal.com/insights/ai-in-action-surface-defect-detection-in-outokumpu-stainless-steel
- Outokumpu × Tietoevry partnership renewal (Apr 2025): https://www.tietoevry.com/en/newsroom/all-news-and-releases/press-releases/2025/04/tietoevry-tech-services-and-outokumpu-renews-their-partnership/
- Outokumpu "AI accelerates steel industry transformation" (2024): https://www.outokumpu.com/en/news/2024/ai-accelerates-steel-industry-transformation
- NVIDIA Jetson Thor / T5000 launch: https://nvidianews.nvidia.com/news/nvidia-blackwell-powered-jetson-thor-now-available-accelerating-the-age-of-general-robotics
- NVIDIA "No Backdoors. No Kill Switches. No Spyware" position post: https://blogs.nvidia.com/blog/no-backdoors-no-kill-switches-no-spyware/
- US Foster bill — GPS tracking / remote-disable for AI chips (coverage): https://hothardware.com/news/nvidia-slams-push-remote-kill-switches-ai-chips
- "GPUaaS is reinforcing the illusion of European AI sovereignty" — TNW: https://thenextweb.com/news/gpuaas-is-reinforcing-the-illusion-of-european-ai-sovereignty
- SiPearl × Semidynamics EU-sovereign rack platform: https://www.datacenterdynamics.com/en/news/sipearl-and-semidynamics-to-develop-eu-sovereign-rack-scale-compute-platform/
- NVIDIA US export-regulation page: https://www.nvidia.com/en-us/about-nvidia/company-policies/export-regulations/

***

- **Date:** 25.05.2026
- **Author:** Risto Anton Päärni (risto.paarni@lifetime.fi)
- **Trigger:** Internal decision — extend the existing CBAM-centred Outokumpu partnership offer (v3.0) with a Tier-1 EU-sovereign infrastructure pilot annex, so the same account conversation covers carbon compliance *and* the regulatory pipeline Outokumpu is going to hit next (NIS2 critical-entity status, EU AI Act Art. 12/50 logging, Cyber Resilience Act for OT, CSRD assurance audit trail).

## TL;DR

1. **Agreed — offer the full Tier-1 sovereignty pilot.** It is the cleanest annex to the existing CBAM partnership: same buyer (Outokumpu sustainability + IT), zero net-new sales motion, and it answers the question every steel CIO is being asked in 2026 ("are our compliance and OT data flows EU-jurisdiction clean?"). Cost to Outokumpu in the pilot is the same as CBAM Phase 1: zero. See §C for the pilot shape.

2. **Outokumpu's current robotics + AI + cloud stack (open-source intelligence):** ANYbotics ANYmal quadrupeds (Swiss — sovereignty-positive; "Jokkeri" at Tornio FeCr, plus Krefeld DE and Avesta SE); industrial digital platform on **Microsoft Azure**; cloud-first transformation outsourced to **TCS** (multi-year, hybrid-cloud); ML platform built by **Solita** (Finland — sovereignty-positive); surface-defect detection AI built by **Nortal** (Estonia/Finland — sovereignty-positive); IT operations renewed with **Tietoevry** (Finland — sovereignty-positive). Full breakdown in §A. **The sovereignty gap is the platform layer (Microsoft + TCS), not the robots and not the ML applications.** That is exactly the gap a Tier-1 pilot can address without dislodging incumbents.

3. **NVIDIA DGX and Jetson Thor T5000 — sovereign enough?** Short answer: **Tier 2 at best, never Tier 1 by themselves, but they can be used inside a Tier-1 stack if the data plane and operator are EU-sovereign and the hardware risk is acknowledged in the risk register.** Hardware is US-designed (NVIDIA, US corp), Taiwan-fabbed (TSMC), and the CUDA / driver / firmware stack is under continuous US export-control jurisdiction (EAR + BIS). On-prem deployment in the EU removes the CLOUD Act surface for *compute and data* but does not remove the *supply-chain, firmware-update, and forward-export-control* risk. Detail and scoring in §B.

***

## A. Outokumpu's current robotics, AI and digital-platform stack (OSINT)

Sourced from Outokumpu press releases, partner announcements, and trade press (links above). All findings are open-source — no privileged disclosure assumed.

| Layer | Vendor | What they do for Outokumpu | Jurisdiction | Sovereignty tier (DWS scoring) | Notes |
| --- | --- | --- | --- | --- | --- |
| **Field robotics (safety & inspection)** | **ANYbotics (ANYmal)** | Autonomous quadruped safety / inspection robots reading gauges, detecting leaks, hot-spotting. "Jokkeri" deployed at Tornio FeCr plant; sister units at Krefeld (DE) and Avesta (SE). Outokumpu publicly claims "first in the steel industry to use robotics in safety management." | Switzerland (EFTA, GDPR-equivalent via adequacy) | **Tier 1-equivalent for hardware**; on-board compute is NVIDIA Jetson-class (see §B) | Sovereignty-positive vendor choice. Robot fleet ops data, however, is a question to ask. |
| **Industrial digital platform / Tornio "high-digit" plant** | **Microsoft** | Industrial digital platform to "turn the Tornio plant into a high-digit, cost-effective steel mill." Azure-based by all public signals. | US (CLOUD Act, FISA 702 exposed) | **Tier 3** (EU region, US ownership) | Largest sovereignty exposure in the stack. Microsoft France's June 2025 senate testimony — they cannot guarantee EU-data immunity from US legal demands — applies directly. |
| **Cloud transformation / hybrid cloud build** | **Tata Consultancy Services (TCS)** | Multi-year strategic partnership to build a next-generation hybrid cloud platform. | India (HQ); delivery global. Not bound by CLOUD Act, but not EU-jurisdiction-native either. | **Tier 2** at best; cloud destination determines effective tier | TCS is a system integrator, not the cloud — the underlying cloud (Azure / GCP / on-prem) is what determines the score. |
| **ML / AI platform** | **Solita** | Built the systematic ML platform; runs the "digital innovation hub" with Outokumpu. | Finland | **Tier 1** | Sovereignty-positive vendor choice. |
| **Surface defect detection AI** | **Nortal** | Production AI for surface defect detection on stainless coil. | Estonia / Finland | **Tier 1** | Sovereignty-positive vendor choice. |
| **IT services partnership** | **Tietoevry** | General IT services partnership renewed April 2025. | Finland | **Tier 1** | Sovereignty-positive vendor choice. |
| **CFO / ERP layer** | Not disclosed publicly here | (likely SAP or Oracle — to be verified) | DE (SAP) / US (Oracle) | SAP = Tier 2 strong; Oracle = Tier 3 | Out of scope for the pilot, in scope for the long account. |

**Pattern.** Outokumpu has already chosen sovereignty-positive vendors at the **application** and **field-robotics** layer (ANYbotics, Solita, Nortal, Tietoevry — all EU/EFTA). The sovereignty *hole* is the **horizontal platform layer**: Microsoft for the industrial digital platform and an SI-led (TCS) hybrid cloud whose cloud destination drives the actual tier. This is the typical Nordic large-industrial pattern circa 2026 — the gap is exactly the one a Tier-1 pilot can address without unseating incumbents.

**Implication for the pilot.** We are *not* asking Outokumpu to rip out Microsoft. We are offering a Tier-1 lane for the workloads where the regulator (NIS2, EU AI Act Art. 12, CSRD assurance audit log) is going to insist on it within 18 months, and where Microsoft's own legal carve-outs leave Outokumpu exposed. That positioning is honest and matches `DWS_STANDARDS_LIBRARY.md` §3.6 — pair Tier-2 platform with Tier-1 data layer, label each layer honestly.

***

## B. NVIDIA DGX and Jetson Thor T5000 — is the hardware sovereign enough for Tier-1?

### B.1 The honest one-paragraph answer

**No, not by themselves. Yes, inside a Tier-1 stack, with explicit risk acknowledgement.** Both products are US-designed (NVIDIA Corporation, Santa Clara) and East-Asia fabbed (TSMC Taiwan). The CUDA toolchain, driver, firmware-update channel, and the **right to ship the chip in the first place** are subject to US Export Administration Regulations (BIS, EAR). On-prem in an EU data centre (DGX) or on-board a robot in the EU (Jetson T5000) eliminates the **CLOUD Act exposure on compute and data** — the data never leaves the EU operator's premises and there is no US-jurisdiction cloud account in the loop. What it does **not** eliminate: (a) supply-chain dependency (a Section 1758 EAR re-classification or a destination-based licence requirement could halt deliveries, spares, or RMA), (b) firmware/driver updates that ship from a US entity, (c) the live US policy debate on remote-disable / GPS-tracking of AI chips (Foster bill, China backdoor claims, NVIDIA's denials — referenced in sources). For a Tier-1 RFP, this means the hardware is acceptable **iff** the data plane, the operator, the orchestration layer, and the model weights are EU-sovereign, and **iff** the risk register names the residual US-export-control dependency explicitly.

### B.2 Scoring grid (`/sovereignty-assess` view)

| Dimension | DGX (B200 / GB200 class, on-prem EU) | Jetson Thor T5000 (edge / robot, in EU) | Tier-1 SiPearl + Semidynamics (reference) |
| --- | --- | --- | --- |
| Chip designer jurisdiction | US (NVIDIA) | US (NVIDIA) | FR (SiPearl) + ES (Semidynamics) |
| Fab jurisdiction | TW (TSMC) | TW (TSMC) | TW / future EU foundry candidates |
| Operator jurisdiction (if EU-deployed on-prem) | EU customer / EU CSP | EU customer | EU |
| CLOUD Act exposure on data | **None** (on-prem, no US cloud account) | **None** (on-device) | None |
| FISA 702 exposure on data | None | None | None |
| US EAR / BIS export-control exposure | **Yes — ongoing** | **Yes — ongoing** | None (EU-origin IP) |
| Firmware / driver / CUDA update channel | US-issued | US-issued | EU-issued |
| Remote-disable / kill-switch *as designed today* | NVIDIA states none; US legislative pressure exists | NVIDIA states none; same legislative pressure | N/A |
| Tier in `DWS_STANDARDS_LIBRARY.md` §3.6 | **Tier 2** (EU operational, US-owned hardware IP) | **Tier 2** | **Tier 1** |
| Sellable into a Tier-1 RFP? | Only as compute layer inside an otherwise Tier-1 stack, with explicit risk note | Same — only with explicit residual-risk note | Yes, native |

### B.3 What this means for the Outokumpu pilot

- **For the data centre.** If Outokumpu wants on-prem GPU capacity for steel-mill computer vision / digital twin / agentic copilots, **DGX on EU soil under an EU operator is the most defensible US-vendor choice available today** — it removes the CLOUD Act path entirely. We sell it honestly as Tier 2 compute under a Tier 1 data + identity spine.
- **For the robot brain.** ANYbotics ANYmal currently uses NVIDIA Jetson-class compute on board. Jetson Thor T5000 is the 2025/2026 successor (Blackwell, 2,070 FP4 TFLOPS, 128 GB, 130 W). Same conclusion — Tier 2 hardware acceptable inside a Tier-1 stack, but the **fleet-ops telemetry and model-update path** must be EU-sovereign. That is the layer DWS owns in the pilot.
- **Forward-looking hedge.** Track SiPearl Rhea1 + Semidynamics rack platform and the AION gigafactory bid as the *only* credible Tier-1-native compute path on a 2027–2029 horizon. Today they are not production-ready at DGX scale; the pilot should name them as the planned migration target, not the day-one deployment.

***

## C. The Tier-1 Sovereignty Pilot — proposed annex to OUTOKUMPU_PARTNERSHIP_OFFER.md v3.0

This is a sketch for an annex (call it v3.1 §10 "Tier-1 Sovereignty Pilot"), not a full draft. It mirrors the CBAM pilot shape so the buyer recognises the format.

**Pilot name.** Outokumpu × Lifetime Oy — Tier-1 EU Sovereignty Pilot (60 days, zero cost).

**Scope.** One non-production workload from each of three layers:

1. **Compliance audit-log layer.** Immutable NIS2 / EU AI Act Art. 12 event log for one Tornio process line, hosted on a Tier-1 EU sovereign data layer (Aiven Postgres EU-sovereign plan or equivalent). Demonstrates the audit trail Outokumpu will need under CSRD assurance and EU AI Act enforcement from August 2026.
2. **Agent / copilot layer.** One DWS IQ agent (suggest: `compliance-check` or `material-oracle`) run end-to-end inside the EU sovereign stack — model weights, inference runtime, prompt/response logs all in EU jurisdiction. Optional add-on: route inference to DGX Spark (on-prem in DWS Espoo lab) so Outokumpu can compare a Tier-2-hardware / Tier-1-data deployment honestly against a US-cloud baseline.
3. **Robot-fleet telemetry layer.** ANYbotics ANYmal "Jokkeri" telemetry (Tornio) mirrored to an EU-sovereign time-series store, with an EU-sovereign dashboard. Demonstrates that the OT data plane around the robot can be made Tier-1 without changing the robot or its on-board compute.

**What Outokumpu commits to (Phase 1 — Tier-1 Pilot).**

- Nominate one Tornio process line and the ANYmal "Jokkeri" fleet as in-scope.
- Provide a sponsor in IT/OT security plus a sustainability/CSRD owner.
- Read-only access to a sandboxed slice of telemetry and one CSRD evidence flow.

**What Lifetime Oy commits to (Phase 1 — Tier-1 Pilot).**

- Stand up the three layers above on Tier-1 EU-sovereign infrastructure at zero charge.
- Deliver a sovereignty assessment scored against `DWS_SOVEREIGNTY_STANDARD.md` v1.2 and the §3.6 Sovereignty Tier Map.
- Deliver a written "DGX / Jetson T5000 sovereignty position" Outokumpu's CIO can hand to their auditor — the substance of §B of this field note, productised.
- Report pilot results to Outokumpu within 60 days, in CFO/CIO-readable format.

**Why now.**

- Outokumpu is a NIS2 essential-entity candidate (metals manufacturing, critical infrastructure).
- EU AI Act Art. 12 (automatic logging) and Art. 50 (transparency) enforceable from August 2026.
- CSRD assurance is moving from limited to reasonable assurance over the next reporting cycles — audit-trail tier matters.
- Microsoft France's senate testimony (June 2025) is now public — every CIO of a large EU industrial gets asked about it.

**Cost to Outokumpu.** Zero in the pilot. Same model as the CBAM pilot — no PO, no commitment beyond 60 days.

***

## Next actions

1. Land this field note on the branch and push.
2. Decision (Risto): extend `OUTOKUMPU_PARTNERSHIP_OFFER.md` to v3.1 with the §C annex above, or keep this as internal intel until after the CBAM pilot conversation closes.
3. Verify (one-shot): which CFO/ERP stack Outokumpu runs (SAP vs Oracle) — fills the only gap in the §A vendor map.
4. Add `Microsoft France senate testimony` as a citable reference in `DWS_SOVEREIGNTY_STANDARD.md` v1.3 — the §B argument leans on it and it deserves a first-class footnote in the standard.
