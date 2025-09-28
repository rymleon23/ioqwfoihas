# Module: Workflow & Status

## Mục đích
Cho phép mỗi team định nghĩa workflow riêng, đảm bảo task di chuyển nhất quán với trạng thái và policy.

## User stories
- Team lead cấu hình state theo quy trình riêng (Brief → In progress → Review → Done).
- PM khóa trạng thái khi task bị block, yêu cầu comment khi chuyển.
- Thành viên xem lịch sử chuyển trạng thái và người thực hiện.

## API
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET `/teams/{id}/workflow` | Lấy cấu hình workflow (states, transitions, policies). |
| POST `/teams/{id}/workflow` | Tạo/cập nhật workflow. |
| POST `/tasks/{id}/transition` | Chuyển state (validate rule). |
| GET `/tasks/{id}/history` | Lịch sử trạng thái, ai thực hiện, timestamp. |

## Logic
- State category: `unstarted`, `started`, `completed`, `cancelled` dùng cho báo cáo.
- Transition rule: cho phép define guard (ví dụ cần có assignee, cần đủ subtask done, cần comment).
- Blocked state: task có relation `blocks`/`blocked_by` hiển thị cảnh báo; option `pause SLA`.

## UI/UX
- Workflow editor (drag & drop, add column, set color/badge).
- Task detail cho phép chuyển state via dropdown/command palette.
- Indicator block/duplicate; prompt nhập lý do khi cancel.

## Acceptance criteria
- Không thể tạo workflow không có state `completed`.
- Không cho phép xóa state đang được dùng (phải chuyển task trước).
- Guard rule chạy ở cả API & UI; lỗi hiển thị rõ ràng.
- Lịch sử đầy đủ (state cũ/mới, người chuyển, ghi chú).

## Metrics
- Tần suất chuyển mỗi state.
- Số lần thất bại do guard.
- Task stuck > SLA theo state.
