Status: APPROVED
Slug: greg-isenberg-agents-need-a-signature
Title: Greg Isenberg is right about agents. The hard part is a signature.
Language: en
Target: onelifetime.world/posts/greg-isenberg-agents-need-a-signature.html
Date: 2026-07-24 (HIC 10.08.2026: julkaistaan alkuperäisellä päiväyksellä)

Agent Infrastructure · Field Note

# Greg Isenberg is right about agents. The hard part is a signature.

24 July 2026 · by Risto Anton Päärni

## The thread, in one line

Greg Isenberg posted two lists this month. One names 21 kinds of infrastructure that agents will need and nobody has built yet. The other names 16 things that will feel normal within three years — an itemised bill for what your agents bought, agents you interview before you hire them, and a CV replaced by a body of work a machine can check in four seconds. Source: @gregisenberg on X, July 2026.

Greg is right, and he is early.

We have been building this layer in Europe for a year, under a different name and for a stricter reason. So when his list lands on our roadmap almost line for line, we notice. And because agreeing with a good thread is not a business, here is the honest part.

## Twenty-one startups, or one layer

Greg's list reads like 21 companies. Read it again and eight of them are the same company.

Spend controls. A checkable track record. Proof the agent acts for a real person with authority. Escrow that releases on verified done. Replay. A judge for disputes. Throwaway cards. The liability layer.

Each one needs the same four facts before it can exist: who is this agent, which human stands behind it, what is it allowed to do, and what did it actually do. Build those four once and you have not built one startup. You have built the floor the other twenty stand on.

We call that floor KYA — Know Your Agent. Four sentences run it: verify the human, sandbox the agent, govern how it optimises itself, and log every action so an auditor can read it later.

## Why Europe got here first

Greg frames this layer as a market opening. In Europe it is a legal duty.

The EU AI Act already requires record-keeping for high-risk deployments under Article 12, and human oversight under Article 14. That turns "why did my agent do that" from a debugging feature into evidence a deployer must be able to produce. Regulation set our deadline before any customer did.

## The CV does die. A credential replaces it.

Greg's sharpest line is that the CV gets replaced by a body of work an agent can verify in four seconds.

Four seconds is the giveaway. No human reads anything in four seconds. That number describes a machine resolving an issuer and checking a signature.

So the résumé of an agent is not a document. It is a chain, and each link has to be checkable by someone who does not trust you:

verified human → signed manifest → signed mandate → verified-done attestation

The last link is the one a merchant, an escrow provider, an insurer or an auditor actually wants: proof the agent did what it was authorised to do.

## The honest limit — what we have not shipped

We audited our own chain this month. The signature is not in it yet.

We have shipped the trust score and its engine, the gate that denies by default, and the evidence chain every decision is written to. We wrote the specification for the credential and the schema it travels in.

In production today that credential mints unsigned. Which means it is a claim our database makes, not a proof a stranger can check.

The signing path is written and in review. We reviewed it properly before merging it, and it did not come back clean: the signature covered the credential but not the proof metadata — so the timestamp on an audit record could be changed after signing and the signature would still check out. On an evidence artifact, that is the whole point undone.

The tests had not caught it. Eight of them passed, because they tampered with the part that was signed and never the part that was not. We fixed the signature, added the four tests that were missing, and then reverted the fix to confirm those tests actually fail without it. A test that passes before and after a fix is telling you nothing.

None of that is live yet. Ed25519 on the runtime's own crypto, a DNS-rooted issuer, keys in the customer's jurisdiction and never a shared foreign cloud — written, reviewed, not shipped. We would rather say that than let the word "verifiable" do work it has not earned.

We could have written this post without that paragraph. Most vendors would.

## Why we said it anyway

Because "verifiable" is the easiest word on a slide and the hardest thing in a repository.

A buyer in a regulated industry eventually asks the auditor's question: show me the key, show me where it lives, show me the revocation path. A vendor who oversold at the pitch loses the account at that meeting.

We would rather lose the sentence than the meeting.

## Two places we would push back

On interviewing an agent before you hire it. Greg is right that this becomes normal. Inside your own company it needs no cryptography at all — give the candidate a hard task, score it, keep the score. The signature only matters when the agent comes from outside and the score has to travel.

On a judge for agent disputes. Machine courts will not be neutral startups. They will be the governance layer both sides already run, plus arbitration law that already exists. The winning product is not the court. It is the evidence a real court accepts.

## The short version

- Greg Isenberg is right that this decade gets built for machines. We agree.
- Eight of his twenty-one categories are one layer, not eight companies — identity, authority, track record, and a log. We call it KYA.
- In Europe that layer is not a market opening. The AI Act makes it a duty, which is why we started early.
- The CV does die. What replaces it is a signed credential a stranger can check in seconds.
- Ours mints unsigned in production today. The signing path is written, reviewed, and one real defect lighter than it was — and still not live. That is the next thing we ship.

## Read next

- KYA Standard v1 — the original field note
- MCP Apps extends the frontier — KYA is the identity spine
- Our layers are solid — Aiven, Scaleway, KYA
- Red Hat's EU sovereign move — and the three tiers beneath it

Risto Anton Päärni
Founder, CEO, Lifetime Oy · Editor in Chief, Lifetime Scope Journal

***

## JULKAISUKELPOISUUSARVIO (ei osa postausta — poista ennen julkaisua)

KORJATTU 10.08.2026
  - "We wrote the standard for the credential" -> "the specification"
    (KYA-S1 on spesifikaatio, ei standardi; DWS_TRUTH_STANDARD rivi 35).

VAHVAT KOHDAT — nämä puoltavat julkaisua
  - Rehellisyysosio on poikkeuksellisen hyvä: kerrotaan suoraan että credential
    mintataan tuotannossa ALLEKIRJOITTAMATTOMANA. Tämä on juuri se, mitä
    rehellisyysvartijat vaativat, ja se kestää ostajan auditointikysymyksen.
  - EU AI Act Art. 12 / Art. 14 -väitteet vastaavat kanonia.
  - Ei ylimyyntiä: "written, reviewed, not shipped" on tarkka.
  - Allekirjoitus on Sender Identity -säännön mukainen (Päärni umlauteilla).

LÄHDE VARMENNETTU 10.08.2026 — luvut palautettu

  Ensimmäinen yritys: X.com, nitter, threadreaderapp ja gregisenberg.com ovat
  kaikki estetty egress-gatewayssa (403 CONNECT); Playwright käyttää samaa
  verkkopolkua eikä olisi päässyt läpi. Teksti pehmennettiin.

  Toinen yritys onnistui: lähde on REPOSSA, kahdessa päivätyssä field notessa:

    docs/field-notes/2026-07-06-greg-isenberg-startups-for-agents-21-answers.md
      "Greg Isenberg (@gregisenberg), via X, circulated 06.07.2026 ... followed
       by 21 numbered infrastructure categories"

    docs/field-notes/2026-07-24-greg-isenberg-16-things-normal-in-3-years.md
      "Greg circulated a second list: '16 things that will be normal in 3 years
       and sound insane today.' Where the July 6 thread was 21 startups to
       build, this one is 16 futures to price."
      Kohta #11 siteerattuna: "The CV dies and gets replaced by a body of work
       an agent can verify in 4 seconds."

  Kaikki kolme pehmennettyä väitettä (21 / 16 / four seconds) ovat siis
  dokumentoituja aikalaiskirjauksia. Pehmennys peruttu, tarkat luvut
  palautettu.

  JÄLJELLE JÄÄVÄ VARAUMA: molemmat field notet merkitsevät ketjun TARKAN
  SANAMUODON MEDIUM-luottamustasolle ("thread text supplied by the founder
  from X; treat exact wording as MEDIUM confidence for external quotation").
  Luvut ja kategoriajako ovat se, mihin postaus vastaa — ne ovat kunnossa.
  Jos joku sanamuoto siteerataan lainausmerkeissä, se kannattaa tarkistaa
  alkuperäisestä ennen kuin siitä tehdään suora sitaatti.

  Postauksen päiväys 24.7.2026 osuu yhteen jälkimmäisen field noten kanssa,
  joten "this month" oli kirjoitushetkellä oikein.

PÄIVÄYS: HIC 10.08.2026 — julkaistaan ALKUPERÄISELLÄ päiväyksellä 24.7.2026.

KIELIPERIAATE (HIC 10.08.2026)
  Tässä postauksessa GROUND TRUTH on ENGLANTI. Postaus vastaa
  englanninkieliseen X-ketjuun, ja sen käsitteet (KYA, credential,
  verified-done attestation) ovat englanniksi määriteltyjä.
  Kaikki käännökset johdetaan EN-versiosta, ei toisin päin. Jos EN-teksti
  muuttuu, käännökset päivitetään sen mukaan — ei koskaan päinvastoin.

TEKNINEN TILA
  - Julkaisu = _DRAFT-pääte pois, rekisteröinti (§3 / §3.1), dual folder -synkka.
