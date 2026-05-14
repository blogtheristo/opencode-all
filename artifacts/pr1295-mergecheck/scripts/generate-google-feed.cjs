#!/usr/bin/env node
/**
 * Generate Google Merchant Center Product Feed XML
 *
 * Reads config/products.json and outputs a Google Shopping RSS 2.0 feed.
 * Single URL for Google Merchant Center Next data source.
 *
 * Usage: node scripts/generate-google-feed.js
 * Output: landing-pages/dws10-com/feeds/google-products.xml
 *
 * Run this after updating products.json to regenerate the feed.
 */

const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://dws10.com';
const productsPath = path.join(__dirname, '..', 'landing-pages', 'dws10-com', 'config', 'products.json');
const outputDir = path.join(__dirname, '..', 'landing-pages', 'dws10-com', 'feeds');
const outputPath = path.join(outputDir, 'google-products.xml');

// Category page mapping
const CATEGORY_PAGES = {
    platform: '/buy/',
    'ai-cloud': '/buy/page2/',
    advisory: '/buy/page3/',
    digital: '/buy/page4/'
};

function escapeXml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function getProductLink(product) {
    // Products with dedicated detail pages
    if (product.detailsUrl && product.detailsUrl.includes('products/')) {
        const pageName = product.detailsUrl.split('products/').pop();
        return `${SITE_URL}/products/${pageName}`;
    }
    // Fall back to category store page
    const page = CATEGORY_PAGES[product.storeCategory] || '/buy/';
    return `${SITE_URL}${page}`;
}

function getImageLink(product) {
    if (!product.image) return `${SITE_URL}/DWS_IQ2026.png`;
    if (product.image.startsWith('http')) return product.image;
    return `${SITE_URL}${product.image}`;
}

function formatPrice(price, currency) {
    return `${price.toFixed(2)} ${currency}`;
}

function generateFeed() {
    const data = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
    const products = data.products;
    const now = new Date().toISOString();

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
<channel>
    <title>Lifetime Firehorse Store — Sovereign AI Products &amp; Services</title>
    <link>${SITE_URL}/buy/</link>
    <description>Sovereign AI products and services for enterprises and SMEs. EU-hosted, CLOUD Act free. Climate compliance, industrial AI, and expert advisory by Lifetime Oy.</description>
    <lastBuildDate>${now}</lastBuildDate>
`;

    for (const [key, product] of Object.entries(products)) {
        const google = product.google || {};
        const link = getProductLink(product);
        const imageLink = getImageLink(product);

        xml += `    <item>
        <g:id>${escapeXml(product.id)}</g:id>
        <g:title>${escapeXml(product.name)}</g:title>
        <g:description>${escapeXml(product.description)}</g:description>
        <g:link>${escapeXml(link)}</g:link>
        <g:image_link>${escapeXml(imageLink)}</g:image_link>
        <g:price>${formatPrice(product.price, product.currency)}</g:price>
        <g:availability>${google.availability || 'in_stock'}</g:availability>
        <g:condition>${google.condition || 'new'}</g:condition>
        <g:brand>${escapeXml(google.brand || 'Lifetime')}</g:brand>
`;
        // GTIN or MPN (Google requires at least one)
        if (product.gtin) {
            xml += `        <g:gtin>${escapeXml(product.gtin)}</g:gtin>\n`;
        } else if (product.mpn) {
            xml += `        <g:mpn>${escapeXml(product.mpn)}</g:mpn>\n`;
            xml += `        <g:identifier_exists>false</g:identifier_exists>\n`;
        }

        if (google.productCategory) {
            xml += `        <g:google_product_category>${escapeXml(google.productCategory)}</g:google_product_category>\n`;
        }

        // Custom labels for store categories
        if (product.storeCategory) {
            xml += `        <g:custom_label_0>${escapeXml(product.storeCategory)}</g:custom_label_0>\n`;
        }
        if (product.featured) {
            xml += `        <g:custom_label_1>featured</g:custom_label_1>\n`;
        }

        // Target country
        if (google.targetCountry) {
            xml += `        <g:target_country>${google.targetCountry}</g:target_country>\n`;
        }
        if (google.contentLanguage) {
            xml += `        <g:content_language>${google.contentLanguage}</g:content_language>\n`;
        }

        xml += `    </item>\n`;
    }

    xml += `</channel>
</rss>`;

    // Ensure output directory exists
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(outputPath, xml, 'utf8');

    console.log(`Google Merchant feed generated: ${outputPath}`);
    console.log(`Products: ${Object.keys(products).length}`);
    console.log(`Feed URL: ${SITE_URL}/feeds/google-products.xml`);
}

generateFeed();
