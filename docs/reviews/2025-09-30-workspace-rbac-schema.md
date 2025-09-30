# 2025-09-30 Workspace RBAC Schema Review

- **Attendees**: Tr?n Hoài Nam (Tech Lead), Nguy?n Minh Quân (PM), Lê Lan Anh (FE), Ph?m Minh Phúc (BE)
- **Scope**: Validate initial data model for Workspace, Team, Member, Membership and confirm RBAC naming aligns with VN marketing workflows.

## Discussion Notes
- ERD `docs/diagrams/workspace-team-membership.md` presents the pivot relationships clearly; Nam confirmed the entity list matches Linear-style expectations.
- Naming across DB/schema/glossary stays consistent (`workspace_id`, `team_id`, `membership.role`), no additional Vietnamese-localized aliases required in code.
- Suggested to include `role_permission` seed data to map Owner/Admin/Member/Guest permissions for early API prototyping.
- Highlighted need for composite unique constraint (`member_id`, `team_id`) on `membership` table to pre-empt duplicates created via multiple invites.
- RLS approach (`is_team_member(team_id)`) acceptable; BE team to supply helper SQL snippet directly in migrations to avoid drift from documentation.

## Decisions
- Accept current schema proposal with above adjustments tracked as follow-up tasks.
- Diagram becomes canonical reference for future modules; link added in `docs/modules/teams-and-members.md`.

## Follow-up Actions
1. Draft SQL migration snippet for `role_permission` seed rows (Owner/Admin/Member/Guest).
2. Update schema documentation to note unique constraint on `membership (member_id, team_id)`.
3. Prepare sample policy function definition (`auth.is_team_member`) for inclusion in Supabase migrations.

## Checklist Status
- [x] Define tables: Workspace, Team, Member, Membership.
- [x] Model Membership with RBAC roles for each member.
- [x] Ensure naming aligns with VN marketing workflows.
- [x] Document schema with diagrams and key relationships.
- [ ] Review schema with tech lead for validation *(completed 2025-09-30; awaiting follow-up tasks above before final sign-off).

