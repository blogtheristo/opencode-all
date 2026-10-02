#:sdk Aspire.AppHost.Sdk@13.0.0
#:package Aspire.Hosting.PostgreSQL@13.0.0

// DWS 6 — Aspire AppHost (dev/stage/prod environment topology)
//
// SCOPE (see aspire/README.md for the full explanation):
// - dev:            spins up a LOCAL Postgres container seeded from supabase/migrations/*.sql,
//                    for schema exploration and migration dry-runs. It does NOT replace Supabase
//                    as the backend's datastore — src/ talks to Supabase via the supabase-js client,
//                    not a raw Postgres connection string, and that is out of scope for this change.
// - stage / prod:   Aspire does not provision or deploy anything here. GCP Cloud Run + Supabase EU
//                    remain the deployment targets documented in docs/CLOUD_ENVIRONMENTS.md. For
//                    these environments the AppHost only wires read-only parameters so the Aspire
//                    dashboard can show which endpoints "stage"/"prod" point at during local
//                    orchestration. Never used to apply migrations — see RED zone in CLAUDE.md.
//
// Run: aspire run   (from the aspire/ directory)
// Environment select: set DWS_ENV=dev|stage|prod before running (defaults to dev).

var builder = DistributedApplication.CreateBuilder(args);

var dwsEnv = builder.Configuration["DWS_ENV"] ?? "dev";

if (dwsEnv == "dev")
{
    var postgres = builder.AddPostgres("dws-postgres")
        .WithDataVolume("dws-dev-pgdata")
        .WithPgAdmin();

    var devDb = postgres.AddDatabase("dws_dev");

    // Existing Node/Express backend (src/app.ts), launched for local dev convenience.
    // Still talks to Supabase via SUPABASE_URL/SUPABASE_SERVICE_KEY from the repo-root .env —
    // NOT to the dws-postgres container above (see scope note at top of file).
    builder.AddExecutable("dws-backend", "npm", "..", "run", "dev")
        .WithEnvironment("PORT", "8080")
        .WithEnvironment("NODE_ENV", "development")
        .WithHttpEndpoint(port: 8080, targetPort: 8080, name: "http")
        .WaitFor(devDb);
}
else
{
    // stage / prod: reference-only parameters, nothing provisioned or deployed by Aspire.
    // Values come from the environment (matches docs/CLOUD_ENVIRONMENTS.md §4.5 secret inventory);
    // left unset here on purpose — populate via `aspire run --DWS_ENV=stage` env vars locally,
    // never by hardcoding secrets into this file.
    var supabaseUrl = builder.AddParameter("supabase-url", secret: false);
    var backendUrl = builder.AddParameter("backend-url", secret: false);

    builder.AddContainer("dws-env-reference", "alpine", "latest")
        .WithEnvironment("DWS_ENV", dwsEnv)
        .WithEnvironment("SUPABASE_URL", supabaseUrl)
        .WithEnvironment("BACKEND_URL", backendUrl)
        .WithEntrypoint("sleep")
        .WithArgs("infinity");
}

builder.Build().Run();
