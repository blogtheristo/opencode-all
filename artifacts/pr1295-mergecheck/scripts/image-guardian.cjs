#!/usr/bin/env node
/**
 * Image Guardian — Protect image assets from accidental deletion
 *
 * Commands:
 *   node scripts/image-guardian.cjs manifest    — Generate/update image manifest
 *   node scripts/image-guardian.cjs check       — Check for missing images (CI mode, exits 1 on missing)
 *   node scripts/image-guardian.cjs restore     — Restore deleted images from git history
 *   node scripts/image-guardian.cjs audit       — Full audit: existing, missing, broken references
 *
 * The manifest file (dws10.com/config/image-manifest.json) is the source of truth.
 * It tracks every image that SHOULD exist with its SHA256 hash.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execFileSync, spawnSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const MANIFEST_PATH = path.join(ROOT, 'dws10.com', 'config', 'image-manifest.json');

// Directories to scan for images
const IMAGE_DIRS = [
    'dws10.com/static/images',
    'dws10.com/DWS_IQ2026.png',
    'dws10.com/static/images/lifetime-fleet',
    'landing-pages/dws10-com/static/images',
];

// Image extensions to track
const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.svg', '.gif', '.webp', '.ico'];

// HTML directories to scan for image references
const HTML_DIRS = [
    'dws10.com',
    'landing-pages/dws10-com',
];

function sha256(filepath) {
    const data = fs.readFileSync(filepath);
    return crypto.createHash('sha256').update(data).digest('hex');
}

function findImages(dir) {
    const results = [];
    const absDir = path.join(ROOT, dir);

    if (!fs.existsSync(absDir)) return results;

    // Handle single file
    if (fs.statSync(absDir).isFile()) {
        const ext = path.extname(absDir).toLowerCase();
        if (IMAGE_EXTENSIONS.includes(ext)) {
            results.push(dir);
        }
        return results;
    }

    function walk(currentDir, relativeBase) {
        const entries = fs.readdirSync(currentDir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(currentDir, entry.name);
            const relPath = path.join(relativeBase, entry.name);
            if (entry.isDirectory()) {
                // Skip node_modules, .git, dist
                if (['node_modules', '.git', 'dist', '.venv'].includes(entry.name)) continue;
                walk(fullPath, relPath);
            } else if (entry.isFile()) {
                const ext = path.extname(entry.name).toLowerCase();
                if (IMAGE_EXTENSIONS.includes(ext)) {
                    results.push(relPath);
                }
            }
        }
    }

    walk(absDir, dir);
    return results;
}

function findAllImages() {
    const images = new Set();
    for (const dir of IMAGE_DIRS) {
        for (const img of findImages(dir)) {
            images.add(img);
        }
    }

    // Also scan all dws10.com for any images we might have missed
    for (const img of findImages('dws10.com')) {
        images.add(img);
    }

    return [...images].sort();
}

function findHTMLImageRefs() {
    const refs = new Map(); // imagePath → [htmlFiles that reference it]

    function scanHTML(dir) {
        const absDir = path.join(ROOT, dir);
        if (!fs.existsSync(absDir)) return;

        function walk(currentDir, relBase) {
            const entries = fs.readdirSync(currentDir, { withFileTypes: true });
            for (const entry of entries) {
                if (['node_modules', '.git', 'dist', '.venv'].includes(entry.name)) continue;
                const fullPath = path.join(currentDir, entry.name);
                const relPath = path.join(relBase, entry.name);

                if (entry.isDirectory()) {
                    walk(fullPath, relPath);
                } else if (entry.isFile() && entry.name.endsWith('.html')) {
                    const content = fs.readFileSync(fullPath, 'utf8');
                    // Match src="...image..." and href="...image..."
                    const imgRegex = /(?:src|href)=["']([^"']*?\.(?:png|jpg|jpeg|svg|gif|webp|ico))["']/gi;
                    let match;
                    while ((match = imgRegex.exec(content)) !== null) {
                        let imgPath = match[1];
                        // Skip external URLs
                        if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) continue;
                        // Resolve relative paths
                        if (imgPath.startsWith('/')) {
                            imgPath = path.join(dir.split('/')[0], imgPath.slice(1));
                        } else if (imgPath.startsWith('../')) {
                            const htmlDir = path.dirname(relPath);
                            imgPath = path.normalize(path.join(htmlDir, imgPath));
                        } else {
                            const htmlDir = path.dirname(relPath);
                            imgPath = path.normalize(path.join(htmlDir, imgPath));
                        }
                        // Normalize
                        imgPath = imgPath.replace(/\\/g, '/');

                        if (!refs.has(imgPath)) refs.set(imgPath, []);
                        refs.get(imgPath).push(relPath);
                    }
                }
            }
        }

        walk(absDir, dir);
    }

    for (const dir of HTML_DIRS) {
        scanHTML(dir);
    }

    return refs;
}

function getDeletedImagesFromGit() {
    try {
        const output = execFileSync(
            'git',
            ['log', '--diff-filter=D', '--name-only', '--pretty=format:COMMIT:%H %s', '-50',
             '--', '*.png', '*.jpg', '*.jpeg', '*.svg', '*.webp', '*.gif'],
            { cwd: ROOT, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 }
        );
        const lines = output.trim().split('\n');
        const deleted = [];
        let currentCommit = '';
        for (const line of lines) {
            if (line.startsWith('COMMIT:')) {
                currentCommit = line.slice(7);
            } else if (line.trim()) {
                deleted.push({ file: line.trim(), commit: currentCommit });
            }
        }
        return deleted;
    } catch {
        return [];
    }
}

function restoreFromGit(filepath) {
    try {
        // Find the last commit where this file existed
        const commitHash = execFileSync(
            'git',
            ['log', '--diff-filter=D', '--format=%H', '-1', '--', filepath],
            { cwd: ROOT, encoding: 'utf8' }
        ).trim();

        if (!commitHash) {
            console.log(`  Could not find deletion commit for ${filepath}`);
            return false;
        }

        // Restore from the commit BEFORE deletion
        const parentRef = commitHash + '~1';
        const absPath = path.join(ROOT, filepath);
        const dir = path.dirname(absPath);
        fs.mkdirSync(dir, { recursive: true });

        // Use spawnSync to avoid shell injection — write stdout directly to file
        const result = spawnSync('git', ['show', `${parentRef}:${filepath}`], {
            cwd: ROOT,
            maxBuffer: 50 * 1024 * 1024
        });

        if (result.status !== 0) {
            console.log(`  ❌ Failed to restore: ${filepath} (git show exited ${result.status})`);
            return false;
        }

        fs.writeFileSync(absPath, result.stdout);

        if (fs.existsSync(absPath) && fs.statSync(absPath).size > 0) {
            console.log(`  ✅ Restored: ${filepath} (from ${commitHash.slice(0, 8)})`);
            return true;
        } else {
            // Clean up empty file
            if (fs.existsSync(absPath)) fs.unlinkSync(absPath);
            console.log(`  ❌ Failed to restore: ${filepath}`);
            return false;
        }
    } catch (e) {
        console.log(`  ❌ Cannot restore ${filepath}: ${e.message}`);
        return false;
    }
}

// ---- Commands ----

function cmdManifest() {
    console.log('Generating image manifest...\n');
    const images = findAllImages();

    const manifest = {
        _comment: 'Image Guardian manifest — do not delete images listed here without approval',
        generated: new Date().toISOString().split('T')[0],
        imageCount: images.length,
        images: {}
    };

    for (const img of images) {
        const absPath = path.join(ROOT, img);
        if (fs.existsSync(absPath)) {
            const stats = fs.statSync(absPath);
            manifest.images[img] = {
                sha256: sha256(absPath),
                size: stats.size,
                lastModified: stats.mtime.toISOString().split('T')[0]
            };
        }
    }

    fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
    console.log(`Manifest written: ${MANIFEST_PATH}`);
    console.log(`Tracked images: ${Object.keys(manifest.images).length}`);
}

function cmdCheck() {
    console.log('Checking image assets against manifest...\n');

    if (!fs.existsSync(MANIFEST_PATH)) {
        console.log('❌ No manifest found. Run: node scripts/image-guardian.cjs manifest');
        process.exit(1);
    }

    const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
    let missing = 0;
    let corrupted = 0;

    for (const [imgPath, meta] of Object.entries(manifest.images)) {
        const absPath = path.join(ROOT, imgPath);
        if (!fs.existsSync(absPath)) {
            console.log(`  ❌ MISSING: ${imgPath}`);
            missing++;
        } else {
            const currentHash = sha256(absPath);
            if (currentHash !== meta.sha256) {
                console.log(`  ⚠️  MODIFIED: ${imgPath} (hash changed)`);
                corrupted++;
            }
        }
    }

    console.log(`\nResults: ${Object.keys(manifest.images).length} tracked, ${missing} missing, ${corrupted} modified`);

    if (missing > 0) {
        console.log('\n❌ Missing images detected. Run: node scripts/image-guardian.cjs restore');
        process.exit(1);
    }

    console.log('✅ All images intact');
}

function cmdRestore() {
    console.log('Attempting to restore deleted images from git history...\n');

    // First check manifest for what should exist
    let imagesToRestore = [];

    if (fs.existsSync(MANIFEST_PATH)) {
        const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
        for (const imgPath of Object.keys(manifest.images)) {
            if (!fs.existsSync(path.join(ROOT, imgPath))) {
                imagesToRestore.push(imgPath);
            }
        }
    }

    // Also check git history for recently deleted images
    const deleted = getDeletedImagesFromGit();
    for (const { file } of deleted) {
        if (!imagesToRestore.includes(file) && !fs.existsSync(path.join(ROOT, file))) {
            imagesToRestore.push(file);
        }
    }

    if (imagesToRestore.length === 0) {
        console.log('✅ No missing images to restore');
        return;
    }

    console.log(`Found ${imagesToRestore.length} images to restore:\n`);
    let restored = 0;
    for (const img of imagesToRestore) {
        if (restoreFromGit(img)) restored++;
    }

    console.log(`\nRestored ${restored}/${imagesToRestore.length} images`);

    if (restored > 0) {
        console.log('\nRun "node scripts/image-guardian.cjs manifest" to update the manifest');
    }
}

function cmdAudit() {
    console.log('=== IMAGE GUARDIAN FULL AUDIT ===\n');

    // 1. Existing images
    const existing = findAllImages();
    console.log(`📦 Existing images in repo: ${existing.length}`);
    for (const img of existing) {
        const absPath = path.join(ROOT, img);
        const size = fs.statSync(absPath).size;
        const sizeKB = (size / 1024).toFixed(1);
        console.log(`  ${img} (${sizeKB} KB)`);
    }

    // 2. HTML image references
    console.log(`\n🔗 Scanning HTML for image references...`);
    const refs = findHTMLImageRefs();
    console.log(`Found ${refs.size} unique image references`);

    // 3. Missing images (referenced but not on disk)
    const missing = [];
    for (const [imgPath, htmlFiles] of refs) {
        const absPath = path.join(ROOT, imgPath);
        if (!fs.existsSync(absPath)) {
            missing.push({ path: imgPath, referencedBy: htmlFiles });
        }
    }

    if (missing.length > 0) {
        console.log(`\n❌ MISSING IMAGES (referenced in HTML but not on disk): ${missing.length}`);
        for (const m of missing) {
            console.log(`  ${m.path}`);
            const uniqueRefs = [...new Set(m.referencedBy)];
            for (const ref of uniqueRefs.slice(0, 3)) {
                console.log(`    ← ${ref}`);
            }
            if (uniqueRefs.length > 3) {
                console.log(`    ← ... and ${uniqueRefs.length - 3} more`);
            }
        }
    } else {
        console.log('\n✅ No missing image references');
    }

    // 4. Recently deleted from git
    console.log('\n🗑️  Recently deleted images (git history):');
    const deleted = getDeletedImagesFromGit();
    if (deleted.length > 0) {
        for (const d of deleted) {
            console.log(`  ${d.file}`);
            console.log(`    commit: ${d.commit.slice(0, 60)}`);
        }
    } else {
        console.log('  None found in recent history');
    }

    // Summary
    console.log('\n=== SUMMARY ===');
    console.log(`Existing: ${existing.length} images`);
    console.log(`Missing:  ${missing.length} images (broken references)`);
    console.log(`Deleted:  ${deleted.length} images (in git history)`);

    if (missing.length > 0) {
        console.log(`\nRun: node scripts/image-guardian.cjs restore`);
    }
}

// ---- Main ----
const cmd = process.argv[2];

switch (cmd) {
    case 'manifest':
        cmdManifest();
        break;
    case 'check':
        cmdCheck();
        break;
    case 'restore':
        cmdRestore();
        break;
    case 'audit':
        cmdAudit();
        break;
    default:
        console.log('Image Guardian — Protect image assets from accidental deletion\n');
        console.log('Usage:');
        console.log('  node scripts/image-guardian.cjs manifest  — Generate/update image manifest');
        console.log('  node scripts/image-guardian.cjs check     — Check for missing images (CI)');
        console.log('  node scripts/image-guardian.cjs restore   — Restore deleted images from git');
        console.log('  node scripts/image-guardian.cjs audit     — Full audit report');
        process.exit(1);
}
