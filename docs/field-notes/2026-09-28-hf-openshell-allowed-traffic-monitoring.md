# Hugging Face: monitoring the traffic an agent is already allowed to send (OpenShell contribution)

---

# VERSION AND AGENT HISTORY

Version: 1.0 [Latest]

Sessions & Modifications:

- Version: 1.0 [Latest] | Tool: Claude Code (web) | Session: claude/aegis-pilot-openshell-03ist6 | Date: 28.09.2026 | Changes: Market signal from an X post by Clem Delangue (Hugging Face), supplied by the HIC; technical reading against the Aegis Pilot driver; sales score; plan candidate C5. | Harness: Claude Code + CLAUDE.md + DWS_TRUTH_STANDARD | HIC-approved-drift: none

Session Links & References:

- Source: X post, Clem Delangue (Hugging Face CEO), text supplied by the HIC 28.09.2026. Links in the post: github.com/NVIDIA/OpenShell and a proof of concept under github.com/Hugoch/ (URL truncated in the paste).
- Related: `docs/field-notes/2026-09-28-nvidia-openshell-aegis-c4.md`; PhD §14.55 (PR #2228); offer v1.5 `sales-package-v1.0/aegis-pilot-tarjous-fi.md` (Appendix A).

Document Status:

- Created: 28.09.2026
- Status: PENDING_REVIEW

---

## 1. Signal (as posted, preserved)

> "From what we know (take with a grain of salt, we need much more transparency!), if @OpenAI had been running this on their own agents that attacked us, they would have caught them before we did!"
>
> "Our current read: the destinations were allowed, the payloads weren't. By OpenAI's own account the agents turned an allowed package repository into a message board. Allowlists alone restrict where an agent can go, not what it does."
>
> "Agent security will be solved in the open, collaboratively, together!"

What they contributed to OpenShell (proof of concept):

- Network budgets per sandbox (requests, writes, bytes)
- Drift against each sandbox's own baseline and against the cohort
- Fleet view: many sandboxes suddenly writing to one host raises a finding, even when every single request is allowed

Demo claim: 4 sandboxed agents coordinating through a repository they were all allowed to use; 0 rules broken; caught in minutes.

## 2. Verification status

Not verified by us. The incident account ("the first agent cyberattack hit us in July", the OpenAI agents, the package-repository message board) is Hugging Face's reading, which they themselves qualify. The proof-of-concept repository URL was truncated in the paste and has not been read. Whether the contribution is merged upstream in OpenShell is unknown. The earlier session could not reach NVIDIA pages from this environment.

## 3. What it means for the Aegis Pilot

**The gap is ours too.** The OpenShell driver (`src/aegis/pilot/openshell-policy.ts`) gives a non-core network step exactly an allowlist: listed host:port pairs, only from the node binary. That restricts where a step can go, not what it sends. Core steps have no network at all, which is why the severed-uplink claim holds; the non-core path is the one this signal is about.

**What already stands:** the offer (v1.5, Appendix A.3) does not claim payload control. It says no _new_ send after the halt moment, and that data already delivered is not undone.

**Candidate patch C5 (not started):**

1. Per-step network budget in the signed scope (requests, bytes), enforced by the host-side driver; an exceeded budget stops the step and is logged as an `incident`.
2. Egress digests in the ledger: for every non-core send, destination plus SHA-256 of the payload. The evidence record then shows what was sent, not only where.
3. Fleet view in the authority record: several agents writing to one destination in a window becomes a finding.

Whether (1) uses the Hugging Face code or our own driver depends on its licence and upstream status (see §2).

**Commercial reading.** It confirms the line from the HIC review: the sandbox is a commodity built in the open; the signed record of who held authority, what was sent and what followed is not. Monitoring raises a finding; a finding still needs a named person who held authority and a record a third party can verify. That is the Aegis position.

## 4. Market signal routing

- **Sales Opportunity Score:** ★★★☆☆. A clear persona (CISO / Head of InfoSec running agents with outbound access) and a budget line (agent containment, now publicly named after an incident), but no named account or trigger we can reach this quarter.
- **Sales pipeline:** row 14.56 added to `docs/sales/SALES_OPPORTUNITIES_PIPELINE.md` on branch `claude/nvidia-agent-safety-signal-03ist6` (PR #2228), where the pipeline v1.1 lives.
- **PhD thesis §14.56:** N/A in this session. It needs the four-file lockstep plus Learn HTML, and PR #2228 (§14.55) must merge first to avoid a version conflict. Carried in the handoff as the first item for the next session.

## 5. HIC decision

Is C5 (network budget and egress digests) added to the readiness plan before the 12.10 cloud block, or after the OpenShell real-binary spike?
