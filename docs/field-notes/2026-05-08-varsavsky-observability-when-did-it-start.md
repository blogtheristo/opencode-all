# Field Note: Varsavsky — Observability and the Diagnostic Question

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Claude Sonnet 4.6) | Session: claude/agent-monitoring-evals-qatA6 | Date: 08.05.2026 | Changes: Initial field note. Follows 2026-05-08-varsavsky-agent-accountability-intelligence-cheap.md — Martin Varsavsky's second observation on the same topic. Adds the observability framing and the specific diagnostic question "when did it start being wrong" as a product requirement.

Document Status:

- Created: 08.05.2026
- Last Modified: 08.05.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE
- Document Type: Field Note / Architecture Insight

Related Documents:

- docs/field-notes/2026-05-08-varsavsky-agent-accountability-intelligence-cheap.md
- src/agents/agent-logger.ts
- src/evals/drift-detector.ts
- docs/Deputy-Agents-Architecture.md

---

- **Date:** 08.05.2026
- **Author:** Risto Anton Päärni (risto.paarni@lifetime.fi)
- **Context:** Follow-up to Varsavsky's first observation (see related doc). This second statement sharpens the tool: the word is "observability", the mechanism is logging inputs + confidence, and the diagnostic question is "when did it start being wrong."

## Ontology Tags

- **Geography:** Global > EU > Finland
- **Sector:** Infrastructure > AI/ML > Agent Observability
- **Entities:** Lifetime Oy, DWS IQ 6, Martin Varsavsky, Anthropic
- **Standards:** EU AI Act Article 12 (Logging), DWS Brain-Memory-Body-Hands
- **Temporal Context:** 2026-Q2, accountability layer buildout
- **Confidence:** High — "when did it start being wrong" is a diagnostic query that requires time-indexed confidence data, which we are now building

---

## 1. The Statement

> "Observability is the right word. Loud failures pay for themselves, the silent drift is what eats margin. We learned to log every agent decision with the inputs it saw and a confidence proxy. Half the value is being able to ask later: when did it start being wrong."

This is a second-order refinement of the first observation. The first statement identified the failure mode (silent drift) and named four remedies. This second statement narrows to a specific implementation pattern and a specific diagnostic question.

---

## 2. Three Precise Requirements

### 2.1 Log Every Agent Decision

Not just errors. Not just escalations. Every invocation — whether it succeeded with high confidence or barely scraped through at 0.52.

The word "every" is load-bearing. Sampling misses the rare high-confidence failures that drift produces. The value of full coverage is that you have a baseline: you know what normal looks like before the drift starts, so you can see the deviation clearly when it appears.

### 2.2 With the Inputs It Saw

This is the gap our `AgentLogger` had. We logged an `inputHash` — a fingerprint of the input — but not the input itself. Varsavsky's formulation is explicit: the agent decision is only interpretable alongside the context the agent was operating on.

Why does this matter?

Silent drift often has an input cause:

- The distribution of input documents shifted (longer contracts, different language)
- A field the agent relied on changed format (date string → Unix timestamp)
- The retrieval layer started returning different chunks (embedding model updated)

Without the actual input in the log, you can observe that confidence dropped on day 14 but you cannot ask why. With the input, you can sample the low-confidence runs from day 14, compare the inputs to day 7 (high confidence), and see what changed.

**Implementation:** Log the actual input payload (PII-scrubbed), controlled by `AGENT_LOG_FULL_INPUT=true`. The scrubber removes fields named `email`, `name`, `phone`, `address`, `ssn`, `dob` before writing to disk.

### 2.3 A Confidence Proxy

The proxy does not need to be precise. It needs to be consistent — the same agent, with similar inputs, should produce similar confidence scores across time. If it does not, the proxy is detecting something real.

For DWS IQ 6 agents: every `AgentResponse` already carries `confidence: number (0–1)`. This is the proxy. The only requirement is logging it consistently alongside the timestamp so it becomes a time series.

---

## 3. The Diagnostic Question

> "When did it start being wrong."

This is the entire value proposition of agent observability. Not "is the agent wrong right now?" (you can see that from the output). The question is about the **inflection point** — the first day the drift began, before anyone noticed.

Knowing the inflection point tells you:

- Whether a model update caused it (correlate with Anthropic release dates)
- Whether an input distribution shift caused it (correlate with what changed in the data pipeline)
- Whether a prompt change caused it (correlate with the version registry — see version-registry.ts)
- Whether a retrieval change caused it (correlate with what the agent was retrieving on that day)

If you cannot answer "when did it start being wrong", you cannot answer "why did it start being wrong." And if you cannot answer why, you cannot fix it reliably — you can only guess and hope.

---

## 4. The Implementation Pattern

Varsavsky describes a three-part pattern:

```
LOG:    every decision + inputs seen + confidence
STORE:  time-indexed, searchable
QUERY:  "show me confidence for agent X from day 1 to today"
```

This is standard distributed systems observability applied to agent outputs. The difference from metrics observability (latency, error rate, throughput) is that agent observability requires capturing the **semantic content** of what the agent decided, not just the technical envelope.

The confidence score is the semantic signal. The input is the context. The timestamp is the index.

---

## 5. DWS Implementation

### 5.1 What We Built in Session 1

| Component        | Status                              | Gap                                  |
| ---------------- | ----------------------------------- | ------------------------------------ |
| AgentLogger      | ✓ logs start/end/error + confidence | logs `inputHash` not `inputPayload`  |
| Eval harness     | ✓ scores against ground truth       | no temporal dimension                |
| Version registry | ✓ tracks model+prompt+tools         | not correlated with log timeline yet |
| HIL queue        | ✓ escalation surface                | not triggered by drift signals yet   |

### 5.2 What Session 2 Adds

| Component                       | Purpose                                                                |
| ------------------------------- | ---------------------------------------------------------------------- |
| AgentLogger `inputPayload`      | Logs actual inputs (PII-scrubbed) so the "inputs it saw" are queryable |
| `drift-detector.ts`             | Reads JSONL logs → daily confidence per agent → finds inflection point |
| `scripts/daily/detect-drift.sh` | Auto-runs drift detection daily on DGX Spark                           |
| `ConfidenceDriftView.tsx`       | "Drift" tab in Agent Monitor — shows confidence timeline per agent     |
| `agents.routes.ts`              | Backend routes: review-queue + confidence-timeline endpoints           |

### 5.3 The Inflection Point Algorithm

```
For each agent:
  1. Compute daily mean confidence from JSONL logs (last 30 days)
  2. Compute 14-day baseline (days 15-30)
  3. Compute 7-day current window (last 7 days)
  4. Flag if: current < baseline × (1 - DRIFT_THRESHOLD)
  5. Binary search for first day where rolling 3-day avg dropped below threshold
  6. That day = the inflection point
```

Threshold: 10% drop triggers a warning; 20% triggers an alert.

---

## 6. The Language Precision: Observability vs Monitoring

Monitoring asks: "Is it working right now?"
Observability asks: "Given this output, can I understand why the system produced it?"

Monitoring is reactive — it catches loud failures. Observability is retrospective — it catches silent drift.

Varsavsky uses "observability" deliberately. The tooling is different:

- Monitoring tools: uptime checks, error rate alerts, latency dashboards
- Observability tools: structured logs with semantic content, correlation IDs, distributed trace

For agents, the semantic content is: (input, decision, confidence, timestamp). Without all four, you have monitoring. With all four, you have observability.

---

## 7. Key Insight

The diagnostic question "when did it start being wrong" requires a specific log schema. You cannot answer it with `ERROR: agent returned null` or `latency: 2400ms`. You can only answer it if you have a continuous time series of `{agentName, confidence, inputSummary, timestamp}` that predates the drift.

This means the log must be written before you know there is a problem. That is the only way to have it when you need it. The cost is a few kilobytes per agent run. The return is the ability to diagnose any drift that occurs, ever, by looking backward in time.

Varsavsky's "half the value" framing is conservative. For industrial AI handling EU compliance and financial decisions, the ability to answer "when did it start being wrong" and "what was it looking at when it started" is not half the value. It is the difference between a defensible system and an indefensible one.
