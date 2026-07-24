# Field Note — Greg Isenberg: "16 Things Normal in 3 Years" → What's True and What DWS/KYA Builds

- **Date:** 2026-07-24
- **Author:** Risto Anton Päärni (Founder, CEO · Lifetime Oy) — via Claude Code session `claude/greg-isenberg-field-notes-a2r544`
- **Location:** Europe > Finland > Espoo
- **Context:** DWS6 — KYA / agent-infrastructure roadmap signal reading
- **Confidence:** High for the DWS-artifact mappings (verified against repo at write time); the predictions themselves are Greg's, treated as MEDIUM-confidence futures.
- **Sibling notes:** `2026-07-06-greg-isenberg-startups-for-agents-21-answers.md` (the 21-point scorecard) and `2026-07-24-greg-isenberg-what-is-true-and-useful-for-kya.md` (the "sign the attestation" recommendation this note reinforces).

## Ontology Tags

- **Geography:** Global > US (creator-economy lens) → EU (regulated-industry / sovereignty lens)
- **Sector:** Enterprise AI > Agent infrastructure > Governance, credentials, labor market
- **Entities:** Greg Isenberg, KYA, ATS, §14.7 Verified-Done Attestation, HIC, LWM (Lifetime World Model), `/human-capital` → `/token-capital`, EU AI Act Art. 14
- **Temporal Context:** 2026-Q3 → 2029 horizon

---

## The Story

Greg circulated a second list: **"16 things that will be normal in 3 years and sound insane today."** Where the July 6 thread was 21 *startups to build*, this one is 16 *futures to price in*. The founder's standing question applies: what here is **true**, and of the true, what is **useful for DWS/KYA to implement** — versus cultural weather we can only watch.

The striking result: this list and the prior two notes **converge on the same unbuilt-but-designed primitive.** Two of Greg's 16 predictions are, almost word for word, the signed verifiable credential the last note flagged as KYA's one broken link:

- **#11 — "The CV dies and gets replaced by a body of work an agent can verify in 4 seconds."** That is the **portable, signed KYA credential** (ATS-at-signing + verified-done attestation, §14.4/§14.7). "Verify in 4 seconds" is literally "resolve a `did:web` issuer and check an Ed25519 signature." It is unbuildable while the attestation mints **unsigned**.
- **#12 — "You interview an agent before you hire it. Give it a fake task, watch how it handles the weird cases, then decide."** That is a **KYA capability-manifest eval / ATS baseline** run against an adversarial task set before binding the agent to a human/tenant.

So this thread is not new direction — it is **independent confirmation** that the highest-leverage KYA build is the one already named: *sign the credential, make it externally verifiable.*

> **AUDIT CORRECTION (same-day Opus 5 audit pass) — the convergence claim above is half right, and the imprecision matters for sequencing.**
>
> **#11 genuinely requires the signature.** "Verify in 4 seconds" is a *cross-organizational* check by a party who does not trust you; that is exactly what a signed, resolvable credential is for. Confirmed.
>
> **#12 does not — not within one tenant.** Interviewing a candidate agent needs an *eval harness plus an ATS baseline*; a firm evaluating its own agent can read its own database and needs no cryptography whatsoever. The signature only becomes load-bearing when the candidate is **third-party or cross-org** — i.e. when the interview result must travel. Filing #12 under "confirms signing" **overstated the case**; it is more accurately a *probation/eval* build (item 2 in the implementation list below), which can ship independently of and in parallel with signing.
>
> Net effect on the recommendation: unchanged in direction, sharper in sequencing — signing is gated by #11/#14-class cross-org needs, while #12's probation flow is **not blocked on signing** and can start now. The sibling note's implementation list was re-ordered in the same audit pass (manifest signing promoted; revocation moved to ship *with* signing).

## The Mapping — True? / DWS Status

| #   | Prediction (short)                              | True?          | DWS / KYA anchor                                                                 |
| --- | ----------------------------------------------- | -------------- | ------------------------------------------------------------------------------- |
| 1   | A job = keeping agents from doing dumb things   | **True**       | HIC + `/kya` Leash Snap + RED-zone hooks — the agent-ops role already exists     |
| 2   | Typing reads as "old" to kids                   | Cultural       | Not actionable                                                                   |
| 3   | Itemized monthly bill of what your agents bought| **True**       | §14.5 mandate evidence chain + KYA-Optimization financial attribution — **build the statement UI** |
| 4   | You buy a self-running business, never see code | True as a risk | The opacity KYA fights — provenance / verifiable manifests are the counter       |
| 5   | Doctor's first opinion is a model; human decides trust | **True** | EU AI Act Art. 14 human oversight = HIC pattern (not a DWS health product)        |
| 6   | Job posts: "must be able to manage agents"      | **True**       | Labor-market signal — feeds `/coaching` (Art. 4 AI literacy)                     |
| 7   | Best-paid = best at explaining the business to machines | **True** | **The LWM thesis** — per-industry world model; `/human-capital` → `/token-capital` loop |
| 8   | More agents than employees; HR manages both     | **True**       | KYA Subagent Registry (§8) + ATS = "HR for agents"; needs a unified roster view  |
| 9   | Companies hide how few employees they have      | Cultural       | Not actionable                                                                   |
| 10  | Your calendar fills with agent-negotiated meetings | Partly true | Needs A2A negotiation **on top of** identity+ATS (21-point note point 13 — a "no" until trust layer lands) |
| 11  | CV dies → body of work an agent verifies in 4s  | **True**       | **Signed KYA credential (§14.4/§14.7)** — the one broken link                     |
| 12  | You interview an agent before hiring it         | **True**       | KYA manifest eval + ATS baseline (`/agent-run`, `/autoresearch`) — assemble into a probation flow |
| 13  | Losing your job = losing your agents            | **True**       | KYA Pillar 1 identity binding — but **portability/offboarding is unspecified** (see HIC question) |
| 14  | "Made by a person" label + certification body   | **True**       | KYA-inverse: a human-authorship VC on the same §14.7.1 signing rails — note, don't build yet |
| 15  | A folder of agents like a folder of apps        | **True**       | `/discover-agents` catalog + `skills/manifest.json` — the roster is the folder    |
| 16  | Getting a human on the phone = a paid tier      | Cultural/market| Not actionable                                                                   |

## The Insight

**The same primitive keeps surfacing under different names.** Greg's readers see 16 separate futures; DWS sees that #1, #3, #8, #11, #12, #13, #14 are all faces of **one governed, signable credential layer** — identity, a scored track record, spend accounting, and a verifiable proof-of-work, bound to an accountable human. It is the exact cluster the 21-point note collapsed into "KYA governance," and the last note narrowed to a single missing line of code: **the signature.** When a third independent Greg thread lands on the same spot, that is not coincidence — it is the market naming the layer DWS already designed.

The one genuinely *new* signal here, not stressed in the earlier notes, is **#7 → the pricing of "explaining the business to machines."** That is the human-capital → token-capital loop stated as a labor-market fact: the scarce, best-paid skill becomes encoding a firm's judgment into a world model it owns. DWS has the skills for it (`/human-capital`, `/token-capital`, the LWM) — the useful move is treating #7 as the *demand-side* proof that the LWM is the product, not a feature.

## What Is Useful to Implement (additive to the prior note — not a repeat)

The prior note's #1 recommendation stands unchanged and is now doubly confirmed: **sign the verified-done attestation (§14.7.1 → code).** New, shippable items this thread surfaces:

1. **Agent Spend Statement (#3).** Render the §14.5 mandate-event chain + KYA-Optimization financial attribution into an itemized per-tenant monthly statement ("what your agents bought / spent, by agent, by mandate"). The schema exists (migration 074, present in repo — see the sibling note's provenance section: *deployment* state is propagated from the version history, not verified here). The CFO-facing artifact does not exist. This is the KYA-Architecture surface that makes the CFO buy.
2. **Agent Probation flow (#12) — not blocked on signing; can start now.** Formalize "interview the agent" as a named KYA gate: run a candidate agent against a fixed adversarial task set, score via ATS, emit a baseline **before** binding it to a tenant. Compose existing parts (`/agent-run` scoring, `/autoresearch` evals, capability manifest) — don't build a new engine. Only the *cross-org portable* version of this result needs the signature.
3. **Unified agent roster (#8/#15).** A per-tenant "org chart of agents + humans" view over the Subagent Registry, with ATS as the performance-review column — the "HR for agents / folder of agents" surface. Positioning made concrete.
4. **"Made by a person" VC (#14) — note only.** Same §14.7.1 signing rails, human-authorship subject. Dual-use of the signing investment; flag for after signing ships, do not build now.

## What Is Not Actionable (honest)

#2, #9, #16 (and largely #5) are cultural/market predictions — plausible, but there is no DWS artifact to build against them. Recording them as *watched, not owned* rather than inventing a product to chase weather (Fail Loud > false coverage).

## Next Steps

- Sign the attestation (prior note's item 1) — everything above depends on it being externally verifiable.
- Scope the Agent Spend Statement against migrations 074/079 (data is already there).
- Cross-link both 2026-07-24 Greg notes from `Legal/KYA_STANDARD_v1.md` Related Documents.

### Learning-loop steps (DWS_LEARNING_STANDARD five-step)

- **(1) KB entry** — N/A this session (no `/kb` write; flagged for follow-up).
- **(2) Field note** — this file. ✅
- **(3) `Learn/` HTML render** — N/A: **`pandoc` is not installed in this container**; `scripts/render-doc.sh` exists and is executable but exits on the missing binary. _Audit correction: original wording ("not run in container") implied a choice; the blocker is a missing binary, recoverable with `apt-get install -y pandoc`._
- **(4) Drive export** — N/A this session (repo is source of truth, Truth Standard §2E; flagged).
- **(5) HIC question** — below. ✅

### HIC question (EU AI Act Art. 14 intervention point)

> **When a human's identity is revoked (the `IDENTITY_REVOKED` Leash-Snap reason code already exists), what happens to the agent's accumulated ATS/trust history and its issued verified-done attestations — do they die with the human binding, or survive bound to the tenant?** Greg's #13 ("losing your job means losing your agents") makes this a real, near-term product and legal question: does an employee's departure vaporize the trust history their agents earned (bad for the company), and can a departing employee take agents whose credentials name them (bad for the tenant)? **My recommendation:** bind ATS/trust history and verified-done attestations to the **tenant**, with the human as the *accountable signer at time of action* — so trust history survives an employee leaving, prior attestations stay valid (the human was accountable *then*), and the departing human simply loses the authority to sign *new* mandates. This keeps Pillar 1 accountability intact without making the firm's trust capital walk out the door. Needs your GO before it goes into the §14.7.1 / v2.0 key-custody spec.

---

## Addendum — Boardy ping-pong round 1: the KYA answer to point 13

**Point 13: _"Losing your job means losing your agents too, and it's kinda scary losing your best agents."_**

Greg is right, and for DWS it is not a prediction — **it is the current schema.**

**Schema finding (verified this session).** `kya_verified_done_attestations` (migration 079) has `hic TEXT NOT NULL` — the accountable human — and **no tenant column at all**. `kya_mandate_events` (074) does carry `org_id TEXT` ("tenant isolation"), but it is **nullable**. So the portable credential that _is_ the agent's track record is anchored to the **person**, not the company. If the human goes, the record still names them and has no tenant anchor to fall back on.

**The three assets that sentence conflates.** Separate them and most of the fear resolves:

| Asset                                                                     | Belongs to        | Why                                                                                                         |
| ------------------------------------------------------------------------- | ----------------- | ----------------------------------------------------------------------------------------------------------- |
| **Track record** — what the agent did, how well, under what authority     | **the tenant**    | Earned executing the company's mandates, on company data, under company liability. Must survive a departure. |
| **Accountability record** — who authorised this spend, when              | **the moment**    | Immutable. The leaver _was_ accountable then; revoking access later cannot un-authorise a past act.          |
| **Agent configuration** — prompts, skills, tuned context the person built | **the contract**  | The chef's-recipes problem. Employment IP law, not agent infrastructure. Settle it in the employment terms.  |

**KYA position:** bind the track record to the tenant, bind accountability to the timestamp, and keep configuration ownership out of the trust ledger entirely — it is a contract term, and platforms that try to adjudicate it will get it wrong.

**Sequencing consequence — this reorders the roadmap.** The anchor fix is now a **precondition for signing**, not a parallel task. Signing an attestation that is anchored to a departing human permanently mints a credential with the wrong subject anchor; a signature makes a mis-anchored record durable rather than fixable. **Fix the anchor, then sign.**

**Second-order (EU, and it bites).** `hic` is personal data sitting in an append-only table where `DELETE` is denied by design (079: "Revocation is a proof_status transition, never a row deletion"). A leaver's **GDPR Article 17** erasure request therefore collides with **EU AI Act Article 12** record-keeping. Art. 17(3) supplies the exemption, but it must be _documented_ as the lawful basis, and `hic` should hold a **pseudonymous stable subject ID**, never a name or email, so the retained evidence is not also an HR record.

**The leaver gap nobody's list includes.** When a human's identity is revoked, agents holding mandates signed under their authority keep running. `IDENTITY_REVOKED` exists as a Leash-Snap reason code; what it must additionally trigger is a **sweep of live mandates bound to that HIC**. Otherwise offboarding leaves the equivalent of an SSH key in the wall.

**Resolves the open HIC question** posed above ("do ATS/attestations die with the human binding or survive bound to the tenant?") — answer: **survive, bound to the tenant**, with the human retained as accountable-signer-at-time-of-action. Implementation is a migration (`org_id NOT NULL` on both tables), not a policy note.

---

_© Lifetime Oy — all rights reserved. Business Confidential. Field note · 24.07.2026._
