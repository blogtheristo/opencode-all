#!/usr/bin/env tsx
/**
 * Verify that experimental skills have test runs on all declared surfaces.
 * Exit 1 if any experimental skill is missing verified surfaces.
 * Blocks merge: experimental skills cannot ship without verification.
 */

import { readFileSync } from 'fs';

interface VerifiedSurface {
  surface: string;
  testedAt: string; // ISO 8601 timestamp
  result: 'PASS' | 'FAIL';
}

interface SkillEntry {
  id: string;
  name: string;
  status: 'active' | 'experimental' | 'deferred';
  profile: string;
  skillPackFile?: string;
  verifiedSurfaces?: VerifiedSurface[];
}

interface ManifestData {
  version: string;
  entries: SkillEntry[];
  surfaces: Array<{ id: string; label: string }>;
}

function main() {
  console.log('━━━ Skill Verification Gate ━━━\n');

  let manifest: ManifestData;
  try {
    const raw = readFileSync('skills/manifest.json', 'utf-8');
    manifest = JSON.parse(raw);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_err) {
    console.error('❌ Failed to read skills/manifest.json');
    process.exit(1);
  }
  let violations = 0;

  // Check each skill entry
  for (const skill of manifest.entries) {
    // Only enforce for experimental skills
    if (skill.status !== 'experimental') {
      continue;
    }

    console.log(`📋 ${skill.name} (${skill.id})`);
    console.log(`   Status: ${skill.status}`);

    const verifiedSurfaces = skill.verifiedSurfaces || [];
    const verifiedSurfaceIds = verifiedSurfaces.map((v) => v.surface);

    // Get surfaces for this profile
    const profileData = manifest.profiles?.[skill.profile];
    if (!profileData) {
      console.log(`   ⚠ Profile ${skill.profile} not found`);
      continue;
    }

    const declaredSurfaces = Object.entries(profileData.surfaceSupport || {})
      .filter(([, supported]) => supported)
      .map(([surfaceId]) => surfaceId);

    if (declaredSurfaces.length === 0) {
      console.log('   ✓ No surface support declared (OK)');
      continue;
    }

    console.log(`   Declared surfaces: ${declaredSurfaces.join(', ')}`);

    // Check if all declared surfaces have a verified test run
    const missingVerification = declaredSurfaces.filter((s) => !verifiedSurfaceIds.includes(s));

    if (missingVerification.length > 0) {
      console.log(`   ❌ FAIL: Missing verification for: ${missingVerification.join(', ')}`);
      violations++;
    } else {
      console.log(`   ✓ All surfaces verified`);
      verifiedSurfaces.forEach((v) => {
        console.log(`     - ${v.surface}: ${v.result} (${v.testedAt})`);
      });
    }

    console.log('');
  }

  // Summary
  if (violations === 0) {
    console.log('━━━ ✓ Skill Verification PASSED ━━━');
    process.exit(0);
  } else {
    console.log(
      `━━━ ❌ Skill Verification FAILED ($${violations} experimental skills unverified) ━━━`,
    );
    console.log('Fix: Add verifiedSurfaces to experimental skills, then commit manifest.');
    process.exit(1);
  }
}

main();
