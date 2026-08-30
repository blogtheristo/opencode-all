/**
 * Agent Runner View
 * Interactive panel for selecting, configuring, and executing DWS IQ agents.
 * Shows agent catalog, input form, execution results, and run history.
 */

import { useState, useCallback } from 'react';
import { useAgentRunner } from '../../hooks/useAgentRunner';
import type { AgentCatalogEntry, AgentExecutionResult, AgentInputField } from './types';

function AgentCard({
  agent,
  isSelected,
  onClick,
}: {
  agent: AgentCatalogEntry;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-lg border transition-all ${
        isSelected
          ? 'bg-primary-50 border-primary-300 ring-1 ring-primary-200'
          : 'bg-surface border-border hover:border-border hover:shadow-sm'
      }`}
    >
      <div className="text-sm font-semibold text-foreground">{agent.name}</div>
      <div className="text-xs text-fg-muted mt-0.5 line-clamp-2">{agent.description}</div>
      <div className="flex flex-wrap gap-1 mt-2">
        {agent.capabilities.slice(0, 3).map(cap => (
          <span
            key={cap}
            className="text-[9px] px-1.5 py-0.5 bg-border text-fg-muted rounded-full"
          >
            {cap}
          </span>
        ))}
      </div>
    </button>
  );
}

function InputField({
  name,
  field,
  value,
  onChange,
}: {
  name: string;
  field: AgentInputField;
  value: string | number | boolean;
  onChange: (name: string, value: string | number | boolean) => void;
}) {
  if (field.type === 'select' && field.options) {
    return (
      <div>
        <label className="block text-xs font-medium text-foreground mb-1">
          {field.label}
          {field.required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        <select
          value={String(value || '')}
          onChange={e => onChange(name, e.target.value)}
          className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-surface focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="">Select...</option>
          {field.options.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
    );
  }

  if (field.type === 'number') {
    return (
      <div>
        <label className="block text-xs font-medium text-foreground mb-1">
          {field.label}
          {field.required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        <input
          type="number"
          value={value === '' || value === undefined ? '' : Number(value)}
          onChange={e => onChange(name, e.target.value === '' ? '' : Number(e.target.value))}
          placeholder={field.placeholder}
          className="w-full text-sm border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>
    );
  }

  if (field.type === 'boolean') {
    return (
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={e => onChange(name, e.target.checked)}
          className="w-4 h-4 rounded border-border text-primary-600 focus:ring-primary-500"
        />
        <label className="text-xs font-medium text-foreground">{field.label}</label>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-xs font-medium text-foreground mb-1">
        {field.label}
        {field.required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        type="text"
        value={String(value || '')}
        onChange={e => onChange(name, e.target.value)}
        placeholder={field.placeholder}
        className="w-full text-sm border border-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
      />
    </div>
  );
}

function ResultPanel({ result, onClear }: { result: AgentExecutionResult; onClear: () => void }) {
  const isDemo = (result.result as Record<string, unknown>).demo === true;
  const score = (result.result as Record<string, unknown>).score as number | undefined;
  const confidencePct = Math.round(result.confidence * 100);

  return (
    <div className="bg-surface border border-border rounded-xl p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${
            result.status === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`} />
          <h4 className="text-sm font-bold text-foreground">
            {result.agentName} — Result
          </h4>
          {isDemo && (
            <span className="text-[9px] px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded-full font-medium">
              DEMO
            </span>
          )}
        </div>
        <button onClick={onClear} className="text-fg-muted hover:text-fg-muted text-sm">
          Clear
        </button>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-background rounded-lg p-3 text-center">
          <div className="text-[10px] text-fg-muted uppercase">Confidence</div>
          <div className={`text-xl font-bold font-mono ${
            confidencePct >= 80 ? 'text-green-600' : confidencePct >= 60 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {confidencePct}%
          </div>
        </div>
        {score !== undefined && (
          <div className="bg-background rounded-lg p-3 text-center">
            <div className="text-[10px] text-fg-muted uppercase">Score</div>
            <div className={`text-xl font-bold font-mono ${
              score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {score}
            </div>
          </div>
        )}
        <div className="bg-background rounded-lg p-3 text-center">
          <div className="text-[10px] text-fg-muted uppercase">Duration</div>
          <div className="text-xl font-bold font-mono text-foreground">
            {result.durationMs < 1000
              ? `${result.durationMs}ms`
              : `${(result.durationMs / 1000).toFixed(1)}s`}
          </div>
        </div>
      </div>

      {/* Reasoning */}
      <div>
        <div className="text-[10px] font-medium text-fg-muted uppercase tracking-wide mb-1">
          Reasoning
        </div>
        <p className="text-xs text-foreground leading-relaxed">{result.reasoning}</p>
      </div>

      {/* Recommendations */}
      {result.recommendations.length > 0 && (
        <div>
          <div className="text-[10px] font-medium text-fg-muted uppercase tracking-wide mb-1">
            Recommendations
          </div>
          <ul className="space-y-1">
            {result.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-foreground">
                <span className="text-primary-500 mt-0.5 shrink-0">-</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Timestamp */}
      <div className="text-[10px] text-fg-muted pt-2 border-t border-border">
        Executed at {new Date(result.timestamp).toLocaleString()}
      </div>
    </div>
  );
}

function HistoryPanel({ history }: { history: AgentExecutionResult[] }) {
  if (history.length === 0) return null;

  return (
    <div className="bg-background border border-border rounded-xl p-4">
      <h4 className="text-xs font-semibold text-fg-muted uppercase tracking-wide mb-3">
        Run History ({history.length})
      </h4>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {history.map((entry, i) => (
          <div key={i} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${
                entry.status === 'success' ? 'bg-green-500' : 'bg-red-500'
              }`} />
              <span className="text-xs font-medium text-foreground">{entry.agentName}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-fg-muted font-mono">
                {Math.round(entry.confidence * 100)}%
              </span>
              <span className="text-[10px] text-fg-muted">
                {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AgentRunner() {
  const {
    agents,
    selectedAgent,
    selectAgent,
    executeAgent,
    result,
    history,
    loading,
    error,
    clearResult,
  } = useAgentRunner();

  const [formValues, setFormValues] = useState<Record<string, string | number | boolean>>({});

  const handleSelectAgent = useCallback((name: string) => {
    selectAgent(name);
    // Initialize form with default values
    const agent = agents.find(a => a.name === name);
    if (agent) {
      const defaults: Record<string, string | number | boolean> = {};
      Object.entries(agent.inputSchema).forEach(([key, field]) => {
        if (field.defaultValue !== undefined) {
          defaults[key] = field.defaultValue;
        }
      });
      setFormValues(defaults);
    }
  }, [selectAgent, agents]);

  const handleFieldChange = useCallback((name: string, value: string | number | boolean) => {
    setFormValues(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleExecute = useCallback(() => {
    if (!selectedAgent) return;

    // Validate required fields
    const missing = Object.entries(selectedAgent.inputSchema)
      .filter(([key, field]) => field.required && !formValues[key])
      .map(([, field]) => field.label);

    if (missing.length > 0) {
      alert(`Please fill in required fields: ${missing.join(', ')}`);
      return;
    }

    // Filter out empty values
    const input: Record<string, unknown> = {};
    Object.entries(formValues).forEach(([key, value]) => {
      if (value !== '' && value !== undefined) {
        input[key] = value;
      }
    });

    executeAgent(input);
  }, [selectedAgent, formValues, executeAgent]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Agent Runner</h3>
          <p className="text-xs text-fg-muted">
            Select an agent, configure inputs, and execute
          </p>
        </div>
        <div className="text-[10px] text-fg-muted">
          {agents.length} agents available
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Agent catalog */}
        <div className="space-y-2">
          <div className="text-[10px] font-medium text-fg-muted uppercase tracking-wide">
            Agent Catalog
          </div>
          <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
            {agents.map(agent => (
              <AgentCard
                key={agent.name}
                agent={agent}
                isSelected={selectedAgent?.name === agent.name}
                onClick={() => handleSelectAgent(agent.name)}
              />
            ))}
          </div>
        </div>

        {/* Center: Input form */}
        <div className="space-y-3">
          {selectedAgent ? (
            <>
              <div className="bg-surface border border-border rounded-xl p-4">
                <div className="text-[10px] font-medium text-fg-muted uppercase tracking-wide mb-3">
                  Configure — {selectedAgent.name}
                </div>
                <div className="space-y-3">
                  {Object.entries(selectedAgent.inputSchema).map(([key, field]) => (
                    <InputField
                      key={key}
                      name={key}
                      field={field}
                      value={formValues[key] ?? ''}
                      onChange={handleFieldChange}
                    />
                  ))}
                </div>

                <button
                  onClick={handleExecute}
                  disabled={loading}
                  className={`w-full mt-4 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    loading
                      ? 'bg-fg-muted/20 text-fg-muted cursor-not-allowed'
                      : 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-fg-muted border-t-transparent rounded-full animate-spin" />
                      Running...
                    </span>
                  ) : (
                    `Run ${selectedAgent.name}`
                  )}
                </button>

                {error && (
                  <div className="mt-2 text-xs text-amber-600 bg-amber-50 rounded-lg p-2">
                    Backend unavailable — showing demo result
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-background border border-dashed border-border rounded-xl p-8 text-center">
              <div className="text-fg-muted text-sm">Select an agent to configure</div>
              <div className="text-fg-muted text-xs mt-1">
                Choose from the catalog on the left
              </div>
            </div>
          )}
        </div>

        {/* Right: Results + History */}
        <div className="space-y-4">
          {result ? (
            <ResultPanel result={result} onClear={clearResult} />
          ) : (
            <div className="bg-background border border-dashed border-border rounded-xl p-8 text-center">
              <div className="text-fg-muted text-sm">No results yet</div>
              <div className="text-fg-muted text-xs mt-1">
                Execute an agent to see results here
              </div>
            </div>
          )}

          <HistoryPanel history={history} />
        </div>
      </div>
    </div>
  );
}
