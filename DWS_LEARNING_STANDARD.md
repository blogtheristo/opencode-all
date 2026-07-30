# DWS Learning Standard

_Canonical registry — single source of truth. Registered in `DWS_TRUTH_STANDARD.md` §2 row 30._

***

# VERSION AND AGENT HISTORY

Version: 1.4

Sessions & Modifications:

- Version: 1.4 | Tool: Claude Code (claude-opus-5) | Session: claude/enterprise-ai-harness-0anl7s | Date: 30.07.2026 | Changes: Added **§10.1.1 The number is branch-scoped and never restarts**. §10.1 specified the six-field form of an HIC decision point but left the COUNTER undefined, so three field notes on one branch each opened at "Q1" on 30.07.2026 and the HIC could not answer by reference — three distinct decisions shared one label, forcing a positional reply and a clarifying round on the Article 14 intervention point itself. The counter is now explicitly a running per-branch sequence: first decision on a branch is Q1, the next is Q2 regardless of which document raises it, notes state the branch-scoped number rather than a local one, and .claude/handoffs/<branch>.md carries the highest number used so the next session resumes rather than guesses. Rationale recorded per Rule 12. Raised by the HIC, not detected by the harness.
- Version: 1.3 | Tool: Claude Code (claude-opus-5) | Session: claude/greg-isenberg-field-notes-a2r544 | Date: 25.07.2026 | Changes: Added **§10.3.1 The cooling gap** — nothing irreversible ships in the session that conceived it. §10.3 classified one-way doors but nothing slowed them; the label was a sign without a brake. Requires a deliberate gap (a second session, a night, a human read) between decision and act for the five acts §10.3 names one-way by default (sign / publish / send / delete / hand to a counterparty), explicitly NOT for reversible internal work — writing a document is not publishing it. Rationale recorded: agent-assisted work compresses conception, drafting, review and execution into one motion, so each step can be defensible while the aggregate produces momentum no one chose; the gap converts a felt concern into a mechanism. Names the specific failure mode — a fast partial correction to an outward-facing surface reads as a reviewed surface. Emergency waivers permitted but must be stated at the time and recorded (Rule 12). Two anti-patterns added to §10.8: same-session irreversibility, and the partial correction. §10.1's six-field decision format and §10.6's four-per-session cap are unchanged.
- Version: 1.2 | Tool: Claude Code (claude-opus-5) | Session: claude/greg-isenberg-field-notes-a2r544 | Date: 24.07.2026 | Changes: Added **§10 The HIC Decisioning Process Model** — defines the shape of the Step 5 question, generalized from a session that ran a KYA audit through three reviewer rounds. Codifies: the numbered-question form with a mandatory **(RECOMMEND: …)** preferred action; **always recommend** (a fork without a recommendation offloads analysis while pretending to defer on authority — Art. 14 override presupposes a stated machine judgment); **reversibility classification** (two-way door vs ONE-WAY DOOR, with sign/publish/send/delete/hand-to-counterparty as one-way by default); **verified vs propagated provenance** separated at the point of decision, not in a footnote; **anchoring corrections where the decision is read** plus the standing anti-regression note pattern (a superseded recommendation re-entered as a plan within hours via a reviewer summary); a **max-four-per-session budget**; and **closing the loop** by writing the HIC's answer back. Cross-referenced from §4 Step 5. Added four anti-patterns (§9 + §10.8): recommendation-free decision, correction decay, blended provenance, scope-inflating a decision.
- Version: 1.1 | Tool: Claude Code (claude-opus-4-8) | Session: claude/dws-learning-hic-process-e70k0a | Date: 24.07.2026 | Changes: Sharpened §1 with the load-bearing **HIL ("in the loop") vs HIC ("in command")** distinction and the framing that **ending a substantive session with no learning outcome is knowledge destruction** — an Article 14 compliance gap, not a process miss. Added a §2 **"double duty"** note: the stream of learning outcomes is itself audit-grade **Article 12** record-keeping applied inward to DWS's own development process. Conceptual articulation only — the requirement and the five-step minimum are unchanged. Rich framing kept here (not in `DWS_TRUTH_STANDARD.md`, which stays a thin registry; §2F already points here). HIC-validated 24.07.2026.
- Version: 1.0 | Tool: Claude Code (claude-opus-4-8) | Session: claude/dws-learning-hic-process-e70k0a | Date: 24.07.2026 | Changes: Created the DWS Learning Standard. Codifies the **HIC Learning Outcome** — the requirement that every substantive session ends by capturing what it learned so a Human-In-Command (HIC) understands and can act on the new knowledge. Establishes the five-step minimum (update KB → field note → Learn/ HTML → Drive export → ask HIC a question), the **EU AI Act Article 14 (human oversight)** legal basis, the substantive-vs-trivial session gate, the Roles chapter, and cross-references to the Truth Standard (§2F, row 30), Document Standard (§17/§18 Learn HTML), and the field-notes README. Triggered by founder directive: "we need to keep HIC informed and make sure new artifact is understood by HIC … this HIC process of learn is a major outcome of each session."

***

## Table of Contents

1. Purpose
2. Legal Basis — EU AI Act Article 14 (Human Oversight)
3. The HIC Learning Outcome (the major outcome of every session)
4. The Five-Step Minimum
5. When the Loop Applies (substantive vs trivial sessions)
6. How It Is Operationalized (skills, hooks, workflow)
7. Relationship to Other Standards
8. Roles & Responsibilities
9. Anti-Patterns
10. The HIC Decisioning Process Model (how Step 5 questions are shaped)

---

## 1. Purpose

New ideas, concepts, theories, code, whitepapers, and artifacts are welcome — they are how DWS is built further. But a new artifact that only a machine session ever saw is **not an outcome; it is a liability.** The knowledge lives in ephemeral cloud-container memory that is reclaimed when the session ends, and no Human-In-Command (HIC) ever understood it, checked it, or authorized what happens next.

This standard closes that gap. It makes **learning capture a required, first-class deliverable of every substantive session** — equal in weight to the code or document the session produced. The unit of that capture is the **HIC Learning Outcome**: a small, fixed set of artifacts that (a) persists the new knowledge in git-committed, human-readable form, (b) puts it in front of a HIC, and (c) asks the HIC one real question so a human stays in command of the direction.

**"In the loop" vs "in command" is load-bearing.** Human-in-the-loop (HIL) _reviews_ a decision the machine already made; Human-In-Command (HIC) _holds_ the decision and can override it. Article 14 requires the latter, not the former. A learning outcome that only informs (steps 1–4) without asking the HIC to decide (step 5) delivers HIL, not HIC — it does not fully discharge the duty. The learning outcome is a **handoff of understanding** from the machine to a person, ending in a decision that person owns.

**Ending a substantive session with no learning outcome is knowledge destruction.** The session's understanding is deleted with the container, and no human ever held it. Under Article 14 that is a **compliance gap, not merely a process miss** — which is why this is a standard with an enforcing hook, not a suggestion.

**One-line test:** _If this session vanished right now, could a HIC reconstruct what was learned and decide what to do next — without re-reading the transcript?_ If no, the learning outcome is incomplete.

## 2. Legal Basis — EU AI Act Article 14 (Human Oversight)

This is not a nicety. It is a legal-basis requirement.

DWS operates AI agents that produce work product acted on by a business — the class of system the **EU AI Act (Regulation (EU) 2024/1689)** governs. **Article 14 (Human Oversight)** requires that high-risk AI systems be designed so natural persons can **understand the system's output, oversee its operation, and intervene or override** it. Oversight you cannot exercise because the information never reached a human, or reached them in a form they could not understand, is not oversight.

**HIC = Human-In-Command.** In DWS, the human who exercises Article 14 oversight is the HIC — the founder/CEO (R22) and the Office Chief / Human-In-Command (Lucille Santiago), per `DWS_TRUTH_STANDARD.md` §2 row 23. The HIC Learning Outcome is the **mechanism** by which DWS discharges the Article 14 duty at the session level: it renders each session's new knowledge understandable (field note + Learn/ HTML), reachable (Drive export), and actionable-by-a-human (the HIC question) so a person can genuinely oversee, correct, or veto.

- **HIC (Human-In-Command)** is the DWS operating term. **"Human oversight"** is the Article 14 legal term. **"Human-in-the-loop" (HIL)** is the review posture. This standard treats HIC as the DWS implementation of Article 14 human oversight; do not silently substitute "control" for the registered term "Command" — surface the mapping instead of averaging the words.
- The Article 12 (record-keeping / reasoning-lineage logging) obligation is a **sibling** control, covered in `DWS_STANDARDS_LIBRARY.md` §3.1 and the KYA standard. Article 12 makes the machine's reasoning auditable; **Article 14 (this standard) makes a human able to act on it.** Both are required; neither substitutes for the other.
- **Double duty (Article 12, applied inward).** Because each learning outcome is a dated, git-committed record of what a session built and decided, the **stream of outcomes is itself an audit-grade log of DWS's _own_ development process** — the record-keeping Article 12 expects, turned on the builder. One artifact satisfies both duties: a human can act on it (Art. 14) and an auditor can trace it (Art. 12). This is why the outcome is committed to git (not just exported) — the commit history _is_ the log.

**Scope note.** DWS applies this as a governance baseline across agent sessions, not a self-assessment that any given surface is "high-risk" under Annex III. Where a surface is formally high-risk, the HIC Learning Outcome is one piece of the Article 14 evidence chain, not the whole of it.

## 3. The HIC Learning Outcome (the major outcome of every session)

**Every substantive session produces a HIC Learning Outcome as a primary deliverable, alongside whatever code/document/analysis it was tasked with.** It is complete when all five steps in §4 are done (or explicitly marked N/A with a reason). A session that ships a feature but leaves no learning outcome is **not done** — it has left the HIC blind to what changed.

This requirement is registered as a canonical fact in `DWS_TRUTH_STANDARD.md` §2F and row 30, so it is surfaced to every agent, not just those who happen to read this file.

## 4. The Five-Step Minimum

The minimum HIC Learning Outcome is five steps. Fewer is a bug; more is welcome.

| # | Step | What it means | Where it lands | Canonical rule |
| - | ---- | ------------- | -------------- | -------------- |
| 1 | **Update the knowledge base** | Add/refresh the KB entry for the new concept, entity, signal, or artifact so future sessions retrieve it. | `kb/` (`raw/`, `wiki/`, or `kb.json`) via the `/kb` skill | `/kb` skill; field-notes README "CAPTURE → PROCESS → ELEVATE" |
| 2 | **Write a field note** | One dated markdown note: what happened, the insight, next steps, ontology tags. This is the human-readable capture. | `docs/field-notes/YYYY-MM-DD-topic.md` | `docs/field-notes/README.md` |
| 3 | **Add an HTML version into the Learn folder** | Render the field note / artifact to self-contained HTML so a HIC can read it in a browser without the repo. | `Learn/YYYY-MM-DD-topic.html` (via `scripts/render-doc.sh`) | `DWS_DOCUMENT_STANDARD.md` §18 (Learn HTML), Downloadable HTML Rule |
| 4 | **Export a copy to Drive** | Push a copy to Google Drive so the HIC reaches it from phone/desktop outside the repo. Repo stays the source of truth (Truth Standard §2E). | Google Drive (MCP `Google_Drive.create_file`) | Truth Standard §2B/§2E (Repository-First, Then Export) |
| 5 | **Ask the HIC a question** | End the session with **one real, decision-shaped question** for the HIC — the intervention point Article 14 requires. Not "any feedback?"; a specific fork the human should own. **Shape it per §10.** | Session reply to HIC + logged in the field note "Next Steps" | This standard §2 + **§10**, EU AI Act Art. 14 |

**Ordering.** 1→2→3→4 are produce-then-publish; 5 is the human hand-off. Repo first, export second (Truth Standard §2E): an export with no repo source-of-truth file is a drift incident, not a deliverable.

**N/A is allowed but must be explicit.** If a step genuinely does not apply (e.g. nothing KB-worthy was learned), record `Step N: N/A — <reason>` in the field note. Silent omission is a Rule 12 (Fail Loud) violation.

## 5. When the Loop Applies (substantive vs trivial sessions)

Not every keystroke is a session. Apply judgment, and when unsure, produce the outcome.

**Substantive (learning outcome REQUIRED):**
- New idea, concept, theory, framework, or positioning.
- New or materially-changed code, agent, skill, or migration.
- New whitepaper, standard, deck, or customer-facing artifact.
- A regulatory/competitive/customer signal worth remembering.
- A production incident, edge case, or failure that revealed a knowledge gap.
- Any session a HIC would want to know happened.

**Trivial (learning outcome NOT required):**
- Typo/formatting fixes, dependency bumps with no behavior change.
- Pure lookups/questions answered with no artifact produced.
- Re-running an existing skill that already logs its own output.

**Gate:** if the session added knowledge that is not yet in a git-committed, human-readable place a HIC can find, it is substantive — run the loop.

## 6. How It Is Operationalized (skills, hooks, workflow)

The harness stays thin; the skills carry the process.

- **Capture:** `/kb` (step 1), field-notes README template (step 2).
- **Render:** `scripts/render-doc.sh <note.md>` produces the Learn/ HTML (step 3), images Base64-embedded per the Downloadable HTML Rule.
- **Export:** Google Drive MCP `create_file` from the rendered artifact (step 4). Title leads with the date/version for Drive manageability (Document Standard §26.4).
- **Hand-off:** the session's closing reply to the HIC carries the one question (step 5); the same question is written into the field note's "Next Steps" and, for cross-session continuity, the branch handoff file `.claude/handoffs/<branch>.md`.
- **Learning-of-learning:** `/learn SCOPE=last-week` reads field notes + churn and proposes rule edits; `/retro` feeds it. This standard is what those loops are closing around.

**Enforcement (built 24.07.2026):** `.claude/hooks/session-stop.sh` **Check 6** blocks session exit (`exit 2`, block-don't-ask) when a clearly-substantive session produced no field note or `Learn/` HTML dated today. It is loop-safe (a `stop_hook_active` circuit breaker never blocks twice) and escape-hatched so a misclassified trivial session is never trapped: an `N/A — <reason>` note, `DWS_SKIP_LEARNING_OUTCOME=1`, or `[skip-learning]` in the commit message all release it, and the classifier only counts code / a `*STANDARD*.md` / a new agent / a whitepaper as substantive (dep/lock/config-only diffs stay trivial). It enforces only the two mechanizable artifacts (field note + Learn/ HTML); steps 1/4/5 (KB, Drive, HIC question) remain agent-driven and are named in the block message.

## 7. Relationship to Other Standards

- **`DWS_TRUTH_STANDARD.md`** — §2F states the HIC Learning Outcome requirement as a canonical fact; §2 row 30 registers this file. Truth Standard §2E (Repository-First, Then Export) governs step 4.
- **`DWS_DOCUMENT_STANDARD.md`** — §18 (Learn HTML generation) and the Downloadable HTML Rule govern step 3; §25 (Universal Footer) governs this document's footer; §26 governs the export.
- **`docs/field-notes/README.md`** — the field-note format, ontology tagging, and elevation path for step 2.
- **`DWS_STANDARDS_LIBRARY.md`** — §3.1 registers the EU AI Act, including Article 14 (human oversight) and Article 12 (record-keeping), the external legal instruments this standard implements.
- **`DWS_SECURITY_STANDARD.md` / KYA** — Article 12 reasoning-lineage logging is the auditability sibling to this standard's Article 14 human-oversight duty.

## 8. Roles & Responsibilities

Roles pulled from `DWS_ROLES_REGISTRY.md`; referenced by R-ID so name changes propagate.

| Stage | Role(s) | What they own for this standard | What they get from it |
| ----- | ------- | ------------------------------- | --------------------- |
| 1 — Sponsor | R22 CEO | Requires the HIC Learning Outcome as a session deliverable; is a HIC | Article 14 oversight discharged; no session's knowledge lost to container reclamation |
| 2 — Owner | Risto Päärni (interim) + Lucille Santiago (Office Chief / HIC) | Receive learning outcomes; answer the HIC question; maintain this standard | A readable, reachable stream of what every session learned |
| 3 — Approver | R05 General Counsel + R13 CIO | Confirm the loop satisfies the Article 14 evidence expectation | Audit-ready human-oversight posture for RFPs/DD |
| 4 — Driver | Every engineer + every AI agent in an editing session | Run the five-step minimum before ending a substantive session | No re-discovery next session; credit for the artifact persists |
| 5 — Sign-off | R22 CEO | Sign off on changes to the minimum itself | Governance baseline defensible to board and regulators |

**RACI shorthand:** Owner is _Accountable_; Sponsor is _Responsible_; Approver is _Consulted_; Driver is _Informed and acts_.

## 9. Anti-Patterns

- **Ship-and-vanish.** Feature merged, nothing captured. The HIC learns of it only if they read the diff. This is the exact failure the standard exists to kill.
- **Export without repo source.** A Drive doc / PDF / Gamma with no repo `.md` behind it — a drift incident (Truth Standard §2E), not step 4 done.
- **The fake question.** "Let me know if you want changes." Step 5 requires a real decision fork a human should own, not a politeness.
- **Silent N/A.** Skipping a step without writing `N/A — <reason>`. Fail loud (Rule 12).
- **Learning in chat scrollback.** Insight explained in the session reply but never written to a field note. Scrollback is not a git-committed, HIC-reachable artifact.
- **The recommendation-free decision.** Presenting the HIC a fork with no preferred action. This offloads *analysis*, not authority — see §10.
- **Correction decay.** A superseded recommendation quietly returning as a plan, because the correction lived somewhere the next reader did not look. Corrections decay faster than the claims they corrected; anchor them where the decision is read (§10.5).
- **Blended provenance.** A decision presented on a mix of verified and second-hand facts with no marker separating them. The HIC cannot weigh what they cannot see the basis of (§10.4).

---

## 10. The HIC Decisioning Process Model (how Step 5 questions are shaped)

Step 5 says *ask the HIC one real, decision-shaped question*. This section defines the shape. A question the HIC cannot act on in one reading is not an Article 14 intervention point — it is a status update wearing a question mark.

### 10.1 The required form

Every HIC decision point is presented as a **numbered question with a stated preferred action**:

```
N. <The decision as a question — a fork, not a status check>
   Options:      <A> vs <B> (name the real alternatives, not strawmen)
   (RECOMMEND:   <the preferred action, stated plainly>)
   Reversibility: two-way door | ONE-WAY DOOR
   Unblocks:     <what starts moving once decided>
   Cost of delay: <what degrades or forecloses while it sits>
   Rests on:     <verified facts | propagated claims — marked separately>
```

#### 10.1.1 The number is branch-scoped and never restarts

`N` is a **running counter across the branch**, not a per-document one. A note that opens its question block at `1` because it is the first question *in that file* breaks the only thing the number is for.

- The first decision point raised on a branch is **Q1**. The next is **Q2** — even if it appears in a different field note, a different standard, or three days later.
- Every field note states the branch-scoped number, not a local one. Three notes may each carry exactly one question; they are Q1, Q2 and Q3, never three Q1s.
- `.claude/handoffs/<branch>.md` carries the **highest number used so far**, so the next session resumes the sequence instead of guessing. A session that cannot find the counter starts from the highest number visible in the branch's notes and says so.
- Answers reference the number alone. "Q2: option 1" must be unambiguous without naming a file.

**Why this is a rule and not a preference.** On 30.07.2026 a single branch produced three field notes that each opened at "Q1". The HIC could not answer by reference — three distinct decisions shared one label — and had to reply in two positional blocks of `1. / 2. / 3.` that then required a clarifying round to disambiguate. §10.1 fixed the *form* of the question and left the *counter* undefined, so three notes independently and reasonably restarted at 1. The cost was a full round-trip on the Article 14 intervention point itself, which is the one exchange that must not need a second attempt.

### 10.2 Always recommend — this is not deference, it is the requirement

An agent that lists options without a recommendation has offloaded the *analysis* while pretending to defer on the *authority*. Article 14 oversight means a human can **override the machine's judgment** — which presupposes the machine stated one. A recommendation the HIC rejects is oversight working correctly; no recommendation at all is oversight with nothing to act on.

Recommend even when uncertain. Mark the confidence, then recommend anyway.

### 10.3 Reversibility is the first thing to classify

- **Two-way door** — cheap to undo. Decide fast, do not escalate, note it and move.
- **ONE-WAY DOOR** — expensive or impossible to undo. Flag in capitals, and say what specifically becomes durable.

Anything that **signs, publishes, sends, deletes, or hands an artifact to a counterparty** is a one-way door by default. A credential signed under a key that cannot be custodied or rotated cannot be unsigned; a published spec cannot be unpublished; an emailed letter cannot be unsent.

#### 10.3.1 The cooling gap — nothing irreversible ships in the session that conceived it

Classification is not a brake. §10.3 labels one-way doors; a label slows nothing by itself. **A one-way door requires a deliberate gap between the decision and the act** — a second session, a night, or a human read. The session that conceived an irreversible action does not execute it.

This exists because agent-assisted work compresses conception, drafting, review and execution into a single continuous motion. Each step can be individually defensible while the aggregate produces momentum no one chose. The gap is what converts "this is moving too fast" from a feeling a human must notice and enforce into a mechanism that holds without anyone watching.

**Scope.** The gap applies to the acts §10.3 names one-way by default: **sign, publish, send, delete, hand to a counterparty.** It does not apply to reversible internal work — commits, drafts, notes, specifications held in-repo. Writing a document is not publishing it, and the distinction is the whole point: land the artefact, then let it sit before it leaves.

**The failure mode it prevents is specific.** A fast partial correction to an outward-facing surface reads as a reviewed surface. Fixing what is easy to fix and leaving the load-bearing claims untouched is worse than not having touched it, because the edit itself signals scrutiny that did not occur.

**Emergencies.** A live security incident or an active outage may require acting inside the gap. If so, say so explicitly at the time, and record in the field note that the gap was waived and why. An unrecorded waiver is a silent exception (Rule 12).

### 10.4 Separate what is verified from what is propagated

A decision resting on second-hand facts must say so, at the point of decision — not in a footnote. Use two labels:

- **Verified** — checked directly this session (file read, query run, API called). Say how.
- **Propagated** — asserted by a document, changelog, PR body, or reviewer, and not independently checked.

"Files exist in the repo" and "verified live in the production database" are different claims. Technical due diligence will separate them; so must the decision brief.

### 10.5 Anchor corrections where the decision is read

When a recommendation is withdrawn or a fact corrected, the correction must live **where the next reader will look for the decision** — the standard, the KB entry, or the note that governs the work — not only in the session that made it. Corrections decay faster than the claims they corrected: a superseded recommendation can re-enter as a plan within hours, via a reviewer or a summary that read the original and missed the retraction.

Where a reversal is load-bearing, write a **standing anti-regression note**: state what was rejected, why, and require that any future proposal argue against that paragraph on the merits and land as a version bump.

### 10.6 Budget: at most four per session

More than four decision points means the session did not prioritize. Rank them, present at most four, and carry the rest in the backlog with an owner. A HIC facing eleven questions answers none of them well.

### 10.7 Close the loop

The HIC's answer is itself a learning outcome. Record the decision — and the reasoning given — back into the field note or standard that raised it, so the next session inherits a decided question rather than re-litigating it. An answered question that is never written down converts back into an open one.

### 10.8 Anti-patterns specific to decisioning

- **"Is this ready?" / "Shall I proceed?"** — a permission request, not a decision.
- **Strawman options** — pairing the intended answer with an obviously bad alternative.
- **Scope-inflating a decision** — attaching an unrelated engineering item to a legal or strategic one (e.g. claiming a schema fix gates a contract signature). Wastes the HIC's scarcest resource and can hand a spurious reason to delay.
- **The invisible one-way door** — presenting an irreversible action in the same register as a reversible one.
- **Same-session irreversibility** — conceiving and executing a one-way door in one continuous motion, with no gap for a human to read it cold (§10.3.1).
- **The partial correction** — editing the easy part of an outward-facing surface and leaving the load-bearing claims, so the edit signals a review that did not happen.

---

_Version 1.3 · 25.07.2026 · © Lifetime Oy — all rights reserved. Business Confidential. Registered in `DWS_TRUTH_STANDARD.md` §2 row 30._
