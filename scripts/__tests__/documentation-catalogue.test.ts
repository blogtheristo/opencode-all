// Evidence: Tool=GitHub Copilot CLI 1.0.88 Model=gpt-5.6-sol Agent=copilot Date=2026-09-27
// Audit trail: git log -- scripts/__tests__/documentation-catalogue.test.ts

import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';
import {
  DOCUMENTATION_CATALOGUE,
  documentationForRole,
  documentationUrl,
  learningHubBaseUrl,
  resolveAudienceRole,
} from '../../dws6.com/dashboard/firehorse/v10-react/src/lib/documentation';

describe('dashboard documentation discovery', () => {
  test.each([undefined, null, '', 'R22', 'ADMIN', 42])('fails unknown role %j closed to customer', (value) => {
    expect(resolveAudienceRole(value)).toBe('customer');
  });

  test('isolates the catalogue by validated audience role', () => {
    expect(documentationForRole('customer').map((document) => document.id)).toEqual([
      'security-compliance',
      'sovereign-intelligence',
    ]);
    expect(documentationForRole('customer').some((document) => document.roles.includes('admin'))).toBe(false);
  });

  test('stays aligned with the distribution manifest', () => {
    const manifest = JSON.parse(readFileSync('config/learning-hub/role-documents.json', 'utf8')) as {
      documents: Array<{ id: string; output: string; roles: string[] }>;
    };
    expect(DOCUMENTATION_CATALOGUE.map(({ id, output, roles }) => ({ id, output, roles }))).toEqual(
      manifest.documents.map(({ id, output, roles }) => ({ id, output, roles })),
    );
  });

  test('uses a safe base URL and role-scoped link', () => {
    expect(learningHubBaseUrl(undefined)).toBeNull();
    expect(learningHubBaseUrl('javascript:alert(1)')).toBeNull();
    expect(documentationUrl('/learning-hub', 'partner', 'docs/security-compliance.html')).toBe(
      '/learning-hub/2026.09.27/partner/docs/security-compliance.html',
    );
  });
});
