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
claims_checked: 2026-09-30
sources:
  - title: "System and Organization Controls (SOC) 2 Type 2"
    authors: "Microsoft"
    year: 2026
    venue: "Microsoft Learn — Compliance offerings"
    url: https://learn.microsoft.com/en-us/compliance/regulatory/offering-soc-2
    type: industry
  - title: "Regulation (EU) 2024/1689 laying down harmonised rules on artificial intelligence (Artificial Intelligence Act)"
    authors: "European Parliament and Council of the European Union"
    year: 2024
    venue: "Official Journal of the European Union"
    url: https://eur-lex.europa.eu/eli/reg/2024/1689/oj
    type: regulation
  - title: "International Standards on Combating Money Laundering and the Financing of Terrorism & Proliferation — The FATF Recommendations (updated February 2025)"
    authors: "Financial Action Task Force (FATF)"
    year: 2025
    venue: "FATF"
    url: https://www.fatf-gafi.org/en/publications/Fatfrecommendations/Fatf-recommendations.html
    type: standard
  - title: "European Digital Identity Wallet — Architecture and Reference Framework (ARF)"
    authors: "European Commission and European Digital Identity Cooperation Group"
    year: 2026
    venue: "eu-digital-identity-wallet (GitHub)"
    url: https://github.com/eu-digital-identity-wallet/eudi-doc-architecture-and-reference-framework
    type: standard
  - title: "Assessment List for Trustworthy Artificial Intelligence (ALTAI) for self-assessment"
    authors: "High-Level Expert Group on Artificial Intelligence"
    year: 2020
    venue: "European Commission"
    url: https://digital-strategy.ec.europa.eu/en/library/assessment-list-trustworthy-artificial-intelligence-altai-self-assessment
    type: standard
  - title: "Regulating AI Agents"
    authors: "Gardhouse, K., Oueslati, A., Kolt, N."
    year: 2026
    venue: "arXiv"
    url: https://arxiv.org/abs/2603.23471
    type: academic
  - title: "Who Audits the Auditors? Recommendations from a field scan of the algorithmic auditing ecosystem"
    authors: "Costanza-Chock, S., Harvey, E., Raji, I. D., Czernuszenko, M., Buolamwini, J."
    year: 2023
    venue: "arXiv"
    url: https://arxiv.org/abs/2310.02521
    type: academic
---

# KYA-S1, in Order — A Reading Path From One Signed Page to a Verified Human

KYA-S1 is a vendor specification for autonomous-agent identity and behaviour. Its purpose is simple to state: give procurement one signed page for the agent, next to SOC 2 [1] and ISO 27001, that says who is behind the agent, what it may do and how it is stopped. We have written about it in several posts, most of them in Finnish as part of a twelve-part series. This page puts six of them on one line so an English reader can see how they connect.

The order follows a buyer's questions. First, what is the page and why does it need an independent signature [7]? Then, what exactly does the buyer ask? Then, what do the terms mean? Then, how does an organisation adopt it in stages? Finally, who is the human in command, and how is that person proven — both in the process and in EU law.

One note on versions. The posts were written as the specification moved. The English post and the Finnish series refer to v1.3; the current version is v1.5. The assurance levels were renamed KYA-AL1, KYA-AL2 and KYA-AL3 in v1.4. Each post names the version current when it was published.

## 1. [KYA-S1 — One Signed Page for the Agent in Your Vendor File](https://onelifetime.world/posts/kya-s1-one-signed-page.html)

The starting point. One page, signed by the vendor and an independent assessor, carrying seven controls — IDV, BHM, REG, TC4, FLT, TRS, PRV — and a renewal date. The post rules out self-attestation, including Lifetime Oy's own, and is precise about the EU AI Act: KYA-S1 produces evidence relevant to Articles 12, 14 and 50 [2], but does not discharge them.

## 2. [KYC:n vastine tekoälylle — seitsemän KYA-kysymystä](https://onelifetime.world/posts/kya-kyc-seven-questions.fi.html) (in Finnish)

The buyer's checklist. The post carries the banking world's Know Your Customer principle [3] over to AI agents: how do you trust an actor with no face and no passport? It turns the seven controls into seven questions — who is responsible, what are the limits, how does it behave, how is it stopped, who pays for an error, is the permission valid right now, and can the decision be replayed two years later.

## 3. [KYA-S1 Sanasto — käsitteistö ja sanasto](https://onelifetime.world/posts/kya-s1-sanasto-glossary.fi.html) (in Finnish)

The reference. The glossary gathers the core terms in one place: the seven control areas, the three assurance levels with their audit frequency, response SLAs and replay windows, and runtime mechanisms such as the single-use Lease Token, fail-closed, leash snap, capture precedes release and the 72-hour attribution clock. Keep it open while reading the rest of the series.

## 4. [KYA-S1 Ekosysteemi & tuotanto-roadmap](https://onelifetime.world/posts/kya-s1-ecosystem-roadmap.fi.html) (in Finnish)

The adoption plan. The post treats KYA-S1 as a buyer's tool for vendor management and shows how the three assurance levels form a staged roadmap, with response limits tightening from fifteen minutes to five to sixty seconds. It restates the §3 Evidence Meta-Rule — no self-attestation — and places KYA-S1 in the procurement folder beside SOC 2, ISO 27001, ISO/IEC 42001 and FedRAMP, covering the autonomous agent that those standards do not.

## 5. [Yhteys eWallet EU (EUDI Wallet) & eIDAS 2.0](https://onelifetime.world/posts/eudi-wallet-eidas2-human-identity.fi.html) (in Finnish)

The identity anchor. An internal SSO login is not enough when an agent signs contracts or files with authorities across organisational borders; the human behind it must be verified at EU level. The post ties the EUDI Wallet under eIDAS 2.0 [4] to the IDV controls: real-time identification, a cryptographic binding to the agent session, and revocation that propagates within the assurance level and triggers the emergency stop.

## 6. [EU AI Act Artikla 14 (HIC) ja agenttien itsenäisyyden ristiriita](https://onelifetime.world/posts/eu-ai-act-article-14-hic.fi.html) (in Finnish)

The human in command. Article 14 requires effective human oversight of high-risk AI systems [2], yet an agent that needs a human click on every call is useless [5][6]. The post resolves this with trust-score routing: above the task's threshold the agent runs automatically; below it, or when the Trust Engine times out, the task moves to a human on the HIC Dashboard. A mandatory written reason on each human approval guards against rubber-stamping — the automation bias that Article 14(4)(b) names [2].

## How the six fit

The signed page is the promise. The seven questions are how a buyer checks it. The glossary fixes the words, and the roadmap turns the promise into stages an organisation can adopt. The last two posts answer the question under every control: which human is accountable — proven with an EU identity, and kept in command without becoming the bottleneck.

Risto Anton Päärni
Founder, CEO, Lifetime Oy · Editor in Chief, Lifetime Scope Journal

## Sources

[1] Microsoft (2026). System and Organization Controls (SOC) 2 Type 2. Microsoft Learn — Compliance offerings. https://learn.microsoft.com/en-us/compliance/regulatory/offering-soc-2

[2] European Parliament and Council of the European Union (2024). Regulation (EU) 2024/1689 laying down harmonised rules on artificial intelligence (Artificial Intelligence Act). Official Journal of the European Union. https://eur-lex.europa.eu/eli/reg/2024/1689/oj

[3] Financial Action Task Force (FATF) (2025). International Standards on Combating Money Laundering and the Financing of Terrorism & Proliferation — The FATF Recommendations (updated February 2025). FATF. https://www.fatf-gafi.org/en/publications/Fatfrecommendations/Fatf-recommendations.html

[4] European Commission and European Digital Identity Cooperation Group (2026). European Digital Identity Wallet — Architecture and Reference Framework (ARF). eu-digital-identity-wallet (GitHub). https://github.com/eu-digital-identity-wallet/eudi-doc-architecture-and-reference-framework

[5] High-Level Expert Group on Artificial Intelligence (2020). Assessment List for Trustworthy Artificial Intelligence (ALTAI) for self-assessment. European Commission. https://digital-strategy.ec.europa.eu/en/library/assessment-list-trustworthy-artificial-intelligence-altai-self-assessment

[6] Gardhouse, K., Oueslati, A., Kolt, N. (2026). Regulating AI Agents. arXiv. https://arxiv.org/abs/2603.23471

[7] Costanza-Chock, S., Harvey, E., Raji, I. D., Czernuszenko, M., Buolamwini, J. (2023). Who Audits the Auditors? Recommendations from a field scan of the algorithmic auditing ecosystem. arXiv. https://arxiv.org/abs/2310.02521
