---
slug: process-models-world-model-and-hic
lang: de
title: "Prozessmodelle, Lifetime World Model und menschliche Führung"
hero: "Wie industrielle Prozessmodelle, das Zustandsregister des LWM und menschliche Führung abstecken, was ein DWS IQ-Agent tun darf."
visual: infographic
visual_src: docs/blog-drafts/img/process-models-world-model-and-hic.svg
visual_alt: "Die Prozessmodelle ISA-95, BPMN, SysML, VSM und SIPOC verbinden DWS IQ-Agenten mit dem Zustandsregister des Lifetime World Model, unter menschlicher Führung"
seo_tags: [lwm, lwm_state_register, hic, isa_95, sysml, vsm, sipoc, skilled_agent]
date: 2026-09-30
author: Risto Anton Päärni
Status: DRAFT
translation_of: process-models-world-model-and-hic.fi.md
ai_translated: true
note: "Visual not yet made — the SVG is a to-do."
customer_value: "Ein Industrieunternehmen begrenzt schon heute mit dem Vertrauenswert, wann ein KI-Agent ohne Menschen handeln darf, und stoppt eine fehlerhafte Agentenkette mit einem einzigen Eingriff – der Kern der Eingriffs- und Stoppfähigkeit, die Artikel 14 des EU AI Act verlangt; das BPMN-Gateway, die Anbindung an die Prozessmodelle und die Entscheidungshistorie des Weltmodells sind hier als geplant beschrieben."
routes: [roadmap]
claims_checked: 2026-09-30
sources:
  - title: "World Models"
    authors: "David Ha, Jürgen Schmidhuber"
    year: 2018
    venue: "arXiv preprint arXiv:1803.10122"
    url: "https://arxiv.org/abs/1803.10122"
    type: academic
  - title: "Digital Twin AI: Opportunities and Challenges from Large Language Models to World Models"
    authors: "Rong Zhou, Dongping Chen, Zihan Jia, Yao Su, Yixin Liu, Yiwen Lu, Dongwei Shi, Yue Huang, Tianyang Xu, et al."
    year: 2026
    venue: "arXiv preprint arXiv:2601.01321"
    url: "https://arxiv.org/abs/2601.01321"
    type: academic
  - title: "Regulation (EU) 2024/1689 of the European Parliament and of the Council (Artificial Intelligence Act), Article 14: Human oversight"
    authors: "European Parliament and Council of the European Union"
    year: 2024
    venue: "Official Journal of the European Union"
    url: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj/eng"
    accessed_via: "https://github.com/camlsys/aireg-bench/blob/main/articles.txt"
    type: regulation
  - title: "ManufacturingOntologies: International Society of Automation 95 (ISA 95 / IEC 62264)"
    authors: "Digital Twin Consortium"
    year: "n.d."
    venue: "GitHub repository"
    url: "https://github.com/digitaltwinconsortium/ManufacturingOntologies"
    type: industry
  - title: "Enable an industrial dataspace on Azure"
    authors: "Microsoft"
    year: "n.d."
    venue: "Azure Architecture Center, Microsoft Learn"
    url: "https://learn.microsoft.com/azure/architecture/guide/iot/how-to-enable-industrial-dataspaces"
    type: industry
  - title: "BPMN primer; Service tasks; User tasks"
    authors: "Camunda"
    year: "n.d."
    venue: "Camunda 8 documentation (camunda-docs repository)"
    url: "https://github.com/camunda/camunda-docs/tree/main/docs/components/modeler/bpmn"
    type: industry
  - title: "OMG Systems Modeling Language (SysML) Version 2.1 Beta 2, Part 1: Language Specification"
    authors: "Object Management Group"
    year: 2026
    venue: "OMG Systems Modeling Community, SysML v2 Release repository"
    url: "https://github.com/Systems-Modeling/SysML-v2-Release/blob/master/doc/2a-OMG_Systems_Modeling_Language.pdf"
    type: standard
---

# Prozessmodelle, Lifetime World Model und menschliche Führung

Wer die Automatisierungsorganisation DWS IQ (`dws10.com`) mit dem Lifetime World Model (LWM) zusammenführt, schafft für die Industrie etwas ausgesprochen Wirkungsvolles: leistungsstarke Hintergrundagenten, gekoppelt an einen Weltzustand, der lückenlos gesteuert und überprüfbar ist. Dieser Beitrag bündelt drei Fragen zu einem einzigen Argument: Welche Methoden der industriellen Prozessbeschreibung braucht ein Agent, wie nutzt das Lifetime World Model sie als globales Zustandsregister und Gedächtnis, und wie legt die menschliche Führung (HIC) fest, was DWS IQ-Agenten darin tun dürfen?

## Ein intelligenter Motor braucht ein Weltmodell

Ein KI-Agent für sich allein – etwa ein DWS IQ Skilled Agent – ist nur ein „intelligenter Motor“. Um arbeiten zu können, braucht er ein Weltmodell (World Model): ein einheitliches Lagebild darüber, in welchem Zustand sich die Systeme befinden, wer was tut, mit welchen Befugnissen und mit welchen Folgen. [1][2]

Die Arbeitsteilung ist klar:

- **DWS IQ (`dws10.com`)** ist die ausführende Hand. Es stellt spezialisierte Hintergrundagenten (Skilled Agent) bereit, die Daten zusammenführen, Arbeitsabläufe steuern und industrielle Hintergrundprozesse ausführen.
- **Das Lifetime World Model** ist die wachende und erinnernde Hirnrinde. Als globales Zustandsregister und Gedächtnis hält es ein Echtzeit-Lagebild des Systems vor, dazu die KYA-S1-Identifizierung, also die Verifizierte menschliche Hauptverbindung (IDV), Vertrauenswert & Autorisierung (TRS) sowie die Entscheidungshistorie, also Entscheidungsherkunft & Prüfpfad (PRV).

Doch Motor und Hirnrinde sprechen ohne Dolmetscher nicht dieselbe Sprache. Hier schlagen die Prozessmodelle die Brücke: Sie übersetzen die Anforderungen von Geschäft und Produktion in eine Sprache, die der Mensch, die DWS IQ-Agenten und das Lifetime World Model gleichermaßen verstehen.

## Ein Hintergrundagent braucht menschliche Führung

KI-Agenten lassen sich zwei grundlegenden Lagern zuordnen, deren Aufsichtsbedarf und Einsatzumgebung sich von Grund auf unterscheiden. GitHub Copilot Agent ist der interaktive Programmierpartner des Entwicklers in der IDE: Er arbeitet auf der Mikroebene, schlägt Code vor und führt Tests unter den Augen des Entwicklers aus, und die menschliche Aufsicht ergibt sich bei jeder Aktion in der Oberfläche ganz von selbst. Eine Codeänderung wird vor dem Commit stets geprüft.

DWS IQ-Agenten dagegen sind Hintergrundagenten für Industrie und Data Warehouses. Sie arbeiten auf der Makroebene und führen mehrstufige Geschäfts- und Produktionsprozesse aus, die unmittelbar auf Lieferketten, Schnittstellen und Datenbanken durchschlagen. Deshalb brauchen sie eine eigene Steuerungsschicht, damit die Aufsicht auch im Hintergrundbetrieb erhalten bleibt.

Damit die Industrie sowohl einen hohen Automatisierungsgrad als auch die von Artikel 14 des EU AI Act geforderte menschliche Aufsicht [3] erreicht – in der Umsetzung von DWS die menschliche Führung (HIC) –, werden DWS IQ-Agenten über ein Zentrales Kontrollpanel im Stil von GitHub Copilot gesteuert:

- **Eine einzige Startansicht:** Der Mensch führt den Prozess. Er startet den Arbeitsablauf eines Agenten aus einer übersichtlichen Ansicht und verfolgt den Stand des Prozesses in Echtzeit.
- **Skilled Agent-Rollen:** Das Kontrollpanel leitet die einzelnen Schritte des Arbeitsablaufs an eigens dafür spezialisierte Agenten weiter – etwa an einen Agenten für Qualitätskontrolle, Datenanalyse oder Logistik –, stets nach den Anforderungen des jeweiligen Arbeitsschritts.
- **Lückenlose KYA-Bindung:** Jeder aus dem Kontrollpanel gestartete Agent folgt der KYA-S1 Sicherheitsspezifikation (Kenne deinen Agenten): Die Sicherheit kennt den Menschen hinter dem Agenten (IDV) und dessen Vertrauensstufe (TRS) und verfügt über eine sofort wirksame Notbremse (TC4) für die gesamte Agentenkette.

Menschliche Führung wirkt jedoch nicht im luftleeren Raum. Sie braucht eine Landkarte, auf der die Grenzen eingezeichnet werden. Diese Landkarte liefern die eigenen, seit langem etablierten Methoden der Industrie zur Prozessbeschreibung.

## Prozessmodelle: Wo der Agent andockt

Neben der RUP-Methodik (und den UML-Diagrammen) nutzt die Industrie eine Reihe weiterer etablierter Verfahren, um Prozesse zu beschreiben und zu modellieren. Welches passt, hängt davon ab, ob Geschäftsautomatisierung, der physische Produktionsfluss, Anlagen- und Systemarchitektur oder Qualitätsmanagement im Blick stehen. Für die Integration von KI-Agenten sind fünf entscheidend: ISA-95 auf der Ebene der Systemarchitektur, BPMN 2.0 auf der Ebene von Arbeitsabläufen und Automatisierung, SysML auf der Ebene cyber-physischer Systeme, VSM auf der Ebene der Material- und Informationsflüsse sowie SIPOC auf der Ebene von Qualitätsmanagement und Abgrenzung. Jedes zieht dem Agenten eine andere Grenze, und jedes ist auf eigene Weise mit dem Lifetime World Model verknüpft.

### ISA-95: Handlungsebene und vertikales Rückgrat des Vertrauens

ISA-95 (Integration von Unternehmens- und Leitsystemen, IEC 62264) ist kein klassisches Flussdiagramm, sondern der Industriestandard für Systemarchitektur und Prozessschnittstellen – die sogenannte Automatisierungspyramide. [4] Er legt fest, wie Informationen zwischen Unternehmensplanung (ERP), Fertigungssteuerung (MES), Prozessleit- und Überwachungsebene (SCADA) und Feldgeräten (PLC/IoT) fließen.

Für den Agenten definiert ISA-95 Handlungsebene und Befugnisse (Fähigkeitsmanifest & Register, REG, sowie IDV). Ein Agent auf MES-Ebene (Ebene 3) braucht völlig andere Sicherheits- und Reaktionszeiten als einer, der direkt in die SCADA-Steuerung eingreift (Ebene 2). [5]

Die größte Herausforderung der Industrie besteht darin, dass Informationen und Befugnisse zwischen den Steuerungsebenen abreißen. Deshalb wird das Lifetime World Model horizontal quer durch die gesamte ISA-95-Pyramide gelegt. Trifft ein DWS IQ-Agent auf MES-Ebene eine Entscheidung, prüft er im Lifetime World Model in Echtzeit die Handlungsebene und die menschliche Autorisierung (IDV/TRS), die aus der ERP/HR-Ebene (Ebene 4) stammt. Der Agent agiert nicht „blind“ in seinem eigenen Silo.

### BPMN 2.0: Ein ausführbarer Arbeitsablauf, der sich nach Vertrauen verzweigt

BPMN 2.0 ist der gemeinsame De-facto-Standard von Industrie und Softwarebranche für die Modellierung von Geschäftsprozessen und Arbeitsabläufen. BPMN-Diagramme sind keine bloßen Zeichnungen, sondern laufen in Prozess-Engines (etwa Camunda, Flowable oder Zeebe) unmittelbar als Code. [6] Das macht BPMN zur idealen Sprache für DWS IQ-Agenten: Im Arbeitsablauf lässt sich ein Schritt definieren, ein BPMN Service Task (automatische Spur), den der Agent im Hintergrund ausführt. [6] Weil das Diagramm ausführbar ist, lässt es sich zudem leicht an das zentrale Kontrollpanel anbinden.

BPMN-Diagramme legen die Wege fest, auf denen Agenten voranschreiten, und in ihre Bedingungszweige wird der lebendige Vertrauenswert (TRS) aus dem Lifetime World Model eingebunden:

- **TRS ≥ 85** → Der DWS IQ-Agent erledigt die Aufgabe automatisch (BPMN Service Task).
- **TRS < 85** → BPMN leitet die Aufgabe einem Menschen zur Freigabe zu (BPMN User Task, menschliche Bestätigung). [6]

Auch eine Abweichung leitet die Aufgabe an einen Menschen weiter: Stößt der Agent auf eine Abweichung, übergibt der BPMN-Prozess sie automatisch zur menschlichen Bestätigung. Diese Bestätigung erteilt eine befristete Autorisierung, die sofort in das Lifetime World Model zurückgeschrieben wird. Menschliche Führung ist damit kein gesonderter Prüfschritt außerhalb des Prozesses, sondern ein Zweig in seinem Inneren.

### SysML: Cyber-physische Sicherheitsgrenzen und Zustandsautomaten

SysML (Systemmodellierungssprache) ist eine universelle Sprache zur Modellierung komplexer cyber-physischer Systeme – Hardware, Software, Prozess und Mensch. Version 1 war ein UML-Profil; die 2025 von der OMG verabschiedete Version 2 baut auf einem eigenen KerML-Kern auf. [7] Eingesetzt wird sie vor allem in der Automobil- sowie der Luft- und Raumfahrtindustrie.

In der Schwerindustrie darf ein Agent eine physische Anlage niemals über deren Hardware-Grenzwerte hinaus fahren. SysML-Zustandsautomaten (_State Machine Diagrams_) definieren die physischen Sicherheitsgrenzen, die ein DWS IQ-Agent nicht überschreiten darf. [7] Erkennt der Agent eine Abweichung in der Produktion, fragt er den Zustand des Weltmodells ab. Meldet das Weltmodell einen Systemfehler, überführt das SysML-Modell den Prozess in einen kontrollierten sicheren Zustand (_Safe State_) und löst sofort die Notbremse von KYA-S1 (TC4) aus.

### VSM: Verschwendung beseitigen ohne Prüfungsrisiko

Die Wertstromanalyse (VSM) ist das wichtigste Werkzeug der Lean-Produktion, um Material- und Informationsflüsse vom Lieferanten bis zum Kunden sichtbar zu machen. Sie legt Verschwendung, Engpässe, Bestandswerte und Durchlaufzeiten eines Produktionsprozesses offen.

Für den Agenten zeigt die VSM präzise jene Stellen, an denen Informationen stocken oder Menschen routinemäßige Handarbeit leisten, etwa Auftragsbestätigungen oder die Eingabe von Qualitätsdaten – Stellen, an denen der Prozess stillsteht und auf eine manuelle Bestätigung oder Datenübertragung durch einen Menschen wartet. Sie dient als Investitionsrechnung dafür, an welcher Stelle im Prozess sich ein KI-Agent lohnt.

Werden manuelle Schritte durch Skilled Agents ersetzt, sorgt das Weltmodell dafür, dass Tempo nicht auf Kosten der Rückverfolgbarkeit geht. Weil jede Handlung eines DWS IQ-Agenten im Lifetime World Model gespeichert wird (PRV), lassen sich Durchlaufzeiten drastisch verkürzen, ohne die lückenlose Rückverfolgbarkeit einzubüßen, die Qualitätsmanagement und Regulierung verlangen.

### SIPOC: Die Grenze zwischen Eingabe und Ergebnis

SIPOC (Suppliers, Inputs, Process, Outputs, Customers) ist die Prozesslandkarte auf hoher Ebene, mit der Six-Sigma-Qualitätsexperten arbeiten: eine schlichte Tabelle, die auf eine Seite passt und Anfang und Ende eines Prozesses präzise festlegt.

SIPOC definiert die kritischen Eingaben (_Inputs_) und Ergebnisse (_Outputs_). Wird ein KI-Agent Teil des Prozesses, stellt SIPOC sicher, dass die dem Agenten zugeführten Daten und das von ihm gelieferte Ergebnis die Prüfanforderungen der KYA-Spezifikation erfüllen (PRV und Zeitbegrenzte Fehlerattribuierung, FLT). So sichert es die Qualität der Ein- und Ausgabedaten des Agenten sowie deren Grenzen, bevor die Umsetzung beginnt.

## Der Lebenszyklus: RUP-Phasen unter menschlicher Führung

Die einzelnen Prozessmodelle begrenzen, was ein Agent tut. Das Ganze braucht darüber hinaus einen Lebenszyklus. Die Industrie macht die Zusammenarbeit mit Agenten berechenbar und akzeptiert, indem sie geschäftliche Anwendungsfälle (Use Cases), den sie umsetzenden Workflow V2 und die Active Ontology verbindet – die Geschäftsobjekte, ihre Beziehungen, Regeln und zulässigen Aktionen. Der Rational Unified Process (RUP) und UML-Aktivitätsdiagramme beschreiben dieses Ganze als gesteuerten Lebenszyklus, und UML liefert zudem Struktur- und Sequenzdiagramme für die Kommunikation zwischen Agenten.

- **Inception (Konzeption):** Der Mensch erfasst den geschäftlichen Anwendungsfall, sein Ziel und seinen Rahmen im Kontrollpanel. Die Führung beginnt beim Menschen.
- **Elaboration (Entwurf):** Workflow V2 gliedert den Anwendungsfall in Schritte und wählt die dafür nötigen Skilled Agent-Rollen aus; das Prozessdiagramm wird einem Menschen vor dem Start vorgelegt.
- **Construction (Konstruktion):** Die Agenten führen die Arbeitsschritte innerhalb der Grenzen der Active Ontology aus – nur zulässige Aktionen an zulässigen Geschäftsobjekten. An kritischen Kontrollpunkten (_Gateways_) fordert das System eine menschliche Bestätigung an, bevor es zum nächsten Schritt übergeht.
- **Transition (Übergabe):** Der Mensch nimmt das Ergebnis ab, und eine der KYA-S1 Sicherheitsspezifikation entsprechende Entscheidungsspur wird automatisch für spätere Prüfungen gespeichert.

## Das Ergebnis: Industrieautomatisierung, die sich steuern und skalieren lässt

Wird das Lifetime World Model über diese Prozessmodelle in die `dws10.com`-Umgebung eingebracht, hat das zwei Folgen.

Erstens führt der Mensch das Ganze aus einer einzigen Ansicht. Im zentralen Kontrollpanel sind die BPMN-Arbeitsabläufe, die laufenden DWS IQ-Agenten und ihre KYA-Vertrauensstufen gleichermaßen zu sehen.

Zweitens verändert sich die Beilegung von Streitfällen grundlegend. Kommt es zu einem Produktionsstillstand oder einem Fehler, zeigen die Zeitbegrenzte Fehlerattribuierung (FLT) von KYA-S1 und die Historie des Weltmodells binnen 72 Stunden, ob ein Verbindungsfehler eines Geräts, eine Abweichung des Modells oder eine fehlerhafte Eingabe eines Menschen vorlag.

Die Prozessmodelle ziehen die Grenzen, das Lifetime World Model erinnert sich, was innerhalb dieser Grenzen geschah, und der Mensch entscheidet, wo sie verlaufen. Indem DWS IQ-Hintergrundagenten das vertraute und sichere Steuerungsmodell von GitHub Copilot erhalten und Arbeitsabläufe in den RUP-Prozessdiagrammen beschrieben werden, die der Industrie seit jeher ans Herz gewachsen sind, wird aus der Pflicht, KI zu führen, statt bloßem Gesetzestext ein klarer, praktischer und skalierbarer Wettbewerbsvorteil.

## Quellen

1. Ha, D., & Schmidhuber, J. (2018). World Models. arXiv preprint arXiv:1803.10122. <https://arxiv.org/abs/1803.10122>
2. Zhou, R., Chen, D., Jia, Z., Su, Y., Liu, Y., Lu, Y., Shi, D., Huang, Y., Xu, T., et al. (2026). Digital Twin AI: Opportunities and Challenges from Large Language Models to World Models. arXiv preprint arXiv:2601.01321. <https://arxiv.org/abs/2601.01321>
3. European Parliament and Council of the European Union (2024). Regulation (EU) 2024/1689 (Artificial Intelligence Act), Article 14: Human oversight. Official Journal of the European Union. <https://eur-lex.europa.eu/eli/reg/2024/1689/oj/eng>
4. Digital Twin Consortium (n.d.). ManufacturingOntologies: International Society of Automation 95 (ISA 95 / IEC 62264). GitHub. <https://github.com/digitaltwinconsortium/ManufacturingOntologies>
5. Microsoft (n.d.). Enable an industrial dataspace on Azure. Azure Architecture Center, Microsoft Learn. <https://learn.microsoft.com/azure/architecture/guide/iot/how-to-enable-industrial-dataspaces>
6. Camunda (n.d.). BPMN primer; Service tasks; User tasks. Camunda 8 documentation. <https://github.com/camunda/camunda-docs/tree/main/docs/components/modeler/bpmn>
7. Object Management Group (2026). OMG Systems Modeling Language (SysML) Version 2.1 Beta 2, Part 1: Language Specification. <https://github.com/Systems-Modeling/SysML-v2-Release/blob/master/doc/2a-OMG_Systems_Modeling_Language.pdf>
