# Admin Dashboard Authorization Issues Discovered

## VERSION AND AGENT HISTORY

---

Version: 1.0
Tool: Claude Code
Agent: Claude Haiku 4.5
Date: 2026-09-13
Changes: Documented auth flow issues found during hub_admin implementation

---

## Author

Claude Haiku 4.5 (AI Agent)

## Context

Implemented hub_admin role routing for admin@dws6.com to access Dashboard Hub. Testing revealed multiple interconnected authorization failures preventing admin access to linked dashboards (Mission Control, Control Room, Situation Room).

## The Story

**Phase 1: Initial Implementation** ✅

- Added `hub_admin` role to supabase-config.js
- Created User Management Console
- Modified login to route admin@dws6.com to hub_admin role
- Added admin links to Dashboard Hub

**Phase 2: Authorization Testing** ❌
Discovered the admin dashboard links lead to access-denied pages:

1. **Mission Control**: requireHicAuth() gate only allows `risto.paarni2024@lifetime.fi` email
2. **Control Room**: Role check only allows `control_room` or `backoffice_admin`, not `hub_admin`
3. **Situation Room**: Role check only allows `situation_room` or `backoffice_admin`, not `hub_admin`
4. **Email Case-Sensitivity**: Login checks `admin@dws6.com` but not `admin@DWS6.COM` or with spaces
5. **OAuth Failures**: Google/Microsoft OAuth buttons hardcode `dws_iq_standard` role, bypassing hub_admin assignment

## Issues Identified

### Critical (Blocking admin access)

- [ ] Mission Control: Update `requireHicAuth()` to accept `hub_admin` role (line 317 in mission-control.js)
- [ ] Control Room: Add `hub_admin` to role allowlist (line 59)
- [ ] Situation Room: Add `hub_admin` to role allowlist (line 50)
- [ ] Email Normalization: Use `.trim().toLowerCase()` on email before comparison (login handler)
- [ ] OAuth Role Assignment: Move role determination to callback/session path, not post-login

### Medium (Standards & Consistency)

- [ ] File Changes in Mirror: Landing-pages changes will be overwritten by sync workflow
  - Solution: Update SOURCE files in `dws6.com/` not `landing-pages/dws6-com/`
  - Files need sync: supabase-config.js, login/dws-iq/index.html, dashboard/index.html, admin dashboards
- [ ] Document Headers: USER_MANAGEMENT_CONSOLE_DUTIES.md needs VERSION AND AGENT HISTORY header ✅ FIXED
- [ ] Field Note Format: Must follow required structure (Author, Context, Story, Insight, Next Steps)

### Low (Auth Flow Architecture)

- [ ] Async/Promise Handling: OAuth flow returns Promise, can't synchronously read user.data
  - Current code: `const user = client.auth.getUser()` (Promise, not awaited)
  - Should: Move to `await getCurrentUser()` in callback handler
- [ ] Role Assignment Timing: Post-login role assignment can't run before OAuth redirect

## Ontology Tags

- auth-flow, authorization-gate, oauth, role-based-access, email-normalization, mirror-sync, standards-compliance

## The Insight

The hub_admin role was created but not connected through the auth gates that guard the dashboards it's meant to access. Additionally, the OAuth path and email normalization weren't updated to recognize admin@dws6.com, creating multiple parallel access failures. The landing-pages mirror complexity adds overhead—fixes applied there get erased by the next sync, requiring changes to the source-of-truth in dws6.com/.

## Next Steps

### Immediate (Unblock admin@dws6.com)

1. **Update Mission Control**: Modify requireHicAuth() to accept hub_admin role via getUserRole parameter
2. **Update Control Room**: Add 'hub_admin' to role check allowlist
3. **Update Situation Room**: Add 'hub_admin' to role check allowlist
4. **Fix Email Matching**: Normalize emails with `.toLowerCase().trim()`
5. **Fix OAuth**: Pass null as default role, let callback/session determine role from email

### Follow-up (Sync & Standards)

1. Apply all auth fixes to SOURCE files in `dws6.com/`
2. Let sync workflow propagate to landing-pages mirror
3. Create proper field note following required format
4. Add integration test: admin@dws6.com can access all advertised dashboards

### Refactor (Architecture)

1. Move role assignment from login button to auth callback handler
2. Implement async-safe getCurrentUser() in all OAuth flows
3. Document the auth flow architecture (where role assignment happens at each step)
4. Add email normalization utility function

## Status

**PENDING_REVIEW** — Awaiting HIC decision on implementation priority

Estimated effort:

- Auth fixes: 1-2 hours (straightforward allowlist updates)
- OAuth refactor: 2-3 hours (async flow changes)
- Testing: 1 hour
