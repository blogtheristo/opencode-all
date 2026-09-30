---
slug: a-yubikey-proves-a-person-a-tpm-proves-a-machine
lang: fr
title: "Une YubiKey prouve une personne. Un TPM prouve une machine."
hero: "Deux contrôles matériels répondent à deux questions différentes dans un audit. Ce que chacun prouve, ce que nous ne vendons pas et ce que notre pilote consigne."
visual: infographic
visual_src: docs/blog-drafts/img/a-yubikey-proves-a-person-a-tpm-proves-a-machine.svg
visual_alt: "Deux panneaux : une clé de sécurité signe l'arrêt et prouve quelle personne était présente ; un TPM signe l'état de démarrage et prouve quelle machine a tourné. En dessous, le registre du pilote Aegis aujourd'hui : signature de l'arrêt présente, attestation matérielle non utilisée."
seo_tags: [aegis, hic, kya_tc4, kya_idv, article_14]
demo_agent:
demo_url:
target: onelifetime.world/posts/a-yubikey-proves-a-person-a-tpm-proves-a-machine.fr.html
date: 2026-09-30
author: Risto Anton Päärni
Status: DRAFT
---

En préparant le premier test témoin du pilote Aegis, nous nous sommes posé une question que l'auditeur d'un acheteur posera : quand l'agent s'arrête, qu'est-ce qui prouve qu'une vraie personne l'a arrêté, et qu'est-ce qui prouve que cela s'est passé sur la machine que nous indiquons ?

Ce sont deux questions, et deux dispositifs différents y répondent.

**Une YubiKey prouve une personne.** Une YubiKey, comme toute clé de sécurité matérielle, est un petit appareil que l'on branche sur son ordinateur portable et que l'on touche. Elle contient un secret qui ne quitte jamais l'appareil. Quand l'opérateur arrête un agent, la clé signe la commande, et la signature n'existe que si la clé de cette personne était physiquement présente. Copier un fichier ne la copie pas. C'est la réponse à « qui détenait l'autorité à cet instant », ce qu'un registre de supervision humaine doit montrer là où l'article 14 de l'AI Act de l'UE s'applique, c'est-à-dire pour les systèmes à haut risque.

**Un TPM prouve une machine.** Un TPM est une petite puce sur la carte mère de l'ordinateur. Il consigne avec quoi la machine a démarré et peut signer une déclaration à ce sujet. Si quelqu'un remplaçait le logiciel sous l'agent, ou déplaçait les preuves vers une autre machine, la déclaration de la puce ne correspondrait plus. C'est la réponse à « était-ce cette machine, et ce logiciel y tournait-il ».

Les deux ne se remplacent pas. Une clé sur l'ordinateur portable d'une personne honnête ne dit rien du serveur. Un serveur parfait ne dit rien de qui a appuyé sur arrêt.

Voici où nous en sommes, en toute franchise. Dans le pilote Aegis, l'opérateur signe aujourd'hui un arrêt avec une clé logicielle conservée sur sa propre machine. Cette signature est présente dans le registre et elle est vérifiée sans réseau. Elle est aussi plus faible qu'une clé matérielle, et nous le disons. Séparément, le registre d'acceptation du pilote comporte une section d'attestation matérielle, avec une entrée pour le contrôle TPM et une pour la clé matérielle. Dans le pilote, les deux entrées indiquent « non utilisé ». Ce sont deux lignes différentes : l'arrêt est signé, et le matériel derrière la signature n'est pas attesté. Nous préférons que le registre le dise plutôt que de vous laisser supposer davantage que ce que vous avez acheté.

Deux choses que nous ne faisons pas. Nous ne vendons pas de matériel. Vous achetez le serveur et les clés auprès des fournisseurs que vous utilisez déjà, et ils sont votre propriété. Et nous ne prétendons pas que le logiciel seul puisse fournir une preuve matérielle. Un TPM exige une chaîne de démarrage maîtrisée sur votre site, ce qui est une propriété de votre site et non de notre code.

Ce sur quoi nous travaillons ensuite, c'est la clé. Signer l'arrêt avec une clé matérielle est un pas plus petit qu'attester une machine, et c'est ce qu'un auditeur voit en premier : la personne, physiquement présente, au moment de l'arrêt. Que cela arrive avant notre premier test témoin n'est pas encore décidé, et nous ne l'affirmerons pas tant qu'un arrêt n'aura pas été signé ainsi et que le registre ne le montrera pas.

Si vous exploitez des agents là où quelqu'un demandera plus tard qui les a arrêtés et avec quoi, demandez à votre fournisseur lequel des deux il peut vous montrer. Demandez ensuite à voir le registre. La plupart des fournisseurs peuvent vous montrer un journal. Un journal n'est pas une chaîne signée qu'un tiers peut vérifier sans réseau et sans appeler le fournisseur. C'est cette seconde chose que le dossier de preuves du pilote Aegis est destiné à remettre à votre auditeur. Il sera prêt pour notre premier test témoin, et tant qu'un tiers n'en aura pas vérifié un, considérez-le comme une promesse et pas encore comme un produit. C'est la raison pour laquelle le registre dit ce qu'il dit.

Nous écrirons de nouveau le jour où un arrêt aura été signé avec une clé matérielle et où le registre le montrera.

Risto Anton Päärni
Founder, CEO · Lifetime Oy · the Agent Outcome Company
