# Törngren / TECoSA — 30-Minute Discussion Memo

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code | Session: claude/kth-trustworthy-systems-umlez8 | Date: 14.07.2026 | Changes: Initial ~10-page discussion memo for the Törngren/TECoSA intro call. Per-paper outcomes with links (T-ITS 2025 review, SAFECOMP 2025 argument fragment, SAE 2025 trade-off methodology, INCOSE 2022 position paper, ACM SEC 2021 industrial-edge CPS, IEEE TSE 2022 critical scenarios, AD-EYE, TECoSA phases), DWS solution grounded in DWS_ARTICLE_12_LOGGING_STANDARD.md v1.0 and Legal/KYA_STANDARD_v1.md v1.8, full crosswalk, Q&A cheat sheet in Risto's voice, glossary, red lines, reference list.

Document Status:

- Created: 14.07.2026
- Last Modified: 14.07.2026
- Language: English
- Languages Available: EN
- Publication Status: INTERNAL
- Classification: CONFIDENTIAL — Partner Strategy
- Document Type: GTM Asset / Discussion Memo

Related Documents:

- docs/field-notes/2026-07-14-kth-broman-torngren-tecosa-trustworthy-systems.md (source field note + v4 approved email)
- docs/gtm/TECOSA_TORNGREN_CALL_PREP.md (earlier short brief — superseded by this memo for call prep; still the one-pager skeleton)
- People/partners/academic/martin-torngren.md (person note)
- DWS_ARTICLE_12_LOGGING_STANDARD.md v1.0 (canonical DWS evidence pipeline)
- Legal/KYA_STANDARD_v1.md v1.8 (ATS formula, MicroVM isolation, leash snap)
- DWS_SECURITY_STANDARD.md (Layer 5 audit & compliance)

---

**Sourcing honesty (Rule 12).** Everything in Part I is grounded in open sources: paper abstracts, publisher records, arXiv preprints, KTH/TECoSA/AD-EYE public pages, and his own KTH profile text. Paywalled fulltexts (INCOSE INSIGHT, IEEE T-ITS, Springer SAFECOMP) were not readable from this environment; where a claim rests on an abstract rather than a fulltext, the memo says so. Everything in Part II is verified against the DWS standards in this repository (file and section cited). Nothing here requires you to pretend deeper reading than stated.

---

## 0. Executive Summary — the one paragraph to hold in your head

Martin Törngren has spent a decade establishing one idea across automated driving and industrial edge computing: **you cannot fully verify an autonomous system before deployment, so trustworthiness must be argued from evidence — and part of that evidence must be produced at run-time, by the system itself, while constraints keep it inside a quantified safety envelope.** DWS IQ is a production implementation of exactly that idea for agentic AI: the Article 12 Logging Pipeline produces the tamper-evident run-time evidence, the KYA Agent Trust Score is the quantified envelope, and the MicroVM sandbox plus leash-snap are the constraints that clamp the agent when the numbers break. You are not stretching to meet him — you are showing him his own architecture pattern, running in industry, on agents instead of vehicles. The gap you honestly own (no formal verification of the trust model, log admissibility untested) is precisely what a university collaboration is for.

**Your 90-second opener on the call:** who you are (founder-operator, not researcher) → what runs in production (agents at the industrial edge; every decision becomes a hash-chained, verifiable log event; a numeric trust score gates what each agent may do; hardware isolation and automatic revocation enforce it) → the one sentence: _"Regulatory alignment falls out of the evidence chain rather than driving it"_ → the ask: _"You've spent years on what counts as safety evidence for autonomous systems. I want your read: does this evidence chain connect to TECoSA's trustworthiness-assurance work, and if so, in what shape?"_ Then let him talk.

---

# PART I — His Main Relevant Outcomes (paper by paper)

## 1.1 The safety-evidence review — his central recent outcome

**M. Gyllenhammar, G. R. de Campos, M. Törngren, "The Road to Safe Automated Driving Systems: A Review of Methods Providing Safety Evidence," IEEE Transactions on Intelligent Transportation Systems, vol. 26, no. 4, pp. 4315–4345, 2025.**
Links: [IEEE Xplore](https://ieeexplore.ieee.org/document/10858599/) · [KTH DiVA record](https://kth.diva-portal.org/smash/record.jsf?pid=diva2:1936879) · [open earlier preprint on TechRxiv: "Holistic Perspectives on Safety of Automated Driving Systems — Methods for Provision of Evidence"](https://www.techrxiv.org/doi/full/10.36227/techrxiv.20331243.v1)

**Main outcome.** A 30-page systematic review whose starting premise is that _classical design, development, verification and validation methods for safety-critical systems do not suffice_ for automated driving systems, because of ADS complexity and operational uncertainty. The review organizes all known methods of producing safety evidence into **four categories**:

1. **Design techniques** — evidence from how the system is specified, analysed, designed and implemented;
2. **Verification & validation (V&V)** — evidence from testing, simulation, formal analysis before deployment;
3. **Run-time risk assessment** — evidence produced _during operation_ by monitoring and assessing risk live;
4. **Run-time (self-)adaptation** — the system changing its own behavior during operation to stay safe.

For each category it identifies challenges and gaps in how the evidence can actually be used in a safety argument.

**Why this is the paper that matters most for you.** Categories 3 and 4 are the intellectual heart: the field's admission that **evidence provision continues after deployment**. Your entire product story lives in categories 3 and 4. When he talks about "methods providing safety evidence," you can point at a production system that _is_ one.

**What it means for the call.** You never need to recite the review. You need one sentence: _"My understanding is you organize evidence provision into design-time and run-time methods — everything we build is on the run-time side, and I'd like your view on whether our evidence chain would hold up in a safety argument."_ That sentence is accurate, humble, and hands him the floor.

## 1.2 The safety argument fragment — how he structures the argument itself

**M. Gyllenhammar, G. R. de Campos, M. Törngren, "A Safety Argument Fragment Towards Safe Deployment of Performant Automated Driving Systems," in Computer Safety, Reliability, and Security — SAFECOMP 2025 Workshops, Proceedings (2026), pp. 197–210.**
Link: [Springer chapter](https://link.springer.com/chapter/10.1007/978-3-032-02018-5_15)

**Main outcome** (from the published abstract). A reusable fragment of a safety argument built from three moves:

1. **Vehicle-level, quantitative safety requirements** — instead of trying to enumerate every scenario exhaustively, set measurable top-level safety targets;
2. **Situation awareness that dynamically adapts the ADS's decision-making** — the system perceives its operating conditions and adjusts behavior;
3. **Precautionary Safety (PcS) constraints** — the situation awareness is _extended with constraints_ so the quantitative requirements stay fulfilled even under uncertainty.

**Why it matters.** This is his answer to the safety–performance dilemma: don't prove the system perfect (impossible), don't cripple it with worst-case caution (unusable) — **bound it quantitatively, sense continuously, and clamp dynamically.** The argument fragment is the template that turns those three mechanisms into certifiable reasoning.

**What it means for you.** The DWS trust architecture is the same three moves, one-for-one, applied to agents (see the crosswalk in Part III, row 3). This is the deepest single mapping in the memo — if only one technical exchange happens on the call, it should be this one.

## 1.3 Safety–performance trade-off methodology — his design-space tool

**G. Fornaro, M. Törngren, J. M. Gaspar Sánchez, "Toward a Methodology for Safety–Performance Trade-Off Analysis for Connected Automated Vehicles Supported by a Smart Infrastructure," SAE International Journal of Connected and Automated Vehicles 8(2):275–295, 2025.**
Link: [SAE Mobilus](https://saemobilus.sae.org/articles/toward-a-methodology-safety-performance-trade-off-analysis-for-connected-automated-vehicles-supported-a-smart-infrastructure-12-08-02-0020)

**Main outcome** (from the published abstract). Connectivity and infrastructure support (off-board perception, communication networks) can fix safety problems single vehicles can't solve alone (occlusion, rule-violating road users) — but they add **new failure modes and design trade-offs**. The paper contributes a **methodology: models + analysis methods + a software tool for design-space exploration** of how design parameters influence safety properties and performance trade-offs in such collaborative systems.

**Why it matters.** Two of his signatures in one paper: (a) safety and performance as an explicit, analyzable trade-off (his profile literally lists "trade-offs" as a research interest), and (b) the system-of-systems view — vehicle + smart infrastructure, not the vehicle alone.

**What it means for you.** Your edge Control Room is his "smart infrastructure": agents at the edge in interplay with sensors, devices, and the operational picture. And your autonomy-tier model (more autonomy granted as trust score rises) is a safety–performance trade-off made explicit and continuously priced. Say it in his terms: _"We treat autonomy as the performance variable and trust score as the safety budget it's purchased with."_

## 1.4 Vehicle-level validation via Extreme Value Analysis — quantifying "safe enough"

**"Vehicle-Level Safety Validation of AD/ADAS Systems via Extreme Value Analysis," in Computer Safety, Reliability, and Security — SAFECOMP 2025 Workshops, Proceedings (2026), pp. 437–452.** (Cited on his KTH profile among 2025/2026 highlights.)
Link: [via his publication list](https://www.kth.se/profile/martint/publications/)

**Main outcome** (title + profile listing; fulltext not read). Using Extreme Value Analysis — the statistics of rare events — to make vehicle-level safety validation claims, i.e. quantify how safe the system is from finite operational data even though the dangerous events are rare.

**Why it matters.** It confirms the pattern: he wants **statistical, quantitative validation from operational data**, not just checklists. If he probes your metrics, the honest bridge is: _"Our trust scores are computed from operational events — violations, denials, latency; what we haven't done is the kind of rare-event statistical validation you do. That's a place your methods could directly improve our engineering."_ (Only claim familiarity with the title and idea — say so plainly if asked.)

## 1.5 The INCOSE position paper — his industrial-edge agenda (the one your v3 email over-claimed; now background)

**M. Törngren et al., "Trends, Drivers, and Strategic Directions for Trustworthy Edge Computing in Industrial Applications," INCOSE INSIGHT, December 2022 issue (Archimedes Initiative).**
Link: [ResearchGate record](https://www.researchgate.net/publication/368403901_TECoSA_-_Trends_Drivers_and_Strategic_Directions_for_Trustworthy_Edge_Computing_in_Industrial_Applications)

**Main outcome** (from the record and summaries; fulltext paywalled). An assessment of edge-computing trends and drivers for industrial use: predicts operator-provided (MEC) edge computing dominating the paradigm's first decade; highlights advanced use cases — AR/VR/cognitive assistance, cyber-physical systems, distributed machine learning; and sets **strategic directions emphasizing testbeds and collaborative multidisciplinary research**. The paper's insights _formed the basis for TECoSA's research agenda_.

**Why it matters.** It's the strategic charter of the center Broman routed you to, and its two strategic directions — testbeds, industry-academia collaboration — are exactly the collaboration shape you're proposing.

**What it means for the call.** The v4 email deliberately makes no claim about this paper. If he brings it up: _"I know it as the paper that set TECoSA's agenda — testbeds and multidisciplinary collaboration — which is precisely why I'm here."_ True, sufficient, no overreach.

## 1.6 Industrial edge CPS — needs and concerns (the closest paper to your actual market)

**M. Törngren et al., "Industrial Edge-based Cyber-Physical Systems — Application Needs and Concerns for Realization," Proc. ACM/IEEE Symposium on Edge Computing (SEC), Workshop on Trustworthy Edge Computing, December 2021.**
Links: [arXiv preprint 2201.00242](https://arxiv.org/abs/2201.00242) · [IEEE Xplore](https://ieeexplore.ieee.org/document/9709084)

**Main outcome** (from the abstract). Examines drivers and requirements for edge computing in **critical industrial applications** across four domains: **manufacturing, transportation, energy, and networked defense applications**. Identifies challenges and open issues that must be solved before edge computing can carry critical industrial CPS, and proposes directions.

**Why it matters — a lot.** His domain list is nearly your customer list (industrial operators; and note _defense_ is in his scope too, which rhymes with your Aegis tier). This paper shows he already thinks about YOUR deployment environment, not just cars.

**What it means for the call.** If the conversation drifts abstract, pull it back here: _"Your 2021 workshop paper looked at manufacturing, transport, energy and defense needs for critical edge computing — those four are close to our deployment map. The concern you raised there, as I understand it, is whether the edge can be trusted with critical function. Our answer is: only if every decision leaves evidence."_

## 1.7 Critical scenarios mapping study — his V&V-side landmark

**X. Zhang, M. Törngren et al., "Finding Critical Scenarios for Automated Driving Systems: A Systematic Mapping Study," IEEE Transactions on Software Engineering, 2022.**
Link: [arXiv 2110.08664](https://arxiv.org/abs/2110.08664)

**Main outcome** (from the abstract/record). A systematic mapping of the literature on how to _find the scenarios that break an ADS_ — the critical/edge cases — since scenario-based testing is the dominant V&V approach and its weakness is knowing which scenarios matter. Categorizes identification methods and exposes gaps.

**Why it matters.** It's his design-time/V&V complement (category 2 of the review): before deployment, hunt the critical cases. For agents, the analogous discipline is adversarial evaluation / red-teaming of agent behavior — worth one sentence if he asks what your design-time evidence looks like.

## 1.8 AD-EYE — the testbed that proves his method of working

**AD-EYE: automated-driving co-simulation testbed at KTH Mechatronics, emphasizing safety and architectures.**
Links: [adeye.se](https://www.adeye.se/) · [AD-EYE_Core on GitHub](https://github.com/AD-EYE/AD-EYE_Core) · [WASP testbed page](https://wasp-sweden.org/testbed-automated-driving/) · founding paper: ["AD-EYE: A Co-simulation Platform for Early Verification of Functional Safety Concepts" (2019)](https://www.researchgate.net/publication/337703662_AD-EYE_A_Co-simulation_Platform_for_Early_Verification_of_Functional_Safety_Concepts)

**Main outcome.** A **co-simulation platform for early verification of functional safety concepts** in automated driving, deliberately built with modular, standardized, open interfaces and open-source base functionality, whose stated goal is to help research cross from low TRL (lab idea) to mid/high TRL (deployable) — the hardest transition in safety-critical fields.

**Why it matters.** AD-EYE is his answer to "how do university and industry actually work together": a shared technical artifact where safety concepts get verified early and cheaply. Naveen Mohan (his PhD student) runs it; a postdoc (Gustav Steen) is dedicated to it.

**What it means for you.** The collaboration you propose has a proven local precedent: _"What AD-EYE is for automated driving, a DWS production deployment could be for trustworthy agentic edge systems — the testbed where evidence-chain and trust-scoring concepts get verified against real industrial workloads."_

## 1.9 TECoSA — the center itself (know its shape before proposing to plug into it)

**TECoSA — Trustworthy Edge Computing Systems and Applications. Vinnova national competence center, hosted by KTH (ITM school, close collaboration with EECS), launched March 2020, ~19 industrial partners. Törngren is director.**
Links: [tecosa.center.kth.se](https://www.tecosa.center.kth.se/) · [Vinnova project page](https://www.vinnova.se/en/p/trustworthy-edge-computing-systems-and-applications-tecosa/) · [launch story](https://www.kth.se/en/itm/nyheter/nytt-centrum-for-edge-computing-tecosa-1.969407) · [KTH trustworthy-CPS group page](https://www.kth.se/mmk/mechatronics/key-research-areas/trustworthy-cyber-physical-systems-1.1236641)

**Main outcomes / shape:**

- **Aim:** methods, tools and theory for building **safe, secure and predictable** systems relying on edge computing (the layer between embedded devices and the cloud).
- **Phase 1 themes:** Predictability, Safety, Security.
- **2023 onward (phase 2):** transitioned to **application-oriented projects**, tighter integration of research, industrial use cases, and **testbeds**; received a highly positive half-time evaluation (2024). Names **"Trustworthiness Assurance"** — the certification of CPS acting in interplay with smart digital infrastructure — among its key challenges.
- Partners join over time (e.g., edge-orchestration company [Avassa joined as partner](https://avassa.io/press-releases/avassa-joins-trustworthy-edge-computing-systems-and-applications-tecosa/)) — so **there is a live mechanism for companies to enter**.

**What it means for the call.** Phase 2 = application projects + testbeds + trustworthiness assurance. Your proposal (production deployment as application case / testbed for agentic evidence chains) is not an exotic ask — it is the phase-2 format. The practical question to ask him: _"What does becoming a TECoSA partner or hosting an application case actually involve?"_

---

# PART II — Our Solution (what you can defend line by line)

Everything below is stated in the DWS standards in this repo; file and section cited so you can re-verify any line before the call.

## 2.1 The Article 12 Logging Pipeline — the evidence chain

Source: `DWS_ARTICLE_12_LOGGING_STANDARD.md` v1.0.

- **What it is:** the canonical record-keeping stack for every DWS IQ agent, workflow and product in EU AI Act scope. It is an **open architecture** (part of the KYA open-standard family); DWS's branded implementation is **Themis — the Aegis Control Plane** ("KYA = the protocol; Themis = DWS's implementation; Aegis = the product customers buy," §2).
- **Every logged event carries** (§3, mandatory schema): cryptographic agent session ID; the **KYC-verified human operator** behind the session; a capability-manifest hash; event type (`agent.decide`, `tool.invoke`, `memory.store/supersede/forget`, `human.override`, `incident`); OpenTelemetry trace/span binding; model version; input/output digests; reasoning steps (redacted per PII policy); confidence; and — the tamper-evidence core — **a hash chain**: each event's hash is computed over the previous event's hash plus the canonical event JSON. Redactions are themselves logged as immutable events.
- **Retention** (§4): risk-relevant events ≥ 6 months (Art. 26(6)); identity events (trust-score changes, leash snaps) and memory-mutation audits 5 years; serious-incident reports 10 years.
- **Regulatory anchors** (§1): Article 12(1)(a-c) — logging sufficient to detect risk situations, support post-market monitoring (Art. 72), and deployer monitoring (Art. 26(5)); Art. 14(5) — the human overseer's identity is captured in the log.

**The sentence this cashes out:** _"Every decision an agentic system takes at the edge becomes structured, verifiable evidence"_ — verifiable = hash-chained + operator-attributed + trace-bound.

## 2.2 KYA — the quantified trust envelope

Source: `Legal/KYA_STANDARD_v1.md` v1.8.

- **Agent Trust Score (ATS)** (§3.1), computed by a real engine (`src/identity/ats-engine.ts`):
  `ATS = max(0, 1.0 − V×0.25 − L − D×0.05 + A×0.15)` where V = KYA violation count (4 violations → zero trust), L = latency penalty, D = denied path-access attempts, A = a capped, validated improvement factor.
- **Trust bands gate permission** (§3.2): ATS ≥ 0.80 → full sandbox; 0.50–0.79 → restricted; < 0.50 → **suspended, human review required**; 0 → frozen/terminated.
- **Enforcement is physical, not advisory** (§4): every agent runs in its own **Firecracker MicroVM** — dedicated guest kernel, no shared kernel with host or neighbors, <125 ms boot, <5 MB overhead — and **egress is controlled at the hypervisor**: zero outbound network unless the KYA profile whitelists an endpoint for that session.
- **Leash snap:** on serious violation the trust score is cut (−40 points per the violation table, §5) and a compromised agent chain can be snapped immediately (TC-4, `skills/kya`). Low confidence (<70%) forces mandatory human review (`DWS_SECURITY_STANDARD.md` §432-436 decision table).
- **Even high trust has hard ceilings:** on the Aegis (defense/dual-use) tier, human-signed authorization is required for certain actions _regardless of ATS_ (§14) — trust never fully replaces the human gate.

## 2.3 The deployment surface — agents in interplay with infrastructure

Sources: `skills/edge-control-room-capital/SKILL.md`, `DWS_SECURITY_STANDARD.md`.

Agents run at the industrial edge — Control Room / Situation Room over fleets of edge AI devices, sensors, and robots — i.e., autonomous decision-making **in interplay with smart infrastructure**, which is verbatim TECoSA's "Trustworthiness Assurance" object of study. EU-sovereign posture throughout (no US-jurisdiction control plane on the sovereign tiers).

## 2.4 The honest gaps — say these before he finds them

1. **No formal verification.** The ATS is an engineered scoring mechanism with an executable engine — it is not formally verified, and its thresholds are engineering judgments, not statistically validated safety targets. _(This is the collaboration ask, not a confession.)_
2. **Admissibility untested.** Hash-chained logs exceed the Article 12 minimum, but no EU court has yet tested such logs as evidence; a formal legal opinion is open work (`DWS_ARTICLE_12_LOGGING_STANDARD.md` §7.2).
3. **No safety case in the formal sense.** DWS has an evidence chain and enforcement; it does not yet have a structured assurance-case argument (GSN or similar) connecting evidence to claims. That is literally his specialty.
4. **Agentic ≠ ADS.** LLM-based agents are stochastic and their "ODD" (operating domain) is far harder to bound than a vehicle's. Whether his four evidence categories transfer cleanly is an open — and genuinely interesting — research question.

---

# PART III — The Crosswalk (his outcome → our solution → your line)

| #   | His outcome                                                                                                                            | Our solution                                                                                                                                               | Your line on the call                                                                                                                                          |
| --- | -------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Classical design-time assurance doesn't suffice for autonomous systems (T-ITS 2025 premise)                                            | The product assumes it: evidence generation is continuous, in production, by design                                                                        | "We started from the same premise you did — you can't fully verify an agent up front, so the system has to earn trust in operation."                           |
| 2   | **Category 3: run-time risk assessment** (T-ITS 2025)                                                                                  | **KYA ATS**: a numeric risk/trust assessment recomputed from live operational events (violations, denials, latency)                                        | "Your category three is what our trust engine does — with the agent, not the vehicle, as the assessed unit."                                                   |
| 3   | **Category 4: run-time (self-)adaptation** (T-ITS 2025)                                                                                | **Trust-band gating + leash snap**: permissions shrink as score drops; suspension below 0.50; chain-kill on compromise                                     | "Category four is our leash: the system adapts by revoking autonomy automatically when the score breaks the band."                                             |
| 4   | **Quantitative safety requirements** instead of exhaustive scenario enumeration (SAFECOMP fragment, move 1)                            | Numeric trust thresholds per permission band (0.80 / 0.50 / 0) — quantified, monitored, enforced                                                           | "We don't enumerate everything an agent might do wrong — we set quantified trust requirements and gate on them."                                               |
| 5   | **Situation awareness adapting decision-making** (SAFECOMP fragment, move 2)                                                           | Control-Room operational picture + per-session KYA profile: the agent's permissions reflect current context                                                | "The agent's envelope isn't static — it's set per session from operational context."                                                                           |
| 6   | **Precautionary Safety constraints clamp behavior so quantified requirements hold** (SAFECOMP fragment, move 3)                        | **Architectural clamps**: MicroVM isolation, hypervisor egress deny-by-default, human-signed gates that hold _regardless of trust score_ on the Aegis tier | "Our precautionary constraint is physical: below the threshold the agent cannot act — and some actions always need a human signature, however high the score." |
| 7   | Safety–performance as explicit, tool-supported trade-off analysis (SAE 2025)                                                           | Autonomy tiers: performance (autonomy, spend authority) is granted against measured trust; the trade-off is priced, continuously                           | "Autonomy is our performance variable; trust score is the safety budget it's purchased with."                                                                  |
| 8   | Quantitative validation from rare operational events (EVA paper)                                                                       | Gap — our thresholds are engineering judgment, not statistically validated                                                                                 | "This is where your methods would directly improve us — validating trust thresholds the way you validate vehicle-level safety."                                |
| 9   | Trustworthiness Assurance = certification of CPS in interplay with smart infrastructure (TECoSA phase 2)                               | The Article 12 pipeline is the certification-facing artifact: hash-chained, operator-attributed, retention-managed evidence                                | "The evidence chain is the product; regulatory alignment falls out of it rather than driving it."                                                              |
| 10  | Critical-scenario finding as the key V&V gap (IEEE TSE 2022)                                                                           | Analogue: adversarial evaluation / red-teaming of agent behavior pre-deployment (design-time side)                                                         | "On the design-time side, our analogue to critical-scenario hunting is adversarial evaluation of agent behavior."                                              |
| 11  | Testbeds + industry-academia collaboration as the strategic direction (INCOSE 2022; AD-EYE; industrial PhDs at Scania/Alstom/Ericsson) | The offer: DWS provides the production deployment ground; KTH provides the argumentation/verification framework                                            | "What AD-EYE is for automated driving, a DWS deployment could be for trustworthy agentic edge systems."                                                        |

---

# PART IV — Q&A Cheat Sheet (his likely questions, your answers)

**Q1. "What exactly is your evidence? What's in a log event?"**
A: Every event carries the agent's cryptographic session identity, the KYC-verified human operator behind it, the event type — decision, tool call, memory mutation, human override, incident — input and output digests, model version, confidence, and a distributed-tracing binding. Tamper evidence comes from a hash chain: each event's hash covers the previous event's hash plus the event content. Redactions are themselves logged. Retention runs from six months for routine events to ten years for serious incidents.

**Q2. "How is the trust score computed? Is it validated?"**
A: It's a transparent formula, not a black box — violations, denied access attempts and latency reduce it; capped, validated improvements raise it; four violations zero it. It gates permission bands with hard thresholds. Validated in the statistical sense? Honestly, no — the thresholds are engineering judgments. That's one of the two places I'd most value your methods.

**Q3. "What happens when the score drops mid-operation?"**
A: Permissions shrink band by band; below 0.50 the agent is suspended pending human review; on compromise the chain is snapped immediately. And enforcement isn't advisory — each agent runs in its own microVM with its own guest kernel, and outbound network is deny-by-default at the hypervisor, whitelisted per session.

**Q4. "Do you have a safety case — a structured argument, GSN or similar?"**
A: No — and that's the point of this conversation. We have the evidence chain and the enforcement, but not the structured argument connecting evidence to claims. Building that argument over a production agentic system is exactly the collaboration I'd propose.

**Q5. "Aren't LLM agents fundamentally different from the CPS I study? Stochastic, unboundable?"**
A: Different, yes — and that's the research question. A vehicle has a physical ODD; an agent's operating domain is harder to bound. What we can bound is _authority_: what the agent may touch, spend, and emit, enforced physically. Whether your four evidence categories transfer to systems where the component is stochastic — I'd genuinely like your view.

**Q6. "Is this just EU AI Act compliance with new words?"**
A: The regulation names the obligation; it doesn't design the mechanism. We built the evidence chain as an engineering artifact — the compliance falls out of it rather than driving it. Same relationship your safety cases have to type approval.

**Q7. "What would you actually want from TECoSA?"**
A: Three possible shapes, smallest first: (1) a problem discussion / seminar — I show the production system, your group critiques the evidence chain against your frameworks; (2) an MSc thesis or student project on mapping the trust architecture to a safety-argument fragment; (3) if the fit is real, an application case or partner role in phase 2 — we bring the industrial deployment ground, you bring the verification framework, like your Scania and Alstom setups. Your call which, if any, fits.

**Q8. "Who are your deployments / customers?"** _(Prepare your own current, truthful answer — the memo deliberately does not script customer claims. Name only what is public and current; the trust posture here must be impeccable.)_

**Q9. "What's your team's safety-engineering background?"**
A: Honest answer: we're systems and software engineers with a security and compliance posture, not safety-argumentation people. That's why I answered David's routing — the safety-engineering depth is what KTH has and we don't.

**Q10. "Why should an academic center care about a vendor's pipeline?"**
A: Because production evidence from agentic systems in real industrial deployments is data your field doesn't have much of yet. Vehicles have fleets and simulators; agentic industrial AI mostly has demos. We can offer the real thing as a study object.

## Your questions to him (pick 2–3; all answerable by you if reflected back)

1. "In your review's terms — where is evidence provision for agentic systems weakest today, run-time risk assessment or run-time adaptation?"
2. "Could a safety-argument fragment like your SAFECOMP one be templated for an AI agent? What would you accept as the analogue of a vehicle-level quantitative requirement?"
3. "What does a phase-2 application case or partnership practically involve — and is an industrial agentic-AI evidence chain in scope for trustworthiness assurance?"
4. "Four years after the INCOSE paper called for testbeds — what should the industrial agentic-AI equivalent of AD-EYE look like?"

---

# PART V — Glossary (his vocabulary, one line each)

| Term                                 | Meaning                                                                                            | Your anchor                                                                                         |
| ------------------------------------ | -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| **Safety case / assurance case**     | A structured argument, supported by evidence, that a system is acceptably safe in a given context  | Our evidence chain is the _evidence_ half; the _argument_ half is the collaboration                 |
| **GSN** (Goal Structuring Notation)  | The standard graphical notation for writing safety arguments                                       | If he says GSN, he means "the diagram of the argument"                                              |
| **Safety evidence**                  | Any artifact (analysis, test result, operational log) supporting a safety-case claim               | Article 12 events are run-time safety evidence                                                      |
| **V&V**                              | Verification (built right?) & validation (right thing?) before deployment                          | Design-time; our red-teaming analogue                                                               |
| **Run-time monitoring / adaptation** | Assessing and adjusting system behavior during operation                                           | KYA scoring / leash mechanism                                                                       |
| **ODD** (Operational Design Domain)  | The bounded conditions under which an ADS is designed to work                                      | Agent analogue: the KYA capability manifest — bounded _authority_ rather than bounded _environment_ |
| **PcS (Precautionary Safety)**       | Constraints that keep quantitative safety requirements satisfied under uncertainty                 | Our hypervisor gates + human-signature ceilings                                                     |
| **Quantitative safety requirement**  | A measurable top-level safety target (e.g., rate-based), not a scenario list                       | Our numeric trust thresholds (0.80/0.50/0)                                                          |
| **SOTIF (ISO 21448)**                | Safety of the intended functionality — hazards without component failure (e.g., perception limits) | Closest frame for LLM hallucination-type hazards                                                    |
| **ISO 26262**                        | The automotive functional-safety standard (failure-caused hazards)                                 | Only recognize it; don't claim compliance                                                           |
| **TRL**                              | Technology readiness level (1 lab … 9 proven in operation)                                         | AD-EYE exists to cross the TRL "valley of death"; your deployments are high-TRL ground              |
| **Assurance/certification**          | Convincing a third party, on evidence + argument, to accept the system                             | TECoSA phase-2 "Trustworthiness Assurance" theme                                                    |

---

# PART VI — Red Lines (do not cross on the call)

1. **Never claim to have read what you haven't.** Everything you cite is at abstract level; the phrase "as I understand it" is your friend. He will respect calibration and punish bluffing — calibration IS the trust signal for a safety researcher.
2. **Do not pitch compliance.** Regulation appears only as the _outcome_ of the evidence chain (the Boardy-flagged sentence, verbatim).
3. **Do not oversell KYA** as verified, validated, or standardized. It is engineered and running; its formal grounding is the collaboration opportunity.
4. **Do not promise data, testbed access, or partnership terms.** Shapes may be discussed; commitments need `/sovereignty-assess` on exposure and a separate decision.
5. **Do not name customers beyond what is public.**
6. **Do not fill silences with product talk.** After your opener, his thinking-out-loud is the best outcome available — a TECoSA director mapping YOUR system into HIS framework, live.

---

# PART VII — Full Reference List

**Törngren & group:**

1. Gyllenhammar, de Campos, Törngren (2025). _The Road to Safe Automated Driving Systems: A Review of Methods Providing Safety Evidence._ IEEE T-ITS 26(4):4315–4345. — [IEEE](https://ieeexplore.ieee.org/document/10858599/) · [DiVA](https://kth.diva-portal.org/smash/record.jsf?pid=diva2:1936879) · [open preprint](https://www.techrxiv.org/doi/full/10.36227/techrxiv.20331243.v1)
2. Gyllenhammar, de Campos, Törngren (2026). _A Safety Argument Fragment Towards Safe Deployment of Performant Automated Driving Systems._ SAFECOMP 2025 Workshops, pp. 197–210. — [Springer](https://link.springer.com/chapter/10.1007/978-3-032-02018-5_15)
3. Fornaro, Törngren, Gaspar Sánchez (2025). _Toward a Methodology for Safety–Performance Trade-Off Analysis for CAVs Supported by a Smart Infrastructure._ SAE Int. J. CAV 8(2):275–295. — [SAE](https://saemobilus.sae.org/articles/toward-a-methodology-safety-performance-trade-off-analysis-for-connected-automated-vehicles-supported-a-smart-infrastructure-12-08-02-0020)
4. _Vehicle-Level Safety Validation of AD/ADAS Systems via Extreme Value Analysis._ SAFECOMP 2025 Workshops, pp. 437–452. — [via his publication list](https://www.kth.se/profile/martint/publications/)
5. Törngren et al. (2022). _Trends, Drivers, and Strategic Directions for Trustworthy Edge Computing in Industrial Applications._ INCOSE INSIGHT, Dec 2022. — [ResearchGate](https://www.researchgate.net/publication/368403901_TECoSA_-_Trends_Drivers_and_Strategic_Directions_for_Trustworthy_Edge_Computing_in_Industrial_Applications)
6. Törngren et al. (2021). _Industrial Edge-based Cyber-Physical Systems — Application Needs and Concerns for Realization._ ACM/IEEE SEC Workshop on Trustworthy Edge Computing. — [arXiv 2201.00242](https://arxiv.org/abs/2201.00242) · [IEEE](https://ieeexplore.ieee.org/document/9709084)
7. Zhang, Törngren et al. (2022). _Finding Critical Scenarios for Automated Driving Systems: A Systematic Mapping Study._ IEEE TSE. — [arXiv 2110.08664](https://arxiv.org/abs/2110.08664)
8. AD-EYE testbed — [adeye.se](https://www.adeye.se/) · [GitHub](https://github.com/AD-EYE/AD-EYE_Core) · [WASP](https://wasp-sweden.org/testbed-automated-driving/) · [2019 platform paper](https://www.researchgate.net/publication/337703662_AD-EYE_A_Co-simulation_Platform_for_Early_Verification_of_Functional_Safety_Concepts)
9. TECoSA — [center site](https://www.tecosa.center.kth.se/) · [Vinnova](https://www.vinnova.se/en/p/trustworthy-edge-computing-systems-and-applications-tecosa/) · [launch](https://www.kth.se/en/itm/nyheter/nytt-centrum-for-edge-computing-tecosa-1.969407) · [Avassa partner example](https://avassa.io/press-releases/avassa-joins-trustworthy-edge-computing-systems-and-applications-tecosa/)
10. Törngren KTH profile (principles, courses, group, bio) — [kth.se/profile/martint](https://www.kth.se/profile/martint/) · [publication list](https://www.kth.se/profile/martint/publications/)

**DWS internal (verify any Part II claim here):** 11. `DWS_ARTICLE_12_LOGGING_STANDARD.md` v1.0 — pipeline architecture (§2), mandatory schema & hash chain (§3), retention (§4), open gaps (§7) 12. `Legal/KYA_STANDARD_v1.md` v1.8 — ATS formula (§3.1), trust bands (§3.2), MicroVM isolation & egress control (§4), violation penalties (§5), Aegis human-signature ceilings (§14) 13. `DWS_SECURITY_STANDARD.md` — Layer 5 audit & compliance (§345 ff.), confidence-threshold review gate (§436) 14. `docs/gtm/TECOSA_TORNGREN_CALL_PREP.md` — earlier short brief; §2 remains the one-pager skeleton 15. `docs/field-notes/2026-07-14-kth-broman-torngren-tecosa-trustworthy-systems.md` — full outreach record, v1–v4 email drafts
