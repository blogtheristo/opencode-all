# Handoff — claude/tutkimussuunnitelma-tiivistelmä-fczxea

**Date:** 11.08.2026 · **Status:** valmis, odottaa HIC:n hyväksyntää

## Mitä tehtiin

HIC:n kaksi kritiikkikohtaa tutkimussuunnitelman tiivistelmään (masteri + Nokia-export, molemmat v2.1 → v2.3):

1. **Empiirinen perusta.** Uusi osio: aineisto syntyy kaupallisessa, tuotannollisessa DWS IQ -ympäristössä; myynnin ja käyttöönottojen on onnistuttava, jotta väitös voi valmistua. Riippuvuus kirjattu riskinä (RQ1/RQ2 etenevät ilman uusia käyttöönottoja, RQ3/RQ4 eivät) + minimiaineistokynnys kk 1–6. Ristiriita "arviointi erillään kaupallisesta tuotekehityksestä" -lauseen kanssa ratkaistu: kaupallinen kanava tuottaa aineiston, ei tulkintaa.
2. **Jurisdiktiokehys.** Ei EU–US-asetelma. RQ2 kattaa EU:n (FI/SE/DE), Yhdysvallat, Singaporen, Etelä-Korean ja ASEAN/Aasian. Taulukkoon 4 uutta riviä evidenssistatuksineen; rehellisyysvartija laajennettu kaikkiin ei-empiirisiin profiileihin. Vanha kolmen EU-maan rajaus säilytetty kumottuna (Sääntö 12).

3. **Tutkimus vs. GTM (v2.3).** Uusi osio "Jurisdiktiokehys ei ole markkinasuunnitelma": laaja vertailukehikko ei laajenna markkinajoukkoa. GTM-vaihe 1 = 2–3 markkinaa nimetyllä ostajalla, kumppanilla, data-aineistolla ja toimituskyvyllä; Suomi kotimarkkina, Ruotsi/Saksa myyntipolun ehdolla, SG/KR/ASEAN myöhempiä profiileja.

**Versioparius (HIC 11.08.2026):** Nokia-export kantaa aina masterin versionumeron — sekä repossa että Drive-vientinimessä. Sääntö kirjattu molempien tiedostojen headeriin.

## Drive (kansio: LUT PhD — Sovereign Edge AI)

- `2.2_KYA-S1_tutkimussuunnitelman_tiivistelma_FI` — 11xOfwnmwKFxEw4g45EBLb4r9N3p8oH24RiTW6m6P7Wc
- `2.2_Nokia-säätiö tutkimussuunnitelman tiivistelmä (FI)` — 1OLAWOPOEqauKNhznKrJSgTkuXw-uoNzNd7B4B0QgxQs

## Avoin kysymys HIC:lle

Etelä-Korea on kehyksessä merkinnällä `unverified` — repossa ei ole sille sääntely-/hankinta-/standardointireitin lähdekartoitusta (vain G7-koalitiomaininta PHD_FIREHORSE §14.24). Vaihtoehdot: (a) pidetään `unverified`-merkinnällä, (b) tehdään lähdekartoitus ennen Nokia-säätiön DL 15.9.2026, (c) poistetaan kehyksestä.

## Huom seuraavalle sessiolle

- Prettier-hook muuntaa `***`-delimiterit `---`:ksi jokaisella Edit/Write-kutsulla näissä .md-tiedostoissa. Palautettu käsin; tarkista ennen commitia (`grep -n '^---$'`).
- MCP Drive ei osaa ylikirjoittaa olemassa olevaa Docsia — uusi versio = uusi tiedosto.
