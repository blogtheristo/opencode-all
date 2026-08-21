/**
 * PaymentCancelPage — Post-checkout cancellation landing page
 * Code-Version: 1.0.0
 * Branch: claude/build-payment-ui-3ZU5s
 * Date: 2026-04-13
 * Owner: Lifetime Oy
 * Introduced-In: PR-TBD
 *
 * PayPal and Revolut redirect the browser here when the user cancels.
 * No charges are made. User can retry or go back to the dashboard.
 */

import { useNavigate, useSearchParams } from 'react-router-dom';

const PLAN_LABELS: Record<string, string> = {
  pro: 'Pro',
  enterprise: 'Enterprise',
};

export function PaymentCancelPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const plan = searchParams.get('plan') || '';
  const planLabel = plan ? PLAN_LABELS[plan] || plan : '';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Cancel card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          {/* Icon */}
          <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Cancelled</h1>
          <p className="text-gray-500 mb-2">
            No charges were made.
            {planLabel && (
              <>
                {' '}
                Your <span className="font-medium text-gray-700">{planLabel}</span> upgrade was not
                processed.
              </>
            )}
          </p>
          <p className="text-sm text-gray-400 mb-8">
            You can upgrade any time from the Billing page.
          </p>

          {/* CTAs */}
          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => navigate('/billing')}
              className="btn-primary w-full"
            >
              Back to Billing
            </button>
            <button type="button" onClick={() => navigate('/')} className="btn-secondary w-full">
              Go to Dashboard
            </button>
          </div>
        </div>

        {/* Support note */}
        <p className="text-center text-xs text-gray-400 mt-4">
          Had trouble?{' '}
          <a
            href="https://dws10.com/contact/"
            className="underline hover:text-gray-600"
          >
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
}
