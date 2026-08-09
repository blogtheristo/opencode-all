---
slug: know-your-agent-kya-s1.de
title: "Kenne deinen Agenten (KYA-S1): Eine unterschriebene Seite über die KI in der Sicherheitsakte, die deine Daten berührt"
series: "KYA-S1 Blogserie"
part: 1
parts_total: 11
lang: de
site: onelifetime.world
author: Risto Anton Päärni
date: 2026-08-08
hero_image: ../static/images/blog/kya-s1-series-hero-fi.jpg
hero_image_alt: "Serienkarte: die 11 Teile der KYA-S1-Blogserie in einem Bild (finnisch)"
hero_image_status: "PENDING FIX — Osa 8 esiintyy kahdesti (12 korttia / 11 osaa); 1024x559 alle 4K-rajan"
Status: DRAFT
source: Übersetzung des vom HIC freigegebenen finnischen Textes (know-your-agent-kya-s1.fi.md). Abschnitt für Abschnitt, Aussage für Aussage.
ai_disclosure: required
note: >-
  Teil 1/11 der Serie. Wartet auf die Freigabe durch den HIC (Regel 13) — der HIC hat
  ausdrücklich FI und EN freigegeben, nicht SV/DE/FR. Bei Veröffentlichung ist die
  KI-Übersetzungskennzeichnung verpflichtend (docs/BLOG_STANDARD.md §3.2.1, EU AI Act Art. 50(4)).
  Die Sicherheitsstufen folgen Legal/KYA_S1.md v1.4 (KYA-AL1/AL2/AL3).
---

# Kenne deinen Agenten (KYA-S1): Eine unterschriebene Seite über die KI in der Sicherheitsakte, die deine Daten berührt

Blog 1/11 · DWS IQ & Lifetime World Model · 8. August 2026 · Risto Anton Päärni

## Einleitung: KI trifft Entscheidungen — aber wer trägt die Verantwortung?

In den Beschaffungsakten von Unternehmen und öffentlicher Verwaltung liegt heute ein umfangreicher Stapel unterschriebener Dokumente. Auf Organisationsebene gibt es SOC 2 Type 2- und ISO/IEC 27001-Zertifikate. Für Daten und Datenschutz gibt es GDPR- und CSRD-Nachweise. Für Plattformsicherheit und Infrastruktur lässt sich FedRAMP oder eine souveräne Cloud-Zulassung vorweisen.

Ein kritisches Dokument fehlt in der Beschaffungsakte dennoch: eine unterschriebene Seite für den autonomen KI-Agenten.

Wenn KI vom Generieren von Text zu autonomen Handlungen übergeht — Code ausführen, APIs aufrufen, Finanztransaktionen durchführen und physische Industrieprozesse steuern — reicht alte Softwaresicherheit nicht mehr aus.

Ein autonomer KI-Agent ist nicht bloß Software. Er ist ein Akteur. Deshalb erfordert jeder Agent eine eigene verifizierte Identität, ein Handlungsmandat sowie eine unmittelbare Notbremse.

## Eine Seite für die Lieferantenakte (KYA-S1 v1.3 Specification)

KYA-S1 (Know Your Agent Security Specification v1.3) ist ein Vorschlag für einen Sicherheitsstandard, der das Laufzeitverhalten und die Identität von KI-Agenten verifiziert. Er verdichtet sich auf drei klare Fragen, die jeder Anbieter beantworten können muss, bevor ein Agent an die Daten des Kunden gelassen wird:

**Wer steht hinter dem Agenten? (IDV — Identity Verification)**
Jede Entscheidung des Agenten und jedes von ihm angeforderte Werkzeug muss auf einen kryptografisch verifizierten Menschen zurückverfolgbar sein (den HIC — den Menschen mit der Befehlsgewalt).

**Was darf er tun, und was tut er gerade jetzt? (REG & BHM)**
Der Agent muss ein vor der Aktivierung deklariertes Fähigkeitsmanifest besitzen (REG), das er zur Laufzeit nicht überschreiten kann, sowie eine kontinuierliche Verhaltensüberwachung (BHM) zur Erkennung von Abweichungen.

**Wie wird er im Fehlerfall gestoppt? (TC4 — Chain Termination)**
Bricht die Vertrauensstufe des Agenten zusammen oder tritt eine Abweichung auf, muss die gesamte Agentenkette innerhalb einer zeitlich begrenzten SLA-Reaktion atomar eliminiert werden können (leash snap).

## Keine Selbstbewertung (§3 Evidence Meta-Rule)

Die größte Fallgrube im Lieferantenmanagement ist die Selbstbewertung (self-attestation). §3 der KYA-S1-Spezifikation untersagt die Eigenerklärung des Anbieters absolut:

> **Regel (§3):** Selbstbewertung ist kein zulässiger Nachweis der KYA-S1-Konformität. Das Papier ist genau so viel wert wie der Name auf seiner zweiten Unterschriftszeile.

Als zulässiger Nachweis gilt ausschließlich ein Auditbericht einer akkreditierten dritten Partei (etwa eines SOC 2-Auditors oder eines akkreditierten Red-Team-Unternehmens) oder kryptografisch verifizierte Plattformtelemetrie, die in einem unveränderlichen Logregister aufbewahrt wird.

Diese Regel bindet auch den Verfasser der Spezifikation: Lifetime Oy stellt seiner eigenen DWS IQ-Plattform kein KYA-S1-Zertifikat aus, bevor ein unabhängiger, externer Prüfer es unterschrieben hat.

## KYA-AL-Sicherheitsstufen (Assurance Levels)

Die KYA-AL-Sicherheitsstufen der Branche definieren die Auditfrequenz und die SLA-Reaktionszeit:

| Sicherheitsstufe       | Auditfrequenz              | Geforderte Nachweistiefe                                            | SLA-Reaktionszeit (IDV & TC4) |
| ---------------------- | -------------------------- | ------------------------------------------------------------------- | ----------------------------- |
| **KYA-AL1 (Standard)** | Jährliches Audit           | Drittparteien-Audit in mindestens 1 Bereich + signierte Telemetrie  | max. 15 Minuten               |
| **KYA-AL2 (Enhanced)** | Vierteljährlich            | Audit in den Bereichen IDV und BHM + 12 Monate signierte Telemetrie | max. 5 Minuten                |
| **KYA-AL3 (Critical)** | Kontinuierlich in Echtzeit | Externer Prüfer in allen 7 Bereichen + signierte SLA                | max. 60 Sekunden              |

## Direkte Kopplung an den EU AI Act (§4)

Die KYA-S1-Spezifikation erzeugt Material, das sich unmittelbar für die Pflichten der KI-Verordnung der EU nutzen lässt:

- **Artikel 12 (Protokollierung):** Die PRV-Kontrolle von KYA-S1 erzeugt die Reproduzierbarkeit von Entscheidungen (PRV-2) und eine unveränderliche Historie.
- **Artikel 14 (Menschliche Aufsicht / HIC):** IDV, TC4, TRS und PRV-4 von KYA-S1 garantieren die tatsächliche Führungs- und Vetogewalt des Menschen.
- **Artikel 50 (Transparenz):** PRV-3 von KYA-S1 erzeugt eine überprüfbare Herkunftskennzeichnung für Ausgaben.

**Die ehrliche Grenze:** KYA-S1-Konformität ist als solche keine Konformität mit dem EU AI Act. Sie gibt dem Käufer einen harten technischen Nachweis dafür, dass das Laufzeitverhalten des Agenten dem Buchstaben des Gesetzes genügt.

## Kurz gefasst

- **Eine unterschriebene Seite:** Ein autonomer Agent braucht ein eigenes Sicherheitsdokument.
- **Echte Aufsicht:** KYA-S1 garantiert die Bindung eines menschlichen Verantwortlichen an den Agenten (IDV), die Beschränkung zur Laufzeit (REG/BHM) und eine Notbremse ohne Verzögerung (TC4).
- **Keine Selbstbewertung (§3):** Als Nachweis wird nur die Unterschrift eines unabhängigen Prüfers oder kryptografische Telemetrie akzeptiert.
- **AL-Sicherheitsstufen:** AL1, AL2 und AL3 definieren die geforderte Reaktionsgeschwindigkeit, von 15 Minuten bis hinunter zu 60 Sekunden.

## Die weiteren Teile der Serie

- **Teil 1:** Kenne deinen Agenten (KYA-S1) — Eine unterschriebene Seite über die KI, die deine Daten berührt
- **Teil 2:** Das KYC-Pendant für KI — sieben kritische KYA-Fragen
- **Teil 3:** EU AI Act Artikel 14 (HIC) und der Widerspruch der Agentenautonomie
- **Teil 4:** Agentenklassen: GitHub Copilot des Entwicklers vs. industrielle DWS IQ-Hintergrundagenten
- **Teil 5:** KYA-S1 und BPMN 2.0: Wie die Vertrauensstufe eines KI-Agenten einen Industrieprozess in der Praxis steuert
- **Teil 6:** KYA-S1 v1.3 × BPMN 2.0: Atomarer Lease Token, fail-closed und ehrliche TRS-Berechnung
- **Teil 7:** Wenn etwas schiefgeht: 72-Stunden-Fehlerklassifikation (FLT) und Entscheidungsreproduktion (PRV) in der Praxis
- **Teil 8:** Das KYA-S1-Ökosystem & die Produktions-Roadmap
- **Teil 9:** Lifetime World Model (LWM) — ein globales Zustandsregister und Gedächtnis
- **Teil 10:** Agentic-Commerce-Protokolle & autonome Zahlungen
- **Teil 11:** Die Verbindung zu eWallet EU (EUDI Wallet) & eIDAS 2.0

---

Risto Anton Päärni

Founder, CEO, Lifetime Oy

Chefredakteur, Lifetime Scope Journal
