---
title: "Sovereign Cloud vs. Your Own DGX: Where Should Your AI Actually Run?"
status: DRAFT — for Google Drive review before publish
author: Risto Anton Päärni, Founder & CEO, Lifetime Oy
target: onelifetime.world/blog/ (HTML at publish time)
date_drafted: 2026-07-16
reading_time: ~9 min
pre_publish_checklist:
  - Run /truth-check (canonical facts: prices, provider ownership, industry counts)
  - Convert to blog HTML per docs/BLOG_STANDARD.md (never publish .md to public folders)
  - Confirm all prices against dws10.com/config/products.json at publish time
  - Add EU language bar + hero per multilingual standard if required
---

# Sovereign Cloud vs. Your Own DGX: Where Should Your AI Actually Run?

**A practical field guide for European industrial leaders who have decided _that_
their AI must be sovereign — and now have to decide _where_ it runs.**

Most sovereignty conversations stop at a slogan: "keep the data in Europe." That
is the easy part. The harder, more consequential question is the one nobody puts
on the slide: **do you rent sovereign capacity, or do you own the machine?**

At Lifetime Oy we ship DWS IQ 6 — a fleet of 18+ industrial AI agents for
CSRD, ETS, CBAM, NIS2 and the EU AI Act — in exactly two shapes: as a
**sovereign European cloud service** we operate for you, and as a **sovereign
NVIDIA DGX appliance** you own and run inside your own four walls. Same agent
brain. Very different economics, risk profile, and operational commitment.

This post is the honest comparison we give customers before they sign. No
winner is declared, because there isn't one — there's only the right fit for
_your_ regulatory exposure, your utilisation curve, and your appetite for owning
hardware.

---

## First, what "sovereign" actually has to mean

Before comparing _where_ AI runs, it is worth being precise about what makes
either option sovereign in the first place. Sovereignty is not a data-centre
postcode. It is a chain of three properties, and a break in any one link voids
the claim:

1. **Jurisdiction of the operator.** If the company that legally controls the
   infrastructure is incorporated in the United States, the US CLOUD Act can
   compel disclosure of your data regardless of where the servers physically
   sit. A German data centre owned by a US parent is _not_ sovereign.
2. **Data residency.** The data — and the derived artefacts, logs, and
   embeddings — must stay within the jurisdiction you are claiming.
3. **Operational control.** Who holds the keys, who can push a model update, who
   can read the audit log. Sovereignty you cannot inspect is sovereignty you
   cannot defend to a regulator.

Both options below satisfy all three. That is the point: **the choice is not
"sovereign or not."** It is "sovereign _rented_ or sovereign _owned_."

---

## Option A — Sovereign European Cloud (we host it for you)

This is DWS IQ 6 delivered as a service on European-incorporated infrastructure.
It comes in two shapes.

### A1. EU-Sovereign Cloud (multi-tenant SaaS)

The fastest path to running industrial AI. DWS IQ 6 runs on **Scaleway**
serverless containers in Paris and Amsterdam. Scaleway is French-owned (Iliad
Group), so there is **zero CLOUD Act exposure**. Your database is EU-only
managed PostgreSQL with pgvector; EU AI Act Article 12 logging is built in.

- **Capital cost:** none. You rent capacity.
- **Running cost:** from €4,999 to stand up; you are live in about 30 days.
- **Scaling:** serverless — it scales to zero when idle and bursts on demand. You
  pay for what you use.
- **Best for:** EU- and UK-regulated mid-market and enterprise — construction,
  logistics, energy, manufacturing — that need sovereignty without running
  infrastructure.

For teams that are explicitly _not_ under EU data-residency pressure and are
cost-sensitive, we also offer a US-cloud posture (Supabase + Cloudflare) from
€299/month. It is faster and cheaper, and it is honest about what it is: it does
_not_ close the CLOUD Act. We put that in writing.

### A2. Dedicated Sovereign Cloud (Aegis, single-tenant)

When multi-tenant isn't enough — defence, government, critical infrastructure —
DWS IQ Aegis gives you a **single-tenant** deployment on **UpCloud (Helsinki)**
or Hetzner, both under Finnish jurisdiction. No US-incorporated vendor sits
anywhere in the data path. Aegis ships with **Themis**, our control plane: a
hash-chained, append-only Article 12 event ledger, an Annex III systems
registry, and policy gating, with EUDI Wallet authentication.

- **Cost:** €59,990 one-time + €999/month.
- **Best for:** organisations where sovereignty is mandated but a physical
  air-gap is not.

### The quiet advantage of renting: someone else absorbs the shocks

Cloud pricing is not static, and 2026 proved it. When Scaleway announced its
first price increase in three years (effective 1 June 2026), we modelled the
impact on our stack line by line. The result was reassuring for cloud customers:
the products that moved were mostly small components, our largest variable cost —
token inference — did not move at all, and the blended effect was a low
single-digit percentage that we absorb rather than pass on. That is the deal
when you rent: the operator carries inflation, the hardware crisis, and the
IPv4 shortage so you don't have to. When you own the machine, those shocks are
yours.

---

## Option B — Your Own Sovereign NVIDIA DGX (you own the machine)

This is the maximal-sovereignty option: the Lifetime World Model and the DWS IQ
agent fleet running on **NVIDIA hardware you buy and keep on your own premises**.
Nothing leaves your network. You own 100% of the model weights. It can run fully
air-gapped, with no cloud in the path at all.

The ladder scales with the workload:

| Appliance                         | Role                                        | Indicative price |
| --------------------------------- | ------------------------------------------- | ---------------- |
| Control Room (Acer Veriton GN100) | Compliance brain, 1 node                    | €5,294           |
| DGX Spark                         | NVIDIA-branded GB10, 405B-param models      | €5,994           |
| Situation Room (2× bridged GN100) | Crisis ops, failover, dual-use              | €10,093          |
| IGX Orin                          | ECC memory, 10-yr support — pharma, nuclear | €11,990          |

Add **NVIDIA Model Install at €995/device** and the **Sovereign Model Updates
subscription at €299/month** (monthly NIMs, weekly security patches, daily
hotfixes, 24/7 support, warranty), and you have a turnkey sovereign appliance —
not a science project.

- **Capital cost:** real. €5,294 to €11,990 per node, up front.
- **Running cost:** €299/month for model updates, plus electricity and rack
  space. No metered inference bill.
- **Scaling:** fixed to the nodes you installed. You grow by adding boxes.
- **Best for:** steel, construction, nuclear, dual-use and classified work —
  anywhere a **physical air-gap** or **weight ownership** is a hard, written
  requirement rather than a preference.

### Why owning can be _cheaper_, not just safer

There is a persistent myth that on-premise AI is the expensive, paranoid choice.
For steady, high-utilisation workloads, the opposite is often true. Metered cloud
is wonderful when your load is bursty and occasional; it is unforgiving when a
model runs hot 24 hours a day, seven days a week. We have watched legacy
workloads on general-purpose US cloud (Google Cloud Run, in one case) cost
roughly **three times** the equivalent European serverless bill for the _same_
container — driven by always-on minimum instances, egress fees, and a higher
per-unit compute rate. Push utilisation high enough and a €6,000 box that you
own, powered by cheap Nordic electricity, pays for itself against a metered cloud
line in well under two years — and then keeps paying you back.

Ownership also removes an entire category of risk: there is no vendor who can
raise a price, change a term, deprecate a model, or receive a foreign
production order. The trade is that _you_ now own the uptime, the physical
security, the cooling, and the refresh cycle.

---

## The honest comparison

| Dimension            | Sovereign Cloud (SaaS / Aegis)       | Own DGX (on-premise)         |
| -------------------- | ------------------------------------ | ---------------------------- |
| Capital outlay       | None — rent capacity                 | €5,294–€11,990 per node      |
| Running cost         | €4,999 setup · €999/mo (Aegis)       | €299/mo + power + space      |
| Data residency       | EU cloud (Paris/Amsterdam/Helsinki)  | Never leaves your premises   |
| Model ownership      | Platform-hosted (dedicated on Aegis) | You own 100% of the weights  |
| Network dependency   | Needs EU-cloud connectivity          | Fully air-gap capable        |
| Time to value        | ~30 days, provisioned for you        | Hardware lead time + install |
| Scaling              | Elastic, scale-to-zero               | Fixed to installed nodes     |
| CLOUD Act exposure   | Zero (EU-incorporated providers)     | Zero (no cloud at all)       |
| Price-shock exposure | Operator absorbs it                  | You own hardware refresh     |
| Best economic fit    | Bursty / variable load, fast start   | Steady 24/7 high utilisation |

---

## A decision rule you can actually use

We give customers the same three-line heuristic every time:

1. **Start on EU-Sovereign Cloud.** It is the fastest, lowest-risk path and it
   closes the CLOUD Act on day one. Most European industrial companies never
   need to leave it.
2. **Move to Aegis** when you need single-tenant isolation and a full,
   inspectable Article 12 control plane — typically the moment a defence,
   government, or critical-infrastructure buyer enters the procurement.
3. **Own the DGX** when a physical air-gap or 100% model-weight ownership is
   non-negotiable, _or_ when a steady, high-utilisation workload makes owned
   hardware cheaper than metered cloud over a 2–3 year horizon.

And the answer is frequently **both**. A steel plant runs a sovereign DGX at the
regulated edge — vision QA and process reasoning on data that must never leave
the site — while using the EU-Sovereign Cloud for elastic reporting bursts at
CSRD season. The platform is identical across both; only the venue changes.

---

## The point that matters

The sovereignty debate has spent two years arguing about _whether_ European
industry should keep its AI at home. That argument is over; the regulation
settled it. The useful question now is _where_ — rented sovereign capacity that
someone else operates and price-protects, or an owned sovereign appliance that
answers to no one but you.

There is no universally correct answer. There is only your regulatory exposure,
your utilisation curve, and how much of the machine you want to own. What should
never be in question is the sovereignty itself — in both options, the data stays
in Europe, the operator answers to European law, and no foreign court has a hook
into your operations.

That part is not negotiable. Everything else is engineering.

---

_Risto Anton Päärni is Founder and CEO of Lifetime Oy, maker of DWS IQ —
sovereign industrial intelligence for 25 EU-regulated industries. To compare the
deployment options against your own workload, see the DWS IQ price list or book
a session._

**Risto Anton Päärni**
Founder, CEO · Lifetime Oy
risto.paarni2024@lifetime.fi · +358 400 319 010
