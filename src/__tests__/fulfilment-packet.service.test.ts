// Evidence: Tool=Claude Code 2.1.283 Model=anthropic/claude Agent=claude Date=2026-09-27
// Audit trail: git log -- src/__tests__/fulfilment-packet.service.test.ts
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  loadFulfilmentPacket,
  parseFulfilmentPacket,
  renderBuyerPacket,
  renderOperationsPacket,
} from '../services/fulfilment-packet.service.js';

const catalogue = JSON.parse(
  readFileSync(new URL('../../dws10.com/config/products.json', import.meta.url), 'utf8'),
) as { products: Record<string, Record<string, unknown>> };

const payable = Object.entries(catalogue.products).filter(
  ([, p]) => p.archived !== true && p.productType !== 'archived',
);

describe('fulfilment packet', () => {
  it('builds a complete packet for every non-archived catalogue product', () => {
    const missing = payable
      .filter(([id, p]) => parseFulfilmentPacket(id, p) === null)
      .map(([id]) => id);
    expect(missing).toEqual([]);
    expect(payable.length).toBeGreaterThan(0);
  });

  it('rejects a record without exclusions instead of sending a partial checklist', () => {
    const [id, p] = payable[0];
    expect(parseFulfilmentPacket(id, { ...p, exclusions: [] })).toBeNull();
    expect(parseFulfilmentPacket(id, { ...p, acceptanceKpi: undefined })).toBeNull();
    expect(parseFulfilmentPacket(id, null)).toBeNull();
  });

  it('loads from the canonical catalogue file', async () => {
    const packet = await loadFulfilmentPacket('DWS-IQ-006');
    expect(packet?.runbookRef).toMatch(/^docs\/runbooks\/PRODUCT_FULFILMENT_RUNBOOK\.md#/);
    expect(await loadFulfilmentPacket('NO-SUCH-SKU')).toBeNull();
  });

  it('escapes catalogue text in HTML output', () => {
    const packet = {
      productId: 'X',
      owner: '<b>Team</b>',
      route: '',
      acknowledgementSla: '1 day',
      deliveryMode: 'Managed',
      runbookRef: 'r',
      acceptanceCondition: 'a & b',
      requiredOutcomes: ['<script>'],
      exclusions: ['e'],
    };
    for (const out of [renderBuyerPacket(packet), renderOperationsPacket(packet)]) {
      expect(out.html).not.toContain('<script>');
      expect(out.html).not.toContain('<b>Team</b>');
    }
    expect(renderBuyerPacket(packet).text).toContain('- <script>');
  });
});
