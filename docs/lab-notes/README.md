# DWS Lab Notes

This directory contains **research and technical lab notes** for the Lifetime World Model (LWM). Lab notes capture experimental findings, technology evaluations, and research insights that inform DWS IQ platform development.

## Purpose

Lab Notes are **technical research input** for the Lifetime World Model. They document:

- Technology paradigm shifts (new frameworks, architectures, tools)
- Competitive and ecosystem research (Anthropic, OpenAI, industry patterns)
- Experimental findings from DWS IQ agent development
- Architecture decisions and their rationale
- Standards evaluations (EU regulations, industry norms)

## Difference from Field Notes

| Field Notes                               | Lab Notes                                    |
| ----------------------------------------- | -------------------------------------------- |
| Real-world events, customer conversations | Research, experiments, technology evaluation |
| Operational intelligence                  | Technical/strategic intelligence             |
| `docs/field-notes/`                       | `docs/lab-notes/`                            |
| Within 24h of event                       | After research is complete                   |

## Naming Convention

**Format:** `YYYY-MM-DD-[brief-topic].md`

**Examples:**

- `2026-04-16-anthropic-skills-paradigm-research.md`
- `2026-04-20-eu-ai-act-article12-logging-evaluation.md`
- `2026-05-01-llama4-scout-benchmark-vs-claude.md`

## When to Create a Lab Note

Create a lab note when:

- ✅ A technology paradigm shift is identified (e.g. "Stop building agents, build Skills")
- ✅ A competitor makes a significant architectural announcement
- ✅ Research reveals a gap in DWS IQ architecture
- ✅ An EU regulation changes technical requirements
- ✅ An experiment produces a reusable finding

## Required Elements

Every lab note MUST include:

- **Date:** ISO format (YYYY-MM-DD)
- **Author:** Name / Organization
- **Source:** Where the research came from (paper, talk, codebase analysis)
- **Type:** Research | Experiment | Evaluation | Paradigm Analysis
- **Confidence:** High / Medium / Low (with rationale)
- **Ontology Tags:** Geography, Sector, Entities, Temporal Context
- **VERSION AND AGENT HISTORY block** (DWS Document Standard)

## Lifetime World Model Integration

Lab notes feed into LWM via `docs/lifetime-world-model/LEARNING_SOURCES.md`. The LWM ingests lab notes to:

- Update its mental model of the AI agent ecosystem
- Track paradigm shifts relevant to DWS IQ architecture
- Inform Agent Foundry decisions

## Related Documents

- **Field Notes:** `docs/field-notes/README.md`
- **LWM Learning Sources:** `docs/lifetime-world-model/LEARNING_SOURCES.md`
- **Document Standard:** `DWS_DOCUMENT_STANDARD.md`
- **Skills Guide:** `docs/DWS_SKILLS_GUIDE.md`
