// Evidence: Tool=GitHub Copilot CLI 1.0.88 Model=openai/gpt-5.6-sol Agent=copilot Date=2026-09-27
// Audit trail: git log -- dws6.com/shared/js/supabase-client.js

/**
 * Supabase Client Initialization
 *
 * This module initializes the Supabase client for authentication
 * and database operations across all DWS6.com login endpoints.
 */

import { supabaseConfig } from '../config/supabase-config.js';

// Initialize Supabase client
let supabaseClient = null;

/**
 * Initialize Supabase client (lazy loading)
 * @returns {Object} Supabase client instance
 */
export function getSupabaseClient() {
  if (supabaseClient) {
    return supabaseClient;
  }

  // ES modules do not see classic-script globals as bare identifiers.
  const supabaseLib = globalThis.supabase;
  if (!supabaseLib?.createClient) {
    console.error(
      'Supabase library not loaded. Include: <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>',
    );
    return null;
  }

  supabaseClient = supabaseLib.createClient(supabaseConfig.url, supabaseConfig.anonKey, {
    auth: supabaseConfig.auth,
  });

  console.log('✅ Supabase client initialized');
  return supabaseClient;
}

/**
 * Get current authenticated user
 * @returns {Promise<Object|null>} User object or null
 */
export async function getCurrentUser() {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    // getSession() waits for localStorage hydration. getUser() hits the Auth
    // API and returns Auth session missing on first paint → login redirect loop.
    const {
      data: { session },
      error: sessionError,
    } = await client.auth.getSession();
    if (sessionError) {
      console.error('Error getting session:', sessionError.message);
    }
    if (session?.user) return session.user;

    const {
      data: { user },
      error,
    } = await client.auth.getUser();

    if (error) {
      console.error('Error getting user:', error.message);
      return null;
    }

    return user;
  } catch (error) {
    console.error('Exception getting user:', error);
    return null;
  }
}

/**
 * Get current session
 * @returns {Promise<Object|null>} Session object or null
 */
export async function getCurrentSession() {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const {
      data: { session },
      error,
    } = await client.auth.getSession();

    if (error) {
      console.error('Error getting session:', error.message);
      return null;
    }

    return session;
  } catch (error) {
    console.error('Exception getting session:', error);
    return null;
  }
}

/**
 * Check if user is authenticated
 * @returns {Promise<boolean>} True if authenticated
 */
export async function isAuthenticated() {
  const session = await getCurrentSession();
  return session !== null;
}

const PRIVILEGED_ROLES = new Set(['backoffice_admin', 'hub_admin']);

/**
 * Read dashboard authorization from the server-owned organization membership table.
 * @returns {Promise<{isAdmin: boolean, orgs: string[]}>}
 */
export async function getBackofficeAccess() {
  const session = await getCurrentSession();
  if (!session?.access_token) throw new Error('No authenticated session');

  const localHosts = new Set(['localhost', '127.0.0.1', '']);
  const apiBase =
    window.DWS_API_BASE ||
    (localHosts.has(window.location.hostname) ? 'http://localhost:3001' : 'https://api.dws6.com');
  const response = await fetch(`${apiBase}/api/v1/backoffice/me`, {
    headers: { Authorization: `Bearer ${session.access_token}` },
  });
  if (!response.ok) throw new Error(`Dashboard access check failed (HTTP ${response.status})`);

  const access = await response.json();
  if (
    typeof access?.isAdmin !== 'boolean' ||
    !Array.isArray(access?.orgs) ||
    !access.orgs.every((org) => typeof org === 'string')
  ) {
    throw new Error('Dashboard access response is invalid');
  }
  return access;
}

export function hasBackofficeSection(access, sectionName) {
  if (access.isAdmin) return true;
  const expected = String(sectionName).trim().toLocaleLowerCase();
  return access.orgs.some((org) => org.trim().toLocaleLowerCase() === expected);
}

/**
 * Resolve a role without accepting a user-editable privileged claim.
 * Supabase users can update user_metadata themselves; app_metadata and active
 * organization membership are server-controlled. Non-privileged legacy roles remain compatible.
 * @param {Object|null} user - Supabase user
 * @param {boolean} hasBackofficeAccess - Result of the server-controlled is_backoffice_admin() check
 * @returns {string|null} Trusted role or null
 */
export function resolveUserRole(user, hasBackofficeAccess = false) {
  if (!user) return null;

  const appRole = user.app_metadata?.role;
  const userRole = user.user_metadata?.role;
  if (appRole === 'backoffice_admin' || userRole === 'backoffice_admin') {
    return hasBackofficeAccess ? 'backoffice_admin' : null;
  }
  if (typeof appRole === 'string' && appRole) return appRole;
  if (typeof userRole !== 'string' || !userRole || PRIVILEGED_ROLES.has(userRole)) return null;

  return userRole;
}

/**
 * Get the current user's effective role.
 * @returns {Promise<string|null>} User role or null
 */
export async function getUserRole() {
  const user = await getCurrentUser();
  const resolvedRole = resolveUserRole(user);
  const claimedBackofficeRole =
    user?.app_metadata?.role === 'backoffice_admin' ||
    user?.user_metadata?.role === 'backoffice_admin';
  if (resolvedRole || !claimedBackofficeRole) return resolvedRole;

  const client = getSupabaseClient();
  if (!client) return null;

  const { data, error } = await client.rpc('is_backoffice_admin');
  if (error) {
    console.error('Error verifying Back-Office role:', error.message);
    return null;
  }

  return resolveUserRole(user, data === true);
}

/**
 * Get user permissions from metadata
 * @returns {Promise<Array>} Array of permissions
 */
export async function getUserPermissions() {
  const user = await getCurrentUser();
  if (!user || !user.user_metadata) return [];

  return user.user_metadata.permissions || [];
}

/**
 * Check if user has specific permission
 * @param {string} permission - Permission to check
 * @returns {Promise<boolean>} True if user has permission
 */
export async function hasPermission(permission) {
  const permissions = await getUserPermissions();
  return permissions.includes(permission);
}

/**
 * Listen for auth state changes
 * @param {Function} callback - Callback function (event, session) => {}
 */
export function onAuthStateChange(callback) {
  const client = getSupabaseClient();
  if (!client) return null;

  const {
    data: { subscription },
  } = client.auth.onAuthStateChange(callback);
  return subscription;
}

// Export Supabase client getter as default
export default getSupabaseClient;
