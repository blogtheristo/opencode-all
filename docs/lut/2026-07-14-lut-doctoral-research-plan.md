# Doctoral Research Plan — Sovereign Edge AI Governance for EU-Regulated Industries (LUT Version)

---

# VERSION AND AGENT HISTORY

Version: 1.1

Sessions & Modifications:

- Version: 1.1 | Tool: Claude Code | Session: claude/lut-phd-research-options-p7jskn | Date: 14.07.2026 | Changes: Grew the set to **six** research questions — added Q6 (governing the voluntary-ESG → mandatory-sovereign-AI-compliance transition in industrial enterprises), the organizational/management capstone that sits in LUT's Industrial Management department wheelhouse (Smolander's software-engineering-management / digital-transformation focus), with Q5 (KYA conformance) reframed as the technical Design-Science capstone. Added an explicit **boundary section** (§3.8) naming what KYA conformance does NOT yet cover, mapping each gap to an RQ. Added LUT Industrial Management departmental-fit framing (§6) and a fourth theoretical base (technology-adoption / organizational-change). Updated the Lifetime AB (SE) status: incorporation being finalized in July 2026 (signing pending eIDAS e-card e-identification), superseding the earlier "planned ~Nov 2026" line — still not legally incorporated as of writing.
- Version: 1.0 | Tool: Claude Code | Session: claude/lut-phd-research-options-p7jskn | Date: 14.07.2026 | Changes: Initial ~10-page LUT doctoral research plan consolidating five research questions (Q1 verification / TECoSA-Aegis; Q2 environmental-compliance governance / SRC; Q3 transparency for public legibility / AI Act Art. 50; Q4 safety-performance trade-offs / Törngren SAFECOMP; Q5 KYA open conformance standard / LUT-native DSR spine). Builds on the 19.05.2026 Smolander scope round and the two 14.07.2026 field notes (KTH/TECoSA hand-off; three-then-four research options). Standalone deliverable — deliberately NOT folded into the four thesis files, so it can be sent to the supervisor without triggering the four-file thesis lockstep. Honesty guardrails carried through: Lifetime AB (SE) planned ~Nov 2026 not yet incorporated; Vinnova/TECoSA is aspirational adjacency; KTH relationship is in-play not in-place; external anchor specifics (Galaz remit, SAFECOMP titles/years) flagged for verification before external citation.

Document Status:

- Created: 14.07.2026
- Last Modified: 14.07.2026
- Language: English
- Languages Available: EN
- Publication Status: DRAFT (for supervisor review)
- Classification: CONFIDENTIAL — Doctoral correspondence
- Document Type: Doctoral research plan / supervisor deliverable

Addressee:

- **To:** Prof. Kari Smolander, LUT University
- **From:** Risto Anton Päärni — Lifetime Oy (FI), DWS IQ Research / LUT doctoral candidate
- **Subject:** Ten-page doctoral research plan — five deployment-grounded research questions in sovereign edge-AI governance

Related Documents:

- `docs/lut/2026-05-19-letter-smolander-unified-scope.md` — prior round (DWS OS unified spine, 9-scenario scoring)
- `docs/lut/2026-05-19-research-scope-smolander.md` — one-chapter précis (governance / architecture / scalability)
- `docs/field-notes/2026-07-14-lut-smolander-phd-three-research-options.md` — the three-then-four research options + memo strategy
- `docs/field-notes/2026-07-14-kth-broman-torngren-tecosa-trustworthy-systems.md` — KTH / TECoSA hand-off (Q1/Q4 academic anchor)
- `docs/PHD_FIREHORSE_EN.md` / `docs/PHD_FIREHORSE_FI.md` — LUT thesis (elevation target once RQs are fixed)
- `docs/gtm/TECOSA_TORNGREN_CALL_PREP.md` — the Törngren one-pager ("memo") that doubles as the empirical-testbed grounding for LUT
- `DWS_SOVEREIGNTY_STANDARD.md` — the 8-dimension sovereignty rubric used as an evaluation instrument
- `Legal/KYA_STANDARD_v1.md` — Know-Your-Agent trust-scoring specification (Q5 artefact)

---

## Abstract

This plan proposes a Design Science Research (DSR) doctorate on the **governance of sovereign edge-AI systems in EU-regulated industries**, grounded in a production platform (DWS IQ) operating today on NVIDIA hardware under a Know-Your-Agent (KYA) trust-governance layer. Six research questions are advanced, each pinned to a named external research anchor, a live deployment testbed, and a specific EU-regulation article: (Q1) formal verification of trustworthiness for sovereign edge-AI orchestration; (Q2) governance structures for legally defensible environmental-compliance outputs from multi-agent systems; (Q3) operationalizing sovereign-AI transparency for public legibility under EU AI Act Article 50; (Q4) formal modeling and validation of safety-performance trade-offs under real-time edge constraints; (Q5) the design and validation of KYA as an open conformance standard — the **technical spine** the first four instantiate; and (Q6) how industrial enterprises govern the transition from voluntary ESG reporting to mandatory sovereign-AI compliance infrastructure — the **organizational capstone** that sits squarely in LUT's Industrial Management department. The set is deliberately two-anchored: a technical spine (Q5) in Design Science methodology and a management spine (Q6) in industrial-management research. The empirical differentiator LUT brings, which a purely academic centre cannot, is a set of Finnish industrial testbeds (Outokumpu; construction) inside a Nordic multi-entity operating structure with an active KTH/TECoSA research thread. The contribution is an artefact-anchored, standard-producing dissertation rather than an ontological survey.

## 1. Motivation and Research Problem

The category this work addresses — the **on-premises / edge AI operating system for regulated industry** — is being publicly defined right now. In a single 48-hour window in May 2026 two industrial announcements bracketed the space: Dell + Palantir's on-premises AI operating system (co-branded, regulated-industry-targeted) and Google's Antigravity agent operating system (cloud-native, hyperscaler-bundled). Both primary vendors are US-domiciled; the CLOUD Act applies to the vendor relationship. The open question neither answers is **how an EU-sovereign variant governs the trustworthiness of autonomous agents at the edge in a way that is legally defensible under EU regulation** — not as a compliance afterthought, but as an engineering discipline that produces audit-grade evidence by construction.

The research problem is therefore not "can agents act at the edge" (they do, in production) but: **what governance mechanism makes an agent's edge decisions verifiable, legally defensible, publicly legible, and economically viable under real-time constraints — and can that mechanism be standardized?** This is squarely an information-systems / design-science problem: the object of study is a socio-technical artefact (a governance layer) deployed in a real regulated setting, evaluated against stated requirements drawn from EU law and industrial practice.

The timing window — 2026–2027 — is when the EU-sovereign variant must be named, published, and cited if it is to be a peer in the discourse rather than a follower. That urgency is the motivation for a doctorate anchored on a system that already exists, rather than one that must first be built.

## 2. Positioning: Sovereign Edge AI at the EU Regulatory Frontier

Three regulatory instruments define the frontier this work operates on:

- **EU AI Act** — Article 12 (record-keeping / automatic logging) and Article 50 (transparency obligations) are the two load-bearing articles for agentic systems; high-risk classification governs the industrial deployments in scope.
- **NIS2** — cybersecurity and incident-handling obligations for essential and important entities, directly relevant to edge deployments in steel, energy, and construction.
- **CBAM / CSRD / ETS** — the climate-disclosure and carbon-accounting regime that turns "environmental compliance output" from a report into a legally consequential, auditable artefact.

The platform under study, **DWS IQ**, instantiates a response to all three. Its governance core is **KYA (Know-Your-Agent)** — a trust-scoring layer for autonomous agents — running over hardware-attested isolation (Firecracker MicroVM, sub-125 ms kill on a published AWS benchmark) with Article-12-grade decision logging. It operates on NVIDIA GB10 Grace Blackwell hardware (Acer Veriton GN100) under an agent runtime, and in a hardened DGX-based configuration for the dual-use **Aegis** deployment. The sovereignty posture is evaluable against the DWS 8-dimension sovereignty rubric, which serves in this research as a reusable evaluation instrument, not merely a marketing frame.

The doctoral contribution sits at the intersection of three literatures — **trustworthy edge computing** (safety argumentation, assurance cases), **AI governance** (algorithmic accountability, regulatory alignment), and **information-systems design science** (artefact construction and evaluation) — and its novelty is the claim that these three converge on a single mechanism: an agent trust-and-evidence layer whose outputs are simultaneously the safety evidence, the compliance record, and the transparency disclosure.

## 3. The Six Research Questions

Each question is stated with its novelty, its named external research anchor, the live DWS testbed that grounds it empirically, the specific EU-regulation hook, and the intended method. The six are not independent silos. **Q5 (KYA as a conformance standard) is the _technical_ spine that Q1, Q2 and Q4 each instantiate in a different regulated context and Q3 exposes to the public; Q6 (governing the compliance transition) is the _organizational_ capstone under which industrial firms actually adopt the whole apparatus.** Q1–Q5 are the engineering layer; Q6 is the management layer.

### 3.1 Q1 — Verifying trustworthiness of sovereign edge-AI orchestration

> **How can sovereign edge-AI orchestration be formally verified for trustworthiness in regulated industrial environments?**

- **Novelty.** Moves "trustworthiness" from a qualitative posture to a verifiable property of an orchestration layer under stated assumptions — for _agentic_ systems, where the reasoning–behaviour gap defeats naive input–output testing.
- **External anchor.** KTH / TECoSA (Trustworthy Edge Computing Systems and Applications; Vinnova competence centre, phase 2) — Törngren's edge-security and safety-argumentation programme.
- **DWS testbed.** The DGX-based Aegis deployment and the edge control-room substrate, governed by KYA trust scoring.
- **EU hook.** EU AI Act (high-risk), NIS2.
- **Method.** DSR artefact (the verification harness) + formal specification of the trustworthiness properties + evaluation against the deployed system.

### 3.2 Q2 — Governance for legally defensible environmental-compliance outputs

> **What governance structures are required for multi-agent AI systems to produce legally defensible environmental-compliance outputs under EU regulation?**

- **Novelty.** Treats a compliance output (a CBAM declaration, a CSRD disclosure) not as a document but as an _assurance case_ whose evidence chain must survive legal challenge — and asks what multi-agent governance guarantees that defensibility.
- **External anchor.** Stockholm Resilience Centre (SRC) — Victor Galaz's work on AI, governance, and algorithmic/environmental resilience. _(Confidence: Medium — verify Galaz's exact affiliation/title and whether "algorithmic resilience" is his own term before external citation.)_
- **DWS testbed.** The Article-12 logging pipeline plus the KYA evidence chain running over carbon / CBAM / CSRD workloads.
- **EU hook.** EU AI Act Article 12; CBAM / CSRD / ETS.
- **Method.** Case study on live carbon-accounting workloads + design of the governance structure + legal-defensibility evaluation criteria.

### 3.3 Q3 — Operationalizing transparency for public legibility

> **How can sovereign-AI system transparency be operationalized for public legibility under EU AI Act Article 50?**

- **Novelty.** Article 50 transparency is usually read as a disclosure checkbox; this asks how to make an autonomous system's behaviour _legible to a non-expert public_, i.e. a science-communication and interface-design problem as much as a logging one.
- **External anchor.** Science-communication channel via Universeum (Gothenburg science centre) and Chalmers — as a legibility/dissemination partner, not a research co-author.
- **DWS testbed.** The DWS IQ transparency / disclosure surface.
- **EU hook.** EU AI Act Article 50.
- **Method.** Design + user-legibility evaluation of a transparency artefact; the softest-empirical, most communication-flavoured of the five (candidate for a side-channel publication rather than a core article).

### 3.4 Q4 — Formal modeling of safety-performance trade-offs

> **How can safety-performance trade-offs in sovereign edge-AI systems be formally modeled and validated under real-time operational constraints?**

- **Novelty.** Names the _cost of safety_ explicitly: stronger safety evidence and Article-12 logging add latency and compute overhead at the edge. This is a formal trade-off modeling problem in resource-constrained CPS — distinct from Q1's broad verification question by its focus on the price of the evidence.
- **External anchor.** Törngren's SAFECOMP work on safety-argument fragments and safety-performance trade-off analysis for connected automated vehicles — the closest existing methodology. _(Confidence: Medium — confirm exact paper titles/years, 2025/2026, in DBLP or the SAFECOMP proceedings before citing to him.)_
- **DWS testbed.** The Aegis edge deployment, where this tension is lived daily and can _empirically validate_ his trade-off frameworks on real industrial workloads.
- **EU hook.** EU AI Act Article 12; safety-critical CPS assurance.
- **Method.** Formal trade-off model + validation against measured latency/compute/evidence-strength on the deployed system. This is also the sharpest concrete overlap point for the KTH/TECoSA collaboration.

### 3.5 Q5 — KYA as an open conformance standard (the spine)

> **How can a Know-Your-Agent (KYA) trust-scoring model be designed and validated as an open conformance standard for agentic AI in EU-regulated industries?**

- **Novelty.** Proposes an _open_ conformance framework — a scored, testable standard for "is this agent trustworthy enough to act here" — mapped to EU AI Act Articles 12/14/72. This is the connective tissue: Q1 verifies it, Q2 applies it to environmental compliance, Q3 exposes it publicly, Q4 prices it.
- **External anchor.** LUT-native — Prof. Smolander's information-systems / design-science register; the highest-scored scenario in the 19.05.2026 prioritization (B = 23/25). Article 1 of the publication plan is already drafted around it.
- **DWS testbed.** The KYA reference implementation in production across the customer base.
- **EU hook.** EU AI Act Articles 12 / 14 / 72; conformance and post-market monitoring.
- **Method.** DSR artefact (the open conformance suite) + multi-vertical validation + standardization-pathway analysis.

### 3.6 Q6 — Governing the voluntary→mandatory compliance transition (the organizational capstone)

> **How can industrial enterprises govern the transition from voluntary ESG reporting to mandatory sovereign-AI compliance infrastructure without disrupting existing management systems?**

- **Novelty.** Shifts the lens from the engineering layer (Q1–Q5) to the **management and organizational layer**: how a regulated industrial firm absorbs a mandated shift — from voluntary ESG reporting to legally required, AI-governed compliance infrastructure — without breaking the management systems, roles, and processes it already runs. Adoption, not architecture.
- **External anchor.** LUT-native and _department_-native. LUT's **Industrial Management** department is known for technology management, innovation ecosystems, and sustainability transitions in industrial contexts; Prof. Smolander works specifically on software-engineering management and digital transformation. Q6 is written to sit squarely in that wheelhouse, where Q1–Q4 lean toward computer science or interdisciplinary supervision.
- **DWS testbed.** The **Outokumpu** and **construction-sector** pilots as empirical cases of Finnish industrial firms implementing a combined regulatory-and-technological shift.
- **EU hook.** The CSRD / CBAM mandatory-reporting transition (and EU AI Act obligations) as the forcing function; the research object is the _organizational response_, not the regulation text.
- **Method.** Qualitative organizational case study — change-management and technology-adoption theory — across the pilot firms, contrasting the voluntary→mandatory transition path and its disruption cost.

**Why it capstones.** Where Q5 is the technical spine that ties Q1–Q4 together and sits in the Design Science methodology, Q6 is the organizational capstone that grounds the whole programme in how Finnish industrial enterprises actually adopt it. Two spines — technical and management — is what makes this a doctoral programme rather than an engineering write-up.

### 3.7 Summary map

| RQ  | Short form                                                      | External anchor                       | Live DWS testbed                         | EU hook                             |
| --- | --------------------------------------------------------------- | ------------------------------------- | ---------------------------------------- | ----------------------------------- |
| Q1  | Verify trustworthiness of edge-AI orchestration                 | KTH / TECoSA (Törngren)               | Aegis (DGX) + KYA + edge control room    | AI Act (high-risk), NIS2            |
| Q2  | Governance for defensible environmental-compliance outputs      | SRC (Galaz)                           | Article-12 pipeline + KYA over CBAM/CSRD | AI Act Art. 12; CBAM/CSRD           |
| Q3  | Transparency for public legibility                              | Universeum / Chalmers (sci-comm)      | DWS IQ transparency surface              | AI Act Art. 50                      |
| Q4  | Safety-performance trade-offs (cost of safety)                  | Törngren SAFECOMP                     | Aegis edge deployment                    | AI Act Art. 12; safety-critical CPS |
| Q5  | KYA open conformance standard (technical spine)                 | LUT-native (DSR)                      | KYA reference implementation             | AI Act Art. 12/14/72                |
| Q6  | Govern voluntary→mandatory compliance transition (org capstone) | LUT Industrial Management (Smolander) | Outokumpu + construction pilots          | CSRD/CBAM transition; AI Act        |

### 3.8 Boundary line — what KYA conformance does not yet cover

A research plan earns more trust by drawing its own boundary than by claiming to solve everything. Stated plainly: KYA conformance, as it stands today, does **not** yet cover the following — and each gap is a research question, not an oversight:

- **Formal soundness proofs.** KYA emits a trust _score_ and an evidence chain; it does not yet carry a machine-checked proof that the score is sound against a formal trustworthiness specification. Closing that is **Q1's** contribution, not a solved property.
- **Cross-vendor / cross-model portability.** The conformance suite is validated on the DWS IQ runtime and its current model set. Whether the standard transfers to other agent runtimes and model families is an open standardization question — **Q5's** pathway analysis, not a demonstrated fact.
- **Quantified cost-of-safety curves.** The latency/compute overhead of stronger evidence is observed operationally but not yet formally modeled or bounded — **Q4's** open problem.
- **Tested legal admissibility.** "Legally defensible" compliance output is a design goal; no KYA-produced evidence chain has yet been tested in an actual regulatory audit or legal proceeding. The defensibility criteria are to be _derived and evaluated_ (**Q2**), not assumed.
- **Public-legibility validation.** The transparency surface has not been evaluated with non-expert users; legibility is asserted by design, not measured (**Q3**).
- **Organizational disruption cost.** How much management-system disruption adoption actually imposes is unmeasured; the pilots are the instrument to find out (**Q6**).

Naming these boundaries is the point: the dissertation's job is to convert these six unsolved edges into six defended contributions.

## 4. Theoretical Framing

The work draws on three converging theoretical bases:

1. **Assurance-case / safety-argumentation theory** (from the dependable-systems and SAFECOMP tradition) supplies the vocabulary for Q1 and Q4: an assurance case is a structured argument that a system is acceptably safe, only as strong as its evidence chain. KYA's trust score is, in this framing, the quantified head of an assurance case whose evidence is hardware-attested agent-decision logging.
2. **Algorithmic accountability and AI governance** supplies Q2 and Q3: the question of what institutional and technical structures make automated decisions contestable, auditable, and legible. The SRC "algorithmic resilience" lens (pending verification) frames environmental-compliance outputs as governance objects with societal consequence.
3. **Information-systems Design Science Research (DSR)** is the meta-methodology binding the technical five: the dissertation constructs and evaluates artefacts (the KYA conformance suite; the verification harness; the trade-off model; the transparency surface) against requirements derived from EU law and industrial practice, and contributes design knowledge — nascent design theory — back to the IS field.
4. **Technology-adoption and organizational-change research** supplies Q6: how regulated industrial firms absorb a mandated socio-technical shift without disrupting the management systems they already run. This is LUT Industrial Management's home ground and the layer the engineering questions ultimately land in.

A distinctive theoretical claim runs through the five technical questions (Q1–Q5): for _agentic_ systems the classical reasoning–behaviour gap makes behaviour, not stated intent, the only admissible evidence. **Hardware-attested logging is therefore the falsifiability locus** — the point at which a trustworthiness claim becomes refutable. This is the highest-originality theoretical thread and the natural spine of a synthesizing monograph chapter. Q6 then asks the complementary question the technical thread cannot: whether an organization can adopt that apparatus without breaking itself.

## 5. Methodology

**Design Science Research (Hevner/March lineage), instantiated on a real artefact.** The unusual and defensible feature of this doctorate is that the primary artefact — DWS IQ with its KYA layer — _exists and operates in production_ before the research begins. The methodological work is therefore (a) to formalize the requirements the artefact implicitly satisfies, (b) to construct the evaluation instruments (verification harness, trade-off model, conformance suite), and (c) to evaluate rigorously and report design knowledge, including where the artefact falls short.

**Evaluation strategy.** Four complementary modes: (1) _formal_ — specification and property-checking for Q1/Q4; (2) _empirical/measurement_ — latency, compute, and evidence-strength measurement on the deployed system for Q4, and legal-defensibility criteria applied to real compliance outputs for Q2; (3) _comparative_ — the 8-dimension sovereignty rubric applied against named public comparators (Dell + Palantir on-prem, Google Antigravity, Palantir Foundry standalone) for the architecture claims; (4) _qualitative organizational_ — change-management and technology-adoption case study across the pilot firms for Q6.

**Case base.** A multi-vertical case base (target: up to ~20 industrial verticals over the thesis horizon), with two named flagships: (i) the carbon balance sheet under CBAM / ETS / CSRD, and (ii) the dual-use / defence vertical under NIS2 and national-security legal regimes. Not all verticals require equal depth; two deep, several shallow.

## 6. Empirical Grounding: Why LUT, and the Nordic Structure

The empirical differentiator LUT brings — which KTH or SRC alone cannot — is **Finnish industrial deployment ground**. Q1, Q2 and Q4 all have candidate testbeds through existing customers and pilot targets, notably **Outokumpu** (stainless steel; directly CBAM / ETS / CSRD-exposed) and the **construction sector**. This gives the doctoral research empirical validation on systems that act with real industrial consequence — the scarce ingredient in trustworthy-AI research.

**Departmental fit.** The programme is matched to the supervisor and department, not just to the topic. LUT's Industrial Management department is known for technology management, innovation ecosystems, and sustainability transitions in industrial contexts, and Prof. Smolander works specifically on software-engineering management and digital transformation. Q6 is written to sit squarely in that wheelhouse (organizational adoption of a regulatory-plus-technological shift by Finnish industrial firms); Q5 sits in the Design Science methodology the department teaches; Q1–Q4 lean toward computer-science or interdisciplinary co-supervision. The two-spine structure lets the supervisor own the management and Design-Science core while the technical questions draw on interdisciplinary and KTH/TECoSA input.

The wider structure strengthens rather than narrows the case. The work is not "a Finnish founder doing local research" but a **Nordic industrial AI platform**: the canonical operating structure is **Lifetime Group = Lifetime Oy (FI) + Lifetime AB (SE) + DWS IQ OÜ (EE)**, with an active KTH / TECoSA research thread (the Broman → Törngren hand-off of July 2026). This is a more ambitious doctoral project than most candidates bring, with cross-border research collaboration and Nordic funding-track adjacency built in.

**Honesty guardrails (stated plainly, because a supervisor will and should test them):**

- **Lifetime AB (SE) incorporation is being finalized in July 2026** — signing is pending completion of eIDAS e-identification (physical e-card login). As of this writing it is not yet legally incorporated; present it as the imminent Swedish arm of the group, not yet an operating R&D entity. (This supersedes an earlier internal "~November 2026" planning date.)
- **The Vinnova / TECoSA funding track is aspirational adjacency**, not confirmed membership or a granted award — it is the collaboration being pursued, framed as such.
- **The KTH relationship is one warm hand-off plus a drafted reply** — in play, not in place.

Even trimmed strictly to fact, the position stands: a candidate arriving with a production platform, paying industrial customers, a Nordic multi-entity structure, and a live KTH/TECoSA thread brings LUT a larger, better-grounded doctoral project than the research questions alone convey.

## 7. Publication Phasing (3–7 Year Horizon)

- **Article 1 (2026, Q3–Q4 target).** _KYA — An Open Conformance Standard for Agentic AI in EU-Regulated Industries_ (Q5). Already drafted; open-licensed conformance suite mapped to EU AI Act Art. 12 / 14 / 72.
- **Article 2 (2027).** _Verifying Trustworthiness of Sovereign Edge-AI Orchestration_ (Q1), with the safety-performance trade-off model (Q4) as its methodological backbone; named comparators and the 8-dimension sovereignty rubric as the evaluation instrument.
- **Article 3 (2027–2028).** _Legally Defensible Environmental-Compliance Outputs from Multi-Agent Systems_ (Q2), on the carbon flagship vertical.
- **Article 4 (2028).** _Transparency for Public Legibility under EU AI Act Article 50_ (Q3), with the Universeum/Chalmers legibility channel — or, if it stays soft, a side-channel publication rather than a core article.
- **Article 5 (2028–2029).** _Governing the Voluntary-to-Mandatory Compliance Transition in Finnish Industry_ (Q6), the organizational case study across the Outokumpu and construction pilots — the management-spine article and the one most native to the department.
- **Synthesizing monograph chapter (2028–2029).** _The Reasoning–Behaviour Gap and Hardware-Attested Falsifiability_ — highest theoretical originality; binds the technical five and frames Q6 as the adoption layer.

## 8. Expected Contribution

1. **A design-science artefact and standard** — the open KYA conformance framework — with demonstrated multi-vertical validity in EU-regulated settings.
2. **A verification-and-trade-off method** for agentic edge systems that treats behaviour (not stated intent) as evidence, and prices the cost of safety formally.
3. **A theoretical contribution** locating falsifiability of trustworthiness claims in hardware-attested logging.
4. **An empirical case base** from real Finnish/Nordic industrial deployments — the scarce evidentiary ground the field lacks.
5. **An organizational-change contribution** — evidence on how regulated industrial firms govern the voluntary→mandatory compliance transition without disrupting existing management systems (Q6), grounding the technical apparatus in adoption reality.

## 9. Scope and Delimitations

In scope: governance, verification, and standardization of agentic edge-AI in EU-regulated industry, evaluated on the DWS IQ artefact. Out of scope: model-training research (the platform consumes models, it does not train foundation models); pure-cloud frontier deployments (the sovereignty thesis is edge/on-prem); and general AI-safety alignment theory except where it bears on the reasoning–behaviour gap. Agentic-commerce, EU eWallet, and transaction primitives from the earlier May six-RQ set (PHD*FIREHORSE §1.2 — a distinct, superseded six, not the six advanced here) are folded into a forward-looking chapter, not standalone articles (premature at thesis horizon; eIDAS 2.0 wallets not yet at industrial scale). The explicit boundary of what the KYA artefact does \_not* yet cover is set out in §3.8; each boundary is a research question rather than a claimed result.

## 10. Ethics and Data Governance

Empirical validation runs in paying-customer industrial environments under Data Processing Agreements. Two questions require the supervisor's and doctoral school's guidance: (a) whether LUT requires an additional ethics submission given that the agent under study acts with real industrial consequence, and (b) the handling of commercially confidential customer data in published case studies (anonymization vs. named, where the data source is a public announcement or a consented customer). No secrets, credentials, or customer PII enter the research artefacts or publications; the evidence chains studied are structural, not content-bearing.

## 11. Indicative Timeline

- **2026:** Article 1 (KYA standard) submitted; requirements formalization for Q1/Q4; ethics envelope agreed with LUT.
- **2027:** Articles 2–3; carbon flagship case study; KTH/TECoSA collaboration matured (or logged as not-progressing).
- **2028:** Article 4; second flagship (dual-use/defence) case; monograph theoretical chapter drafted.
- **2028–2029:** Article 5 (Q6 organizational case study); synthesis, monograph, defence.

## 12. Open Questions for the Supervisor

1. **Venue strategy for Article 1** — IS conference (ECIS/ICIS), security-governance venue (NDSS / IEEE S&P workshop), or DSR venue (DESRIST)? Each frames KYA differently.
2. **Naming live commercial products in comparative tables** — LUT convention on anonymization vs. named comparison where the data source is a public announcement.
3. **Ethics envelope** — additional submission given real-consequence agent behaviour?
4. **Article-led vs monograph-led balance** — current phasing is article-led (four articles → synthesis); would an earlier, heavier monograph serve better?
5. **Co-authorship policy** — the KYA reference implementation is engineered with named collaborators; LUT policy on co-authored articles and expected single-authored proportion.
6. **Which of the six to lead with** — my prior is a two-anchor start, Q5 (technical spine, drafted) and Q6 (organizational capstone, your department's wheelhouse), then Q1/Q4 (KTH-anchored) → Q2 → Q3. I would value your read against LUT's programme strengths, and specifically whether Q6 should lead the whole dissertation given the departmental fit.

## Sources and Verification Notes

- Prior LUT round: `docs/lut/2026-05-19-letter-smolander-unified-scope.md`, `docs/lut/2026-05-19-research-scope-smolander.md`.
- Field notes: `docs/field-notes/2026-07-14-lut-smolander-phd-three-research-options.md`, `docs/field-notes/2026-07-14-kth-broman-torngren-tecosa-trustworthy-systems.md`.
- Standards: `DWS_SOVEREIGNTY_STANDARD.md` (8-dimension rubric), `Legal/KYA_STANDARD_v1.md`.
- **Verify before external citation:** Victor Galaz / SRC exact affiliation, title, and "algorithmic resilience" terminology; Törngren SAFECOMP paper titles and years (2025/2026) via DBLP; EU AI Act Art. 12 / 14 / 50 / 72 text against the consolidated Regulation.
- **Do not overstate:** Lifetime AB (SE) incorporation is being finalized July 2026 (signing pending eIDAS e-card e-identification), not yet legally incorporated as of writing; Vinnova/TECoSA is aspirational adjacency; KTH relationship is in-play, not a signed collaboration. What KYA does _not_ yet cover is stated explicitly in §3.8 — keep that boundary intact rather than smoothing it over.
