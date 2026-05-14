/**
 * DocuSign eSignature Integration — Types
 *
 * Code-Version: 1.1.0
 * Branch: claude/verify-nda-signatures-rdgOj
 * Date: 2026-03-21
 * Owner: risto.paarni2022@lifetime.fi
 */

// --- Enums ---

export enum DocuSignEnvironment {
  DEMO = 'demo',
  PRODUCTION = 'production',
}

export enum EnvelopeStatus {
  CREATED = 'created',
  SENT = 'sent',
  DELIVERED = 'delivered',
  SIGNED = 'signed',
  COMPLETED = 'completed',
  DECLINED = 'declined',
  VOIDED = 'voided',
}

export enum RecipientType {
  SIGNER = 'signer',
  CC = 'cc',
  CERTIFIED_DELIVERY = 'certifiedDelivery',
}

export enum SignatureType {
  NDA = 'nda',
  CONTRACT = 'contract',
  AMENDMENT = 'amendment',
  MSA = 'msa',
  REPORT = 'report',
}

// --- Config ---

export interface DocuSignConfig {
  integrationKey: string;
  userId: string;
  accountId: string;
  rsaPrivateKey: string;
  environment: DocuSignEnvironment;
  /** Base URL derived from environment */
  basePath?: string;
  /** OAuth base URL derived from environment */
  oauthBasePath?: string;
}

// --- Recipients ---

export interface Recipient {
  email: string;
  name: string;
  type: RecipientType;
  routingOrder?: number;
  /** Tab positions for signature placement */
  tabs?: SignatureTab[];
}

export interface SignatureTab {
  anchorString?: string;
  anchorXOffset?: string;
  anchorYOffset?: string;
  pageNumber?: string;
  xPosition?: string;
  yPosition?: string;
}

// --- Documents ---

export interface EnvelopeDocument {
  /** Document name shown in DocuSign */
  name: string;
  /** File extension (pdf, docx) */
  fileExtension: string;
  /** Document ID (must be unique per envelope) */
  documentId: string;
  /** Base64 encoded document content */
  documentBase64?: string;
  /** File path on disk (alternative to base64) */
  filePath?: string;
}

// --- Envelope ---

export interface CreateEnvelopeRequest {
  /** Email subject line */
  emailSubject: string;
  /** Email body */
  emailBlurb?: string;
  /** Documents to sign */
  documents: EnvelopeDocument[];
  /** Recipients (signers, CCs) */
  recipients: Recipient[];
  /** Send immediately or save as draft */
  status: 'sent' | 'created';
  /** Document type for internal tracking */
  signatureType?: SignatureType;
}

export interface EnvelopeResult {
  envelopeId: string;
  status: EnvelopeStatus;
  statusDateTime: string;
  uri: string;
}

export interface EnvelopeStatusResult {
  envelopeId: string;
  status: EnvelopeStatus;
  statusChangedDateTime: string;
  sender: {
    email: string;
    name: string;
  };
  recipients: RecipientStatus[];
  documentsUri: string;
  createdDateTime: string;
  completedDateTime?: string;
  declinedDateTime?: string;
  voidedDateTime?: string;
  voidedReason?: string;
}

export interface RecipientStatus {
  email: string;
  name: string;
  status: string;
  signedDateTime?: string;
  deliveredDateTime?: string;
  declinedDateTime?: string;
  declinedReason?: string;
}

// --- Webhook / Connect ---

export interface DocuSignWebhookEvent {
  event: string;
  apiVersion: string;
  uri: string;
  retryCount: number;
  configurationId: number;
  generatedDateTime: string;
  data: {
    accountId: string;
    envelopeId: string;
    envelopeSummary: EnvelopeStatusResult;
  };
}
