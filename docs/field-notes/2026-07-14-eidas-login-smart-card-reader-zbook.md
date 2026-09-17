# eIDAS Login Requires a Physical Card Reader — HP ZBook Smart-Card Slot Check

**Date:** 2026-07-14
**Author:** Claude Code + Risto Anton Päärni
**Type:** Operations / Hardware Note
**Status:** Active

---

# VERSION AND AGENT HISTORY

Version: 1.0
Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code | Session: claude/danske-bank-registration-i1dzpk | Date: 2026-07-14 | Changes: Initial creation — eIDAS card-reader requirement, how to verify the HP ZBook smart-card slot, and reader-free alternatives

Document Status:

- Created: 2026-07-14
- Last Modified: 2026-07-14
- Language: English (Finnish/Swedish terms inline)
- Publication Status: INTERNAL ONLY

---

## Ontology Tags

- **Geography:** Europe > EU27 > Finland / Sweden
- **Sector:** Digital Identity > eIDAS > Strong Electronic Authentication
- **Entities:** DVV (Digi- ja väestötietovirasto), eIDAS, HP ZBook, Danske Bank, Bolagsverket
- **Temporal Context:** Lifetime AB (Sweden) registration + Danske Bank onboarding
- **Confidence:** High — standard eIDAS / Finnish HST card mechanics; ZBook config is unit-specific and must be verified per device

---

## 1. Context

While progressing the **Lifetime AB (Sweden)** registration and Danske Bank onboarding, a login step requires **eIDAS strong electronic authentication**. When the chosen means is a **physical ID card with a chip** (Finnish _varmennekortti_ / _henkilökortti_ citizen certificate from DVV, or a Swedish card e-ID), the card must be read by a **contact smart-card reader** — the chip card is inserted and stays in the reader during the session.

The open question: **does the HP ZBook in use have a built-in smart-card reader, or is the visible slot just an SD-card slot?**

---

## 2. Key Finding — eIDAS Card ≠ SD Slot

A card-based eID login needs a **contact smart-card reader (sirukortinlukija, ISO 7816)**. This is a _different device_ from the SD/microSD media slot found on most laptops.

On **HP ZBook** mobile workstations the smart-card reader is an **optional build-to-order (BTO) component** — it is present on some configurations and absent on others. Seeing "a slot" does **not** confirm a smart-card reader; it may be:

- a **smart-card reader** (what eIDAS needs), or
- an **SD / microSD** media reader, or
- a **SIM** slot (WWAN-equipped units).

**How to distinguish physically:** a smart-card slot is a thin horizontal slot the width of a credit card; the card is inserted **chip-first and protrudes ~halfway**, remaining inserted during use. An SD card is smaller and sits nearly flush.

---

## 3. Verify on Windows (PowerShell-first)

```powershell
# List any smart-card reader the OS sees
Get-PnpDevice -Class SmartCardReader | Select-Object Status, FriendlyName

# Confirm the Smart Card service is running
Get-Service SCardSvr | Select-Object Status, StartType

# End-to-end test with a card inserted (reads the card certificates)
certutil -scinfo
```

- A reader listed with `Status = OK` → the ZBook **has** a smart-card reader.
- Empty result → **no built-in reader**; use an external one (Section 4).
- `certutil -scinfo` showing a certificate → card + reader + middleware all working.

Also checkable via **Device Manager → "Smart card readers"**.

**Middleware note (Finnish HST card):** the DVV citizen certificate needs the **Fujitsu mPollux DigiSign Client** installed for the card certificates to surface to the browser/OS. Without it, even a working reader will not complete the login.

---

## 4. If There Is No Built-In Reader

- **External USB contact smart-card reader**, ISO 7816 (~€10–20). Proven models: HID Omnikey 3021/3121, Identiv uTrust 2700, Cherry, Broadcom/Alcor. Plug in → appears under `SmartCardReader` → proceed.

---

## 5. Reader-Free Alternatives (often faster)

A physical card + reader is only **one** eIDAS means. For most logins the card can be avoided entirely:

- **Finland:** online-banking credentials (_pankkitunnukset_) or **Mobiilivarmenne** — no reader, no card.
- **Sweden (Danske Bank, Bolagsverket, Verksamt.se):** these run on **BankID / Mobilt BankID**, not the Finnish card. For the Swedish-side flows a Finnish person authenticates cross-border via eIDAS using a Finnish means (bank creds / Mobiilivarmenne), or obtains Swedish BankID once the person has a Swedish personnummer.

**Practical takeaway:** confirm whether the specific service actually _requires_ the card, or whether mobile/bank authentication is accepted. If mobile is accepted, the whole card-reader question is moot for that login.

---

## 6. Action Items

1. Run the Section 3 PowerShell check on the ZBook → record whether a reader is present.
2. If absent and card auth is required → order an external USB ISO-7816 reader.
3. For the Finnish HST card → install Fujitsu mPollux DigiSign Client.
4. Before buying anything → check if the target service accepts **Mobiilivarmenne / bank credentials / BankID**, which need no reader.
