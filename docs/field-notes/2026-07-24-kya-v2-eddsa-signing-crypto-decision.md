# Field Note — KYA v2.0: Why Node-Native Ed25519, Not `jose`

- **Date:** 2026-07-24
- **Author:** Risto Anton Päärni (Founder, CEO · Lifetime Oy) — via Claude Code session `claude/greg-isenberg-field-notes-a2r544`
- **Location:** Europe > Finland > Espoo
- **Context:** DWS6 — KYA v1.11 → v2.0 migration; retroactive HIC outcome for PR #1716
- **Confidence:** High for the decision record (sourced from PR #1716 body + `Legal/KYA_STANDARD_v1.md` §14.7.1). **The code was not read** — PR #1716 is unmerged and its branch is not in this container (see Provenance).
- **Status of the work described:** **PR #1716 is OPEN, not merged** (`claude/kya-v2-attestation-signing-6e5703` → `main`, 13 files, +1148/−9, 6 commits, opened 22.07.2026). Built and in review, not on `main`.

## Ontology Tags

- **Geography:** Europe > EU (sovereignty boundary)
- **Sector:** Enterprise AI > Agent governance > Verifiable credentials > Cryptography
- **Entities:** KYA §14.7 / §14.7.1, `attestation-signing.ts`, Ed25519 / EdDSA, `node:crypto`, `jose`, W3C VC, `JsonWebSignature2020`, EU AI Act Art. 12
- **Temporal Context:** 2026-Q3, KYA schema freeze at v2.0

---

## Why this note exists

PR #1716 shipped the signing path the KYA trust chain had been missing, and closed the §14 schema freeze. It produced **no field note, no KB entry, and no HIC question** — so the *reasoning* behind an irreversible cryptographic choice lived only in a PR body. This note is the retroactive HIC outcome. The decision it records is the kind that is cheap to make once and expensive to revisit after credentials exist in the wild.

## The Decision

**Ed25519 signing via Node's built-in `node:crypto` — not the `jose` library.**

Stated rationale (PR #1716): *"Node-native Ed25519 (`node:crypto`) — no third-party crypto dependency (jose was only transitive); sovereignty-clean."*

**Why that is the right call, stated properly:** a sovereignty product that adds a third-party dependency in order to *sign its sovereignty claims* has a supply-chain contradiction at its core. The credential exists to let a counterparty stop trusting our infrastructure; minting it through an npm package widens the trusted computing base at exactly the wrong point. Node's crypto is already in the runtime's audited surface, ships with the platform, and has no separate update cadence to track. Fewer moving parts in the signing path is not a convenience preference here — it is the product claim.

> **Correction of record.** An earlier audit note this session (`2026-07-24-greg-isenberg-what-is-true-and-useful-for-kya.md`) recommended `jose` as "the natural pick" for JWS-enveloped VCs. That recommendation was made against `main`, where no signing existed, and is **superseded** — the actual decision went the other way, for a better reason than the one behind the recommendation. Recorded rather than quietly dropped: the recommendation optimized for ergonomics; the decision optimized for the trusted computing base, which is the property KYA sells.

## What Shipped (per PR #1716)

| Module                       | What it provides                                                                                                                                                    |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `attestation-signing.ts`     | `signVerifiedDoneAttestation()` (EdDSA **detached JWS**, `JsonWebSignature2020`, `proofStatus → 'signed'`), `verifyVerifiedDoneAttestation()`, `generateIssuerKeyPair()`, `loadIssuerSignerFromEnv()` |
| `attestation-store.ts`       | `VerifiedDoneAttestationStore` — `persist()`, `sign()` (guards `unsigned`), `revoke()` (status transition, **never** DELETE)                                        |
| `attestation-issuance.ts`    | `attestMandateExecution()` — issue → sign-if-configured → persist → log `mandate.attest`                                                                            |
| `mandate-event-logger.ts`    | `MandateEventLogger` appends to `kya_mandate_events`; `prev_hash`/`event_hash` are **trigger-set, never app-set**                                                    |

Envelope choice is consistent with §14.7.1 as written: JWS first, Data Integrity (`eddsa-rdfc-2022`) only on counterparty demand — so no RDF canonicalization is on the critical path.

Tests: **47/47** across the identity suite (mandate-gate 21, attestation 6, **signing 8**, store 6, event-logger 2, issuance 4). `tsc --noEmit` and `prettier --check` clean. ESLint could not run (`@eslint/js` missing — pre-existing).

Standard: **KYA doc 1.11 → 2.0**, §14 frozen to the TS shapes; §14.7.1 retitled from "target design" to implemented.

## The Insight — the env-var gating model has a silent-downgrade edge

`loadIssuerSignerFromEnv()` returns **null when the key env var is unset**, and the unsigned path stays valid. Two things are true about that design:

1. **It is correct for development and for staged rollout.** Signing becomes opt-in by configuration. No developer needs a private key to run tests, and the tier-by-tier rollout (§14.7.1: Aegis on-prem first) is a config change rather than a code fork. The issuer key stays a runtime secret, never committed — which is the only acceptable shape.
2. **In production it is a silent security downgrade.** A missing or misnamed env var does not raise. It quietly mints `proof_status='unsigned'` credentials that look successful to every caller, while counterparties receive claims they cannot verify. Nothing in the described design distinguishes "unsigned because this is dev" from "unsigned because prod lost its key."

That second property is in tension with **Engineering Discipline Rule 12 (Fail Loud)** — "completed successfully while silently skipping is the worst class of bug." The fix is small and belongs with the rollout, not after it: **assert a signer is present when the environment is production or the tenant tier requires signing**, and fail closed rather than degrade. The unsigned path should remain reachable only where it is explicitly, per-tenant intended.

`verifyVerifiedDoneAttestation()` returning `false` rather than throwing is the right complement on the read side — a verifier that crashes on a malformed credential is a denial-of-service surface — provided callers treat `false` as "reject," never as "skip."

## Handoff to Step 3 — runtime issuance

PR #1716 ships `attestMandateExecution()` as **a composable unit with no caller**: per the PR, "no such caller exists yet." That is the honest boundary of what is done.

So the chain is now: shape frozen ✅ → signing implemented ✅ → storage + transitions ✅ → **runtime issuance ⛔ not wired**. Nothing calls the seam from a live mandate-execution path, because no live mandate-execution path exists. Until that lands, KYA can sign an attestation but nothing in production produces one.

Ordering note: `attestMandateExecution()` **persists before it logs** the `mandate.attest` event. Worth preserving deliberately — a crash between the two leaves a stored credential with no evidence-chain entry (recoverable, auditable) rather than a chain entry pointing at a credential that does not exist (a hole in an append-only record).

Deferred by design: **per-agent key delegation** (root-CA → per-agent) to v2.1, per §14.7.1.

## Open risk carried from the PR checklist

PR #1716 answers **"Does the change make any security assumptions or guarantees?" → Yes**, and **"threat model and security review?" → No**. Aikido's automated scan reported no issues, and the only PR comments are bot deploys and that scan — **no human reviewed this cryptographic change.** Automated SAST does not evaluate key custody, rotation, or envelope choice. A human crypto review before merge is proportionate to what this code is for.

## Next Steps

- Merge decision on PR #1716 (open since 22.07.2026).
- Add the production-signer assertion (fail loud) before or with the first tier rollout.
- Wire step 3: a live mandate-execution path that calls `attestMandateExecution()`.
- Human security review of the signing path prior to merge.
- Revocation **status list** (VC-level) — storage supports `revoked`; a resolvable status endpoint a counterparty can check is still absent.

### Learning-loop steps (DWS_LEARNING_STANDARD five-step)

- **(1) KB entry** — `kb/wiki/concepts/kya-attestation-signing-fallback.md`. ✅
- **(2) Field note** — this file. ✅
- **(3) `Learn/` HTML render** — `Learn/2026-07-24-kya-v2-eddsa-signing-crypto-decision.html` (+ `.docx`), via `scripts/render-doc.sh`. ✅ _Blocker cleared this session: `pandoc` was absent and has been installed, so the three earlier "N/A — pandoc missing" entries in this session's other notes were a fixable blocker, not a constraint._
- **(4) Drive export** — N/A this session (repo is source of truth, Truth Standard §2E; flagged).
- **(5) HIC question** — below. ✅

### Provenance (audit discipline)

- **Verified:** PR #1716 state (`open`, `merged:false`), branch, file/commit counts, body text, comment list (all bots), and that `attestation-signing.ts` is **absent from `origin/main`**; local branch is 0 commits behind main.
- **Not verified — sourced from the PR body only:** module APIs, test counts, and the `tsc`/`prettier` results. The PR branch was not fetched and **no line of `attestation-signing.ts` was read**. Every code-behavior claim here is a restatement of the author's description, not an inspection. Re-verify against the diff before this note is cited as a design record.
- **Resolves an earlier flag:** migrations 074/079 being live in production — the PR body states this (via #1713). Still second-hand; no production DB was queried.

### HIC question (EU AI Act Art. 14 intervention point)

> **What is the production key-management strategy, and does signing go live before or after it exists?** Four sub-decisions are entangled and only you can cut them: **(a) custody** — Aegis on-prem DGX Spark HSM is specified, but Standard/Sovereign tiers point at an UpCloud UKS HSM that is not stood up; do those tiers ship unsigned until it is? **(b) rotation** — who rotates, on what cadence, and what happens to already-signed credentials when a key retires (a verifier resolving a rotated key must still validate historical attestations, or every past proof silently breaks)? **(c) the silent-downgrade guard** — do we add the fail-loud production assertion before the first tenant is switched on, or accept a window where a missing env var mints unverifiable credentials without complaint? **(d) revocation reachability** — storage supports `revoked`, but with no published status list a counterparty cannot discover it.
>
> **My recommendation:** merge #1716 after a human crypto review, but **keep every tier unsigned until (a) and (c) are settled** — custody decided, fail-loud assertion in place. Signing is the one step that is expensive to undo: an unsigned credential is a claim we can upgrade later, while a credential signed by a key we cannot properly custody or rotate is a durable liability we have handed to a counterparty. Turn it on first for Aegis on-prem, where the box already holds the key and the blast radius is one tenant.
