// Evidence: Tool=Claude Code Model=anthropic Agent=claude Date=2026-09-29
// Audit trail: git log -- src/aegis/pilot/openshell-policy.ts
/**
 * Aegis Pilot — OpenShell sandbox policy from the signed scope (plan patch C4).
 *
 * The signed Phase 0 scope already says what each step may do. This module
 * turns one step into an OpenShell policy (policy schema v1, NVIDIA/OpenShell
 * crates/openshell-policy-schema), so the containment boundary and the
 * contract the customer signed cannot drift apart:
 *
 *   - filesystem: system paths read-only; only /sandbox (the uploaded step
 *     bundle and its output directory) and /tmp are writable.
 *   - Landlock: hard_requirement. A host without Landlock fails closed; it
 *     never silently runs an unconfined step.
 *   - network: none, unless the step is declared non-core AND requiresNetwork.
 *     Such a step may reach only the endpoints the operator lists for it, and
 *     only from the node binary.
 *
 * A core step never gets a network rule, whatever the options say. The scope
 * schema already rejects core steps that need the network; this is the second,
 * independent refusal at the enforcement layer.
 *
 * Output is JSON (valid YAML), accepted by `openshell sandbox create --policy`.
 */

import type { PilotStep } from './scope.js';

export interface NetworkEndpoint {
  host: string;
  port: number;
}

export interface OpenShellPolicyOptions {
  /** Endpoints non-core network steps may reach, keyed by step id. */
  endpointsByStep?: Readonly<Record<string, readonly NetworkEndpoint[]>>;
  /** Path of the node binary inside the sandbox image. */
  nodeBinary?: string;
}

export interface OpenShellPolicy {
  version: 1;
  filesystem_policy: { include_workdir: boolean; read_only: string[]; read_write: string[] };
  landlock: { compatibility: 'hard_requirement' };
  network_policies: Record<
    string,
    {
      name: string;
      endpoints: Array<{ host: string; port: number }>;
      binaries: Array<{ path: string }>;
    }
  >;
}

const HOST = /^[A-Za-z0-9.-]{1,253}$/;

/**
 * Hosts a step must never be allowed to reach, whatever the operator lists:
 * the sandbox's own host, the gateway, the cloud metadata service and the
 * site's private network are not "the customer's archive endpoint".
 */
function internalHost(host: string): boolean {
  const h = host.toLowerCase().replace(/\.$/, '');
  if (h === 'localhost' || /\.(localhost|local|internal|lan|home\.arpa)$/.test(h)) return true;
  // Numeric hosts must be a canonical dotted quad. Octal (0177.0.0.1), hex (0x7f.0.0.1),
  // shortened (127.1) and integer (2130706433) spellings resolve to loopback or metadata
  // under inet_aton, so any other all-numeric or 0x-labelled host is refused as internal
  // (security review 30.09.2026, M1).
  const labels = h.split('.');
  const numericish = labels.every((l) => /^(0x[0-9a-f]*|\d+)$/.test(l));
  const canonical = /^(0|[1-9]\d{0,2})(\.(0|[1-9]\d{0,2})){3}$/.test(h);
  if (numericish && !canonical) return true;
  if (labels.some((l) => /^0x/.test(l))) return true;
  const m = /^(\d{1,3})\.(\d{1,3})\.\d{1,3}\.\d{1,3}$/.exec(h);
  if (!m) return false;
  if ([...h.split('.')].some((o) => Number(o) > 255)) return true;
  const [a, b] = [Number(m[1]), Number(m[2])];
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 192 && b === 0) ||
    (a === 198 && (b === 18 || b === 19)) ||
    a >= 224
  );
}

export function stepPolicy(step: PilotStep, opts: OpenShellPolicyOptions = {}): OpenShellPolicy {
  const policy: OpenShellPolicy = {
    version: 1,
    filesystem_policy: {
      include_workdir: false,
      read_only: ['/bin', '/usr', '/lib', '/lib64', '/etc', '/proc', '/dev/urandom'],
      read_write: ['/sandbox', '/tmp', '/dev/null'],
    },
    landlock: { compatibility: 'hard_requirement' },
    network_policies: {},
  };
  if (step.criticality !== 'non-core' || !step.requiresNetwork) return policy;

  const endpoints = opts.endpointsByStep?.[step.id] ?? [];
  for (const e of endpoints) {
    if (
      !HOST.test(e.host) ||
      internalHost(e.host) ||
      !Number.isInteger(e.port) ||
      e.port < 1 ||
      e.port > 65535
    ) {
      throw new Error(`invalid endpoint for step ${step.id}: ${e.host}:${e.port}`);
    }
  }
  if (endpoints.length > 0) {
    policy.network_policies[`aegis_${step.id.replace(/-/g, '_')}`] = {
      name: `aegis-${step.id}`,
      // Plain L4 endpoints. `enforcement` is an L7 (REST) setting; on an L4 rule it
      // has no effect and makes the policy unprovable (openshell-prover:
      // "mixes REST controls into L4 authority"), so it is not emitted.
      endpoints: endpoints.map((e) => ({ host: e.host, port: e.port })),
      binaries: [{ path: opts.nodeBinary ?? '/usr/local/bin/node' }],
    };
  }
  return policy;
}
