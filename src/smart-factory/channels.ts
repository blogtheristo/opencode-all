/**
 * Smart Factory — channel routing + message composition.
 *
 * Routing rules (priority order, first available wins per enabled channel):
 *   email     → prospect.email present            (SES, automated)
 *   whatsapp  → prospect.phone present             (Meta Cloud API; manual_pending if unconfigured)
 *   linkedin  → prospect.linkedinUrl present       (ALWAYS human-in-the-loop pending queue —
 *                                                   no automation on LinkedIn per MDP policy)
 *   facebook  → prospect.facebookUrl present       (manual task — page DMs require prior contact)
 *
 * A prospect is only routed on channels that are enabled for the campaign.
 */

import { inferOutreachLang } from '../construction-leads/ted-outreach.js';
import type {
  Channel,
  MatchedProspect,
  PlannedMessage,
} from './types.js';

export interface ChannelPlanItem {
  channel: Channel;
  /** true = can be sent automatically; false = human-in-the-loop queue */
  automatable: boolean;
  reason: string;
}

const CHANNEL_CONTACT_FIELD: Record<Channel, keyof MatchedProspect | null> = {
  email: 'email',
  whatsapp: 'phone',
  linkedin: 'linkedinUrl',
  facebook: 'facebookUrl',
};

export function planChannels(
  prospect: MatchedProspect,
  enabledChannels: Channel[],
): ChannelPlanItem[] {
  const plan: ChannelPlanItem[] = [];
  for (const channel of enabledChannels) {
    const field = CHANNEL_CONTACT_FIELD[channel];
    const value = field ? (prospect[field] as string | undefined) : undefined;
    if (!value) continue;

    switch (channel) {
      case 'email':
        plan.push({ channel, automatable: true, reason: 'email address known' });
        break;
      case 'whatsapp':
        plan.push({
          channel,
          automatable: Boolean(
            process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID,
          ),
          reason: 'phone number known',
        });
        break;
      case 'linkedin':
        plan.push({
          channel,
          automatable: false, // human-in-the-loop — always
          reason: 'LinkedIn DM queued for human delivery',
        });
        break;
      case 'facebook':
        plan.push({ channel, automatable: false, reason: 'Facebook DM requires manual contact' });
        break;
    }
  }
  return plan;
}

// ---------------------------------------------------------------------------
// Message composition
// ---------------------------------------------------------------------------

function firstName(contactName?: string): string {
  return contactName?.trim().split(/\s+/)[0] || 'there';
}

interface TemplateCtx {
  contactFirst: string;
  productName: string;
  hookLine: string;
  ctaLink: string;
}

function buildCtaLink(): string {
  // Booking page — the same funnel the public store uses.
  return process.env.SMART_FACTORY_CTA_URL || 'https://dws10.com/buy/?from=smart-factory';
}

function hookFor(prospect: MatchedProspect): string {
  const signal = prospect.signals?.[0];
  if (signal) return `I saw ${signal}`;
  const reg = prospect.matches.find((m) => m.reason.includes('regulation'));
  if (reg) return `Given your exposure to the regulations we track`;
  return `Your work in ${prospect.industry || 'your sector'}`;
}

const TEMPLATES: Record<string, (c: TemplateCtx) => { subject: string; body: string }> = {
  en: (c) => ({
    subject: `${c.productName} — relevant for your team?`,
    body:
      `Hi ${c.contactFirst},\n\n` +
      `${c.hookLine}.\n\n` +
      `We built ${c.productName} exactly for this: it turns regulatory obligations ` +
      `into audit-ready outcomes without adding headcount.\n\n` +
      `Worth a 20-minute call? Pick a slot here: ${c.ctaLink}\n\n` +
      `Best,\nDWS Sales Factory\n`,
  }),
  fi: (c) => ({
    subject: `${c.productName} — ajankohtainen tiimillenne?`,
    body:
      `Hei ${c.contactFirst},\n\n` +
      `${c.hookLine}.\n\n` +
      `Rakensimme tuotteen ${c.productName} juuri tähän: se muuttaa sääntelyvelvoitteet ` +
      `valmiiksi auditoitaviksi lopputuloksiksi ilman lisäresursseja.\n\n` +
      `Sopiiko 20 minuutin puhelu? Valitse aika täältä: ${c.ctaLink}\n\n` +
      `Ystävällisin terveisin,\nDWS Sales Factory\n`,
  }),
};

/**
 * Compose one outbound message for a prospect on one channel.
 * Uses the top matched product as the pitch anchor.
 */
export function composeMessage(
  prospect: MatchedProspect,
  prospectId: string,
  campaignId: string,
  channel: Channel,
): PlannedMessage | null {
  const best = prospect.matches[0];
  if (!best) return null;

  const lang = inferOutreachLang(prospect.countryCode);
  const template = TEMPLATES[lang] || TEMPLATES.en;

  const ctx: TemplateCtx = {
    contactFirst: firstName(prospect.contactName),
    productName: best.productName,
    hookLine: hookFor(prospect),
    ctaLink: buildCtaLink(),
  };

  const { subject, body } = template(ctx);

  return {
    prospectId,
    campaignId,
    channel,
    productId: best.productId,
    subject,
    body,
  };
}
