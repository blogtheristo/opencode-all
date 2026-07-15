# DWS IQ × TECoSA — A Fit-Assessment Overview for Martin Törngren (KTH)

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code | Session: claude/lut-phd-research-options-p7jskn | Date: 14.07.2026 | Changes: Initial ~10-page memo written FOR Martin Törngren (KTH/TECoSA) — the "10-page overview" promised in the send-ready reply email (`docs/gtm/2026-07-14-email-torngren-send-ready.md`). Distinct from the LUT doctoral research plan: this is a research-collaboration fit assessment in a technical-peer register, centred on the safety-performance trade-off overlap (his SAFECOMP work) with the DGX-based Aegis deployment offered as a live testbed. Honest division-of-labour and an explicit "what we do not claim / do not yet cover" boundary. System facts flagged where they need verification; sending remains RED-zone (the memo travels with the human-sent email).

Document Status:

- Created: 14.07.2026
- Last Modified: 14.07.2026
- Language: English
- Publication Status: DRAFT — attachment for founder's send to Törngren (outbound = RED-zone, human only)
- Classification: CONFIDENTIAL — outreach / collaboration correspondence

Related Documents:

- `docs/gtm/2026-07-14-email-torngren-send-ready.md` — the covering email this memo attaches to
- `docs/field-notes/2026-07-14-kth-broman-torngren-tecosa-trustworthy-systems.md` — context, TECoSA grounding, public sources
- `docs/lut/2026-07-14-lut-doctoral-research-plan.md` — the LUT-facing sibling (doctoral framing; NOT for Törngren)
- `docs/gtm/TECOSA_TORNGREN_CALL_PREP.md` — internal call-prep (his principles → DWS mapping)
- `Legal/KYA_STANDARD_v1.md`, `DWS_SOVEREIGNTY_STANDARD.md` — the KYA spec and sovereignty rubric referenced below

---

## 0. What this memo is

This is a short overview to let you judge — before we spend 30 minutes on a call — whether what we run in production connects to TECoSA's phase-2 trustworthiness themes. It is deliberately not a sales deck and not a doctoral proposal. It describes a deployed system, states plainly where the overlap with your work looks real, names the one concrete area where I think our production platform could be useful to you as an empirical testbed, and draws an honest line around what we do **not** yet claim. If after reading it you conclude the fit isn't there, that is a useful answer and no time is wasted.

A note on register: safety argumentation and assurance-case theory are your field, not mine. I am the founder who runs the system. Where this memo uses that vocabulary it is to locate our production artefact against your frameworks, not to claim authorship of the theory.

## 1. Who we are, in one paragraph

Lifetime Oy (Finland) builds **DWS IQ**, a sovereign, on-premises / edge AI platform for regulated industrial operators. The platform runs autonomous and multi-agent workloads at the edge — the layer between industrial devices and the cloud — and its distinguishing feature is not the models it runs but the **governance and evidence layer wrapped around every agent decision**. We describe ourselves as an "Agent Outcome Company": the deliverable is not a chatbot but an auditable outcome with an evidence trail. The platform is in production with a small base of paying industrial customers and pilot targets, notably in steel (Outokumpu) and the construction sector.

## 2. The technical core — an evidence layer for agentic edge systems

The part of DWS IQ that is relevant to TECoSA is the trust-and-evidence layer, which has three components:

1. **KYA (Know-Your-Agent) — trust scoring.** Every agent operating on the platform carries a trust score derived from its provenance, behaviour, and the constraints it operates under. KYA is, in assurance-case terms, the quantified head of a safety argument: it is the claim ("this agent is trustworthy enough to act here"), and it is only as strong as the evidence beneath it. The KYA model and its conformance criteria are specified in an internal standard we are moving toward open publication.

2. **Article-12-grade decision logging — the evidence chain.** Every decision an agentic system takes at the edge is captured as structured, verifiable evidence: what the agent did, under what inputs, against what policy, with what result. This is engineered to satisfy the EU AI Act's Article 12 record-keeping obligation, but the design intent is broader — an evidence chain an auditor (or a court) could follow. The regulatory alignment falls **out of** the evidence chain; it does not drive it. That inversion — evidence first, compliance as a by-product — is the design stance we would most value your read on.

3. **Hardware-attested isolation.** Agents execute inside Firecracker MicroVMs with a measured sub-125 ms teardown (against the published AWS benchmark), so a misbehaving or compromised agent can be contained at the hardware boundary rather than trusted to behave. This is what lets us treat **behaviour, not stated intent, as the admissible evidence** — for agentic systems the reasoning–behaviour gap makes intent unreliable, and hardware attestation is where a trustworthiness claim becomes falsifiable.

**The evidence model, in your vocabulary.** It may help to see how these three map onto an assurance case. The KYA score is the top-level claim. Beneath it sit sub-claims — provenance (is this agent what it says it is?), behavioural conformance (has it stayed inside its declared envelope?), and containment (can it be stopped if it does not?). Each sub-claim is backed by evidence drawn from a different component: provenance from the agent's attested identity, behavioural conformance from the Article-12 decision log, containment from the MicroVM isolation guarantee and its measured teardown time. In safety-argument-fragment terms, each of these is a fragment with its own evidence and its own cost; the KYA score is what you get when you compose them. What we do **not** have is a formal account of how those fragments compose into a sound top-level claim, nor of what each fragment costs to produce under load — which is exactly the seam where your methodology would enter.

**Multi-agent, not single-agent.** The harder and more interesting case is that most industrial workloads are multi-agent: several agents acting, delegating, and constraining one another. Trustworthiness then is not a property of one agent but of the interaction, and the evidence chain has to capture inter-agent causality — which decision by agent A licensed which action by agent B. Our logging is built to preserve that causal structure. This is where the classical reasoning–behaviour gap is sharpest (an agent's stated plan is an especially poor predictor of a multi-agent system's emergent behaviour), and where hardware-attested behavioural evidence is most clearly the only admissible ground.

Together these turn a running agent — or a running fleet of agents — into an object that produces its own assurance evidence continuously. That is the artefact we would bring to a collaboration.

## 3. The deployment — the Aegis edge system

The trust-and-evidence layer runs across the platform, but the deployment most relevant to your safety-critical work is **Aegis**, our DGX-based edge configuration for dual-use / defence-adjacent industrial settings. Aegis runs the same KYA + Article-12 evidence stack in a hardened, on-premises configuration where the operational constraints are real: bounded latency, bounded compute, and consequences to agent action that are physical, not cosmetic. It is this deployment that lives the tension described in §4 every day, and it is the one we would offer as a testbed.

What makes Aegis a good testbed rather than just a demo is that the constraints are not simulated. It runs on-premises inside the operator's environment, on a fixed hardware budget, with agents that actuate on real industrial processes — so shedding an assurance check to save latency is a decision with a real cost on both sides, not a slider in a lab. That is the regime in which a safety-performance trade-off model earns its keep: when the budget is genuinely finite and the wrong trade is genuinely consequential. It is also a regime that is hard to reconstruct synthetically, which is much of why we think an instrumented production system is worth more to a verification researcher than another benchmark.

Indicative platform facts (verify against the live system before any citation):

| Element       | Detail                                                                                                             |
| ------------- | ------------------------------------------------------------------------------------------------------------------ |
| Edge hardware | NVIDIA GB10 Grace Blackwell (Acer Veriton GN100) for the standard tier; hardened DGX-based configuration for Aegis |
| Runtime       | Agent runtime with KYA governance; models served locally (EU-resident)                                             |
| Isolation     | Firecracker MicroVM, sub-125 ms kill (AWS benchmark)                                                               |
| Evidence      | Structured per-decision logging engineered to EU AI Act Art. 12                                                    |
| Sovereignty   | EU-resident inference; no US-hyperscaler dependency in the data path (no CLOUD Act exposure in the deployment)     |

## 4. The concrete overlap — safety-performance trade-offs (the centre of this memo)

Here is the one specific area where I believe our production platform could be directly useful to your research rather than merely adjacent to it.

**The research question, stated in your terms:** how can safety-performance trade-offs in sovereign edge AI systems be formally modeled and validated under real-time operational constraints?

**Why it is not abstract for us.** Every increment of safety assurance has a price at the edge. Stronger evidence — deeper KYA checks, fuller Article-12 logging, tighter isolation boundaries — costs latency and compute, which are scarce in exactly the deployments where safety matters most. We manage this trade-off operationally today by judgement and measurement; we do not have a formal model of it. That is precisely the gap.

**Why your work is the closest existing methodology.** Your SAFECOMP work on safety-argument fragments and safety-performance trade-off analysis for connected automated vehicles maps almost one-to-one onto this tension. An assurance case assembled from fragments, with the cost of each fragment made explicit and traded against performance under real-time constraints, is the formal object we are missing. What AD-EYE does for automated-driving _evaluation_, we would want to do for sovereign edge-AI _verification_ — the same "evaluate/verify before you trust" philosophy, applied to agentic rather than autonomous-driving systems.

**The offer.** The DGX-based Aegis deployment could serve as a **live testbed** for validating that methodology: real workloads, real latency/compute budgets, real per-decision evidence, and a KYA score that is already a quantified assurance claim waiting for a formal backing. You bring the trade-off model and the verification framework; we bring the instrumented production system to run it against. If the model predicts where the safety-performance frontier sits, we can measure whether it holds on a system that is in daily industrial use.

**What the Aegis testbed actually exposes.** For a trade-off model to be validated it needs instrumented, dependent variables it can predict and be checked against. Aegis can expose, per decision and per workload:

- **End-to-end decision latency** — wall-clock from agent trigger to actuated outcome, decomposed into inference time, KYA-check time, logging time, and isolation overhead, so the _cost of each assurance fragment_ is separable rather than lumped.
- **Compute and memory footprint** of the assurance layer specifically — how much of the edge budget the evidence is consuming, as distinct from the useful work.
- **The KYA score and its constituent sub-claims** as a time series, so a model can be tested against a moving assurance level rather than a single snapshot.
- **Evidence completeness under load** — where, as latency budgets tighten, logging or checks begin to be shed, which is precisely the failure mode a safety-performance model should predict before it happens.
- **Isolation-event traces** — MicroVM teardown events, their triggers, and their timing, as the empirical ground for the containment fragment.

These are the quantities a trade-off model needs as its right-hand side. We are not aware of many settings where all of them are available together on a system under real industrial load — which is what we think makes the testbed genuinely useful rather than merely available.

**A concrete first experiment (sketch, for you to reshape).** Fix an industrial workload on Aegis. Sweep the assurance level — from minimal (identity check only) to maximal (full KYA + complete Article-12 logging + tightest isolation) — and measure the safety-evidence strength and the performance cost at each point. The output is an empirical safety-performance frontier for a real agentic edge system. Your methodology predicts where that frontier _should_ sit and which fragment compositions are Pareto-efficient; the testbed says whether the prediction holds. If it does, you have a validated model on a production system; if it does not, the gap is itself a finding. Either way it is paper-shaped.

_(On citations: I have characterised your SAFECOMP work by topic rather than by specific paper here on purpose — I would rather get the exact references right with you on the call than mis-cite them in a memo.)_

## 5. Where this sits against TECoSA's phase-2 themes

I will not presume to tell you what TECoSA's themes are, but from the outside three overlaps look real:

- **Trustworthy edge computing as the headline.** TECoSA's load-bearing nouns — trustworthy, edge, systems — are the same three our platform is built around. We are the applied/commercial instantiation of the layer your centre studies as methods and theory.
- **Safe, secure and predictable behaviour.** The KYA score, the MicroVM isolation, and the Article-12 evidence chain are our operational answers to "safe, secure and predictable" at the device↔cloud edge. Whether they are _good_ answers by your standards is exactly what a collaboration would test.
- **The industry–academia bridge you already run.** You supervise industrial PhD work with Scania, Alstom and Ericsson; you know the shape where industry provides the deployment ground and the university provides the verification framework. That is the shape we would want, not a vendor relationship.

**The AD-EYE analogue, concretely.** AD-EYE gives automated-driving research a controlled testbed on which candidate behaviours are _evaluated before they are trusted_ — a place to run a system against scenarios and measure whether it holds. We are proposing the same relationship for agentic edge AI, one layer up: Aegis as the instrumented environment on which a trustworthiness or trade-off _model_ is validated before it is relied on. Where AD-EYE evaluates driving policies, Aegis would evaluate assurance policies — how much evidence, produced how, at what cost, buys how much trustworthiness. The philosophy is identical; only the object under test changes, from a vehicle's behaviour to an agent fleet's assurance.

## 6. The collaboration shape we would explore

Concretely, and in ascending order of commitment:

1. **A fit call (30 minutes).** You judge whether the overlap in §4–§5 is real. No obligation beyond that.
2. **A scoped joint demonstrator.** Your safety-performance trade-off methodology, instantiated and measured on the Aegis testbed — a paper-shaped artefact for you, a validated model for us.
3. **A TECoSA affiliate / partner engagement**, if the demonstrator shows the fit is structural rather than one-off. This is where the ~19-partner consortium and any Vinnova-track work would become relevant — but that is a later conversation, not this one.

We would come to any of these as a peer contributing an instrumented system, not as a supplier pitching a product.

### 6.1 A demonstrator sketch (three phases)

To make option 2 concrete — and easy to say no to — here is a phased shape a joint demonstrator could take. All of it is a proposal for you to cut down, not a plan we are attached to.

- **Phase A — instrument and baseline (weeks 1–4).** We expose the Aegis measurement surface from §4 for one agreed industrial workload; you fix the assurance-level sweep and the metrics that matter to your model. Deliverable: a clean baseline dataset — safety-evidence strength vs. performance cost across the sweep — with no modelling claims yet.
- **Phase B — instantiate the model (weeks 4–10).** You express your safety-argument-fragment / trade-off methodology against the baseline: which fragments, what each costs, where the predicted Pareto-efficient compositions sit. Deliverable: a model with explicit predictions we can test.
- **Phase C — validate and write (weeks 10–16).** We run the predicted operating points on Aegis under load; you check prediction against measurement. Deliverable: a paper-shaped result — a safety-performance trade-off model validated (or falsified) on a production sovereign edge-AI system, with the failure modes named. Authorship and framing are yours to lead; our contribution is the system and the data.

Metrics we would propose to agree up front so success is not a matter of opinion: per-fragment latency cost, assurance-layer compute share, evidence-completeness-under-load, and the shape of the measured frontier against the predicted one. If the demonstrator produces a clean negative result — the model does not transfer to agentic edge systems — that is a publishable finding and a good use of the time, not a failure.

### 6.2 What we would need from each side

- **From TECoSA / you:** the trade-off methodology and the exact SAFECOMP references to instantiate; the metric set; a view on whether a single workload or several is the right scope; and honest early feedback if the fit is narrower than §4 suggests.
- **From us:** the instrumented Aegis environment; engineering time to expose the measurement surface; the workload owners' consent for the data used; and the KYA specification in enough detail for you to reason about the fragments.

## 7. Division of labour — and what we do NOT claim

A collaboration works only if the boundary is honest, so here it is.

**Yours, not ours.** Safety argumentation, assurance-case theory, the formal trade-off modelling — your field. We are not proposing to do your research; we are proposing to be the ground it runs on.

**What KYA and the platform do NOT yet cover** (each is an open problem, stated plainly):

- **No formal soundness proof.** KYA emits a trust score and an evidence chain; there is no machine-checked proof that the score is sound against a formal trustworthiness specification. This is the gap a verification collaboration would attack.
- **No quantified cost-of-safety curve.** The latency/compute cost of stronger evidence is observed operationally, not formally modelled or bounded — the §4 gap exactly.
- **Legal admissibility untested.** "Audit-grade" is a design goal; no KYA evidence chain has yet been tested in an actual regulatory audit or legal proceeding.
- **Portability unproven.** The evidence layer is validated on our runtime and model set; whether it generalises across other runtimes and model families is unproven.
- **KYA score not externally calibrated.** The trust score is internally consistent and useful operationally, but it has not been calibrated against an external ground truth — we cannot yet say "a KYA of 0.9 means the agent fails at most X% of the time on class Y." Calibration is itself a research problem, and a natural second collaboration thread.
- **Multi-agent emergent behaviour not bounded.** We capture inter-agent causality in the log, but we do not have guarantees about emergent failure modes of large agent fleets — only evidence after the fact. Bounding them ahead of time is open.

None of these is hidden in the product; naming them is the point of an academic collaboration. If any of them is _not_ in TECoSA's interest, that tells us the fit is narrower than it looks — also useful to know early.

### 7.1 Three ways this could be wrong

In the same spirit, three honest ways the overlap might fail to hold — so you can test them quickly rather than discover them in month three:

1. **The trade-off might not be interestingly formal.** It is possible the safety-performance frontier on our system is dominated by mundane engineering constants (inference cost) rather than by the assurance-fragment structure your methodology reasons about — in which case there is nothing for the model to bite on. The Phase-A baseline would show this early.
2. **Agentic systems might be too unlike CAVs.** Your methodology is grounded in connected automated vehicles, where the physics and the timing are comparatively well-behaved. Multi-agent software behaviour may be irregular enough that fragment composition does not transfer. That is a real risk and, if true, still a finding worth publishing.
3. **The testbed might be too specific.** A result validated only on Aegis, with our model set and our workloads, may not generalise — the portability gap above, seen from your side. We would want to be honest in any write-up about the external validity envelope.

We would rather surface these up front than oversell a fit that does not survive contact with your standards.

## 8. Why the EU-sovereignty framing is congruent, not a complication

The platform is EU-resident by construction: local inference, no US-hyperscaler dependency in the data path, and therefore no CLOUD Act exposure in the deployment. For a Vinnova-funded, KTH-hosted, EU-based consortium this is congruent rather than an obstacle — the regulatory frame (EU AI Act Article 12, NIS2) that governs our customers is the same frame TECoSA's industrial partners operate under. We are not asking you to reach outside the EU legal envelope to work with us.

## 9. What a first 30 minutes could usefully cover

- Your read: does §4 (the safety-performance trade-off overlap) connect to phase-2, or not?
- If yes: the exact SAFECOMP references and trade-off model you would want to instantiate, so I can prepare the Aegis testbed to match.
- The shape and scope of a demonstrator that produces something publishable for you and a validated model for us.
- Anything in §7 (the boundary) that changes your read of the fit.

## 10. Closing

I have kept this to the overview level on purpose. The claim is narrow and, I hope, honest: we run in production the kind of trustworthy-edge system TECoSA studies, we face the safety-performance trade-off your SAFECOMP work models as a daily operational reality, and we can offer an instrumented deployment as a testbed for validating that methodology. Whether that adds up to a collaboration is your call — which is why I would value 30 minutes.

Risto Anton Päärni
Founder, CEO · Lifetime Oy
risto.paarni2024@lifetime.fi · +358 400 319 010

---

## Verification notes (internal — strip before sending)

- Confirm exact Törngren SAFECOMP paper titles/years (2025/2026) via DBLP before the call; the memo intentionally avoids specific citations.
- Verify platform facts against the live system (hardware SKUs, model set, MicroVM benchmark figure) before asserting them to an academic reviewer.
- "Small base of paying industrial customers" — keep vague unless a customer has consented to be named to Törngren; Outokumpu/construction are pilot/existing per prior guardrails (contracted vs. prospect not fully confirmed).
- TECoSA phase-2 themes and partner list characterised from public sources (see the KTH field note); do not assert internal TECoSA specifics you cannot source.
