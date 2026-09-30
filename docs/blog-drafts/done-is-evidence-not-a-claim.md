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
customer_value: "An enterprise buyer spends less reviewer time re-checking agent claims: a change counts as done only when a gate command shows it committed, pushed, tested and passing checks that failed before the work began, and the log of that result is the audit record — the gate DWS runs on its own repository today, not yet a packaged customer product."
claims_checked: 2026-09-30
routes: [truth, roadmap, sales]
sources:
  - title: "One Success Isn't Reliability: Thinkingbox, a Sandbox and Benchmark for Agents in Stateful Business Workflows"
    authors: "Ko, Y.; Keramati, A.; Ferri, N.; Palmaz Lopez Pelaez, S.; Tsai, L.-C.; Wang, C.; Milletari, M.; Kundu, T.; Smolyakov, V.; Ólafsson, K.; Guy, T."
    year: 2026
    venue: "arXiv preprint arXiv:2608.19741"
    url: https://arxiv.org/abs/2608.19741
    type: academic
  - title: "thinkingbox: a framework for defining tools as MCP servers, running LLM agents against them, and evaluating agent behavior"
    authors: "Microsoft"
    year: 2026
    venue: "GitHub repository"
    url: https://github.com/microsoft/thinkingbox
    type: primary
  - title: "thinkingbox-data: ThinkingBox-Bench v1.0 dataset and tool-server library"
    authors: "Microsoft"
    year: 2026
    venue: "GitHub repository"
    url: https://github.com/microsoft/thinkingbox-data
    type: primary
  - title: "τ-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains"
    authors: "Yao, S.; Shinn, N.; Razavi, P.; Narasimhan, K."
    year: 2024
    venue: "arXiv preprint arXiv:2406.12045"
    url: https://arxiv.org/abs/2406.12045
    type: academic
  - title: "SWE-bench: Can Language Models Resolve Real-World GitHub Issues?"
    authors: "Jimenez, C. E.; Yang, J.; Wettig, A.; Yao, S.; Pei, K.; Press, O.; Narasimhan, K."
    year: 2023
    venue: "arXiv preprint arXiv:2310.06770"
    url: https://arxiv.org/abs/2310.06770
    type: academic
  - title: "Why Do Multi-Agent LLM Systems Fail?"
    authors: "Cemri, M.; Pan, M. Z.; Yang, S.; Agrawal, L. A.; Chopra, B.; Tiwari, R.; Keutzer, K.; Parameswaran, A.; Klein, D.; Ramchandran, K.; Zaharia, M.; Gonzalez, J. E.; Stoica, I."
    year: 2025
    venue: "arXiv preprint arXiv:2503.13657"
    url: https://arxiv.org/abs/2503.13657
    type: academic
  - title: "Regulation (EU) 2024/1689 laying down harmonised rules on artificial intelligence (Artificial Intelligence Act), Articles 12 and 14"
    authors: "European Parliament and Council of the European Union"
    year: 2024
    venue: "Official Journal of the European Union, OJ L 2024/1689"
    url: https://eur-lex.europa.eu/eli/reg/2024/1689/oj
    type: regulation
---

# Done Is Evidence, Not a Claim

On 28 September an agent told us a governance gap was "fully closed."

It was not. The commit had never left the machine. Production never called the new code. The test that marked the gap was still sitting there, waiting.

## The silent failure problem

Your agents run. The transcript looks good. The user says "thanks." Then you check the database, the API logs, the side effects — and nothing happened. The agent hallucinated success. [1, 6]

This is the gap between _saying_ you did something and _doing_ it. Many evaluations still check the transcript or the function call, not whether the work got done. [1]

For revenue engines — outbound campaigns, lead enrichment, targeting refinement, attribution — silent failures are not edge cases. They are existential. One agent that reports "campaign deployed" when nothing shipped, and your GTM burns credibility with one customer. One lead-enrichment agent that hallucinates new contact fields, and your sales team is chasing ghosts.

There are two answers, and this post is about both. The first is to audit agents where the gap shows up: in what the tools actually changed. The second is to build work so the failure cannot be reported as success in the first place.

## Audit what the tools changed: ThinkingBox

Microsoft built ThinkingBox to solve exactly this problem. [1, 2] At Lifetime, we have forked the repository to run it against our own agents.

ThinkingBox runs agents in isolated, stateful tool environments via Model Context Protocol (MCP) servers. Each conversation spawns isolated tool processes with stdio transport, so every test case runs in a clean, reproducible sandbox. [1, 2, 3]

The architecture inspects three things that transcript-only evals miss:

- **Stateful workflows.** Real tool use is stateful — create a resource, update it, query the result. Most evals run single-turn calls. ThinkingBox lets agents execute multi-step workflows (call the API, check the response, retry or adapt) and inspects what the tools actually changed. [1, 4]
- **Simulated users.** Agents often ask clarifying questions. ThinkingBox simulates user responses (via an LLM or prompt-driven) and verifies that the agent's final answer matches the spec. Single-turn evals miss this entirely. [1, 2, 4]
- **Side effect inspection.** The real signal is not "the agent said it worked." It is "the database shows the change," "the API returned success," or "the file was created." ThinkingBox inspects state before and after, flagging hallucinations where the agent claimed success but the tools show failure. [1, 3]

## ThinkingBox-Bench: 507 real workflows

Microsoft's ThinkingBox-Bench has 507 executable tasks across five business domains: retail and e-commerce, travel and hospitality, auto insurance, internal IT support at a neobank, and IT and HR support at a consulting firm. [1, 3]

The numbers are the argument. The strongest model in the paper passes 65 % of tasks on the first try and solves 91 % at least once in twenty attempts, but gets only 25 % right in all twenty. [1] One success is not reliability.

Each task comes with expected outcomes and isolated MCP tool sessions. You run your agent against it and get a pass or fail on actual side effects — not transcript sentiment. [1, 3]

## Local first, on DGX

Open models on a desk-side NVIDIA DGX Spark now write real code. Not demos. Test suites, fixes, refactors. The tokens are ours, the data stays in the building, and the meter does not run.

ThinkingBox runs there too. Our agent workloads default to local compute; cloud agents are secondary and need a documented reason. Running 507 tasks × 20 attempts in the cloud is expensive, so we are bringing the bench to the DGX, isolated from production data. That runner is work in progress, not yet a shipped configuration.

## A harness where "done" is a command result

Auditing catches the failure afterwards. The harness is how we build work so that "done" cannot be a sentence at all.

Frontier models, Claude in our case, are very good at the other half of the job: breaking a goal into precise tasks, reviewing a diff, spotting what is out of scope. So we paired them with the local models. And because pairing is not a plan, here is the honest part.

**The frontier model plans.** For every task it writes a small spec with checks — commands that must pass when the work is right. Every check has to fail before the work starts. A check that already passes proves nothing, so the harness refuses it. [5]

**The local agent builds.** It runs on the DGX in fresh rounds, one task at a time, until a gate says done. Not until the agent says done. The gate runs the commands: committed, pushed, formatted, typed, linted, tested, and the task's own checks. Then it opens a pull request. It never merges.

**The frontier model reviews and merges**, one at a time, after CI is green. A human decides what ships, and reads every word that goes public.

The "fully closed" gap from the opening is exactly what this gate exists for: an unpushed commit and a still-open test are both command results, and both say no.

## What the first day showed

The loop shipped test suites for four agents, and the tests found three real bugs in the code they covered. That is the good news, and it is real.

The first two pull requests also passed our gate and failed CI. Our gate did not run the linter; CI did. For one morning, "done" meant less on our machine than in the repository. We added the linter to the gate the same day.

A third pull request passed every check and still changed a base class it had no business touching. No command noticed. A reviewer did.

## What neither tool promises

> **The honest part.** A gate is only as strong as its weakest check. It cannot see scope, intent or taste. It will pass wrong work that its checks do not describe. [6] Three pull requests are a story, not a statistic — we will publish numbers when we have enough of them.

The same holds for a benchmark: it measures the outcomes its tasks describe, and nothing else. [1] Evidence narrows the room for a false "done"; it does not replace a reviewer.

## Records and oversight under the EU AI Act

For high-risk AI systems, the EU AI Act asks for records of what the system did (Article 12) and for real human oversight (Article 14). [7] Both halves of this approach produce the first as a side effect. A green ThinkingBox-Bench run is auditable, reproducible, and measures outcomes — not hallucination. [1] In the harness, every task has a spec, every "done" has a command log, every merge has a human or a reviewer behind it.

What neither produces for free is the reason a change was allowed. That has to be written before the work starts, in the spec, next to the checks. Rationale reconstructed afterwards is not a record; it is a story.

Human-in-Command stops being a meeting. It becomes the last step of a pipeline that already told you the truth.

## From eval to production

ThinkingBox validates agents before deployment. Once live, the DWS Dashboard monitors them in production, with optional Aspire telemetry. Its views are the Digital Office (agent workstation status), the Control Room (a NOC-style grid of CPU, memory, task progress and cost per request) and the Situation Room (executive alerts and a confidence drift timeline). Aspire feeds the Control Room with agent decision traces (model inputs, tool calls, outputs), tool latency and error rates, token usage and cost per agent, MCP server health, and end-to-end tracing across multi-agent handoffs.

Imagine deploying 50 agents, and one starts hallucinating subtly on Tuesdays. Without traces, your team debugs blind. With traces, the confidence drift detector flags the anomaly, the agent traces show precisely which tool calls diverged, and you can pinpoint the model temperature or prompt change responsible.

## For founders and teams

- **Investors ask: "How do you know your agents work?"** A green bench run and a gate log are the answer.
- **Your team needs confidence.** One agent that fails silently costs more than a day of eval infrastructure.
- **Revenue engines are binary.** Your enrichment agent either enriched the lead or it did not. Your outbound agent either deployed the campaign or it lied about it.

To start with ThinkingBox, clone our fork, [github.com/blogtheristo/dws-thinkingbox](https://github.com/blogtheristo/dws-thinkingbox) (our working fork), next to the upstream harness and process isolation layer at [github.com/microsoft/thinkingbox](https://github.com/microsoft/thinkingbox). Define tool mocks as MCP servers, write scenarios and test cases in YAML, run `tb infer` against ThinkingBox-Bench with your agent, and use the results as CI gates and audit trails. [2]

## The short version

- The transcript is what users see. Evidence is what actually happened.
- Audit side effects, not transcript sentiment.
- Let the frontier model write the checks. Let local models on your own hardware do the work.
- Every check must fail before the work starts.
- "Done" is a command result, never a sentence — and the gate must be at least as strict as CI.
- Scope is still a human job.
- The log of what happened falls out of the process for free. The reason a change is allowed does not — write it into the spec before the work starts.

## Sources

1. Ko, Y., Keramati, A., Ferri, N., et al. (2026). _One Success Isn't Reliability: Thinkingbox, a Sandbox and Benchmark for Agents in Stateful Business Workflows._ arXiv:2608.19741. https://arxiv.org/abs/2608.19741
2. Microsoft (2026). _thinkingbox_ — framework for tools as MCP servers, agent runs and outcome evaluation. GitHub. https://github.com/microsoft/thinkingbox
3. Microsoft (2026). _thinkingbox-data_ — ThinkingBox-Bench v1.0 dataset and tool servers. GitHub. https://github.com/microsoft/thinkingbox-data
4. Yao, S., Shinn, N., Razavi, P., Narasimhan, K. (2024). _τ-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains._ arXiv:2406.12045. https://arxiv.org/abs/2406.12045
5. Jimenez, C. E., Yang, J., Wettig, A., Yao, S., Pei, K., Press, O., Narasimhan, K. (2023). _SWE-bench: Can Language Models Resolve Real-World GitHub Issues?_ arXiv:2310.06770. https://arxiv.org/abs/2310.06770
6. Cemri, M., Pan, M. Z., Yang, S., et al. (2025). _Why Do Multi-Agent LLM Systems Fail?_ arXiv:2503.13657. https://arxiv.org/abs/2503.13657
7. Regulation (EU) 2024/1689 (Artificial Intelligence Act), Art. 12 (Record-keeping) and Art. 14 (Human oversight). Official Journal of the European Union. https://eur-lex.europa.eu/eli/reg/2024/1689/oj

---

_Risto Anton Päärni — Founder, CEO, Lifetime Oy · Editor in Chief, Lifetime Scope Journal · risto.paarni@lifetime.fi_
