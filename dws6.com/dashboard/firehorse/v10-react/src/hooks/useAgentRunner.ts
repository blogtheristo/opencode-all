/**
 * useAgentRunner Hook
 *
 * Manages agent discovery, execution, and result history.
 * Uses the DWS IQ backend API for agent operations.
 */

import { useState, useCallback } from 'react';
import { useApi } from './useApi';
import type { AgentCatalogEntry, AgentExecutionResult } from '../components/agent-monitor/types';

// Agent catalog with input schemas — matches backend agent registry
const AGENT_CATALOG: AgentCatalogEntry[] = [
  {
    name: 'compliance',
    description: 'Assess EU regulatory compliance (ETS, CBAM, CSRD, Fit for 55, EU AI Act)',
    capabilities: ['compliance', 'eu-regulation', 'csrd', 'cbam', 'ets'],
    inputSchema: {
      industry: {
        type: 'select',
        label: 'Industry',
        required: true,
        options: ['steel', 'cement', 'chemicals', 'construction', 'energy', 'maritime', 'agriculture', 'hydrogen'],
      },
      regulations: {
        type: 'string',
        label: 'Regulations to check',
        required: false,
        placeholder: 'CSRD, CBAM, ETS (comma-separated)',
        defaultValue: 'CSRD, CBAM, ETS',
      },
      annualEmissions: {
        type: 'number',
        label: 'Annual emissions (tCO2e)',
        required: false,
        placeholder: '10000',
      },
    },
  },
  {
    name: 'sitesense',
    description: 'Construction site safety assessment with EN 13001 crane warnings',
    capabilities: ['safety', 'construction', 'weather', 'crane'],
    inputSchema: {
      location: {
        type: 'string',
        label: 'Site location',
        required: true,
        placeholder: 'Helsinki, Finland',
      },
      temperature: {
        type: 'number',
        label: 'Temperature (C)',
        required: false,
        placeholder: '15',
      },
      windSpeed: {
        type: 'number',
        label: 'Wind speed (m/s)',
        required: false,
        placeholder: '8',
      },
      workerCount: {
        type: 'number',
        label: 'Worker count',
        required: false,
        placeholder: '25',
      },
    },
  },
  {
    name: 'material-oracle',
    description: 'Embodied carbon footprint calculation per EN 15978 lifecycle assessment',
    capabilities: ['carbon', 'materials', 'lca', 'embodied-carbon'],
    inputSchema: {
      material: {
        type: 'select',
        label: 'Material type',
        required: true,
        options: ['concrete', 'steel', 'timber', 'aluminium', 'glass', 'brick', 'insulation'],
      },
      quantity: {
        type: 'number',
        label: 'Quantity (tonnes)',
        required: true,
        placeholder: '100',
      },
      stage: {
        type: 'select',
        label: 'LCA Stage',
        required: false,
        options: ['A1-A3', 'A4', 'A5', 'B1-B7', 'C1-C4', 'D'],
        defaultValue: 'A1-A3',
      },
    },
  },
  {
    name: 'schedule-genius',
    description: 'Optimize project schedules and detect critical path delays',
    capabilities: ['scheduling', 'project-management', 'critical-path'],
    inputSchema: {
      projectName: {
        type: 'string',
        label: 'Project name',
        required: true,
        placeholder: 'Helsinki Kalasatama Phase 3',
      },
      startDate: {
        type: 'string',
        label: 'Start date',
        required: false,
        placeholder: '2026-04-01',
      },
      endDate: {
        type: 'string',
        label: 'End date',
        required: false,
        placeholder: '2027-06-30',
      },
    },
  },
  {
    name: 'customer-sat',
    description: 'Customer satisfaction analysis and NPS scoring',
    capabilities: ['customer', 'nps', 'satisfaction', 'feedback'],
    inputSchema: {
      segment: {
        type: 'select',
        label: 'Customer segment',
        required: true,
        options: ['enterprise', 'mid-market', 'small-business', 'government'],
      },
      period: {
        type: 'select',
        label: 'Analysis period',
        required: false,
        options: ['last-30-days', 'last-quarter', 'last-year', 'all-time'],
        defaultValue: 'last-quarter',
      },
    },
  },
  {
    name: 'viability',
    description: 'Financial viability and ROI analysis with Monte Carlo simulation',
    capabilities: ['finance', 'roi', 'risk', 'monte-carlo'],
    inputSchema: {
      projectName: {
        type: 'string',
        label: 'Project name',
        required: true,
        placeholder: 'Oulu Industrial Park',
      },
      budget: {
        type: 'number',
        label: 'Budget (EUR)',
        required: true,
        placeholder: '5000000',
      },
      timelineMonths: {
        type: 'number',
        label: 'Timeline (months)',
        required: false,
        placeholder: '24',
      },
    },
  },
];

interface UseAgentRunnerReturn {
  agents: AgentCatalogEntry[];
  selectedAgent: AgentCatalogEntry | null;
  selectAgent: (name: string) => void;
  executeAgent: (input: Record<string, unknown>) => Promise<void>;
  result: AgentExecutionResult | null;
  history: AgentExecutionResult[];
  loading: boolean;
  error: string | null;
  clearResult: () => void;
}

export function useAgentRunner(): UseAgentRunnerReturn {
  const [selectedAgent, setSelectedAgent] = useState<AgentCatalogEntry | null>(null);
  const [result, setResult] = useState<AgentExecutionResult | null>(null);
  const [history, setHistory] = useState<AgentExecutionResult[]>([]);
  const api = useApi<AgentExecutionResult>();

  const selectAgent = useCallback((name: string) => {
    const agent = AGENT_CATALOG.find(a => a.name === name) || null;
    setSelectedAgent(agent);
    setResult(null);
  }, []);

  const executeAgent = useCallback(async (input: Record<string, unknown>) => {
    if (!selectedAgent) return;

    const startTime = Date.now();

    const response = await api.execute(`/api/v1/agents/${selectedAgent.name}/run`, {
      method: 'POST',
      body: JSON.stringify({ input }),
    });

    if (response) {
      const executionResult: AgentExecutionResult = {
        ...response,
        durationMs: response.durationMs || (Date.now() - startTime),
        timestamp: response.timestamp || new Date().toISOString(),
      };
      setResult(executionResult);
      setHistory(prev => [executionResult, ...prev].slice(0, 20));
    } else if (api.error) {
      // Create a mock result for demo when backend is unavailable
      const mockResult: AgentExecutionResult = {
        agentName: selectedAgent.name,
        status: 'success',
        confidence: 0.85 + Math.random() * 0.1,
        reasoning: `${selectedAgent.description}. Analysis completed based on provided inputs. This is a demo result — connect to the DWS IQ backend for live agent execution.`,
        recommendations: [
          `Review ${selectedAgent.name} output and validate against current data`,
          'Schedule follow-up assessment in 30 days',
          'Cross-reference with related compliance requirements',
        ],
        result: { input, demo: true, score: Math.round(65 + Math.random() * 30) },
        durationMs: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      };
      setResult(mockResult);
      setHistory(prev => [mockResult, ...prev].slice(0, 20));
    }
  }, [selectedAgent, api]);

  const clearResult = useCallback(() => {
    setResult(null);
    api.reset();
  }, [api]);

  return {
    agents: AGENT_CATALOG,
    selectedAgent,
    selectAgent,
    executeAgent,
    result,
    history,
    loading: api.loading,
    error: api.error,
    clearResult,
  };
}
