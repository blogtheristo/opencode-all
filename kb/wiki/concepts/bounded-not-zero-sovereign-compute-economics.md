<!--
VERSION AND AGENT HISTORY
Document: bounded-not-zero-sovereign-compute-economics.md
Version: 1.0
Last-Updated: 2026-07-30
Author: Risto Anton Päärni (Lifetime Oy)
Agent: Claude Code
Purpose: Canonical DWS wording for the sovereign-compute cost claim. Owning the
         hardware removes the external per-token bill; it does not make tokens
         free. Written after a same-day external review caught "marginal token
         cost is €0" propagating into a thesis section, a field note, a KB signal,
         two infrastructure docs and a blog draft.
Introduced-In: PR-pending (branch claude/enterprise-ai-harness-0anl7s)
Code-Version: 1.0
Branch: claude/enterprise-ai-harness-0anl7s
Date: 2026-07-30
Owner: risto.paarni@lifetime.fi
-->

# Bounded, Not Zero — the Sovereign Compute Cost Claim

**Version:** 1.0 · **Status:** Active · **Scope:** every DWS cost claim about owned or on-prem compute — customer copy, investor material, thesis, field notes, infra docs, hero text
**Companions:** `docs/PHD_FIREHORSE_EN.md` §14.45 Finding 5, `kb/wiki/concepts/harness-cost-is-a-pl-line-item.md`, `docs/field-notes/2026-07-30-composio-harness-token-efficiency-benchmark.md`

## The canonical sentence

Use this. Do not improvise a stronger one.

> **DWS IQ 6 replaces unpredictable per-token API exposure with bounded, sovereign compute economics for known industrial workloads. Electricity, hardware amortisation, serving, maintenance and throughput capacity remain part of the cost base.**

The commercial half, when the argument needs its mechanism:

> Deep harness workflows become commercially viable because concurrency and context depth can be **dimensioned below the hardware throughput knee.**

## The rule

**Owning the silicon removes the external per-token bill. It does not remove cost.** What changes is the *shape*: an unpredictable charge that scales with how hard the agents think becomes a bounded one sized in advance.

Banned phrasings — each is false and each will be dismantled by the first competent technical or financial reviewer:

- ❌ "marginal token cost is €0" / "€0/token"
- ❌ "zero marginal cost"
- ❌ "free tokens", "tokens are free"
- ❌ "the 340k tokens stop being an outbound invoice"
- ❌ "340k-token industrial agent depth at zero marginal cost"

What remains on the cost base after the API bill goes away: **electricity, hardware amortisation, model serving, maintenance, and finite throughput capacity.** The last one is not a rounding error — it is the capacity ceiling that replaces the financial one, and it has a knee.

## The one adjacent claim that is NOT this claim

**"Zero tokens leave the premises"** is a **data-residency** statement about routing in an on-prem configuration. It is true and it is legitimate. It is **not** a cost claim and must never be used as one, or read as supporting one. Residency and economics are different arguments with different evidence.

## Why this exists

On 30.07.2026 an external reviewer caught "marginal token cost is €0" in same-day material. By then it had propagated to a PhD thesis section (both languages), a field note, a KB raw signal, `infrastructure/dgx-spark/docker-compose.yml`, `mcp-servers/cloud-run-gateway-ts/README.md` and a blog draft awaiting publication.

The failure mode is worth naming precisely: **the false version is more quotable than the true one.** "€0" is a headline; "bounded and dimensioned" is a sentence. Under drafting pressure the compressible claim wins unless a rule stops it. That is why the canonical sentence is written out above verbatim — so quoting is easier than paraphrasing.

Related discipline: a cost figure with no token log behind it is an estimate, not a measurement (`harness-cost-is-a-pl-line-item.md`). Both rules fail the same way — a number that sounds settled but is not.

## The test before publishing any compute-cost claim

1. Does it say or imply **zero**? If yes, it is wrong. Rewrite to bounded.
2. Does it name what **remains** on the cost base? If not, add it.
3. Is it a **cost** claim leaning on a **residency** fact? Separate them.
4. Is there a **measurement** behind the number, or a model? Label estimates as estimates.
