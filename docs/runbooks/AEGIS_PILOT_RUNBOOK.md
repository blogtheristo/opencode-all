# Aegis Pilot Runbook — DWS-AEGIS-PILOT-001

# VERSION AND AGENT HISTORY

---

Version: 1.5 [Latest]

Sessions & Modifications:

- Version: 1.5 [Latest] | Tool: Claude Code (web) | Session: claude/dws-iq7-aegis-research-lwqxgw | Date: 29.09.2026 | Changes: Readiness plan C5, HIC 28.09.2026. Operator decisions on recommendations (§5.1): `decide` (operator, sign and queue only), `drain-decisions` (site), `outcome` and `journey`; the `decide/` inbox; `--role` on `issue-operator`; the `advisory` scope flag. | Harness: Claude Code + CLAUDE.md + DWS_SECURITY_STANDARD | HIC-approved-drift: none
- Version: 1.4 [not latest] | Tool: Claude Code | Session: claude/magical-hawking-3gx6fv | Date: 29.09.2026 | Changes: New §6.1 step 6 policy proof (`prove`, `--openshell-prover`, `containment.proof` in the record). New §6.2 M4 checklist for the DGX Spark with `physical-disconnect` (HIC 29.09.2026). Ledger segments and retention (readiness plan patch C2): §2 layout, new §4 "Ledger segments and retention" with `seal` / `segments` / `prune`, §8 whole-ledger bullet covers sealed segments. | Harness: Claude Code + CLAUDE.md + DWS_ARTICLE_12_LOGGING_STANDARD + DWS_SECURITY_STANDARD | HIC-approved-drift: none
- Version: 1.3 [not latest] | Tool: Claude Code | Session: claude/aegis-pilot-implementation-03ist6 | Date: 29.09.2026 | Changes: §6.1 step 5: core-step egress probe (`scripts/aegis-pilot-egress-probe.sh`) for the site's IT; worker-mode limit stated. | Harness: Claude Code + CLAUDE.md + DWS_SECURITY_STANDARD | HIC-approved-drift: none
- Version: 1.2 [not latest] | Tool: Claude Code | Session: claude/aegis-pilot-openshell-03ist6 | Date: 28.09.2026 | Changes: OpenShell containment (C4): §6.1 rehearsal setup verified against a real gateway; §8 states what the sandbox stop proves and its measured latency. | Harness: Claude Code + CLAUDE.md + DWS_SECURITY_STANDARD | HIC-approved-drift: none
- Version: 1.1 [not latest] | Tool: Claude Code | Session: claude/aegis-pilot-implementation-03ist6 | Date: 28.09.2026 | Changes: Hard stop (readiness plan patch C1): steps and the stop-test agent run in terminable worker threads by default; §8 rewritten; acceptance refuses the cooperative stop. | Harness: Claude Code + CLAUDE.md + DWS_SECURITY_STANDARD | HIC-approved-drift: none
- Version: 1.0 [not latest] | Tool: Claude Code | Session: claude/aegis-pilot-implementation-03ist6 | Date: 28.09.2026 | Changes: Created. Operator runbook for the local-first pilot kit (`src/aegis/pilot/`, `scripts/aegis-pilot.ts`): one section per pilot phase in `Store/PRODUCT_AEGIS_PILOT.md`, each exit gate mapped to a command and the evidence it produces. | Harness: Claude Code + CLAUDE.md + DWS_ARTICLE_12_LOGGING_STANDARD + DWS_SECURITY_STANDARD | HIC-approved-drift: none

Document Status:

- Created: 28.09.2026
- Last Modified: 29.09.2026
- Language: English
- Publication Status: ACTIVE (internal delivery reference)
- Classification: INTERNAL
- Owner: Lifetime Oy — Aegis & KYA Team

---

## 1. What the kit is

The commercial promise is in `Store/PRODUCT_AEGIS_PILOT.md`. This runbook covers how it is delivered. Every exit gate there maps to a command here, and each command leaves evidence that a third party can check without calling us.

| Pilot requirement                             | Implementation                                                                                         | Evidence it leaves                                                     |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| 1. Local execution, local evidence            | `workflow-runner.ts` + `evidence-ledger.ts` — append-only JSONL, fsync per event, hash-chained, signed | `<state>/ledger/article12.jsonl`                                       |
| 2. Local identity, logs, kill authority       | `identity.ts` (Ed25519 site authority) + `kill-authority.ts` (signed stop commands, local inbox)       | `site/site.json`, `credentials/*.json`, `human.override` ledger events |
| 3. No network dependency for the core outcome | Phase 0 criticality classification; scope validation rejects a core step that needs the network        | Validated scope; `workflow.complete` event with the uplink down        |
| 4. Cloud only for optional sync               | Non-core network steps are deferred to `outbox/deferred.jsonl`, replayed on reconnect                  | `system.degraded` and `system.reconcile` events                        |
| 5. Graceful degradation, specified in advance | `reconciliationOrder` in the signed scope; the runner enforces it                                      | Scope digest in every acceptance record                                |
| Binary KPI (i)(ii)(iii)                       | `acceptance.ts` — egress probed before, during and after; verdict computed from the ledger             | `acceptance/<recordId>.json`, signed with the site key                 |

Nothing in the kit opens a socket except the uplink probe (which must fail) and the customer's own non-core sync handler (which is deferred while the uplink is down).

## 2. State directory layout

```
<state>/
  site/site.key          Ed25519 site authority private key (0600) — never leaves the site
  site/site.json         site id, key id, public key — the only trust anchor verifiers need
  site/revoked.json      local revocation list
  credentials/*.json     agent and operator credentials issued by the site authority
  ledger/article12.jsonl the Article 12 record (one signed, chained event per line) — the active segment
  ledger/segments/       sealed segments NNNNNN.jsonl and their signed NNNNNN.seal.json
  kill/                  stop-command inbox; kill/processed, kill/rejected
  decide/                decision-command inbox; decide/processed, decide/rejected
  outbox/deferred.jsonl  non-core work waiting for reconnect
  acceptance/*.json      signed acceptance records (rehearsal and acceptance)
```

Put `<state>` on a local disk. The acceptance test fails condition (ii) if the ledger sits on NFS, SMB/CIFS, Ceph, AFS or GPFS. It also fails on FUSE or 9p, because the kit cannot prove where those store data.

## 3. Phase 0 — scoping (weeks 0–2)

1. Copy `config/aegis-pilot/reference-scope.json` and fill it in with the customer:
   - `workflow.steps[]`: classify every step as `core` or `non-core` and mark `requiresNetwork` honestly.
   - `workflow.completionState`: "complete" in the workflow owner's own words.
   - `isolation.method`: choose from the ladder. `physical-disconnect` is strongest, followed by `router-deny-all`, `vlan-isolation` and `host-egress-block`. `enforcedBy` must name the customer's administrator.
   - `isolation.egressProbes`: the customer's real cloud endpoints, plus two public anycast addresses. If the customer firewall rejects rather than drops, set `rejectCountsAsBlocked: true` on the relevant targets. That setting ends up in the record.
   - `acceptance.conditions`: the three conditions written in the customer's operational language.
   - `reconciliationOrder`: every non-core network step, in replay order.
2. Validate the scope:

   ```bash
   npm run aegis:pilot -- validate-scope --scope customer-scope.json
   ```

   If a core step needs the network, validation fails. That is the Phase 2 fail condition surfacing at week 2.

3. **Exit gate:** add `signoff` (customer signatory, Lifetime signatory, `signedAt`) and validate again. The warning "not signed off" must be gone.

## 4. Phase 1 — local substrate (weeks 3–5)

On the customer host or edge appliance:

```bash
npm run aegis:pilot -- init --state-dir /var/lib/aegis-pilot --site-id <site-id> --org-id <org>
npm run aegis:pilot -- issue-operator --state-dir /var/lib/aegis-pilot \
  --name "<operator name>" --key-out /home/<operator>/.aegis/operator.key
```

The operator key must live outside the state directory, and the CLI refuses to write it inside. It belongs to the operator, not to the site.

**Pin the site key.** `init` prints a `keyId`. Write it into the scope as `site.keyId` and include it in the Phase 0 signoff; the customer keeps a copy. A run refuses a site key that does not match the pin. `verify --expect-key-id <keyId>` gives an auditor the same check. The state directory holds the site private key. Anyone who can replace that key could otherwise re-sign a forged history that verifies against itself. The pin, held outside the directory, is the anchor that catches this.

**Ownership.** Run the kit as a dedicated service user that owns the state directory (mode 0700). Operators get no write access to it. Their stop commands reach it through the CLI, which only drops signed files into `kill/`.

**Exit gate: the four locals, with the uplink already down.** Run the reference workflow as a rehearsal under the agreed isolation method:

```bash
npm run aegis:pilot -- run --state-dir /var/lib/aegis-pilot \
  --scope config/aegis-pilot/reference-scope.json --kind rehearsal \
  --operator-credential /var/lib/aegis-pilot/credentials/<id>.json \
  --operator-key /home/<operator>/.aegis/operator.key
```

`PASS` means an agent ran, was identified, wrote a record and was stopped, all without a network. A failure at this stage is a platform finding, reported at week 5.

**Linux quick proof (host-egress-block, no firewall change needed):**

```bash
npm run aegis:pilot:rehearse-isolated
```

This runs the rehearsal inside a fresh network namespace (`unshare --net`), with no interfaces, routes or DNS. It then reconciles with the uplink restored and verifies the record.

### Ledger segments and retention

The active ledger is sealed and rolled so that retention can be honoured without breaking the hash chain (`src/aegis/pilot/ledger-segments.ts`).

```bash
npm run aegis:pilot -- seal --state-dir /var/lib/aegis-pilot                    # rolls at 64 MiB or 30 days; --force to roll now
npm run aegis:pilot -- segments --state-dir /var/lib/aegis-pilot --expect-seal <digest> # verifies every segment, seal and link; exit 4 on failure
npm run aegis:pilot -- prune --state-dir /var/lib/aegis-pilot                   # lists expired segments, the clock used and a confirm token
npm run aegis:pilot -- prune --state-dir /var/lib/aegis-pilot --confirm <token> # deletes exactly that list
```

- **Chaining.** A sealed segment ends in a `system.segment_seal` event. Its seal records the file hash, the head hash and the digest of the previous seal, and is signed by the site key. The next segment's genesis event carries `prev_segment` (index, head hash, seal digest). Removing, editing or reordering a segment, or replacing the active ledger with a fresh chain, fails `segments`.
- **Retention (Article 12 Logging Standard §4).** Routine events (`agent.decide`, `tool.invoke`, heartbeats, probes, workflow events) are kept 6 months. Stops (`human.override`), terminations, acceptance records, incidents and prune records are kept 5 years, and so is any event type not on the 6-month list. A segment is kept until its last event plus its longest class.
- **Anchor every seal.** `seal` prints an `anchor` (index, head hash, seal digest). Copy the seal digest to the customer's own records, as with the ledger head hash. `segments --expect-seal <digest>` then also catches a rollback of the newest segments, which the state directory alone cannot show (§8).
- **Pruning is an operator act.** It never runs on a timer. The first call lists the expired segments, the clock it used and a confirm token; only `--confirm <token>` deletes, and only that list. Check the clock before confirming. It refuses a chain that does not verify and a clock behind the newest ledger event, keeps the seal, and writes a `system.segment_pruned` event before deleting.
- **Interrupted rolls.** A crash during `seal` leaves the active path intact. `segments` reports "interrupted roll", and the next `seal` completes it without creating a new seal. If the customer's sector law requires longer retention (CSRD, NIS2, CER), do not prune those segments.
- **Seal between runs, not during them.** `seal` refuses while a run holds the ledger lock. The acceptance window's gap check covers the active segment, so seal before the acceptance window opens.

## 5. Phase 2 — workflow integration (weeks 6–9)

Write one handler per step in a module that exports `createRegistry(options)`, or a `registry` constant, returning a `HandlerRegistry`. Under the hard stop, the module is loaded inside each step's worker thread and never in the main process. Step input and output cross the thread boundary by structured clone, so they must be plain data. `src/aegis/pilot/reference-workflow.ts` is the template:

- Each handler receives `{ signal, state, step, traceId, uplinkDown }` and returns `{ output, decision, confidence, modelVersion }`.
- Honour `signal` when running cooperatively. Under the default hard stop, the operator's stop terminates the step's thread whether or not the handler listens.
- `decision` is one line for the Article 12 record, with no personal data. Raw outputs are never logged; only their digests are.
- A handler that cannot reach the network throws `NetworkUnavailable`. On a non-core step the runner defers it. On a core step the run fails with the Phase 2 finding.
- Source-system access is read-only.

Run it online first. That is the exit gate: the workflow completes and its owner accepts the record.

```bash
npm run aegis:pilot -- run ... --handlers ./customer-handlers.mjs --kind rehearsal ...
```

### 5.1 Operator decisions on recommendations (readiness plan C5)

The first workflow is advisory (HIC 28.09.2026). The agent recommends, the operator decides, and no step actuates equipment. The operator's decision is a ledger event, not a note, so the pilot also yields the first decision journey: recommendation → decision → outcome.

- **Recommendation.** Mark the step `"advisory": true` in the signed scope. Its `agent.decide` event is then a recommendation (`PATH_RECOMMENDED`) with no decision-maker. The marker comes from the scope, never from the handler, so an agent cannot choose what counts toward coverage. The reference scope marks `decide-actions`.
- **Decision-maker.** Issue the operator with a role: `issue-operator ... --role shift-supervisor`. The role grants `decision.record`, and it is recorded as `decision_by`. Use a role, never a name. The operator's identity is the credential's key id; the customer keeps the mapping from that id to a person.
- **Decision.** The operator signs accept, reject or defer against the recommendation's `seq` and `event_hash`, both of which `journey` prints. It is recorded as `human.decide` and works with the uplink down:

  ```bash
  npm run aegis:pilot -- journey --state-dir <state>
  npm run aegis:pilot -- decide --state-dir <state> --seq N --hash H --verdict accept \
    --reason "checked against load forecast" --operator-credential <cred> --operator-key <key>
  ```

  `decide` only signs the command and drops it into `decide/`, like `stop`. It never loads the site key. The site process that owns the ledger records it: a running `run` does so within 200 ms, and outside a run the site runs `npm run aegis:pilot -- drain-decisions --state-dir <state>` before the `recordBy` time printed by `decide` (10 minutes). `drain-decisions` exits 2 only while a run holds the ledger; any other ledger problem is an error.

  A decision is refused if the hash does not match the seq, if the event is not a recommendation, if the recommendation already has a final decision (a defer may be followed by a final decision), if the same command was already recorded (checked against the ledger, not only `decide/processed/`), or if the recommending agent was stopped after the recommendation (the path is then abandoned). `--reason` goes into the permanent record: write the operational reason, never personal data.

- **Outcome.** After an accept, the site records what followed. Metrics are numbers only, and `--evidence-ref` is an identifier or URI, not free text:

  ```bash
  npm run aegis:pilot -- outcome --state-dir <state> --decision-seq N --decision-hash H \
    --result positive --metrics '{"eur_estimated":142.5,"kwh_shifted":1800}' --evidence-ref meter-export-0311
  ```

- **Pilot number (report D7).** `journey` prints `coverage`: complete paths divided by recommendations. A path is complete when it is rejected, abandoned, or accepted with an outcome. It also prints the median operator time from recommendation to decision.

## 6. Phase 3 — severed-uplink acceptance (weeks 10–11)

1. **Rehearsal** under a short window, using `--kind rehearsal`. Fix what it finds.
2. **Acceptance**, with the customer's administrator applying the signed isolation method:

   ```bash
   npm run aegis:pilot -- run --state-dir /var/lib/aegis-pilot --scope customer-scope.json \
     --handlers ./customer-handlers.mjs --kind acceptance --await-operator --timeout-s 600 \
     --witness "<name, role, organisation>" --hold
   ```

   - The run probes egress first. If anything answers, the record says `NOT_TAKEN` and no test was taken.
   - `--hold` keeps the heartbeat and the periodic probes running until the agreed window ends. If any probe gets through, the record says `INVALID`.
   - When the stop-test agent starts, the CLI prints its id. **The customer's operator** stops it from their own terminal:

     ```bash
     npm run aegis:pilot -- stop --state-dir /var/lib/aegis-pilot --agent <agent-id> \
       --operator-credential <their credential> --operator-key <their key> --reason "acceptance stop"
     ```

   - Acceptance mode refuses an automated stop, refuses the cooperative stop, and refuses to run without a named witness.

3. **Verdict.** `PASS` only if (i), (ii) and (iii) all hold. Any other combination is `NEGATIVE_RESULT`, which is a valid outcome. Exit codes are 0 for PASS, 2 for NEGATIVE_RESULT and 3 for NOT_TAKEN or INVALID.
4. **Reconnect** and replay the deferred work in the specified order:

   ```bash
   npm run aegis:pilot -- reconcile --state-dir /var/lib/aegis-pilot --scope customer-scope.json --handlers ./customer-handlers.mjs
   ```

5. **Verify**. Anyone holding `site/site.json` can do this, including the customer's auditor:

   ```bash
   npm run aegis:pilot -- verify --state-dir /var/lib/aegis-pilot --record /var/lib/aegis-pilot/acceptance/<recordId>.json
   ```

6. **Who held decision authority, and what followed.** The acceptance record carries an `authority` section, and the same view can be built at any time from the ledger:

   ```bash
   npm run aegis:pilot -- authority --state-dir /var/lib/aegis-pilot --scope customer-scope.json [--agent <agent-id>]
   ```

   For each agent it shows:
   - the grant: credential, capabilities, and the signed scope it was granted under, with both signatories when the scope matches;
   - the decisions it made;
   - what followed: completed, failed, deferred and later reconciled, or stopped;
   - for a stopped agent: which operator stopped it, when and why, and proof that it did no further work afterwards.

   The record is derived only from the verified ledger. The build refuses a ledger that does not verify. The ledger itself stays pseudonymous; names are resolved from the credentials and scope held on the customer's host.

### 6.1 With OpenShell containment (C4)

Each step, and the stop-test agent, runs in its own NVIDIA OpenShell sandbox. The sandbox policy is generated from the signed scope, and core steps get no network. Verified against a real gateway on 28.09.2026 (field note `2026-09-28-nvidia-openshell-aegis-c4.md` §5).

1. **Gateway** on the site host, Docker compute driver, telemetry off (`OPENSHELL_TELEMETRY_ENABLED=false`). Generate the PKI and JWT bundle once with `openshell-gateway generate-certs --output-dir <dir>`. In the gateway TOML, set `[openshell.gateway.gateway_jwt]` (`signing_key_path`, `public_key_path`, `kid_path`, `gateway_id`); Docker sandboxes refuse to start without it. Pin the supervisor image and `image_pull_policy` so nothing is pulled during the pilot.
2. **Workload image** (the `--image` value) needs: a node binary at `/usr/local/bin/node`, a default command (the driver creates a container to read `/etc/passwd`), `/tmp` with mode 1777, `/sandbox`, and a `sandbox` user in `/etc/passwd`.
3. **Rehearsal:** `AEGIS_CONTAINMENT=openshell AEGIS_IMAGE=<image> AEGIS_OPENSHELL_CLI=<path> scripts/aegis-pilot-isolated-rehearsal.sh`. The run is inside `unshare --net` and reaches the gateway through one Unix-socket bridge (`scripts/aegis-pilot-gateway-bridge.mjs`); nothing else leaves the namespace. On a customer site the gateway runs on the same host, so no bridge is needed.
4. **Direct run:** `npm run aegis:pilot -- run … --containment openshell --image <image> --openshell-cli <path>` with `OPENSHELL_GATEWAY_ENDPOINT` set.
5. **Core-step egress probe (Phase 1, the site's IT runs it):** `AEGIS_IMAGE=<image> AEGIS_OPENSHELL_CLI=<path> scripts/aegis-pilot-egress-probe.sh [host:port …]`, passing the site's own targets (proxy, ERP, historian). A plain container of the same image is the control and must reach something; the sandbox with the core-step policy must reach nothing over TCP, UDP or IPv6, and its DNS answers are local synthetic addresses that are never resolved upstream. Exit 0 = PASS. Verified 29.09.2026 against the real gateway. Without OpenShell (worker threads), core steps share the host process's network: the "no network" statement then holds only if the site administrator blocks host egress, and the acceptance record names the containment mode.
6. **Policy proof (C4).** Build NVIDIA's standalone checker (`cargo build --release -p openshell-prover-cli`) and run `npm run aegis:pilot -- prove --scope <scope> --openshell-prover <path>`. For every step and the stop-test agent it checks that the generated sandbox policy stays inside a boundary written separately from the generator: core steps no network, non-core steps only their listed endpoints. Only `within_boundary` passes; `exceeds_boundary` comes with a counterexample. Pin the binary: record its `sha256sum` when you build it and pass `--expect-prover-sha256 <hash>`; the kit executes a private copy of exactly the bytes it hashed. Pass `--openshell-prover <path> --expect-prover-sha256 <hash>` to `run` as well: the proof then goes into the signed acceptance record (`containment.proof`). An acceptance run under OpenShell refuses a missing, failed or unpinned proof, and the verdict is re-derived from the steps, never taken from a flag. After the run, each step's recorded sandbox policy digest must equal the proven one, or the record is `INVALID`. A rehearsal without a proof gets a finding. Limits: for non-core steps the boundary is the operator's endpoint list, not a list in the signed scope (the CLI configures none today, so every step has no network); the stop-test agent's runtime policy digest is not recorded, but it is built by the same function with the same options as the proven one. Verified 29.09.2026 with the real prover (`cfcc373`): all six reference policies `within_boundary`; a core-step policy with a network rule `exceeds_boundary`.

### 6.2 M4 — witnessed staging acceptance on the DGX Spark (HIC 29.09.2026)

The HIC decided on 29.09.2026 that M4 runs on the DGX Spark with `isolation.method: physical-disconnect`, and that no router deny-all is needed. The HIC removes the uplink cable and disables Wi-Fi, which is the strongest rung, and is applied by someone other than the system under test. Target 25.10.2026, P80 08.11.2026 (readiness plan H3).

**Before the day (build and rehearse):**

1. **OpenShell for arm64.** Build from source on the Spark without telemetry, at the commit pinned in field note `2026-09-28-nvidia-openshell-aegis-c4.md` §5: `cargo build --release --no-default-features`. Also build the policy prover (`cargo build --release -p openshell-prover-cli`). Record both commit hashes in the scope notes.
2. **Images are arm64.** Build the supervisor image and the workload image locally for `linux/arm64` (§6.1 step 2). Pin them and set the pull policy so nothing is pulled during the window. Check with `docker image inspect --format '{{.Architecture}}' <image>`, which must print `arm64`.
3. **Fresh state directory.** The Spark is also the development machine. `init` a new state directory for M4 only, pin its `keyId` in the scope, and write the key id on paper for the witness. Issue the HIC's operator credential with the key outside the state directory.
4. **Scope.** Copy the reference scope and set `isolation.method` to `physical-disconnect`, `enforcedBy` to the HIC's name and role, and `egressProbes` to at least one public address, `dws10.com` and the site's own default gateway. Run `validate-scope`.
5. **Probes, proof and rehearsals.** Run `prove` (§6.1 step 6), which must print `ok: true`. Run the egress probe (§6.1 step 5) with the cable still connected (control must reach, the sandbox must not), then the isolated rehearsal (§6.1 step 3), then one rehearsal with the cable actually removed. All three must pass before the witnessed run is booked.
6. **Seal before the window.** Run `seal --force` so the acceptance window sits in a fresh segment, and write the printed `anchor.sealDigest` on the witness sheet (§4 "Ledger segments and retention").

**On the day (witnessed run):**

7. The HIC unplugs the uplink cable and disables Wi-Fi, then confirms by running `probe --scope <scope>`, which must report `isolated: true`.
8. Run the acceptance command from §6 with `--containment openshell`, `--openshell-prover <path>`, `--await-operator`, `--witness "<name, role, organisation>"` and `--hold`. The HIC stops the stop-test agent from their own terminal with their own credential when the CLI prints its id.
9. Record on the witness sheet: the outcome, the record id, the ledger head hash, the `authority` summary for the stopped agent, and the time the cable was reconnected.
10. Reconnect, then run `reconcile`.

**After the day (independent verification):**

11. Run `verify --record <record> --expect-key-id <pinned key id>` and `segments --expect-seal <sealDigest>` on the Spark.
12. **Second machine.** Copy the evidence to a machine that has never held the site key and verify it there. Until loop task A2 (`export` / `verify-bundle`) is merged, copy `site/site.json`, `ledger/` (active and `segments/`) and `acceptance/` only, never `site/site.key`, and run `verify` and `segments` against that copy. After A2, use `export` and `verify-bundle --expect-key-id`.
13. File the witness sheet, the record, and both verification outputs in a field note. A `NEGATIVE_RESULT` is filed the same way; it is a valid outcome and is not rerun away.

### How each condition is judged

| Condition                     | Pass rule (computed, not asserted)                                                                                                                           |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| (i) workflow completes        | Run status `completed` and every core step `done`, with `uplinkDown: true`                                                                                   |
| (ii) evidence local, no gap   | The ledger chain verifies, every event carries a valid site signature, no interval in the window exceeds `maxGapMs`, and the ledger is on a local filesystem |
| (iii) operator stops an agent | The stop-test agent aborted, an accepted `human.override` names it, and the ledger holds **no event from that agent after the override**                     |

## 7. Phase 4 — sizing and report (weeks 12–13)

The acceptance record provides the measured inputs: per-step `durationMs`, events in the window, stop latency and the deferred-work volume. The sizing report cites the record id and its signature. It does not reproduce the numbers without a source.

### Nightly rehearsal

Every night the `opencode/aegis-pilot-nightly-rehearsal` worktree runs `scripts/daily/aegis-pilot-rehearsal.sh` as a cron job on DGX Spark. It executes a fresh isolated rehearsal (`scripts/aegis-pilot-isolated-rehearsal.sh`) in a throwaway state directory, records the JSON verdict in `logs/aegis-pilot-rehearsal.jsonl`, and alerts on any outcome other than `PASS`. This provides an always-on sentinel for the pilot platform's health.

## 8. What the kit does not prove

This section follows Rule 12 (fail loud).

- **Stops are hard by default (since v1.1).** `run` executes every step in its own worker thread. An operator stop terminates that thread: V8 halts it wherever it is, including in a synchronous busy loop, and drops its pending callbacks. The main thread never runs handler code, so it keeps writing the ledger and reading the kill inbox. The stop-test agent is deliberately stubborn: a busy loop that never checks a signal. A PASS therefore shows the agent was stopped, not that it agreed to stop. The record carries `stopMode`, `terminationMs` and `lateMessages`, and `lateMessages` must be 0.
- **With `--containment openshell`, a stop deletes the sandbox.** It counts only when the gateway reports the sandbox gone. Measured in rehearsal: about 5.2 s, because the stubborn agent ignores SIGTERM and the container is killed after the grace period. During that window the agent cannot write to the host (outputs are copied back only when no stop was accepted), core steps have no network, and the ledger refuses its work. The record carries `terminationMs`.
- **Sandbox output is untrusted and bounded.** A step result must be exactly one `AEGIS_RESULT` line; the step runner exits as soon as it is written, and two lines fail the step. Captured output is capped (8 MiB by default), files handed back through `/sandbox/out` are capped at 32 MiB, and a returned path outside `/sandbox/out` fails the step. Each sandbox gets memory and CPU limits (default 1 GiB, 1 CPU) recorded in the containment evidence. Disk use inside `/sandbox` and `/tmp` is not capped by the policy; size the host disk accordingly.
- **A stop is proven by absence, not by an error message.** After `sandbox delete`, the stop counts only when a successful `sandbox list` no longer contains the sandbox. A failed or unparsable listing leaves the stop unproven, and condition (iii) fails.
- **What termination does not reach.** It cannot undo a write the handler already handed to the OS before the stop, or an action another system took on the handler's request. Handlers still get their Phase 2 review for side effects they never log.
- **`--stop-mode cooperative` is for rehearsals only.** It runs handlers in-process. A handler that ignores `signal` finishes its current call, and one that spins synchronously blocks the whole runtime, including the kill inbox. Acceptance runs refuse this mode.
- **`host-egress-block` proves the workload, not the site boundary.** Every record states the rung of the isolation ladder that was used.
- **A hash chain plus a site signature proves integrity against anyone without the site key.** It does not protect against the key holder. For evidence that must survive the site itself, copy the ledger head hash to the customer's own records at the end of the window. The record prints it for that purpose.
- **Deferred work is signed too.** Outbox entries carry a site signature. `reconcile` quarantines any entry that fails verification to `deferred.jsonl.quarantine` and records an `incident`; it never replays it.
- **Condition (ii) checks the whole ledger, not just the window.** Chain validity and signatures are checked from the active segment's genesis, and a broken chain blocks every later run. Sealed segments are checked by `segments` and refuse `prune` when they do not verify. Someone who can write the state directory but lacks the site key cannot forge history, but can roll back the newest segments; only the seal digest anchored outside the directory (`--expect-seal`) detects that. This is deliberate: you do not append to evidence known to be tampered with. Gap detection is scoped to the window. After an investigated incident, start a new state directory; never repair the old one.
- **Local model serving and hardware sizing** are site-specific Phase 1 and Phase 4 work. The kit does not include them.

## 9. Related

- `Store/PRODUCT_AEGIS_PILOT.md` — the offer and the phases
- `DWS_ARTICLE_12_LOGGING_STANDARD.md` §3 — the event schema the ledger follows
- `docs/field-notes/2026-09-28-aegis-pilot-local-first-kit.md` — build notes and open decisions
- `src/__tests__/aegis-pilot.test.ts` — the promises above, as tests

---

**Document version:** v1.1 · **Date:** 28.09.2026 · **Owner:** Lifetime Oy
© 2026 Lifetime Oy (Y-tunnus 0772407-9). All rights reserved.
**Business Confidential.**
