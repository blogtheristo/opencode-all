# Field Note: Varsavsky — Intelligence Is Cheap, Accountability Will Be Priced

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Claude Sonnet 4.6) | Session: claude/agent-monitoring-evals-qatA6 | Date: 08.05.2026 | Changes: Initial field note. Triggered by Martin Varsavsky's public statement on running AI agents inside real companies. Maps his four accountability requirements (evals, logs, rollback, human review queue) to the DWS IQ 6 agent foundry and derives product and architecture implications.

Document Status:

- Created: 08.05.2026
- Last Modified: 08.05.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE
- Document Type: Field Note / Architecture Insight

Related Documents:

- docs/Deputy-Agents-Architecture.md
- docs/field-notes/2026-05-03-ai-engineering-50-backend-agents-foundry.md
- src/agents/index.ts
- src/agents/article12-logger.ts
- Admin/ADMIN_MANUAL.md §30

---

- **Date:** 08.05.2026
- **Author:** Risto Anton Päärni (risto.paarni@lifetime.fi)
- **Context:** Martin Varsavsky writes publicly about running agents across several companies — email sorting, dashboards, bot-blocking, call summarization. His observation: the model is never the bottleneck in production. The bottleneck is what happens when the agent is wrong. This note extracts the engineering and product implications for DWS IQ 6.

## Ontology Tags

- **Geography:** Global > EU > Finland
- **Sector:** Infrastructure > AI/ML > Agent Systems > Agent Monitoring
- **Entities:** Lifetime Oy, DWS IQ 6, Martin Varsavsky, Anthropic
- **Standards:** EU AI Act Article 9 (Risk Management), Article 12 (Logging), Article 14 (Human Oversight), DWS Brain-Memory-Body-Hands
- **Temporal Context:** 2026-Q2, 50-agent foundry, monitoring layer buildout
- **Confidence:** High — Varsavsky's observation matches production failure patterns documented in our own field notes and EU AI Act Article 12/14 requirements

---

## 1. The Source

Martin Varsavsky — entrepreneur, infrastructure investor, founder of Fon, Ya.com, Jazztel. Runs agents across multiple operating companies. His statement:

> "The model is not the bottleneck anymore. The bottleneck is what happens when the agent is wrong."
>
> "It does not crash. It does not error. It just becomes slowly worse at the job, and three weeks later you realize half of its outputs are subtly wrong."
>
> "What you actually need is unglamorous: evals you trust, logs you can search, the ability to roll a single agent back to last week, and a human review queue for anything that touches money, legal text or a customer."
>
> "Intelligence is cheap now. Accountability is what will be priced."

This is the clearest practitioner framing of the agent production problem I have seen. It names the failure mode precisely — **silent drift** — and specifies the four remedies without hype.

---

## 2. The Failure Mode: Silent Drift

Varsavsky describes a failure mode that has no error signature. The agent does not throw an exception. Latency does not spike. Uptime stays 100%. But output quality degrades along some axis that was never instrumented.

This is distinct from the failure modes that engineering culture is trained to catch:

| Failure Type            | Signal                 | Detection Method    |
| ----------------------- | ---------------------- | ------------------- |
| Crash / exception       | Stack trace, 500 error | Standard monitoring |
| Latency regression      | p95 spike              | APM / Prometheus    |
| Hallucination explosion | Visible nonsense       | User reports        |
| **Silent drift**        | **None**               | **Evals only**      |

Silent drift is invisible to observability stacks because the agent is technically healthy. The LLM returns tokens. The JSON parses. The database write succeeds. The score is wrong. The summary missed the key clause. The categorization drifted from last month's definition. Nothing in the stack tells you.

### Why Agents Drift Silently

Three mechanisms:

1. **Prompt sensitivity to model updates.** When the underlying model is updated (by Anthropic, by Google, by Groq) the same prompt may produce subtly different outputs. No version pin, no notification.

2. **Context window fill pattern changes.** As logs grow, memory retrieval order changes, context grows — the agent sees a different slice of history and shifts its reasoning baseline.

3. **Distribution shift in inputs.** The type of documents, emails, or requests the agent processes changes gradually. The agent was tuned on old examples and now faces a different population.

None of these cause errors. All of them cause drift.

---

## 3. The Four Remedies

Varsavsky's prescription is exactly four things. He calls them "unglamorous" because none of them are demos.

### 3.1 Evals You Trust

An eval is not a unit test. A unit test checks logic. An eval checks output quality on a representative sample of real-world inputs. The sample must be curated from production data — not invented scenarios.

**Trust** is the operative word. An eval you do not trust is worse than no eval, because it gives false confidence. An eval earns trust when it has caught at least one real regression before users did.

What makes an eval trustworthy:

- Ground truth labeled by domain experts, not by the agent itself
- Sample drawn from the tail of the input distribution (the hard cases)
- Score stable enough that a 5% regression is distinguishable from noise
- Run automatically on every model or prompt change

### 3.2 Logs You Can Search

Logs for agents are not web server access logs. An agent log must capture:

- The full input context (not just the query — the retrieved chunks, the tool call results)
- The full output before any post-processing
- The reasoning trace if chain-of-thought is enabled
- A session ID linking all turns in a multi-turn interaction
- A timestamp accurate to the millisecond (for correlation with external events)

"Searchable" means structured. JSONL minimum. Indexed on agent name, date, input hash, output category, confidence score. You need to answer "show me every email the agent classified as low-priority in the last two weeks" in under five seconds.

### 3.3 Rollback to Last Week

Agents must be versioned at the level of the combination: model + system prompt + retrieval configuration + tool list. Bumping any one of these is a new version. Rolling back means restoring all four.

A rollback must be possible without a code deploy. If rollback requires a PR, it will not be done fast enough when a production agent is drifting.

### 3.4 Human Review Queue for Money, Legal, Customer

Varsavsky draws the boundary clearly: **money, legal text, customers**. Everything else can be automated. These three cannot be fully delegated because the error cost is asymmetric — a subtly wrong compliance classification costs more to fix than to review.

The queue is not a sign of failure. It is a designed constraint that acknowledges the limits of the current generation of agents. The queue should shrink over time as evals improve and drift is controlled. But removing the queue entirely on the basis of model confidence is not safe.

---

## 4. DWS IQ 6 — Current State Audit

Mapping Varsavsky's four requirements to what DWS IQ 6 has today:

| Requirement         | DWS IQ 6 Status       | Gap                                                                                       |
| ------------------- | --------------------- | ----------------------------------------------------------------------------------------- |
| Evals you trust     | ❌ None in production | No eval harness, no labeled dataset, no regression suite                                  |
| Logs you can search | 🔧 Partial            | `article12-logger.ts` logs compliance decisions; no unified agent log store; no search UI |
| Rollback            | ❌ None               | Agents are code — rollback requires a git revert and redeploy                             |
| Human review queue  | 🔧 Partial            | Compliance scores go to dashboard; no explicit queue; no escalation routing               |

**Honest assessment:** DWS IQ 6 is at the same stage Varsavsky describes as "the first version is always magical." The 50-agent foundry architecture is sound. The accountability layer is missing.

This is not a failure. It is the correct order of operations: ship the agents, then build the supervision. The error would be to harden undeployed code (CLAUDE.md principle 5). The agents are deployed. The hardening is now due.

---

## 5. What to Build — Four Accountability Modules

### 5.1 Agent Eval Harness

A TypeScript eval runner that:

- Loads a JSONL dataset of `{input, expected_output, agent_name}` tuples
- Runs each input through the live agent
- Scores output against expected using a configurable metric (exact match, semantic similarity, field-level accuracy)
- Reports pass/fail rate with delta vs. last run
- Blocks CI if regression exceeds threshold

Location: `src/evals/`
Entry: `src/evals/run-evals.ts`
Dataset: `src/evals/datasets/{agent-name}.jsonl`

The first dataset for each agent should be 20–50 examples drawn from real production logs. Not invented.

### 5.2 Unified Agent Log Store

A structured logging layer that:

- All 50 agents write to via a single `AgentLogger` class
- Stores to Supabase table `agent_logs` (JSONL backup to `logs/`)
- Fields: `agent_name`, `session_id`, `input_hash`, `output_hash`, `confidence`, `tools_called`, `latency_ms`, `model_version`, `prompt_version`, `timestamp`
- Queryable via dashboard filter: agent × date range × confidence band

`article12-logger.ts` becomes a consumer of AgentLogger, not a parallel system.

### 5.3 Agent Version Registry

A registry that treats `{model_id, system_prompt_hash, retrieval_config_hash, tool_list_hash}` as a version tuple. Stored in `src/agents/version-registry.ts`.

Every agent run records which version ran. Rolling back means updating the registry record to point to a previous version tuple — no code deploy required if system prompts are stored in Supabase `agent_versions` table.

### 5.4 Human Review Queue

A Supabase table `review_queue` with a simple dashboard card:

- Agent name
- Input summary (first 200 chars)
- Agent output
- Confidence score
- Escalation reason (money / legal / customer / low confidence)
- Approve / reject / override buttons

Routing rule: any agent output touching a field tagged `financial`, `legal`, or `customer_facing` in the agent schema is queued automatically if confidence < threshold.

The threshold is configurable per agent. It starts at 0.85 and tightens as eval coverage improves.

---

## 6. EU AI Act Alignment

Varsavsky's four requirements are not just engineering best practice. For DWS IQ 6 serving industrial clients under EU AI Act, they are compliance requirements:

| Varsavsky Requirement | EU AI Act Article | Obligation                                                                                  |
| --------------------- | ----------------- | ------------------------------------------------------------------------------------------- |
| Evals you trust       | Article 9 §1(e)   | "Testing of AI systems in accordance with pre-defined metrics and probabilistic thresholds" |
| Logs you can search   | Article 12 §1     | "Automatic recording of events ('logs') throughout the lifetime of the AI system"           |
| Rollback              | Article 9 §1(f)   | "Examination of performance with regard to previously identified situations"                |
| Human review queue    | Article 14 §1     | "Human oversight measures appropriate to the risks"                                         |

DWS IQ 6 sells to industrial clients who are themselves high-risk AI deployers under Annex III. Their auditors will ask for these four. "We have a 50-agent foundry" is not an answer. "We have evals, logs, versioned rollback, and a review queue" is an answer.

---

## 7. Product Implication: Accountability as a SKU

Varsavsky's last line is the product insight: **"Accountability is what will be priced."**

This means the accountability layer is not just an internal engineering concern. It is a product differentiator and eventually a line item.

DWS IQ 6's current product catalog sells agent capability: compliance scoring, carbon analysis, site safety. The next product tier sells agent accountability: monitored agents, audited outputs, human-in-the-loop workflows, quarterly eval reports.

This aligns with the DWS Skilled Taxonomy — the brand promise is "Skilled Agents," not just "AI Agents." A skilled professional is accountable. The accountability infrastructure is what makes the "Skilled" claim credible to an enterprise buyer.

**Provisional SKU concept:**

- **DWS IQ Monitor** — Unified agent log store + eval dashboard + drift alerts
- **DWS IQ Audit Pack** — EU AI Act Article 12 compliant logs, exportable for auditor review
- **DWS IQ Human Loop** — Managed review queue with SLA-backed human oversight for money/legal/customer agent outputs

These are not new agents. They are the supervision infrastructure around the existing 50. They are what separates a demo from a production system a CFO will sign an MSA for.

---

## 8. The Management Mental Model

Varsavsky's framing: treat agents like junior employees with bad memory and worse judgment.

This is precise. A junior employee:

- Does the job competently most of the time
- Cannot be trusted with unsupervised access to customer commitments or financial decisions
- Needs to be checked, not because they are malicious, but because their judgment is not calibrated
- Improves with feedback, but feedback requires observation

The correct management response is not to fire the junior employee (remove the agent) or to promote them to unsupervised decision-maker (remove the review queue). It is to build the supervision infrastructure that lets them operate within their actual capability boundary.

The supervision infrastructure is not overhead. It is the job.

---

## 9. What DWS IQ 6 Should Do Next

Ordered by impact vs. effort:

1. **This week:** Create `src/evals/` directory, write eval runner, label 20 examples for the `compliance` agent. This is the highest-leverage action because it gives the team a signal before drift accumulates.

2. **This sprint:** Extend `article12-logger.ts` into a unified `AgentLogger` and migrate all 50 agents to write through it. Adds searchability to existing logging work.

3. **This month:** Implement `agent_versions` table and version registry. Enables rollback without redeploy.

4. **This quarter:** Ship `review_queue` UI in the Firehorse dashboard. Gates any agent output touching financial or legal fields.

The sequence matters. Evals first — because without evals, you do not know if the other three changes helped or hurt.

---

## 10. Key Insight

Varsavsky is describing the gap between AI demos and AI products. The demo shows the agent doing the job. The product ships the supervision infrastructure that makes the job safe to delegate.

DWS IQ 6 has built the agents. The supervision layer is the next build cycle. It is unglamorous. It is also what the EU AI Act requires, what enterprise buyers will audit for, and — per Varsavsky — what will be priced as the market matures.

Intelligence was always going to get cheap. Accountability was always going to be hard. We are now in the part of the curve where that becomes visible.
