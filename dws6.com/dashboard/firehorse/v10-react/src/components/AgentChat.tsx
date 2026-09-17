/**
 * Agent Chat Component
 * Multi-agent chat interface for DWS IQ AI agents.
 * Separate from ClimateAssistant - this component lets users interact
 * with specialized Firehorse agents (SiteSense, ScheduleGenius, etc.).
 */

import { useState, useRef, useEffect, useCallback } from 'react';

// Agent definitions
interface Agent {
  id: string;
  name: string;
  description: string;
  color: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'agent';
  content: string;
  agentId: string;
  timestamp: Date;
}

type AgentStatus = 'online' | 'processing' | 'offline';

const AGENTS: Agent[] = [
  { id: 'sitesense', name: 'SiteSense', description: 'Site monitoring and environmental analysis', color: 'bg-emerald-500' },
  { id: 'schedulegenius', name: 'ScheduleGenius', description: 'Project scheduling and timeline optimization', color: 'bg-blue-500' },
  { id: 'materialoracle', name: 'MaterialOracle', description: 'Material selection and carbon impact assessment', color: 'bg-amber-500' },
  { id: 'customersat', name: 'CustomerSat', description: 'Customer satisfaction and feedback analysis', color: 'bg-purple-500' },
  { id: 'viability', name: 'Viability', description: 'Financial viability and risk assessment', color: 'bg-rose-500' },
];

const AGENT_WELCOME_MESSAGES: Record<string, string> = {
  sitesense: 'Hello, I\'m SiteSense. I can analyze site conditions, environmental data, and provide real-time monitoring insights for your projects. What site would you like to examine?',
  schedulegenius: 'Welcome! I\'m ScheduleGenius. I optimize project schedules, identify critical path issues, and forecast completion dates. What scheduling challenge can I help with?',
  materialoracle: 'Greetings. I\'m MaterialOracle. I evaluate material choices for embodied carbon, EN 15978 compliance, and cost-effectiveness. What material decision are you facing?',
  customersat: 'Hi there! I\'m CustomerSat. I analyze customer feedback, satisfaction metrics, and stakeholder sentiment across your portfolio. How can I assist you?',
  viability: 'Hello. I\'m Viability. I assess project financial health, ROI projections, and risk factors. Which project\'s viability would you like to evaluate?',
};

const API_URL = import.meta.env.VITE_API_URL || '';

export function AgentChat() {
  const [selectedAgent, setSelectedAgent] = useState<Agent>(AGENTS[0]);
  const [agentStatus, setAgentStatus] = useState<AgentStatus>('online');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with welcome message when agent changes
  useEffect(() => {
    const welcomeMsg: ChatMessage = {
      id: `welcome-${selectedAgent.id}`,
      role: 'agent',
      content: AGENT_WELCOME_MESSAGES[selectedAgent.id] || `Hello, I'm ${selectedAgent.name}. How can I help?`,
      agentId: selectedAgent.id,
      timestamp: new Date(),
    };
    setMessages([welcomeMsg]);
    setAgentStatus('online');
  }, [selectedAgent]);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleAgentChange = useCallback((agentId: string) => {
    const agent = AGENTS.find((a) => a.id === agentId);
    if (agent) setSelectedAgent(agent);
  }, []);

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      agentId: selectedAgent.id,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setAgentStatus('processing');

    try {
      const response = await fetch(`${API_URL}/api/agents/${selectedAgent.id}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed }),
      });

      if (!response.ok) throw new Error(`Agent error: ${response.status}`);

      const data = await response.json();

      const agentMsg: ChatMessage = {
        id: `agent-${Date.now()}`,
        role: 'agent',
        content: data.content || data.message || 'I processed your request but have no specific response.',
        agentId: selectedAgent.id,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, agentMsg]);
    } catch {
      // Fallback response when API is unavailable
      const fallbackMsg: ChatMessage = {
        id: `agent-${Date.now()}`,
        role: 'agent',
        content: `I'm currently in demo mode. In production, ${selectedAgent.name} would analyze your query: "${trimmed}"\n\nConnect the agent backend via VITE_API_URL to enable full functionality.`,
        agentId: selectedAgent.id,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
      setAgentStatus('online');
    }
  }, [input, isLoading, selectedAgent]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      sendMessage();
    },
    [sendMessage]
  );

  const statusIndicator: Record<AgentStatus, { color: string; label: string }> = {
    online: { color: 'bg-green-400', label: 'Online' },
    processing: { color: 'bg-yellow-400 animate-pulse', label: 'Processing' },
    offline: { color: 'bg-background0', label: 'Offline' },
  };

  return (
    <div className="flex flex-col h-full bg-surface rounded-xl border border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 ${selectedAgent.color} rounded-full flex items-center justify-center`}>
              <span className="text-white text-sm font-bold">{selectedAgent.name.charAt(0)}</span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">{selectedAgent.name}</h3>
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${statusIndicator[agentStatus].color}`} />
                <span className="text-[10px] text-fg-muted">{statusIndicator[agentStatus].label}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Agent Selector */}
        <select
          value={selectedAgent.id}
          onChange={(e) => handleAgentChange(e.target.value)}
          className="w-full px-3 py-1.5 bg-fg-muted/10 border border-border rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          aria-label="Select AI agent"
        >
          {AGENTS.map((agent) => (
            <option key={agent.id} value={agent.id}>
              {agent.name} &mdash; {agent.description}
            </option>
          ))}
        </select>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[300px]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm ${
                msg.role === 'user'
                  ? 'bg-primary-600 text-white'
                  : 'bg-fg-muted/10 text-foreground'
              }`}
            >
              {msg.role === 'agent' && (
                <div className="flex items-center gap-1.5 mb-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${selectedAgent.color}`} />
                  <span className="text-[10px] font-medium text-fg-muted">{selectedAgent.name}</span>
                </div>
              )}
              <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
              <p className="text-[10px] text-fg-muted mt-1.5">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-fg-muted/10 rounded-xl px-4 py-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-background0 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-background0 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-background0 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-border">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask ${selectedAgent.name}...`}
            className="flex-1 px-3 py-2.5 bg-fg-muted/10 border border-border rounded-lg text-sm text-white placeholder-fg-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
