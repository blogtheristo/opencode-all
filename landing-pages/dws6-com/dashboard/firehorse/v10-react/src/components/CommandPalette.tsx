/**
 * Command Palette (Ctrl+K / Cmd+K)
 * Global search overlay for agents, pages, and actions.
 * MVP Feature #5
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface CommandItem {
  id: string;
  label: string;
  category: 'page' | 'agent' | 'action';
  description?: string;
  path?: string;
  action?: () => void;
}

const COMMANDS: CommandItem[] = [
  // Pages
  { id: 'nav-dashboard', label: 'Dashboard', category: 'page', description: 'Main portfolio view', path: '/' },
  { id: 'nav-agents', label: 'Agent Monitor', category: 'page', description: 'View all agents', path: '/agents' },
  { id: 'nav-health', label: 'System Health', category: 'page', description: 'API & service status', path: '/health' },
  { id: 'nav-settings', label: 'Settings', category: 'page', description: 'Profile & preferences', path: '/settings' },
  { id: 'nav-carbon', label: 'Carbon Tracking', category: 'page', description: 'Emissions monitoring', path: '/carbon' },
  { id: 'nav-reports', label: 'Reports', category: 'page', description: 'View & export reports', path: '/reports' },
  { id: 'nav-templates', label: 'Templates', category: 'page', description: 'Report templates', path: '/templates' },
  { id: 'nav-billing', label: 'Billing', category: 'page', description: 'Plan & usage', path: '/billing' },
  // Agents
  { id: 'agent-compliance', label: 'Compliance Agent', category: 'agent', description: 'CSRD / ETS / CBAM scoring' },
  { id: 'agent-sitesense', label: 'SiteSense', category: 'agent', description: 'Construction site safety' },
  { id: 'agent-material', label: 'Material Oracle', category: 'agent', description: 'Carbon footprint calculator' },
  { id: 'agent-seo', label: 'SEO Audit', category: 'agent', description: 'Site SEO assessment' },
  { id: 'agent-emissions', label: 'Emissions Analyst', category: 'agent', description: 'GHG accounting' },
  { id: 'agent-logistics', label: 'Logistics Agent', category: 'agent', description: 'Fleet & route optimization' },
  { id: 'agent-quality', label: 'Quality Gate', category: 'agent', description: 'Product/batch compliance' },
  { id: 'agent-schedule', label: 'Schedule Genius', category: 'agent', description: 'Calendar optimization' },
  // Actions
  { id: 'act-export-csv', label: 'Export CSV', category: 'action', description: 'Download compliance report as CSV' },
  { id: 'act-export-json', label: 'Export JSON', category: 'action', description: 'Download compliance report as JSON' },
];

const CATEGORY_LABELS: Record<string, string> = {
  page: 'Navigate',
  agent: 'Agents',
  action: 'Actions',
};

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Ctrl+K / Cmd+K to toggle
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setOpen(false);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const filtered = query.trim()
    ? COMMANDS.filter((c) =>
        c.label.toLowerCase().includes(query.toLowerCase()) ||
        c.description?.toLowerCase().includes(query.toLowerCase())
      )
    : COMMANDS;

  // Group by category
  const grouped = filtered.reduce<Record<string, CommandItem[]>>((acc, item) => {
    (acc[item.category] ||= []).push(item);
    return acc;
  }, {});

  const flatFiltered = Object.values(grouped).flat();

  const executeCommand = useCallback((item: CommandItem) => {
    setOpen(false);
    if (item.path) {
      navigate(item.path);
    } else if (item.action) {
      item.action();
    } else if (item.category === 'agent') {
      navigate('/agents');
    }
  }, [navigate]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, flatFiltered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && flatFiltered[selectedIndex]) {
      executeCommand(flatFiltered[selectedIndex]);
    }
  }, [flatFiltered, selectedIndex, executeCommand]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* Palette */}
      <div className="relative max-w-lg mx-auto mt-[15vh]">
        <div className="bg-surface rounded-xl shadow-2xl border border-border overflow-hidden">
          {/* Search input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
            <span className="text-fg-muted text-sm">🔎</span>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
              onKeyDown={handleKeyDown}
              placeholder="Search pages, agents, actions..."
              className="flex-1 text-sm text-foreground placeholder-fg-muted outline-none bg-transparent"
            />
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-border text-fg-muted rounded border border-border">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-80 overflow-y-auto py-2">
            {flatFiltered.length === 0 && (
              <p className="text-center text-sm text-fg-muted py-6">No results found</p>
            )}

            {Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <p className="px-4 py-1 text-[10px] font-semibold text-fg-muted uppercase tracking-wider">
                  {CATEGORY_LABELS[category] || category}
                </p>
                {items.map((item) => {
                  const globalIdx = flatFiltered.indexOf(item);
                  return (
                    <button
                      key={item.id}
                      onClick={() => executeCommand(item)}
                      onMouseEnter={() => setSelectedIndex(globalIdx)}
                      className={`w-full text-left px-4 py-2 flex items-center gap-3 transition-colors ${
                        globalIdx === selectedIndex
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-foreground hover:bg-background'
                      }`}
                    >
                      <span className="text-sm font-medium">{item.label}</span>
                      {item.description && (
                        <span className="text-xs text-fg-muted truncate">{item.description}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-border flex items-center gap-4 text-[10px] text-fg-muted">
            <span><kbd className="font-mono bg-border px-1 rounded">&uarr;&darr;</kbd> navigate</span>
            <span><kbd className="font-mono bg-border px-1 rounded">&crarr;</kbd> select</span>
            <span><kbd className="font-mono bg-border px-1 rounded">esc</kbd> close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
