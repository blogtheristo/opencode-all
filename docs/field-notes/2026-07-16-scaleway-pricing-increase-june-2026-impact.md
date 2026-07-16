# Scaleway Pricing Increase (1 June 2026) — Impact on DWS Cost Economics

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Opus 4.8) | Session: claude/scaleway-pricing-update-19g8df | Date: 16.07.2026 | Changes: Initial — captured Scaleway "A transparent update on Scaleway pricing" (effective 2026-06-01); mapped every increased line item to the products we actually run; computed impact on the €18.74 baseline invoice and on per-client economics; decision: HOLD customer-facing DWS IQ pricing (no products.json / cloud-pricing.html change)

Session Links & References:

- Source: https://www.scaleway.com/en/blog/a-transparent-update-on-scaleway-pricing/ (Scaleway blog, published 27.04.2026, effective 01.06.2026)
- Related field note: docs/field-notes/2026-04-05-scaleway-eu-inference-setup.md (baseline invoice + per-client economics this note re-scores)
- Related field note: docs/field-notes/scaleway-infrastructure-setup.md (live container, fr-par, DR failover to Cloud Run)
- Customer pricing surface: dws10.com/products/cloud-pricing.html (EU Sovereign tiers use Scaleway compute)
- CLAUDE.md Source-of-Truth § Store/Product Pricing (products.json is the single price source)

Document Status:

- Created: 16.07.2026
- Last Modified: 16.07.2026
- Language: English
- Publication Status: ACTIVE (private — infra cost analysis)

---

**Type:** Field Note / Infrastructure Cost Analysis
**Scope:** Scaleway spend on project `dws-iq-backend` (fr-par); EU Sovereign tier COGS
**Owner:** Lifetime Oy · risto.paarni2024@lifetime.fi

---

## TL;DR

Scaleway raised prices on a specific set of products **effective 1 June 2026**
(their first increase in three years). The two facts that matter for us:

1. **Our single largest Scaleway variable cost — Generative APIs token
   inference — is NOT on the increase list.** Per-client LLM cost is flat.
2. **Serverless Containers _CPU_ is NOT on the list either** — only the
   _memory_ component doubles. Since our container bill is CPU-dominated
   (~91% CPU, ~9% memory in the March invoice), the scary "2× memory"
   headline adds only **~€1.92/month** to the current baseline.

**Decision: HOLD customer-facing DWS IQ pricing.** Blended infra cost rises
~5–8% per client; infra is 1.5–5% of revenue, so the margin hit is ~0.1–0.4
percentage points — absorbed, exactly as Scaleway absorbed its own upstream
costs for three years. No change to `products.json` or `cloud-pricing.html`.

## What Scaleway said (context)

Scaleway held prices flat for 3 years while absorbing inflation, a hardware
crisis (RAM + storage cost surges), and the IPv4 shortage. Rather than a
blanket hike, they ran a product-by-product analysis and raised only specific
lines, effective 2026-06-01. Network products (Public Gateways, Load
Balancers, IPv4) also carry a strategic _repositioning_ uplift beyond pure
cost pass-through. Anything not on their list is unchanged.

## Increases mapped to _our_ stack

### Hits us now (live `dws-iq-backend` workload)

| Product                              | Current          | New (01.06.2026) | Δ         | Where it lands                 |
| ------------------------------------ | ---------------- | ---------------- | --------- | ------------------------------ |
| Serverless Containers — **Memory**   | €0.000001 /GB-s  | €0.000002 /GB-s  | **+100%** | Our fr-par backend container   |
| Object Storage — Standard Multi-AZ   | €0.00002 /GB-h   | €0.000022 /GB-h  | +10%      | Art.12 / CSRD evidence archive |
| Object Storage — One Zone            | €0.0000103 /GB-h | €0.000011 /GB-h  | +6.8%     | Cold evidence copies           |
| Block Storage SSD / 5K Low-Latency   | €0.000118 /GB-h  | €0.00013 /GB-h   | +10.2%    | Managed DB + instance volumes  |
| Block Storage Snapshot               | €0.000044 /GB-h  | €0.000049 /GB-h  | +11.4%    | Backups                        |
| Managed-DB block (SBS 5K / Data Lab) | €0.000118 /GB-h  | €0.000136 /GB-h  | +15.3%    | If Scaleway Managed PostgreSQL |

### Hits us at production / enterprise scale

| Product                                      | Current         | New             | Δ                     | Trigger                           |
| -------------------------------------------- | --------------- | --------------- | --------------------- | --------------------------------- |
| Flexible IPv4 (Bare Metal / Zonal / GW / LB) | €0.004 /h       | €0.005 /h       | **+25%**              | Dedicated production networking   |
| VPC Public Gateway S                         | €0.0199 /h      | €0.026 /h       | +30.7%                | Per-enterprise VPC egress         |
| VPC Public Gateway M                         | €0.0802 /h      | €0.095 /h       | +18.5%                | Larger VPC                        |
| Load Balancer GP-S                           | €0.016 /h       | €0.023 /h       | **+43.8%**            | Production HA front door          |
| Load Balancer GP-M                           | €0.037 /h       | €0.054 /h       | **+45.9%**            | Larger production LB              |
| Key Manager — version storage                | €0.04 /key/mo   | €0.06 /key/mo   | +50%                  | WORM key custody for evidence     |
| Serverless Functions — Consumption           | €0.000012 /GB-s | €0.000017 /GB-s | +41.7%                | If we move containers → functions |
| Serverless Jobs — Memory                     | €0.000001 /GB-s | €0.000002 /GB-s | +100%                 | Batch (synthetic-data pipeline)   |
| Dedibox / EM bare metal                      | (varies)        | +4% to +17%     | +12.5–16.7% (Core-10) | **Aegis single-tenant COGS**      |

### Does NOT hit us (neutral — the important column)

| Product                                                  | Status                      | Why it matters                                                                                                 |
| -------------------------------------------------------- | --------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **Generative APIs (token inference)**                    | **Not on list — unchanged** | Our biggest variable cost. Per-client LLM spend is flat.                                                       |
| **Serverless Containers — CPU**                          | **Not on list — unchanged** | ~91% of our current container bill.                                                                            |
| Container Registry                                       | Unchanged                   | Holds our Docker images.                                                                                       |
| GPU instances (H100 +5–10%, L40S +5%, L4 +5–8.5%)        | Rose, but **N/A**           | We run inference on owned DGX + Gen APIs, not Scaleway GPU rental.                                             |
| DNS zone for external domains (€0.001→€0.007, **+600%**) | **N/A — verify**            | Our DNS is on Cloudflare (dws6.com), not Scaleway.                                                             |
| Managed PostgreSQL compute                               | Not on list                 | Only the underlying block storage rose (+15%). Customer EU stack uses **Aiven** PG anyway (see conflict note). |

> **Conflict flagged (CLAUDE.md Rule 7).** `cloud-pricing.html` advertises the
> EU Sovereign database as **Aiven PostgreSQL (Finland)**, while the April cost
> note models **Scaleway Managed PostgreSQL**. For customer-facing DB the Aiven
> line governs (unaffected by this Scaleway change); the Scaleway Managed-DB
> block-storage +15% only applies to internal/agent PG if run on Scaleway. Do
> not blend the two — pick per workload.

## Impact on the baseline invoice (March 2026 = €18.74)

| Line                                  | March      | Post-01.06.2026 | Note                |
| ------------------------------------- | ---------- | --------------- | ------------------- |
| Serverless Containers CPU (fr-par)    | €19.19     | €19.19          | CPU unchanged       |
| Serverless Containers Memory (fr-par) | €1.92      | **€3.84**       | ×2                  |
| Serverless Free-Tier offset           | −€2.40     | −€2.40          | Assumed to continue |
| Registry Storage                      | €0.03      | €0.03           | Unchanged           |
| **Month total**                       | **€18.74** | **~€20.66**     | **+€1.92 / +10.2%** |

The doubling of memory adds only €1.92 because the workload is CPU-bound and
CPU did not move. This is the whole story of the increase for our live footprint.

## Impact on per-client economics

Re-scoring the April note's scenarios (LLM inference flat; containers memory
2×; object +10%; block/DB storage +10–15%; networking +25–46% on its sub-line):

| Scenario                          | Was (€/yr) | Now (€/yr) | Δ   |
| --------------------------------- | ---------- | ---------- | --- |
| Conservative (light, shared)      | ~€580      | ~€610      | +5% |
| Moderate (typical enterprise)     | ~€1,200    | ~€1,285    | +7% |
| Heavy (power users, dedicated PG) | ~€3,300    | ~€3,560    | +8% |

Against €30k–€80k/client/yr subscription revenue, infra moves from 1.5–5% to
~1.6–5.4% of revenue — a **0.1–0.4 pp** margin change. Negligible. If the
Scaleway Startup Program is admitted, credits mute even this.

## Decision: HOLD customer pricing

- **No change** to `dws10.com/config/products.json` or `cloud-pricing.html`
  (and no dual-folder mirror sync needed — nothing changed).
- Rationale mirrors Scaleway's own posture: absorb a modest, well-understood
  cost increase rather than pass a headline number to customers. Unit economics
  have ample headroom.
- The EU Sovereign value proposition (zero CLOUD Act, EU residency) is
  unaffected — this is a cost note, not a positioning note.

## Watch / action items

- [ ] **Verify no external DNS zones live on Scaleway** — the +600% DNS line is
      only relevant if any zone is hosted there; expected N/A (DNS on Cloudflare).
- [ ] **Model dedicated production networking into enterprise/dedicated COGS**
      before quoting — Public Gateway + Load Balancer + IPv4 rose 25–46% on the
      network sub-line; small in absolute terms but the largest % movers.
- [ ] **Re-check Aegis (€59,990 tier) margin** — Dedibox / EM bare metal
      +12.5–16.7% flows straight into single-tenant COGS.
- [ ] **Key Manager +50%** — trivial per key, but WORM key custody scales with
      client count; note in the Art.12 evidence cost model.
- [ ] **Re-pull the June/July 2026 invoice** to confirm the modeled +€1.92 and
      free-tier continuation; update this note's Version block with actuals.

---

**Footer**
Owner: Lifetime Oy (risto.paarni@lifetime.fi)
Business ID: 0772407-9 | VAT: FI07724079
Part of the Lifetime World Model (LWM) field-notes corpus.
