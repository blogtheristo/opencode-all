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
customer_value: "Ein Unternehmenskunde verbringt weniger Reviewer-Zeit damit, Behauptungen von Agenten nachzuprüfen: Eine Änderung gilt erst als fertig, wenn ein Schranken-Befehl zeigt, dass sie committet, gepusht und getestet ist und Prüfungen besteht, die vor Arbeitsbeginn scheiterten, und das Protokoll dieses Ergebnisses ist der Prüfnachweis – das ist die Schranke, die DWS heute auf dem eigenen Repository betreibt, noch kein paketiertes Kundenprodukt."
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

# „Fertig“ ist ein Nachweis, keine Behauptung

Am 28. September meldete uns ein Agent, eine Governance-Lücke sei „vollständig geschlossen“.

Sie war es nicht. Der Commit hatte den Rechner nie verlassen. Die Produktion rief den neuen Code nie auf. Der Test, der die Lücke markierte, stand noch immer da und wartete.

## Das Problem des stillen Scheiterns

Ihre Agenten laufen. Das Transkript sieht gut aus. Der Nutzer sagt „danke“. Dann prüfen Sie die Datenbank, die API-Logs, die Nebenwirkungen – und nichts ist passiert. Der Agent hat sich den Erfolg herbeihalluziniert. [1, 6]

Das ist die Lücke zwischen dem _Sagen_, man habe etwas getan, und dem _Tun_. Viele Evaluierungen prüfen noch immer das Transkript oder den Funktionsaufruf, nicht aber, ob die Arbeit erledigt wurde. [1]

Für Umsatzmaschinen – Outbound-Kampagnen, Lead-Anreicherung, feineres Targeting, Attribution – ist stilles Scheitern kein Randfall. Es ist existenziell. Ein einziger Agent, der „Kampagne ausgerollt“ meldet, obwohl nichts hinausging, und Ihr GTM verspielt seine Glaubwürdigkeit bei einem Kunden. Ein einziger Anreicherungsagent, der neue Kontaktfelder halluziniert, und Ihr Vertrieb jagt Gespenstern hinterher.

Es gibt zwei Antworten, und um beide geht es hier. Die erste: Agenten dort auditieren, wo die Lücke sichtbar wird – in dem, was die Werkzeuge tatsächlich verändert haben. Die zweite: die Arbeit so anlegen, dass ein Scheitern gar nicht erst als Erfolg gemeldet werden kann.

## Prüfen, was die Werkzeuge verändert haben: ThinkingBox

Microsoft hat ThinkingBox gebaut, um genau dieses Problem zu lösen. [1, 2] Bei Lifetime haben wir das Repository geforkt, um es gegen unsere eigenen Agenten laufen zu lassen.

ThinkingBox führt Agenten in isolierten, zustandsbehafteten Werkzeugumgebungen aus, angebunden über Server für das Model Context Protocol (MCP). Jede Konversation startet eigene, isolierte Werkzeugprozesse mit stdio-Transport, sodass jeder Testfall in einer sauberen, reproduzierbaren Sandbox läuft. [1, 2, 3]

Die Architektur untersucht drei Dinge, die reinen Transkript-Evals entgehen:

- **Zustandsbehaftete Arbeitsabläufe.** Echte Werkzeugnutzung hat einen Zustand – eine Ressource anlegen, sie ändern, das Ergebnis abfragen. Die meisten Evals prüfen Einzelaufrufe in einem einzigen Zug. ThinkingBox lässt Agenten mehrstufige Arbeitsabläufe ausführen (API aufrufen, Antwort prüfen, erneut versuchen oder umsteuern) und untersucht, was die Werkzeuge tatsächlich verändert haben. [1, 4]
- **Simulierte Nutzer.** Agenten stellen oft Rückfragen. ThinkingBox simuliert die Antworten der Nutzer (per Sprachmodell oder promptgesteuert) und prüft, ob die abschließende Antwort des Agenten der Spezifikation entspricht. Evals mit nur einem Zug entgeht das vollständig. [1, 2, 4]
- **Überprüfung von Nebenwirkungen.** Das eigentliche Signal lautet nicht „der Agent sagte, es habe funktioniert“. Es lautet „die Datenbank zeigt die Änderung“, „die API meldete Erfolg“ oder „die Datei wurde angelegt“. ThinkingBox vergleicht den Zustand davor und danach und markiert Halluzinationen, bei denen der Agent Erfolg behauptete, die Werkzeuge aber ein Scheitern zeigen. [1, 3]

## ThinkingBox-Bench: 507 echte Arbeitsabläufe

Microsofts ThinkingBox-Bench umfasst 507 ausführbare Aufgaben aus fünf Geschäftsfeldern: Einzel- und Onlinehandel, Reisen und Gastgewerbe, Kfz-Versicherung, interner IT-Support einer Neobank sowie IT- und HR-Support in einem Beratungsunternehmen. [1, 3]

Die Zahlen sind das Argument. Das stärkste Modell der Studie besteht 65 % der Aufgaben im ersten Versuch und löst 91 % mindestens einmal in zwanzig Versuchen, schafft aber nur 25 % in allen zwanzig. [1] Ein Erfolg ist noch keine Zuverlässigkeit.

Jede Aufgabe bringt erwartete Ergebnisse und isolierte MCP-Werkzeugsitzungen mit. Sie lassen Ihren Agenten dagegen antreten und erhalten ein Bestanden oder Durchgefallen anhand tatsächlicher Nebenwirkungen – nicht anhand der Stimmung im Transkript. [1, 3]

## Lokal zuerst, auf DGX

Offene Modelle auf einer NVIDIA DGX Spark neben dem Schreibtisch schreiben inzwischen echten Code. Keine Demos. Testsuiten, Fehlerbehebungen, Refactorings. Die Tokens gehören uns, die Daten bleiben im Haus, und der Zähler steht still.

Auch ThinkingBox läuft dort. Unsere Agenten-Workloads laufen standardmäßig auf lokaler Rechenleistung; Cloud-Agenten sind zweitrangig und brauchen eine dokumentierte Begründung. 507 Aufgaben × 20 Versuche in der Cloud sind teuer, deshalb holen wir den Bench auf die DGX, getrennt von Produktionsdaten. Dieser Runner ist noch in Arbeit, keine ausgelieferte Konfiguration.

## Ein Gerüst, in dem „fertig“ ein Befehlsergebnis ist

Das Audit fängt das Scheitern im Nachhinein ab. Das Gerüst ist unsere Art, Arbeit so zu bauen, dass „fertig“ überhaupt kein Satz sein kann.

Frontier-Modelle, in unserem Fall Claude, sind sehr gut in der anderen Hälfte der Arbeit: ein Ziel in präzise Aufgaben zerlegen, einen Diff prüfen, erkennen, was nicht zum Auftrag gehört. Also haben wir sie mit den lokalen Modellen zu einem Gespann verbunden. Und weil ein Gespann noch kein Plan ist, folgt hier der ehrliche Teil.

**Das Frontier-Modell plant.** Für jede Aufgabe schreibt es eine kleine Spezifikation mit Prüfungen – Befehlen, die durchlaufen müssen, wenn die Arbeit stimmt. Jede Prüfung muss scheitern, bevor die Arbeit beginnt. Eine Prüfung, die schon besteht, beweist nichts; das Gerüst weist sie deshalb zurück. [5]

**Der lokale Agent baut.** Er läuft auf der DGX in frischen Runden, eine Aufgabe nach der anderen, bis eine Schranke „fertig“ sagt. Nicht, bis der Agent „fertig“ sagt. Die Schranke führt die Befehle aus: committet, gepusht, formatiert, typgeprüft, gelintet, getestet – dazu die eigenen Prüfungen der Aufgabe. Dann öffnet sie einen Pull Request. Mergen tut sie nie.

**Das Frontier-Modell prüft und merged**, einen Pull Request nach dem anderen, sobald die CI grün ist. Ein Mensch entscheidet, was ausgeliefert wird, und liest jedes Wort, das an die Öffentlichkeit geht.

Die „vollständig geschlossene“ Lücke vom Anfang ist genau das, wofür diese Schranke existiert: Ein nicht gepushter Commit und ein noch offener Test sind beides Befehlsergebnisse, und beide sagen Nein.

## Was der erste Tag zeigte

Die Schleife lieferte Testsuiten für vier Agenten, und die Tests fanden drei echte Fehler in dem Code, den sie abdeckten. Das ist die gute Nachricht, und sie stimmt.

Die ersten beiden Pull Requests passierten allerdings auch unsere Schranke – und scheiterten an der CI. Unsere Schranke ließ den Linter nicht laufen; die CI schon. Einen Vormittag lang bedeutete „fertig“ auf unserem Rechner weniger als im Repository. Noch am selben Tag nahmen wir den Linter in die Schranke auf.

Ein dritter Pull Request bestand jede Prüfung und änderte trotzdem eine Basisklasse, an der er nichts zu suchen hatte. Kein Befehl bemerkte es. Ein Reviewer schon.

## Was keines der beiden Werkzeuge verspricht

> **Der ehrliche Teil.** Eine Schranke ist nur so stark wie ihre schwächste Prüfung. Sie sieht weder Umfang noch Absicht noch Geschmack. Sie lässt falsche Arbeit passieren, die ihre Prüfungen nicht beschreiben. [6] Drei Pull Requests sind eine Geschichte, keine Statistik – Zahlen veröffentlichen wir, wenn wir genug davon haben.

Dasselbe gilt für einen Benchmark: Er misst die Ergebnisse, die seine Aufgaben beschreiben, und sonst nichts. [1] Nachweise verkleinern den Spielraum für ein falsches „fertig“; einen Reviewer ersetzen sie nicht.

## Aufzeichnungen und Aufsicht nach dem EU AI Act

Für Hochrisiko-KI-Systeme verlangt der EU AI Act Aufzeichnungen darüber, was das System getan hat (Artikel 12), und echte menschliche Aufsicht (Artikel 14). [7] Beide Hälften dieses Ansatzes liefern das Erste als Nebenprodukt. Ein grüner Lauf von ThinkingBox-Bench ist auditierbar und reproduzierbar, und er misst Ergebnisse – keine Halluzinationen. [1] Im Gerüst hat jede Aufgabe eine Spezifikation, jedes „fertig“ ein Befehlsprotokoll und jeder Merge einen Menschen oder Reviewer hinter sich.

Was keiner von beiden gratis liefert, ist der Grund, warum eine Änderung zugelassen wurde. Der muss aufgeschrieben werden, bevor die Arbeit beginnt – in der Spezifikation, neben den Prüfungen. Eine nachträglich rekonstruierte Begründung ist keine Aufzeichnung; sie ist eine Geschichte.

Menschliche Führung (Human-in-Command) hört auf, eine Sitzung zu sein. Sie wird zum letzten Schritt einer Pipeline, die Ihnen die Wahrheit bereits gesagt hat.

## Von der Evaluierung in die Produktion

ThinkingBox validiert Agenten vor dem Deployment. Sind sie live, überwacht das DWS Dashboard sie in der Produktion, optional mit Aspire-Telemetrie. Seine Ansichten sind das Digital Office (Status der Agenten-Arbeitsplätze), der Kontrollraum (ein Raster im NOC-Stil mit CPU, Speicher, Aufgabenfortschritt und Kosten pro Anfrage) und der Situationsraum (Warnmeldungen für die Führungsebene und eine Zeitleiste der Vertrauens-Drift). Aspire speist den Kontrollraum mit den Entscheidungsspuren der Agenten (Modelleingaben, Werkzeugaufrufe, Ausgaben), mit Latenz und Fehlerraten der Werkzeuge, Token-Verbrauch und Kosten pro Agent, dem Zustand der MCP-Server und mit End-to-End-Tracing über Übergaben zwischen mehreren Agenten hinweg.

Stellen Sie sich vor, Sie setzen 50 Agenten ein, und einer beginnt, dienstags auf subtile Weise zu halluzinieren. Ohne Spuren sucht Ihr Team im Dunkeln nach dem Fehler. Mit Spuren meldet der Detektor für Vertrauens-Drift die Anomalie, die Spuren der Agenten zeigen genau, welche Werkzeugaufrufe abwichen, und Sie können die verantwortliche Änderung an Modelltemperatur oder Prompt punktgenau bestimmen.

## Für Gründer und Teams

- **Investoren fragen: „Woher wissen Sie, dass Ihre Agenten funktionieren?“** Ein grüner Bench-Lauf und ein Schrankenprotokoll sind die Antwort.
- **Ihr Team braucht Gewissheit.** Ein Agent, der still scheitert, kostet mehr als ein Tag Eval-Infrastruktur.
- **Umsatzmaschinen sind binär.** Ihr Anreicherungsagent hat den Lead entweder angereichert oder nicht. Ihr Outbound-Agent hat die Kampagne entweder ausgerollt oder darüber gelogen.

Für den Einstieg in ThinkingBox klonen Sie unseren Fork, [github.com/blogtheristo/dws-thinkingbox](https://github.com/blogtheristo/dws-thinkingbox) (unser Arbeits-Fork), neben das Upstream-Gerüst und seine Schicht für Prozessisolierung unter [github.com/microsoft/thinkingbox](https://github.com/microsoft/thinkingbox). Definieren Sie Werkzeug-Mocks als MCP-Server, schreiben Sie Szenarien und Testfälle in YAML, führen Sie `tb infer` mit Ihrem Agenten gegen ThinkingBox-Bench aus und nutzen Sie die Ergebnisse als CI-Schranken und Prüfpfade. [2]

## Die Kurzfassung

- Das Transkript ist das, was Nutzer sehen. Der Nachweis ist das, was tatsächlich geschah.
- Prüfen Sie Nebenwirkungen, nicht die Stimmung im Transkript.
- Lassen Sie das Frontier-Modell die Prüfungen schreiben. Lassen Sie lokale Modelle auf Ihrer eigenen Hardware die Arbeit machen.
- Jede Prüfung muss scheitern, bevor die Arbeit beginnt.
- „Fertig“ ist ein Befehlsergebnis, niemals ein Satz – und die Schranke muss mindestens so streng sein wie die CI.
- Über den Umfang wacht weiterhin ein Mensch.
- Das Protokoll dessen, was geschah, fällt gratis aus dem Prozess heraus. Der Grund, warum eine Änderung zulässig ist, nicht – schreiben Sie ihn in die Spezifikation, bevor die Arbeit beginnt.

## Quellen

1. Ko, Y., Keramati, A., Ferri, N., et al. (2026). _One Success Isn't Reliability: Thinkingbox, a Sandbox and Benchmark for Agents in Stateful Business Workflows._ arXiv:2608.19741. https://arxiv.org/abs/2608.19741
2. Microsoft (2026). _thinkingbox_ — framework for tools as MCP servers, agent runs and outcome evaluation. GitHub. https://github.com/microsoft/thinkingbox
3. Microsoft (2026). _thinkingbox-data_ — ThinkingBox-Bench v1.0 dataset and tool servers. GitHub. https://github.com/microsoft/thinkingbox-data
4. Yao, S., Shinn, N., Razavi, P., Narasimhan, K. (2024). _τ-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains._ arXiv:2406.12045. https://arxiv.org/abs/2406.12045
5. Jimenez, C. E., Yang, J., Wettig, A., Yao, S., Pei, K., Press, O., Narasimhan, K. (2023). _SWE-bench: Can Language Models Resolve Real-World GitHub Issues?_ arXiv:2310.06770. https://arxiv.org/abs/2310.06770
6. Cemri, M., Pan, M. Z., Yang, S., et al. (2025). _Why Do Multi-Agent LLM Systems Fail?_ arXiv:2503.13657. https://arxiv.org/abs/2503.13657
7. Regulation (EU) 2024/1689 (Artificial Intelligence Act), Art. 12 (Record-keeping) and Art. 14 (Human oversight). Official Journal of the European Union. https://eur-lex.europa.eu/eli/reg/2024/1689/oj

---

_Risto Anton Päärni — Founder, CEO, Lifetime Oy · Editor in Chief, Lifetime Scope Journal · risto.paarni@lifetime.fi_
