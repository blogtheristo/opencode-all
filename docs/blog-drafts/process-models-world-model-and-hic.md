---
slug: process-models-world-model-and-hic
lang: en
title: "Process Models, the Lifetime World Model and Human-in-Command"
hero: "How industrial process models, the LWM state register and Human-in-Command set the limits on what a DWS IQ agent may do."
visual: infographic
visual_src: docs/blog-drafts/img/process-models-world-model-and-hic.svg
visual_alt: "The ISA-95, BPMN, SysML, VSM and SIPOC process models connect DWS IQ agents to the Lifetime World Model state register, under Human-in-Command"
seo_tags: [lwm, lwm_state_register, hic, isa_95, sysml, vsm, sipoc, skilled_agent]
date: 2026-09-30
author: Risto Anton Päärni
Status: DRAFT
translation_of: process-models-world-model-and-hic.fi.md
ai_translated: true
note: "Visual not yet made — the SVG is a to-do."
---

# Process Models, the Lifetime World Model and Human-in-Command

Put the DWS IQ automation organisation (`dws10.com`) together with the Lifetime World Model (LWM) and industry gets something remarkably powerful: high-performance background agents coupled to a world state that is governed end to end and can be verified. This piece draws three questions into a single argument: which industrial process-description methods an agent needs, how the Lifetime World Model uses them as its global state register and memory, and how Human-in-Command (HIC) decides what DWS IQ agents are allowed to do within them.

## A smart engine needs a world model

An AI agent on its own — a DWS IQ Skilled Agent, say — is merely a "smart engine". To do its work it needs a world model: a single, shared picture of the state of the systems, of who is doing what, with what authority, and with what consequences.

The division of labour is clear:

- **DWS IQ (`dws10.com`)** is the hand that does the work. It brings specialised background agents (Skilled Agent) that join up data, run workflows and carry out industrial back-end processes.
- **The Lifetime World Model** is the cortex that watches and remembers. As the global state register and memory, it maintains a real-time picture of the system; KYA-S1 identification, that is, Verified Human Principal Binding (IDV); Trust Score & Authorization (TRS); and the decision history, that is, Decision Provenance & Audit Trail (PRV).

Yet the engine and the cortex do not speak the same language without an interpreter. This is where process models form the bridge: they translate the needs of the business and of production into a language that people, DWS IQ agents and the Lifetime World Model all understand.

## A background agent needs Human-in-Command

AI agents fall into two broad camps, and their need for oversight and the settings they work in differ at the root. GitHub Copilot Agent is the developer's interactive pair in the IDE: it works at the micro level, proposing code and running tests under the developer's eye, and human oversight arises naturally with every action in the interface. A code change is always reviewed before it is committed.

DWS IQ agents are background agents for industry and data warehouses. They work at the macro level, running multi-step business and production processes that act directly on supply chains, interfaces and databases. That is why they need a governance layer of their own, so that oversight holds even when they run in the background.

To give industry both a high degree of automation and the human oversight that Article 14 of the EU AI Act requires — in the DWS implementation, Human-in-Command (HIC) — DWS IQ agents are governed through a GitHub Copilot-style Single Pane of Glass HIC Dashboard:

- **One launch view:** The human leads the process. They start an agent workflow from one clear view and follow its progress in real time.
- **Skilled Agent roles:** The dashboard routes each stage of the workflow to agents specialised for the purpose — a quality-control, data-analysis or logistics agent, for example — always according to what that stage demands.
- **Seamless KYA binding:** Every agent launched from the dashboard follows the KYA-S1 Security Specification (Know Your Agent): security knows the human behind the agent (IDV) and its trust level (TRS), and holds an immediate leash snap (TC4) for the entire agent chain.

Human-in-Command does not operate in a vacuum, however. It needs a map on which to draw the boundaries. That map is supplied by industry's own long-established process-description methods.

## Process models: where the agent attaches

Beyond the RUP methodology (and UML diagrams), industry relies on several other established ways of describing and modelling processes. Which one fits depends on whether the subject is business automation, the physical flow of production, equipment and system architecture, or quality management. For integrating AI agents, five matter most: ISA-95 at the level of system architecture, BPMN 2.0 at the level of workflows and automation, SysML at the level of cyber-physical systems, VSM at the level of material and information flows, and SIPOC at the level of quality management and scoping. Each sets the agent a different boundary, and each connects to the Lifetime World Model in its own way.

### ISA-95: the level of operation and a vertical backbone of trust

ISA-95 (enterprise–control integration, IEC 62264) is not a conventional flowchart but the industrial standard for system architecture and process interfaces — the so-called automation pyramid. It defines how information moves between enterprise resource planning (ERP), manufacturing execution (MES), supervisory control (SCADA) and field devices (PLC/IoT).

For an agent, ISA-95 defines its level of operation and its authority (Capability Manifest & Registry, REG, and IDV). An agent working at the MES level (Level 3) needs entirely different safety margins and response times from one that touches SCADA control directly (Level 2).

Industry's biggest challenge is that information and authority break off between the layers of governance. That is why the Lifetime World Model is placed horizontally across the entire ISA-95 pyramid. When a DWS IQ agent makes a decision at the MES level, it checks the Lifetime World Model in real time for the level of operation and the human authorisation (IDV/TRS), which originates at the ERP/HR level (Level 4). The agent does not act "blind" inside its own silo.

### BPMN 2.0: an executable workflow that branches on trust

BPMN 2.0 is the shared de facto standard of industry and software for modelling business processes and workflows. BPMN diagrams are not mere drawings; they run directly as code in process engines (Camunda, Flowable or Zeebe, for example). That makes BPMN the ideal language for DWS IQ agents: a workflow can define a step — a BPMN Service Task (automatic lane) — that the agent carries out in the background. And because the diagram is executable, it is also easy to connect to the unified dashboard.

BPMN diagrams set out the routes an agent can take, and the live Trust Score (TRS) from the Lifetime World Model is wired into their conditional branches:

- **TRS ≥ 85** → the DWS IQ agent performs the task automatically (BPMN Service Task).
- **TRS < 85** → BPMN routes the task to a human for approval (BPMN User Task, human sign-off).

An exception, too, sends the task to a human: if the agent runs into an anomaly, the BPMN process automatically passes it on for human sign-off. That sign-off grants a temporary authorisation, which is written straight back to the Lifetime World Model. Human-in-Command is thus not a separate inspection outside the process, but a branch inside it.

### SysML: cyber-physical safety limits and state machines

SysML (systems modelling language) is an extension of UML for modelling complex cyber-physical systems — hardware, software, process and people. It is especially popular in the heaviest industries: aerospace, automotive, energy and demanding mechanical engineering.

In heavy industry, an agent must never drive a physical machine past its hardware thresholds. SysML state machines (_State Machine Diagrams_) define the physical safety limits that a DWS IQ agent may not cross. If the agent detects an anomaly in production, it consults the state of the world model. Should the world model report a system fault, the SysML model drives the process into a controlled fail-safe state (_Safe State_) and immediately triggers the KYA-S1 leash snap (TC4).

### VSM: cutting waste without audit risk

Value Stream Mapping (VSM) is lean manufacturing's most important tool for visualising the flow of materials and information from supplier to customer. It exposes the waste, bottlenecks, inventory values and lead times in a production process.

For an agent, VSM pinpoints exactly where information stalls or where people do routine manual work — confirming orders or keying in quality data, for instance — the points where a process stands idle waiting for a human to sign off or to move data by hand. It serves as the investment case for where in the process an AI agent is worth installing.

When manual steps are replaced by Skilled Agents, the world model makes sure that speed does not cost traceability. Because every action a DWS IQ agent takes is recorded in the Lifetime World Model (PRV), lead times can be cut drastically without losing the unbroken traceability that quality management and regulators demand.

### SIPOC: the boundary between input and output

SIPOC (Suppliers, Inputs, Process, Outputs, Customers) is the high-level process map used by Six Sigma quality specialists: a simple table that fits on a single page and pins down exactly where a process begins and ends.

SIPOC defines the critical inputs (_Inputs_) and outputs (_Outputs_). When an AI agent becomes part of a process, SIPOC ensures that the data fed to the agent and the result it produces meet the audit requirements of the KYA specification (PRV and Bounded Fault Attribution, FLT). It secures the quality of the agent's input and output data, and their boundaries, before implementation.

## The lifecycle: RUP phases under Human-in-Command

The individual process models constrain what an agent does. The whole still needs a lifecycle. Industry makes agent collaboration predictable and accepted by combining business use cases (Use Cases), the Workflow V2 that carries them out, and the Active Ontology — business objects, the relationships between them, the rules and the permitted actions. The Rational Unified Process (RUP) and UML activity diagrams describe this whole as a governed lifecycle, and UML adds structure and sequence diagrams for communication between agents.

- **Inception:** A human records the business use case, its goal and its scope in the dashboard. Command begins with a person.
- **Elaboration:** Workflow V2 turns the use case into steps and selects the Skilled Agent roles they require; the process diagram is shown to a human before launch.
- **Construction:** The agents carry out the work within the bounds of the Active Ontology — only permitted actions, on permitted business objects. At critical checkpoints (_Gateways_), the system asks for human sign-off before moving on to the next step.
- **Transition:** A human approves the result, and a decision trail conforming to the KYA-S1 Security Specification is saved automatically for later review.

## The result: industrial automation that can be governed and scaled

Bringing the Lifetime World Model into the `dws10.com` environment through these process models has two consequences.

First, a human leads the whole from a single view. The unified dashboard shows the BPMN workflows, the DWS IQ agents currently running and their KYA trust levels, side by side.

Second, the resolution of disputes changes fundamentally. If a production stoppage or an error occurs, KYA-S1's Bounded Fault Attribution (FLT) and the world model's history establish within 72 hours whether the cause was a device connection fault, a deviation in the model or faulty input from a human.

The process models set the boundaries, the Lifetime World Model remembers what happened inside them, and a human decides where they run. By bringing GitHub Copilot's familiar and safe control model to DWS IQ background agents, and by describing workflows in the RUP process diagrams that industry has long favoured, the duty to govern AI stops being legal text and becomes a clear, practical and scalable competitive advantage.
