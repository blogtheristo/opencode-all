// Evidence: Tool=GitHub-Copilot-CLI-1.0.88 Model=auto Agent=openclaw-control-plane-plan Date=2026-09-27
// Audit trail: git log -- src/__tests__/nemoclaw-runtime-verifier.test.ts
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { checkDeployment, checkProfiles, verify } from '../../scripts/verify-nemoclaw-runtime.mjs';

const root = process.cwd();
const profiles = JSON.parse(readFileSync('config/nemoclaw/profiles.json', 'utf8'));
const ids = (findings: { id: string }[]) => findings.map((item) => item.id);

describe('NemoClaw proposed profiles', () => {
  it('validates the checked-in config without treating it as deployed', () => {
    expect(checkProfiles(profiles)).toEqual([]);
    expect(profiles.status).toBe('proposed-not-enforced');
  });
  it('rejects wildcard egress', () => {
    const changed = structuredClone(profiles);
    changed.profiles[0].network.allowedDomains = ['*.example.com'];
    expect(ids(checkProfiles(changed))).toContain('profile-connect-egress');
  });
  it('rejects cloud fallback and external governance for sovereign workloads', () => {
    const changed = structuredClone(profiles);
    changed.profiles[1].cloudFallback = true;
    changed.profiles[1].externalControlPlane = 'optional';
    expect(ids(checkProfiles(changed))).toEqual(
      expect.arrayContaining(['profile-sovereign-cloud', 'profile-sovereign-control-plane']),
    );
  });
  it('rejects Aegis skill installation and network access', () => {
    const changed = structuredClone(profiles);
    changed.profiles[2].network.mode = 'allowlist';
    changed.profiles[2].skills.installation = 'signed-allowlist';
    expect(ids(checkProfiles(changed))).toContain('profile-aegis-isolation');
  });
  it('rejects duplicate or incomplete profiles', () => {
    const changed = structuredClone(profiles);
    changed.profiles[2] = changed.profiles[1];
    expect(ids(checkProfiles(changed))).toContain('profile-identity');
    changed.profiles[0].audit.failClosed = false;
    expect(ids(checkProfiles(changed))).toContain('profile-connect-audit');
  });
  it('rejects unsupported network, skill and routing modes', () => {
    const changed = structuredClone(profiles);
    changed.profiles[0].network.mode = 'open';
    changed.profiles[0].skills.installation = 'unrestricted';
    changed.profiles[0].modelRoute = 'local-sovereign';
    changed.profiles[1].network.mode = 'deny-all';
    expect(ids(checkProfiles(changed))).toEqual(
      expect.arrayContaining([
        'profile-connect-network-mode',
        'profile-connect-skills',
        'profile-connect-routing',
        'profile-sovereign-network-mode',
      ]),
    );
  });
});

describe('read-only deployment check', () => {
  it('reports the present baseline and never claims live enforcement', () => {
    const result = verify(root);
    expect(result.ok).toBe(false);
    expect(result.liveVerified).toBe(false);
    expect(ids(result.findings)).toEqual(
      expect.arrayContaining([
        'image-unpinned',
        'host-port',
        'auth-missing',
        'egress-unverified',
        'port-drift',
        'live-unverified',
      ]),
    );
  });
  it('keeps live enforcement unverified even with sound static declarations', () => {
    const compose = `services:\n  nemoclaw:\n    image: ghcr.io/example/nemoclaw@sha256:${'a'.repeat(64)}\n    environment:\n      PORT: 8090\n      NEMOCLAW_API_KEY: \${NEMOCLAW_API_KEY:?required}\n  heartbeat:\n    image: example\n`;
    const findings = checkDeployment(compose, "nemoclawEndpoint: 'http://127.0.0.1:8090'");
    expect(findings).toEqual([
      { id: 'live-unverified', severity: 'info', message: expect.any(String) },
    ]);
  });
  it('does not accept an optional or literal auth key as a required secret', () => {
    const compose = `services:\n  nemoclaw:\n    image: ghcr.io/example/nemoclaw@sha256:${'a'.repeat(64)}\n    environment:\n      PORT: 8090\n      NEMOCLAW_API_KEY: \${NEMOCLAW_API_KEY:-}\n`;
    expect(ids(checkDeployment(compose, "nemoclawEndpoint: 'http://127.0.0.1:8090'"))).toContain(
      'auth-missing',
    );
    expect(
      ids(
        checkDeployment(
          compose.replace('\${NEMOCLAW_API_KEY:-}', 'literal'),
          "nemoclawEndpoint: 'http://127.0.0.1:8090'",
        ),
      ),
    ).toContain('auth-missing');
    expect(
      checkDeployment(
        compose.replace('    environment:', '    ports:\n      - "8090:8090"\n    environment:'),
        "nemoclawEndpoint: 'http://127.0.0.1:8090'",
      ),
    ).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: 'host-port', severity: 'error' })]),
    );
  });
  it('fails closed when a required file is missing', () => {
    const result = verify('/nonexistent-runtime-check-root');
    expect(result.ok).toBe(false);
    expect(ids(result.findings)).toEqual(['read-failed']);
  });
});
