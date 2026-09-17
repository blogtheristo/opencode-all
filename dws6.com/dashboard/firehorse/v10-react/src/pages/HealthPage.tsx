/**
 * System Health Page
 * Shows backend API health, agent count, and service status.
 * MVP Feature #2
 */

import { useState, useEffect, useCallback } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || '';

interface HealthData {
  status: string;
  version?: string;
  uptime?: number;
  agents?: number;
  timestamp?: string;
}

interface ServiceCheck {
  name: string;
  endpoint: string;
  status: 'checking' | 'healthy' | 'degraded' | 'down';
  latencyMs?: number;
  detail?: string;
}

const STATUS_COLORS: Record<string, string> = {
  checking: 'bg-background0',
  healthy: 'bg-green-500',
  degraded: 'bg-amber-500',
  down: 'bg-red-500',
};

export function HealthPage() {
  const [services, setServices] = useState<ServiceCheck[]>([
    { name: 'API Server', endpoint: '/health', status: 'checking' },
    { name: 'Agent Registry', endpoint: '/api/agents', status: 'checking' },
    { name: 'MCP Server', endpoint: '/mcp', status: 'checking' },
    { name: 'Compliance Engine', endpoint: '/api/v1/compliance', status: 'checking' },
    { name: 'Memory Service', endpoint: '/api/v1/memory/stats', status: 'checking' },
  ]);
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  const checkService = useCallback(async (service: ServiceCheck): Promise<ServiceCheck> => {
    const start = performance.now();
    try {
      const res = await fetch(`${API_BASE}${service.endpoint}`, {
        method: service.endpoint === '/mcp' ? 'POST' : 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(5000),
        ...(service.endpoint === '/mcp' ? {
          body: JSON.stringify({ jsonrpc: '2.0', method: 'tools/list', id: 1 }),
        } : {}),
      });
      const latencyMs = Math.round(performance.now() - start);

      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        if (service.endpoint === '/health') {
          setHealthData(data);
        }
        return {
          ...service,
          status: 'healthy',
          latencyMs,
          detail: service.endpoint === '/api/agents' && data.agents
            ? `${data.agents.length} agents registered`
            : service.endpoint === '/mcp' && data.result?.tools
              ? `${data.result.tools.length} tools exposed`
              : undefined,
        };
      }
      return { ...service, status: 'degraded', latencyMs, detail: `HTTP ${res.status}` };
    } catch {
      return {
        ...service,
        status: 'down',
        latencyMs: Math.round(performance.now() - start),
        detail: 'Connection failed',
      };
    }
  }, []);

  const runHealthCheck = useCallback(async () => {
    setServices((prev) => prev.map((s) => ({ ...s, status: 'checking' as const })));
    const results = await Promise.all(services.map(checkService));
    setServices(results);
    setLastChecked(new Date());
  }, [services, checkService]);

  useEffect(() => {
    runHealthCheck();
    const interval = setInterval(runHealthCheck, 30000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const overallStatus = services.every((s) => s.status === 'healthy')
    ? 'All Systems Operational'
    : services.some((s) => s.status === 'down')
      ? 'Service Disruption'
      : services.some((s) => s.status === 'checking')
        ? 'Checking...'
        : 'Partial Degradation';

  const overallColor = services.every((s) => s.status === 'healthy')
    ? 'text-green-400'
    : services.some((s) => s.status === 'down')
      ? 'text-red-400'
      : 'text-amber-400';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">System Health</h1>
          <p className={`text-sm font-medium mt-1 ${overallColor}`}>{overallStatus}</p>
        </div>
        <div className="text-right">
          <button
            onClick={runHealthCheck}
            className="btn-secondary text-sm"
          >
            Refresh
          </button>
          {lastChecked && (
            <p className="text-xs text-fg-muted mt-1">
              Last checked: {lastChecked.toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>

      {/* Service Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => (
          <div key={service.name} className="card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`w-3 h-3 rounded-full ${STATUS_COLORS[service.status]} ${
                  service.status === 'checking' ? 'animate-pulse' : ''
                }`} />
                <div>
                  <p className="font-medium text-foreground">{service.name}</p>
                  <p className="text-xs text-fg-muted">{service.endpoint}</p>
                </div>
              </div>
              <div className="text-right">
                {service.latencyMs !== undefined && (
                  <p className="text-sm font-mono text-fg-muted">{service.latencyMs}ms</p>
                )}
                {service.detail && (
                  <p className="text-xs text-fg-muted">{service.detail}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Health Details */}
      {healthData && (
        <div className="card">
          <h2 className="text-lg font-semibold text-foreground mb-3">Server Info</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-fg-muted">Status</p>
              <p className="text-sm font-medium text-foreground">{healthData.status}</p>
            </div>
            <div>
              <p className="text-xs text-fg-muted">Version</p>
              <p className="text-sm font-medium text-foreground">{healthData.version || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs text-fg-muted">Uptime</p>
              <p className="text-sm font-medium text-foreground">
                {healthData.uptime
                  ? `${Math.floor(healthData.uptime / 3600)}h ${Math.floor((healthData.uptime % 3600) / 60)}m`
                  : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-xs text-fg-muted">Agents</p>
              <p className="text-sm font-medium text-foreground">{healthData.agents ?? 'N/A'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
