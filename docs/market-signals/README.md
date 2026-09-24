# Market Signal Registry

One file per observed signal. This is the Observation rung of the refinement ladder
(0 Reality → 1 Observation → 2 Information → 3 Knowledge → 4 Understanding → 5 Insight →
6 Decision → 7 Action → 8 Outcome → 9 Evidence → 10 Learning) and the input of Workflow v2 Chapter 14
(`src/agents/workflow-v2/examples/observation-market-signal-intake.graph.json`, Observation and
Market Signal Intake).

Why it exists (HIC, 24.09.2026): market signals were noticed by the HIC and applied by
bypassing the workflows by hand. Knowledge and Understanding layers were strong; Observation
was not part of the operative loop. This registry makes the signal, the hypothesis, the
decision and the evidence a recorded trail instead of a memory.

Automated regulation/incident signals live in Supabase `market_signals`
(`DWS_MARKET_RESEARCH_STANDARD.md` §4.3). This registry holds HIC- and agent-observed
qualitative signals; the repo file is the source of truth and is mirrored to `market_signals`
with `signal_type: hic_observation` when reachable.

## File format

`YYYY-MM-DD-<slug>.md` with YAML front matter:

Four fields that are not the same thing: `reality` (what happened), `observation` (what the
observer noticed, in their words), `signal` (the generalised, quotable statement) and `insight`
(the one strategic sentence that changes what we say and sell). The dashboard reads them as:
WHAT DOES THE MARKET SAY → WHAT DO WE BELIEVE → WHAT DID WE CHANGE → DID IT WORK.

```yaml
signal_id: MS-YYYY-MM-NNN
reality: what happened
observation: what the observer noticed, in their words
signal: the generalised statement (filled at FORMULATE_SIGNAL)
source: customer conversation | deal | regulator | competitor | seminar | social | agent run
date: YYYY-MM-DD
observed_at: YYYY-MM-DD # temporal trail: when each rung was reached
signal_at: YYYY-MM-DD
insight_at: YYYY-MM-DD
decided_at: YYYY-MM-DD
implemented_at: YYYY-MM-DD
evaluated_at: YYYY-MM-DD
kb_updated_at: YYYY-MM-DD
observer: HIC | <agent>
confidence: low | medium | high
occurrences: 1
affected: [lifetime.fi, onelifetime.world, dws10.com, dws10.com/buy, workflows, offering]
status: observed | signal | dismissed | deferred | accepted | implemented | closed
decision: a named decision (e.g. roolimalli_v1_5), filled at HIC_APPROVAL_GATE
insight: the strategic sentence that changes message/offering (filled at STRATEGIC_INSIGHT)
evidence: { leads: n, conversations: n, offers: n, campaign_results: text }
hypothesis: one falsifiable sentence
refuting_evidence: what would show the hypothesis is wrong, and by when
decisions: [] # filled at HIC_APPROVAL_GATE
dispatched_runs: [] # child run ids (Chapter 10, products.json proposal, refiner)
evaluation: null # confirmed | refuted | inconclusive + numbers or quotes
```

Body: free text — the conversation, the quote, the context. No customer PII, no confidential
deal terms.

## Rules

- Capture first, interpret later. Capturing must never wait for analysis.
- Three independent occurrences raise confidence one step.
- Dismissed and refuted signals are kept, never deleted; a recurring dismissed signal is a signal.
- Every `accepted` signal must have at least one dispatched run; it becomes `implemented` only when every dispatched run is done, and `closed` only after evaluation. The registry records impact, not just signals — otherwise it is another archive that changes nothing.
- Weekly scan: the `signal-detector` skill lists `observed`, `signal` and `deferred` signals older than 7 days.

## Three rooms (HIC + Copilot 24.09.2026)

The five-question view is not an admin panel; it is the skeleton of the next Lifetime World Model:

| Room               | View        | Question                        | Reads                                                                                                                                                                           |
| ------------------ | ----------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Control Room**   | operational | What is happening right now?    | incoming leads, tenders, market feeds, campaigns, content flow, product path (Reality)                                                                                          |
| **Situation Room** | strategic   | What have we learned?           | observations, trends, insights, decisions, risks, opportunities (this registry)                                                                                                 |
| **Ontology KB**    | learning    | How did the world model change? | validated insights as changed assumptions: `Construction — old: compliance sells; new: competitiveness sells; evidence: 17 leads, 8 conversations, 3 offers; status: validated` |

Every signal is a temporal record: the `*_at` fields let any phenomenon be read in time — when it
was observed, when it became a signal, when it was accepted as insight, when it changed a
workflow, when the impact showed. That is the pipe's transparency. The next step after this
registry is not another dashboard: it is Ontology KB receiving validated insights automatically
(Chapter 14 `KB_UPDATE`) so the world model changes from them and the next observation is made
against the updated model.
