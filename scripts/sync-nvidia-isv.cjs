#!/usr/bin/env node
/**
 * Sync NVIDIA ISV page data from products.json + nvidia-isv.json
 *
 * Reads:
 *   - dws10.com/config/products.json (product names, prices)
 *   - dws10.com/config/nvidia-isv.json (NVIDIA-specific data)
 *
 * Updates:
 *   - dws10.com/lifetime-fleet/nvidia-isv/index.html (detects drift in hardware specs)
 *   - dws10.com/config/nvidia-isv.json (syncs product names from products.json)
 *
 * Usage: node scripts/sync-nvidia-isv.cjs [--check]
 *   --check: dry-run mode, exits 1 if drift detected (for CI)
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PRODUCTS_PATH = path.join(ROOT, 'dws10.com', 'config', 'products.json');
const NVIDIA_CONFIG_PATH = path.join(ROOT, 'dws10.com', 'config', 'nvidia-isv.json');
const NVIDIA_HTML_PATH = path.join(ROOT, 'dws10.com', 'lifetime-fleet', 'nvidia-isv', 'index.html');
const NVIDIA_HTML_LP = path.join(ROOT, 'landing-pages', 'dws10-com', 'lifetime-fleet', 'nvidia-isv', 'index.html');
const NVIDIA_CONFIG_LP = path.join(ROOT, 'landing-pages', 'dws10-com', 'config', 'nvidia-isv.json');

const isCheckMode = process.argv.includes('--check');

function loadJSON(filepath) {
    return JSON.parse(fs.readFileSync(filepath, 'utf8'));
}

function saveJSON(filepath, data) {
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function syncProductNames() {
    const products = loadJSON(PRODUCTS_PATH);
    const nvidia = loadJSON(NVIDIA_CONFIG_PATH);
    let drifts = [];

    // Sync DWS IQ Platform name
    const dwsiq = products.products['DWS-IQ-006'];
    if (dwsiq && nvidia.products.platform.name !== 'DWS IQ Platform') {
        drifts.push(`Platform name: "${nvidia.products.platform.name}" → "DWS IQ Platform"`);
        nvidia.products.platform.name = 'DWS IQ Platform';
    }

    // Validate DWS IQ Report exists (FH-RPT-001) — this is NOT on the NVIDIA page
    // but we track it to ensure the rename is consistent
    const report = products.products['FH-RPT-001'];
    if (report) {
        const reportName = report.name;
        if (reportName !== 'DWS IQ Report') {
            drifts.push(`Report product name drift: "${reportName}" (expected "DWS IQ Report")`);
        }
    }

    // Update timestamp
    const today = new Date().toISOString().split('T')[0];
    nvidia.lastUpdated = today;

    return { nvidia, drifts };
}

function syncHTML(nvidia) {
    if (!fs.existsSync(NVIDIA_HTML_PATH)) {
        console.log('NVIDIA ISV HTML not found, skipping HTML sync');
        return [];
    }

    const html = fs.readFileSync(NVIDIA_HTML_PATH, 'utf8');
    const changes = [];

    // Build expected hardware description strings from config
    const computeSpec = nvidia.hardware.compute;
    const expectedComputeDesc = `${computeSpec.name} — ${computeSpec.soc} SoC · ${computeSpec.memory} memory · ${computeSpec.os} · ${computeSpec.power}`;

    const edgeSpec = nvidia.hardware.edge;
    const expectedEdgeDesc = `${edgeSpec.name} — ${edgeSpec.use}`;

    // Detect drift: check if HTML contains the expected hardware names/specs
    if (!html.includes(computeSpec.name)) {
        changes.push(`Compute hardware name "${computeSpec.name}" not found in HTML`);
    }
    if (!html.includes(computeSpec.soc)) {
        changes.push(`Compute SoC "${computeSpec.soc}" not found in HTML`);
    }
    if (!html.includes(edgeSpec.name)) {
        changes.push(`Edge hardware "${edgeSpec.name}" not found in HTML`);
    }
    if (!html.includes(nvidia.products.platform.name)) {
        changes.push(`Platform name "${nvidia.products.platform.name}" not found in HTML`);
    }
    if (!html.includes(nvidia.products.forensicReport.name)) {
        changes.push(`Forensic product "${nvidia.products.forensicReport.name}" not found in HTML`);
    }

    if (changes.length > 0) {
        console.log(`\n⚠️  HTML drift detected (${changes.length} issues):`);
        changes.forEach(c => console.log(`  - ${c}`));
        console.log('  → Update dws10.com/lifetime-fleet/nvidia-isv/index.html to match config');
    }

    // Summary
    console.log(`\nNVIDIA ISV Config Summary:`);
    console.log(`  Platform: ${nvidia.products.platform.name} v${nvidia.products.platform.version}`);
    console.log(`  Forensic: ${nvidia.products.forensicReport.name}`);
    console.log(`  World Model: ${nvidia.products.worldModel.name} (${nvidia.products.worldModel.acronym})`);
    console.log(`  Compute: ${computeSpec.name} (${computeSpec.soc})`);
    console.log(`  Edge: ${edgeSpec.name} (${edgeSpec.latency})`);
    console.log(`  NVIDIA Tech: ${nvidia.nvidiaTech.length} technologies`);
    console.log(`  Compliance: ${nvidia.compliance.length} frameworks`);
    console.log(`  Last Updated: ${nvidia.lastUpdated}`);

    return changes;
}

function copyToLandingPages() {
    // Sync nvidia-isv.json
    const configDir = path.dirname(NVIDIA_CONFIG_LP);
    fs.mkdirSync(configDir, { recursive: true });
    fs.copyFileSync(NVIDIA_CONFIG_PATH, NVIDIA_CONFIG_LP);

    // Sync HTML
    if (fs.existsSync(NVIDIA_HTML_PATH)) {
        const htmlDir = path.dirname(NVIDIA_HTML_LP);
        fs.mkdirSync(htmlDir, { recursive: true });
        fs.copyFileSync(NVIDIA_HTML_PATH, NVIDIA_HTML_LP);
    }
}

// Main
try {
    console.log('Syncing NVIDIA ISV page data...');

    const { nvidia, drifts } = syncProductNames();

    if (drifts.length > 0) {
        console.log(`\nProduct name drifts detected:`);
        drifts.forEach(d => console.log(`  ⚠️  ${d}`));

        if (isCheckMode) {
            console.log('\n❌ Drift check failed. Run without --check to fix.');
            process.exit(1);
        }
    } else {
        console.log('✅ Product names in sync');
    }

    const htmlDrifts = syncHTML(nvidia);

    if (isCheckMode && htmlDrifts.length > 0) {
        console.log('\n❌ HTML drift check failed. Update the HTML to match nvidia-isv.json.');
        process.exit(1);
    }

    if (!isCheckMode) {
        saveJSON(NVIDIA_CONFIG_PATH, nvidia);
        copyToLandingPages();
        console.log('\n✅ NVIDIA ISV config updated and synced to landing-pages');
    } else {
        console.log('\n✅ Check mode — no files modified');
    }

} catch (error) {
    console.error('Error syncing NVIDIA ISV data:', error.message);
    process.exit(1);
}
