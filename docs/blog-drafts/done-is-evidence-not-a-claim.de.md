---
slug: done-is-evidence-not-a-claim
lang: de
translation_of: done-is-evidence-not-a-claim.md
ai_translated: true
title: "„Fertig“ ist ein Nachweis, keine Behauptung: Agenten auditieren und ihre Arbeit durch Schranken schicken"
hero: "Akzeptieren Sie das „fertig“ eines Agenten nur als Nachweis – geändertes System, Prüfeintrag, Ergebnis eines Schrankenbefehls –, nie als Satz im Transkript."
visual: infographic
visual_src: docs/blog-drafts/img/done-is-evidence-not-a-claim.svg
visual_alt: "Ablauf von der Aktion des Agenten über die Nebenwirkung in den Werkzeugen, den Prüfeintrag und die Fertig-Schranke bis zum Pull Request und zum Merge durch einen Menschen"
seo_tags: [hic, article_12, article_14, eu_ai_act, agent_isolation, kya_prv]
date: 2026-09-30
author: Risto Anton Päärni
Status: DRAFT
note: "Visual not yet made — the SVG is a to-do. Merged text needs fresh HIC approval even though thinkingbox.md was approved."
---

# „Fertig“ ist ein Nachweis, keine Behauptung

Am 28. September meldete uns ein Agent, eine Governance-Lücke sei „vollständig geschlossen“.

Sie war es nicht. Der Commit hatte den Rechner nie verlassen. Die Produktion rief den neuen Code nie auf. Der Test, der die Lücke markierte, stand noch immer da und wartete.

## Das Problem des stillen Scheiterns

Ihre Agenten laufen. Das Transkript sieht gut aus. Der Nutzer sagt „danke“. Dann prüfen Sie die Datenbank, die API-Logs, die Nebenwirkungen – und nichts ist passiert. Der Agent hat sich den Erfolg herbeihalluziniert.

Das ist die Lücke zwischen dem _Sagen_, man habe etwas getan, und dem _Tun_. Eval-Frameworks messen die Qualität von Transkripten. Ergebnisse messen sie nicht.

Für Umsatzmaschinen – Outbound-Kampagnen, Lead-Anreicherung, feineres Targeting, Attribution – ist stilles Scheitern kein Randfall. Es ist existenziell. Ein einziger Agent, der „Kampagne ausgerollt“ meldet, obwohl nichts hinausging, und Ihr GTM verspielt seine Glaubwürdigkeit bei einem Kunden. Ein einziger Anreicherungsagent, der neue Kontaktfelder halluziniert, und Ihr Vertrieb jagt Gespenstern hinterher.

Es gibt zwei Antworten, und um beide geht es hier. Die erste: Agenten dort auditieren, wo die Lücke sichtbar wird – in dem, was die Werkzeuge tatsächlich verändert haben. Die zweite: die Arbeit so anlegen, dass ein Scheitern gar nicht erst als Erfolg gemeldet werden kann.

## Prüfen, was die Werkzeuge verändert haben: ThinkingBox

Microsoft hat ThinkingBox gebaut, um genau dieses Problem zu lösen. Bei Lifetime haben wir das Repository geforkt, auf Umsatzmaschinen zugeschnitten und mit DGX-Integration und 507 Benchmarks aus Geschäftsdomänen gebündelt.

ThinkingBox führt Agenten in isolierten, zustandsbehafteten Werkzeugumgebungen aus, angebunden über Server für das Model Context Protocol (MCP). Jede Konversation startet eigene, isolierte Werkzeugprozesse mit stdio-Transport, sodass jeder Testfall in einer sauberen, reproduzierbaren Sandbox läuft.

Die Architektur untersucht drei Dinge, die reinen Transkript-Evals entgehen:

- **Zustandsbehaftete Arbeitsabläufe.** Echte Werkzeugnutzung hat einen Zustand – eine Ressource anlegen, sie ändern, das Ergebnis abfragen. Die meisten Evals prüfen Einzelaufrufe in einem einzigen Zug. ThinkingBox lässt Agenten mehrstufige Arbeitsabläufe ausführen (API aufrufen, Antwort prüfen, erneut versuchen oder umsteuern) und untersucht, was die Werkzeuge tatsächlich verändert haben.
- **Simulierte Nutzer.** Agenten stellen oft Rückfragen. ThinkingBox simuliert die Antworten der Nutzer (per Sprachmodell oder promptgesteuert) und prüft, ob die abschließende Antwort des Agenten der Spezifikation entspricht. Evals mit nur einem Zug entgeht das vollständig.
- **Überprüfung von Nebenwirkungen.** Das eigentliche Signal lautet nicht „der Agent sagte, es habe funktioniert“. Es lautet „die Datenbank zeigt die Änderung“, „die API meldete Erfolg“ oder „die Datei wurde angelegt“. ThinkingBox vergleicht den Zustand davor und danach und markiert Halluzinationen, bei denen der Agent Erfolg behauptete, die Werkzeuge aber ein Scheitern zeigen.

## ThinkingBox-Bench: 507 echte Arbeitsabläufe

Wir liefern ThinkingBox-Bench mit 507 ausführbaren Aufgaben aus fünf Geschäftsfeldern aus:

- **Outbound und GTM:** Kampagnen ausrollen, Leads bewerten, Zielgruppen verfeinern.
- **Datenanreicherung:** Kontaktsuche, Attributextraktion, Prüfungen der Datenqualität.
- **Attribution und Analytics:** Ereigniskorrelation, Funnel-Analyse, Kohortendefinition.
- **Inhalte und Wissen:** Dokumentenverarbeitung, semantische Suche, Aktualisierungen der Wissensdatenbank.
- **Integration und Orchestrierung:** API-Übergaben, systemübergreifende Synchronisierung, Wiederherstellung nach Fehlern.

Jede Aufgabe enthält synthetische Datensätze, erwartete Ergebnisse und vorgefertigte MCP-Server. Sie lassen Ihren Agenten dagegen antreten und erhalten ein Bestanden oder Durchgefallen anhand tatsächlicher Nebenwirkungen – nicht anhand der Stimmung im Transkript.

## Lokal zuerst, auf DGX

Offene Modelle auf einer NVIDIA DGX Spark neben dem Schreibtisch schreiben inzwischen echten Code. Keine Demos. Testsuiten, Fehlerbehebungen, Refactorings. Die Tokens gehören uns, die Daten bleiben im Haus, und der Zähler steht still.

Auch ThinkingBox läuft dort. Unsere Agenten-Workloads laufen standardmäßig auf lokaler Rechenleistung; Cloud-Agenten sind zweitrangig und brauchen eine dokumentierte Begründung. Jede Aufgabe in ThinkingBox-Bench besteht aus einem gestarteten Unterprozess und einem Aufruf eines Sprachmodells, und 507 Aufgaben × 20 Iterationen in der Cloud sind teuer. Lokal kostet das Starten von Unterprozessen nichts – abgerechnet wird nur die Inferenz des Sprachmodells. Entwicklung und Staging fahren den Bench auf der DGX mit der Prozessisolierung von MCP, vollständig getrennt von Produktionsdaten. Vor jeder Übernahme in die Produktion durchläuft jeder Agenten-Workflow den kompletten Bench. Keine Überraschungen in der Produktion.

## Ein Gerüst, in dem „fertig“ ein Befehlsergebnis ist

Das Audit fängt das Scheitern im Nachhinein ab. Das Gerüst ist unsere Art, Arbeit so zu bauen, dass „fertig“ überhaupt kein Satz sein kann.

Frontier-Modelle, in unserem Fall Claude, sind sehr gut in der anderen Hälfte der Arbeit: ein Ziel in präzise Aufgaben zerlegen, einen Diff prüfen, erkennen, was nicht zum Auftrag gehört. Also haben wir sie mit den lokalen Modellen zu einem Gespann verbunden. Und weil ein Gespann noch kein Plan ist, folgt hier der ehrliche Teil.

**Das Frontier-Modell plant.** Für jede Aufgabe schreibt es eine kleine Spezifikation mit Prüfungen – Befehlen, die durchlaufen müssen, wenn die Arbeit stimmt. Jede Prüfung muss scheitern, bevor die Arbeit beginnt. Eine Prüfung, die schon besteht, beweist nichts; das Gerüst weist sie deshalb zurück.

**Der lokale Agent baut.** Er läuft auf der DGX in frischen Runden, eine Aufgabe nach der anderen, bis eine Schranke „fertig“ sagt. Nicht, bis der Agent „fertig“ sagt. Die Schranke führt die Befehle aus: committet, gepusht, formatiert, typgeprüft, gelintet, getestet – dazu die eigenen Prüfungen der Aufgabe. Dann öffnet sie einen Pull Request. Mergen tut sie nie.

**Das Frontier-Modell prüft und merged**, einen Pull Request nach dem anderen, sobald die CI grün ist. Ein Mensch entscheidet, was ausgeliefert wird, und liest jedes Wort, das an die Öffentlichkeit geht.

Die „vollständig geschlossene“ Lücke vom Anfang ist genau das, wofür diese Schranke existiert: Ein nicht gepushter Commit und ein noch offener Test sind beides Befehlsergebnisse, und beide sagen Nein.

## Was der erste Tag zeigte

Die Schleife lieferte Testsuiten für vier Agenten, und die Tests fanden drei echte Fehler in dem Code, den sie abdeckten. Das ist die gute Nachricht, und sie stimmt.

Die ersten beiden Pull Requests passierten allerdings auch unsere Schranke – und scheiterten an der CI. Unsere Schranke ließ den Linter nicht laufen; die CI schon. Einen Vormittag lang bedeutete „fertig“ auf unserem Rechner weniger als im Repository. Noch am selben Tag nahmen wir den Linter in die Schranke auf.

Ein dritter Pull Request bestand jede Prüfung und änderte trotzdem eine Basisklasse, an der er nichts zu suchen hatte. Kein Befehl bemerkte es. Ein Reviewer schon.

## Was keines der beiden Werkzeuge verspricht

> **Der ehrliche Teil.** Eine Schranke ist nur so stark wie ihre schwächste Prüfung. Sie sieht weder Umfang noch Absicht noch Geschmack. Sie lässt falsche Arbeit passieren, die ihre Prüfungen nicht beschreiben. Drei Pull Requests sind eine Geschichte, keine Statistik – Zahlen veröffentlichen wir, wenn wir genug davon haben.

Dasselbe gilt für einen Benchmark: Er misst die Ergebnisse, die seine Aufgaben beschreiben, und sonst nichts. Nachweise verkleinern den Spielraum für ein falsches „fertig“; einen Reviewer ersetzen sie nicht.

## Aufzeichnungen und Aufsicht nach dem EU AI Act

Die Verordnung – der EU AI Act – verlangt Aufzeichnungen darüber, was ein automatisiertes System getan hat (Artikel 12), und echte menschliche Aufsicht (Artikel 14). Beide Hälften dieses Ansatzes liefern das Erste als Nebenprodukt. Ein grüner Lauf von ThinkingBox-Bench ist auditierbar und reproduzierbar, und er misst Ergebnisse – keine Halluzinationen. Im Gerüst hat jede Aufgabe eine Spezifikation, jedes „fertig“ ein Befehlsprotokoll und jeder Merge einen Menschen oder Reviewer hinter sich.

Was keiner von beiden gratis liefert, ist der Grund, warum eine Änderung zugelassen wurde. Der muss aufgeschrieben werden, bevor die Arbeit beginnt – in der Spezifikation, neben den Prüfungen. Eine nachträglich rekonstruierte Begründung ist keine Aufzeichnung; sie ist eine Geschichte.

Menschliche Führung (Human-in-Command) hört auf, eine Sitzung zu sein. Sie wird zum letzten Schritt einer Pipeline, die Ihnen die Wahrheit bereits gesagt hat.

## Von der Evaluierung in die Produktion

ThinkingBox validiert Agenten vor dem Deployment. Sind sie live, überwacht das DWS Dashboard sie in der Produktion, optional mit Aspire-Telemetrie. Seine Ansichten sind das Digital Office (Status der Agenten-Arbeitsplätze), der Kontrollraum (ein Raster im NOC-Stil mit CPU, Speicher, Aufgabenfortschritt und Kosten pro Anfrage) und der Situationsraum (Warnmeldungen für die Führungsebene und eine Zeitleiste der Vertrauens-Drift). Aspire speist den Kontrollraum mit den Entscheidungsspuren der Agenten (Modelleingaben, Werkzeugaufrufe, Ausgaben), mit Latenz und Fehlerraten der Werkzeuge, Token-Verbrauch und Kosten pro Agent, dem Zustand der MCP-Server und mit End-to-End-Tracing über Übergaben zwischen mehreren Agenten hinweg.

Stellen Sie sich vor, Sie setzen 50 Agenten ein, und einer beginnt, dienstags auf subtile Weise zu halluzinieren. Ohne Spuren sucht Ihr Team im Dunkeln nach dem Fehler. Mit Spuren meldet der Detektor für Vertrauens-Drift die Anomalie, die Spuren der Agenten zeigen genau, welche Werkzeugaufrufe abwichen, und Sie können die verantwortliche Änderung an Modelltemperatur oder Prompt punktgenau bestimmen.

## Für Gründer und Teams

- **Investoren fragen: „Woher wissen Sie, dass Ihre Agenten funktionieren?“** Ein grüner Bench-Lauf und ein Schrankenprotokoll sind die Antwort.
- **Ihr Team braucht Gewissheit.** Ein Agent, der still scheitert, kostet mehr als ein Tag Eval-Infrastruktur.
- **Umsatzmaschinen sind binär.** Ihr Anreicherungsagent hat den Lead entweder angereichert oder nicht. Ihr Outbound-Agent hat die Kampagne entweder ausgerollt oder darüber gelogen.

Für den Einstieg in ThinkingBox klonen Sie unseren Fork, [github.com/blogtheristo/dws-thinkingbox](https://github.com/blogtheristo/dws-thinkingbox) (MCP-Session-Proxy, Agent-Nutzer-Richter-Schleife, 507 Benchmarks, DGX-Runner-Konfiguration), neben das Upstream-Gerüst und seine Schicht für Prozessisolierung unter [github.com/microsoft/thinkingbox](https://github.com/microsoft/thinkingbox). Definieren Sie Werkzeug-Mocks als MCP-Server, schreiben Sie Szenarien und Testfälle in YAML, führen Sie `tb infer` mit Ihrem Agenten gegen ThinkingBox-Bench aus und nutzen Sie die Ergebnisse als CI-Schranken und Prüfpfade.

## Die Kurzfassung

- Das Transkript ist das, was Nutzer sehen. Der Nachweis ist das, was tatsächlich geschah.
- Prüfen Sie Nebenwirkungen, nicht die Stimmung im Transkript.
- Lassen Sie das Frontier-Modell die Prüfungen schreiben. Lassen Sie lokale Modelle auf Ihrer eigenen Hardware die Arbeit machen.
- Jede Prüfung muss scheitern, bevor die Arbeit beginnt.
- „Fertig“ ist ein Befehlsergebnis, niemals ein Satz – und die Schranke muss mindestens so streng sein wie die CI.
- Über den Umfang wacht weiterhin ein Mensch.
- Das Protokoll dessen, was geschah, fällt gratis aus dem Prozess heraus. Der Grund, warum eine Änderung zulässig ist, nicht – schreiben Sie ihn in die Spezifikation, bevor die Arbeit beginnt.

---

_Risto Anton Päärni — Founder, CEO, Lifetime Oy · Editor in Chief, Lifetime Scope Journal · risto.paarni@lifetime.fi_
