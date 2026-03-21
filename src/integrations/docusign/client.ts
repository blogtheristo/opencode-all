/**
 * DocuSign eSignature Integration — Client
 *
 * JWT Grant authentication + envelope operations.
 * Used for NDA signature tracking and contract management.
 *
 * Code-Version: 1.0.0
 * Branch: claude/verify-nda-signatures-rdgOj
 * Date: 2026-03-21
 * Owner: risto.paarni2022@lifetime.fi
 */

import fs from 'fs';
import path from 'path';
import axios, { AxiosInstance } from 'axios';
import {
  DocuSignConfig,
  DocuSignEnvironment,
  CreateEnvelopeRequest,
  EnvelopeResult,
  EnvelopeStatusResult,
  Recipient,
  RecipientType,
  EnvelopeDocument,
  SignatureType,
} from './types';

const DEMO_BASE_PATH = 'https://demo.docusign.net/restapi';
const PROD_BASE_PATH = 'https://na1.docusign.net/restapi';
const DEMO_OAUTH_PATH = 'account-d.docusign.com';
const PROD_OAUTH_PATH = 'account.docusign.com';

export class DocuSignClient {
  private config: DocuSignConfig;
  private httpClient: AxiosInstance;
  private accessToken: string | null = null;
  private tokenExpiresAt: number = 0;

  constructor(config: DocuSignConfig) {
    this.config = {
      ...config,
      basePath: config.environment === DocuSignEnvironment.DEMO
        ? DEMO_BASE_PATH
        : PROD_BASE_PATH,
      oauthBasePath: config.environment === DocuSignEnvironment.DEMO
        ? DEMO_OAUTH_PATH
        : PROD_OAUTH_PATH,
    };

    this.httpClient = axios.create({
      baseURL: this.config.basePath,
      timeout: 30000,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  /**
   * Create client from environment variables.
   */
  static fromEnv(): DocuSignClient {
    const integrationKey = process.env.DOCUSIGN_INTEGRATION_KEY;
    const userId = process.env.DOCUSIGN_USER_ID;
    const accountId = process.env.DOCUSIGN_ACCOUNT_ID;
    const rsaPrivateKey = process.env.DOCUSIGN_RSA_PRIVATE_KEY;
    const environment = (process.env.DOCUSIGN_ENVIRONMENT || 'demo') as DocuSignEnvironment;

    if (!integrationKey || !userId || !accountId || !rsaPrivateKey) {
      throw new Error(
        'Missing DocuSign config. Required: DOCUSIGN_INTEGRATION_KEY, ' +
        'DOCUSIGN_USER_ID, DOCUSIGN_ACCOUNT_ID, DOCUSIGN_RSA_PRIVATE_KEY'
      );
    }

    return new DocuSignClient({
      integrationKey,
      userId,
      accountId,
      rsaPrivateKey: rsaPrivateKey.replace(/\\n/g, '\n'),
      environment,
    });
  }

  /**
   * Authenticate using JWT Grant flow.
   * Returns access token valid for ~1 hour.
   */
  async authenticate(): Promise<string> {
    // Reuse valid token
    if (this.accessToken && Date.now() < this.tokenExpiresAt - 60000) {
      return this.accessToken;
    }

    const now = Math.floor(Date.now() / 1000);
    const jwtPayload = {
      iss: this.config.integrationKey,
      sub: this.config.userId,
      aud: this.config.oauthBasePath,
      iat: now,
      exp: now + 3600,
      scope: 'signature impersonation',
    };

    // Build JWT manually: header.payload.signature
    const header = this.base64url(JSON.stringify({ typ: 'JWT', alg: 'RS256' }));
    const payload = this.base64url(JSON.stringify(jwtPayload));
    const signingInput = `${header}.${payload}`;

    // Sign with RSA private key using Node.js crypto
    const crypto = await import('crypto');
    const sign = crypto.createSign('RSA-SHA256');
    sign.update(signingInput);
    const signature = sign.sign(this.config.rsaPrivateKey, 'base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const assertion = `${signingInput}.${signature}`;

    const tokenResponse = await axios.post(
      `https://${this.config.oauthBasePath}/oauth/token`,
      new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion,
      }).toString(),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );

    this.accessToken = tokenResponse.data.access_token;
    this.tokenExpiresAt = Date.now() + (tokenResponse.data.expires_in * 1000);

    // Update HTTP client auth header
    this.httpClient.defaults.headers.common['Authorization'] =
      `Bearer ${this.accessToken}`;

    return this.accessToken!;
  }

  /**
   * Send an envelope (document for signing).
   */
  async sendEnvelope(request: CreateEnvelopeRequest): Promise<EnvelopeResult> {
    await this.authenticate();

    const envelopeDefinition = this.buildEnvelopeDefinition(request);

    const response = await this.httpClient.post(
      `/v2.1/accounts/${this.config.accountId}/envelopes`,
      envelopeDefinition,
    );

    return {
      envelopeId: response.data.envelopeId,
      status: response.data.status,
      statusDateTime: response.data.statusDateTime,
      uri: response.data.uri,
    };
  }

  /**
   * Get envelope status and recipient information.
   */
  async getEnvelopeStatus(envelopeId: string): Promise<EnvelopeStatusResult> {
    await this.authenticate();

    const [envelopeRes, recipientsRes] = await Promise.all([
      this.httpClient.get(
        `/v2.1/accounts/${this.config.accountId}/envelopes/${envelopeId}`
      ),
      this.httpClient.get(
        `/v2.1/accounts/${this.config.accountId}/envelopes/${envelopeId}/recipients`
      ),
    ]);

    const envelope = envelopeRes.data;
    const signers = recipientsRes.data.signers || [];

    return {
      envelopeId: envelope.envelopeId,
      status: envelope.status,
      statusChangedDateTime: envelope.statusChangedDateTime,
      sender: {
        email: envelope.sender?.email || '',
        name: envelope.sender?.userName || '',
      },
      recipients: signers.map((s: Record<string, string>) => ({
        email: s.email,
        name: s.name,
        status: s.status,
        signedDateTime: s.signedDateTime,
        deliveredDateTime: s.deliveredDateTime,
        declinedDateTime: s.declinedDateTime,
        declinedReason: s.declinedReason,
      })),
      documentsUri: envelope.documentsUri,
      createdDateTime: envelope.createdDateTime,
      completedDateTime: envelope.completedDateTime,
      declinedDateTime: envelope.declinedDateTime,
      voidedDateTime: envelope.voidedDateTime,
      voidedReason: envelope.voidedReason,
    };
  }

  /**
   * List recent envelopes with optional status filter.
   */
  async listEnvelopes(
    fromDate: string,
    status?: string,
  ): Promise<EnvelopeStatusResult[]> {
    await this.authenticate();

    const params: Record<string, string> = { from_date: fromDate };
    if (status) params.status = status;

    const response = await this.httpClient.get(
      `/v2.1/accounts/${this.config.accountId}/envelopes`,
      { params },
    );

    return (response.data.envelopes || []).map(
      (e: Record<string, string>) => ({
        envelopeId: e.envelopeId,
        status: e.status,
        statusChangedDateTime: e.statusChangedDateTime,
        sender: { email: '', name: '' },
        recipients: [],
        documentsUri: e.documentsUri || '',
        createdDateTime: e.createdDateTime,
        completedDateTime: e.completedDateTime,
      })
    );
  }

  /**
   * Download signed document from completed envelope.
   */
  async downloadDocument(
    envelopeId: string,
    documentId: string,
    outputPath: string,
  ): Promise<string> {
    await this.authenticate();

    const response = await this.httpClient.get(
      `/v2.1/accounts/${this.config.accountId}/envelopes/${envelopeId}/documents/${documentId}`,
      { responseType: 'arraybuffer' },
    );

    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputPath, response.data);
    return outputPath;
  }

  /**
   * Void (cancel) an envelope that hasn't been completed.
   */
  async voidEnvelope(envelopeId: string, reason: string): Promise<void> {
    await this.authenticate();

    await this.httpClient.put(
      `/v2.1/accounts/${this.config.accountId}/envelopes/${envelopeId}`,
      { status: 'voided', voidedReason: reason },
    );
  }

  /**
   * Send NDA envelope — convenience method.
   */
  async sendNDA(params: {
    signerEmail: string;
    signerName: string;
    documentPath: string;
    ccEmail?: string;
    ccName?: string;
  }): Promise<EnvelopeResult> {
    const documentBase64 = fs.readFileSync(params.documentPath).toString('base64');
    const ext = path.extname(params.documentPath).replace('.', '');

    const recipients: Recipient[] = [
      {
        email: params.signerEmail,
        name: params.signerName,
        type: RecipientType.SIGNER,
        routingOrder: 1,
        tabs: [{ anchorString: '/sn1/', anchorYOffset: '-10' }],
      },
    ];

    if (params.ccEmail && params.ccName) {
      recipients.push({
        email: params.ccEmail,
        name: params.ccName,
        type: RecipientType.CC,
        routingOrder: 2,
      });
    }

    return this.sendEnvelope({
      emailSubject: 'NDA — Please sign',
      emailBlurb: 'Please review and sign the attached Non-Disclosure Agreement.',
      documents: [
        {
          name: 'Non-Disclosure Agreement',
          fileExtension: ext || 'pdf',
          documentId: '1',
          documentBase64,
        },
      ],
      recipients,
      status: 'sent',
      signatureType: SignatureType.NDA,
    });
  }

  /**
   * Get the consent URL for first-time JWT auth.
   * User must visit this URL once to grant consent.
   */
  getConsentUrl(): string {
    const scopes = 'signature impersonation';
    return (
      `https://${this.config.oauthBasePath}/oauth/auth?` +
      `response_type=code&` +
      `scope=${encodeURIComponent(scopes)}&` +
      `client_id=${this.config.integrationKey}&` +
      `redirect_uri=https://localhost`
    );
  }

  // --- Private helpers ---

  private buildEnvelopeDefinition(request: CreateEnvelopeRequest) {
    const signers = request.recipients
      .filter((r) => r.type === RecipientType.SIGNER)
      .map((r, i) => ({
        email: r.email,
        name: r.name,
        recipientId: String(i + 1),
        routingOrder: String(r.routingOrder || i + 1),
        tabs: r.tabs?.length
          ? {
              signHereTabs: r.tabs.map((t) => ({
                anchorString: t.anchorString,
                anchorYOffset: t.anchorYOffset,
                anchorXOffset: t.anchorXOffset,
                pageNumber: t.pageNumber,
                xPosition: t.xPosition,
                yPosition: t.yPosition,
              })),
            }
          : undefined,
      }));

    const carbonCopies = request.recipients
      .filter((r) => r.type === RecipientType.CC)
      .map((r, i) => ({
        email: r.email,
        name: r.name,
        recipientId: String(signers.length + i + 1),
        routingOrder: String(r.routingOrder || signers.length + i + 1),
      }));

    const documents = request.documents.map((d) => {
      let base64 = d.documentBase64;
      if (!base64 && d.filePath) {
        base64 = fs.readFileSync(d.filePath).toString('base64');
      }
      return {
        documentBase64: base64,
        name: d.name,
        fileExtension: d.fileExtension,
        documentId: d.documentId,
      };
    });

    return {
      emailSubject: request.emailSubject,
      emailBlurb: request.emailBlurb,
      documents,
      recipients: {
        signers,
        carbonCopies: carbonCopies.length > 0 ? carbonCopies : undefined,
      },
      status: request.status,
    };
  }

  private base64url(str: string): string {
    return Buffer.from(str)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }
}
