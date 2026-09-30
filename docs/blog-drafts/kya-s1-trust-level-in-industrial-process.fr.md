---
slug: kya-s1-trust-level-in-industrial-process
lang: fr
title: "KYA-S1 et BPMN 2.0 : le score de confiance pilote l'agent d'IA dans le processus industriel"
hero: "Comment le score de confiance décide si le travail revient à un agent ou à un humain – et comment, après coup, on élucide la faute et rejoue la décision."
visual: infographic
visual_src: docs/blog-drafts/img/kya-s1-trust-level-in-industrial-process.svg
visual_alt: "Organigramme : le score de confiance (TRS) choisit la voie, un jeton à usage unique est consommé au moment de l'exécution, en cas de défaillance le verrouillage renvoie la tâche à un humain, et le flux s'achève par l'attribution des fautes (FLT) et la relecture de la décision (PRV)."
seo_tags: [kya_trs, kya_lease_token, kya_fail_closed, kya_flt, kya_prv, bpmn_user_task]
series: "KYA-S1"
date: 2026-09-30
author: Risto Anton Päärni
Status: DRAFT
translation_of: kya-s1-trust-level-in-industrial-process.fi.md
ai_translated: true
note: "Visual not yet made — the SVG is a to-do."
---

# KYA-S1 et BPMN 2.0 : le score de confiance pilote l'agent d'IA dans le processus industriel

## Des discours au code de processus

Une fois la réglementation lue et les schémas d'architecture dessinés, la même question technique finit toujours par surgir : **comment construit-on cela concrètement ?**

Comment relier un moteur de processus BPMN 2.0 (Camunda ou Zeebe, par exemple), le score de confiance (TRS) vivant de la Spécification de sécurité KYA-S1 et les agents d'arrière-plan de DWS IQ, de sorte que le résultat soit ce commandement humain (HIC, _Human-in-Command_) réel qu'exige l'AI Act de l'UE ?

La réponse tient en ceci : le moteur de processus n'accorde jamais à l'agent une autorisation fixe. Chaque étape du travail est au contraire aiguillée de façon dynamique selon le niveau de confiance. Ce texte parcourt la chaîne de bout en bout : comment le score de confiance choisit la voie, comment le jeton à usage unique et le verrouillage en cas de défaillance comblent les brèches – et ce qui se passe lorsque, malgré tout, quelque chose tourne mal.

## Le score de confiance tranche la voie

Pour que la mise en œuvre technique reste lisible, les responsabilités sont réparties entre trois composants. Le **moteur BPMN 2.0** est le chef d'orchestre du processus de production : il assure le routage du flux de travail et la machine à états. Le **service KYA-S1 TRS** calcule en temps réel la confiance et le risque via l'interface du Lifetime World Model (LWM). Le **DWS IQ Skilled Agent** est l'agent d'arrière-plan qui exécute – un microservice ou un exécutant autonome.

Chaque fois qu'un processus métier ou de production tourne dans un environnement DWS IQ, le moteur BPMN 2.0 et KYA-S1 TRS dialoguent à chaque nœud critique.

**Évaluation préalable.** Avant d'entrer dans une tâche, le moteur BPMN déclenche un `Execution Listener`. Cet écouteur adresse une requête REST ou gRPC au KYA-S1 Trust Engine : _« DWS IQ Quality Agent X est-il autorisé à exécuter la tâche 'Laadunvarmistus_Erä_402' à cet instant précis ? »_ L'écouteur ne se contente pas de récupérer le score : il obtient le score et le jeton ensemble, avant la passerelle.

**Routage exclusif.** Le processus BPMN utilise la valeur renvoyée dans l'expression conditionnelle d'une passerelle XOR. Il existe deux voies :

- **BPMN Service Task (voie automatique) :** le processus se poursuit immédiatement sous forme de tâche automatisée, et le DWS IQ Skilled Agent exécute la transaction en une milliseconde.
- **BPMN User Task (validation humaine) :** le processus bifurque immédiatement vers un humain. La tâche apparaît dans le panneau de contrôle unique de l'opérateur (_Single Pane of Glass_), et le processus s'arrête en toute sécurité dans l'attente d'une validation humaine.

Concrètement, l'écouteur est placé sur le sequence flow qui mène à la passerelle et reçoit les exigences de la tâche sous forme de champs : le score de confiance requis (`requiredTrs`), la classe de risque de la tâche (`taskRiskTier`) et le délai maximal (`timeoutMs`, 500 ms). La condition qui ouvre la voie automatique comporte deux volets : la confiance est validée **et** le jeton a été obtenu. Aucun des deux ne suffit à lui seul.

La branche par défaut de la passerelle (`default`) pointe vers la voie humaine. Si la condition de la voie automatique n'est pas remplie, quelle qu'en soit la raison – score trop bas, jeton manquant ou délai dépassé –, la tâche revient à un humain.

Dans l'automatisation classique, un agent reçoit soit 0 %, soit 100 % d'autorité. Si quelque chose tourne mal, le seul recours est d'arrêter tout le système. En couplant le moteur BPMN 2.0 à KYA-S1 TRS, on obtient au contraire une **dynamique**. Quand tous les voyants sont au vert, les agents DWS IQ font tourner le processus industriel à plein régime. Si une anomalie survient dans l'environnement de l'agent ou si son autorisation expire, les scores de confiance chutent instantanément. Le système ne s'effondre pas : il _remet en douceur la décision entre des mains humaines_.

## Un seuil fixe ne suffit pas

La manière la plus simple d'illustrer la passerelle est un seuil fixe, par exemple `TRS >= 85`. Comme exemple pédagogique, c'est parlant – en production, c'est un risque de sécurité. La Spécification de sécurité KYA-S1 (§6.2, TRS-2) exige un seuil documenté sans l'arrimer à un chiffre précis ; la bonne valeur se fixe en fonction du secteur et de la gravité des conséquences de l'acte.

C'est pourquoi chaque tâche BPMN a son propre niveau d'exigence, un **seuil de risque propre à la tâche (TRS_req)**. Le seuil n'est pas une propriété du système, mais de **la gravité des conséquences de l'acte**. Les chiffres ci-dessous sont des propositions, non un canon :

| Niveau de risque                                       | TRS_req | Validité du jeton | Validation sous le seuil                  |
| ------------------------------------------------------ | ------- | ----------------- | ----------------------------------------- |
| Lecture, recherche, agrégation                         | 60      | 30 s              | Non – poursuivre avec journalisation      |
| Enregistrement qualité, mise à jour du statut d'un lot | 75      | 15 s              | Un opérateur                              |
| Transaction financière, écriture ERP, commande         | 85      | 5 s               | Opérateur + justification                 |
| Pilotage d'équipement, arrêt de ligne, SCADA           | 95      | 2 s               | Deux personnes (principe des quatre yeux) |

### Un score de confiance honnête est l'entrée de la passerelle

Une passerelle ne vaut que ce que vaut son entrée. Le score de confiance TRS ∈ [0, 100] est une somme pondérée dont on retranche des pénalités d'anomalie : `TRS = max(0, (w₁·IDV + w₂·BHM + w₃·REG + w₄·TRS_hist) − Δ_decay − Δ_anomaly)`.

- **IDV** – liaison d'agent à un responsable humain vérifié : l'identité et les droits d'accès de la personne derrière l'agent sont-ils valides et à jour ?
- **BHM** – modélisation comportementale en temps réel : des écarts ont-ils été détectés dans le comportement de l'agent par rapport à sa référence, par exemple au cours des 10 dernières minutes ?
- **REG** – manifeste et registre des capacités : l'enregistrement et la version du modèle de l'agent sont-ils à jour ?
- **TRS_hist** – la fiabilité de l'historique de l'agent.

Les pondérations par défaut proposées sont w₁ = 0,35, w₂ = 0,35, w₃ = 0,15 et w₄ = 0,15, dont la somme vaut 1,0.

**La convention de signe est sans ambiguïté.** Δ_decay et Δ_anomaly sont par définition des pénalités non négatives, que la formule soustrait. Une anomalie d'« impact −40 » signifie donc `Δ_anomaly = 40`. Une confusion coûte cher ici : si une implémentation injecte −40 tel quel dans la formule, la double négation **fait monter** le score de confiance à l'instant même de l'anomalie – et ouvre la passerelle précisément quand elle devrait se fermer.

## Le jeton à usage unique referme la brèche

S'il subsiste entre le contrôle de confiance et l'exécution proprement dite un intervalle, ne serait-ce que de quelques millisecondes, sans verrou, il se crée une **race condition**. L'agent peut perdre son autorisation juste avant l'exécution, et le processus la mènera tout de même à terme. La piste d'audit donnera l'impression que la passerelle a fonctionné. Ce n'est pas le cas. Le commandement humain n'est alors qu'une façade.

C'est pourquoi le Trust Engine ne renvoie pas un simple chiffre, mais un **jeton de bail atomique à usage unique** (_Lease Token_) : une clé signée cryptographiquement et limitée dans le temps, valable par exemple 5 secondes. Une tâche automatisée ne peut s'exécuter que si elle **consomme** un jeton valide au moment de l'exécution. C'est le seul point qui referme la race condition.

### Le diagramme n'est pas atomique – c'est la responsabilité du délégué

C'est ici que le diagramme paraît plus sûr que la réalité de l'exécution, et l'honnêteté commande de le dire sans détour. Le `inputParameter` du modèle BPMN **ne consomme pas le jeton**. Il se borne à copier une chaîne de caractères d'une variable de processus vers la portée de la tâche. Si le délégué de l'agent reçoit cette valeur et se met au travail, la race condition reste ouverte – elle s'est seulement déplacée du niveau BPMN vers l'intérieur du délégué, là où l'auditeur ne la voit pas.

L'atomicité est **le contrat du délégué**, non une propriété du XML. Les exigences sont au nombre de quatre :

1. La **première** opération du délégué est `consumeAndExecute(leaseToken, action)` – un appel unique qui, côté Trust Engine, valide le jeton, le marque comme consommé et autorise l'acte dans la même transaction (verrouillage de niveau `SELECT … FOR UPDATE` ou `compare-and-swap`).
2. À défaut d'une opération atomique unique, la consommation du jeton doit être la première étape **verrouillée** de la transaction, et tout travail à effets de bord doit suivre dans cette même transaction.
3. Un échec de consommation lève l'erreur `KYA_LEASE_INVALID`, qui renvoie la tâche à un humain via un événement de bordure. Aucune nouvelle tentative automatique.
4. Le délégué ne doit jamais lire le jeton pour décider lui-même s'il est encore valide. Seul le Trust Engine tranche la validité, au moment de la consommation.

Sans ce contrat, le diagramme décrit une intention, pas une garantie. C'est la mise en œuvre des points 1 à 4 qui rend la passerelle réelle – le XML ne fait que la rendre vérifiable.

L'exemple est rédigé au format Camunda 7, parce que ses extensions `camunda:` sont les plus lisibles. Dans Camunda 8, les équivalences sont directes : `camunda:delegateExpression` devient `zeebe:taskDefinition`, `camunda:inputOutput` devient `zeebe:ioMapping`, et les champs de formulaire deviennent du JSON Camunda Forms. La structure – le délai maximal comme verrouillage en cas de défaillance, l'événement de bordure lié au jeton, la branche par défaut vers l'humain et PRV comme tâche à part entière – se transpose telle quelle.

## Verrouillage en cas de défaillance

Si le KYA-S1 Trust Engine ne répond pas dans le délai imparti (plus de 500 ms) ou renvoie une erreur, le processus n'exécute jamais l'automatisation. Il est, sans exception, dirigé vers une validation humaine. Une panne du Trust Engine ralentit la production ; elle n'ouvre pas la passerelle.

Il en va de même pour un jeton déjà délivré. S'il est révoqué en cours d'exécution – par le frein d'urgence, par un retrait d'autorisation ou par expiration –, la tâche automatisée est interrompue, un rollback est effectué et la tâche passe directement à un humain. Lorsque le frein d'urgence (TC4) est actionné, le Lifetime World Model révoque immédiatement tous les jetons actifs – sur toute la chaîne d'agents à la fois.

La voie humaine obéit, elle aussi, à deux règles. Une validation sans justification n'est pas une supervision : le champ de justification est donc obligatoire. Et une tâche non traitée ne reste pas en suspens dans le silence : une minuterie de 15 minutes la fait remonter.

L'honnêteté d'un système se mesure dans les situations d'exception, non dans le fonctionnement normal :

| Situation d'exception                        | Effet sur le score de confiance | Conséquence dans le moteur BPMN                 |
| -------------------------------------------- | ------------------------------- | ----------------------------------------------- |
| Fonctionnement normal, tout est en ordre     | 90–100                          | Jeton délivré → automatique                     |
| Les droits du responsable changent (IDV)     | → 0 immédiatement               | Jeton révoqué → validation humaine              |
| Appel d'API inconnu / anomalie de code (BHM) | Δ_anomaly = −40                 | Score sous TRS_req → validation humaine         |
| Délai dépassé du moteur / connexion rompue   | aucune valeur                   | **Verrouillage** → immédiatement vers un humain |
| Le jeton expire                              | Le jeton devient invalide       | La tâche automatisée refuse → rollback & HIC    |
| Frein d'urgence (TC4)                        | Tous les jetons révoqués        | Toute la chaîne d'agents s'arrête immédiatement |

Qu'on remarque ce qui **manque** à cette matrice : pas une seule ligne où une anomalie mènerait à une exécution automatique. C'est le cœur de toute la conception. L'automatisme exige une preuve active ; la voie humaine n'exige rien.

## Quand quelque chose tourne mal : l'horloge des 72 heures

Si étanche que soit l'architecture technique, un environnement industriel doit accepter un fait, en toute honnêteté :

**Tôt ou tard, quelque chose tournera mal.**

L'IA modélisera mal une situation inhabituelle, la connexion à la base de données d'un système en arrière-plan se coupera en pleine transaction, un équipement de terrain injectera des données corrompues, ou un humain fera une saisie erronée.

Dans la Spécification KYA-S1, la question n'est pas de savoir si une faute se produira. La question est : **que se passe-t-il 72 heures après la clôture de l'incident ?**

Dans l'univers contractuel, le coût le plus lourd d'une faute n'est généralement pas la panne technique elle-même, mais les semaines, voire les mois, de « c'est vous », « non, c'est vous » entre juristes et fournisseurs pour établir qui portait la responsabilité du dommage.

L'**attribution limitée des fautes (FLT)** de KYA-S1 lève cette incertitude. Après un incident, le système produit une classification signée des responsabilités **dans les 72 heures suivant la clôture de l'incident** (FLT-2), selon cinq catégories :

| Classe de faute          | Description                                                                            | Imputation de la responsabilité              |
| ------------------------ | -------------------------------------------------------------------------------------- | -------------------------------------------- |
| **1. Model Fault**       | Hallucination du modèle de langage, erreur stochastique ou sortie inattendue           | Fournisseur du modèle / LLM Provider         |
| **2. Logic Fault**       | Erreur de code dans la logique applicative ou la structure de prompt de l'agent DWS IQ | Éditeur du logiciel d'agent                  |
| **3. Integration Fault** | Erreur de connexion API, latence réseau, délai dépassé ou coupure de base de données   | Fournisseur d'infrastructure / d'intégration |
| **4. Operator Fault**    | Saisie erronée ou incomplète d'un opérateur humain                                     | Donneur d'ordre / organisation utilisatrice  |
| **5. Policy Fault**      | Erreur de configuration des règles, d'une restriction ou d'une autorisation            | Architecte des règles / instance de sécurité |

Grâce à cette classification, le partage des responsabilités cesse d'être une querelle juridique épuisante pour devenir une simple requête précise.

## Rejouer la décision : la machine à remonter le temps de l'IA

Pour que l'attribution des fautes soit impartiale, il faut des preuves techniques solides. C'est là qu'entre en scène le Lifetime World Model, et c'est pourquoi l'enregistrement PRV – provenance de la décision et piste d'audit – constitue dans le modèle BPMN une tâche automatisée à part entière, et non un simple écouteur posé sur un unique sequence flow.

La différence est essentielle. Un écouteur sur un sequence flow ne couvre que ce seul chemin, si bien que la validation humaine échappe à la journalisation. Dans une tâche dédiée convergent **les deux** chemins – l'exécution par l'agent et la validation humaine –, et elle est en outre visible dans le diagramme ; l'auditeur n'a pas à chercher un écouteur enfoui dans le XML. Une décision humaine est un événement tout aussi auditable que celle d'un agent : la provenance de la décision humaine est précisément la preuve qu'exige l'Article 14.

Chaque fois qu'un agent DWS IQ exécute une tâche ou que celle-ci est renvoyée vers le panneau de contrôle, un instantané signé cryptographiquement est enregistré dans le World Model :

1. **Entrées d'origine :** exactement les données et le contexte fournis à l'agent.
2. **État de confiance :** le score de confiance de l'agent et son statut IDV au moment de l'exécution.
3. **Jeton utilisé :** la preuve que l'autorisation d'exécuter était valide et a été consommée de façon atomique.
4. **État du modèle :** version du modèle, paramètre de température et prompts système.

La tâche PRV consigne aussi par quelle voie la décision est passée (automatique ou validation humaine), le score de confiance au moment de la décision et le jeton utilisé. Ce n'est qu'ensuite que le processus prend fin – et le nom de son événement de fin dit pourquoi : l'exécution est arrivée à son terme, et la décision peut être rejouée.

C'est ce qui rend possible **PRV-2 (Decision replay)**. Même si le modèle d'IA lui-même est mis à jour ou remplacé dans deux ans, la chaîne de décision d'origine peut être reconstituée dans exactement les mêmes conditions aux limites et vérifiée des années plus tard.

Que savait l'agent ? En vertu de quelle autorisation a-t-il agi ? Comment est-il parvenu à son résultat ? PRV répond à ces questions – y compris lorsque c'est un humain qui a décidé.

## Briser l'effet domino : la terminaison de chaîne

Dans les environnements industriels multi-agents, un agent DWS IQ peut en lancer d'autres. Un agent de contrôle qualité lance un agent logistique, qui lance à son tour un agent de commande. Si une erreur est décelée dans la décision du premier agent, le plus grand danger est l'**effet domino** – la propagation de l'erreur dans les systèmes en arrière-plan.

La **terminaison de chaîne (TC4, _Trust Collapse Response & Chain Termination_)** de KYA-S1 brise la chaîne. Dans la maison, on l'appelle familièrement le frein d'urgence, le _leash snap_ (TC4-2).

1. **TC4-1** – un effondrement de la confiance est détecté à un seuil défini, et un événement signé est émis.
2. **TC4-2** – la chaîne est terminée de façon atomique : l'agent fautif, chaque agent en aval qu'il a lancé et toutes leurs sessions d'outils actives. Les jetons sont révoqués dans le même mouvement, de sorte qu'aucune tâche automatisée en cours ne peut plus écrire dans la base de données.
3. **TC4-4** – l'état complet de l'agent, son historique d'outils et sa trace de décision sont conservés au moment de la terminaison, aux fins d'enquête forensique. C'est là que l'attribution des fautes puise sa matière.
4. Le processus bascule vers le panneau de contrôle, sous la main d'un opérateur humain.

Qu'on note l'ordre : **mettre les preuves en lieu sûr avant de libérer la chaîne** – capture avant libération des ressources. Si TC4-4 n'est pas exécuté, l'attribution des fautes en 72 heures devient impossible – il ne reste que des conjectures.

## Conclusion : une gouvernance honnête de l'IA dans l'industrie

L'ensemble se résume en une chaîne :

1. **Une seule page signée :** le fastidieux dossier de sécurité obtient enfin une page à part pour l'agent d'IA.
2. **Une confiance technique :** le score de confiance n'est pas un indicateur sur un tableau de bord, mais le mécanisme même de condition et de pilotage du processus BPMN 2.0.
3. **L'humain commande vraiment :** chaque anomalie, coupure de connexion ou erreur d'autorisation renvoie la tâche à un humain, et le logiciel garantit que la supervision n'est pas de façade.
4. **Pas de race condition :** le jeton à usage unique garantit que l'agent ne peut rien exécuter sans un niveau de confiance frais et valide au moment de l'exécution.
5. **Une gestion de crise sans faille :** quand les choses tournent mal, l'attribution des fautes et l'historique du World Model maintiennent un partage des responsabilités limpide. Le journal atteste après coup qui a agi, avec quelles autorisations et pourquoi – y compris lorsque l'auteur était un humain.

C'est précisément pour cette raison que nous avons contribué à élaborer cette spécification : elle transforme l'obligation légale de commandement humain en une architecture logicielle fiable.

Une fois ces pièces en place, les agents d'IA cessent d'être un risque de sécurité incontrôlable – et deviennent ce pour quoi ils ont été conçus : **un étage d'exécution fiable et performant pour l'industrie.**

---

**Risto Anton Päärni**
_Fondateur et PDG, Lifetime Oy_
_Rédacteur en chef, Lifetime Scope Journal_
