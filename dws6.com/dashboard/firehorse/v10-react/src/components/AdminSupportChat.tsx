import { useMemo, useState } from 'react';
import { useApi } from '../hooks/useApi';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface AdminSupportResponse {
  content: string;
  model: string;
  timestamp: string;
}

const INITIAL_MESSAGE: Message = {
  id: 'admin-support-welcome',
  role: 'assistant',
  content:
    'Admin support channel is ready. Ask about platform operations, route behavior, deployment checks, or compliance workflow troubleshooting.',
};

export function AdminSupportChat() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const { execute, loading, error } = useApi<AdminSupportResponse>({ retries: 0 });

  const conversationHistory = useMemo(
    () =>
      messages
        .filter((m) => m.id !== INITIAL_MESSAGE.id)
        .map((m) => ({
          role: m.role,
          content: m.content,
        })),
    [messages],
  );

  async function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    const response = await execute('/api/v1/admin/support/chat', {
      method: 'POST',
      body: JSON.stringify({
        message: trimmed,
        conversationHistory,
      }),
    });

    if (response?.content) {
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: response.content,
        },
      ]);
    }
  }

  return (
    <div className="rounded-lg border border-amber-500/30 bg-surface/60">
      <div className="border-b border-amber-500/20 px-4 py-3">
        <h3 className="text-sm font-semibold text-amber-200">Admin Support Chat</h3>
        <p className="mt-1 text-xs text-amber-100/70">Backend-enforced admin/owner access</p>
      </div>

      <div className="max-h-80 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-foreground'
                  : 'border border-amber-500/20 bg-surface text-foreground'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <p className="text-xs text-amber-300" role="status" aria-live="polite">
            Assistant is preparing a response...
          </p>
        )}
      </div>

      <div className="border-t border-amber-500/20 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                void handleSend();
              }
            }}
            placeholder="Ask admin support..."
            className="flex-1 rounded-lg border border-amber-500/20 bg-surface px-3 py-2 text-sm text-white placeholder-fg-muted focus:border-transparent focus:outline-none focus:ring-2 focus:ring-amber-500"
            disabled={loading}
          />
          <button
            onClick={() => void handleSend()}
            disabled={loading || !input.trim()}
            className="rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:from-amber-400 hover:to-yellow-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Send
          </button>
        </div>
        {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
      </div>
    </div>
  );
}
