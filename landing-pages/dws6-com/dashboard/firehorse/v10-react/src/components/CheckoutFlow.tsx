import React, { useState } from 'react';
import BillingForm from './BillingForm';

type CheckoutStep =
  | 'product-selection'
  | 'revolut-deposit'
  | 'billing-info'
  | 'stripe-invoice'
  | 'completed';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
}

interface CheckoutFlowProps {
  product: Product;
  onComplete?: () => void;
}

interface Order {
  id: string;
  status: string;
  product_id: string;
  deposit_amount_cents: number;
  remainder_amount_cents: number;
  product_price_cents: number;
  stripe_invoice_url?: string;
}

// ============================================================================
// CHECKOUT FLOW COMPONENT
// ============================================================================

export const CheckoutFlow: React.FC<CheckoutFlowProps> = ({ product, onComplete }) => {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('product-selection');
  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [billingProfileId, setBillingProfileId] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  // =========================================================================
  // STEP 1: Product Selection & Deposit Amount
  // =========================================================================

  const handleContinueToDeposit = (amount: number) => {
    if (amount < 0 || amount > product.price) {
      setError('Deposit amount must be between €0 and €' + (product.price / 100).toFixed(2));
      return;
    }
    setDepositAmount(amount);
    setCurrentStep('revolut-deposit');
    setError(null);
  };

  // =========================================================================
  // STEP 2: Revolut Deposit
  // =========================================================================

  const handleInitiateRevolutPayment = async () => {
    try {
      // In production, this would generate a unique Revolut payment link
      // For now, we'll simulate it and move to billing info
      // Create order with deposit amount
      const response = await fetch('/api/v1/b2b/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({
          product_id: product.id,
          company_billing_profile_id: billingProfileId,
          deposit_amount_cents: depositAmount * 100,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const orderData = await response.json();
      setOrder(orderData);

      // In production, redirect to Revolut checkout
      // window.location.href = mockRevolutLink;

      setCurrentStep('billing-info');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initiate payment');
    }
  };

  // =========================================================================
  // STEP 3: Billing Information
  // =========================================================================

  const handleBillingSuccess = async (billingData: any) => {
    setBillingProfileId(billingData.id);

    if (order) {
      // Confirm deposit and create Stripe invoice
      try {
        const response = await fetch(`/api/v1/b2b/orders/${order.id}/confirm-deposit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
          body: JSON.stringify({
            revolut_transaction_id: `revolut-${Date.now()}`, // In production, get from Revolut webhook
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to process payment');
        }

        const updatedOrder = await response.json();
        setOrder(updatedOrder);
        setCurrentStep('stripe-invoice');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create invoice');
      }
    }
  };

  // =========================================================================
  // STEP 4: Stripe Invoice
  // =========================================================================

  const handleStripePayment = () => {
    if (order?.stripe_invoice_url) {
      window.open(order.stripe_invoice_url, '_blank');
    }
  };

  // =========================================================================
  // RENDER STEPS
  // =========================================================================

  return (
    <div className="min-h-dvh bg-gradient-to-br from-background to-border py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            {[
              { step: 'product-selection', label: 'Product' },
              { step: 'revolut-deposit', label: 'Deposit' },
              { step: 'billing-info', label: 'Company Info' },
              { step: 'stripe-invoice', label: 'Invoice' },
              { step: 'completed', label: 'Complete' },
            ].map((item, idx, arr) => (
              <React.Fragment key={item.step}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold mb-2 transition-colors ${
                      currentStep === item.step
                        ? 'bg-blue-600 text-white ring-4 ring-blue-200'
                        : [
                              'product-selection',
                              'revolut-deposit',
                              'billing-info',
                              'stripe-invoice',
                            ].indexOf(currentStep) > arr.indexOf(item)
                          ? 'bg-green-600 text-white'
                          : 'bg-fg-muted/20 text-fg-muted'
                    }`}
                  >
                    {[
                      'product-selection',
                      'revolut-deposit',
                      'billing-info',
                      'stripe-invoice',
                    ].indexOf(currentStep) > arr.indexOf(item) ? (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      idx + 1
                    )}
                  </div>
                  <span className="text-xs font-medium text-fg-muted">{item.label}</span>
                </div>
                {idx < arr.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 mb-6 transition-colors ${
                      [
                        'product-selection',
                        'revolut-deposit',
                        'billing-info',
                        'stripe-invoice',
                      ].indexOf(currentStep) > arr.indexOf(item)
                        ? 'bg-green-600'
                        : 'bg-fg-muted/20'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex gap-3">
              <svg
                className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="font-semibold text-red-800">Error</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 1: Product Selection */}
        {currentStep === 'product-selection' && (
          <div className="bg-surface rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-foreground">Review Your Order</h2>

            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-lg text-foreground mb-2">{product.name}</h3>
              <p className="text-fg-muted mb-4">{product.description}</p>
              <div className="text-3xl font-bold text-blue-600">
                €{(product.price / 100).toFixed(2)}
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <h3 className="font-semibold text-foreground">Flexible Payment Options</h3>
              <p className="text-fg-muted">
                Choose how much to deposit now. We'll invoice you for the remainder after your
                company information is confirmed.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[0.33, 0.5, 1.0].map((fraction) => {
                  const amount = (product.price * fraction) / 100;
                  const remainder = product.price * (1 - fraction);
                  return (
                    <button
                      key={fraction}
                      onClick={() => handleContinueToDeposit(product.price * fraction)}
                      className="p-4 border-2 border-border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                    >
                      <div className="font-semibold text-foreground">€{amount.toFixed(2)} now</div>
                      <div className="text-sm text-fg-muted">
                        €{(remainder / 100).toFixed(2)} on invoice
                      </div>
                      <div className="text-xs text-fg-muted mt-1">
                        {Math.round(fraction * 100)}% deposit
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="border-t pt-4">
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Or enter a custom amount
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="0"
                    max={product.price / 100}
                    step="0.01"
                    value={depositAmount / 100}
                    onChange={(e) => setDepositAmount(parseFloat(e.target.value) * 100)}
                    placeholder="0.00"
                    className="flex-1 px-4 py-2 border-2 border-border rounded-lg focus:border-blue-500 focus:outline-none"
                  />
                  <span className="py-2 text-fg-muted">€</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleContinueToDeposit(depositAmount)}
              disabled={depositAmount <= 0}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Payment
            </button>
          </div>
        )}

        {/* STEP 2: Revolut Deposit */}
        {currentStep === 'revolut-deposit' && (
          <div className="bg-surface rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-foreground">Pay Deposit via Revolut</h2>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <div className="flex items-baseline gap-4 mb-4">
                <div>
                  <p className="text-sm text-fg-muted mb-1">Deposit Amount</p>
                  <div className="text-4xl font-bold text-blue-600">
                    €{(depositAmount / 100).toFixed(2)}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm text-fg-muted mb-1">Remaining to Invoice</p>
                  <div className="text-2xl font-semibold text-foreground">
                    €{((product.price - depositAmount) / 100).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <h3 className="font-semibold text-foreground">Next Steps</h3>
              <ol className="space-y-3 list-decimal list-inside">
                <li className="text-foreground">Click below to open Revolut checkout</li>
                <li className="text-foreground">Complete payment in Revolut</li>
                <li className="text-foreground">Return here and enter your company details</li>
                <li className="text-foreground">Receive invoice for remaining amount</li>
              </ol>
            </div>

            <button
              onClick={handleInitiateRevolutPayment}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
              </svg>
              Pay €{(depositAmount / 100).toFixed(2)} with Revolut
            </button>
          </div>
        )}

        {/* STEP 3: Billing Information */}
        {currentStep === 'billing-info' && (
          <div className="bg-surface rounded-lg shadow-lg p-8">
            <BillingForm onSuccess={handleBillingSuccess} onError={setError} />
          </div>
        )}

        {/* STEP 4: Stripe Invoice */}
        {currentStep === 'stripe-invoice' && order && (
          <div className="bg-surface rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-foreground">Complete Your Payment</h2>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="font-semibold text-green-800">Deposit received! ✓</p>
              </div>
              <p className="text-sm text-green-700">Your Revolut payment was confirmed.</p>
            </div>

            <div className="space-y-4 mb-8">
              <h3 className="font-semibold text-foreground">Invoice Summary</h3>
              <div className="space-y-2 border-t border-b py-4">
                <div className="flex justify-between">
                  <span className="text-fg-muted">Product Price</span>
                  <span className="font-semibold">
                    €{(order.product_price_cents / 100).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Deposit (Revolut)</span>
                  <span>-€{(depositAmount / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Amount Due</span>
                  <span className="text-blue-600">
                    €{(order.remainder_amount_cents / 100).toFixed(2)}
                  </span>
                </div>
              </div>

              <p className="text-sm text-fg-muted">
                Your invoice has been generated and sent to your email. Click below to review and
                pay the remaining amount via Stripe.
              </p>
            </div>

            <button
              onClick={handleStripePayment}
              className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              Open Stripe Invoice
            </button>

            <p className="text-xs text-fg-muted text-center mt-4">
              Payment methods: Credit Card, Bank Transfer (SEPA), iDEAL, Klarna
            </p>
          </div>
        )}

        {/* STEP 5: Completed */}
        {currentStep === 'completed' && (
          <div className="bg-surface rounded-lg shadow-lg p-8 text-center">
            <svg
              className="w-16 h-16 text-green-600 mx-auto mb-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <h2 className="text-3xl font-bold mb-2 text-foreground">Payment Complete!</h2>
            <p className="text-fg-muted mb-8">Your service is now active and ready to use.</p>
            <button
              onClick={onComplete}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutFlow;
