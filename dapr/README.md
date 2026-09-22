# Dapr Pub/Sub Pilot

Scope: **one event type** (`agent.task_complete`), **one building block**
(pub/sub). Nothing else in `docs/field-notes/2026-09-22-dapr-use-cases-dws.md`
(service invocation, state, actors) is implemented — do not extend this
setup to other topics without a new decision.

Default state: **off**. `DAPR_PUBSUB_PILOT_ENABLED` is unset in every
environment until the HIC turns it on for a specific run.

## What this does

`src/agents/event-bus.ts` already dispatches events to local, in-process
subscribers. When `DAPR_PUBSUB_PILOT_ENABLED=true`, an `agent.task_complete`
event is _additionally_ published to a Dapr sidecar, which durably queues
it in Redis Streams and can redeliver it to this (or another) process via
`POST /dapr/events/agent-task-complete` (`src/routes/dapr-pubsub.routes.ts`).
Local dispatch never depends on Dapr — if the sidecar is down, `emit()`
still runs local handlers; only the Dapr publish call fails, and it fails
silently (logged as a warning).

## Prerequisites

- Dapr CLI (standalone mode — no Kubernetes required):
  `curl -fsSL https://raw.githubusercontent.com/dapr/cli/master/install/install.sh | /bin/bash`
  then `dapr init` (installs the local Redis/Zipkin dev containers — skip
  with `dapr init --slim` if you want to point at DWS's own Redis instead,
  which is the intended pilot setup so pilot traffic doesn't fork onto a
  second, untracked Redis).
- `envsubst` (part of `gettext`; `brew install gettext` / `apt-get install gettext-base`).
- `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`, `REDIS_TLS` already set in
  the environment — these are the same vars `redis-rate-limiter.service.ts`
  and `redis-token-blacklist.service.ts` use. **Recommendation from the
  field note**: point the pilot at a separate Redis logical DB or a
  short-lived pilot instance, not the production rate-limiter/token-
  blacklist instance, so a pilot bug can't affect either.

## Run the pilot locally

```bash
# 1. Render the component from its template (never commit the rendered file — it holds a plaintext password)
mkdir -p dapr/components/.rendered
envsubst < dapr/components/pubsub.yaml.tpl > dapr/components/.rendered/pubsub.yaml

# 2. Run the app with a Dapr sidecar attached
DAPR_PUBSUB_PILOT_ENABLED=true dapr run \
  --app-id dws-api \
  --app-port 3000 \
  --dapr-http-port 3500 \
  --resources-path ./dapr/components/.rendered \
  -- npm run dev
```

`dapr run` starts `daprd` (the sidecar) and the app together; the sidecar
calls `GET localhost:3000/dapr/subscribe` on boot to register interest in
`agent.task_complete`, then delivers matching events back to
`POST localhost:3000/dapr/events/agent-task-complete`.

## Turning it off

Unset `DAPR_PUBSUB_PILOT_ENABLED` (or run the app without `dapr run` /
without a sidecar present) — `publishToDapr()` in `event-bus.ts` is the
only code path touched by the flag, and a missing sidecar just produces a
logged warning, never a crash. Deleting this directory and the two touched
files (`src/agents/event-bus.ts`, `src/routes/dapr-pubsub.routes.ts`,
`src/app.ts`'s two added lines) is the full rollback if the pilot doesn't
hold up.

## Decision gate (2-week window from pilot start)

Per the field note: widen to more event types only if, over the pilot
window, (a) no events are silently dropped, (b) sidecar CPU/RAM overhead
on DGX is acceptable, and (c) it adds no meaningful operational burden.
Record the outcome in a follow-up field note either way.
