/**
 * Verify NDA Signatures — DocuSign Integration
 *
 * Usage:
 *   npx tsx scripts/verify-nda-signatures.ts auth       # Test JWT authentication
 *   npx tsx scripts/verify-nda-signatures.ts consent     # Get consent URL
 *   npx tsx scripts/verify-nda-signatures.ts list        # List recent envelopes
 *   npx tsx scripts/verify-nda-signatures.ts status <id> # Check envelope
 *   npx tsx scripts/verify-nda-signatures.ts send <file> # Send mutual NDA for signing
 *
 * Code-Version: 1.1.0
 * Date: 2026-03-21
 * Owner: risto.paarni2022@lifetime.fi
 */

import 'dotenv/config';
import { DocuSignClient } from '../src/integrations/docusign';

async function main() {
  const command = process.argv[2] || 'auth';

  const client = DocuSignClient.fromEnv();

  switch (command) {
    case 'consent': {
      const url = client.getConsentUrl();
      console.log('Visit this URL to grant consent (one-time):');
      console.log(url);
      break;
    }

    case 'auth': {
      console.log('Testing JWT authentication...');
      try {
        const token = await client.authenticate();
        console.log('SUCCESS — JWT auth working');
        console.log(`Token prefix: ${token.substring(0, 20)}...`);
      } catch (err: unknown) {
        const error = err as { response?: { data?: unknown }; message?: string };
        if (error.response?.data) {
          const data = error.response.data as Record<string, string>;
          if (data.error === 'consent_required') {
            console.log('Consent required. Visit this URL first:');
            console.log(client.getConsentUrl());
          } else {
            console.error('Auth failed:', data);
          }
        } else {
          console.error('Auth failed:', error.message);
        }
      }
      break;
    }

    case 'list': {
      console.log('Listing recent envelopes...');
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const envelopes = await client.listEnvelopes(thirtyDaysAgo.toISOString());

      if (envelopes.length === 0) {
        console.log('No envelopes found in the last 30 days.');
      } else {
        for (const env of envelopes) {
          console.log(`  ${env.envelopeId} — ${env.status} (${env.createdDateTime})`);
        }
      }
      break;
    }

    case 'status': {
      const envelopeId = process.argv[3];
      if (!envelopeId) {
        console.error('Usage: verify-nda-signatures.ts status <envelopeId>');
        process.exit(1);
      }
      console.log(`Checking envelope ${envelopeId}...`);
      const status = await client.getEnvelopeStatus(envelopeId);
      console.log(JSON.stringify(status, null, 2));
      break;
    }

    case 'send': {
      const filePath = process.argv[3] || 'Partners/NDA_Qantic.md';
      const fs = await import('fs');
      if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        process.exit(1);
      }
      console.log(`Sending mutual NDA: ${filePath}`);
      console.log('  Signer 1: Risto Anton Päärni <risto.paarni@lifetime.fi>');
      console.log('  Signer 2: Thomas A. Kalitzky <support@qantic.com>');
      console.log('  Environment: DocuSign Sandbox (demo)');
      console.log('');

      const result = await client.sendMutualNDA({
        signer1Email: 'risto.paarni@lifetime.fi',
        signer1Name: 'Risto Anton Päärni',
        signer2Email: 'support@qantic.com',
        signer2Name: 'Thomas A. Kalitzky',
        documentPath: filePath,
      });

      console.log('SUCCESS — Mutual NDA sent for signing');
      console.log(`  Envelope ID: ${result.envelopeId}`);
      console.log(`  Status: ${result.status}`);
      console.log(`  Sent at: ${result.statusDateTime}`);
      console.log('');
      console.log('Track status:');
      console.log(`  npx tsx scripts/verify-nda-signatures.ts status ${result.envelopeId}`);
      break;
    }

    default:
      console.error(`Unknown command: ${command}`);
      console.log('Commands: auth, consent, list, status <id>, send <file>');
      process.exit(1);
  }
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
