/**
 * Authentication Utilities for Next.js Dashboard
 * Server and client-side Supabase auth helpers
 * 
 * @version 1.0.0
 * @created 2026-01-04
 */

import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

// Environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// ============================================================
// CLIENT-SIDE AUTH
// ============================================================

/**
 * Create a Supabase client for client-side use
 */
export function createBrowserClient() {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });
}

// ============================================================
// SERVER-SIDE AUTH
// ============================================================

/**
 * Create a Supabase client for server-side use (with cookies)
 * Use this in Server Components and Route Handlers
 */
export async function createServerClient() {
  const cookieStore = await cookies();
  
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
    global: {
      headers: {
        cookie: cookieStore.toString(),
      },
    },
  });
}

/**
 * Create a Supabase admin client (service role)
 * Use this for admin operations that bypass RLS
 */
export function createAdminClient() {
  if (!SUPABASE_SERVICE_KEY) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured');
  }
  
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// ============================================================
// USER TYPES
// ============================================================

export interface UserProfile {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  phone: string | null;
  timezone: string;
  locale: string;
  emailVerified: boolean;
  mfaEnabled: boolean;
  status: 'active' | 'suspended' | 'pending' | 'deleted';
  lastLoginAt: string | null;
  createdAt: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  planTier: 'free' | 'starter' | 'professional' | 'enterprise';
  status: 'active' | 'suspended' | 'trial' | 'cancelled';
}

export interface OrganizationMember {
  id: string;
  organizationId: string;
  userId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  status: 'active' | 'invited' | 'suspended' | 'removed';
  joinedAt: string;
}

export type UserRole = 'owner' | 'admin' | 'member' | 'viewer';

// ============================================================
// AUTH HELPERS
// ============================================================

/**
 * Get the current user from server-side
 */
export async function getCurrentUser() {
  const supabase = await createServerClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return null;
  }
  
  return user;
}

/**
 * Get the current user's profile
 */
export async function getUserProfile(): Promise<UserProfile | null> {
  const user = await getCurrentUser();
  if (!user) return null;
  
  const supabase = await createServerClient();
  
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  
  if (error || !data) return null;
  
  return {
    id: data.id,
    email: data.email,
    firstName: data.first_name,
    lastName: data.last_name,
    displayName: data.display_name,
    avatarUrl: data.avatar_url,
    phone: data.phone,
    timezone: data.timezone,
    locale: data.locale,
    emailVerified: data.email_verified,
    mfaEnabled: data.mfa_enabled,
    status: data.status,
    lastLoginAt: data.last_login_at,
    createdAt: data.created_at,
  };
}

/**
 * Get user's organizations
 */
export async function getUserOrganizations(): Promise<(Organization & { role: UserRole })[]> {
  const user = await getCurrentUser();
  if (!user) return [];
  
  const supabase = await createServerClient();
  
  const { data, error } = await supabase
    .from('organization_members')
    .select(`
      role,
      organizations (
        id,
        name,
        slug,
        description,
        logo_url,
        plan_tier,
        status
      )
    `)
    .eq('user_id', user.id)
    .eq('status', 'active');
  
  if (error || !data) return [];
  
  return data.map((item: any) => ({
    id: item.organizations.id,
    name: item.organizations.name,
    slug: item.organizations.slug,
    description: item.organizations.description,
    logoUrl: item.organizations.logo_url,
    planTier: item.organizations.plan_tier,
    status: item.organizations.status,
    role: item.role,
  }));
}

/**
 * Check if user has a specific role in an organization
 */
export async function hasOrgRole(
  orgId: string, 
  roles: UserRole[]
): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;
  
  const supabase = await createServerClient();
  
  const { data, error } = await supabase
    .from('organization_members')
    .select('role')
    .eq('user_id', user.id)
    .eq('organization_id', orgId)
    .eq('status', 'active')
    .single();
  
  if (error || !data) return false;
  
  return roles.includes(data.role);
}

/**
 * Get user's sessions
 */
export async function getUserSessions() {
  const user = await getCurrentUser();
  if (!user) return [];
  
  const supabase = await createServerClient();
  
  const { data, error } = await supabase
    .from('user_sessions')
    .select('*')
    .eq('user_id', user.id)
    .is('revoked_at', null)
    .order('last_active_at', { ascending: false });
  
  if (error || !data) return [];
  
  return data;
}

/**
 * Revoke a user session
 */
export async function revokeSession(sessionId: string): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;
  
  const supabase = await createServerClient();
  
  const { error } = await supabase
    .from('user_sessions')
    .update({ revoked_at: new Date().toISOString() })
    .eq('id', sessionId)
    .eq('user_id', user.id);
  
  return !error;
}

// ============================================================
// ROUTE PROTECTION
// ============================================================

/**
 * Require authentication - redirect to login if not authenticated
 * Use in server components or route handlers
 */
export async function requireAuth(redirectTo = '/login/portal.html') {
  const user = await getCurrentUser();
  
  if (!user) {
    // Return redirect info for use in server components
    return { redirect: redirectTo, user: null };
  }
  
  return { redirect: null, user };
}

/**
 * Require specific role - redirect if not authorized
 */
export async function requireRole(
  orgId: string,
  roles: UserRole[],
  redirectTo = '/unauthorized'
) {
  const authResult = await requireAuth();
  if (authResult.redirect) return authResult;
  
  const hasRole = await hasOrgRole(orgId, roles);
  
  if (!hasRole) {
    return { redirect: redirectTo, user: authResult.user };
  }
  
  return { redirect: null, user: authResult.user };
}

export default {
  createBrowserClient,
  createServerClient,
  createAdminClient,
  getCurrentUser,
  getUserProfile,
  getUserOrganizations,
  hasOrgRole,
  getUserSessions,
  revokeSession,
  requireAuth,
  requireRole,
};
