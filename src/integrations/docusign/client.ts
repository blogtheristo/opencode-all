/**
 * DocuSign eSignature Integration — Client
 *
 * JWT Grant authentication + envelope operations.
 * Used for NDA signature tracking, contract management, and report signing.
 * Uses native fetch (Node.js 18+) — no external HTTP dependencies.
 *
 * Code-Version: 1.2.0
 * Branch: claude/verify-nda-signatures-rdgOj
 * Date: 2026-03-21
 * Owner: risto.paarni2022@lifetime.fi
 */

import fs from 'fs';
import path from 'path';
import {
  type CreateEnvelopeRequest,
  type DocuSignConfig,
  DocuSignEnvironment,
  type EnvelopeResult,
  type EnvelopeStatus,
  type EnvelopeStatusResult,
  type Recipient,
  RecipientType,
  SignatureType,
} from './types';

const DEMO_BASE_PATH = 'https://demo.docusign.net/restapi';
const PROD_BASE_PATH = 'https://na1.docusign.net/restapi';
const DEMO_OAUTH_PATH = 'account-d.docusign.com';
const PROD_OAUTH_PATH = 'account.docusign.com';

export class DocuSignClient {
  private config: DocuSignConfig;
  private basePath: string;
  private accessToken: string | null = null;
  private tokenExpiresAt: number = 0;

  constructor(config: DocuSignConfig) {
    const basePath = config.environment === DocuSignEnvironment.DEMO
      ? DEMO_BASE_PATH
      : PROD_BASE_PATH;
    const oauthBasePath = config.environment === DocuSignEnvironment.DEMO
      ? DEMO_OAUTH_PATH
      : PROD_OAUTH_PATH;
    this.config = {
      ...config,
      basePath,
      oauthBasePath,
    };
    this.basePath = basePath;
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

    const tokenResponse = await fetch(
      `https://${this.config.oauthBasePath}/oauth/token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
          assertion,
        }).toString(),
      }
    );

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json().catch(() => ({}));
      const err = new Error(`DocuSign auth failed: ${tokenResponse.status}`);
      (err as unknown as Record<string, unknown>).response = { data: errorData };
      throw err;
    }

    const tokenData = await tokenResponse.json() as { access_token: string; expires_in: number };

    this.accessToken = tokenData.access_token;
    this.tokenExpiresAt = Date.now() + (tokenData.expires_in * 1000);

    return this.accessToken;
  }

  /**
   * Make an authenticated API request to DocuSign.
   */
  private async apiRequest(
    method: string,
    endpoint: string,
    body?: unknown,
    options?: { params?: Record<string, string>; responseType?: 'json' | 'arraybuffer' },
  ): Promise<unknown> {
    await this.authenticate();

    let url = `${this.basePath}${endpoint}`;
    if (options?.params) {
      const qs = new URLSearchParams(options.params).toString();
      url += `?${qs}`;
    }

    const fetchOptions: RequestInit = {
      method,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      fetchOptions.body = JSON.stringify(body);
    }

    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(`DocuSign API error ${response.status}: ${errorText}`);
    }

    if (options?.responseType === 'arraybuffer') {
      return Buffer.from(await response.arrayBuffer());
    }

    return response.json();
  }

  /**
   * Send an envelope (document for signing).
   */
  async sendEnvelope(request: CreateEnvelopeRequest): Promise<EnvelopeResult> {
    const envelopeDefinition = this.buildEnvelopeDefinition(request);

    const data = await this.apiRequest(
      'POST',
      `/v2.1/accounts/${this.config.accountId}/envelopes`,
      envelopeDefinition,
    ) as Record<string, string>;

    return {
      envelopeId: data.envelopeId,
      status: data.status as EnvelopeStatus,
      statusDateTime: data.statusDateTime,
      uri: data.uri,
    };
  }

  /**
   * Get envelope status and recipient information.
   */
  async getEnvelopeStatus(envelopeId: string): Promise<EnvelopeStatusResult> {
    const [envelope, recipientsData] = await Promise.all([
      this.apiRequest(
        'GET',
        `/v2.1/accounts/${this.config.accountId}/envelopes/${envelopeId}`
      ) as Promise<Record<string, unknown>>,
      this.apiRequest(
        'GET',
        `/v2.1/accounts/${this.config.accountId}/envelopes/${envelopeId}/recipients`
      ) as Promise<Record<string, unknown>>,
    ]);

    const signers = (recipientsData.signers || []) as Record<string, string>[];
    const sender = envelope.sender as Record<string, string> | undefined;

    return {
      envelopeId: envelope.envelopeId as string,
      status: envelope.status as EnvelopeStatus,
      statusChangedDateTime: envelope.statusChangedDateTime as string,
      sender: {
        email: sender?.email || '',
        name: sender?.userName || '',
      },
      recipients: signers.map((s) => ({
        email: s.email,
        name: s.name,
        status: s.status,
        signedDateTime: s.signedDateTime,
        deliveredDateTime: s.deliveredDateTime,
        declinedDateTime: s.declinedDateTime,
        declinedReason: s.declinedReason,
      })),
      documentsUri: envelope.documentsUri as string,
      createdDateTime: envelope.createdDateTime as string,
      completedDateTime: envelope.completedDateTime as string,
      declinedDateTime: envelope.declinedDateTime as string,
      voidedDateTime: envelope.voidedDateTime as string,
      voidedReason: envelope.voidedReason as string,
    };
  }

  /**
   * List recent envelopes with optional status filter.
   */
  async listEnvelopes(
    fromDate: string,
    status?: string,
  ): Promise<EnvelopeStatusResult[]> {
    const params: Record<string, string> = { from_date: fromDate };
    if (status) params.status = status;

    const data = await this.apiRequest(
      'GET',
      `/v2.1/accounts/${this.config.accountId}/envelopes`,
      undefined,
      { params },
    ) as Record<string, unknown>;

    return ((data.envelopes || []) as Record<string, string>[]).map(
      (e) => ({
        envelopeId: e.envelopeId,
        status: e.status as EnvelopeStatus,
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
    const data = await this.apiRequest(
      'GET',
      `/v2.1/accounts/${this.config.accountId}/envelopes/${envelopeId}/documents/${documentId}`,
      undefined,
      { responseType: 'arraybuffer' },
    ) as Buffer;

    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(outputPath, data);
    return outputPath;
  }

  /**
   * Void (cancel) an envelope that hasn't been completed.
   */
  async voidEnvelope(envelopeId: string, reason: string): Promise<void> {
    await this.apiRequest(
      'PUT',
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
   * Send mutual NDA envelope — both parties sign.
   * Signer 1 signs first (routingOrder 1), then Signer 2 (routingOrder 2).
   */
  async sendMutualNDA(params: {
    signer1Email: string;
    signer1Name: string;
    signer2Email: string;
    signer2Name: string;
    documentPath: string;
  }): Promise<EnvelopeResult> {
    const documentBase64 = fs.readFileSync(params.documentPath).toString('base64');
    const ext = path.extname(params.documentPath).replace('.', '');

    const recipients: Recipient[] = [
      {
        email: params.signer1Email,
        name: params.signer1Name,
        type: RecipientType.SIGNER,
        routingOrder: 1,
        tabs: [{ anchorString: '/sn1/', anchorYOffset: '-10' }],
      },
      {
        email: params.signer2Email,
        name: params.signer2Name,
        type: RecipientType.SIGNER,
        routingOrder: 2,
        tabs: [{ anchorString: '/sn2/', anchorYOffset: '-10' }],
      },
    ];

    return this.sendEnvelope({
      emailSubject: 'Mutual NDA — Lifetime Oy × Qantic GmbH — Please sign',
      emailBlurb: 'Please review and sign the attached Mutual Non-Disclosure Agreement between Lifetime Oy and Qantic GmbH.',
      documents: [
        {
          name: 'Mutual Non-Disclosure Agreement',
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
   * Send a report for eSignature.
   * Supports single approver or multi-party signing (e.g., author + reviewer).
   * Signature anchors: /sn1/ for first signer, /sn2/ for second signer.
   */
  async sendReport(params: {
    documentPath: string;
    documentName: string;
    signers: Array<{ email: string; name: string; role: string }>;
    emailSubject?: string;
    emailBlurb?: string;
  }): Promise<EnvelopeResult> {
    const documentBase64 = fs.readFileSync(params.documentPath).toString('base64');
    const ext = path.extname(params.documentPath).replace('.', '');

    const recipients: Recipient[] = params.signers.map((signer, i) => ({
      email: signer.email,
      name: signer.name,
      type: RecipientType.SIGNER,
      routingOrder: i + 1,
      tabs: [{ anchorString: `/sn${i + 1}/`, anchorYOffset: '-10' }],
    }));

    const subject = params.emailSubject
      || `Report for signature — ${params.documentName}`;
    const blurb = params.emailBlurb
      || `Please review and sign the attached report: ${params.documentName}`;

    return this.sendEnvelope({
      emailSubject: subject,
      emailBlurb: blurb,
      documents: [
        {
          name: params.documentName,
          fileExtension: ext || 'pdf',
          documentId: '1',
          documentBase64,
        },
      ],
      recipients,
      status: 'sent',
      signatureType: SignatureType.REPORT,
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
