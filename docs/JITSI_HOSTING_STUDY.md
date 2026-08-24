# Jitsi Meet Hosting Study — Free & Low-Cost Options for DWS6

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/explore-jitsi-hosting-lEAlm | Date: 13.02.2026 | Changes: Initial creation — Jitsi architecture study, hosting cost analysis, integration options for DWS6

Session Links & References:
  - Claude Code (claude/explore-jitsi-hosting-lEAlm): https://github.com/blogtheristo/dws6/commits/claude/explore-jitsi-hosting-lEAlm
  - View on GitHub: https://github.com/blogtheristo/dws6/blob/claude/explore-jitsi-hosting-lEAlm/docs/JITSI_HOSTING_STUDY.md

Document Status:
  - Created: 13.02.2026
  - Last Modified: 13.02.2026
  - Language: English
  - Languages Available: English
  - Publication Status: DRAFT

***

**Version:** 1.0
**Effective Date:** 2026-02-13
**Status:** Draft

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [What is Jitsi?](#2-what-is-jitsi)
3. [Architecture & Components](#3-architecture--components)
4. [Hosting Options Compared](#4-hosting-options-compared)
5. [Free Hosting Paths](#5-free-hosting-paths)
6. [Low-Cost Self-Hosting](#6-low-cost-self-hosting)
7. [Cloud Platform Analysis](#7-cloud-platform-analysis)
8. [JaaS — Jitsi as a Service](#8-jaas--jitsi-as-a-service)
9. [User Benefits from JaaS](#9-user-benefits-from-jaas)
10. [Sensor & IoT Benefits](#10-sensor--iot-benefits)
11. [Integration with DWS6](#11-integration-with-dws6)
12. [Security & Compliance](#12-security--compliance)
13. [Recommendation](#13-recommendation)
14. [Tweet-Sized Proposal](#14-tweet-sized-proposal)
15. [References](#15-references)

---

## 1. Executive Summary

Jitsi Meet is a fully open-source, end-to-end encrypted video conferencing platform. It can be used for free at meet.jit.si, self-hosted on a VPS for as little as ~€3.50/month, or even hosted at $0/month on Oracle Cloud's free tier. For DWS6's enterprise needs, self-hosting on a EU-based VPS (Hetzner Germany/Finland) provides GDPR compliance, full data sovereignty, and branding control at minimal cost.

---

## 2. What is Jitsi?

Jitsi is a collection of open-source projects that provide state-of-the-art video conferencing capabilities:

- **100% open source** — Apache 2.0 license
- **WebRTC-based** — no plugins or downloads needed
- **End-to-end encrypted** — SRTP/DTLS + optional E2EE
- **No account required** — click a link to join
- **Cross-platform** — Web, Android, iOS, Electron desktop
- **Battle-tested** — powers 8x8's commercial JaaS platform

**Try it now:** https://meet.jit.si

---

## 3. Architecture & Components

Jitsi Meet consists of six core components:

```
┌──────────────────────────────────────────────────────┐
│                   Jitsi Meet Web UI                   │
│              (React / WebRTC client)                  │
└────────────────────┬─────────────────────────────────┘
                     │
┌────────────────────▼─────────────────────────────────┐
│                   Prosody (XMPP)                      │
│      Signaling, room management, authentication       │
└───────┬────────────────────────────────┬─────────────┘
        │                                │
┌───────▼───────────┐    ┌──────────────▼──────────────┐
│      Jicofo       │    │    Jitsi Videobridge (JVB)   │
│  Conference Focus │    │   Selective Forwarding Unit   │
│  (session mgmt &  │    │   (routes audio/video, does   │
│   load balancer)  │    │    NOT mix — scales well)     │
└───────────────────┘    └─────────────────────────────┘
        │
┌───────▼───────────┐    ┌─────────────────────────────┐
│      Jibri        │    │         Jigasi              │
│  Recording &      │    │    SIP/PSTN Gateway          │
│  Livestreaming    │    │  (dial-in phone numbers)     │
└───────────────────┘    └─────────────────────────────┘
```

### Component Details

| Component | Role | Technology |
|-----------|------|------------|
| **Jitsi Meet** | Web frontend & mobile apps | React, WebRTC |
| **Prosody** | XMPP server for signaling & room management | Lua |
| **Jicofo** | Conference focus — manages sessions, load-balances JVBs | Java |
| **JVB (Videobridge)** | SFU — routes media streams without mixing | Java |
| **Jibri** | Recording & livestreaming via headless Chrome + FFmpeg | Java |
| **Jigasi** | SIP gateway for telephone dial-in | Java |

### Key Architecture Points

- **SFU model** — JVB forwards streams selectively (not MCU mixing), which scales better
- **Horizontal scaling** — add more JVB instances; Jicofo load-balances across them
- **Sharding** — for very large deployments, run separate Prosody+Jicofo+JVB shards behind HAProxy
- **TURN/STUN** — needed for users behind restrictive NATs/firewalls

---

## 4. Hosting Options Compared

| Option | Monthly Cost | Capacity | GDPR/EU | Effort | Best For |
|--------|-------------|----------|---------|--------|----------|
| **meet.jit.si** (free) | $0 | Unlimited | No (US servers) | Zero | Quick calls, testing |
| **JaaS Free** (8x8) | $0 | 25 MAU | Partial | Low | Embedded dev/testing |
| **Oracle Cloud Free Tier** | $0 | ~30 users | No (US/EU avail.) | Medium | Zero-budget self-host |
| **Hetzner On-Demand** | ~€0.60/mo + hourly | ~50 users | Yes (DE/FI) | Medium | Occasional meetings |
| **Hetzner Always-On** | €3.49–7.49/mo | 50–75 users | Yes (DE/FI) | Medium | Regular use |
| **Hostinger VPS** | $5.99/mo | ~50 users | Varies | Low | 1-click template |
| **JaaS Basic** (8x8) | $99/mo | 300 MAU | Yes | Low | Managed, branded |
| **HOSTKEY (FI/DE)** | Varies | Custom | Yes (FI/DE) | Low | EU-hosted managed |

---

## 5. Free Hosting Paths

### 5.1 meet.jit.si (Zero Setup)

- Completely free, no account needed
- Unlimited meetings, participants, duration
- HD video, screen sharing, chat, recording (Dropbox)
- **Limitation:** No branding, no data sovereignty, US-hosted
- **Use case:** Quick team calls, demos, testing

### 5.2 Oracle Cloud Always Free Tier ($0/month)

Oracle offers the most generous free cloud tier available:

- **ARM instance:** Up to 4 OCPU + 24 GB RAM (more than enough for Jitsi)
- **Storage:** 200 GB block storage
- **Bandwidth:** 10 TB/month outbound
- **Locations:** EU regions available (Frankfurt, Amsterdam)

**Setup:**
```bash
# On Oracle Cloud ARM instance (Ubuntu 22.04+)
sudo apt update && sudo apt install -y docker.io docker-compose
git clone https://github.com/jitsi/docker-jitsi-meet.git
cd docker-jitsi-meet
cp env.example .env
# Edit .env — set strong passwords, domain, Let's Encrypt email
./gen-passwords.sh
docker-compose up -d
```

**Risks:**
- Oracle may reclaim idle free-tier instances without warning
- Mitigation: upgrade to Pay-As-You-Go (still free if under limits) and set $1 budget alert
- Not ideal for production-critical workloads

### 5.3 JaaS Developer Free Tier ($0, 25 MAU)

- 25 Monthly Active Users free
- Unlimited minutes
- Embedded via IFrame API — branded meetings inside your app
- Webhooks, analytics included
- **Limitation:** 25 user cap; recording costs $0.01/min extra

---

## 6. Low-Cost Self-Hosting

### 6.1 Minimum Server Requirements

| Resource | Small (5–10 users) | Medium (25–50 users) | Large (50–75 users) |
|----------|--------------------|-----------------------|---------------------|
| CPU | 2 vCPU | 4 vCPU | 8 vCPU |
| RAM | 4 GB | 8 GB | 16 GB |
| Storage | 25 GB SSD | 50 GB SSD | 100 GB SSD |
| Bandwidth | 100 Mbps | 500 Mbps | 1 Gbps |

### 6.2 Hetzner Cloud (EU-Based, Recommended for DWS6)

Hetzner has data centers in **Falkenstein (DE)**, **Nuremberg (DE)**, and **Helsinki (FI)** — ideal for EU data residency.

| Plan | Specs | Price | Jitsi Capacity |
|------|-------|-------|----------------|
| CX22 | 2 vCPU, 4 GB, 40 GB | €3.49/mo | ~20 users |
| CX32 | 4 vCPU, 8 GB, 80 GB | €6.49/mo | ~50 users |
| CX42 | 8 vCPU, 16 GB, 160 GB | €14.49/mo | ~75 users |

**On-Demand trick:** Keep only a reserved IPv4 (€0.60/mo). Spin up a server via API when a meeting is needed, destroy it afterward. Total cost: under €1/month for occasional use.

**Deployment with Docker:**
```bash
# 1. Create Hetzner CX32 (Falkenstein or Helsinki)
# 2. SSH in and install Docker
sudo apt update && sudo apt install -y docker.io docker-compose

# 3. Deploy Jitsi
git clone https://github.com/jitsi/docker-jitsi-meet.git
cd docker-jitsi-meet
cp env.example .env
./gen-passwords.sh

# 4. Configure .env
# Set: HTTP_PORT, HTTPS_PORT, PUBLIC_URL, ENABLE_LETSENCRYPT, LETSENCRYPT_DOMAIN, LETSENCRYPT_EMAIL

# 5. Launch
docker-compose up -d

# 6. Access at https://your-domain.com
```

### 6.3 Hetzner Pre-Built App Image

Hetzner offers Jitsi Meet as a **pre-configured App image** — select it when creating a server and it comes ready to go. Minimal setup required.

### 6.4 Docker Compose with Cloudflare Tunnel

For environments without a public IP or where port-forwarding is restricted:

1. Deploy Jitsi with Docker Compose on any machine
2. Use Cloudflare Tunnel to expose HTTPS
3. Free Cloudflare plan is sufficient
4. No need for Let's Encrypt — Cloudflare handles TLS

---

## 7. Cloud Platform Analysis

### 7.1 Scaleway (France/Netherlands — EU Native)

Scaleway is a **European-born cloud provider** with data centers in Paris (FR) and Amsterdam (NL). They provide official Jitsi deployment documentation and scaled Jitsi to 100+ instances during COVID-19.

**Deployment options:**
- Docker Compose on Scaleway Instances (DEV1-M: €7.99/mo — 3 vCPU, 4 GB)
- Native install on Ubuntu 22.04 or Debian
- Terraform-managed auto-scaling architecture

**Pricing (relevant tiers):**

| Instance | Specs | Price | Jitsi Fit |
|----------|-------|-------|-----------|
| DEV1-S | 2 vCPU, 2 GB | €4.39/mo | Testing only |
| DEV1-M | 3 vCPU, 4 GB | €7.99/mo | Small team (~20 users) |
| DEV1-L | 4 vCPU, 8 GB | €15.59/mo | Medium (~50 users) |
| GP1-S | 8 vCPU, 32 GB | €44.51/mo | Large deployments |

**Pros:** EU data sovereignty, GDPR-native, official Jitsi tutorials, Terraform provider
**Cons:** Slightly more expensive than Hetzner for equivalent specs

**Reference:** [Scaleway Jitsi Docker Tutorial](https://www.scaleway.com/en/docs/tutorials/jitsi-docker/)

### 7.2 Google Cloud Run — NOT Feasible for Jitsi

**Cloud Run cannot host Jitsi Meet.** Key blockers:

1. **No UDP support** — Cloud Run only supports HTTP/1.x and HTTP/2 over TLS. JVB requires UDP port 10000 for WebRTC media transport
2. **Stateless/ephemeral** — Jitsi requires persistent XMPP connections and long-lived video sessions
3. **No multi-service networking** — Jitsi needs Prosody, Jicofo, JVB running as interconnected services
4. **Cold starts** — Unacceptable for real-time video conferencing
5. **Timeout limits** — Video calls can last hours; Cloud Run has request timeouts

**GCP alternatives that DO work:**
- **Compute Engine VM** (e2-medium: ~$22/mo) — standard Jitsi deployment
- **GKE (Kubernetes)** — auto-scaling Jitsi shards with Helm charts
- **GCP Marketplace** — pre-configured Jitsi images available

### 7.3 AWS Lambda — NOT Feasible for Full Jitsi

Like Cloud Run, **AWS Lambda cannot host Jitsi's media stack.** Same core limitations: no UDP, no long-lived connections, no persistent state.

**However, Lambda CAN handle supporting roles:**

| Component | Lambda Feasible? | Notes |
|-----------|-----------------|-------|
| JVB (Videobridge) | No | Requires UDP, long-lived streams |
| Prosody (XMPP) | No | Persistent connections |
| Jicofo | No | Stateful session management |
| Jibri (Recording) | No | Headless Chrome, FFmpeg |
| **WebRTC Signaling** | **Yes** | Via API Gateway WebSocket + Lambda |
| **Meeting Scheduler API** | **Yes** | REST API for room management |
| **JWT Token Generator** | **Yes** | Auth token minting for meetings |
| **Webhook Processor** | **Yes** | Process JaaS/Jitsi event webhooks |

**Serverless signaling pattern (Lambda + API Gateway WebSocket):**
```
Browser → API Gateway (WebSocket) → Lambda → DynamoDB/Upstash Redis
                                                    ↓
                                              Jitsi JVB (EC2)
```

**AWS Jitsi deployment:** Use EC2 with Auto Scaling Groups + Terraform. Reference: [terraform-aws-jitsi](https://github.com/hajowieland/terraform-aws-jitsi)

### 7.4 Upstash — Serverless Supporting Infrastructure

Upstash provides **serverless Redis and Kafka** — useful as supporting infrastructure for Jitsi, not as a host for Jitsi itself.

**Relevant use cases for DWS6 + Jitsi:**

| Use Case | Upstash Product | How It Helps |
|----------|----------------|--------------|
| Meeting room state | Redis | Track active rooms, participant counts |
| Rate limiting | Redis | Limit meeting creation per user |
| Meeting scheduling queue | Kafka/QStash | Async meeting notifications |
| Session tokens | Redis | Cache JWT tokens with TTL |
| Webhook processing | QStash | Reliable webhook delivery from Jitsi events |
| Presence tracking | Redis | Real-time "who's online" for DWS6 dashboard |

**Pricing:** Free tier includes 10,000 commands/day. Pay-as-you-go starts at $0.2/100K commands.

**Integration pattern:**
```
DWS6 Backend (Express) → Upstash Redis (room state, rate limiting)
                        → Upstash QStash (meeting reminders, webhooks)
                        → Jitsi Server (Hetzner) via IFrame API
```

### 7.5 Cloud Platform Summary

| Platform | Can Host Jitsi? | Best Role | EU Data | Cost |
|----------|----------------|-----------|---------|------|
| **Hetzner** | Yes (recommended) | Full Jitsi stack | Yes (DE/FI) | €3.49–14.49/mo |
| **Scaleway** | Yes | Full Jitsi stack | Yes (FR/NL) | €7.99–15.59/mo |
| **Oracle Cloud** | Yes (free tier) | Full Jitsi stack | Yes (EU regions) | $0 |
| **Google Cloud Run** | **No** | — | — | — |
| **AWS Lambda** | **No** (partial) | Signaling, APIs, webhooks | Yes (EU regions) | Pay-per-use |
| **Upstash** | **No** | State, queues, caching | Yes (EU regions) | Free–$0.2/100K |
| **GCP Compute Engine** | Yes | Full Jitsi stack | Yes (EU regions) | ~$22/mo |
| **AWS EC2** | Yes | Full Jitsi stack | Yes (EU regions) | ~$15–30/mo |

---

## 8. JaaS — Jitsi as a Service

8x8's managed Jitsi platform for teams that want zero infrastructure management.

### Pricing Tiers

| Plan | Price | MAU | Features |
|------|-------|-----|----------|
| **Developer** | Free | 25 | IFrame API, webhooks, analytics |
| **Basic** | $99/mo | 300 | + Branding, custom domain |
| **Growth** | $499/mo | 1,500 | + Priority support |
| **Enterprise** | Custom | Custom | + Private hosting, SLA, dedicated |

### Add-On Costs

| Feature | Cost |
|---------|------|
| Recording | $0.01/min |
| Transcription | Per-minute pricing |
| PSTN dial-in | Per-minute pricing |
| SIP integration | Per-minute pricing |

### When to Choose JaaS Over Self-Hosting

- Need branded video embedded in your app with zero ops overhead
- Under 300 MAU (Basic plan is cost-effective)
- Need 99.99% uptime SLA
- Don't want to manage TURN servers, TLS certs, or JVB scaling

---

## 9. User Benefits from JaaS

### 9.1 End-User Benefits

| Benefit | Description |
|---------|-------------|
| **Zero friction** | No downloads, no plugins, no account needed — click a link and join |
| **Works everywhere** | Browser (Chrome, Firefox, Safari, Edge), Android, iOS, desktop |
| **HD video & audio** | Adaptive quality based on bandwidth — works on slow connections too |
| **End-to-end encryption** | Optional E2EE for sensitive meetings — only participants can decrypt |
| **Screen sharing** | Share full screen, application window, or browser tab |
| **Live chat** | In-meeting text chat with file sharing |
| **Meeting recording** | Record to cloud (JaaS) or local (self-hosted with Jibri) |
| **Livestreaming** | Stream directly to YouTube Live for webinars and public events |
| **Virtual backgrounds** | AI-powered background blur and replacement |
| **Breakout rooms** | Split large meetings into smaller discussion groups |
| **Polls & reactions** | Engage participants with live polls and emoji reactions |
| **Lobby/waiting room** | Moderator approves participants before they join |
| **Calendar integration** | Google Calendar and Outlook integration for scheduling |

### 9.2 Business/Enterprise Benefits (DWS6 Context)

| Benefit | Impact for DWS6 |
|---------|-----------------|
| **No per-user licensing** | Unlike Zoom/Teams — self-hosted Jitsi has zero marginal cost per user |
| **Custom branding** | DWS6/Firehorse branding on every meeting — removes Jitsi watermarks |
| **Embedded meetings** | IFrame API integrates directly into Firehorse dashboard — no app switching |
| **JWT authentication** | Tie meeting access to DWS6 user accounts — single sign-on |
| **GDPR compliance** | Self-host in Finland/Germany — full EU data sovereignty |
| **API control** | Create/manage rooms programmatically from DWS6 backend |
| **Webhook events** | Get notified of meeting start, end, participant join/leave — feed into analytics |
| **Analytics** | Meeting duration, participant counts, quality metrics for Firehorse Reports |
| **Multi-language** | Jitsi UI supports location in 30+ languages including Finnish and Swedish |
| **No vendor lock-in** | Open source — switch hosts, fork, or modify freely |
| **Cost predictability** | Fixed monthly server cost vs. per-seat SaaS pricing that scales with headcount |
| **Compliance auditable** | Open-source code is auditable — required for EU AI Act Article 12 logging |

### 9.3 Developer Benefits

| Benefit | Details |
|---------|---------|
| **IFrame API** | Embed with `<script src="external_api.js">` — 5 lines of code |
| **React SDK** | `@jitsi/react-sdk` for native React component integration |
| **Mobile SDKs** | Android (Maven), iOS (CocoaPods), React Native, Flutter |
| **lib-jitsi-meet** | Low-level API for building custom UIs on top of Jitsi's media stack |
| **Webhooks** | Real-time events for meeting lifecycle (JaaS) |
| **REST API** | Room management, participant control, statistics |
| **Docker Compose** | One-command deployment: `docker-compose up -d` |
| **Terraform modules** | Infrastructure-as-code for AWS, GCP, Hetzner |
| **Open source** | Apache 2.0 license — modify, fork, contribute |

---

## 10. Sensor & IoT Benefits

### 10.1 Jitsi + IoT: Remote Monitoring via Video

For DWS6's **Lifetime Fleet** (IoT/Robots) and **NVIDIA Jetson Orin Nano** edge AI, Jitsi enables real-time video communication with field devices:

| Capability | How It Works | DWS6 Application |
|------------|-------------|-------------------|
| **Remote camera feeds** | Stream from IoT cameras via WebRTC to Jitsi room | Monitor industrial sites from Firehorse dashboard |
| **Edge AI visual inspection** | Jetson Orin processes video locally, streams results via Jitsi | Real-time quality control / emissions monitoring |
| **Technician AR support** | Field worker joins Jitsi from mobile, expert guides remotely | Reduce on-site visits for Lifetime Fleet maintenance |
| **Sensor dashboard overlay** | Overlay real-time sensor data on video feed in meeting | Show temperature, emissions, energy data alongside live view |
| **Multi-site monitoring** | Multiple camera feeds in one Jitsi meeting (breakout rooms per site) | Monitor 16 EU industry sites simultaneously |
| **Incident response** | Auto-create Jitsi room when sensor threshold breached | Immediate video conference with response team |

### 10.2 Architecture: Sensor-Triggered Video Calls

```
┌──────────────────────┐     Threshold Alert
│  IoT Sensor / Camera │ ──────────────────────┐
│  (Jetson Orin Nano)  │                        │
└──────────┬───────────┘                        ▼
           │ RTSP/WebRTC              ┌─────────────────┐
           │                          │  DWS6 Backend    │
           ▼                          │  (Express + MCP) │
┌──────────────────────┐              └────────┬────────┘
│  Jitsi Videobridge   │                       │
│  (Hetzner Helsinki)  │ ◄─── Create Room ─────┘
└──────────┬───────────┘       + Notify Team
           │                        │
           ▼                        ▼
┌──────────────────────┐  ┌────────────────────┐
│  Firehorse Dashboard │  │  Mobile App Push   │
│  (IFrame embed)      │  │  Notification      │
└──────────────────────┘  └────────────────────┘
```

### 10.3 Specific Sensor Integration Scenarios

**1. Emissions Monitoring (Fit for 55 / ETS)**
- CEMS sensors detect threshold breach → auto-create Jitsi room
- Environmental team joins with live camera feed of emission point
- AI overlay shows real-time ppm readings on video
- Meeting recorded for compliance documentation (EU AI Act Article 12)

**2. Energy Efficiency Audits (CSRD Reporting)**
- Thermal cameras stream to Jitsi room during building audit
- Remote expert annotates thermal images in real-time
- Screen-share energy dashboard alongside live thermal feed
- Export recording as audit evidence for CSRD reports

**3. Fleet Maintenance (Lifetime Fleet)**
- Robot/device camera streams to Jitsi via WebRTC
- Maintenance technician gets AR-style guidance from remote expert
- Jitsi chat used for sharing diagnostic data, manuals, parts lists
- Reduces travel costs and response time for field maintenance

**4. Quality Control (CBAM)**
- Production line cameras stream to Jitsi for remote quality inspection
- Multi-site view: 4+ camera feeds in single meeting (gallery view)
- AI-detected defects trigger instant video conference with QC team
- Timestamped recordings serve as supply chain carbon documentation

### 10.4 Technical Requirements for Sensor Integration

| Component | Requirement | Solution |
|-----------|-------------|----------|
| Camera → WebRTC | Convert RTSP to WebRTC | GStreamer pipeline on Jetson |
| Low latency | <500ms end-to-end | JVB in same region as sensors |
| Auto-room creation | API-triggered meetings | Jitsi IFrame API + DWS6 backend |
| Data overlay | Sensor data on video | Custom Jitsi plugin or React overlay |
| Recording | Compliance documentation | Jibri + S3/Supabase storage |
| Bandwidth | Multiple HD streams | Jitsi SFU handles adaptive bitrate |

---

## 11. Integration with DWS6

### 8.1 IFrame API (Recommended for DWS6)

Embed Jitsi directly into the DWS6 React dashboard:

```tsx
// In dws6.com/dashboard/firehorse/v9-react/
import { useEffect, useRef } from 'react';

interface JitsiMeetingProps {
  roomName: string;
  displayName: string;
  domain?: string; // 'meet.jit.si' or your self-hosted domain
}

export function JitsiMeeting({ roomName, displayName, domain = 'meet.jit.si' }: JitsiMeetingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<any>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://${domain}/external_api.js`;
    script.onload = () => {
      apiRef.current = new (window as any).JitsiMeetExternalAPI(domain, {
        roomName,
        parentNode: containerRef.current,
        userInfo: { displayName },
        configOverwrite: {
          startWithAudioMuted: true,
          startWithVideoMuted: true,
          prejoinConfig: { enabled: true },
        },
        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK: false,
          SHOW_BRAND_WATERMARK: true,
          BRAND_WATERMARK_LINK: 'https://dws6.com',
        },
      });
    };
    document.head.appendChild(script);

    return () => {
      apiRef.current?.dispose();
      script.remove();
    };
  }, [roomName, displayName, domain]);

  return <div ref={containerRef} style={{ width: '100%', height: '600px' }} />;
}
```

### 8.2 JWT Authentication

Secure meetings by generating JWTs server-side in the DWS6 Express backend:

```typescript
// In src/ backend
import jwt from 'jsonwebtoken';

function generateJitsiToken(user: { id: string; name: string; email: string }) {
  return jwt.sign(
    {
      context: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: '', // optional
        },
      },
      aud: 'jitsi',
      iss: 'dws6',  // must match Prosody config
      sub: 'meet.yourdomain.com',
      room: '*',     // allow all rooms, or restrict
    },
    process.env.JITSI_JWT_SECRET!,
    { expiresIn: '1h' }
  );
}
```

### 8.3 Mobile SDKs

Jitsi provides native SDKs for mobile integration:

- **Android:** `org.jitsi.react:jitsi-meet-sdk` (Maven)
- **iOS:** `JitsiMeetSDK` (CocoaPods)
- **React Native:** `@jitsi/react-native-sdk`
- **Flutter:** Community packages available

### 8.4 DWS6 Use Cases

| Use Case | Solution | Cost |
|----------|----------|------|
| Internal team calls | Self-hosted Jitsi on Hetzner FI | €3.49–6.49/mo |
| Customer meetings | Embedded via IFrame in dashboard | Same server |
| Webinars / training | Jibri recording + YouTube streaming | +Jibri server |
| Mobile field workers | React Native SDK in Lifetime Fleet app | Free (SDK) |
| EU compliance demos | Self-hosted in Helsinki, E2EE enabled | Same server |

---

## 12. Security & Compliance

### 9.1 Encryption

| Layer | Method | Notes |
|-------|--------|-------|
| Oransport | DTLS-SRTP | Always on, encrypts media in transit |
| Oignaling | TLS/WSS | XMPP over WebSocket with TLS |
| End-to-End (E2EE) | Insertable Streams API | Optional, zero-knowledge — server can't decrypt |

### 9.2 GDPR Compliance

Self-hosting Jitsi on EU infrastructure (Hetzner Helsinki/Falkenstein) provides:

- **Data residency:** All media and signaling stays in EU
- **No third-party data sharing:** You control the full stack
- **Right to erasure:** Delete recordings/logs at will
- **Transparency:** Open-source code is auditable
- **DPIA-ready:** Well-documented architecture

### 9.3 Authentication Options

| Method | Complexity | Best For |
|--------|-----------|----------|
| Open (no auth) | Zero | Public meetings |
| JWT tokens | Low | App-embedded meetings (DWS6) |
| Internal (Prosody) | Low | Small team with user accounts |
| LDAP/SSO | Medium | Enterprise directory integration |

---

## 13. Recommendation

### For DWS6: Self-Host on Hetzner Helsinki

**Why:**

1. **Cost:** €6.49/month (CX32 — 4 vCPU, 8 GB RAM) handles ~50 concurrent users
2. **EU Data Residency:** Helsinki data center — Finland-based, GDPR compliant
3. **Full Control:** Custom branding, JWT auth tied to DWS6 user system
4. **Integration:** IFrame API embeds directly into the Firehorse v9-react dashboard
5. **Scaling:** Add JVB instances on demand if needed; Hetzner hourly billing
6. **Open Source:** No vendor lock-in, no per-user fees, no feature gates
7. **Recording:** Add Jibri on a separate server when needed

### Phased Rollout

**Phase 1 — Immediate (free):**
- Use meet.jit.si for team calls
- Prototype IFrame integration in DWS6 dashboard

**Phase 2 — Self-host (€6.49/mo):**
- Deploy Jitsi on Hetzner CX32 Helsinki with Docker
- Configure JWT auth with DWS6 backend
- Custom branding (remove Jitsi watermark, add DWS branding)
- Enable E2EE for sensitive meetings

**Phase 3 — Scale (as needed):**
- Add Jibri server for recording/streaming
- Add second JVB for geographic load distribution
- Integrate with Firehorse Omnichannel for meeting scheduling

---

## 14. Tweet-Sized Proposal

### Option A — Product Announcement (280 chars)

> We're adding video conferencing to DWS6 — powered by @oJitsi_oMeet
>
> Open source. E2E encrypted. Self-hosted in Helsinki 🇫🇮
>
> €6.49/mo. Zero per-user fees. Full GDPR/EU data sovereignty.
>
> Embedded directly in our dashboard via IFrame API.
>
> No Zoom. No lock-in.

### Option B — Technical/Developer (280 chars)

> Self-hosting @oJitsi_oMeet with Docker on @ohabortzner Helsinki:
>
> - €6.49/mo (4 vCPU, 8GB)
> - 50 concurrent users
> - E2E encrypted, WebRTC
> - IFrame API → embed in any React app
> - JWT auth, custom branding
> - EU data sovereignty 🇪🇺
>
> github.com/jitsi/docker-jitsi-meet

### Option C — Business Value (280 chars)

> Why pay per-seat for Zoom/Teams when @oJitsi_oMeet is 100% open source?
>
> Self-host in EU for €6.49/mo:
> ✅ Unlimited users & meetings
> ✅ End-to-end encryption
> ✅ GDPR compliant (Helsinki 🇫🇮)
> ✅ Embed in your app via API
> ✅ No vendor lock-in
>
> meet.jit.si

### Option D — IoT/Sensor Focus (280 chars)

> Connecting factory sensors to video conferencing:
>
> IoT threshold breach → auto-create @oJitsi_oMeet room → team joins in seconds
>
> Live camera + sensor data overlay. Recorded for EU compliance.
>
> Self-hosted in Helsinki. €6.49/mo. Open source.
>
> Industrial video intelligence 🏭🔒

---

## 15. References

- [Jitsi Meet — Official Site](https://jitsi.org)
- [Jitsi Architecture & Components](https://jitsi.guide/blog/how-jitsi-meet-works-architecture-components/)
- [Self-Hosting Guide — Docker](https://jitsi.github.io/handbook/docs/devops-guide/devops-guide-docker/)
- [Self-Hosting Guide — Debian/Ubuntu](https://jitsi.github.io/handbook/docs/devops-guide/devops-guide-quickstart/)
- [IFrame API Documentation](https://jitsi.github.io/handbook/docs/dev-guide/dev-guide-iframe/)
- [JaaS — Jitsi as a Service (8x8)](https://jaas.8x8.vc/)
- [JaaS Pricing](https://cpaas.8x8.com/en/pricing/jitsi-as-a-service-pricing/)
- [Docker Jitsi Meet — GitHub](https://github.com/jitsi/docker-jitsi-meet)
- [Hetzner Cloud — Jitsi On-Demand](https://zuckerbude.org/hetzner-jitsi/)
- [Oracle Cloud Free Tier for TURN Servers](https://biggo.com/news/202503290713_Oracle-Cloud-Free-Tier-TURN-Servers)
- [Jitsi Meet React Integration](https://anlishamaharjan.medium.com/integrate-jitsi-meet-iframe-api-in-react-707175bda031)
- [Self-Hosting with Cloudflare Tunnel](https://favour.dev/blogs/Self-Hosting-Jitsi)
- [HOSTKEY — Jitsi in Finland/Germany](https://hostkey.com/apps/communication/jitsi/)
- [Scaleway Jitsi Docker Tutorial](https://www.scaleway.com/en/docs/tutorials/jitsi-docker/)
- [Scaleway — Building Scalable Jitsi](https://www.scaleway.com/en/blog/building-jitsi-solution-powered-by-scaleway/)
- [AWS WebSocket API for WebRTC Signaling](https://webrtchacks.com/leverage-aws-websocket-api-for-webrtc-signaling/)
- [Terraform AWS Jitsi](https://github.com/hajowieland/terraform-aws-jitsi)
- [Upstash — Stateful Lambda with Redis](https://upstash.com/blog/aws-lambda-redis-rest)
- [Jitsi Kubernetes Scaling Guide](https://jitsi.support/scaling/kubernetes-jitsi-scaling-guide/)
- [GCP Jitsi Setup Guide](https://meetrix.io/articles/how-to-set-up-jitsi-on-google-cloud-platform-gcp/)
