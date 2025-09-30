# Glossary

Danh sách thuật ngữ chuẩn hoá giữa UI (tiếng Việt), code/schema và mô tả ngắn. Dùng làm nguồn duy nhất cho naming trong UI, docs và code.

| Linear | aim (UI) | Code/Schema | Ghi chú |
|--------|----------|-------------|---------|
| Initiative | Strategic | `strategic` | Nhóm project dài hạn |
| Issue | Task | `task` | Đơn vị công việc |
| Cycle | Phase | `phase` | Iteration/sprint |
| Triage | Triage | `triage` / `inbox` | Hộp phân loại |
| Project | Project | `project` | Giữ nguyên |
| Milestone | Mốc | `milestone` | Theo project |
| Status | Trạng thái | `state` / `workflow_state` | Category: unstarted/started/completed/cancelled |
| Workflow | Quy trình | `workflow` | Theo team |
| Label | Nhãn | `label` | Taxonomy |
| Estimate | Ước lượng | `estimate` / `points` | Số |
| Priority | Ưu tiên | `priority` | 0–4 |
| Assignee | Người phụ trách | `assignee` | member_id |
| Reporter | Người tạo | `created_by` | member_id |
| Due date | Hạn | `due_date` | ISO timestamp |
| Sub-issue | Subtask | relation:`subtask` | Quan hệ cha-con |
| Duplicate | Trùng | relation:`duplicate` | Merge |
| Blocks | Chặn | relation:`blocks` | Dependency |
| View | Chế độ xem | `saved_view` | Board/List/Timeline |
| Inbox | Hộp vào | `inbox_item` | Nguồn vào |
| AI Agent | Tác vụ AI | `ai_generation` | content-creator, finance… |
| Social Account | Tài khoản MXH | `social_account` | Facebook/Instagram/Zalo |
| Scheduled Post | Lịch đăng | `scheduled_post` | Queue |
| Post Result | KQ đăng | `post_result` | postId/status |
| Drive File | Tệp Drive | `drive_file` | RAG |
| Template | Mẫu | `template` | Brief/Caption |
| Customer | Khách hàng | `customer` | vNext |
| Deal | Cơ hội | `deal` | vNext |
| Notification | Thông báo | `notification` | In-app/email |
| Activity log | Lịch sử | `activity_log` | Audit |
| Saved View | Chế độ lưu | `saved_view` | Private/team/workspace |
| Analytics | Phân tích | `analytics_event` | Tracking |

## Nguyên tắc sử dụng
1. UI tiếng Việt tuân theo cột `aim (UI)`.
2. Code, schema, API sử dụng cột `Code/Schema` (snake_case trong DB, camelCase trong TS).
3. Cập nhật glossary khi bổ sung module mới, đồng thời chỉnh `.mdc` tương ứng.
4. Thiết lập lint/regex cấm dùng thuật ngữ trái quy ước (vd. "issue" trong UI).
