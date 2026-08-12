Status: APPROVED
Slug: kya-s1-terminology-correction-sweep
Title: KYA-S1-terminologiakorjaus julkaistuihin postauksiin (korjaussweep, ei uutta postausta)
Language: en + fi (34 tiedostoa, molemmat kansiot)
Target: onelifetime.world/posts/*.html + landing-pages/onelifetime-world/posts/*.html
Date: 2026-08-10

TYÖN LUONNE — lue tämä ensin

Tämä ei ole uusi blogipostaus. Tämä on korjaussweep jo julkaistuihin postauksiin,
joten Sääntö 13:n mukainen hyväksyttävä teksti on MUUTOSJOUKKO, ei postauksen
leipäteksti. Hyväksyt alla olevat merkkijonokorvaukset, et 34 postausta uudelleen.

HIC-PÄÄTÖS 10.08.2026 (laajuus lukittu)

  - Vanhat päivätyt versiolauseet PIDETÄÄN ennallaan. Historiaa ei kirjoiteta uusiksi.
  - Lisätään YKSI päivitysmerkintä.
  - EI korvata kaikkia vanhoja versionumeroita v1.5:llä.

MIKSI

DWS_TRUTH_STANDARD rivi 35 merkitsee kaksi asiaa vanhentuneeksi (FAIL):
  - KYA-S1:n kutsuminen "standardiksi" — korjattu spesifikaatioksi 06.08.2026
    (HIC-korjaus). Se ei ole käynyt läpi standardointielimen konsensusprosessia,
    joten "standardi" liioittelee sen asemaa.
  - Legal/KYA_S1_v1.3.md on kumottu 09.08.2026; kanoninen on Legal/KYA_S1.md v1.5.

Julkaistut postaukset toistavat yhä vanhaa kehystä.

EDITORIAALINEN PERIAATE — MITÄ KORJATAAN JA MITÄ EI

  KORJATAAN: väärä luonnehdinta siitä, MIKÄ dokumentti on.
             "standard" -> "specification" on asiavirheen korjaus.

  EI KORJATA: päivätyt versiolauseet leipätekstissä.
             "Today we publish KYA-S1 v1.2" oli tosi julkaisuhetkellä.
             Julkaistun tekstin historian uudelleenkirjoittaminen on
             huonoa editoriaalista käytäntöä — sen tilalle tulee
             päivitysmerkintä, ei hiljainen muutos.

MUUTOSJOUKKO

1) "a vendor standard" -> "a vendor specification"
   38 osumaa (juuri 19 + peili 19), 34 tiedostoa.
   Näistä 18 on JSON-LD/meta-kuvauksessa (kuvaa nykytilaa) ja 1 leipätekstissä
   (kya-s1-one-signed-page.html:215).

2) "the standard" -> "the specification"   [KYA-S1:een viittaavat]
   18 osumaa. Kaikki tarkistetut osumat viittaavat KYA-S1:een, esim.
   "The rest of the standard exists to...", "Read the standard".
   Osumat, jotka viittaavat muuhun standardiin (SOC 2, ISO 27001, eIDAS),
   jätetään koskematta — tarkistan jokaisen ennen korvausta.

3) "KYA-S1-standardin" -> "KYA-S1-spesifikaation"   [FI]
   2 osumaa (agent-classes-copilot-vs-dws-iq.fi.html:284 + peili).

4) META/JSON-LD-versio: "KYA-S1 v1.2" -> "KYA-S1 v1.5"
   18 osumaa meta-kuvauksissa. Meta kuvaa kohdetta nyt, ei julkaisuhetkeä,
   joten versio saa olla ajantasainen.

5) EI MUUTETA: "KYA-S1 v1.2" ja "KYA-S1 v1.3" leipätekstissä
   2 + 37 osumaa. HIC-päätös: historia säilyy.
   Tilalle YKSI päivitysmerkintä KYA-S1-sarjan postausten alkuun.

   EHDOTETTU SANAMUOTO (poikkeaa HIC:n sanelusta, ks. perustelu alla):

   EN: "Update (10 August 2026): KYA-S1 is a specification, not a standard.
        The current version is v1.5, which added the TRS-4, TRS-5, PRV-4,
        TC4-5 and FLT-4 controls and renamed the assurance levels to
        KYA-AL1 / KYA-AL2 / KYA-AL3. Version numbers named in this post
        refer to what was current when it was published."

   FI: "Päivitys (10.8.2026): KYA-S1 on spesifikaatio, ei standardi.
        Voimassa oleva versio on v1.5, joka lisäsi kontrollit TRS-4, TRS-5,
        PRV-4, TC4-5 ja FLT-4 ja nimesi varmuustasot muotoon
        KYA-AL1 / KYA-AL2 / KYA-AL3. Tekstissä mainitut versionumerot
        viittaavat julkaisuhetkellä voimassa olleeseen versioon."

   KAKSI POIKKEAMAA HIC:N SANELUSTA — PERUSTELU:

   a) "v2.0" jätetty pois. Julkisessa KYA-S1-postauksessa paljas "v2.0"
      luetaan KYA-S1 v2.0:ksi. Sitä ei ole julkaistu — se on varattu
      skeeman jäädytykselle. Merkintä väittäisi julkisesti olemassa
      olematonta spesifikaatioversiota.

   b) "jurisdiktioprofiilit ja RQ-rakenne" jätetty pois. Ne päivittyivät
      TUTKIMUSSUUNNITELMAN v2.0:ssa, eivät KYA-S1 v1.5:ssä. KYA-S1 v1.5:n
      todellinen sisältö on yllä lueteltu viisi kontrollia + KYA-AL-nimeäminen
      (lähde: Legal/KYA_S1.md versiohistoria). Tutkimussuunnitelma ei ole
      julkinen dokumentti, joten siihen ei viitata blogissa.

LAAJUUS JA VAIKUTUS

  Tiedostoja:      34 (+ 34 peilissä, Dual Folder Sync samassa commitissa)
  Korvauksia:      ~58 merkkijonokorvausta + 1 päivitysmerkintä per KYA-S1-sarjan postaus
  Ei koske:        postausten sisältöä, otsikoita, rakennetta, URL-osoitteita
  Ei koske:        dws10.com/compliance (korjattu jo erikseen 06.08.2026)

MITÄ EI TEHDÄ ILMAN ERILLISTÄ HYVÄKSYNTÄÄ

  - Postausten uudelleenjulkaisu tai päivämäärien muuttaminen
  - LinkedIn-/uutiskirjejakelun uusiminen
  - Kanonisen Legal/KYA_S1.md:n muuttaminen (se on jo oikein, v1.5)
