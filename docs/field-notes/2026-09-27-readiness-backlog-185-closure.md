# Readiness backlog: 185 next-version items closed or consolidated — 2026-09-27

---

# VERSION AND AGENT HISTORY

Version: 1.0 [Latest]

Sessions & Modifications:

- Version: 1.0 [Latest] | Tool: Claude Code 2.1.283 | Session: claude/ecstatic-johnson-nd6uha | Date: 27.09.2026 | Changes: Recorded how the 185 open backlog items from the 27.09.2026 delivery report were resolved.

Document Status:

- Created: 27.09.2026
- Language: English
- Publication Status: PENDING_REVIEW
- Classification: INTERNAL

---

## Result

| Category | Before | After | How |
| --- | --- | --- | --- |
| capacity-evidence | 47 | 0 | 41 agent SKUs/bundles exempt under §5.12; 4 managed human services exempt under new §5.13; 2 products given profiles under new §5.14. Each exemption now cites its section (`capacityExemptBasis`). |
| automation-depth (per SKU) | 138 | 0 | Shared paid-order steps now automated for every SKU (`src/services/fulfilment-packet.service.ts`); each delivery family evaluated in `config/truth/delivery-automation-evaluation.json`. |
| automation-depth (per family) | — | 10 | The remaining work (actual provisioning/activation automation) is shared per delivery family, so it is filed once per family, not 138 times. |

## What is and is not automated

- Automated for all 138 SKUs: order intake, payment verification, durable fulfilment event, buyer email with owner, SLA, acceptance outcomes and exclusions (runbook steps 2 and 5), operations email with delivery mode, runbook link and acceptance checklist.
- Still human for all 138 SKUs: the delivery itself (provisioning, activation, install, engagement) and the acceptance check. No unattended delivery is claimed.

## Conflicts surfaced (Rule 7)

- `DWS_CAPACITY_CLASS_STANDARD.md` §5.12 calls agent SKUs "internal allocation units", yet they are priced and have public checkout. Exemption follows the standard as written; the wording is the HIC's call.
- Six agent-activation SKUs already carried a capacity class before v1.2; §5.12 now says existing classes are kept rather than removed.
- The product-order hook regenerated `dws10.com/feeds/google-products.xml`; the committed feed was stale and contained doubled `https://dws10.com/https://dws10.com/contact/` links.

## HIC decision

- Set the volume threshold per delivery family (`volumeTrigger.threshold`, currently null) at which each family's next automation step gets built.

## Session Learning Outcome steps

- KB update: N/A — cloud session, `/kb` compile runs on DGX.
- Learn/ HTML render and Drive export: N/A — deferred to HIC review of this PENDING_REVIEW note.
- Calendar: N/A — no dated commitment made.
