/**
 * Supabase Configuration Template for DWS6.com Multi-Login Platform
 * 
 * 🔧 SETUP INSTRUCTIONS:
 * 1. Copy this file: cp supabase-config.template.js supabase-config.js
 * 2. Get your Supabase anon key from: https://supabase.com/dashboard/project/kpucuwwfhuwurdxyjjtz
 * 3. Go to Settings → API
 * 4. Copy the "anon/public" key
 * 5. Replace YOUR_SUPABASE_ANON_KEY_HERE below with your actual key
 * 6. Save the file
 * 
 * ⚠️ IMPORTANT:
 * - supabase-config.js is in .gitignore (never committed)
 * - This template file is safe to commit (no real keys)
 * - Each developer needs their own supabase-config.js
 * 
 * Project: kpucuwwfhuwurdxyjjtz
 * Free Tier: 50K MAU, 500MB DB, 1GB Storage
 */

export const supabaseConfig = {
  // Supabase Project Credentials
  url: 'https://kpucuwwfhuwurdxyjjtz.supabase.co',
  anonKey: 'YOUR_SUPABASE_ANON_KEY_HERE', // ⚠️ Replace with actual key from dashboard
  
  // Role-based dashboard redirects (11 user types)
  redirectUrls: {
    'dws_iq_mobile': '/dashboard/dws-iq-mobile/index.html',
    'store_viewer': '/dashboard/store/index.html',
    'dws_iq_standard': '/dashboard/dws-iq/index.html',
    'community_user': '/dashboard/onelifetime/index.html',
    'lifetime_model': '/dashboard/lifetime-model/index.html',
    'enterprise_client': '/dashboard/enterprise/index.html',
    'enterprise_model': '/dashboard/enterprise-model/index.html',
    'backoffice_admin': '/dashboard/backoffice/index.html',
    'api_developer': '/dashboard/api/index.html',
    'mcp_admin': '/dashboard/mcp-hub/index.html',
    'watsonx_user': '/dashboard/watsonx/index.html'
  },
  
  // Login page URLs for each role type
  loginUrls: {
    'dws_iq_mobile': '/login/dws-iq-mobile/index.html',
    'store_viewer': '/login/store/index.html',
    'dws_iq_standard': '/login/dws-iq/index.html',
    'community_user': '/login/onelifetime/index.html',
    'lifetime_model': '/login/lifetime-model/index.html',
    'enterprise_client': '/login/enterprise/index.html',
    'enterprise_model': '/login/enterprise-model/index.html',
    'backoffice_admin': '/login/backoffice/index.html',
    'api_developer': '/login/api/index.html',
    'mcp_admin': '/login/mcp-hub/index.html',
    'watsonx_user': '/login/watsonx/index.html'
  },
  
  // Role display names
  roleNames: {
    'dws_iq_mobile': 'DWS IQ Mobile (V7)',
    'store_viewer': 'Store Manager',
    'dws_iq_standard': 'DWS IQ 6 Platform',
    'community_user': 'OneLifetime Community',
    'lifetime_model': 'LifetimeWorld Model (Vertex AI)',
    'enterprise_client': 'Enterprise Client',
    'enterprise_model': 'Enterprise Model (Vertex AI)',
    'backoffice_admin': 'Back-Office Administrator',
    'api_developer': 'API Developer',
    'mcp_admin': 'MCP Hub Administrator',
    'watsonx_user': 'IBM watsonx.ai'
  },
  
  // Authentication settings
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: 'dws6-auth-token',
    flowType: 'pkce' // Proof Key for Code Exchange (more secure)
  },
  
  // Security settings
  security: {
    requireEmailVerification: true,
    sessionTimeout: 3600, // 1 hour in seconds
    maxLoginAttempts: 5,
    lockoutDuration: 900 // 15 minutes in seconds
  },
  
  // OAuth configuration
  oauth: {
    google: {
      enabled: true,
      scopes: ['email', 'profile']
    },
    microsoft: {
      enabled: true,
      // Azure AD tenant: 'common' for multi-tenant, or specific tenant ID
      tenant: 'common',
      scopes: ['email', 'profile', 'openid']
    }
  },
  
  // MFA configuration
  mfa: {
    enabled: true,
    // TOTP settings
    totp: {
      issuer: 'DWS IQ 6',
      algorithm: 'SHA1',
      digits: 6,
      period: 30
    },
    // Backup codes
    backupCodes: {
      count: 10,
      length: 8
    }
  },
  
  // Email templates configuration
  email: {
    verification: {
      redirectTo: '/verify-email/index.html'
    },
    passwordReset: {
      redirectTo: '/reset-password/index.html'
    },
    magicLink: {
      redirectTo: '/dashboard/index.html'
    }
  }
};

// Helper function to get redirect URL for a role
export function getRedirectUrl(role) {
  return supabaseConfig.redirectUrls[role] || '/';
}

// Helper function to get login URL for a role
export function getLoginUrl(role) {
  return supabaseConfig.loginUrls[role] || '/login/portal.html';
}

// Helper function to get role display name
export function getRoleName(role) {
  return supabaseConfig.roleNames[role] || 'Unknown Role';
}
