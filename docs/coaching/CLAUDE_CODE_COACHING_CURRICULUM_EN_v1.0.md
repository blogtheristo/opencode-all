# Claude Code Coaching — Curriculum (EN)

---

# VERSION AND AGENT HISTORY

Version: 1.2

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code | Session: code-coaching-curriculum | Commit: pending | Date: 24.06.2026 | Changes: Initial curriculum for the Claude Code Coaching product (1-day lecture, 2-day workshop, optional client project work).
- Version: 1.1 | Tool: Claude Code | Session: team-ethos-coaching | Commit: pending | Date: 27.06.2026 | Changes: Added Appendix A — Team Ethos case study (Mustafa Suleyman, Microsoft AI) with mapping to DWS 12 Rules; referenced from M2.
- Version: 1.2 | Tool: Claude Code (Opus 4.8) | Session: claude/consultant-handbook-v1-6-622fep | Commit: pending | Date: 28.06.2026 | Changes: Added Appendix B — "Augment, not replace" module (ethical AI + EU AI Act Art. 4/12/14 literacy, roles→capabilities frame, archetype×maturity mix, /dialog working method). Sources handbook v1.75 §2/§6 and whitepaper WP01. EN+FI lockstep.

Document Status:

- Created: 24.06.2026
- Last Modified: 27.06.2026
- Language: English
- Languages Available: English, Suomi
- Publication Status: DRAFT
- Document Type: Curriculum

---

## Overview

Claude Code Coaching takes an engineering team from AI-curious to shipping real changes with Claude
Code through a governed plan → review → ship workflow. It delivers two things at once: **EU AI Act
Article 4 AI literacy** and a durable **engineering discipline** for working with an autonomous
coding agent. Coaching is EU-sovereign — the client's code and IP never leave the jurisdiction.

The product has three components:

1. **1-Day Lecture** — foundations and shared vocabulary (up to 12 participants).
2. **2-Day Workshop** — hands-on, on the client's own repository (up to 10 participants).
3. **Option: Client Project Work** — embedded, 2–6 week guided delivery on a real backlog item.

**Audience:** software engineers, tech leads, and engineering managers at EU enterprises and SMEs.
**Prerequisites:** participants can clone a repo and run their project's build/test locally; one
representative repository is nominated before the workshop.
**Delivery languages:** EN, FI, SV, DE, FR (materials authored in EN and FI).

---

## Component 1 — 1-Day Lecture: "Claude Code Foundations for Sovereign Engineering Teams"

Duration ~6 hours including breaks. Goal: every attendee shares the same model of _how_ to work
with Claude Code, and the organisation gains Article 4 literacy evidence.

| Module | Time   | Topic                                  | Learning outcome                                                                                                                                             |
| ------ | ------ | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| M1     | 45 min | The agentic shift                      | Explain what Claude Code is and where the CLI / IDE / web / desktop surfaces fit a real workflow                                                             |
| M2     | 75 min | The 12 rules of engineering discipline | Apply the rules (think before coding, surgical changes, read before write, fail loud, …) to an agent session. Case study: Appendix A — Team Ethos (Suleyman) |
| M3     | 60 min | Context engineering                    | Describe how `CLAUDE.md` project memory, skills, slash commands and MCP tools steer an agent                                                                 |
| M4     | 60 min | Trust & safety                         | Classify actions into the GREEN / YELLOW / RED trust boundary; explain EU sovereignty and IP non-egress                                                      |
| M5     | 60 min | Live demo                              | Observe a full plan → implement → review → ship cycle and identify each discipline gate                                                                      |
| Wrap   | 30 min | Q&A and adoption plan                  | Leave with a concrete first-week adoption checklist                                                                                                          |

**Assessment:** short scenario quiz (trust-boundary classification + "what would you assume vs.
ask"). Completion is recorded as Article 4 literacy evidence.

---

## Component 2 — 2-Day Workshop: "Claude Code in Practice"

Hands-on, built on the client's nominated repository. Goal: the team is productive immediately
after, the repo is restructured for agentic development, and quality governance is in place.

### Day 1 — Make it yours

- Environment & setup; safety/trust settings for the team
- Authoring `CLAUDE.md` project memory for the real repo (conventions, build/test, guardrails)
- Slash commands and skills: what exists, when to use them, writing a first skill
- Plan mode and scoping; using read-only exploration before editing
- Subagents and parallel exploration for larger changes
- Exercise: each participant authors one skill and one `CLAUDE.md` section for the repo

### Day 2 — Ship with discipline

- Wiring MCP tools and treating tool output as untrusted input
- Multi-agent / workflow patterns for larger tasks
- The discipline gates: plan → qa → review → ship, and what each gate checks
- Governance, audit logging, and the "asked twice = failure" skill-codification rule
- **Capstone:** every participant takes a real backlog item through the full gated flow and ships it
- Retrospective: what to standardise, what to codify as skills next

**Assessment:** the capstone change itself (reviewed against intent, not just behaviour) plus a
short team retro that produces a standardisation backlog.

---

## Component 3 — Option: Client Project Work (embedded)

A 2–6 week guided engagement that turns the workshop habits into shipped outcomes.

- Senior engineers embed with the team and apply Claude Code to a real backlog item end-to-end
- Co-build the skills, agents, and CI discipline gates the team will keep
- Structured knowledge transfer so the team is self-sufficient at the end
- EU-sovereign throughout; outcome-priced and scoped per engagement

The project track builds **IPR capital the company owns**, not consulting hours. Example
projects: a working **e-commerce store + productization** (JSON-driven pricing, Google Merchant
feed, multilingual product pages); **dynamic multilingual websites** that render from config;
**the company's own AI server** (EU-sovereign inference on its own hardware, zero data egress); and
**reusable agents & skills** (compliance automation, CI discipline gates).

**Definition of done:** the chosen backlog item is shipped through the gated flow; the team owns at
least three reusable skills and a green discipline-gate pipeline; a short handover note records what
was codified and what remains.

---

## Outcomes & evidence

| Outcome                                           | Evidence produced                                 |
| ------------------------------------------------- | ------------------------------------------------- |
| Shared vocabulary across leadership and engineers | Lecture attendance + scenario quiz results        |
| Claude Code productive on the client's codebase   | Authored `CLAUDE.md`, skills, and capstone change |
| Quality governance that outlasts the engagement   | Discipline-gate pipeline + codified skills        |
| EU AI Act Article 4 AI literacy                   | Curriculum record + completion log                |

## Maintenance

This curriculum is kept in lockstep with its Finnish counterpart
(`CLAUDE_CODE_COACHING_CURRICULUM_FI_v1.0.md`). Any change to one must be reflected in the other in
the same commit. Pricing referenced in the product sheet lives only in
`dws10.com/config/products.json`.

---

## Appendix A — Case Study: Team Ethos (Mustafa Suleyman, Microsoft AI)

Used in **Module M2** to show how industry leaders arrive at the same discipline principles
independently. Participants compare Suleyman's ethos with the DWS 12 Rules and identify which
principles their own team already follows vs. needs to adopt.

### The principles

> Everything below flows from one conviction: a disciplined, evidence-based, careful methodology
> compounds faster than heroic and chaotic improvisation.

1. **Scientific rigor above all else.** Set hypotheses, rigorously ablate, and make data-driven
   decisions.
2. **Constantly think simple.** Simple methods scale best. No recipe changes unless deeply
   justified.
3. **Know your data.** Data is our lifeblood. No data black boxes. Every person is responsible for
   every token they add to the model.
4. **Know your evals.** No narratives without numbers. Production evals and trust internal metrics,
   over academic benchmarks.
5. **Don't celebrate results prematurely.** Maintain healthy skepticism. Check for reward hacking.
   Never cherry pick results.
6. **Always document everything.** Positive and negative results are equally critical. Label every
   plot and axes. Summarize hypotheses and conclusions. Don't use jargon.
7. **Be precise and use neutral language.** Describe situations accurately without unnecessary
   emotional charge.
8. **Retrospectives drive everything.** The culture and process flywheel is critical to our hill
   climbing machine. We constantly run retros to iterate and improve.
9. **We're an IC-first team.** Management is a service, not the goal. We're here to empower,
   unblock and accelerate the exceptional work of our world class ICs.
10. **User focus.** We build our models for end users. Developing user empathy begins with us. We
    always strive to use our own models first so we can hill climb for our users.
11. **Take ownership for execution.** Report issues, provide logs for debugging. First try to fix
    things yourself. And see it right through to completion.

_Source: Mustafa Suleyman, CEO Microsoft AI, June 2025._

### Mapping to the DWS 12 Rules

| Suleyman principle              | DWS 12 Rule                                | Coaching discussion point                                                                |
| ------------------------------- | ------------------------------------------ | ---------------------------------------------------------------------------------------- |
| Scientific rigor                | 1 — Think before coding                    | Both demand explicit hypotheses before action                                            |
| Constantly think simple         | 2 — Simplicity first                       | "No recipe changes unless deeply justified" = reject speculative abstractions            |
| Know your data                  | 8 — Read before you write                  | Understand the material (data/code) before changing it                                   |
| Know your evals                 | 9 — Tests verify intent, not just behavior | Production evals over vanity metrics; tests that can't fail are wrong                    |
| Don't celebrate prematurely     | 12 — Fail loud                             | Healthy skepticism prevents silent success on broken foundations                         |
| Document everything             | 10 — Checkpoint every significant step     | Documentation is a checkpoint; negative results are as valuable as positive ones         |
| Precise, neutral language       | 7 — Surface conflicts, don't average them  | Precision prevents the blending that swallows errors                                     |
| Retrospectives drive everything | Learning loop (`/retro` → `/learn`)        | Both treat the process flywheel as the compounding engine                                |
| IC-first team                   | 5 — Model only for judgment calls          | Empower the people (ICs/agents) closest to the work; management/orchestration is service |
| User focus                      | 4 — Goal-driven execution                  | Define success from the user's perspective, not the builder's                            |
| Take ownership for execution    | 4 — Goal-driven execution                  | See it through to completion; loop until verified                                        |

### Exercise (15 min, part of M2)

1. Each participant picks the Suleyman principle their team is **strongest** at and the one they
   most need to **adopt**.
2. For the "adopt" principle, write one concrete action they will take in their first week with
   Claude Code (e.g., "add a `/retro` skill to our repo" or "require eval numbers in every PR
   description").
3. Share in pairs; each pair reports their top action to the group.

**The quality of our thinking determines the quality of our models — and our code.**

---

## Appendix B — Module: Augment, not replace (ethical AI + EU AI Act literacy)

**When:** Component 1 (lecture) and Component 2 Day 1. **Source:** whitepaper WP01 "Augment, Not Replace"; handbook §2 (Ihmiskeskeisyys), §6 (capability model + lifecycle).

### The position

- **Capability, not headcount. Augment, not replace.** We do not aim to reduce the customer's workforce; personnel decisions belong to leadership. AI brings new capability that lifts productivity alongside people, not in their place.
- This is both ethical (human dignity, human-in-the-loop) and strategic (regulated buyers reject "replace your team"; they buy "multiply your team").

### EU AI Act literacy (what every coached engineer must know)

- **Article 4 — AI literacy** (in force Feb 2025): teams operating AI must be trained to understand it.
- **Article 12 — logging:** every high-risk AI action is auditable; hash-chained, immutable.
- **Article 14 — human oversight:** a human stays the decision-maker; the agent handles routine.

### Roles become capabilities (teaching frame)

- 72 IT roles → 88 capabilities, skills, workflows, learning (Gödel) loops. The role stays with the human; the agent makes it faster.
- Product archetypes (Prototyper / Builder / Sweeper / Grower / Maintainer) map to lifecycle stages; the right mix depends on product and industry maturity. Teach participants to identify the stage and weight the right capabilities.

### The `/dialog` working method (hands-on)

- A HIC-confirmed, line-by-line way to update a document, offer, or attachment: propose each change, the human agrees or counters, apply and checkpoint. Especially useful for reusing an offer across customers (e.g. ORK → Kemira). Demonstrate live in M2.

### Exercise (15 min)

1. Each participant writes, in one sentence, how an agent would **augment** (not replace) one task in their own role.
2. Map that task to a lifecycle stage (Development / Deployment / Maintenance / Update) and name the human-in-the-loop checkpoint.
3. Share in pairs; report one example per pair.

**Execution can be shared with machines. Vision, judgment, and accountability stay human.**
