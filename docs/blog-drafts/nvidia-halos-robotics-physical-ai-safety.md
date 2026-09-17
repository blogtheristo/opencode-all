# The robot gets certified. The evidence still has to keep talking.

Status: PENDING-HIC-REVIEW
Extracted-From: onelifetime.world/posts/nvidia-halos-robotics-physical-ai-safety.html
Extracted-On: 2026-08-12
Published: 2026-07-10

> This draft was reconstructed from the already-published page, because the
> post went live without one (Rule 13). It is here so the text is reviewable,
> NOT as evidence that it was reviewed. Read it, then either set
> `Status: APPROVED` or change the post.

---

NVIDIA Halos for Robotics is not a new model. It is a full-stack safety system, built on
18,600-plus engineering-years of autonomous-vehicle safety data, that helps a robot pass
certification. Certification is a moment. What we build is what happens after.

10 Jul 2026 · by Risto Anton Päärni

The note, in one line

On 22 Jun 2026, NVIDIA announced Halos for Robotics — IGX Thor compute with a
dedicated Functional Safety Island, a safety-certified OS, an Outside-In camera system
that lets a robot slow down instead of hard-stopping, and the first ANAB-accredited lab
that pre-assesses a robot against IEC 61508 and ISO 13849 before formal certification.
Agility Robotics is already integrating it into Digit for Amazon and Toyota floors. We
cheer it. And we build the layer it does not cover.

Good news from a good partner.

We have written before about
the supercomputer that moved onto the robot. Halos is the next layer up — not more compute, but the safety architecture that
lets a regulator trust what the compute decides.

And because cheering without thinking is not a business, here is the honest part.

## What NVIDIA actually shipped

Halos is a full stack, not a checkbox. IGX Thor carries a dedicated Functional Safety
Island, IEC-61508-SIL-3-class, physically isolated from the rest of the compute. Halos
Core runs on top — a safety-certified OS layer on Linux and QNX OS for Safety 8.0,
deterministic enough to back a real-time safety decision. The Outside-In Safety Blueprint
adds infrastructure-mounted cameras that watch a work cell's blind spots, so a robot
adjusts speed and trajectory instead of slamming into a hard E-stop every time a person
walks near it.

The number worth sitting with is the provenance: Halos is built on
18,600-plus engineering-years of NVIDIA's autonomous-vehicle safety
work, repointed at humanoids and industrial robots. That is not a marketing figure we are
repeating politely — it is the reason the AI Systems Inspection Lab, the first
ANAB-accredited program of its kind, can pre-assess an integration against
IEC 61508 and ISO 13849 before a Notified Body ever sees
it. Agility Robotics is first through the door, integrating Halos into the 5th-generation
Digit humanoid for warehouse and factory floors — Amazon and Toyota among the named
customers.

## Why Halos matters to us

Every EU physical-AI deployment we touch eventually runs into the same two clocks: the
Machinery Regulation (EU) 2023/1230, which moves AI-driven safety components to mandatory
third-party certification from 20 Jan 2027, and the AI Act's
embedded high-risk obligations, which land on the same machines from
2 Aug 2028. Notified Body queues already run six to twelve months. The
honest math is that the runway is already tight.

Halos changes what a deployer can point to when a Notified Body asks "how did you
validate this." Before Halos, that answer was a bespoke, in-house safety-engineering
project. After Halos, it can be an accredited pre-certification report. That is a real
shift — it moves the floor every EU physical-AI seller has to clear.

What a certification does not give you

Certification is a snapshot. It says the robot, as built, met a standard on the day it
was assessed. The Machinery Regulation and the AI Act do not stop asking questions on
that day — Article 9 risk management, Article 12 record-keeping, Article 14 human
oversight are all continuous duties, not one-time boxes.

A Halos-certified robot that runs for two years without a signed, auditable evidence
trail is a robot that passed an exam and then stopped showing its work. That is the gap
we build for.

## Where Halos fits in our stack

One deployment, two jobs. NVIDIA gets the robot certified. We keep the deployment
evidenced.

The certification · NVIDIA Halos

Functional Safety Island, Halos Core, Outside-In cameras, the ANAB-accredited
Inspection Lab. The pre-certification pipeline that gets a robot ready for a Notified
Body. NVIDIA's ground, and a strong one.

The evidence · the governed edge

A
Situation Room
the customer owns, ingesting the same Outside-In telemetry, producing signed
Article-9/12/14 evidence continuously — not once, at the certification date.

We do not compete with the safety island. We would not try — we do not ship robot
silicon. The Outside-In cameras are the one place the two systems physically touch: their
telemetry is an ingestion surface for our
Control Room and Situation Room, the same governed loop we have described before.

## Why we will not over-claim

NVIDIA called Halos a safety system, not a compliance guarantee. We will keep the same
restraint. Passing IEC 61508 and ISO 13849 says the hardware and OS can be trusted to fail
safely. It does not, on its own, produce the immutable Article-12 log a regulator asks for
eighteen months into a deployment.

A pre-certification report is not an audit trail. We will not say our evidence layer makes
a robot safer — Halos does that. We say it keeps the proof of that safety alive,
signed, and local, for as long as the robot is on the floor. That is enough.

The short version

- Halos for Robotics is a full-stack functional-safety system, not a new model —
built on 18,600+ engineering-years of NVIDIA autonomous-vehicle safety data.

- Its ANAB-accredited Inspection Lab pre-assesses against IEC 61508 and ISO 13849 before
third-party (Notified Body) certification. Agility Robotics' Digit is first
through, deploying for Amazon and Toyota.

- This lands right as the EU Machinery Regulation (20 Jan 2027) and AI Act embedded
high-risk rules (2 Aug 2028) tighten — a pre-certification pipeline moves the
expected baseline forward of both deadlines.

- Certification is a snapshot. Article 9/12/14 obligations are continuous. We do not
compete with the safety island — we keep the evidence trail alive after the
certificate is issued.

- Halos gets the robot certified. Our Control Room keeps it evidenced.

## Read next

- NVIDIA Jetson Thor — the supercomputer moves onto the robot, the governance
sits beside it

- The moat is not the model — NVIDIA makes it possible, EU-sovereign deployment
makes it defensible

- The three-piece loop — Lifetime World Model V1 for control rooms

- Europe's AI factory came home — 35 supercomputers, and why the edge still
needs a box

Risto Anton Päärni

Founder, CEO · Lifetime Oy · Editor in Chief, Lifetime Scope Journal
