---
slug: kya-s1-reading-path
lang: fi
title: "KYA-S1 järjestyksessä — lukupolku yhdestä allekirjoitetusta sivusta todennettuun ihmiseen"
hero: "Kuusi kirjoitusta allekirjoitetusta toimittajasivusta agentin takana olevaan, EU-tasolla todennettuun ihmiseen — siinä järjestyksessä kuin ostaja ne tarvitsee."
visual: infographic
visual_src: docs/blog-drafts/img/kya-s1-reading-path.svg
visual_alt: "Kuusi kirjoitusta yhdellä linjalla: allekirjoitettu sivu, seitsemän kysymystä, sanasto, roadmap, EU:n digitaalinen lompakko ja Artikla 14:n mukainen ihmisen valvonta"
seo_tags: [kya_s1_spec, kya_evidence_meta_rule, kya_trs, hic, article_14, eudi_wallet]
date: 2026-09-30
author: Risto Anton Päärni
Status: DRAFT
kind: hub
note: "Visual not yet made — the SVG is a to-do."
translation_of: kya-s1-reading-path.md
ai_translated: true
---

# KYA-S1 järjestyksessä — lukupolku yhdestä allekirjoitetusta sivusta todennettuun ihmiseen

KYA-S1-turvallisuusspesifikaatio on toimittajille suunnattu määrittely autonomisten agenttien identiteetille ja käyttäytymiselle. Sen tarkoitus on helppo sanoa: antaa hankinnalle agentista yksi allekirjoitettu sivu SOC 2:n ja ISO 27001:n rinnalle — sivu, joka kertoo, kuka agentin takana on, mitä se saa tehdä ja miten se pysäytetään. Olemme kirjoittaneet siitä useaan otteeseen, useimmiten suomeksi osana kaksitoistaosaista sarjaa. Tämä sivu asettaa kuusi kirjoitusta yhdelle linjalle, jotta lukija näkee, miten ne liittyvät toisiinsa.

Järjestys seuraa ostajan kysymyksiä. Ensin: mikä sivu on, ja miksi se tarvitsee riippumattoman allekirjoituksen? Sitten: mitä ostaja tarkalleen kysyy? Sitten: mitä termit tarkoittavat? Sitten: miten organisaatio ottaa sen käyttöön vaiheittain? Ja lopuksi: kenellä on ihmisen johtamisvalta, ja miten tuo ihminen todennetaan — sekä prosessissa että EU:n lainsäädännössä.

Huomio versioista. Kirjoitukset syntyivät sitä mukaa kuin spesifikaatio kehittyi. Englanninkielinen kirjoitus julkisti version 1.2, suomenkielinen sarja viittaa versioon 1.3, ja nykyinen versio on 1.5, jossa varmuustasot nimettiin uudelleen: KYA-AL1, KYA-AL2 ja KYA-AL3. Kukin kirjoitus mainitsee julkaisuhetkellään voimassa olleen version.

## 1. [KYA-S1 — One Signed Page for the Agent in Your Vendor File](https://onelifetime.world/posts/kya-s1-one-signed-page.html) (englanniksi)

Lähtöpiste. Yksi sivu, jonka allekirjoittavat toimittaja ja riippumaton arvioija, seitsemän kontrollia — IDV, BHM, REG, TC4, FLT, TRS, PRV — ja uusimispäivä. Kirjoitus sulkee pois itse annetut vakuutukset, myös Lifetime Oy:n omat, ja on tarkka EU AI Actin suhteen: KYA-S1 tuottaa Artikloihin 12, 14 ja 50 liittyvää näyttöä, mutta ei yksin täytä niiden velvoitteita.

## 2. [KYC:n vastine tekoälylle — seitsemän KYA-kysymystä](https://onelifetime.world/posts/kya-kyc-seven-questions.fi.html)

Ostajan tarkistuslista. Kirjoitus siirtää pankkimaailman Know Your Customer -periaatteen tekoälyagentteihin: miten luottaa toimijaan, jolla ei ole kasvoja eikä passia? Se muuttaa seitsemän kontrollia seitsemäksi kysymykseksi — kuka vastaa, missä rajat kulkevat, miten agentti käyttäytyy, miten se pysäytetään, kuka maksaa virheen, onko lupa voimassa juuri nyt ja voiko päätöksen toistaa vielä kahden vuoden päästä.

## 3. [KYA-S1 Sanasto — käsitteistö ja sanasto](https://onelifetime.world/posts/kya-s1-sanasto-glossary.fi.html)

Hakuteos. Sanasto kokoaa ydintermit yhteen paikkaan: seitsemän kontrollialuetta, kolme varmuustasoa auditointitiheyksineen, vasteaikojen SLA:t ja toistoikkunat sekä ajonaikaiset mekanismit, kuten kertakäyttöinen valtuutusavain (Lease Token), pakkosuojaus vikatilanteessa (fail-closed), hätäjarru (leash snap), tallennus ennen resursseista luopumista ja aikarajoitettu virheattribuutio (72 h). Pidä se auki, kun luet sarjan muita osia.

## 4. [KYA-S1 Ekosysteemi & tuotanto-roadmap](https://onelifetime.world/posts/kya-s1-ecosystem-roadmap.fi.html)

Käyttöönottosuunnitelma. Kirjoitus käsittelee KYA-S1:tä ostajan välineenä toimittajahallintaan ja näyttää, miten kolme varmuustasoa muodostavat vaiheittaisen tiekartan, jossa vasteajat kiristyvät viidestätoista minuutista viiteen minuuttiin ja lopulta kuuteenkymmeneen sekuntiin. Se toistaa Näyttömetasäännön (§3) — ei itse annettuja vakuutuksia — ja sijoittaa KYA-S1:n hankintakansioon SOC 2:n, ISO 27001:n, ISO/IEC 42001:n ja FedRAMPin rinnalle. Siellä se kattaa autonomisen agentin, jota nuo standardit eivät kata.

## 5. [Yhteys eWallet EU (EUDI Wallet) & eIDAS 2.0](https://onelifetime.world/posts/eudi-wallet-eidas2-human-identity.fi.html)

Identiteetin ankkuri. Organisaation sisäinen SSO-kirjautuminen ei riitä, kun agentti allekirjoittaa sopimuksia tai asioi viranomaisten kanssa yli organisaatiorajojen; sen takana olevan ihmisen on oltava todennettu EU-tasolla. Kirjoitus kytkee EU:n digitaalisen lompakon (EUDI Wallet) ja eIDAS 2.0:n IDV-kontrolleihin: reaaliaikainen tunnistus, kryptografinen sidos agentin istuntoon ja peruutus, joka leviää varmuustason sallimassa ajassa ja laukaisee hätäjarrun.

## 6. [EU AI Act Artikla 14 (HIC) ja agenttien itsenäisyyden ristiriita](https://onelifetime.world/posts/eu-ai-act-article-14-hic.fi.html)

Ihmisen johtamisvalta. Artikla 14 edellyttää tehokasta ihmisen suorittamaa valvontaa, mutta agentti, joka tarvitsee ihmisen klikkauksen jokaiseen kutsuun, on hyödytön. Kirjoitus ratkaisee ristiriidan luottamuspisteeseen perustuvalla reitityksellä: kun luottamuspiste ylittää tehtävän kynnysarvon, agentti toimii automaattisesti; kun se jää alle tai Trust Engine ei vastaa ajoissa, tehtävä siirtyy ihmiselle yhtenäiseen valvomonäkymään (HIC Dashboard). Jokaiseen ihmisen hyväksyntään vaadittava kirjallinen perustelu estää kumileimasimen.

## Miten kuusi sopivat yhteen

Allekirjoitettu sivu on lupaus. Seitsemän kysymystä ovat ostajan tapa tarkistaa se. Sanasto lyö sanat lukkoon, ja roadmap muuttaa lupauksen vaiheiksi, jotka organisaatio voi ottaa käyttöön. Kaksi viimeistä kirjoitusta vastaavat kysymykseen, joka on jokaisen kontrollin pohjalla: kuka ihminen on vastuussa — todennettuna EU-identiteetillä ja ihmisen johtamisvalta tallessa ilman, että hänestä tulee pullonkaula.

Risto Anton Päärni
Perustaja & toimitusjohtaja, Lifetime Oy · Päätoimittaja, Lifetime Scope Journal
