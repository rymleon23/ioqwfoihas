# Linear-style Marketing OS Implementation Plan

## 0. Plan Validation Snapshot

- Reviewed updated docs (`docs/PRD.md`, `ARCHITECTURE.md`, `DATA-MODEL.md`, `IMPLEMENTATION-GUIDE.md`, modules/\*) and archive/gpt-gen-prd.md; requirements are consistent with the original high-level roadmap but now include richer rule attachments, ai_agent_profile schema, and detailed module acceptance criteria.
- Original staged plan remains viable; this document refines it with explicit milestones, hand-offs, and dependencies drawn from the refreshed documentation set.
- Use this plan as the single source of truth for delivery sequencing; link each Linear epic to the matching section ID (e.g. P1.2 Triage Inbox) and attach the relevant docs/modules when executing.

## 1. Foundation & Knowledge Management

- **Docs ingestion**: [DONE] Reorganized `docs/` with `docs/README.md` as the index plus modules and rules, aligned with the workspace structure.
- **Cursor rules**: Keep project rules enabled, attach key specs when generating code, and maintain `replace-mock-with-api.mdc` for mock removal (standing guideline).
- **Circle mapping doc**: [DONE] `docs/CIRCLE-INTEGRATION.md` now explains how the Circle UI maps to Marketing OS.
- **Glossary enforcement**: [DONE] Code and UI use Task/Phase/Strategic consistently and `linear-mapping.mdc` is up to date.
- **Repo audit**: [DONE] Documented the Circle structure and flagged mock sources in `docs/CIRCLE-INTEGRATION.md`.
- **Branch strategy**: [DONE] Defined `main`/`staging` plus feature branches and enforce Conventional Commits via Husky + commitlint.

## 2. Environment & Tooling Readiness

- **Local prerequisites**: [DONE] `.nvmrc` (Node 18.20.4) with documented `nvm install`/`nvm use`, and pnpm as the default package manager.
- **Secrets management**: [DONE] `.env.example` lists Supabase/AI keys and `APP_URL`; docs cover copying `.env.local` and storing secrets for CI.
- **Developer automation**: [DONE] Husky/commitlint remain enabled and scripts `pnpm typecheck`, `pnpm test`, `pnpm supabase:start` are added with documentation.

## 3. Supabase & Data Layer Initialization

- **Project provisioning**: [DONE] Created Supabase project, enabled pgvector, configured storage buckets.
- **Schema deployment**: [DONE] SQL migrations under supabase/migrations cover workspace/users/team/workflow_state/task/etc per docs/DATA-MODEL.md (Linear-like schema).
- **RLS & helpers**: [DONE] Function `get_user_workspace_id()` plus table policies added; service-role bypass baked into policies.
- **Seed & mock migration**: [DONE] pnpm seed:supabase uses Supabase service key to import mock-data/ into demo workspace.

## 4. Infrastructure & DevOps Baseline

- **Vercel linkage**: [READY] vercel.json committed; link repo + configure env vars (main & staging) in Vercel UI.
- **Cron scheduling**: [DONE] /app/api/scheduler/tick/route.ts stub + cron entry (\*/5) in vercel.json.
- **CI/CD**: [DONE] .github/workflows/ci.yml runs lint/typecheck/test/build and supabase db lint.
- **Observability groundwork**: [DONE] Implementation guide outlines JSON logging + Vercel/Supabase log streaming and Sentry backlog.

## 5. Core Platform Slice (P1)

### P1.1 Auth & Shell

- [DONE] Implement `/login` using Supabase Auth (magic link + Google). Store session via Supabase client, subscribe to `onAuthStateChange`.
- [DONE] Build layout shell: sidebar navigation, workspace/team switcher, theme toggle, responsive breakpoints.
- [DONE] Add middleware to guard authenticated routes; redirect unauthenticated users to `/login`.

### P1.2 Workspace, Team, User RBAC

- Expose TanStack Query hooks (`useWorkspace`, `useTeams`, `useUsers`, `useTeamMembers`).
- Implement helper `getCurrentUser()` reading from `users` table, caching per session.
- Ensure Supabase Auth trigger creates a `users` record on the first sign-in (via `handle_new_user` trigger).
- Render RBAC-aware UI (hide protected actions). Team-level roles stored in `team_member` junction table.

### P1.3 Task List & Detail Vertical Slice

- [DONE] Replace mock imports with Supabase queries (`useQuery` for list/detail, `useMutation` for create/update).
- [DONE] Expose API routes `/api/tasks`, `/api/triage`, and `/api/ai/generate` using Supabase service-role access for server mutations.
- [DONE] Build task detail panel with tabs (Details, Activity via `task_history`, Comments, AI Panel placeholder).
- [DONE] Provide basic filters (team, workflow_state, assignee, labels via `task_label`) stored in Zustand for UI state only.
- [DONE] Task numbering auto-increments per team (e.g., ENG-123) via `get_next_task_number()` trigger.

### P1.4 Triage Inbox MVP

- Implement `/inbox` route pulling tasks with triage state. Actions: Accept, Decline, Assign, Snooze; log into `triage_event`.
- Add SLA timers (since-created time badge) and rule engine stub for auto-tagging.
- Connect Accept flow to move task into first workflow state and optionally assign default phase.

### P1.5 Delivery gates

- Ensure CI passes, deploy to staging, run smoke tests (login, load tasks, triage flow).

## 6. Core Enhancements (P2)

### P2.1 Workflow States & Phases

- CRUD for `workflow_state` per team (drag to reorder by `position`, enforce unique names, set `type` category).
- Phase management: create/edit phases (Linear Cycles), carry-over automation, assign tasks to phase, compute velocity/burndown.
- Visualize phase timeline with analytics (TanStack Query + charts).

### P2.2 Projects & Strategic Alignment

- Pages `/projects`, `/strategic` showing health, milestones, linked tasks.
- Implement milestone model per `project.milestones[]`; allow linking tasks to milestones.
- Add summary widgets (progress %, risk flags) with cached TanStack Query selectors.

### P2.3 Notifications & Activity

- Implement `notification` fetch + toast center (in-app). Support @mention detection in comments.
- Log actions to `task_history`; expose timeline inside task detail (field changes, assignments, state transitions).
- Provide email digest stub (queue later).

### P2.4 Templates, Labels, Saved Views

- CRUD modals for templates & labels; use `task_label` junction table for many-to-many relationships.
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
- Allow attaching files to tasks (via `task_attachment`) and selecting them as RAG sources in AI Panel.

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
- **Support cadence**: weekly triage of metrics dashboards, review rule `.mdc` files after each sprint (at least monthly), quarterly data archive.

## 11. Linear Project Mapping

- Create epics matching sections (e.g., Epic "P1 Core Shell" -> Tasks P1.1-P1.4). Include acceptance criteria and link to relevant docs/modules.
- Track dependencies explicitly (e.g., Supabase schema must ship before P1.3). Use Linear phases to mirror P1-P4 timeline.
- Keep backlog groomed; enforce rule attachments when generating code through Cursor.

## 12. Next Steps

1. ~~Share this plan with stakeholders for sign-off.~~
2. ~~Spin up Supabase project and scaffold migrations (Section 3).~~
3. ~~Kick off P1.1 feature branch, attach `PRD.md`, `IMPLEMENTATION-GUIDE.md`, `modules/teams-and-members.md` in Cursor.~~
4. ~~P1.3 Task List & Detail - Implement TanStack Query hooks and task views.~~
5. **[IN PROGRESS]** P1.4 Triage Inbox MVP - Implement triage flow and SLA timers.
