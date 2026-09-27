#!/usr/bin/env node
// Evidence: Tool=GitHub-Copilot-CLI-1.0.88 Model=auto Agent=openclaw-control-plane-plan Date=2026-09-27
// Audit trail: git log -- scripts/verify-nemoclaw-runtime.mjs
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const finding = (id, severity, message) => ({ id, severity, message });
const expectedIds = ['connect', 'sovereign', 'aegis'];

export function checkProfiles(config) {
  const issues = [];
  if (
    config?.version !== 1 ||
    config.status !== 'proposed-not-enforced' ||
    !Array.isArray(config.profiles)
  ) {
    return [
      finding(
        'profile-schema',
        'error',
        'Expected version 1, proposed-not-enforced and profiles array',
      ),
    ];
  }
  for (const id of expectedIds) {
    if (config.profiles.filter((profile) => profile?.id === id).length !== 1) {
      issues.push(finding('profile-identity', 'error', `Expected exactly one ${id} profile`));
    }
  }
  if (config.profiles.length !== 3)
    issues.push(finding('profile-count', 'error', 'Expected three profiles'));
  for (const profile of config.profiles) {
    if (!profile || typeof profile !== 'object' || !expectedIds.includes(profile.id)) {
      issues.push(finding('profile-unknown', 'error', 'Profiles must have a recognized identity'));
      continue;
    }
    const prefix = `profile-${profile.id}`;
    const domains = profile.network?.allowedDomains;
    if (
      !Array.isArray(domains) ||
      domains.some(
        (domain) =>
          typeof domain !== 'string' ||
          !/^[a-z0-9]+(?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9]+(?:[a-z0-9-]*[a-z0-9])?)*$/.test(domain),
      )
    ) {
      issues.push(
        finding(`${prefix}-egress`, 'error', 'Egress must be an array of explicit domain names'),
      );
    }
    if (profile.network?.mode !== (profile.id === 'aegis' ? 'deny-all' : 'allowlist')) {
      issues.push(
        finding(
          `${prefix}-network-mode`,
          'error',
          'Network mode does not match the proposed profile',
        ),
      );
    }
    if (
      profile.skills?.installation !== (profile.id === 'aegis' ? 'disabled' : 'signed-allowlist')
    ) {
      issues.push(
        finding(`${prefix}-skills`, 'error', 'Skill installation must be signed or disabled'),
      );
    }
    if (
      profile.id === 'connect' &&
      (profile.modelRoute !== 'policy-routed' ||
        profile.cloudFallback !== true ||
        profile.externalControlPlane !== 'optional')
    ) {
      issues.push(
        finding(
          `${prefix}-routing`,
          'error',
          'Connect routing must remain explicitly policy-controlled',
        ),
      );
    }
    if (profile.id !== 'connect') {
      if (profile.cloudFallback !== false || profile.modelRoute !== 'local-sovereign') {
        issues.push(finding(`${prefix}-cloud`, 'error', 'Sovereign routing must be local-only'));
      }
      if (profile.externalControlPlane !== 'forbidden') {
        issues.push(
          finding(`${prefix}-control-plane`, 'error', 'External control plane forbidden'),
        );
      }
      if (Array.isArray(domains) && domains.length > 0) {
        issues.push(
          finding(
            `${prefix}-network`,
            'error',
            'Sovereign profiles cannot declare external egress',
          ),
        );
      }
    }
    if (profile.audit?.article12 !== 'required' || profile.audit.failClosed !== true) {
      issues.push(finding(`${prefix}-audit`, 'error', 'Article 12 persistence must fail closed'));
    }
    if (
      profile.id === 'aegis' &&
      (profile.network?.mode !== 'deny-all' || profile.skills?.installation !== 'disabled')
    ) {
      issues.push(
        finding(`${prefix}-isolation`, 'error', 'Aegis must deny network and skill installation'),
      );
    }
  }
  return issues;
}

function serviceBlock(compose) {
  const lines = compose.split(/\r?\n/);
  const start = lines.findIndex((line) => /^  nemoclaw:\s*$/.test(line));
  if (start < 0) return null;
  const end = lines.findIndex((line, index) => index > start && /^  [\w-]+:\s*$/.test(line));
  return lines
    .slice(start, end < 0 ? undefined : end)
    .filter((line) => !/^\s*#/.test(line))
    .join('\n');
}

export function checkDeployment(compose, bridge) {
  const block = serviceBlock(compose);
  if (!block) return [finding('service-missing', 'error', 'NemoClaw service absent from compose')];
  const issues = [];
  const image = block.match(/^\s+image:\s*(.+)$/m)?.[1]?.trim();
  if (!image || /:latest\b/.test(image) || !/@sha256:[a-f0-9]{64}(?:\}|$)/.test(image)) {
    issues.push(
      finding(
        'image-unpinned',
        'error',
        'Runtime image must reference an approved immutable digest',
      ),
    );
  }
  if (/^\s+ports:\s*$/m.test(block))
    issues.push(finding('host-port', 'error', 'Runtime publishes a host port'));
  if (!/^\s+NEMOCLAW_API_KEY:\s*["']?\$\{NEMOCLAW_API_KEY:\?[^}]+\}["']?\s*$/m.test(block)) {
    issues.push(
      finding(
        'auth-missing',
        'error',
        'Runtime authentication must require a nonempty secret from compose',
      ),
    );
  }
  if (/NEMOCLAW_ALLOW_EGRESS:\s*["']?false/.test(block)) {
    issues.push(
      finding(
        'egress-unverified',
        'error',
        'Environment flag alone does not enforce network isolation',
      ),
    );
  }
  const port = block.match(/^\s+PORT:\s*["']?(\d+)/m)?.[1];
  const bridgePort = bridge.match(/nemoclawEndpoint:\s*['"]http:\/\/127\.0\.0\.1:(\d+)/)?.[1];
  if (!port || !bridgePort || port !== bridgePort) {
    issues.push(
      finding(
        'port-drift',
        'error',
        `Compose port ${port ?? 'unknown'} and bridge default ${bridgePort ?? 'unknown'} differ or are unknown`,
      ),
    );
  }
  issues.push(
    finding(
      'live-unverified',
      'info',
      'Static checks cannot verify OpenShell isolation, process kill, or audit persistence',
    ),
  );
  return issues;
}

export function verify(root) {
  try {
    const profiles = JSON.parse(
      readFileSync(path.join(root, 'config/nemoclaw/profiles.json'), 'utf8'),
    );
    const compose = readFileSync(
      path.join(root, 'infrastructure/dgx-spark/docker-compose.yml'),
      'utf8',
    );
    const bridge = readFileSync(path.join(root, 'src/mcp/nemoclaw-bridge.ts'), 'utf8');
    const findings = [...checkProfiles(profiles), ...checkDeployment(compose, bridge)];
    return {
      ok: !findings.some((item) => item.severity === 'error'),
      liveVerified: false,
      findings,
    };
  } catch (error) {
    return {
      ok: false,
      liveVerified: false,
      findings: [finding('read-failed', 'error', String(error))],
    };
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  if (args.some((arg) => arg !== '--json')) {
    console.error('Usage: npm run diag:nemoclaw -- [--json]');
    process.exitCode = 2;
  } else {
    const report = verify(process.cwd());
    if (args.includes('--json')) console.log(JSON.stringify(report, null, 2));
    else {
      console.log(
        `NemoClaw configuration: ${report.ok ? 'PASS' : 'FAIL'}; live enforcement: UNVERIFIED`,
      );
      for (const item of report.findings)
        console.log(`[${item.severity}] ${item.id}: ${item.message}`);
    }
    if (!report.ok) process.exitCode = 1;
  }
}
