// Evidence: Tool=GitHub Copilot CLI 1.0.88 Model=openai/gpt-5.6-sol Agent=copilot Date=2026-09-27
// Audit trail: git log -- src/__tests__/dashboard-role-authorization.test.ts

import { describe, expect, it, vi } from 'vitest';

import {
  getUserRole as getPrimaryUserRole,
  resolveUserRole as resolvePrimaryRole,
} from '../../dws6.com/shared/js/supabase-client.js';
import { resolveUserRole as resolveMirrorRole } from '../../landing-pages/dws6-com/shared/js/supabase-client.js';

const resolvers = [resolvePrimaryRole, resolveMirrorRole];
const protectedRoles = ['mcp_admin', 'enterprise_client', 'investor_lobby', 'store_viewer'];

describe.each(resolvers)('dashboard privileged role resolution', (resolveUserRole) => {
  it.each(protectedRoles)('accepts server-controlled role %s', (role) => {
    expect(resolveUserRole({ app_metadata: { role } })).toBe(role);
  });

  it.each(protectedRoles)('rejects user-editable protected role %s', (role) => {
    expect(resolveUserRole({ user_metadata: { role } })).toBeNull();
  });

  it('accepts Back-Office access only after the server-controlled membership check', () => {
    const user = { user_metadata: { role: 'backoffice_admin' } };
    expect(resolveUserRole(user, true)).toBe('backoffice_admin');
    expect(resolveUserRole(user, false)).toBeNull();
  });

  it('rejects a user-editable Mission Control administrator role', () => {
    expect(resolveUserRole({ user_metadata: { role: 'hub_admin' } })).toBeNull();
  });

  it('keeps only the enumerated non-privileged onboarding role compatible', () => {
    expect(resolveUserRole({ user_metadata: { role: 'community_user' } })).toBe('community_user');
    expect(resolveUserRole({ user_metadata: { role: 'unknown_role' } })).toBeNull();
  });
});

describe('Back-Office membership lookup', () => {
  it('resolves a legacy Back-Office claim only after an active admin membership lookup', async () => {
    const user = { id: 'user-1', user_metadata: { role: 'backoffice_admin' } };
    const rpc = vi.fn().mockResolvedValue({ data: true, error: null });
    vi.stubGlobal('supabase', {
      createClient: vi.fn(() => ({
        auth: {
          getSession: vi.fn().mockResolvedValue({ data: { session: { user } }, error: null }),
          getUser: vi.fn(),
        },
        rpc,
      })),
    });

    await expect(getPrimaryUserRole()).resolves.toBe('backoffice_admin');
    expect(rpc).toHaveBeenCalledWith('is_backoffice_admin');
  });
});
