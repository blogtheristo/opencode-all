---
slug: kya-s1-trust-level-in-industrial-process
lang: de
title: "KYA-S1 und BPMN 2.0: Wie der Vertrauenswert einen KI-Agenten durch den Industrieprozess steuert"
hero: "Wie der Vertrauenswert entscheidet, ob ein Agent oder ein Mensch die Arbeit erledigt – und wie sich Fehler und Entscheidung im Nachhinein rekonstruieren lassen."
visual: infographic
visual_src: docs/blog-drafts/img/kya-s1-trust-level-in-industrial-process.svg
visual_alt: "Flussdiagramm: Der Vertrauenswert (TRS) wählt die Spur, ein Einmal-Token wird im Moment der Ausführung verbraucht, im Fehlerfall leitet die fehlersichere Sperre die Aufgabe an einen Menschen, am Ende stehen Fehlerattribuierung (FLT) und Wiedergabe der Entscheidung (PRV)."
seo_tags: [kya_trs, kya_lease_token, kya_fail_closed, kya_flt, kya_prv, bpmn_user_task]
series: "KYA-S1"
date: 2026-09-30
author: Risto Anton Päärni
Status: DRAFT
translation_of: kya-s1-trust-level-in-industrial-process.fi.md
ai_translated: true
note: "Visual not yet made — the SVG is a to-do."
customer_value: "Der Vertrauenswert und der Kettenabbruch (die Notbremse) begrenzen schon heute, wann ein KI-Agent ohne Menschen handeln darf, und stoppen eine fehlerhafte Agentenkette mit einem einzigen Eingriff; das BPMN-Gateway, das Einmal-Token und die Entscheidungswiederholung sind hier als geplant beschrieben."
routes: [roadmap]
claims_checked: 2026-09-30
sources:
  - title: "Regulating AI Agents"
    authors: "Kathrin Gardhouse, Amin Oueslati, Noam Kolt"
    year: 2026
    venue: "arXiv preprint arXiv:2603.23471"
    url: "https://arxiv.org/abs/2603.23471"
    type: academic
  - title: "Before the Tool Call: Deterministic Pre-Action Authorization for Autonomous AI Agents"
    authors: "Uchi Uchibeke"
    year: 2026
    venue: "arXiv preprint arXiv:2603.20953"
    url: "https://arxiv.org/abs/2603.20953"
    type: academic
  - title: "Learning Selective LLM Autonomy from Copilot Feedback in Enterprise Customer Support Workflows"
    authors: "Nikita Borovkov, Elisei Rykov, Olga Tsymboi, Sergei Filimonov, Nikita Surnachev, Dmitry Bitman, Anatolii Potapov"
    year: 2026
    venue: "arXiv preprint arXiv:2604.23855"
    url: "https://arxiv.org/abs/2604.23855"
    type: academic
  - title: "AIP: Agent Identity Protocol for Verifiable Delegation Across MCP and A2A"
    authors: "Sunil Prakash"
    year: 2026
    venue: "arXiv preprint arXiv:2603.24775"
    url: "https://arxiv.org/abs/2603.24775"
    type: academic
  - title: "Closing the AI Accountability Gap: Defining an End-to-End Framework for Internal Algorithmic Auditing"
    authors: "Inioluwa Deborah Raji, Andrew Smart, Rebecca N. White, Margaret Mitchell, Timnit Gebru, Ben Hutchinson, Jamila Smith-Loud, Daniel Theron, Parker Barnes"
    year: 2020
    venue: "Proceedings of the Conference on Fairness, Accountability, and Transparency (FAT* '20), ACM"
    url: "https://doi.org/10.1145/3351095.3372873"
    type: academic
---

# KYA-S1 und BPMN 2.0: Wie der Vertrauenswert einen KI-Agenten durch den Industrieprozess steuert

## Vom Reden zum Prozesscode

Ist die Regulierung gelesen und sind die Architekturskizzen gezeichnet, stellt sich stets dieselbe technische Frage: **Wie setzt man das konkret um?**

Wie verbindet man eine BPMN 2.0-Prozess-Engine (etwa Camunda oder Zeebe), den laufend aktualisierten Vertrauenswert (TRS) der KYA-S1 Sicherheitsspezifikation und die Hintergrundagenten von DWS IQ so, dass am Ende jene echte menschliche Führung (HIC, _Human-in-Command_) steht, die der EU AI Act verlangt? [1]

Die Antwort: Die Prozess-Engine erteilt dem Agenten keine feste Berechtigung. Stattdessen wird jeder Arbeitsschritt dynamisch nach dem Grad des Vertrauens geleitet. Dieser Beitrag verfolgt die Kette von Anfang bis Ende: wie der Vertrauenswert die Spur wählt, wie das Einmal-Token und die fehlersichere Sperre die Lücken schließen – und was geschieht, wenn trotzdem etwas schiefgeht.

## Der Vertrauenswert entscheidet über die Spur

Damit die technische Umsetzung übersichtlich bleibt, verteilt sich die Verantwortung auf drei Komponenten. Die **BPMN 2.0-Engine** ist der Dirigent des Produktionsprozesses: Sie übernimmt das Routing des Workflows und die Zustandsmaschine. Der **KYA-S1 TRS-Dienst** bewertet Vertrauen und Risiko in Echtzeit über die Schnittstelle zum Lifetime World Model (LWM). Der **DWS IQ Skilled Agent** ist der ausführende Hintergrundagent – ein Microservice oder ein autonomer Ausführer.

Läuft in einer DWS IQ-Umgebung ein Geschäfts- oder Produktionsprozess, stimmen sich BPMN 2.0-Engine und KYA-S1 TRS an jedem kritischen Knotenpunkt ab.

**Vorabprüfung.** Bevor die BPMN-Engine eine Aufgabe betritt, löst sie einen `Execution Listener` aus. Dieser richtet eine REST- oder gRPC-Anfrage an die KYA-S1 Trust Engine: _„Ist DWS IQ Quality Agent X berechtigt, die Aufgabe 'Laadunvarmistus_Erä_402' genau jetzt auszuführen?“_ Der Listener holt nicht bloß den Wert ab, sondern Wert und Token gemeinsam – vor dem Gateway. [2]

**Exklusives Routing.** Der BPMN-Prozess verwendet den zurückgegebenen Wert im Bedingungsausdruck eines XOR-Gateways. Es gibt zwei Spuren:

- **BPMN Service Task (automatische Spur):** Der Prozess läuft sofort als automatisierte Aufgabe weiter, und der DWS IQ Skilled Agent wickelt die Transaktion in einer Millisekunde ab.
- **BPMN User Task (menschliche Freigabe):** Der Prozess verzweigt sofort zu einem Menschen. Die Aufgabe erscheint im zentralen Kontrollpanel des Operators (_Single Pane of Glass_), und der Prozess hält sicher an, bis ein Mensch sie freigibt.

In der Praxis sitzt der Listener auf dem Sequence Flow, der zum Gateway führt, und erhält die Anforderungen der Aufgabe als Felder: den geforderten Vertrauenswert (`requiredTrs`), die Risikoklasse der Aufgabe (`taskRiskTier`) und das Zeitlimit (`timeoutMs`, 500 ms). Die Bedingung für die automatische Spur ist zweiteilig: Das Vertrauen ist bestätigt, **und** ein Token liegt vor. Keines von beiden genügt allein.

Der Standardzweig des Gateways (`default`) weist auf die menschliche Spur. Ist die Bedingung für die automatische Spur nicht erfüllt, gleich aus welchem Grund – niedriger Wert, fehlendes Token oder Zeitüberschreitung –, geht die Aufgabe an einen Menschen.

In der herkömmlichen Automatisierung erhält ein Agent entweder 0 % oder 100 % Befugnis. Geht etwas schief, bleibt nur, das gesamte System abzuschalten. Die Kopplung von BPMN 2.0-Engine und KYA-S1 TRS schafft dagegen **Dynamik**. Stehen alle Variablen auf Grün, betreiben die DWS IQ-Agenten den Industrieprozess mit voller Leistung. Tritt im Umfeld des Agenten eine Anomalie auf oder läuft seine Berechtigung ab, fallen die Vertrauenswerte augenblicklich. Das System stürzt nicht ab, sondern _übergibt die Entscheidung sanft an einen Menschen_. [3]

## Ein fester Schwellenwert genügt nicht

Am einfachsten lässt sich das Gateway mit einem festen Schwellenwert veranschaulichen, etwa `TRS >= 85`. Als Lehrbeispiel taugt das – in der Produktion ist es ein Sicherheitsrisiko. Die KYA-S1 Sicherheitsspezifikation (§6.2, TRS-2) verlangt einen dokumentierten Schwellenwert, legt aber keine bestimmte Zahl fest; der richtige Wert richtet sich nach der Branche und nach der Schwere der Folgen einer Handlung.

Deshalb hat jede BPMN-Aufgabe ihr eigenes Anforderungsniveau, einen **aufgabenspezifischen Risikoschwellenwert (TRS_req)**. Der Schwellenwert ist keine Eigenschaft des Systems, sondern der **Folgenschwere der Handlung**. Die folgenden Zahlen sind Vorschläge, kein Kanon:

| Risikostufe                                         | TRS_req | Gültigkeit des Tokens | Freigabe unterhalb der Schwelle    |
| --------------------------------------------------- | ------- | --------------------- | ---------------------------------- |
| Lesen, Suchen, Zusammenstellen                      | 60      | 30 s                  | Nein – weiter mit Protokollierung  |
| Qualitätsbuchung, Statusaktualisierung einer Charge | 75      | 15 s                  | Ein Operator                       |
| Finanztransaktion, ERP-Buchung, Bestellung          | 85      | 5 s                   | Operator + Begründung              |
| Anlagensteuerung, Linienstopp, SCADA                | 95      | 2 s                   | Zwei Personen (Vier-Augen-Prinzip) |

### Ein ehrlicher Vertrauenswert ist die Eingabe des Gateways

Ein Gateway ist nur so gut wie seine Eingabe. Der Vertrauenswert TRS ∈ [0, 100] ergibt sich aus einer gewichteten Summe, von der Anomalieabzüge subtrahiert werden: `TRS = max(0, (w₁·IDV + w₂·BHM + w₃·REG + w₄·TRS_hist) − Δ_decay − Δ_anomaly)`.

- **IDV** – Verifizierte menschliche Hauptverbindung: Sind Identität und Zugriffsrechte der Person hinter dem Agenten gültig und aktuell?
- **BHM** – Laufzeit-Verhaltensmodellierung: Wurden im Verhalten des Agenten Abweichungen gegenüber seiner Baseline festgestellt, etwa in den letzten 10 Minuten?
- **REG** – Fähigkeitsmanifest & Register: Sind Registrierung und Modellversion des Agenten auf dem neuesten Stand?
- **TRS_hist** – die Verlässlichkeit der bisherigen Bilanz des Agenten.

Die vorgeschlagenen Standardgewichte sind w₁ = 0,35, w₂ = 0,35, w₃ = 0,15 und w₄ = 0,15; ihre Summe beträgt 1,0.

**Die Vorzeichenkonvention ist eindeutig.** Δ_decay und Δ_anomaly sind per Definition nicht-negative Abzüge, und die Formel zieht sie ab. Eine Anomalie mit „Wirkung −40“ bedeutet also `Δ_anomaly = 40`. Eine Verwechslung ist hier teuer: Setzt eine Implementierung −40 direkt in die Formel ein, **erhöht** die doppelte Negation den Vertrauenswert genau im Moment der Anomalie – und öffnet das Gateway ausgerechnet dann, wenn es sich schließen müsste.

## Das Einmal-Token schließt die Lücke

Klafft zwischen der Vertrauensprüfung und der eigentlichen Ausführung auch nur eine Lücke von wenigen Millisekunden ohne Sperre, entsteht eine **Race Condition**. Der Agent kann seine Berechtigung unmittelbar vor der Ausführung verlieren, und der Prozess führt sie dennoch durch. Der Prüfpfad erweckt den Eindruck, das Gateway habe funktioniert. Das hat es nicht. Die menschliche Führung ist dann nur Schein.

Deshalb liefert die Trust Engine keine bloße Zahl, sondern ein **Atomares Einmal-Autorisierungs-Token** (_Lease Token_): einen kryptografisch signierten, zeitgebundenen Schlüssel, der beispielsweise 5 Sekunden gilt. Eine automatisierte Aufgabe kann nur dann ausgeführt werden, wenn sie im Moment der Ausführung ein gültiges Token **verbraucht**. [4] Das ist die einzige Stelle, die die Race Condition schließt.

### Das Diagramm ist nicht atomar – dafür haftet der Delegate

An dieser Stelle wirkt das Diagramm sicherer als die Wirklichkeit zur Laufzeit, und der Ehrlichkeit halber muss das offen ausgesprochen werden. Der `inputParameter` des BPMN-Modells **verbraucht das Token nicht**. Er kopiert lediglich eine Zeichenkette aus einer Prozessvariablen in den Scope der Aufgabe. Nimmt der Delegate des Agenten diesen Wert entgegen und beginnt mit der Arbeit, ist die Race Condition weiterhin offen – sie ist bloß von der BPMN-Ebene in den Delegate gewandert, wo der Prüfer sie nicht sieht.

Atomarität ist **der Vertrag des Delegates**, keine Eigenschaft des XML. Es gibt vier Anforderungen:

1. Die **erste** Operation des Delegates ist `consumeAndExecute(leaseToken, action)` – ein einziger Aufruf, der auf Seiten der Trust Engine das Token validiert, es als verbraucht markiert und die Handlung in derselben Transaktion autorisiert (Sperre auf dem Niveau von `SELECT … FOR UPDATE` oder `compare-and-swap`).
2. Steht keine einzelne atomare Operation zur Verfügung, muss der Verbrauch des Tokens der erste **gesperrte** Schritt der Transaktion sein, und alle Arbeit mit Seiteneffekten muss danach in derselben Transaktion folgen.
3. Ein fehlgeschlagener Verbrauch wirft den Fehler `KYA_LEASE_INVALID`, der die Aufgabe über ein Randereignis an einen Menschen leitet. Kein automatischer Wiederholungsversuch.
4. Der Delegate darf das Token niemals lesen, um selbst zu entscheiden, ob es noch gültig ist. Über die Gültigkeit entscheidet allein die Trust Engine im Moment des Verbrauchs. [4]

Ohne diesen Vertrag beschreibt das Diagramm eine Absicht, keine Garantie. Erst die Umsetzung der Punkte 1–4 macht das Gateway echt – das XML macht es lediglich überprüfbar.

Das Beispiel ist im Camunda-7-Format geschrieben, weil dessen `camunda:`-Erweiterungen am besten lesbar sind. In Camunda 8 sind die Entsprechungen geradlinig: Aus `camunda:delegateExpression` wird `zeebe:taskDefinition`, aus `camunda:inputOutput` wird `zeebe:ioMapping`, und die Formularfelder werden zu Camunda Forms JSON. Die Struktur – das Zeitlimit als fehlersichere Sperre, das Randereignis für das Token, der Standardzweig zum Menschen und PRV als eigene Aufgabe – lässt sich unverändert übertragen.

## Fehlersichere Sperre (fail-closed)

Antwortet die KYA-S1 Trust Engine nicht innerhalb des Zeitlimits (über 500 ms) oder meldet sie einen Fehler, führt der Prozess die Automatisierung niemals aus. Er wird ausnahmslos zur menschlichen Freigabe geleitet. Ein Ausfall der Trust Engine bremst die Produktion; er öffnet nicht das Gateway. [2]

Dasselbe gilt für ein bereits ausgestelltes Token. Wird es mitten in der Ausführung widerrufen – wegen der Notbremse, eines Entzugs der Berechtigung oder des Ablaufs –, wird die automatisierte Aufgabe abgebrochen, ein Rollback durchgeführt und die Aufgabe direkt an einen Menschen übergeben. Wird die Notbremse (TC4) gezogen, widerruft das Lifetime World Model sofort alle aktiven Token – in der gesamten Agentenkette auf einen Schlag.

Auch für die menschliche Spur gelten zwei Regeln. Eine Freigabe ohne Begründung ist keine Aufsicht, deshalb ist das Begründungsfeld Pflicht. Und eine unquittierte Aufgabe bleibt nicht stillschweigend liegen: Ein 15-Minuten-Timer eskaliert sie.

Die Ehrlichkeit eines Systems zeigt sich in den Ausnahmen, nicht im Normalbetrieb:

| Ausnahmesituation                                    | Wirkung auf den Vertrauenswert | Folge in der BPMN-Engine                            |
| ---------------------------------------------------- | ------------------------------ | --------------------------------------------------- |
| Normalbetrieb, alles in Ordnung                      | 90–100                         | Token wird ausgestellt → automatisch                |
| Rechte der verantwortlichen Person ändern sich (IDV) | → 0 sofort                     | Token wird widerrufen → menschliche Freigabe        |
| Unbekannter API-Aufruf / Code-Anomalie (BHM)         | Δ_anomaly = −40                | Wert unter TRS_req → menschliche Freigabe           |
| Engine-Timeout / Verbindung unterbrochen             | kein Wert                      | **Fehlersichere Sperre** → sofort an einen Menschen |
| Token läuft ab                                       | Token wird ungültig            | Automatisierte Aufgabe lehnt ab → Rollback & HIC    |
| Notbremse (TC4)                                      | Alle Token werden widerrufen   | Gesamte Agentenkette hält sofort an                 |

Man beachte, was in der Matrix **fehlt**: keine einzige Zeile, in der eine Ausnahme zur automatischen Ausführung führt. Das ist der Kern des gesamten Entwurfs. Die Automatik verlangt einen aktiven Nachweis; der menschliche Pfad verlangt nichts.

## Wenn etwas schiefgeht: die 72-Stunden-Uhr

Wie dicht die technische Architektur auch sein mag – in einer Industrieumgebung muss man eine ehrliche Tatsache akzeptieren:

**Früher oder später geht etwas schief.**

Die KI modelliert eine ungewöhnliche Situation falsch, die Datenbankverbindung eines Backend-Systems reißt mitten in einer Transaktion ab, ein Feldgerät speist korrupte Daten ein, oder ein Mensch macht eine falsche Eingabe.

In der KYA-S1-Spezifikation lautet die Frage nicht, ob ein Fehler auftritt. Sie lautet: **Was geschieht 72 Stunden nachdem der Vorfall abgeschlossen wurde?**

In der Welt der Verträge sind die größten Kosten eines Fehlers meist nicht der technische Defekt selbst, sondern das wochen- oder monatelange Hin und Her zwischen Juristen und Lieferanten – „Sie waren es“, „nein, Sie“ – darüber, wer für den Schaden verantwortlich war.

Die **Zeitbegrenzte Fehlerattribuierung (FLT)** von KYA-S1 beseitigt diese Unsicherheit. Nach einem Vorfall erstellt das System eine signierte Verantwortungsklassifizierung **innerhalb von 72 Stunden nach Abschluss des Vorfalls** (FLT-2), in einer von fünf Kategorien:

| Fehlerklasse             | Beschreibung                                                                     | Zuordnung der Verantwortung           |
| ------------------------ | -------------------------------------------------------------------------------- | ------------------------------------- |
| **1. Model Fault**       | Halluzination des Sprachmodells, stochastischer Fehler oder unerwartete Ausgabe  | Modellanbieter / LLM Provider         |
| **2. Logic Fault**       | Programmierfehler in der Anwendungslogik oder Prompt-Struktur des DWS IQ-Agenten | Anbieter der Agentensoftware          |
| **3. Integration Fault** | API-Verbindungsfehler, Netzwerklatenz, Timeout oder Datenbankausfall             | Infrastruktur- / Integrationsanbieter |
| **4. Operator Fault**    | Fehlerhafte oder unvollständige Eingabe eines menschlichen Operators             | Auftraggeber / Anwenderorganisation   |
| **5. Policy Fault**      | Konfigurationsfehler in Regelwerk, Einschränkung oder Berechtigung               | Regelarchitekt / Sicherheitsgremium   |

Dank dieser Klassifizierung ist die Verteilung der Verantwortung kein zermürbender juristischer Streit mehr, sondern eine präzise Abfrage.

## Wiedergabe der Entscheidung: die Zeitmaschine der KI

Damit die Fehlerattribuierung unparteiisch erfolgen kann, braucht es harte technische Beweise. [5] Hier kommt das Lifetime World Model ins Spiel, und deshalb ist die PRV-Aufzeichnung – Entscheidungsherkunft & Prüfpfad – im BPMN-Modell eine eigene automatisierte Aufgabe und nicht bloß ein Listener auf einem einzelnen Sequence Flow.

Der Unterschied ist wesentlich. Ein Listener auf einem Sequence Flow deckt nur diesen einen Pfad ab, sodass die menschliche Freigabe nicht protokolliert wird. In einer eigenen Aufgabe laufen **beide** Pfade zusammen – die Ausführung durch den Agenten und die menschliche Freigabe –, und sie ist zudem im Diagramm sichtbar; der Prüfer muss nicht nach einem im XML versteckten Listener suchen. Eine menschliche Entscheidung ist ebenso ein prüfpflichtiges Ereignis wie die eines Agenten: Die menschliche Entscheidungsherkunft ist genau der Nachweis, den Artikel 14 verlangt.

Jedes Mal, wenn ein DWS IQ-Agent eine Aufgabe ausführt oder sie ins Kontrollpanel geleitet wird, wird im World Model eine kryptografisch signierte Momentaufnahme gespeichert [2]:

1. **Ursprüngliche Eingaben:** exakt die Daten und der Kontext, die dem Agenten zugeführt wurden.
2. **Vertrauensstatus:** Vertrauenswert und IDV-Status des Agenten zum Zeitpunkt der Ausführung.
3. **Verwendetes Token:** der Nachweis, dass die Ausführungserlaubnis gültig war und atomar verbraucht wurde.
4. **Modellzustand:** Modellversion, Temperaturparameter und System-Prompts.

Die PRV-Aufgabe hält außerdem fest, über welche Spur die Entscheidung kam (automatisch oder menschliche Freigabe), den Vertrauenswert zum Entscheidungszeitpunkt und das verwendete Token. Erst danach endet der Prozess – und der Name seines Endereignisses sagt, warum: Die Ausführung ist abgeschlossen, und die Entscheidung lässt sich wiedergeben.

Das ermöglicht **PRV-2 (Decision replay)**. Selbst wenn das eigentliche KI-Modell in zwei Jahren aktualisiert oder ausgetauscht wird, lässt sich die ursprüngliche Entscheidungskette unter exakt denselben Randbedingungen rekonstruieren und noch Jahre später verifizieren.

Was wusste der Agent? Mit welcher Befugnis handelte er? Wie kam er zu seinem Ergebnis? PRV beantwortet diese Fragen – auch dann, wenn ein Mensch entschieden hat.

## Den Dominoeffekt unterbrechen: der Kettenabbruch

In industriellen Multi-Agenten-Umgebungen kann ein DWS IQ-Agent weitere Agenten starten. Ein Qualitätskontroll-Agent startet einen Logistik-Agenten, der wiederum einen Bestell-Agenten startet. Wird in der Entscheidung des ersten Agenten ein Fehler entdeckt, ist die größte Gefahr ein **Dominoeffekt** – die Vervielfältigung des Fehlers in den Backend-Systemen. [1]

Der **Kettenabbruch (TC4, _Trust Collapse Response & Chain Termination_)** von KYA-S1 unterbricht die Kette. Im Haus heißt er umgangssprachlich Notbremse, _leash snap_ (TC4-2).

1. **TC4-1** – Ein Vertrauenseinbruch wird bei einem definierten Schwellenwert erkannt, und ein signiertes Ereignis wird ausgesendet.
2. **TC4-2** – Die Kette wird atomar beendet: der fehlbare Agent, jeder von ihm gestartete nachgelagerte Agent und alle ihre aktiven Tool-Sitzungen. Zugleich werden die Token widerrufen, sodass keine laufende automatisierte Aufgabe mehr in die Datenbank schreiben kann.
3. **TC4-4** – Der gesamte Zustand des Agenten, seine Tool-Historie und seine Entscheidungsspur werden im Moment der Beendigung für die forensische Untersuchung gesichert. Daraus bezieht die Fehlerattribuierung ihr Material.
4. Der Prozess geht ins Kontrollpanel über und in die Hand eines menschlichen Operators.

Man beachte die Reihenfolge: **erst die Beweise sichern, dann die Kette freigeben** – Erfassung vor Freigabe. Unterbleibt TC4-4, ist eine Fehlerattribuierung binnen 72 Stunden unmöglich – übrig bleibt nur Raten.

## Fazit: ehrliche KI-Governance in der Industrie

Das Ganze lässt sich zu einer Kette verdichten:

1. **Eine unterschriebene Seite:** Die langweilige Sicherheitsakte erhält endlich eine eigene Seite für den KI-Agenten.
2. **Technisches Vertrauen:** Der Vertrauenswert ist keine Anzeige auf einem Dashboard, sondern der unmittelbare Bedingungs- und Steuerungsmechanismus des BPMN 2.0-Prozesses.
3. **Der Mensch führt wirklich:** Jede Anomalie, jeder Verbindungsabbruch und jeder Berechtigungsfehler leitet die Aufgabe an einen Menschen, und die Software garantiert, dass die Aufsicht kein Schein ist.
4. **Keine Race Condition:** Das Einmal-Token garantiert, dass der Agent nichts ausführen kann ohne ein frisches, gültiges Vertrauensniveau im Moment der Ausführung.
5. **Lückenloses Krisenmanagement:** Wenn etwas schiefgeht, halten die Fehlerattribuierung und die historischen Daten des World Model die Verantwortungsverteilung klar. Das Protokoll belegt im Nachhinein, wer gehandelt hat, mit welchen Befugnissen und warum – auch dann, wenn der Handelnde ein Mensch war.

Genau aus diesem Grund haben wir an dieser Spezifikation mitgewirkt: Sie verwandelt die gesetzliche Pflicht zur menschlichen Führung in eine betriebssichere Softwarearchitektur.

Sind diese Bausteine an ihrem Platz, hören KI-Agenten auf, ein unkontrollierbares Sicherheitsrisiko zu sein – und werden zu dem, wofür sie gedacht sind: **einer verlässlichen, leistungsstarken Ausführungsebene der Industrie.**

---

**Risto Anton Päärni**
_Gründer und Geschäftsführer, Lifetime Oy_
_Chefredakteur, Lifetime Scope Journal_

## Quellen

1. Gardhouse, K., Oueslati, A., & Kolt, N. (2026). Regulating AI Agents. arXiv preprint arXiv:2603.23471. <https://arxiv.org/abs/2603.23471>
2. Uchibeke, U. (2026). Before the Tool Call: Deterministic Pre-Action Authorization for Autonomous AI Agents. arXiv preprint arXiv:2603.20953. <https://arxiv.org/abs/2603.20953>
3. Borovkov, N., Rykov, E., Tsymboi, O., Filimonov, S., Surnachev, N., Bitman, D., & Potapov, A. (2026). Learning Selective LLM Autonomy from Copilot Feedback in Enterprise Customer Support Workflows. arXiv preprint arXiv:2604.23855. <https://arxiv.org/abs/2604.23855>
4. Prakash, S. (2026). AIP: Agent Identity Protocol for Verifiable Delegation Across MCP and A2A. arXiv preprint arXiv:2603.24775. <https://arxiv.org/abs/2603.24775>
5. Raji, I. D., Smart, A., White, R. N., Mitchell, M., Gebru, T., Hutchinson, B., Smith-Loud, J., Theron, D., & Barnes, P. (2020). Closing the AI Accountability Gap: Defining an End-to-End Framework for Internal Algorithmic Auditing. In Proceedings of the Conference on Fairness, Accountability, and Transparency (FAT\* '20). ACM. <https://doi.org/10.1145/3351095.3372873>
