# DWS Learning Standard

_Canonical registry — single source of truth. Registered in `DWS_TRUTH_STANDARD.md` §2 row 30._

***

# VERSION AND AGENT HISTORY

Version: 1.1

Sessions & Modifications:

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
| 5 | **Ask the HIC a question** | End the session with **one real, decision-shaped question** for the HIC — the intervention point Article 14 requires. Not "any feedback?"; a specific fork the human should own. | Session reply to HIC + logged in the field note "Next Steps" | This standard §2, EU AI Act Art. 14 |

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

---

_Version 1.1 · 24.07.2026 · © Lifetime Oy — all rights reserved. Business Confidential. Registered in `DWS_TRUTH_STANDARD.md` §2 row 30._
