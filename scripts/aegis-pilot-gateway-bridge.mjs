#!/usr/bin/env node
// Evidence: Tool=Claude Code Model=anthropic Agent=claude Date=2026-09-28
// Audit trail: git log -- scripts/aegis-pilot-gateway-bridge.mjs
/**
 * Rehearsal-only bridge: lets the pilot CLI inside an isolated network
 * namespace (`unshare --net`) reach the local OpenShell gateway, and nothing
 * else. On a real site the gateway runs on the same host and severing the
 * uplink leaves loopback intact, so this bridge is not used there.
 *
 *   host side:  node aegis-pilot-gateway-bridge.mjs host <socket> <gatewayPort>
 *               (listens on a Unix socket, forwards to 127.0.0.1:<gatewayPort>)
 *   netns side: node aegis-pilot-gateway-bridge.mjs ns <socket> <localPort>
 *               (listens on 127.0.0.1:<localPort> inside the namespace,
 *               forwards to the Unix socket, which the namespace shares)
 *
 * A filesystem socket crosses the network namespace; a TCP route does not.
 * Only this one socket, to this one port, is bridged.
 */

import { createConnection, createServer } from 'node:net';
import { rmSync } from 'node:fs';

const [mode, socketPath, portArg] = process.argv.slice(2);
const port = Number(portArg);
if (!['host', 'ns'].includes(mode) || !socketPath || !Number.isInteger(port) || port <= 0) {
  console.error('usage: aegis-pilot-gateway-bridge.mjs host|ns <socket> <port>');
  process.exit(2);
}

const pipe = (a, connectB) => {
  const b = connectB();
  a.pipe(b).pipe(a);
  const close = () => {
    a.destroy();
    b.destroy();
  };
  a.on('error', close);
  b.on('error', close);
};

if (mode === 'host') {
  rmSync(socketPath, { force: true });
  createServer((c) => pipe(c, () => createConnection({ host: '127.0.0.1', port }))).listen(
    socketPath,
    () => console.error(`bridge: ${socketPath} -> 127.0.0.1:${port}`),
  );
} else {
  createServer((c) => pipe(c, () => createConnection(socketPath))).listen(port, '127.0.0.1', () =>
    console.error(`bridge (netns): 127.0.0.1:${port} -> ${socketPath}`),
  );
}
