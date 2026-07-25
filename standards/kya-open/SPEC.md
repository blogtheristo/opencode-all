# KYA Specification v1.5 — Know Your Agent

**Status:** DRAFT — in-repo, not yet published
**This is a specification, not a standard.** No standards body has processed it, and no implementation exists outside Lifetime Oy. See §0.6 for what would earn the word.
**Licence:** Apache License 2.0 (see `LICENSE`)
**Editor:** Risto Anton Päärni, Lifetime Oy
**Date:** 2026-07-24

***

# VERSION AND AGENT HISTORY

Version: 0.2 (specification draft, v1.5 line)

Sessions & Modifications:

- Version: 0.2 | Tool: Claude Code (claude-opus-5) | Session: claude/greg-isenberg-field-notes-a2r544 | Date: 24.07.2026 | Changes: **Retitled "Open Standard" → "Specification"** on HIC challenge: no standards body has processed this document and no implementation exists outside Lifetime Oy, so "standard" claimed a category the document's own §0.2 and §9 disclaimed. Added **§0.6 (Specification, not standard)** with the four gates that would honestly earn the word — two independent implementations, a conformance suite that can be failed, a body or genuine adoption, and change control outliving Lifetime Oy. Rationale recorded: the EU AI Act Art. 40 term "harmonised standard" is legally loaded in exactly this market, and the DWS house voice forbids over-claiming. Renaming before external citation is free; demoting after adoption would read as a retreat.
- Version: 0.1 | Tool: Claude Code (claude-opus-5) | Session: claude/greg-isenberg-field-notes-a2r544 | Date: 24.07.2026 | Changes: First in-repo draft of the KYA specification, created under **HIC decision 3A (24.07.2026)** — "land the spec in-repo first, publish the ATS formula openly, retain the telemetry pipeline." Prior to this file the spec existed only in session memory with no artifact anywhere in `origin/main`. Normative content extracted from `Legal/KYA_STANDARD_v1.md` (§3 ATS, §14.2 mandate gating, §14.4 trust chain, §14.5 evidence chain, §14.7 verified-done attestation) and the executable engine in `src/identity/`. Publishing boundary applied per decision 3A. Three strategy questions remain open and are marked in §0.2.

***

## 0. About this document

### 0.1 What this is

KYA — **Know Your Agent** — is a governance specification for autonomous software agents that act with delegated human authority. It answers four questions about any agent action, in a form a third party can check without trusting the operator:

1. **Who is this agent?** (identity + capability manifest)
2. **Which human stands behind it?** (accountability binding)
3. **What is it allowed to do?** (capability gating + spend authority)
4. **What did it actually do?** (evidence chain + verified-done attestation)

This document specifies the **protocol**: credential shapes, the trust-score formula and its semantics, gate decision semantics, evidence-chain event types, and the verification procedure. It is deliberately implementable by a party with no access to Lifetime Oy infrastructure.

### 0.2 What is NOT settled yet

Three questions remain open and **must be resolved before publication**. They are recorded here rather than guessed:

- **Standards-body target.** _A route is **proposed but not chosen**_ — see `docs/field-notes/2026-07-24-kya-open-standard-dual-track-ip-strategy.md` for the assessment. Shortlist: **CEN/CENELEC JTC 21** (the EU AI Act harmonised-standards route, reached via SFS in Finland — the only route on which "standard" carries Art. 40 weight), **W3C** (a Community Group is nearly free; the Verifiable Credentials WG needs membership or Invited Expert status and governs the *data model*, not agent-governance semantics), and **Gaia-X / IDSA** (best understood as where independent implementers may be found — gate 1 of §0.6 — rather than as a ratification route). FIDO Alliance is deferred until agentic commerce becomes the commercial centre of gravity; ETSI is not pursued absent a customer requirement. The choice constrains the licensing regime — see §0.3.
- **Adoption timing.** A Q4 2026 target has been stated; the driver behind that date is not recorded here because it is not yet written down anywhere authoritative. **Note that this question and the one above are entangled:** the candidate bodies run on incompatible clocks (CEN in years, W3C in months, Gaia-X/IDSA fastest), so if Q4 2026 means *published and adopted somewhere*, the body choice answers the date.
- **Conformance suite.** A standard without conformance tests gets implemented loosely and diverges. Who authors and operates the suite is undecided — see §9.

### 0.3 Licensing note

This document is licensed **Apache-2.0**, chosen for its **express patent grant (§3)** — MIT and BSD have none, and a governance specification touching payment authority and identity binding will be read by an implementer's counsel who looks for exactly that.

**Known gap:** Apache-2.0 is a *software* licence applied to a *specification*. Standards bodies commonly expect a specification-grade regime (W3C Document Licence, OWFa, or the body's own IPR policy) covering implementation rights in the spec itself. Dual-licensing may be required to enter a body, and re-licensing is materially harder once outside contributions arrive. **Resolve before publication, not after.**

### 0.4 Conformance language

"MUST", "MUST NOT", "SHOULD", "MAY" are to be interpreted as in RFC 2119.

### 0.5 What this specification does not cover (retained implementation)

Per the publishing boundary: the protocol is open; the infrastructure is not. Out of scope by design — **sovereign key custody and tiering**, the **Lifetime World Model** and per-industry ontologies, the agent fleet, Control Room / Situation Room, and the **telemetry pipeline that produces real ATS inputs**.

The asymmetry is deliberate and is the reason publishing the formula is safe: anyone can compute the arithmetic in §2; almost nobody can observe the violations, latencies, and denied attempts of a governed fleet operating across regulated industries. A published formula is **checkable**, which is what makes a score worth anything to an insurer, escrow provider, or auditor. A secret formula is merely unauditable.

### 0.6 Specification, not standard

This document is a **specification**: an openly licensed description that anyone may implement. It is **not a standard**, in either sense the word normally carries.

- It is not a **de jure** standard. No standards body has chartered, reviewed, balloted, or ratified it. The body has not even been chosen (§0.2).
- It is not a **de facto** standard. There are, at the time of writing, **no implementations outside Lifetime Oy**.

The distinction is not pedantry, for two reasons. First, in the European Union **"harmonised standard" is a legal term** — EU AI Act Article 40, conferring a presumption of conformity, produced through CEN/CENELEC. A document titled "standard," aimed at regulated industries and written adjacent to AI Act obligations, invites a reader to infer an adjacency this document has not earned. Second, what a standards process actually buys is **adversarial review by parties with competing commercial interests**, **interop testing between independent implementations**, **formal IPR disclosure**, and **change control that outlives the original author**. This document has had none of those. It was written inside one organization, against one implementation.

**Four gates would honestly earn the word.** Until all four are met, this remains a specification and SHOULD be cited as one:

1. **Two or more independent implementations**, built by parties with no commercial relationship to Lifetime Oy.
2. **A conformance suite that an implementation can fail** — see §9, which does not exist yet.
3. **Either** a recognised body accepts the document into its process (de jure), **or** genuine multi-party adoption occurs (de facto).
4. **Change control that survives Lifetime Oy** — a governance arrangement under which this text can be amended without the original author's consent. This is the real test of whether a document is a standard or a product artifact.

Being early to a rulebook that nobody has ratified is a defensible position; claiming ratification that has not happened is not. This specification aims to be the first careful description of how delegated agent authority is governed — a claim that is both truer and harder to dispute than "standard."

***

## 1. The trust chain

Every KYA-conformant claim resolves along one chain. Each link MUST be checkable by a party that does not trust the issuer:

```
verified human → signed capability manifest → signed mandate → verified-done attestation
```

A verifier MUST NOT accept a link whose predecessor is absent or unverifiable.

## 2. Agent Trust Score (ATS)

### 2.1 Formula (normative)

```
ATS = max(0, 1.0 − V×0.25 − L − D×0.05 + A×0.15)
```

| Symbol | Meaning                                                                                       |
| ------ | ---------------------------------------------------------------------------------------------- |
| `V`    | Count of KYA violations observed in the scoring window (4 violations ⇒ zero trust)            |
| `L`    | `0.10` if average action latency exceeds 500 ms, otherwise `0`                                |
| `D`    | Count of denied path-access attempts                                                          |
| `A`    | Validated autoresearch improvement factor, **capped at 0.15** to prevent score inflation      |

The score is normalized to `0.0–1.0`. A `kyaScore` of `0–100` MAY be published alongside as `round(ATS × 100)`.

### 2.2 Score bands (normative)

| ATS       | Permission level                  | Decision |
| --------- | --------------------------------- | -------- |
| ≥ 0.80    | Full sandbox                      | GO       |
| 0.50–0.79 | Restricted                        | GO (limited) |
| < 0.50    | Suspended — human review required | NO_GO    |

### 2.3 Input integrity

An ATS is only as trustworthy as its inputs. An implementation MUST document how `V`, `L`, `D`, and `A` are observed, and a verifier SHOULD treat a self-reported ATS with no attested telemetry source as unverified.

## 3. Capability manifest

A manifest declares what an agent may touch. It MUST carry: `manifestVersion`, `subagentId`, `sessionId`, `signedAt`, `permittedPaths`, `deniedPaths`, `ttlSeconds`, `kyaScoreAtSign`, and a signature.

**Normative requirement (fixes a known implementation gap):** the manifest signature MUST carry verifiable signature material and MUST be cryptographically verified before use. **A boolean "verified" flag asserted by the caller is NOT conformant.** An expired manifest (`signedAt + ttlSeconds` in the past) MUST be rejected.

`kyaScoreAtSign` binds the trust score to the moment of signing, so a manifest presented later cannot silently claim a score it no longer holds.

## 4. Mandate gating

Where an agent transacts (AP2 / UCP / ACP or equivalent), mandate privileges MUST be gated on ATS band:

| ATS       | Permitted mandates                                                     | Human-not-present |
| --------- | ---------------------------------------------------------------------- | ----------------- |
| ≥ 0.90    | Intent + Cart + Payment, within declared ceilings                      | Allowed           |
| 0.80–0.89 | Intent + Cart + Payment                                                | Denied — human confirms above the per-task ceiling |
| 0.50–0.79 | Intent + Cart only — a human signs the Payment Mandate                 | Denied            |
| < 0.50    | None                                                                   | Denied            |

**Two floors are immovable in any conformant profile:**

1. **No mandates below ATS 0.50.**
2. **The human-not-present minimum band (ATS ≥ 0.90) MAY be raised or HNP disabled entirely — it MUST NOT be lowered.**

Deployment profiles MAY tighten these; they MUST NOT loosen them. Every mandate MUST bind to an accountable human — **anonymous spend authority is non-conformant**.

## 5. Evidence chain

Every mandate lifecycle event MUST be appended to a tamper-evident log. Event types: `mandate.issue`, `mandate.present`, `mandate.execute`, `mandate.revoke`, `mandate.attest`.

Each entry MUST record the evidence-chain key (`sessionId` + mandate credential id), the agent, the accountable human, the gate decision and its reason, and the trust context at evaluation time. Entries MUST be **hash-chained** (each carrying the previous entry's hash), and hashes MUST be set by the storage layer, never by the application.

**Records MUST NOT be deleted.** Withdrawal is a status transition. This aligns with EU AI Act Article 12 record-keeping.

**Personal data:** the accountable-human field SHOULD hold a **pseudonymous stable subject identifier**, not a name or email address, so that retained evidence is not also a personnel record. Implementations MUST document the lawful basis for retention against erasure requests (in the EU, GDPR Art. 17(3)).

**Tenancy:** evidence and attestation records MUST carry a tenant identifier. Trust history is earned executing a tenant's mandates and MUST survive the departure of any individual; the accountable human is bound as *signer at time of action*, not as owner of the record.

## 6. Verified-done attestation

Once a mandate executes, the issuer SHOULD emit a **verified-done attestation** — a W3C Verifiable Credential asserting that this mandate completed under governance, at a stated ATS, under a recorded gate decision, written to the evidence chain.

A denied mandate MUST NOT be attested done.

The credential subject MUST include: the mandate reference, agent identifier, accountable human (pseudonymous), protocol, mandate type, ATS at execution, the gate outcome, and the evidence-chain trace reference.

## 7. Signature and verification

### 7.1 Suite

Implementations MUST support **Ed25519 (EdDSA)**. The proof MAY be carried as a detached JWS or as a Data Integrity proof.

### 7.2 What the signature MUST cover (normative)

**The signature MUST cover the proof options — at minimum the creation timestamp and the verification method — in addition to the credential body.** A proof whose `created` or `verificationMethod` can be modified without invalidating the signature is **non-conformant**.

Rationale: an evidence artifact whose timestamp is mutable is not evidence; and a verifier that resolves its trust anchor from an unsigned field is choosing its key from attacker-controlled data.

### 7.3 Issuer identity

Issuers SHOULD be identified by a DNS-rooted `did:web` resolvable from a domain the issuer controls, so resolution requires no ledger and no external registry.

**A verifier MUST bind the verification method to the signed issuer field.** A credential whose verification method is not authorized by its stated issuer MUST be rejected, even if the signature verifies.

### 7.4 Canonicalization

Implementations MUST specify their canonicalization. JCS (RFC 8785) is RECOMMENDED for JSON credentials. Ad-hoc serialization is permitted only where both sign and verify are performed by the same implementation, and MUST NOT be relied on for cross-party verification.

### 7.5 Revocation

Revocation MUST be a status transition, never a deletion, and MUST be **discoverable by a holder**. A signature check alone MUST NOT be treated as proof that a credential is in force: **verification answers "are these bytes authentic," not "is this attestation valid."** Implementations MUST publish a resolvable status mechanism before credentials are relied on by third parties.

### 7.6 Signing posture

An implementation that cannot yet meet §7.2, §7.3 and §7.5 SHOULD mint credentials **unsigned** rather than sign them under a key it cannot custody or rotate. An unsigned claim can be upgraded; a badly-anchored signature cannot be withdrawn from a counterparty's hands.

Where signing is configuration-gated, absence of a key in a production deployment MUST fail loudly. Silently minting unsigned credentials in production is non-conformant.

## 8. Human oversight

Every agent chain MUST terminate in an identifiable accountable human. This specification's implementation of that requirement is **HIC — Human-In-Command**.

Conformant deployments MUST provide an intervention point at which a human can inspect, override, and terminate agent authority, and MUST log the exercise of that authority to the evidence chain. This maps to EU AI Act **Article 14** (human oversight); §5 maps to **Article 12** (record-keeping).

**Revocation of a human's identity MUST cascade** to mandates held under that human's authority. Leaving live authority in the system after revoking the human who granted it is non-conformant.

## 9. Conformance

An implementation is **KYA-conformant** if it satisfies every MUST in §2–§8.

⚠️ **No conformance test suite exists yet.** Until one does, "KYA-compliant" is an unverified self-assertion. The mark MUST NOT be treated as an assurance in the absence of a suite — see §0.2.

***

## Appendix A — Relationship to the internal standard

This open standard is the publishable subset of `Legal/KYA_STANDARD_v1.md` (internal, currently v2.0 pending). Where the two differ, the internal standard governs Lifetime Oy implementations and this document governs conformance claims by third parties. Sections §7.2, §5 (tenancy, pseudonymisation) and §8 (revocation cascade) state requirements that the internal implementation does **not yet fully meet** — they are specified here as the correct target, and the gaps are tracked in the DWS backlog (B7, B8, D4) and the PR #1716 crypto review.

Stating a requirement the reference implementation has not met is deliberate: a specification describes what conformance means, not what one vendor happens to ship today.
