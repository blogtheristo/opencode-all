# Dashboard V9 React - DWS IQ Climate Intelligence

**TypeScript + React + Vercel AI SDK + Speech APIs**

Modern, AI-powered climate compliance dashboard with voice interaction capabilities.

---

## Features

### Core Functionality
- ✅ **Real-time Portfolio Metrics** (SPI, CPI, Carbon Tracking)
- ✅ **Project Management** with RAG status indicators
- ✅ **Compliance Monitoring** (CSRD, EPBD, ETS, CBAM)
- ✅ **Supabase Integration** for live data
- ✅ **Responsive Design** (Mobile-first, Tailwind CSS)

### AI Assistant
- 🤖 **Claude Sonnet 4** integration via Vercel AI SDK
- 💬 **Streaming Chat** responses
- 🔧 **Tool Calling** for:
  - Carbon calculations (EN 15978)
  - Compliance checks (CSRD, EPBD, ETS, CBAM)
  - Report generation

### Voice Interaction
- 🎤 **Web Speech API** for voice input (speech-to-text)
- 🔊 **Speech Synthesis** for reading AI responses aloud
- 🌍 **Multi-language Support** (EN-US default)

---

## Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| **Framework** | React | 19.2.0 |
| **Language** | TypeScript | 5.9.3 |
| **Build Tool** | Vite | 6.0.5 |
| **AI SDK** | Vercel AI SDK | 4.1.10 |
| **AI Provider** | Anthropic Claude | Sonnet 4 |
| **Database** | Supabase | Latest |
| **Styling** | Tailwind CSS | 3.4.17 |
| **Speech APIs** | Web Speech API | Native |
| | Speech Synthesis | Native |

---

## Getting Started

### Installation

```bash
cd /home/user/dws6/dws6.com/dashboard/firehorse/v9-react
npm install
```

### Configuration

Copy `.env.example` to `.env` and add your credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here
```

### Development

```bash
npm run dev
```

Visit `http://localhost:5173`

### Build

```bash
npm run build
```

---

## Usage Guide

### Voice Input
1. Click 🎤 microphone button
2. Speak your question
3. Click ⏹️ to stop
4. Press Enter to send

### Text-to-Speech
- Click 🔇 to enable auto-speak
- AI responses will be read aloud

### Climate Queries
- "Calculate embodied carbon for 500m³ of concrete C30/37"
- "Check CSRD compliance for Q4 2025"
- "Generate EPBD certificate for Helsinki HQ project"

---

## Browser Compatibility

| Feature | Chrome | Edge | Safari | Firefox |
|---------|--------|------|--------|---------|
| **Dashboard** | ✅ | ✅ | ✅ | ✅ |
| **AI Chat** | ✅ | ✅ | ✅ | ✅ |
| **Voice Input** | ✅ | ✅ | ✅ | ❌ |
| **Text-to-Speech** | ✅ | ✅ | ✅ | ✅ |

---

## Performance

- **Bundle Size:** ~70KB gzipped
- **Initial Load:** ~1.2s
- **Time to Interactive:** ~1.5s
- **First Token (AI):** ~200-400ms

---

## Documentation

- **Full Documentation:** `/docs/evaluation/typescript-react-ai-sdk-evaluation.md`
- **Field Note #TBD:** Dashboard V9 Technical Stack
- **Admin Manual:** `/Situation/DWS_IQ6_ADMINISTRATOR_MANUAL.md`

---

© 2026 DWS IQ · Climate Intelligence Platform
