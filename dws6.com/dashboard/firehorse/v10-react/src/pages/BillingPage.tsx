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
import { useToast } from '../components/Toast';

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

interface UsageStats {
  agent_calls_used: number;
  agent_calls_limit: number;
  report_exports_used: number;
  report_exports_limit: number;
  period_start: string;
  period_end: string;
}

interface Invoice {
  id: string;
  amount_eur: number;
  status: 'paid' | 'pending' | 'failed';
  created_at: string;
  period: string;
}

const API_BASE = import.meta.env.VITE_API_URL || '';

export function BillingPage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { toast } = useToast();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPlan, setCurrentPlan] = useState<string>('free');
  const [usage, setUsage] = useState<UsageStats | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  // Load plans, current subscription, usage stats, and invoices
  useEffect(() => {
    async function loadAll() {
      // 1. Load plans
      try {
        const { data, error } = await supabase
          .from('subscription_plans')
          .select('*')
          .eq('is_active', true)
          .order('price_monthly_eur', { ascending: true });

        if (error || !data || data.length === 0) {
          setPlans(getFallbackPlans());
        } else {
          setPlans(
            data.map((p: Record<string, unknown>) => ({
              id: p.id as string,
              tier: p.tier as string,
              name: p.name as string,
              price_monthly_eur: Number(p.price_monthly_eur) || 0,
              price_annual_eur: p.price_annual_eur ? Number(p.price_annual_eur) : null,
              agent_calls_per_month: Number(p.agent_calls_per_month) ?? 100,
              edge_devices: Number(p.edge_devices) ?? 0,
              features: Array.isArray(p.features) ? (p.features as string[]) : [],
              support_type: (p.support_type as string) || 'Community',
              is_active: Boolean(p.is_active),
            })),
          );
        }
      } catch {
        setPlans(getFallbackPlans());
      }

      // 2. Load current subscription
      if (session?.user?.id) {
        try {
          const { data: sub } = await supabase
            .from('subscriptions')
            .select('plan_tier, status')
            .eq('user_id', session.user.id)
            .eq('status', 'active')
            .limit(1)
            .maybeSingle();

          if (sub?.plan_tier) {
            setCurrentPlan(sub.plan_tier);
          }
        } catch {
          // Keep default 'free'
        }

        // 3. Load usage stats
        try {
          const { data: usageData } = await supabase
            .from('usage_records')
            .select('action_type')
            .eq('user_id', session.user.id)
            .gte(
              'created_at',
              new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
            );

          if (usageData) {
            const agentCalls = usageData.filter(
              (u: { action_type: string }) => u.action_type === 'agent_call',
            ).length;
            const reportExports = usageData.filter(
              (u: { action_type: string }) => u.action_type === 'report_export',
            ).length;
            const periodStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
            const periodEnd = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

            setUsage({
              agent_calls_used: agentCalls,
              agent_calls_limit:
                currentPlan === 'enterprise' ? -1 : currentPlan === 'pro' ? 10000 : 100,
              report_exports_used: reportExports,
              report_exports_limit:
                currentPlan === 'enterprise' ? -1 : currentPlan === 'pro' ? 100 : 5,
              period_start: periodStart.toISOString(),
              period_end: periodEnd.toISOString(),
            });
          }
        } catch {
          // Usage stats unavailable
        }

        // 4. Load invoices
        try {
          const { data: invData } = await supabase
            .from('invoices')
            .select('id, amount_eur, status, created_at, period')
            .eq('user_id', session.user.id)
            .order('created_at', { ascending: false })
            .limit(10);

          if (invData && invData.length > 0) {
            setInvoices(invData as Invoice[]);
          }
        } catch {
          // Invoices unavailable
        }
      }

      setLoading(false);
    }

    loadAll();
  }, [session?.user?.id]);

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
        features: [
          '10,000 agent calls/month',
          '5 edge devices',
          'Email support',
          'API access',
          'Carbon tracking',
        ],
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
        features: [
          'Unlimited agent calls',
          '50+ edge devices',
          'Dedicated WhatsApp/webhook channel',
          'Custom integrations',
          'Priority support',
          'SLA guarantee',
        ],
        support_type: 'Dedicated WhatsApp/Webhook',
        is_active: true,
      },
    ];
  }

  const formatCalls = (n: number) => (n === -1 ? 'Unlimited' : n.toLocaleString());

  async function handleUpgrade(plan: Plan, provider: 'paypal' | 'revolut') {
    if (plan.tier === 'free') return;
    const token = session?.access_token;
    if (!token) {
      navigate('/login');
      return;
    }
    setCheckoutLoading(plan.id);
    const origin = window.location.origin;
    const return_url = `${origin}/payment/success?plan=${plan.tier}`;
    const cancel_url = `${origin}/payment/cancel?plan=${plan.tier}`;
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
          return_url,
          cancel_url,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = data?.message || data?.error || 'Payment service unavailable';
        toast({ type: 'error', title: 'Checkout failed', message: msg });
        return;
      }
      if (data?.payment_url) {
        window.location.href = data.payment_url;
      } else {
        toast({
          type: 'error',
          title: 'Checkout failed',
          message: 'No payment URL received. Please contact support.',
        });
      }
    } catch {
      toast({
        type: 'error',
        title: 'Checkout unavailable',
        message: 'Unable to start checkout. Please try again or contact support.',
      });
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
          {[1, 2, 3].map((i) => (
            <div key={i} className="card animate-pulse h-80" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
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
                <span className="text-3xl font-bold text-gray-900">€{plan.price_monthly_eur}</span>
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
                <li className="text-sm text-gray-600">{plan.edge_devices} edge devices</li>
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
                    href={`https://dws10.com/contact/?subject=DWS%20IQ%20Upgrade%20to%20${plan.name}`}
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

      {/* Usage Stats */}
      {usage && (
        <div className="mt-8 card p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Current Period Usage</h3>
          <p className="text-xs text-gray-500 mb-4">
            {new Date(usage.period_start).toLocaleDateString('en-GB', {
              month: 'short',
              day: 'numeric',
            })}
            {' — '}
            {new Date(usage.period_end).toLocaleDateString('en-GB', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <UsageBar
              label="Agent Calls"
              used={usage.agent_calls_used}
              limit={usage.agent_calls_limit}
            />
            <UsageBar
              label="Report Exports"
              used={usage.report_exports_used}
              limit={usage.report_exports_limit}
            />
          </div>
        </div>
      )}

      {/* Invoice History */}
      {invoices.length > 0 && (
        <div className="mt-6 card p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Invoice History</h3>
          <div className="divide-y divide-gray-100">
            {invoices.map((inv) => (
              <div key={inv.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{inv.period}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(inv.created_at).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-900">
                    &euro;{inv.amount_eur.toLocaleString()}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      inv.status === 'paid'
                        ? 'bg-green-100 text-green-700'
                        : inv.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {inv.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 card p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Payment Methods</h3>
        <p className="text-sm text-gray-500">
          We accept PayPal and Revolut Business. Invoices are sent monthly. For Enterprise, contact
          us for custom payment terms.
        </p>
        <button
          type="button"
          onClick={() => navigate('/settings')}
          className="text-sm text-primary-600 hover:underline mt-2"
        >
          &larr; Back to Settings
        </button>
      </div>
    </div>
  );
}

function UsageBar({ label, used, limit }: { label: string; used: number; limit: number }) {
  const isUnlimited = limit === -1;
  const pct = isUnlimited ? 0 : limit > 0 ? Math.min((used / limit) * 100, 100) : 0;
  const barColor = pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-yellow-500' : 'bg-primary-500';

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-700 font-medium">{label}</span>
        <span className="text-gray-500">
          {used.toLocaleString()} / {isUnlimited ? 'Unlimited' : limit.toLocaleString()}
        </span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${barColor}`}
          style={{ width: isUnlimited ? '5%' : `${pct}%` }}
        />
      </div>
    </div>
  );
}
