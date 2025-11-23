# Bộ rule .cursor

Danh sách rule file dùng cho Cursor/Codex để dẫn hướng sinh code, đảm bảo đồng bộ naming và chuẩn dự án.

| File                        | Mục đích                                                        |
| --------------------------- | --------------------------------------------------------------- |
| `base.mdc`                  | Quy ước codebase chung (TypeScript, Next.js, testing, linting). |
| `linear-mapping.mdc`        | Mapping thuật ngữ Linear ↔ Aim, banned terms, chuẩn đặt tên.   |
| `team-member-rbac.mdc`      | Quy tắc RBAC, matrix quyền, guard API/UI.                       |
| `triage-inbox.mdc`          | Contract inbox, action, rule engine, logging.                   |
| `workflow-status.mdc`       | Workflow state, transition guard, history logging.              |
| `phases-phases.mdc`         | Chu kỳ, carry-over, burndown, velocity.                         |
| `views-filters.mdc`         | Lưu view, filter chain, điều kiện chia sẻ.                      |
| `notifications.mdc`         | Notification payload, channel, throttle.                        |
| `ai-studio.mdc`             | Contract AI panel, API generate/submit, logging.                |
| `social-scheduler.mdc`      | OAuth, scheduler, webhook, retry/backoff.                       |
| `drive-rag.mdc`             | Indexer, RAG source, attachment policy.                         |
| `supabase-auth.mdc`         | Supabase Auth, session helpers, RLS guard implementation.       |
| `replace-mock-with-api.mdc` | Loại bỏ mock Circle, chuyển sang Supabase API + TanStack Query. |
| `analysis.mdc`              | KPI definition, ETL, dashboard contract.                        |
| `999-mdc-format.mdc`        | Template chuẩn viết rule mới.                                   |

Các rule này bọc toàn bộ feature chính. Khi viết code trong Cursor, luôn attach rule + docs liên quan (PRD, DATA-MODEL, module tương ứng) để AI hiểu ngữ cảnh và tuân thủ naming/permission.
