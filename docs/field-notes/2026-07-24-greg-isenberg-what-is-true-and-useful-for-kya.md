# Field Note — Greg Isenberg: What's True and Useful for KYA to Implement

- **Date:** 2026-07-24
- **Author:** Risto Anton Päärni (Founder, CEO · Lifetime Oy) — via Claude Code session `claude/greg-isenberg-field-notes-a2r544`
- **Location:** Europe > Finland > Espoo
- **Context:** DWS6 — KYA (Know Your Agent) implementation prioritization
- **Confidence:** High (claims verified against repo source at write time — KYA Standard v1.11, `src/identity/`, migrations 074/079)
- **Prior note this builds on:** `docs/field-notes/2026-07-06-greg-isenberg-startups-for-agents-21-answers.md` (the full 21-point scorecard). This note does **not** re-map the 21 points — it filters them to the few that are _true_ and _useful for KYA to implement next_.

## Ontology Tags

- **Geography:** Global > United States (creator-economy lens) → Europe > EU (regulated-industry / sovereignty lens)
- **Sector:** Enterprise AI > Agent infrastructure > Governance > Verifiable credentials
- **Entities:** Greg Isenberg, KYA (Know Your Agent), ATS (Agent Trust Score), §14.7 Verified-Done Attestation, §14.7.1 Signing & Key Custody, AP2 / W3C VC, EU AI Act Art. 12, HIC
- **Temporal Context:** 2026-Q3, post AP2 v0.2 (FIDO), post KYA v1.11

---

## The Story

The July 6 note answered Greg's whole 21-point "build startups for agents" thread against DWS. This note asks the narrower, more useful question the founder posed: **of what Greg is saying, what is actually true — and of that, what is useful for KYA to implement?** Not admire; implement.

Two of Greg's claims are the durable, true ones — the rest of his list either reduces to these or is a deliberate DWS "no":

1. **"A checkable track record becomes real money."** True. A trust score an outsider can verify is worth money (cheaper insurance, faster escrow release, admissible in a dispute). A trust score only its issuer can see is worth nothing to a counterparty.
2. **"Escrow that releases on verified-done."** The valuable, hard half is not the money rails — it is a **completion signal a stranger can trust without trusting you.** Whoever produces that signal, in a form the other party can check, wins the layer.

Both collapse to one primitive: **a credential a counterparty can verify without trusting the issuer's infrastructure.** That is precisely what KYA §14.7 Verified-Done Attestation was designed to be — and here is the sharp, unflattering finding this session surfaced:

> **§14.7 shipped, but it mints the credential _unsigned_.** `issueVerifiedDoneAttestation()` (`src/identity/ats-engine.ts`) returns `{ proofStatus: 'unsigned' }` with **no `proof` block** (`src/identity/types.ts` — `proof?` is optional, absent while unsigned). The schema, storage (migration 079, live), and evidence-chain event (`mandate.attest` on the live 074 chain) all exist. The signature does not.

Consequence: today KYA's verified-done credential is a claim, not a proof. A merchant, escrow provider, insurer, or auditor **cannot cryptographically verify it** — they'd have to trust the DWS database, which is the exact thing a verifiable credential exists to remove. The §14.7.1 signing model (Ed25519 JWS, `did:web` issuer, tiered HSM custody) is written down as a **v2.0 target design** — a design, not code.

## The Insight

**KYA already owns every trust _concept_ Greg's list needs. The only thing standing between "we designed the trust chain" and "a stranger's agent can verify it" is a signature.** Identity attribution (Pillar 1), ATS (`ats-engine.ts`), capability gating + mandate gate (real code, deny-by-default), forensic evidence chain (Art. 12, migration 074), and the verified-done credential shape (§14.7, migration 079) are all built. The chain `verified human → signed manifest → signed mandate → verified-done attestation` is complete on paper and **broken at the last link in code**, because that last link mints unsigned.

So the true-and-useful answer is small and specific: **the highest-leverage thing KYA can implement is the signature it already designed.** It is not a new product. It is the one change that flips the entire trust chain from _internal governance_ (worth something only to DWS) to _external proof_ (worth money to points 6, 8, 10, and 14's counterparties). Greg's "track record = money" only becomes money at the moment the credential is signed and resolvable.

## What Is Useful for KYA to Implement — Prioritized

Grounded in the current code (v1.11), most-leverage first:

1. **Sign the verified-done attestation — pull §14.7.1 into code.** Populate the `proof` block: Ed25519 (EdDSA) JWS-enveloped VC, flip `proofStatus` `'unsigned' → 'signed'` in `issueVerifiedDoneAttestation()`. This is _the_ unlock. Everything below is worthless without it; nothing above the design layer is missing.
2. **`did:web` issuer + a verifier path.** Publish `.well-known/did.json` on a tenant-controlled domain and ship the verify function a counterparty runs. A signed credential no one can resolve is still unverifiable — signing and resolution ship together or not at all.
3. **Revocation status list.** §14.7 says revocation is a status transition, not a deletion — implement the VC status list so a released escrow / paid claim can be challenged if the attestation is later revoked. Without it, "signed" is a one-way door.
4. **Key custody by tier (the sovereignty differentiator).** Aegis Defence → on-prem DGX Spark HSM; Standard/Sovereign → UpCloud UKS HSM; **never** a shared/foreign cloud KMS. Enforce the invariant in code and config: _the private signing key never leaves the tenant's jurisdiction; DWS holds only the root CA._ This is the true difference between KYA and every US agent-infra startup answering Greg — they can sign; they cannot sign _inside the customer's jurisdiction_.
5. **Carry `kya_score_at_sign` into the manifest VC (§14.4).** So the ATS — the "track record" — travels _with_ the portable credential and is checkable at transaction time. That is what literally makes point 6's "track record = real money" true rather than aspirational.

## What Is NOT Useful for KYA to Implement (honest nos, unchanged)

Greg lists these; KYA should keep declining them — they dilute the wedge:

- **Money rails / per-task virtual cards (points 8-money, 11).** Partner (issuers, PSPs). KYA supplies the _authorization_ and _completion_ signals; it does not move money.
- **An arbitration service (point 10).** Produce court-admissible evidence (Art. 12 chain + signed attestation). Do not try to _be_ the court.
- **A negotiation wire protocol (point 13).** Adopt A2A/AP2 when it stabilizes; supply the trust layer underneath the wire, don't compete on the wire.

The pattern holds from the July note: **KYA's job is the verifiable credential, not the marketplace built on top of it.** Signing is inside that job. The rest is not.

## Next Steps

- **HIC decision needed** (below) on whether to pull signing forward from the v2.0 freeze.
- If GO: a v1.12 patch that wires the `proof` block + a minimal `did:web` verifier, keeping the v2.0 label reserved for the full key-custody rollout. Add signing tests alongside the 6 existing `verified-done-attestation.test.ts` cases (assert a verifier _rejects_ a tampered credential — Rule 9, test the intent, not just the happy path).
- Cross-link this note from `Legal/KYA_STANDARD_v1.md` Related Documents.

### Learning-loop steps (DWS_LEARNING_STANDARD five-step)

- **(1) KB entry** — N/A this session (no `/kb` write performed; flagged for follow-up with the KB toolchain).
- **(2) Field note** — this file. ✅
- **(3) `Learn/` HTML render** — N/A this session (`scripts/render-doc.sh` not run in this container; flagged).
- **(4) Drive export** — N/A this session (repo remains source of truth per Truth Standard §2E; export flagged as follow-up).
- **(5) HIC question** — below. ✅

### HIC question (EU AI Act Art. 14 intervention point)

> **Do we pull §14.7.1 signing forward into a v1.12 patch now, or hold the v2.0 schema-freeze discipline?** The case for now: the unsigned attestation is the single broken link that makes points 6/8/10/14 unrealizable by any external party — every other trust concept is already built, so we are one signature away from "a stranger's agent can verify us." The case for holding: v2.0 was deliberately reserved for the schema freeze after one end-to-end tenant-profile exercise, and signing before the key-custody tiers are provisioned risks minting signed credentials against a key we later rotate. **My recommendation:** ship signing now as v1.12 for the **Aegis on-prem tier only** (where the DGX Spark HSM already exists and the key never leaves the box), keep Standard/Sovereign unsigned until UpCloud UKS HSM custody lands, and hold the v2.0 label for the full multi-tier freeze. That proves the whole trust chain end-to-end on real hardware without pretending the fleet-wide key story is finished.

---

_© Lifetime Oy — all rights reserved. Business Confidential. Field note · 24.07.2026._
