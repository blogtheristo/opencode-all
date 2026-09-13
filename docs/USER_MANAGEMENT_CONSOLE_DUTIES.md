# User Management Console Duties

## VERSION AND AGENT HISTORY

---

Version: 1.0
Tool: Claude Code
Agent: Claude Haiku 4.5
Date: 2026-09-13
Changes: Initial definition of user management console functions, role matrix, and implementation phases

---

## Console Functions

The User Management Console must support these duties:

### 1. User Listing & Search

- [ ] Display all users in the system
- [ ] Filter users by email
- [ ] Filter users by role
- [ ] Search by name or organization
- [ ] Pagination for large user lists
- [ ] Show last login timestamp
- [ ] Show account creation date
- [ ] Show current role(s)

### 2. Role Assignment & Management

- [ ] Assign single role to user
- [ ] Support multiple roles per user
- [ ] Change existing role
- [ ] Remove role from user
- [ ] Set primary role
- [ ] View all available roles

### 3. User Account Management

- [ ] Enable/disable user account
- [ ] Force password reset
- [ ] Unlock locked accounts (after failed login attempts)
- [ ] View MFA status
- [ ] Enable/require MFA
- [ ] View last activity
- [ ] View login history

### 4. Permissions & Access Control

- [ ] Grant specific feature access
- [ ] Revoke feature access
- [ ] Set API key access level
- [ ] View audit log for user actions

### 5. Organization Management

- [ ] Assign user to organization
- [ ] View organization membership
- [ ] Bulk actions on organization members

### 6. Bulk Operations

- [ ] Bulk role assignment
- [ ] Bulk enable/disable
- [ ] Export user list
- [ ] Import users (CSV)

---

## Roles in System

| Role                  | Display Name                    | Access Level | Primary Purpose                          |
| --------------------- | ------------------------------- | ------------ | ---------------------------------------- |
| **hub_admin**         | Platform Administrator (Hub)    | Full         | Full platform access, manage all systems |
| **backoffice_admin**  | Back-Office Administrator       | High         | Operations, container status, briefing   |
| **dws_iq_standard**   | DWS IQ 6 Platform               | Medium       | Construction intelligence platform       |
| **dws_iq_mobile**     | DWS IQ Mobile (V7)              | Medium       | Mobile construction intelligence         |
| **api_developer**     | API Developer                   | Medium       | API access for integrations              |
| **mcp_admin**         | MCP Hub Administrator           | High         | MCP server management                    |
| **store_viewer**      | Store Manager                   | Medium       | Firehorse Store management               |
| **community_user**    | OneLifetime Community           | Low          | Community platform access                |
| **lifetime_model**    | LifetimeWorld Model (Vertex AI) | Medium       | AI model access                          |
| **enterprise_client** | Enterprise Client               | Medium       | Enterprise features                      |
| **enterprise_model**  | Enterprise Model (Vertex AI)    | Medium       | Enterprise AI features                   |
| **watsonx_user**      | IBM watsonx.ai                  | Medium       | IBM AI platform                          |
| **investor_lobby**    | Investor Lobby (Confidential)   | High         | Confidential investor materials          |
| **construction_free** | Construction Lobby (FREE)       | Low          | Free tier construction platform          |
| **control_room**      | Control Room Operator           | High         | Operations control room                  |
| **situation_room**    | Situation Room Analyst          | High         | Strategic situation analysis             |

---

## Dashboard Features

### Admin Dashboard Checks

- Only hub_admin or backoffice_admin can access
- View container status
- Send morning briefs
- Access all admin functions

### User Details View

- Full user profile
- Current roles and permissions
- Login history
- Last activity
- Organization info
- MFA configuration

### Audit Trail

- Track all role changes
- Track user enable/disable actions
- Track API key changes
- View who made the change and when
- Export audit log

---

## Implementation Priority

### Phase 1 (MVP)

- User list with search/filter
- View user details
- Assign/change primary role
- Enable/disable user account

### Phase 2

- Multiple roles per user
- Role-specific permissions
- Bulk operations
- Audit trail

### Phase 3

- CSV import/export
- Organization management
- API key management
- Advanced filtering

---

## Database Schema Extensions

```sql
-- Roles table (extends auth.users metadata)
CREATE TABLE public.user_roles (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  assigned_by UUID REFERENCES auth.users(id),
  assigned_at TIMESTAMP DEFAULT now(),
  is_primary BOOLEAN DEFAULT FALSE
);

-- User audit log
CREATE TABLE public.user_audit_log (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  changes JSONB,
  changed_by UUID REFERENCES auth.users(id),
  changed_at TIMESTAMP DEFAULT now()
);
```
