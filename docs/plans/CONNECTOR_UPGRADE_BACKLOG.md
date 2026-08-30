# DWS IQ 6 Connector Upgrade Backlog

**Version:** 1.0
**Date:** 2026-08-30
**Owner:** Platform Team
**Status:** ACTIVE — Backlog for connector modernization

---

## Executive Summary

This backlog covers **23 connectors** across two domains:

| Domain | Count | Location | Current State |
|--------|-------|----------|---------------|
| **ERP Connectors** | 5 | `src/integrations/erp/connectors/` | TypeScript classes, varying maturity |
| **Identity/SSO Connectors** | 18 | `dws6.com/admin/connectors/index.html` | HTML UI only, no backend implementation |

---

## Connector Inventory with Version Numbers

### ERP Connectors (Backend)

| # | Connector | Version | Provider | Auth Method | Direction | Entities | Status | Owner |
|---|-----------|---------|----------|-------------|-----------|----------|--------|-------|
| **ERP-001** | Visma Connector | 1.0.0 | Visma.net / Visma Enterprise | OAuth 2.0 Client Credentials | Bidirectional | Production Orders, Machine Data, OEE, Maintenance | Stale | Platform Team |
| **ERP-002** | SAP S/4HANA Connector | 1.1.0 | SAP | Basic Auth / OAuth 2.0 | Bidirectional | Production Orders, Machine Data, OEE, Maintenance | Stale | Platform Team |
| **ERP-003** | IFS Cloud Connector | 1.2.0 | IFS Cloud | OAuth 2.0 Client Credentials | Bidirectional | Production Orders, Machine Data, OEE, Maintenance, Assets | Healthy | Platform Team |
| **ERP-004** | Jeeves ERP Connector | 0.9.0 | Jeeves | API Key | Bidirectional | Production Orders, Machine Data, OEE, Maintenance | Stale | Platform Team |
| **ERP-005** | Dynamics 365 Connector | 1.0.0 | Microsoft Dynamics 365 | OAuth 2.0 Client Credentials | Bidirectional | Production Orders, Machine Data, OEE, Maintenance | Stale | Platform Team |

### Identity/SSO Connectors (Frontend UI Only — No Backend)

| # | Connector | Version | Provider | Auth Method | Direction | Status | Owner |
|---|-----------|---------|----------|-------------|-----------|--------|-------|
| **IDP-001** | Google Workspace | 0.0.0 (UI only) | Google | OAuth 2.0 / OIDC | Inbound | Unowned | None |
| **IDP-002** | Microsoft Entra ID | 0.0.0 (UI only) | Microsoft | SAML 2.0 / OAuth 2.0 | Inbound | Unowned | None |
| **IDP-003** | IBM ID | 0.0.0 (UI only) | IBM | OAuth 2.0 / OIDC | Inbound | Unowned | None |
| **IDP-004** | Sign in with Apple | 0.0.0 (UI only) | Apple | OAuth 2.0 | Inbound | Unowned | None |
| **IDP-005** | GitHub | 0.0.0 (UI only) | GitHub | OAuth 2.0 | Inbound | Unowned | None |
| **IDP-006** | LinkedIn | 0.0.0 (UI only) | LinkedIn | OAuth 2.0 | Inbound | Unowned | None |
| **IDP-007** | Slack | 0.0.0 (UI only) | Slack | OAuth 2.0 | Inbound | Unowned | None |
| **IDP-008** | Okta | 0.0.0 (UI only) | Okta | SAML 2.0 / OIDC | Inbound | Unowned | None |
| **IDP-009** | SAP Identity | 0.0.0 (UI only) | SAP | SAML 2.0 | Inbound | Unowned | None |
| **IDP-010** | Salesforce | 0.0.0 (UI only) | Salesforce | OAuth 2.0 / SAML | Inbound | Unowned | None |
| **IDP-011** | AWS Cognito | 0.0.0 (UI only) | AWS | OAuth 2.0 / SAML | Inbound | Unowned | None |
| **IDP-012** | Oracle Identity | 0.0.0 (UI only) | Oracle | SAML 2.0 / OIDC | Inbound | Unowned | None |
| **IDP-013** | Auth0 | 0.0.0 (UI only) | Auth0 | OAuth 2.0 / SAML | Inbound | Unowned | None |
| **IDP-014** | OneLogin | 0.0.0 (UI only) | OneLogin | SAML 2.0 / OIDC | Inbound | Unowned | None |
| **IDP-015** | Ping Identity | 0.0.0 (UI only) | Ping Identity | SAML 2.0 / OIDC | Inbound | Unowned | None |
| **IDP-016** | Duo Security | 0.0.0 (UI only) | Cisco Duo | OAuth 2.0 / RADIUS | Inbound | Unowned | None |
| **IDP-017** | JumpCloud | 0.0.0 (UI only) | JumpCloud | SAML / LDAP / RADIUS | Inbound | Unowned | None |
| **IDP-018** | Custom SAML/OIDC | 0.0.0 (UI only) | Generic | SAML 2.0 / OIDC | Inbound | Unowned | None |

---

## Classification Matrix

| Classification | Criteria | Connectors |
|----------------|----------|------------|
| **Healthy** | Full implementation, tests, health endpoint, owner, recent sync | IFS Cloud (ERP-003) |
| **Stale** | Implementation exists but lacks tests, health checks, token refresh logic, incremental sync, error handling | Visma, SAP, Jeeves, Dynamics 365 (ERP-001, 002, 004, 005) |
| **Broken** | Implementation incomplete, missing critical methods, fails connection test | None currently |
| **Unsafe** | No token refresh, secrets in code, no tenant isolation, no audit logging | None currently (but ERP stale ones border on this) |
| **Unowned** | No backend implementation, only UI placeholder, no owner assigned | All 18 Identity/SSO connectors (IDP-001 through IDP-018) |

---

## Phase 1: Identity Connectors (Weeks 1-6)

**Priority:** High — Identity is the gateway to all other systems.

### Wave 1.1: Core OAuth 2.0 Providers (Weeks 1-2)

| Connector | Version Target | Backlog Items |
|-----------|----------------|---------------|
| **IDP-001 Google Workspace** | 1.0.0 | [ ] Create `GoogleWorkspaceConnector` class extending `BaseIdentityConnector`<br>[ ] Implement OAuth 2.0 Authorization Code flow with PKCE<br>[ ] Add domain verification (hd claim)<br>[ ] Implement token refresh with 5-min buffer<br>[ ] Add health endpoint (`GET /health/google`)<br>[ ] Add contract test: login → consent → callback → token → refresh<br>[ ] Add audit logging for login events<br>[ ] Add rate limit handling (Google: 100 req/s)<br>[ ] Owner assignment |
| **IDP-002 Microsoft Entra ID** | 1.0.0 | [ ] Create `MicrosoftEntraConnector` class<br>[ ] Implement both OAuth 2.0 and SAML 2.0 flows<br>[ ] Add conditional access support (claims challenge)<br>[ ] Implement multi-tenant support (common + specific tenant)<br>[ ] Add Microsoft Graph scopes configuration<br>[ ] Add health endpoint (`GET /health/microsoft`)<br>[ ] Add contract test: both flows<br>[ ] Add audit logging for token events<br>[ ] Rate limit handling (Microsoft: 1000 req/min)<br>[ ] Owner assignment |
| **IDP-003 IBM ID** | 1.0.0 | [ ] Create `IBMIdConnector` class<br>[ ] Implement OAuth 2.0 / OIDC flow<br>[ ] Add Watsonx/Cloud Pak scope configuration<br>[ ] Health endpoint (`GET /health/ibm`)<br>[ ] Contract test<br>[ ] Owner assignment |

### Wave 1.2: Developer & Social Providers (Weeks 3-4)

| Connector | Version Target | Backlog Items |
|-----------|----------------|---------------|
| **IDP-004 Sign in with Apple** | 1.0.0 | [ ] Create `AppleIdConnector` class<br>[ ] Implement OAuth 2.0 with JWT client secret<br>[ ] Add "Hide My Email" handling<br>[ ] Health endpoint<br>[ ] Contract test |
| **IDP-005 GitHub** | 1.0.0 | [ ] Create `GitHubConnector` class<br>[ ] Implement OAuth 2.0 with organization/team mapping<br>[ ] Add 2FA enforcement detection<br>[ ] Health endpoint<br>[ ] Contract test |
| **IDP-006 LinkedIn** | 1.0.0 | [ ] Create `LinkedInConnector` class<br>[ ] Implement OAuth 2.0 (v2 API)<br>[ ] Profile/email/company scope handling<br>[ ] Health endpoint<br>[ ] Contract test |
| **IDP-006 Slack** | 1.0.0 | [ ] Create `SlackConnector` class<br>[ ] Implement OAuth 2.0 with workspace/team scope<br>[ ] Add bot token handling<br>[ ] Health endpoint<br>[ ] Contract test |

### Wave 1.3: Enterprise SAML/OIDC Providers (Weeks 5-6)

| Connector | Version Target | Backlog Items |
|-----------|----------------|---------------|
| **IDP-008 Okta** | 1.0.0 | [ ] Create `OktaConnector` class<br>[ ] Implement SAML 2.0 SP-initiated + IdP-initiated<br>[ ] Implement OIDC flow<br>[ ] Add SCIM provisioning support<br>[ ] Add MFA enforcement detection<br>[ ] Health endpoint<br>[ ] Contract test: SAML + OIDC flows<br>[ ] Rate limit handling |
| **IDP-009 SAP Identity** | 1.0.0 | [ ] Create `SapIdentityConnector` class<br>[ ] SAML 2.0 only (per SAP IAS)<br>[ ] BTP/S/4HANA integration metadata<br>[ ] Health endpoint<br>[ ] Contract test |
| **IDP-010 Salesforce** | 1.0.0 | [ ] Create `SalesforceConnector` class<br>[ ] OAuth 2.0 + SAML 2.0<br>[ ] Communities/Experience Cloud support<br>[ ] Health endpoint<br>[ ] Contract test |
| **IDP-011 AWS Cognito** | 1.0.0 | [ ] Create `AwsCognitoConnector` class<br>[ ] User Pool + Identity Pool support<br>[ ] SAML + OIDC<br>[ ] IAM federation mapping<br>[ ] Health endpoint<br>[ ] Contract test |
| **IDP-012 Oracle Identity** | 1.0.0 | [ ] Create `OracleIdentityConnector` class<br>[ ] IDCS integration<br>[ ] SAML 2.0 / OIDC<br>[ ] Health endpoint<br>[ ] Contract test |

### Wave 1.4: Remaining Enterprise Providers (Week 6)

| Connector | Version Target | Backlog Items |
|-----------|----------------|---------------|
| **IDP-013 Auth0** | 1.0.0 | [ ] Create `Auth0Connector` class<br>[ ] Universal Login + Rules/Actions<br>[ ] SAML + OIDC<br>[ ] MFA enforcement<br>[ ] Health endpoint<br>[ ] Contract test |
| **IDP-014 OneLogin** | 1.0.0 | [ ] Create `OneLoginConnector` class<br>[ ] SAML 2.0 / OIDC<br>[ ] SCIM provisioning<br>[ ] SmartFactor authentication<br>[ ] Health endpoint<br>[ ] Contract test |
| **IDP-015 Ping Identity** | 1.0.0 | [ ] Create `PingIdentityConnector` class<br>[ ] PingFederate / PingOne / PingAccess<br>[ ] SAML 2.0 / OIDC<br>[ ] API Security integration<br>[ ] Health endpoint<br>[ ] Contract test |
| **IDP-016 Duo Security** | 1.0.0 | [ ] Create `DuoSecurityConnector` class<br>[ ] MFA as step-up (not primary IdP)<br>[ ] Push / Hardware Token / Biometrics<br>[ ] RADIUS/OAuth integration<br>[ ] Health endpoint<br>[ ] Contract test |
| **IDP-017 JumpCloud** | 1.0.0 | [ ] Create `JumpCloudConnector` class<br>[ ] SAML / LDAP / RADIUS<br>[ ] Directory sync<br>[ ] MDM integration<br>[ ] Health endpoint<br>[ ] Contract test |
| **IDP-018 Custom SAML/OIDC** | 1.0.0 | [ ] Create `CustomSamlOidcConnector` class<br>[ ] Generic SAML 2.0 SP metadata upload<br>[ ] Generic OIDC discovery + config<br>[ ] Attribute mapping UI<br>[ ] Health endpoint<br>[ ] Contract test |

---

## Phase 2: ERP Connectors (Weeks 7-12)

**Priority:** High — Core business data integration.

### Wave 2.1: Refresh Stale ERP Connectors (Weeks 7-9)

| Connector | Current Version | Target Version | Backlog Items |
|-----------|----------------|----------------|---------------|
| **ERP-001 Visma** | 1.0.0 | 2.0.0 | [ ] Add incremental sync with `since` parameter (lastModifiedDateTime)<br>[ ] Implement proper token refresh with 5-min buffer<br>[ ] Add duplicate detection (idempotency keys)<br>[ ] Add retry with exponential backoff (max 3 retries)<br>[ ] Add circuit breaker pattern<br>[ ] Add health endpoint (`GET /health/visma`)<br>[ ] Add contract test: full sync → incremental sync → retry → disconnect<br>[ ] Add audit logging for all sync operations<br>[ ] Rate limit handling (Visma: 60 req/min)<br>[ ] Update version to 2.0.0 |
| **ERP-002 SAP S/4HANA** | 1.1.0 | 2.0.0 | [ ] Add OData v4 full support (currently v2/v4 mixed)<br>[ ] Implement proper incremental sync with `$filter=LastChangeDate gt...`<br>[ ] Add CSRF token handling for write operations<br>[ ] Add batch request support (`$batch`)<br>[ ] Add duplicate detection via production order GUID<br>[ ] Add retry with exponential backoff<br>[ ] Add circuit breaker<br>[ ] Health endpoint (`GET /health/sap`)<br>[ ] Contract test: full → incremental → retry → disconnect<br>[ ] Audit logging for all operations<br>[ ] Rate limit handling (SAP: configurable, typically 200 req/min)<br>[ ] Update version to 2.0.0 |
| **ERP-004 Jeeves** | 0.9.0 | 2.0.0 | [ ] Implement proper authentication flow (currently stub)<br>[ ] Add incremental sync with `modifiedSince` parameter<br>[ ] Add token refresh logic (API key rotation)<br>[ ] Add duplicate detection<br>[ ] Add retry/backoff/circuit breaker<br>[ ] Health endpoint (`GET /health/jeeves`)<br>[ ] Contract test<br>[ ] Rate limit handling<br>[ ] Update version to 2.0.0 |
| **ERP-005 Dynamics 365** | 1.0.0 | 2.0.0 | [ ] Add incremental sync with `modifiedSince` / `$filter`<br>[ ] Implement proper token refresh (5-min buffer)<br>[ ] Add Business Central vs F&O endpoint detection<br>[ ] Add duplicate detection (systemId)<br>[ ] Add retry/backoff/circuit breaker<br>[ ] Health endpoint (`GET /health/d365`)<br>[ ] Contract test<br>[ ] Rate limit handling (D365: 100 req/s)<br>[ ] Update version to 2.0.0 |

### Wave 2.2: Enhance IFS Cloud (Already Healthy) (Week 10)

| Connector | Current Version | Target Version | Backlog Items |
|-----------|----------------|----------------|---------------|
| **ERP-003 IFS Cloud** | 1.2.0 | 1.3.0 | [ ] Add incremental sync for `syncAssets()` with `$filter=DateModified gt...`<br>[ ] Add health endpoint (`GET /health/ifs`)<br>[ ] Add contract test for asset sync<br>[ ] Add audit logging for asset sync operations<br>[ ] Update version to 1.3.0 |

### Wave 2.3: ERP Connector Framework Improvements (Weeks 11-12)

| Task | Description |
|------|-------------|
| **Base Connector Refactor** | Add abstract methods: `incrementalSync()`, `healthCheck()`, `disconnect()`, `getRateLimitInfo()` |
| **Shared Retry Logic** | Extract retry/backoff/circuit breaker to `BaseERPConnector` |
| **Unified Health Endpoint** | Standardize `GET /health/{provider}` response format across all ERP connectors |
| **Contract Test Suite** | Create shared test harness: `login → health → fullSync → incrementalSync → retry → disconnect` |
| **Audit Log Standardization** | Structured audit events: `{timestamp, provider, operation, entity, status, records, duration, error?}` |
| **Secret Management** | Move all secrets to vault (HashiCorp Vault / AWS Secrets Manager), remove from config files |
| **Tenant Isolation** | Add tenant context to all operations, enforce at base connector level |
| **Version Bump** | Update all ERP connectors to semantic versions per above |

---

## Phase 3: Industrial/ESG Systems (Weeks 13-16)

**Priority:** Medium — Emerging integrations for sustainability and industrial OT.

| Connector | Version Target | Backlog Items |
|-----------|----------------|---------------|
| **OT-001 Beckhoff TwinCAT** | 1.0.0 | [ ] Create `BeckhoffConnector` class<br>[ ] OPC UA PubSub / MQTT for EtherCAT/XFC data<br>[ ] TwinCAT 3 PLC variable subscription<br>[ ] Real-time telemetry (<100µs)<br>[ ] Health endpoint<br>[ ] Contract test |
| **OT-002 Siemens S7/ET200** | 1.0.0 | [ ] Create `SiemensConnector` class<br>[ ] OPC UA Server (TIA Portal)<br>[ ] PROFINET/PROFIsafe integration<br>[ ] S7 connector for legacy<br>[ ] Health endpoint<br>[ ] Contract test |
| **OT-003 ABB KNX/BACnet** | 1.0.0 | [ ] Create `AbbKnxConnector` class<br>[ ] KNX IP / BACnet/IP<br>[ ] free@home System Access Point<br>[ ] Näpsä EV distribution panel data<br>[ ] Health endpoint<br>[ ] Contract test |
| **OT-004 iPCMax Gateways** | 1.0.0 | [ ] Create `IpcMaxConnector` class<br>[ ] Modbus RTU/TCP → MQTT translation<br>[ ] ICP DAS power meter data<br>[ ] CAN/Relay/Analogue modules<br>[ ] Health endpoint<br>[ ] Contract test |
| **ESG-001 CBAM/ETS Reporting** | 1.0.0 | [ ] Create `CbamEtsConnector` class<br>[ ] EU ETS registry API integration<br>[ ] CBAM transitional report generation<br>[ ] Emissions factor database sync<br>[ ] Health endpoint<br>[ ] Contract test |

---

## Connector Contract Test Requirements (All Phases)

Each connector **must pass** this contract test suite before promotion:

```typescript
// Standard contract test (pseudo-code)
describe(`${Provider}Connector Contract Tests`, () => {
  let connector: BaseConnector;
  let testConfig: ConnectorConfig;

  beforeAll(() => {
    connector = new ProviderConnector(testConfig);
  });

  test('1. Login / Consent / Callback', async () => {
    const authUrl = connector.getAuthUrl({ state: 'test-state' });
    expect(authUrl).toContain('state=test-state');
    // Simulate callback
    const tokens = await connector.handleCallback({ code: 'test-code', state: 'test-state' });
    expect(tokens.accessToken).toBeDefined();
    expect(tokens.refreshToken).toBeDefined();
    expect(tokens.expiresIn).toBeGreaterThan(0);
  });

  test('2. Token Refresh', async () => {
    const tokens = await connector.refreshAccessToken('valid-refresh-token');
    expect(tokens.accessToken).toBeDefined();
    expect(tokens.expiresIn).toBeGreaterThan(0);
  });

  test('3. Initial Sync', async () => {
    const result = await connector.sync({ full: true });
    expect(result.success).toBe(true);
    expect(result.recordsProcessed).toBeGreaterThanOrEqual(0);
  });

  test('4. Incremental Sync', async () => {
    const since = new Date(Date.now() - 3600000); // 1 hour ago
    const result = await connector.sync({ since });
    expect(result.success).toBe(true);
    expect(result.recordsProcessed).toBeGreaterThanOrEqual(0);
  });

  test('5. Retry on Transient Failure', async () => {
    // Mock 503 response
    const result = await connector.syncWithRetry({ full: true }, 3);
    expect(result.success).toBe(true);
  });

  test('6. Duplicate Handling', async () => {
    const result1 = await connector.sync({ full: true });
    const result2 = await connector.sync({ full: true });
    // Second sync should not create duplicates
    expect(result2.recordsProcessed).toBeLessThanOrEqual(result1.recordsProcessed);
  });

  test('7. Disconnect / Cleanup', async () => {
    await connector.disconnect();
    expect(connector.isConnected()).toBe(false);
  });

  test('8. Health Endpoint', async () => {
    const health = await connector.healthCheck();
    expect(health.status).toBe('healthy');
    expect(health.latencyMs).toBeLessThan(5000);
  });

  test('9. Rate Limit Handling', async () => {
    // Mock 429 response
    const result = await connector.syncWithRateLimit({ full: true });
    expect(result.success).toBe(true);
  });

  test('10. Audit Trail', async () => {
    const result = await connector.sync({ full: true });
    const audit = await getAuditLog(result.operationId);
    expect(audit).toContainEqual(expect.objectContaining({
      provider: Provider.name,
      operation: 'sync',
      status: 'success',
    }));
  });
});
```

---

## Health Endpoint Standard (All Connectors)

**Endpoint:** `GET /health/{provider}`

**Response Format:**
```json
{
  "status": "healthy" | "degraded" | "unhealthy",
  "provider": "visma",
  "version": "2.0.0",
  "timestamp": "2026-08-30T10:30:00Z",
  "checks": {
    "authentication": { "status": "healthy", "latencyMs": 45 },
    "apiConnectivity": { "status": "healthy", "latencyMs": 120 },
    "tokenValidity": { "status": "healthy", "expiresInSeconds": 3200 },
    "rateLimit": { "status": "healthy", "remaining": 55, "resetInSeconds": 45 }
  },
  "lastSync": {
    "timestamp": "2026-08-30T10:25:00Z",
    "status": "success",
    "recordsProcessed": 142,
    "durationMs": 2340
  }
}
```

---

## Rollback Path (Per Connector)

| Step | Action |
|------|--------|
| 1 | Feature flag disable: `CONNECTOR_{PROVIDER}_ENABLED=false` |
| 2 | Deploy previous version from container registry / artifact store |
| 3 | Run health check: `GET /health/{provider}` |
| 4 | Verify contract test passes against rolled-back version |
| 5 | Re-enable feature flag |
| 6 | Monitor error rate for 30 minutes |

**Rollback Artifacts:** Each connector version tagged in Git (`connector/{provider}/v{version}`) and container image tagged (`dws6/{provider}-connector:v{version}`).

---

## Owner Assignment

| Connector Group | Owner | Backup |
|-----------------|-------|--------|
| **Identity/SSO (IDP-001 to IDP-018)** | Platform Team — Identity Lead | DevOps Lead |
| **ERP Core (ERP-001 to ERP-005)** | Platform Team — ERP Integration Lead | Platform Team — Senior Engineer |
| **Industrial OT (OT-001 to OT-004)** | Platform Team — Industrial Integration Lead | Platform Team — Senior Engineer |
| **ESG/Compliance (ESG-001)** | Platform Team — ESG Integration Lead | Compliance Lead |

---

## Migration Notes (Per Connector)

| Connector | Migration Notes |
|-----------|-----------------|
| **Visma 1.0.0 → 2.0.0** | Breaking: `syncProductionOrders()` signature changed (added `since` param). Update callers. |
| **SAP 1.1.0 → 2.0.0** | Breaking: OData v4 now default. Config `odataVersion` defaults to 'v4'. |
| **Jeeves 0.9.0 → 2.0.0** | Breaking: Auth method changed from stub to real API key validation. |
| **Dynamics 365 1.0.0 → 2.0.0** | Non-breaking: Added incremental sync. Existing full-sync calls work unchanged. |
| **IFS Cloud 1.2.0 → 1.3.0** | Non-breaking: Added asset incremental sync. |
| **All Identity Providers 0.0.0 → 1.0.0** | New implementation. No migration — new deployment. |

---

## Definition of Done (Per Connector)

- [ ] Version bumped and tagged in Git
- [ ] Container image built and pushed to registry
- [ ] Contract test suite passes (10/10 tests)
- [ ] Health endpoint returns `healthy`
- [ ] Audit logging produces structured events
- [ ] Rate limit handling verified under load
- [ ] Rollback tested and documented
- [ ] Owner assigned and acknowledged
- [ ] Documentation updated (README, API docs)
- [ ] Feature flag tested (enable/disable)
- [ ] Monitoring alerts configured

---

## Timeline Summary

| Phase | Weeks | Connectors | Focus |
|-------|-------|------------|-------|
| **Phase 1** | 1-6 | 18 Identity/SSO | Core OAuth/SAML, enterprise providers |
| **Phase 2** | 7-12 | 5 ERP | Refresh stale, enhance framework |
| **Phase 3** | 13-16 | 5 Industrial/ESG | New OT/ESG integrations |
| **Total** | **16 weeks** | **28 connectors** | Complete modernization |

---

## Budget & Resource Estimate

| Resource | Phase 1 (6 wks) | Phase 2 (6 wks) | Phase 3 (4 wks) | Total |
|----------|-----------------|-----------------|-----------------|-------|
| **Engineers** | 2 FTE | 2 FTE | 1 FTE | — |
| **QA/Contract Tests** | 0.5 FTE | 0.5 FTE | 0.5 FTE | — |
| **DevOps/Support** | 0.25 FTE | 0.25 FTE | 0.25 FTE | — |
| **Total Cost (est.)** | €48,000 | €48,000 | €28,000 | **€124,000** |

---

**Document Status:** DRAFT
**Next Review:** 2026-09-15 (after Phase 1 kickoff)