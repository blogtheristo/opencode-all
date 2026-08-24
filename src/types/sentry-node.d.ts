// Type stub for optional @sentry/node dependency (not installed in all environments)
declare module '@sentry/node' {
  export function init(options: Record<string, unknown>): void;
  export function captureException(error: unknown, context?: Record<string, unknown>): string;
  export function captureMessage(message: string, level?: string): string;
  export function setUser(user: Record<string, unknown> | null): void;
  export function setTag(key: string, value: string): void;
}
