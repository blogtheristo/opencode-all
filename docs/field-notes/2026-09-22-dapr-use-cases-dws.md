---
Status: PENDING_REVIEW
Date: 2026-09-22
Branch: claude/dapr-dws-use-cases-049za6
Author: Claude Sonnet 5
Update 2026-09-22: HIC approved the §3 Phase 1 pub/sub pilot. Implemented —
see "§3a Pilot: implemented" below.
---

# Dapr Use Cases for DWS6/DWS7

## 0. What Dapr actually is, and why it's being considered here

Dapr (Distributed Application Runtime, CNCF graduated) is not a framework
you import — it's a **sidecar process** that runs next to each service and
exposes a stable HTTP/gRPC API for cross-cutting distributed-systems
concerns (pub/sub, service-to-service calls, state, secrets, scheduled
work, actor lifecycle). Your application code calls `localhost:3500/...`
on its own sidecar; Dapr's sidecar talks to whatever concrete backend is
declared in a small YAML "component" file (Redis today, Kafka or a cloud
queue tomorrow) with **zero application code changes** on swap. It runs in
standalone/Docker Compose mode (no Kubernetes required) or on k8s later,
which matters because DWS is DGX-first (`docs/DWS_COST_POLICY_STANDARD.md`)
and not currently on a k8s cluster.

**Why this is on the table for DWS specifically**, not Dapr-for-its-own-sake:
DWS already runs the shape Dapr formalizes — many independent agent
processes (`src/agents/*.agent.ts`, 10 shipped + roadmap), an in-process
pub/sub bus (`src/agents/event-bus.ts`) whose own comment calls Redis
backing "optional" (i.e. not actually built), a Temporal-based workflow
layer (`workflows.ts`), per-agent Docker sandboxing (Deputy-Agents-
Architecture §Docker hardening — hand-rolled actor lifecycle), and an LLM
mesh router (`mcp-hub/llm_mesh.py`, `routing.py`). Each of these is DWS
solving a problem Dapr ships as a building block. The forcing fact that
tips this from "interesting" to "cheap to try": **Redis is already a first-
class dependency** — `ioredis` and `@upstash/redis` are both in
`package.json` and already used by five services (`aegis-durable-store.ts`,
`redis-token-blacklist.service.ts`, `redis-rate-limiter.service.ts`,
`email-queue.service.ts`, `resolveTerm.ts`). Dapr's Redis pub/sub and state
components run against that same Redis — no new infra to stand up for the
pilot in §3.

## 1. Concrete use cases, ranked by payoff/effort

Each entry: **the gap today → what Dapr's building block mechanically
does → what it costs to adopt.**

### 1.1 Pub/sub — durable delivery for agent-to-agent events (★ recommended pilot)

**Gap:** `event-bus.ts` keeps subscriptions and a 1000-event ring buffer
in a single process's memory (`event-bus.ts:41-44`). Restart the process —
or the container gets OOM-killed, or DWS scales to two orchestrator
replicas — and every undelivered event and the whole log is gone. There is
no retry, no dead-letter, no cross-process fan-out.

**Mechanism:** Dapr's pub/sub building block puts a broker (Redis Streams
here) behind a uniform `POST /v1.0/publish/{pubsub}/{topic}` /
subscription-endpoint API. It gives at-least-once delivery, automatic
retry with backoff, and a CloudEvents envelope. `DWSEvent`'s existing
shape (`type`, `source`, `payload`, `priority`, `orgId`, `sessionId`,
`event-bus.ts:20-27`) maps directly onto the CloudEvents `data` field, so
no event schema redesign is needed — only the transport underneath
`publish()`/`subscribe()` changes.

**Cost:** Low. One Dapr sidecar container per service, one `pubsub.yaml`
component pointing at the Redis DWS already runs. The existing
`EventBus.subscribe(pattern, handler)` / `publish()` call shape can be kept
as the public interface with a Dapr-backed implementation swapped in
underneath — callers in agent code don't change.

### 1.2 Service invocation between agent containers

**Gap:** Industrial Specialist Agents run in isolated Docker containers on
a custom bridge (`dws-godagent-llm`) with no internet access
(Deputy-Agents-Architecture §Docker hardening). Any direct agent-to-agent
call today has to be hand-wired with its own retry/timeout/auth logic, or
routed back through the orchestrator as a single choke point.

**Mechanism:** Dapr service invocation lets sidecar A call
`localhost:3500/v1.0/invoke/agent-b/method/doTask` and Dapr resolves the
target sidecar, retries transient failures, and wraps the call in mTLS —
all without agent code knowing the other agent's network address.
Distributed tracing (W3C traceparent) comes for free, which is relevant to
the existing Article-12 audit trail requirement (trace, not just log, a
cross-agent call chain).

**Cost:** Medium — only pays off once agents actually need to call each
other directly, which isn't confirmed as a current pattern (most likely
everything still routes through Athena/the base orchestrator). **Don't
build this speculatively** — revisit when a second or third agent-to-agent
call site appears in code (Rule 2, simplicity first).

### 1.3 State management for agent session/context

**Gap:** `aegis-durable-store.ts` and likely other per-agent stores each
hand-roll their own persistence adapter — connection handling, key
namespacing, TTL, concurrency control, all bespoke per agent.

**Mechanism:** Dapr's state API is one contract —
`state.set(store, key, value, {ttl, etag})` / `state.get()` — pluggable to
Redis, Postgres, or any of ~20 backends via component YAML, with built-in
optimistic concurrency (ETags) so two agent instances don't clobber the
same key.

**Cost:** Medium, mostly migration risk on `aegis-durable-store.ts`
specifically (it's presumably load-bearing for the KYA audit path — do
not touch it without a dedicated review). **Highest real leverage is
forward-looking**: give this contract to the 10+ roadmap agents (2027)
that don't exist yet, so they inherit one persistence pattern instead of
each writing a new store class.

### 1.4 Actors — per-agent-instance concurrency and lifecycle

**Gap:** The Docker hardening section is, functionally, a hand-built actor
runtime: `destroy()` retry 3×, zombie container tracking, a 5-minute
cleanup cron, LRU VRAM eviction, a hard cap of 2 concurrent models. That's
several hundred lines of lifecycle bookkeeping solving exactly the problem
virtual actors exist for.

**Mechanism:** Dapr Virtual Actors give single-threaded-per-actor
execution (no lock contention within one agent instance), turn-based
concurrency, and automatic idle-timeout deactivation — the framework
evicts idle actor instances for you instead of a custom cron sweeping for
zombies.

**Cost:** High — this means re-modeling agent instances as Dapr actors,
which is an architecture change, not a bolt-on. Real payoff (deletes
custom lifecycle code) but **not a candidate for now**; revisit only after
§1.1 (pub/sub) has proven the sidecar model works well in the DGX
environment.

### 1.5 Workflow — complementary to, not a replacement for, Temporal

`event-bus.ts`'s own comment defers "complex multi-step workflows" to
Temporal (`workflows.ts`). Dapr Workflow (built on the same Durable Task
model Temporal popularized) covers the same ground as Temporal.
**Do not migrate the Temporal workflows** — that would be a distributed-
transaction rewrite of working orchestration logic for no functional gain,
a direct violation of Rule 3 (surgical changes) and Rule 2 (simplicity
first: don't run two workflow engines). If a genuinely new, simple,
bounded orchestration shows up later (e.g., a 3-step compliance check that
doesn't need Temporal's durability guarantees), Dapr Workflow is a lighter
option than standing up a new Temporal worker for it — but that's a
future, narrow decision, not part of this recommendation.

### 1.6 Secrets — deprioritized

Dapr's secrets building block (one API over local file / Vault / cloud
secret managers) only earns its keep once secret backends differ across
environments. DWS is DGX-first with Supabase/`.env` today
(Non-Negotiable Rules 1–2) — one backend, one place. **No action**; revisit
only if DWS starts running agents somewhere secrets aren't uniformly
sourced from Supabase/env.

### 1.7 Bindings — deprioritized

Dapr input bindings (cron, webhook) could trigger `hilma-watch`,
`regulatory-radar`, and similar polling skills uniformly. But DGX Spark
cron + GitHub Actions (see `/cron` skill) already does this and is
audited. Replacing a working, audited trigger mechanism for architectural
tidiness alone fails Rule 2 (no speculative abstractions). **No action.**

## 2. What Dapr does NOT replace here

- **Temporal workflows** (`workflows.ts`) — keep, per its own doc comment.
- **KYA/Article-12 audit hash chain** — this is a compliance-specific
  tamper-evident log, not a generic building block; Dapr has no equivalent
  and shouldn't be forced into providing one.
- **LLM mesh routing** (`mcp-hub/llm_mesh.py`, `routing.py`) — model
  selection/fallback logic is domain-specific, not a Dapr building block.

## 3. Recommendation

**Adopt Dapr, but only for §1.1 (pub/sub), starting as a scoped pilot —
do not adopt it as a platform-wide runtime.** Reasoning:

- It replaces a component that is a documented gap today (durable event
  delivery), not a working thing being swapped for novelty.
- It costs near-zero new infrastructure — Redis is already a dependency.
- It is fully reversible — the change stays behind the existing
  `EventBus` interface, so a rollback is deleting one implementation file
  and flipping a flag back, not an architecture unwind.
- Everything else (§1.2 actors-adjacent service invocation, §1.3 state,
  §1.4 actors) is real but premature: none has a documented current pain
  point as concrete as the event bus's "in-memory, capped at 1000,
  discarded on restart" gap. Building them now would be exactly the
  speculative abstraction Rule 2 warns against.

**Phased plan:**

1. **Pilot (this branch or a follow-on):** add `RedisStreamsDaprEventBus`
   implementing the existing `subscribe`/`publish` shape from
   `event-bus.ts`, run behind a feature flag, against the Redis DWS
   already has. Validate on one low-risk event type (`agent.task_complete`)
   for a defined window (recommend 2 weeks) before widening to other event
   types.
2. **Decision gate:** if the pilot holds up (no dropped events, sidecar
   overhead acceptable on DGX, no new operational burden) — widen pub/sub
   to all `DWSEvent` types and retire the in-memory bus.
3. **Do not proceed to §1.2–§1.4** without a separate, concrete trigger
   (e.g., a real agent-to-agent call site appears, or the Docker lifecycle
   code becomes a maintenance burden) — each is its own decision, not an
   automatic next phase.

**Sequencing note:** run this pilot before any Docker/actor-lifecycle work
elsewhere in the roadmap — it's the cheapest way to learn whether the
Dapr sidecar model behaves acceptably in the DGX-first, no-Kubernetes
environment before committing to it for anything higher-stakes (§1.4).

## HIC decision needed

~~Approve the phased plan above~~ — **APPROVED 2026-09-22.** Phase 1
implemented on this branch:

## 3a. Pilot: implemented

- `src/agents/event-bus.ts` — `emit()` additionally publishes to Dapr only
  when `DAPR_PUBSUB_PILOT_ENABLED=true` and `event.type === 'agent.task_complete'`;
  local dispatch is unconditional and independent of the sidecar (a
  publish failure is logged and swallowed). Added `dispatchFromDapr()` so
  events delivered back by the sidecar dispatch to local subscribers
  without re-publishing (no loop).
- `src/routes/dapr-pubsub.routes.ts` — `GET /dapr/subscribe` (declares the
  one pilot topic) and `POST /dapr/events/agent-task-complete` (delivery
  callback), mounted at `/dapr` in `src/app.ts`.
- `dapr/components/pubsub.yaml.tpl` + `dapr/README.md` — Redis pub/sub
  component template (render via `envsubst`, gitignored once rendered —
  it holds a plaintext Redis password) and full run/rollback instructions.
- Tests: `src/__tests__/event-bus-dapr-pilot.test.ts` (4 cases: flag off
  by default, only the pilot event type touches Dapr, local dispatch
  survives a down sidecar, no publish-loop via `dispatchFromDapr`) and
  `src/__tests__/dapr-pubsub-routes.test.ts` (3 cases covering the
  subscribe/deliver contract). 8/8 passing, `tsc --noEmit` clean on all
  touched files.
- **Default state remains off** (`DAPR_PUBSUB_PILOT_ENABLED` unset) — this
  PR ships the capability, not a live pilot. Turning it on for a real
  2-week window, and which Redis instance to point it at, is still an HIC
  call — see `dapr/README.md` "Prerequisites" for the isolation
  recommendation (separate instance/DB from the production rate-
  limiter/token-blacklist Redis).

## HIC action remaining

1. Pick the pilot Redis (reuse existing instance/DB, or spin up a
   short-lived separate one — `dapr/README.md` recommends separate).
2. Say when to flip `DAPR_PUBSUB_PILOT_ENABLED=true` in a real environment
   to start the 2-week observation window from §3.
