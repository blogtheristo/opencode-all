/**
 * Authentication Handler for DWS6.com Multi-Login Platform
 * 
 * Handles login, logout, registration, OAuth, MFA, and session management
 * using Supabase Auth with role-based access control.
 * 
 * @version 2.0.0
 * @updated 2026-01-04
 */

import { getSupabaseClient, getCurrentUser, getUserRole } from './supabase-client.js';
import { supabaseConfig } from '../config/supabase-config.js';

// ============================================================
// EMAIL/PASSWORD AUTHENTICATION
// ============================================================

/**
 * Login with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} role - User role to assign
 * @returns {Promise<Object>} Result object {success, user, session, requiresMfa, error}
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
      await logAuthEvent('login_failed', { email, reason: error.message });
      return { success: false, error: error.message };
    }
    
    // Check if MFA is required
    if (data.user?.factors && data.user.factors.length > 0) {
      const totpFactor = data.user.factors.find(f => f.factor_type === 'totp' && f.status === 'verified');
      if (totpFactor) {
        // Store partial session for MFA verification
        sessionStorage.setItem('mfa_challenge', JSON.stringify({
          factorId: totpFactor.id,
          userId: data.user.id,
          email: data.user.email
        }));
        return { 
          success: true, 
          requiresMfa: true, 
          factorId: totpFactor.id,
          user: data.user 
        };
      }
    }
    
    // Update role if provided and user doesn't have one
    if (role && data.user && (!data.user.user_metadata || !data.user.user_metadata.role)) {
      await updateUserRole(data.user.id, role);
    }
    
    // Update last login timestamp
    await updateLastLogin(data.user.id);
    
    // Log successful login
    await logAuthEvent('login_success', { email, role: role || data.user?.user_metadata?.role });
    
    console.log('Login successful:', data.user.email);
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
  
  // Validate password strength
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    return { success: false, error: passwordValidation.message };
  }
  
  try {
    const redirectUrl = `${window.location.origin}${supabaseConfig.email?.verification?.redirectTo || '/verify-email/index.html'}`;
    
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          role: role,
          first_name: metadata.firstName || '',
          last_name: metadata.lastName || '',
          permissions: metadata.permissions || ['read'],
          organization: metadata.organization || '',
          access_level: metadata.access_level || 'free',
          created_at: new Date().toISOString()
        }
      }
    });
    
    if (error) {
      console.error('Registration error:', error.message);
      await logAuthEvent('register_failed', { email, reason: error.message });
      return { success: false, error: error.message };
    }
    
    // Log successful registration
    await logAuthEvent('register_success', { email, role });
    
    console.log('Registration successful:', data.user.email);
    return { 
      success: true, 
      user: data.user,
      message: 'Please check your email to verify your account.'
    };
    
  } catch (error) {
    console.error('Registration exception:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} {valid: boolean, message: string}
 */
export function validatePassword(password) {
  if (password.length < 12) {
    return { valid: false, message: 'Password must be at least 12 characters long' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one special character' };
  }
  return { valid: true, message: 'Password meets requirements' };
}

/**
 * Get password strength score (0-4)
 * @param {string} password - Password to check
 * @returns {Object} {score: number, label: string, color: string}
 */
export function getPasswordStrength(password) {
  let score = 0;
  
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  
  const levels = [
    { score: 0, label: 'Very Weak', color: '#ef4444' },
    { score: 1, label: 'Weak', color: '#f97316' },
    { score: 2, label: 'Fair', color: '#eab308' },
    { score: 3, label: 'Strong', color: '#22c55e' },
    { score: 4, label: 'Very Strong', color: '#10b981' }
  ];
  
  return levels[Math.min(score, 4)];
}

// ============================================================
// OAUTH AUTHENTICATION
// ============================================================

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
    const redirectUrl = role ? supabaseConfig.redirectUrls[role] : '/dashboard/index.html';
    const fullRedirectUrl = `${window.location.origin}${redirectUrl}`;
    
    const { data, error } = await client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: fullRedirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        scopes: supabaseConfig.oauth?.google?.scopes?.join(' ') || 'email profile'
      }
    });
    
    if (error) {
      console.error('Google login error:', error.message);
      return { success: false, error: error.message };
    }
    
    // Store the role in session storage for after redirect
    if (role) {
      sessionStorage.setItem('pending_oauth_role', role);
    }
    
    console.log('Redirecting to Google login...');
    return { success: true, data };
    
  } catch (error) {
    console.error('Google login exception:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Login with Microsoft OAuth (Azure AD)
 * @param {string} role - User role to assign after login
 * @returns {Promise<Object>} Result object {success, error}
 */
export async function loginWithMicrosoft(role = null) {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, error: 'Supabase client not initialized' };
  }
  
  try {
    const redirectUrl = role ? supabaseConfig.redirectUrls[role] : '/dashboard/index.html';
    const fullRedirectUrl = `${window.location.origin}${redirectUrl}`;
    
    const { data, error } = await client.auth.signInWithOAuth({
      provider: 'azure',
      options: {
        redirectTo: fullRedirectUrl,
        scopes: supabaseConfig.oauth?.microsoft?.scopes?.join(' ') || 'email profile openid'
      }
    });
    
    if (error) {
      console.error('Microsoft login error:', error.message);
      return { success: false, error: error.message };
    }
    
    // Store the role in session storage for after redirect
    if (role) {
      sessionStorage.setItem('pending_oauth_role', role);
    }
    
    console.log('Redirecting to Microsoft login...');
    return { success: true, data };
    
  } catch (error) {
    console.error('Microsoft login exception:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Handle OAuth callback - call this on dashboard/redirect pages
 * Assigns pending role to user after OAuth redirect
 * @returns {Promise<Object>} Result object {success, user, role}
 */
export async function handleOAuthCallback() {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, error: 'Supabase client not initialized' };
  }
  
  try {
    // Get the session from URL hash (Supabase puts tokens there)
    const { data: { session }, error } = await client.auth.getSession();
    
    if (error || !session) {
      return { success: false, error: error?.message || 'No session found' };
    }
    
    // Check for pending role assignment
    const pendingRole = sessionStorage.getItem('pending_oauth_role');
    if (pendingRole) {
      await updateUserRole(session.user.id, pendingRole);
      sessionStorage.removeItem('pending_oauth_role');
    }
    
    // Update last login
    await updateLastLogin(session.user.id);
    
    // Log OAuth login
    await logAuthEvent('oauth_login_success', { 
      provider: session.user.app_metadata?.provider,
      role: pendingRole || session.user.user_metadata?.role 
    });
    
    return { 
      success: true, 
      user: session.user, 
      role: pendingRole || session.user.user_metadata?.role 
    };
    
  } catch (error) {
    console.error('OAuth callback error:', error);
    return { success: false, error: error.message };
  }
}

// ============================================================
// LOGOUT
// ============================================================

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
    const user = await getCurrentUser();
    
    const { error } = await client.auth.signOut();
    
    if (error) {
      console.error('Logout error:', error.message);
      return { success: false, error: error.message };
    }
    
    // Log logout event
    if (user) {
      await logAuthEvent('logout', { email: user.email });
    }
    
    // Clear any stored session data
    sessionStorage.removeItem('mfa_challenge');
    sessionStorage.removeItem('pending_oauth_role');
    
    console.log('Logout successful');
    return { success: true };
    
  } catch (error) {
    console.error('Logout exception:', error);
    return { success: false, error: error.message };
  }
}

// ============================================================
// PASSWORD MANAGEMENT
// ============================================================

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
    const redirectUrl = `${window.location.origin}${supabaseConfig.email?.passwordReset?.redirectTo || '/reset-password/index.html'}`;
    
    const { error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl
    });
    
    if (error) {
      console.error('Password reset error:', error.message);
      return { success: false, error: error.message };
    }
    
    await logAuthEvent('password_reset_requested', { email });
    
    console.log('Password reset email sent');
    return { success: true, message: 'Password reset email sent. Check your inbox.' };
    
  } catch (error) {
    console.error('Password reset exception:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Update user password (after reset or from profile)
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} Result object {success, error}
 */
export async function updatePassword(newPassword) {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, error: 'Supabase client not initialized' };
  }
  
  // Validate new password
  const validation = validatePassword(newPassword);
  if (!validation.valid) {
    return { success: false, error: validation.message };
  }
  
  try {
    const { error } = await client.auth.updateUser({
      password: newPassword
    });
    
    if (error) {
      console.error('Password update error:', error.message);
      return { success: false, error: error.message };
    }
    
    await logAuthEvent('password_changed');
    
    console.log('Password updated successfully');
    return { success: true, message: 'Password updated successfully' };
    
  } catch (error) {
    console.error('Password update exception:', error);
    return { success: false, error: error.message };
  }
}

// ============================================================
// EMAIL VERIFICATION
// ============================================================

/**
 * Resend verification email
 * @param {string} email - User email
 * @returns {Promise<Object>} Result object {success, error}
 */
export async function resendVerificationEmail(email) {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, error: 'Supabase client not initialized' };
  }
  
  try {
    const redirectUrl = `${window.location.origin}${supabaseConfig.email?.verification?.redirectTo || '/verify-email/index.html'}`;
    
    const { error } = await client.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: redirectUrl
      }
    });
    
    if (error) {
      console.error('Resend verification error:', error.message);
      return { success: false, error: error.message };
    }
    
    console.log('Verification email resent');
    return { success: true, message: 'Verification email sent. Check your inbox.' };
    
  } catch (error) {
    console.error('Resend verification exception:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Verify email with token from URL
 * Call this on the verify-email page
 * @returns {Promise<Object>} Result object {success, user, error}
 */
export async function verifyEmailToken() {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, error: 'Supabase client not initialized' };
  }
  
  try {
    // Supabase automatically handles the token from URL hash
    const { data: { session }, error } = await client.auth.getSession();
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    if (session && session.user.email_confirmed_at) {
      await logAuthEvent('email_verified', { email: session.user.email });
      return { success: true, user: session.user, message: 'Email verified successfully!' };
    }
    
    return { success: false, error: 'Email verification failed or link expired' };
    
  } catch (error) {
    console.error('Email verification exception:', error);
    return { success: false, error: error.message };
  }
}

// ============================================================
// USER ROLE & PROFILE MANAGEMENT
// ============================================================

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
    
    console.log('User role updated to:', role);
    return { success: true };
    
  } catch (error) {
    console.error('Role update exception:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Update user profile
 * @param {Object} profile - Profile data {firstName, lastName, avatarUrl, phone, timezone}
 * @returns {Promise<Object>} Result object {success, user, error}
 */
export async function updateProfile(profile) {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, error: 'Supabase client not initialized' };
  }
  
  try {
    const { data, error } = await client.auth.updateUser({
      data: {
        first_name: profile.firstName,
        last_name: profile.lastName,
        avatar_url: profile.avatarUrl,
        phone: profile.phone,
        timezone: profile.timezone
      }
    });
    
    if (error) {
      console.error('Profile update error:', error.message);
      return { success: false, error: error.message };
    }
    
    // Also update user_profiles table
    const { error: dbError } = await client
      .from('user_profiles')
      .update({
        first_name: profile.firstName,
        last_name: profile.lastName,
        avatar_url: profile.avatarUrl,
        phone: profile.phone,
        timezone: profile.timezone,
        updated_at: new Date().toISOString()
      })
      .eq('id', data.user.id);
    
    if (dbError) {
      console.warn('Profile DB update warning:', dbError.message);
    }
    
    await logAuthEvent('profile_updated');
    
    console.log('Profile updated successfully');
    return { success: true, user: data.user };
    
  } catch (error) {
    console.error('Profile update exception:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Update last login timestamp
 * @param {string} userId - User ID
 */
async function updateLastLogin(userId) {
  const client = getSupabaseClient();
  if (!client) return;
  
  try {
    await client
      .from('user_profiles')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', userId);
  } catch (error) {
    console.warn('Failed to update last login:', error);
  }
}

// ============================================================
// AUTHORIZATION CHECKS
// ============================================================

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
 * Check if user has any of the required roles
 * @param {string[]} requiredRoles - Array of allowed roles
 * @returns {Promise<boolean>} True if user has any of the roles
 */
export async function hasAnyRole(requiredRoles) {
  const userRole = await getUserRole();
  return requiredRoles.includes(userRole);
}

/**
 * Verify session and redirect if not authenticated
 * @param {string} loginUrl - URL to redirect to if not authenticated
 * @returns {Promise<Object|null>} User object or null (redirects if not authenticated)
 */
export async function requireAuth(loginUrl = '/login/portal.html') {
  const user = await getCurrentUser();
  
  if (!user) {
    console.warn('Not authenticated, redirecting to login');
    window.location.href = loginUrl;
    return null;
  }
  
  return user;
}

/**
 * Verify user has required role and redirect if not authorized
 * @param {string|string[]} requiredRole - Required role(s)
 * @param {string} unauthorizedUrl - URL to redirect to if not authorized
 * @returns {Promise<boolean>} True if authorized
 */
export async function requireRole(requiredRole, unauthorizedUrl = '/unauthorized.html') {
  const user = await requireAuth();
  if (!user) return false;
  
  const userRole = await getUserRole();
  const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  
  if (!roles.includes(userRole)) {
    console.warn(`Unauthorized: required role ${roles.join(' or ')}, user has ${userRole}`);
    window.location.href = unauthorizedUrl;
    return false;
  }
  
  return true;
}

// ============================================================
// AUDIT LOGGING
// ============================================================

/**
 * Log authentication event to audit log
 * @param {string} action - Action type
 * @param {Object} details - Additional details
 */
async function logAuthEvent(action, details = {}) {
  const client = getSupabaseClient();
  if (!client) return;
  
  try {
    const user = await getCurrentUser();
    
    await client.from('auth_audit_log').insert({
      user_id: user?.id || null,
      action: action,
      details: details,
      success: true
    });
  } catch (error) {
    console.warn('Failed to log auth event:', error);
  }
}

// ============================================================
// UI HELPERS
// ============================================================

/**
 * Show error message to user
 * @param {string} message - Error message
 * @param {string} elementId - ID of error element (default: 'errorMessage')
 */
export function showError(message, elementId = 'errorMessage') {
  const errorDiv = document.getElementById(elementId);
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.classList.add('show');
    errorDiv.style.display = 'block';
    setTimeout(() => {
      errorDiv.classList.remove('show');
      errorDiv.style.display = 'none';
    }, 5000);
  } else {
    console.error('Error:', message);
  }
}

/**
 * Show success message to user
 * @param {string} message - Success message
 * @param {string} elementId - ID of success element (default: 'successMessage')
 */
export function showSuccess(message, elementId = 'successMessage') {
  const successDiv = document.getElementById(elementId);
  if (successDiv) {
    successDiv.textContent = message;
    successDiv.classList.add('show');
    successDiv.style.display = 'block';
    setTimeout(() => {
      successDiv.classList.remove('show');
      successDiv.style.display = 'none';
    }, 3000);
  } else {
    console.log('Success:', message);
  }
}

/**
 * Show loading state on button
 * @param {HTMLElement} button - Button element
 * @param {boolean} loading - Loading state
 * @param {string} loadingText - Text to show while loading
 */
export function setButtonLoading(button, loading, loadingText = 'Loading...') {
  if (!button) return;
  
  if (loading) {
    button.dataset.originalText = button.textContent;
    button.textContent = loadingText;
    button.disabled = true;
    button.classList.add('loading');
  } else {
    button.textContent = button.dataset.originalText || 'Submit';
    button.disabled = false;
    button.classList.remove('loading');
  }
}

// ============================================================
// EXPORTS
// ============================================================

export default {
  // Email/Password
  login,
  register,
  validatePassword,
  getPasswordStrength,
  
  // OAuth
  loginWithGoogle,
  loginWithMicrosoft,
  handleOAuthCallback,
  
  // Logout
  logout,
  
  // Password
  resetPassword,
  updatePassword,
  
  // Email verification
  resendVerificationEmail,
  verifyEmailToken,
  
  // Profile
  updateUserRole,
  updateProfile,
  
  // Authorization
  isAuthorized,
  hasAnyRole,
  requireAuth,
  requireRole,
  
  // UI helpers
  showError,
  showSuccess,
  setButtonLoading
};
