/**
 * Social Scheduler — Content Generator
 *
 * Generates LinkedIn post drafts from:
 *   1. Existing Omnichannel templates (Firehorse/Omnichannel/)
 *   2. Weekly content calendar themes
 *   3. Compliance news feed (when wired to CBAM/CSRD monitor)
 *
 * All posts are drafts — the CEO approves via email before publish.
 */

import logger from '../utils/logger.js';
import type { PostCategory, PostDraft, WeeklySchedule } from './types.js';

// ============================================================================
// CONTENT CALENDAR
// ============================================================================

export const DEFAULT_WEEKLY_SCHEDULE: WeeklySchedule = {
  monday: 'thought_leadership',
  tuesday: 'compliance_news',
  wednesday: 'product_update',
  thursday: 'case_study',
  friday: 'webinar_promo',
};

// Category prompts for LLM-generated posts (v2 — currently using deterministic templates)
export const CATEGORY_PROMPTS: Record<PostCategory, string> = {
  thought_leadership:
    'Share an insight about EU climate compliance, AI in sustainability, or the future of industrial regulation. Tone: authoritative, concise, personal.',
  product_update:
    'Highlight a DWS IQ 6 feature, new agent capability, or platform improvement. Tone: practical, benefit-focused.',
  compliance_news:
    'React to a recent EU regulation update (CSRD, Fit for 55, CBAM, EPBD, EU AI Act). Tone: informative, slightly urgent.',
  case_study:
    'Share a customer success story or pilot result. Tone: specific, numbers-driven, proof-focused.',
  webinar_promo: 'Promote an upcoming webinar, workshop, or event. Tone: inviting, value-forward.',
  hiring: 'Share a hiring update or team milestone. Tone: authentic, mission-driven.',
};

// ============================================================================
// DRAFT TEMPLATES
// ============================================================================

/**
 * Generate a structured LinkedIn post draft for a given category.
 * Uses a deterministic template — no LLM needed for v1.
 */
export function generateDraft(
  category: PostCategory,
  context?: { headline?: string; body?: string; cta?: string; url?: string },
): PostDraft {
  const templates = getDraftTemplates(category, context);
  // Pick a random template variant
  const template = templates[Math.floor(Math.random() * templates.length)];

  return {
    platform: 'linkedin',
    category,
    content: template,
    source: 'social-scheduler-v1',
    scheduled_at: getNextPublishSlot(),
  };
}

function getDraftTemplates(
  category: PostCategory,
  ctx?: { headline?: string; body?: string; cta?: string; url?: string },
): string[] {
  const headline = ctx?.headline || '[HEADLINE]';
  const body = ctx?.body || '[KEY INSIGHT OR UPDATE]';
  const cta = ctx?.cta || 'What are you seeing in your industry?';
  const url = ctx?.url || 'https://dws10.com';

  switch (category) {
    case 'thought_leadership':
      return [
        `${headline}\n\n${body}\n\nThe companies that automate compliance now will own the next decade.\n\nThose that wait will spend it catching up.\n\n${cta}\n\n#ClimateCompliance #CSRD #Fitfor55 #Sustainability`,
        `Unpopular opinion: Manual CSRD reporting is already obsolete.\n\n${body}\n\nThe EU didn't create Fit for 55 for humans to fill spreadsheets. They created it for systems to enforce.\n\n${cta}\n\n#EURegulation #ClimateAction #AICompliance`,
      ];

    case 'product_update':
      return [
        `New in DWS IQ 6: ${headline}\n\n${body}\n\n→ ${url}\n\n#DWSiq #ClimateCompliance #ProductUpdate`,
        `We just shipped: ${headline}\n\n${body}\n\nThis is what "build for agents" means in practice.\n\n→ ${url}\n\n#DWSIQ #Fitfor55 #AIAgents`,
      ];

    case 'compliance_news':
      return [
        `${headline}\n\n${body}\n\nWhat this means for your business:\n→ Action required by [DATE]\n→ Affects [SCOPE]\n→ Penalty for non-compliance: [AMOUNT]\n\nFull breakdown: ${url}\n\n#CSRD #CBAM #EUCompliance`,
        `Breaking: ${headline}\n\n${body}\n\nWe've updated DWS IQ 6 to handle this automatically.\n\n→ ${url}\n\n#Fitfor55 #Regulation #ClimateAction`,
      ];

    case 'case_study':
      return [
        `How [COMPANY] cut compliance time by [X]%\n\n${body}\n\nResults:\n→ [METRIC 1]\n→ [METRIC 2]\n→ [METRIC 3]\n\nFull case study: ${url}\n\n#CustomerSuccess #ClimateCompliance`,
      ];

    case 'webinar_promo':
      return [
        `Join us: ${headline}\n\n${body}\n\nWhen: [DATE & TIME]\nWhere: Online (link after registration)\nWho: [TARGET AUDIENCE]\n\nRegister: ${url}\n\n#Webinar #Compliance #ClimateAction`,
      ];

    case 'hiring':
      return [
        `We're growing: ${headline}\n\n${body}\n\nIf you want to build the climate compliance infrastructure for European industry — let's talk.\n\n→ ${url}\n\n#Hiring #ClimateJobs #Sustainability`,
      ];
  }
}

/**
 * Get the next available publish slot (09:00 Helsinki on the next weekday).
 */
function getNextPublishSlot(): string {
  const now = new Date();
  const helsinki = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Helsinki' }));

  // Find next weekday
  const target = new Date(helsinki);
  target.setHours(9, 0, 0, 0);

  // If today's slot has passed, move to tomorrow
  if (target <= helsinki) {
    target.setDate(target.getDate() + 1);
  }

  // Skip weekends
  while (target.getDay() === 0 || target.getDay() === 6) {
    target.setDate(target.getDate() + 1);
  }

  return target.toISOString();
}

/**
 * Get today's content category from the weekly schedule.
 */
export function getTodaysCategory(
  schedule: WeeklySchedule = DEFAULT_WEEKLY_SCHEDULE,
): PostCategory | null {
  const dayNames = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ] as const;
  const today = dayNames[new Date().getDay()];

  if (today === 'sunday' || today === 'saturday') return null;
  return schedule[today];
}

/**
 * Generate today's LinkedIn post draft based on the weekly calendar.
 */
export function generateTodaysDraft(context?: {
  headline?: string;
  body?: string;
  cta?: string;
  url?: string;
}): PostDraft | null {
  const category = getTodaysCategory();
  if (!category) {
    logger.info('Social scheduler: weekend, no draft generated');
    return null;
  }

  logger.info('Social scheduler: generating draft', { category });
  return generateDraft(category, context);
}
