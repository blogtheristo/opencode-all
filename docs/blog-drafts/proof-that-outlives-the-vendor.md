---
slug: proof-that-outlives-the-vendor
lang: en
title: "Proof that outlives the vendor"
hero: "When an AI agent works in your control room, the record of who decided what must stay yours, checkable for years, without asking us."
visual:
visual_src:
visual_alt:
seo_tags: [aegis, acceptance_test, stop_authority, evidence_bundle]
demo_agent:
demo_url:
target: onelifetime.world/posts/proof-that-outlives-the-vendor.html
date: 2026-10-01
author: Risto Anton Päärni
version: 1.0
claims_checked: 2026-10-01
tracks:
  - Store/PRODUCT_AEGIS_PILOT.md
  - Store/PRODUCT_AEGIS.md
  - docs/whitepapers/WP13_WHEN_THE_LINK_DROPS.md
  - dws10.com/config/products.json#DWS-AEGIS
tracks_sha256: 3094644f3b008804902661e21d91ea3bb41c1b214791150ab0b31fa373c0ea68
Status: APPROVED
Approved_by: HIC (Risto Anton Päärni), 01.10.2026 — EN text v1.0 incl. heading "The question nobody asks in the control room"
---

Proof that outlives the vendor

An AI agent can now do real work in a production control room. It reads the process, suggests the next move, and waits. A person decides. That part is easy to promise. The hard part comes later.

The question nobody asks in the control room

Picture an inspector, a court or your own board, three years after a production incident. They ask a simple question: who stopped the agent, when, and what did the operator decide? The answer sits in a log. The log sits on a machine your vendor configured. The tool that reads it belongs to the vendor too.

So the honest answer is: "Our vendor says so."

That is not evidence. It is trust, and trust is exactly what an audit is meant to replace.

Three ways a log fails you

A log fails when the network goes down, because the record stops where the connection stopped. A control room has to keep working through a cut, and so does its memory.

A log fails when the person who can write it can also rewrite it. A signature only proves something if the hand that signs is not the same hand that edits.

A log fails when it can only be read with the vendor's software. Vendors change, get acquired and close. A record you cannot read without them is a record you do not own.

What we built instead

DWS IQ 7 Aegis starts from a different promise: the proof is yours, and you can check it without us.

The record stays in your building, on your hardware, and keeps working when the network does not. Every stop and every decision is signed by the operator who made it, with a key the operator holds. A copy of the evidence goes to a place the box itself cannot change. And the format is open and written down, so your own team, your auditor or someone ten years from now can check it with tools of their own.

You do not take our word for any of this. In the paid pilot you run the acceptance test yourself: you cut the connection with your own switch, you stop a running agent with your own key, and you check the record. If it fails, you get the failure in writing. A failed test is still a useful result.

What we are careful not to claim

A signed record proves that nobody changed it after the fact, and who signed what in which role. It does not prove that the world happened the way it was written down. We say that out loud, because a buyer's lawyer will find it anyway, and we would rather be the ones who said it first.

Where the details live

How the record is built, how keys are kept apart, how copies are protected and how long they are held: that is engineering, and we explain it in full to the people who will run and audit it. It is in the whitepaper "When the Link Drops" (WP13), which you can request from us.

Request the whitepaper: dws10.com/whitepapers/wp13-when-the-link-drops/

Risto Anton Päärni
Founder, CEO · Lifetime Oy
