# Handoff: claude/kya-v2-attestation-signing-6e5703

> Per-branch handoff file. See `.claude/HANDOFF.md` for the protocol and the
> cross-branch history log. Owned by sessions on this branch only.

- **Task:** KYA v2.0 — implement real signing for the Verified-Done Attestation
  (§14.7) against the design fixed in **KYA §14.7.1** (Signing & Key Custody),
  then freeze the KYA §14 schema at v2.0.
- **Base:** PR #1713 is now MERGED to main (merge commit `8ebb67c9`,
  22.07.2026) and this branch has been REBASED onto it — no longer stacked, it
  now carries only this handoff over a clean main. The §14.7 foundation
  (attestation + types + stub issuer + migration 079 + §14.7.1 spec) is all in
  main. Migration 079 is APPLIED + live in prod (kya_verified_done_attestations
  - mandate.attest); 074 also live.
- **Spec to implement against (already written, read it first):**
  `Legal/KYA_STANDARD_v1.md` §14.7.1 — Ed25519 (EdDSA) hardware-backed; JWS-
  enveloped VC first (Data Integrity only on counterparty demand); `did:web`
  DNS-rooted issuer (.well-known); key custody by tier (Aegis Defence on-prem
  DGX / Standard-Sovereign UpCloud UKS HSM / never shared cloud KMS); one
  issuer key per tenant at v2.0, per-agent delegation deferred to v2.1;
  tenant-controlled rotation, DWS holds only the root CA (counter-signs tenant
  DID-doc updates). Invariant: the private signing key never leaves the
  tenant's jurisdiction.
- **Next steps:**
  1. ✅ **DONE — signing path.** New module `src/identity/attestation-signing.ts`
     (kept separate from ats-engine so the gate logic stays crypto-free):
     `signVerifiedDoneAttestation()` (EdDSA detached JWS in `proof.proofValue`,
     type JsonWebSignature2020, proofStatus→'signed'), `verifyVerifiedDoneAttestation()`
     (returns false, never throws), `generateIssuerKeyPair()`,
     `loadIssuerSignerFromEnv()` (null when unset → unsigned path stays valid;
     reads KYA_ISSUER_PRIVATE_KEY_PEM + KYA_ISSUER_VERIFICATION_METHOD, never
     hardcoded). Node-native Ed25519 (`node:crypto`) — NO third-party crypto
     dep (jose was only transitive; sovereignty-clean). The unsigned stub
     `issueVerifiedDoneAttestation()` is unchanged; signing composes on top.
     8 tests in `src/__tests__/attestation-signing.test.ts` (sign/verify,
     tamper→false, wrong-key→false, unsigned→false, deterministic sig, env
     loader null). Full suite 35/35 green; tsc + prettier clean.
  2. ✅ **DONE — sign/revoke service path.** New module
     `src/identity/attestation-store.ts` (modeled on command-audit-logger.ts:
     `VerifiedDoneAttestationSink` interface + injectable client +
     `getSupabaseClient()` fallback + `fromEnvOrNull()`):
     `persist()` (INSERT, maps credential→079 columns, strips mandate urn),
     `sign()` (loads row, guards proof_status==='unsigned', signs, UPDATEs
     credential+proof_status='signed'), `revoke()` (UPDATE →'revoked', never
     DELETE). Exported `MANDATE_SUBJECT_URN_PREFIX` from ats-engine for the
     urn/vc-id round-trip. 6 tests (`attestation-store.test.ts`, fake injectable
     SupabaseClient) — column mapping, unsigned→signed, refuse non-unsigned sign,
     revoke transition, fail-loud on DB error. Suite 41/41; tsc + prettier clean.
  3. ✅ **DONE — runtime issuance orchestration.** `src/identity/mandate-event-logger.ts`
     (`MandateEventLogger` — §14.5 evidence-chain writer; prev_hash/event_hash
     trigger-set, never by app) + `src/identity/attestation-issuance.ts`
     (`attestMandateExecution()`: issue → sign-if-configured → persist → log a
     `mandate.attest` event; persists BEFORE logging; denied→attests nothing).
     No real caller exists yet — this is the composable seam a future
     mandate-execution path calls. New API exported from `src/identity/index.ts`.
     6 tests (2 event-logger, 4 issuance). Suite 47/47; tsc + prettier clean.
  4. ✅ **DONE — signed-path tests** (see step 1). No new dep added (Node crypto,
     not jose/jsonwebtoken).
  5. ✅ **DONE — schema FROZEN at v2.0.** KYA doc 1.11→2.0, §14 heading →v2.0;
     §14.2.1/§14.3/§14.7 "illustrative until v2.0" notes now "frozen at v2.0"
     locked to the TS shapes (interfaces + Zod validator normative); §14.7.1
     retitled from "target design" → implemented. Synced docs (KYA_SECURITY §12,
     KYA_OPTIMIZATION §13, DWS_SECURITY §18.4) reference §14 by section as
     source-of-truth and quote semantics not field names → no edits needed
     (freeze changed no referenced field).
- **v2.0 STATUS: all 5 steps done.** Signing key stays a runtime secret;
  per-agent key delegation is the v2.1 follow-up. Optional later: a DWS_SECURITY
  §18 G8 "Verified-Done Attestation" gate row; wire `attestMandateExecution`
  into a real mandate-execution path once one exists.
- **Env notes:** `npm ci` works (node 22). tsc + prettier + vitest run; eslint
  does NOT (`@eslint/js` missing — pre-existing gap). Migration numbers 075–079
  used; next is 080. Applying migrations / secrets / outbound email = RED-zone.
- **Blockers:** DID method + issuer-key custody are DECIDED (§14.7.1). The
  actual signing KEY / HSM endpoint is a secret — must come from the operator,
  never invented or committed.
