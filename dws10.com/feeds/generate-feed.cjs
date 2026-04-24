/**
 * Google Merchant Center Feed Generator
 *
 * Generates google-products.xml from config/products.json
 * Run with: node generate-feed.js
 *
 * Schedule this to run daily via cron or GitHub Actions to keep
 * Google Merchant Center in sync with your product prices.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG_PATH = path.join(__dirname, '..', 'config', 'products.json');
const OUTPUT_PATH = path.join(__dirname, 'google-products.xml');
const BASE_URL = 'https://dws10.com';

function loadConfig() {
  const data = fs.readFileSync(CONFIG_PATH, 'utf8');
  return JSON.parse(data);
}

function escapeXml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function generateProductXml(product) {
  const google = product.google || {};
  const price = `${product.price.toFixed(2)} ${product.currency || 'EUR'}`;

  // Resolve image URL
  let imageUrl = product.image;
  if (imageUrl && imageUrl.startsWith('../')) {
    imageUrl = `${BASE_URL}/${imageUrl.replace('../', '')}`;
  } else if (imageUrl && imageUrl.startsWith('/')) {
    imageUrl = `${BASE_URL}${imageUrl}`;
  } else if (imageUrl && !imageUrl.startsWith('http')) {
    imageUrl = `${BASE_URL}/${imageUrl}`;
  }

  // Products link to their detail page or main store
  let productUrl = `${BASE_URL}/buy/`;
  if (product.detailsUrl) {
    productUrl = `${BASE_URL}/${product.detailsUrl.replace('../', '')}`;
  }

  let xml = `
    <item>
      <g:id>${escapeXml(product.id)}</g:id>
      <g:title>${escapeXml(product.name)}</g:title>
      <g:description>${escapeXml(product.description)}</g:description>
      <g:link>${escapeXml(productUrl)}</g:link>
      <g:image_link>${escapeXml(imageUrl)}</g:image_link>
      <g:price>${price}</g:price>
      <g:availability>${google.availability || 'in_stock'}</g:availability>
      <g:condition>${google.condition || 'new'}</g:condition>
      <g:brand>${escapeXml(google.brand || 'Lifetime')}</g:brand>`;

  if (product.mpn) {
    xml += `
      <g:mpn>${escapeXml(product.mpn)}</g:mpn>`;
  }

  if (product.gtin) {
    xml += `
      <g:gtin>${escapeXml(product.gtin)}</g:gtin>`;
  }
  // Note: identifier_exists should be true (or omitted) when MPN + brand are provided
  // Only set to false if product has no GTIN, MPN, or brand
  if (!product.gtin && !product.mpn && !google.brand) {
    xml += `
      <g:identifier_exists>false</g:identifier_exists>`;
  }

  if (google.productCategory) {
    xml += `
      <g:google_product_category>${escapeXml(google.productCategory)}</g:google_product_category>`;
  }

  // Custom labels for campaign targeting
  if (product.featured) {
    xml += `
      <g:custom_label_0>featured</g:custom_label_0>`;
  }
  xml += `
      <g:custom_label_1>${product.type === 'monthly' ? 'subscription' : 'one-time'}</g:custom_label_1>`;

  // Subscription info for monthly products
  if (product.type === 'monthly') {
    xml += `
      <g:subscription_cost>
        <g:period>month</g:period>
        <g:period_length>1</g:period_length>
        <g:amount>${price}</g:amount>
      </g:subscription_cost>`;
  }

  // Checkout link template (Revolut Business)
  const checkoutLink = product.revolutLink || 'https://revolut.me/lifetimeoy';
  xml += `
      <g:checkout_link_template>${escapeXml(checkoutLink)}</g:checkout_link_template>`;

  // Shipping (digital products = free)
  // Subscription products must be limited to single country (FI) per Google requirements
  const shippingCountry = product.type === 'monthly' ? 'FI' : google.targetCountry || 'FI';
  xml += `
      <g:shipping>
        <g:country>${shippingCountry}</g:country>
        <g:service>Digital Delivery</g:service>
        <g:price>0.00 EUR</g:price>
      </g:shipping>
    </item>`;

  return xml;
}

function generateFeed(config) {
  const products = Object.values(config.products);

  // All feed links must use the same domain registered in Google Merchant Center
  // Domain: dws10.com | Language: en | Channel: online
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Lifetime Firehorse Store — Sovereign AI Products &amp; Services</title>
    <link>${BASE_URL}/buy/</link>
    <description>Sovereign AI products and services for enterprises and SMEs. EU-hosted, CLOUD Act free. Climate compliance, industrial AI, and expert advisory by Lifetime Oy.</description>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <g:feedVersion>2.0</g:feedVersion>
`;

  for (const product of products) {
    xml += generateProductXml(product);
  }

  xml += `
  </channel>
</rss>`;

  return xml;
}

// Main
try {
  console.log('Loading product configuration...');
  const config = loadConfig();

  console.log(`Found ${Object.keys(config.products).length} products`);

  console.log('Generating Google Merchant feed...');
  const feed = generateFeed(config);

  console.log(`Writing feed to ${OUTPUT_PATH}`);
  fs.writeFileSync(OUTPUT_PATH, feed, 'utf8');

  console.log('✓ Feed generated successfully!');
  console.log(`  Products: ${Object.keys(config.products).length}`);
  console.log(`  Output: ${OUTPUT_PATH}`);
  console.log(`  Feed URL: ${BASE_URL}/feeds/google-products.xml`);
} catch (error) {
  console.error('Error generating feed:', error);
  process.exit(1);
}
