/**
 * Supabase Configuration for DWS6.com Multi-Login Platform
 * 
 * Project: kpucuwwfhuwurdxyjjtz
 * Free Tier: 50K MAU, 500MB DB, 1GB Storage
 */

export const supabaseConfig = {
  // Supabase Project Credentials
  url: 'https://kpucuwwfhuwurdxyjjtz.supabase.co',
  anonKey: 'sb_publishable_mZtEHU2k4WolHxePGF6g3w_tdkMCWRh', // Supabase anon key
  
  // Role-based dashboard redirects
  redirectUrls: {
    'dws_iq_mobile': '/dashboard/dws-iq-mobile/',
    'store_viewer': '/dashboard/store/',
    'dws_iq_standard': '/dashboard/dws-iq/',
    'community_user': '/dashboard/onelifetime/',
    'lifetime_model': '/dashboard/lifetime-model/',
    'enterprise_client': '/dashboard/enterprise/',
    'enterprise_model': '/dashboard/enterprise-model/',
    'backoffice_admin': '/dashboard/backoffice/',
    'api_developer': '/dashboard/api/',
    'mcp_admin': '/dashboard/mcp-hub/',
    'watsonx_user': '/dashboard/watsonx/'
  },
  
  // Login page URLs for each role type
  loginUrls: {
    'dws_iq_mobile': '/login/dws-iq-mobile/',
    'store_viewer': '/login/store/',
    'dws_iq_standard': '/login/dws-iq/',
    'community_user': '/login/onelifetime/',
    'lifetime_model': '/login/lifetime-model/',
    'enterprise_client': '/login/enterprise/',
    'enterprise_model': '/login/enterprise-model/',
    'backoffice_admin': '/login/backoffice/',
    'api_developer': '/login/api/',
    'mcp_admin': '/login/mcp-hub/',
    'watsonx_user': '/login/watsonx/'
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
