'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@/lib/auth';

interface Session {
  id: string;
  device_info: {
    browser?: string;
    os?: string;
    device?: string;
  };
  ip_address: string;
  last_active_at: string;
  is_current: boolean;
}

interface MfaFactor {
  id: string;
  factor_type: 'totp' | 'phone';
  friendly_name: string;
  status: 'verified' | 'unverified';
}

export default function SecurityPage() {
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [mfaFactors, setMfaFactors] = useState<MfaFactor[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // Password change state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  
  const supabase = createBrowserClient();

  useEffect(() => {
    loadSecurityData();
  }, []);

  async function loadSecurityData() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // Get MFA factors
      const { data: mfaData } = await supabase.auth.mfa.listFactors();
      if (mfaData) {
        setMfaFactors(mfaData.all as MfaFactor[]);
        setMfaEnabled(mfaData.all.some(f => f.status === 'verified'));
      }
      
      // Get sessions from user_sessions table
      const { data: sessionsData } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', user.id)
        .is('revoked_at', null)
        .order('last_active_at', { ascending: false });
      
      if (sessionsData) {
        setSessions(sessionsData);
      }
    }
    
    setLoading(false);
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }
    
    if (passwordForm.newPassword.length < 12) {
      setMessage({ type: 'error', text: 'Password must be at least 12 characters' });
      return;
    }
    
    setSaving(true);
    setMessage(null);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      });
      
      if (error) throw error;
      
      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordForm(false);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to update password' });
    } finally {
      setSaving(false);
    }
  }

  async function handleRevokeSession(sessionId: string) {
    if (!confirm('Are you sure you want to revoke this session?')) return;
    
    try {
      const { error } = await supabase
        .from('user_sessions')
        .update({ revoked_at: new Date().toISOString() })
        .eq('id', sessionId);
      
      if (error) throw error;
      
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      setMessage({ type: 'success', text: 'Session revoked' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to revoke session' });
    }
  }

  async function handleDisableMfa(factorId: string) {
    if (!confirm('Are you sure you want to disable two-factor authentication?')) return;
    
    try {
      const { error } = await supabase.auth.mfa.unenroll({ factorId });
      
      if (error) throw error;
      
      setMfaEnabled(false);
      setMfaFactors(prev => prev.filter(f => f.id !== factorId));
      setMessage({ type: 'success', text: 'Two-factor authentication disabled' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to disable MFA' });
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Security Settings</h1>
        <p className="text-slate-400">Manage your account security</p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-500/10 border border-green-500/30 text-green-400'
            : 'bg-red-500/10 border border-red-500/30 text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      {/* Two-Factor Authentication */}
      <div className="card p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Two-Factor Authentication</h2>
            <p className="text-slate-400 text-sm mt-1">
              Add an extra layer of security to your account
            </p>
          </div>
          <span className={`badge ${mfaEnabled ? 'badge-success' : 'badge-warning'}`}>
            {mfaEnabled ? 'Enabled' : 'Disabled'}
          </span>
        </div>

        {mfaEnabled ? (
          <div className="space-y-4">
            {mfaFactors.filter(f => f.status === 'verified').map(factor => (
              <div key={factor.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400">
                    🔐
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {factor.factor_type === 'totp' ? 'Authenticator App' : 'Phone'}
                    </p>
                    <p className="text-slate-400 text-sm">{factor.friendly_name}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDisableMfa(factor.id)}
                  className="text-red-400 text-sm hover:text-red-300"
                >
                  Disable
                </button>
              </div>
            ))}
            <a 
              href="/mfa-setup/index.html"
              className="btn-secondary px-4 py-2 inline-block text-center"
            >
              Add Another Method
            </a>
          </div>
        ) : (
          <a 
            href="/mfa-setup/index.html"
            className="btn-primary px-6 py-2 inline-block text-center"
          >
            Enable Two-Factor Authentication
          </a>
        )}
      </div>

      {/* Password */}
      <div className="card p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Password</h2>
            <p className="text-slate-400 text-sm mt-1">
              Change your account password
            </p>
          </div>
          {!showPasswordForm && (
            <button
              onClick={() => setShowPasswordForm(true)}
              className="btn-secondary px-4 py-2"
            >
              Change Password
            </button>
          )}
        </div>

        {showPasswordForm && (
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                className="input w-full"
                placeholder="Enter new password"
                minLength={12}
                required
              />
              <p className="text-xs text-slate-500 mt-1">Minimum 12 characters</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className="input w-full"
                placeholder="Confirm new password"
                required
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowPasswordForm(false)}
                className="btn-secondary px-4 py-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="btn-primary px-4 py-2 disabled:opacity-50"
              >
                {saving ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Active Sessions */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Active Sessions</h2>
        <p className="text-slate-400 text-sm mb-4">
          Devices and locations where you&apos;re currently logged in
        </p>

        {sessions.length === 0 ? (
          <p className="text-slate-500 text-center py-8">No active sessions found</p>
        ) : (
          <div className="space-y-3">
            {sessions.map(session => (
              <div key={session.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                    💻
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {session.device_info?.browser || 'Unknown Browser'}
                      {session.is_current && (
                        <span className="ml-2 badge badge-success text-xs">Current</span>
                      )}
                    </p>
                    <p className="text-slate-400 text-sm">
                      {session.device_info?.os || 'Unknown OS'} • {session.ip_address || 'Unknown IP'}
                    </p>
                    <p className="text-slate-500 text-xs">
                      Last active: {formatDate(session.last_active_at)}
                    </p>
                  </div>
                </div>
                {!session.is_current && (
                  <button
                    onClick={() => handleRevokeSession(session.id)}
                    className="text-red-400 text-sm hover:text-red-300"
                  >
                    Revoke
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
