# 2026-09-19 — Auth leaked-password protection

# VERSION AND AGENT HISTORY

---

Version: 1.0 [Latest]

Sessions & Modifications:

- Version: 1.0 [Latest] | Tool: Cursor Grok 4.6 | Session: cursor/supabase-advisor-warnings-3f7a | Date: 19.09.2026 | Changes: HIC item 5 — require Supabase leaked-password protection. Dashboard only. 088 not applied.

Document Status:

- Created: 19.09.2026
- Last Modified: 19.09.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE
- Status: PENDING_HIC_TOGGLE

---

**Standards loaded:** DWS_SECURITY_STANDARD.md §16.0.2, DWS_DOCUMENT_STANDARD.md, DWS_TRUTH_STANDARD.md, DWS_ROLES_REGISTRY.md.

Advisor dump 2026-09-19T00:51:14Z: `auth_leaked_password_protection` reported off.

## Decision

HIC approved 19.09.2026: enable leaked-password protection on the production Auth project (and any other DWS Auth project that uses email sign-in).

## What this is not

- Not SQL. Not `088_190926_advisor_security_linter.sql`.
- Not a repo secret or Management API call from this agent.

## HIC toggle (Studio)

1. Open the production Supabase project.
2. Authentication → Providers → Email.
3. Enable **Leaked password protection**.
4. Save. Re-run Auth advisor; the lint should clear.
5. Reply on the PR with public project ref + date enabled.

Weekly reminder: `scripts/weekly/auth-security-audit.sh` prints this checklist; git cannot see Studio state.

N/A — KB / Learn / Drive / calendar.
