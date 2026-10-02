// Evidence: Tool=GitHub Copilot CLI 1.0.88 Model=openai/gpt-5.6-sol Agent=copilot Date=2026-09-27
// Audit trail: git log -- src/__tests__/oauth-role-escalation.test.ts

import { beforeEach, describe, expect, it, vi } from 'vitest';

const authClient = vi.hoisted(() => {
  const eq = vi.fn().mockResolvedValue({ error: null });
  const update = vi.fn(() => ({ eq }));
  const insert = vi.fn().mockResolvedValue({ error: null });

  return {
    auth: {
      getSession: vi.fn(),
      getUser: vi.fn(),
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      signInWithOAuth: vi.fn(),
      updateUser: vi.fn(),
    },
    from: vi.fn(() => ({ insert, update })),
  };
});

const getUserRole = vi.hoisted(() => vi.fn());

vi.mock('../../dws6.com/shared/js/supabase-client.js', () => ({
  getCurrentUser: vi.fn().mockResolvedValue(null),
  getSupabaseClient: vi.fn(() => authClient),
  getUserRole,
}));

const { handleOAuthCallback, login, loginWithGoogle, register, updateUserRole } =
  await import('../../dws6.com/shared/js/auth-handler.js');

function createSessionStorage() {
  const values = new Map<string, string>();
  return {
    clear: () => values.clear(),
    getItem: (key: string) => values.get(key) ?? null,
    removeItem: (key: string) => values.delete(key),
    setItem: (key: string, value: string) => values.set(key, value),
  };
}

describe('OAuth role escalation prevention', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('window', {
      location: {
        hostname: 'dws6.com',
        origin: 'https://dws6.com',
      },
    });
    vi.stubGlobal('sessionStorage', createSessionStorage());
    authClient.auth.signInWithOAuth.mockResolvedValue({ data: {}, error: null });
    authClient.auth.signInWithPassword.mockResolvedValue({
      data: {
        session: {},
        user: { id: 'user-1', email: 'user@example.com', user_metadata: {} },
      },
      error: null,
    });
    authClient.auth.signUp.mockResolvedValue({
      data: { user: { email: 'user@example.com' } },
      error: null,
    });
    authClient.auth.getUser.mockResolvedValue({ data: { user: null }, error: null });
    getUserRole.mockResolvedValue(null);
  });

  it.each(['mcp_admin', 'enterprise_client', 'investor_lobby', 'store_viewer'])(
    'does not persist requested protected role %s during OAuth login',
    async (role) => {
      await expect(loginWithGoogle(role)).resolves.toMatchObject({ success: true });

      expect(sessionStorage.getItem('pending_oauth_role')).toBeNull();
      expect(authClient.auth.updateUser).not.toHaveBeenCalled();
    },
  );

  it('discards a forged pending role without copying it to user metadata', async () => {
    sessionStorage.setItem('pending_oauth_role', 'mcp_admin');
    authClient.auth.getSession.mockResolvedValue({
      data: {
        session: {
          user: {
            id: 'user-1',
            app_metadata: { provider: 'google' },
            user_metadata: {},
          },
        },
      },
      error: null,
    });

    await expect(handleOAuthCallback()).resolves.toMatchObject({ success: true, role: null });

    expect(sessionStorage.getItem('pending_oauth_role')).toBeNull();
    expect(authClient.auth.updateUser).not.toHaveBeenCalled();
  });

  it('ignores an extra protected-role argument during password login', async () => {
    await expect(
      Reflect.apply(login, null, ['user@example.com', 'correct-password', 'mcp_admin']),
    ).resolves.toMatchObject({ success: true });

    expect(authClient.auth.updateUser).not.toHaveBeenCalled();
  });

  it('does not put a requested role into registration metadata', async () => {
    await expect(
      register('user@example.com', 'StrongPassword1!', {
        firstName: 'Example',
        role: 'mcp_admin',
      }),
    ).resolves.toMatchObject({ success: true });

    expect(authClient.auth.signUp).toHaveBeenCalledOnce();
    const signUpRequest = authClient.auth.signUp.mock.calls[0]?.[0];
    expect(signUpRequest.options.data).not.toHaveProperty('role');
  });

  it.each(['mcp_admin', 'enterprise_client', 'investor_lobby', 'store_viewer'])(
    'refuses browser metadata assignment for protected role %s',
    async (role) => {
      await expect(updateUserRole('user-1', role)).resolves.toMatchObject({ success: false });
      expect(authClient.auth.updateUser).not.toHaveBeenCalled();
    },
  );

  it('retains the explicitly non-privileged community onboarding role', async () => {
    authClient.auth.updateUser.mockResolvedValue({ error: null });

    await expect(updateUserRole('user-1', 'community_user')).resolves.toEqual({ success: true });
    expect(authClient.auth.updateUser).toHaveBeenCalledWith({
      data: { role: 'community_user' },
    });
  });
});
