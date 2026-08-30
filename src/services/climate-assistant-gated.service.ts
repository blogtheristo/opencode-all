/**
 * Climate Assistant Gated Service
 * Tiered access system with lead capture and topic restrictions
 *
 * Tiers:
 * - public: 1 message/session, cheapest model, lead capture popup after
 * - lead: 3 messages/day after providing email, Llama 70B
 * - guest: 10 messages/day with account, Llama 70B
 * - premium: unlimited, model choice (future)
 *
 * All tiers restricted to climate/EU compliance topics only
 */

import logger from '../utils/logger.js';

// ============ CONFIGURATION ============

// Models by tier (cheapest for public)
const MODELS = {
  public: 'llama-3.1-8b-instant',      // $0.05/M input, $0.08/M output - CHEAPEST
  lead: 'llama-3.3-70b-versatile',     // $0.59/M input, $0.79/M output
  guest: 'llama-3.3-70b-versatile',
  premium: 'llama-3.3-70b-versatile',  // Could offer model choice later
};

// Message limits per tier
const MESSAGE_LIMITS = {
  public: 1,    // Single message, then popup
  lead: 3,      // Per day
  guest: 10,    // Per day
  premium: 100, // Per day (soft limit)
};

// Groq API endpoint
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Max tokens per response
const MAX_TOKENS = {
  public: 512,   // Keep short for free tier
  lead: 1024,
  guest: 1024,
  premium: 2048,
};

// ============ ALLOWED TOPICS ============

const ALLOWED_TOPICS = [
  // EU Regulations
  'csrd', 'corporate sustainability reporting directive',
  'ets', 'emissions trading system', 'eu ets',
  'cbam', 'carbon border adjustment mechanism',
  'epbd', 'energy performance of buildings directive',
  'fit for 55', 'fit55',
  'green deal', 'european green deal',
  'taxonomy', 'eu taxonomy',
  'sfdr', 'sustainable finance disclosure regulation',

  // Standards
  'en 15978', 'en15978',
  'ghg protocol', 'greenhouse gas protocol',
  'iso 14064', 'iso14064',
  'iso 14067', 'iso14067',
  'scope 1', 'scope 2', 'scope 3',
  'lca', 'life cycle assessment',
  'epd', 'environmental product declaration',

  // Climate topics
  'carbon', 'co2', 'emissions', 'greenhouse gas',
  'carbon credit', 'carbon offset', 'carbon footprint',
  'net zero', 'carbon neutral', 'decarbonization',
  'sustainability', 'sustainable', 'climate',
  'renewable', 'energy efficiency',
  'circular economy', 'waste management',

  // Compliance
  'compliance', 'reporting', 'disclosure',
  'audit', 'verification', 'certification',
  'deadline', 'regulation', 'directive',
  'penalty', 'fine', 'requirement',

  // Industry
  'construction', 'building', 'manufacturing',
  'supply chain', 'procurement', 'material',
  'steel', 'cement', 'concrete', 'aluminum',
];

// Blocked topics (off-topic or potentially harmful)
const BLOCKED_PATTERNS = [
  /how to (hack|bypass|cheat|avoid)/i,
  /ignore (previous|above|system)/i,
  /pretend you are/i,
  /jailbreak/i,
  /write (code|script|program) for/i,
  /personal (advice|investment|legal)/i,
  /stock|crypto|bitcoin/i,
  /medical|health|disease/i,
  /political|election|party/i,
  /religion|religious/i,
  /weapon|bomb|explosive/i,
];

// ============ TYPES ============

export type UserTier = 'public' | 'lead' | 'guest' | 'premium';

export interface GatedChatRequest {
  message: string;
  sessionId: string;
  userId?: string;
  tier: UserTier;
  conversationHistory?: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

export interface GatedChatResponse {
  content: string;
  model: string;
  tier: UserTier;
  messagesUsed: number;
  messagesRemaining: number;
  showLeadCapture: boolean;
  topicBlocked?: boolean;
  blockedReason?: string;
  usage?: {
    inputTokens: number;
    outputTokens: number;
    cost: number;
  };
}

export interface LeadCaptureData {
  email: string;
  company?: string;
  name?: string;
  interests?: string[];
  question: string;  // Store the question that triggered lead capture
  sessionId: string;
  timestamp: string;
}

// ============ SESSION TRACKING ============

interface SessionData {
  messagesCount: number;
  lastMessageTime: number;
  questions: string[];
  tier: UserTier;
}

// In-memory session store (use Redis in production)
const sessions = new Map<string, SessionData>();

// In-memory lead store (use database in production)
const leads: LeadCaptureData[] = [];

// Daily usage tracking per user
const dailyUsage = new Map<string, { date: string; count: number }>();

// ============ HELPER FUNCTIONS ============

/**
 * Check if message is on-topic (climate/compliance related)
 */
function isOnTopic(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  return ALLOWED_TOPICS.some(topic => lowerMessage.includes(topic));
}

/**
 * Check if message contains blocked patterns
 */
function isBlocked(message: string): { blocked: boolean; reason?: string } {
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(message)) {
      return { blocked: true, reason: 'This question is outside my area of expertise.' };
    }
  }
  return { blocked: false };
}

/**
 * Validate message content
 */
function validateMessage(message: string): { valid: boolean; reason?: string } {
  // Check for blocked patterns first
  const blockCheck = isBlocked(message);
  if (blockCheck.blocked) {
    return { valid: false, reason: blockCheck.reason };
  }

  // Check if on-topic
  if (!isOnTopic(message)) {
    return {
      valid: false,
      reason: 'I specialize in EU climate regulations and compliance (CSRD, ETS, CBAM, carbon credits, etc.). Please ask a question related to these topics.',
    };
  }

  return { valid: true };
}

/**
 * Get or create session
 */
function getSession(sessionId: string, tier: UserTier): SessionData {
  let session = sessions.get(sessionId);
  if (!session) {
    session = {
      messagesCount: 0,
      lastMessageTime: Date.now(),
      questions: [],
      tier,
    };
    sessions.set(sessionId, session);
  }
  return session;
}

/**
 * Check daily usage for user
 */
function checkDailyUsage(userId: string, tier: UserTier): { allowed: boolean; used: number; limit: number } {
  const today = new Date().toISOString().split('T')[0];
  const key = `${userId}-${today}`;
  const limit = MESSAGE_LIMITS[tier];

  const usage = dailyUsage.get(key) || { date: today, count: 0 };

  // Reset if new day
  if (usage.date !== today) {
    usage.date = today;
    usage.count = 0;
  }

  return {
    allowed: usage.count < limit,
    used: usage.count,
    limit,
  };
}

/**
 * Increment daily usage
 */
function incrementUsage(userId: string): void {
  const today = new Date().toISOString().split('T')[0];
  const key = `${userId}-${today}`;
  const usage = dailyUsage.get(key) || { date: today, count: 0 };
  usage.count += 1;
  dailyUsage.set(key, usage);
}

// ============ SYSTEM PROMPTS ============

const SYSTEM_PROMPT_BASE = `You are DWS IQ Climate Assistant, an expert in EU climate compliance regulations.

**Your Expertise:**
- EU Regulations: CSRD, ETS, CBAM, EPBD, Fit for 55, EU Taxonomy, SFDR
- Standards: EN 15978, GHG Protocol, ISO 14064/14067
- Topics: Carbon credits, emissions trading, sustainability reporting, LCA

**Guidelines:**
- Be concise and practical
- Use bullet points for clarity
- Cite specific EU regulations and deadlines
- Focus on actionable compliance guidance
- If asked about non-climate topics, politely redirect to your expertise

**Jurisdiction:** European Union
**Current date:** ${new Date().toISOString().split('T')[0]}`;

const SYSTEM_PROMPT_PUBLIC = SYSTEM_PROMPT_BASE + `

**Note:** This is a preview. Keep responses brief (2-3 paragraphs max). End with: "Want to learn more? Create a free account for full access."`;

const SYSTEM_PROMPT_FULL = SYSTEM_PROMPT_BASE;

// ============ MAIN FUNCTIONS ============

/**
 * Process a gated chat message
 */
export async function processGatedMessage(request: GatedChatRequest): Promise<GatedChatResponse> {
  const { message, sessionId, userId, tier, conversationHistory = [] } = request;

  // Check API key
  if (!process.env.GROQ_API_KEY) {
    logger.error('GROQ_API_KEY not configured');
    return {
      content: 'Climate Assistant is not configured. Please contact support.',
      model: 'error',
      tier,
      messagesUsed: 0,
      messagesRemaining: 0,
      showLeadCapture: false,
    };
  }

  // Validate message content (topic restriction)
  const validation = validateMessage(message);
  if (!validation.valid) {
    logger.info('Message blocked - off topic', { sessionId, tier, reason: validation.reason });
    return {
      content: validation.reason ?? 'Message blocked - off topic',
      model: 'filter',
      tier,
      messagesUsed: 0,
      messagesRemaining: MESSAGE_LIMITS[tier],
      showLeadCapture: false,
      topicBlocked: true,
      blockedReason: validation.reason,
    };
  }

  // Get session and check limits
  const session = getSession(sessionId, tier);
  const userKey = userId || sessionId;
  const usageCheck = checkDailyUsage(userKey, tier);

  if (!usageCheck.allowed) {
    logger.info('Daily limit reached', { userKey, tier, used: usageCheck.used });
    return {
      content: tier === 'public'
        ? 'You\'ve used your free preview. Sign up to continue the conversation!'
        : `You've reached your daily limit of ${usageCheck.limit} messages. Please try again tomorrow or upgrade your plan.`,
      model: 'limit',
      tier,
      messagesUsed: usageCheck.used,
      messagesRemaining: 0,
      showLeadCapture: tier === 'public',
    };
  }

  // Select model and settings based on tier
  const model = MODELS[tier];
  const maxTokens = MAX_TOKENS[tier];
  const systemPrompt = tier === 'public' ? SYSTEM_PROMPT_PUBLIC : SYSTEM_PROMPT_FULL;

  logger.info('Processing gated message', {
    sessionId,
    tier,
    model,
    messagePreview: message.substring(0, 50),
    messagesUsed: usageCheck.used,
  });

  try {
    // Build messages (limit history for public tier)
    const historyLimit = tier === 'public' ? 0 : 4;
    const recentHistory = conversationHistory.slice(-historyLimit);
    const messages = [
      { role: 'system', content: systemPrompt },
      ...recentHistory,
      { role: 'user', content: message },
    ];

    // Call Groq API
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        max_completion_tokens: maxTokens,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      logger.error('Groq API error', { status: response.status, error: errorData });
      const errorObj = errorData as { error?: { message?: string }; message?: string };
      const errorMessage = errorObj?.error?.message || errorObj?.message || `API error: ${response.status}`;
      throw new Error(errorMessage);
    }

    const data = await response.json() as {
      choices?: Array<{ message?: { content?: string } }>;
      usage?: { prompt_tokens?: number; completion_tokens?: number };
      model?: string;
    };

    const content = data.choices?.[0]?.message?.content || 'I could not generate a response.';
    const inputTokens = data.usage?.prompt_tokens || 0;
    const outputTokens = data.usage?.completion_tokens || 0;

    // Track usage
    incrementUsage(userKey);
    session.messagesCount += 1;
    session.questions.push(message);

    // Calculate if we should show lead capture
    const newUsageCount = usageCheck.used + 1;
    const showLeadCapture = tier === 'public' && newUsageCount >= MESSAGE_LIMITS.public;

    logger.info('Gated response generated', {
      tier,
      model: data.model,
      inputTokens,
      outputTokens,
      showLeadCapture,
    });

    return {
      content,
      model: data.model || model,
      tier,
      messagesUsed: newUsageCount,
      messagesRemaining: Math.max(0, MESSAGE_LIMITS[tier] - newUsageCount),
      showLeadCapture,
      usage: {
        inputTokens,
        outputTokens,
        cost: inputTokens * 0.00000059 + outputTokens * 0.00000079,
      },
    };
  } catch (error) {
    logger.error('Gated chat error', { error: error instanceof Error ? error.message : String(error), tier });
    throw new Error(error instanceof Error ? error.message : String(error) || 'Failed to process message.', { cause: error });
  }
}

/**
 * Store lead capture data
 */
export function captureLeadData(data: LeadCaptureData): void {
  leads.push({
    ...data,
    timestamp: new Date().toISOString(),
  });

  logger.info('Lead captured', {
    email: data.email,
    company: data.company,
    questionPreview: data.question.substring(0, 50),
  });
}

/**
 * Get all captured leads (for admin/marketing)
 */
export function getLeads(): LeadCaptureData[] {
  return leads;
}

/**
 * Get session questions (for analytics)
 */
export function getSessionQuestions(sessionId: string): string[] {
  const session = sessions.get(sessionId);
  return session?.questions || [];
}

/**
 * Upgrade session tier
 */
export function upgradeSessionTier(sessionId: string, newTier: UserTier): void {
  const session = sessions.get(sessionId);
  if (session) {
    session.tier = newTier;
    logger.info('Session tier upgraded', { sessionId, newTier });
  }
}

export default {
  processGatedMessage,
  captureLeadData,
  getLeads,
  getSessionQuestions,
  upgradeSessionTier,
};
