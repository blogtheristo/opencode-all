---
name: edge-control-room-capital
description: Inventories and scores a firm's edge control-room capital — the physical sense-and-actuate substrate it owns (edge AI devices, sensors, robots, Control Room / Situation Room) — and runs the loop-closure test: do its proprietary real-world traces actually feed token capital, or dead-end as cost? The DWS-specific third capital form (Nadella coined human + token capital; this is the DWS extension). Use when user says "edge capital", "edge control room capital", "robots and sensors", "fleet capital", "do our sensors feed the loop", "control room capital", "physical AI moat". Chains /human-capital → here → /token-capital.
argument-hint: "firm or customer name, or a description of the edge / fleet / sensor estate"
---

Run an Edge Control-Room Capital substrate inventory & loop-closure test.

Load and follow the full procedure in `skills/edge-control-room-capital/SKILL.md`. Canonical
source & audit: `docs/field-notes/2026-06-15-human-token-capital.md` (§ DWS Extension). Note:
edge control-room capital ≠ hardware capex — it is the owned, proprietary-data-generating
substrate, and it is only capital if its traces close the loop into token capital.

Input: $ARGUMENTS (firm / customer / edge estate, or a natural-language description).

## Steps

1. Read `skills/edge-control-room-capital/SKILL.md` and apply it.
2. Inventory the four substrate layers (edge compute, sensors, robots/actuation, command centres); use `/remote-control` for the live interface and grep for artefacts.
3. Run the loop-closure test — trace-to-loop: CAPITAL | LEAKY | COST (do captured traces feed `/token-capital`'s loop, or dead-end?).
4. Test edge sovereignty: SOVEREIGN | PARTIAL | EXPOSED (capture + inference + storage in-jurisdiction?); compose with `/sovereignty-assess`.
5. Emit the Output-contract block; name the weakest layer and the next trace-to-loop wiring step.
6. Chain: `/human-capital` directs → this senses and acts → `/token-capital` learns. Industrial/robotics/edge firms only — for pure SaaS this folds into token capital.
