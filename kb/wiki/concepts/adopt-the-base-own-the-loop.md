<!--
VERSION AND AGENT HISTORY
Document: adopt-the-base-own-the-loop.md
Version: 1.1
Last-Updated: 2026-07-30
Author: Risto Anton Päärni (Lifetime Oy)
Agent: Claude Code
Purpose: Canonical DWS statement of the build→adopt inflection — why DWS does not
         pretrain base models, where the moat actually sits, and the two-layer
         split between physical AI and compliance evidence. Full treatment:
         PHD_FIREHORSE §14.44 / Key Contribution #49.
Introduced-In: PR-pending (branch claude/ollama-orchestration-merge-047pj7)
Code-Version: 1.0
Branch: claude/ollama-orchestration-merge-047pj7
Date: 2026-07-26
Owner: risto.paarni@lifetime.fi
-->

# Adopt the Base, Own the Loop

**Version:** 1.1 · **Status:** Active · **Scope:** any DWS model-strategy, product-positioning or investor claim
**Full treatment:** `docs/PHD_FIREHORSE_EN.md` §14.44 + Key Contribution #49
**Companions:** `docs/field-notes/2026-07-26-cosmos-3-edge-lwm-build-adopt-inflection.md`, `docs/field-notes/2026-07-26-lwm-training-hardware-reality.md`, `docs/field-notes/2026-07-30-nadella-harness-model-swappability-signal.md`, V3Thesis Appendix E

## The rule

**DWS does not pretrain base models.** It adopts open sovereign components and builds the
one layer it can own: the evidence loop — private evals, an RL environment, adaptation on
sovereign fleet data, KYA governance, and the Article 12 evidence chain.

Base models commoditise monthly. The loop does not, because it is built on the customer's
own operations and cannot be bought.

## Why the 55B plan was retired (verified, 2026-07-26)

- The Acer Veriton GN-100 (GB10, 128 GB unified) is an **edge inference / development node**,
  not a training cluster. Training a ~55B model needs optimiser states, gradients and
  activations at roughly **8–16× the inference footprint** — hundreds of GB to TB with
  multi-GPU interconnect.
- Repository verification (PR #1720) found **no training-pipeline code**, no go-live record,
  and that the separately-described training node (x86, 2× RTX 4090) **does not exist**.
  On-prem full training was retagged *Pending Hardware*.
- **NVIDIA Cosmos 3 Edge** (released 15.07.2026; 4B params + 2B Nemotron reasoner; runs on
  DGX Spark / Jetson) supplies an open, on-device world model built for the exact hardware
  DWS already runs — removing the reason to pretrain one.

## The two-layer split (do not merge these into one model)

| Layer | Problem it solves | Served by |
| --- | --- | --- |
| **Physical** — perception → action | Real-time scene understanding, intent prediction, machine-vision oversight (fleet, Control Room / Situation Room) | Adopted open on-device world model (Cosmos 3 Edge class) |
| **Compliance evidence** — reasoning → record | Court-defensible reasoning chain, Article 12 logging, export-control and climate assessment | A separate LLM tier (open models, EU-served) |

They are **different optimisation problems**. One model trained for both is a compromise in
both directions. The **KYA loop binds them** — and that loop is the defensible asset.

## Sovereignty decomposition (state both halves)

- ✅ **Data sovereignty** — preserved: open weights, on-prem, EU-resident.
- ⚠️ **Supply sovereignty** — concentrated on a single US vendor (NVIDIA) at *both* the
  compute and the model layer.
- 🛡️ **Mitigation** — because the weights are open, portability is real. Keep ≥1 open model
  and ≥1 workload runnable on a non-NVIDIA accelerator (AMD MI300 / Intel Gaudi 3) at
  testbed scale. **A dependency is managed when the exit is demonstrated; it is lock-in when
  the exit is only asserted.** Tracked as R-01 in `docs/risk-register/DWS_PRODUCT_RISK_REGISTER.md`
  — status: **not yet exercised**.

## External validation — and the compression that came with it (2026-07-29)

On the Microsoft FY26 Q4 earnings call (29.07.2026), Satya Nadella answered a UBS question
about open-model adoption by stating the same architecture:

> "You've got to keep your harness separate from the model. The harness will ensure that your
> memory, your context, all of that is external. That means any given model at any given time
> is swappable."

Read both halves. **Validation:** the largest enterprise software vendor now states publicly
that the model tier is a swappable component and the durable layer sits around it — the thesis
above, on an earnings call. **Compression:** Microsoft sells the harness (Copilot) *and* the
models, so harness-ownership and model-swappability are now incumbent marketing. They are
table stakes as of 29.07.2026, not a DWS differentiator.

Signal record: `docs/field-notes/2026-07-30-nadella-harness-model-swappability-signal.md`.

## Positioning guard

**Never claim "we own the harness" as the differentiator** — as of 29.07.2026 that is a
Microsoft talking point. The DWS claim is the narrower one that survives it: the **sovereign
compliance evidence loop** — private evals, an RL environment on the customer's own operational
corpus, KYA governance and the Article 12 evidence chain, on-prem and EU-resident. Evidence is
jurisdictional; a horizontal harness is not.

Per `DWS_TRUTH_STANDARD.md` row 27, "Sovereign AI" as infrastructure/compute is **not** a
category DWS competes in. Cosmos, NIM and DGX are **components**. Never restate this rule as
"DWS does sovereign AI infrastructure" — the claim is the governed **outcome** layer.

## The investor formulation

> "We do not train base models. We build the owned evidence layer on top of ready sovereign
> components."

This is a cleaner capital story than "we train a 55B on a micro-budget": lower CAPEX,
sovereign by data, and the defensible asset is the part actually owned.
