# Linear-style Marketing OS – PRD

## Tầm nhìn
Chúng ta xây dựng một hệ thống quản lý công việc và sản xuất nội dung lấy cảm hứng từ Linear nhưng được bản địa hóa cho agency marketing. Sản phẩm cho phép đội ngũ lập kế hoạch, thực thi và phân tích công việc một cách mạch lạc, đồng thời tích hợp AI hỗ trợ viết nội dung, kết nối mạng xã hội, kho tài nguyên/RAG và dashboard phân tích hiệu quả. Mục tiêu là tạo ra "Marketing OS" giúp tăng tốc độ sản xuất, nâng cao chất lượng nội dung và đo lường hiệu quả trên cùng một nền tảng.

## Thuật ngữ cốt lõi
Bảng ánh xạ thuật ngữ Linear sang ngữ cảnh marketing (áp dụng cho UI, docs, copy và code). Tham chiếu chi tiết ở `docs/GLOSSARY.md`.

| Linear | Aim (UI) | Code/Schema |
|--------|----------|-------------|
| Initiative | Strategic | strategic |
| Issue | Task | task |
| Project | Project | project |
| Cycle | Phase | phase |
| Triage | Triage | triage / inbox |

## Phạm vi sản phẩm
### Lớp Linear cốt lõi
- Workspace / Teams / Members với RBAC (Owner, Admin, Member, Guest).
- Triage Inbox tiếp nhận yêu cầu từ nhiều nguồn, hỗ trợ Accept / Decline / Merge / Assign / Snooze và auto rule.
- Task, Project, Strategic, Phase (iteration) cùng quan hệ subtask, duplicate, blocks, relates.
- Views & Filters (My tasks, Active, Backlog, Custom view; board/list/timeline/swimlane).
- Notifications & Activity log, templates, labels, search, command palette, responsive layout.

### Lớp Marketing mở rộng
- AI Studio ngay trong Task Detail (Agent preset + RAG nguồn từ Workspace/Team/Project/Drive).
- Social Integrations & Scheduler (Facebook/Instagram/Zalo) với auto queue, retry và webhook result.
- Drive Hub & RAG: kết nối Drive/Storage, indexing metadata & embedding, file attachment.
- Analysis Dashboard: Productivity (velocity, lead time, triage time, throughput) và Marketing KPI (post count, reach/CTR, cadence, time-to-publish).
- Lộ trình mở rộng CRM nhẹ (customer, deal) sau giai đoạn đầu.

## Personas & Nhu cầu
- **Product Manager / Lead**: quản lý Strategic/Project, phê duyệt kết quả AI, theo dõi dashboard hiệu suất.
- **Content / Marketing Ops**: sử dụng AI để tạo nội dung, gắn tài nguyên Drive, lập lịch & tự động đăng bài.
- **Engineer**: xây dựng API, workflow engine, queue, tích hợp dịch vụ ngoài, triển khai RAG và đảm bảo bảo mật/hiệu năng.
- **Analyst**: phân tích dữ liệu marketing & productivity, xây dashboard và chia sẻ insight với team.

## Yêu cầu chức năng tổng quan
1. **Workspace, Teams & Members (RBAC)** – quản lý workspace/team/member với key duy nhất mỗi team, kiểm soát quyền truy cập.
2. **Triage Inbox** – hợp nhất nguồn vào, thao tác xử lý nhanh, auto rule, đo triage time và conversion rate.
3. **Tasks & Relations** – Task có tiêu đề, trạng thái theo workflow, assignee, labels, priority (0–4), estimate, due date, relation.
4. **Phases (Cycles)** – chu kỳ lặp 1–4 tuần, tự động carry-over, burndown chart, velocity.
5. **Projects & Strategic** – project gom task theo milestone, strategic tổng hợp project, health on-track/at-risk/off-track.
6. **Views & Filters** – view hệ thống và view lưu tùy chỉnh, chia sẻ theo private/team/workspace.
7. **Notifications & Activity** – in-app/email, @mention, watch/follow, audit log & compliance.
8. **Templates, Labels & Custom fields** – mẫu task/project, nhãn bắt buộc/tùy chọn, custom field ở phiên bản sau.
9. **Search & Import/Export** – tìm kiếm toàn cục với filter nâng cao, import/export CSV/JSON (roadmap).
10. **Command Palette & Responsive** – command palette thao tác nhanh, phím tắt desktop/mobile, WCAG 2.1 AA.
11. **AI Studio (in-task)** – agent chọn nguồn RAG, generate/review/submit, lưu lịch sử vào task comment.
12. **Social Scheduler** – kết nối tài khoản, đặt lịch, cron job, log kết quả, retry/backoff, thông báo lỗi.
13. **Drive Hub & RAG** – đồng bộ Drive/Storage, index file, tìm kiếm, đính kèm vào task và dùng làm nguồn AI.
14. **Analysis Dashboard** – productivity & marketing KPI, filter theo team/project/phase, chart + bảng.
15. **CRM nhẹ (vNext)** – customer/deal, pipeline kanban, liên kết task/project.

## KPI thành công
- ≥ 60% task sử dụng AI draft; thời gian tạo nháp giảm ≥ 40% so với thủ công.
- ≥ 95% bài đăng thành công, tỷ lệ lỗi < 3%.
- Velocity, lead time, triage time cải thiện ≥ 20% so với baseline.
- ≥ 70% người dùng nội bộ truy cập dashboard mỗi tuần.

## Roadmap tổng quan
- **P1 – Linear Shell (2–3 tuần)**: RBAC v1, Triage v1, Views/Filters v1, Workflow & Relations cơ bản, command palette sơ khai.
- **P2 – Phases & Projects (2–4 tuần)**: Phases, burndown/velocity, Project/Milestone/Strategic, Notifications & Activity, Templates/Labels, Drive hook.
- **P3 – Marketing Layer (3–5 tuần)**: AI Studio v1, Social Scheduler v1, Analysis v0 (velocity, triage, throughput).
- **P4 – Mở rộng**: Dashboard marketing sâu, CRM nhẹ, custom field, export/import hoàn chỉnh.

## Rủi ro & Biện pháp giảm thiểu
- **Phạm vi lan rộng**: khóa scope theo roadmap, ưu tiên Linear shell trước, AI tập trung trong Task.
- **API MXH hạn chế**: xây queue + retry/backoff, monitor lỗi, đặt quota.
- **Chất lượng RAG**: chuẩn hóa template, tagging dữ liệu, feedback loop và vệ sinh data.
- **An toàn dữ liệu**: lưu token ở vault, chính sách RBAC rõ ràng, audit log không chứa thông tin nhạy cảm.

## Deliverables chính
- Linear shell (sidebar, breadcrumb, 3-panel layout).
- Bộ tính năng core v1: RBAC, Triage, Views/Filters, Workflow/Relations, Phases.
- Marketing layer v1: AI Studio trong Task, Drive indexing, Social Scheduler, Analysis dashboard v0.
- Templates & labels cơ bản, 3 dashboard mặc định, tài liệu kỹ thuật & test coverage nền tảng.
