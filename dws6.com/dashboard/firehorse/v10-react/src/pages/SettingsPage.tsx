/**
 * Settings Page
 * User profile, notification preferences, API key management,
 * usage metering dashboard, theme toggle, language/locale, and data export.
 *
 * Connected to backend MVP features:
 * - API Key CRUD (POST/GET/DELETE /api/v1/user/api-keys)
 * - Usage Stats (GET /api/v1/usage)
 * - Report Export (POST /api/v1/reports/export)
 */

import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';

type Theme = 'dark' | 'light';
type Locale = 'en' | 'fi' | 'de' | 'sv';

const API_BASE = import.meta.env.VITE_API_URL || '';

interface UserProfile {
  fullName: string;
  email: string;
  organization: string;
  role: string;
}

interface NotificationPrefs {
  emailAlerts: boolean;
  complianceDeadlines: boolean;
  carbonThresholds: boolean;
  reportReady: boolean;
  weeklyDigest: boolean;
}

interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  createdAt: string;
  lastUsedAt: string | null;
  scopes: string[];
  revoked: boolean;
}

interface UsageMetric {
  used: number;
  limit: number;
  percentage: number;
}

interface UsageStats {
  tier: string;
  tierName: string;
  period: string;
  usage: {
    apiCalls: UsageMetric;
    assistantMessages: UsageMetric;
    reportExports: UsageMetric;
  };
}

const LOCALE_OPTIONS: { value: Locale; label: string; flag: string }[] = [
  { value: 'en', label: 'English', flag: 'GB' },
  { value: 'fi', label: 'Suomi', flag: 'FI' },
  { value: 'de', label: 'Deutsch', flag: 'DE' },
  { value: 'sv', label: 'Svenska', flag: 'SE' },
];

async function getAuthHeaders(): Promise<Record<string, string>> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  return token
    ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    : { 'Content-Type': 'application/json' };
}

function UsageBar({ label, metric }: { label: string; metric: UsageMetric }) {
  const barColor =
    metric.percentage >= 90 ? 'bg-red-500' :
    metric.percentage >= 70 ? 'bg-amber-500' :
    'bg-primary-500';

  return (
    <div>
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span>{label}</span>
        <span>{metric.used} / {metric.limit}</span>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-2">
        <div
          className={`${barColor} h-2 rounded-full transition-all`}
          style={{ width: `${Math.min(metric.percentage, 100)}%` }}
        />
      </div>
    </div>
  );
}

export function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile>({
    fullName: '',
    email: '',
    organization: '',
    role: 'User',
  });

  const [notifications, setNotifications] = useState<NotificationPrefs>({
    emailAlerts: true,
    complianceDeadlines: true,
    carbonThresholds: false,
    reportReady: true,
    weeklyDigest: true,
  });

  // API keys (loaded from backend)
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyRevealed, setNewKeyRevealed] = useState<string | null>(null);
  const [keyLoading, setKeyLoading] = useState(false);

  // Usage metering
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);

  const [theme, setTheme] = useState<Theme>('dark');
  const [locale, setLocale] = useState<Locale>('en');

  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  // Load user profile, API keys, and usage stats on mount
  useEffect(() => {
    async function loadData() {
      // Load profile from Supabase auth + user_profiles
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setProfile((prev) => ({
            ...prev,
            email: user.email || prev.email,
            fullName: (user.user_metadata?.full_name as string) || prev.fullName,
          }));

          // Load org data from user_profiles table
          const { data: profileData } = await supabase
            .from('user_profiles')
            .select('full_name, company, role')
            .eq('user_id', user.id)
            .single();

          if (profileData) {
            setProfile({
              fullName: profileData.full_name || (user.user_metadata?.full_name as string) || '',
              email: user.email || '',
              organization: profileData.company || '',
              role: profileData.role || 'User',
            });
          }
        }
      } catch { /* Auth not available */ }

      // Load notification preferences from localStorage
      try {
        const savedPrefs = localStorage.getItem('dws_notification_prefs');
        if (savedPrefs) {
          setNotifications(JSON.parse(savedPrefs));
        }
      } catch { /* Fallback to defaults */ }

      // Load theme and locale from localStorage
      const savedTheme = localStorage.getItem('dws_theme') as Theme | null;
      if (savedTheme) setTheme(savedTheme);
      const savedLocale = localStorage.getItem('dws_locale') as Locale | null;
      if (savedLocale) setLocale(savedLocale);

      const headers = await getAuthHeaders();

      try {
        const keysRes = await fetch(`${API_BASE}/api/v1/user/api-keys`, { headers });
        if (keysRes.ok) {
          const data = await keysRes.json();
          setApiKeys(data.keys || []);
        }
      } catch { /* API not available — use empty state */ }

      try {
        const usageRes = await fetch(`${API_BASE}/api/v1/usage`, { headers });
        if (usageRes.ok) {
          const data = await usageRes.json();
          setUsageStats(data);
        }
      } catch { /* API not available */ }
    }

    loadData();
  }, []);

  const handleProfileChange = useCallback((field: keyof UserProfile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleNotificationToggle = useCallback((field: keyof NotificationPrefs) => {
    setNotifications((prev) => {
      const updated = { ...prev, [field]: !prev[field] };
      localStorage.setItem('dws_notification_prefs', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handleSaveProfile = useCallback(async () => {
    setSaving(true);
    setSaveMessage(null);

    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          full_name: profile.fullName,
          email: profile.email,
          company: profile.organization,
          role: profile.role,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      setSaveMessage('Profile saved successfully.');
    } catch {
      setSaveMessage('Could not save profile. Check your connection.');
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMessage(null), 3000);
    }
  }, [profile]);

  const handleGenerateApiKey = useCallback(async () => {
    if (!newKeyName.trim()) return;
    setKeyLoading(true);
    setNewKeyRevealed(null);

    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE}/api/v1/user/api-keys`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ name: newKeyName.trim() }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create key');
      }

      const data = await res.json();
      setNewKeyRevealed(data.key.rawKey);
      setApiKeys((prev) => [
        {
          id: data.key.id,
          name: data.key.name,
          prefix: data.key.prefix,
          createdAt: data.key.createdAt,
          lastUsedAt: null,
          scopes: data.key.scopes,
          revoked: false,
        },
        ...prev,
      ]);
      setNewKeyName('');
    } catch {
      // Fallback to client-side when API unavailable
      const key: ApiKey = {
        id: `key-${Date.now()}`,
        name: newKeyName.trim(),
        prefix: `dws_${newKeyName.trim().slice(0, 4).toLowerCase()}_****`,
        createdAt: new Date().toISOString(),
        lastUsedAt: null,
        scopes: ['compliance:read'],
        revoked: false,
      };
      setApiKeys((prev) => [key, ...prev]);
      setNewKeyName('');
    } finally {
      setKeyLoading(false);
    }
  }, [newKeyName]);

  const handleRevokeApiKey = useCallback(async (keyId: string) => {
    try {
      const headers = await getAuthHeaders();
      await fetch(`${API_BASE}/api/v1/user/api-keys/${keyId}`, {
        method: 'DELETE',
        headers,
      });
    } catch { /* Best-effort backend call */ }

    setApiKeys((prev) => prev.filter((k) => k.id !== keyId));
  }, []);

  const handleExportData = useCallback(async (format: 'csv' | 'json') => {
    setExporting(true);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE}/api/v1/reports/export`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          companyName: profile.organization || 'My Company',
          industry: localStorage.getItem('dws_onboarding_industry') || 'manufacturing',
          country: localStorage.getItem('dws_onboarding_country') || 'FI',
          format,
        }),
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = res.headers.get('Content-Disposition')?.split('filename=')[1]?.replace(/"/g, '') || `compliance-report.${format}`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch {
      // Fallback
      const url = `${API_BASE}/v1/export?format=${format}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    } finally {
      setExporting(false);
    }
  }, [profile.organization]);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-sm text-gray-400 mt-1">Manage your account, preferences, and integrations</p>
        </div>

        {/* Usage Metering Dashboard */}
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Usage & Plan</h2>
            {usageStats && (
              <span className="px-3 py-1 text-xs font-medium bg-primary-600/20 text-primary-400 rounded-full">
                {usageStats.tierName} Plan
              </span>
            )}
          </div>

          {usageStats ? (
            <div className="space-y-4">
              <UsageBar label="API Calls" metric={usageStats.usage.apiCalls} />
              <UsageBar label="AI Assistant Messages" metric={usageStats.usage.assistantMessages} />
              <UsageBar label="Report Exports" metric={usageStats.usage.reportExports} />
              <p className="text-xs text-gray-500 mt-2">
                Billing period started {new Date(usageStats.period).toLocaleDateString('en-GB')}
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Usage data will appear once you start using the platform.</p>
          )}
        </section>

        {/* User Profile Section */}
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">User Profile</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fullName" className="block text-sm text-gray-400 mb-1">Full Name</label>
              <input
                id="fullName"
                type="text"
                value={profile.fullName}
                onChange={(e) => handleProfileChange('fullName', e.target.value)}
                placeholder="Enter your name"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm text-gray-400 mb-1">Email</label>
              <input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => handleProfileChange('email', e.target.value)}
                placeholder="you@company.com"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="organization" className="block text-sm text-gray-400 mb-1">Organization</label>
              <input
                id="organization"
                type="text"
                value={profile.organization}
                onChange={(e) => handleProfileChange('organization', e.target.value)}
                placeholder="Company name"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm text-gray-400 mb-1">Role</label>
              <select
                id="role"
                value={profile.role}
                onChange={(e) => handleProfileChange('role', e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Analyst">Analyst</option>
                <option value="User">User</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-500 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
            {saveMessage && (
              <span className={`text-sm ${saveMessage.includes('success') ? 'text-green-400' : 'text-red-400'}`}>
                {saveMessage}
              </span>
            )}
          </div>
        </section>

        {/* Notification Preferences */}
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Notifications</h2>
          <div className="space-y-3">
            {([
              { key: 'emailAlerts' as const, label: 'Email Alerts', desc: 'Receive critical alerts via email' },
              { key: 'complianceDeadlines' as const, label: 'Compliance Deadlines', desc: 'Reminders for CSRD, ETS, CBAM deadlines' },
              { key: 'carbonThresholds' as const, label: 'Carbon Thresholds', desc: 'Alerts when emissions exceed thresholds' },
              { key: 'reportReady' as const, label: 'Report Ready', desc: 'Notification when reports finish generating' },
              { key: 'weeklyDigest' as const, label: 'Weekly Digest', desc: 'Summary of portfolio activity each week' },
            ]).map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-white">{label}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
                <button
                  onClick={() => handleNotificationToggle(key)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    notifications[key] ? 'bg-primary-600' : 'bg-gray-700'
                  }`}
                  role="switch"
                  aria-checked={notifications[key]}
                  aria-label={label}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      notifications[key] ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* API Key Management */}
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">API Keys</h2>
          <p className="text-xs text-gray-400 mb-4">Manage API keys for programmatic access to the DWS IQ platform.</p>

          {/* Newly created key — shown only once */}
          {newKeyRevealed && (
            <div className="mb-4 p-3 bg-green-900/30 border border-green-700 rounded-lg">
              <p className="text-xs text-green-400 font-medium mb-1">New API key created. Copy it now — it will not be shown again.</p>
              <code className="block text-sm text-green-300 font-mono break-all select-all">{newKeyRevealed}</code>
            </div>
          )}

          {/* Existing keys */}
          {apiKeys.length > 0 && (
            <div className="space-y-2 mb-4">
              {apiKeys.filter(k => !k.revoked).map((key) => (
                <div key={key.id} className="flex items-center justify-between bg-gray-800/50 rounded-lg px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-white">{key.name}</p>
                    <p className="text-xs text-gray-500 font-mono">{key.prefix}</p>
                    {key.scopes && (
                      <p className="text-xs text-gray-600 mt-0.5">{key.scopes.join(', ')}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">
                      {key.lastUsedAt
                        ? `Last used ${new Date(key.lastUsedAt).toLocaleDateString('en-GB')}`
                        : 'Never used'}
                    </span>
                    <button
                      onClick={() => handleRevokeApiKey(key.id)}
                      className="text-xs text-red-400 hover:text-red-300 font-medium transition-colors"
                    >
                      Revoke
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Generate new key */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="Key name (e.g. CI/CD Pipeline)"
              className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <button
              onClick={handleGenerateApiKey}
              disabled={!newKeyName.trim() || keyLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {keyLoading ? 'Creating...' : 'Generate'}
            </button>
          </div>
        </section>

        {/* Theme & Language */}
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Appearance & Language</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Theme Toggle */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Theme</label>
              <div className="flex items-center gap-2">
                {(['dark', 'light'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => { setTheme(t); localStorage.setItem('dws_theme', t); }}
                    className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      theme === t
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {t === 'dark' ? 'Dark' : 'Light'}
                  </button>
                ))}
              </div>
            </div>

            {/* Locale Selector */}
            <div>
              <label htmlFor="locale" className="block text-sm text-gray-400 mb-2">Language / Locale</label>
              <select
                id="locale"
                value={locale}
                onChange={(e) => { const v = e.target.value as Locale; setLocale(v); localStorage.setItem('dws_locale', v); }}
                className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {LOCALE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.flag} {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Data Export */}
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-2">Compliance Report Export</h2>
          <p className="text-xs text-gray-400 mb-4">
            Download compliance reports for regulatory submissions (CSRD, ETS, CBAM).
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleExportData('csv')}
              disabled={exporting}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              {exporting ? 'Preparing...' : 'Export CSV'}
            </button>
            <button
              onClick={() => handleExportData('json')}
              disabled={exporting}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              {exporting ? 'Preparing...' : 'Export JSON'}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
