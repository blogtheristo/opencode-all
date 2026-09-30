---
slug: a-yubikey-proves-a-person-a-tpm-proves-a-machine
lang: en
title: "A YubiKey proves a person. A TPM proves a machine."
hero: "Two hardware checks answer two different questions in an audit. What each proves, what we do not sell, and what our pilot records."
visual:
visual_src:
visual_alt:
seo_tags: [aegis, hic, kya_tc4, kya_idv, article_14]
demo_agent:
demo_url:
target: onelifetime.world/posts/a-yubikey-proves-a-person-a-tpm-proves-a-machine.html
date: 2026-09-30
author: Risto Anton Päärni
Status: DRAFT
---

While planning the first witnessed test of the Aegis Pilot, we asked ourselves a question a buyer's auditor will ask: when the agent stops, what proves a real person stopped it, and what proves it happened on the machine we say it did?

Those are two questions, and two different pieces of hardware answer them.

**A security key proves a person.** A YubiKey is a small device you plug into your laptop and touch. It holds a secret that never leaves it. When the operator stops an agent, the key signs the command, and the signature exists only if that person's key was physically there. Copying a file does not copy it. It is the answer to "who held the authority at that moment", which is what a record of human oversight has to show where Article 14 of the EU AI Act applies, that is, for high-risk systems.

**A TPM proves a machine.** A TPM is a small chip on the computer's motherboard. It records what the machine started up with, and it can sign a statement about that. If someone replaced the software underneath the agent, or moved the evidence to a different box, the chip's statement stops matching. It is the answer to "was this the machine, running this software".

The two do not replace each other. A key on an honest person's laptop says nothing about the server. A perfect server says nothing about who pressed stop.

Here is where we are, plainly. In the Aegis Pilot today, the operator signs a stop with a software key kept on their own machine. That signature is present in the record, and it is checked without a network. It is also weaker than a hardware key, and we say so. Separately, the pilot's acceptance record has a hardware-attestation section with one entry for the TPM check and one for the hardware key. In the pilot both entries read "not used". These are two different lines: the stop is signed, and the hardware behind the signature is not attested. We would rather the record say that than let you assume more than you bought.

Two things we do not do. We do not sell hardware. You buy the server and the keys from the vendors you already use, and it is your inventory. And we do not describe hardware proof as something the software alone can supply. A TPM needs a controlled boot chain on your site, which is a property of your site, not of our code.

What we are working on next is the key. Signing the stop with a hardware key is a smaller step than attesting a machine, and it is the one an auditor sees first: the person, physically present, at the moment of the stop. Whether it lands before our first witnessed test is not yet decided, and we will not claim it until a stop has been signed that way and the record shows it.

If you run agents where someone will later ask who stopped them and on what, ask your vendor which of the two they can show you. Then ask to see the record. Most vendors can show you a log. A log is not the same thing as a signed chain that a stranger can verify with no network and no call to the vendor. The second is what the Aegis Pilot's evidence bundle is built to hand to your auditor, and it is the reason the record says what it says.

Risto Anton Päärni
Founder, CEO · Lifetime Oy · the Agent Outcome Company
