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
---

# KYA-S1 der Reihe nach — ein Lesepfad von einer signierten Seite zum verifizierten Menschen

Die KYA-S1 Sicherheitsspezifikation richtet sich an Anbieter und regelt Identität und Verhalten autonomer Agenten. Ihr Zweck ist schnell gesagt: dem Einkauf eine einzige signierte Seite über den Agenten an die Hand zu geben, neben SOC 2 und ISO 27001 — eine Seite, die festhält, wer hinter dem Agenten steht, was er darf und wie er gestoppt wird. Wir haben in mehreren Beiträgen darüber geschrieben, die meisten auf Finnisch, als Teil einer zwölfteiligen Serie. Diese Seite reiht sechs davon auf einer Linie auf, damit auch Leserinnen und Leser ohne Finnischkenntnisse sehen, wie sie zusammenhängen.

Die Reihenfolge folgt den Fragen eines Einkäufers. Zuerst: Was ist diese Seite, und warum braucht sie eine unabhängige Signatur? Dann: Was genau fragt der Käufer? Dann: Was bedeuten die Begriffe? Dann: Wie führt eine Organisation sie schrittweise ein? Und schließlich: Bei welchem Menschen liegt die menschliche Führung, und wie wird seine Identität nachgewiesen — im Prozess ebenso wie im EU-Recht.

Ein Hinweis zu den Versionen. Die Beiträge entstanden, während sich die Spezifikation weiterentwickelte. Der englische Beitrag kündigte v1.2 an, die finnische Serie bezieht sich auf v1.3; aktuell ist v1.5, in der die Garantiestufen in KYA-AL1, KYA-AL2 und KYA-AL3 umbenannt wurden. Jeder Beitrag nennt die Version, die bei seiner Veröffentlichung galt.

## 1. [KYA-S1 — One Signed Page for the Agent in Your Vendor File](https://onelifetime.world/posts/kya-s1-one-signed-page.html) (auf Englisch)

Der Ausgangspunkt. Eine Seite, unterzeichnet vom Anbieter und von einem unabhängigen Prüfer, mit sieben Kontrollen — IDV, BHM, REG, TC4, FLT, TRS, PRV — und einem Verlängerungsdatum. Der Beitrag schließt Selbstauskünfte aus, auch die von Lifetime Oy selbst, und ist beim EU AI Act präzise: KYA-S1 liefert Nachweise, die für die Artikel 12, 14 und 50 relevant sind, erfüllt deren Pflichten aber nicht.

## 2. [KYC:n vastine tekoälylle — seitsemän KYA-kysymystä](https://onelifetime.world/posts/kya-kyc-seven-questions.fi.html) (auf Finnisch)

Die Checkliste des Käufers. Der Beitrag überträgt das Know-Your-Customer-Prinzip der Bankenwelt auf KI-Agenten: Wie vertraut man einem Akteur ohne Gesicht und ohne Pass? Er macht aus den sieben Kontrollen sieben Fragen — wer ist verantwortlich, wo liegen die Grenzen, wie verhält sich der Agent, wie wird er gestoppt, wer zahlt für einen Fehler, ist die Berechtigung genau jetzt gültig, und lässt sich die Entscheidung zwei Jahre später noch einmal abspielen.

## 3. [KYA-S1 Sanasto — käsitteistö ja sanasto](https://onelifetime.world/posts/kya-s1-sanasto-glossary.fi.html) (auf Finnisch)

Das Nachschlagewerk. Das Glossar bündelt die Kernbegriffe an einem Ort: die sieben Kontrollbereiche, die drei Garantiestufen mit ihrer Prüffrequenz, Reaktions-SLAs und Replay-Fenstern sowie Laufzeitmechanismen wie das atomare Einmal-Autorisierungs-Token (Lease Token), die fehlersichere Sperre (fail-closed), die Notbremse (Leash Snap), die Erfassung vor Freigabe und die zeitbegrenzte Fehlerattribuierung (72 h). Halten Sie es beim Lesen der übrigen Serie geöffnet.

## 4. [KYA-S1 Ekosysteemi & tuotanto-roadmap](https://onelifetime.world/posts/kya-s1-ecosystem-roadmap.fi.html) (auf Finnisch)

Der Einführungsplan. Der Beitrag versteht KYA-S1 als Werkzeug des Käufers für das Lieferantenmanagement und zeigt, wie die drei Garantiestufen eine gestufte Roadmap bilden, in der sich die Reaktionsfristen von fünfzehn Minuten über fünf Minuten auf sechzig Sekunden verkürzen. Er bekräftigt die Evidenz-Metaregel (§3) — keine Selbstauskünfte — und stellt KYA-S1 im Beschaffungsordner neben SOC 2, ISO 27001, ISO/IEC 42001 und FedRAMP, wo es den autonomen Agenten abdeckt, den diese Standards nicht erfassen.

## 5. [Yhteys eWallet EU (EUDI Wallet) & eIDAS 2.0](https://onelifetime.world/posts/eudi-wallet-eidas2-human-identity.fi.html) (auf Finnisch)

Der Identitätsanker. Ein internes SSO-Login reicht nicht, wenn ein Agent über Organisationsgrenzen hinweg Verträge unterzeichnet oder Eingaben bei Behörden macht; der Mensch dahinter muss auf EU-Ebene verifiziert sein. Der Beitrag verbindet die digitale EU-Brieftasche (EUDI Wallet) nach eIDAS 2.0 mit den IDV-Kontrollen: Identifizierung in Echtzeit, eine kryptografische Bindung an die Agentensitzung und ein Widerruf, der innerhalb der Frist der Garantiestufe greift und die Notbremse auslöst.

## 6. [EU AI Act Artikla 14 (HIC) ja agenttien itsenäisyyden ristiriita](https://onelifetime.world/posts/eu-ai-act-article-14-hic.fi.html) (auf Finnisch)

Menschliche Führung. Artikel 14 verlangt eine wirksame menschliche Aufsicht — doch ein Agent, der für jeden Aufruf einen menschlichen Klick braucht, ist nutzlos. Der Beitrag löst den Widerspruch mit einem Routing nach Vertrauenswert: Liegt der Wert über der Schwelle der Aufgabe, läuft der Agent automatisch; liegt er darunter oder antwortet die Trust Engine nicht rechtzeitig, geht die Aufgabe an einen Menschen im zentralen Kontrollpanel (HIC Dashboard). Eine verpflichtende schriftliche Begründung bei jeder menschlichen Freigabe verhindert das bloße Abnicken.

## Wie die sechs zusammenpassen

Die signierte Seite ist das Versprechen. Die sieben Fragen sind der Weg, auf dem ein Käufer es prüft. Das Glossar legt die Begriffe fest, und die Roadmap macht aus dem Versprechen Stufen, die eine Organisation einführen kann. Die letzten beiden Beiträge beantworten die Frage, die unter jeder Kontrolle liegt: Welcher Mensch trägt die Verantwortung — nachgewiesen mit einer EU-Identität und in menschlicher Führung, ohne zum Flaschenhals zu werden.

Risto Anton Päärni
Gründer & CEO, Lifetime Oy · Chefredakteur, Lifetime Scope Journal
