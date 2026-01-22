/**
 * Climate Assistant Chat Component
 * AI-powered climate compliance assistant with voice interaction
 * - Streaming responses via Vercel AI SDK
 * - Web Speech API for voice input
 * - Speech Synthesis for reading responses
 */

import { useState, useEffect, useRef } from 'react';
import { useChat } from 'ai/react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';

export function ClimateAssistant() {
  const [autoSpeak, setAutoSpeak] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, input, setInput, handleSubmit, isLoading, error } = useChat({
    api: '/api/climate-assistant',
    initialMessages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: `Hello! I'm your **DWS IQ Climate Intelligence Assistant**. I can help you with:

- 🧮 **EN 15978** carbon calculations
- 📊 **CSRD** compliance reporting
- 🏗️ **EPBD** building certifications
- 💶 **ETS** emissions monitoring
- 🌍 **CBAM** border regulations

What would you like to know?`,
        createdAt: new Date(),
      },
    ],
  });

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
  }, [transcript, setInput, resetTranscript]);

  // Auto-speak assistant responses if enabled
  useEffect(() => {
    if (autoSpeak && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant' && !isLoading) {
        // Remove markdown formatting for better speech
        const cleanContent = lastMessage.content
          .replace(/\*\*/g, '')
          .replace(/\*/g, '')
          .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
          .replace(/#{1,6}\s/g, '');

        speak(cleanContent);
      }
    }
  }, [messages, autoSpeak, isLoading, speak]);

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleSpeakToggle = () => {
    if (isSpeaking) {
      cancelSpeech();
    } else {
      setAutoSpeak(!autoSpeak);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isListening) {
      stopListening();
    }
    handleSubmit(e);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-lg border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
            <span className="text-white text-xl">🤖</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Climate Assistant</h3>
            <p className="text-xs text-gray-500">DWS IQ AI · Powered by Claude</p>
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
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={autoSpeak ? 'Disable auto-speak' : 'Enable auto-speak'}
            >
              {isSpeaking ? '🔊' : autoSpeak ? '🔉' : '🔇'}
            </button>
          )}

          {/* Status Indicator */}
          <div className="flex items-center gap-2">
            {isLoading && (
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <span className="animate-pulse">●</span> Thinking...
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`chat-message ${message.role === 'user' ? 'user' : 'assistant'}`}
            >
              {message.role === 'assistant' ? (
                <div className="prose prose-sm max-w-none">
                  {message.content.split('\n').map((line, i) => {
                    // Handle bold text
                    if (line.includes('**')) {
                      const parts = line.split('**');
                      return (
                        <p key={i}>
                          {parts.map((part, j) =>
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
                  })}
                </div>
              ) : (
                <p className="whitespace-pre-wrap">{message.content}</p>
              )}

              {/* Tool Invocations */}
              {message.toolInvocations && message.toolInvocations.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
                  {message.toolInvocations.map((tool) => (
                    <div key={tool.toolCallId} className="text-xs bg-gray-50 p-2 rounded">
                      <div className="font-semibold text-gray-700">
                        🛠️ {tool.toolName}
                      </div>
                      {tool.result && (
                        <pre className="mt-1 text-gray-600 overflow-x-auto">
                          {JSON.stringify(tool.result, null, 2)}
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="chat-message assistant">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        {/* Error display */}
        {error && (
          <div className="flex justify-center">
            <div className="bg-red-50 text-red-700 px-4 py-2 rounded-lg text-sm">
              ⚠️ {error.message || 'An error occurred'}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200">
        {/* Speech Recognition Error */}
        {speechRecognitionError && (
          <div className="mb-2 text-xs text-red-600">
            Voice input error: {speechRecognitionError}
          </div>
        )}

        {/* Interim Transcript */}
        {interimTranscript && (
          <div className="mb-2 text-sm text-gray-500 italic">
            Listening: {interimTranscript}
          </div>
        )}

        <form onSubmit={onSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about carbon calculations, compliance, reports..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
            onClick={() => setInput('Calculate embodied carbon for 500m³ of concrete C30/37')}
            className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
            disabled={isLoading}
          >
            💡 Carbon calculation
          </button>
          <button
            onClick={() => setInput('Check CSRD compliance for Q4 2025')}
            className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
            disabled={isLoading}
          >
            ✅ CSRD compliance
          </button>
          <button
            onClick={() => setInput('Generate EPBD certificate for Helsinki HQ')}
            className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
            disabled={isLoading}
          >
            📋 EPBD report
          </button>
        </div>
      </div>
    </div>
  );
}
