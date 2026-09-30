// Evidence: Tool=OpenCode Model=ollama-local/qwen3-coder-next:latest Agent=aegis Date=2026-09-30
// Audit trail: git log -- src/__tests__/aegis-pilot-gke-sandbox.test.ts
import { describe, it, expect, beforeAll } from 'vitest';
import type { PilotStep } from '../aegis/pilot/scope.js';
import { stepSandboxManifest } from '../aegis/pilot/gke-sandbox-policy.js';

describe('stepSandboxManifest', () => {
  const coreStep: PilotStep = {
    id: 'core-step',
    name: 'Core task',
    criticality: 'core',
    requiresNetwork: false,
    handler: 'echo',
  };

  const networkStep: PilotStep = {
    id: 'network-step',
    name: 'Network task',
    criticality: 'non-core',
    requiresNetwork: true,
    handler: 'fetch',
  };

  const noNetworkNonCoreStep: PilotStep = {
    id: 'no-net-noncore',
    name: 'No network non-core task',
    criticality: 'non-core',
    requiresNetwork: false,
    handler: 'compute',
  };

  describe('core step', () => {
    it('should not include a network policy', () => {
      const manifest = stepSandboxManifest(coreStep);
      expect(manifest.networkPolicy).toBeNull();
    });

    it('should have no egress even when endpoints are passed', () => {
      const manifest = stepSandboxManifest(coreStep, {
        endpointsByStep: { 'core-step': [{ host: 'example.com', port: 443 }] },
      });
      expect(manifest.networkPolicy).toBeNull();
    });
  });

  describe('non-core step with requiresNetwork', () => {
    it('should include a network policy with egress rules', () => {
      const manifest = stepSandboxManifest(networkStep, {
        endpointsByStep: {
          'network-step': [
            { host: 'api.example.com', port: 443 },
            { host: '192.168.1.1', port: 8080 },
          ],
        },
      });
      expect(manifest.networkPolicy).not.toBeNull();
      expect(manifest.networkPolicy?.apiVersion).toBe('networking.k8s.io/v1');
      expect(manifest.networkPolicy?.kind).toBe('NetworkPolicy');
      expect(manifest.networkPolicy?.spec.egress).toHaveLength(2);
      expect(manifest.networkPolicy?.spec.egress?.[0].to).toEqual([
        { ipBlock: { cidr: 'api.example.com/32' } },
      ]);
      expect(manifest.networkPolicy?.spec.egress?.[0].ports).toEqual([
        { protocol: 'TCP', port: 443 },
      ]);
    });

    it('should include egress only to the endpoints listed for its step id', () => {
      const manifest = stepSandboxManifest(networkStep, {
        endpointsByStep: {
          'network-step': [{ host: 'allowed.example.com', port: 443 }],
          'other-step': [{ host: 'not-allowed.example.com', port: 443 }],
        },
      });
      expect(manifest.networkPolicy).not.toBeNull();
      expect(manifest.networkPolicy?.spec.egress).toHaveLength(1);
      expect(manifest.networkPolicy?.spec.egress?.[0].to).toEqual([
        { ipBlock: { cidr: 'allowed.example.com/32' } },
      ]);
    });
  });

  describe('non-core step without requiresNetwork', () => {
    it('should not include a network policy', () => {
      const manifest = stepSandboxManifest(noNetworkNonCoreStep);
      expect(manifest.networkPolicy).toBeNull();
    });
  });

  let manifest: ReturnType<typeof stepSandboxManifest>;

  beforeAll(() => {
    manifest = stepSandboxManifest(coreStep);
  });

  describe('sandbox spec', () => {
    it('should have runtimeClassName gvisor by default', () => {
      expect(manifest.sandbox.spec.podTemplate.spec.runtimeClassName).toBe('gvisor');
    });

    it('should have read-only root filesystem', () => {
      const container = manifest.sandbox.spec.podTemplate.spec.containers[0];
      expect(container.securityContext.readOnlyRootFilesystem).toBe(true);
    });

    it('should have runAsNonRoot enabled', () => {
      const podContext = manifest.sandbox.spec.podTemplate.spec.securityContext;
      expect(podContext.runAsNonRoot).toBe(true);
    });

    it('should mount /sandbox and /tmp as writable volumes', () => {
      const container = manifest.sandbox.spec.podTemplate.spec.containers[0];
      const mountPaths = container.volumeMounts.map((m) => m.mountPath);
      expect(mountPaths).toContain('/sandbox');
      expect(mountPaths).toContain('/tmp');
    });
  });

  describe('edge cases', () => {
    it('should validate endpoint hosts', () => {
      expect(() => {
        stepSandboxManifest(networkStep, {
          endpointsByStep: { 'network-step': [{ host: 'invalid host!', port: 443 }] },
        });
      }).toThrow(/invalid endpoint/);
    });

    it('should validate endpoint ports', () => {
      expect(() => {
        stepSandboxManifest(networkStep, {
          endpointsByStep: { 'network-step': [{ host: 'example.com', port: 70000 }] },
        });
      }).toThrow(/invalid endpoint/);
      expect(() => {
        stepSandboxManifest(networkStep, {
          endpointsByStep: { 'network-step': [{ host: 'example.com', port: 0 }] },
        });
      }).toThrow(/invalid endpoint/);
    });
  });
});
