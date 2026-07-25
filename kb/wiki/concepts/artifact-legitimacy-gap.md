<!--
VERSION AND AGENT HISTORY
Document: artifact-legitimacy-gap.md
Version: 1.0
Last-Updated: 2026-07-25
Author: Risto Anton Päärni (Lifetime Oy)
Agent: Claude Code (claude-opus-5)
Purpose: Canonical DWS statement of the artifact–legitimacy gap — the core
         problem of building governance artifacts with frontier models — plus
         reconciliation debt and the five platform design principles derived
         from it. Full treatment: V3Thesis §10.27.
Introduced-In: PR-pending (branch claude/greg-isenberg-field-notes-a2r544)
Code-Version: 1.0
Branch: claude/greg-isenberg-field-notes-a2r544
Date: 2026-07-25
Owner: risto.paarni@lifetime.fi
-->

# The Artifact–Legitimacy Gap

**Version:** 1.0 · **Status:** Active · **Scope:** any DWS governance artifact built with frontier-model assistance
**Full treatment:** `docs/metropolia/master-thesis/en/V3Thesis_EN.md` §10.27

## The gap

Frontier models compress **producing** a technically complete artifact from months to hours. They do not compress — and structurally cannot — the processes that make it **legitimate**: adversarial review by parties with competing commercial interests, independent implementation, body acceptance, per-jurisdiction legal review.

**The artifact is finished long before it is legitimate.** This is not a tooling defect. It is a consequence of the tooling working.

## Why it is dangerous rather than merely inconvenient

Specification quality used to be **evidence of process**. Nobody produced RFC 2119 conformance language, a version-history block and a conformance section alone in an afternoon, so their presence reliably implied a working group and elapsed time.

**Frontier models break that correlation.** Fluency is no longer evidence of process — but every reader still uses it as a legitimacy proxy, **the author included**. The failure is asymmetric: the author over-claims *without intending to*, because the artifact silently asserts a provenance its production never had.

## Reconciliation debt

Saying legitimacy "does not move" understates it. A body's acceptance criteria form by **consensus among parties with divergent commercial interests**; a solo-authored artifact optimises for **internal coherence**, because that is the only constraint its author can feel.

So each unreviewed iteration improves the document **against the wrong objective function**, and may drift *further* from adoptable while appearing — by every internally visible measure — to improve. **Unreviewed iteration can accumulate reconciliation debt.** The technically-best version is not necessarily the closest to adoptable, and nothing inside the authoring organisation distinguishes them.

## The worked case

KYA v1.5: produced to publication quality, titled *"Open Standard"*, met **zero of four gates**, retitled *Specification* on 24.07.2026. Nothing technical was wrong — the **category** the title asserted was wrong, and the artifact's fluency is what made that assertion credible.

> The same capacity that produced v1.5 in one session can produce v2.0 and v3.0. The version number accelerates; the legitimacy does not. What is missing is not technical.

## The countermeasure

`DWS_LEARNING_STANDARD.md` §10 is a **rate limiter on legitimacy claims**, installed in a process that has none natively — §10.3 reversibility, **§10.3.1 the cooling gap** (nothing irreversible ships in the session that conceived it), §10.4 verified-vs-propagated, §10.1/§10.6 decision format and cap.

## Five platform design principles

1. **Default to internal.** A specification is an internal working artifact until it earns external validation through the right gate per jurisdiction. Not publishing faster — **earning adoption at the pace each body requires.**
2. **Sell evidence, not verdicts.** Evidence is producible at machine speed; verdicts require institutions.
3. **Every claim carries its phase**, adjacent to the claim — not on a status page.
4. **Profiles, not forks.** Parameterise one core across jurisdictions.
5. **Build the rate limiter into the product, not only the process.**

## Why it is a commercial position

Polished compliance documents are now universally available. What became scarce in the same movement is the ability to say **which parts are load-bearing** — evidence separated from assertion, verified from propagated, phase stated with the claim. That discrimination is what compliance intelligence means as a product.

## Related

- `V3Thesis` §10.27 (full treatment) · `PHD_FIREHORSE` §14.42–14.43 (scientific framing)
- `kb/wiki/concepts/specification-vs-standard-four-gates.md`
- `DWS_LEARNING_STANDARD.md` §10 · `standards/kya-open/SPEC.md` §0.6, §10
