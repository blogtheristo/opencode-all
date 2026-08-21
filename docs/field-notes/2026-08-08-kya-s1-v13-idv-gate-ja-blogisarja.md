# Kenttämuistiinpano: KYA-S1 v1.3, IDV-portti ja agenttihallinnan blogisarja

***

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Opus 5) | Session: claude/agent-use-cases-comparison-h7vl25 | Date: 08.08.2026 | Changes: Ensimmäinen versio — session HIC Learning Outcome. Kattaa A4-vertailun, seitsemän blogiluonnosta, KYA-S1 v1.3 -korjatun spesifikaation, kaksiosaisen katselmuksen (Osa A vendor-standardi, Osa B sisäiset standardit + koodi) ja P0-1:n toteutuksen.

Session Links & References:

- Claude Code (claude/agent-use-cases-comparison-h7vl25): https://github.com/blogtheristo/dws6/commits/claude/agent-use-cases-comparison-h7vl25
- PR: https://github.com/blogtheristo/dws6/pull/1808

Document Status:

- Created: 08.08.2026
- Last Modified: 08.08.2026
- Language: Finnish
- Publication Status: ACTIVE
- Classification: INTERNAL — FIELD NOTE
- Document Type: Field note / HIC Learning Outcome

***

## Mitä tapahtui

Sessio alkoi kysymyksestä, joka näytti viestintätehtävältä: vertaa agenttia GitHub Copilot -agenttiin ja DWS IQ:n osaaja-agentteihin, tee yksi A4. HIC:n idea oli tuoda Copilotin hallintamalli DWS IQ:hun — yksi dashboard, josta työnkulku käynnistetään ja johon agentit valikoituvat työvaiheen mukaan, mieluiten teollisuudessa tutuilla RUP-prosessikaavioilla.

A4 syntyi, ja sen jälkeen HIC kirjoitti seitsemän blogitekstiä, jotka veivät idean askel askeleelta koodiksi: RUP → BPMN 2.0 → KYA-S1:n luottamuspiste prosessin ehtona → BPMN XML → FLT/PRV-kriisinhallinta → EUDI Wallet.

**Se yritys — toteuttaa oma spesifikaatio kirjaimellisesti — oli session tuottavin asia.** Se paljasti aukkoja, joita lukemalla ei löydä.

## Keskeinen oivallus

**Spesifikaatio, joka kuvaa portin, ei ole sama asia kuin spesifikaatio, joka vaatii portin pitävän.**

KYA-S1 v1.2 TRS-2 kuului: _"actions above defined consequence thresholds are blocked when trust score falls below documented levels."_ Se kuvaa **tilan**, ei **hetkeä**. Jokainen todellinen toteutus arvioi pisteen hetkellä T₁ ja suorittaa teon hetkellä T₂. Jos luottamus romahtaa välissä, teko suoritetaan valtuudella jota ei enää ole — ja telemetria näyttää säännönmukaiselta portilta.

Tämä ei ole eksoottinen vikatila. Se on ilmeisimmän toteutuksen oletustulos. BPMN-moottori, joka lukee pisteen prosessimuuttujaan, reitittää sen perusteella ja kutsuu sitten Service Taskia, sisältää tämän raon — ja läpäisee TRS-2:n sellaisenaan.

Sama kuvio toistui neljä kertaa eri kerroksissa:

| Kerros       | Mikä näytti hallinnalta    | Mikä puuttui                                              |
| ------------ | -------------------------- | --------------------------------------------------------- |
| TRS-2        | Kynnysarvoportti           | Sidos pisteen ja teon välillä                             |
| BPMN-kaavio  | HIC-portti laatikkona      | Oletushaara automaattiin, ei ihmiseen                     |
| BPMN XML     | `inputParameter` tokenille | Tokenia ei kuluteta atomisesti — se on delegaatin sopimus |
| ATS-moottori | Luottamuspiste             | IDV-tila ei ollut syöte lainkaan                          |

Viimeinen on paljastavin. **Ihmisen todennuksen peruutus ei liikuttanut luottamuspistettä pistettäkään.** Arkkitehtuurikaaviossa ketju katkesi; ajossa se jatkoi auktorisointia. Kaavio ei valehdellut tahallaan — kukaan ei ollut koskaan koettanut piirtää sitä koodia vasten.

## Toinen oivallus: katselmus löysi enemmän kuin katselmoitava

Kun kohde vaihtui vendor-standardista (KYA-S1) sisäisiin standardeihin ja koodiin, löytyi vakavampi laji virhettä: **hajaantuminen**. Sama ATS-kaava esiintyi neljänä eri versiona neljässä dokumentissa ja viidentenä koodissa. `KYA_STANDARD_v1.md` §3.1 kantoi yhä additiivista muotoa, jonka sen **omat sisardokumentit** nimeävät score-inflaatiovektoriksi ja kertovat korvanneensa juuri siitä syystä.

Kumpikaan löydös ei ole suunnitteluvirhe KYA-konseptissa. Molemmat ovat ajautumaa neljän dokumentin ja yhden koodipolun välillä, jota yksikään yksittäinen ajo ei ollut sovittanut v1.4-jaon jälkeen.

## Mitä tehtiin

**Spesifikaatio.** `Legal/KYA_S1_v1.3.md` — viisi uutta tunnistetta, ei uudelleennumerointia, ei poistoja (§11:n stabiilius säilyy, minor-versio):

- **TRS-4** atominen auktorisointisidos — pistemäärä ei saa auktorisoida tekoa suoraan; kertakäyttöinen, aikaan sidottu allekirjoitettu token kulutetaan atomisesti teon kanssa
- **TRS-5** fail-closed — trust enginen katkos ei koskaan päästä tekoa läpi autonomisesti
- **PRV-4** ihmisen päätöksen provenienssi — valvontateko itse on Artikla 14:n todiste
- **TC4-5** talteenotto ennen resurssien vapautusta — muuten FLT:llä ei ole aineistoa
- **FLT-4** 72 h -kellon ankkurointi havaitsemiseen, ei vendorin määrittelemään sulkemiseen

**Koodi (P0-1).** IDV-tila pakolliseksi syötteeksi ja hard killiksi `calculateATS()`:ään. Pakollinen eikä valinnainen: valinnainen parametri antaisi kutsujan hiljaa ohittaa juuri sen kontrollin jota varten syöte on olemassa. Tämä oli mahdollista koska funktiolla ei ollut yhtään tuotantokutsujaa — fail-closed on siis rakenteellinen, ei sopimuksellinen. 8 uutta testiä.

**Rehellisyys ulospäin.** `KYA_S1_v1.3.md` §9 sisältää julkaistun conformance-noten: referenssitoteutus ei täytä TRS-1:tä. Perustelu on §3 — self-attestation on kielletty, ja väite kontrollin toteuttamisesta jota ei toteuteta on self-attestationia laiminlyönnillä. P0-1:n jälkeenkin **kolme neljästä TRS-1:n syötteestä puuttuu**, ja §9 sanoo sen.

## Mikä meni hyvin ja mikä ei

**Hyvin.** Vuorottelu, jossa HIC kirjoitti tekstin ja agentti tarkisti sen kanonia vasten, tuotti korjauksia molempiin suuntiin. HIC:n XML:stä löytyi kaksi BPMN-validiusvirhettä (yksi sequence flow kahden elementin outgoing-flowina), joiden seuraus oli täsmälleen se aukko jota kovennus yritti tukkia: HIC-polku ohitti PRV-kirjauksen. Agentin XML:stä HIC löysi vastaavasti, ettei `inputParameter` kuluta tokenia atomisesti.

**Ei hyvin.** Blogisarjan numerointi meni sekaisin kesken työn — kaksi tekstiä kantoi numeroa 6, ja osien 8–11 lisäys teki `/7`-nimittäjistä vanhentuneita. Se korjattiin osittain, mutta kartoitus 1–11 on yhä lukitsematta. Lisäksi tuotin turhaan v1.9-rekonstruktion konsultoinnin käsikirjasta, koska en kysynyt ensin oliko v1.10 jo se tiedosto joka Geminille meni.

**Toistuva harmi.** Formatoija muuntaa `***` → `---` VERSION AND AGENT HISTORY -lohkossa joka kirjoituksella, vastoin CLAUDE.md:n Markdown Delimiter Rulea. Korjasin käsin kolmesti. Käsin korjaaminen ei ole korjaus — se on auditlistalla P2-5.

## Seuraavat askeleet

Prioriteettijärjestyksessä, `Legal/KYA_AUDIT_WORKLIST_2026-08.md`:

1. **P0-2 + P0-3** — sovita ATS-kaava neljässä dokumentissa, valitse yksi A-kerroin. Sama commit.
2. **P1-1** — poista latenssi luottamuspisteestä. Hitaus ja epälojaalius eivät ole sama signaali.
3. **P2-1** — dokumentoi manifest-TTL hard kill kolmeen standardiin. Se on lähin olemassa oleva primitiivi TRS-4:lle, ja kontrollia joka on vain koodissa ei voi attestoida.
4. **P3** ennen mitään julkaisua — sarjan numerointi, LWM-termiristiriita, Osan 11 kolme varmentamatonta EU-väitettä.

## Avoimet päätökset HIC:lle

Kirjattu kokonaisuudessaan auditlistaan; kaksi merkittävintä:

- **Behavioral baseline distance -mittari** on määriteltävä ennen kuin sen voi toteuttaa: mikä on perustaso, mikä etäisyysmitta, mikä painotus. Tämä on määrittelypäätös, ei koodauskysymys, joten sitä ei arvattu.
- **§8:n tier-luvut** jätettiin v1.3:sta pois tarkoituksella. Ehdotetut arvot olivat insinöörin intuitiota eivätkä mittausta, ja standardissa julkaistuna ne olisivat normatiivisia adoptoijille joilla ei ole niille sen parempaa perustetta kuin meillä.

## HIC Learning Outcome -kirjanpito

1. Knowledge base (`/kb`) — **N/A — ei ajettu tässä sessiossa;** KYA-löydökset ovat auditlistassa ja katselmusdokumentissa, jotka ovat repossa ja PR:ssä. Ehdotan `/kb`-ajoa erillisenä, kun P0-2/P0-3 on ratkaistu ja ATS-kaava on yksikäsitteinen — muuten KB:hen menisi neljä ristiriitaista kaavaa.
2. Kenttämuistiinpano — tämä tiedosto.
3. `Learn/`-HTML — renderöity, ks. `Learn/2026-08-08-kya-s1-v13-idv-gate-ja-blogisarja.html`.
4. Drive-vienti — **N/A — Google Drive -työkalut eivät ole tässä sessiossa käytettävissä;** repo on lähde, vienti tehtävissä milloin tahansa tästä tiedostosta.
5. Päätöskysymys HIC:lle — esitetty chatissa (ks. alla).
6. Päivätyt sitoumukset kalenteriin — **KYA-S1:n julkinen kommenttikausi päättyy 4.11.2026.** Tämä on session ainoa päivätty sitoumus: v1.3:n amendmentit kuuluvat siihen ikkunaan, ja sen jälkeen ne vaativat uuden version. Kalenterointi on HIC-toimenpide (ks. alla) — kalenterityökalu ei ollut käytettävissä.
