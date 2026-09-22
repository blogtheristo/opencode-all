/**
 * Named-ticket ID convention — `<domain>-<businessKey>`. Temporal's own
 * `ActivityOptions.id` doc: "It's recommended to use a meaningful business
 * ID." Every Activity ID and Workflow ID in src/temporal/ is built with
 * this helper so IDs stay both human-readable (an approver or an on-call
 * engineer can read the Temporal UI and know what a job *is* without
 * opening code) and collision-safe across domains (an email idempotency
 * key and a TED notice number could otherwise share a plain string).
 *
 * Zero dependencies on purpose: safe to import from both plain Node code
 * (activities, client-side starters) AND Temporal Workflow code, which runs
 * in a deterministic sandbox that rejects modules pulling in real I/O
 * (e.g. `@temporalio/client`'s gRPC client, which `standalone.ts` and
 * `client.ts` import — never import those from a `*.workflow.ts` file).
 */
export function ticketId(domain: string, businessKey: string): string {
  return `${domain}-${businessKey}`;
}
