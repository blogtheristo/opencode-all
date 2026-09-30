---
slug: kya-s1-trust-level-in-industrial-process
lang: en
title: "KYA-S1 and BPMN 2.0: How a Trust Score Steers an AI Agent Through an Industrial Process"
hero: "How a trust score decides whether an agent or a human does the work — and how, afterwards, a fault is traced and the decision replayed."
visual: infographic
visual_src: docs/blog-drafts/img/kya-s1-trust-level-in-industrial-process.svg
visual_alt: "Flowchart: the trust score (TRS) selects the lane, a single-use lease token is consumed at the moment of execution, on failure fail-closed protection routes the task to a human, and the flow ends with fault attribution (FLT) and decision replay (PRV)."
seo_tags: [kya_trs, kya_lease_token, kya_fail_closed, kya_flt, kya_prv, bpmn_user_task]
series: "KYA-S1"
date: 2026-09-30
author: Risto Anton Päärni
Status: DRAFT
translation_of: kya-s1-trust-level-in-industrial-process.fi.md
ai_translated: true
note: "Visual not yet made — the SVG is a to-do."
customer_value: "The trust score and chain termination (the leash snap) already limit today when an AI agent may act without a human and stop a faulty agent chain in a single action; the BPMN gateway, the single-use lease token and decision replay are described here as planned."
routes: [roadmap]
claims_checked: 2026-09-30
sources:
  - title: "Regulating AI Agents"
    authors: "Kathrin Gardhouse, Amin Oueslati, Noam Kolt"
    year: 2026
    venue: "arXiv preprint arXiv:2603.23471"
    url: "https://arxiv.org/abs/2603.23471"
    type: academic
  - title: "Before the Tool Call: Deterministic Pre-Action Authorization for Autonomous AI Agents"
    authors: "Uchi Uchibeke"
    year: 2026
    venue: "arXiv preprint arXiv:2603.20953"
    url: "https://arxiv.org/abs/2603.20953"
    type: academic
  - title: "Learning Selective LLM Autonomy from Copilot Feedback in Enterprise Customer Support Workflows"
    authors: "Nikita Borovkov, Elisei Rykov, Olga Tsymboi, Sergei Filimonov, Nikita Surnachev, Dmitry Bitman, Anatolii Potapov"
    year: 2026
    venue: "arXiv preprint arXiv:2604.23855"
    url: "https://arxiv.org/abs/2604.23855"
    type: academic
  - title: "AIP: Agent Identity Protocol for Verifiable Delegation Across MCP and A2A"
    authors: "Sunil Prakash"
    year: 2026
    venue: "arXiv preprint arXiv:2603.24775"
    url: "https://arxiv.org/abs/2603.24775"
    type: academic
  - title: "Closing the AI Accountability Gap: Defining an End-to-End Framework for Internal Algorithmic Auditing"
    authors: "Inioluwa Deborah Raji, Andrew Smart, Rebecca N. White, Margaret Mitchell, Timnit Gebru, Ben Hutchinson, Jamila Smith-Loud, Daniel Theron, Parker Barnes"
    year: 2020
    venue: "Proceedings of the Conference on Fairness, Accountability, and Transparency (FAT* '20), ACM"
    url: "https://doi.org/10.1145/3351095.3372873"
    type: academic
---

# KYA-S1 and BPMN 2.0: How a Trust Score Steers an AI Agent Through an Industrial Process

## From talk to process code

Once the regulation has been read and the architecture diagrams drawn, the same technical question always follows: **how do you actually build this?**

How do you connect a BPMN 2.0 process engine (such as Camunda or Zeebe), the live trust score (TRS) of the KYA-S1 Security Specification and the DWS IQ background agents so that the result is the genuine Human-in-Command (HIC) authority the EU AI Act demands? [1]

The answer is that the process engine never grants the agent a fixed permission. Instead, every step of the work is routed dynamically according to the level of trust. This piece walks the chain from start to finish: how the trust score selects the lane, how the single-use lease token and fail-closed protection seal the gaps, and what happens when something goes wrong regardless.

## The trust score decides the lane

To keep the implementation clear, responsibility is split across three components. The **BPMN 2.0 engine** is the conductor of the production process: it handles workflow routing and the state machine. The **KYA-S1 TRS service** performs real-time trust and risk scoring through the Lifetime World Model (LWM) interface. The **DWS IQ Skilled Agent** is the executing background agent — a microservice or an autonomous executor.

Whenever a business or production process runs in a DWS IQ environment, the BPMN 2.0 engine and KYA-S1 TRS confer at every critical juncture.

**Pre-assessment.** Before the BPMN engine enters a task, it fires an `Execution Listener`. The listener sends a REST or gRPC request to the KYA-S1 Trust Engine: _"Is DWS IQ Quality Agent X authorised to perform the task 'Laadunvarmistus_Erä_402' right now?"_ The listener does not fetch the score alone; it fetches the score and the lease token together, before the gateway. [2]

**Exclusive routing.** The BPMN process uses the returned value in the condition expression of an XOR gateway. There are two lanes:

- **BPMN Service Task (automatic lane):** the process continues at once as an automated task, and the DWS IQ Skilled Agent completes the transaction within a millisecond.
- **BPMN User Task (human sign-off):** the process branches at once to a human. The task appears in the operator's Single Pane of Glass HIC Dashboard, and the process halts safely until a human signs it off.

In practice, the listener sits on the sequence flow leading into the gateway and receives the task's requirements as fields: the required trust score (`requiredTrs`), the task's risk tier (`taskRiskTier`) and the time limit (`timeoutMs`, 500 ms). The condition leading to the automatic lane has two parts: trust has been approved **and** a lease token has been obtained. Neither is sufficient on its own.

The gateway's default branch (`default`) points to the human lane. If the condition for the automatic lane is not met, for whatever reason — a low score, a missing lease token or a timeout — the task goes to a human.

Conventional automation gives an agent either 0 % or 100 % authority. If something goes wrong, the only remedy is to shut the whole system down. Coupling the BPMN 2.0 engine to KYA-S1 TRS achieves something else: **dynamics**. When every variable is green, DWS IQ agents run the industrial process at full power. If an anomaly occurs in the agent's environment or its authorisation expires, the trust scores drop instantly. The system does not crash; it _hands the decision gently back to a human_. [3]

## A fixed threshold is not enough

The simplest way to illustrate the gateway is a fixed threshold, such as `TRS >= 85`. As a teaching example it works — in production it is a security risk. The KYA-S1 Security Specification (§6.2, TRS-2) requires a documented threshold but does not tie it to any particular number; the right value is set according to the industry and the severity of the consequences of the action.

That is why every BPMN task has its own requirement level: a **task-specific risk threshold (TRS_req)**. The threshold is not a property of the system but of **the severity of the action's consequences**. The figures below are proposals, not canon:

| Risk level                                | TRS_req | Lease token validity | Approval below threshold   |
| ----------------------------------------- | ------- | -------------------- | -------------------------- |
| Read, search, aggregation                 | 60      | 30 s                 | No — continue with logging |
| Quality record, batch status update       | 75      | 15 s                 | One operator               |
| Financial transaction, ERP posting, order | 85      | 5 s                  | Operator + justification   |
| Equipment control, line stoppage, SCADA   | 95      | 2 s                  | Two people (four-eyes)     |

### An honest trust score is the gateway's input

A gateway is only as good as its input. The trust score TRS ∈ [0, 100] is a weighted sum from which anomaly penalties are subtracted: `TRS = max(0, (w₁·IDV + w₂·BHM + w₃·REG + w₄·TRS_hist) − Δ_decay − Δ_anomaly)`.

- **IDV** — Verified Human Principal Binding: are the identity and access rights of the person behind the agent valid and current?
- **BHM** — Runtime Behavioral Modeling: have anomalies been detected in the agent's behaviour relative to its baseline, for example over the last 10 minutes?
- **REG** — Capability Manifest & Registry: are the agent's registration and model version up to date?
- **TRS_hist** — the reliability of the agent's track record.

The proposed default weights are w₁ = 0.35, w₂ = 0.35, w₃ = 0.15 and w₄ = 0.15, which sum to 1.0.

**The sign convention is unambiguous.** Δ_decay and Δ_anomaly are, by definition, non-negative penalties, and the formula subtracts them. An anomaly with an "impact of −40" therefore means `Δ_anomaly = 40`. Confusion here is costly: if an implementation plugs −40 straight into the formula, the double negative **raises** the trust score at the very moment of the anomaly — opening the gateway precisely when it ought to close.

## A single-use lease token closes the gap

If there is a gap of even a few milliseconds without a lock between the trust check and the execution itself, a **race condition** arises. The agent can lose its authorisation just before execution, and the process will run it through anyway. The audit trail will make it look as though the gateway worked. It did not. Human-in-Command is then an illusion.

That is why the Trust Engine does not return a bare number but an **Atomic Single-Use Lease Token**: a cryptographically signed, time-bound key valid for, say, 5 seconds. An automated task can go ahead only if it **consumes** a valid token at the moment of execution. [4] This is the one point that closes the race condition.

### The diagram is not atomic — the delegate is responsible

Here the diagram looks safer than the runtime reality, and honesty requires saying so out loud. The BPMN model's `inputParameter` **does not consume the token**. It merely copies a string from a process variable into the task's scope. If the agent's delegate accepts that value and starts work, the race condition is still open — it has simply moved from the BPMN layer into the delegate, where the auditor cannot see it.

Atomicity is **the delegate's contract**, not a property of the XML. There are four requirements:

1. The delegate's **first** operation is `consumeAndExecute(leaseToken, action)` — a single call that, on the Trust Engine's side, validates the token, marks it as consumed and authorises the action in the same transaction (with locking at the level of `SELECT … FOR UPDATE` or `compare-and-swap`).
2. If no single atomic operation is available, consuming the token must be the first **locked** step of the transaction, and all work with side effects must follow it within the same transaction.
3. A failed consumption throws the error `KYA_LEASE_INVALID`, which routes the task to a human via a boundary event. No automatic retry.
4. The delegate must never read the token to decide for itself whether it is still valid. Validity is determined solely by the Trust Engine at the moment of consumption. [4]

Without this contract, the diagram describes an intention, not a guarantee. Implementing points 1–4 is what makes the gateway real — the XML merely makes it inspectable.

The example is written in Camunda 7 format because its `camunda:` extensions are the most readable. The Camunda 8 equivalents are straightforward: `camunda:delegateExpression` becomes `zeebe:taskDefinition`, `camunda:inputOutput` becomes `zeebe:ioMapping`, and form fields become Camunda Forms JSON. The structure — the timeout as fail-closed protection, the lease-token boundary event, the default branch to a human and PRV as a task of its own — carries over unchanged.

## Fail-closed protection

If the KYA-S1 Trust Engine does not respond within the time limit (more than 500 ms) or returns an error, the process never runs the automation. Without exception, it is routed to human sign-off. A Trust Engine outage slows production down; it does not open the gateway. [2]

The same applies to a token that has already been issued. If the token is revoked mid-execution — because of the leash snap, a withdrawal of authorisation or expiry — the automated task is interrupted, a rollback is performed and the task passes straight to a human. When the leash snap (TC4) is triggered, the Lifetime World Model revokes every active lease token immediately — across the entire agent chain at once.

The human lane has two rules of its own. A sign-off without a justification is not oversight, so the justification field is mandatory. And an unacknowledged task is not left hanging in silence: a 15-minute timer escalates it.

A system's honesty is tested in its exceptions, not in normal operation:

| Exception                             | Effect on trust score | Consequence in the BPMN engine          |
| ------------------------------------- | --------------------- | --------------------------------------- |
| Normal operation, everything in order | 90–100                | Lease token issued → automatic          |
| Principal's rights change (IDV)       | → 0 immediately       | Token revoked → human sign-off          |
| Unknown API call / code anomaly (BHM) | Δ_anomaly = −40       | Score below TRS_req → human sign-off    |
| Engine timeout / connection lost      | no value              | **Fail-closed** → straight to a human   |
| Lease token expires                   | Token becomes invalid | Automated task rejects → rollback & HIC |
| Leash snap (TC4)                      | All tokens revoked    | Entire agent chain halts immediately    |

Note what the matrix **lacks**: not a single row in which an anomaly leads to automatic execution. That is the heart of the whole design. The automatic path requires active proof; the human path requires nothing.

## When something goes wrong: the 72-hour clock

However tight the technical architecture, an industrial environment has to accept one honest fact:

**Sooner or later, something will go wrong.**

The AI will misjudge an unusual situation, a back-end system's database connection will drop mid-transaction, a field device will feed in corrupted data, or a human will enter something wrong.

In the KYA-S1 Specification, the question is not whether a fault will occur. The question is: **what happens 72 hours after the incident has been closed?**

In the world of contracts, the greatest cost when a fault occurs is usually not the technical failure itself but the weeks or months of lawyers and suppliers trading "it was you" and "no, it was you" over whose responsibility the damage was.

KYA-S1's **Bounded Fault Attribution (FLT)** removes that uncertainty. After an incident, the system produces a signed classification of responsibility **within 72 hours of the incident's closure** (FLT-2), in one of five categories:

| Fault class              | Description                                                             | Responsibility assigned to            |
| ------------------------ | ----------------------------------------------------------------------- | ------------------------------------- |
| **1. Model Fault**       | Language-model hallucination, stochastic error or unexpected output     | Model supplier / LLM Provider         |
| **2. Logic Fault**       | A coding error in the DWS IQ agent's application logic or prompt design | Agent software supplier               |
| **3. Integration Fault** | API connection error, network latency, timeout or database outage       | Infrastructure / integration supplier |
| **4. Operator Fault**    | Incorrect or incomplete input from a human operator                     | Customer / user organisation          |
| **5. Policy Fault**      | Configuration error in the rule set, a constraint or an authorisation   | Policy architect / security body      |

Thanks to this classification, the allocation of responsibility ceases to be a draining legal dispute and becomes a precise query.

## Decision replay: a time machine for AI

For fault attribution to be impartial, it needs hard technical evidence. [5] This is where the Lifetime World Model comes into play, and it is why the PRV record — Decision Provenance & Audit Trail — is a dedicated automated task in the BPMN model rather than a mere listener on a single sequence flow.

The difference matters. A listener on one sequence flow covers only that one path, which leaves the human sign-off unlogged. A dedicated task is where **both** paths converge — the agent's execution and the human sign-off — and it is also visible in the diagram; the auditor does not have to hunt for a listener buried in the XML. A human decision is as much an auditable event as an agent's: Human Decision Provenance is precisely the evidence Article 14 requires.

Whenever a DWS IQ agent performs a task, or the task is routed to the dashboard, a cryptographically signed snapshot is stored in the World Model [2]:

1. **Original inputs:** exactly the data and context that were fed to the agent.
2. **Trust state:** the agent's trust score and IDV status at the moment of execution.
3. **Lease token used:** proof that the permission to execute was valid and was consumed atomically.
4. **Model state:** the model version, the temperature parameter and the system prompts.

The PRV task also records which lane the decision came through (automatic or human sign-off), the trust score at the moment of decision and the lease token used. Only then does the process end — and the name of its end event says why: the run has reached its conclusion, and that conclusion can be replayed.

This is what makes **PRV-2 (Decision replay)** possible. Even if the underlying AI model is updated or replaced two years from now, the original chain of decisions can be reconstructed under exactly the same boundary conditions and verified years later.

What did the agent know? On whose authority did it act? How did it reach its result? PRV answers these questions — even when the decision-maker was a human.

## Breaking the domino effect: chain termination

In industrial multi-agent environments, one DWS IQ agent can launch others. A quality-control agent launches a logistics agent, which launches an ordering agent. If an error is found in the first agent's decision, the greatest danger is a **domino effect** — the error multiplying through the back-end systems. [1]

KYA-S1's **Chain Termination (TC4, _Trust Collapse Response & Chain Termination_)** breaks the chain. In-house, its everyday name is the emergency brake: the _leash snap_ (TC4-2).

1. **TC4-1** — a trust collapse is detected at a defined threshold, and a signed event is emitted.
2. **TC4-2** — the chain is terminated atomically: the offending agent, every downstream agent it launched and all of their active tool sessions. The lease tokens are revoked at the same time, so no automated task still in progress can write to the database.
3. **TC4-4** — the agent's full state, tool history and decision trail are preserved at the moment of termination for forensic investigation. This is where fault attribution gets its evidence.
4. The process passes to the dashboard, under the control of a human operator.

Note the order: **secure the evidence before the chain is released** — Capture Precedes Release. If TC4-4 is skipped, fault attribution within 72 hours becomes impossible — all that is left is guesswork.

## Conclusion: honest AI governance in industry

The whole comes down to a chain:

1. **One signed page:** the dull security file finally gets a page of its own for the AI agent.
2. **Technical trust:** the trust score is not a gauge on a dashboard but the direct condition and control mechanism of the BPMN 2.0 process.
3. **The human is truly in command:** every anomaly, lost connection or authorisation error routes the task to a human, and the software guarantees that oversight is not an illusion.
4. **No race condition:** the single-use lease token guarantees that the agent cannot execute anything without a fresh, valid level of trust at the moment of execution.
5. **Airtight crisis management:** when things go wrong, fault attribution and the World Model's historical records keep the allocation of responsibility clear. The log verifies after the fact who acted, with what authority and why — even when the actor was a human.

That is precisely why we helped create this specification: it turns the legal duty of Human-in-Command into dependable software architecture.

Once these pieces are in place, AI agents cease to be an uncontrollable security risk — and become what they were meant to be: **a reliable, high-performing execution tier for industry.**

---

**Risto Anton Päärni**
_Founder, CEO · Lifetime Oy_
_Editor-in-Chief, Lifetime Scope Journal_

## Sources

1. Gardhouse, K., Oueslati, A., & Kolt, N. (2026). Regulating AI Agents. arXiv preprint arXiv:2603.23471. <https://arxiv.org/abs/2603.23471>
2. Uchibeke, U. (2026). Before the Tool Call: Deterministic Pre-Action Authorization for Autonomous AI Agents. arXiv preprint arXiv:2603.20953. <https://arxiv.org/abs/2603.20953>
3. Borovkov, N., Rykov, E., Tsymboi, O., Filimonov, S., Surnachev, N., Bitman, D., & Potapov, A. (2026). Learning Selective LLM Autonomy from Copilot Feedback in Enterprise Customer Support Workflows. arXiv preprint arXiv:2604.23855. <https://arxiv.org/abs/2604.23855>
4. Prakash, S. (2026). AIP: Agent Identity Protocol for Verifiable Delegation Across MCP and A2A. arXiv preprint arXiv:2603.24775. <https://arxiv.org/abs/2603.24775>
5. Raji, I. D., Smart, A., White, R. N., Mitchell, M., Gebru, T., Hutchinson, B., Smith-Loud, J., Theron, D., & Barnes, P. (2020). Closing the AI Accountability Gap: Defining an End-to-End Framework for Internal Algorithmic Auditing. In Proceedings of the Conference on Fairness, Accountability, and Transparency (FAT\* '20). ACM. <https://doi.org/10.1145/3351095.3372873>
