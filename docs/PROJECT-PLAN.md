# Kế hoạch dự án

Tài liệu mô tả mục tiêu, timeline và phân bổ nguồn lực cho triển khai Marketing OS.

## Mục tiêu
- Hoàn thiện hạ tầng Linear-style (Teams/Members, Triage, Workflow, Phases, Projects/Strategic) trong 2–3 tháng.
- Tích hợp AI Studio, Social Scheduler, Drive/RAG ở giai đoạn tiếp theo.
- Cung cấp dashboard phân tích hiệu suất marketing & productivity.

## Giai đoạn & timeline
### P1 – Linear Shell (2–3 tuần)
- Schema & API Workspace/Team/Member, RBAC v1.
- Shell UI: sidebar, board/list, detail panel, command palette sơ bộ.
- Inbox/Triage v1 với Accept/Decline/Assign/Snooze.
- Views & Filters v1, workflow & relation cơ bản.
- Thiết lập CI/CD, lint, test nền tảng.

### P2 – Phases & Projects (2–4 tuần)
- Phases: tạo chu kỳ, carry-over, burndown, velocity.
- Projects/Milestones/Strategic với health & progress.
- Notifications/Activity (in-app/email), @mention, watch/follow.
- Template/Label system; Drive hub cơ bản (upload/attach).

### P3 – Marketing layer (3–5 tuần)
- AI Studio v1 (agent preset, generate/review/submit, lưu history).
- Social Scheduler v1: OAuth FB/IG/Zalo, queue, retry/backoff, webhook result.
- Analysis v0: dashboard velocity/triage/throughput (filter team/project/phase).
- Tối ưu hiệu năng, test e2e.

### P4 – Mở rộng
- Dashboard marketing sâu (reach/CTR/conversion/cadence) & productivity nâng cao.
- CRM nhẹ (customer/deal pipeline).
- Custom fields, export/import, public API, i18n nâng cao.

## Phân bổ nguồn lực
| Vai trò | Thành viên | Nhiệm vụ chính |
|---------|-----------|----------------|
| Product Manager | Nguyễn Minh Quân (PMO) | Roadmap, spec, KPI, stakeholder alignment |
| Tech Lead | Trần Hoài Nam (Engineering) | Kiến trúc, code review, định hướng kỹ thuật |
| FE Engineers | Nhóm Frontend (Lê Lan Anh, Đỗ Quốc Huy) | UI shell, Task page, AI Panel, Scheduler UI |
| BE Engineers | Nhóm Backend (Phạm Minh Phúc, Lưu Tuấn Anh) | API, data model, OAuth, Drive integration |
| Designer | Huỳnh Linh Đan (Product Design) | UX/UI, style guide, prototyping |
| QA/Tester | Trịnh Thanh Bình (QA Team) | Test manual & automation |
| Data Analyst | Vũ Mai Chi (Data Insights) | Dashboard, KPI definition, data pipeline |

## Quy trình & giao tiếp
- Scrum/Kanban với sprint 1–2 tuần; daily standup, weekly demo.
- PRD & specs lưu tại `docs/`; module detail tách trong `docs/modules/`.
- Mỗi issue có acceptance criteria rõ ràng; test song song cùng code.
- Sử dụng Linear (hoặc tương đương) để theo dõi backlog, velocity, burndown.

## Rủi ro & đối sách
- **Scope creep**: khóa yêu cầu trong sprint, backlog hóa yêu cầu mới.
- **Thiếu nhân sự**: điều chỉnh timeline, ưu tiên tính năng trọng yếu.
- **Tích hợp phức tạp**: chia nhỏ module, thử nghiệm sandbox trước production.
- **Phụ thuộc API MXH**: theo dõi thay đổi, abstract provider, fallback manual.

## Deliverable theo giai đoạn
- Mỗi phase ra mắt vertical slice chạy được (login → task → AI draft → schedule post → dashboard cơ bản).
- Review với stakeholder sau mỗi sprint, cập nhật docs & rules tương ứng.

## Task rules
- **Task list**: Keep a single prioritized backlog in Linear-style boards; each card tracks owner, scope, dependencies, and latest status update before standup.
- **Task generation**: Only create new tasks after confirming product value, writing acceptance criteria, and linking supporting docs/specs so work stays traceable.


