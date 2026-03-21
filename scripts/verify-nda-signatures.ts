/**
 * Verify NDA Signatures — DocuSign Integration Test
 *
 * Usage:
 *   npx tsx scripts/verify-nda-signatures.ts auth     # Test JWT authentication
 *   npx tsx scripts/verify-nda-signatures.ts consent   # Get consent URL
 *   npx tsx scripts/verify-nda-signatures.ts list      # List recent envelopes
 *   npx tsx scripts/verify-nda-signatures.ts status <envelopeId>  # Check envelope
 *
 * Code-Version: 1.0.0
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

    default:
      console.error(`Unknown command: ${command}`);
      console.log('Commands: auth, consent, list, status <id>');
      process.exit(1);
  }
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
