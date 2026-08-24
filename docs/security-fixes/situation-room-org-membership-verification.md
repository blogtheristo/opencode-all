# Security Fix: Situation Room Routes Organization Membership Verification

**Date:** 2026-02-18  
**Issue:** #503 Review Comment #2820235436  
**Pull Request:** copilot/sub-pr-503-again

## Problem

The situation room routes (`src/routes/situation-room.routes.ts`) were using the Supabase service client, which bypasses Row Level Security (RLS) policies. This created a security vulnerability where any authenticated user could query situation room reports for ANY organization by simply providing a different `org_id` parameter.

### Vulnerable Endpoints

1. `GET /api/situation-room/reports` - List reports by org_id
2. `GET /api/situation-room/reports/:id` - Get single report
3. `PATCH /api/situation-room/reports/:id` - Update report
4. `POST /api/situation-room/reports` - Create report

### Attack Scenario

```javascript
// Attacker is user-123, belongs to org-456
// But could access org-999's reports like this:
GET /api/situation-room/reports?org_id=org-999

// Without verification, the service client would return all reports for org-999
```

## Solution

Added organization membership verification to all endpoints before executing queries.

### Implementation

1. **Added Helper Function** (`verifyUserOrgMembership`)
   - Queries `organization_members` table
   - Verifies user has `status = 'active'` membership
   - Returns boolean indicating membership

2. **Updated All Endpoints**
   - Extract `userId` from JWT token (via `authenticateToken` middleware)
   - Call `verifyUserOrgMembership(userId, org_id)` before data access
   - Return `403 Forbidden` if user is not a member
   - Only proceed with query if membership verified

### Code Example

```typescript
// Before (vulnerable):
const { data, error } = await supabase
  .from('situation_room_reports')
  .select('*')
  .eq('org_id', req.query.org_id)  // No verification!
  .order('created_at', { ascending: false });

// After (secure):
const isMember = await verifyUserOrgMembership(req.userId, orgId);
if (!isMember) {
  return res.status(403).json({ 
    error: 'Forbidden', 
    message: 'You are not authorized to view reports for this organization' 
  });
}

const { data, error } = await supabase
  .from('situation_room_reports')
  .select('*')
  .eq('org_id', orgId)  // Only after verification
  .order('created_at', { ascending: false });
```

## Testing

Created comprehensive test suite in `src/__tests__/situation-room-security.test.ts`:

- ✅ Verifies membership check logic
- ✅ Tests cross-organization access prevention
- ✅ Tests all CRUD operations (GET, POST, PATCH)
- ✅ Simulates attack scenarios

All 10 tests passing.

## Alternative Solutions Considered

### Option 1: Use User-Scoped Supabase Client
Instead of service client, create a client per-request using the user's JWT token. This would automatically enforce RLS policies.

**Pros:**
- Simpler code (no manual checks needed)
- RLS policies centralized in database

**Cons:**
- Performance overhead (new client per request)
- Requires passing user JWT to backend
- Less explicit security (relies on database policies)

### Option 2: Middleware-Based Verification
Create an Express middleware that verifies org membership before route handler executes.

**Pros:**
- Reusable across routes
- Cleaner route handlers

**Cons:**
- Less flexible (harder to customize per-route)
- Requires standardized parameter extraction

**Decision:** Chose inline verification for clarity and explicitness. Each route's security logic is visible and auditable.

## Impact

- **Security:** Fixes critical authorization vulnerability
- **Performance:** Adds one additional database query per request (negligible)
- **Breaking Changes:** None - API remains the same
- **User Experience:** Unauthorized users now receive clear 403 error messages

## Related Files

- `src/routes/situation-room.routes.ts` - Route implementation
- `src/__tests__/situation-room-security.test.ts` - Security tests
- `supabase/migrations/007_auth_users_orgs.sql` - Organization members table
- `supabase/migrations/028_bim_pipeline.sql` - Situation room reports table

## References

- Original PR: #503
- Review Comment: https://github.com/blogtheristo/dws6/pull/503#discussion_r2820235436
- Security Standard: `DWS_SECURITY_STANDARD.md`
