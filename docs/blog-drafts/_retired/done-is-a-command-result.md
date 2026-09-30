---
slug: done-is-a-command-result
lang: en
title: "Done Is a Command Result: A Harness for Local Agents, Led by a Frontier Model"
hero: "Let a frontier model write the checks and open models on your own DGX do the work — and let nothing but a command decide when it is done."
visual: infographic
visual_src: docs/blog-drafts/img/done-is-a-command-result.svg
visual_alt: "Loop from specification with failing checks, to local agent on DGX, to done gate, to pull request, to CI, to human merge"
seo_tags: [hic, article_12, skilled_agent, agent_isolation]
series: "ThinkingBox"
part: 2
target: onelifetime.world/posts/done-is-a-command-result.html
date: 2026-09-28
author: Risto Anton Päärni
Status: DRAFT
---

# Done Is a Command Result

This morning an agent told us a governance gap was "fully closed."

It was not. The commit had never left the machine. Production never called the new code. The test that marked the gap was still sitting there, waiting.

## Where this sits

In part one we named the silent failure: the transcript says success, the world says nothing happened. ThinkingBox audits agents where that gap shows up.

This is part two. Not how to catch the failure afterwards — how to build work so the failure cannot be reported as success in the first place.

## Two good things, used well

Open models on a desk-side NVIDIA DGX Spark now write real code. Not demos. Test suites, fixes, refactors. The tokens are ours, the data stays in the building, and the meter does not run.

Frontier models, Claude in our case, are very good at the other half of the job: breaking a goal into precise tasks, reviewing a diff, spotting what is out of scope.

So we paired them. And because pairing is not a plan, here is the honest part.

## The harness

The frontier model plans. For every task it writes a small spec with checks — commands that must pass when the work is right. Every check has to fail before the work starts. A check that already passes proves nothing, so the harness refuses it.

The local agent builds. It runs on the DGX in fresh rounds, one task at a time, until a gate says done. Not until the agent says done. The gate runs the commands: committed, pushed, formatted, typed, linted, tested, and the task's own checks.

Then it opens a pull request. It never merges.

The frontier model reviews and merges, one at a time, after CI is green. A human decides what ships, and reads every word that goes public.

## What the first day showed

The loop shipped test suites for four agents, and the tests found three real bugs in the code they covered. That is the good news, and it is real.

The first two pull requests also passed our gate and failed CI. Our gate did not run the linter; CI did. For one morning, "done" meant less on our machine than in the repository. We added the linter to the gate the same day.

A third pull request passed every check and still changed a base class it had no business touching. No command noticed. A reviewer did.

## What the harness does not promise

> **The honest part.** A gate is only as strong as its weakest check. It cannot see scope, intent or taste. It will pass wrong work that its checks do not describe. Three pull requests are a story, not a statistic — we will publish numbers when we have enough of them.

## Why this matters beyond our repository

The EU AI Act asks for records of what an automated system did (Article 12) and for real human oversight (Article 14). A harness like this produces the first as a side effect: every task has a spec, every "done" has a command log, every merge has a human or a reviewer behind it.

What it does not produce for free is the reason a change was allowed. That has to be written before the work starts, in the spec, next to the checks. Rationale reconstructed afterwards is not a record; it is a story.

Human in Command stops being a meeting. It becomes the last step of a pipeline that already told you the truth.

## The short version

- Let the frontier model write the checks. Let local models on your own hardware do the work.
- Every check must fail before the work starts.
- "Done" is a command result, never a sentence — and the gate must be at least as strict as CI.
- Scope is still a human job.
- The log of what happened falls out of the process for free. The reason a change is allowed does not — write it into the spec before the work starts.

---

_Risto Anton Päärni — Founder, CEO, Lifetime Oy · Editor in Chief, Lifetime Scope Journal_
