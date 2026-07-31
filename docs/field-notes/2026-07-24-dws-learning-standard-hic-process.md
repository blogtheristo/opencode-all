# Field Note — DWS Learning Standard & the HIC Learning Process

- **Date:** 2026-07-24
- **Author:** Risto Anton Päärni (Founder, CEO · Lifetime Oy) — via Claude Code session `claude/dws-learning-hic-process-e70k0a`
- **Location:** Europe > Finland > Espoo
- **Context:** DWS6 governance / standards — session learning loop
- **Confidence:** High (founder-directed)
- **Drive export (step 4):** [2026-07-24 DWS Learning Standard & HIC Learning Process — Field Note v1.0](https://docs.google.com/document/d/12KkbXrffUETD4Q43OsP8tmlJcaLnskLIu6l2IOuAgoQ/edit) _(generated copy; this repo file is the source of truth per Truth Standard §2E)_

## Ontology Tags

- **Geography:** Europe > EU
- **Sector:** Governance > AI_Compliance > Human_Oversight
- **Entities:** DWS_LEARNING_STANDARD, DWS_TRUTH_STANDARD §2F/row 30, EU AI Act Art. 14, EU AI Act Art. 12, HIC (Human-In-Command), CLAUDE.md, Lifetime Oy
- **Temporal Context:** 2026-Q3, post EU AI Act Art. 12/50 active

## The Story

Founder directive: new ideas, concepts, theories, code, whitepapers and artifacts are welcome to build DWS further — **but the HIC must be kept informed and must understand each new artifact.** The learning capture is to be treated as a **major outcome of every session**, not an afterthought. The stated minimum: update the knowledge base, write a field note, add an HTML version into `Learn/`, export a copy to Drive, and ask the HIC a question. And the framing is legal, not stylistic: **Human-In-Command means DWS follows EU AI Act law — it is a legal-basis requirement.**

This session codified that:

1. **Created `DWS_LEARNING_STANDARD.md`** (v1.0) — Purpose, the EU AI Act **Article 14 (human oversight)** legal basis, the HIC Learning Outcome, the five-step minimum, the substantive-vs-trivial gate, operationalization (skills/hooks/workflow), cross-references, a Roles chapter, and anti-patterns.
2. **Registered it in `DWS_TRUTH_STANDARD.md`** — new **§2F** ("HIC Learning Outcome — the major outcome of every session") stating it as a canonical fact, plus **§2 row 30**, version bump 3.7 → 3.8, and a §6 drift-log entry.
3. **Wired the legal basis in** — added **EU AI Act Article 14 (human oversight)** to `DWS_STANDARDS_LIBRARY.md` §3.1 (with Article 12 named as its auditability sibling); added a Resolver row + a **Session Learning Outcome Rule** section to `CLAUDE.md`.
4. **Built a cross-session backlog** — `docs/backlog/BACKLOG_UNDONE_2026-07-24.md`, mined from the 27 per-branch handoff files + `HANDOFF.md` history (RED-zone human actions, TS-merge verification, KYA migrations 074/079 to apply, orphaned gbrain skills, `Learn/` thesis HTML regen, 425 Dependabot vulns, and more).
5. **Dogfooded the loop** — this field note (step 2), a `Learn/` HTML render (step 3), a Drive export (step 4), and the HIC question below (step 5).

**Terminology reconciliation (Rule 7 — surface, don't average):** the directive said "human in control"; the registered canonical term (Truth Standard row 23, `HIL_Lucille.md`) is **HIC = Human-In-Command**. Kept the canonical "Command" and mapped it explicitly to the EU AI Act Article 14 legal term "human oversight" rather than silently substituting "control."

## The Insight

Session knowledge was DWS's least-governed asset. Every other canonical fact has a registry; the thing a session *learned* had none — it lived in ephemeral container memory and chat scrollback, reclaimed when the container died. That is not just lost value; under EU AI Act **Article 14** it is a governance gap: oversight a human cannot exercise because the information never reached them, in a form they could understand, is not oversight. Making the HIC Learning Outcome a required deliverable turns "keep notes" into a **legal-basis control** with a five-step, checkable shape — and gives Article 14 a concrete session-level mechanism, the sibling to Article 12's machine-side reasoning log.

## Next Steps

- **HIC decision needed** (the step-5 question): see below.
- Build the session-stop hook that warns when a substantive session produced no field note + `Learn/` HTML (backlog C2).
- Fix the `***`→`---` Prettier-hook delimiter reversion so the VERSION-block rule stops silently breaking (backlog C3).
- Steps not yet automated: KB entry (`/kb`) for "HIC Learning Outcome" concept — flagged for a follow-up with the `/kb` toolchain available.

### HIC question (EU AI Act Art. 14 intervention point)

> **Should the five-step HIC Learning Outcome be enforced by a blocking session-stop hook (fail-loud, block-don't-ask) once built, or stay an advisory checklist that agents self-report against?** Blocking maximizes the Article 14 evidence chain but will interrupt trivial-but-misclassified sessions; advisory is lower-friction but relies on agent discipline. My recommendation: ship advisory first (this standard), then flip to blocking after the hook has a stable substantive-vs-trivial classifier.

---

_© Lifetime Oy — all rights reserved. Business Confidential. Field note · 24.07.2026._
