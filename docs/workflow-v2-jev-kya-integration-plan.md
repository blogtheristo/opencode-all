# Workflow v2 × Jev-KYA — Integration Plan

Answers: "Can we use jev-kya with Workflow v2?" Yes — two different things
both named "Jev-KYA" exist in this repo, and they integrate at different
points. Naming this precisely first, because conflating them would produce
a wrong plan.

## Disambiguation (read this before anything else)

| Name                   | What it actually is                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Status                                                                                                                                                                                                                 |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`kya-jev` (code)**   | `src/agents/kya-jev.ts` — a typed-decision function (`makeTypedDecision`). Caller supplies state + a typed question (Choice/Score/Boolean); it returns a typed decision + self-reported probabilities + confidence. Every call is gated: it throws unless the caller already holds a **signed** KYA verdict (`AgentRuntimeContext.kya`, verified via `verifyKyaVerdict()` in `src/security/runtime-auth.ts`) — a caller cannot forge `{decision:'allowed'}` and get through. | **Built, in the codebase today.** Calibration status: PROVISIONAL — confidence is model-self-reported, not yet validated against a labeled dataset (`docs/field-notes/2026-09-18-jev-typed-decision-layer-signal.md`). |
| **Jev-KYA 4B (model)** | A planned distilled 4B Nemotron model, trained on DGX Spark from `Nemotron-4-340B-Instruct`/`-Reward`, for zero-marginal-cost local KYA trust decisions.                                                                                                                                                                                                                                                                                                                     | **Plan only, not trained.** `docs/field-notes/2026-09-20-jev-kya-nemotron-distillation-plan.md` — HIC decision question still open (approve the distillation plan + build `scripts/runners/kya-distill-runner.py`).    |

**This plan is about integrating the first one (`kya-jev` code primitive) with
Workflow v2 now.** The second (the 4B model) is a future inference _backend_
for the same integration once trained — noted in Phase 3 below, not blocking
Phases 1–2.

## Why this fits Workflow v2 specifically

Workflow v2's Executor currently does one unstructured thing at each node:
call `LLMClient.chat()`, get back prose, regex-match a `<transition>X</transition>`
tag out of it (`runner.ts::TRANSITION_RE`). That's a free-text parse of a
free-text response — no typed schema, no probability, no confidence, and
critically **no requirement that the caller be authorized to make this
decision at all**. Anyone holding an `LLMClient` can drive a graph.

`kya-jev` is a typed-decision primitive built for exactly this shape of
problem (pick one of N known options, with self-reported confidence) and it
already refuses to run without a signed runtime authorization. Wiring it
into the transition step turns "the LLM said `<transition>SEND</transition>`"
into "a KYA-authorized typed choice, scored across every legal option, with
a confidence number that can be logged to the `ExecutionTrace`."

## Principle — three deltas, one decision (HIC + Copilot, 2026-09-24)

> **AI learning does not change the system. An HIC-approved Application Decision changes the
> system.** Every learning taken into use is traceable: what was learned, who understood it,
> who approved it, how it was applied, to what, on what basis, up to which version, and what
> effects followed.

JEV/KYA is therefore not only a governance or approval model. It forces the chain
`Learn → Explain → Understand → Approve → Apply` where a "result only, and out" agent would
run `Learn → Apply` and lose the HIC in between (the Boardy observation, `MS-2026-09-002`).
Three separately versioned, separately traceable objects:

| Object                   | Question it answers                                                                                                  | Produced at (Chapter 14)                 | Example                                                                                                                                                                                    |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Learning Delta**       | What did the AI learn? How does it change the world model?                                                           | `STRATEGIC_INSIGHT`, `EVALUATE`          | Construction responds to competitiveness better than to compliance language. Changes nothing yet.                                                                                          |
| **Comprehension Delta**  | What did the HIC understand of that learning? Did the HIC see the change?                                            | `SHOW_TO_HIC` (recorded at the gate)     | The phenomenon looks real: 17 leads, 8 conversations, 3 offers. Changes nothing yet.                                                                                                       |
| **Application Decision** | Did the HIC decide to take it into use? For what use? On what basis? Up to which version? Whom do the effects reach? | `HIC_APPROVAL_GATE` → `DISPATCH_IMPACTS` | Accepted. Apply to: lifetime.fi, LinkedIn, DWS10 construction solutions. Do not apply to: Investor Centre, Legal Hub. Basis: MS-2026-09-00x evidence. Valid until: role model v1.6 review. |

The operative chain, as the HIC stated it (24.09.2026):

```
AI Learning → Learning Delta → JEV Review (Know Your AI) → HIC Decision
(Apply / Reject / Partial Apply) → Application Record → Operational Change
```

`JEV Review` is the kya-jev typed verdict on the Learning Delta (is this learning
admissible, from which provider, under which jurisdiction); `HIC Decision` has three
outcomes, and _Partial Apply_ is the normal one — it is what `applies_to` /
`does_not_apply_to` encode; `Application Record` is the registry file's
`application_decision` block plus the ApprovalToken hash; `Operational Change` is the set
of dispatched child runs, and nothing else may change the system.

Only the third object changes system behaviour, and it can be shown afterwards. This is
closer to decision law than to a technical audit trail; it is the level EU AI governance
(Art. 12–14) and agentic commerce (who authorised this agent to act, on what, until when)
require. The registry file carries all three: `insight`/`evidence` (Learning Delta),
`comprehension` (what the HIC saw, in their words, plus the artefact link), and
`application_decision` with `applies_to`, `does_not_apply_to`, `basis`, `valid_until`,
`affects` (Application Decision). A typed kya-jev transition out of `HIC_APPROVAL_GATE`
carries the Application Decision as its typed payload, so the signed verdict and the human
decision are one record.

## Phase 1 — Typed transitions (structural, no behavior change)

Add an alternate transition-decision path in `runner.ts` alongside the
existing free-text one (don't remove the existing path — some callers may
not have a `kya` verdict yet, e.g. local dev/testing):

```
runExecutorStepTyped(
  client: LLMClient,
  graph: ProceduralGraph,
  currentNodeId: string,
  userInput: string,
  runtime: AgentRuntimeContext,   // must carry a signed .kya verdict
  options?: RunExecutorStepOptions,
): Promise<StepResult>
```

Internally: build the same node-scoped context (`buildExecutorSystemPrompt`
content becomes the `state` string), call
`makeTypedDecision(client, { state, question: { kind: 'choice', prompt: '...', options: node.allowedNext } }, runtime)`,
and map the typed `decision` field onto the existing `StepResult.nextNode`.
Everything downstream — `assertTransitionAllowed`, the `HIC_APPROVAL_GATE`
approval-hash check (PR #2059, in progress) — stays exactly as-is; this only
changes _how_ the candidate `nextNode` is produced, not what's done with it.

**What this buys immediately:**

- A graph run without a valid signed KYA verdict throws at the first typed
  transition — Workflow v2 runs become KYA-gated by construction, not by
  convention.
- `TypedDecisionResult.probabilities` (per-option confidence across every
  `allowedNext` choice, not just the winner) is worth recording on
  `GraphTransition.note` — turns "the executor chose FETCH_DATA" into "the
  executor chose FETCH_DATA at 0.81 confidence, ERROR_RECOVERY at 0.15" for
  the Refiner to read later (directly useful for the Refiner's "Identify
  Ambiguity" optimization rule — a close probability split between two
  options is a strong signal the node description is ambiguous).
- `abstained: true` (kya-jev's safe-default when its own output fails
  validation) becomes a natural `ERROR_RECOVERY` trigger instead of an
  unhandled parse failure.

**What this does NOT change:** the `HIC_APPROVAL_GATE → SEND` code gate
being built right now stays independent and mandatory. `kya-jev`'s
confidence is PROVISIONAL/self-reported — it must never be read as "the
model is 92% sure this is fine, auto-send it." That would violate both the
RED-zone outbound-email rule and kya-jev's own documented calibration
caveat. Confidence is a signal for the HIC and the Refiner, not a bypass.

## Phase 2 — HIC_APPROVAL_GATE pre-screen (advisory only, Mission Control)

At `HIC_APPROVAL_GATE`, add one more `kya-jev` call — a `boolean` question:
"Does this draft look policy-compliant and in-scope for this run (correct
sender identity, no scope creep past what RESEARCH/STRATEGY established, no
factual claim unsupported by the graph's own tool outputs)?" The result
(`decision: 'yes'|'no'`, `probabilityYes`, `confidence`) is attached to the
Mission Control queue item (`docs/workflow-v2-chapters-roadmap.md`
§Placement) as a triage hint next to the draft — never as an auto-approve
action. A `low probabilityYes` should visually flag the queue item for
closer HIC read, nothing more. This is the same non-actionable-advisory
pattern already established by `model-route-kya-jev.ts` ("Advisory kya-jev
consumer... Never changes selectModel()") — reuse that pattern name and
shape rather than inventing a new one.

## Phase 3 — Swap in Jev-KYA 4B as the inference backend (future, gated)

Once (if) the Jev-KYA 4B distillation plan is HIC-approved and the model is
trained + quantized (`docs/learning-outcomes/jev-kya-nemotron-distillation-plan.md`),
it becomes a candidate `LLMClient` for Phases 1–2's `kya-jev` calls
specifically — not for the Executor's main `.chat()` calls (those need full
reasoning capability; kya-jev calls are narrow typed classification, which
is exactly what a distilled 4B model is good at and cheap to run locally on
DGX Spark / edge agent GPUs / laptops per the distillation plan's quantized
targets). This is a `createLLMClientForAgent()` routing change
(`src/agents/model-selector.ts`, `OLLAMA_DEPLOYED_MODELS` pattern) once the
model exists — no Workflow v2 code changes needed, only a model-selection
config entry. Zero-marginal-cost local inference for every typed transition
decision across every chapter (0–8) is the payoff, matching CLAUDE.md's
DGX-first Cost Governance rule.

## Where this lands per chapter (`docs/workflow-v2-chapters-roadmap.md`)

- **Chapter 1 (Sales Outreach) / Chapter 0 (B2B Growth Funnel):** Phase 1
  typed transitions + Phase 2 pre-screen at `HIC_APPROVAL_GATE` apply
  directly, no chapter-specific changes needed.
- **Chapter 7 (KYA Incident Response)** is the deepest fit: a graph whose
  nodes ARE trust-tier escalation states (per `/kya`'s IJS table: Sovereign
  → Compliant → Partial → Exposed) maps almost exactly onto `kya-jev`'s
  `score` question kind (`levels: ['sovereign','compliant','partial','exposed']`)
  instead of `choice`. Building Chapter 7 and Phase 1 of this plan together
  would be more efficient than sequencing them — worth folding into one
  scope pass if Chapter 7 gets picked next.

## Not doing

- Not modifying `kya-jev.ts` itself — it's a stable, already-tested,
  general-purpose primitive; Workflow v2 is a new _consumer_ of it, per its
  own doc comment pattern (`model-route-kya-jev.ts` as the precedent for
  "advisory consumer, never actionable").
- Not making any typed-decision confidence score sufficient, alone, to skip
  a human gate anywhere outbound email or other RED-zone action is involved.
- Not training or touching the Jev-KYA 4B model in this plan — that has its
  own open HIC decision gate in a separate field note and is out of scope
  here beyond Phase 3's forward note.

## HIC decision needed

1. Build Phase 1 (typed transitions via `kya-jev`) next, after the
   in-progress `HIC_APPROVAL_GATE` approval-hash gate lands? It's additive
   and doesn't block that work.
2. Confirm Chapter 7 (KYA Incident Response) as a good next chapter to pair
   with this plan, ahead of the previously-recommended Chapter 2 (Investor
   Outreach) — or keep Chapter 2 first and treat Chapter 7 + this plan as a
   later joint pass.
