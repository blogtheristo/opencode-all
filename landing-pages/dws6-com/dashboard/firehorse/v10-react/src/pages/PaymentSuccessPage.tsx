/**
 * PaymentSuccessPage — Post-checkout success landing page
 * Code-Version: 1.0.0
 * Branch: claude/build-payment-ui-3ZU5s
 * Date: 2026-04-13
 * Owner: Lifetime Oy
 * Introduced-In: PR-TBD
 *
 * PayPal and Revolut redirect the browser here after a successful payment.
 * Reads ?plan=pro|enterprise from the URL (set by BillingPage before redirect).
 * Shows a confirmation, then polls Supabase to confirm subscription is active.
 */

import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

const PLAN_LABELS: Record<string, string> = {
  pro: 'Pro',
  enterprise: 'Enterprise',
};

const PLAN_FEATURES: Record<string, string[]> = {
  pro: [
    '10,000 agent calls/month',
    '5 edge devices',
    'Email support',
    'API access',
    'Carbon tracking',
  ],
  enterprise: [
    'Unlimited agent calls',
    '50+ edge devices',
    'Dedicated Slack channel',
    'Custom integrations',
    'Priority support',
  ],
};

export function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { session } = useAuth();
  const plan = searchParams.get('plan') || 'pro';
  const planLabel = PLAN_LABELS[plan] || 'Pro';
  const features = PLAN_FEATURES[plan] || PLAN_FEATURES['pro'];

  const [confirmed, setConfirmed] = useState(false);
  const [polling, setPolling] = useState(true);

  // Poll Supabase for up to 30s to confirm subscription is active
  useEffect(() => {
    if (!session?.user?.id) return;

    let attempts = 0;
    const maxAttempts = 10;

    const interval = setInterval(async () => {
      attempts++;
      try {
        const { data } = await supabase
          .from('subscriptions')
          .select('plan_tier, status')
          .eq('user_id', session.user.id)
          .eq('status', 'active')
          .limit(1)
          .maybeSingle();

        if (data?.plan_tier === plan || data?.status === 'active') {
          setConfirmed(true);
          setPolling(false);
          clearInterval(interval);
          return;
        }
      } catch {
        // Supabase not available — still show success to user
      }

      if (attempts >= maxAttempts) {
        setPolling(false);
        clearInterval(interval);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [session?.user?.id, plan]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Success card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          {/* Icon */}
          <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful</h1>
          <p className="text-gray-500 mb-6">
            You are now on the <span className="font-semibold text-primary-700">{planLabel}</span>{' '}
            plan.
          </p>

          {/* Subscription status indicator */}
          <div className="mb-6">
            {polling && !confirmed ? (
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <div className="w-3 h-3 rounded-full border-2 border-primary-500 border-t-transparent animate-spin" />
                Activating subscription…
              </div>
            ) : confirmed ? (
              <div className="flex items-center justify-center gap-2 text-sm text-green-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                Subscription active
              </div>
            ) : (
              <div className="text-sm text-gray-400">
                Subscription activating — this may take a few minutes.
              </div>
            )}
          </div>

          {/* Plan features summary */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Your {planLabel} plan includes
            </p>
            <ul className="space-y-2">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                  <svg
                    className="w-4 h-4 text-green-500 mt-0.5 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* CTAs */}
          <div className="flex flex-col gap-3">
            <button type="button" onClick={() => navigate('/')} className="btn-primary w-full">
              Go to Dashboard
            </button>
            <button
              type="button"
              onClick={() => navigate('/billing')}
              className="btn-secondary w-full"
            >
              View Billing
            </button>
          </div>
        </div>

        {/* Support note */}
        <p className="text-center text-xs text-gray-400 mt-4">
          Questions?{' '}
          <a
            href="mailto:risto@lifetime.fi?subject=DWS%20IQ%20Subscription"
            className="underline hover:text-gray-600"
          >
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
}
