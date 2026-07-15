# EU Funding Draft — NGI Taler Application (KYA-Taler, Aug 1 2026)

---

## VERSION AND AGENT HISTORY

| Field          | Value                                                                  |
| -------------- | ---------------------------------------------------------------------- |
| Version        | 0.9 (submission-ready draft, unsubmitted)                              |
| Date           | 2026-07-15                                                             |
| Author         | Lifetime Oy                                                            |
| Owner          | risto-001                                                              |
| Status         | Draft — pending go/no-go                                               |
| Classification | Internal                                                               |
| Introduced-In  | PR-TBD                                                                 |
| Branch         | claude/ngi-sargasso-gber-i2l47d                                        |
| Target         | NLnet NGI TALER call (2026-02T) — **deadline 01 Aug 2026, 12:00 CEST** |
| Submit at      | https://nlnet.nl/propose/                                              |

---

## Context

- Fund: NLnet **NGI TALER** (Horizon Europe cascade/FSTP; equity-free grant).
- Fit logic: GNU Taler = privacy + auditability but **no agent primitive**; KYA
  supplies exactly that (identity-binding, revocable mandate, Leash-Snap,
  Article-12 audit). "KYA v2 = the payment-mandate extension of KYA, on Taler
  rails" is honest and novel.
- Discipline: deliverables stay **Taler-native** (wallet integration,
  upstreamable spec) — that is what makes it eligible. Do not genericise to
  "agent payments" when editing.
- Honesty guard: KYA v1 is shipped; the **mandate layer is what the grant
  funds**. Prose must not imply it already exists.
- Companion track: `docs/EU_FUNDING_EIC_ACCELERATOR_2026.md` (same KYA v2
  thesis at EIC scale).

---

## Application text (copy-paste into nlnet.nl/propose)

```
1. PROJECT NAME
KYA-Taler: mandate-bound, privacy-preserving payments for autonomous AI agents

2. WEBSITE
https://onelifetime.world  (DWS IQ platform · Lifetime Oy)

3. ABSTRACT (one sentence)
We extend GNU Taler so an autonomous AI agent can pay under a
cryptographically-bound, revocable "Know-Your-Agent" (KYA) mandate — keeping the
payer private to the merchant, the transaction auditable to the principal and
regulator, and the agent accountable to the human who authorised it.

4. REQUESTED AMOUNT
EUR 50,000

5. CONTACT
Risto Anton Päärni — Founder, CEO · Lifetime Oy
risto.paarni@lifetime.fi · +358 400 319 010
Business ID 0772407-9 · Espoo, Finland (EU)

6. DESCRIPTION — what we want to build and why it matters
Autonomous agents are starting to transact on behalf of people and enterprises,
but the payment layer under them is custodial, card-rail, and surveillance-heavy:
the merchant (and the intermediary) sees who is buying, and nothing cryptographic
bounds what the agent is allowed to spend. GNU Taler already solves the hard half
— the payer is anonymous to the merchant, while every payment stays auditable and
taxable for the payee. What Taler does not yet have is an *agent* primitive: a way
for a human principal to grant an agent a bounded, revocable spending mandate, and
for the agent to prove "this payment is within my mandate" without revealing the
mandate — or the principal — to the merchant.

That primitive is exactly what our KYA (Know Your Agent) framework already does for
non-payment agent actions: identity-binding, a trust score, append-only audit, and
a "TC-4 Leash Snap" that instantly revokes a compromised agent's authority. This
project builds KYA v2 — the payment-mandate extension — and lands it on Taler:

  • A KYA mandate credential: spend cap, merchant/category scope, validity window,
    and the human principal, issued and signed under the KYA identity layer
    (eIDAS-2.0-aligned).
  • Selective-disclosure proof that a Taler payment is "within mandate," so the
    merchant learns nothing beyond validity — payer anonymity preserved.
  • Wallet-side enforcement of caps/scope, and Leash-Snap revocation of an agent's
    spending authority.
  • A privacy-preserving audit trail the principal or a regulator can reconcile
    without de-anonymising the payer — the same append-only, Article-12-style
    logging DWS already uses for agent actions.

Everything produced is released open source and offered upstream to GNU Taler.

7. PRIOR INVOLVEMENT / RELEVANT EXPERIENCE
Lifetime Oy builds DWS IQ, an EU-sovereign platform for AI agents operating in
regulated markets. Directly relevant, already in production or specified:
  • KYA (Know Your Agent) — trust score, identity-binding, and TC-4 Leash Snap
    chain-termination (agent identity + revocation control).
  • Agentic-commerce reference architecture (ACP/AP2-style agent checkout), with
    the rule that agent-initiated purchases carry an originating-agent audit trail.
  • Append-only, EU-AI-Act Article-12 audit logging; EU-only data residency
    (KYC via an EU-only-processing addendum); card data never stored.
  • An active research line (with LUT) on agentic commerce, EU eWallet, and
    quantum-safe transaction primitives — KYA as the trust primitive that gives
    agentic transactions legal and commercial weight.
We are the team that has already built the accountability layer this project puts
onto Taler's rails.

8. COMPARISON WITH EXISTING / HISTORICAL EFFORTS
Current agent-payment efforts — Coinbase x402, Google's Agent Payments Protocol
(AP2), the Stripe agent toolkit, model-vendor "agentic checkout" — are custodial,
card- or crypto-rail, largely US-centric, and privacy-poor: the buyer is visible,
and KYC binds the *human*, not the agent. They add convenience, not a privacy-
preserving, revocable mandate. GNU Taler brings the privacy and auditability none
of them have, but has no agent-identity/mandate concept. KYA-Taler is, to our
knowledge, the first effort to make the *agent* a first-class, mandate-bound,
revocable, and payer-private participant on a libre payment system — EU-sovereign
and GDPR-native by construction rather than by bolt-on.

9. TECHNICAL CHALLENGES WE EXPECT TO SOLVE
  • Binding a verifiable KYA mandate credential to a Taler payment via selective
    disclosure / zero-knowledge proof of "within mandate," leaking nothing else.
  • Enforcing spend cap and merchant/category scope at wallet level, incl. offline.
  • Propagating Leash-Snap revocation into Taler's settlement model.
  • Privacy-preserving reconciliation: auditable to principal/regulator, anonymous
    to the merchant.
  • Aligning the mandate/transaction primitive with a quantum-safe transition.

10. ECOSYSTEM & DISSEMINATION
We engage GNU Taler / Taler Systems SA directly with upstreamable specs and code,
align the mandate credential with the EU Digital Identity (eIDAS 2.0) Wallet, and
run one regulated-sector pilot (autonomous procurement / subscription agent). All
outputs are open source (licence: EUPL or Apache-2.0, TBC), documented publicly,
and disseminated via NLnet channels, the DWS IQ blog, and EU agent-safety /
NGI venues.

11. BUDGET & MILESTONES (EUR 50,000; no other funding for this work)
  M1 €8,000  — KYA→Taler mandate spec: credential format (cap, scope, window,
               principal), eIDAS-2.0 alignment. Open spec published.
  M2 €12,000 — Reference implementation: open-source KYA mandate issuer + Taler
               wallet integration enforcing the mandate at spend time.
  M3 €10,000 — Selective-disclosure "within-mandate" proof + Leash-Snap revocation;
               privacy-preserving audit trail.
  M4 €10,000 — Regulated-sector pilot with an autonomous paying agent; measure
               payer privacy + auditability end-to-end.
  M5 €6,000  — Quantum-safe transaction-primitive exploration + spec hardening.
  M6 €4,000  — Documentation, packaging, upstream engagement, dissemination.

Risto Anton Päärni
Founder, CEO · Lifetime Oy
risto.paarni@lifetime.fi · +358 400 319 010
```

---

## Pre-submission checklist

- [ ] Go/no-go: is the ~€50k / Taler-scoped effort worth the team-time vs. EIC
      Step 1 prep (same window, late July)? They share the KYA v2 narrative —
      drafting one strengthens the other.
- [ ] Verify NLnet form fields at nlnet.nl/propose match §1–11 above; trim to
      their character limits where needed.
- [ ] Confirm "no other funding for this work" stays true if EIC Step 1 is
      submitted in parallel (different scope: Taler rails vs. standard + product
      — keep the boundary explicit in both applications).
- [ ] Licence decision (EUPL vs Apache-2.0) — same question as DIGITAL §7 Q4
      and EIC §8 Q3; answer once, reuse everywhere.

---

**End of draft.**
