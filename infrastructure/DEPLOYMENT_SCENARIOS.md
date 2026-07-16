# DWS IQ — Deployment Scenarios

**Owner:** Lifetime Oy · risto.paarni@lifetime.fi
**Created:** 2026-07-16 · Branch: `claude/scaleway-pricing-update-19g8df`
**Status:** ACTIVE — canonical map of how/where the `dws-iq-backend` runs.

One backend image, three deployment scenarios. You pick by **sovereignty
posture**, not by feature set — the same agent brain runs in every one; only the
jurisdiction, infrastructure, and who-owns-the-data change. Sovereignty is a
chain (operator jurisdiction → data residency → operational control); a break in
any link voids the claim, so each scenario is scored on the **whole** chain, not
just where the compute sits.

---

## The three scenarios

|                    | **S1 · EU-Sovereign Cloud**                               | **S2 · Sovereign DGX (on-prem)** ← NEW                               | **S3 · Hybrid**                               |
| ------------------ | --------------------------------------------------------- | -------------------------------------------------------------------- | --------------------------------------------- |
| **Compute**        | Scaleway Serverless Containers (fr-par)                   | Customer/Lifetime NVIDIA DGX, `docker compose`                       | DGX at the edge + Scaleway for burst          |
| **Deploy path**    | `.github/workflows/deploy-scaleway.yml`                   | `.github/workflows/deploy-dgx-spark.yml`                             | both (they already both run on merge to main) |
| **Database**       | Supabase Cloud **(US-incorporated ⚠)** or Aiven (Finnish) | **Self-hosted Supabase on the DGX** (open-source)                    | Aiven / self-hosted per workload              |
| **Ingress**        | Scaleway public HTTPS (frontends already call it)         | Cloudflare Tunnel **(US transit ⚠)** or EU reverse proxy + static IP | per side                                      |
| **Data residency** | EU cloud (Paris/Amsterdam)                                | Never leaves your premises                                           | mixed                                         |
| **Model weights**  | Platform-hosted                                           | You own 100%                                                         | mixed                                         |
| **Uptime**         | Datacenter SLA                                            | Single box — office/residential power+ISP                            | DGX + cloud failover                          |
| **CLOUD Act**      | Zero **iff** DB is Aiven, not Supabase Cloud              | Zero **iff** DB + ingress are sovereign                              | per side                                      |
| **Best for**       | EU/UK-regulated SaaS, fast start, elastic                 | Aegis / classified / air-gap-mandated / weight ownership             | steel/defence edge + elastic reporting        |

> **⚠ The two things that quietly void "full sovereignty":**
>
> 1. **Supabase Cloud is US-incorporated.** Running the backend on the DGX but
>    reading/writing Supabase Cloud leaves the _data_ under the CLOUD Act. Full
>    S2 sovereignty **requires** self-hosted Supabase on the DGX (or Aiven).
> 2. **Cloudflare Tunnel is US transit.** Fine for most; for a maximal-sovereignty
>    S2 (defence/classified) prefer an EU reverse proxy on a static EU IP, or keep
>    the DGX fully air-gapped (no public ingress at all).

---

## S2 — Sovereign DGX: what's already built vs the remaining gap

**Already built (this is not greenfield):**

- `deploy-dgx-spark.yml` — auto-deploys on every merge to main: SSH → pull →
  `docker compose build/up` → health-check backend (8080) + cron (8081) +
  heartbeat (9999).
- `infrastructure/dgx-spark/docker-compose.yml` — backend, cron runner,
  heartbeat, Redis, MCP gateway, NemoClaw, **Cloudflare Tunnel** for ingress.
- `infrastructure/dgx-spark/first-boot.sh` — one-time host provisioning.

**The one real gap for _full_ sovereignty — the database.**
The backend is built on the Supabase client (`src/services/supabase.service.ts`,
used across dozens of routes/services). Today the DGX stack still points that
client at **Supabase Cloud (US)**. To close it without rewriting the data layer:

- **Run self-hosted Supabase on the DGX** (Supabase is open-source: Postgres +
  GoTrue + PostgREST + Storage + Studio via docker compose). The backend's
  `supabase.service.ts` client is unchanged — only `SUPABASE_URL` /
  `SUPABASE_SERVICE_KEY` point at `http://supabase-kong:8000` on the DGX.
- Result: identical code, data never leaves the box, zero US vendor in the path.
- Alternative (managed, still EU): point the client at **Aiven** (Finnish) — used
  by the Aegis tier already — if a managed EU DB is preferred over on-prem.

> **✅ Now wired (opt-in).** The self-hosted Supabase stack ships as an overlay:
> `infrastructure/dgx-spark/docker-compose.supabase.yml` (+ `supabase/kong.yml`,
> `supabase/env.sovereign.example`). It does **not** auto-start; enable it per
> `infrastructure/dgx-spark/SOVEREIGN_SUPABASE_SETUP.md`
> (`docker compose -f docker-compose.yml -f docker-compose.supabase.yml up -d`),
> generate keys, apply `supabase/migrations/`, then repoint `.env`. Authored but
> not yet first-run-validated on hardware.

**Ingress for S2:** keep Cloudflare Tunnel for convenience, OR (maximal
sovereignty) terminate TLS on an EU reverse proxy with a static EU IP, OR run
air-gapped with no public ingress (single-tenant Aegis on customer premises).

---

## How to run each scenario

- **S1 (cloud only):** ensure `SCW_*` secrets are set; `deploy-scaleway.yml`
  ships to fr-par on merge. (Frontends already call the scw.cloud URL.)
- **S2 (DGX only):** set `DGX_SPARK_*` secrets; `deploy-dgx-spark.yml` ships to
  the DGX on merge. To make the DGX the _public_ backend, repoint the frontends'
  API base URL from the scw.cloud endpoint to the DGX's tunnel/EU-proxy hostname.
  For full sovereignty, first stand up self-hosted Supabase on the DGX (above).
- **S3 (hybrid — current default):** both workflows run on merge; Scaleway serves
  public traffic, DGX runs sovereign inference + on-prem/failover. No change
  needed — this is what main does today.

## Decision rule

1. **Default to S1 (EU-Sovereign Cloud)** — fastest, datacenter uptime, closes the
   CLOUD Act _if the DB is Aiven_. Most EU industrial customers never leave it.
2. **S2 (Sovereign DGX)** when a physical air-gap or 100% weight ownership is a
   hard requirement (Aegis / defence / classified), **or** a steady 24/7 workload
   makes owned hardware cheaper than metered cloud over 2–3 years. Requires the
   self-hosted-Supabase step for full sovereignty.
3. **S3 (Hybrid)** for edge-plus-elastic (DGX at the regulated edge, cloud for
   reporting bursts). Same image both sides.

## Open items

- [x] S2 full sovereignty: self-hosted Supabase stack added
      (`docker-compose.supabase.yml` + `supabase/kong.yml` + env template).
      **Remaining (operator, on hardware):** generate keys, apply
      `supabase/migrations/`, repoint `.env`, first-run validate — per
      `SOVEREIGN_SUPABASE_SETUP.md`. (Image tags need confirming before first boot.)
- [ ] S2 ingress: decide Cloudflare Tunnel vs EU reverse proxy vs air-gap per
      customer.
- [ ] If S2 becomes a customer's _primary_, repoint that customer's frontend API
      base URL and update their DPA sub-processor chain accordingly.
- [ ] Cross-ref: `infrastructure/cloudrun/EXIT_CLOUDRUN_RUNBOOK.md` (why we left
      GCR), `dws10.com/products/cloud-pricing.html` + `/price-list/#deployment`
      (customer-facing view of the same three scenarios).
- [ ] S2 capex: NVIDIA raised DGX Spark $3,999→$4,699 (+18%, memory supply) —
      same crisis as the Scaleway cloud increase, on the on-prem side. Cost +
      resale-margin analysis: `docs/field-notes/2026-07-16-nvidia-hardware-pricing.md`.
