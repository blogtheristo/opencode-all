---
slug: process-models-world-model-and-hic
lang: fr
title: "Modèles de processus, Lifetime World Model et commandement humain"
hero: "Comment les modèles de processus industriels, le registre d’état du LWM et le commandement humain bornent ce qu’un agent DWS IQ a le droit de faire."
visual: infographic
visual_src: docs/blog-drafts/img/process-models-world-model-and-hic.svg
visual_alt: "Les modèles de processus ISA-95, BPMN, SysML, VSM et SIPOC relient les agents DWS IQ au registre d’état du Lifetime World Model, sous commandement humain"
seo_tags: [lwm, lwm_state_register, hic, isa_95, sysml, vsm, sipoc, skilled_agent]
date: 2026-09-30
author: Risto Anton Päärni
Status: DRAFT
translation_of: process-models-world-model-and-hic.fi.md
ai_translated: true
note: "Visual not yet made — the SVG is a to-do."
---

# Modèles de processus, Lifetime World Model et commandement humain

Réunir l’organisation d’automatisation DWS IQ (`dws10.com`) et le Lifetime World Model (LWM), c’est offrir à l’industrie un outil d’une rare puissance : des agents d’arrière-plan performants, adossés à un état du monde gouverné sans faille et vérifiable. Ce texte rassemble trois questions en un seul argument : de quelles méthodes industrielles de description des processus un agent a-t-il besoin, comment le Lifetime World Model s’en sert-il comme registre d’état global et mémoire, et comment le commandement humain (HIC) fixe-t-il ce que les agents DWS IQ ont le droit d’y faire ?

## Un moteur intelligent a besoin d’un modèle du monde

Livré à lui-même, un agent d’IA – un DWS IQ Skilled Agent, par exemple – n’est qu’un « moteur intelligent ». Pour fonctionner, il lui faut un modèle du monde (World Model) : une vision partagée et cohérente de l’état des systèmes, de qui fait quoi, avec quels pouvoirs et avec quelles conséquences.

La répartition des rôles est nette :

- **DWS IQ (`dws10.com`)** est la main qui exécute. Il apporte des agents d’arrière-plan spécialisés (Skilled Agent) qui relient les données, pilotent les flux de travail et exécutent les processus industriels en coulisse.
- **Le Lifetime World Model** est le cortex qui veille et se souvient. En tant que registre d’état global et mémoire, il tient à jour en temps réel la situation du système, l’identification KYA-S1 – c’est-à-dire la Liaison d’agent à un responsable humain vérifié (IDV) –, le Score de confiance et autorisation (TRS) ainsi que l’historique des décisions, c’est-à-dire la Provenance de la décision et piste d’audit (PRV).

Mais sans interprète, le moteur et le cortex ne parlent pas la même langue. C’est là que les modèles de processus jettent un pont : ils traduisent les besoins de l’entreprise et de la production dans une langue que comprennent à la fois l’humain, les agents DWS IQ et le Lifetime World Model.

## Un agent d’arrière-plan a besoin du commandement humain

Les agents d’IA se répartissent en deux grandes familles, dont le besoin de supervision et le cadre d’action diffèrent fondamentalement. GitHub Copilot Agent est le binôme interactif du développeur dans l’IDE : il agit à l’échelle micro, propose du code et lance des tests sous les yeux du développeur, et la supervision humaine s’exerce naturellement à chaque action dans l’interface. Toute modification de code est relue avant d’être validée par un commit.

Les agents DWS IQ, eux, sont des agents d’arrière-plan au service de l’industrie et des entrepôts de données. Ils agissent à l’échelle macro et exécutent des processus métier et de production en plusieurs étapes, avec un effet direct sur les chaînes de production, les interfaces et les bases de données. Ils exigent donc une couche de gouvernance propre, pour que la supervision tienne même lorsqu’ils tournent en arrière-plan.

Pour que l’industrie concilie un haut degré d’automatisation et la supervision humaine qu’exige l’article 14 de l’AI Act de l’UE – dans la mise en œuvre de DWS, le commandement humain (HIC) –, les agents DWS IQ sont gouvernés depuis un Panneau de contrôle unique inspiré de GitHub Copilot :

- **Une seule vue de lancement :** l’humain dirige le processus. Il lance le flux de travail d’un agent depuis une vue claire et suit l’avancement du processus en temps réel.
- **Rôles de Skilled Agent :** le panneau de contrôle aiguille chaque étape du flux de travail vers des agents spécialisés à cet effet – un agent de contrôle qualité, d’analyse de données ou de logistique, par exemple – toujours selon les exigences de l’étape en question.
- **Un couplage KYA sans faille :** chaque agent lancé depuis le panneau de contrôle respecte la Spécification de sécurité KYA-S1 (Connaissez votre agent) : la sécurité connaît la personne derrière l’agent (IDV) et son niveau de confiance (TRS), et dispose d’un frein d’urgence immédiat (TC4) sur toute la chaîne d’agents.

Le commandement humain n’agit pas pour autant dans le vide. Il lui faut une carte sur laquelle tracer les limites. Cette carte, ce sont les méthodes de description des processus que l’industrie a elle-même éprouvées de longue date.

## Modèles de processus : là où l’agent s’arrime

Au-delà de la méthodologie RUP (et des diagrammes UML), l’industrie recourt à plusieurs autres méthodes établies pour décrire et modéliser ses processus. Le choix dépend de l’objet étudié : automatisation des activités, flux physique de production, architecture des équipements et des systèmes, ou management de la qualité. Pour intégrer des agents d’IA, cinq comptent plus que les autres : ISA-95 au niveau de l’architecture des systèmes, BPMN 2.0 au niveau des flux de travail et de l’automatisation, SysML au niveau des systèmes cyber-physiques, VSM au niveau des flux de matières et d’informations, et SIPOC au niveau du management de la qualité et du périmètre. Chacun assigne à l’agent une limite différente, et chacun se raccorde au Lifetime World Model à sa manière.

### ISA-95 : le niveau d’action et une colonne vertébrale verticale de la confiance

ISA-95 (intégration entreprise–contrôle, IEC 62264) n’est pas un organigramme classique, mais la norme industrielle d’architecture des systèmes et d’interfaces de processus – la fameuse pyramide de l’automatisation. Elle définit la circulation de l’information entre la gestion d’entreprise (ERP), le pilotage de la production (MES), la supervision (SCADA) et les équipements de terrain (PLC/IoT).

Pour l’agent, ISA-95 fixe le niveau d’action et les pouvoirs (Manifeste et registre des capacités, REG, et IDV). Un agent qui opère au niveau MES (niveau 3) requiert des délais de sécurité et de réaction tout autres qu’un agent qui touche directement au contrôle SCADA (niveau 2).

Le plus grand défi de l’industrie, c’est la rupture de l’information et des habilitations entre les niveaux de gouvernance. C’est pourquoi le Lifetime World Model est placé à l’horizontale, en travers de toute la pyramide ISA-95. Lorsqu’un agent DWS IQ prend une décision au niveau MES, il vérifie en temps réel dans le Lifetime World Model le niveau d’action et l’autorisation humaine (IDV/TRS), laquelle provient du niveau ERP/RH (niveau 4). L’agent n’agit pas « à l’aveugle » dans son propre silo.

### BPMN 2.0 : un flux de travail exécutable qui bifurque selon la confiance

BPMN 2.0 est le standard de facto commun à l’industrie et au logiciel pour modéliser processus métier et flux de travail. Les diagrammes BPMN ne sont pas de simples dessins : ils s’exécutent directement comme du code dans des moteurs de processus (Camunda, Flowable ou Zeebe, par exemple). BPMN est donc le langage idéal pour les agents DWS IQ : on peut définir dans le flux de travail une étape, une BPMN Service Task (voie automatique), que l’agent exécute en arrière-plan. Et parce que le diagramme est exécutable, il se raccorde aisément au panneau de contrôle unique.

Les diagrammes BPMN tracent les chemins que suivent les agents, et le score de confiance (TRS) vivant du Lifetime World Model est branché sur leurs embranchements conditionnels :

- **TRS ≥ 85** → l’agent DWS IQ exécute la tâche automatiquement (BPMN Service Task).
- **TRS < 85** → BPMN achemine la tâche vers un humain pour approbation (BPMN User Task, validation humaine).

Une anomalie, elle aussi, renvoie la tâche à un humain : si l’agent rencontre une anomalie, le processus BPMN la transmet automatiquement pour validation humaine. Cette validation accorde une autorisation temporaire, aussitôt réinscrite dans le Lifetime World Model. Le commandement humain n’est donc pas un contrôle à part, extérieur au processus, mais une branche en son sein.

### SysML : limites de sécurité cyber-physiques et machines à états

SysML (langage de modélisation de systèmes) est une extension d’UML conçue pour modéliser des systèmes cyber-physiques complexes – matériel, logiciel, processus et humains. Il est très prisé dans les industries les plus lourdes : aéronautique, automobile, énergie et mécanique de haute exigence.

Dans l’industrie lourde, un agent ne doit jamais pousser une machine au-delà de ses seuils matériels. Les machines à états SysML (_State Machine Diagrams_) définissent les limites de sécurité physiques qu’un agent DWS IQ ne doit pas franchir. Si l’agent détecte une anomalie en production, il interroge l’état du modèle du monde. Si le modèle du monde signale une défaillance du système, le modèle SysML conduit le processus vers un état de repli maîtrisé (_Safe State_) et actionne immédiatement le frein d’urgence de KYA-S1 (TC4).

### VSM : chasser le gaspillage sans risque d’audit

La Cartographie de la chaîne de valeur (VSM) est l’outil phare du lean manufacturing pour visualiser les flux de matières et d’informations, du fournisseur jusqu’au client. Elle met au jour les gaspillages, les goulets d’étranglement, la valeur des stocks et les délais de traversée d’un processus de production.

Pour l’agent, la VSM désigne avec précision les endroits où l’information ne circule pas, ou ceux où des personnes effectuent un travail manuel routinier – confirmer des commandes ou saisir des données qualité, par exemple –, bref les points où le processus reste en attente d’une validation manuelle ou d’un transfert de données par un humain. Elle tient lieu de calcul d’investissement pour déterminer où, dans le processus, il vaut la peine d’installer un agent d’IA.

Quand les étapes manuelles sont confiées à des Skilled Agents, le modèle du monde veille à ce que la vitesse ne se paie pas en traçabilité. Comme chaque action d’un agent DWS IQ est enregistrée dans le Lifetime World Model (PRV), les délais de traversée peuvent être réduits de façon spectaculaire sans perdre la traçabilité sans faille qu’exigent le management de la qualité et la réglementation.

### SIPOC : la frontière entre entrées et sorties

SIPOC (Suppliers, Inputs, Process, Outputs, Customers) est la cartographie de processus de haut niveau qu’utilisent les spécialistes qualité Six Sigma : un tableau simple, tenant sur une page, qui délimite avec précision le début et la fin d’un processus.

SIPOC définit les entrées (_Inputs_) et les sorties (_Outputs_) critiques. Lorsqu’un agent d’IA est intégré à un processus, SIPOC garantit que les données fournies à l’agent et le résultat qu’il produit satisfont aux exigences d’audit de la spécification KYA (PRV et Attribution limitée des fautes, FLT). Il assure la qualité des données d’entrée et de sortie de l’agent, ainsi que leurs limites, avant la mise en œuvre.

## Le cycle de vie : les phases RUP sous commandement humain

Chaque modèle de processus borne les actes de l’agent. L’ensemble, lui, a encore besoin d’un cycle de vie. L’industrie rend la collaboration avec les agents prévisible et acceptée en réunissant les cas d’utilisation métier (Use Cases), le Workflow V2 qui les met en œuvre et l’Active Ontology – les objets métier, leurs relations, les règles et les actions autorisées. Le Rational Unified Process (RUP) et les diagrammes d’activité UML décrivent cet ensemble comme un cycle de vie maîtrisé, et UML fournit en outre des diagrammes de structure et de séquence pour la communication entre agents.

- **Inception (Lancement) :** l’humain consigne dans le panneau de contrôle le cas d’utilisation métier, son objectif et son cadre. Le commandement commence par l’humain.
- **Elaboration (Élaboration) :** le Workflow V2 décompose le cas d’utilisation en étapes et choisit les rôles de Skilled Agent nécessaires ; le diagramme de processus est présenté à un humain avant le lancement.
- **Construction (Construction) :** les agents exécutent les étapes dans les limites de l’Active Ontology – uniquement des actions autorisées, sur des objets métier autorisés. Aux points de contrôle critiques (_Gateways_), le système demande une validation humaine avant de passer à l’étape suivante.
- **Transition (Transition) :** l’humain approuve le résultat, et une trace décisionnelle conforme à la Spécification de sécurité KYA-S1 est automatiquement enregistrée pour examen ultérieur.

## Le résultat : une automatisation industrielle gouvernable et évolutive

Introduire le Lifetime World Model dans l’environnement `dws10.com` au moyen de ces modèles de processus a deux conséquences.

D’abord, l’humain pilote l’ensemble depuis une seule vue. Le panneau de contrôle unique affiche à la fois les flux de travail BPMN, les agents DWS IQ en cours d’exécution et leurs niveaux de confiance KYA.

Ensuite, le règlement des litiges change du tout au tout. En cas d’arrêt de production ou d’erreur, l’Attribution limitée des fautes (FLT) de KYA-S1 et l’historique du modèle du monde établissent en 72 heures s’il s’agissait d’une défaillance de connexion d’un équipement, d’un écart du modèle ou d’une saisie erronée par un humain.

Les modèles de processus fixent les limites, le Lifetime World Model se souvient de ce qui s’est passé à l’intérieur, et l’humain décide où passent ces limites. En apportant aux agents d’arrière-plan DWS IQ le modèle de pilotage familier et sûr de GitHub Copilot, et en décrivant les flux de travail avec les diagrammes de processus RUP que l’industrie affectionne depuis longtemps, l’obligation de diriger l’IA cesse d’être un texte de loi pour devenir un avantage concurrentiel clair, pratique et évolutif.
