/**
 * Authentication Handler for DWS6.com Multi-Login Platform
 * 
 * Handles login, logout, registration, and session management
 * using Supabase Auth with role-based access control.
 */

import { getSupabaseClient, getCurrentUser, getUserRole } from './supabase-client.js';
import { supabaseConfig } from '../config/supabase-config.js';

/**
 * Login with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} role - User role to assign
 * @returns {Promise<Object>} Result object {success, user, error}
 */
export async function login(email, password, role = null) {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, error: 'Supabase client not initialized' };
  }
  
  try {
    const { data, error } = await client.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error('Login error:', error.message);
      return { success: false, error: error.message };
    }
    
    // If role is provided and user doesn't have a role, update metadata
    if (role && data.user && (!data.user.user_metadata || !data.user.user_metadata.role)) {
      await updateUserRole(data.user.id, role);
    }
    
    console.log('✅ Login successful:', data.user.email);
    return { success: true, user: data.user, session: data.session };
    
  } catch (error) {
    console.error('Login exception:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Register new user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} role - User role
 * @param {Object} metadata - Additional user metadata
 * @returns {Promise<Object>} Result object {success, user, error}
 */
export async function register(email, password, role, metadata = {}) {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, error: 'Supabase client not initialized' };
  }
  
  try {
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: role,
          permissions: metadata.permissions || ['read'],
          organization: metadata.organization || '',
          access_level: metadata.access_level || 'free',
          vertex_ai_enabled: metadata.vertex_ai_enabled || false,
          created_at: new Date().toISOString()
        }
      }
    });
    
    if (error) {
      console.error('Registration error:', error.message);
      return { success: false, error: error.message };
    }
    
    console.log('✅ Registration successful:', data.user.email);
    return { success: true, user: data.user };
    
  } catch (error) {
    console.error('Registration exception:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Login with Google OAuth
 * @param {string} role - User role to assign after login
 * @returns {Promise<Object>} Result object {success, error}
 */
export async function loginWithGoogle(role = null) {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, error: 'Supabase client not initialized' };
  }
  
  try {
    // Get the current page to determine redirect
    const redirectUrl = role ? supabaseConfig.redirectUrls[role] : '/';
    const fullRedirectUrl = `${window.location.origin}${redirectUrl}`;
    
    const { data, error } = await client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: fullRedirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    });
    
    if (error) {
      console.error('Google login error:', error.message);
      return { success: false, error: error.message };
    }
    
    // Store the role in session storage for after redirect
    if (role) {
      sessionStorage.setItem('pending_role', role);
    }
    
    console.log('✅ Redirecting to Google login...');
    return { success: true, data };
    
  } catch (error) {
    console.error('Google login exception:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Logout current user
 * @returns {Promise<Object>} Result object {success, error}
 */
export async function logout() {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, error: 'Supabase client not initialized' };
  }
  
  try {
    const { error } = await client.auth.signOut();
    
    if (error) {
      console.error('Logout error:', error.message);
      return { success: false, error: error.message };
    }
    
    console.log('✅ Logout successful');
    return { success: true };
    
  } catch (error) {
    console.error('Logout exception:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Reset password (send reset email)
 * @param {string} email - User email
 * @returns {Promise<Object>} Result object {success, error}
 */
export async function resetPassword(email) {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, error: 'Supabase client not initialized' };
  }
  
  try {
    const { error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password.html`
    });
    
    if (error) {
      console.error('Password reset error:', error.message);
      return { success: false, error: error.message };
    }
    
    console.log('✅ Password reset email sent');
    return { success: true };
    
  } catch (error) {
    console.error('Password reset exception:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Update user password
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} Result object {success, error}
 */
export async function updatePassword(newPassword) {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, error: 'Supabase client not initialized' };
  }
  
  try {
    const { error } = await client.auth.updateUser({
      password: newPassword
    });
    
    if (error) {
      console.error('Password update error:', error.message);
      return { success: false, error: error.message };
    }
    
    console.log('✅ Password updated successfully');
    return { success: true };
    
  } catch (error) {
    console.error('Password update exception:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Update user role in metadata
 * @param {string} userId - User ID
 * @param {string} role - New role
 * @returns {Promise<Object>} Result object {success, error}
 */
export async function updateUserRole(userId, role) {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, error: 'Supabase client not initialized' };
  }
  
  try {
    const { error } = await client.auth.updateUser({
      data: { role: role }
    });
    
    if (error) {
      console.error('Role update error:', error.message);
      return { success: false, error: error.message };
    }
    
    console.log('✅ User role updated to:', role);
    return { success: true };
    
  } catch (error) {
    console.error('Role update exception:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Check if user is authorized for a specific role
 * @param {string} requiredRole - Required role
 * @returns {Promise<boolean>} True if authorized
 */
export async function isAuthorized(requiredRole) {
  const userRole = await getUserRole();
  return userRole === requiredRole;
}

/**
 * Verify session and redirect if not authenticated
 * @param {string} loginUrl - URL to redirect to if not authenticated
 * @returns {Promise<Object|null>} User object or null (redirects if not authenticated)
 */
export async function requireAuth(loginUrl = '/login/portal.html') {
  const user = await getCurrentUser();
  
  if (!user) {
    console.warn('⚠️ Not authenticated, redirecting to login');
    window.location.href = loginUrl;
    return null;
  }
  
  return user;
}

/**
 * Verify user has required role and redirect if not authorized
 * @param {string} requiredRole - Required role
 * @param {string} unauthorizedUrl - URL to redirect to if not authorized
 * @returns {Promise<boolean>} True if authorized
 */
export async function requireRole(requiredRole, unauthorizedUrl = '/unauthorized.html') {
  const user = await requireAuth();
  if (!user) return false;
  
  const userRole = await getUserRole();
  
  if (userRole !== requiredRole) {
    console.warn(`⚠️ Unauthorized: required role ${requiredRole}, user has ${userRole}`);
    window.location.href = unauthorizedUrl;
    return false;
  }
  
  return true;
}

/**
 * Show error message to user
 * @param {string} message - Error message
 */
export function showError(message) {
  const errorDiv = document.getElementById('errorMessage');
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => {
      errorDiv.style.display = 'none';
    }, 5000);
  } else {
    alert('Error: ' + message);
  }
}

/**
 * Show success message to user
 * @param {string} message - Success message
 */
export function showSuccess(message) {
  const successDiv = document.getElementById('successMessage');
  if (successDiv) {
    successDiv.textContent = message;
    successDiv.style.display = 'block';
    setTimeout(() => {
      successDiv.style.display = 'none';
    }, 3000);
  } else {
    console.log('✅ ' + message);
  }
}

// Export all functions
export default {
  login,
  loginWithGoogle,
  register,
  logout,
  resetPassword,
  updatePassword,
  updateUserRole,
  isAuthorized,
  requireAuth,
  requireRole,
  showError,
  showSuccess
};
