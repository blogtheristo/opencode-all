# DWS IQ Agent Swarm Architecture

***

# VERSION AND AGENT HISTORY

Version: 0.10

Sessions & Modifications:

- Version: 0.10 | Tool: Claude Code | Session: claude/agent-swarm-architecture-zPf5Z | Date: 09.06.2026 | Changes: Added §8 "Point the Swarm at the Ontology, Not the Data" — DWS-original principle (root ONTOLOGY.md / Lifetime World Model, Karp enterprise-AI insight); constrains §3.2 Subagents and §3.4 Memory so N workers read governed ontology concepts, not raw data; updated attribution
- Version: 0.9 | Tool: Claude Code | Session: claude/agent-swarm-architecture-zPf5Z | Date: 09.06.2026 | Changes: Codified §6 patterns as the parameterized `/swarm` slash command (`.claude/commands/swarm.md`) and registered it in `docs/DWS_SKILLS_GUIDE.md` §4.5; linked §6 to the skill; corrected document dates to 09.06.2026
- Version: 0.8 | Tool: Claude Code | Session: claude/agent-swarm-architecture-zPf5Z | Date: 09.06.2026 | Changes: Reworked §6 to canonical pattern names (classify-and-act, fan-out-and-synthesize, adversarial verification, generate-and-filter, tournament/compare, loop-until-done); added "recurring patterns become standing skills" tie-in to the Skill Codification Rule and /goal flow; sourced article https://www.productcompass.pm/p/claude-code-dynamic-workflows
- Version: 0.7 | Tool: Claude Code | Session: claude/agent-swarm-architecture-zPf5Z | Date: 09.06.2026 | Changes: Added §7 Worked Example — six-stage discovery loop (Extract/Canonicalize/Score/Ideate+triage/Build/Inspect+loop); model tiering, free code glue, confidence-gated escalation, generator≠judge, targeted rerun; DWS analogue (kb compile, field-note→artifact)
- Version: 0.6 | Tool: Claude Code | Session: claude/agent-swarm-architecture-zPf5Z | Date: 09.06.2026 | Changes: Added §6 Swarm Operation Patterns (classify, synthesize, verify, filter, compare, loop) mapped to DWS agents/skills
- Version: 0.5 | Tool: Claude Code | Session: claude/agent-swarm-architecture-zPf5Z | Date: 09.06.2026 | Changes: Expanded §3.7 with "why move the orchestrator off the model" — the code harness owns Order/Routing/Stop condition/Model choice; properties (determinism, context isolation, free routing, model tiering); failures prevented (stops early, grades itself, forgets goal), each mapped to DWS
- Version: 0.4 | Tool: Claude Code | Session: claude/agent-swarm-architecture-zPf5Z | Date: 09.06.2026 | Changes: Added §5 Static vs Dynamic Workflows (n8n-style standing service vs model-authored throwaway glue; "agents reason, glued by zero-token code") and where DWS sits; updated attribution
- Version: 0.3 | Tool: Claude Code | Session: claude/agent-swarm-architecture-zPf5Z | Date: 09.06.2026 | Changes: Added Source & Attribution — conceptual framework (§1, §2, §3.7) adapted from Paweł Huryn, The Product Compass; clarified that §3 DWS mapping (Lifetime Scope Signals etc.) and §4 are original to this repo
- Version: 0.2 | Tool: Claude Code | Session: claude/agent-swarm-architecture-zPf5Z | Date: 09.06.2026 | Changes: Added §3.7 design principle "routing is workflow, not model" (the expensive reasoning stays with workers; routing handled by deterministic workflow / signal dependency map)
- Version: 0.1 | Tool: Claude Code | Session: claude/agent-swarm-architecture-zPf5Z | Date: 09.06.2026 | Changes: Initial creation — Section 1 (What is an agent swarm?) and the six building blocks, mapped onto the DWS IQ implementation (MCP Hub workflow patterns, Lifetime Scope Signals, KYA guardrails)

Session Links & References:

- Claude Code (claude/agent-swarm-architecture-zPf5Z): https://github.com/blogtheristo/dws6/commits/claude/agent-swarm-architecture-zPf5Z
- View on GitHub: https://github.com/blogtheristo/dws6/blob/main/docs/AGENT_SWARM_ARCHITECTURE.md

Document Status:

- Created: 09.06.2026
- Last Modified: 09.06.2026
- Language: English
- Languages Available: English
- Publication Status: DRAFT

---

**Version:** 0.10
**Purpose:** Architectural reference for how DWS IQ runs agents as a coordinated swarm rather than a sequential chain
**Audience:** Architects, Builder Agent, anyone adding agents under `src/agents/` or workflows under `mcp-hub/`
**Related:** [AGENTS.md](../AGENTS.md), [AI_AGENT_GUIDELINES.md](../AI_AGENT_GUIDELINES.md), [docs/Deputy-Agents-Architecture.md](Deputy-Agents-Architecture.md)

## Table of Contents

1. [What Is an Agent Swarm?](#1-what-is-an-agent-swarm)
2. [The Six Building Blocks](#2-the-six-building-blocks)
3. [How DWS IQ Implements the Six Blocks](#3-how-dws-iq-implements-the-six-blocks)
4. [When to Use a Swarm (and When Not To)](#4-when-to-use-a-swarm-and-when-not-to)
5. [Static vs Dynamic Workflows](#5-static-vs-dynamic-workflows)
6. [Swarm Operation Patterns](#6-swarm-operation-patterns)
7. [Worked Example: A Six-Stage Discovery Loop](#7-worked-example-a-six-stage-discovery-loop)
8. [Point the Swarm at the Ontology, Not the Data](#8-point-the-swarm-at-the-ontology-not-the-data)

---

## 1. What Is an Agent Swarm?

An agent swarm is **multiple agents working simultaneously on decomposed subtasks, coordinated by an orchestrator that aggregates the results.**

The distinction from a sequential chain is the whole point:

- **Sequential chain:** Agent A runs, hands off to B, B hands off to C. Total time = A + B + C.
- **Swarm:** The orchestrator splits the goal, agents A, B, C run at the same time on independent subtasks, and results get merged. Total time ≈ max(A, B, C).

When a task has genuine parallel structure, that is the difference between minutes and hours.

A swarm also solves **context overflow.** One agent on a long task accumulates tokens until its window drowns. A swarm gives each subtask its own bounded context, and only structured output flows back to the orchestrator.

```
SEQUENTIAL CHAIN                         SWARM
                                         ┌──────────────┐
  ┌───┐   ┌───┐   ┌───┐                  │ Orchestrator │
  │ A │──▶│ B │──▶│ C │                  └──────┬───────┘
  └───┘   └───┘   └───┘              decompose  │  aggregate
                                    ┌───────────┼───────────┐
  time = A + B + C                  ▼           ▼           ▼
                                  ┌───┐       ┌───┐       ┌───┐
                                  │ A │       │ B │       │ C │
                                  └───┘       └───┘       └───┘
                                       time ≈ max(A, B, C)
```

---

## 2. The Six Building Blocks

Every swarm has the same core components. Get these six right and you have a swarm. Get any one wrong and you have an expensive debugging session.

| Component             | What It Does                                                                       |
| --------------------- | --------------------------------------------------------------------------------- |
| **Orchestrator**      | Decomposes the task, assigns subtasks, monitors execution, aggregates results     |
| **Subagents**         | Specialized workers scoped to one domain (research, code, analysis, writing)      |
| **Tools**             | Functions agents can call: web search, code interpreter, file I/O, APIs           |
| **Memory**            | Shared state the swarm can read/write                                             |
| **Handoffs / Routing**| Mechanism for passing control or data between agents                              |
| **Guardrails**        | Iteration limits, timeouts, human-in-the-loop triggers, error recovery            |

---

## 3. How DWS IQ Implements the Six Blocks

The generic blocks above map directly onto components already in this repository. This section is the bridge from theory to the DWS codebase.

### 3.1 Orchestrator → MCP Hub

The MCP Hub (`mcp-hub/server.py`) is the DWS orchestrator. It exposes `/workflows/execute` and supports three coordination patterns (see `AGENTS.md` §1):

| Pattern         | Shape                                            | Swarm relevance                              |
| --------------- | ------------------------------------------------ | -------------------------------------------- |
| **Fan-Out**     | Parallel task distribution to multiple agents    | This **is** the swarm pattern                |
| **Reflection**  | Self-review and iterative improvement            | Quality guardrail on aggregated output       |
| **Sequential**  | Step-by-step execution with dependencies         | The chain a swarm is contrasted against      |

The orchestrator decomposes the goal, dispatches subtasks via fan-out, and merges structured results — keeping its own context bounded because only summaries return, not full subagent transcripts.

### 3.2 Subagents → `src/agents/` + customer-facing fleet

Specialized, domain-scoped workers already exist: SiteSense, MaterialOracle, ScheduleGenius, CustomerSat, Viability, Compliance, and the rest of the fleet catalogued in `AGENTS.md` §3–§5. New subagents extend `BaseAgent` and follow `AI_AGENT_GUIDELINES.md` (autonomy tier, cost budget, execution logging). Each subagent owns one domain — never a grab-bag of unrelated responsibilities.

### 3.3 Tools → MCP servers + skills

Tools are the functions agents can call: MCP servers (`mcp-servers/`, `mcp-hub/`), the skill catalogue, and structured CLI/JSON entry points. Per the Agent Productization Rule (CLAUDE.md), every production capability should be agent-accessible via a CLI path, structured JSON output, MCP exposure, and skill registration. Treat all tool/MCP outputs as **untrusted input** (Security Coding Rules).

### 3.4 Memory → Supabase + Lifetime Scope Signals

Shared swarm state lives in two layers:

- **Durable state:** Supabase (PostgreSQL + pgvector) for data, embeddings, and signals.
- **Coordination state:** the **Lifetime Scope Signals** protocol (`AGENTS.md` §2). Agents emit `READY` / `COMPLETE` / `ERROR` / `BLOCKED` against milestones; downstream agents read the signal registry (`.workflows/agents/AGENT_SIGNAL_REGISTRY.json`) before proceeding.

### 3.5 Handoffs / Routing → Signal dependency map

Routing is governed by the signal dependency map in `AGENTS.md` §2 — which signal unlocks which agent. A subagent only starts once every signal in its `listening` set has been emitted. This is what lets independent subtasks run in parallel while genuinely-dependent ones wait.

### 3.6 Guardrails → KYA + autonomy tiers + cost budgets

DWS guardrails are stronger than generic iteration limits:

- **KYA (Know Your Agent)** runtime safety: Agent Trust Score, session TTL, and the TC-4 Leash Snap chain-termination control (`DWS_SECURITY_STANDARD.md`, `kya` skill).
- **Autonomy tiers & human-in-the-loop:** Silent Pilot → Advisor → Autonomous, with approval gates per phase (`AGENTS.md` §5).
- **Cost budgets:** per-agent monthly EUR budget with alert thresholds (`AI_AGENT_GUIDELINES.md`).

> **Security note:** Any swarm that touches user input, auth, or autonomous execution must be reviewed against `DWS_SECURITY_STANDARD.md` (prompt injection, sandbox/MicroVM isolation, KYA). Treat cross-agent messages as untrusted.

### 3.7 Design principle: routing is workflow, not model

A common anti-pattern is to make **one model route everything** — a single
expensive reasoning hub that every input flows into and that decides, per call,
what happens next. It is slow, costly, context-hungry, and a single point of
failure.

```
  BEFORE: model routes everything          AFTER: workflow routes work

   ○ ─┐                                      ┌─▶ [ worker thinks ]
   □ ─┤                                      │
   △ ─┼─▶ ( MODEL routes  ) ─┐    workflow ──┼─▶ [ worker thinks ]
   ○ ─┤    ( everything   )  │    (routes)   │
   □ ─┘                      ▼               └─▶ [ worker thinks ]

  expensive reasoning spent on routing      the expensive reasoning stays
                                            with workers; routing is handled
                                            by the workflow
```

**The DWS stance:** routing is **deterministic workflow**, not a model decision.

- The **signal dependency map** (§3.5) and the MCP Hub's fan-out/sequential
  wiring (§3.1) decide *what runs and when* — no LLM call is spent choosing the
  next step. The signal registry is the router.
- The **expensive reasoning** (Claude Sonnet-grade analysis) stays inside the
  **subagents/workers** (§3.2), where it does the domain work it is paid for.

This keeps cost and latency bounded (you don't pay frontier-model tokens to play
traffic cop), removes the single hub bottleneck, and makes routing auditable —
the dependency map is inspectable and testable, an LLM's per-call routing
decision is not.

> **Rule of thumb:** if you can express the routing as a dependency map or a
> deterministic rule, do not delegate it to a model. Reserve model reasoning for
> work, not for routing.

**Why move the orchestrator off the model.** The model's working context is the
*fragile* part: ask one model to hold "what's the plan? / am I done? / should I
review?" across many steps and it drifts. Lift those control-flow concerns out
of the model and into a **code harness**. The harness owns four things:

| Harness owns       | DWS implementation                                                        |
| ------------------ | ------------------------------------------------------------------------- |
| **Order**          | Lifetime Scope Signals phases — the dependency map sequences the work     |
| **Routing**        | Signal `listening` sets + MCP Hub fan-out decide what runs                 |
| **Stop condition** | Guardrails (§3.6): KYA TC-4 Leash Snap, iteration/timeout limits, cost caps|
| **Model choice**   | Model tiering — Groq (fast) for cheap steps, Claude Sonnet for deep reasoning (`AGENTS.md` Technology Stack) |

What the harness buys you: **determinism**, **context isolation** (each worker
gets a bounded window), **free routing** (no token cost to decide the next
step), and **model tiering** (spend frontier tokens only where reasoning is
needed).

**Failures a code harness prevents** — all three are failure modes of letting
the model orchestrate itself:

- **Stops early** — model declares "done" before the work is complete. The
  harness only advances on an explicit `COMPLETE` signal.
- **Grades itself** — model marks its own output as correct. Evaluation belongs
  to a separate reflection step / external check, not the worker's self-report.
- **Forgets the goal** — goal drifts out of the context window over a long run.
  The harness holds the goal (registry / workflow definition); the model does
  not have to remember it.

### Block-to-DWS summary

| Generic block          | DWS IQ implementation                                              |
| ---------------------- | ----------------------------------------------------------------- |
| Orchestrator           | MCP Hub `/workflows/execute` (fan-out / reflection / sequential)  |
| Subagents              | `src/agents/` (BaseAgent), customer-facing fleet                  |
| Tools                  | MCP servers, skills, CLI/JSON capability surfaces                 |
| Memory                 | Supabase (pgvector) + Lifetime Scope Signals registry             |
| Handoffs / Routing     | Signal dependency map (READY/COMPLETE/ERROR/BLOCKED)             |
| Guardrails             | KYA, autonomy tiers + HIL, per-agent cost budgets                 |

---

## 4. When to Use a Swarm (and When Not To)

A swarm pays off **only when the task has genuine parallel structure.** Decompose into a swarm when:

- Subtasks are independent (no subtask needs another's output mid-flight).
- Each subtask is bounded and benefits from its own context window.
- Wall-clock latency matters and `max(A, B, C)` ≪ `A + B + C`.

Stay sequential (or single-agent) when:

- Each step strictly depends on the previous step's output — the dependency map would serialize everything anyway.
- The task is small enough to fit one bounded context without overflow.
- Coordination overhead (decompose + aggregate + reconcile) would exceed the time saved.

The signal dependency map (§3.5) is the deciding artifact: if every agent is `listening` for the one before it, you have a chain wearing a swarm's clothing.

---

---

## 5. Static vs Dynamic Workflows

The orchestrator (§3.1) raises a second question independent of swarm-vs-chain:
**who authors the workflow, and when?** Two styles:

| Aspect            | Static workflow (e.g. n8n)            | Dynamic workflow                                      |
| ----------------- | ------------------------------------- | ----------------------------------------------------- |
| **Who builds it** | You, as a visual graph                | The model (Claude), per task                          |
| **When**          | Once, upfront                         | On the fly, for this job                              |
| **The steps are** | Fixed nodes                           | Agents that reason, glued by **zero-token code**      |
| **It lives as**   | A standing service (self/cloud-hosted)| A `.js` file the model writes — saved or tossed       |
| **Reach for it when** | Wiring SaaS: triggers, schedules  | The shape depends on the input, or you need it once   |

The phrase that matters: **agents reason; deterministic, zero-token code does
the gluing.** This is §3.7 restated from the authoring angle — the orchestration
glue should not burn model tokens, whether it is a standing graph or a
throwaway script.

### Where DWS IQ sits

DWS uses **both**, and the choice is the same as §4 (does the shape repeat?):

- **Static — the default for production.** The MCP Hub
  (`/workflows/execute`, fan-out / reflection / sequential) and the Lifetime
  Scope Signals dependency map are the standing service. Recurring, governed
  flows — construction assessment, compliance pipelines, scheduled cron work —
  live here. They are auditable, KYA-governed (§3.6), and built once.
- **Dynamic — for one-off or input-shaped tasks.** When the shape depends on the
  input or the job runs once, an agent can compose a throwaway orchestration
  (skill invocation + glue) per task rather than registering a permanent
  workflow. The glue stays deterministic code; the reasoning stays in the
  workers.

> **Rule of thumb:** if the workflow shape repeats, codify it as a standing MCP
> Hub pattern + signals (and, per the Skill Codification Rule, a skill). If the
> shape is one-off or input-dependent, generate it dynamically and toss it.
> Either way, routing/glue is zero-token deterministic code — never a model
> playing traffic cop.

---

## 6. Swarm Operation Patterns

Once the orchestrator is code, six shapes recur. Learn the names — they are how
you recognize what a task wants. Each is a shape the orchestrator (§3.1) wires;
the code harness (§3.7) glues them with zero-token routing.

| Pattern                     | Shape                                                  | What it does                                                | DWS examples                                                                     |
| --------------------------- | ------------------------------------------------------ | ----------------------------------------------------------- | -------------------------------------------------------------------------------- |
| **Classify-and-act**        | one agent decides the type → code routes it            | Decide the category, the script routes it                   | bug vs feature vs noise triage; Themis case coordinator; lead classification     |
| **Fan-out-and-synthesize**  | one agent per piece → merged in code                   | Parallel workers, merged into one structured output         | 100 interviews → themes/JTBD table; competitor teardown; construction assessment (SiteSense + MaterialOracle + Compliance) |
| **Adversarial verification**| output → a *separate* agent checks it against a rubric | An independent agent red-teams the output                   | fact-check a PRD against its sources; pressure-test before review; quality-gate; INVEST check |
| **Generate-and-filter**     | many candidates → dedupe → keep the survivors          | Generate broadly, prune to the good ones                    | naming, positioning, ideation; `investor-outreach` triage; `regulatory-radar` scoring |
| **Tournament (compare)**    | agents attempt the task different ways → judges compare until one wins | Competing attempts, judged to a single winner   | product strategy; `competitor-surveillance`; `viability` option selection        |
| **Loop-until-done**         | spawn → check stop condition → repeat                  | Run until *done*, not until the model tires                 | implement + document + test a feature in one shot; 80 stories checked against INVEST; autoresearch (Karpathy field note); `dream-on` |

These are primitives, not silos: a real swarm chains them — **classify-and-act**
an incoming case, **fan-out-and-synthesize** across the assigned agents,
**adversarially verify** the merged result, and **loop-until-done**. Two of these
deserve emphasis because they are the antidote to the §3.7 failure modes:

- **Adversarial verification** = "doesn't grade itself." The checker is a
  *separate* agent scoring against a rubric — the generator never signs off on
  its own work.
- **Loop-until-done** = "doesn't stop early." The stop condition lives in the
  harness, so the loop reads *every* one of 100 interviews and checks *all* 80
  stories — not the first 20, not "until the model tires at 50."

### Recurring patterns become standing skills

The strategic payoff is knowing **which recurring jobs can become standing
workflows.** When the same shape shows up weekly — synthesize the latest
interviews, check every story against INVEST, red-team a PRD before review — you
do not re-prompt it each time. You **set the goal once, save the procedure as a
skill, and run it end to end** (the `/goal` flow). This is the DWS **Skill
Codification Rule** ("Asked Twice = Failure", CLAUDE.md) stated in swarm terms:
a swarm pattern you reach for twice is a skill you have not written yet. It is
also the §5 static-vs-dynamic decision — a repeating shape graduates from a
throwaway dynamic workflow into a codified standing one.

These six patterns are codified in DWS as the parameterized **`/swarm`** slash
command (`.claude/commands/swarm.md`): `/swarm PATTERN=<…> DATASET=<…>` runs the
chosen shape with a code harness (order/routing/stop/model-tiering) over DWS
worker agents. One skill, six patterns as arguments — per the Skill Codification
Doctrine (`docs/DWS_SKILLS_GUIDE.md` §13), not six near-identical files.

---

## 7. Worked Example: A Six-Stage Discovery Loop

A concrete pipeline that exercises every principle above — extracting product
needs from a pile of customer interviews:

| # | Stage             | Worker / model        | Operation (§6)        | Note                                  |
| - | ----------------- | --------------------- | --------------------- | ------------------------------------- |
| 1 | **Extract**       | Haiku × 100           | Synthesize (fan-out)  | One agent per interview; low confidence → **Sonnet retry** |
| 2 | **Canonicalize**  | Sonnet × 1            | Synthesize (merge)    | Merge synonyms into canonical needs   |
| 3 | **Score**         | Code / free           | Compare               | Rank needs 1…5 — deterministic, zero-token |
| 4 | **Ideate + triage** | Sonnet × 5 + Sonnet judge | Compare           | top 5 → top 3 (generator ≠ judge)     |
| 5 | **Build**         | Sonnet × 3            | Synthesize (fan-out)  | HTML prototypes in parallel           |
| 6 | **Inspect / loop**| Code / free           | Verify + Loop         | Rerun **only failures**: bad extract → retry, bad render → rebuild |

Every arrow between stages is **free code glue** (§3.7) — deterministic, no model
tokens spent on routing. The whole thing closes with a **targeted rerun**: stage
6 loops back to stage 1 for the failed items only, not the entire batch.

### Why this is the canonical shape

It demonstrates, in one pipeline, every principle in this document:

- **Model tiering (§3.7).** Haiku does the cheap, massively-parallel extraction
  (×100); Sonnet does the reasoning-heavy merge/ideate/judge; deterministic code
  does scoring and inspection. Frontier tokens are spent only where reasoning is
  required — this is the DWS Groq-fast / Claude-deep split (`AGENTS.md`).
- **Confidence-gated escalation.** Stage 1 promotes only low-confidence items to
  the stronger (more expensive) model — the cheap tier handles the rest.
- **Generator ≠ judge (§3.7, "grades itself").** Stage 4's Sonnet judge is a
  separate worker from the five ideators; nothing grades its own output.
- **Targeted rerun, not full rerun.** Stage 6's harness reruns only the failed
  items — bounded cost, deterministic stop condition.
- **Operations compose (§6).** Synthesize → synthesize → compare → compare →
  synthesize → verify+loop, glued by code.

### DWS analogue

The same shape drives DWS pipelines where many inputs are reduced to a ranked,
verified output — for example `kb compile` (ingest many sources → canonicalize →
score → synthesize wiki → verify) or field-note → Core Artifact elevation
(`DWS_DOCUMENT_STANDARD.md` §11–12). The transferable rule: **tier the models by
stage, glue with zero-token code, gate escalation on confidence, keep the judge
separate from the generator, and rerun only what failed.**

---

## 8. Point the Swarm at the Ontology, Not the Data

Everything above is about *how* a swarm runs. This section is about *what its
workers are allowed to see* — and it is the DWS-specific constraint that makes a
swarm safe to scale. It is canonical DWS doctrine (root `ONTOLOGY.md`; published
as `onelifetime.world/posts/point-it-at-the-ontology.html`), grounded in the
enterprise-AI insight:

> "If you just buy LLMs off the shelf and try to do any of this, it won't work.
> Once you build a software layer to orchestrate and manage the LLMs in a
> language your enterprise understands, you actually can create value."

**The trap.** The obvious way to build a swarm is to point every worker straight
at the data — the databases, the files, the APIs. *Raw LLMs on hundreds of
ungoverned databases hallucinate, leak, and cannot be audited.* Worse, each
worker invents its own notion of what an entity *means*, so the results do not
reconcile at merge time.

**The rule.** **Don't point the LLM at the data — point it at the ontology, and
point the ontology at the data.** The governed ontology (the Lifetime World
Model, `ONTOLOGY.md`) is the enterprise-specific semantic layer. Swarm workers
read and write *concepts* — Object / Sector / Geography / Regulatory anchors —
not raw rows. The ontology, in turn, is the one place wired to the data.

**What this changes for the six blocks (§3):**

- **Subagents (§3.2)** read and write **ontology concepts**, so N parallel
  workers all speak the same language — their outputs reconcile cleanly at the
  *synthesize* step (§6) instead of colliding.
- **Memory (§3.4)** — the **ontology / LWM is the shared semantic state**;
  Supabase is the substrate, the ontology is the *meaning*. Signals coordinate
  timing; the ontology coordinates meaning.
- **Routing (§3.5)** routes over ontology concepts (e.g. *classify-and-act* by
  Sector or Regulatory context), not over raw schema.
- **Guardrails (§3.6)** — marking-based policies and decision lineage live *in*
  the ontology, so every swarm action is governed and auditable end to end
  (KYA, GDPR, EU AI Act). The ontology is where "who may see what" is enforced
  once, not re-litigated per worker.

**Why this matters most for swarms.** A swarm multiplies data access by N
workers. Point N workers at raw data and you multiply hallucination, leakage,
and divergence by N. Point them at one governed ontology and the swarm scales
*meaning*, not mess — the governed ontology is the product, not the model.

**Reference:** root `ONTOLOGY.md` (DWS Ontology & Lifetime World Model);
`docs/field-notes/2026-01-21-karp-enterprise-ai-ontology.md`;
`docs/field-notes/2026-06-05-aipcon10-usda-agricultural-ontology.md`.

---

## Source & Attribution

The conceptual framework in this document — the swarm-vs-sequential-chain
distinction (§1), the six building blocks (§2), the "workflow routes work,
not the model" principle (§3.7), and the static-vs-dynamic-workflow comparison
(§5), the swarm operation patterns (§6), and the
six-stage discovery-loop worked example (§7) — is adapted from
**Paweł Huryn, _The Product Compass_** ("Step-By-Step Introduction to AI
Agents").

- Article: https://www.productcompass.pm/p/claude-code-dynamic-workflows
- Related: https://www.productcompass.pm/p/step-by-step-introduction-to-ai-agents

Section 3 (the mapping onto MCP Hub, Lifetime Scope Signals, KYA, and the DWS
agent fleet), Section 4, and Section 8 (point the swarm at the ontology — from
DWS's own `ONTOLOGY.md` / Lifetime World Model doctrine) are DWS-specific and
original to this repository.

---

_This is a living document. Section 1 and the six building blocks are stable; the DWS mapping (§3) evolves with the MCP Hub and agent fleet. Promote to `Publication Status: ACTIVE` once §3 is reviewed against the current `mcp-hub/server.py` implementation._
