/**
 * Firehorse Pipeline Page
 *
 * Displays Firehorse Omnichannel lead pipeline, signal feed,
 * and sales automation status from the backend API.
 */

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Lead {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  company: string | null;
  country: string;
  state: string;
  created_at: string;
}

interface Signal {
  id: string;
  company_name: string;
  signal_type: string;
  correlation: string;
  status: string;
  created_at: string;
}

type PipelineTab = 'leads' | 'signals';

const STATE_COLORS: Record<string, string> = {
  New: 'bg-blue-100 text-blue-800',
  Cold_1_Sent: 'bg-yellow-100 text-yellow-800',
  Cold_1_Opened: 'bg-orange-100 text-orange-800',
  Cold_2_Sent: 'bg-amber-100 text-amber-800',
  Cold_3_Sent: 'bg-red-100 text-red-800',
  Engaged: 'bg-green-100 text-green-800',
  Meeting_Booked: 'bg-emerald-100 text-emerald-800',
  Converted: 'bg-primary-100 text-primary-800',
};

const CORRELATION_COLORS: Record<string, string> = {
  ULTRA: 'bg-red-100 text-red-800 font-bold',
  HIGH: 'bg-orange-100 text-orange-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  LOW: 'bg-gray-100 text-gray-600',
};

export function FirehorsePipelinePage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<PipelineTab>('leads');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [leadsRes, signalsRes] = await Promise.all([
          supabase
            .from('firehorse_leads')
            .select('id, email, first_name, last_name, company, country, state, created_at')
            .order('created_at', { ascending: false })
            .limit(50),
          supabase
            .from('firehorse_signals')
            .select('id, company_name, signal_type, correlation, status, created_at')
            .order('created_at', { ascending: false })
            .limit(50),
        ]);

        if (leadsRes.data) setLeads(leadsRes.data);
        if (signalsRes.data) setSignals(signalsRes.data);
      } catch (err) {
        console.error('Failed to fetch Firehorse data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const leadsByState = leads.reduce<Record<string, number>>((acc, lead) => {
    acc[lead.state] = (acc[lead.state] || 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Firehorse Pipeline</h2>
        <p className="text-sm text-gray-500 mt-1">Omnichannel sales automation &middot; Lead pipeline &amp; signal feed</p>
      </div>

      {/* Pipeline summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="card">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Total Leads</p>
          <p className="text-2xl font-bold text-gray-900">{leads.length}</p>
        </div>
        <div className="card">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Engaged</p>
          <p className="text-2xl font-bold text-green-600">{leadsByState['Engaged'] || 0}</p>
        </div>
        <div className="card">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Meetings Booked</p>
          <p className="text-2xl font-bold text-emerald-600">{leadsByState['Meeting_Booked'] || 0}</p>
        </div>
        <div className="card">
          <p className="text-xs text-gray-500 uppercase tracking-wider">Pending Signals</p>
          <p className="text-2xl font-bold text-orange-600">{signals.filter(s => s.status === 'pending').length}</p>
        </div>
      </div>

      {/* Conversion funnel */}
      {leads.length > 0 && (
        <div className="card mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Pipeline Funnel</h3>
          <div className="space-y-2">
            {[
              { label: 'New', key: 'New', color: 'bg-blue-500' },
              { label: 'Cold Outreach', key: 'Cold_1_Sent', color: 'bg-yellow-500' },
              { label: 'Engaged', key: 'Engaged', color: 'bg-green-500' },
              { label: 'Meeting Booked', key: 'Meeting_Booked', color: 'bg-emerald-500' },
              { label: 'Converted', key: 'Converted', color: 'bg-sky-500' },
            ].map((stage) => {
              const count = leadsByState[stage.key] || 0;
              const pct = leads.length > 0 ? Math.round((count / leads.length) * 100) : 0;
              return (
                <div key={stage.key} className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-28 text-right">{stage.label}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                    <div
                      className={`h-full ${stage.color} rounded-full transition-all duration-500 flex items-center justify-end pr-2`}
                      style={{ width: `${Math.max(pct, 2)}%` }}
                    >
                      {pct > 8 && (
                        <span className="text-[10px] text-white font-medium">{count}</span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 w-10">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab selector */}
      <div className="flex bg-gray-100 rounded-lg p-1 mb-4 w-fit">
        <button
          onClick={() => setTab('leads')}
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
            tab === 'leads' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Leads ({leads.length})
        </button>
        <button
          onClick={() => setTab('signals')}
          className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
            tab === 'signals' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Signals ({signals.length})
        </button>
      </div>

      {loading ? (
        <div className="card animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      ) : tab === 'leads' ? (
        /* Leads table */
        <div className="card overflow-x-auto">
          {leads.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No leads yet. Use POST /api/v1/firehorse/leads to add leads.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Contact</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Company</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Country</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">State</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Created</th>
                </tr>
              </thead>
              <tbody>
                {leads.map(lead => (
                  <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 px-3">
                      <div className="font-medium text-gray-900">
                        {lead.first_name || ''} {lead.last_name || ''}
                      </div>
                      <div className="text-gray-500 text-xs">{lead.email}</div>
                    </td>
                    <td className="py-2 px-3 text-gray-700">{lead.company || '—'}</td>
                    <td className="py-2 px-3 text-gray-700">{lead.country}</td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${STATE_COLORS[lead.state] || 'bg-gray-100 text-gray-600'}`}>
                        {lead.state.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-gray-500 text-xs">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        /* Signals table */
        <div className="card overflow-x-auto">
          {signals.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No signals collected yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Company</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Signal</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Correlation</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Status</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {signals.map(signal => (
                  <tr key={signal.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 px-3 font-medium text-gray-900">{signal.company_name}</td>
                    <td className="py-2 px-3 text-gray-700">{signal.signal_type}</td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${CORRELATION_COLORS[signal.correlation] || 'bg-gray-100 text-gray-600'}`}>
                        {signal.correlation}
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        signal.status === 'approved' ? 'bg-green-100 text-green-800' :
                        signal.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {signal.status}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-gray-500 text-xs">
                      {new Date(signal.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
