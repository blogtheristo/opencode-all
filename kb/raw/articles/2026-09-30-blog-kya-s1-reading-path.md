---
slug: kya-s1-reading-path
lang: en
title: "KYA-S1, in Order — A Reading Path From One Signed Page to a Verified Human"
hero: "Follow six posts from the signed vendor page to the EU-verified human behind the agent, in the order a buyer needs them."
visual: infographic
visual_src: docs/blog-drafts/img/kya-s1-reading-path.svg
visual_alt: "Six posts on one line: the signed page, seven questions, the glossary, the roadmap, the EUDI Wallet and Article 14 human oversight"
seo_tags: [kya_s1_spec, kya_evidence_meta_rule, kya_trs, hic, article_14, eudi_wallet]
date: 2026-09-30
author: Risto Anton Päärni
Status: DRAFT
kind: hub
note: "Visual not yet made — the SVG is a to-do."
---

# KYA-S1, in Order — A Reading Path From One Signed Page to a Verified Human

KYA-S1 is a vendor specification for autonomous-agent identity and behaviour. Its purpose is simple to state: give procurement one signed page for the agent, next to SOC 2 and ISO 27001, that says who is behind the agent, what it may do and how it is stopped. We have written about it in several posts, most of them in Finnish as part of a twelve-part series. This page puts six of them on one line so an English reader can see how they connect.

The order follows a buyer's questions. First, what is the page and why does it need an independent signature? Then, what exactly does the buyer ask? Then, what do the terms mean? Then, how does an organisation adopt it in stages? Finally, who is the human in command, and how is that person proven — both in the process and in EU law.

One note on versions. The posts were written as the specification moved. The English post announced v1.2; the Finnish series refers to v1.3; the current version is v1.5, which renamed the assurance levels to KYA-AL1, KYA-AL2 and KYA-AL3. Each post names the version current when it was published.

## 1. [KYA-S1 — One Signed Page for the Agent in Your Vendor File](https://onelifetime.world/posts/kya-s1-one-signed-page.html)

The starting point. One page, signed by the vendor and an independent assessor, carrying seven controls — IDV, BHM, REG, TC4, FLT, TRS, PRV — and a renewal date. The post rules out self-attestation, including Lifetime Oy's own, and is precise about the EU AI Act: KYA-S1 produces evidence relevant to Articles 12, 14 and 50, but does not discharge them.

## 2. [KYC:n vastine tekoälylle — seitsemän KYA-kysymystä](https://onelifetime.world/posts/kya-kyc-seven-questions.fi.html) (in Finnish)

The buyer's checklist. The post carries the banking world's Know Your Customer principle over to AI agents: how do you trust an actor with no face and no passport? It turns the seven controls into seven questions — who is responsible, what are the limits, how does it behave, how is it stopped, who pays for an error, is the permission valid right now, and can the decision be replayed two years later.

## 3. [KYA-S1 Sanasto — käsitteistö ja sanasto](https://onelifetime.world/posts/kya-s1-sanasto-glossary.fi.html) (in Finnish)

The reference. The glossary gathers the core terms in one place: the seven control areas, the three assurance levels with their audit frequency, response SLAs and replay windows, and runtime mechanisms such as the single-use Lease Token, fail-closed, leash snap, capture precedes release and the 72-hour attribution clock. Keep it open while reading the rest of the series.

## 4. [KYA-S1 Ekosysteemi & tuotanto-roadmap](https://onelifetime.world/posts/kya-s1-ecosystem-roadmap.fi.html) (in Finnish)

The adoption plan. The post treats KYA-S1 as a buyer's tool for vendor management and shows how the three assurance levels form a staged roadmap, with response limits tightening from fifteen minutes to five to sixty seconds. It restates the §3 Evidence Meta-Rule — no self-attestation — and places KYA-S1 in the procurement folder beside SOC 2, ISO 27001, ISO/IEC 42001 and FedRAMP, covering the autonomous agent that those standards do not.

## 5. [Yhteys eWallet EU (EUDI Wallet) & eIDAS 2.0](https://onelifetime.world/posts/eudi-wallet-eidas2-human-identity.fi.html) (in Finnish)

The identity anchor. An internal SSO login is not enough when an agent signs contracts or files with authorities across organisational borders; the human behind it must be verified at EU level. The post ties the EUDI Wallet under eIDAS 2.0 to the IDV controls: real-time identification, a cryptographic binding to the agent session, and revocation that propagates within the assurance level and triggers the emergency stop.

## 6. [EU AI Act Artikla 14 (HIC) ja agenttien itsenäisyyden ristiriita](https://onelifetime.world/posts/eu-ai-act-article-14-hic.fi.html) (in Finnish)

The human in command. Article 14 requires effective human oversight, yet an agent that needs a human click on every call is useless. The post resolves this with trust-score routing: above the task's threshold the agent runs automatically; below it, or when the Trust Engine times out, the task moves to a human on the HIC Dashboard. A mandatory written reason on each human approval guards against rubber-stamping.

## How the six fit

The signed page is the promise. The seven questions are how a buyer checks it. The glossary fixes the words, and the roadmap turns the promise into stages an organisation can adopt. The last two posts answer the question under every control: which human is accountable — proven with an EU identity, and kept in command without becoming the bottleneck.

Risto Anton Päärni
Founder, CEO, Lifetime Oy · Editor in Chief, Lifetime Scope Journal
