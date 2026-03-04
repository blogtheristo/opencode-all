-- DWS IQ 6 Authentication: Users, Organizations, and RBAC
-- Migration for complete auth system with multi-tenant support

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- USER PROFILES TABLE
-- Extended user data beyond Supabase auth.users
-- ============================================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  first_name text,
  last_name text,
  display_name text,
  avatar_url text,
  phone text,
  timezone text DEFAULT 'Europe/Helsinki',
  locale text DEFAULT 'en',
  email_verified boolean DEFAULT false,
  mfa_enabled boolean DEFAULT false,
  status text DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending', 'deleted')),
  last_login_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes for user_profiles
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_profiles_status ON user_profiles(status);

-- ============================================================
-- ORGANIZATIONS TABLE
-- Multi-tenant organization support
-- ============================================================
CREATE TABLE IF NOT EXISTS organizations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  logo_url text,
  website text,
  plan_tier text DEFAULT 'free' CHECK (plan_tier IN ('free', 'starter', 'professional', 'enterprise')),
  plan_expires_at timestamptz,
  settings jsonb DEFAULT '{}'::jsonb,
  billing_email text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'trial', 'cancelled')),
  created_by uuid REFERENCES user_profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes for organizations
CREATE INDEX idx_organizations_slug ON organizations(slug);
CREATE INDEX idx_organizations_status ON organizations(status);
CREATE INDEX idx_organizations_plan ON organizations(plan_tier);

-- ============================================================
-- ORGANIZATION MEMBERS TABLE
-- Maps users to organizations with roles
-- ============================================================
CREATE TABLE IF NOT EXISTS organization_members (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  permissions jsonb DEFAULT '[]'::jsonb,
  invited_by uuid REFERENCES user_profiles(id),
  invited_at timestamptz,
  joined_at timestamptz DEFAULT now(),
  status text DEFAULT 'active' CHECK (status IN ('active', 'invited', 'suspended', 'removed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(organization_id, user_id)
);

-- Indexes for organization_members
CREATE INDEX idx_org_members_org ON organization_members(organization_id);
CREATE INDEX idx_org_members_user ON organization_members(user_id);
CREATE INDEX idx_org_members_role ON organization_members(role);
CREATE INDEX idx_org_members_status ON organization_members(status);

-- ============================================================
-- USER SESSIONS TABLE
-- Track active sessions for security management
-- ============================================================
CREATE TABLE IF NOT EXISTS user_sessions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  session_token_hash text NOT NULL,
  refresh_token_hash text,
  device_info jsonb DEFAULT '{}'::jsonb,
  ip_address inet,
  user_agent text,
  location jsonb,
  is_current boolean DEFAULT false,
  last_active_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL,
  revoked_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Indexes for user_sessions
CREATE INDEX idx_user_sessions_user ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_expires ON user_sessions(expires_at);
CREATE INDEX idx_user_sessions_active ON user_sessions(user_id, revoked_at) WHERE revoked_at IS NULL;

-- ============================================================
-- MFA BACKUP CODES TABLE
-- Store encrypted backup codes for MFA recovery
-- ============================================================
CREATE TABLE IF NOT EXISTS mfa_backup_codes (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  code_hash text NOT NULL,
  used_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Index for mfa_backup_codes
CREATE INDEX idx_mfa_backup_user ON mfa_backup_codes(user_id);

-- ============================================================
-- ORGANIZATION INVITATIONS TABLE
-- Pending invitations to join organizations
-- ============================================================
CREATE TABLE IF NOT EXISTS organization_invitations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member', 'viewer')),
  token text UNIQUE NOT NULL,
  invited_by uuid REFERENCES user_profiles(id),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '7 days'),
  accepted_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(organization_id, email)
);

-- Index for organization_invitations
CREATE INDEX idx_org_invitations_email ON organization_invitations(email);
CREATE INDEX idx_org_invitations_token ON organization_invitations(token);

-- ============================================================
-- AUDIT LOG TABLE
-- Track security-relevant actions
-- ============================================================
CREATE TABLE IF NOT EXISTS auth_audit_log (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES user_profiles(id),
  action text NOT NULL,
  resource_type text,
  resource_id uuid,
  details jsonb DEFAULT '{}'::jsonb,
  ip_address inet,
  user_agent text,
  success boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Indexes for auth_audit_log
CREATE INDEX idx_audit_user ON auth_audit_log(user_id);
CREATE INDEX idx_audit_action ON auth_audit_log(action);
CREATE INDEX idx_audit_created ON auth_audit_log(created_at DESC);

-- ============================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE mfa_backup_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth_audit_log ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Service role has full access to user_profiles"
  ON user_profiles FOR ALL
  TO service_role
  USING (true);

-- Organizations Policies
CREATE POLICY "Users can view organizations they belong to"
  ON organizations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_members.organization_id = organizations.id
      AND organization_members.user_id = auth.uid()
      AND organization_members.status = 'active'
    )
  );

CREATE POLICY "Org admins can update their organization"
  ON organizations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_members.organization_id = organizations.id
      AND organization_members.user_id = auth.uid()
      AND organization_members.role IN ('owner', 'admin')
      AND organization_members.status = 'active'
    )
  );

CREATE POLICY "Authenticated users can create organizations"
  ON organizations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Service role has full access to organizations"
  ON organizations FOR ALL
  TO service_role
  USING (true);

-- Organization Members Policies
CREATE POLICY "Users can view members of their organizations"
  ON organization_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM organization_members AS om
      WHERE om.organization_id = organization_members.organization_id
      AND om.user_id = auth.uid()
      AND om.status = 'active'
    )
  );

CREATE POLICY "Org admins can manage members"
  ON organization_members FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM organization_members AS om
      WHERE om.organization_id = organization_members.organization_id
      AND om.user_id = auth.uid()
      AND om.role IN ('owner', 'admin')
      AND om.status = 'active'
    )
  );

CREATE POLICY "Service role has full access to organization_members"
  ON organization_members FOR ALL
  TO service_role
  USING (true);

-- User Sessions Policies
CREATE POLICY "Users can view own sessions"
  ON user_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can revoke own sessions"
  ON user_sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Service role has full access to user_sessions"
  ON user_sessions FOR ALL
  TO service_role
  USING (true);

-- MFA Backup Codes Policies
CREATE POLICY "Users can view own backup codes"
  ON mfa_backup_codes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role has full access to mfa_backup_codes"
  ON mfa_backup_codes FOR ALL
  TO service_role
  USING (true);

-- Organization Invitations Policies
CREATE POLICY "Users can view invitations sent to their email"
  ON organization_invitations FOR SELECT
  USING (
    email = (SELECT email FROM user_profiles WHERE id = auth.uid())
    OR EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_members.organization_id = organization_invitations.organization_id
      AND organization_members.user_id = auth.uid()
      AND organization_members.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Org admins can create invitations"
  ON organization_invitations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_members.organization_id = organization_invitations.organization_id
      AND organization_members.user_id = auth.uid()
      AND organization_members.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Service role has full access to organization_invitations"
  ON organization_invitations FOR ALL
  TO service_role
  USING (true);

-- Auth Audit Log Policies
CREATE POLICY "Users can view own audit logs"
  ON auth_audit_log FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role has full access to auth_audit_log"
  ON auth_audit_log FOR ALL
  TO service_role
  USING (true);

-- ============================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON organizations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_org_members_updated_at
  BEFORE UPDATE ON organization_members
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to create user profile on auth.users insert
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, first_name, last_name, email_verified)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.email_confirmed_at IS NOT NULL, false)
  );
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Function to log authentication events
CREATE OR REPLACE FUNCTION log_auth_event(
  p_user_id uuid,
  p_action text,
  p_details jsonb DEFAULT '{}'::jsonb,
  p_success boolean DEFAULT true
)
RETURNS uuid AS $$
DECLARE
  log_id uuid;
BEGIN
  INSERT INTO auth_audit_log (user_id, action, details, success)
  VALUES (p_user_id, p_action, p_details, p_success)
  RETURNING id INTO log_id;
  RETURN log_id;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Function to get user's organizations with roles
CREATE OR REPLACE FUNCTION get_user_organizations(p_user_id uuid)
RETURNS TABLE (
  organization_id uuid,
  organization_name text,
  organization_slug text,
  user_role text,
  plan_tier text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.id,
    o.name,
    o.slug,
    om.role,
    o.plan_tier
  FROM organizations o
  JOIN organization_members om ON o.id = om.organization_id
  WHERE om.user_id = p_user_id
  AND om.status = 'active'
  AND o.status = 'active';
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Function to check if user has role in organization
CREATE OR REPLACE FUNCTION user_has_org_role(
  p_user_id uuid,
  p_org_id uuid,
  p_roles text[]
)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM organization_members
    WHERE user_id = p_user_id
    AND organization_id = p_org_id
    AND role = ANY(p_roles)
    AND status = 'active'
  );
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- ============================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================

COMMENT ON TABLE user_profiles IS 'Extended user profile data linked to Supabase auth.users';
COMMENT ON TABLE organizations IS 'Multi-tenant organizations with subscription tiers';
COMMENT ON TABLE organization_members IS 'User-organization membership with RBAC roles';
COMMENT ON TABLE user_sessions IS 'Active user sessions for security monitoring and revocation';
COMMENT ON TABLE mfa_backup_codes IS 'Hashed backup codes for MFA recovery';
COMMENT ON TABLE organization_invitations IS 'Pending invitations to join organizations';
COMMENT ON TABLE auth_audit_log IS 'Security audit trail for authentication events';

COMMENT ON FUNCTION handle_new_user() IS 'Automatically creates user_profile when new auth.user is created';
COMMENT ON FUNCTION log_auth_event(uuid, text, jsonb, boolean) IS 'Logs authentication events to audit trail';
COMMENT ON FUNCTION get_user_organizations(uuid) IS 'Returns all organizations a user belongs to with their role';
COMMENT ON FUNCTION user_has_org_role(uuid, uuid, text[]) IS 'Checks if user has specified role(s) in an organization';
