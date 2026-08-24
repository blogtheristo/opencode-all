/**
 * 404 Not Found Page
 *
 * Shown when user navigates to a route that doesn't exist.
 * Provides clear feedback and a way to get back to the dashboard.
 */

import { useNavigate } from 'react-router-dom';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md" role="alert">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-border">
          <span className="text-4xl font-bold text-fg-muted">404</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Page not found</h1>
        <p className="text-fg-muted mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <button
          onClick={() => navigate('/')}
          className="rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
