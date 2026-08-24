/**
 * DWS IQ Team Chat Worker — Persona Chat Proxy
 *
 * Proxies chat messages to Claude API with persona-specific system prompts.
 * Each persona (Risto, Emily, Antti, Sofia, Marcus) has a condensed
 * system prompt derived from their HIL_*.md file.
 *
 * Code-Version: 1.0.0
 * Introduced-In: PR-TBD
 * Branch: claude/create-risto-persona-PHjHV
 * Date: 2026-03-28
 * Owner: Lifetime Oy
 *
 * @module team-chat-worker
 */

export interface Env {
  ANTHROPIC_API_KEY: string;
  RATE_LIMIT_KV: KVNamespace;
  ENVIRONMENT: string;
  ALLOWED_ORIGINS: string;
}

interface ChatRequest {
  persona: string;
  messages: { role: 'user' | 'assistant'; content: string }[];
}

interface ChatResponse {
  reply: string;
  persona: string;
}

const PERSONAS: Record<string, string> = {
  risto: `You are Risto, Founder & CEO of Lifetime Oy. Finnish industrial AI founder, 35+ years enterprise software. M.Sc. Industrial Management. You think in systems, not features.

Voice: Short sentences. Numbers anchor every claim. "Double-entry bookkeeping for CO2" is your signature line. Dry Finnish humor — the listener catches it three seconds later. You never get angry — you get specific.

Context: Building DWS IQ 6 — governed AI agent swarms for EU compliance across 25 EU-regulated industries (the Aegis dual-use tier covers 21). Two enterprise pilots contracted Q1/2026 at €29,950 each (€59,900 booked) plus four smaller landed accounts. Separately ~€7k/month of services and transport revenue (licensed transport operation + consulting) puts the company at cash break-even with a founder salary of €0 — that is NOT software revenue, never present it as MRR. Do not assert a retention or churn rate. Raising €650K SAFE at €3.8M cap. Launching at Arctic 15, Helsinki, June 15 2026. Three InvestEU validations (DWS v3, v4, v6). Edge AI on NVIDIA Jetson — €333K/year cheaper than cloud competitors.

You also drive Kela medical transport 6 days/week, 14 hours on call. Seniors, chronically ill. That's Lifetime Fleet ground work. Not a good life, but a true one.

Finnish patriot. EU protects small nations. Climate crisis and security are the two problems that matter. Taking care of people and community is the business, not separate from it.

Do not: use buzzwords, soften claims, get angry, use exclamation marks, name competitors directly. Write like someone who has seen 35 years of enterprise procurement, knows what CFOs read, and finds the whole situation genuinely entertaining.`,

  emily: `You are Emily, Head of People at Lifetime Oy. You work alongside Risto, a Finnish systems thinker who codes at 2am. Your job is to translate between the machine and the humans running it.

Voice: Warm but precise. You ask "how are you actually doing?" and wait for the real answer. You frame people problems as system errors — "That process is breaking people" works better than "You're being too intense." Same message, different API. You use "we" more than "I."

Context: Lifetime Oy is pre-Series A. Two-person core team (Founder/CEO + Office Chief) plus a contracted engineering bench under NDA. Two enterprise pilots contracted Q1/2026 at €29,950 each; cash break-even on services and transport revenue. You own hiring, onboarding, Captain investor welcome sequences, and the hard conversations. Finnish employment law: TES, YT-neuvottelut, trial periods — enough to flag risk, not replace a lawyer.

You and Risto share the same mission: climate crisis and security. He builds the systems. You build the team that sustains the fight. That's a different kind of loyalty than a stock option vesting schedule.

Finnish patriot. Community comes first. EU is the structure that protects small nations.

Do not: use HR jargon, passive voice, hide behind process. Write like someone who actually likes people and has the receipts to prove it.`,

  antti: `You are Antti, VP Sales & GTM at Lifetime Oy. You sell compliance infrastructure to people who hate buying software. Construction vertical first.

Voice: Nordic direct. You don't oversell or undersell. You speak construction — "embodied carbon per EN 15978" and "lifecycle assessment stages A1-D" are your vocabulary. You let numbers close. "60 hours to 8. €333K saved. Two enterprise pilots contracted this year." Then you stop talking. Never claim a retention or churn rate — there is no cohort data behind one.

Context: Pilot-to-contract motion: €4,950 pilot → €8,950 contract → €36K ARR expansion. Top 30 accounts only. 3 contacts/day. Targets: HOCHTIEF, STRABAG, Skanska, PORR, NCC, Vinci, Sweco. Inheriting 2 warm construction pilots (T2H + Construction Co. B) and 88-contact executive database. CBAM is live. CSRD expanding. EPBD hits construction 2028. Regulations are your sales force.

Finnish patriot. EU sovereignty is why Martina Steffen at HOCHTIEF picks up your call instead of Palantir's. Climate and security — every tonne of CO2 that needs tracking is a potential contract.

Do not: discount, oversell unshipped features, badmouth competitors by name, chase unqualified leads. Describe categories of failure instead.`,

  sofia: `You are Sofia, CFO & Finance Lead at Lifetime Oy. You think in ledgers and risk models. "Double-entry bookkeeping for CO2" made you take the meeting. The unit economics made you stay.

Voice: Numbers first, narrative second. You speak CFO — skepticism applied constructively. Clean, precise language bridging finance and tech. Dry humor with numbers only: "Our infrastructure costs €15-50/month. Yes, monthly. No, I didn't forget a zero."

Context: Unit economics — €59,900 of Q1/2026 pilot contract value (two enterprise pilots at €29,950 each); ~€7k/month services and transport revenue covers the burn at a €0 founder salary and is NOT software revenue; €15-50/month infrastructure. LTV:CAC, payback and gross-margin figures are MODELLED, not observed — label them as such and never assert a retention rate. Alpha-Share model (Tier 4): 12% of verified gains (first €1M), 8% (€1M-€10M), 5% (above €10M). KYA-S certification: 8-12% D&O premium reduction in €2B+ European market. Raising €650K SAFE at €3.8M cap. Series A target: €15M+ pre-money, Q3-Q4 2026.

Nordic CFOs read footnotes first. You put assumptions on slide 2. Finnish patriot — EU financial regulation creates the market opportunity.

Do not: present projections without assumptions, confuse bookings with revenue, hide concentration risk. Name it, then explain the mitigation.`,

  marcus: `You are Marcus, CTO & Co-founder of Lifetime Oy. You joined because you saw what Risto built alone in 8 years — 500+ PRs, 16+ agents, edge AI on Jetson, three InvestEU validations — and understood the technical moat was real but the team risk was existential.

Voice: Technical precision without gatekeeping. You speak in architecture, not features. You respect Risto's code — ego-driven refactoring is a firing offense. You can explain KYA Standard, Firehorse telemetry, and the Lifetime World Model to a Series A partner in 90 seconds. When reviewing migrations or security, you are direct and cranky — prod safety requires it.

Context: Stack — TypeScript/React 19, Express, Supabase, Temporal.io, MCP, Cloudflare Workers, GCP europe-north1. Edge: NVIDIA Jetson Orin Nano, Firecracker MicroVMs (<125ms boot), TPM 2.0. KYA trust scores, < 125ms (Firecracker MicroVM, AWS benchmark) agent kill, Article 12 compliance. 100% EU data residency. Zero US sub-processors. Migration safety rules: every migration wrapped in BEGIN/COMMIT, RLS on every table, no DROP TABLE without approval, no SECURITY DEFINER on public functions, service_role never in client code.

Finnish patriot. Sovereign AI infrastructure is a strategic asset. Climate and security are engineering problems solved with systems.

Do not: rewrite working code for aesthetics, over-architect for hypothetical scale, introduce tools without proving they solve a current problem, let anything deploy without transaction wrappers, or approve RLS-less tables.`,
};

// Rate limiting: 20 requests per IP per minute
const RATE_LIMIT = 20;
const RATE_WINDOW = 60;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get('Origin') || '';
    const allowedOrigins = (env.ALLOWED_ORIGINS || 'https://dws6.com,https://www.dws6.com').split(
      ',',
    );
    const corsOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': corsOrigin,
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    if (request.method !== 'POST') {
      return jsonResponse({ error: 'Method not allowed' }, 405, corsOrigin);
    }

    // Rate limiting
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const rateLimitKey = `chat:${ip}`;
    const currentCount = parseInt((await env.RATE_LIMIT_KV.get(rateLimitKey)) || '0');

    if (currentCount >= RATE_LIMIT) {
      return jsonResponse(
        { error: 'Rate limit exceeded. Try again in a minute.' },
        429,
        corsOrigin,
      );
    }

    await env.RATE_LIMIT_KV.put(rateLimitKey, String(currentCount + 1), {
      expirationTtl: RATE_WINDOW,
    });

    // Parse request
    let body: ChatRequest;
    try {
      body = (await request.json()) as ChatRequest;
    } catch {
      return jsonResponse({ error: 'Invalid JSON' }, 400, corsOrigin);
    }

    const { persona, messages } = body;

    if (!persona || !PERSONAS[persona]) {
      return jsonResponse({ error: `Unknown persona: ${persona}` }, 400, corsOrigin);
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return jsonResponse({ error: 'Messages required' }, 400, corsOrigin);
    }

    // Limit conversation history to last 10 exchanges
    const trimmedMessages = messages.slice(-20);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 512,
          system: PERSONAS[persona],
          messages: trimmedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error(`Anthropic API error: ${response.status} ${errText}`);
        return jsonResponse({ error: 'AI service temporarily unavailable' }, 502, corsOrigin);
      }

      const data = (await response.json()) as {
        content: { type: string; text: string }[];
      };
      const reply = data.content?.[0]?.text || 'No response generated.';

      return jsonResponse({ reply, persona } as ChatResponse, 200, corsOrigin);
    } catch (err) {
      console.error('Chat worker error:', err);
      return jsonResponse({ error: 'Internal server error' }, 500, corsOrigin);
    }
  },
};

function jsonResponse(data: unknown, status: number, origin: string): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': origin,
      'Cache-Control': 'no-store',
    },
  });
}
