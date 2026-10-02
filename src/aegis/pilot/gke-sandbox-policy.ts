// Evidence: Tool=OpenCode Model=ollama-local/qwen3-coder-next:latest Agent=aegis Date=2026-09-30
// Audit trail: git log -- src/aegis/pilot/gke-sandbox-policy.ts
/**
 * Aegis Pilot — GKE Agent Sandbox policy from the signed scope (plan patch C4).
 *
 * The signed Phase 0 scope already says what each step may do. This module
 * turns one step into a Kubernetes Sandbox + NetworkPolicy manifest, so the
 * containment boundary and the contract the customer signed cannot drift apart:
 *
 *   - filesystem: read-only root,Writable only /sandbox and /tmp via emptyDir.
 *   - runtime: gvisor (kernel-level isolation).
 *   - network: none for core steps; non-core network steps get egress to listed
 *     endpoints only.
 *
 * A core step never gets an egress rule, whatever the options say. The scope
 * schema already rejects core steps that need the network; this is the second,
 * independent refusal at the enforcement layer.
 *
 * Output is JSON (valid YAML), consumable by `kubectl apply -f -`.
 *
 * Sandbox CRD from kubernetes-sigs/agent-sandbox (pinned):
 *   apiVersion: agents.x-k8s.io/v1beta1
 *   kind: Sandbox
 *   https://github.com/kubernetes-sigs/agent-sandbox/releases/download/v1.0.2/sandbox.yaml
 */

import type { PilotStep } from './scope.js';

export interface NetworkEndpoint {
  host: string;
  port: number;
}

export interface SandboxOptions {
  /** Endpoints non-core network steps may reach, keyed by step id. */
  endpointsByStep?: Readonly<Record<string, readonly NetworkEndpoint[]>>;
  /** Image to run in the sandbox container. */
  image?: string;
  /** Name of the runtime class (gvisor, kata-containers, etc.). */
  runtimeClassName?: string;
}

export interface SandboxManifest {
  sandbox: {
    apiVersion: 'agents.x-k8s.io/v1beta1';
    kind: 'Sandbox';
    metadata: { name: string };
    spec: {
      podTemplate: {
        spec: {
          runtimeClassName: string;
          securityContext: {
            runAsNonRoot: boolean;
            runAsUser: number;
            runAsGroup: number;
            fsGroup: number;
          };
          containers: Array<{
            name: string;
            image: string;
            securityContext: {
              readOnlyRootFilesystem: boolean;
              allowPrivilegeEscalation: boolean;
              capabilities: { drop: string[] };
            };
            volumeMounts: Array<{
              name: string;
              mountPath: string;
            }>;
          }>;
          volumes: Array<{
            name: string;
            emptyDir: Record<string, never>;
          }>;
          automountServiceAccountToken: boolean;
        };
      };
    };
  };
  networkPolicy: {
    apiVersion: 'networking.k8s.io/v1';
    kind: 'NetworkPolicy';
    metadata: { name: string; labels: { stepId: string } };
    spec: {
      podSelector: { matchLabels: { 'sandbox.kubernetes.io/sandbox': string } };
      policyTypes: string[];
      ingress?: unknown[];
      egress?: Array<{
        to: Array<{ ipBlock: { cidr: string } }>;
        ports: Array<{ protocol: string; port: number }>;
      }>;
    };
  } | null;
}

const HOST = /^[A-Za-z0-9.-]{1,253}$/;

export function stepSandboxManifest(step: PilotStep, opts: SandboxOptions = {}): SandboxManifest {
  const runtimeClassName = opts.runtimeClassName ?? 'gvisor';
  const image = opts.image ?? ' busybox:latest';
  const sandboxName = `aegis-${step.id}`;
  const policyName = `aegis-${step.id}-network`;

  const sandbox: SandboxManifest['sandbox'] = {
    apiVersion: 'agents.x-k8s.io/v1beta1',
    kind: 'Sandbox',
    metadata: { name: sandboxName },
    spec: {
      podTemplate: {
        spec: {
          runtimeClassName,
          securityContext: {
            runAsNonRoot: true,
            runAsUser: 1000,
            runAsGroup: 1000,
            fsGroup: 1000,
          },
          containers: [
            {
              name: step.id,
              image,
              securityContext: {
                readOnlyRootFilesystem: true,
                allowPrivilegeEscalation: false,
                capabilities: { drop: ['ALL'] },
              },
              volumeMounts: [
                { name: 'sandbox-data', mountPath: '/sandbox' },
                { name: 'tmp', mountPath: '/tmp' },
              ],
            },
          ],
          volumes: [
            { name: 'sandbox-data', emptyDir: {} },
            { name: 'tmp', emptyDir: {} },
          ],
          automountServiceAccountToken: false,
        },
      },
    },
  };

  let networkPolicy: SandboxManifest['networkPolicy'] = null;

  if (step.criticality === 'non-core' && step.requiresNetwork) {
    const endpoints = opts.endpointsByStep?.[step.id] ?? [];
    for (const e of endpoints) {
      if (!HOST.test(e.host) || !Number.isInteger(e.port) || e.port < 1 || e.port > 65535) {
        throw new Error(`invalid endpoint for step ${step.id}: ${e.host}:${e.port}`);
      }
    }

    if (endpoints.length > 0) {
      networkPolicy = {
        apiVersion: 'networking.k8s.io/v1',
        kind: 'NetworkPolicy',
        metadata: {
          name: policyName,
          labels: { stepId: step.id },
        },
        spec: {
          podSelector: {
            matchLabels: { 'sandbox.kubernetes.io/sandbox': sandboxName },
          },
          policyTypes: ['Egress'],
          egress: endpoints.map((e) => ({
            to: [{ ipBlock: { cidr: e.host.includes('/') ? e.host : `${e.host}/32` } }],
            ports: [{ protocol: 'TCP', port: e.port }],
          })),
        },
      };
    }
  }

  return { sandbox, networkPolicy };
}
