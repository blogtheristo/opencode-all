---
name: edge-control-room-capital
description: >
  Use when assessing a firm's edge control-room capital — the physical sense-and-actuate
  substrate it builds and OWNS: edge AI devices, sensors, robots, and the Control Room /
  Situation Room command centres. The DWS-specific third capital form (Satya Nadella coined
  human + token capital; this is the DWS extension for an industrial/robotics/edge firm).
  Tests whether proprietary real-world traces actually close the loop into token capital.
  Says "edge capital", "edge control room capital", "robots and sensors", "fleet capital",
  "do our sensors feed the loop", "control room capital", "physical AI moat". Chains
  /human-capital → /edge-control-room-capital → /token-capital.
argument-hint: "firm or customer name, or a description of the edge / fleet / sensor estate"
allowed-tools: [Read, Glob, Grep, Bash]
---

# Edge Control-Room Capital — Substrate Inventory & Loop-Closure Test

**EDGE CONTROL-ROOM CAPITAL IS THE PHYSICAL SENSE-AND-ACTUATE SUBSTRATE THE FIRM BUILDS AND
OWNS — NOT THE HARDWARE BILL.** It is the third DWS capital form: the layer that **captures**
the world (sensors) and **acts on** it (robots, missions, command centres), generating
proprietary real-world traces no off-the-shelf model has. It is only _capital_ if those
traces **close the loop** into token capital; sensors whose data is discarded are cost.

Canonical source & audit: `docs/field-notes/2026-06-15-human-token-capital.md` (§ DWS
Extension). Attribution: human + token capital are Nadella's; this third form is the DWS
extension. Chain: `/human-capital` (directs) → this (senses + acts) → `/token-capital`
(learns). In Brain-Memory-Body-Hands, this is **Body + Hands**.

## The four substrate layers (inventory each)

| Layer                  | What to inventory                                                         | DWS analogue                                     |
| ---------------------- | ------------------------------------------------------------------------- | ------------------------------------------------ |
| **Edge compute**       | Owned inference hardware at the edge; uptime, sovereignty, portability    | Acer Veriton GN100 (LWM), Jetson Orin, DGX Spark |
| **Sensors**            | What the firm measures in the field; coverage, fidelity, capture rate     | Construction IoT (GPS / environmental / safety)  |
| **Robots / actuation** | What the firm physically does; mission reliability, autonomy, safety gate | Lifetime Fleet, mission dispatch, robot feeds    |
| **Command centres**    | Where humans see and steer it; coverage of ops + strategic views          | Control Room (ops), Situation Room (strategic)   |

## The procedure

1. **Scope** the edge / fleet / sensor estate from `$ARGUMENTS` (the firm's own, or a
   customer's). `grep`/inspect for the real artefacts; `/remote-control` is the live interface
   (`acer` / `control-room` / `situation-room` targets).
2. **Inventory the four substrate layers.** For each: does it exist, is it **owned** (vs
   rented cloud-vision / leased robots), and what is its health/coverage?
3. **Run the loop-closure test (the core deliverable).** For the captured traces, ask: do they
   **actually feed token capital** (RL environment, KB, evals), or are they discarded /
   siloed / vendor-held?
   - **Capital** — traces are owned, EU-sovereign, and wired into the loop (`/kb`, RL traces,
     `docs/learning-loops/`); the physical estate compounds.
   - **Cost** — sensors/robots run but their data dead-ends, or a vendor holds it. This is the
     "open loop" failure mode `/token-capital` scores — hardware without compounding.
4. **Test edge sovereignty.** Is capture + inference + storage inside the firm's jurisdiction
   (air-gapped / EU-local), or does a third country / vendor sit in the path? Compose with
   `/sovereignty-assess` and `/sovereignty-pillars-assess`.
5. **Recommend.** Name the weakest layer, the broken loop-closure handoff to fix, and the next
   trace-to-loop wiring step. Tie human direction (`/human-capital`) to where the physical
   estate most raises ROI.

## Output contract

```
Edge Control-Room Capital Assessment — <scope>
  Substrate layers present: <edge compute? sensors? robots? command centres?> (n/4)
  Ownership: <which layers are owned vs rented/vendor-held>
  Loop-closure verdict: CAPITAL | LEAKY | COST
    Trace-to-loop: <% of captured real-world traces wired into token capital>
  Edge sovereignty: SOVEREIGN | PARTIAL | EXPOSED  (capture+inference+storage in-jurisdiction?)
  Gaps + next wiring step: <weakest layer / broken handoff → concrete fix, owner>
```

## Latent vs deterministic

| Step                                                              | Kind          |
| ----------------------------------------------------------------- | ------------- |
| Decide which physical assets count as owned edge capital          | Latent        |
| Inspect the estate (`/remote-control` status, grep for artefacts) | Deterministic |
| Judge loop-closure (traces feed the loop vs dead-end)             | Latent        |
| Count substrate layers present (n/4)                              | Deterministic |
| Recommend the next trace-to-loop wiring step                      | Latent        |

## When This Applies

- Industrial / robotics / edge firms only. A pure-SaaS firm has no edge capital — it folds
  into token capital (see the audit's fifth-criterion check in the field note).
- "Should we own the sensors/robots or rent the data feed?" → ownership decides whether the
  real-world data channel is yours.
- After `/human-capital`, before `/token-capital`: the physical layer is what makes the loop's
  real-world traces proprietary.

## Common Mistakes

- Counting the hardware capex as the capital. The capital is the **proprietary traces** the
  hardware produces and **whether they close the loop** — not the bill of materials.
- Treating it as a subset of token capital. Token capital _learns_; edge capital _senses and
  acts_. The handoff between them is the thing to test.
- An open loop: deploying sensors/robots whose data is discarded or vendor-held. No
  compounding, no capital — just running machines in circles.

## DWS Standards applied (CLAUDE.md Resolver)

- `DWS_SECURITY_STANDARD.md` — edge sovereignty / CLOUD Act / NIS2 posture for owned substrate.
- `docs/field-notes/2026-06-15-human-token-capital.md` § DWS Extension — canonical audit.
- Composes with `/remote-control`, `/sovereignty-assess`, `/sovereignty-pillars-assess`,
  `/kb`, `/token-capital`, `/human-capital`.
