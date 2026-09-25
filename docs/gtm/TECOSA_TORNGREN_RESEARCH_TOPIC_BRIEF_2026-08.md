# Sovereign Edge AI Systems — Research Topic Brief for Martin Törngren / TECoSA

> **Superseded for outreach purposes by `TECOSA_TORNGREN_CONCEPT_NOTE_2026-08.md` v2.1 (05.08.2026), kept here per Rule 12.** This brief was written on the (wrong) assumption that Törngren had not seen any topic yet and no intro call had happened. Ground truth from Gmail: he already replied positively 22.07.2026 and asked 24.07.2026 for exactly this kind of one-pager — the concept note is the corrected, ready-to-send version. This document remains useful as the internal "three-question test" framing (§5) and the RQ-to-lock mapping, both still accurate.

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code | Session: claude/nato-diana-test-centers-ilezh9 | Date: 05.08.2026 | Changes: Created per HIC direction (05.08.2026) as step 1 of the 5-step doctoral-home decision process (`docs/phd/PHD_DOCTORAL_HOME_DECISION_PROCESS_2026-08.md`). This is a **repackaging of the already-locked RQ1 + RQ4 + RQ5** (`docs/phd/PHD_RESEARCH_QUESTIONS_LOCK_v1.md` v1.1) into a single KTH-facing topic, not a new research question and not a change to the lock. Draws on the full crosswalk already built in `docs/gtm/TECOSA_TORNGREN_DISCUSSION_MEMO.md` v1.0. **DRAFT — not sent.** Sending is a human action.

Document Status:

- Created: 05.08.2026
- Last Modified: 05.08.2026
- Language: English
- Publication Status: **DRAFT — not sent.**
- Classification: CONFIDENTIAL — Doctoral correspondence

Related Documents:

- `docs/phd/PHD_DOCTORAL_HOME_DECISION_PROCESS_2026-08.md` — the process this brief is step 1 of
- `docs/phd/PHD_RESEARCH_QUESTIONS_LOCK_v1.md` v1.1 — locked RQ1, RQ4, RQ5 (verbatim source of this brief's content)
- `docs/gtm/TECOSA_TORNGREN_DISCUSSION_MEMO.md` v1.0 — full per-paper crosswalk this brief is condensed from
- `People/partners/academic/martin-torngren.md` — his industrial-PhD model (Scania, Alstom, Ericsson)

---

> **What this document is not.** It does not claim Törngren has agreed to anything. It does not claim KTH is the chosen doctoral home. It is the artifact that step 2 of the decision process (`PHD_DOCTORAL_HOME_DECISION_PROCESS_2026-08.md` §2) needs to exist before that step can even be attempted: a scoped topic a specific researcher can say yes or no to.

---

## Working title

**Sovereign edge AI systems: safety argumentation, explicit agent identity, and auditable governance under real-time operational constraints**

## 1. The problem, stated once, precisely

Autonomous systems at the industrial edge — whether a vehicle or an AI agent acting on tools, data, and spend authority — cannot be fully verified before deployment. Trustworthiness has to be **argued from evidence**, and part of that evidence must be produced **at run-time, by the system itself**, while architectural constraints keep it inside a quantified safety envelope. This is Törngren's own framing of the automated-driving problem (`T-ITS 2025` review, categories 3–4: run-time risk assessment and run-time self-adaptation). **The open question this topic proposes is whether that framing transfers to agentic AI systems, where the component being bounded is stochastic (an LLM-driven agent) rather than a physical vehicle, and where "safety" includes financial, data-access, and regulatory harm, not only physical harm.**

Three sub-problems, each already anchored to an existing testbed:

1. **Formal verification of the trust/safety mechanism itself** (RQ1). The mechanism exists and runs in production — it is not formally verified.
2. **The safety–performance trade-off under real-time constraints** (RQ4). Autonomy granted to an agent and the evidence required to justify it are in tension, exactly as in his SAFECOMP safety-argument-fragment work — except the "vehicle-level quantitative safety requirement" becomes an agent-level trust threshold, and "situation awareness" becomes live operational telemetry.
3. **Auditable, explicit agent identity as the substrate the other two depend on** (RQ5). Neither formal verification nor a safety argument means anything if the thing being verified — the agent's identity, its authority, its action history — is not itself tamper-evident and continuously auditable.

## 2. The testbed (already exists, already in production — not proposed, described)

- **Article 12 Logging Pipeline** (`DWS_ARTICLE_12_LOGGING_STANDARD.md` v1.0): every agent decision, tool call, and memory mutation becomes a hash-chained, operator-attributed, trace-bound log event. This is the run-time evidence layer.
- **KYA Agent Trust Score** (`Legal/KYA_STANDARD_v1.md` v1.8): a transparent, executable formula (`ATS = max(0, 1.0 − V×0.25 − L − D×0.05 + A×0.15)`) computed from live operational events, gating permission bands (full / restricted / suspended / frozen).
- **Physical enforcement**: each agent runs in its own Firecracker MicroVM with hypervisor-level, deny-by-default egress control — the "precautionary constraint" that holds the quantitative requirement even under uncertainty, structurally identical in shape to Törngren's SAFECOMP argument-fragment's third move.
- **What is honestly missing** (this is the collaboration ask, not a caveat to hide): no formal verification of the trust model; no structured safety-case argument (GSN or similar) connecting the evidence to the claims; no statistically validated thresholds (his Extreme Value Analysis work is the direct analogue of what's missing).

## 3. The three research questions, verbatim from the lock (not modified)

Per `PHD_RESEARCH_QUESTIONS_LOCK_v1.md` v1.1 lock rule 2 (no silent edits — quoted, not paraphrased):

**RQ1** — _How can sovereign edge AI orchestration be formally verified for trustworthiness in regulated industrial environments?_ — Anchor: KTH/TECoSA (Törngren). Testbed: DGX-based Aegis + KYA edge control room. EU hook: AI Act high-risk, NIS2.

**RQ4** — _How can safety-performance trade-offs in sovereign edge AI systems be formally modeled and validated under real-time operational constraints?_ — Anchor: Törngren's SAFECOMP safety-argument methodology. Testbed: Aegis edge deployment (safety evidence vs. latency/compute). EU hook: AI Act art. 12, safety-critical CPS.

**RQ5** — _How can a Know-Your-Agent (KYA) trust-scoring model be designed and validated as an open conformance standard for agentic AI in EU-regulated industries?_ — Anchor: LUT-native (Design Science) **and** the technical spine RQ1/RQ4 instantiate. Testbed: KYA reference implementation in production. EU hook: AI Act art. 12/14/72.

**Why three, not the full six, in this brief.** RQ2/RQ3/RQ6 are Stockholm Resilience Centre-, Chalmers-, and LUT Industrial Management-anchored respectively — not in Törngren's field and not useful to include in a topic scoped for him specifically. RQ5 appears here because Törngren's group reads it, per the lock file's own analysis, as "the point where governance becomes verifiable" — it is not being reassigned to KTH, only included because it is load-bearing for RQ1 and RQ4 to make sense as a set.

## 4. What a KTH-housed piece of this would concretely produce

Smallest to largest, matching the three shapes already scoped in the discussion memo (`TECOSA_TORNGREN_DISCUSSION_MEMO.md` Part IV, Q7):

1. A **safety-argument fragment** (GSN or equivalent) mapping the KYA trust-band mechanism onto his three-move SAFECOMP structure (quantitative requirement → situation awareness → precautionary constraint) — the direct RQ4 deliverable.
2. A **formal verification study** of the trust-score state machine (the ATS formula, band transitions, leash-snap) against a defined threat/failure model — the direct RQ1 deliverable.
3. Whether RQ1+RQ4's output can be expressed as a **reusable conformance criterion** for agent identity/governance generally (RQ5's open-standard framing) — the piece that would make this publishable as method, not only as a case study.

## 5. The three questions this brief exists to answer (per the decision process, §3)

1. **Does this specific topic interest Törngren enough to supervise it** — as opposed to a general TECoSA-application-case relationship?
2. **Does it fit inside KTH's doctoral-school scope** (ITM/Mechatronics, where TECoSA sits) as a formally supervisable PhD topic, not only a seminar or MSc-thesis-sized engagement?
3. **Is a four-year funding and employment model realistic** — given KTH's own requirement of a minimum two supervisors (one main) and a personal ISP, and that an industrial PhD requires a formal KTH–company agreement, not an informal collaboration (per KTH's published doctoral-studies guidance, HIC-supplied 05.08.2026, not independently fetched by this session)?

None of these three has a "yes" yet. This brief is what makes it possible to ask them.

## 6. What this is explicitly not

- Not a claim that KTH is the chosen doctoral home (see `PHD_DOCTORAL_HOME_DECISION_PROCESS_2026-08.md` §5).
- Not a change to the locked six research questions.
- Not a claim of any funding, employment, or IPR arrangement — those are step 4 of the process, reachable only after steps 2–3.
- Not yet sent. Sending — whether as a standalone document or folded into the still-pending intro call (`TECOSA_TORNGREN_DISCUSSION_MEMO.md`) — is a founder decision.
