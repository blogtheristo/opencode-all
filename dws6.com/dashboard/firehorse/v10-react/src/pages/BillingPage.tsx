/**
 * BillingPage - Subscription plans and payment management
 * MVP: Displays plans from subscription_plans table, upgrade CTAs
 * Checkout: Calls /api/v1/payments/subscribe and redirects to PayPal/Revolut
 * Backend: PayPal + Revolut via Python payment service (proxied by Express)
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';

interface Plan {
  id: string;
  tier: string;
  name: string;
  price_monthly_eur: number;
  price_annual_eur: number | null;
  agent_calls_per_month: number;
  edge_devices: number;
  features: string[];
  support_type: string;
  is_active: boolean;
}

const API_BASE = import.meta.env.VITE_API_URL || '';

export function BillingPage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPlan] = useState<string | null>('free');
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  useEffect(() => {
    async function loadPlans() {
      try {
        const { data, error } = await supabase
          .from('subscription_plans')
          .select('*')
          .eq('is_active', true)
          .order('price_monthly_eur', { ascending: true });

        if (error) {
          console.error('Error fetching plans:', error);
          setPlans(getFallbackPlans());
        } else if (data && data.length > 0) {
          setPlans(data.map((p: Record<string, unknown>) => ({
            id: p.id as string,
            tier: p.tier as string,
            name: p.name as string,
            price_monthly_eur: Number(p.price_monthly_eur) || 0,
            price_annual_eur: p.price_annual_eur ? Number(p.price_annual_eur) : null,
            agent_calls_per_month: Number(p.agent_calls_per_month) ?? 100,
            edge_devices: Number(p.edge_devices) ?? 0,
            features: Array.isArray(p.features) ? p.features as string[] : [],
            support_type: (p.support_type as string) || 'Community',
            is_active: Boolean(p.is_active),
          })));
        } else {
          setPlans(getFallbackPlans());
        }
      } catch {
        setPlans(getFallbackPlans());
      } finally {
        setLoading(false);
      }
    }

    loadPlans();
  }, []);

  function getFallbackPlans(): Plan[] {
    return [
      {
        id: 'free',
        tier: 'free',
        name: 'Free',
        price_monthly_eur: 0,
        price_annual_eur: null,
        agent_calls_per_month: 100,
        edge_devices: 0,
        features: ['100 agent calls/month', 'Basic dashboard access', 'Community support'],
        support_type: 'Community',
        is_active: true,
      },
      {
        id: 'pro',
        tier: 'pro',
        name: 'Pro',
        price_monthly_eur: 499,
        price_annual_eur: 4990,
        agent_calls_per_month: 10000,
        edge_devices: 5,
        features: ['10,000 agent calls/month', '5 edge devices', 'Email support', 'API access', 'Carbon tracking'],
        support_type: 'Email',
        is_active: true,
      },
      {
        id: 'enterprise',
        tier: 'enterprise',
        name: 'Enterprise',
        price_monthly_eur: 2499,
        price_annual_eur: null,
        agent_calls_per_month: -1,
        edge_devices: 50,
        features: ['Unlimited agent calls', '50+ edge devices', 'Dedicated Slack channel', 'Custom integrations', 'Priority support', 'SLA guarantee'],
        support_type: 'Dedicated Slack',
        is_active: true,
      },
    ];
  }

  const formatCalls = (n: number) => n === -1 ? 'Unlimited' : n.toLocaleString();

  async function handleUpgrade(plan: Plan, provider: 'paypal' | 'revolut') {
    if (plan.tier === 'free') return;
    const token = session?.access_token;
    if (!token) {
      navigate('/login');
      return;
    }
    setCheckoutLoading(plan.id);
    try {
      const res = await fetch(`${API_BASE}/api/v1/payments/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          plan: plan.tier as 'pro' | 'enterprise',
          payment_provider: provider,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = data?.message || data?.error || 'Payment service unavailable';
        alert(msg);
        return;
      }
      if (data?.payment_url) {
        window.location.href = data.payment_url;
      } else {
        alert('No payment URL received. Please contact support.');
      }
    } catch {
      alert('Unable to start checkout. Please try again or contact support.');
    } finally {
      setCheckoutLoading(null);
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Billing & Subscription</h1>
        <p className="text-gray-500 mt-1">
          Manage your subscription and payment methods. Payments via PayPal or Revolut.
        </p>
      </div>

      {currentPlan && (
        <div className="card mb-8 p-4 bg-primary-50 border-primary-200">
          <p className="text-sm font-medium text-primary-800">
            Current plan: <span className="capitalize">{currentPlan}</span>
          </p>
          <p className="text-xs text-primary-600 mt-1">
            Contact support to change plans or update payment.
          </p>
        </div>
      )}

      {loading ? (
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="card animate-pulse h-80" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map(plan => (
            <div
              key={plan.id}
              className={`card p-6 flex flex-col ${
                plan.tier === currentPlan
                  ? 'ring-2 ring-primary-500'
                  : plan.tier === 'pro'
                  ? 'border-2 border-primary-300 shadow-md'
                  : ''
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-lg font-semibold text-gray-900">{plan.name}</h2>
                {plan.tier === 'pro' && (
                  <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">
                    Popular
                  </span>
                )}
              </div>

              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900">
                  €{plan.price_monthly_eur}
                </span>
                <span className="text-gray-500">/month</span>
                {plan.price_annual_eur != null && plan.price_annual_eur > 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    €{plan.price_annual_eur}/year (2 months free)
                  </p>
                )}
              </div>

              <ul className="space-y-2 flex-1 mb-6">
                <li className="text-sm text-gray-600">
                  {formatCalls(plan.agent_calls_per_month)} agent calls/month
                </li>
                <li className="text-sm text-gray-600">
                  {plan.edge_devices} edge devices
                </li>
                {plan.features.slice(0, 4).map((f, i) => (
                  <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-primary-500">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              {plan.tier === currentPlan ? (
                <button className="btn-secondary w-full" disabled>
                  Current Plan
                </button>
              ) : plan.tier === 'free' ? null : (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => handleUpgrade(plan, 'paypal')}
                    disabled={!!checkoutLoading}
                    className="btn-primary w-full"
                  >
                    {checkoutLoading === plan.id ? 'Redirecting...' : 'Upgrade with PayPal'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpgrade(plan, 'revolut')}
                    disabled={!!checkoutLoading}
                    className="btn-secondary w-full"
                  >
                    {checkoutLoading === plan.id ? '...' : 'Upgrade with Revolut'}
                  </button>
                  <a
                    href={`mailto:risto@lifetime.fi?subject=DWS%20IQ%20Upgrade%20to%20${plan.name}`}
                    className="block text-center text-sm text-gray-500 hover:text-gray-700"
                  >
                    Or contact us to upgrade
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 card p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Payment Methods</h3>
        <p className="text-sm text-gray-500">
          We accept PayPal and Revolut Business. Invoices are sent monthly. For Enterprise,
          contact us for custom payment terms.
        </p>
        <button
          type="button"
          onClick={() => navigate('/settings')}
          className="text-sm text-primary-600 hover:underline mt-2"
        >
          ← Back to Settings
        </button>
      </div>
    </div>
  );
}
