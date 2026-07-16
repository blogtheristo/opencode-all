# Google Cloud Run Pricing — Why the "Hefty Charges", and How to Cap Them

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Opus 4.8) | Session: claude/scaleway-pricing-update-19g8df | Date: 16.07.2026 | Changes: Initial — captured Google Cloud Run 2026 pricing; diagnosed the three cost traps (always-allocated min-instances, ~3× CPU rate vs Scaleway, metered egress); modelled our container both ways (Scaleway ~€20.66/mo vs GCR ~€60–63/mo); confirmed GCR stays a COLD DR failover only, never warm traffic

Session Links & References:

- Source: https://cloud.google.com/run/pricing
- Related field note: docs/field-notes/scaleway-infrastructure-setup.md (DR failover to Cloud Run, project dws6run6)
- Related field note: docs/field-notes/2026-04-05-scaleway-eu-inference-setup.md (€18.74 baseline invoice; "Legacy Cloud Run migrating to Scaleway")
- Companion note: docs/field-notes/2026-07-16-scaleway-pricing-increase-june-2026-impact.md
- CLAUDE.md § Cloud Environments (GCP dws6run6 failover)

Document Status:

- Created: 16.07.2026
- Last Modified: 16.07.2026
- Language: English
- Publication Status: ACTIVE (private — infra cost analysis)

---

**Type:** Field Note / Infrastructure Cost Analysis
**Scope:** Google Cloud Run (project `dws6run6`) — DR failover for `dws-iq-backend`
**Owner:** Lifetime Oy · risto.paarni2024@lifetime.fi

---

## TL;DR

Cloud Run's "hefty charges" are not one price — they are **three cost traps**
stacking on top of a per-unit CPU rate that is **~3× Scaleway's**:

1. **Always-allocated CPU / `min-instances ≥ 1`** — you pay 24/7 even at zero
   traffic. One always-on 1-vCPU/512 MB service ≈ **$62/mo of CPU alone**,
   before a single request.
2. **Metered network egress** — standard GCP internet egress (~$0.085–$0.12/GB
   tiered) plus inter-region — absent on Scaleway serverless at this scale.
3. **Higher unit price** — request-based CPU is **$0.00003360/vCPU-s** vs
   Scaleway's **€0.00001/vCPU-s** (~3×).

**Same container, both ways: Scaleway ~€20.66/mo vs Cloud Run ~€60–63/mo (~3×).**
GCR must remain a **cold DR failover only** (scale-to-zero, no min instances,
no warm traffic). This note is the receipt for that decision.

## Google Cloud Run pricing (2026)

Two billing modes:

### Request-based (CPU only during requests) — has a free tier

| Resource | Price (beyond free tier) | Free tier / month  |
| -------- | ------------------------ | ------------------ |
| CPU      | **$0.00003360** /vCPU-s  | 180,000 vCPU-s     |
| Memory   | **$0.00000350** /GiB-s   | 360,000 GiB-s      |
| Requests | **$0.40** / million      | 2,000,000 requests |

### Instance-based (CPU always allocated) — the min-instances trap

| Resource | Price                   | Note                                          |
| -------- | ----------------------- | --------------------------------------------- |
| CPU      | **$0.00002400** /vCPU-s | Billed continuously while the instance exists |
| Memory   | **$0.00000250** /GiB-s  | Continuously                                  |
| Requests | —                       | No per-request charge in this mode            |

Billing rounds up to the nearest 100 ms. **Egress is extra** in both modes
(standard GCP networking, tiered per GB, plus Cloud NAT / LB if attached).

## The three traps, quantified

1. **`min-instances ≥ 1` (always-on).** 1 vCPU always allocated =
   $0.00002400 × 2,592,000 s/mo = **$62.2/mo** CPU + ~$6.5/mo for 512 MB — before
   any traffic. This is the classic surprise line: a "just keep one warm" flag
   turns a scale-to-zero service into a fixed ~$70/mo bill.
2. **Egress.** Report/evidence delivery (signed PDFs, Art.12 exports) is
   egress-heavy; at ~$0.10/GB, 100 GB/mo of downloads = ~$10/mo that Scaleway /
   UpCloud would not meter the same way (UpCloud egress is free).
3. **Unit CPU rate.** ~3× Scaleway means even a well-behaved scale-to-zero
   service costs ~3× more per unit of work on GCR.

## Our container, modelled both ways

Using the March invoice profile (1,918,678 vCPU-s and GiB-s in fr-par):

|                  | Scaleway Serverless Containers | Cloud Run (request-based)                        |
| ---------------- | ------------------------------ | ------------------------------------------------ |
| CPU              | €19.19 (unchanged 01.06.2026)  | (1,918,678 − 180,000) × $0.00003360 = **$58.42** |
| Memory           | €3.84 (post-June ×2)           | (1,918,678 − 360,000) × $0.00000350 = **$5.46**  |
| Requests         | —                              | a few M → ~$1–2                                  |
| Free-tier offset | −€2.40                         | (already netted above)                           |
| Egress           | minimal at this scale          | variable, extra                                  |
| **≈ Total**      | **~€20.66/mo**                 | **~$65–68/mo ≈ €60–63/mo**                       |

**Cloud Run is ~3× the cost for the identical workload** — and that is the
_good_ case (scale-to-zero, no min instances). Add one warm instance and GCR
roughly doubles again.

## Decision & guardrails

- **GCR = cold DR failover only.** Keep `dws6run6` as documented in
  `scaleway-infrastructure-setup.md` (failover target), not a warm second
  region. Primary stays Scaleway fr-par.
- **Enforce on every Cloud Run service we keep:**
  - `min-instances = 0` (scale-to-zero) — never leave a warm instance "just in case".
  - No always-allocated CPU unless a specific latency SLA demands it (none does today).
  - Budget alert + hard cap on `dws6run6`; egress dashboard watch.
  - Concurrency tuned high (fewer instances for the same request volume).
- **Finish the migration.** The April note already flags "Legacy Cloud Run
  migrating to Scaleway." This cost delta (~3×) is the business case to complete
  it — retire any residual warm GCR service, leave only the cold failover image.

## Follow-ups

- [ ] Audit `dws6run6` for any service with `min-instances > 0` or
      always-allocated CPU; set to scale-to-zero.
- [ ] Add a GCP billing budget + alert on `dws6run6`; screenshot the egress
      line to confirm it is the hidden driver.
- [ ] Confirm no production traffic currently routes to Cloud Run (should be
      failover-only); if any does, cut it back to Scaleway.
- [ ] Re-pull the next GCP invoice to validate the ~3× model against actuals and
      update this note's Version block.

---

**Footer**
Owner: Lifetime Oy (risto.paarni@lifetime.fi)
Business ID: 0772407-9 | VAT: FI07724079
Part of the Lifetime World Model (LWM) field-notes corpus.
