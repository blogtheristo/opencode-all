/**
 * useSettings Hook — Persist user settings to Supabase
 *
 * Syncs theme, locale, and notification preferences to Supabase user_settings table.
 * Falls back to localStorage when Supabase is unavailable.
 *
 * Code-Version: 1.0.0
 * Introduced-In: PR-912
 * Date: 2026-03-27
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

type Theme = 'dark' | 'light';
type Locale = 'en' | 'fi' | 'de' | 'sv';

interface NotificationPrefs {
  emailAlerts: boolean;
  complianceDeadlines: boolean;
  carbonThresholds: boolean;
  reportReady: boolean;
  weeklyDigest: boolean;
}

interface UserSettings {
  theme: Theme;
  locale: Locale;
  notifications: NotificationPrefs;
}

const DEFAULT_SETTINGS: UserSettings = {
  theme: 'dark',
  locale: 'en',
  notifications: {
    emailAlerts: true,
    complianceDeadlines: true,
    carbonThresholds: false,
    reportReady: true,
    weeklyDigest: true,
  },
};

const SETTINGS_TABLE = 'user_settings';
const LS_KEY = 'dws_user_settings';

interface UseSettingsReturn {
  settings: UserSettings;
  updateTheme: (theme: Theme) => void;
  updateLocale: (locale: Locale) => void;
  toggleNotification: (key: keyof NotificationPrefs) => void;
  loading: boolean;
  synced: boolean;
}

export function useSettings(): UseSettingsReturn {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [synced, setSynced] = useState(false);

  // Load settings on mount
  useEffect(() => {
    async function load() {
      // Load from localStorage first (instant)
      try {
        const cached = localStorage.getItem(LS_KEY);
        if (cached) {
          setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(cached) });
        }
        // Also check legacy keys
        const legacyTheme = localStorage.getItem('dws_theme') as Theme | null;
        const legacyLocale = localStorage.getItem('dws_locale') as Locale | null;
        const legacyNotifs = localStorage.getItem('dws_notification_prefs');
        if (legacyTheme || legacyLocale || legacyNotifs) {
          setSettings(prev => ({
            ...prev,
            ...(legacyTheme ? { theme: legacyTheme } : {}),
            ...(legacyLocale ? { locale: legacyLocale } : {}),
            ...(legacyNotifs ? { notifications: { ...prev.notifications, ...JSON.parse(legacyNotifs) } } : {}),
          }));
        }
      } catch { /* ignore parse errors */ }

      // Then try Supabase (authoritative)
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);

          const { data, error } = await supabase
            .from(SETTINGS_TABLE)
            .select('theme, locale, notifications')
            .eq('user_id', user.id)
            .single();

          if (!error && data) {
            const merged: UserSettings = {
              theme: (data.theme as Theme) || DEFAULT_SETTINGS.theme,
              locale: (data.locale as Locale) || DEFAULT_SETTINGS.locale,
              notifications: {
                ...DEFAULT_SETTINGS.notifications,
                ...(data.notifications as Partial<NotificationPrefs> || {}),
              },
            };
            setSettings(merged);
            localStorage.setItem(LS_KEY, JSON.stringify(merged));
            setSynced(true);
          }
        }
      } catch {
        // Supabase unavailable — localStorage settings are fine
      }

      setLoading(false);
    }

    load();
  }, []);

  // Persist to both localStorage and Supabase
  const persist = useCallback(async (updated: UserSettings) => {
    // Always save to localStorage (instant)
    localStorage.setItem(LS_KEY, JSON.stringify(updated));
    // Legacy keys for backward compatibility
    localStorage.setItem('dws_theme', updated.theme);
    localStorage.setItem('dws_locale', updated.locale);
    localStorage.setItem('dws_notification_prefs', JSON.stringify(updated.notifications));

    // Persist to Supabase if authenticated
    if (userId) {
      try {
        const { error } = await supabase
          .from(SETTINGS_TABLE)
          .upsert({
            user_id: userId,
            theme: updated.theme,
            locale: updated.locale,
            notifications: updated.notifications,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id' });

        if (!error) setSynced(true);
      } catch {
        // Supabase unavailable — localStorage is the fallback
      }
    }
  }, [userId]);

  const updateTheme = useCallback((theme: Theme) => {
    setSettings(prev => {
      const updated = { ...prev, theme };
      persist(updated);
      return updated;
    });
  }, [persist]);

  const updateLocale = useCallback((locale: Locale) => {
    setSettings(prev => {
      const updated = { ...prev, locale };
      persist(updated);
      return updated;
    });
  }, [persist]);

  const toggleNotification = useCallback((key: keyof NotificationPrefs) => {
    setSettings(prev => {
      const updated = {
        ...prev,
        notifications: { ...prev.notifications, [key]: !prev.notifications[key] },
      };
      persist(updated);
      return updated;
    });
  }, [persist]);

  return { settings, updateTheme, updateLocale, toggleNotification, loading, synced };
}
