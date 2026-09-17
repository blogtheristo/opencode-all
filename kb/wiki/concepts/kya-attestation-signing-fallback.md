<!--
VERSION AND AGENT HISTORY
Document: kya-attestation-signing-fallback.md
Version: 1.0
Last-Updated: 2026-07-24
Author: Risto Anton Päärni (Lifetime Oy)
Agent: Claude Code (claude-opus-5)
Purpose: Canonical explanation of the KYA verified-done attestation signing
         fallback — what proof_status='unsigned' means, when it is correct,
         and the production silent-downgrade edge it creates. Written as the
         retroactive KB half of the HIC outcome for PR #1716 (KYA v2.0),
         which shipped the signing path with no KB entry.
         Source: PR #1716 body + Legal/KYA_STANDARD_v1.md §14.7 / §14.7.1.
         CODE NOT READ — PR #1716 unmerged, branch not fetched.
Introduced-In: PR-pending (branch claude/greg-isenberg-field-notes-a2r544)
Code-Version: 1.0
Branch: claude/greg-isenberg-field-notes-a2r544
Date: 2026-07-24
Owner: risto.paarni@lifetime.fi
-->

# KYA Attestation Signing — the Unsigned Fallback

**Version:** 1.0
**Status:** Active
**Scope:** `src/identity/attestation-signing.ts`, `attestation-store.ts`, `attestation-issuance.ts`; `kya_verified_done_attestations.proof_status`

> **Status caveat.** The signing path described here is **PR #1716, open and unmerged** as of 24.07.2026. On `main` there is no signing module and every attestation mints unsigned. Treat this entry as documenting the incoming design, not current `main` behaviour.

## The three states

`proof_status` on `kya_verified_done_attestations` (migration 079) is a CHECK-constrained enum:

| State      | Meaning                                                                                              |
| ---------- | ---------------------------------------------------------------------------------------------------- |
| `unsigned` | Default. Credential is well-formed and stored, but carries **no `proof` block**. Not verifiable.      |
| `signed`   | EdDSA detached JWS present (`JsonWebSignature2020`). A counterparty can verify without trusting us.   |
| `revoked`  | Withdrawn. A **status transition, never a row deletion** — DELETE is denied on this table by design.  |

Transitions are `service_role`-only. `sign()` guards that the row is `unsigned` before transitioning.

## How the fallback works

`loadIssuerSignerFromEnv()` reads the issuer key from the environment and **returns `null` when it is unset**. When the signer is null, issuance proceeds and the credential is stored `unsigned`. No exception is raised.

`attestMandateExecution()` therefore runs: **issue → sign *if configured* → persist → log `mandate.attest`.** Signing is the only optional step.

## Why this is correct

1. **Developers need no private key.** Tests and local runs exercise the whole issuance path without secret material. The issuer key stays a runtime secret and is never committed.
2. **Rollout is configuration, not a code fork.** §14.7.1 stages signing by tier (Aegis on-prem first, where the DGX Spark already holds the key). Enabling a tier is an env change.
3. **An unsigned credential is still useful internally.** It is a complete, stored, auditable record tied into the §14.5 evidence chain. It just cannot travel to a stranger.

## The edge — silent downgrade in production

**A missing or misnamed env var in production does not fail. It quietly mints unverifiable credentials that look successful to every caller.**

Nothing in the design distinguishes *unsigned because this is dev* from *unsigned because prod lost its key*. The call returns normally, the row persists, the evidence-chain event logs, and the counterparty receives a claim rather than a proof.

This is in tension with **Engineering Discipline Rule 12 (Fail Loud)**: "completed successfully while silently skipping records is the worst class of bug."

**Guard to apply (not yet implemented):** assert that a signer is present when the environment is production **or** the tenant's tier requires signing, and fail closed. The unsigned path should stay reachable only where it is explicitly, per-tenant intended — never as an accident of deployment.

## Reading the verifier

`verifyVerifiedDoneAttestation()` **returns `false`, never throws.** That is deliberate: a verifier that crashes on a malformed credential is a denial-of-service surface.

**Caller contract:** treat `false` as *reject*. Never as *skip*, and never as *unknown*. A `false` from the verifier and an `unsigned` proof status are different failures with the same required response — do not extend trust.

## What is still missing

- **No published revocation status list.** Storage supports `revoked`, but without a resolvable status endpoint a counterparty has no way to discover a revocation. `revoked` is currently only meaningful to us.
- **No production key custody for Standard/Sovereign tiers.** The UpCloud UKS HSM in §14.7.1 is specified, not stood up.
- **No rotation story.** A verifier resolving a rotated key must still validate historical attestations, or every past proof silently breaks.
- **No runtime issuance caller.** `attestMandateExecution()` has no caller in a live mandate-execution path; per PR #1716, none exists yet.

## Related

- `Legal/KYA_STANDARD_v1.md` §14.7 (Verified-Done Attestation), §14.7.1 (Signing & Key Custody)
- `docs/field-notes/2026-07-24-kya-v2-eddsa-signing-crypto-decision.md` (why Node-native Ed25519, not `jose`)
- `supabase/migrations/079_kya_verified_done_attestation.sql` (storage, DELETE denied)
- `DWS_ARTICLE_12_LOGGING_STANDARD.md` (the evidence chain the attestation feeds)
