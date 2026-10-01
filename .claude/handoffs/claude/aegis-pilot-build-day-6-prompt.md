# Aegis Pilot build day 6 — session prompt

Copy the fenced block into a new Claude Code session.

```text
Aegis Pilot build day 6. Work on branch claude/aegis-fi-copy-buyer-definition (PR #2319); open separate branches/PRs only where stated.

Read first (Reads, not recall): CLAUDE.md, docs/system-config/STANDARDS_ROUTING.md, DWS_TRUTH_STANDARD.md, DWS_ROLES_REGISTRY.md,
.claude/handoffs/claude/aegis-fi-copy-buyer-definition.md, docs/sales/aegis-pilot-versions/README.md,
Store/PRODUCT_AEGIS_PILOT.md (FI section v2.0.9 + EN body), docs/sales/aegis-pilot-versions/AEGIS_PILOT_SKU_v2.0.json and AEGIS_PILOT_SKU_v2.1-draft.md,
docs/sales/aegis-pilot-versions/CONSISTENCY_CHECK_v2.0.md, docs/field-notes/2026-10-01-boardy-claims-audit.md.

Rules carried over from day 5:
- No claim enters customer text without a source; advisor (Boardy) claims go to the audit log with a verdict and link first.
- Every FI text change bumps the version line, appends to "Versiohistoria (FI-osio)" and writes a frozen copy to docs/sales/aegis-pilot-versions/AEGIS_PILOT_FI_<version>.md. Never edit an archived version.
- Prices only in dws10.com/config/products.json (+ landing-pages mirror, same commit); a price change is a new catalogue version (follow price list 1.35 commit 7c37b366: priceVersion, priceList, commercialPortfolio, priceHistory, five price-list pages + mirrors, consulting packages, validator constants, gen-price-list-html snapshot, scripts/truth/* regeneration, npm run validate:pricing).
- Edit products.json by text replacement, never by re-serialising (mixed formatting).
- Gate: NVIDIA CUDA platform (GB10 or x86 + NVIDIA). Not x86-only. NIM optional.
- Customer-visible text changes need HIC approval before merge (Approval Request Rule).

Open items, in order:

1. EN Store body to match FI v2.0.9 (CONSISTENCY_CHECK_v2.0.md rows 1, 3, 4): Store/PRODUCT_AEGIS_PILOT.md "What it is", Phase 1 "We do", "€19,990 includes", "What you get", "Who it is for"; Store/PRODUCT_AEGIS.md lines ~23 and ~181; DWS-AEGIS-PILOT-001 priceNote "INCLUDED … on existing customer hardware or a compact edge appliance" in products.json + mirror. Hardware is supplied as price-list lines, stays with the customer, not credited; LWM v2 included; credit window from report delivery, walk-through ≤14 days, credit independent of test result; maintenance contents. Show the HIC the EN diff as one Artifact before committing.

2. HIC decisions still open (ask once, one Artifact or one list): (a) confirm 14-day walk-through + result-independent credit (Boardy agreed; HIC not yet); (b) Standard support response time; (c) warranty contact-point sentence ("Lifetime Oy on asiakkaan yhteyspiste takuuasioissa …"); (d) LWM v2 Pilot/Full: runs without Aegis licence (a/b/c), split from IMPL phase 3 (€25,000), FULL price anchor (i/ii/iii); (e) prices for new SKUs in AEGIS_PILOT_SKU_v2.0 (status "uusi, TBD"); (f) connectors (AEG-INT-*) and sensor builds included in pilot price; (g) anchoring levels 1 and 3; (h) §3.6.1 thresholds (30 %, EEA default/opt-in); (i) verifier licence (Apache-2.0 recommended); (j) Intel x86 validation box (Arc Pro B60) yes/no.

3. After (e): add approved SKUs to products.json + mirror as a new catalogue version (1.36), separate PR. Then replace "lisätään hinnastoon" in the FI "Laitekokoonpano" with SKU codes (FI v2.1) and freeze AEGIS_PILOT_SKU_v2.1 from the draft.

4. Admin runbook gap: add an Aegis pilot delivery section (hardware delivery and install, Phase 0 hardware review incl. `aegis:pilot -- prove` and rehearsal run, seal at test start/end, evidence export + verify-bundle, credit-window dates) to Admin/ADMIN_MANUAL.md or the runbook the ontology lookup points to (`npm run ontology:lookup aegis`). Read the ● hits first.

5. Track PR #2321 (opencode task aegis-evidence-ten-year-verify). When the loop's result PR lands, verify: operator_signature in human.override and human.decide, verify-bundle checks it, docs/aegis/EVIDENCE_FORMAT_v1.md states the RFC 8785 relation, Python verifier reproduces docs/aegis/evidence-test-vectors/expected.json. Only then may PR #2319 merge (its verification paragraph is a promise until then). Update docs/runbooks/AEGIS_PILOT_AUDITOR_GUIDE.md to point at the format spec and the Python verifier.

6. Hardware research per model — use .claude/handoffs/claude/aegis-next-session-prompt.md (Beckhoff, Siemens, B&R, Neousys TPM chips, GB10 Landlock ABI, Finnish process-industry references). Budget ~60 WebSearch calls; WebFetch is egress-blocked for vendor domains.

7. Pending from day 5, not started: Beckhoff outreach (docs/partnerships/beckhoff-partner-note.md, HIC approval required, sender risto.paarni@lifetime.fi); fund doors trio (investor-outreach/FUND_DOORS_AEGIS_2026-10.md: Spintop, Breega, Apeiron — HIC to pick) and six INTRO file corrections listed there; Kemira IT facts from HIC.

Done gate: report "done" only with `node scripts/agent-done-gate.mjs --full` output. Hooks in this container: push with SKIP_LOCAL_CI=1 (no PowerShell); a merge commit may need SKIP_LINT=1 when eslint reports 0 errors. Write the day-6 handoff to .claude/handoffs/claude/aegis-fi-copy-buyer-definition.md at the end.
```
