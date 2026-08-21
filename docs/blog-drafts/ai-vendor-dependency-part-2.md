---
slug: ai-vendor-dependency-part-2
title: "How to Govern AI Workflows Once They Reach the Factory"
series: "Sovereign AI"
part: 2
parts_total: 3
lang: en
site: onelifetime.world
author: Risto Anton Päärni
date: 2026-08-19
Status: DRAFT
approved_by: 
source: 
note: >-
  Second in a 3-part series on sovereign AI for regulated industrial workflows.
  This post builds on the first part and incorporates feedback from Boardy audit.
---

# How to Govern AI Workflows Once They Reach the Factory

In part one, I described the problem of AI vendor dependency in regulated industrial workflows and introduced our local-first approach to managing it.

The architecture is only useful if the organisation can govern what happens inside it.

A regulated industrial AI workflow needs clear answers to five questions:

Who is allowed to use it?
What is the system allowed to do?
What data may it access?
How are its outputs verified?
Who is responsible when something goes wrong?

## Identity comes first

Every relevant user, administrator, service and agent should have a defined identity. Access should be granted according to role and limited to the permissions required for the task.

Depending on the deployment, identity management may use the customer's existing identity provider or an approved local identity service. The design should cover authentication, role assignment, service accounts, credential rotation, access logging and revocation.

An AI agent should not be treated as an anonymous software process. Its identity, authority and permitted actions need to be visible in the workflow.

## Policy before execution

A governed agent should not receive unrestricted access to industrial systems simply because an integration is technically possible.

The workflow should define which tools the agent may call, which data sources it may read, which actions require approval and which actions are prohibited. These rules should be evaluated before execution, not reconstructed afterwards from a log.

## Human approval remains part of the system

Human oversight is not a decorative step at the end of an AI workflow. It should be connected to the points where judgement, accountability or operational impact matter.

The required approval may differ for a draft report, a procurement recommendation, a production change or an action affecting a critical system. The workflow should make that difference explicit.

## Verification and evidence

Generated results need a defined verification method. Depending on the use case, this may include source checks, deterministic calculations, schema validation, domain review, comparison against reference data or a second control step.

A log showing that a model produced an answer is not the same as evidence that the answer was correct. Good governance keeps those claims separate.

The organisation should be able to reconstruct what happened: which identity initiated the task, which data was used, which model and tools were involved, what decision rules applied, whether a human approved the result and what was delivered to the next system.

## Updates without losing control

Local models, cloud services, software packages and policies all change. A production workflow therefore needs a controlled update process.

Updates should be tested in the appropriate environment, approved before release and capable of being rolled back when required. Model changes should not silently alter the permissions, data flows or acceptance criteria of the workflow.

The same applies to disconnected environments. If an air-gapped system cannot use an internet connection, the organisation needs an approved process for importing model weights, patches, configuration changes and security updates.

## Operational responsibility

Technology does not remove responsibility from the customer or provider. Before production use, the parties need to agree who owns the data, who maintains the infrastructure, who approves changes, who monitors failures, who can stop the workflow and how incidents are handled.

This is where deployment documentation becomes practical. The architecture, identity model, data flows, model boundaries, verification steps, support scope and acceptance criteria should be written down before the system is treated as operational.

At Lifetime Oy, we are building DWS IQ around this discipline. Local-first execution, controlled escalation, defined identities, bounded permissions and traceable evidence are parts of one operating model. They are not separate security slogans.

The aim is modest and useful: give the customer a workflow that can be understood, tested, operated and challenged.

No architecture removes every risk. A good architecture makes the important risks visible, limits unnecessary exposure and gives the people responsible for the operation a practical way to act.

That is the standard we are working toward for regulated European industry.