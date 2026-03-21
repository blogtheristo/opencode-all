/**
 * DocuSign eSignature Integration
 *
 * JWT Grant auth + envelope management for NDA/contract signing.
 * Account: risto.paarni2022@lifetime.fi
 *
 * Code-Version: 1.0.0
 * Branch: claude/verify-nda-signatures-rdgOj
 * Date: 2026-03-21
 * Owner: risto.paarni2022@lifetime.fi
 */

export { DocuSignClient } from './client';
export {
  DocuSignConfig,
  DocuSignEnvironment,
  EnvelopeStatus,
  RecipientType,
  SignatureType,
  CreateEnvelopeRequest,
  EnvelopeResult,
  EnvelopeStatusResult,
  RecipientStatus,
  Recipient,
  EnvelopeDocument,
  SignatureTab,
  DocuSignWebhookEvent,
} from './types';
