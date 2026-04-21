---
VERSION AND AGENT HISTORY
Version: 1.1
Last Updated: 2026-04-08
Author: Claude Code (Opus 4.6)
Agent: claude/research-aspire-observability-04e8I
Status: RESEARCH NOTE
Change Log:
  - v1.0: Initial research comparing managedcode/dotnet-skills with Aspire observability needs
  - v1.1: Added Appendix A with detailed Aspire observability patterns, custom instrumentation,
    health check endpoints, and non-Aspire bootstrapping guide
---

# Research Note: .NET Aspire Observability vs managedcode/dotnet-skills

## 1. What is managedcode/dotnet-skills?

**Repository:** github.com/managedcode/dotnet-skills
**License:** MIT
**Target:** .NET 10+
**NuGet:** `dotnet-skills` (global tool), `dotnet-agents`, `agents`

An installable skill catalog and CLI that teaches AI coding agents (Claude Code, Copilot, Gemini, Codex, Junie) modern .NET patterns. Instead of AI generating outdated EF6 or `Startup.cs` code, installed skills inject current best-practice knowledge.

### Key facts

- **83 skills** across 13 categories (Core, Web, Cloud, Distributed, Desktop, Data, AI, Testing, Code Quality, Architecture, Metrics, Legacy, Cross-Platform UI)
- **7 orchestration agents** (router, build, data, frontend, AI, modernization, review) + 3 skill-scoped specialists
- **Skill-per-directory pattern:** Each `skills/<name>/SKILL.md` + optional `references/`, `agents/`, `scripts/`
- **Multi-platform install:** `dotnet skills install aspire` writes to `.claude/skills/`, `.github/skills/`, `.gemini/skills/`, etc.
- **Community-driven:** upstream-watch automation tracks Microsoft releases and opens issues when skills need updates
- **Package bundles:** `dotnet skills install package ai`, `package code-quality`, `package mcaf`, `package orleans`

### Installation

```bash
dotnet tool install --global dotnet-skills
dotnet skills install aspire           # single skill
dotnet skills install package ai       # multi-skill package
dotnet skills recommend                # scan .csproj and suggest
```

## 2. The dotnet-aspire Skill (v1.3.1)

The `dotnet-aspire` skill is the most relevant to observability. It covers:

### What it teaches AI agents

| Area                  | Coverage                                                        |
| --------------------- | --------------------------------------------------------------- |
| AppHost orchestration | `WithReference()`, `WaitFor()`, resource modeling               |
| ServiceDefaults       | OpenTelemetry, health checks, resilience, service discovery     |
| CLI-first workflow    | `aspire run`, `aspire init`, `aspire add`, `aspire deploy`      |
| Integration selection | First-party Aspire vs CommunityToolkit/Aspire                   |
| Testing               | `DistributedApplicationTestingBuilder`, shared AppHost fixtures |
| Deployment            | ACA, App Service, CLI pipeline                                  |
| Dashboard             | Development observability surface (not production)              |

### ServiceDefaults pattern from the skill

```csharp
public static class Extensions
{
    public static TBuilder AddServiceDefaults<TBuilder>(this TBuilder builder)
        where TBuilder : IHostApplicationBuilder
    {
        builder.ConfigureOpenTelemetry();
        builder.AddDefaultHealthChecks();

        builder.Services.AddServiceDiscovery();
        builder.Services.ConfigureHttpClientDefaults(http =>
        {
            http.AddStandardResilienceHandler();
            http.AddServiceDiscovery();
        });

        return builder;
    }
}
```

### Observability scope in the skill

- OpenTelemetry logging, metrics, and tracing configuration
- Health check registration and endpoint mapping
- Dashboard resource graph validation
- Anti-pattern: bloating ServiceDefaults with business logic

### Skill-scoped agent

`dotnet-aspire-orchestrator` handles AppHost, CLI, integration choice, testing, and deployment routing inside the Aspire surface.

## 3. .NET Aspire Observability Stack (What It Actually Provides)

### 3.1 Three Pillars via OpenTelemetry

Aspire ServiceDefaults configures all three observability pillars through a single `AddServiceDefaults()` call:

| Pillar      | Implementation                                       | Protocol       |
| ----------- | ---------------------------------------------------- | -------------- |
| **Logging** | `ILogger` + OpenTelemetry log exporter               | OTLP gRPC/HTTP |
| **Tracing** | `System.Diagnostics.Activity` + OTel trace exporter  | OTLP gRPC/HTTP |
| **Metrics** | `System.Diagnostics.Metrics` + OTel metrics exporter | OTLP gRPC/HTTP |

### 3.2 Key NuGet packages

```xml
<!-- ServiceDefaults typically references -->
<PackageReference Include="Microsoft.Extensions.Http.Resilience" />
<PackageReference Include="Microsoft.Extensions.ServiceDiscovery" />
<PackageReference Include="OpenTelemetry.Exporter.OpenTelemetryProtocol" />
<PackageReference Include="OpenTelemetry.Extensions.Hosting" />
<PackageReference Include="OpenTelemetry.Instrumentation.AspNetCore" />
<PackageReference Include="OpenTelemetry.Instrumentation.Http" />
<PackageReference Include="OpenTelemetry.Instrumentation.Runtime" />
```

### 3.3 Aspire Dashboard

The dashboard is a standalone ASP.NET Core app (also available as Docker container `mcr.microsoft.com/dotnet/aspire-dashboard`) that:

- Receives OTLP telemetry from all services
- Shows **structured logs** with filtering by resource, level, and content
- Shows **distributed traces** with waterfall visualization across services
- Shows **metrics** with real-time charts (request rate, latency, error rate, runtime metrics)
- Shows **resource health** with live status of all orchestrated services
- Available in dev mode automatically; can run standalone for non-Aspire apps

### 3.4 Health checks

```csharp
public static TBuilder AddDefaultHealthChecks<TBuilder>(this TBuilder builder)
    where TBuilder : IHostApplicationBuilder
{
    builder.Services.AddHealthChecks()
        .AddCheck("self", () => HealthCheckResult.Healthy());

    // Each integration adds its own health check:
    // Redis: AddRedis(), PostgreSQL: AddNpgSql(), etc.
    return builder;
}

// Endpoint mapping
app.MapDefaultEndpoints(); // maps /health and /alive
```

### 3.5 What non-Aspire apps need to match this

A standalone .NET app needs to manually add:

1. OpenTelemetry SDK + OTLP exporter packages (5-7 NuGet packages)
2. Configure `AddOpenTelemetry()` with trace/metrics/log providers
3. Add ASP.NET Core + HttpClient instrumentation
4. Configure OTLP endpoint (env var `OTEL_EXPORTER_OTLP_ENDPOINT`)
5. Add health check packages + endpoint mapping
6. Add resilience via `Microsoft.Extensions.Http.Resilience`
7. Run Aspire Dashboard container or connect to Jaeger/Prometheus/Grafana

Aspire ServiceDefaults eliminates all this boilerplate with one method call.

## 4. Comparison: dotnet-skills Aspire Skill vs Actual Aspire Observability Needs

| Observability Need      | Aspire Provides                                | dotnet-skills Covers              | Gap             |
| ----------------------- | ---------------------------------------------- | --------------------------------- | --------------- |
| OpenTelemetry setup     | Full OTLP config via ServiceDefaults           | Yes - teaches the pattern         | None            |
| Structured logging      | ILogger + OTel exporter                        | Mentioned in patterns             | Minimal         |
| Distributed tracing     | Activity + OTel trace exporter                 | Yes - references and patterns     | None            |
| Metrics collection      | System.Diagnostics.Metrics + OTel              | Yes - mentioned                   | Minimal         |
| Dashboard usage         | Built-in dev dashboard                         | Yes - validation guidance         | None            |
| Health checks           | AddDefaultHealthChecks pattern                 | Yes - in ServiceDefaults guidance | None            |
| Production monitoring   | NOT included (dev tool only)                   | Correctly warns about this        | None            |
| Service discovery       | Built-in                                       | Yes                               | None            |
| HTTP resilience         | Polly via Microsoft.Extensions.Http.Resilience | Yes                               | None            |
| Custom instrumentation  | Manual Activity/Meter creation                 | Not deeply covered                | **Minor gap**   |
| AI/LLM agent tracing    | NOT built-in                                   | NOT covered                       | **Gap for DWS** |
| MCP tool call tracing   | NOT built-in                                   | NOT covered                       | **Gap for DWS** |
| Token/cost tracking     | NOT built-in                                   | NOT covered                       | **Gap for DWS** |
| EU AI Act audit logging | NOT built-in                                   | NOT covered                       | **Gap for DWS** |

## 5. Relevance to DWS IQ 6

### Current DWS observability state (from internal assessment)

- Observability maturity: Level 1/5 (BASIC)
- Logging: Basic (not structured)
- Tracing: None
- Metrics: None
- Agent visibility: None
- MCP tool tracing: None
- Cost tracking: None

### What dotnet-skills Aspire skill would give DWS

**If DWS adopted .NET Aspire** (hypothetical), the skill would teach AI agents the correct modern patterns for:

1. ServiceDefaults configuration (eliminating boilerplate)
2. Dashboard for development debugging
3. Health check wiring
4. Integration selection (first-party vs community)
5. Testing the distributed system

**But DWS is a TypeScript/Node.js stack**, so the .NET Aspire skill is not directly applicable for implementation. It is, however, valuable as a **reference architecture** for what good observability looks like.

### What DWS should learn from this pattern

| Aspire Pattern                        | DWS Equivalent Needed                                                                                                  |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `AddServiceDefaults()` one-call setup | A single `configureObservability()` in Express that wires OTel for all services                                        |
| OTLP exporter to dashboard            | `@opentelemetry/exporter-trace-otlp-http` + `@opentelemetry/exporter-metrics-otlp-http` to Aspire Dashboard or Grafana |
| Health check endpoints                | `/health` and `/alive` endpoints on Express (already partially exists)                                                 |
| Distributed tracing across services   | OTel context propagation between Express services, MCP servers, and agent calls                                        |
| Dashboard resource graph              | Aspire Dashboard can receive OTLP from ANY language -- run it as a Docker container                                    |
| ServiceDefaults anti-patterns         | Keep observability config separate from business logic                                                                 |

### Key insight: Aspire Dashboard is language-agnostic

The Aspire Dashboard accepts standard OTLP telemetry. DWS can use it even with the TypeScript stack:

```bash
# Run Aspire Dashboard standalone
docker run --rm -p 18888:18888 -p 4317:18889 \
  mcr.microsoft.com/dotnet/aspire-dashboard:latest

# Point Node.js OTel SDK at it
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317
```

This gives DWS structured logs, distributed traces, and metrics visualization without adopting .NET.

## 6. Other Relevant dotnet-skills for Observability

| Skill                                  | Relevance                                                |
| -------------------------------------- | -------------------------------------------------------- |
| `dotnet-profiling` (v1.0.0)            | CLI diagnostics tools (CPU, GC, allocation) -- .NET only |
| `dotnet-asynkron-profiler` (v1.0.0)    | CPU/allocation/contention profiling -- .NET only         |
| `dotnet-complexity` (v1.0.0)           | Maintainability metrics -- pattern transferable          |
| `dotnet-quality-ci` (v1.0.0)           | CI quality gates pattern -- transferable                 |
| `dotnet-code-analysis` (v1.0.1)        | SDK analyzers -- .NET only                               |
| `dotnet-microsoft-extensions` (v1.0.0) | Generic Host, DI, logging -- foundational patterns       |

## 7. Recommendations

### For .NET projects (future DWS .NET components)

1. **Install the dotnet-aspire skill:** `dotnet skills install aspire` -- it teaches AI agents the correct modern patterns
2. **Install the full observability package:** Consider `dotnet skills install package code-quality` for CI gates
3. **Use ServiceDefaults as-is:** Don't reinvent the observability bootstrap

### For DWS IQ 6 (current TypeScript stack)

1. **Adopt the Aspire Dashboard as a standalone container** -- it accepts OTLP from any language
2. **Mirror the ServiceDefaults pattern** in TypeScript:
   - Create a `configureObservability(app)` function
   - Wire `@opentelemetry/sdk-node` with OTLP exporters
   - Add health check middleware
   - Add HTTP client instrumentation
3. **Add agent-specific tracing** that Aspire doesn't cover:
   - LLM call spans (token count, model, latency)
   - MCP tool call spans
   - Agent decision path traces
   - Cost tracking metrics
4. **Bridge to Langfuse** for LLM-specific observability (eval, prompt versioning)

### For the dotnet-skills catalog itself

The catalog is a well-architected skill system. DWS could study its patterns for:

- Skill-per-directory structure (`SKILL.md` + `references/` + `agents/`)
- Upstream-watch automation for keeping skills current
- Package bundles for related skill groups
- Multi-agent routing (`dotnet-router` pattern)

## 8. Summary

| Dimension                 | dotnet-skills                   | Aspire Built-in              | DWS Gap                               |
| ------------------------- | ------------------------------- | ---------------------------- | ------------------------------------- |
| **Purpose**               | Teach AI agents modern .NET     | Runtime observability        | Need both: knowledge + implementation |
| **Observability depth**   | Patterns & anti-patterns        | Full OTLP pipeline           | DWS has neither                       |
| **Language**              | .NET only                       | .NET (dashboard is polyglot) | DWS is TypeScript                     |
| **AI agent tracing**      | Not covered                     | Not covered                  | Critical for DWS                      |
| **Production monitoring** | Warns it's dev-only             | Dev dashboard only           | Need Grafana/Prometheus/Langfuse      |
| **Catalog value**         | 83 skills, community-maintained | N/A                          | DWS could adopt the skill pattern     |

**Bottom line:** The `dotnet-skills` Aspire skill is excellent for .NET projects -- it eliminates AI agents generating outdated patterns. For DWS IQ 6, the primary takeaways are: (1) use Aspire Dashboard as a standalone OTLP receiver even for TypeScript services, (2) mirror the ServiceDefaults one-call pattern, and (3) build the AI-agent-specific tracing layer that neither Aspire nor dotnet-skills currently covers.

---

## Appendix A: Detailed Aspire Observability Patterns

### A.1 OpenTelemetry Concept Mapping (.NET to OTel)

| .NET Concept          | OpenTelemetry Concept | Purpose                          |
| --------------------- | --------------------- | -------------------------------- |
| `ActivitySource`      | Tracer                | Creates spans                    |
| `Activity`            | Span                  | Unit of work with timing         |
| `Activity.TraceId`    | Trace ID (16 bytes)   | Globally unique trace identifier |
| `Activity.SpanId`     | Span ID (8 bytes)     | Unique within trace              |
| `ActivityKind.Server` | Server span           | Incoming request                 |
| `ActivityKind.Client` | Client span           | Outgoing call                    |
| `Meter`               | Meter                 | Creates metric instruments       |
| `Counter<T>`          | Counter               | Monotonically increasing values  |
| `Histogram<T>`        | Histogram             | Distribution (P50/P90/P99)       |
| `UpDownCounter<T>`    | UpDownCounter         | Bidirectional values             |
| `Gauge<T>`            | Gauge                 | Point-in-time snapshot           |

Context propagation uses W3C `traceparent` header automatically across service boundaries.

### A.2 Custom Tracing Pattern

```csharp
private static readonly ActivitySource s_activitySource = new("MyApp.OrderProcessing");

public async Task ProcessOrderAsync(Order order)
{
    using var activity = s_activitySource.StartActivity("ProcessOrder");
    activity?.SetTag("order.id", order.Id);
    activity?.SetTag("order.total", order.Total);

    // ... business logic, calls to other services create child spans

    activity?.SetStatus(ActivityStatusCode.Ok);
}
```

Registration in ServiceDefaults:

```csharp
.WithTracing(tracing => tracing.AddSource("MyApp.OrderProcessing"))
```

### A.3 Custom Metrics Pattern

```csharp
private static readonly Meter s_meter = new("MyApp.Orders");
private static readonly Counter<long> s_ordersProcessed =
    s_meter.CreateCounter<long>("orders.processed");
private static readonly Histogram<double> s_orderDuration =
    s_meter.CreateHistogram<double>("orders.duration", "ms");

public async Task ProcessOrderAsync(Order order)
{
    var sw = Stopwatch.StartNew();
    // ... process
    s_ordersProcessed.Add(1,
        new KeyValuePair<string, object?>("order.type", order.Type));
    s_orderDuration.Record(sw.Elapsed.TotalMilliseconds);
}
```

Registration:

```csharp
.WithMetrics(metrics => metrics.AddMeter("MyApp.Orders"))
```

Dashboard displays: Counters as running total/rate, Histograms as P50/P90/P99 charts.

### A.4 Health Check Endpoints

| Endpoint  | Probe Type | What Must Pass                   |
| --------- | ---------- | -------------------------------- |
| `/health` | Readiness  | All registered health checks     |
| `/alive`  | Liveness   | Only checks tagged with `"live"` |

```csharp
builder.Services.AddHealthChecks()
    .AddCheck("self", () => HealthCheckResult.Healthy(), tags: ["live"]);

// Aspire integration packages auto-register their own checks:
// Redis: AddRedis(), PostgreSQL: AddNpgSql(), RabbitMQ: AddRabbitMQ()

app.MapHealthChecks("/health");
app.MapHealthChecks("/alive", new() {
    Predicate = check => check.Tags.Contains("live")
});
```

Returns HTTP 200 `Healthy` or HTTP 503 when degraded/unhealthy.

### A.5 Full ConfigureOpenTelemetry Implementation

```csharp
public static IHostApplicationBuilder ConfigureOpenTelemetry(
    this IHostApplicationBuilder builder)
{
    builder.Logging.AddOpenTelemetry(logging =>
    {
        logging.IncludeFormattedMessage = true;
        logging.IncludeScopes = true;
    });

    builder.Services.AddOpenTelemetry()
        .WithMetrics(metrics =>
        {
            metrics.AddAspNetCoreInstrumentation();
            metrics.AddHttpClientInstrumentation();
            metrics.AddRuntimeInstrumentation();
        })
        .WithTracing(tracing =>
        {
            tracing.AddAspNetCoreInstrumentation();
            tracing.AddHttpClientInstrumentation();
        });

    builder.AddOpenTelemetryExporters();
    return builder;
}
```

### A.6 Non-Aspire Bootstrap (~30-50 lines replaces AddServiceDefaults)

```csharp
// Program.cs -- equivalent of AddServiceDefaults() for a standalone app

builder.Logging.AddOpenTelemetry(logging =>
{
    logging.IncludeFormattedMessage = true;
    logging.IncludeScopes = true;
});

builder.Services.AddOpenTelemetry()
    .ConfigureResource(r => r.AddService("my-service"))
    .WithMetrics(metrics =>
    {
        metrics.AddAspNetCoreInstrumentation();
        metrics.AddHttpClientInstrumentation();
        metrics.AddRuntimeInstrumentation();
        metrics.AddMeter("MyApp.*"); // custom meters
    })
    .WithTracing(tracing =>
    {
        tracing.AddAspNetCoreInstrumentation();
        tracing.AddHttpClientInstrumentation();
        tracing.AddSource("MyApp.*"); // custom ActivitySources
    })
    .UseOtlpExporter(); // reads OTEL_EXPORTER_OTLP_ENDPOINT env var

builder.Services.AddHealthChecks()
    .AddCheck("self", () => HealthCheckResult.Healthy(), tags: ["live"]);

// After build:
app.MapHealthChecks("/health");
app.MapHealthChecks("/alive", new() {
    Predicate = check => check.Tags.Contains("live")
});
```

### A.7 Standalone Dashboard for Any Language

```bash
docker run --rm -it -p 18888:18888 -p 4317:18889 \
    -e DASHBOARD__FRONTEND__AUTHMODE=Unsecured \
    mcr.microsoft.com/dotnet/aspire-dashboard:latest
```

- UI at `http://localhost:18888`
- OTLP gRPC endpoint at `http://localhost:4317` (mapped from container port 18889)
- Set `OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317` on any app

### A.8 Production Backend Swap

The Aspire Dashboard is a dev tool. For production, change only the exporter -- instrumentation code stays identical:

| Backend                       | Type                |
| ----------------------------- | ------------------- |
| Grafana + Prometheus + Tempo  | Open source         |
| Azure Monitor / App Insights  | Azure native        |
| Datadog, New Relic, Honeycomb | Commercial          |
| Sentry                        | Error + performance |

### A.9 Additional Instrumentation Packages

| Package                                             | Adds Tracing For  |
| --------------------------------------------------- | ----------------- |
| `OpenTelemetry.Instrumentation.GrpcNetClient`       | gRPC client calls |
| `OpenTelemetry.Instrumentation.SqlClient`           | SQL queries       |
| `OpenTelemetry.Instrumentation.EntityFrameworkCore` | EF Core queries   |
| `OpenTelemetry.Instrumentation.StackExchangeRedis`  | Redis operations  |

## Sources

- Microsoft Learn: Aspire Telemetry, Service Defaults, Health Checks, Dashboard
- dotnet/aspire GitHub repository
- managedcode/dotnet-skills GitHub repository (skills/dotnet-aspire)
- DWS IQ 6 Observability Assessment (internal, January 2026)
- DWS Aspire Sensor Management Plan (internal, March 2026)
