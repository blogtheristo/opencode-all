# KYA-S1 v1.2 → v1.3 — Review and Proposed Amendments

**Status:** PROPOSAL — not adopted. Requires HIC decision before any edit to `Legal/KYA_S1.md`.
**Trigger:** The BPMN 2.0 × KYA-S1 blog series (drafts 5–7) attempted to implement the spec literally. Seven controls could be passed by a conforming vendor while the buyer's actual guarantee was absent. This is that list.
**Window:** KYA-S1 v1.2 public comment runs 4 Aug – 4 Nov 2026 (§11). Amendments belong in that window, not after it.

***

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Opus 5) | Session: claude/agent-use-cases-comparison-h7vl25 | Date: 07.08.2026 | Changes: Initial review — seven gaps found by implementing KYA-S1 v1.2 against a BPMN 2.0 process engine. Proposes TRS-4/TRS-5, PRV-4, TC4-5, FLT-4, a §8 tier-table extension, and one §4 clarification. No edit made to Legal/KYA_S1.md.

Session Links & References:

- Claude Code (claude/agent-use-cases-comparison-h7vl25): https://github.com/blogtheristo/dws6/commits/claude/agent-use-cases-comparison-h7vl25
- Source standard: `Legal/KYA_S1.md` v1.2
- Implementation drafts that surfaced the gaps: `docs/blog-drafts/bpmn-xml-trs-portti-riskiluokka-lease-fail-closed.md`, `docs/blog-drafts/flt-72h-virheluokittelu-ja-prv-paatoksen-toistaminen.md`

Document Status:

- Created: 07.08.2026
- Last Modified: 07.08.2026
- Language: English
- Publication Status: DRAFT — INTERNAL
- Classification: INTERNAL — STANDARDS REVIEW
- Document Type: Standard amendment proposal

***

## Summary — the seven gaps

| #   | Gap                                                              | Domain | Severity     | Can a vendor pass v1.2 without it? |
| --- | ---------------------------------------------------------------- | ------ | ------------ | ---------------------------------- |
| 1   | No atomicity between authorization check and action              | TRS    | **Critical** | Yes                                |
| 2   | No fail-closed requirement when the trust engine is down         | TRS    | **Critical** | Yes                                |
| 3   | No bound on how stale an authorizing score may be                | TRS    | High         | Yes                                |
| 4   | Human-override decisions not explicitly in the audit trail       | PRV    | High         | Yes                                |
| 5   | No ordering requirement between forensic capture and termination | TC4    | High         | Yes                                |
| 6   | 72-hour FLT clock starts at a vendor-defined moment              | FLT    | Medium       | Yes                                |
| 7   | Extension domains (FLT/TRS/PRV) carry no tier SLAs               | §8     | Medium       | N/A — structural                   |

Gaps 1–3 are one failure in three parts: **v1.2 specifies that a trust score gates action, but never specifies the binding between the score and the action it authorizes.** Everything else is secondary to this.

***

## Gap 1 — TRS-2 permits check-then-execute (Critical)

**Current text (§6.2):**

> **TRS-2 — Authorization gating** — actions above defined consequence thresholds are blocked when trust score falls below documented levels.

**The failure.** "Blocked when the score falls below" describes a _state_, not a _moment_. Every real implementation evaluates the score at time T₁ and performs the action at T₂. If trust collapses in the interval — IDV revocation, TC4 event, behavioral anomaly — the action still executes under an authorization that no longer exists. The telemetry shows a compliant gate. The buyer's guarantee is void.

This is not hypothetical: it is the default outcome of the obvious implementation. A BPMN engine that reads a score into a process variable, routes on it, and then invokes a service task has this gap, and passes TRS-2 as written.

**Proposed TRS-4:**

> **TRS-4 — Atomic authorization binding.** A trust score must not authorize an action directly. Authorization is carried by a **single-use, time-bound, cryptographically signed capability token** issued with the score. The action's first operation must be an atomic consume-and-execute against the issuing authority: the token is validated, marked consumed, and the action authorized in one indivisible operation. An action whose token fails validation at consumption time must not execute, and must not be retried automatically. The executing component must never evaluate token validity locally.

**Evidence:** Architecture review demonstrating the atomic operation (transactional lock, compare-and-swap, or equivalent) + telemetry of at least one token rejected at consumption after a mid-flight trust change.

## Gap 2 — No fail-closed requirement (Critical)

**The failure.** v1.2 nowhere states what happens when the trust engine is unreachable, times out, or errors. A vendor whose engine fails open — proceeding on a cached score, a default, or an exception swallow — violates no control in v1.2. This is the single cheapest way to have an attestation and no protection, because it only manifests during an outage, which is exactly when it matters.

**Proposed TRS-5:**

> **TRS-5 — Fail-closed authorization.** Unavailability, timeout, or error from the trust-scoring authority must never result in an action proceeding autonomously. The vendor must document a bounded evaluation timeout and demonstrate that exceeding it routes the action to human authorization or halts it — never to a default, cached, or assumed score. Fail-open behavior on any consequential action class is a KYA-S1 conformance failure.

**Evidence:** Telemetry from a real or staged trust-engine outage showing the routing decision + the documented timeout value.

## Gap 3 — No score freshness bound (High)

**The failure.** TRS-1 requires a score; TRS-3 requires change logging. Nothing bounds the age of the score used to authorize a given action. A score computed 40 minutes ago satisfies v1.2. "Continuous authorization" — the domain's own title — is then a claim the controls do not test.

**Proposed:** fold into TRS-4 as a required token property, plus one line in TRS-1:

> **TRS-1** (amended, addition): …and a documented **validity period** per consequence class, after which the score may no longer authorize action.

**Note on numbers.** The DWS reference implementation proposes 60/75/85/95 thresholds with 30/15/5/2 s validity by consequence class. These are the _reference implementation's_ values and belong in `Legal/KYA_STANDARD_v1.md`, not in the vendor-facing standard — KYA-S1 should require documented values, not prescribe them (consistent with §2, "does not prescribe a specific identity provider, model vendor, or runtime").

## Gap 4 — Human decisions may be absent from the audit trail (High)

**Current text (§6.3):**

> **PRV-2 — Decision replay** — for any consequential decision, the vendor can reconstruct inputs, agent state, model version, and policy version at decision time.

**The failure.** The listed reconstruction fields are all _agent_ state. When an action routes to a human — which is precisely what TRS-2, TC4 and Article 14 are designed to force — the record of who approved, when, and on what basis is not required by any control. The implementation consequence is concrete: in the first draft of our own BPMN model, the audit listener sat on the agent path's sequence flow only, so every human approval executed unlogged. The model passed inspection visually.

This is the worst-placed gap in the standard, because §4 names PRV as the nearest control to **Article 12** and TC4/IDV/TRS as nearest to **Article 14** — yet the human's oversight act itself is the one event no control requires you to keep.

**Proposed PRV-4:**

> **PRV-4 — Human decision provenance.** Where an action is routed to a human for authorization, override, or rejection, the record must capture the identity of the deciding human (bound per IDV), the decision, the stated rationale, the timestamp, and the trust state that caused the routing. Human decisions are consequential decisions under PRV-2 and are subject to the same replay requirement. An audit trail that records autonomous actions but not the human interventions over them does not satisfy PRV.

**Evidence:** Replay demonstration of a human-authorized action, not only an autonomous one.

## Gap 5 — TC4 capture/termination ordering unspecified (High)

**The failure.** TC4-2 requires atomic chain termination; TC4-4 requires post-mortem capture of "state, tool history, and decision trace at the moment of termination." Nothing sequences them. A vendor that terminates first and collects afterwards satisfies both clauses in letter while losing exactly the volatile state that FLT-1 attribution depends on. FLT then has no substrate, and the 72-hour attribution becomes an assertion.

**Proposed TC4-5:**

> **TC4-5 — Capture precedes release.** Forensic capture under TC4-4 must complete, or be durably committed, before the terminated chain's resources are released or reused. The vendor must demonstrate that a chain terminated under TC4-2 yields a complete FLT-1 attribution substrate.

## Gap 6 — The 72-hour clock has no anchor (Medium)

**Current text (§6.1):**

> **FLT-2 — Per-incident attribution** stored as a signed artifact within 72 hours of **incident close**.

**The failure.** "Incident close" is vendor-declared and unbounded. An incident held open indefinitely owes no attribution, indefinitely. The buyer's practical question — _how long until I know whose fault this was?_ — is unanswered by the control that exists to answer it.

**Proposed FLT-4:**

> **FLT-4 — Bounded attribution clock.** The vendor must publish a maximum interval from **incident detection** to incident close, per severity class. Where close exceeds that interval, a provisional attribution naming the candidate fault classes and the open questions must be issued at the interval's expiry and updated on close.

This keeps FLT-2's close-anchored final artifact while removing the ability to stop the clock by not stopping the incident.

## Gap 7 — Extension domains have no tier SLAs (Medium, structural)

**The failure.** §8's tier table differentiates Bronze/Silver/Gold on IDV revocation, TC4 propagation, and BHM red-team cadence only. FLT, TRS and PRV — the three domains §7 correctly identifies as _having no analogue in any adjacent standard_, i.e. the standard's actual contribution — are tier-invariant. Gold and Bronze promise the buyer identically nothing on trust-score freshness, replay availability, or attribution speed.

**Proposed §8 additions:**

| Tier       | TRS score validity (max) | TRS engine timeout (max) | PRV replay availability | FLT provisional attribution |
| ---------- | ------------------------ | ------------------------ | ----------------------- | --------------------------- |
| **Bronze** | 300 s                    | 5 s                      | 30 days                 | 30 days from detection      |
| **Silver** | 60 s                     | 2 s                      | 7 days                  | 10 days from detection      |
| **Gold**   | 10 s                     | 500 ms                   | 24 hours                | 72 hours from detection     |

_Numbers are a proposal for HIC decision, not derived from measurement. They must be validated against the reference implementation before publication — §3's evidence meta-rule applies to Lifetime Oy's own claims first._

## Clarification — §4, Article 14 row

The §4 table maps Article 14 to IDV, TC4 and TRS. With PRV-4 adopted, PRV becomes load-bearing for Article 14 as well: the human-oversight duty is evidenced by the record of oversight acts, which is a PRV artifact. Proposed amendment to the Article 14 row's "Nearest KYA-S1 control" cell:

> **IDV** (verified human binding), **TC4** (override / termination), **TRS** (continuous authorization), **PRV-4** (record of the oversight act itself)

The three honest limits in §4 remain unchanged and still apply.

***

## What this does not change

- No renumbering of existing controls. All additions are new identifiers (TRS-4, TRS-5, PRV-4, TC4-5, FLT-4), so §11's stability guarantee holds and v1.3 is a minor version.
- No change to §1 scope, §2 non-goals, or §3 evidence meta-rule.
- No change to the DWS tier claim. §9 still stands: **no tier is claimed** until an independent assessor signs. Adopting v1.3 does not alter that, and the reference implementation must be re-verified against TRS-4/TRS-5 before it can be described as implementing them.

## Honest assessment of the proposal itself

Gaps 1–2 are the ones worth the version bump. They are the difference between a standard that describes a gate and a standard that requires the gate to hold. Gaps 4 and 5 are close behind because they protect the evidence that everything else depends on.

Gaps 6–7 are improvements, not corrections; a reviewer could reasonably defer them to v2.0 without leaving a hole.

The weakest part of this proposal is the numbers in Gap 7. They are engineering intuition, not measurement, and publishing them in a standard would make them normative for adopters who have no more basis for them than we do. If they cannot be validated against the reference implementation in time, ship v1.3 with the tier table requiring _documented and assessor-verified_ values per tier, and no specific figures.

***

# Part B — The internal KYA standards and the reference implementation

Part A reviewed `KYA_S1.md`, the vendor-facing standard. Part B reviews what sits behind it: `KYA_STANDARD_v1.md`, `KYA_SECURITY_v1.2.md`, `KYA_OPTIMIZATION_v1.4.md`, and `src/identity/ats-engine.ts`.

**Headline finding: KYA-S1 §9 claims the DWS reference implementation provides "TRS — Agent Trust Score engine." It does not implement TRS-1 as written.** This is the check flagged as an open HIC action in Part A, now performed.

## B1 — ATS omits every input TRS-1 requires (Critical)

**KYA-S1 §6.2, TRS-1** requires a score with documented inputs: *IDV state, behavioral baseline distance, red-team posture, capability manifest scope.*

**The actual ATS formula** (`KYA_SECURITY_v1.2.md` §3.1, and the code):

```
ATS_Base = max(0, 1.0 - V*0.25 - L - D*0.05)

V = KYA_VIOLATION count
L = 0.10 if avg_latency > 500 ms
D = DENIED path access attempts
```

Of TRS-1's four required inputs, **zero appear.** V and D are violation counters — consequences of past behavior, not a behavioral baseline distance. L is a latency measurement. Red-team posture and IDV state are absent entirely; capability manifest *scope* is absent, though manifest *validity* appears as a hard kill in code (see B4).

Two consequences:

1. **The §9 claim is not supportable as worded.** Either ATS gains the TRS-1 inputs, or §9 must say the reference implementation provides a trust-score engine that does not yet satisfy TRS-1. §3's evidence meta-rule binds Lifetime Oy first.
2. **An IDV revocation does not move the score.** TRS's own title is "Trust Score & **Continuous Authorization**", and §4 maps IDV+TRS to Article 14. But a verified human's authorization can be revoked without ATS changing by a single point, because IDV state is not an input. The Article 14 story depends on a coupling that does not exist in the implementation.

**Recommendation:** add IDV state as a hard-kill input to ATS (parallel to the existing manifest hard kill), and behavioral-baseline distance as a scored input. Until then, correct §9.

## B2 — Latency is scored as untrustworthiness (High)

`L = 0.10 if avg_latency > 500 ms` puts a **performance** metric inside a **trust** score. A congested network, a cold start, or a slow downstream API lowers the agent's trust and can push it across a permission boundary. The agent has done nothing untrustworthy.

This is backwards in a specific way. Part A's Gap 2 established that infrastructure degradation must route to a human (**fail-closed**), not silently alter an authorization value. Here degradation instead *quietly reduces trust*, which under the S1 mapping *is* the authorization value. Slowness and disloyalty are not the same signal and must not share a channel.

**Recommendation:** remove L from ATS. Track latency as an SLA metric with its own alerting.

## B3 — Four different formulas across four documents and the code (Critical, Rule 7)

The autoresearch factor `A` appears in mutually contradictory forms:

| Source                             | Formula                                            | A coefficient  |
| ---------------------------------- | -------------------------------------------------- | -------------- |
| `KYA_STANDARD_v1.md` §3.1          | `ATS = max(0, 1.0 - V*0.25 - L - D*0.05 + A*0.15)` | additive, 0.15 |
| `KYA_OPTIMIZATION_v1.4.md` §185    | cites a previous additive `... + A*0.18`           | additive, 0.18 |
| `KYA_OPTIMIZATION_v1.4.md` history | "ATS autoresearch factor corrected to A*0.25"      | 0.25           |
| `KYA_SECURITY_v1.2.md` §3.1        | `ATS_Final = ATS_Base * (1 + A)`, A = 0 if V > 0   | multiplicative |
| `src/identity/ats-engine.ts`       | `ATS_Base` only — **no A term at all**             | absent         |

`KYA_SECURITY_v1.2.md` §3.1 and `KYA_OPTIMIZATION_v1.4.md` §185 both state explicitly that the **additive form was a score-inflation vector** and was replaced for that reason: an agent could be "optimal but leaky" and still score high.

**`KYA_STANDARD_v1.md` §3.1 still carries that superseded additive formula as its current definition.** A reader following the resolver to that file implements the known-unsafe version. Rule 12 applies: do not resolve this by quietly deleting the old text — supersede it in place with a pointer to the multiplicative form and the reason.

**Recommendation:** `KYA_SECURITY_v1.2.md` §3.1 is the correct definition. Amend `KYA_STANDARD_v1.md` §3.1 accordingly. Pick one A coefficient and state it once. Then either implement A in `ats-engine.ts` or document that the security baseline intentionally ships without it — the code comment at `src/identity/ats-engine.ts:16` currently points at a §3 describing an extension the code does not have.

## B4 — The code is stricter than the documents, and undocumented for it (Medium)

`calculateATS()` opens with a hard kill absent from every formula in the standards:

```ts
const manifestExpired =
  Date.now() > new Date(manifest.signedAt).getTime() + manifest.ttlSeconds * 1000;
if (!manifest.signature.verified || manifestExpired) return buildResult(0.0, ...);
```

An unsigned or expired capability manifest yields ATS = 0 outright. This is good — it is a signed, time-bound authorization primitive, i.e. **the nearest thing in the codebase to Part A's proposed TRS-4 lease**. It is also invisible in `KYA_STANDARD_v1.md` §3.1, `KYA_SECURITY_v1.2.md` §3.1, and KYA-S1 §6.2.

A control that exists only in code cannot be attested, because §3 requires architecture documentation or telemetry as evidence, and neither will describe a mechanism no document names.

**Recommendation:** document the manifest signature + TTL hard kill in all three standards. It is the strongest existing building block for TRS-4.

## B5 — V has no time window, no decay, no rehabilitation (High)

`V` is the count of `KYA_VIOLATION` events in whatever `telemetry` array the caller passes. Three problems:

1. **The window is the caller's choice and is undocumented.** Pass session telemetry and V is per-session; pass 12 months and the agent is permanently frozen. The score's meaning depends on an argument no standard specifies.
2. **No decay.** "4 violations = zero trust" with no half-life means trust is monotonically non-recovering over any fixed window.
3. **No rehabilitation path.** Nothing says how an agent at ATS = 0 returns to service, or who authorizes that. §9.3 covers registry lifecycle but not score recovery.

**Recommendation:** specify the evaluation window explicitly, add a documented decay half-life, and define the human-authorized rehabilitation procedure. All three are prerequisites for the TRS-1 "documented inputs" claim.

## B6 — Permission ladder is global, not per-consequence-class (High)

ATS thresholds (`>=0.80` full, `0.50-0.79` restricted, `<0.50` suspended) form **one ladder for all actions**. Reading a report and stopping a production line clear the same bar at 0.80.

This is Part A's Gap 1/Gap 3 seen from the implementation side. `MANDATE_FLOOR_ATS = 0.5` / `PAYMENT_BAND_ATS = 0.8` / `HNP_FLOOR_ATS = 0.9` at `src/identity/ats-engine.ts:174-180` show the pattern *does* exist for agentic-commerce mandates — it simply has not been generalized to tool calls and physical actuation.

**Recommendation:** generalize the mandate-band pattern into a per-capability consequence class in the Capability Manifest (§9.1), so the manifest declares the bar each capability must clear.

## B7 — "Policy engine bypassed" is scored, not prevented (High)

`KYA_SECURITY_v1.2.md` §11.5:

> Policy `deny` decision in production (policy engine bypassed) -> V += 5 (-1.00) and agent quarantine

The parenthetical concedes the policy engine **can be bypassed**, and responds with a post-hoc score penalty plus quarantine. KYA-S1 REG-2 requires the opposite: *capabilities outside the manifest must be denied at runtime, not merely audited.*

A gate that can be bypassed and then penalized is detection, not enforcement. Detection is a legitimate defence-in-depth layer, but it cannot be the primary control while REG-2 is claimed.

**Recommendation:** either close the bypass path at runtime, or state plainly in §11.3 which enforcement is preventive and which is detective, and stop claiming REG-2 for the detective part.

## B8 — Policy-gate escalation has no timeout behaviour (Medium)

`KYA_SECURITY_v1.2.md` §11.3: `escalate` -> "Pending, 24h SLA for human decision." What happens at hour 25 is undefined. This is Part A's Gap 2 (fail-closed) in the policy layer: an unanswered escalation must have a defined terminal state, and the only safe default is denial.

**Recommendation:** specify expiry-to-deny with notification, per Part A's TRS-5.

## B9 — Version identifiers are inconsistent (Low, but it blocks citation)

- `KYA_STANDARD_v1.md`: filename says `v1`, title says **v1.5**, §3 header says **v1.4**, §14 says **v1.11**, §14.7 says **v1.10**.
- `KYA_OPTIMIZATION_v1.4.md`: filename and history say **v1.4**, but §185 explains a change as "(v1.6)".

An assessor cannot cite a control by version when the document disagrees with itself.

***

## Part B priority

| #   | Finding                                                 | Severity     | Fix location                          |
| --- | ------------------------------------------------------- | ------------ | ------------------------------------- |
| B1  | ATS omits all four TRS-1 inputs; §9 claim unsupportable | **Critical** | `ats-engine.ts` + KYA-S1 §9           |
| B3  | Four contradictory ATS formulas; unsafe one is live     | **Critical** | `KYA_STANDARD_v1.md` §3.1             |
| B2  | Latency scored as untrustworthiness                     | High         | `ats-engine.ts` + both standards §3.1 |
| B5  | V has no window, decay, or rehabilitation path          | High         | Standards §3.1                        |
| B6  | Single global permission ladder                         | High         | Capability Manifest §9.1              |
| B7  | Policy bypass scored rather than prevented              | High         | `KYA_SECURITY_v1.2.md` §11.3/§11.5    |
| B4  | Manifest TTL hard kill exists only in code              | Medium       | All three standards                   |
| B8  | Escalation timeout undefined                            | Medium       | `KYA_SECURITY_v1.2.md` §11.3          |
| B9  | Inconsistent version identifiers                        | Low          | Document headers                      |

**B1 and B3 are the two that matter.** B1 because the vendor-facing standard makes a claim about the implementation that the implementation does not meet — and KYA-S1's credibility rests on §3's refusal of self-attestation. B3 because a live canonical file carries a formula its own companion documents call an inflation vector.

Neither is a design flaw in the KYA concept. Both are drift between four documents and one code path that no single pass has reconciled since the v1.4 split.
