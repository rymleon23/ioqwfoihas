# Implementation Guide (Cursor + Supabase + Vercel)

Hướng dẫn triển khai nhanh dựa trên vertical slice, tận dụng repo Circle hiện có.

## Tech stack đề xuất
- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS + shadcn/ui, Zustand (UI state), TanStack Query (server state).
- **Backend**: Supabase (Postgres + Auth + RLS + Storage + pgvector), Edge Functions khi cần webhook/cron.
- **AI**: OpenAI GPT-4o (content), Google Gemini (ý tưởng hình ảnh). Lưu prompt/response/citation.
- **Hosting**: Vercel (Edge runtime), Vercel Cron cho scheduler tick.
- **Search/RAG**: pgvector (giai đoạn sau).

## Bước 0 – Chuẩn bị
a. Clone repo Circle, tạo branch mới.
b. Commit toàn bộ tài liệu trong `docs/` và rule `.cursor/rules/`.
c. Mở Cursor, bật project rules, attach docs khi sinh code.

## Bước 1 – Supabase schema & Auth
1. Tạo dự án Supabase, bật extension `pgvector`.
2. Chạy script schema (tham chiếu `docs/DATA-MODEL.md`). Bao gồm bảng: workspace, team, membership, workflow, task, relation, triage_event, task_comment, template, label, saved_view, notification, activity_log, ai_generation, social_account, scheduled_post, post_result, drive_folder/file, analytics_event, metric_snapshot.
3. Bật RLS cho mọi bảng, tạo hàm `is_team_member(team_id uuid)` và policy select/insert/update.
4. Supabase Auth: magic link + Google OAuth. Trigger tạo record `member` khi user đăng ký.

## Bước 2 – Vercel & environment
1. Tạo project Vercel, kết nối repo.
2. Cấu hình biến môi trường:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE`
   - `OPENAI_API_KEY`
   - `GEMINI_API_KEY`
   - `APP_URL`
3. Thiết lập Vercel Cron `/api/scheduler/tick` (1–5 phút) cho Social Scheduler.

## Bước 3 – Vertical slice đầu tiên
1. **Auth & Shell**
   - Trang `/sign-in` dùng Supabase Auth UI hoặc custom form.
   - Middleware bảo vệ route cần đăng nhập.
   - Menu user (tên, avatar, sign-out).
2. **Task list & detail**
   - Refactor Zustand store → TanStack Query fetch từ Supabase.
   - API routes `/api/tasks`, `/api/triage`, `/api/ai/generate` dùng service role.
   - Task detail panel với tab Details, Comments, AI Studio.
3. **AI Panel**
   - Gọi Edge Route `/api/ai/generate`, lưu vào `ai_generation` + comment.
   - Cho phép Submit to Task (update content field/comment thread).
4. **Triage MVP**
   - Trang `/inbox`: list task state triage, action Accept/Decline/Assign/Snooze.
   - Ghi `triage_event`, cập nhật state/assignee.

## Bước 4 – Migration mock → real data
- Viết script seed mock-data từ repo Circle vào Supabase (chạy 1 lần).
- Tạo rule Cursor `replace-mock-with-api.mdc` để tự động refactor import mock → call API.
- Giữ Zustand cho UI state (filter, panel toggle), mọi dữ liệu server qua query.

## Bước 5 – Linear core hoàn thiện
- Phases: tạo chu kỳ, carry-over, burndown/velocity.
- Projects/Strategic: trang tổng quan, milestone, health.
- Notifications/Activity: in-app/email, log audit.
- Templates/Labels: CRUD + enforce required.
- Search: Supabase full text/Elasticsearch (roadmap).

## Bước 6 – Marketing layer
- AI Studio nâng cao (preset agent, history, feedback).
- Social Scheduler: OAuth flow, queue, retry/backoff, webhook update.
- Drive Hub: sync Drive/Storage, index, search.
- Analysis Dashboard: ETL pipeline, chart Productivity & Marketing.

## Checker & Automation
- CI: GitHub Actions lint/test/build/deploy.
- Testing: Jest/RTL (UI), Vitest (API route), Playwright/Cypress (E2E: login → task → AI generate → schedule post).
- Observability: logging chuẩn, metrics (Prometheus) khi deploy production.

## Circle repo integration
- Tài liệu `docs/CIRCLE-INTEGRATION.md` (tạo mới) mô tả mapping UI hiện tại ↔ API/DB.
- Phân nhánh cho từng module/feature, mở PR nhỏ, attach docs tương ứng.
- Sau mỗi sprint, cập nhật rule `.mdc` nếu có thay đổi behavior/naming.

## Checklist trước khi release P1
- Login + RBAC hoạt động.
- Task list/detail đọc dữ liệu thực, không còn mock.
- Inbox thao tác chuẩn, log triage.
- AI Panel generate & submit hoạt động.
- Deploy staging trên Vercel, kiểm tra cross-team.
