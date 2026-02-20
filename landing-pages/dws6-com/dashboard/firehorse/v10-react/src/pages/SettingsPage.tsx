/**
 * Settings Page
 * User profile, notification preferences, API key management,
 * theme toggle, language/locale selector, and data export.
 */

import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

type Theme = 'dark' | 'light';
type Locale = 'en' | 'fi' | 'de' | 'sv';

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
  created_at: string;
  last_used: string | null;
}

const LOCALE_OPTIONS: { value: Locale; label: string; flag: string }[] = [
  { value: 'en', label: 'English', flag: 'GB' },
  { value: 'fi', label: 'Suomi', flag: 'FI' },
  { value: 'de', label: 'Deutsch', flag: 'DE' },
  { value: 'sv', label: 'Svenska', flag: 'SE' },
];

export function SettingsPage() {
  // User profile state
  const [profile, setProfile] = useState<UserProfile>({
    fullName: '',
    email: '',
    organization: '',
    role: 'User',
  });

  // Notification preferences
  const [notifications, setNotifications] = useState<NotificationPrefs>({
    emailAlerts: true,
    complianceDeadlines: true,
    carbonThresholds: false,
    reportReady: true,
    weeklyDigest: true,
  });

  // API keys
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: 'key-1',
      name: 'Production Dashboard',
      prefix: 'dws_prod_****',
      created_at: '2025-10-15T10:00:00Z',
      last_used: '2025-12-20T14:30:00Z',
    },
  ]);
  const [newKeyName, setNewKeyName] = useState('');

  // Theme and locale
  const [theme, setTheme] = useState<Theme>('dark');
  const [locale, setLocale] = useState<Locale>('en');

  // UI state
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const handleProfileChange = useCallback((field: keyof UserProfile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleNotificationToggle = useCallback((field: keyof NotificationPrefs) => {
    setNotifications((prev) => ({ ...prev, [field]: !prev[field] }));
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

  const handleGenerateApiKey = useCallback(() => {
    if (!newKeyName.trim()) return;

    const key: ApiKey = {
      id: `key-${Date.now()}`,
      name: newKeyName.trim(),
      prefix: `dws_${newKeyName.trim().slice(0, 4).toLowerCase()}_****`,
      created_at: new Date().toISOString(),
      last_used: null,
    };

    setApiKeys((prev) => [...prev, key]);
    setNewKeyName('');
  }, [newKeyName]);

  const handleRevokeApiKey = useCallback((keyId: string) => {
    setApiKeys((prev) => prev.filter((k) => k.id !== keyId));
  }, []);

  const handleExportData = useCallback(async (format: 'csv' | 'json') => {
    setExporting(true);
    // Simulate export generation delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setExporting(false);
    // In production this would trigger a download from the API
    const url = `${import.meta.env.VITE_API_URL || ''}/v1/export?format=${format}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-sm text-gray-400 mt-1">Manage your account, preferences, and integrations</p>
        </div>

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

          {/* Existing keys */}
          {apiKeys.length > 0 && (
            <div className="space-y-2 mb-4">
              {apiKeys.map((key) => (
                <div key={key.id} className="flex items-center justify-between bg-gray-800/50 rounded-lg px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-white">{key.name}</p>
                    <p className="text-xs text-gray-500 font-mono">{key.prefix}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500">
                      {key.last_used
                        ? `Last used ${new Date(key.last_used).toLocaleDateString('en-GB')}`
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
              disabled={!newKeyName.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Generate
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
                    onClick={() => setTheme(t)}
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
                onChange={(e) => setLocale(e.target.value as Locale)}
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
          <h2 className="text-lg font-semibold text-white mb-2">Data Export</h2>
          <p className="text-xs text-gray-400 mb-4">
            Export your portfolio data for external analysis or regulatory submissions.
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
