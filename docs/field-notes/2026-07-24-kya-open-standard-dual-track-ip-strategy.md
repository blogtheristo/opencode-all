# Field Note — KYA Specification v1.5: the Dual-Track IP Strategy

> **Title corrected 24.07.2026.** This note was written as "KYA Open Standard v1.5"; the artifact was retitled **Specification** on HIC challenge — see the Correction section. The filename is left unchanged as a dated record.

- **Date:** 2026-07-24
- **Author:** Risto Anton Päärni (Founder, CEO · Lifetime Oy) — via Claude Code session `claude/greg-isenberg-field-notes-a2r544`
- **Location:** Europe > Finland > Espoo
- **Context:** DWS6 — capturing the KYA Open Standard IP strategy as an HIC outcome **before GitHub publication**
- **Confidence:** **LOW–MIXED, and deliberately so.** See the honesty note below.

> ## ⚠️ Honesty note — read before citing this file
>
> **RESOLVED 24.07.2026 — see the decision 3A section below.** When this note was written, **no artifact for the KYA Open Standard v1.5 spec existed in this repository**: a search of `origin/main` found no open-standard document, no Apache 2.0 licence file for KYA, and no spec draft. The work had happened in **internal spec discussions** — session memory, which is precisely the asset `DWS_LEARNING_STANDARD.md` exists to stop losing. The HIC then decided (3A) to land it in-repo, and `standards/kya-open/` now exists. The analysis below was written *before* that and is preserved as-is.
>
> This note therefore separates two things, and never blends them (Rule 7 — surface conflicts, don't average):
>
> - **Reported** — stated by the HIC, recorded verbatim, unverified.
> - **`[HIC INPUT NEEDED]`** — a fact only the HIC holds. **Not inferred, not guessed, left open on purpose.** A plausible-sounding invention here would poison the institutional record more than a blank would.
> - **Proposed analysis** — reasoning contributed by this session, offered for confirmation or rejection. Carries no authority until the HIC rules on it.

## Ontology Tags

- **Geography:** Europe > EU; standards bodies global
- **Sector:** Enterprise AI > Agent governance > Standards & IP strategy
- **Entities:** KYA Open Standard v1.5, Apache License 2.0, standards-body adoption, DWS IQ platform, AP2 / FIDO Alliance, W3C VC
- **Temporal Context:** 2026-Q3; adoption target 2026-Q4

---

## Reported (HIC-stated, unverified)

1. **Internal spec discussions** produced a KYA Open Standard **v1.5** draft.
2. **Licensing decision: Apache License 2.0.**
3. **Strategy: "protocol open, infrastructure proprietary."**
4. **Standards-body adoption targets Q4 2026.**
5. **GitHub publication is planned** and has not yet happened.

## The strategic shape — proposed analysis

The pattern is a well-worn one: publish the *interface* so others build against it, keep the *implementation* that makes the interface worth using. It works when three conditions hold, and this session can only test one of them from the repo.

**Condition 1 — the spec must be implementable by a stranger.** If a third party cannot build a conforming KYA verifier from the published document alone, it is not a standard; it is marketing with a licence attached. This is the condition that decides whether "open" earns credibility.

**Condition 2 — the retained side must be the durable side.** For KYA, the natural split is:

| Track                      | Contents (proposed)                                                                                                                                 |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Open (published)**       | Credential shapes and vocabularies; the ATS *formula* and score semantics; gate decision semantics; evidence-chain event types; verification procedure |
| **Proprietary (retained)** | Sovereign key custody and tiering; the Lifetime World Model and per-industry ontologies; the agent fleet; Control Room / Situation Room; the ATS *telemetry pipeline* that produces real inputs |

The asymmetry that makes this safe: **a published scoring formula is not a threat, because the score's value comes from the telemetry feeding it.** Anyone can compute `1.0 − V×0.25 − L − D×0.05 + A×0.15`; almost nobody can observe the violations, latencies, and denied attempts of a real governed fleet across regulated industries. Publishing the formula makes the score *checkable*, which is the property that makes it worth money (per the same session's Greg Isenberg notes) — and checkability is exactly what a proprietary formula cannot have.

**Condition 3 — the timing must serve adoption, not announcement.** `[HIC INPUT NEEDED]` — see below.

## Apache 2.0 — proposed analysis of what it buys and what it does not

Apache 2.0 was chosen. Two properties are worth stating explicitly, because they are the reason to pick it over the obvious alternatives:

- **It carries an express patent grant** (§3). MIT and BSD do not. For a governance standard that touches payment authority and identity binding, an implementer's counsel will look for exactly this before recommending adoption. It also carries a defensive patent-termination clause, which is a feature for an ecosystem play.
- **It is a *software* licence being used on a *specification*.** This is the common friction point. Apache 2.0 governs the copyright in the document text and any reference code, but standards bodies frequently expect a specification-grade licensing regime (W3C Document Licence, OWFa, or a body's own IPR policy) covering *implementation rights in the spec itself*. Shipping Apache 2.0 on GitHub is a fine first move; it may need to be *re-licensed or dual-licensed* to enter a standards body. Worth checking before publication rather than after, since re-licensing after third-party contributions arrive is materially harder.

`[HIC INPUT NEEDED]` — was Apache 2.0 chosen for the patent grant specifically, or as a default? The answer changes whether a spec-grade licence needs to sit alongside it.

## Open questions only the HIC can answer

1. `[HIC INPUT NEEDED]` **Why Q4 2026 specifically?** Candidate drivers this session can see but cannot confirm: an EU AI Act implementation milestone; FIDO's AP2 progression toward 1.0 (v0.2 was donated 28.04.2026); a standards body's submission window; an EIC/funding milestone; or a customer or partner commitment. The *reason* determines whether the date is a hard constraint or a preference — and therefore whether slipping it costs anything.
2. `[HIC INPUT NEEDED]` **Which standards body?** FIDO Alliance (where AP2 now lives), W3C (where the VC data model lives), CEN/CENELEC (the EU AI Act harmonised-standards route), or ETSI. These have different IPR policies, membership costs, and timelines, and the choice constrains the licence question above.
3. `[HIC INPUT NEEDED]` **Where exactly does the open/proprietary line fall?** The table above is this session's proposal, not a record of a decision. In particular: is the **ATS formula** published (recommended) or retained?
4. `[HIC INPUT NEEDED]` **What is the conformance story?** A standard without a conformance test suite gets implemented loosely and diverges. Is there a plan for one, and does DWS operate it (influence, but a neutrality question) or the body?

## The risk worth naming

Publishing the protocol invites implementations DWS does not control. That is the intent — but it has a specific failure mode: **a competitor implements the open spec, markets "KYA-compliant," and the term stops meaning governed.** The defences are a conformance suite plus a trademark on the mark itself, and neither is visible in the repo today. Open the protocol; do not open the *name* without a conformance gate behind it.

## HIC decision 3A (24.07.2026) — GO

**Decided:** land the spec in-repo first, **publish the ATS formula openly**, retain the telemetry pipeline. _Loop closed per Learning Standard §10.7._

**Executed:** `standards/kya-open/` created — `SPEC.md` (now v0.2, **KYA Specification v1.5**), `LICENSE` (canonical Apache-2.0 text), `NOTICE` (copyright + the spec-licence caveat). The strategy no longer exists only in session memory.

**This resolves `[HIC INPUT NEEDED]` #3** (where the open/proprietary line falls) — the boundary in the proposed-analysis table above is now the decided boundary, and §0.5 of the spec states it. **Three remain open:** why Q4 2026, which standards body, and the conformance story.

**Note on what the spec asserts.** §7.2 (signature must cover proof options), §5 (tenancy + pseudonymous subject id) and §8 (revocation cascade) state requirements the **reference implementation does not yet meet** — they correspond to the PR #1716 crypto review finding F1 and backlog B7/B8/D4. That is deliberate and recorded in Appendix A: a standard describes what conformance means, not what one vendor currently ships.

## Correction — "Standard" was the wrong word (HIC challenge, 24.07.2026)

**HIC challenge:** _"KYA standard is not a standard. Because no body has put it standardization process. The time spent to KYA and steps are not comparable to cloud standards at all. If we publish v1.5 as open standard is this really a standard?"_

**Answer: no, and the challenge is correct.** The artifact was retitled **"KYA Open Standard v1.5" → "KYA Specification v1.5"** (SPEC.md v0.1 → v0.2), and §0.6 now states the case plainly.

**Why the original title was a defect — not a style preference:**

- **Not de jure.** No body has chartered, reviewed, balloted or ratified it; §0.2 admits the body has not even been chosen. The title claimed the category the document's own contents disclaimed.
- **Not de facto.** Zero implementations exist outside Lifetime Oy.
- **The EU hazard is specific.** "Harmonised standard" is a **legal term** under EU AI Act **Article 40** (presumption of conformity, produced via CEN/CENELEC). A document titled "standard," aimed at regulated industries, written adjacent to AI Act obligations, invites an inference it has not earned.
- **The house voice forbids it.** `docs/BLOG_STANDARD.md` §12.1 rule 6 — _"never sell a promise the layer cannot deliver; the fastest way to lose European enterprise trust is to over-claim."_ Industry uses "open standard" loosely; DWS specifically cannot, because the discipline of not over-claiming **is** the product.

**What the standards process actually buys** — and what a solo-authored spec structurally lacks: adversarial review by parties with **competing commercial interests**, interop testing between **independent** implementations, formal IPR disclosure, and change control that **outlives the original author**. This session is a live demonstration of the first gap: a reviewer endorsed a non-existent Entra integration, described `jose` as the plan after it had been rejected, and attached a schema fix to a legal signature. Each was caught by checking, not by the review. One organization reviewing itself has no structural corrective.

**The four gates (SPEC §0.6)** that would honestly earn the word later: two independent implementations · a conformance suite that can be failed · a body accepts it *or* real adoption occurs · change control that survives Lifetime Oy.

**Timing note:** renaming before external citation costs nothing; demoting "Standard" to "Specification" after adoption would read as a retreat. This was a one-way door taken in the cheap direction.

**Naming that survives scrutiny:** "the first careful specification for governing delegated agent authority, written while the category was being invented" is both truer than "standard" and harder for anyone to take away on a technicality.

## Standards-body route — PROPOSED, pick still open (25.07.2026)

Answers `[HIC INPUT NEEDED]` #2 with a **proposal, not a decision.** Three bodies named by the HIC/Boardy, assessed against the four gates in `standards/kya-open/SPEC.md` §0.6. The pick remains the HIC's.

### The three, and what each is actually for

**1. CEN/CENELEC JTC 21 (AI) — the strategic prize.** They are writing the EU AI Act harmonised standards now, and the KYA Article 12 (evidence chain) / Article 14 (human oversight) framework maps to their mandate rather than sitting adjacent to it. This is the only route on which "standard" acquires the meaning a regulated-industry buyer needs — Art. 40 presumption of conformity. It is also the route that makes KYA **compliance infrastructure instead of a vendor document**.

> **The access route is the real asset here.** National-body participation runs through **SFS** (Finland), approachable via **LUT** or **Business Finland**. National-body access is the usual wall for a company this size, and DWS has two credible doors. LUT especially: an academic affiliation is a well-worn route into a JTC working group, and the PhD work is already the theoretical framing for this exact material.

**2. W3C — with a correction that changes the plan.** Two separate things must not be conflated:

- The **Verifiable Credentials Working Group is _not_ low-barrier.** WG participation requires W3C membership (tiered by revenue, a real annual cost) or **Invited Expert** status — individual, discretionary, not guaranteed. _Confirm current terms before budgeting._
- A **Community Group** is nearly free: five people may charter one, no fee, public citable output.

**More important, the scope point:** the VC WG governs the **data model**, not agent-governance semantics. The ATS formula, mandate-gating bands and capability manifests are **out of scope there**. Joining buys attestation + `did:web` interop, credibility, and a relationship — it does **not** standardize KYA. The trade is genuinely good in the other direction: the WG needs implementer evidence to advance VC 2.0, and DWS has deployment evidence. Price it as **interop plus relationship, never as ratification.**

**3. Gaia-X / IDSA — reframed: this is a gate-1 play, not a standardization route.** Filed by the HIC as a standardization option; it is better understood as **where the independent implementers are**. Gate 1 (two implementations by parties with no commercial relationship to Lifetime Oy) is the gate nothing else on this list solves — CEN produces no implementers, and neither does W3C. A European sovereign-data-infrastructure consortium whose members already care about trust, sovereignty and audit trails is exactly the population that might build a second KYA verifier, because they need one.

> **Honest caveat:** a "Gaia-X compliant profile" carries real ecosystem weight and very little **regulatory** weight. It must not substitute for the CEN track. Use it to manufacture the adoption evidence CEN will eventually ask for.

### Gate mapping and the three clocks

| Body | Gate served (§0.6) | Clock |
| ---- | ------------------ | ----- |
| CEN/CENELEC JTC 21 | Gate 3 (de jure) + regulatory weight | **Years** |
| W3C (CG now; VC WG if membership) | Interop; partial gate 4 | **Months** |
| Gaia-X / IDSA | **Gate 1 — independent implementers** | **Fastest** |

**This collapses two open questions into one.** `[HIC INPUT NEEDED]` #1 asked why Q4 2026. If that date means *published and adopted somewhere*, **only Gaia-X/IDSA can deliver it — CEN structurally cannot.** So the body choice and the timing are not two decisions; picking the body answers the date.

### Sequencing recommendation — do not run three in parallel

Three simultaneous tracks is a sustained commitment (meetings, drafts, calls, travel) over quarters, against a board list that already carries an unsigned IP assignment. **Joining a body you cannot show up to is worse than not joining.** Proposed order:

1. **SFS conversation now** — slowest clock, so it must start earliest. Via LUT or Business Finland.
2. **W3C Community Group now** — cheap, and it gives the spec a neutral home plus a public venue where an independent implementer can appear (gates 1 and 4).
3. **Gaia-X / IDSA when there is someone concrete to hand the spec to** — not before.

**And regardless of body: build the conformance suite yourself.** It is gate 2, no body will author it for a specification with one implementation, and it is the only defence against a competitor shipping the "KYA-compliant" label without the substance. A body may eventually operate it; none will write it.

## Next Steps

- HIC fills the remaining three `[HIC INPUT NEEDED]` items; this note is revised to v1.1 with the real rationale.
- Confirm whether a spec-grade licence must accompany Apache 2.0 for the target body **before** GitHub publication.
- Locate or create the actual spec draft in-repo — it currently exists nowhere in `origin/main`, which means it is one lost container away from gone.
- Decide the conformance-suite and trademark posture before the mark is public.

### Learning-loop steps (DWS_LEARNING_STANDARD five-step)

- **(1) KB entry** — deferred until the `[HIC INPUT NEEDED]` items are filled; a KB entry asserting unconfirmed strategy would propagate guesses as canon.
- **(2) Field note** — this file. ✅
- **(3) `Learn/` HTML render** — see companion HTML (`Learn/2026-07-24-kya-open-standard-dual-track-ip-strategy.html`). ✅
- **(4) Drive export** — N/A this session (repo is source of truth, Truth Standard §2E; flagged).
- **(5) HIC question** — below. ✅

### HIC question (EU AI Act Art. 14 intervention point)

> **Does the KYA Open Standard v1.5 spec get written into this repository before it goes to GitHub — and is the ATS formula on the open side of the line?** Two halves, both yours. On the first: the spec presently has no artifact anywhere in `origin/main`, so a strategy the company is about to publish exists only in session memory; publishing to GitHub from a draft that was never in the source-of-truth repo inverts the Truth Standard §2E rule (repo is source, exports are copies). On the second: publishing the ATS formula is the move that makes the score *checkable* by a counterparty, which is the property that gives it commercial weight — but it is also the most copyable artifact in the standard.
>
> **My recommendation:** land the spec in-repo first (even as a rough draft), publish the ATS formula openly, and retain the telemetry pipeline that feeds it — the formula without the fleet's observations is arithmetic, while the formula *with* published semantics is what lets an insurer or escrow provider price our score instead of ignoring it. Pair publication with a conformance suite and a trademark position on "KYA" before, not after, the first outside implementation appears.
