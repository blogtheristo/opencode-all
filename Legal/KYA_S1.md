# KYA-S1 — Know Your Agent Security Specification for Autonomous Agents

---

# VERSION AND AGENT HISTORY

Version: 1.4

Sessions & Modifications:

- Version: 1.4 | Tool: Claude Code (Opus 5) | Session: claude/kya-s1-blog-post-1-swb4k4 | Date: 09.08.2026 | Changes: **Attestation tiers renamed to KYA assurance levels** per HIC decision (09.08.2026): **Bronze → KYA-AL1 (Standard)**, **Silver → KYA-AL2 (Enhanced)**, **Gold → KYA-AL3 (Critical)**. Naming only — cadence, evidence depth and every propagation SLA are unchanged (AL1 15 min / AL2 5 min / AL3 60 s on IDV revocation and TC4 propagation; REG-4 cross-fleet query 5 min / 60 s / 10 s; BHM-3 red-team annual / quarterly / continuous). The metal-tier names read as a marketing ladder rather than an assurance scale, and "assurance level" is the term buyers already use from eIDAS LoA and NIST IAL/AAL; the KYA-AL prefix also namespaces the levels away from partner-programme tiers of the same metal names on dws10.com. §8 retitled "Assurance Levels (KYA-AL)"; §10 claim template now names an assurance level. Control identifiers unchanged, so §11's stability guarantee holds and this is a minor version. Prior Bronze/Silver/Gold formulations preserved in the v1.0 entry below and in the §8 supersession note per CLAUDE.md Rule 12. Propagated in the same session to DWS_TRUTH_STANDARD.md row 35, DWS_STANDARDS_LIBRARY.md §3.3, and the kya-s1 blog series (EN + FI). **Known divergence, not resolved here:** `Legal/KYA_S1_v1.3.md` is a separate, unmerged v1.3 line (07.08.2026) carrying TRS-4/TRS-5/PRV-4/TC4-5/FLT-4 and still titled "Standard" — it has NOT been renamed and needs an HIC merge decision.
- Version: 1.3 | Tool: Claude Code (Sonnet 5) | Session: claude/arvonluonnin-ajurit-research-hpiipo | Date: 06.08.2026 | Changes: Reclassified KYA-S1 from "Standard" to "Specification" throughout (title, Document Type, header, body self-references) per HIC correction — KYA-S1 has not been through a standards-body process (no SDO, no formal consensus track) and calling it a "standard" overstates its status; "Specification" is the accurate term for a vendor-authored, publicly-published technical document open for comment. No control content, scope, or tier structure changed. Propagated to DWS_TRUTH_STANDARD.md row 35, DWS_STANDARDS_LIBRARY.md §3.3, docs/BLOG_STANDARD.md registry, the kya-s1-one-signed-page blog post (all copies), and dws10.com/compliance/ in the same session.
- Version: 1.2 | Tool: Claude Code (claude-opus-5) | Session: claude/study-palantir-mas2-MwtEw | Date: 04.08.2026 | Changes: **Re-landed on current `main` after the original branch became unmergeable** (main was re-rooted between May and August 2026; no common ancestor remained, so PR #1317 was closed as superseded — redo prompt: `docs/pr-cleanup/next-prompts-v2-bundle.md`). Content updates on re-land: new §4 **Regulatory anchoring** mapping the seven controls to the EU AI Act duties that are now in force — **Article 50 applies from 2 August 2026**, two days before this version — kept deliberately distinct from Article 12 and Article 14 per `DWS_TRUTH_STANDARD.md` row 31. Public-comment window reset to 04.08.2026–04.11.2026 (the v1.0 window opened 15.05.2026 and had nearly closed while the standard sat unmerged). Sender identity corrected to the canonical umlaut spelling **Risto Anton Päärni** (the v1.0/v1.1 files carried the ASCII-name bug flagged in `docs/BLOG_STANDARD.md` v2.6). Reference implementation re-pointed at current KYA family versions (KYA-Standard v1.11, KYA-Security v1.8, KYA-Optimization v1.9). Cloudflare Pages deploy workflow **removed from this standard's scope** and split to its own change per the redo prompt. All v1.0/v1.1 formulations preserved per CLAUDE.md Rule 12.
- Version: 1.1 | Tool: Claude Code | Session: claude/study-palantir-mas2-MwtEw | Date: 15.05.2026 | Changes: Editorial tone-down — dropped the "sibling standard" / "co-attestation" / "full mission-assurance surface" framing relative to Palantir's MA-S2. KYA-S1 stands on its own; MA-S2 referenced only as structural-inspiration credit. §6 reframed from "Co-Attestation with MA-S2" to "How KYA-S1 sits next to adjacent standards." No control-content changes.
- Version: 1.0 | Tool: Claude Code | Session: claude/study-palantir-mas2-MwtEw | Date: 15.05.2026 | Changes: Initial KYA-S1 — four core control domains (IDV / BHM / REG / TC4) plus three extension domains (FLT / TRS / PRV). Evidence meta-rule (no self-attestation) and attestation tiers (Bronze / Silver / Gold).

Document Status:

- Created: 15.05.2026
- Last Modified: 09.08.2026
- Language: English
- Languages Available: EN
- Publication Status: DRAFT (public comment)
- Classification: PUBLIC
- Document Type: Vendor-Facing Security Specification

Related Documents:

- `Legal/KYA_STANDARD_v1.md` v1.11 (implementation manual — internal)
- `Legal/KYA_SECURITY_v1.2.md` v1.8 (security subset — internal)
- `Legal/KYA_OPTIMIZATION_v1.4.md` v1.9 (optimization & financial layer — internal)
- `DWS_SECURITY_STANDARD.md` (KYA & BYO agent security)
- `DWS_TRUTH_STANDARD.md` row 7 (KYA scoring), row 30 (HIC / Article 14), row 31 (Article 50 labelling)
- `DWS_STANDARDS_LIBRARY.md` §3.1 (EU AI Act), §3.3 (security & governance registry)
- https://ma-s2.com/ (Palantir's Mission Assurance Security Standard — adjacent software supply-chain standard; structural inspiration credit)

---

**Lifetime Oy | DWS IQ Platform**
**Specification:** KYA-S1 v1.4
**Status:** Draft for public comment — window open 4 August 2026 to 4 November 2026
**Lead Architect:** Risto Anton Päärni, Founder, CEO, Lifetime Oy
**Date:** August 2026

---

> **One signed page for the agent in your vendor file.**
>
> **Who is behind it. What it can do. How it is stopped.**

---

## 0. What KYA-S1 attests

Autonomous AI agents take consequential action — tool calls, code execution, MCP invocations, external API writes, physical-world actuation. Enterprise procurement folders already hold signed pages for the organisation (SOC 2, ISO/IEC 27001), the data layer (GDPR, CSRD evidence) and the platform (FedRAMP, where it applies). They do not yet hold a signed page for the agent.

KYA-S1 is that page. A vendor claiming KYA-S1 alignment is asserting — and an independent assessor is confirming — that every consequential agent action on the buyer's systems is traceable to a verified human, that the agent has been red-teamed for the attack vectors that actually exist, that the buyer can ask at any moment which agents are touching their data, and that a compromised agent chain can be terminated inside a defined SLA.

Self-attestation is explicitly not acceptable. The page is only worth the name on the second signature line. See §3.

---

## 1. Scope

KYA-S1 applies to any vendor whose product:

1. Embeds or invokes autonomous AI agents that take action beyond text generation (tool use, code execution, MCP calls, external API writes, physical-world actuation); and
2. Operates in environments where action attribution to a verified human principal is a regulatory, contractual, or operational requirement (classified networks, regulated industries, safety-critical infrastructure, financial systems, autonomous physical systems).

KYA-S1 **does not** address software vulnerability management — that is the software supply chain's problem, not the agent's.

---

## 2. Non-Goals

- KYA-S1 is not a substitute for SOC 2 Type 2, FedRAMP, DISA IL5/IL6, ISO/IEC 27001, ISO/IEC 42001, or EU AI Act conformity assessment. It sits alongside these as the agent-identity-and-behavior layer.
- KYA-S1 is not a software supply-chain standard. It does not attest the code shipped by the vendor or the vulnerabilities present in it.
- KYA-S1 is not a model-safety standard. It does not address training data, alignment, or model bias.
- KYA-S1 does not prescribe a specific identity provider, model vendor, or runtime.
- **KYA-S1 alignment is not EU AI Act compliance and must never be presented as such.** See §4.

---

## 3. Evidence Meta-Rule

**Self-attestation is not acceptable evidence under KYA-S1.**

For every control domain in §5–§6, the vendor must produce at least one of:

- **Third-party audit report** from a qualified independent assessor (e.g. SOC 2 auditor, IDV provider, accredited red-team firm).
- **Platform-generated telemetry** retained for a minimum of 12 months with cryptographic integrity (e.g. signed event log, append-only ledger).
- **Architecture documentation** reviewed and signed by a qualified independent assessor.
- **Contractual SLA commitments** with defined measurement methodology and externally verifiable breach reporting.

Evidence must be **renewable** on a defined cadence (annual minimum; quarterly for KYA-AL2 and above — see §8).

---

## 4. Regulatory anchoring (EU AI Act)

_New in v1.2. Three EU AI Act duties bear directly on the seven controls. They are **three distinct duties** — do not blend them, and do not let a vendor answer one by pointing at another._

| Duty                                                                | What it binds                                                                                                                                                                                               | Applies from      | Nearest KYA-S1 control                                                                                 |
| ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------ |
| **Article 12** — record-keeping / reasoning lineage                 | Automatic logging of events across the system's lifetime, sufficient for traceability                                                                                                                       | In force          | **PRV** (decision replay, fact provenance)                                                             |
| **Article 14** — human oversight                                    | A natural person can understand, oversee and override the system's output                                                                                                                                   | In force          | **IDV** (verified human binding), **TC4** (override / termination), **TRS** (continuous authorization) |
| **Article 50(2)/(4)** — marking & labelling of AI-generated content | 50(2) providers: machine-readable marking. 50(4) deployers: labelling deep fakes, and AI text published to inform the public on matters of public interest where no person assumed editorial responsibility | **2 August 2026** | **PRV-3** (verifiable provenance marker on downstream outputs)                                         |

**Three honest limits on this table.**

1. **Proximity is not equivalence.** A KYA-S1 control being "nearest" to a duty does not discharge that duty. Article 12 demands logs of a specified nature over the system's lifetime; PRV demands replayability of consequential decisions. They overlap; they are not the same test.
2. **Article 50 has exceptions and KYA-S1 does not encode them.** The 50(4) duty is bounded — it does not reach evidently artistic, creative, satirical or fictional work; content authorised by law for criminal-offence purposes; or content that underwent human review and editorial control where a person assumed editorial responsibility. A vendor must read Article 50 itself, not this table.
3. **High-risk classification is a separate assessment entirely.** Annex III high-risk obligations enforce from **2 December 2027**; embedded high-risk under Annex I from **2 August 2028**. KYA-S1 says nothing about whether a given system is high-risk.

**The claim a vendor may make:** _"Our KYA-S1 attestation provides evidence relevant to Articles 12, 14 and 50."_ **The claim a vendor may not make:** _"We are KYA-S1 aligned, therefore we are EU AI Act compliant."_

---

## 5. Four Core Control Domains

These four domains cover the assurance questions a procurement officer or auditor asks before allowing an autonomous agent to act on their systems.

### 5.1 IDV — Identity Verification & Attestation

_Buyer question: is every action traceable to a verified human?_

Every autonomous action taken by an agent governed under KYA-S1 must be cryptographically traceable to a **verified human principal**.

Vendors must demonstrate:

- **IDV-1 — Real-time identity verification** of the human principal at session initiation. Verification target: under 30 seconds end-to-end, including biometric liveness.
- **IDV-2 — Cryptographic binding** between the verified human, the agent session, and every downstream tool invocation. Binding must survive agent-to-agent handoffs.
- **IDV-3 — Continuous re-attestation** on privilege escalation, tool scope expansion, or trust-score change exceeding a defined threshold.
- **IDV-4 — Revocation propagation** within bounded time (KYA-AL1: 15 min, KYA-AL2: 5 min, KYA-AL3: 60 s) when the human principal's verification status changes.

**Evidence:** Third-party IDV provider attestation (Shufti, Veriff, Signicat, Onfido, or equivalent) + platform telemetry of binding events.

### 5.2 BHM — Behavioral Modeling & Adversarial Simulation

_Buyer question: has the agent been red-teamed for what attackers actually try?_

Vendors must continuously model agent behavior and simulate attacks against the agent itself, not just the software it runs on.

Vendors must demonstrate:

- **BHM-1 — Behavioral baseline** per agent class, capturing tool-call distribution, MCP invocation patterns, token usage, and decision-tree shape.
- **BHM-2 — Adversarial simulation** covering at minimum: prompt injection (direct + indirect), MCP tool poisoning, agent-chain hijack, model-output exfiltration, jailbreak via chained tool calls.
- **BHM-3 — AI-assisted red-teaming** of the agent runtime on a defined cadence (KYA-AL1: annual, KYA-AL2: quarterly, KYA-AL3: continuous).
- **BHM-4 — Behavioral guardrails** that block deviations from baseline at runtime and emit signed telemetry on every block.

**Evidence:** Red-team report from accredited firm + platform telemetry of guardrail activations.

### 5.3 REG — Agent Registry & Capability Awareness

_Buyer question: can you tell me, right now, every agent touching our data?_

Vendors must maintain a live registry of every agent instance in their deployment fleet.

Vendors must demonstrate:

- **REG-1 — Real-time registry** of every agent instance: its identity, the verified human it is bound to, its capability manifest (tools, MCP servers, path permissions), its model version, its trust score.
- **REG-2 — Capability manifest** declared per agent before activation. Capabilities outside the manifest must be denied at runtime, not merely audited.
- **REG-3 — Air-gapped operation.** The registry must function in disconnected and air-gapped environments; entries must reconcile when connectivity is restored, with conflict resolution rules defined in advance.
- **REG-4 — Cross-fleet query** in bounded time (KYA-AL1: 5 min, KYA-AL2: 60 s, KYA-AL3: 10 s) — "show me every agent in the fleet currently bound to user X" or "every agent currently using tool Y."

**Evidence:** Architecture review + telemetry sample showing fleet-wide query latency.

### 5.4 TC4 — Trust Collapse Response & Chain Termination

_Buyer question: when something goes wrong, how fast can you stop it?_

When trust in an agent collapses — verified-human revocation, behavioral anomaly above threshold, red-team breach confirmation — the vendor must autonomously terminate the agent chain across the fleet.

Vendors must demonstrate:

- **TC4-1 — Trust collapse detection** with defined thresholds and signed event emission.
- **TC4-2 — Chain termination** ("leash snap"): the offending agent, every downstream agent it spawned, and every active tool session it owns are terminated atomically.
- **TC4-3 — Fleet-wide propagation** within bounded time (KYA-AL1: 15 min, KYA-AL2: 5 min, KYA-AL3: 60 s), including across air-gapped boundaries on next sync.
- **TC4-4 — Post-mortem capture** — the full agent state, tool history, and decision trace at the moment of termination must be preserved for forensic review.

**Evidence:** Telemetry sample of a real or staged termination event end-to-end + SLA contract on propagation time.

---

## 6. Extension Control Domains

These three domains cover assurance problems that arise specifically because the actor is an autonomous agent rather than a piece of software. They have no analogue in software supply-chain, organisational, or platform attestations.

### 6.1 FLT — Fault Attribution

_Buyer question: if we end up in court, who is responsible for what?_

Vendors must demonstrate:

- **FLT-1 — Fault taxonomy** distinguishing at minimum: model fault (the model produced the wrong output), logic fault (the agent code mis-handled a correct output), integration fault (an upstream tool returned bad data), operator fault (the verified human directed the action), policy fault (a guardrail was misconfigured).
- **FLT-2 — Per-incident attribution** stored as a signed artifact within 72 hours of incident close.
- **FLT-3 — Statistical attribution reporting** quarterly, broken down by taxonomy class.

**Evidence:** Incident artifacts + quarterly attribution report.

### 6.2 TRS — Trust Score & Continuous Authorization

_Buyer question: is authorization continuous, or did someone tick a box last quarter?_

Vendors must demonstrate:

- **TRS-1 — Quantitative trust score** per agent session, with documented inputs (IDV state, behavioral baseline distance, red-team posture, capability manifest scope).
- **TRS-2 — Authorization gating** — actions above defined consequence thresholds are blocked when trust score falls below documented levels.
- **TRS-3 — Score telemetry** — every score change is logged with the input deltas that produced it.

**Evidence:** Engine documentation + telemetry sample.

### 6.3 PRV — Memory & Decision Provenance

_Buyer question: can you replay the decision, two years from now, for an auditor?_

Vendors must demonstrate:

- **PRV-1 — Fact provenance** — agent-stored facts carry source, retrieval timestamp, confidence, and policy version under which they were stored.
- **PRV-2 — Decision replay** — for any consequential decision, the vendor can reconstruct inputs, agent state, model version, and policy version at decision time.
- **PRV-3 — Watermarking** — agent-generated outputs intended for downstream consumption carry a verifiable provenance marker.

**Evidence:** Architecture review + replay demonstration.

---

## 7. How KYA-S1 sits next to adjacent standards

KYA-S1 lives on a different axis from the standards a procurement folder already holds. The pairing is illustrative, not contractual:

| Layer attested           | Standards that cover it                                                   | What they leave open                                               |
| ------------------------ | ------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Organisation             | SOC 2 Type 2, ISO/IEC 27001                                               | The autonomous agent's behavior at runtime                         |
| AI management system     | ISO/IEC 42001                                                             | Per-session identity binding and chain termination                 |
| Platform / region        | FedRAMP, DISA IL5/IL6                                                     | The agent's identity binding to a human                            |
| Data                     | GDPR, CSRD evidence, ISO/IEC 27701                                        | Decision provenance and replay                                     |
| Software supply chain    | SBOM regimes, vulnerability-management standards (incl. Palantir's MA-S2) | The agent, the human behind it, and the response to trust collapse |
| **The autonomous agent** | **KYA-S1**                                                                | —                                                                  |

The four core domains of KYA-S1 were deliberately structured to be familiar to engineers already working with software-supply-chain attestation regimes — Palantir's [MA-S2](https://ma-s2.com/) is the most public example at the time of publication. That is the limit of the relationship: structural inspiration and public credit. No joint programme, no co-attestation agreement, nothing agreed with Palantir.

The three extension domains (FLT, TRS, PRV) have no analogue in any of the layers above, because the problems they answer only exist once an autonomous agent is the actor.

---

## 8. Assurance Levels (KYA-AL)

_Superseded naming (v1.0–v1.3, kept per Rule 12): these three levels were previously called **Bronze / Silver / Gold**. KYA-AL1 = Bronze, KYA-AL2 = Silver, KYA-AL3 = Gold. Thresholds and SLAs are identical; only the names changed in v1.4._

| Assurance level | Cadence                                           | Evidence depth                                                                                                                                     | Propagation SLAs                                                         |
| ---------- | ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| **KYA-AL1** (Standard) | Annual                                            | Third-party audit on at least one domain + signed platform telemetry or contractual SLA across the remaining six (no self-attestation in any cell) | IDV revocation: 15 min · TC4 propagation: 15 min · BHM red-team: annual  |
| **KYA-AL2** (Enhanced) | Quarterly                                         | Third-party audit across IDV and BHM + signed platform telemetry (retention 12 mo) across the remaining five                                       | IDV revocation: 5 min · TC4 propagation: 5 min · BHM red-team: quarterly |
| **KYA-AL3** (Critical) | Continuous (telemetry-based) + annual third-party | Independent assessor across all 7 domains + signed SLA                                                                                             | IDV revocation: 60 s · TC4 propagation: 60 s · BHM red-team: continuous  |

Assurance-level claims must appear with the assessor name and the assessment date.

---

## 9. Reference Implementation

A reference implementation of KYA-S1 is operated by Lifetime Oy as part of the DWS IQ platform:

- **IDV** — Shufti / Veriff / Signicat IDV providers with KYA token binding
- **BHM** — Firehorse behavioral telemetry + scheduled adversarial simulation
- **REG** — Subagent Registry + Capability Manifest, with LWM edge-device sync
- **TC4** — TC-4 Leash Snap chain termination
- **FLT** — Fault Attribution taxonomy (logic / integration / operator / model / policy)
- **TRS** — Agent Trust Score engine
- **PRV** — Memory Audit Trail + output watermarking

The reference implementation is documented in `Legal/KYA_STANDARD_v1.md` (implementation manual) and `Legal/KYA_SECURITY_v1.2.md` (security subset). KYA-S1 is the vendor-facing specification derived from those internal documents.

**Lifetime Oy holds itself to §3.** No KYA-S1 attestation letter will be self-issued for the DWS IQ Platform. Until an independent assessor signs one, DWS claims **no assurance level** — the reference implementation above is an architecture description, not an attestation.

---

## 10. Adoption

KYA-S1 is published under a **CC BY 4.0** license. Vendors are free to adopt, attest, and reference the specification provided attribution is preserved.

A vendor claiming KYA-S1 alignment should state:

> _"This product is aligned with KYA-S1 v1.4 at assurance level **{KYA-AL1 / KYA-AL2 / KYA-AL3}**, assessed by **{assessor name}** on **{date}**. KYA-S1 is published by Lifetime Oy and attests the autonomous-agent identity-and-behavior layer."_

---

## 11. Versioning

KYA-S1 follows semantic versioning. Control identifiers (IDV-1, BHM-2, etc.) are stable across minor versions. Major versions may renumber domains; a mapping document is published alongside any major release.

Public-comment period for KYA-S1 v1.3–v1.4: **4 August 2026 – 4 November 2026.** Feedback: risto.paarni@lifetime.fi.

_(The v1.0 comment window opened 15 May 2026 and was due to close 15 August 2026. The specification sat unpublished while the branch carrying it went stale, so the window is reset here rather than quietly counted as served.)_

---

**Lifetime Oy** · Business ID 0772407-9 · VAT FI07724079 · Laidunmaanraitti 2 A 25, 02330 Espoo, Finland
**Founder, CEO:** Risto Anton Päärni · risto.paarni@lifetime.fi · +358 400 319 010
