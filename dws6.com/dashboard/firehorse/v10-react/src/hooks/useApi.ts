/**
 * useApi Hook — Centralized API Fetch
 *
 * Handles loading, error, and data states with retry logic.
 * Automatically includes auth token from Supabase session.
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiOptions {
  retries?: number;
  retryDelay?: number;
}

interface UseApiReturn<T> extends ApiState<T> {
  execute: (url: string, options?: RequestInit) => Promise<T | null>;
  reset: () => void;
}

const API_BASE = import.meta.env.VITE_API_URL || '';

/**
 * Hook for making authenticated API calls with loading/error/data state.
 *
 * @example
 * const { data, loading, error, execute } = useApi<ComplianceReport>();
 * useEffect(() => { execute('/api/v1/compliance/assess', { method: 'POST', body: JSON.stringify(input) }); }, []);
 */
export function useApi<T = unknown>(options: UseApiOptions = {}): UseApiReturn<T> {
  const { retries = 1, retryDelay = 1000 } = options;
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const abortRef = useRef<AbortController | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const execute = useCallback(
    async (url: string, fetchOptions: RequestInit = {}): Promise<T | null> => {
      // Abort previous request if still pending
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setState({ data: null, loading: true, error: null });

      // Get auth token
      let token: string | undefined;
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        token = sessionData.session?.access_token;
      } catch {
        // Continue without token — some endpoints are public
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...((fetchOptions.headers as Record<string, string>) || {}),
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const fullUrl = url.startsWith('http') ? url : `${API_BASE}${url}`;

      let lastError: string | null = null;

      for (let attempt = 0; attempt <= retries; attempt++) {
        try {
          const response = await fetch(fullUrl, {
            ...fetchOptions,
            headers,
            signal: controller.signal,
          });

          if (!response.ok) {
            const errorBody = await response.json().catch(() => ({}));
            throw new Error(
              errorBody.message || `Request failed with status ${response.status}`,
            );
          }

          const data = (await response.json()) as T;
          setState({ data, loading: false, error: null });
          return data;
        } catch (err: any) {
          if (err.name === 'AbortError') {
            setState((prev) => ({ ...prev, loading: false }));
            return null;
          }

          lastError = err.message || 'An unexpected error occurred';

          // Retry with delay (only for network errors, not 4xx)
          if (attempt < retries) {
            await new Promise((r) => setTimeout(r, retryDelay * (attempt + 1)));
          }
        }
      }

      setState({ data: null, loading: false, error: lastError });
      return null;
    },
    [retries, retryDelay],
  );

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, execute, reset };
}
