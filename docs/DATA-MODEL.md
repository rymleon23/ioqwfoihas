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
- `key` (AIM2)
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
- `marketing_content` (`id`, `workspace_id`, `source_type` ai/manual/import, `source_id`, `title`, `summary`, `body`, `embedding vector(1536)`, `metadata`, `created_at`, `updated_at`)
- `marketing_content_chunk` (`id`, `content_id`, `sequence_index`, `text`, `embedding vector(1536)`, `token_count`)

### Social Scheduling
- `social_account` (`id`, `team_id`, `platform`, `display_name`, `secret_ref`)
- `scheduled_post` (`id`, `task_id`, `account_id`, `caption`, `media`, `scheduled_at`, `status` queued/posting/done/error)
- `post_result` (`id`, `scheduled_id`, `provider_post_id`, `status`, `error`, `created_at`)

### Drive Hub & RAG
- `drive_folder` (`id`, `workspace_id`, `external_id`, `name`, `parent_id`, `path`)
- `drive_file` (`id`, `folder_id`, `workspace_id`, `external_id`, `name`, `mime_type`, `size`, `version`, `synced_at`, `embedding vector(1536)`, `metadata`)
- `task_attachment` (`id`, `task_id`, `type` drive/upload/link, `drive_file_id`, `url`, `metadata`)

### Custom Field (roadmap)
- `custom_field_definition` (`id`, `workspace_id`, `entity_type`, `key`, `label`, `description`, `field_type` text/number/date/single_select/multi_select/boolean/reference, `config_json`, `is_required`, `is_archived`, `created_by`, `created_at`)
- `custom_field_option` (`id`, `field_id`, `value`, `label`, `color`, `order_index`, `is_archived`)
- `custom_field_value` (`id`, `workspace_id`, `entity_type`, `entity_id`, `field_id`, `value_text`, `value_number`, `value_boolean`, `value_date`, `value_json`, `created_at`, `updated_at`)

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
- `workspace_id` là cột bắt buộc với RLS; ngoại lệ (như bảng hệ thống) phải giải thích rõ trong tài liệu.

## Mở rộng chi tiết
### Custom field
- `custom_field_definition` lưu metadata và cấu hình render/validation cho từng thực thể (`entity_type` = task/project/deal/...); `config_json` chứa các thông số như placeholder, min/max, regex, mapping ID khi field là reference.
- `custom_field_option` cho các trường select; option thuộc về một workspace để reuse giữa các thực thể.
- `custom_field_value` lưu giá trị thực, luôn chứa `workspace_id` và `entity_type` để enforce RLS và segment dữ liệu khi join.
- Index chính: unique partial index `(entity_type, entity_id, field_id)` trên bảng value để ngăn trùng; trigger đồng bộ `updated_at`.

### Multi-tenant & RLS
- `workspace_id` xuất hiện ở mọi bảng dữ liệu nghiệp vụ (task, project, drive_file, custom_field_value, marketing_content, v.v.) trừ bảng thuần hệ thống (`role_permission`).
- RLS mặc định: `policy select on <table> using (workspace_id = auth.workspace_id())`. Viết helper function `auth.workspace_id()` để đọc claim JWT.
- Bảng join (ví dụ `membership`, `task_relation`) dùng `team_id` hoặc `task_id` để truy ngược `workspace_id`; tạo view materialized (nếu cần) để tối ưu filter.
- Quy tắc migration: schema check `NOT NULL` trên `workspace_id`, thiết lập `default auth.workspace_id()` với row-level security.

### Vector index (pgvector)
- Sử dụng extension `pgvector`; đảm bảo migration chạy `create extension if not exists vector`.
- `drive_file.embedding` và `marketing_content.embedding` / `marketing_content_chunk.embedding` dùng kiểu `vector(1536)` (OpenAI text-embedding-3-large). Chuẩn hóa tất cả vector về cùng dimension.
- Tạo index IVF Flat: `create index drive_file_embedding_ivfflat on drive_file using ivfflat (embedding vector_cosine_ops) with (lists = 100);` (tối ưu sau benchmark).
- Với nội dung dài, chunk hóa vào `marketing_content_chunk` để tìm kiếm semantically; mỗi chunk chứa metadata (token_count, source) để reconstruct kết quả.
- Đồng bộ embeddings qua job nền: khi file/campaign cập nhật thì queue worker gọi service ML cập nhật embedding và refresh index.
