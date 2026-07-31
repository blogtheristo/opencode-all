/**
 * HamburgerMenu Component
 * Mobile-first slide-out navigation for the DWS IQ logged-in dashboard.
 * DWS IQ Dashboard Profile Menu Standard v1.0 — see DWS_BRAND_STANDARD.md § 17
 */

import { useState, useEffect } from 'react';
import type { User } from '@supabase/supabase-js';

type SidePanel = 'chat' | 'meeting' | 'repo' | null;
type AppView = 'dashboard' | 'agents';

interface HamburgerMenuProps {
  user: User | null;
  appView: AppView;
  sidePanel: SidePanel;
  onSetAppView: (view: AppView) => void;
  onSetSidePanel: (panel: SidePanel) => void;
  onSignOut: () => Promise<{ error: unknown }>;
  onNavigate?: (view: string) => void;
}

function getInitials(user: User | null): string {
  const name = user?.user_metadata?.full_name as string | undefined;
  if (name) {
    return name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
  }
  return (user?.email ?? '').slice(0, 2).toUpperCase();
}

export function HamburgerMenu({
  user,
  appView,
  sidePanel,
  onSetAppView,
  onSetSidePanel,
  onSignOut,
  onNavigate,
}: HamburgerMenuProps) {
  const [open, setOpen] = useState(false);

  // Lock body scroll while panel is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const close = () => setOpen(false);

  const initials = getInitials(user);
  const displayName =
    (user?.user_metadata?.full_name as string | undefined) || user?.email || 'User';
  const email = user?.email || '';

  const navItem = (active: boolean) =>
    `flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
      active
        ? 'bg-primary-50 text-primary-700'
        : 'text-gray-700 hover:bg-gray-50'
    }`;

  return (
    <>
      {/* Hamburger button — visible on mobile only */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <span className="block w-5 h-0.5 bg-gray-600 rounded-full" />
        <span className="block w-5 h-0.5 bg-gray-600 rounded-full" />
        <span className="block w-5 h-0.5 bg-gray-600 rounded-full" />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          aria-hidden="true"
          onClick={close}
        />
      )}

      {/* Slide-out panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`fixed top-0 right-0 h-full w-72 bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out md:hidden ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Panel header with close button */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          <span className="font-semibold text-gray-900 text-sm">DWS IQ Dashboard</span>
          <button
            onClick={close}
            aria-label="Close menu"
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* User identity strip */}
        <div className="flex items-center gap-3 px-4 py-4 bg-gray-50 border-b border-gray-100">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0 ring-2 ring-white shadow-sm">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{displayName}</p>
            <p className="text-xs text-gray-500 truncate">{email}</p>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          <button
            className={navItem(appView === 'dashboard' && !sidePanel)}
            onClick={() => { onSetAppView('dashboard'); onSetSidePanel(null); close(); }}
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </button>

          <button
            className={navItem(appView === 'agents')}
            onClick={() => { onSetAppView('agents'); close(); }}
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
            </svg>
            Agent Monitor
          </button>

          <button
            className={navItem(appView === 'dashboard' && sidePanel === 'chat')}
            onClick={() => {
              onSetAppView('dashboard');
              onSetSidePanel(sidePanel === 'chat' ? null : 'chat');
              close();
            }}
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            AI Assistant
          </button>

          <button
            className={navItem(appView === 'dashboard' && sidePanel === 'meeting')}
            onClick={() => {
              onSetAppView('dashboard');
              onSetSidePanel(sidePanel === 'meeting' ? null : 'meeting');
              close();
            }}
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Meeting
          </button>

          <button
            className={navItem(false)}
            onClick={() => { onNavigate?.('memory'); close(); }}
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
            </svg>
            Memory
          </button>

          <button
            className={navItem(false)}
            onClick={() => { onNavigate?.('firehorse'); close(); }}
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Firehorse
          </button>

          <button
            className={navItem(false)}
            onClick={() => { onNavigate?.('health'); close(); }}
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            System Health
          </button>

          <div className="border-t border-gray-100 pt-2 mt-2">
            <button
              className={navItem(false)}
              onClick={() => { onNavigate?.('billing'); close(); }}
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Billing
            </button>
            <button
              className={navItem(false)}
              onClick={() => { onNavigate?.('settings'); close(); }}
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </button>
          </div>
        </nav>

        {/* Sign out — pinned to bottom */}
        <div className="px-3 py-4 border-t border-gray-100">
          <button
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            onClick={async () => { close(); await onSignOut(); }}
          >
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
}
