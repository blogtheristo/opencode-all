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

Together these turn a running agent into an object that produces its own assurance evidence continuously. That is the artefact we would bring to a collaboration.

## 3. The deployment — the Aegis edge system

The trust-and-evidence layer runs across the platform, but the deployment most relevant to your safety-critical work is **Aegis**, our DGX-based edge configuration for dual-use / defence-adjacent industrial settings. Aegis runs the same KYA + Article-12 evidence stack in a hardened, on-premises configuration where the operational constraints are real: bounded latency, bounded compute, and consequences to agent action that are physical, not cosmetic. It is this deployment that lives the tension described in §4 every day, and it is the one we would offer as a testbed.

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

_(On citations: I have characterised your SAFECOMP work by topic rather than by specific paper here on purpose — I would rather get the exact references right with you on the call than mis-cite them in a memo.)_

## 5. Where this sits against TECoSA's phase-2 themes

I will not presume to tell you what TECoSA's themes are, but from the outside three overlaps look real:

- **Trustworthy edge computing as the headline.** TECoSA's load-bearing nouns — trustworthy, edge, systems — are the same three our platform is built around. We are the applied/commercial instantiation of the layer your centre studies as methods and theory.
- **Safe, secure and predictable behaviour.** The KYA score, the MicroVM isolation, and the Article-12 evidence chain are our operational answers to "safe, secure and predictable" at the device↔cloud edge. Whether they are _good_ answers by your standards is exactly what a collaboration would test.
- **The industry–academia bridge you already run.** You supervise industrial PhD work with Scania, Alstom and Ericsson; you know the shape where industry provides the deployment ground and the university provides the verification framework. That is the shape we would want, not a vendor relationship.

## 6. The collaboration shape we would explore

Concretely, and in ascending order of commitment:

1. **A fit call (30 minutes).** You judge whether the overlap in §4–§5 is real. No obligation beyond that.
2. **A scoped joint demonstrator.** Your safety-performance trade-off methodology, instantiated and measured on the Aegis testbed — a paper-shaped artefact for you, a validated model for us.
3. **A TECoSA affiliate / partner engagement**, if the demonstrator shows the fit is structural rather than one-off. This is where the ~19-partner consortium and any Vinnova-track work would become relevant — but that is a later conversation, not this one.

We would come to any of these as a peer contributing an instrumented system, not as a supplier pitching a product.

## 7. Division of labour — and what we do NOT claim

A collaboration works only if the boundary is honest, so here it is.

**Yours, not ours.** Safety argumentation, assurance-case theory, the formal trade-off modelling — your field. We are not proposing to do your research; we are proposing to be the ground it runs on.

**What KYA and the platform do NOT yet cover** (each is an open problem, stated plainly):

- **No formal soundness proof.** KYA emits a trust score and an evidence chain; there is no machine-checked proof that the score is sound against a formal trustworthiness specification. This is the gap a verification collaboration would attack.
- **No quantified cost-of-safety curve.** The latency/compute cost of stronger evidence is observed operationally, not formally modelled or bounded — the §4 gap exactly.
- **Legal admissibility untested.** "Audit-grade" is a design goal; no KYA evidence chain has yet been tested in an actual regulatory audit or legal proceeding.
- **Portability unproven.** The evidence layer is validated on our runtime and model set; whether it generalises across other runtimes and model families is unproven.

None of these is hidden in the product; naming them is the point of an academic collaboration. If any of them is _not_ in TECoSA's interest, that tells us the fit is narrower than it looks — also useful to know early.

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
