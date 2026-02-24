(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    apiUrl: 'https://dwsiqcontainersjwyssm4e-dws-iq-backend.functions.fnc.fr-par.scw.cloud',
    primaryColor: '#0066FF',
    title: 'Climate Assistant',
    subtitle: 'EU Climate Compliance Expert',
    placeholder: 'Ask about CBAM, CSRD, Fit for 55...',
    welcomeMessage: 'Hello! I\'m your EU Climate Compliance Assistant. Ask me about CBAM, CSRD, Fit for 55, EU ETS, or Scope 3 emissions.',
    position: 'right' // 'left' or 'right'
  };

  // Generate session ID
  function generateSessionId() {
    return 'widget_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Get or create session
  function getSession() {
    var raw = localStorage.getItem('dws_chat_session');
    if (raw) {
      try {
        var parsed = JSON.parse(raw);
        if (parsed && parsed.id) return parsed;
      } catch (e) {
        // SECURITY FIX: Handle corrupted localStorage data gracefully (CWE-502)
        localStorage.removeItem('dws_chat_session');
      }
    }
    var fresh = {
      id: generateSessionId(),
      messageCount: 0,
      tier: 'public'
    };
    localStorage.setItem('dws_chat_session', JSON.stringify(fresh));
    return fresh;
  }

  // Create styles
  function injectStyles() {
    const styles = `
      #dws-chat-widget {
        position: fixed;
        bottom: 20px;
        ${CONFIG.position}: 20px;
        z-index: 999999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      }

      #dws-chat-button {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(135deg, ${CONFIG.primaryColor} 0%, #0052CC 100%);
        border: none;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(0, 102, 255, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.3s, box-shadow 0.3s;
      }

      #dws-chat-button:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 25px rgba(0, 102, 255, 0.5);
      }

      #dws-chat-button svg {
        width: 28px;
        height: 28px;
        fill: white;
      }

      #dws-chat-window {
        display: none;
        position: fixed;
        bottom: 90px;
        ${CONFIG.position}: 20px;
        width: 380px;
        height: 520px;
        background: white;
        border-radius: 16px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        flex-direction: column;
        overflow: hidden;
        z-index: 999998;
      }

      #dws-chat-window.open {
        display: flex;
      }

      #dws-chat-header {
        background: linear-gradient(135deg, ${CONFIG.primaryColor} 0%, #0052CC 100%);
        color: white;
        padding: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      #dws-chat-header-info h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
      }

      #dws-chat-header-info p {
        margin: 4px 0 0;
        font-size: 12px;
        opacity: 0.9;
      }

      #dws-chat-close {
        background: rgba(255,255,255,0.2);
        border: none;
        color: white;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      #dws-chat-close:hover {
        background: rgba(255,255,255,0.3);
      }

      #dws-chat-messages {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        background: #f8f9fa;
      }

      .dws-message {
        margin-bottom: 12px;
        display: flex;
        flex-direction: column;
      }

      .dws-message.user {
        align-items: flex-end;
      }

      .dws-message.assistant {
        align-items: flex-start;
      }

      .dws-message-content {
        max-width: 85%;
        padding: 12px 16px;
        border-radius: 16px;
        font-size: 14px;
        line-height: 1.5;
      }

      .dws-message.user .dws-message-content {
        background: ${CONFIG.primaryColor};
        color: white;
        border-bottom-right-radius: 4px;
      }

      .dws-message.assistant .dws-message-content {
        background: white;
        color: #333;
        border-bottom-left-radius: 4px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      }

      #dws-chat-input-area {
        padding: 12px;
        background: white;
        border-top: 1px solid #e9ecef;
        display: flex;
        gap: 8px;
      }

      #dws-chat-input {
        flex: 1;
        padding: 12px 16px;
        border: 1px solid #e9ecef;
        border-radius: 24px;
        font-size: 14px;
        outline: none;
        transition: border-color 0.2s;
      }

      #dws-chat-input:focus {
        border-color: ${CONFIG.primaryColor};
      }

      #dws-chat-send {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: ${CONFIG.primaryColor};
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s;
      }

      #dws-chat-send:hover {
        background: #0052CC;
      }

      #dws-chat-send:disabled {
        background: #ccc;
        cursor: not-allowed;
      }

      #dws-chat-send svg {
        width: 20px;
        height: 20px;
        fill: white;
      }

      .dws-typing {
        display: flex;
        gap: 4px;
        padding: 8px 0;
      }

      .dws-typing span {
        width: 8px;
        height: 8px;
        background: #999;
        border-radius: 50%;
        animation: dws-bounce 1.4s infinite ease-in-out;
      }

      .dws-typing span:nth-child(1) { animation-delay: -0.32s; }
      .dws-typing span:nth-child(2) { animation-delay: -0.16s; }

      @keyframes dws-bounce {
        0%, 80%, 100% { transform: scale(0); }
        40% { transform: scale(1); }
      }

      #dws-chat-topics {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        padding: 12px;
        background: white;
        border-top: 1px solid #e9ecef;
      }

      .dws-topic-btn {
        padding: 6px 12px;
        border: 1px solid #e9ecef;
        border-radius: 16px;
        background: white;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .dws-topic-btn:hover {
        background: ${CONFIG.primaryColor};
        color: white;
        border-color: ${CONFIG.primaryColor};
      }

      #dws-voice-btn {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: #f0f0f0;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s;
      }

      #dws-voice-btn:hover {
        background: #e0e0e0;
      }

      #dws-voice-btn.recording {
        background: #ff4444;
      }

      #dws-voice-btn svg {
        width: 20px;
        height: 20px;
        fill: #666;
      }

      #dws-voice-btn.recording svg {
        fill: white;
      }

      @media (max-width: 480px) {
        #dws-chat-window {
          width: calc(100vw - 40px);
          height: calc(100vh - 120px);
          bottom: 80px;
          ${CONFIG.position}: 20px;
        }
      }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
  }

  // Create widget HTML
  function createWidget() {
    const widget = document.createElement('div');
    widget.id = 'dws-chat-widget';
    widget.innerHTML = `
      <div id="dws-chat-window">
        <div id="dws-chat-header">
          <div id="dws-chat-header-info">
            <h3>${CONFIG.title}</h3>
            <p>${CONFIG.subtitle}</p>
          </div>
          <button id="dws-chat-close">&times;</button>
        </div>
        <div id="dws-chat-messages"></div>
        <div id="dws-chat-topics">
          <button class="dws-topic-btn" data-topic="CBAM">CBAM</button>
          <button class="dws-topic-btn" data-topic="CSRD">CSRD</button>
          <button class="dws-topic-btn" data-topic="Fit for 55">Fit for 55</button>
          <button class="dws-topic-btn" data-topic="EU ETS">EU ETS</button>
          <button class="dws-topic-btn" data-topic="Scope 3">Scope 3</button>
        </div>
        <div id="dws-chat-input-area">
          <button id="dws-voice-btn" title="Voice input">
            <svg viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
          </button>
          <input type="text" id="dws-chat-input" placeholder="${CONFIG.placeholder}">
          <button id="dws-chat-send">
            <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
          </button>
        </div>
      </div>
      <button id="dws-chat-button">
        <svg viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>
      </button>
    `;
    document.body.appendChild(widget);
  }

  // Add message to chat
  function addMessage(content, isUser = false) {
    const messagesDiv = document.getElementById('dws-chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `dws-message ${isUser ? 'user' : 'assistant'}`;
    messageDiv.innerHTML = `<div class="dws-message-content">${content}</div>`;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  // Show typing indicator
  function showTyping() {
    const messagesDiv = document.getElementById('dws-chat-messages');
    const typingDiv = document.createElement('div');
    typingDiv.id = 'dws-typing';
    typingDiv.className = 'dws-message assistant';
    typingDiv.innerHTML = `
      <div class="dws-message-content">
        <div class="dws-typing">
          <span></span><span></span><span></span>
        </div>
      </div>
    `;
    messagesDiv.appendChild(typingDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  // Hide typing indicator
  function hideTyping() {
    const typingDiv = document.getElementById('dws-typing');
    if (typingDiv) typingDiv.remove();
  }

  // Send message to API
  async function sendMessage(message) {
    const session = getSession();

    showTyping();

    try {
      const response = await fetch(`${CONFIG.apiUrl}/api/v2/climate-assistant/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          sessionId: session.id
        })
      });

      hideTyping();

      if (!response.ok) {
        const error = await response.json();
        if (error.requiresLead) {
          addMessage('You\'ve used your free message. Please provide your email to continue chatting.');
          return;
        }
        throw new Error(error.message || 'Failed to get response');
      }

      const data = await response.json();
      addMessage(data.content || data.response);

      // Update session
      session.messageCount++;
      localStorage.setItem('dws_chat_session', JSON.stringify(session));

    } catch (error) {
      hideTyping();
      addMessage('Sorry, I encountered an error. Please try again.');
      console.error('Chat error:', error);
    }
  }

  // Initialize speech recognition
  let recognition = null;
  function initSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        document.getElementById('dws-chat-input').value = transcript;
        document.getElementById('dws-voice-btn').classList.remove('recording');
      };

      recognition.onerror = () => {
        document.getElementById('dws-voice-btn').classList.remove('recording');
      };

      recognition.onend = () => {
        document.getElementById('dws-voice-btn').classList.remove('recording');
      };
    }
  }

  // Initialize widget
  function init() {
    injectStyles();
    createWidget();
    initSpeechRecognition();

    const chatButton = document.getElementById('dws-chat-button');
    const chatWindow = document.getElementById('dws-chat-window');
    const closeButton = document.getElementById('dws-chat-close');
    const input = document.getElementById('dws-chat-input');
    const sendButton = document.getElementById('dws-chat-send');
    const voiceButton = document.getElementById('dws-voice-btn');
    const topicButtons = document.querySelectorAll('.dws-topic-btn');

    let isOpen = false;
    let welcomeShown = false;

    // Toggle chat window
    chatButton.addEventListener('click', () => {
      isOpen = !isOpen;
      chatWindow.classList.toggle('open', isOpen);
      if (isOpen && !welcomeShown) {
        addMessage(CONFIG.welcomeMessage);
        welcomeShown = true;
      }
    });

    closeButton.addEventListener('click', () => {
      isOpen = false;
      chatWindow.classList.remove('open');
    });

    // Send message
    function handleSend() {
      const message = input.value.trim();
      if (message) {
        addMessage(message, true);
        input.value = '';
        sendMessage(message);
      }
    }

    sendButton.addEventListener('click', handleSend);
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleSend();
    });

    // Topic buttons
    topicButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const topic = btn.dataset.topic;
        input.value = `Tell me about ${topic}`;
        handleSend();
      });
    });

    // Voice button
    voiceButton.addEventListener('click', () => {
      if (recognition) {
        if (voiceButton.classList.contains('recording')) {
          recognition.stop();
        } else {
          voiceButton.classList.add('recording');
          recognition.start();
        }
      } else {
        alert('Voice input is not supported in this browser.');
      }
    });
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
