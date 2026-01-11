/**
 * MFA Handler for DWS6.com Multi-Login Platform
 * 
 * Handles TOTP enrollment, verification, and backup codes
 * using Supabase Auth MFA.
 * 
 * @version 1.0.0
 * @created 2026-01-04
 */

import { getSupabaseClient, getCurrentUser } from './supabase-client.js';
import { supabaseConfig } from '../config/supabase-config.js';

// ============================================================
// MFA ENROLLMENT
// ============================================================

/**
 * Start MFA enrollment - generates TOTP secret and QR code
 * @returns {Promise<Object>} Result with {success, qrCode, secret, factorId, error}
 */
export async function enrollMfa() {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, error: 'Supabase client not initialized' };
  }
  
  try {
    const { data, error } = await client.auth.mfa.enroll({
      factorType: 'totp',
      issuer: supabaseConfig.mfa?.totp?.issuer || 'DWS IQ 6',
      friendlyName: 'Authenticator App'
    });
    
    if (error) {
      console.error('MFA enrollment error:', error.message);
      return { success: false, error: error.message };
    }
    
    console.log('MFA enrollment initiated');
    return {
      success: true,
      factorId: data.id,
      qrCode: data.totp.qr_code,
      secret: data.totp.secret,
      uri: data.totp.uri
    };
    
  } catch (error) {
    console.error('MFA enrollment exception:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Verify and complete MFA enrollment
 * @param {string} factorId - Factor ID from enrollment
 * @param {string} code - 6-digit TOTP code from authenticator app
 * @returns {Promise<Object>} Result with {success, error}
 */
export async function verifyMfaEnrollment(factorId, code) {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, error: 'Supabase client not initialized' };
  }
  
  try {
    const { data, error } = await client.auth.mfa.challengeAndVerify({
      factorId: factorId,
      code: code
    });
    
    if (error) {
      console.error('MFA verification error:', error.message);
      return { success: false, error: error.message };
    }
    
    // Generate backup codes after successful enrollment
    const backupCodes = await generateBackupCodes();
    
    // Update user profile to indicate MFA is enabled
    await client.from('user_profiles').update({
      mfa_enabled: true,
      updated_at: new Date().toISOString()
    }).eq('id', (await getCurrentUser())?.id);
    
    // Log MFA enrollment
    await logMfaEvent('mfa_enrolled');
    
    console.log('MFA enrollment verified successfully');
    return { 
      success: true, 
      backupCodes: backupCodes.codes,
      message: 'MFA enabled successfully. Save your backup codes!'
    };
    
  } catch (error) {
    console.error('MFA verification exception:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Unenroll/disable MFA
 * @param {string} factorId - Factor ID to unenroll
 * @returns {Promise<Object>} Result with {success, error}
 */
export async function unenrollMfa(factorId) {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, error: 'Supabase client not initialized' };
  }
  
  try {
    const { error } = await client.auth.mfa.unenroll({
      factorId: factorId
    });
    
    if (error) {
      console.error('MFA unenroll error:', error.message);
      return { success: false, error: error.message };
    }
    
    // Update user profile
    const user = await getCurrentUser();
    if (user) {
      await client.from('user_profiles').update({
        mfa_enabled: false,
        updated_at: new Date().toISOString()
      }).eq('id', user.id);
      
      // Delete backup codes
      await client.from('mfa_backup_codes').delete().eq('user_id', user.id);
    }
    
    await logMfaEvent('mfa_disabled');
    
    console.log('MFA disabled successfully');
    return { success: true, message: 'MFA has been disabled' };
    
  } catch (error) {
    console.error('MFA unenroll exception:', error);
    return { success: false, error: error.message };
  }
}

// ============================================================
// MFA VERIFICATION (LOGIN)
// ============================================================

/**
 * Create MFA challenge for login verification
 * @param {string} factorId - Factor ID to challenge
 * @returns {Promise<Object>} Result with {success, challengeId, error}
 */
export async function createMfaChallenge(factorId) {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, error: 'Supabase client not initialized' };
  }
  
  try {
    const { data, error } = await client.auth.mfa.challenge({
      factorId: factorId
    });
    
    if (error) {
      console.error('MFA challenge error:', error.message);
      return { success: false, error: error.message };
    }
    
    return { success: true, challengeId: data.id };
    
  } catch (error) {
    console.error('MFA challenge exception:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Verify MFA code during login
 * @param {string} factorId - Factor ID
 * @param {string} challengeId - Challenge ID from createMfaChallenge
 * @param {string} code - 6-digit TOTP code
 * @returns {Promise<Object>} Result with {success, session, error}
 */
export async function verifyMfaCode(factorId, challengeId, code) {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, error: 'Supabase client not initialized' };
  }
  
  try {
    const { data, error } = await client.auth.mfa.verify({
      factorId: factorId,
      challengeId: challengeId,
      code: code
    });
    
    if (error) {
      console.error('MFA verify error:', error.message);
      await logMfaEvent('mfa_verify_failed', { reason: error.message });
      return { success: false, error: error.message };
    }
    
    // Clear MFA challenge from session storage
    sessionStorage.removeItem('mfa_challenge');
    
    await logMfaEvent('mfa_verify_success');
    
    console.log('MFA verification successful');
    return { success: true, session: data };
    
  } catch (error) {
    console.error('MFA verify exception:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get pending MFA challenge from session storage
 * @returns {Object|null} Challenge data or null
 */
export function getPendingMfaChallenge() {
  try {
    const challenge = sessionStorage.getItem('mfa_challenge');
    return challenge ? JSON.parse(challenge) : null;
  } catch (error) {
    return null;
  }
}

// ============================================================
// BACKUP CODES
// ============================================================

/**
 * Generate new backup codes
 * @returns {Promise<Object>} Result with {success, codes, error}
 */
export async function generateBackupCodes() {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, error: 'Supabase client not initialized' };
  }
  
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: 'User not authenticated' };
  }
  
  try {
    const codeCount = supabaseConfig.mfa?.backupCodes?.count || 10;
    const codeLength = supabaseConfig.mfa?.backupCodes?.length || 8;
    
    // Generate random backup codes
    const codes = [];
    for (let i = 0; i < codeCount; i++) {
      codes.push(generateRandomCode(codeLength));
    }
    
    // Delete existing backup codes
    await client.from('mfa_backup_codes').delete().eq('user_id', user.id);
    
    // Hash and store new backup codes
    for (const code of codes) {
      const hash = await hashCode(code);
      await client.from('mfa_backup_codes').insert({
        user_id: user.id,
        code_hash: hash
      });
    }
    
    await logMfaEvent('backup_codes_generated');
    
    console.log('Backup codes generated');
    return { success: true, codes: codes };
    
  } catch (error) {
    console.error('Backup code generation exception:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Verify and use a backup code
 * @param {string} code - Backup code to verify
 * @returns {Promise<Object>} Result with {success, error}
 */
export async function useBackupCode(code) {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, error: 'Supabase client not initialized' };
  }
  
  const challenge = getPendingMfaChallenge();
  if (!challenge) {
    return { success: false, error: 'No pending MFA challenge' };
  }
  
  try {
    const hash = await hashCode(code.trim().toUpperCase());
    
    // Find matching backup code
    const { data: backupCode, error: findError } = await client
      .from('mfa_backup_codes')
      .select('*')
      .eq('user_id', challenge.userId)
      .eq('code_hash', hash)
      .is('used_at', null)
      .single();
    
    if (findError || !backupCode) {
      await logMfaEvent('backup_code_failed', { reason: 'Invalid or used code' });
      return { success: false, error: 'Invalid or already used backup code' };
    }
    
    // Mark code as used
    await client.from('mfa_backup_codes').update({
      used_at: new Date().toISOString()
    }).eq('id', backupCode.id);
    
    // Complete the authentication
    // Note: This requires the session to be partially authenticated
    // In practice, you may need to implement a special bypass endpoint
    
    sessionStorage.removeItem('mfa_challenge');
    
    await logMfaEvent('backup_code_used');
    
    console.log('Backup code verified successfully');
    return { success: true, message: 'Backup code accepted' };
    
  } catch (error) {
    console.error('Backup code verification exception:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get remaining backup codes count
 * @returns {Promise<number>} Number of remaining backup codes
 */
export async function getRemainingBackupCodesCount() {
  const client = getSupabaseClient();
  if (!client) return 0;
  
  const user = await getCurrentUser();
  if (!user) return 0;
  
  try {
    const { count, error } = await client
      .from('mfa_backup_codes')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .is('used_at', null);
    
    return error ? 0 : count;
  } catch (error) {
    return 0;
  }
}

// ============================================================
// MFA STATUS
// ============================================================

/**
 * Get user's MFA factors
 * @returns {Promise<Object>} Result with {success, factors, error}
 */
export async function getMfaFactors() {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, error: 'Supabase client not initialized' };
  }
  
  try {
    const { data, error } = await client.auth.mfa.listFactors();
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { 
      success: true, 
      factors: data.all,
      totp: data.totp,
      phone: data.phone
    };
    
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Check if user has MFA enabled
 * @returns {Promise<boolean>} True if MFA is enabled
 */
export async function isMfaEnabled() {
  const result = await getMfaFactors();
  if (!result.success) return false;
  
  return result.factors.some(f => f.status === 'verified');
}

/**
 * Get the assurance level of current session
 * @returns {Promise<Object>} Result with {success, level, error}
 */
export async function getMfaAssuranceLevel() {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, error: 'Supabase client not initialized' };
  }
  
  try {
    const { data, error } = await client.auth.mfa.getAuthenticatorAssuranceLevel();
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { 
      success: true, 
      currentLevel: data.currentLevel,
      nextLevel: data.nextLevel,
      currentAuthenticationMethods: data.currentAuthenticationMethods
    };
    
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Generate a random alphanumeric code
 * @param {number} length - Code length
 * @returns {string} Random code
 */
function generateRandomCode(length) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude ambiguous characters
  let code = '';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    code += chars[array[i] % chars.length];
  }
  return code;
}

/**
 * Hash a code using SHA-256
 * @param {string} code - Code to hash
 * @returns {Promise<string>} Hex hash
 */
async function hashCode(code) {
  const encoder = new TextEncoder();
  const data = encoder.encode(code);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Log MFA event to audit log
 * @param {string} action - Action type
 * @param {Object} details - Additional details
 */
async function logMfaEvent(action, details = {}) {
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
    console.warn('Failed to log MFA event:', error);
  }
}

/**
 * Format backup codes for display (groups of 4)
 * @param {string[]} codes - Array of backup codes
 * @returns {string} Formatted codes string
 */
export function formatBackupCodes(codes) {
  return codes.map(code => {
    // Format as XXXX-XXXX for 8-char codes
    if (code.length === 8) {
      return `${code.slice(0, 4)}-${code.slice(4)}`;
    }
    return code;
  }).join('\n');
}

/**
 * Download backup codes as text file
 * @param {string[]} codes - Array of backup codes
 */
export function downloadBackupCodes(codes) {
  const content = `DWS IQ 6 - MFA Backup Codes
Generated: ${new Date().toISOString()}
=====================================

${formatBackupCodes(codes)}

=====================================
IMPORTANT: 
- Each code can only be used once
- Store these codes in a secure location
- Generate new codes if you run low
`;
  
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'dws-iq-backup-codes.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ============================================================
// EXPORTS
// ============================================================

export default {
  // Enrollment
  enrollMfa,
  verifyMfaEnrollment,
  unenrollMfa,
  
  // Verification
  createMfaChallenge,
  verifyMfaCode,
  getPendingMfaChallenge,
  
  // Backup codes
  generateBackupCodes,
  useBackupCode,
  getRemainingBackupCodesCount,
  formatBackupCodes,
  downloadBackupCodes,
  
  // Status
  getMfaFactors,
  isMfaEnabled,
  getMfaAssuranceLevel
};
