'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@/lib/auth';

type UserRole = 'owner' | 'admin' | 'member' | 'viewer';

interface RoleGuardProps {
  /**
   * Allowed roles for this content
   */
  roles: UserRole[];
  
  /**
   * Children to render if authorized
   */
  children: ReactNode;
  
  /**
   * Organization ID to check role in (optional, uses first org if not specified)
   */
  organizationId?: string;
  
  /**
   * URL to redirect to if unauthorized (default: /dashboard)
   */
  redirectTo?: string;
  
  /**
   * Content to show while checking authorization
   */
  loadingContent?: ReactNode;
  
  /**
   * Content to show if unauthorized (instead of redirect)
   */
  fallback?: ReactNode;
  
  /**
   * Whether to show fallback instead of redirecting
   */
  showFallback?: boolean;
}

/**
 * RoleGuard Component
 * 
 * Protects content based on user's role in an organization.
 * 
 * @example
 * // Only allow owners and admins
 * <RoleGuard roles={['owner', 'admin']}>
 *   <AdminSettings />
 * </RoleGuard>
 * 
 * @example
 * // Show fallback for unauthorized users
 * <RoleGuard 
 *   roles={['admin']} 
 *   showFallback 
 *   fallback={<p>You need admin access</p>}
 * >
 *   <AdminPanel />
 * </RoleGuard>
 */
export function RoleGuard({
  roles,
  children,
  organizationId,
  redirectTo = '/dashboard',
  loadingContent,
  fallback,
  showFallback = false,
}: RoleGuardProps) {
  const [status, setStatus] = useState<'loading' | 'authorized' | 'unauthorized'>('loading');
  const router = useRouter();
  const supabase = createBrowserClient();

  useEffect(() => {
    checkAuthorization();
  }, [roles, organizationId]);

  async function checkAuthorization() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        handleUnauthorized();
        return;
      }

      // Build query for organization membership
      let query = supabase
        .from('organization_members')
        .select('role')
        .eq('user_id', user.id)
        .eq('status', 'active');
      
      // Add organization filter if specified
      if (organizationId) {
        query = query.eq('organization_id', organizationId);
      }
      
      const { data, error } = await query;
      
      if (error || !data || data.length === 0) {
        handleUnauthorized();
        return;
      }

      // Check if user has any of the required roles
      const userRoles = data.map(m => m.role);
      const hasRequiredRole = roles.some(role => userRoles.includes(role));
      
      if (hasRequiredRole) {
        setStatus('authorized');
      } else {
        handleUnauthorized();
      }
    } catch (error) {
      console.error('RoleGuard authorization error:', error);
      handleUnauthorized();
    }
  }

  function handleUnauthorized() {
    setStatus('unauthorized');
    if (!showFallback) {
      router.push(redirectTo);
    }
  }

  // Loading state
  if (status === 'loading') {
    return (
      <>
        {loadingContent || (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-400"></div>
          </div>
        )}
      </>
    );
  }

  // Unauthorized state (with fallback)
  if (status === 'unauthorized') {
    if (showFallback) {
      return (
        <>
          {fallback || (
            <div className="card p-8 text-center">
              <h2 className="text-xl font-semibold text-white mb-2">Access Denied</h2>
              <p className="text-slate-400">
                You don&apos;t have permission to view this content.
              </p>
            </div>
          )}
        </>
      );
    }
    // If not showing fallback, return null (redirect is happening)
    return null;
  }

  // Authorized - render children
  return <>{children}</>;
}

/**
 * useHasRole Hook
 * 
 * Check if user has a specific role without rendering guard UI
 * 
 * @example
 * const { hasRole, loading } = useHasRole(['admin', 'owner']);
 * 
 * if (hasRole) {
 *   // Show admin button
 * }
 */
export function useHasRole(roles: UserRole[], organizationId?: string) {
  const [hasRole, setHasRole] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createBrowserClient();

  useEffect(() => {
    async function check() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setHasRole(false);
          setLoading(false);
          return;
        }

        let query = supabase
          .from('organization_members')
          .select('role')
          .eq('user_id', user.id)
          .eq('status', 'active');
        
        if (organizationId) {
          query = query.eq('organization_id', organizationId);
        }
        
        const { data, error } = await query;
        
        if (error || !data) {
          setHasRole(false);
        } else {
          const userRoles = data.map(m => m.role);
          setHasRole(roles.some(role => userRoles.includes(role)));
        }
      } catch (error) {
        setHasRole(false);
      } finally {
        setLoading(false);
      }
    }

    check();
  }, [roles, organizationId, supabase]);

  return { hasRole, loading };
}

/**
 * RequireRole Higher-Order Component
 * 
 * Wrap a component to require specific roles
 * 
 * @example
 * const AdminPage = requireRole(['admin', 'owner'])(MyAdminComponent);
 */
export function requireRole(roles: UserRole[], options?: Omit<RoleGuardProps, 'roles' | 'children'>) {
  return function<P extends object>(Component: React.ComponentType<P>) {
    return function RequireRoleWrapper(props: P) {
      return (
        <RoleGuard roles={roles} {...options}>
          <Component {...props} />
        </RoleGuard>
      );
    };
  };
}

export default RoleGuard;
