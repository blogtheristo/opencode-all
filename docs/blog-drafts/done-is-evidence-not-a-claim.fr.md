---
slug: done-is-evidence-not-a-claim
lang: fr
translation_of: done-is-evidence-not-a-claim.md
ai_translated: true
title: "« Terminé » est une preuve, pas une affirmation : auditer les agents et soumettre leur travail à une barrière"
hero: "N'acceptez le « terminé » d'un agent que comme une preuve — système modifié, trace d'audit, résultat d'une commande de contrôle —, jamais comme une phrase."
visual: infographic
visual_src: docs/blog-drafts/img/done-is-evidence-not-a-claim.svg
visual_alt: "Flux allant de l'action de l'agent à l'effet secondaire dans les outils, puis à l'enregistrement d'audit, à la barrière « terminé », à la pull request et à la fusion par un humain"
seo_tags: [hic, article_12, article_14, eu_ai_act, agent_isolation, kya_prv]
date: 2026-09-30
author: Risto Anton Päärni
Status: DRAFT
note: "Visual not yet made — the SVG is a to-do. Merged text needs fresh HIC approval even though thinkingbox.md was approved."
customer_value: "Une entreprise cliente consacre moins de temps de relecture à revérifier les affirmations des agents : une modification ne compte comme terminée que lorsqu'une commande de barrière montre qu'elle est commitée, poussée, testée et qu'elle passe des contrôles qui échouaient avant le début du travail, et le journal de ce résultat constitue la trace d'audit — c'est la barrière que DWS exploite aujourd'hui sur son propre dépôt, pas encore un produit client packagé."
claims_checked: 2026-09-30
routes: [truth, roadmap, sales]
sources:
  - title: "One Success Isn't Reliability: Thinkingbox, a Sandbox and Benchmark for Agents in Stateful Business Workflows"
    authors: "Ko, Y.; Keramati, A.; Ferri, N.; Palmaz Lopez Pelaez, S.; Tsai, L.-C.; Wang, C.; Milletari, M.; Kundu, T.; Smolyakov, V.; Ólafsson, K.; Guy, T."
    year: 2026
    venue: "arXiv preprint arXiv:2608.19741"
    url: https://arxiv.org/abs/2608.19741
    type: academic
  - title: "thinkingbox: a framework for defining tools as MCP servers, running LLM agents against them, and evaluating agent behavior"
    authors: "Microsoft"
    year: 2026
    venue: "GitHub repository"
    url: https://github.com/microsoft/thinkingbox
    type: primary
  - title: "thinkingbox-data: ThinkingBox-Bench v1.0 dataset and tool-server library"
    authors: "Microsoft"
    year: 2026
    venue: "GitHub repository"
    url: https://github.com/microsoft/thinkingbox-data
    type: primary
  - title: "τ-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains"
    authors: "Yao, S.; Shinn, N.; Razavi, P.; Narasimhan, K."
    year: 2024
    venue: "arXiv preprint arXiv:2406.12045"
    url: https://arxiv.org/abs/2406.12045
    type: academic
  - title: "SWE-bench: Can Language Models Resolve Real-World GitHub Issues?"
    authors: "Jimenez, C. E.; Yang, J.; Wettig, A.; Yao, S.; Pei, K.; Press, O.; Narasimhan, K."
    year: 2023
    venue: "arXiv preprint arXiv:2310.06770"
    url: https://arxiv.org/abs/2310.06770
    type: academic
  - title: "Why Do Multi-Agent LLM Systems Fail?"
    authors: "Cemri, M.; Pan, M. Z.; Yang, S.; Agrawal, L. A.; Chopra, B.; Tiwari, R.; Keutzer, K.; Parameswaran, A.; Klein, D.; Ramchandran, K.; Zaharia, M.; Gonzalez, J. E.; Stoica, I."
    year: 2025
    venue: "arXiv preprint arXiv:2503.13657"
    url: https://arxiv.org/abs/2503.13657
    type: academic
  - title: "Regulation (EU) 2024/1689 laying down harmonised rules on artificial intelligence (Artificial Intelligence Act), Articles 12 and 14"
    authors: "European Parliament and Council of the European Union"
    year: 2024
    venue: "Official Journal of the European Union, OJ L 2024/1689"
    url: https://eur-lex.europa.eu/eli/reg/2024/1689/oj
    type: regulation
---

# « Terminé » est une preuve, pas une affirmation

Le 28 septembre, un agent nous a annoncé qu'une faille de gouvernance était « entièrement comblée ».

Elle ne l'était pas. Le commit n'avait jamais quitté la machine. La production n'appelait jamais le nouveau code. Le test qui signalait la faille était toujours là, à attendre.

## Le problème de l'échec silencieux

Vos agents tournent. Le transcript a bonne allure. L'utilisateur dit « merci ». Puis vous consultez la base de données, les journaux de l'API, les effets secondaires — et rien ne s'est passé. L'agent a halluciné son succès. [1, 6]

Tout l'écart est là : entre _dire_ qu'on a fait quelque chose et le _faire_. Beaucoup d'évaluations vérifient encore le transcript ou l'appel de fonction, pas si le travail a réellement été fait. [1]

Pour les moteurs de revenus — campagnes sortantes, enrichissement de leads, affinage du ciblage, attribution —, les échecs silencieux ne sont pas des cas limites. Ils sont existentiels. Il suffit d'un agent qui annonce « campagne déployée » alors que rien n'est parti pour que votre GTM perde sa crédibilité auprès d'un client. Il suffit d'un agent d'enrichissement qui invente de nouveaux champs de contact pour que votre équipe commerciale se mette à courir après des fantômes.

Il existe deux réponses, et ce texte traite des deux. La première consiste à auditer les agents là où l'écart apparaît : dans ce que les outils ont réellement modifié. La seconde, à construire le travail de sorte qu'un échec ne puisse tout simplement pas être présenté comme un succès.

## Auditer ce que les outils ont modifié : ThinkingBox

Microsoft a conçu ThinkingBox précisément pour résoudre ce problème. [1, 2] Chez Lifetime, nous avons forké le dépôt pour le faire tourner face à nos propres agents.

ThinkingBox exécute les agents dans des environnements d'outils isolés et avec état, par l'intermédiaire de serveurs Model Context Protocol (MCP). Chaque conversation lance ses propres processus d'outils isolés, en transport stdio, si bien que chaque cas de test s'exécute dans un bac à sable propre et reproductible. [1, 2, 3]

L'architecture examine trois choses qui échappent aux évaluations fondées sur le seul transcript :

- **Flux de travail avec état.** L'usage réel des outils a un état — créer une ressource, la mettre à jour, interroger le résultat. La plupart des évaluations se contentent d'appels en un seul tour. ThinkingBox permet aux agents d'exécuter des flux de travail en plusieurs étapes (appeler l'API, vérifier la réponse, réessayer ou s'adapter) et examine ce que les outils ont réellement modifié. [1, 4]
- **Utilisateurs simulés.** Les agents posent souvent des questions de clarification. ThinkingBox simule les réponses de l'utilisateur (au moyen d'un LLM ou par prompts) et vérifie que la réponse finale de l'agent est conforme à la spécification. Les évaluations en un seul tour passent entièrement à côté. [1, 2, 4]
- **Inspection des effets secondaires.** Le vrai signal n'est pas « l'agent a dit que ça marchait ». C'est « la base de données montre la modification », « l'API a renvoyé un succès » ou « le fichier a été créé ». ThinkingBox inspecte l'état avant et après, et signale les hallucinations où l'agent a revendiqué un succès alors que les outils montrent un échec. [1, 3]

## ThinkingBox-Bench : 507 flux de travail réels

Le ThinkingBox-Bench de Microsoft compte 507 tâches exécutables réparties sur cinq domaines métier : commerce de détail et e-commerce, voyage et hôtellerie, assurance automobile, support informatique interne d'une néobanque, et support informatique et RH d'un cabinet de conseil. [1, 3]

Les chiffres sont l'argument. Le meilleur modèle de l'article réussit 65 % des tâches du premier coup et en résout 91 % au moins une fois sur vingt tentatives, mais n'en réussit que 25 % les vingt fois. [1] Un succès n'est pas de la fiabilité.

Chaque tâche est livrée avec des résultats attendus et des sessions d'outils MCP isolées. Vous y confrontez votre agent et obtenez un verdict — réussi ou échoué — fondé sur les effets secondaires réels, non sur le ton du transcript. [1, 3]

## Le local d'abord, sur DGX

Des modèles ouverts, sur une NVIDIA DGX Spark posée à côté du bureau, écrivent désormais du vrai code. Pas des démos. Des suites de tests, des correctifs, des refactorisations. Les tokens sont à nous, les données restent entre nos murs, et le compteur ne tourne pas.

ThinkingBox y tourne aussi. Nos charges de travail d'agents s'exécutent par défaut en local ; les agents dans le cloud sont secondaires et exigent une justification documentée. Exécuter 507 tâches × 20 tentatives dans le cloud coûte cher ; nous amenons donc le banc d'essai sur la DGX, à l'écart des données de production. Ce runner est encore en chantier, pas une configuration livrée.

## Un cadre où « terminé » est le résultat d'une commande

L'audit attrape l'échec après coup. Le cadre, c'est notre manière de construire le travail pour que « terminé » ne puisse jamais être une simple phrase.

Les modèles de pointe — Claude, dans notre cas — excellent dans l'autre moitié du travail : découper un objectif en tâches précises, relire un diff, repérer ce qui sort du périmètre. Nous les avons donc associés aux modèles locaux. Et comme une association ne fait pas un plan, voici la partie honnête.

**Le modèle de pointe planifie.** Pour chaque tâche, il rédige une courte spécification assortie de contrôles — des commandes qui doivent réussir quand le travail est juste. Chaque contrôle doit échouer avant que le travail ne commence. Un contrôle qui réussit déjà ne prouve rien ; le cadre le refuse donc. [5]

**L'agent local construit.** Il tourne sur la DGX par cycles repartant chaque fois de zéro, une tâche à la fois, jusqu'à ce qu'une barrière dise « terminé ». Pas jusqu'à ce que l'agent le dise. La barrière exécute les commandes : commité, poussé, formaté, typé, linté, testé — plus les contrôles propres à la tâche. Puis elle ouvre une pull request. Elle ne fusionne jamais.

**Le modèle de pointe relit et fusionne**, une pull request à la fois, une fois la CI au vert. Un humain décide de ce qui est livré, et lit chaque mot rendu public.

La faille « entièrement comblée » du début est exactement ce pour quoi cette barrière existe : un commit non poussé et un test toujours ouvert sont l'un comme l'autre des résultats de commande, et tous deux disent non.

## Ce qu'a montré le premier jour

La boucle a livré des suites de tests pour quatre agents, et ces tests ont trouvé trois vrais bugs dans le code qu'ils couvraient. C'est la bonne nouvelle, et elle est réelle.

Les deux premières pull requests ont aussi franchi notre barrière — et échoué en CI. Notre barrière ne lançait pas le linter ; la CI, si. Pendant une matinée, « terminé » voulait dire moins sur notre machine que dans le dépôt. Nous avons ajouté le linter à la barrière le jour même.

Une troisième pull request a passé tous les contrôles et a pourtant modifié une classe de base à laquelle elle n'avait aucune raison de toucher. Aucune commande ne l'a vu. Un relecteur, si.

## Ce qu'aucun des deux outils ne promet

> **La partie honnête.** Une barrière ne vaut que ce que vaut son contrôle le plus faible. Elle ne voit ni le périmètre, ni l'intention, ni le goût. Elle laissera passer un travail faux que ses contrôles ne décrivent pas. [6] Trois pull requests font une histoire, pas une statistique — nous publierons des chiffres quand nous en aurons suffisamment.

Il en va de même d'un benchmark : il mesure les résultats que décrivent ses tâches, et rien d'autre. [1] La preuve réduit la marge d'un faux « terminé » ; elle ne remplace pas un relecteur.

## Traces et contrôle humain au titre de l'AI Act de l'UE

Pour les systèmes d'IA à haut risque, l'AI Act de l'UE exige de conserver la trace de ce qu'a fait le système (article 12) et un contrôle humain effectif (article 14). [7] Les deux volets de cette approche produisent le premier comme un effet secondaire. Un passage au vert de ThinkingBox-Bench est auditable, reproductible, et mesure des résultats — pas des hallucinations. [1] Dans le cadre, chaque tâche a sa spécification, chaque « terminé » son journal de commandes, chaque fusion un humain ou un relecteur derrière elle.

Ce qu'aucun des deux ne produit gratuitement, c'est la raison pour laquelle une modification a été autorisée. Elle doit être écrite avant que le travail ne commence, dans la spécification, à côté des contrôles. Une justification reconstruite après coup n'est pas une trace ; c'est une histoire.

Le commandement humain (Human-in-Command) cesse d'être une réunion. Il devient la dernière étape d'une chaîne qui vous a déjà dit la vérité.

## De l'évaluation à la production

ThinkingBox valide les agents avant leur déploiement. Une fois en service, le DWS Dashboard les surveille en production, avec en option la télémétrie Aspire. Ses vues sont le Bureau numérique (état des postes de travail des agents), la Salle de contrôle (une grille façon NOC affichant processeur, mémoire, avancement des tâches et coût par requête) et la Salle de situation (alertes pour la direction et chronologie de la dérive de confiance). Aspire alimente la Salle de contrôle en traces de décision des agents (entrées du modèle, appels d'outils, sorties), en latence et taux d'erreur des outils, en consommation de tokens et coût par agent, en état de santé des serveurs MCP, ainsi qu'en traçage de bout en bout des passages de relais entre agents.

Imaginez que vous déployiez 50 agents et que l'un d'eux se mette à halluciner, subtilement, le mardi. Sans traces, votre équipe débogue à l'aveugle. Avec des traces, le détecteur de dérive de confiance signale l'anomalie, les traces des agents montrent précisément quels appels d'outils ont divergé, et vous pouvez identifier le changement de température du modèle ou de prompt qui en est responsable.

## Pour les fondateurs et les équipes

- **Les investisseurs demandent : « Comment savez-vous que vos agents fonctionnent ? »** Un banc d'essai au vert et le journal de la barrière sont la réponse.
- **Votre équipe a besoin de confiance.** Un agent qui échoue en silence coûte plus cher qu'une journée d'infrastructure d'évaluation.
- **Les moteurs de revenus sont binaires.** Votre agent d'enrichissement a enrichi le lead, ou il ne l'a pas fait. Votre agent de prospection a déployé la campagne, ou il a menti.

Pour démarrer avec ThinkingBox, clonez notre fork, [github.com/blogtheristo/dws-thinkingbox](https://github.com/blogtheristo/dws-thinkingbox) (notre fork de travail), à côté du cadre d'origine et de sa couche d'isolation des processus sur [github.com/microsoft/thinkingbox](https://github.com/microsoft/thinkingbox). Définissez les simulations d'outils comme serveurs MCP, écrivez scénarios et cas de test en YAML, lancez `tb infer` contre ThinkingBox-Bench avec votre agent et utilisez les résultats comme barrières de CI et pistes d'audit. [2]

## En bref

- Le transcript, c'est ce que voient les utilisateurs. La preuve, c'est ce qui s'est réellement passé.
- Auditez les effets secondaires, pas le ton du transcript.
- Laissez le modèle de pointe écrire les contrôles. Laissez les modèles locaux, sur votre propre matériel, faire le travail.
- Chaque contrôle doit échouer avant que le travail ne commence.
- « Terminé » est le résultat d'une commande, jamais une phrase — et la barrière doit être au moins aussi stricte que la CI.
- Le périmètre reste une affaire humaine.
- Le journal de ce qui s'est passé sort gratuitement du processus. La raison pour laquelle une modification est autorisée, non — écrivez-la dans la spécification avant que le travail ne commence.

## Sources

1. Ko, Y., Keramati, A., Ferri, N., et al. (2026). _One Success Isn't Reliability: Thinkingbox, a Sandbox and Benchmark for Agents in Stateful Business Workflows._ arXiv:2608.19741. https://arxiv.org/abs/2608.19741
2. Microsoft (2026). _thinkingbox_ — framework for tools as MCP servers, agent runs and outcome evaluation. GitHub. https://github.com/microsoft/thinkingbox
3. Microsoft (2026). _thinkingbox-data_ — ThinkingBox-Bench v1.0 dataset and tool servers. GitHub. https://github.com/microsoft/thinkingbox-data
4. Yao, S., Shinn, N., Razavi, P., Narasimhan, K. (2024). _τ-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains._ arXiv:2406.12045. https://arxiv.org/abs/2406.12045
5. Jimenez, C. E., Yang, J., Wettig, A., Yao, S., Pei, K., Press, O., Narasimhan, K. (2023). _SWE-bench: Can Language Models Resolve Real-World GitHub Issues?_ arXiv:2310.06770. https://arxiv.org/abs/2310.06770
6. Cemri, M., Pan, M. Z., Yang, S., et al. (2025). _Why Do Multi-Agent LLM Systems Fail?_ arXiv:2503.13657. https://arxiv.org/abs/2503.13657
7. Regulation (EU) 2024/1689 (Artificial Intelligence Act), Art. 12 (Record-keeping) and Art. 14 (Human oversight). Official Journal of the European Union. https://eur-lex.europa.eu/eli/reg/2024/1689/oj

---

_Risto Anton Päärni — Founder, CEO, Lifetime Oy · Editor in Chief, Lifetime Scope Journal · risto.paarni@lifetime.fi_
