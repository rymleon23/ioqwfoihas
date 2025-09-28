# Mô hình dữ liệu

Schema thiết kế cho PostgreSQL/Supabase, sử dụng UUID v4 làm khóa chính, timestamp ISO-8601 (UTC) và tuân thủ naming snake_case (DB) / camelCase (code). RLS bật cho mọi bảng liên quan workspace/team.

## Thực thể chính
### Workspace
- `id` UUID
- `name`
- `slug`

### Team
- `id` UUID
- `workspace_id` FK → workspace
- `name`
- `key` (AIM2…)
- `workflow_id` FK → workflow
- `default_phase_id` FK → phase

### Member & Membership
- `member` (`id`, `workspace_id`, `email`, `display_name`, `avatar_url`, `status` active/invited/disabled)
- `membership` (`id`, `member_id`, `team_id`, `role` owner/admin/member/guest)
- `role_permission` (`role`, `resource`, `action` create/read/update/delete/manage)

### Workflow & State
- `workflow` (`id`, `team_id`, `states` array {name, category unstarted|started|completed|cancelled, order})

### Strategic / Project / Phase
- `strategic` (`id`, `workspace_id`, `name`, `description`, `status`, `owner_id`)
- `project` (`id`, `team_id`, `strategic_id`, `name`, `description`, `milestones[]`, `health`)
- `phase` (`id`, `team_id`, `name`, `start_date`, `end_date`, `sequence_index`, `status`, `rollover_strategy`)

### Task & liên kết
- `task` (`id`, `team_id`, `project_id`, `strategic_id`, `phase_id`, `title`, `description`, `state_id`, `assignee_id`, `estimate`, `priority`, `due_date`, timestamps, `parent_id`, `labels[]`)
- `task_relation` (`id`, `task_id`, `related_task_id`, `type` subtask/duplicate/blocks/blocked_by/relates_to)
- `triage_event` (`id`, `task_id`, `team_id`, `action`, `performed_by`, `note`, `created_at`)
- `task_comment` (`id`, `task_id`, `author_id`, `body`, `attachments`, `created_at`)

### Templates & Saved Views
- `template` (`id`, `team_id`, `type` task/project, `payload`, `is_default`)
- `label` (`id`, `team_id`, `name`, `color`, `is_required`)
- `saved_view` (`id`, `owner_id`, `scope` private/team/workspace, `filters`, `layout`, `name`)

### Notifications & Activity
- `notification` (`id`, `member_id`, `type`, `payload`, `read_at`)
- `activity_log` (`id`, `workspace_id`, `entity_type`, `entity_id`, `action`, `metadata`, `created_at`)

### AI & Content
- `ai_generation` (`id`, `task_id`, `agent`, `prompt`, `sources`, `output_markdown`, `model`, `latency_ms`, `created_by`, `created_at`)
- `ai_agent_profile` (`id`, `workspace_id`, `name`, `description`, `prompt`, `default_sources`)

### Social Scheduling
- `social_account` (`id`, `team_id`, `platform`, `display_name`, `secret_ref`)
- `scheduled_post` (`id`, `task_id`, `account_id`, `caption`, `media`, `scheduled_at`, `status` queued/posting/done/error)
- `post_result` (`id`, `scheduled_id`, `provider_post_id`, `status`, `error`, `created_at`)

### Drive Hub & RAG
- `drive_folder` (`id`, `workspace_id`, `external_id`, `name`, `parent_id`, `path`)
- `drive_file` (`id`, `folder_id`, `external_id`, `name`, `mime_type`, `size`, `version`, `synced_at`, `embedding`)
- `task_attachment` (`id`, `task_id`, `type` drive/upload/link, `drive_file_id`, `url`, `metadata`)

### Analytics
- `analytics_event` (`id`, `workspace_id`, `team_id`, `type`, `payload`, `occurred_at`)
- `metric_snapshot` (`id`, `scope`, `scope_id`, `metric`, `value`, `captured_at`)

### CRM (vNext)
- `customer` (`id`, `workspace_id`, `name`, `contact_info`, `status`)
- `deal` (`id`, `workspace_id`, `customer_id`, `project_id`, `stage`, `value`, `close_date`)

## Chuẩn hóa & dữ liệu hệ thống
- Tất cả bảng bật soft delete (`deleted_at`) khi phù hợp.
- Sự kiện audit: log trong `activity_log` cho mọi thao tác quan trọng (RBAC, workflow, scheduling).
- Policy Supabase: hàm `is_team_member(team_id)` dùng trong policy select/insert/update.

## Lưu ý mở rộng
- Custom field: bảng `custom_field_definition` & `custom_field_value` (roadmap).
- Multi-tenant: `workspace_id` luôn có trong bảng để enforce RLS.
- Vector index: cột `embedding` kiểu vector (pgvector) cho Drive & nội dung marketing.
