---
name: security-patch-pr-2016
description: Critical security fixes required for PR #2016 dashboard authorization
metadata:
  type: reference
---

# CRITICAL Security Fixes Required — PR #2016

**Status:** BLOCKING — Do not merge until fixed  
**Severity:** HIGH (Authorization bypass + XSS/DoS)  
**Date:** 2026-09-13

---

## Issues Found

### Issue 1: Incomplete RPC Gate Coverage (CRITICAL)

**File:** `dws6.com/functions/dashboard/_middleware.js` (lines 4, 271-282)

**Vulnerability:**

- Only 4 sections gate with RPC: `admin`, `control-room`, `situation-room`, `mission-control`
- Other privileged routes (`backoffice`, `mcp-hub`, etc.) fall through to token-only validation
- Client then uses `requireRole()` which reads browser-writable `user_metadata.role`
- **Attack:** Signed-in user spoofs role in browser, gains unauthorized access

**Fix Required:**

1. Identify ALL privileged dashboard sections
2. Gate each with server-side RPC before `next()` (line 284)
3. Do not rely on client-side role checks for authorization

**Pseudo-code:**

```javascript
const PRIVILEGED_SECTIONS = new Set([
  "admin",
  "control-room",
  "situation-room",
  "mission-control",
  "backoffice",
  "mcp-hub", // ... all other privileged sections
]);

if (PRIVILEGED_SECTIONS.has(section)) {
  const authorized = await callAuthorizationRpc("is_hub_admin", token, env);
  if (!authorized) return unauthorizedPage(403, "...");
}
```

---

### Issue 2: Client-Side Role Reading (CRITICAL)

**File:** `dws6.com/shared/js/supabase-client.js` (getUserRole function)

**Vulnerability:**

```javascript
export async function getUserRole() {
  const user = await getCurrentUser();
  if (!user || !user.user_metadata) return null;

  return user.user_metadata.role || null; // ⚠️ BROWSER-WRITABLE!
}
```

**Attack:** User modifies browser DevTools to change `user.user_metadata.role` and call `requireRole()` to bypass checks.

**Fix Required:**

1. Do NOT read role from client-side metadata
2. Replace with server-side RPC call if role check needed on client
3. Or better: Remove client-side role checks entirely (rely on middleware)

**Recommended:**

```javascript
export async function getUserRole() {
  // REMOVED: role is authorization-critical and must come from server only
  // Use server-side RPC (callAuthorizationRpc) in middleware, not client-side checks
  throw new Error("getUserRole() is deprecated — use server-side RPC checks in middleware");
}
```

---

### Issue 3: Unbounded User Input Rendering (HIGH)

**File:** `dws6.com/functions/dashboard/_middleware.js` (lines 110-111, 171-182)

**Vulnerability:**

- Demo form accepts up to 3,000 chars per field (e.g., "message")
- No truncation on rendering in briefing (line 182: `\`Additional context: ${fields.message || '(none)'}\``)
- User can expand HTML without bounds, crowding out rest of report
- Unescaped content risks XSS

**Attack Scenarios:**

1. **DoS:** Submit 3,000-char message × 15 fields = 45K+ chars in briefing
2. **XSS:** If briefing is rendered in HTML context without escaping

**Fix Required:**

1. Escape all user input for HTML context
2. Truncate display to bounded length (e.g., 200 chars per field)
3. Add ellipsis indicator if truncated

**Pseudo-code:**

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

// Usage:
const details = [
  `Job title: ${displayField(fields.jobTitle)}`,
  `Use case: ${displayField(fields.useCase, 300)}`,
  // ...
].join("\n");
```

---

## Template Reference Issue

**File:** `dws6.com/shared/js/auth-handler.js` (line 63, template rendering)

**Issue:** Template may reference `${role}` which will be undefined when client-side role reading is removed.

**Search for:** All template instances that reference role  
**Replace with:** Remove role from client-side rendering; let server-side authorization prevent access

---

### Issue 4: Missing Email Classification Backfill (HIGH)

**File:** `supabase/migrations/088_web_lead_email_classification.sql`

**Vulnerability:**

- Migration adds `email_classification` column with DEFAULT 'unknown'
- Trigger `on INSERT OR UPDATE` only affects new leads
- Existing rows remain unclassified ('unknown')
- Morning briefing relies on classification; unflagged leads break routing logic

**Attack/Impact:**

- Already-queued leads (from previous days) never receive classification
- Free/disposable leads remain unflagged, mixed with business leads
- Briefing logic can't properly filter or route

**Fix Required:**

1. Add one-time backfill after trigger creation
2. Classify existing rows based on email domain
3. Run during migration, not as separate job

**Pseudo-code:**

```sql
-- Add trigger (existing in 088)
-- ...

-- Backfill existing rows
UPDATE web_leads
SET email_classification = (
  CASE
    WHEN email ~ '@(mailinator|guerrillamail|10minutemail|tempmail|yopmail|...)\.com$' THEN 'disposable'
    WHEN email ~ '@(gmail|yahoo|outlook|hotmail|live|...)\.com$' THEN 'free_provider'
    ELSE 'business'
  END
)
WHERE email_classification = 'unknown' OR email_classification IS NULL;
```

---

### Issue 5: Unbounded Plain-Text Briefing Rendering (HIGH)

**File:** `dws6.com/functions/dashboard/_middleware.js` (lines 171-182)

**Vulnerability:**

- Briefing details include full user-submitted fields (line 182)
- No truncation in plain-text output sent to Supabase
- A 3,000-char message × 15 fields can bloat digest by 45KB+
- Arbitrary-looking extra lines can mislead operators parsing briefing

**Attack/Impact:**

- DoS: Fill digest with noise, crowd out other leads
- Operator confusion: Malicious lead text looks like system metadata

**Fix Required:**

1. Apply same truncation/escaping to briefing details as to HTML
2. Use bounded preview (e.g., 200 chars + ellipsis)
3. Escape special characters in plain text

**Pseudo-code:**

```javascript
function briefingField(value, maxLength = 200) {
  const clean = (value || "").trim();
  const truncated = clean.length > maxLength ? clean.slice(0, maxLength) + "..." : clean;
  return truncated;
}

const details = [
  `Job title: ${briefingField(fields.jobTitle)}`,
  `Use case: ${briefingField(fields.useCase, 300)}`,
  `Message: ${briefingField(fields.message, 200)}`,
  // ...
].join("\n");
```

---

## Fix Checklist

- [ ] **Middleware:** Extend PRIVILEGED_SECTIONS to include all protected routes
- [ ] **Middleware:** Apply RPC gate to every privileged section
- [ ] **Supabase Client:** Remove browser-writable role reading from `getUserRole()`
- [ ] **Demo Form Handler (HTML):** Escape all user inputs for HTML context
- [ ] **Demo Form Handler (HTML):** Truncate display fields to bounded length (200-300 chars)
- [ ] **Demo Form Handler (Briefing):** Apply same truncation/escaping to plain-text briefing
- [ ] **Migration 088:** Add backfill for existing rows to classify emails (after trigger)
- [ ] **Auth Handler:** Remove stale template references to `${role}`
- [ ] **Tests:** Add regression tests for each privileged section RPC gate
- [ ] **Tests:** Add XSS/DoS tests for form field truncation/escaping
- [ ] **Tests:** Verify email classification backfill covers all existing rows

---

## Testing Strategy

### Authorization Bypass Tests

```
Test: POST to /dashboard/backoffice/ with valid token but spoofed role
Expected: 403 Unauthorized (server-side RPC denies)
```

### XSS Prevention Tests

```
Test: Submit form with message = "<img src=x onerror='alert(1)'>"
Expected: Rendered as escaped HTML (no alert)
```

### DoS Prevention Tests

```
Test: Submit 3,000-char message fields
Expected: Rendered as truncated (e.g., 200 chars + ellipsis)
```

---

## Impact on PR #2016

**Current Status:** Ready for merge (all CI passing)  
**After Fix:** Must re-run CI to validate authorization regression tests

**Timeline:**

1. Apply fixes to middleware + client code
2. Add regression tests
3. Re-run CI
4. Merge only after all tests passing

---

## References

- OWASP Top 10: A01:2021 Broken Access Control
- OWASP Top 10: A03:2021 Injection (XSS)
- OWASP Top 10: A04:2021 Insecure Design (DoS)
- CWE-269: Improper Access Control
- CWE-79: Cross-site Scripting

---

**Status:** Awaiting security patch implementation before PR #2016 merge.
