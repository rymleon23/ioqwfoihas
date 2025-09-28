# Module: Projects & Strategic

## Mục đích
Quản lý mục tiêu dài hạn (Strategic) và dự án (Project) với milestone, health và liên kết task.

## User stories
- PM nhóm chiến dịch thành Strategic, theo dõi nhiều project con.
- Project owner cập nhật milestone, health (on-track/at-risk/off-track).
- Stakeholder xem progress tổng hợp và cảnh báo sớm khi trễ.

## API
| Endpoint | Chức năng |
|----------|-----------|
| GET `/strategics` | Danh sách strategic theo workspace. |
| POST `/strategics` | Tạo strategic (name, description, owner). |
| GET `/projects` | Danh sách projects theo team/strategic. |
| POST `/projects` | Tạo project, milestone, health.
| PATCH `/projects/{id}` | Cập nhật progress, health, milestone. |
| GET `/projects/{id}/summary` | KPI, task breakdown, risk. |

## Logic
- Strategic health tổng hợp từ health project con + tiến độ.
- Milestone: name, start, due, progress %, status.
- Task link: hiển thị progress theo project, highlight overdue.

## UI/UX
- Bảng Strategic: card với progress bar, health badge, owner.
- Project detail: tab Milestones, Tasks, Risks, Metrics.
- Integration Linear shell: filter view theo project/strategic.

## Acceptance criteria
- Không tạo project thiếu strategic khi workspace yêu cầu.
- Health update hiển thị ngay, log activity.
- Milestone progress tính dựa trên task/point hoặc manual input.
- Export CSV (roadmap) cho stakeholder.

## Metrics
- Số project on-track vs at-risk/off-track.
- Tỷ lệ milestone hoàn thành đúng hạn.
- Task completion rate theo project.
- Thời gian phản hồi khi project chuyển trạng thái rủi ro.
