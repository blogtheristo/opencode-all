---
name: pr-2016-copilot-security-blocking
description: Copilot handoff - PR #2016 blocked on critical security vulnerabilities
metadata:
  type: reference
---

# Copilot Handoff: PR #2016 — CRITICAL SECURITY BLOCKING

**PR:** #2016 — `fix: enforce server-owned dashboard authorization`  
**Status:** ❌ **BLOCKING** — Security review required  
**Date:** 2026-09-13

---

## Summary

PR #2016 has critical security vulnerabilities discovered during code review. **Do not merge.** Five issues require fixes + regression tests.

---

## Critical Vulnerabilities (5 Total)

### 1. Incomplete RPC Gate Coverage (CRITICAL)

**Location:** `dws6.com/functions/dashboard/_middleware.js` lines 271-282

**Issue:**

- Only 4 dashboard sections gate with RPC: `admin`, `control-room`, `situation-room`, `mission-control`
- Other privileged sections (`backoffice`, `mcp-hub`, etc.) fall through to token-only validation
- Client-side role check then uses browser-writable `user_metadata.role`
- **Attack:** Signed-in user spoofs their role in DevTools, gains unauthorized access

**Fix:**

```javascript
const PRIVILEGED_SECTIONS = new Set([
  "admin",
  "control-room",
  "situation-room",
  "mission-control",
  "backoffice",
  "mcp-hub", // ... all other protected sections
]);

if (PRIVILEGED_SECTIONS.has(section)) {
  const [hubAdmin, backofficeAdmin] = await Promise.all([
    callAuthorizationRpc("is_hub_admin", token, env),
    callAuthorizationRpc("is_backoffice_admin", token, env),
  ]);
  const allowed = hubAdmin || backofficeAdmin;
  if (!allowed) return unauthorizedPage(403, "...");
}
```

---

### 2. Client-Side Role Reading from Browser Metadata (CRITICAL)

**Location:** `dws6.com/shared/js/supabase-client.js` (getUserRole function)

**Issue:**

```javascript
export async function getUserRole() {
  const user = await getCurrentUser();
  if (!user || !user.user_metadata) return null;

  return user.user_metadata.role || null; // ⚠️ BROWSER-WRITABLE!
}
```

- User can modify browser DevTools to change `user_metadata.role`
- Client-side `requireRole()` then passes spoofed role
- Bypasses authorization checks

**Fix:**

- Remove client-side role reading entirely
- Rely on server-side RPC gates in middleware (Issue 1 fix above)
- Make `getUserRole()` throw error if called

---

### 3. Unbounded HTML User Input Rendering (HIGH)

**Location:** `dws6.com/functions/dashboard/_middleware.js` lines 110-111, 171-182

**Issue:**

- Form fields accept up to 3,000 chars each
- Rendered in HTML without truncation or escaping
- 3,000 chars × 15 fields = 45KB+ potential bloat
- Unescaped HTML risks XSS

**Fix:**

```javascript
function escapeHtml(text) {
  return (text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

function displayField(value, maxLength = 200) {
  const escaped = escapeHtml(value || "");
  const truncated = escaped.length > maxLength ? escaped.slice(0, maxLength) + "…" : escaped;
  return truncated;
}
```

---

### 4. Missing Email Classification Backfill (HIGH)

**Location:** `supabase/migrations/088_web_lead_email_classification.sql`

**Issue:**

- Migration adds `email_classification` column with DEFAULT 'unknown'
- Trigger only fires on INSERT or UPDATE
- Existing rows remain unclassified
- Morning briefing logic breaks for already-queued leads

**Fix:**
Add backfill after trigger creation in migration:

```sql
UPDATE web_leads
SET email_classification = (
  CASE
    WHEN email ~ '@(mailinator|guerrillamail|10minutemail|...)\.com$' THEN 'disposable'
    WHEN email ~ '@(gmail|yahoo|outlook|...)\.com$' THEN 'free_provider'
    ELSE 'business'
  END
)
WHERE email_classification IS NULL OR email_classification = 'unknown';
```

---

### 5. Unbounded Plain-Text Briefing Rendering (HIGH)

**Location:** `dws6.com/functions/dashboard/_middleware.js` lines 171-182

**Issue:**

- Briefing details include full user-submitted fields (no truncation)
- 3,000-char message bloats digest
- Arbitrary-looking extra lines can mislead operators parsing briefing

**Fix:**
Apply same truncation to briefing as to HTML:

```javascript
const details = [
  `Job title: ${displayField(fields.jobTitle, 200)}`,
  `Use case: ${displayField(fields.useCase, 300)}`,
  `Message: ${displayField(fields.message, 200)}`,
  // ...
].join("\n");
```

---

## Fix Checklist

- [ ] **Middleware:** Extend PRIVILEGED_SECTIONS to include all protected dashboard routes
- [ ] **Middleware:** Apply RPC gate (is_hub_admin/is_backoffice_admin) before `next()` for ALL privileged sections
- [ ] **Supabase Client:** Remove `getUserRole()` or make it throw error (role validation server-side only)
- [ ] **Auth Handler:** Remove stale template references to `${role}`
- [ ] **Demo Form Handler:** Escape all user inputs for HTML context
- [ ] **Demo Form Handler:** Truncate HTML display fields (200-300 chars)
- [ ] **Demo Form Handler:** Truncate plain-text briefing fields (200 chars)
- [ ] **Migration 088:** Add email classification backfill for existing rows
- [ ] **Tests:** Add regression tests for each privileged section RPC gate
- [ ] **Tests:** Add XSS tests (injection attempts)
- [ ] **Tests:** Add DoS tests (3,000-char field rendering)
- [ ] **Tests:** Verify email classification backfill on all existing rows

---

## Process

1. Apply all fixes to code + migrations
2. Add regression + security tests
3. Re-run CI locally and GitHub (should show green)
4. Only merge once all tests pass

---

## References

**Complete documentation:** `SECURITY_PATCH_PR2016.md`

**OWASP Top 10:**

- A01:2021 Broken Access Control (Issue 1, 2)
- A03:2021 Injection / XSS (Issue 3, 5)
- A04:2021 Insecure Design / DoS (Issue 3, 5)

---

**Copilot: Security review blocking. Do not merge until all 5 issues fixed and tests pass. See SECURITY_PATCH_PR2016.md for complete details.**
