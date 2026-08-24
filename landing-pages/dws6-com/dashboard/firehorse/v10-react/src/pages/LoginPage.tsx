/**
 * LoginPage - DWS IQ 6 Authentication
 * Sign-in and registration with Supabase Auth
 */

import { useState, type FormEvent } from 'react';
import { useAuth } from '../hooks/useAuth';

type AuthTab = 'signin' | 'register';

interface LoginPageProps {
  onResetPassword?: () => void;
}

export function LoginPage({ onResetPassword }: LoginPageProps) {
  const { signIn, signUp, loading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<AuthTab>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [orgName, setOrgName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function switchTab(tab: AuthTab) {
    setActiveTab(tab);
    setError(null);
    setSuccess(null);
  }

  async function handleSignIn(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const { error: authError } = await signIn({ email, password });

    if (authError) {
      setError(authError.message);
    }
    setSubmitting(false);
  }

  async function handleSignUp(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      setSubmitting(false);
      return;
    }

    const { error: authError } = await signUp({
      email,
      password,
      fullName,
      orgName,
    });

    if (authError) {
      setError(authError.message);
    } else {
      setSuccess('Account created. Check your email to confirm your address.');
    }
    setSubmitting(false);
  }

  if (authLoading) {
    return (
      <div className="min-h-dvh bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl mb-4">
            <span className="text-white font-bold text-2xl">D</span>
          </div>
          <h1 className="text-2xl font-bold text-white">DWS IQ 6</h1>
          <p className="text-fg-muted text-sm mt-1">Climate Intelligence Platform</p>
        </div>

        {/* Card */}
        <div className="bg-surface border border-border rounded-2xl p-8">
          {/* Tabs */}
          <div className="flex mb-6 bg-fg-muted/10 rounded-lg p-1">
            <button
              type="button"
              onClick={() => switchTab('signin')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'signin'
                  ? 'bg-fg-muted/20 text-white'
                  : 'text-fg-muted hover:text-fg-muted'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => switchTab('register')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'register'
                  ? 'bg-fg-muted/20 text-white'
                  : 'text-fg-muted hover:text-fg-muted'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Success message */}
          {success && (
            <div className="mb-4 p-3 bg-green-900/30 border border-green-800 rounded-lg text-green-300 text-sm">
              {success}
            </div>
          )}

          {/* Sign In Form */}
          {activeTab === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label htmlFor="signin-email" className="block text-sm font-medium text-fg-muted mb-1">
                  Email
                </label>
                <input
                  id="signin-email"
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-fg-muted/10 border border-border rounded-lg text-white placeholder-fg-muted focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="you@company.com"
                />
              </div>

              <div>
                <label htmlFor="signin-password" className="block text-sm font-medium text-fg-muted mb-1">
                  Password
                </label>
                <input
                  id="signin-password"
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-fg-muted/10 border border-border rounded-lg text-white placeholder-fg-muted focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-medium rounded-lg transition-colors"
              >
                {submitting ? 'Signing in...' : 'Sign In'}
              </button>

              {onResetPassword && (
                <button
                  type="button"
                  onClick={onResetPassword}
                  className="w-full text-sm text-fg-muted hover:text-fg-muted transition-colors"
                >
                  Forgot your password?
                </button>
              )}
            </form>
          )}

          {/* Registration Form */}
          {activeTab === 'register' && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label htmlFor="register-name" className="block text-sm font-medium text-fg-muted mb-1">
                  Full Name
                </label>
                <input
                  id="register-name"
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-fg-muted/10 border border-border rounded-lg text-white placeholder-fg-muted focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Jane Doe"
                />
              </div>

              <div>
                <label htmlFor="register-email" className="block text-sm font-medium text-fg-muted mb-1">
                  Email
                </label>
                <input
                  id="register-email"
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-fg-muted/10 border border-border rounded-lg text-white placeholder-fg-muted focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="you@company.com"
                />
              </div>

              <div>
                <label htmlFor="register-password" className="block text-sm font-medium text-fg-muted mb-1">
                  Password
                </label>
                <input
                  id="register-password"
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-fg-muted/10 border border-border rounded-lg text-white placeholder-fg-muted focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Minimum 8 characters"
                />
              </div>

              <div>
                <label htmlFor="register-org" className="block text-sm font-medium text-fg-muted mb-1">
                  Organization
                </label>
                <input
                  id="register-org"
                  type="text"
                  required
                  value={orgName}
                  onChange={e => setOrgName(e.target.value)}
                  className="w-full px-3 py-2 bg-fg-muted/10 border border-border rounded-lg text-white placeholder-fg-muted focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Acme Corp"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-medium rounded-lg transition-colors"
              >
                {submitting ? 'Creating account...' : 'Create Account'}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-fg-muted text-xs mt-6">
          &copy; 2026 DWS IQ &middot; Climate Intelligence Platform
        </p>
      </div>
    </div>
  );
}
