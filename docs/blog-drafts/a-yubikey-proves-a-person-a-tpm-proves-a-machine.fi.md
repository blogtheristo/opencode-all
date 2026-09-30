---
slug: a-yubikey-proves-a-person-a-tpm-proves-a-machine
lang: fi
title: "YubiKey todistaa ihmisen. TPM todistaa koneen."
hero: "Kaksi laitteistotarkistusta vastaa kahteen eri kysymykseen auditoinnissa. Mitä kumpikin todistaa, mitä emme myy ja mitä pilottimme kirjaa."
visual: infographic
visual_src: docs/blog-drafts/img/a-yubikey-proves-a-person-a-tpm-proves-a-machine.svg
visual_alt: "Kaksi paneelia: turva-avain allekirjoittaa pysäytyksen ja todistaa, kuka oli paikalla; TPM allekirjoittaa käynnistystilan ja todistaa, millä koneella ajettiin. Alla Aegis Pilotin tietue tänään: pysäytyksen allekirjoitus on olemassa, laitteistovarmennus ei ole käytössä."
seo_tags: [aegis, hic, kya_tc4, kya_idv, article_14]
demo_agent:
demo_url:
target: onelifetime.world/posts/a-yubikey-proves-a-person-a-tpm-proves-a-machine.fi.html
date: 2026-09-30
author: Risto Anton Päärni
Status: DRAFT
---

Aegis Pilotin ensimmäistä todistajan valvomaa koetta suunnitellessamme esitimme itsellemme kysymyksen, jonka ostajan tarkastaja esittää: kun agentti pysähtyy, mikä todistaa, että sen pysäytti oikea ihminen, ja mikä todistaa, että pysäytys tapahtui koneella, jonka sanomme sen tapahtuneen?

Nämä ovat kaksi kysymystä, ja niihin vastaa kaksi eri laitetta.

**YubiKey todistaa ihmisen.** YubiKey, kuten mikä tahansa laitteistopohjainen turva-avain, on pieni laite, jonka kytket kannettavaan tietokoneeseen ja jota kosketat. Sen sisältämä salaisuus ei koskaan poistu laitteesta. Kun operaattori pysäyttää agentin, avain allekirjoittaa komennon, ja allekirjoitus on olemassa vain, jos kyseisen ihmisen avain oli fyysisesti paikalla. Tiedoston kopiointi ei kopioi sitä. Se vastaa kysymykseen "kenellä oli valta sillä hetkellä", minkä ihmisen suorittaman valvonnan kirjauksen on osoitettava siellä, missä EU AI Actin artikla 14 soveltuu, eli korkean riskin järjestelmissä.

**TPM todistaa koneen.** TPM on pieni siru tietokoneen emolevyllä. Se kirjaa, millä koneen käynnistys tehtiin, ja voi allekirjoittaa siitä lausuman. Jos joku vaihtaisi ohjelmiston agentin alta tai siirtäisi todisteet toiselle laitteelle, sirun lausuma lakkaa täsmäämästä. Se vastaa kysymykseen "oliko tämä se kone, ja pyöriko siinä tämä ohjelmisto".

Nämä kaksi eivät korvaa toisiaan. Rehellisen ihmisen kannettavan avain ei kerro mitään palvelimesta. Täydellinen palvelin ei kerro mitään siitä, kuka painoi pysäytystä.

Tässä missä olemme, suoraan sanottuna. Aegis Pilotissa operaattori allekirjoittaa pysäytyksen tänään ohjelmistoavaimella, jota säilytetään hänen omalla koneellaan. Allekirjoitus on tietueessa, ja se tarkistetaan ilman verkkoa. Se on myös heikompi kuin laitteistoavain, ja sanomme sen. Erikseen pilotin hyväksyntätietueessa on laitteistovarmennuksen osio, jossa on yksi merkintä TPM-tarkistukselle ja yksi laitteistoavaimelle. Pilotissa molemmat merkinnät sanovat "ei käytössä". Nämä ovat kaksi eri riviä: pysäytys on allekirjoitettu, eikä allekirjoituksen takana olevaa laitteistoa ole varmennettu. Haluamme mieluummin, että tietue sanoo tämän, kuin että luulet saaneesi enemmän kuin ostit.

Kaksi asiaa, joita emme tee. Emme myy laitteistoa. Ostat palvelimen ja avaimet toimittajilta, joiden kanssa jo toimit, ja ne ovat sinun omaisuuttasi. Emme myöskään väitä, että ohjelmisto yksin voisi tuottaa laitteistotodisteen. TPM tarvitsee hallitun käynnistysketjun sinun kohteessasi, ja se on kohteesi ominaisuus, ei meidän koodimme.

Seuraavaksi työstämme avainta. Pysäytyksen allekirjoittaminen laitteistoavaimella on pienempi askel kuin koneen varmentaminen, ja se on se, minkä tarkastaja näkee ensimmäisenä: ihminen, fyysisesti paikalla, pysäytyksen hetkellä. Ehtiikö se ennen ensimmäistä todistajan valvomaa koettamme, ei ole vielä päätetty, emmekä väitä sitä ennen kuin pysäytys on allekirjoitettu näin ja tietue sen osoittaa.

Jos ajat agentteja paikassa, jossa joku myöhemmin kysyy, kuka ne pysäytti ja millä, kysy toimittajaltasi, kumman näistä he voivat näyttää. Pyydä sitten nähdä tietue. Useimmat toimittajat voivat näyttää sinulle lokin. Loki ei ole sama asia kuin allekirjoitettu ketju, jonka ulkopuolinen voi tarkistaa ilman verkkoa ja ilman soittoa toimittajalle. Jälkimmäistä varten Aegis Pilotin näyttöpaketti on tarkoitettu toimitettavaksi tarkastajallesi. Se on valmis ensimmäiseen todistajan valvomaan kokeeseemme mennessä, ja kunnes ulkopuolinen on tarkistanut sellaisen, pidä sitä lupauksena eikä vielä tuotteena. Siksi tietue sanoo sen, mitä se sanoo.

Kirjoitamme uudelleen sinä päivänä, kun pysäytys on allekirjoitettu laitteistoavaimella ja tietue sen osoittaa.

Risto Anton Päärni
Founder, CEO · Lifetime Oy · the Agent Outcome Company
