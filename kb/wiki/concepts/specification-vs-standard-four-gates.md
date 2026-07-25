<!--
VERSION AND AGENT HISTORY
Document: specification-vs-standard-four-gates.md
Version: 1.1
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

**Version:** 1.1
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

## The definition, confirmed 25.07.2026 — and three precisions

The HIC stated the distinction independently and asked for confirmation:

> *"Spesifikaatiolla määritetään ydin siitä mitä standardiksi hyväksytty artefakti on. Spesifikaatio on versioitu esitys, standardi esityksen yleinen muoto."*

**The substance is confirmed.** A specification is a versioned, implementable technical description that defines what the artifact is, how it behaves, and what it must satisfy. A standard is an **institutional status** a specification may acquire, and only through a process external to its author. Or, put best in the same exchange:

> **A standard is not a better specification. It is a specification that has passed the gates.**

Three precisions, because each of them changes what follows from the definition.

### Precision 1 — "the general form of the presentation" does not survive scrutiny

The HIC's second clause — *"standardi esityksen yleinen muoto"* — reads the difference as one of **genericity**: a standard is a more general form of the same presentation.

**That reading has to be rejected, and it matters that it is rejected explicitly**, because it is the most natural mistake to make and it points the work in exactly the wrong direction. If a standard were the general form, then **generalising the specification would produce one** — abstract the interfaces, widen the scope, remove the vendor specifics, and the artifact becomes a standard by writing.

It does not. Generalising a specification produces **a more general specification**. Nothing about gates 1–4 becomes easier; if anything, a broader scope makes independent implementation harder. The distinction is not on the axis of abstraction at all. It is on the axis of **who has accepted it**.

This is the same error the four gates exist to prevent, appearing at the level of definition rather than of claim.

### Precision 2 — legitimation has two routes, not one

Institutional status does **not** require a standards body. Gate 3 is deliberately disjunctive: *body acceptance **or** genuine multi-party adoption*. TCP/IP, JSON and Markdown became standards de facto, before or without formal ratification.

This is strategically load-bearing, not pedantic. It means the route to gate 3 is not only CEN/CENELEC — it is **also two independent implementations in production somewhere that is not Lifetime Oy**. That is a materially cheaper, faster and more self-directed path, and it is the same evidence gate 1 requires. **Gates 1 and 3 can be closed by the same act.**

What both routes share is that they are **external**. Neither is reachable by writing better.

### Precision 3 — versioning is not the discriminator; authorship of the version is

A specification is versioned. **So is a standard** — ISO 9001:2015, HTTP/1.1, TLS 1.3. Versioning therefore cannot distinguish them.

What distinguishes them is **who holds the pen on the next version**. A specification's version is controlled by its author; a standard's version is controlled by a process that can proceed **without the author's consent**. That is gate 4, arrived at from the definitional side.

So the sharpest one-line form of the distinction is not about form or version but about control:

> **A specification is an instrument of its author's strategy. A standard is an instrument its author no longer controls.**

### The two clocks

The exchange also confirmed the addition that makes the distinction consequential:

> *"Spesifikaatio voi olla teknisesti täydellinen ja silti institutionaalisesti kelvoton. Tekninen valmius ja legitiimiys eivät etene samalla kellolla."*

Confirmed, and it is the artifact–legitimacy gap (`artifact-legitimacy-gap.md`, `V3Thesis` §10.27) stated from the definitional side. Technical completeness is produced at the speed of writing, which frontier models have compressed to hours. Legitimacy is produced at the speed of institutions, which has not moved. **The distinction is the instrument that keeps the first from being mistaken for the second — including by its own author**, which is the failure mode that matters, because it is the one nobody warns you about.

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
