# Linear-style Marketing OS Implementation Plan

## 0. Plan Validation Snapshot
- Reviewed updated docs (`docs/PRD.md`, `ARCHITECTURE.md`, `DATA-MODEL.md`, `IMPLEMENTATION-GUIDE.md`, modules/*) and archive/gpt-gen-prd.md; requirements are consistent with the original high-level roadmap but now include richer rule attachments, ai_agent_profile schema, and detailed module acceptance criteria.
- Original staged plan remains viable; this document refines it with explicit milestones, hand-offs, and dependencies drawn from the refreshed documentation set.
- Use this plan as the single source of truth for delivery sequencing; link each Linear epic to the matching section ID (e.g. P1.2 Triage Inbox) and attach the relevant docs/modules when executing.

## 1. Foundation & Knowledge Management
- **Docs ingestion**: Sync local workspace, read `docs/README.md` entry tree, keep Cursor attachments (`PRD.md`, `GLOSSARY.md`, module-specific specs, `.cursor/rules`).
- **Glossary enforcement**: Complete `docs/GLOSSARY.md`; add rule updates in `linear-mapping.mdc` to prevent naming drift between UI, DB, and code.
- **Repo audit**: Map Circle repo directories (`app/`, `components/`, `store/`, `mock-data/`, `lib/`) to planned features; flag files that still depend on mocks for later replacement.
- **Branch strategy**: Adopt `main` (production), `staging` (pre-release), feature branches per module. Enable Conventional Commits for traceability.

## 2. Environment & Tooling Readiness
- **Local prerequisites**: Install Node 18+, pnpm, Supabase CLI, Docker (if using Supabase locally). Configure `.nvmrc` if needed.
- **Secrets management**: Create `.env.local` with Supabase keys, AI provider keys, `APP_URL`. For CI, store secrets in Vercel and GitHub Actions.
- **Developer automation**: Wire Husky + lint-staged, Prettier, ESLint with the repo configs. Add scripts for `pnpm supabase:start`, `pnpm lint`, `pnpm test`, `pnpm typecheck`.

## 3. Supabase & Data Layer Initialization
- **Project provisioning**: Create Supabase project, enable `pgvector`, configure storage buckets for drive hub.
- **Schema deployment**: Translate `docs/DATA-MODEL.md` into SQL migrations (`supabase/migrations`). Ensure tables: workspace, team, membership, workflow, task, relation, triage_event, task_comment, template, label, saved_view, notification, activity_log, ai_agent_profile, ai_generation, social_account, scheduled_post, post_result, drive_folder, drive_file, task_attachment, analytics_event, metric_snapshot, customer, deal.
- **RLS & helpers**: Implement `is_team_member(team_id)` helper plus per-table policies (select/insert/update/delete). Add service role bypass where required.
- **Seed & mock migration**: Build seed scripts to import existing `mock-data/` into Supabase for local testing; provide CLI command (`pnpm seed:supabase`).

## 4. Infrastructure & DevOps Baseline
- **Vercel linkage**: Connect repository to Vercel, set environment variables, configure staging preview from `staging` branch.
- **Cron scheduling**: Register Vercel cron for `/api/scheduler/tick` (5 min interval) with placeholder handler.
- **CI/CD**: Author GitHub Actions workflow (lint, test, build, deploy). Include Supabase migration check (`supabase db diff`) and Playwright placeholder.
- **Observability groundwork**: Select logging pattern (structured JSON), plan metrics export (Supabase + Vercel). Create backlog item for integrating Sentry or similar.

## 5. Core Platform Slice (P1)
### P1.1 Auth & Shell
- Implement `/sign-in` using Supabase Auth (magic link + Google). Store session via Supabase client, subscribe to `onAuthStateChange`.
- Build layout shell: sidebar navigation, workspace/team switcher, command palette placeholder, responsive breakpoints.
- Add middleware to guard authenticated routes; redirect unauthenticated users to `/sign-in`.

### P1.2 Workspace, Team, Member RBAC
- Expose TanStack Query hooks (`useWorkspace`, `useTeams`, `useMembers`).
- Implement helper `getCurrentMember()` reading from `member` table, caching per session.
- Render RBAC-aware UI (hide protected actions). Ensure policies align with `role_permission` definitions.

### P1.3 Task List & Detail Vertical Slice
- Replace mock imports with Supabase queries (`useQuery` for list/detail, `useMutation` for create/update).
- Build task detail panel with tabs (Details, Activity, Comments, AI Panel placeholder).
- Provide basic filters (team, workflow state) stored in Zustand for UI state only.

### P1.4 Triage Inbox MVP
- Implement `/inbox` route pulling tasks with triage state. Actions: Accept, Decline, Assign, Snooze; log into `triage_event`.
- Add SLA timers (since-created time badge) and rule engine stub for auto-tagging.
- Connect Accept flow to move task into first workflow state and optionally assign default phase.

### P1.5 Delivery gates
- Ensure CI passes, deploy to staging, run smoke tests (login, load tasks, triage flow).

## 6. Core Enhancements (P2)
### P2.1 Workflow & Phases
- CRUD for `workflow` states per team (drag to reorder, enforce unique names).
- Phase management: create/edit phases, carry-over automation, assign tasks to phase, compute velocity/burndown.
- Visualize phase timeline with analytics (TanStack Query + charts).

### P2.2 Projects & Strategic Alignment
- Pages `/projects`, `/strategic` showing health, milestones, linked tasks.
- Implement milestone model per `project.milestones[]`; allow linking tasks to milestones.
- Add summary widgets (progress %, risk flags) with cached TanStack Query selectors.

### P2.3 Notifications & Activity
- Implement `notification` fetch + toast center (in-app). Support @mention detection in comments.
- Log actions to `activity_log`; expose timeline inside task detail.
- Provide email digest stub (queue later).

### P2.4 Templates, Labels, Saved Views
- CRUD modals for templates & labels; enforce required labels on task creation.
- Saved View system (private/team/workspace) storing filters/layout; allow quick switcher between list/board/timeline.

## 7. Marketing Layer Foundations (P3)
### P3.1 AI Studio v1
- Finalize AI Panel: agent selector (reads `ai_agent_profile`), source selector (workspace/team/project/drive).
- Edge route `/api/ai/generate` invoking OpenAI/Gemini, persisting results to `ai_generation` and comment thread.
- Add "Submit to Task" to patch task description or append comment.
- Implement latency & usage logging to `analytics_event`.

### P3.2 Social Scheduler v1
- OAuth flows for Facebook/Instagram/Zalo (store token references in `social_account.secret_ref`).
- Scheduler modal triggered when task state set to Ready to Post; capture caption/media/time, save to `scheduled_post`.
- Cron handler reads due posts, calls mocked provider API, updates `post_result`, handles retries/backoff.
- Task updates on success/failure plus notification.

### P3.3 Drive Hub & RAG groundwork
- Integrate Supabase Storage (initial) for uploads; plan Google Drive sync in background worker.
- Build `drive_folder`/`drive_file` CRUD and indexing job writing embeddings via pgvector.
- Allow attaching files to tasks and selecting them as RAG sources in AI Panel.

### P3.4 Analysis Dashboard v0
- Page `/analysis` with tabs Productivity (lead/cycle time, triage SLA, throughput) and Marketing (posts scheduled/published).
- Backfill metrics into `metric_snapshot`; build TanStack Query hooks for charts (Recharts or similar).

## 8. Extended Capabilities (P4+)
- **AI Studio Advanced**: feedback loops, agent presets, prompt versioning, guardrails.
- **Social Integrations**: replace mocks with real API calls, webhook processing for post status.
- **Drive Integrations**: Google Drive/Dropbox connectors, conflict resolution, sharing permissions sync.
- **Analytics**: deeper marketing KPIs (reach, CTR) once provider data available, configurable dashboards.
- **CRM Module**: implement customer/deal schema, Kanban pipeline UI, link deals back to projects/tasks.
- **Custom Fields & Public API**: add custom field definitions, GraphQL/REST public endpoints, rate limiting.

## 9. Quality, Testing, and Observability
- **Unit & integration tests**: Jest + React Testing Library for components, Vitest for API routes/services.
- **E2E**: Playwright scenarios (login, create task, triage, AI submit, schedule post).
- **Static analysis**: TypeScript strict mode, ESLint, Prettier, `pnpm lint:rules` for custom checks.
- **Performance budgets**: track bundle size, query latency; add automated checks in CI.
- **Monitoring**: instrument API routes with structured logs, plan future adoption of Sentry and Supabase logs streaming.

## 10. Release & Operations
- **Environment promotion**: follow `feature -> staging -> main` with approvals, run migrations via Supabase CLI.
- **Deployment checklist**: reference `docs/DELIVERY-CHECKLIST.md` before each release (tests, migrations, env check, rollback plan).
- **Runbooks**: draft runbooks for auth outage, failed scheduler job, AI provider errors, Supabase downtime.
- **Support cadence**: weekly triage of metrics dashboards, monthly review of rule `.mdc` files, quarterly data archive.

## 11. Linear Project Mapping
- Create epics matching sections (e.g., Epic "P1 Core Shell" -> Tasks P1.1-P1.4). Include acceptance criteria and link to relevant docs/modules.
- Track dependencies explicitly (e.g., Supabase schema must ship before P1.3). Use Linear phases to mirror P1-P4 timeline.
- Keep backlog groomed; enforce rule attachments when generating code through Cursor.

## 12. Next Steps
1. Share this plan with stakeholders for sign-off.
2. Spin up Supabase project and scaffold migrations (Section 3).
3. Kick off P1.1 feature branch, attach `PRD.md`, `IMPLEMENTATION-GUIDE.md`, `modules/teams-and-members.md` in Cursor.
