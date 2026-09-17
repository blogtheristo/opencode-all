/**
 * ProfileMenu Component
 * User avatar with dropdown for logged-in dashboard navigation.
 * DWS IQ Dashboard Profile Menu Standard v1.0 — see DWS_BRAND_STANDARD.md § 17
 */

import { useState, useRef, useEffect } from 'react';
import type { User } from '@supabase/supabase-js';

interface ProfileMenuProps {
  user: User | null;
  onSignOut: () => Promise<{ error: unknown }>;
  onNavigate?: (view: string) => void;
}

function getInitials(user: User | null): string {
  const name = user?.user_metadata?.full_name as string | undefined;
  if (name) {
    return name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }
  const email = user?.email ?? '';
  return email.slice(0, 2).toUpperCase();
}

export function ProfileMenu({ user, onSignOut, onNavigate }: ProfileMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const initials = getInitials(user);
  const displayName =
    (user?.user_metadata?.full_name as string | undefined) || user?.email || 'User';
  const email = user?.email || '';

  const menuItem =
    'flex items-center gap-3 w-full px-4 py-2 text-sm text-foreground hover:bg-background transition-colors text-left';

  const handleNav = (view: string) => {
    setOpen(false);
    onNavigate?.(view);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Open profile menu"
        className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      >
        {/* Avatar circle with initials */}
        <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white text-sm font-semibold select-none ring-2 ring-white shadow-sm">
          {initials}
        </div>
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Profile menu"
          className="absolute right-0 mt-2 w-56 bg-surface rounded-xl shadow-lg border border-border py-1 z-50"
        >
          {/* User identity header */}
          <div className="px-4 py-3 border-b border-border">
            <p className="text-sm font-semibold text-foreground truncate">{displayName}</p>
            <p className="text-xs text-fg-muted truncate">{email}</p>
          </div>

          {/* Navigation items */}
          <div className="py-1">
            <button
              role="menuitem"
              className={menuItem}
              onClick={() => handleNav('dashboard')}
            >
              <svg className="w-4 h-4 text-fg-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Dashboard
            </button>
            <button
              role="menuitem"
              className={menuItem}
              onClick={() => handleNav('agents')}
            >
              <svg className="w-4 h-4 text-fg-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
              </svg>
              Agent Monitor
            </button>
            <button
              role="menuitem"
              className={menuItem}
              onClick={() => handleNav('billing')}
            >
              <svg className="w-4 h-4 text-fg-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Billing
            </button>
            <button
              role="menuitem"
              className={menuItem}
              onClick={() => handleNav('settings')}
            >
              <svg className="w-4 h-4 text-fg-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </button>
          </div>

          {/* Destructive actions */}
          <div className="border-t border-border py-1">
            <button
              role="menuitem"
              onClick={async () => {
                setOpen(false);
                await onSignOut();
              }}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
