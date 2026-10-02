// Evidence: Tool=Claude Code 2.1.283 Model=anthropic/claude Agent=claude Date=2026-09-27
// Audit trail: git log -- src/services/fulfilment-packet.service.ts
//
// Automates the SKU-independent part of docs/runbooks/PRODUCT_FULFILMENT_RUNBOOK.md for every
// catalogue product: on a verified payment the buyer receives the acceptance outcomes and the
// exclusions (runbook steps 2 and 5), and the owning team receives the delivery checklist
// (steps 3-4 prepared). Delivery itself stays managed and human-verified; nothing here claims
// unattended delivery.
import { readFile, stat } from 'node:fs/promises';
import { escapeHtml } from '../utils/send-email.js';

export interface FulfilmentPacket {
  productId: string;
  owner: string;
  route: string;
  acknowledgementSla: string;
  deliveryMode: string;
  runbookRef: string;
  acceptanceCondition: string;
  requiredOutcomes: string[];
  exclusions: string[];
}

const CATALOGUE_URL = new URL('../../dws10.com/config/products.json', import.meta.url);
let cached: { mtimeMs: number; products: Record<string, unknown> } | null = null;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

const str = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');
const strList = (value: unknown): string[] =>
  Array.isArray(value) ? value.map(str).filter(Boolean) : [];

/**
 * Builds a packet from one raw catalogue record. Returns null when the record lacks any field the
 * runbook needs, so a caller never sends a half-filled checklist.
 */
export function parseFulfilmentPacket(productId: string, raw: unknown): FulfilmentPacket | null {
  if (!isRecord(raw) || !isRecord(raw.fulfilment) || !isRecord(raw.acceptanceKpi)) return null;
  const packet: FulfilmentPacket = {
    productId,
    owner: str(raw.fulfilment.owner),
    route: str(raw.fulfilment.route),
    acknowledgementSla: str(raw.fulfilment.acknowledgementSla),
    deliveryMode: str(raw.fulfilment.deliveryMode),
    runbookRef: str(raw.fulfilment.runbookRef),
    acceptanceCondition: str(raw.acceptanceKpi.condition),
    requiredOutcomes: strList(raw.acceptanceKpi.requiredOutcomes),
    exclusions: strList(raw.exclusions),
  };
  const complete =
    packet.owner &&
    packet.acknowledgementSla &&
    packet.deliveryMode &&
    packet.runbookRef &&
    packet.acceptanceCondition &&
    packet.requiredOutcomes.length > 0 &&
    packet.exclusions.length > 0;
  return complete ? packet : null;
}

export async function loadFulfilmentPacket(productId: string): Promise<FulfilmentPacket | null> {
  const fileStat = await stat(CATALOGUE_URL);
  if (cached?.mtimeMs !== fileStat.mtimeMs) {
    const doc = JSON.parse(await readFile(CATALOGUE_URL, 'utf8')) as unknown;
    if (!isRecord(doc) || !isRecord(doc.products)) {
      throw new Error('Canonical product catalogue must contain a products object');
    }
    cached = { mtimeMs: fileStat.mtimeMs, products: doc.products };
  }
  return parseFulfilmentPacket(productId, cached.products[productId]);
}

/** Buyer-facing: what happens next, what acceptance means, what is not included. */
export function renderBuyerPacket(packet: FulfilmentPacket): { text: string; html: string } {
  const text = [
    `What happens next: ${packet.owner} acknowledges your order within ${packet.acknowledgementSla}.`,
    '',
    `Delivery is accepted when: ${packet.acceptanceCondition}`,
    ...packet.requiredOutcomes.map((o) => `- ${o}`),
    '',
    'Not included in this order:',
    ...packet.exclusions.map((e) => `- ${e}`),
    '',
  ].join('\n');
  const li = (items: string[]) => items.map((i) => `<li>${escapeHtml(i)}</li>`).join('');
  const html =
    `<p>What happens next: ${escapeHtml(packet.owner)} acknowledges your order within ${escapeHtml(packet.acknowledgementSla)}.</p>` +
    `<p>Delivery is accepted when: ${escapeHtml(packet.acceptanceCondition)}</p><ul>${li(packet.requiredOutcomes)}</ul>` +
    `<p>Not included in this order:</p><ul>${li(packet.exclusions)}</ul>`;
  return { text, html };
}

/** Operations-facing: owner, delivery mode, runbook and the acceptance checklist to close. */
export function renderOperationsPacket(packet: FulfilmentPacket): { text: string; html: string } {
  const text = [
    `Owner: ${packet.owner} (acknowledge within ${packet.acknowledgementSla})`,
    `Delivery mode: ${packet.deliveryMode}`,
    `Runbook: ${packet.runbookRef}`,
    'Acceptance checklist:',
    ...packet.requiredOutcomes.map((o) => `[ ] ${o}`),
    'Exclusions shared with buyer:',
    ...packet.exclusions.map((e) => `- ${e}`),
    '',
  ].join('\n');
  const li = (items: string[]) => items.map((i) => `<li>${escapeHtml(i)}</li>`).join('');
  const html =
    `<p>Owner: ${escapeHtml(packet.owner)} (acknowledge within ${escapeHtml(packet.acknowledgementSla)})<br>` +
    `Delivery mode: ${escapeHtml(packet.deliveryMode)}<br>Runbook: ${escapeHtml(packet.runbookRef)}</p>` +
    `<p>Acceptance checklist:</p><ul>${li(packet.requiredOutcomes)}</ul>` +
    `<p>Exclusions shared with buyer:</p><ul>${li(packet.exclusions)}</ul>`;
  return { text, html };
}
