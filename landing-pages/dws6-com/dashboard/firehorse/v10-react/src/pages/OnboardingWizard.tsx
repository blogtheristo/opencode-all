/**
 * Onboarding Wizard — MVP Feature
 * 4-step guided flow: Industry → Company → Data Sources → First Assessment
 * Mobile-first, touch-friendly, works on all screen sizes.
 */

import { useState, useCallback, type FormEvent } from 'react';
import { supabase } from '../lib/supabase';

type Step = 1 | 2 | 3 | 4;

interface OnboardingData {
  industry: string;
  companyName: string;
  companySize: string;
  country: string;
  annualRevenue: string;
  dataSources: string[];
  regulations: string[];
}

interface OnboardingWizardProps {
  userEmail: string;
  onComplete: (data: OnboardingData) => void;
  onSkip: () => void;
}

const INDUSTRIES = [
  { id: 'steel', label: 'Steel & Metals', icon: '⚙' },
  { id: 'cement', label: 'Cement & Concrete', icon: '🏗' },
  { id: 'chemicals', label: 'Chemicals', icon: '🧪' },
  { id: 'construction', label: 'Construction', icon: '🏢' },
  { id: 'energy', label: 'Energy & Utilities', icon: '⚡' },
  { id: 'manufacturing', label: 'Manufacturing', icon: '🏭' },
  { id: 'logistics', label: 'Logistics & Transport', icon: '🚛' },
  { id: 'mining', label: 'Mining & Minerals', icon: '⛏' },
  { id: 'waste', label: 'Waste Management', icon: '♻' },
  { id: 'real-estate', label: 'Real Estate', icon: '🏠' },
  { id: 'healthcare', label: 'Healthcare', icon: '🏥' },
  { id: 'financial', label: 'Financial Services', icon: '💰' },
  { id: 'food', label: 'Food & Agriculture', icon: '🌾' },
  { id: 'textiles', label: 'Textiles & Fashion', icon: '🧵' },
  { id: 'automotive', label: 'Automotive', icon: '🚗' },
  { id: 'public-sector', label: 'Public Sector', icon: '🏛' },
] as const;

const COMPANY_SIZES = [
  { id: 'small', label: '1–49 employees', tag: 'SME' },
  { id: 'medium', label: '50–249 employees', tag: 'Mid-market' },
  { id: 'large', label: '250–999 employees', tag: 'Enterprise' },
  { id: 'enterprise', label: '1,000+ employees', tag: 'Large Enterprise' },
] as const;

const DATA_SOURCES = [
  { id: 'erp-sap', label: 'SAP S/4HANA' },
  { id: 'erp-ifs', label: 'IFS Cloud' },
  { id: 'erp-dynamics', label: 'Microsoft Dynamics 365' },
  { id: 'erp-monitor', label: 'Monitor ERP' },
  { id: 'erp-visma', label: 'Visma' },
  { id: 'esg-worldfavor', label: 'Worldfavor' },
  { id: 'esg-positiongreen', label: 'PositionGreen' },
  { id: 'manual', label: 'Manual data entry / Excel' },
  { id: 'api', label: 'Custom API integration' },
] as const;

const REGULATIONS = [
  { id: 'csrd', label: 'CSRD', desc: 'Corporate Sustainability Reporting' },
  { id: 'ets', label: 'EU ETS', desc: 'Emissions Trading System' },
  { id: 'cbam', label: 'CBAM', desc: 'Carbon Border Adjustment' },
  { id: 'epbd', label: 'EPBD', desc: 'Energy Performance of Buildings' },
  { id: 'fit-for-55', label: 'Fit for 55', desc: 'EU Climate Package' },
  { id: 'eu-ai-act', label: 'EU AI Act', desc: 'AI Regulation' },
] as const;

const COUNTRIES = [
  'Finland', 'Sweden', 'Norway', 'Denmark', 'Germany', 'France',
  'Netherlands', 'Belgium', 'Austria', 'Spain', 'Italy', 'Poland',
  'Czech Republic', 'Estonia', 'Latvia', 'Lithuania', 'Other EU', 'Non-EU',
] as const;

export function OnboardingWizard({ userEmail, onComplete, onSkip }: OnboardingWizardProps) {
  const [step, setStep] = useState<Step>(1);
  const [saving, setSaving] = useState(false);

  const [data, setData] = useState<OnboardingData>({
    industry: '',
    companyName: '',
    companySize: '',
    country: '',
    annualRevenue: '',
    dataSources: [],
    regulations: [],
  });

  const canProceed = useCallback((): boolean => {
    switch (step) {
      case 1: return !!data.industry;
      case 2: return !!data.companyName && !!data.companySize && !!data.country;
      case 3: return data.dataSources.length > 0;
      case 4: return data.regulations.length > 0;
    }
  }, [step, data]);

  const toggleArrayItem = useCallback((field: 'dataSources' | 'regulations', id: string) => {
    setData(prev => ({
      ...prev,
      [field]: prev[field].includes(id)
        ? prev[field].filter(x => x !== id)
        : [...prev[field], id],
    }));
  }, []);

  const handleFinish = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Save onboarding data to Supabase
      const { data: session } = await supabase.auth.getSession();
      const userId = session.session?.user?.id;

      if (userId) {
        // Persist profile data to user_profiles table
        await supabase.from('user_profiles').upsert({
          id: userId,
          email: userEmail,
          // Only upsert columns that are known to exist on user_profiles
          updated_at: new Date().toISOString(),
        });

        // Also set auth user_metadata so the check in App.tsx works
        // across devices/browsers without querying user_profiles
        await supabase.auth.updateUser({
          data: { onboarding_completed: true },
        });
      }

      onComplete(data);
    } catch (error) {
      // Log the error but still complete even if save fails — data is local
      // eslint-disable-next-line no-console
      console.error('Failed to save onboarding data to Supabase', error);
      onComplete(data);
    } finally {
      setSaving(false);
    }
  }, [data, userEmail, onComplete]);

  const progressPercent = (step / 4) * 100;

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl mb-3">
            <span className="text-white font-bold text-xl">D</span>
          </div>
          <h1 className="text-xl font-bold text-white">Welcome to DWS IQ</h1>
          <p className="text-gray-400 text-sm mt-1">Let's set up your climate intelligence in 2 minutes</p>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Step {step} of 4</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-1.5">
            <div
              className="bg-blue-500 h-1.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            {['Industry', 'Company', 'Data', 'Regulations'].map((label, i) => (
              <span
                key={label}
                className={`text-xs ${i + 1 <= step ? 'text-blue-400 font-medium' : 'text-gray-600'}`}
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-8">
          {/* Step 1: Industry Selection */}
          {step === 1 && (
            <div>
              <h2 className="text-lg font-semibold text-white mb-1">Select your industry</h2>
              <p className="text-sm text-gray-400 mb-5">We'll tailor compliance checks to your sector</p>

              <div className="grid grid-cols-2 gap-2">
                {INDUSTRIES.map(ind => (
                  <button
                    key={ind.id}
                    type="button"
                    onClick={() => setData(prev => ({ ...prev, industry: ind.id }))}
                    className={`flex items-center gap-2 px-3 py-3 rounded-lg text-left text-sm transition-all ${
                      data.industry === ind.id
                        ? 'bg-blue-600/20 border-2 border-blue-500 text-white'
                        : 'bg-gray-800 border-2 border-transparent text-gray-300 hover:border-gray-600'
                    }`}
                  >
                    <span className="text-lg shrink-0">{ind.icon}</span>
                    <span className="leading-tight">{ind.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Company Profile */}
          {step === 2 && (
            <div>
              <h2 className="text-lg font-semibold text-white mb-1">Company details</h2>
              <p className="text-sm text-gray-400 mb-5">Help us calibrate your compliance requirements</p>

              <div className="space-y-4">
                <div>
                  <label htmlFor="ob-company" className="block text-sm text-gray-300 mb-1">Company name</label>
                  <input
                    id="ob-company"
                    type="text"
                    required
                    value={data.companyName}
                    onChange={e => setData(prev => ({ ...prev, companyName: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. SSAB, Outokumpu, YIT"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Company size</label>
                  <div className="grid grid-cols-2 gap-2">
                    {COMPANY_SIZES.map(size => (
                      <button
                        key={size.id}
                        type="button"
                        onClick={() => setData(prev => ({ ...prev, companySize: size.id }))}
                        className={`px-3 py-3 rounded-lg text-left transition-all ${
                          data.companySize === size.id
                            ? 'bg-blue-600/20 border-2 border-blue-500 text-white'
                            : 'bg-gray-800 border-2 border-transparent text-gray-300 hover:border-gray-600'
                        }`}
                      >
                        <p className="text-sm font-medium">{size.label}</p>
                        <p className="text-xs text-gray-500">{size.tag}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="ob-country" className="block text-sm text-gray-300 mb-1">Country</label>
                  <select
                    id="ob-country"
                    value={data.country}
                    onChange={e => setData(prev => ({ ...prev, country: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select country</option>
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label htmlFor="ob-revenue" className="block text-sm text-gray-300 mb-1">Annual revenue (optional)</label>
                  <select
                    id="ob-revenue"
                    value={data.annualRevenue}
                    onChange={e => setData(prev => ({ ...prev, annualRevenue: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Prefer not to say</option>
                    <option value="under-1m">Under €1M</option>
                    <option value="1m-10m">€1M – €10M</option>
                    <option value="10m-50m">€10M – €50M</option>
                    <option value="50m-250m">€50M – €250M</option>
                    <option value="250m-1b">€250M – €1B</option>
                    <option value="over-1b">Over €1B</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Data Sources */}
          {step === 3 && (
            <div>
              <h2 className="text-lg font-semibold text-white mb-1">Connect your data</h2>
              <p className="text-sm text-gray-400 mb-5">Select systems you want to integrate (can change later)</p>

              <div className="space-y-2">
                {DATA_SOURCES.map(ds => (
                  <button
                    key={ds.id}
                    type="button"
                    onClick={() => toggleArrayItem('dataSources', ds.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                      data.dataSources.includes(ds.id)
                        ? 'bg-blue-600/20 border-2 border-blue-500 text-white'
                        : 'bg-gray-800 border-2 border-transparent text-gray-300 hover:border-gray-600'
                    }`}
                  >
                    <span className="text-sm">{ds.label}</span>
                    <span className={`w-5 h-5 rounded border-2 flex items-center justify-center text-xs transition-all ${
                      data.dataSources.includes(ds.id)
                        ? 'bg-blue-500 border-blue-500 text-white'
                        : 'border-gray-600'
                    }`}>
                      {data.dataSources.includes(ds.id) && '✓'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Regulations */}
          {step === 4 && (
            <form onSubmit={handleFinish}>
              <h2 className="text-lg font-semibold text-white mb-1">Regulatory focus</h2>
              <p className="text-sm text-gray-400 mb-5">Which EU regulations apply to your business?</p>

              <div className="grid grid-cols-2 gap-2 mb-6">
                {REGULATIONS.map(reg => (
                  <button
                    key={reg.id}
                    type="button"
                    onClick={() => toggleArrayItem('regulations', reg.id)}
                    className={`px-3 py-3 rounded-lg text-left transition-all ${
                      data.regulations.includes(reg.id)
                        ? 'bg-blue-600/20 border-2 border-blue-500 text-white'
                        : 'bg-gray-800 border-2 border-transparent text-gray-300 hover:border-gray-600'
                    }`}
                  >
                    <p className="text-sm font-bold">{reg.label}</p>
                    <p className="text-xs text-gray-400 leading-tight">{reg.desc}</p>
                  </button>
                ))}
              </div>

              {/* Summary */}
              <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
                <h3 className="text-sm font-medium text-white mb-2">Setup summary</h3>
                <div className="text-xs text-gray-400 space-y-1">
                  <p>Industry: <span className="text-gray-200">{INDUSTRIES.find(i => i.id === data.industry)?.label || '-'}</span></p>
                  <p>Company: <span className="text-gray-200">{data.companyName || '-'}</span></p>
                  <p>Size: <span className="text-gray-200">{COMPANY_SIZES.find(s => s.id === data.companySize)?.label || '-'}</span></p>
                  <p>Country: <span className="text-gray-200">{data.country || '-'}</span></p>
                  <p>Data sources: <span className="text-gray-200">{data.dataSources.length}</span></p>
                  <p>Regulations: <span className="text-gray-200">{data.regulations.join(', ').toUpperCase() || '-'}</span></p>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving || !canProceed()}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/40 text-white font-medium rounded-lg transition-colors"
              >
                {saving ? 'Setting up your workspace...' : 'Launch Dashboard'}
              </button>
            </form>
          )}

          {/* Navigation */}
          {step < 4 && (
            <div className="flex items-center justify-between mt-6">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((step - 1) as Step)}
                  className="text-sm text-gray-400 hover:text-gray-200 transition-colors"
                >
                  Back
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onSkip}
                  className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
                >
                  Skip setup
                </button>
              )}

              <button
                type="button"
                onClick={() => setStep((step + 1) as Step)}
                disabled={!canProceed()}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
              >
                Continue
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-xs mt-6">
          You can change all settings later in Settings
        </p>
      </div>
    </div>
  );
}
