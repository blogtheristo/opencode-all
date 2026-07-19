---
name: token-capital
description: >
  Use when assessing a firm's token capital — the AI capability it builds and OWNS:
  private evals, private RL environments, knowledge base, and the learning loop on top
  of models. Tests model-swap sovereignty: can you change the generalist model without
  losing company-veteran expertise? Says "token capital", "learning loop", "do we own
  our AI IP", "hill climbing machine", "private evals", "swap the model", "is our AI
  capability ours or the vendor's". Pairs with /human-capital.
argument-hint: "firm or customer name, or a description of the AI stack / loop to inventory"
allowed-tools: [Read, Glob, Grep, Bash]
---

# Token Capital — Loop Inventory & Sovereignty Test

**TOKEN CAPITAL IS THE AI CAPABILITY THE FIRM BUILDS AND OWNS — NOT THE MODEL IT RENTS.**
The opportunity is never "pick the best model"; it is the **learning loop on top of models**
where human and token capital compound. This skill inventories that loop and runs the
sovereignty test: **can you swap the generalist model and keep the company-veteran expertise?**

Canonical source: `docs/field-notes/2026-06-15-human-token-capital.md`.
Pair skill: `/human-capital` (the people half that sets direction for the loop).

> Token capital ≠ token _spend_. It is owned capability, not a billing line.

## The four loop components (inventory each)

| Component                    | What to inventory                                                    | DWS analogue                          |
| ---------------------------- | -------------------------------------------------------------------- | ------------------------------------- |
| **Private evals**            | Tests against _internal outcomes that matter_, not public benchmarks | Deterministic agent scoring (0–100)   |
| **Private RL environments**  | Real traces from inside the org that make models stronger            | Firehorse Dreaming traces, audit logs |
| **Knowledge base**           | Institutional memory, queryable; makes token use efficient           | `/kb`, `kb/raw/` → `kb/wiki/`         |
| **The loop itself (the IP)** | The hill-climbing machine that compounds the three above             | `/clawdbot`, `/dream-on`, `/learn`    |

## The procedure

1. **Scope** the AI stack from `$ARGUMENTS` (the firm's own, or a customer's).
2. **Inventory the four components.** For each: does it exist, who owns it, and is the
   improvement signal captured or thrown away? `grep` the repo / stack for the artefacts
   (evals, `kb/`, dream proposals, `docs/learning-loops/`).
3. **Run the sovereignty test (the core deliverable).** Ask: if you replaced the underlying
   generalist model tomorrow, how much company-veteran expertise survives the swap?
   - **Sovereign** — evals, KB, RL traces, and skills are owned and model-agnostic; swapping
     the model is a config change. (DWS posture: Claude + Gemini + Groq + Llama + EU-local
     DGX Spark, model-agnostic orchestration.)
   - **Renting** — the expertise lives inside one vendor's model/fine-tune; swapping loses it.
     This is the failure mode the field note warns about — value flowing to a few models.
4. **Score compounding.** Does each improved workflow generate better training signal
   (loop closes), or is every run a one-off (loop open)? An open loop is not token capital.
5. **Recommend.** Name the missing component(s), the swap-risk to close, and the next
   loop-closing artefact. Tie human direction (`/human-capital`) to where it most raises ROI.

## Output contract

```
Token Capital Assessment — <scope>
  Loop components present: <evals? RL env? KB? loop?> (n/4)
  Ownership: <which components are owned vs vendor-locked>
  Sovereignty verdict: SOVEREIGN | PARTIAL | RENTING
    Model-swap survival: <% of company-veteran expertise that survives a model change>
  Compounding: CLOSED LOOP | OPEN LOOP  (does each run improve the next?)
  Gaps + next artefact: <missing component → concrete build step, owner>
```

## Latent vs deterministic

| Step                                                             | Kind          |
| ---------------------------------------------------------------- | ------------- |
| Decide which AI assets count as owned token capital              | Latent        |
| Grep the stack for evals / KB / dream proposals / learning-loops | Deterministic |
| Judge model-swap survival (sovereignty verdict)                  | Latent        |
| Count loop components present (n/4)                              | Deterministic |
| Recommend the next loop-closing artefact                         | Latent        |

## When This Applies

- "Should we fine-tune a vendor model?" → first check whether that traps token capital.
- Sovereignty / IP due diligence: do we own our AI capability or rent it?
- After `/human-capital`: turn inventoried judgment into owned, compounding capability.

## Common Mistakes

- Confusing model access with token capital. Renting GPT-class access is not owning IP.
- Optimising for benchmark scores instead of **private evals on outcomes that matter**.
- An open loop: shipping improvements that never become training signal. No compounding,
  no token capital — just compute running in circles.

## DWS Standards applied (CLAUDE.md Resolver)

- `DWS_SECURITY_STANDARD.md` — sovereignty / CLOUD Act posture for owned AI capability.
- `docs/field-notes/2026-06-15-human-token-capital.md` — canonical framework.
- Composes with `/sovereignty-assess`, `/sovereignty-pillars-assess`, `/kb`, `/learn`,
  `/dream-on`.
