---
slug: done-is-evidence-not-a-claim
lang: en
title: "Done Is Evidence, Not a Claim: Auditing Agents and Gating Their Work"
hero: "Accept an agent's “done” only as evidence — a changed system, an audit record, a gate command's result — never as a sentence in a transcript."
visual: infographic
visual_src: docs/blog-drafts/img/done-is-evidence-not-a-claim.svg
visual_alt: "Flow from agent action to side effect in the tools, to audit record, to done gate, to pull request and human merge"
seo_tags: [hic, article_12, article_14, eu_ai_act, agent_isolation, kya_prv]
date: 2026-09-30
author: Risto Anton Päärni
Status: DRAFT
merged_from: [thinkingbox.md, done-is-a-command-result.md]
note: "Visual not yet made — the SVG is a to-do. Merged text needs fresh HIC approval even though thinkingbox.md was approved."
---

# Done Is Evidence, Not a Claim

On 28 September an agent told us a governance gap was "fully closed."

It was not. The commit had never left the machine. Production never called the new code. The test that marked the gap was still sitting there, waiting.

## The silent failure problem

Your agents run. The transcript looks good. The user says "thanks." Then you check the database, the API logs, the side effects — and nothing happened. The agent hallucinated success.

This is the gap between _saying_ you did something and _doing_ it. Eval frameworks measure transcript quality. They do not measure outcomes.

For revenue engines — outbound campaigns, lead enrichment, targeting refinement, attribution — silent failures are not edge cases. They are existential. One agent that reports "campaign deployed" when nothing shipped, and your GTM burns credibility with one customer. One lead-enrichment agent that hallucinates new contact fields, and your sales team is chasing ghosts.

There are two answers, and this post is about both. The first is to audit agents where the gap shows up: in what the tools actually changed. The second is to build work so the failure cannot be reported as success in the first place.

## Audit what the tools changed: ThinkingBox

Microsoft built ThinkingBox to solve exactly this problem. At Lifetime, we have forked the repository, tailored it for revenue engines, and packaged it with DGX integration and 507 business-domain benchmarks.

ThinkingBox runs agents in isolated, stateful tool environments via Model Context Protocol (MCP) servers. Each conversation spawns isolated tool processes with stdio transport, so every test case runs in a clean, reproducible sandbox.

The architecture inspects three things that transcript-only evals miss:

- **Stateful workflows.** Real tool use is stateful — create a resource, update it, query the result. Most evals run single-turn calls. ThinkingBox lets agents execute multi-step workflows (call the API, check the response, retry or adapt) and inspects what the tools actually changed.
- **Simulated users.** Agents often ask clarifying questions. ThinkingBox simulates user responses (via an LLM or prompt-driven) and verifies that the agent's final answer matches the spec. Single-turn evals miss this entirely.
- **Side effect inspection.** The real signal is not "the agent said it worked." It is "the database shows the change," "the API returned success," or "the file was created." ThinkingBox inspects state before and after, flagging hallucinations where the agent claimed success but the tools show failure.

## ThinkingBox-Bench: 507 real workflows

We ship ThinkingBox-Bench with 507 executable tasks across five business domains:

- **Outbound and GTM:** campaign deployment, lead scoring, audience refinement.
- **Data enrichment:** contact lookup, attribute extraction, data quality checks.
- **Attribution and analytics:** event correlation, funnel analysis, cohort definition.
- **Content and knowledge:** document processing, semantic search, knowledge base updates.
- **Integration and orchestration:** API handoffs, cross-system sync, error recovery.

Each task includes synthetic records, expected outcomes and pre-built MCP servers. You run your agent against it and get a pass or fail on actual side effects — not transcript sentiment.

## Local first, on DGX

Open models on a desk-side NVIDIA DGX Spark now write real code. Not demos. Test suites, fixes, refactors. The tokens are ours, the data stays in the building, and the meter does not run.

ThinkingBox runs there too. Our agent workloads default to local compute; cloud agents are secondary and need a documented reason. Each ThinkingBox-Bench task is a subprocess spawn plus an LLM call, and running 507 tasks × 20 iterations in the cloud is expensive. Locally, subprocess spawning is free — only LLM inference is billed. Development and staging run the bench on DGX through MCP process isolation, isolated completely from production data. Before promotion, every agent workflow runs the full bench. No surprises in production.

## A harness where "done" is a command result

Auditing catches the failure afterwards. The harness is how we build work so that "done" cannot be a sentence at all.

Frontier models, Claude in our case, are very good at the other half of the job: breaking a goal into precise tasks, reviewing a diff, spotting what is out of scope. So we paired them with the local models. And because pairing is not a plan, here is the honest part.

**The frontier model plans.** For every task it writes a small spec with checks — commands that must pass when the work is right. Every check has to fail before the work starts. A check that already passes proves nothing, so the harness refuses it.

**The local agent builds.** It runs on the DGX in fresh rounds, one task at a time, until a gate says done. Not until the agent says done. The gate runs the commands: committed, pushed, formatted, typed, linted, tested, and the task's own checks. Then it opens a pull request. It never merges.

**The frontier model reviews and merges**, one at a time, after CI is green. A human decides what ships, and reads every word that goes public.

The "fully closed" gap from the opening is exactly what this gate exists for: an unpushed commit and a still-open test are both command results, and both say no.

## What the first day showed

The loop shipped test suites for four agents, and the tests found three real bugs in the code they covered. That is the good news, and it is real.

The first two pull requests also passed our gate and failed CI. Our gate did not run the linter; CI did. For one morning, "done" meant less on our machine than in the repository. We added the linter to the gate the same day.

A third pull request passed every check and still changed a base class it had no business touching. No command noticed. A reviewer did.

## What neither tool promises

> **The honest part.** A gate is only as strong as its weakest check. It cannot see scope, intent or taste. It will pass wrong work that its checks do not describe. Three pull requests are a story, not a statistic — we will publish numbers when we have enough of them.

The same holds for a benchmark: it measures the outcomes its tasks describe, and nothing else. Evidence narrows the room for a false "done"; it does not replace a reviewer.

## Records and oversight under the EU AI Act

The EU AI Act asks for records of what an automated system did (Article 12) and for real human oversight (Article 14). Both halves of this approach produce the first as a side effect. A green ThinkingBox-Bench run is auditable, reproducible, and measures outcomes — not hallucination. In the harness, every task has a spec, every "done" has a command log, every merge has a human or a reviewer behind it.

What neither produces for free is the reason a change was allowed. That has to be written before the work starts, in the spec, next to the checks. Rationale reconstructed afterwards is not a record; it is a story.

Human-in-Command stops being a meeting. It becomes the last step of a pipeline that already told you the truth.

## From eval to production

ThinkingBox validates agents before deployment. Once live, the DWS Dashboard monitors them in production, with optional Aspire telemetry. Its views are the Digital Office (agent workstation status), the Control Room (a NOC-style grid of CPU, memory, task progress and cost per request) and the Situation Room (executive alerts and a confidence drift timeline). Aspire feeds the Control Room with agent decision traces (model inputs, tool calls, outputs), tool latency and error rates, token usage and cost per agent, MCP server health, and end-to-end tracing across multi-agent handoffs.

Imagine deploying 50 agents, and one starts hallucinating subtly on Tuesdays. Without traces, your team debugs blind. With traces, the confidence drift detector flags the anomaly, the agent traces show precisely which tool calls diverged, and you can pinpoint the model temperature or prompt change responsible.

## For founders and teams

- **Investors ask: "How do you know your agents work?"** A green bench run and a gate log are the answer.
- **Your team needs confidence.** One agent that fails silently costs more than a day of eval infrastructure.
- **Revenue engines are binary.** Your enrichment agent either enriched the lead or it did not. Your outbound agent either deployed the campaign or it lied about it.

To start with ThinkingBox, clone our fork, [github.com/blogtheristo/dws-thinkingbox](https://github.com/blogtheristo/dws-thinkingbox) (MCP session proxy, agent/user/judge loop, 507 benchmarks, DGX runner config), next to the upstream harness and process isolation layer at [github.com/microsoft/thinkingbox](https://github.com/microsoft/thinkingbox). Define tool mocks as MCP servers, write scenarios and test cases in YAML, run `tb infer` against ThinkingBox-Bench with your agent, and use the results as CI gates and audit trails.

## The short version

- The transcript is what users see. Evidence is what actually happened.
- Audit side effects, not transcript sentiment.
- Let the frontier model write the checks. Let local models on your own hardware do the work.
- Every check must fail before the work starts.
- "Done" is a command result, never a sentence — and the gate must be at least as strict as CI.
- Scope is still a human job.
- The log of what happened falls out of the process for free. The reason a change is allowed does not — write it into the spec before the work starts.

---

_Risto Anton Päärni — Founder, CEO, Lifetime Oy · Editor in Chief, Lifetime Scope Journal · risto.paarni@lifetime.fi_
