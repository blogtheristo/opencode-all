# Next-Session Prompt — KYA-S1 / LUT-tutkimussuunnitelma, jatko 11.08.2026

> Itsenäinen brief seuraavalle Claude Code -sessiolle. Edellinen sessio:
> `claude/phd-research-sovereign-edge-ok1wk3` (PR #1712). Kopioi §"Liitettävä prompt"
> uuden session ensimmäiseksi viestiksi.

***

## VERSION AND AGENT HISTORY

| Kenttä  | Arvo                                                        |
| ------- | ----------------------------------------------------------- |
| Versio  | 1.0                                                         |
| Työkalu | Claude Code                                                 |
| Sessio  | claude/phd-research-sovereign-edge-ok1wk3                    |
| Päiväys | 10.08.2026                                                  |
| Tila    | AKTIIVINEN — luovutus seuraavalle sessiolle                 |
| Kieli   | Suomi                                                       |
| Tyyppi  | Next-session prompt / luovutus                              |

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code | Session: claude/phd-research-sovereign-edge-ok1wk3 | Date: 10.08.2026 | Changes: Ensimmäinen versio. Luovutus PR #1712:n työstä: KYA-versioauditointi, tuotevirheiden korjaus, tutkimussuunnitelman RQ-uudistus, blogin terminologiakorjaus ja postauksen #71 julkaisu.

***

## 1. Mitä edellinen sessio päätti (älä kysele näitä uudelleen)

| Päätös | Sisältö | Lähde |
| --- | --- | --- |
| **Kanoninen masteri** | `docs/lut/tutkimussuunnitelman-tiivistelma-lut-2026-fi.md` on tutkimuksen masteri. Nokia-tiedosto (`2026-08-10-nokia-saatio-…`) on **apurahakohtainen export**, ei rinnakkainen lähde. Muutokset masteriin ensin. | HIC 10.08. |
| **RQ-rakenne** | Jurisdiktioita **ei sidota RQ-kohtaisesti** — muuten työ kääntyy kolmeksi maatutkimukseksi. Tieteellinen kohde = **KYA-S1:n siirrettävyys ja evidenssin vertailtavuus**. RQ1 evidenssi · RQ2 jurisdiktioprofiilit · RQ3 turvallisuus ja suorituskyky · RQ4 siirrettävyys ja käyttöönotto. | Boardy + HIC 10.08. |
| **Evidenssistatukset** | Suomi = empiirinen · Ruotsi = **ehdollinen** empiirinen (vain jos KTH/TECoSA toteutuu) · Saksa = **skenaarioprofiili, ei tutkimusdataa**. Eritasoisuus on tarkoituksellinen, ei tasoiteta. | HIC 10.08. |
| **Ohjaussuhde** | LUT ohjaa koko väitöskirjan. KTH/Törngren = mahdollinen ulkopuolinen menetelmätuki, **ei ohjaajataho eikä edellytys**. | HIC 10.08. |
| **Tutkinnot** | DI (LUT 2007) **ja** insinööri ylempi AMK (Metropolia 2026) — kaksi erillistä maisteritason tutkintoa. DI ensin. | HIC 10.08. |
| **KYA-S1 = spesifikaatio** | Ei "standardi". Kanoninen tiedosto `Legal/KYA_S1.md` v1.5. `Legal/KYA_S1_v1.3.md` on **kumottu — älä siteeraa**. | Truth Standard rivi 35 |
| **KYA v2** | **Varattu, ei julkaistu.** Skeeman jäädytys + mandaattikerros, EIC WP2:n kohde. Ulkoisesti "seuraava sukupolvi", ei "julkaistu". | `Legal/KYA_STANDARD_v1.md` |
| **Blogi: historia säilyy** | Päivättyjä versiolauseita ei kirjoiteta uusiksi. Yksi päivitysmerkintä riittää. | HIC 10.08. |
| **Postaus #71 ground truth** | `greg-isenberg-agents-need-a-signature.html` — **EN on ground truth**, käännökset johdetaan siitä. | HIC 10.08. |

## 2. Mitä on tehty (älä tee uudelleen)

- **KYA-versioauditointi** → `Legal/KYA_VERSION_AUDIT_2026-08-10.md` (kartta: mikä dokumentti omistaa mitä, käyttökohteet, tuotteet, avoin velka).
- **3 tuotevirhettä korjattu**: themis.html "KYA Standard v1.7" (ei ole olemassa) → v1.12; aegis.html MicroVM "KYA v1.4" → KYA Security v1.2; `src/identity/*.ts` siteerasi kumottua `KYA_S1_v1.3.md` → `KYA_S1.md`. Kaikki peileineen.
- **PR #1815 ja #1816 mergetty** mainiin. #1816 toteutti auditlistan **P1-1** (latenssi pois ATS:stä).
- **Blogin terminologiasweep** ajettu (34 postausta × 2 kansiota): "standard" → "specification", meta-versio v1.2 → v1.5, yksi päivitysmerkintä per KYA-S1-sarjan postaus, käännökset sv/fr/de.
- **Postaus #71 julkaistu** alkuperäisellä päiväyksellä 24.7.2026, rekisteröity, navigaatio kytketty.
- **Drive**: kansio *LUT PhD — Sovereign Edge AI*, masteri viety nimellä `2.0_KYA-S1_tutkimussuunnitelman_tiivistelma_FI`.

## 3. Avoin työ

| # | Tehtävä | Miksi tärkeä |
| --- | --- | --- |
| 1 | **KYA-auditlistan P1-2 ja P1-3** (`Legal/KYA_AUDIT_WORKLIST_2026-08.md`) — V:n aikaikkuna/vaimennus/rehabilitaatio ja seurausluokkakohtaiset ATS-kynnykset | TRS-1:n "documented inputs" -väite ei ole vielä täytetty |
| 2 | **TRS-1:n kolme puuttuvaa syötettä** — behavioral baseline distance, red-team posture, capability manifest **scope**. Vain IDV on toteutettu. | Ilman näitä KYA-AL-tieriä ei voi väittää |
| 3 | **Nokia-säätiön haku 15.9.** — tiivistelmä valmis; puuttuu Smolanderin allekirjoittama ohjaajalausunto (`docs/lut/2026-07-22-smolander-supervisor-statement.md`, v1.1, EN+FI) | Kova määräaika |
| 4 | **Ruotsin evidenssistatus** — päivitä ehdollisesta empiiriseksi tai skenaarioksi sen mukaan, eteneekö KTH/TECoSA syksyllä | Rehellisyysvartija |
| 5 | **Drive-siivous** — kalenterissa ke 12.8. klo 07:00; poistolistalla myös vanhentunut `1.1_Nokia-säätiö…` | Yksi voimassa oleva versio per dokumentti (§4.7) |
| 6 | **Postauksen #71 käännökset** (FI vähintään) — Sääntö 13:n portti koskee myös käännöksiä: oma luonnos + hyväksyntä | EN on ground truth |

## 4. Ansat — nämä kaatoivat aikaa edellisessä sessiossa

1. **`node -e "require('./scripts/inject-blog-nav.cjs')"` AJAA skriptin.** Se ei ole moduuli. Käytä `node --check` syntaksitarkistukseen. Injektori muuttaa naapuripostauksia (oikein) ja re-stamppaa satunnaisia vanhoja postauksia (väärin) — tarkista `git status` ja peru kosmeettiset muutokset.
2. **Uusi postaus tarvitsee `    <!-- Footer -->` -markerin** ennen `<footer>`, muuten injektori skippaa sen eikä navigaatiota tule.
3. **Injektori ajaa vain `onelifetime.world/`:iin** — peili on kopioitava käsin (Dual Folder Sync).
4. **X.com, nitter, threadreaderapp, gregisenberg.com ovat estetty** egress-gatewayssa (403 CONNECT). Playwright käyttää samaa polkua — älä tuhlaa aikaa Chromiumiin. **Etsi lähde reposta**: `docs/field-notes/` sisälsi molemmat Isenberg-ketjut päivättyinä.
5. **Kaksi rinnakkaista tiivistelmää** oli driftin lähde. Nyt bannerit kertovat kumpi on masteri — älä muokkaa exportia lähteenä.

## 5. Liitettävä prompt

> **Tehtävä:** Jatka KYA-S1 / LUT-tutkimussuunnitelman työtä siitä mihin sessio
> `claude/phd-research-sovereign-edge-ok1wk3` (PR #1712) jäi.
>
> **Lue ensin:** `docs/NEXT_SESSION_PROMPT_KYA_LUT_2026-08-11.md` (tämä tiedosto) —
> §1 päätökset, §2 tehty työ, §3 avoin työ, §4 ansat. Älä kysy uudelleen §1:n
> päätöksiä; ne on tehty.
>
> **Sitten:** `Legal/KYA_VERSION_AUDIT_2026-08-10.md` (KYA-versiokartta),
> `Legal/KYA_AUDIT_WORKLIST_2026-08.md` (P1–P3 avoinna),
> `docs/lut/tutkimussuunnitelman-tiivistelma-lut-2026-fi.md` (kanoninen masteri).
>
> **Aloita:** kysy HIC:ltä kumpi §3:n avoimista kohdista otetaan ensin — P1-2/P1-3
> (tekninen velka, estää KYA-AL-tierin väittämisen) vai Nokia-säätiön 15.9.
> (kova määräaika, tarvitsee Smolanderin allekirjoituksen). Älä aloita molempia.
>
> **Muista:** Sääntö 13 koskee myös käännöksiä. Kanoninen masteri ensin, export
> sen jälkeen. Rehellisyysvartijat pysyvät: Saksa = skenaario, Ruotsi = ehdollinen,
> KTH = ei ohjaajataho, KYA v2 = varattu ei julkaistu, KYA-S1 = spesifikaatio.

***

_Versio 1.0 · 10.08.2026 · © Lifetime Oy — kaikki oikeudet pidätetään._
_Liikesalaisuus / Business Confidentiality: sisältää Lifetime Oy:n luottamuksellista tietoa._
