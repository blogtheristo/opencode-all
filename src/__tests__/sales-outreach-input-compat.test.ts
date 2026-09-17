import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SalesOutreachAgent } from '../agents/sales-outreach.agent.js';
import type { AgentContext } from '../agents/types.js';

vi.mock('../utils/logger.js', () => ({
  default: { info: vi.fn(), debug: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

const CONTEXT: AgentContext = {
  userId: 'test-user',
  orgId: 'test-org',
  sessionId: 'test-session',
  projectId: 'test-project',
};

describe('SalesOutreachAgent input compatibility', () => {
  let agent: SalesOutreachAgent;

  beforeEach(() => {
    agent = new SalesOutreachAgent();
    vi.spyOn(agent as any, 'callLLM').mockResolvedValue({
      content: JSON.stringify({ summary: 'placeholder' }),
      model: 'placeholder',
      inputTokens: 0,
      outputTokens: 0,
    });
  });

  it('still works with the canonical sales-outreach payload', async () => {
    const response = await agent.execute(CONTEXT, {
      targetDescription: 'EU steel manufacturers facing CBAM and CSRD reporting pressure',
      offering: 'dws-iq6',
      senderName: 'Risto',
      senderCompany: 'Lifetime Oy',
      emailStyle: 'consultative',
      maxCompanies: 2,
    });

    expect(response.confidence).toBeGreaterThan(0);

    const result = response.result as Record<string, unknown>;
    const companies = result.companies as Array<Record<string, unknown>>;
    const contacts = result.contacts as Array<Record<string, unknown>>;
    const emails = result.emails as Array<Record<string, unknown>>;

    expect(companies).toHaveLength(2);
    expect(contacts).toHaveLength(4);
    expect(emails).toHaveLength(2);
    // After PR that replaced placeholders with real EU companies, first company is SSAB
    expect(typeof companies[0].name).toBe('string');
    expect((companies[0].name as string).length).toBeGreaterThan(0);
  });

  it('accepts Apollo-style workflow input and uses seeded prospect data', async () => {
    const response = await agent.execute(CONTEXT, {
      industry: 'steel manufacturing',
      targetRole: 'Head of Sustainability',
      regulatoryTrigger: 'CBAM',
      prospect: {
        companyName: 'Example Metals Oy',
        website: 'https://example-metals.test',
        industry: 'Steel',
        whyFit: 'CBAM importer with cross-border steel flows',
        offering: 'dws-iq6',
      },
    });

    const result = response.result as Record<string, unknown>;
    const companies = result.companies as Array<Record<string, unknown>>;
    const contacts = result.contacts as Array<Record<string, unknown>>;
    const emails = result.emails as Array<Record<string, unknown>>;

    expect((result.error as string | undefined) || '').toBe('');
    expect(companies).toHaveLength(1);
    expect(companies[0].name).toBe('Example Metals Oy');
    expect(companies[0].website).toBe('https://example-metals.test');
    expect(contacts).toHaveLength(2);
    expect(emails).toHaveLength(1);
  });
});
