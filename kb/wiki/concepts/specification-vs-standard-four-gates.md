<!--
VERSION AND AGENT HISTORY
Document: specification-vs-standard-four-gates.md
Version: 1.0
Last-Updated: 2026-07-25
Author: Risto Anton Päärni (Lifetime Oy)
Agent: Claude Code (claude-opus-5)
Purpose: Canonical DWS definition of the specification / standard distinction
         and the four-gate falsifiability criterion for standard claims.
         Originated from the HIC challenge to the KYA v1.5 title (24.07.2026)
         and generalised in PHD_FIREHORSE §14.42.
Introduced-In: PR-pending (branch claude/greg-isenberg-field-notes-a2r544)
Code-Version: 1.0
Branch: claude/greg-isenberg-field-notes-a2r544
Date: 2026-07-25
Owner: risto.paarni@lifetime.fi
-->

# Specification vs Standard — and the Four Gates

**Version:** 1.0
**Status:** Active
**Scope:** Any DWS document, page, deck or claim that uses the word "standard" externally

## The rule

**Do not call a DWS document a "standard" in outward-facing material unless all four gates below are met.** Internal company standards (`DWS_*_STANDARD.md`, `Legal/KYA_STANDARD_v1.md`) are a legitimate separate sense of the word — see "Four senses" — but that sense does not survive publication, because a reader outside the company hears sense (i) or (ii).

## Four senses of the word

| Sense | Meaning | Example |
| ----- | ------- | ------- |
| **(i) De jure** | Ratified by a recognised body through a defined process — working group, public review, consensus, IPR policy, appeal | ISO, CEN/CENELEC, ETSI, W3C Recommendation, IETF Standards Track |
| **(ii) De facto** | No body, but genuine multi-party adoption | TCP/IP pre-formalisation, Markdown |
| **(iii) Specification** | Openly licensed, implementable description. No ratification, no adoption | `standards/kya-open/SPEC.md` |
| **(iv) Company standard** | Governs one organisation's internal practice | `DWS_DOCUMENT_STANDARD.md`, `Legal/KYA_STANDARD_v1.md` |

## The four gates

A document earns the external word "standard" when **all four** hold:

1. **Two or more independent implementations**, by parties with no commercial relationship to the author.
2. **A conformance suite an implementation can fail.** A claim that cannot fail a test is untestable.
3. **Either** a recognised body accepts it into its process (de jure) **or** genuine multi-party adoption occurs (de facto).
4. **Change control that outlives the authoring organisation** — the text can be amended without the original author's consent.

**Gate 4 is decisive and least discussed.** While amendment requires the author's consent, the document is an instrument of the author's strategy no matter how openly it is licensed. It is the test that separates a standard from a product artifact, and it is structurally unavailable to any single-vendor document.

## Why this matters specifically in the EU

Under **EU AI Act Article 40**, *harmonised standards* confer a **presumption of conformity** and are produced through CEN/CENELEC. A governance document titled "standard", addressed to regulated industries and written adjacent to AI Act obligations, invites a reader to infer harmonised-standard adjacency it has not earned. In this jurisdiction the distinction is the difference between a description and a legal instrument — not a style preference.

The DWS house voice reinforces it independently: `docs/BLOG_STANDARD.md` §12.1 rule 6 — *"never sell a promise the layer cannot deliver; the fastest way to lose European enterprise trust is to over-claim."* Industry uses "open standard" loosely. DWS cannot, because that discipline is the product.

## What a standards process buys that solo authorship cannot

- Adversarial review by parties with **competing commercial interests**
- Interoperability testing between **independent** implementations
- Formal IPR disclosure
- Change control surviving the author

**Observed corollary (25.07.2026):** intra-organisational review — *including AI-assisted review* — lacks the structural corrective of competing-interest review. During the KYA work, AI-assisted expert review endorsed an integration that did not exist in code, described a dependency as planned after it had been rejected, and represented a schema defect as gating an unrelated legal instrument. All three were caught by verification, not by review. A reviewer aligned with the author's frame inherits the author's blind spots. This is an epistemic argument for external standardisation, independent of commercial motive.

## Applying it

- **Naming:** prefer "Specification" until the gates are met. Say what it is: *"the first specification for governing delegated agent authority."*
- **Public surfaces:** where the word appears externally, add an explicit status disclosure rather than relying on the reader to infer.
- **Careful with retroactive edits:** dated records (press releases, published decks, signed legal documents) generally should **not** be silently rewritten. Correct going forward; annotate rather than erase.

## Related

- `standards/kya-open/SPEC.md` §0.6 — the gates as applied to KYA
- `docs/PHD_FIREHORSE_EN.md` §14.42 — the scientific generalisation
- `docs/field-notes/2026-07-24-kya-open-standard-dual-track-ip-strategy.md` — the decision record and standards-body route
- `DWS_TRUTH_STANDARD.md` — external claim discipline
