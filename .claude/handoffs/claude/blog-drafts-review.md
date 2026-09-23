# Handoff — claude/blog-drafts-review

# VERSION AND AGENT HISTORY

---

Version: 1.1 [Latest]

Sessions & Modifications:

- Version: 1.1 [Latest] | Tool: Claude Code | Session: claude/blog-drafts-review | Date: 23.09.2026 | Changes: End-of-session handoff: PR #2087 merged, #2088 merge on green, open work (whitepaper form, references/WP pass, language rules, translations) and next-session prompt.
- Version: 1.0 [not latest] | Tool: Claude Code | Session: claude/blog-drafts-review | Date: 23.09.2026 | Changes: Initial handoff for the blog-drafts-review branch.

Document Status:

- Created: 23.09.2026
- Last Modified: 23.09.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE

---

**Date:** 2026-09-23 · **Runtime:** Claude Code (cloud) · **Status:** PR #2088 merge approved by HIC ("merge", 23.09.2026); merges when CI is green.

## Done

- **PR #2087 merged** (cda3d01e8): domain-specific top bars and taglines, OLW subpage menu, lifetime.fi menu follows the FI/EN switch.
- **PR #2088** (this branch):
  - Dictionary: KYA-S1 table, LWM, process terms, taglines; 13 hand-edited keys ported into the generator.
  - ONTOLOGY v1.8 §4.1.
  - `scripts/blog/seo-tags.mjs`: tags on 162 posts; 36 copied JSON-LD headlines fixed; Article JSON-LD created for 32 posts that had none.
  - Whitepaper v1.1 files: price, "KYA Specification", Espoo.
  - Thesis 4.12 (master's §10.34).
  - OLW blog X/OG share card rewritten.
  - truth-lint accepts Finnish ”…” quotes.
- **Sovereignty draft FI** rewritten as Finnish text (not a translation), with all HIC wording from 23.09.2026. Includes the HIC-approved paragraph on what EU data centres of US hyperscalers do offer.

## HIC decisions recorded 23.09.2026

- The FI text may differ from the EN original.
- When a translated term is unclear, add the English equivalent in parentheses, e.g. "ilmaeristetty (air-gapped)".
- End each post with our whitepaper as a reference when it helps. The whitepaper is delivered through a form that collects contact details.
- External sources that the text clearly refers to get Oxford notes-bibliography citations.
- Language versions may differ from one another in sentence structure and terms, but the idea must not change (HIC 23.09.2026). This is the fourth rule for `DWS_LANGUAGE_STANDARD.md` §5.
- The paragraph on EU data centres is approved ("minusta se on parempi").

## Open work (in order)

1. **Language rules into the standard.** Add the three rules above to `DWS_LANGUAGE_STANDARD.md` §5 (new §5.3–5.5) and bump the version. The file is not Prettier-clean at baseline; edit surgically and do not reformat.
2. **Whitepaper request form** (collects contact details):
   - Page: `dws10.com/whitepapers/request/` (FI/EN), with `?paper=` values sovereign-industrial-intelligence, kya-idv-cert, shufti-kya, compliant-by-construction.
   - Fields:
     - name, work email, company, role, country
     - paper
     - required GDPR consent linking to `/privacy-policy/`
     - honeypot
   - Wire the "Download (wire up)" buttons on `dws10.com/whitepapers/` to the form. Mirror everything to `landing-pages/dws10-com/`.
   - **Conflict to settle with the HIC (Rule 7):**
     - Non-Negotiable Rule 4 allows email only through Amazon SES. The existing `dws10.com/functions/api/contact.js` uses the Cloudflare `send_email` binding.
     - `contact.js` also calls `EmailMessage` without `import { EmailMessage } from "cloudflare:email"`, which likely makes every send fail with 502. Verify, then fix.
   - Proposed design: a Pages Function stores the lead in a Supabase table `whitepaper_requests` via REST, with the service-role key set as a Pages env var.
     - The migration file is GREEN to author.
     - Include GRANT + RLS per CLAUDE.md.
     - Applying the migration is RED (HIC).
     - Risto sends the paper from Proton.
   - The firehorse `/leads` route is stubbed out of the build (`src/app.ts:106`), so it cannot be used.
3. **Pass over all 10 drafts** (approval page items 1–10) for references and whitepapers:
   - English gloss in parentheses for unclear terms. FI sovereignty examples:
     - työkuorma (workload)
     - ilmaeristetty (air-gapped)
     - altistumispisteet (exposure score)
     - älykkyyskerros (intelligence layer)
     - karsintaehto (gate)
     - datasuvereniteetti (Data Sovereignty)
     - operatiivinen kerros (operational sovereignty)
   - Oxford notes-bibliography citations with a "Lähteet" list. Sources verified for the sovereignty post (`docs/field-notes/2026-09-14-sovereignty-is-the-primary-segmentation-axis.md` §8):
     - Cloud Sovereignty Framework v1.2.1 (Oct 2025)
     - Commission Cloud III award news, 17.04.2026
     - Commission explainer, 01.06.2026
     - CLOUD Act, Pub. L. 115-141 (2018)
     - GDPR, Regulation (EU) 2016/679
     - The Gartner release of 9 Feb 2026 and the AWS ESC GA (Jan 2026) have no URL in the repo: cite them descriptively or find the primary URL. Never invent one.
   - Add a whitepaper reference plus a form link at the end where it helps:
     - Sovereignty → European Sovereign Industrial Intelligence
     - KYA/HIC/BPMN posts → KYA IDV-CERT
     - Lifetime Fleet / physical AI → Compliant by Construction
   - Rebuild the approval Artifact https://claude.ai/artifact/8wFHwRp2gmMqLjhBqNthJy with the scratchpad builder, or regenerate the page from the drafts.
4. **HIC approvals still needed:**
   - FI sovereignty text (item 2).
   - "leikkaus" → "karsinta" (proposal: "rajaus" keeps its sense of the gate/fence).
   - Items 6–10.
   - After FI approval, rewrite EN/SV/DE/FR from it; they do not yet contain the HIC edits.
5. **Publish only approved posts** (Rule 13), per `docs/BLOG_STANDARD.md`: root + mirror, blog index, `scripts/inject-blog-nav.cjs`. Then run `node scripts/blog/seo-tags.mjs --write`.

## Other open items (from earlier)

- PR #2084 (reseller agreement), #2085 (OVH / price-list captions) and #2086 (lifetime.fi/fi campaign page — DO NOT MERGE before the checkout test) are waiting on HIC.
- Product/Offer JSON-LD on the web-product pages after #2085.
- ThinkingBox posts exist only in `landing-pages/onelifetime-world/posts/`.
- lifetime.fi EN heading "Agents. Loops. Workflows." (`lifetime.fi/index.html:877`).

## Next session prompt

```
Continue branch work from .claude/handoffs/claude/blog-drafts-review.md (read it first, then CLAUDE.md standards routing).
Start a fresh branch from main (claude/blog-refs-wp-form-<id>) since PR #2088 is merged.
Do, in order: (1) add the 4 HIC language rules (versions may differ in sentence structure and terms but never in the idea; EN gloss in parentheses; whitepaper reference at post end via form; Oxford notes for clearly referenced external sources) to DWS_LANGUAGE_STANDARD.md §5; (2) build the whitepaper request form on dws10.com (+landing-pages mirror) — first settle the email-transport conflict (Non-Negotiable Rule 4 = SES only vs contact.js Cloudflare send_email; contact.js lacks the cloudflare:email import) by proposing Supabase-stored leads + migration file (GRANT+RLS), ask HIC before applying; (3) pass all 10 blog drafts on approval page https://claude.ai/artifact/8wFHwRp2gmMqLjhBqNthJy for EN glosses, Oxford citations (verified sources only, never invented URLs) and whitepaper references; republish the page; (4) get HIC approval on FI sovereignty text + "karsinta", then rewrite EN/SV/DE/FR from the FI; (5) publish only approved posts (Rule 13) and run scripts/blog/seo-tags.mjs --write.
Reply to HIC in Finnish.
```
