# Circle Repo Integration

Tài liệu ánh xạ giữa repo Circle (UI mock) và hệ thống Marketing OS thực tế.

## Tình trạng hiện tại của Circle
- **Tech stack**: Next.js + shadcn/ui + Tailwind, Zustand làm store, mock-data `.ts`.
- **Trang có sẵn**: teams/[teamId], projects, inbox, cycles, task detail.
- **Data**: Toàn bộ từ `mock-data/` (issues, teams, projects, cycles…). Không có backend/API.
- **Hạn chế**: không có auth/RBAC, không có persistence, thao tác triage chỉ `console.log`.

## Khoảng cách tính năng
| Hạng mục | Circle hiện có | Cần bổ sung |
|----------|----------------|-------------|
| Auth/RBAC | Chưa có | Supabase Auth, Membership, policy |
| Data layer | Mock in-memory | Supabase tables + API routes |
| Triage | UI hiển thị danh sách | Hành động Accept/Decline/Merge/Snooze thật, triage_time |
| AI | Không có | AI Studio panel, lưu `ai_generation` |
| Social Scheduler | Không có | OAuth, queue, cron, webhook |
| Drive/RAG | Không có | Sync service, search, attachment |
| Analysis | Không có | Dashboard, ETL |

## Lộ trình tích hợp
1. **Data & Auth**
   - Thiết lập Supabase schema, RLS, Auth.
   - Refactor Zustand store → TanStack Query (fetch Supabase).
   - Tạo API route Next.js (tasks, triage, ai, schedule).
2. **Linear core**
   - Kết nối Inbox với API triage.
   - Bổ sung workflow/phase logic.
   - Projects/Strategic summary.
3. **Marketing layer**
   - Embed AI Studio vào task detail.
   - Social scheduler UI + API.
   - Drive Hub file picker & RAG.
4. **Analysis & QA**
   - Dashboard productivity & marketing.
   - Test automation, monitoring.

## Mapping component ↔ API/DB
| Component (Circle) | API/DB mới |
|--------------------|------------|
| `stores/issues.ts` | `GET /api/tasks`, Supabase `task` table |
| `stores/projects.ts` | `GET /api/projects`, `project` table |
| `stores/teams.ts` | `GET /api/teams`, `team` + `membership` |
| `app/inbox/page.tsx` | `GET/POST /api/triage`, `triage_event` |
| `app/tasks/[id]/page.tsx` | `GET /api/tasks/{id}`, `task`, `task_comment`, `ai_generation` |
| `app/settings/social` | `GET/POST /api/social/accounts`, `social_account` |
| `app/analysis` (mới) | `GET /api/analysis`, `metric_snapshot` |

## Checklist chuyển đổi
- [ ] Xóa import mock-data, thay bằng hook query.
- [ ] Bao bọc component bằng SessionProvider (Supabase).
- [ ] Thêm guard RBAC mọi mutation.
- [ ] Seed mock vào Supabase để giữ trải nghiệm demo.
- [ ] Update docs & rule khi component đổi contract.
