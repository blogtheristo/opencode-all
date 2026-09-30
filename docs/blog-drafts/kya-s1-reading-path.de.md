---
slug: kya-s1-reading-path
lang: de
title: "KYA-S1 der Reihe nach — ein Lesepfad von einer signierten Seite zum verifizierten Menschen"
hero: "Sechs Beiträge, von der signierten Anbieterseite bis zum EU-verifizierten Menschen hinter dem Agenten — in der Reihenfolge, die ein Einkäufer braucht."
visual: infographic
visual_src: docs/blog-drafts/img/kya-s1-reading-path.svg
visual_alt: "Sechs Beiträge auf einer Linie: die signierte Seite, sieben Fragen, das Glossar, die Roadmap, die digitale EU-Brieftasche und menschliche Aufsicht nach Artikel 14"
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

# KYA-S1 der Reihe nach — ein Lesepfad von einer signierten Seite zum verifizierten Menschen

Die KYA-S1 Sicherheitsspezifikation richtet sich an Anbieter und regelt Identität und Verhalten autonomer Agenten. Ihr Zweck ist schnell gesagt: dem Einkauf eine einzige signierte Seite über den Agenten an die Hand zu geben, neben SOC 2 [1] und ISO 27001 — eine Seite, die festhält, wer hinter dem Agenten steht, was er darf und wie er gestoppt wird. Wir haben in mehreren Beiträgen darüber geschrieben, die meisten auf Finnisch, als Teil einer zwölfteiligen Serie. Diese Seite reiht sechs davon auf einer Linie auf, damit auch Leserinnen und Leser ohne Finnischkenntnisse sehen, wie sie zusammenhängen.

Die Reihenfolge folgt den Fragen eines Einkäufers. Zuerst: Was ist diese Seite, und warum braucht sie eine unabhängige Signatur [7]? Dann: Was genau fragt der Käufer? Dann: Was bedeuten die Begriffe? Dann: Wie führt eine Organisation sie schrittweise ein? Und schließlich: Bei welchem Menschen liegt die menschliche Führung, und wie wird seine Identität nachgewiesen — im Prozess ebenso wie im EU-Recht.

Ein Hinweis zu den Versionen. Die Beiträge entstanden, während sich die Spezifikation weiterentwickelte. Der englische Beitrag und die finnische Serie beziehen sich auf v1.3; aktuell ist v1.5. Die Garantiestufen wurden in v1.4 in KYA-AL1, KYA-AL2 und KYA-AL3 umbenannt. Jeder Beitrag nennt die Version, die bei seiner Veröffentlichung galt.

## 1. [KYA-S1 — One Signed Page for the Agent in Your Vendor File](https://onelifetime.world/posts/kya-s1-one-signed-page.html) (auf Englisch)

Der Ausgangspunkt. Eine Seite, unterzeichnet vom Anbieter und von einem unabhängigen Prüfer, mit sieben Kontrollen — IDV, BHM, REG, TC4, FLT, TRS, PRV — und einem Verlängerungsdatum. Der Beitrag schließt Selbstauskünfte aus, auch die von Lifetime Oy selbst, und ist beim EU AI Act präzise: KYA-S1 liefert Nachweise, die für die Artikel 12, 14 und 50 [2] relevant sind, erfüllt deren Pflichten aber nicht.

## 2. [KYC:n vastine tekoälylle — seitsemän KYA-kysymystä](https://onelifetime.world/posts/kya-kyc-seven-questions.fi.html) (auf Finnisch)

Die Checkliste des Käufers. Der Beitrag überträgt das Know-Your-Customer-Prinzip der Bankenwelt [3] auf KI-Agenten: Wie vertraut man einem Akteur ohne Gesicht und ohne Pass? Er macht aus den sieben Kontrollen sieben Fragen — wer ist verantwortlich, wo liegen die Grenzen, wie verhält sich der Agent, wie wird er gestoppt, wer zahlt für einen Fehler, ist die Berechtigung genau jetzt gültig, und lässt sich die Entscheidung zwei Jahre später noch einmal abspielen.

## 3. [KYA-S1 Sanasto — käsitteistö ja sanasto](https://onelifetime.world/posts/kya-s1-sanasto-glossary.fi.html) (auf Finnisch)

Das Nachschlagewerk. Das Glossar bündelt die Kernbegriffe an einem Ort: die sieben Kontrollbereiche, die drei Garantiestufen mit ihrer Prüffrequenz, Reaktions-SLAs und Replay-Fenstern sowie Laufzeitmechanismen wie das atomare Einmal-Autorisierungs-Token (Lease Token), die fehlersichere Sperre (fail-closed), die Notbremse (Leash Snap), die Erfassung vor Freigabe und die zeitbegrenzte Fehlerattribuierung (72 h). Halten Sie es beim Lesen der übrigen Serie geöffnet.

## 4. [KYA-S1 Ekosysteemi & tuotanto-roadmap](https://onelifetime.world/posts/kya-s1-ecosystem-roadmap.fi.html) (auf Finnisch)

Der Einführungsplan. Der Beitrag versteht KYA-S1 als Werkzeug des Käufers für das Lieferantenmanagement und zeigt, wie die drei Garantiestufen eine gestufte Roadmap bilden, in der sich die Reaktionsfristen von fünfzehn Minuten über fünf Minuten auf sechzig Sekunden verkürzen. Er bekräftigt die Evidenz-Metaregel (§3) — keine Selbstauskünfte — und stellt KYA-S1 im Beschaffungsordner neben SOC 2, ISO 27001, ISO/IEC 42001 und FedRAMP, wo es den autonomen Agenten abdeckt, den diese Standards nicht erfassen.

## 5. [Yhteys eWallet EU (EUDI Wallet) & eIDAS 2.0](https://onelifetime.world/posts/eudi-wallet-eidas2-human-identity.fi.html) (auf Finnisch)

Der Identitätsanker. Ein internes SSO-Login reicht nicht, wenn ein Agent über Organisationsgrenzen hinweg Verträge unterzeichnet oder Eingaben bei Behörden macht; der Mensch dahinter muss auf EU-Ebene verifiziert sein. Der Beitrag verbindet die digitale EU-Brieftasche (EUDI Wallet) nach eIDAS 2.0 [4] mit den IDV-Kontrollen: Identifizierung in Echtzeit, eine kryptografische Bindung an die Agentensitzung und ein Widerruf, der innerhalb der Frist der Garantiestufe greift und die Notbremse auslöst.

## 6. [EU AI Act Artikla 14 (HIC) ja agenttien itsenäisyyden ristiriita](https://onelifetime.world/posts/eu-ai-act-article-14-hic.fi.html) (auf Finnisch)

Menschliche Führung. Artikel 14 verlangt für Hochrisiko-KI-Systeme eine wirksame menschliche Aufsicht [2] — doch ein Agent, der für jeden Aufruf einen menschlichen Klick braucht, ist nutzlos [5][6]. Der Beitrag löst den Widerspruch mit einem Routing nach Vertrauenswert: Liegt der Wert über der Schwelle der Aufgabe, läuft der Agent automatisch; liegt er darunter oder antwortet die Trust Engine nicht rechtzeitig, geht die Aufgabe an einen Menschen im zentralen Kontrollpanel (HIC Dashboard). Eine verpflichtende schriftliche Begründung bei jeder menschlichen Freigabe verhindert das bloße Abnicken — den Automatisierungsbias, den Artikel 14 Absatz 4 Buchstabe b benennt [2].

## Wie die sechs zusammenpassen

Die signierte Seite ist das Versprechen. Die sieben Fragen sind der Weg, auf dem ein Käufer es prüft. Das Glossar legt die Begriffe fest, und die Roadmap macht aus dem Versprechen Stufen, die eine Organisation einführen kann. Die letzten beiden Beiträge beantworten die Frage, die unter jeder Kontrolle liegt: Welcher Mensch trägt die Verantwortung — nachgewiesen mit einer EU-Identität und in menschlicher Führung, ohne zum Flaschenhals zu werden.

Risto Anton Päärni
Gründer & CEO, Lifetime Oy · Chefredakteur, Lifetime Scope Journal

## Quellen

[1] Microsoft (2026). System and Organization Controls (SOC) 2 Type 2. Microsoft Learn — Compliance offerings. https://learn.microsoft.com/en-us/compliance/regulatory/offering-soc-2

[2] European Parliament and Council of the European Union (2024). Regulation (EU) 2024/1689 laying down harmonised rules on artificial intelligence (Artificial Intelligence Act). Official Journal of the European Union. https://eur-lex.europa.eu/eli/reg/2024/1689/oj

[3] Financial Action Task Force (FATF) (2025). International Standards on Combating Money Laundering and the Financing of Terrorism & Proliferation — The FATF Recommendations (updated February 2025). FATF. https://www.fatf-gafi.org/en/publications/Fatfrecommendations/Fatf-recommendations.html

[4] European Commission and European Digital Identity Cooperation Group (2026). European Digital Identity Wallet — Architecture and Reference Framework (ARF). eu-digital-identity-wallet (GitHub). https://github.com/eu-digital-identity-wallet/eudi-doc-architecture-and-reference-framework

[5] High-Level Expert Group on Artificial Intelligence (2020). Assessment List for Trustworthy Artificial Intelligence (ALTAI) for self-assessment. European Commission. https://digital-strategy.ec.europa.eu/en/library/assessment-list-trustworthy-artificial-intelligence-altai-self-assessment

[6] Gardhouse, K., Oueslati, A., Kolt, N. (2026). Regulating AI Agents. arXiv. https://arxiv.org/abs/2603.23471

[7] Costanza-Chock, S., Harvey, E., Raji, I. D., Czernuszenko, M., Buolamwini, J. (2023). Who Audits the Auditors? Recommendations from a field scan of the algorithmic auditing ecosystem. arXiv. https://arxiv.org/abs/2310.02521
