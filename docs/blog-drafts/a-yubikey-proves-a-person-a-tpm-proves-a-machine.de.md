---
slug: a-yubikey-proves-a-person-a-tpm-proves-a-machine
lang: de
title: "Ein YubiKey belegt eine Person. Ein TPM belegt eine Maschine."
hero: "Zwei Hardware-Prüfungen beantworten zwei verschiedene Fragen im Audit. Was jede belegt, was wir nicht verkaufen und was unser Pilot festhält."
visual: infographic
visual_src: docs/blog-drafts/img/a-yubikey-proves-a-person-a-tpm-proves-a-machine.svg
visual_alt: "Zwei Felder: Ein Sicherheitsschlüssel signiert den Stopp und belegt, welche Person anwesend war; ein TPM signiert den Startzustand und belegt, welche Maschine lief. Darunter der Aegis-Pilot-Nachweis heute: Stopp-Signatur vorhanden, Hardware-Attestierung nicht genutzt."
seo_tags: [aegis, hic, kya_tc4, kya_idv, article_14]
demo_agent:
demo_url:
target: onelifetime.world/posts/a-yubikey-proves-a-person-a-tpm-proves-a-machine.de.html
date: 2026-09-30
author: Risto Anton Päärni
Status: DRAFT
---

Bei der Planung des ersten bezeugten Tests des Aegis Pilot haben wir uns eine Frage gestellt, die der Prüfer eines Käufers stellen wird: Wenn der Agent stoppt, was belegt, dass eine echte Person ihn gestoppt hat, und was belegt, dass es auf der Maschine geschah, die wir nennen?

Das sind zwei Fragen, und zwei verschiedene Geräte beantworten sie.

**Ein YubiKey belegt eine Person.** Ein YubiKey ist, wie jeder Hardware-Sicherheitsschlüssel, ein kleines Gerät, das Sie an Ihren Laptop anschließen und berühren. Es enthält ein Geheimnis, das das Gerät nie verlässt. Wenn der Bediener einen Agenten stoppt, signiert der Schlüssel den Befehl, und die Signatur existiert nur, wenn der Schlüssel dieser Person physisch anwesend war. Eine Datei zu kopieren kopiert sie nicht. Er beantwortet die Frage "wer hatte in diesem Moment die Befugnis", was ein Nachweis menschlicher Aufsicht dort zeigen muss, wo Artikel 14 des EU AI Act gilt, also bei Hochrisiko-Systemen.

**Ein TPM belegt eine Maschine.** Ein TPM ist ein kleiner Chip auf der Hauptplatine des Computers. Es hält fest, womit die Maschine gestartet ist, und kann darüber eine Aussage signieren. Wenn jemand die Software unter dem Agenten austauscht oder die Nachweise auf ein anderes Gerät verlegt, passt die Aussage des Chips nicht mehr. Es beantwortet die Frage "war das diese Maschine, und lief darauf diese Software".

Die beiden ersetzen einander nicht. Ein Schlüssel am Laptop einer ehrlichen Person sagt nichts über den Server. Ein perfekter Server sagt nichts darüber, wer auf Stopp gedrückt hat.

Hier ist unser Stand, ganz offen. Im Aegis Pilot signiert der Bediener einen Stopp heute mit einem Software-Schlüssel, der auf seinem eigenen Rechner liegt. Diese Signatur ist im Nachweis vorhanden und wird ohne Netzwerk geprüft. Sie ist auch schwächer als ein Hardware-Schlüssel, und das sagen wir. Getrennt davon enthält der Abnahmenachweis des Piloten einen Abschnitt zur Hardware-Attestierung, mit einem Eintrag für die TPM-Prüfung und einem für den Hardware-Schlüssel. Im Piloten steht bei beiden Einträgen "nicht genutzt". Das sind zwei verschiedene Zeilen: Der Stopp ist signiert, und die Hardware hinter der Signatur ist nicht attestiert. Wir möchten lieber, dass der Nachweis das sagt, als dass Sie mehr annehmen, als Sie gekauft haben.

Zwei Dinge tun wir nicht. Wir verkaufen keine Hardware. Sie kaufen den Server und die Schlüssel bei den Anbietern, mit denen Sie ohnehin arbeiten, und sie gehören Ihnen. Und wir behaupten nicht, dass Software allein einen Hardware-Nachweis liefern kann. Ein TPM braucht an Ihrem Standort eine kontrollierte Startkette, und das ist eine Eigenschaft Ihres Standorts, nicht unseres Codes.

Als Nächstes arbeiten wir am Schlüssel. Den Stopp mit einem Hardware-Schlüssel zu signieren ist ein kleinerer Schritt als eine Maschine zu attestieren, und es ist das, was ein Prüfer zuerst sieht: die Person, körperlich anwesend, im Moment des Stopps. Ob das vor unserem ersten bezeugten Test fertig wird, ist noch nicht entschieden, und wir behaupten es nicht, bevor ein Stopp so signiert wurde und der Nachweis es zeigt.

Wenn Sie Agenten dort betreiben, wo später jemand fragt, wer sie gestoppt hat und womit, fragen Sie Ihren Anbieter, welches der beiden er Ihnen zeigen kann. Bitten Sie dann, den Nachweis zu sehen. Die meisten Anbieter können Ihnen ein Log zeigen. Ein Log ist nicht dasselbe wie eine signierte Kette, die ein Außenstehender ohne Netzwerk und ohne Anruf beim Anbieter prüfen kann. Letzteres ist das, was das Nachweispaket des Aegis Pilot Ihrem Prüfer übergeben soll. Es wird bis zu unserem ersten bezeugten Test bereit sein, und bis ein Außenstehender eines geprüft hat, behandeln Sie es als Versprechen und noch nicht als Produkt. Deshalb sagt der Nachweis, was er sagt.

Wir schreiben wieder, an dem Tag, an dem ein Stopp mit einem Hardware-Schlüssel signiert wurde und der Nachweis es zeigt.

Risto Anton Päärni
Founder, CEO · Lifetime Oy · the Agent Outcome Company
