# Memory: clawdbot architecture — Brain / Memory / Body / Hands

> Curated by Claude (this session) acting as the dreamer.
> First observed: session `0e2e931a-416a-48c0-a2ec-14cd27b6ca1b`
> Date: 2026-05-12

## What clawdbot is

Clawdbot codifies the **offline reflection** pass of the DWS Brain-Memory-Body-Hands
architecture, applied to Claude Code itself.

| Layer            | Concrete thing                                                                                                      |
| ---------------- | ------------------------------------------------------------------------------------------------------------------- |
| Brain            | The LLM running each session (Claude here; ollama-spark when EU-local needed)                                       |
| Memory — raw     | `~/.claude/projects/-home-user-dws6/*.jsonl` transcripts                                                            |
| Memory — working | `.claude/clawdbot/state.json` + per-session `queue/<id>.md`                                                         |
| Memory — curated | `.claude/clawdbot/memory/*.md` (this file is one) + `CLAUDE.md`                                                     |
| Body             | `scripts/clawdbot-scan.mjs`, `skills/clawdbot/`, `.claude/commands/clawdbot.md`, `scripts/daily/clawdbot-digest.sh` |
| Hands            | `git`, file edits, `bash scripts/ollama-spark.sh`                                                                   |

## The three-pass model

Naive agent loops only ever do **pass 1**. Clawdbot adds 2 and 3.

1. **In-session memory writing.** The transcript itself. Already happens automatically.
2. **Curated memory.** `dream-curate` consolidates recurring patterns into
   `memory/` files and proposes `CLAUDE.md` edits when a rule recurs.
3. **Skill evolution.** `dream-propose` drafts new skills when ≥N pending sessions
   cluster; `dream-prune` flags zero-hit skills for `_OLD` archival.

All three write to `proposals/` and never auto-apply — HIL promotes by copying
into the target location and deleting the proposal.

## Trust boundary in practice

The SessionStart hook declares GREEN/YELLOW/RED auto-mode zones. Clawdbot
operationalizes them at two points:

- `--preview <id>` classifies each file the session touched (regex patterns in
  `clawdbot-scan.mjs` mirror the hook's policy). Surfaces `autoResumeEligible`
  = `highestZone === "GREEN" && branch.startsWith("claude/")`.
- `--dream-*` modes are inherently HIL-gated even when their LLM step succeeds,
  because they only write proposals.

Empirically observed in this session: pre-tool-use hook blocked an `rm` and
cited the CLAUDE.md "rename to `_OLD`" rule. Hook = letter; CLAUDE.md = spirit.
Both layers needed.

## HIL gradient — the trust ramp

Across this single session HIL engagement evolved:

1. "I dream a internal clawdbot agent…" — user authored the vision
2. "Sounds nice" — picked option 2 from 3 proposed shapes
3. "Yes extend" — approved continuation, asked for more
4. Picked `Self-skip current session` from a 4-option chip menu
5. "Sure. Hil does not follow you now continue" — handed over autonomy
6. "Llm digest" — directed one extension
7. "Yes" — approved continuation
8. "You are the dreamer here" — fully delegated curation itself

The shape of this ramp is the point. Hooks (pretooluse-guard, stop-hook,
audit logging) become the substitute for human eyes as the gradient slides.
The trust boundary policy is what makes step 5+ safe.

## What survived the build, what didn't

**Survived:** small commits per layer (scanner → live-skip → digest+preview →
enrich → dream-\*), each independently reversible. Heuristic regex
classification of trust zones — good enough; LLM not required.

**Did not survive:** the "queue file as fresh-session prompt" workflow has
no actual cross-session affordance yet — the file is generated but the user
still has to manually launch a new session with it pasted in. A future MCP
exposure or a `dws clawdbot launch <id>` command would close that gap.

## Brand: "Firehorse Dreaming"

The offline-reflection half of clawdbot — i.e. `--dream-curate`,
`--dream-propose`, `--dream-prune`, and the matching `/promote-proposal`
skill that consumes their output — is the **Firehorse Dreaming** feature.

`clawdbot` is the worker (the session janitor); Firehorse Dreaming is the
branded capability the worker provides. Same convention as
`firehorse-report-*` (Annual / Board Pack / Carbon / Compliance) in
`skills/`: Firehorse is the umbrella, the skill is the implementation.

When a future doc / customer-facing copy needs to refer to "our agents
dream over past sessions to curate memory," say **Firehorse Dreaming**.
When a contributor needs to know which file to edit, say `clawdbot`.

## Convergence with Anthropic Dreams API (2026-04-21 beta)

Anthropic shipped the same idea as a managed-runtime primitive in
April 2026 (`POST /v1/dreams`, beta header `dreaming-2026-04-21`). The
architectural shape is the same as Firehorse Dreaming:

| Firehorse Dreaming (local)                   | Anthropic Dreams API (Managed Agents)                   |
| -------------------------------------------- | ------------------------------------------------------- |
| `~/.claude/projects/-home-user-dws6/*.jsonl` | `sessions` (sesn\_\*, up to 100/dream)                  |
| `.claude/clawdbot/memory/*.md`               | input `memory_store`                                    |
| `--dream-curate` via ollama-spark            | `POST /v1/dreams` with `claude-opus-4-7`                |
| `proposals/curate-*.md`                      | output `memory_store` (separate, reviewable)            |
| `/promote-proposal`                          | "attach output to future sessions" or discard           |
| `--exclude`, `--max-age`, `--min-cluster`    | `instructions` field (4096 chars)                       |
| Status tracked in `state.json`               | `status: pending → running → completed/failed/canceled` |

**Substrate gap.** Anthropic Dreams runs over Managed Agents `sesn_*`
sessions inside their runtime. Firehorse Dreaming runs over Claude Code
`.jsonl` transcripts on disk. There is no API to convert one into the
other, so they aren't interchangeable surfaces — they're parallel
implementations of the same idea on different substrates.

**Why we keep the local version.** EU-on-prem path via DGX Spark
(`scripts/ollama-spark.sh`), no Managed Agents dependency, full
visibility into the prompt + raw model output (queue files are
inspectable), HIL-gated by `/promote-proposal` rather than implicit
"attach the new store" choice. If/when the repo migrates agents to
Managed Agents, Firehorse Dreaming becomes a thin wrapper over
`/v1/dreams`; until then, keep the local implementation as
source-of-truth.

## See also

- `skills/clawdbot/SKILL.md` — full capability surface (worker)
- `skills/promote-proposal/SKILL.md` — closes the cycle (promoter)
- `.claude/clawdbot/README.md` — directory layout
- CLAUDE.md → "Agent Productization Rule" + "Auto-Mode Trust Boundary"
- Anthropic docs: <https://docs.claude.com/en/docs/en/managed-agents/dreams> (research preview, gated access)
