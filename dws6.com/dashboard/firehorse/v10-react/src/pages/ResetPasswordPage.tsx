/**
 * ResetPasswordPage - DWS IQ 6 Password Reset
 * Email-based password reset with Supabase Auth
 */

import { useState, type FormEvent } from 'react';
import { useAuth } from '../hooks/useAuth';

interface ResetPasswordPageProps {
  onBackToLogin?: () => void;
}

export function ResetPasswordPage({ onBackToLogin }: ResetPasswordPageProps) {
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSubmitting(true);

    const { error: resetError } = await resetPassword(email);

    if (resetError) {
      setError(resetError.message);
    } else {
      setSuccess(true);
    }
    setSubmitting(false);
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
          <p className="text-fg-muted text-sm mt-1">Reset Your Password</p>
        </div>

        {/* Card */}
        <div className="bg-surface border border-border rounded-2xl p-8">
          {success ? (
            <div className="text-center">
              <div className="w-12 h-12 bg-green-900/40 border border-green-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-white mb-2">Check your email</h2>
              <p className="text-fg-muted text-sm mb-6">
                We sent a password reset link to <span className="text-white">{email}</span>.
                Click the link in the email to set a new password.
              </p>
              {onBackToLogin && (
                <button
                  type="button"
                  onClick={onBackToLogin}
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Back to sign in
                </button>
              )}
            </div>
          ) : (
            <>
              <p className="text-fg-muted text-sm mb-6">
                Enter the email address associated with your account. We will send you a link to reset your password.
              </p>

              {/* Error message */}
              {error && (
                <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-300 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="reset-email" className="block text-sm font-medium text-fg-muted mb-1">
                    Email
                  </label>
                  <input
                    id="reset-email"
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-fg-muted/10 border border-border rounded-lg text-white placeholder-fg-muted focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="you@company.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-medium rounded-lg transition-colors"
                >
                  {submitting ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>

              {onBackToLogin && (
                <button
                  type="button"
                  onClick={onBackToLogin}
                  className="w-full mt-4 text-sm text-fg-muted hover:text-fg-muted transition-colors"
                >
                  Back to sign in
                </button>
              )}
            </>
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
