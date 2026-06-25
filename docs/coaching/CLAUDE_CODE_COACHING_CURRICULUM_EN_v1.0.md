# Claude Code Coaching — Curriculum (EN)

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code | Session: code-coaching-curriculum | Commit: pending | Date: 24.06.2026 | Changes: Initial curriculum for the Claude Code Coaching product (1-day lecture, 2-day workshop, optional client project work).

Document Status:

- Created: 24.06.2026
- Last Modified: 24.06.2026
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

| Module | Time   | Topic                                  | Learning outcome                                                                                             |
| ------ | ------ | -------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| M1     | 45 min | The agentic shift                      | Explain what Claude Code is and where the CLI / IDE / web / desktop surfaces fit a real workflow             |
| M2     | 75 min | The 12 rules of engineering discipline | Apply the rules (think before coding, surgical changes, read before write, fail loud, …) to an agent session |
| M3     | 60 min | Context engineering                    | Describe how `CLAUDE.md` project memory, skills, slash commands and MCP tools steer an agent                 |
| M4     | 60 min | Trust & safety                         | Classify actions into the GREEN / YELLOW / RED trust boundary; explain EU sovereignty and IP non-egress      |
| M5     | 60 min | Live demo                              | Observe a full plan → implement → review → ship cycle and identify each discipline gate                      |
| Wrap   | 30 min | Q&A and adoption plan                  | Leave with a concrete first-week adoption checklist                                                          |

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
