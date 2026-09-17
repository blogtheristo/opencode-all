/**
 * Climate Assistant Chat Component (V10)
 * AI-powered climate compliance assistant with voice interaction
 * - Web Speech API for voice input
 * - Speech Synthesis for reading responses
 * - Google Cloud backend integration
 *
 * Environment Variables:
 * - VITE_API_URL: Backend API URL (Google Cloud Run)
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';

// API URL from environment variable (Google Cloud backend)
const API_URL = import.meta.env.VITE_API_URL || '';

// Message type for chat
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

// Initial welcome message
const welcomeMessage: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: `Hello! I'm your **DWS IQ Climate Intelligence Assistant**. I can help you with:

- **EN 15978** carbon calculations
- **CSRD** compliance reporting
- **EPBD** building certifications
- **ETS** emissions monitoring
- **CBAM** border regulations

What would you like to know?`,
  createdAt: new Date(),
};

export function ClimateAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    transcript,
    interimTranscript,
    isListening,
    isSupported: speechRecognitionSupported,
    error: speechRecognitionError,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition({
    lang: 'en-US',
    continuous: false,
    interimResults: true,
  });

  const {
    speak,
    cancel: cancelSpeech,
    isSpeaking,
    isSupported: speechSynthesisSupported,
  } = useSpeechSynthesis({
    lang: 'en-US',
    rate: 1,
    pitch: 1,
    volume: 1,
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Update input when speech recognition provides transcript
  useEffect(() => {
    if (transcript) {
      setInput(transcript);
      resetTranscript();
    }
  }, [transcript, resetTranscript]);

  // Auto-speak assistant responses if enabled
  useEffect(() => {
    if (autoSpeak && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant' && !isLoading) {
        // Remove markdown formatting for better speech
        const cleanContent = lastMessage.content
          .replace(/\*\*/g, '')
          .replace(/\*/g, '')
          .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
          .replace(/#{1,6}\s/g, '');

        speak(cleanContent);
      }
    }
  }, [messages, autoSpeak, isLoading, speak]);

  const handleVoiceToggle = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  const handleSpeakToggle = useCallback(() => {
    if (isSpeaking) {
      cancelSpeech();
    } else {
      setAutoSpeak(!autoSpeak);
    }
  }, [isSpeaking, cancelSpeech, autoSpeak]);

  const sendMessage = useCallback(async (userMessage: string) => {
    if (!userMessage.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: userMessage,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setError(null);

    try {
      // Call Google Cloud backend API endpoint
      const response = await fetch(`${API_URL}/api/climate-assistant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.content || data.message || 'I apologize, but I could not process your request.',
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      // Provide a fallback response when backend is unavailable
      const fallbackMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: `I'm currently unable to connect to the backend API.

**Demo Mode:** In production, this assistant provides:
- Real-time carbon calculations using EN 15978 methodology
- CSRD compliance status checks
- EPBD certification generation
- ETS monitoring data

Please ensure the \`VITE_API_URL\` environment variable points to your Google Cloud backend.`,
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (isListening) {
        stopListening();
      }
      if (input.trim()) {
        sendMessage(input);
        setInput('');
      }
    },
    [input, isListening, stopListening, sendMessage]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInput(e.target.value);
    },
    []
  );

  const handleSuggestionClick = useCallback((suggestion: string) => {
    setInput(suggestion);
  }, []);

  // Render message content with basic markdown support
  const renderMessageContent = (content: string) => {
    return content.split('\n').map((line: string, i: number) => {
      // Handle bold text
      if (line.includes('**')) {
        const parts = line.split('**');
        return (
          <p key={i}>
            {parts.map((part: string, j: number) =>
              j % 2 === 1 ? <strong key={j}>{part}</strong> : part
            )}
          </p>
        );
      }
      // Handle bullet points
      if (line.trim().startsWith('-')) {
        return <li key={i}>{line.replace(/^-\s*/, '')}</li>;
      }
      return line ? <p key={i}>{line}</p> : null;
    });
  };

  return (
    <div className="flex flex-col h-full bg-surface rounded-xl shadow-lg border border-border">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
            <span className="text-white text-xl">🤖</span>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Climate Assistant</h3>
            <p className="text-xs text-fg-muted">DWS IQ AI · Powered by Claude</p>
          </div>
        </div>

        {/* Voice Controls */}
        <div className="flex items-center gap-2">
          {/* Text-to-Speech Toggle */}
          {speechSynthesisSupported && (
            <button
              onClick={handleSpeakToggle}
              className={`p-2 rounded-lg transition-colors ${
                autoSpeak
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-border text-fg-muted hover:bg-fg-muted/20'
              }`}
              title={autoSpeak ? 'Disable auto-speak' : 'Enable auto-speak'}
            >
              {isSpeaking ? '🔊' : autoSpeak ? '🔉' : '🔇'}
            </button>
          )}

          {/* Status Indicator */}
          <div className="flex items-center gap-2">
            {isLoading && (
              <span className="text-xs text-primary-600 font-medium flex items-center gap-1.5">
                <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></span>
                <span>Thinking...</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {messages.map((message: ChatMessage) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`chat-message ${message.role === 'user' ? 'user' : 'assistant'}`}
            >
              {message.role === 'assistant' ? (
                <div className="prose prose-sm max-w-none">
                  {renderMessageContent(message.content)}
                </div>
              ) : (
                <p className="whitespace-pre-wrap">{message.content}</p>
              )}
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="chat-message assistant">
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 bg-primary-500 rounded-full animate-bounce"
                  style={{ animationDelay: '0ms', animationDuration: '0.6s' }}
                />
                <div
                  className="w-2.5 h-2.5 bg-primary-500 rounded-full animate-bounce"
                  style={{ animationDelay: '150ms', animationDuration: '0.6s' }}
                />
                <div
                  className="w-2.5 h-2.5 bg-primary-500 rounded-full animate-bounce"
                  style={{ animationDelay: '300ms', animationDuration: '0.6s' }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Error display - only show if no fallback was provided */}
        {error && messages[messages.length - 1]?.role !== 'assistant' && (
          <div className="flex justify-center">
            <div className="bg-red-50 text-red-700 px-4 py-2 rounded-lg text-sm">
              ⚠️ {error.message || 'An error occurred'}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border">
        {/* Speech Recognition Error */}
        {speechRecognitionError && (
          <div className="mb-2 text-xs text-red-600">
            Voice input error: {speechRecognitionError}
          </div>
        )}

        {/* Interim Transcript */}
        {interimTranscript && (
          <div className="mb-2 text-sm text-fg-muted italic">
            Listening: {interimTranscript}
          </div>
        )}

        <form onSubmit={onSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Ask about carbon calculations, compliance, reports..."
            className="flex-1 px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            disabled={isLoading || isListening}
          />

          {/* Voice Input Button */}
          {speechRecognitionSupported && (
            <button
              type="button"
              onClick={handleVoiceToggle}
              className={`p-3 rounded-lg transition-all ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-border text-foreground hover:bg-fg-muted/20'
              }`}
              title={isListening ? 'Stop listening' : 'Start voice input'}
            >
              {isListening ? '⏹️' : '🎤'}
            </button>
          )}

          {/* Send Button */}
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '...' : '📤'}
          </button>
        </form>

        {/* Quick Suggestions */}
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={() =>
              handleSuggestionClick('Calculate embodied carbon for 500m³ of concrete C30/37')
            }
            className="text-xs px-3 py-1 bg-border hover:bg-fg-muted/20 rounded-full text-foreground transition-colors"
            disabled={isLoading}
          >
            💡 Carbon calculation
          </button>
          <button
            onClick={() => handleSuggestionClick('Check CSRD compliance for Q4 2025')}
            className="text-xs px-3 py-1 bg-border hover:bg-fg-muted/20 rounded-full text-foreground transition-colors"
            disabled={isLoading}
          >
            ✅ CSRD compliance
          </button>
          <button
            onClick={() => handleSuggestionClick('Generate EPBD certificate for Helsinki HQ')}
            className="text-xs px-3 py-1 bg-border hover:bg-fg-muted/20 rounded-full text-foreground transition-colors"
            disabled={isLoading}
          >
            📋 EPBD report
          </button>
        </div>
      </div>
    </div>
  );
}
