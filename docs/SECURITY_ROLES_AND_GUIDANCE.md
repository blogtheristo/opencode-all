# Internal Security Roles, Agent Bindings & Operational Guidance

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code | Session: az3tby | Date: 03.07.2026 | Changes: Initial creation — a repo audit found DWS_ROLES_REGISTRY.md's R01-R26 scheme is customer-facing only (buyer-persona taxonomy), and DWS_SECURITY_STANDARD.md's control-owner column uses generic function labels (Security/Engineering/Compliance) with no accountable identity or supporting automation. This document fixes that gap.

Document Status:

- Created: 03.07.2026
- Last Modified: 03.07.2026
- Language: English
- Publication Status: ACTIVE

---

## Scope and honesty note

Lifetime Oy is currently a single-operator company (CEO Risto Paarni — see CLAUDE.md Legal Identity Rule). The "roles" below are **functional roles**, not job titles for distinct employees. Today, one person holds all of them. The point of naming them separately is:

1. So that when the team grows, each role has a pre-defined scope to hand to a new hire or contractor without re-deriving it.
2. So that automation (agents, cron, CI) has a clear "who does this serve" anchor instead of floating unowned.
3. So that `DWS_SECURITY_STANDARD.md`'s generic `Security` / `Engineering` / `Compliance` owner labels resolve to something concrete.

Do not read this document as claiming a security team exists. It doesn't yet. That is itself accurate information a reader of this doc should have.

## Roles

### 1. Vulnerability & Patch Owner

**Accountable:** Engineering (currently Risto Paarni)
**Scope:** Dependency and code-scan findings (Dependabot alerts, `npm audit`, `scan_critical_bugs.py`) are triaged against a fixed SLA and remediated or explicitly accepted as risk.
**Supported by:** `Aegis` agent (`src/agents/aegis.agent.ts`) — classifies findings by severity/SLA and flags breaches. `.github/dependabot.yml` (version-update PRs) and `scripts/weekly/security-audit.sh` (scanner + `gh issue` surfacing) feed it data.
**SLA:** critical 2 days, high 7 days, moderate 30 days, low 90 days (matches Aegis's `SLA_DAYS` constant — update both together if this changes).
**Cadence:** Weekly, via `scripts/weekly/security-audit.sh`'s Sunday 04:00 UTC run; reactively whenever a `weekly-scan`-labeled GitHub issue is created.

### 2. Business-Critical Systems Custodian

**Accountable:** Engineering (currently Risto Paarni)
**Scope:** Keep `docs/BUSINESS_CRITICAL_SYSTEMS.md` accurate — add new systems when `CLAUDE.md`'s "Repository Focus Areas" changes, re-rate criticality when usage changes, retire entries when a system is decommissioned.
**Supported by:** `Vesta` agent (`src/agents/vesta.agent.ts`) — queryable registry lookup + `stale-check` (flags entries not reviewed in 180+ days).
**Cadence:** On every infrastructure change; `stale-check` run at minimum quarterly.

### 3. Vendor / IT Service Provider Risk Reviewer

**Accountable:** Engineering (currently Risto Paarni)
**Scope:** Assess cybersecurity risk of IT service providers and outsourced IT (Supabase, Aiven, Cloudflare, Stripe, AWS SES, DGX Spark hosting) — not just at onboarding, but on a recurring cadence.
**Supported by:** No agent. This is deliberately **not automated** — per CLAUDE.md Rule 5 ("use the model only for judgment calls... not routing"), assessing a vendor's actual security posture, contract terms, and compliance certifications is a human judgment call that draws on `DWS_SOVEREIGNTY_STANDARD.md` and `DWS_SECURITY_STANDARD.md`, not a classification an agent can execute end-to-end.
**Current state (honest assessment, 2026-07-03):** Real, substantive vendor assessments exist (Aiven vs. Supabase CLOUD Act analysis, Shufti Pro DPA review) but are triggered ad hoc by specific decisions, not run on a schedule. **This is a genuine, unresolved gap** — this document defines the role and cadence target below, but does not claim the cadence is already happening.
**Cadence target (not yet met):** Annual review of each Critical/High system in `docs/BUSINESS_CRITICAL_SYSTEMS.md`'s vendor dependencies.

### 4. Security Incident Commander

**Accountable:** Security (currently Risto Paarni)
**Scope:** Coordinate response to a `Tietoturvapoikkeama` (security incident, per `docs/SECURITY_GLOSSARY.md`) — triage, contain, document root cause, decide disclosure.
**Supported by:** `Themis` agent (`src/agents/themis.agent.ts`) — already the case coordinator that dispatches `Chronos` (deadlines, e.g. NIS2 breach-notification windows), `Auditor` (audit trail), and `Mnemosyne` (memory/history) by case type. No new agent was built for this — Themis already covers the coordination pattern; it did not need duplicating.
**Current state:** This is the **strongest-evidenced practice** found in the audit — real, resolved incident postmortems exist (e.g. `docs/field-notes/2026-04-13-security-incident-partners-stub-overwrite.md`). The gap was not response quality, it was that no document named who plays this role. Fixed here.

### 5. Security Roles & Policy Owner

**Accountable:** Security (currently Risto Paarni)
**Scope:** Owns this document and keeps `DWS_SECURITY_STANDARD.md`'s control-owner table pointing at real, current role assignments rather than floating labels.
**Cadence:** Review whenever a new role is added here, or the team grows.

### 6. Security Training Coordinator

**Accountable:** Security (currently Risto Paarni)
**Scope:** Owns `docs/SECURITY_TRAINING_PROGRAM_SKELETON.md` — schedules and delivers the training cadence defined there.
**Supported by:** No agent — training delivery to humans is inherently a human function. `docs/coaching/` curricula are a _client-facing_ product, not this program; do not conflate the two.

## Operational guidance

**When a Dependabot/scan finding lands:**

1. `scripts/weekly/security-audit.sh` (Sunday 04:00 UTC) or `.github/dependabot.yml`'s weekly PRs surface it.
2. The Vulnerability & Patch Owner triages via Aegis's SLA classification.
3. Critical/high breaches get fixed or explicitly risk-accepted within SLA — not silently aged out.

**When a new system is added to the stack:**

1. The Business-Critical Systems Custodian adds it to `docs/BUSINESS_CRITICAL_SYSTEMS.md` and Vesta's registry in the same change.
2. If it's a new IT service provider (not just internal code), the Vendor Risk Reviewer scope now includes it.

**When something goes wrong (incident):**

1. The Security Incident Commander role activates — coordinate via Themis (`/case-run` skill), not ad hoc.
2. Root cause + resolution get documented in `docs/field-notes/` per existing convention (this practice already works — don't change it).

**Quarterly:**

1. Run Vesta's `stale-check`.
2. Vendor Risk Reviewer picks one Critical-tier vendor from `docs/BUSINESS_CRITICAL_SYSTEMS.md` for a real review (not a rubber stamp — see `DWS_SOVEREIGNTY_STANDARD.md` for the depth expected).

## Cross-references

- `docs/BUSINESS_CRITICAL_SYSTEMS.md` — the systems inventory these roles operate over.
- `docs/SECURITY_TRAINING_PROGRAM_SKELETON.md` — the Security Training Coordinator's scope.
- `DWS_SECURITY_STANDARD.md` — control-level owner table this document gives identity to.
- `AI_AGENT_GUIDELINES.md` — the BaseAgent contract Aegis and Vesta implement.
- `Cron-works.md` — the automation schedule Aegis/Vesta's data sources run on.
