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
      const { execFileSync } = await import('child_process');
      if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        process.exit(1);
      }

      // Convert .md to .pdf — DocuSign cannot accept .md files
      // Priority: pandoc (best quality) → markdown-pdf (fallback)
      let sendPath = filePath;
      if (filePath.endsWith('.md')) {
        const pdfPath = filePath.replace(/\.md$/, '.pdf');
        console.log(`Converting ${filePath} → PDF...`);

        let converted = false;

        // Try pandoc first (best quality, supports headers/footers)
        try {
          execFileSync('pandoc', ['--version'], { stdio: 'ignore' });
          execFileSync(
            'pandoc',
            [
              filePath,
              '-o',
              pdfPath,
              '--pdf-engine=xelatex',
              '-V',
              'geometry:margin=2.5cm',
              '-V',
              'fontsize=11pt',
            ],
            { stdio: 'inherit' },
          );
          converted = fs.existsSync(pdfPath);
          if (converted) console.log('  Converted with pandoc.');
        } catch {
          // pandoc not available or failed
        }

        // Fallback: markdown-pdf (npm)
        if (!converted) {
          try {
            execFileSync('npx', ['--yes', 'markdown-pdf', filePath, '-o', pdfPath], {
              stdio: 'inherit',
            });
            converted = fs.existsSync(pdfPath);
            if (converted) console.log('  Converted with markdown-pdf.');
          } catch {
            // markdown-pdf failed
          }
        }

        if (!converted) {
          console.error('PDF conversion failed. Install pandoc or run: npm i -g markdown-pdf');
          process.exit(1);
        }

        sendPath = pdfPath;
        console.log('');
      }
      console.log(`Sending mutual NDA: ${filePath}`);
      console.log('  Signer 1: Risto Anton Päärni <risto.paarni@lifetime.fi>');
      console.log('  Signer 2: Thomas A. Kalitzky <t.kalitzky@qantic.com>');
      console.log('  Environment: DocuSign');
      console.log('');

      const readline = await import('readline');
      const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
      const answer = await new Promise<string>((resolve) => {
        rl.question('Send NDA to both signers? (Y/n): ', resolve);
      });
      rl.close();

      if (answer.toLowerCase() !== 'y' && answer !== '') {
        console.log('Aborted.');
        process.exit(0);
      }

      const result = await client.sendMutualNDA({
        signer1Email: 'risto.paarni@lifetime.fi',
        signer1Name: 'Risto Anton Päärni',
        signer2Email: 't.kalitzky@qantic.com',
        signer2Name: 'Thomas A. Kalitzky',
        documentPath: sendPath,
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
