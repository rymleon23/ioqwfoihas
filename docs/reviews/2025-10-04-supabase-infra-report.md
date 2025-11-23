# Report: Supabase Schema & Infrastructure Baseline (2025-10-04)

## Scope

- Supabase schema migration authored ("20251002090000_init.sql"), covering all entities from `docs/DATA-MODEL.md` plus helper functions, triggers, and RLS policies.
- Seeder script (`scripts/seed-supabase.ts`) and tooling updates to move existing `mock-data/` into a demo workspace, including new package dependencies and CLI entrypoint `pnpm seed:supabase`.
- Infrastructure scaffolding delivered: cron stub at `app/api/scheduler/tick/route.ts`, `vercel.json` configuration, and GitHub Actions workflow (`.github/workflows/ci.yml`).
- Documentation and plan alignment updates (`docs/IMPLEMENTATION-GUIDE.md`, `docs/plans/LINEAR-MARKETING-OS-PLAN.md`).

## Deliverables

| Artifact                  | Location                                                                 | Notes                                                                                |
| ------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| Supabase migration bundle | `supabase/migrations/20251002090000_init.sql`                            | 39k lines covering tables, extensions, helper functions, triggers, and RLS policies. |
| Supabase local config     | `supabase/config.toml`                                                   | Defines local ports, auth secrets, and auto-migrate behaviour.                       |
| Seed script               | `scripts/seed-supabase.ts`                                               | Loads mock dataset into Supabase via service-role key.                               |
| Package tooling           | `package.json`                                                           | Adds `pnpm seed:supabase` script, `@supabase/supabase-js`, `dotenv`, `tsx`.          |
| Cron handler stub         | `app/api/scheduler/tick/route.ts`                                        | Responds to GET/POST for Vercel cron (5 min).                                        |
| Vercel project config     | `vercel.json`                                                            | Enables cron and declares `main`/`staging` deployment branches.                      |
| CI pipeline               | `.github/workflows/ci.yml`                                               | Runs lint, typecheck, test, build, and `supabase db lint`.                           |
| Documentation updates     | `docs/IMPLEMENTATION-GUIDE.md`, `docs/plans/LINEAR-MARKETING-OS-PLAN.md` | Adds cron/seed instructions and logs progress of plan sections 3�4.                  |

## Outstanding

1. Provision actual Supabase project, enable pgvector, and create storage buckets (plan item left "Pending").
2. Link repository to Vercel, set env vars, and activate cron (config and stub are ready).
3. Run provisioning commands locally:
   - `pnpm install`
   - `pnpm lint && pnpm typecheck && pnpm test && pnpm build`
   - `pnpm seed:supabase` (needs `SUPABASE_URL` & `SUPABASE_SERVICE_ROLE`).
4. Plan future observability tooling (Sentry integration, metrics exporter) per backlog note.

## Validation

- All generated SQL aligns with `docs/DATA-MODEL.md` entities and schema constraints.
- Seeder exercises `mock-data/` relationships (teams, phases, tasks, relations) and ensures idempotence by removing existing workspace slug before import.
- CI workflow adheres to `.nvmrc` (Node 18.20.x) and pnpm v9; includes Supabase CLI lint to guard migrations.

## Risks & Follow-up

- Supabase project provisioning requires manual credentials; document secrets in `.env.local`/Vercel once created.
- Cron handler is currently a placeholder; future integration must plug scheduler orchestration and telemetry hook referenced in `docs/IMPLEMENTATION-GUIDE.md`.
- Seeder assumes mock dataset integrity; discrepancies should be resolved before replacing UI mocks with Supabase queries in P1 slices.
