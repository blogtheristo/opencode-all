---
name: factory-route
description: >
  Use when deciding whether a running agent should stay on its cheap model, switch
  to a stronger one, restart clean, or escalate to a human. Says "factory route",
  "should this agent escalate", "is the agent stuck", "route this trajectory",
  "model ladder", "cheap to strong". Wraps the deterministic DWS Factory Router
  (src/factory/ + scripts/factory-route.ts) — detectors and ladder are pure code,
  no LLM and no network (CLAUDE.md Rule 5). Fully offline: nothing leaves the
  machine.
argument-hint: "FILE=<request-body.json> [MODEL=<name>] [TIER=cheap|strong] [COST=<usd> BUDGET=<usd>] [SWITCHES=<n> RESTARTS=<n>]"
allowed-tools: [Read, Bash]
---

# Factory Route — evidence-based model escalation

Runs the DWS Factory Router over an agent request body and returns one of four
actions on a one-way ladder: `continue` → `switch_model` → `restart_clean` →
`escalate_human`. The verdict comes from deterministic detectors (identical
action/observation 3×, same error class 3×, ping-pong 4×, write→failing-test
thrash, steps-since-progress, budget burn) plus a transparent additive heuristic —
every number in the output is explainable from the signals block.

Provenance: adapted from codejunkie99/sageroute (MIT) with the external Levanto
Sage API and subscription OAuth removed — adopt/adapt decision in
`docs/field-notes/2026-08-03-agent-factory-sageroute-audit.md`. EU-sovereign by
construction: no external decision service, no data egress.

## Procedure

1. Obtain the agent request body as JSON — either Anthropic Messages
   (`{"messages": [...]}`) or OpenAI Responses (`{"input": [...]}`). Both wires
   map to the same trajectory model.
2. Run the router (structured JSON on stdout):

   ```bash
   npm run -s factory:route -- --file <FILE> \
     --model <MODEL> --tier <cheap|strong> \
     --cost <COST> --budget <BUDGET> \
     --switches <SWITCHES> --restarts <RESTARTS>
   ```

   Stdin piping works too. Add `--evidence` to print the rendered evidence block
   (the standard input for any DWS routing/KYA scoring layer) on stderr.
3. Act on the verdict. Exit codes let shell pipelines branch without parsing:
   `0` continue · `2` switch_model · `3` restart_clean · `4` escalate_human ·
   `1` input error.
4. `escalate_human` is a hard stop (EU AI Act Art. 14 intervention point) —
   surface it to the HIC with the `headline` and `reason` fields; never route
   around it.

## Guardrails (enforced in code, not prompt)

- Budget stop before anything: `--budget` exhaustion forces `escalate_human`
  before any other logic runs.
- Capability before retry: a cheap-tier restart request becomes a switch while a
  switch is still available.
- Asymmetric hysteresis: the first cheap→strong hop fires on one bad checkpoint;
  restarts and human escalation need two agreeing checkpoints.
- One-way ladder: the router never demotes back to the cheap tier.

Library use: `import { extractTrajectoryFromBody, computeSignals, decide } from
'../factory/index.js'` — hold one `LadderState` per session and re-run `decide`
at each checkpoint.
