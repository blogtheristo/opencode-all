# Workflow v2 — Sales Outreach, Chapter One

Scope for the first procedural graph run on top of Workflow v2
(`src/agents/workflow-v2/`, PR #2059), answering the goal-3 reframe
("create new sales") from `docs/field-notes/2026-09-21-gitex-ai-turkiye-google-cloud-3-goals.md`.

Full chapter list (2–8) and the Mission Control / Admin dashboard placement
decision: `docs/workflow-v2-chapters-roadmap.md`.

## What "chapter one" means here

Chapter one is a scope boundary, not a chapter number in a document. It is
the smallest procedural graph that:

1. is grounded in infrastructure that already exists (no new schema, no new
   send transport),
2. runs one prospect thread end-to-end, single-threaded, and
3. cannot violate the RED-zone rule on outbound email no matter what the
   executor LLM decides.

Multi-prospect fan-out, the Refiner's automated graph-editing loop running
unattended, and cross-pipeline (investor + customer + partner) batching are
explicitly **out of scope** for chapter one — those are chapter two+.

## The graph

`src/agents/workflow-v2/examples/sales-outreach.graph.json` — 15 nodes,
validated against `validateGraph()` (structurally sound: every edge resolves,
no duplicate ids, start node exists).

Node ids map 1:1 onto the existing `OutreachStatus` enum
(`src/outreach/types.ts`) wherever one exists, so a run's trace can be
projected directly onto an `outreach_threads` row — no new state machine is
being invented, this graph makes the implicit one in `types.ts` explicit and
enforces its edges (e.g. you cannot jump straight from `RESEARCH` to
`CONVERTED`; the existing enum allowed that structurally, the graph doesn't).

## Tool binding per node (what the Executor actually calls)

| Node                                                                   | Backing code / doc                                                                                             |
| ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| START                                                                  | `sales-outreach/*.md` prospecting docs, `TED_CONSTRUCTION_LEADS_PACK_2026-09-18.md`                            |
| RESEARCH                                                               | `src/outreach/types.ts` (Organization/Person shape)                                                            |
| INTRO_REQUESTED / INTRO_MADE                                           | `investor-outreach` skill pattern generalized to customer/partner pipelines                                    |
| DRAFT_OUTREACH                                                         | `src/outreach/prospect-email-templates.ts`, or a matching `sales-outreach/INTRO_*.md` / `LETTER_*.md` template |
| HIC_APPROVAL_GATE                                                      | `src/agents/workflow-v2/runner.ts` (`ApprovalRequiredError`, `computeApprovalHash`) — implemented, see below   |
| SEND                                                                   | Amazon SES (SMTP) — **not** the `/email` skill's Resend path (see Known Conflict)                              |
| AWAIT_RESPONSE                                                         | `src/outreach/cadence.ts`, `scheduler.ts`, `reply-parser.ts`                                                   |
| RESPONDED / MEETING_BOOKED / NEGOTIATION / CONVERTED / PASSED / PARKED | `OutreachStatus` values, `outreach_activities` table                                                           |
| ERROR_RECOVERY                                                         | Bounce/deliverability handling — no backing code yet                                                           |

## The one hard gate: HIC_APPROVAL_GATE

CLAUDE.md's RED zone is unambiguous: **outbound email is BLOCKED, human
required**, no exceptions, no bypass-is-not-permission. The graph's own
node descriptions say the executor must stop and show the draft — but a
node description is a prompt-level instruction, and Discipline rule #12
(fail loud) means chapter one should not trust the LLM alone to honor it.

**Implemented.** `runExecutorStep()` in `src/agents/workflow-v2/runner.ts`
now enforces this in code, not just in the prompt:

- Any transition leaving a node whose id is in `gatedNodeIds` (default:
  `DEFAULT_GATED_NODE_IDS = ['HIC_APPROVAL_GATE']` — general by node id, not
  hardcoded to this one graph) requires an `approvedTransitions` array of
  `ApprovalToken`s to be passed in.
- Each `ApprovalToken` carries a SHA-256 `hash` (`computeApprovalHash` in
  `graph.ts`) binding the approval to the exact `graphName` + `fromNode` +
  `toNode` + draft text, plus an `approvedAt` ISO timestamp.
- If no token in the list matches the hash of the draft the executor just
  produced for this exact edge, `runExecutorStep` throws
  `ApprovalRequiredError` and the transition does not happen — a rubber
  stamp for the edge in general does not satisfy the gate, only a hash
  computed over the actual draft text does.
- A matching token lets the transition proceed normally.

The existing `runExecutorStep(client, graph, currentNodeId, userInput)`
signature is unchanged; the gate is an additional optional 5th parameter,
so callers and tests that don't pass it are unaffected on ungated nodes.
Tests: `src/__tests__/agents/workflow-v2.test.ts` ("runExecutorStep —
HIC_APPROVAL_GATE code-level enforcement").

## Known conflict to resolve before SEND is wired up

`.claude/commands/email.md` (the `/email` skill) documents a **Resend**
transport. CLAUDE.md Non-Negotiable Rule 4 says **never use Resend; email
transport is Amazon SES (SMTP) only**, and `src/outreach/prospect-email-templates.ts`
already says "ready for Amazon SES" in its own header. The `/email` skill
doc is stale against current policy. Chapter one's SEND node must go through
whatever the SES path actually is in `src/outreach/`, not through `/email`,
until that skill doc is corrected.

## Not building yet

- Bounce/deliverability handling code for `ERROR_RECOVERY`.
- Wiring this graph into an actual CLI/skill entry point (same open question
  as Workflow v2 itself — see PR #2059's HIC decision question).

## HIC decision needed

The approval-hash gate is built. Remaining open question: wire this graph
into an actual CLI/skill entry point that issues `ApprovalToken`s from a
real HIC approval step (e.g. `/blog-draft`-style show-text-and-wait), or
leave that wiring for the broader Workflow v2 CLI question (PR #2059)?
