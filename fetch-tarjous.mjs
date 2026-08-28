#!/usr/bin/env node
import 'dotenv/config.js';

const apiKey = process.env.CLOUDIA_API_KEY;
const apiUrl = process.env.CLOUDIA_API_URL || 'https://api.cloudia.net';
const tarjousid = '5101501';

if (!apiKey) {
  console.error('❌ Missing CLOUDIA_API_KEY in .env');
  process.exit(1);
}

(async () => {
  try {
    console.log('🔐 Authenticating with Cloudia API...');
    console.log(`📄 Fetching tarjouspalvelu opportunity ID: ${tarjousid}\n`);

    const response = await fetch(`${apiUrl}/api/v1/tarjouspalvelu/offers/${tarjousid}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'DWS-Procurement-Monitor/1.0',
      },
    });

    if (!response.ok) {
      console.error(`⚠️  API error: ${response.status} ${response.statusText}`);
      const text = await response.text();
      console.log('Response:', text.substring(0, 500));
      process.exit(1);
    }

    const data = await response.json();
    console.log('📋 OPPORTUNITY DETAILS:\n');
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
})();
