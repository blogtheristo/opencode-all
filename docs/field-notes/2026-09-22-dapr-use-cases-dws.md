---
Status: PENDING_REVIEW
Date: 2026-09-22
Branch: claude/dapr-dws-use-cases-049za6
Author: Claude Sonnet 5
---

# Dapr Use Cases for DWS6/DWS7

## 0. Why Dapr fits here

DWS already runs the shape Dapr formalizes: many independent agent processes
(`src/agents/*.agent.ts`, 10 shipped + roadmap), an in-process pub/sub bus
(`src/agents/event-bus.ts`) with a comment saying "optional Redis Streams
backing for durability," a Temporal-based workflow layer (`workflows.ts`),
per-agent Docker sandboxing (Deputy-Agents-Architecture §Docker hardening),
and an LLM mesh router (`mcp-hub/llm_mesh.py`, `routing.py`). Dapr is a
sidecar runtime that gives standardized, swappable building blocks for
exactly these concerns — without locking DWS into one broker or one cloud.

## 1. Concrete use cases, ranked by payoff/effort

### 1.1 Pub/sub — replace the event-bus's "optional Redis" with Dapr pub/sub

`event-bus.ts` today is in-process only; Redis backing is aspirational.
Dapr's pub/sub building block (Redis Streams, or Kafka/Azure Service Bus
later, config-only swap) gives at-least-once delivery, CloudEvents envelope,
and topic-level dead-lettering for free. `DWSEvent` already has `type`,
`source`, `payload`, `priority`, `orgId`, `sessionId` — this maps almost
1:1 onto a CloudEvents `data` payload. Effort: low (sidecar + component
YAML); payoff: durable agent-to-agent events across process/container
restarts, which the current in-memory `eventLog` (cap 1000, lost on
restart) cannot give.

### 1.2 Service invocation between agent containers

Each Industrial Specialist Agent runs sandboxed (Docker, custom bridge
`dws-godagent-llm`, no internet). Today agent-to-agent calls presumably go
through the orchestrator directly. Dapr's service invocation gives mTLS,
retries, and distributed tracing (W3C traceparent) between sidecars without
each agent needing to know the network topology — useful once agents scale
past the current registry (`AGENT_ROSTER.json`) and start calling each
other directly instead of only being called by Athena/base orchestrator.

### 1.3 State management for agent session/context

`base.agent.ts` and per-agent durable stores (e.g. `aegis-durable-store.ts`)
look like hand-rolled state persistence. Dapr's state management API
(pluggable store — Postgres/Supabase-compatible, Redis) would let every
agent use one consistent `state.set/get` contract with optional TTL and
optimistic concurrency (ETags), instead of each agent hand-writing its own
persistence adapter. This is the highest-leverage refactor for the 10+
roadmap agents (2027) that don't exist yet — new agents inherit the
contract instead of re-deriving it.

### 1.4 Actors — per-agent-instance concurrency and lifecycle

The Docker hardening section (destroy() retry 3x, zombie tracking, 5-min
cleanup cron, LRU VRAM eviction, max 2 models concurrent) is a hand-built
actor lifecycle manager. Dapr Virtual Actors give single-threaded-per-actor
execution, turn-based concurrency, and built-in idle-timeout deactivation —
this is the same problem (bound concurrent stateful agent instances,
evict idle ones) Dapr actors were designed for. Would remove a meaningful
slice of custom lifecycle code, at the cost of adopting the actor
programming model for agent instances.

### 1.5 Workflow — complementary to, not a replacement for, Temporal

`event-bus.ts`'s own comment says "for complex multi-step workflows use
Temporal (`workflows.ts`)." Dapr Workflow (built on Durable Task) overlaps
with Temporal's role. **Do not migrate the Temporal workflows** — that's a
net-new distributed-transaction rewrite for no clear gain. Reserve Dapr
Workflow only for new, simpler orchestrations (e.g. a bounded compliance
check sequence) where a full Temporal worker is overkill.

### 1.6 Secrets — one API surface across Supabase, env, and future vaults

DWS pulls secrets from `.env`/Supabase today (Non-Negotiable Rule 1–2).
Dapr's secrets building block is a thin abstraction (local file, Kubernetes
secrets, HashiCorp Vault, AWS/GCP secret managers) an agent calls once
regardless of backend — relevant mainly if/when DWS moves agent hosting
off DGX-first onto a cluster where secret backends differ per environment.
Low priority now; DGX-first cost policy (CLAUDE.md Rule 14) means this
isn't urgent while everything is local.

### 1.7 Bindings — external triggers (Hilma tenders, regulatory radar, cron)

`hilma-watch`, `regulatory-radar`, and `cron` skills poll external sources
on a schedule. Dapr input bindings (cron, HTTP webhook) could trigger these
uniformly and decouple "what fires" from "what runs," but the existing
DGX Spark cron + GitHub Actions setup (see `/cron` skill) already does this
adequately — this is a "nice to have," not a gap.

## 2. What Dapr does NOT replace here

- **Temporal workflows** (`workflows.ts`) — keep, per its own doc comment.
- **KYA/Article-12 audit hash chain** — this is a compliance-specific
  tamper-evident log, not a generic building block; Dapr has no equivalent
  and shouldn't be forced into providing one.
- **LLM mesh routing** (`mcp-hub/llm_mesh.py`, `routing.py`) — model
  selection/fallback logic is domain-specific, not a Dapr building block.

## 3. Recommended pilot (smallest reversible step)

Pilot Dapr pub/sub (§1.1) only, behind the existing `EventBus` interface:
add a `RedisStreamsDaprEventBus` implementing the same `subscribe`/`publish`
shape as `event-bus.ts`, feature-flagged, tested against one low-risk
event type (e.g. `agent.task_complete`) before widening. This validates
the sidecar/component model on DGX without touching actor lifecycle,
state, or Temporal — the highest-blast-radius pieces — until the pilot
proves out.

## HIC decision needed

Approve piloting Dapr pub/sub (§3) as a spike on a feature branch, scoped
to the event bus only — yes/no, and if yes, DGX-local Redis or hosted?
