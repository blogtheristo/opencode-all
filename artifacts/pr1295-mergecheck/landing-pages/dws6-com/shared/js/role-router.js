/**
 * Role-Based Router for DWS6.com Multi-Login Platform
 * 
 * Handles automatic redirection to appropriate dashboards
 * based on user role stored in Supabase user metadata.
 */

import { getUserRole, getCurrentUser } from './supabase-client.js';
import { getRedirectUrl, getLoginUrl, getRoleName } from '../config/supabase-config.js';

/**
 * Redirect user to their role-specific dashboard
 * @returns {Promise<void>}
 */
export async function redirectToDashboard() {
  const user = await getCurrentUser();
  
  if (!user) {
    console.warn('⚠️ No user found, redirecting to login portal');
    window.location.href = '/login/portal.html';
    return;
  }
  
  const role = await getUserRole();
  
  if (!role) {
    console.warn('⚠️ User has no role assigned, redirecting to role selection');
    window.location.href = '/select-role.html';
    return;
  }
  
  const dashboardUrl = getRedirectUrl(role);
  console.log(`✅ Redirecting to ${getRoleName(role)} dashboard:`, dashboardUrl);
  window.location.href = dashboardUrl;
}

/**
 * Redirect user to their role-specific login page
 * @param {string} role - User role
 * @returns {void}
 */
export function redirectToLogin(role = null) {
  if (role) {
    const loginUrl = getLoginUrl(role);
    console.log(`Redirecting to ${getRoleName(role)} login:`, loginUrl);
    window.location.href = loginUrl;
  } else {
    console.log('Redirecting to login portal');
    window.location.href = '/login/portal.html';
  }
}

/**
 * Check if current page matches user's authorized dashboard
 * @param {string} requiredRole - Required role for current page
 * @returns {Promise<boolean>} True if authorized
 */
export async function checkPageAuthorization(requiredRole) {
  const user = await getCurrentUser();
  
  if (!user) {
    console.warn('⚠️ Not authenticated');
    redirectToLogin(requiredRole);
    return false;
  }
  
  const userRole = await getUserRole();
  
  if (userRole !== requiredRole) {
    console.warn(`⚠️ Unauthorized: page requires ${requiredRole}, user has ${userRole}`);
    // Redirect to user's correct dashboard
    await redirectToDashboard();
    return false;
  }
  
  console.log(`✅ Authorized: ${getRoleName(userRole)}`);
  return true;
}

/**
 * Initialize page with role-based access control
 * @param {string} requiredRole - Required role for current page
 * @param {Function} onAuthorized - Callback function to execute if authorized
 * @returns {Promise<void>}
 */
export async function initializePage(requiredRole, onAuthorized = null) {
  console.log(`🔐 Initializing page with required role: ${requiredRole}`);
  
  const isAuthorized = await checkPageAuthorization(requiredRole);
  
  if (isAuthorized && onAuthorized) {
    console.log('✅ Page authorized, executing callback');
    onAuthorized();
  }
}

/**
 * Get dashboard URL for a specific role
 * @param {string} role - User role
 * @returns {string} Dashboard URL
 */
export function getDashboardUrl(role) {
  return getRedirectUrl(role);
}

/**
 * Get login URL for a specific role
 * @param {string} role - User role
 * @returns {string} Login URL
 */
export function getLoginPageUrl(role) {
  return getLoginUrl(role);
}

/**
 * Handle post-login redirect based on role
 * This should be called after successful login
 * @returns {Promise<void>}
 */
export async function handlePostLoginRedirect() {
  console.log('🔄 Handling post-login redirect...');
  await redirectToDashboard();
}

/**
 * Handle logout and redirect to appropriate login page
 * @param {string} role - Role to redirect to (optional)
 * @returns {void}
 */
export function handleLogoutRedirect(role = null) {
  console.log('👋 Handling logout redirect...');
  redirectToLogin(role);
}

// Export all functions
export default {
  redirectToDashboard,
  redirectToLogin,
  checkPageAuthorization,
  initializePage,
  getDashboardUrl,
  getLoginPageUrl,
  handlePostLoginRedirect,
  handleLogoutRedirect
};
