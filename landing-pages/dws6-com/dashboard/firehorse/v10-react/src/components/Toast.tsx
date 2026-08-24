/**
 * Toast Notification System
 * Context-based toast notifications with auto-dismiss.
 * MVP Feature #1
 */

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextValue {
  toast: (t: Omit<Toast, 'id'>) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

const TYPE_STYLES: Record<ToastType, { bg: string; border: string; icon: string }> = {
  success: { bg: 'bg-green-900/90', border: 'border-green-600', icon: 'check_circle' },
  error: { bg: 'bg-red-900/90', border: 'border-red-600', icon: 'error' },
  warning: { bg: 'bg-amber-900/90', border: 'border-amber-600', icon: 'warning' },
  info: { bg: 'bg-blue-900/90', border: 'border-blue-600', icon: 'info' },
};

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const style = TYPE_STYLES[toast.type];

  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), toast.duration || 4000);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onDismiss]);

  return (
    <div
      className={`${style.bg} ${style.border} border rounded-lg px-4 py-3 shadow-xl backdrop-blur-sm
        animate-[slideIn_0.3s_ease-out] max-w-sm w-full`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <span className="text-white text-lg mt-0.5">{style.icon === 'check_circle' ? '\u2713' : style.icon === 'error' ? '\u2717' : style.icon === 'warning' ? '\u26A0' : '\u2139'}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white">{toast.title}</p>
          {toast.message && <p className="text-xs text-fg-muted mt-0.5">{toast.message}</p>}
        </div>
        <button
          onClick={() => onDismiss(toast.id)}
          className="text-fg-muted hover:text-white transition-colors text-lg leading-none"
          aria-label="Dismiss"
        >
          &times;
        </button>
      </div>
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { ...t, id }]);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
