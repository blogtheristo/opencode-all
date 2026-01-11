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
  
  // Check if Supabase library is loaded
  if (typeof supabase === 'undefined') {
    console.error('Supabase library not loaded. Include: <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>');
    return null;
  }
  
  // Create Supabase client
  supabaseClient = supabase.createClient(
    supabaseConfig.url,
    supabaseConfig.anonKey,
    {
      auth: supabaseConfig.auth
    }
  );
  
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
    const { data: { user }, error } = await client.auth.getUser();
    
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
    const { data: { session }, error } = await client.auth.getSession();
    
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

/**
 * Get user role from metadata
 * @returns {Promise<string|null>} User role or null
 */
export async function getUserRole() {
  const user = await getCurrentUser();
  if (!user || !user.user_metadata) return null;
  
  return user.user_metadata.role || null;
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
  
  const { data: { subscription } } = client.auth.onAuthStateChange(callback);
  return subscription;
}

// Export Supabase client getter as default
export default getSupabaseClient;
