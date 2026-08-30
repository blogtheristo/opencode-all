/**
 * Smart Factory for Sales — shared types.
 *
 * Pipeline: catalog (any number of products) → prospect sourcing →
 * product↔prospect matching → channel routing (email / WhatsApp / LinkedIn /
 * Facebook) → rate-capped delivery → call booking on reply.
 */

export type Channel = 'email' | 'whatsapp' | 'linkedin' | 'facebook';

export const ALL_CHANNELS: Channel[] = ['email', 'whatsapp', 'linkedin', 'facebook'];

/** Raw product as supplied by a customer (JSON catalog file or API payload). */
export interface CatalogProduct {
  id: string;
  name: string;
  description?: string;
  features?: string[];
  price?: number;
  currency?: string;
}

/**
 * Product enriched with matchable dimensions. `keywords` are lowercased
 * tokens extracted from name/description/features; `industries` and
 * `regulations` come from the domain dictionaries in match.ts.
 */
export interface NormalizedProduct extends CatalogProduct {
  keywords: string[];
  industries: string[];
  regulations: string[];
}

/** A candidate prospect before matching (from any source). */
export interface ProspectCandidate {
  orgName: string;
  domain?: string;
  countryCode?: string;
  industry?: string;
  contactName?: string;
  title?: string;
  email?: string;
  phone?: string;
  linkedinUrl?: string;
  facebookUrl?: string;
  source: string;
  /** Free-text demand signals (tender titles, news, regulations in force…). */
  signals?: string[];
}

export interface ProductMatch {
  productId: string;
  productName: string;
  score: number;
  reason: string;
}

export interface MatchedProspect extends ProspectCandidate {
  matches: ProductMatch[];
  fitScore: number;
  dedupKey: string;
}

export type ProspectStatus = 'new' | 'matched' | 'contacted' | 'replied' | 'call_booked' | 'unqualified';

export type MessageStatus = 'queued' | 'sent' | 'failed' | 'manual_pending';

export interface CampaignConfig {
  id: string;
  name: string;
  catalog: NormalizedProduct[];
  channels: Channel[];
  dailyCap: number;
  status: 'active' | 'paused' | 'completed';
}

/** One planned touch for a prospect on one channel. */
export interface PlannedMessage {
  prospectId: string;
  campaignId: string;
  channel: Channel;
  productId: string | null;
  subject: string;
  body: string;
}

export interface SendOutcome {
  prospectId: string;
  channel: Channel;
  ok: boolean
  status: MessageStatus;
  providerMessageId?: string;
  error?: string;
}

export interface DispatchSummary {
  attempted: number;
  sent: Record<Channel, number>;
  failed: number;
  manualQueued: number;
  capReached: boolean;
}

export interface PipelineRunSummary {
  campaign: string;
  prospectsScanned: number;
  prospectsMatched: number;
  prospectsUpserted: number;
  messagesQueued: number;
  messagesSent: Record<Channel, number>;
  messagesFailed: number;
  capReached: boolean;
  callsBooked: number;
}
