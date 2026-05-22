import React, { useState } from 'react';
import { z } from 'zod';

// ============================================================================
// SCHEMA
// ============================================================================

const BillingFormSchema = z.object({
  company_name: z.string().min(1, 'Company name is required').max(255),
  vat_number: z.string().regex(/^[A-Z]{2}\d{8,}$/, 'VAT number must be in format FI12345678'),
  business_id: z.string().optional(),
  billing_address: z.string().min(1, 'Billing address is required').max(500),
  city: z.string().min(1, 'City is required').max(100),
  postal_code: z.string().min(1, 'Postal code is required').max(20),
  country: z.string().length(2).default('FI'),
  contact_email: z.string().email('Please enter a valid email address'),
  contact_phone: z.string().optional(),
});

type BillingFormData = z.infer<typeof BillingFormSchema>;

interface BillingFormProps {
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
  isLoading?: boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

export const BillingForm: React.FC<BillingFormProps> = ({
  onSuccess,
  onError,
  isLoading: externalLoading = false,
}) => {
  const [formData, setFormData] = useState<Partial<BillingFormData>>({
    country: 'FI',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(externalLoading);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field on change
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setSubmitSuccess(false);

    try {
      // Validate form data
      const validatedData = BillingFormSchema.parse(formData);

      // Send to API
      const response = await fetch('/api/v1/b2b/billing-profiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify(validatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save billing profile');
      }

      const result = await response.json();
      setSubmitSuccess(true);

      // Call success callback
      if (onSuccess) {
        onSuccess(result);
      }

      // Reset form
      setFormData({ country: 'FI' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        const fieldErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          const fieldName = err.path[0] as string;
          fieldErrors[fieldName] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        const message = error instanceof Error ? error.message : 'An error occurred';
        setErrors({ submit: message });
        if (onError) {
          onError(message);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Company Details</h1>
          <p className="text-gray-600">
            Enter your company information for billing and invoice purposes
          </p>
        </div>

        {/* Success Message */}
        {submitSuccess && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm font-medium text-green-800">
                Billing profile saved successfully!
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {errors.submit && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm font-medium text-red-800">{errors.submit}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Name */}
          <div>
            <label
              htmlFor="company_name"
              className="block text-sm font-semibold text-gray-900 mb-2"
            >
              Company Name *
            </label>
            <input
              id="company_name"
              name="company_name"
              type="text"
              value={formData.company_name || ''}
              onChange={handleChange}
              placeholder="e.g., Acme Corporation"
              className={`w-full px-4 py-3 rounded-lg border-2 transition-colors ${
                errors.company_name
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-200 bg-white hover:border-gray-300 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-100`}
              disabled={isLoading}
            />
            {errors.company_name && (
              <p className="mt-1 text-sm text-red-600">{errors.company_name}</p>
            )}
          </div>

          {/* VAT Number */}
          <div>
            <label htmlFor="vat_number" className="block text-sm font-semibold text-gray-900 mb-2">
              VAT Number *
            </label>
            <input
              id="vat_number"
              name="vat_number"
              type="text"
              value={formData.vat_number || ''}
              onChange={handleChange}
              placeholder="e.g., FI12345678"
              className={`w-full px-4 py-3 rounded-lg border-2 transition-colors ${
                errors.vat_number
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-200 bg-white hover:border-gray-300 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-100`}
              disabled={isLoading}
            />
            {errors.vat_number && <p className="mt-1 text-sm text-red-600">{errors.vat_number}</p>}
            <p className="mt-1 text-xs text-gray-500">
              Format: 2-letter country code + 8+ digits (e.g., FI12345678)
            </p>
          </div>

          {/* Business ID (Optional) */}
          <div>
            <label htmlFor="business_id" className="block text-sm font-semibold text-gray-900 mb-2">
              Business ID (Optional)
            </label>
            <input
              id="business_id"
              name="business_id"
              type="text"
              value={formData.business_id || ''}
              onChange={handleChange}
              placeholder="e.g., 1234567-8"
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-white hover:border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            />
            <p className="mt-1 text-xs text-gray-500">Finnish Y-tunnus format (e.g., 1234567-8)</p>
          </div>

          {/* Billing Address */}
          <div>
            <label
              htmlFor="billing_address"
              className="block text-sm font-semibold text-gray-900 mb-2"
            >
              Billing Address *
            </label>
            <input
              id="billing_address"
              name="billing_address"
              type="text"
              value={formData.billing_address || ''}
              onChange={handleChange}
              placeholder="e.g., 123 Business St"
              className={`w-full px-4 py-3 rounded-lg border-2 transition-colors ${
                errors.billing_address
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-200 bg-white hover:border-gray-300 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-100`}
              disabled={isLoading}
            />
            {errors.billing_address && (
              <p className="mt-1 text-sm text-red-600">{errors.billing_address}</p>
            )}
          </div>

          {/* City & Postal Code */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-semibold text-gray-900 mb-2">
                City *
              </label>
              <input
                id="city"
                name="city"
                type="text"
                value={formData.city || ''}
                onChange={handleChange}
                placeholder="e.g., Helsinki"
                className={`w-full px-4 py-3 rounded-lg border-2 transition-colors ${
                  errors.city
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-200 bg-white hover:border-gray-300 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-100`}
                disabled={isLoading}
              />
              {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
            </div>
            <div>
              <label
                htmlFor="postal_code"
                className="block text-sm font-semibold text-gray-900 mb-2"
              >
                Postal Code *
              </label>
              <input
                id="postal_code"
                name="postal_code"
                type="text"
                value={formData.postal_code || ''}
                onChange={handleChange}
                placeholder="e.g., 00100"
                className={`w-full px-4 py-3 rounded-lg border-2 transition-colors ${
                  errors.postal_code
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-200 bg-white hover:border-gray-300 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-100`}
                disabled={isLoading}
              />
              {errors.postal_code && (
                <p className="mt-1 text-sm text-red-600">{errors.postal_code}</p>
              )}
            </div>
          </div>

          {/* Country */}
          <div>
            <label htmlFor="country" className="block text-sm font-semibold text-gray-900 mb-2">
              Country *
            </label>
            <select
              id="country"
              name="country"
              value={formData.country || 'FI'}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-white hover:border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              <option value="FI">Finland (FI)</option>
              <option value="SE">Sweden (SE)</option>
              <option value="NO">Norway (NO)</option>
              <option value="DE">Germany (DE)</option>
              <option value="NL">Netherlands (NL)</option>
              <option value="FR">France (FR)</option>
              <option value="IT">Italy (IT)</option>
              <option value="ES">Spain (ES)</option>
              <option value="PL">Poland (PL)</option>
              <option value="CZ">Czech Republic (CZ)</option>
              <option value="AT">Austria (AT)</option>
              <option value="DK">Denmark (DK)</option>
              <option value="BE">Belgium (BE)</option>
              <option value="IE">Ireland (IE)</option>
              <option value="PT">Portugal (PT)</option>
              <option value="GR">Greece (GR)</option>
            </select>
          </div>

          {/* Contact Email */}
          <div>
            <label
              htmlFor="contact_email"
              className="block text-sm font-semibold text-gray-900 mb-2"
            >
              Contact Email *
            </label>
            <input
              id="contact_email"
              name="contact_email"
              type="email"
              value={formData.contact_email || ''}
              onChange={handleChange}
              placeholder="e.g., billing@company.com"
              className={`w-full px-4 py-3 rounded-lg border-2 transition-colors ${
                errors.contact_email
                  ? 'border-red-300 bg-red-50'
                  : 'border-gray-200 bg-white hover:border-gray-300 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-100`}
              disabled={isLoading}
            />
            {errors.contact_email && (
              <p className="mt-1 text-sm text-red-600">{errors.contact_email}</p>
            )}
          </div>

          {/* Contact Phone (Optional) */}
          <div>
            <label
              htmlFor="contact_phone"
              className="block text-sm font-semibold text-gray-900 mb-2"
            >
              Contact Phone (Optional)
            </label>
            <input
              id="contact_phone"
              name="contact_phone"
              type="tel"
              value={formData.contact_phone || ''}
              onChange={handleChange}
              placeholder="e.g., +358 9 1234 5678"
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 bg-white hover:border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Save Company Details
                </>
              )}
            </button>
          </div>

          {/* Footer Text */}
          <p className="text-xs text-gray-500 text-center">
            Your company information is encrypted and securely stored. We use it only for invoicing
            purposes.
          </p>
        </form>
      </div>
    </div>
  );
};

export default BillingForm;
