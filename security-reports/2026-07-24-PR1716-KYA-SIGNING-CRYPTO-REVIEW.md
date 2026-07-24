# Crypto Review — PR #1716 (KYA v2.0 Verified-Done Attestation Signing)

- **Date:** 2026-07-24
- **Reviewer:** Claude Code (Opus 5), session `claude/greg-isenberg-field-notes-a2r544`
- **Authorized by:** HIC decision 1 (24.07.2026) — _"human crypto review first, merge, keep all tiers unsigned until key custody + fail-loud guard land."_
- **Subject:** `src/identity/attestation-signing.ts` @ `claude/kya-v2-attestation-signing-6e5703` (PR #1716, **open**)
- **Method:** PR branch fetched and **source read directly** (this supersedes the "CODE NOT READ" provenance caveat in `docs/field-notes/2026-07-24-kya-v2-eddsa-signing-crypto-decision.md`). Signing module + its 8 tests reviewed line by line.

## Verdict

**Do not merge as-is.** One HIGH finding is a design-level gap that gets materially more expensive to fix after credentials exist in the wild. It is a contained fix (a few lines in two functions plus tests), not a redesign.

The HIC decision to keep tiers unsigned holds regardless — and is now doubly justified, since F1 changes what a signature means.

| ID | Severity | Finding |
| -- | -------- | ------- |
| F1 | **HIGH** | The signature does not cover the proof options (`created`, `verificationMethod`, `proofPurpose`, `type`) |
| F2 | **MEDIUM-HIGH** | `verifyVerifiedDoneAttestation()` returns `true` for a **revoked** credential |
| F3 | **MEDIUM** | No key-type assertion — a non-Ed25519 PEM loads and fails later with an opaque error |
| F4 | **LOW** | Re-signing an already-signed credential is permitted in this module |
| F5 | **LOW** | Bespoke canonicalization will not interoperate with an external JCS/RDF verifier |

---

## F1 — HIGH: proof options are outside the signed bytes

`credentialSigningBytes()` strips the **entire** `proof` object before signing:

```ts
const { proof: _proof, ...unsigned } = credential;
```

The JOSE header (`{alg:'EdDSA'}`) *is* signed — it is part of `${headerB64}.${payloadB64}` — which correctly prevents algorithm confusion. But everything in the `proof` block is not. **`created`, `verificationMethod`, `proofPurpose`, and `type` can all be modified after signing and the credential still verifies.**

W3C Data Integrity canonicalizes the proof options (minus `proofValue`) **together with** the document precisely to close this. That step is missing.

**Two concrete consequences:**

1. **The timestamp on an audit credential is mutable.** `proof.created` can be rewritten freely without breaking verification. For an artifact whose purpose is non-repudiable evidence feeding EU AI Act Article 12 record-keeping, "when was this attested" is not decoration — and it is currently unprotected.

2. **Key-substitution exposure for any `did:web`-resolving verifier.** §14.7.1 specifies resolving the issuer key from a `did:web` verification method. The natural implementation reads `credential.proof.verificationMethod` and fetches that key — i.e. **choosing its trust anchor from unsigned, caller-modifiable data.** An attacker who signs a forged credential with their own key and points `verificationMethod` at their own `did:web` document produces a credential that verifies cleanly. The `issuer` field *is* inside the signed body, so the defence is to bind `verificationMethod` to the signed `issuer` — but **nothing in the code, docstrings, or tests does or requires this.** This module's own verifier sidesteps it only because the caller passes the key in explicitly; the first real did:web verifier written against this design will not.

**Why no test caught it:** the suite tampers the credential **subject** (`it('rejects a credential whose subject was tampered after signing')` — correctly fails verification). There is **no test that tampers `proof.created` or `proof.verificationMethod`**, because such a test would pass verification and fail the assertion.

**Fix:** include the proof options (all proof fields except `proofValue`) in the canonical signing bytes, on both sign and verify paths. Add two tamper tests — one per field. Alternative: move `created` and `verificationMethod` into the protected JOSE header, which is already covered.

## F2 — MEDIUM-HIGH: a revoked credential verifies as valid

`verifyVerifiedDoneAttestation()` takes a `VerifiedDoneAttestation` — the credential that travels — and `proofStatus` lives on the `IssuedAttestation` **wrapper**, not on the credential. So the artifact handed to a counterparty carries **no revocation state at all**, and offline verification of a revoked credential returns `true`.

`revoke()` in the store is a status transition, which is correct storage design — but it is invisible to anyone holding the credential. This is the missing status-list problem in its concrete form.

**Fix:** ship the revocation status list with signing (already the recommended sequencing), and until then document an explicit caller contract: **verification is necessary but not sufficient — the holder must also check status.** A `true` from this function currently means "the bytes are authentic," not "this attestation is in force."

## F3 — MEDIUM: no key-type assertion at load

`loadIssuerSignerFromEnv()` calls `createPrivateKey(pem)` with no check on `asymmetricKeyType`. An RSA or P-256 PEM loads without complaint; the failure surfaces later inside `cryptoSign(null, …)` as an opaque error, while the JOSE header unconditionally claims `alg: 'EdDSA'`.

**Fix:** assert `privateKey.asymmetricKeyType === 'ed25519'` at load and fail loud with a clear message. Cheap, and it turns a confusing runtime failure into a startup one.

## F4 — LOW: re-signing permitted here

`signVerifiedDoneAttestation()` refuses to sign a **revoked** attestation (good) but will happily re-sign one already `signed`, overwriting the proof with a new `created`. The `unsigned` guard exists in the store's `sign()`, not here. Defence in depth argues for the guard in both.

## F5 — LOW: bespoke canonicalization

`canonicalJSON()` is a hand-rolled recursive key-sort. It is **symmetric across sign and verify**, so the self-issued/self-checked path is sound, and the docstring is honest that the JCS (RFC 8785) vs RDF choice is deferred. Two notes for the v2.0 freeze:

- Sorting via `Object.keys().sort()` uses UTF-16 code-unit order, which **matches** JCS — a helpful accident worth making deliberate.
- A key whose value is `undefined` serializes to `"key":undefined`, which is not valid JSON. Harmless today (bytes are only ever compared to themselves) but it will break any external verifier that parses before hashing.

No external verifier will interoperate until this is pinned. That is acceptable while credentials are self-checked; it is a blocker the moment a counterparty verifies one.

---

## What the implementation gets right

Worth recording, because these are the parts not to disturb while fixing the above:

- **Module separation.** Signing lives outside `ats-engine.ts`, so the mandate-gate logic stays crypto- and key-free. Correct instinct: key custody is its own concern.
- **Correct Ed25519 usage.** `cryptoSign(null, …)` is the right call shape for Ed25519 in Node, and the determinism claim (RFC 8032 — no per-signature nonce to leak) is accurate.
- **`alg` is checked on verify** and the header is inside the signed bytes — algorithm confusion is closed.
- **Detached form is enforced** (`payloadSegment !== ''`), so a smuggled inline payload is rejected.
- **`verify` returns `false` and never throws**, including around `JSON.parse` and `cryptoVerify` — no DoS surface from a malformed credential.
- **Caller-supplied `created`.** The module holds no clock authority, which keeps signatures deterministic and testable.
- **No key material in code or git**; PEM arrives as a runtime secret, and `loadIssuerSignerFromEnv` returns `null` rather than inventing a key.
- **Refuses to sign a revoked attestation.**

## Recommendation

1. Fix **F1** before merge — it is the one that becomes expensive after issuance, and it is small.
2. Fix **F3** in the same pass (one line + a message).
3. Take **F2** as an explicit caller-contract note now, and close it properly with the status list.
4. **F4/F5** may merge as-is with issues filed; F5 must be resolved at the v2.0 freeze, before any external verifier exists.
5. Keep every tier unsigned (HIC decision 1) until F1 lands, key custody is settled, and the fail-loud production-signer assertion is in place.
