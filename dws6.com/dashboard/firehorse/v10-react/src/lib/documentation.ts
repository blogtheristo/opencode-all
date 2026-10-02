// Evidence: Tool=GitHub Copilot CLI 1.0.88 Model=gpt-5.6-sol Agent=copilot Date=2026-09-27
// Audit trail: git log -- dws6.com/dashboard/firehorse/v10-react/src/lib/documentation.ts
import { z } from 'zod';

export const AudienceRoleSchema = z.enum(['admin', 'investor', 'partner', 'customer']);
export type AudienceRole = z.infer<typeof AudienceRoleSchema>;

export interface DocumentationEntry {
  id: string;
  title: string;
  summary: string;
  output: `docs/${string}.html`;
  roles: readonly AudienceRole[];
}

export const LEARNING_HUB_VERSION = '2026.09.27';

export const DOCUMENTATION_CATALOGUE: readonly DocumentationEntry[] = [
  { id: 'admin-manual', title: 'DWS IQ Platform Admin Manual', summary: 'Platform operations, maintenance, and role-pack procedures.', output: 'docs/admin-manual.html', roles: ['admin'] },
  { id: 'kya-jev-specification', title: 'kya-jev Specification', summary: 'KYA-gated typed decisions: signed verdicts, audit logging, calibration status, and implementation plan.', output: 'docs/kya-jev-specification.html', roles: ['admin'] },
  { id: 'learning-standard', title: 'DWS Learning Standard', summary: 'Human-in-command learning outcomes and oversight practices.', output: 'docs/dws-learning-standard.html', roles: ['admin'] },
  { id: 'security-standard', title: 'DWS Security Standard', summary: 'Internal security controls and implementation requirements.', output: 'docs/dws-security-standard.html', roles: ['admin'] },
  { id: 'document-standard', title: 'DWS Document Standard', summary: 'Document governance, provenance, and source-of-truth rules.', output: 'docs/dws-document-standard.html', roles: ['admin'] },
  { id: 'investor-memo', title: 'DWS IQ Investor Memorandum', summary: 'Investor overview of the DWS IQ opportunity and operating model.', output: 'docs/investor-memorandum.html', roles: ['investor'] },
  { id: 'partner-addendum', title: 'KYA Partner Addendum', summary: 'Partner-facing KYA responsibilities and integration terms.', output: 'docs/kya-partner-addendum.html', roles: ['partner'] },
  { id: 'security-compliance', title: 'Enterprise Security & Compliance', summary: 'Customer and partner overview of the DWS security posture.', output: 'docs/security-compliance.html', roles: ['partner', 'customer'] },
  { id: 'sovereign-intelligence', title: 'Sovereign Industrial Intelligence', summary: 'Overview of sovereign industrial intelligence outcomes and delivery.', output: 'docs/sovereign-industrial-intelligence.html', roles: ['investor', 'partner', 'customer'] },
];

export function resolveAudienceRole(value: unknown): AudienceRole {
  const result = AudienceRoleSchema.safeParse(value);
  return result.success ? result.data : 'customer';
}

export function documentationForRole(role: AudienceRole): readonly DocumentationEntry[] {
  return DOCUMENTATION_CATALOGUE.filter((document) => document.roles.includes(role));
}

export function learningHubBaseUrl(value: unknown): string | null {
  if (typeof value !== 'string' || value.trim() === '') return null;
  const candidate = value.trim().replace(/\/+$/, '');
  if (/^https:\/\/[^\s]+$/i.test(candidate)) return candidate;
  if (/^\/(?!\/)[A-Za-z0-9._~!$&'()*+,;=:@%/-]*$/.test(candidate)) return candidate;
  return null;
}

export function documentationUrl(baseUrl: string, role: AudienceRole, output: DocumentationEntry['output']): string {
  return `${baseUrl}/${LEARNING_HUB_VERSION}/${role}/${output}`;
}
