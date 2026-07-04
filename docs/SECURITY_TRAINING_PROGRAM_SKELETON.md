# Internal Security Training Program — Skeleton

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code | Session: az3tby | Date: 03.07.2026 | Changes: Initial creation — a repo audit found "Tietoturvakoulutus on organisaatiossamme järjestetty suunnitelmallisesti" had no supporting evidence (DWS_SECURITY_STANDARD.md NIS2 Art.21(2)(g) was marked "Partial"; docs/coaching/ curricula are a client-facing product, not internal staff training). This is a skeleton, not delivered content.

Document Status:

- Created: 03.07.2026
- Last Modified: 03.07.2026
- Language: English
- Publication Status: DRAFT (skeleton only — not yet delivered; do not mark NIS2 Art.21(2)(g) as Active until at least one full cycle below has actually run)

---

## Why this is a skeleton, not a curriculum

The request was for a "runko" (framework/skeleton) — topics, audience, cadence, format. This document defines the shape of the program. It does not contain slide decks, quiz questions, or session scripts. Do not claim training compliance from this document alone; claim it once a cycle has actually run and been logged (see "Completion tracking" below).

## Audience

Given Lifetime Oy is currently a single-operator company (see `docs/SECURITY_ROLES_AND_GUIDANCE.md` scope note), the initial audience is:

- The operator themself (Risto Paarni) — self-administered, logged honestly.
- Any contractor or new hire with repo write access, `.claude/` hook bypass ability, or production credentials — onboarding-gated, not optional.

## Topics (mapped to existing gaps, not generic checklist content)

1. **Secret egress discipline** — CLAUDE.md's "Secret Egress Rules" section, why `.claude/hooks/secret-scan.sh` exists, what it catches and what it doesn't. Directly relevant: this session's own permission-gate block on posting scanner output to a GitHub issue (2026-07-03) is a real, concrete teaching example — use it.
2. **Patch/vulnerability SLA** — what `Aegis`'s SLA tiers mean in practice, how to triage a Dependabot PR, when "risk accept, don't fix" is a legitimate call vs. avoidance.
3. **Business-critical systems awareness** — what's in `docs/BUSINESS_CRITICAL_SYSTEMS.md`, why each tier matters, what "impact if disrupted" means concretely for each system.
4. **Incident response walkthrough** — read one real closed incident (e.g. `docs/field-notes/2026-04-13-security-incident-partners-stub-overwrite.md`) end to end: what was found, how it was triaged, what fixed it. Real incidents teach better than hypotheticals.
5. **Vendor/data-residency basics** — why `DWS_SOVEREIGNTY_STANDARD.md` exists, what CLOUD Act exposure means in one paragraph, not the full standard.
6. **Automation bias** — the specific NIS2 Art.21(2)(g) concern already named in `DWS_SECURITY_STANDARD.md`: don't trust an agent's "completed successfully" without checking, per CLAUDE.md Rule 12 ("Fail loud").

## Format

Short, spaced sessions over long ones — one topic per session, self-paced reading + a one-paragraph written reflection (what would you do differently), logged in `docs/field-notes/` under a `training-log` naming convention (`docs/field-notes/YYYY-MM-DD-training-<topic-slug>.md`). This matches the existing field-notes convention already used for incidents and decisions — reuse it rather than inventing a new tracking system.

## Cadence

- **Onboarding:** All 6 topics, before production credential access is granted.
- **Ongoing:** One topic revisited per quarter, rotating — prioritize whichever topic had a real incident or near-miss since the last cycle.
- **Ad hoc:** Any topic re-run immediately after a real incident touches it (e.g., if a future secret-egress near-miss happens, topic 1 reruns regardless of schedule).

## Completion tracking

A cycle counts as "run" when a `docs/field-notes/YYYY-MM-DD-training-<topic-slug>.md` entry exists with a written reflection — not when this skeleton is written, and not when a topic is merely read. Update `DWS_SECURITY_STANDARD.md`'s Art.21(2)(g) row from "Partial" to "Active" only once every topic above has at least one logged cycle; until then it stays "Partial", which remains an accurate status.

## Explicitly out of scope

- `docs/coaching/` (`CLAUDE_CODE_COACHING_CURRICULUM_FI_v1.0.md` etc.) — that is a **client-facing product** (Claude Code Coaching engagements), not this internal program. Do not merge the two; they have different audiences and different content ownership.
- Formal certification, external vendor training spend — not proposed here; can be layered on later if the team grows past one operator.
