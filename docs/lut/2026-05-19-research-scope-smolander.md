# Research Scope — One-Chapter Précis for Prof. Kari Smolander (LUT)

***

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code | Session: claude/dws-nvidia-os-NDuOs | Date: 19.05.2026 | Changes: Initial one-chapter research-scope précis prepared for Prof. Kari Smolander (LUT). Self-contained deliverable: motivation grounded on the Dell + Palantir on-premises AI operating system announcement of 18.05.2026; three research questions (governance, sovereign architecture, industrial scalability); Design Science Research methodology with KYA artifact + 20-vertical case base + behavioural benchmark; 2026–2029 publication phasing. Aligns with PhD thesis §1.2 / §1.2.1 / §1.6 (PHD_FIREHORSE_EN.md v3.57). Not yet folded into the thesis files — kept standalone so it can be sent to the supervisor without triggering the four-file thesis lockstep.

Document Status:

- Created: 19.05.2026
- Last Modified: 19.05.2026
- Language: English
- Languages Available: EN
- Publication Status: DRAFT (for supervisor review)
- Classification: CONFIDENTIAL — Doctoral correspondence
- Document Type: Research-scope chapter / supervisor deliverable

Addressee:

- **To:** Prof. Kari Smolander, LUT University
- **From:** Risto Anton Päärni — Lifetime Oy (FI), DWS IQ Research / LUT doctoral candidate
- **Subject:** One-chapter research scope, as requested

Related Documents:

- docs/PHD_FIREHORSE_EN.md §1.2 (six doctoral research questions), §1.2.1 (five supervisor discussion questions), §1.6 (earlier response letter draft), §14 (market signals), §14.18 / §14.19 (multi-agent emergent misalignment signal)
- docs/DWS_OS_POSITIONING.md (industrial framing of the NVIDIA-based EU-sovereign on-prem AI OS)
- DWS_SOVEREIGNTY_STANDARD.md (8-dimension sovereignty scoring)
- docs/field-notes/2026-03-10-palantir-aip-partner-outreach.md (Palantir connector-not-competitor stance)
- docs/field-notes/2026-03-16-nvidia-gtc-2026-keynote-dws-impact.md (NVIDIA GTC alignment)

***

## Chapter X — Research Scope

### X.1 Motivation: A Fresh Industrial Signal (18.05.2026)

On 18 May 2026 Dell and Palantir jointly announced an **on-premises AI operating system**, combining Dell hardware (Dell AI Factory with NVIDIA) and the Palantir Foundry / AIP semantic and agent layer, marketed for "highly regulated industries and governments". The announcement is significant for three reasons relevant to this doctoral programme:

1. It **names the category** the present research has been pursuing — the on-premises AI operating system as a coherent buying motion, rather than a collection of point products.
2. It is a **US-domiciled architecture** — both primary vendors are subject to the US CLOUD Act, which creates an unresolved tension between the marketing claim of "data sovereignty" and the legal exposure of the vendor relationship itself. EU sovereign procurement therefore has a research-grade gap that industry has not yet closed.
3. It validates the **agentic layer** as the contested ground. The question is no longer "should AI agents operate inside critical industries?" — it is "under whose governance, with what hardware-level isolation, and with what evidentiary regime?".

This signal is treated here as a research motivator rather than a competitive talking point. The doctoral contribution is the open governance standard (KYA) and the EU-sovereign architectural pattern that the Dell + Palantir bundle structurally cannot provide.

### X.2 Research Problem

How can an **agentic AI architecture** be designed so that it produces **court-defensible, machine-readable compliance evidence** in EU-regulated industrial settings (EU AI Act, CBAM, CSRD, NIS2, DORA) while remaining **EU-sovereign by construction** — that is, without dependency on a US-domiciled vendor in the critical path?

The problem decomposes into a governance question (who is accountable for what an agent does?), a sovereignty question (where does the data, the model, and the legal nexus reside?), and an evidence question (is the audit trail admissible in regulatory and judicial proceedings?).

### X.3 Research Questions

The research is organised around three primary questions, each with a candidate publication and a measurable artifact. These refine and consolidate the six questions in PHD_FIREHORSE §1.2 and the five supervisor-discussion items in §1.2.1 in light of the 18.05.2026 industrial signal.

**RQ1 — Governance.** How should an agent-governance standard be specified so that the identity of the human principal, the scope of the agent's authority, and the conditions for chain termination are hardware-attested and legally falsifiable across an EU regulatory population (AI Act Art. 12, 14, 72; NIS2; DORA)?
*Artifact:* the **KYA (Know-Your-Agent)** standard, including a conformance test suite and a reference implementation.
*Target venue:* international peer-reviewed conference, 2026.

**RQ2 — Sovereign architecture.** What architectural invariants are necessary and sufficient for an on-premises AI operating system to be **EU-sovereign by construction** rather than by claim, and how do they compare empirically to the Dell + Palantir reference architecture along the eight sovereignty dimensions of the DWS Sovereignty Standard (vendor domicile, CLOUD Act exposure, data residency, encryption posture, RLS, model residency, audit residency, support-chain residency)?
*Artifact:* a comparative evaluation framework and a validated reference deployment (NVIDIA GB10 Grace Blackwell + Nemotron 3 Super + OpenClaw + Firecracker MicroVM, EU-operated).
*Target venue:* journal article on EU sovereign cloud architectures, 2027.

**RQ3 — Industrial scalability.** Does the proposed governance standard and architectural pattern scale across **20+ EU-regulated verticals** (energy, steel, cement, chemicals, construction, defence, finance, healthcare, public sector …), and what are the limits of generalisation when the regulatory ontology, the data residency regime, and the agent-task surface differ between verticals?
*Artifact:* a case base of vertical-specific KYA conformance profiles and ontology mappings, instrumented with the AgentLogger evidentiary trace.
*Target venue:* empirical articles (2028) and dissertation synthesis (2028–2029).

### X.4 Theoretical Framing

The research sits at the intersection of three established literatures and one emerging one:

- **Information systems sovereignty** — building on EU data-sovereignty scholarship and the legal-technical analysis of the CLOUD Act vs. GDPR collision.
- **Multi-agent system governance** — drawing on the recent triple signal in the alignment literature (Shapira et al., *Agents of Chaos*, NDSS 2026; Emergence AI, *Emergence World*, 2026; Smitsman et al., *EARTHwise Arena* and the EAB benchmark, 2026), which establishes the **reasoning–behaviour gap** as a failure mode that instruction-based evaluation cannot detect. This grounds RQ1 in a population-scope, behavioural framing rather than a model-instance, declarative one.
- **Enterprise ontology and the carbon balance sheet** — using EU regulatory concepts (ETS allowances, CBAM differentials, CSRD line items) as a machine-readable ontology under the DWS Ontology Standard, with double-entry compliance bookkeeping as the structural analogue.
- **Design Science Research** (Hevner et al.) as the methodological frame: the doctoral contribution is an **artifact** (KYA standard + reference implementation) evaluated in **real industrial environments** rather than in laboratory simulation.

The emerging literature — *agentic AI safety benchmarks* (EAB, ASB, OWASP Top 10 for Agentic Applications 2026) — supplies the evaluation vocabulary for the governance artifact and gives the work a falsifiable surface against which competitor architectures, including the Dell + Palantir bundle, can be scored.

### X.5 Methodology

Design Science Research with three complementary streams:

1. **Artifact construction.** The KYA standard is specified, implemented in the DWS IQ 6/7 stack, and exposed publicly as a candidate open standard (Agentic AI Foundation / Linux Foundation track; NIST AI RMF profile extension as a parallel validation path). The reference implementation uses the EU-operated NVIDIA GB10 / Nemotron 3 Super / OpenClaw / Firecracker MicroVM stack already in 24/7 production (latency, attestation, and kill-time figures measured in situ, not borrowed from spec sheets).
2. **Empirical validation in paying-customer environments.** Industrial cases across the 20-vertical regulatory engine. Each case instruments the AgentLogger evidentiary trace and produces a KYA conformance report. Case selection follows theoretical sampling: maximally different regulatory surfaces (e.g. steel under CBAM, hospital under NIS2 + GDPR, defence under dual-use control).
3. **Comparative benchmark.** The reference deployment is scored on the eight-dimension sovereignty rubric and on the EAB + ASB behavioural benchmarks. Where vendor data is published or testable, comparable scores are produced for the Dell + Palantir bundle and for two other reference points (a pure-cloud frontier provider, an open-source-only on-prem stack). This produces a falsifiable competitive map rather than rhetorical claims.

Ethical and legal review: case-study work in paying-customer environments operates under written data-processing agreements (DPA) and respects sectoral confidentiality. The KYA standard development is committed to be open-licensed; the reference implementation is partly open, partly commercial under Lifetime Oy.

### X.6 Scope and Delimitations

In scope:

- EU-regulated industrial AI deployments (AI Act, CBAM, CSRD, NIS2, DORA, GDPR).
- The on-premises operating-system layer: hardware attestation, agent runtime, governance, evidentiary logging.
- Comparative evaluation against named industrial reference architectures (currently: Dell + Palantir on-prem AI OS, Palantir Foundry standalone, NVIDIA-only stacks).

Out of scope:

- Model pre-training research (the work uses existing open-weights models, primarily Nemotron 3 Super, as substrate).
- Consumer-side agentic AI.
- Non-EU regulatory regimes, except for comparative legal analysis where the contrast is illustrative (US CLOUD Act; UK post-Brexit divergence).

Deliberately preserved as a research **question** rather than an assumption: whether Palantir AIP, as a software runtime, can operate as a **guest tenant** inside the proposed sovereign architecture without breaking the sovereignty invariants. This is a connector hypothesis, not a competitor framing.

### X.7 Expected Contribution

1. **A published, open-licensed governance standard (KYA)** for agentic AI in EU-regulated industries, with a conformance test suite tied to EU AI Act Art. 12, 14, and 72 obligations.
2. **A reference architecture and evaluation rubric** for the EU-sovereign on-premises AI operating system, validated against a contemporary industrial alternative (Dell + Palantir, 2026).
3. **An empirical case base across 20+ regulatory verticals**, demonstrating both the generality and the limits of the proposed pattern.
4. **A theoretical contribution** linking the multi-agent reasoning–behaviour gap to a falsifiable, hardware-attested governance unit (KYA as the falsifiability locus, EAB as the behavioural vocabulary, ASB as the operational-safety complement).

### X.8 Publication Phasing (3–7 Year Horizon)

- **2026** — Article 1: *KYA Standard — An Open-Source Governance Framework for Agentic AI in EU-Regulated Industries.* International conference. Status: draft in preparation, target submission Q3 2026.
- **2027** — Article 2: *Sovereign by Construction — An Architectural Pattern for the EU On-Premises AI Operating System.* Journal article. Builds on RQ2 with the validated GB10 / Nemotron / OpenClaw deployment and the Dell + Palantir comparison.
- **2028** — Articles 3–4: empirical findings from the 20-vertical case base; one article on cross-vertical generality, one on a single high-stakes vertical (candidate: critical-infrastructure energy under NIS2).
- **2028–2029** — Dissertation synthesis and defence.

This phasing matches the 3–7 year horizon required by the PhD scope rule (PHD_FIREHORSE §1.3) and is compatible with the open-standard governance work that Article 1 anchors.

### X.9 Open Questions for the Supervisor

The following items would benefit most from your guidance before the work is committed in writing:

1. **Venue strategy for Article 1.** Given the open-standard ambition, would you advise an information-systems conference (ECIS / ICIS family), a security and governance venue (NDSS / IEEE S&P workshop), or a software-engineering / DSR venue (DESRIST)? Each frames KYA differently.
2. **Case-study ethics envelope.** Empirical validation runs in paying-customer environments under DPA. Does the LUT doctoral school require an additional ethics submission for this design, given that the agent under study acts in industrial systems with real consequences?
3. **Comparative claims against named vendors.** The work compares the proposed architecture to the Dell + Palantir bundle and to Palantir Foundry standalone. What is the LUT convention for naming live commercial products in comparative evaluation tables — are vendor-anonymised labels (Vendor A, Vendor B) preferred, or are named comparisons acceptable where the public announcement (here, 18.05.2026) is the data source?
4. **Publication-by-publication vs. monograph balance.** The current phasing is article-led with a synthesis dissertation. Would you prefer a heavier monograph contribution earlier (2027), with articles as derivatives, or the article-first sequence above?
5. **Co-authorship policy.** The KYA reference implementation is engineered with named collaborators (DWS IQ team and external partners). What is the LUT policy on co-authored articles in the doctoral portfolio, and what proportion of single-authored work is expected?

I will incorporate your guidance into the next thesis revision and into Article 1's framing. A concise 2–3 page version of this scope can also be prepared for circulation if that serves you better than the present chapter.

Kind regards,
Risto Anton Päärni
