# Handoff — `claude/greg-isenberg-field-notes-a2r544`

**Last updated:** 2026-07-24 · Claude Code (Opus 5) · session `claude/greg-isenberg-field-notes-a2r544`
**Status:** Documentation/analysis branch. **No production code changed.** 7 commits, all docs/notes/backlog + one unpublished blog draft.

## Task

Started as "Greg Isenberg field note — what's true and useful for KYA to implement." Grew into a KYA audit, two more field notes, three review rounds with Boardy, and four P0 backlog items.

## State — what is on this branch

| Artifact | Purpose |
| --- | --- |
| `docs/field-notes/2026-07-24-greg-isenberg-what-is-true-and-useful-for-kya.md` | The signing-gap audit. Contains audit corrections + a claim-provenance section. |
| `docs/field-notes/2026-07-24-greg-isenberg-16-things-normal-in-3-years.md` | 16 predictions → 3-bucket KYA filter. Addendum 1 = three-asset separation (point 13). Addendum 2 = Boardy round-2 corrections. |
| `docs/field-notes/2026-07-24-kya-v2-eddsa-signing-crypto-decision.md` | **Most load-bearing file.** Why Node-native Ed25519 over `jose`; env-var gating + silent-downgrade edge; step-3 handoff; **consolidated signing sequence (steps 0–6)**; ⛔ anti-regression note. |
| `docs/field-notes/2026-07-24-kya-open-standard-dual-track-ip-strategy.md` | Open Standard v1.5 IP strategy. **4 × `[HIC INPUT NEEDED]` unanswered.** |
| `kb/wiki/concepts/kya-attestation-signing-fallback.md` | KB entry: the three `proof_status` states, the unsigned fallback, verifier caller-contract. |
| `Learn/2026-07-24-*.{html,docx}` | 3 rendered pairs (pandoc installed this session). |
| `onelifetime.world/posts/greg-isenberg-agents-need-a-signature_DRAFT.html` + mirror | LSJ blog draft. **Unpublished, unregistered** — see below. |
| `docs/backlog/BACKLOG_UNDONE_2026-07-24.md` | +4 items: **B7, B8, B9, D4** — all P0. |

## Key findings (carry these forward)

1. **The KYA trust chain has no cryptographic material on `main`.** `ManifestSignature` is `{verified, algorithm, signedBy}` — **no signature value field** — and `ats-engine.ts:72` gates spend authority on that caller-supplied boolean. No verifier exists anywhere in `src/`. Flagged as a possible security issue; **the manifest ingestion path was never traced** — that trace is unstarted and belongs to `/security-reviewer`.
2. **PR #1716 is OPEN, not merged** (`claude/kya-v2-attestation-signing-6e5703`). It ships `attestation-signing.ts` (EdDSA, Node-native), store, issuance, 47/47 tests, and the §14 schema freeze (KYA 1.11 → 2.0). Its **only reviewers are bots**, on a change whose own checklist answers *"threat model / security review: No."*
3. **⛔ `jose` was rejected, not deferred.** Node-native `node:crypto` was chosen deliberately ("no third-party crypto dependency… sovereignty-clean"). An earlier recommendation in this session said "use jose"; it was withdrawn, then **came back as a plan via a Boardy review within hours**. Anti-regression note is in the crypto field note. Do not let it back in without a §14.7.1 version bump.
4. **Three-asset separation** (from Greg #13): track record → **tenant**; accountability record → **the moment** (immutable); agent configuration → **the contract**. Schema bug: `kya_verified_done_attestations` has `hic NOT NULL` and **no tenant column**; `kya_mandate_events.org_id` is nullable.
5. **Anchor fix is a precondition for signing**, not a parallel task — signing a mis-anchored attestation makes the defect durable.
6. **B9: the repo contradicts itself on whether migrations 074/079 are live in production.** Backlog A1/A2 say never-applied (P0); KYA v1.11 and PR #1716 say live in prod. **Unresolved** — the Supabase MCP check requires an approval this session could not obtain.

## Next steps

- **Settle B9 against the live DB** (needs Supabase approval). Until then "074/079 are live" is an unverified propagated claim everywhere downstream.
- **Migration 080** = B7 + B8 + D4 in one change (anchor, pseudonymous `hic`, leaver sweep).
- Trace the manifest ingestion path (`/security-reviewer`) to size the boolean-gate exposure.
- Publish decision on the blog draft — see below.

## Blockers / HIC decisions outstanding

1. **Four `[HIC INPUT NEEDED]` on Open Standard v1.5** — why Q4 2026 specifically; which standards body; where the open/proprietary line falls; the conformance story. The spec **has no artifact anywhere in `origin/main`** — it exists only in session memory.
2. **Human crypto review of PR #1716 before merge?** Recommendation: yes, and keep every tier unsigned until key custody + the fail-loud guard land.
3. **Blog publish.** Draft is `_DRAFT.html`, registered in **nothing** (not §3 registry, not `latestPosts`, not `inject-blog-nav.cjs`) — deliberately, per the `deepseek-v4-flash` precedent: it names a real external person and discloses an unshipped capability. Recommendation: hold until signing lands so it can say "shipped" instead of "in review". **Note:** its honest-limit callout stays accurate only while #1716 is unmerged — re-check the wording on any merge.

## Gotchas for the next session

- **Do not edit `Legal/KYA_STANDARD_v1.md` on this branch.** PR #1716 bumps it 1.11 → 2.0; editing here would conflict. The anti-regression note lives in the field note deliberately for that reason.
- `pandoc` was missing and was installed this session — a fresh container will not have it (`apt-get install -y pandoc`). Three earlier "N/A — pandoc missing" entries were a fixable blocker reported as a constraint.
- Boardy reviews are useful but **verify before propagating** — this session caught an unsupported Entra/Agent-365 claim, TK1–3 mislabelled as product tracks (they are thesis research questions), an IP-assignment/schema category error, and the jose regression. Prior art: KYA v1.9 corrected Boardy's "21 industries."
- Learning-loop step 4 (Drive export) was **N/A in every note this session** — not done for any of them.
