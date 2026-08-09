---
slug: know-your-agent-kya-s1.fr
title: "Connaissez votre agent (KYA-S1) : une page signée sur l'IA, dans le dossier de sécurité qui touche vos données"
series: "Série de blog KYA-S1"
part: 1
parts_total: 11
lang: fr
site: onelifetime.world
author: Risto Anton Päärni
date: 2026-08-08
Status: DRAFT
source: Traduction du texte finnois approuvé par le HIC (know-your-agent-kya-s1.fi.md). Section par section, affirmation par affirmation.
ai_disclosure: required
note: >-
  Partie 1/11 de la série. En attente de l'approbation du HIC (Règle 13) — le HIC a
  explicitement approuvé le FI et l'EN, pas le SV/DE/FR. Le marquage de traduction par IA
  est obligatoire à la publication (docs/BLOG_STANDARD.md §3.2.1, EU AI Act art. 50(4)).
  Les niveaux d'assurance suivent Legal/KYA_S1.md v1.4 (KYA-AL1/AL2/AL3).
---

# Connaissez votre agent (KYA-S1) : une page signée sur l'IA, dans le dossier de sécurité qui touche vos données

Blog 1/11 · DWS IQ & Lifetime World Model · 8 août 2026 · Risto Anton Päärni

## Introduction : l'IA prend des décisions — mais qui en porte la responsabilité ?

Les dossiers d'achat des entreprises et de l'administration publique contiennent aujourd'hui une pile substantielle de documents signés. Au niveau organisationnel, il y a les certificats SOC 2 Type 2 et ISO/IEC 27001. Pour les données et la protection de la vie privée, il y a les preuves GDPR et CSRD. Pour la sécurité de la plateforme et l'infrastructure, on peut présenter FedRAMP ou une homologation de cloud souverain.

Un document critique manque pourtant au dossier d'achat : une page signée pour l'agent d'IA autonome.

Lorsque l'IA passe de la génération de texte à des actions autonomes — exécuter du code, appeler des API, effectuer des transactions financières et piloter des procédés industriels physiques — l'ancienne sécurité logicielle ne suffit plus.

Un agent d'IA autonome n'est pas un simple logiciel. C'est un acteur. C'est pourquoi chaque agent exige une identité vérifiée qui lui est propre, un mandat d'action ainsi qu'un frein d'urgence immédiat.

## Une page pour le dossier fournisseur (KYA-S1 v1.3 Specification)

KYA-S1 (Know Your Agent Security Specification v1.3) est une proposition de norme de sécurité qui vérifie le comportement à l'exécution et l'identité des agents d'IA. Elle se condense en trois questions claires auxquelles tout fournisseur doit pouvoir répondre avant qu'un agent n'accède aux données du client :

**Qui se trouve derrière l'agent ? (IDV — Identity Verification)**
Chaque décision prise par l'agent et chaque outil qu'il demande doit être traçable jusqu'à un humain vérifié cryptographiquement (le HIC — l'humain qui commande).

**Que peut-il faire, et que fait-il en ce moment même ? (REG & BHM)**
L'agent doit disposer d'un manifeste de capacités déclaré avant l'activation (REG), qu'il ne peut pas dépasser à l'exécution, ainsi que d'une surveillance comportementale continue (BHM) pour détecter les écarts.

**Comment l'arrêter en cas de défaillance ? (TC4 — Chain Termination)**
Si le niveau de confiance de l'agent s'effondre ou qu'un écart survient, toute la chaîne d'agents doit pouvoir être éliminée de façon atomique dans les limites d'une réponse SLA bornée dans le temps (leash snap).

## Pas d'auto-évaluation (§3 Evidence Meta-Rule)

Le plus grand piège de la gestion des fournisseurs est l'auto-évaluation (self-attestation). Le §3 de la spécification KYA-S1 interdit absolument la déclaration propre du fournisseur :

> **Règle (§3) :** l'auto-évaluation n'est pas une preuve recevable de conformité à KYA-S1. Le papier vaut exactement ce que vaut le nom inscrit sur sa seconde ligne de signature.

Seuls sont recevables comme preuve un rapport d'audit d'un tiers accrédité (par exemple un auditeur SOC 2 ou une entreprise de red team accréditée) ou une télémétrie de plateforme vérifiée cryptographiquement et conservée dans un registre de journaux immuable.

Cette règle lie aussi l'auteur de la spécification : Lifetime Oy ne délivrera pas de certificat KYA-S1 à sa propre plateforme DWS IQ avant qu'un évaluateur externe indépendant ne l'ait signé.

## Niveaux d'assurance KYA-AL (Assurance Levels)

Les niveaux d'assurance KYA-AL du secteur définissent la fréquence d'audit et le délai de réponse SLA :

| Niveau d'assurance     | Fréquence d'audit      | Profondeur de preuve exigée                                      | Délai de réponse SLA (IDV & TC4) |
| ---------------------- | ---------------------- | ---------------------------------------------------------------- | -------------------------------- |
| **KYA-AL1 (Standard)** | Audit annuel           | Audit tiers sur au moins 1 domaine + télémétrie signée           | max. 15 minutes                  |
| **KYA-AL2 (Enhanced)** | Trimestriel            | Audit sur les domaines IDV et BHM + 12 mois de télémétrie signée | max. 5 minutes                   |
| **KYA-AL3 (Critical)** | Continu, en temps réel | Évaluateur externe sur les 7 domaines + SLA signé                | max. 60 secondes                 |

## Couplage direct à l'EU AI Act (§4)

La spécification KYA-S1 produit des éléments directement exploitables au regard des obligations du règlement européen sur l'IA :

- **Article 12 (Journalisation) :** le contrôle PRV de KYA-S1 produit la reproductibilité des décisions (PRV-2) et un historique immuable.
- **Article 14 (Contrôle humain / HIC) :** l'IDV, le TC4, le TRS et le PRV-4 de KYA-S1 garantissent un véritable pouvoir humain de commandement et d'annulation.
- **Article 50 (Transparence) :** le PRV-3 de KYA-S1 produit un marquage de provenance vérifiable pour les sorties.

**La limite honnête :** la conformité à KYA-S1 n'est pas, en soi, une conformité à l'EU AI Act. Elle donne à l'acheteur une preuve technique solide que le comportement de l'agent à l'exécution satisfait à la lettre de la loi.

## En bref

- **Une page signée :** un agent autonome a besoin de son propre document de sécurité.
- **Un contrôle réel :** KYA-S1 garantit le rattachement d'un responsable humain à l'agent (IDV), la restriction à l'exécution (REG/BHM) et un frein d'urgence sans délai (TC4).
- **Pas d'auto-évaluation (§3) :** seules la signature d'un évaluateur indépendant ou une télémétrie cryptographique sont acceptées comme preuve.
- **Niveaux d'assurance AL :** AL1, AL2 et AL3 définissent la vitesse de réaction exigée, de 15 minutes jusqu'à 60 secondes.

## Voir les autres parties de la série

- **Partie 1 :** Connaissez votre agent (KYA-S1) — une page signée sur l'IA qui touche vos données
- **Partie 2 :** L'équivalent du KYC pour l'IA — sept questions KYA critiques
- **Partie 3 :** EU AI Act article 14 (HIC) et la contradiction de l'autonomie des agents
- **Partie 4 :** Classes d'agents : le GitHub Copilot du développeur vs. les agents d'arrière-plan industriels DWS IQ
- **Partie 5 :** KYA-S1 et BPMN 2.0 : comment le niveau de confiance d'un agent d'IA pilote un procédé industriel en pratique
- **Partie 6 :** KYA-S1 v1.3 × BPMN 2.0 : Lease Token atomique, fail-closed et calcul TRS honnête
- **Partie 7 :** Quand quelque chose tourne mal : classification des défaillances en 72 heures (FLT) et rejeu de la décision (PRV) en pratique
- **Partie 8 :** L'écosystème KYA-S1 & la feuille de route de production
- **Partie 9 :** Lifetime World Model (LWM) — un registre d'état global et une mémoire
- **Partie 10 :** Protocoles d'agentic commerce & paiements autonomes
- **Partie 11 :** Le lien avec eWallet EU (EUDI Wallet) & eIDAS 2.0

---

Risto Anton Päärni

Founder, CEO, Lifetime Oy

Rédacteur en chef, Lifetime Scope Journal
