---
slug: kya-s1-reading-path
lang: fr
title: "KYA-S1, dans l’ordre — un parcours de lecture, d’une page signée à un humain vérifié"
hero: "Six articles, de la page fournisseur signée à l’humain vérifié à l’échelle de l’UE derrière l’agent, dans l’ordre où l’acheteur en a besoin."
visual: infographic
visual_src: docs/blog-drafts/img/kya-s1-reading-path.svg
visual_alt: "Six articles sur une même ligne : la page signée, sept questions, le glossaire, la feuille de route, le portefeuille d’identité numérique de l’UE et le contrôle humain selon l’Article 14"
seo_tags: [kya_s1_spec, kya_evidence_meta_rule, kya_trs, hic, article_14, eudi_wallet]
date: 2026-09-30
author: Risto Anton Päärni
Status: DRAFT
kind: hub
note: "Visual not yet made — the SVG is a to-do."
translation_of: kya-s1-reading-path.md
ai_translated: true
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

# KYA-S1, dans l’ordre — un parcours de lecture, d’une page signée à un humain vérifié

La Spécification de sécurité KYA-S1 s’adresse aux fournisseurs et porte sur l’identité et le comportement des agents autonomes. Son objet tient en une phrase : donner aux achats une seule page signée sur l’agent, à côté de SOC 2 [1] et d’ISO 27001, qui dit qui se tient derrière l’agent, ce qu’il a le droit de faire et comment on l’arrête. Nous lui avons consacré plusieurs articles, pour la plupart en finnois, dans le cadre d’une série en douze volets. Cette page en aligne six sur une même ligne, pour que le lecteur qui ne lit pas le finnois voie comment ils s’enchaînent.

L’ordre suit les questions de l’acheteur. D’abord : qu’est-ce que cette page, et pourquoi exige-t-elle une signature indépendante [7] ? Ensuite : que demande exactement l’acheteur ? Puis : que signifient les termes ? Puis : comment une organisation l’adopte-t-elle par étapes ? Enfin : quel humain détient le commandement humain, et comment prouve-t-on son identité — dans le processus comme dans le droit de l’UE.

Un mot sur les versions. Les articles ont été écrits au fil de l’évolution de la spécification. L’article en anglais et la série finnoise renvoient à la v1.3 ; la version actuelle est la v1.5. Les niveaux d’assurance ont été renommés KYA-AL1, KYA-AL2 et KYA-AL3 dans la v1.4. Chaque article cite la version en vigueur au moment de sa publication.

## 1. [KYA-S1 — One Signed Page for the Agent in Your Vendor File](https://onelifetime.world/posts/kya-s1-one-signed-page.html) (en anglais)

Le point de départ. Une page, signée par le fournisseur et par un évaluateur indépendant, portant sept contrôles — IDV, BHM, REG, TC4, FLT, TRS, PRV — et une date de renouvellement. L’article exclut l’auto-attestation, y compris celle de Lifetime Oy, et se montre précis sur l’AI Act de l’UE : KYA-S1 produit des preuves pertinentes au regard des Articles 12, 14 et 50 [2], mais ne suffit pas à satisfaire les obligations qu’ils posent.

## 2. [KYC:n vastine tekoälylle — seitsemän KYA-kysymystä](https://onelifetime.world/posts/kya-kyc-seven-questions.fi.html) (en finnois)

La liste de contrôle de l’acheteur. L’article transpose aux agents d’IA le principe bancaire du Know Your Customer [3] : comment faire confiance à un acteur sans visage ni passeport ? Il transforme les sept contrôles en sept questions — qui est responsable, où passent les limites, comment l’agent se comporte-t-il, comment l’arrête-t-on, qui paie en cas d’erreur, l’autorisation est-elle valide à cet instant précis, et la décision peut-elle être rejouée deux ans plus tard.

## 3. [KYA-S1 Sanasto — käsitteistö ja sanasto](https://onelifetime.world/posts/kya-s1-sanasto-glossary.fi.html) (en finnois)

L’ouvrage de référence. Le glossaire réunit les termes essentiels en un seul endroit : les sept domaines de contrôle, les trois niveaux d’assurance avec leur fréquence d’audit, les SLA de réponse et les fenêtres de rejeu, ainsi que des mécanismes d’exécution tels que le jeton de bail atomique à usage unique (Lease Token), le verrouillage en cas de défaillance (fail-closed), le frein d’urgence (leash snap), la capture avant libération des ressources et l’horloge d’attribution limitée (72 h). Gardez-le ouvert en lisant le reste de la série.

## 4. [KYA-S1 Ekosysteemi & tuotanto-roadmap](https://onelifetime.world/posts/kya-s1-ecosystem-roadmap.fi.html) (en finnois)

Le plan d’adoption. L’article présente KYA-S1 comme un outil de gestion des fournisseurs au service de l’acheteur et montre comment les trois niveaux d’assurance dessinent une feuille de route progressive, avec des délais de réponse qui se resserrent de quinze minutes à cinq minutes, puis à soixante secondes. Il rappelle la méta-règle de preuve (§3) — pas d’auto-attestation — et range KYA-S1 dans le dossier d’achat aux côtés de SOC 2, ISO 27001, ISO/IEC 42001 et FedRAMP, pour couvrir l’agent autonome que ces normes laissent de côté.

## 5. [Yhteys eWallet EU (EUDI Wallet) & eIDAS 2.0](https://onelifetime.world/posts/eudi-wallet-eidas2-human-identity.fi.html) (en finnois)

L’ancrage de l’identité. Une connexion SSO interne ne suffit pas lorsqu’un agent signe des contrats ou accomplit des démarches auprès des autorités au-delà des frontières de l’organisation ; l’humain qui se tient derrière doit être vérifié à l’échelle de l’UE. L’article relie le portefeuille d’identité numérique de l’UE (EUDI Wallet), prévu par eIDAS 2.0 [4], aux contrôles IDV : identification en temps réel, lien cryptographique avec la session de l’agent, et révocation qui se propage dans le délai fixé par le niveau d’assurance et déclenche le frein d’urgence.

## 6. [EU AI Act Artikla 14 (HIC) ja agenttien itsenäisyyden ristiriita](https://onelifetime.world/posts/eu-ai-act-article-14-hic.fi.html) (en finnois)

Le commandement humain. L’Article 14 exige un contrôle humain effectif des systèmes d’IA à haut risque [2], or un agent qui réclame un clic humain à chaque appel ne sert à rien [5][6]. L’article résout la contradiction par un routage fondé sur le score de confiance : au-dessus du seuil fixé pour la tâche, l’agent s’exécute automatiquement ; en dessous, ou si le Trust Engine ne répond pas à temps, la tâche est confiée à un humain dans le panneau de contrôle unique (HIC Dashboard). Une justification écrite obligatoire à chaque approbation humaine protège contre la validation machinale — le biais d’automatisation que nomme l’article 14, paragraphe 4, point b) [2].

## Comment les six s’articulent

La page signée est la promesse. Les sept questions sont le moyen, pour l’acheteur, de la vérifier. Le glossaire fixe les mots, et la feuille de route traduit la promesse en étapes qu’une organisation peut adopter. Les deux derniers articles répondent à la question qui sous-tend chaque contrôle : quel humain est responsable — identité prouvée par l’UE, commandement humain conservé, sans devenir le goulot d’étranglement.

Risto Anton Päärni
Fondateur & PDG, Lifetime Oy · Rédacteur en chef, Lifetime Scope Journal

## Sources

[1] Microsoft (2026). System and Organization Controls (SOC) 2 Type 2. Microsoft Learn — Compliance offerings. https://learn.microsoft.com/en-us/compliance/regulatory/offering-soc-2

[2] European Parliament and Council of the European Union (2024). Regulation (EU) 2024/1689 laying down harmonised rules on artificial intelligence (Artificial Intelligence Act). Official Journal of the European Union. https://eur-lex.europa.eu/eli/reg/2024/1689/oj

[3] Financial Action Task Force (FATF) (2025). International Standards on Combating Money Laundering and the Financing of Terrorism & Proliferation — The FATF Recommendations (updated February 2025). FATF. https://www.fatf-gafi.org/en/publications/Fatfrecommendations/Fatf-recommendations.html

[4] European Commission and European Digital Identity Cooperation Group (2026). European Digital Identity Wallet — Architecture and Reference Framework (ARF). eu-digital-identity-wallet (GitHub). https://github.com/eu-digital-identity-wallet/eudi-doc-architecture-and-reference-framework

[5] High-Level Expert Group on Artificial Intelligence (2020). Assessment List for Trustworthy Artificial Intelligence (ALTAI) for self-assessment. European Commission. https://digital-strategy.ec.europa.eu/en/library/assessment-list-trustworthy-artificial-intelligence-altai-self-assessment

[6] Gardhouse, K., Oueslati, A., Kolt, N. (2026). Regulating AI Agents. arXiv. https://arxiv.org/abs/2603.23471

[7] Costanza-Chock, S., Harvey, E., Raji, I. D., Czernuszenko, M., Buolamwini, J. (2023). Who Audits the Auditors? Recommendations from a field scan of the algorithmic auditing ecosystem. arXiv. https://arxiv.org/abs/2310.02521
