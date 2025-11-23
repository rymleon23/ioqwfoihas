# Module: Phases (Phases)

## Mục đích

Quản lý chu kỳ làm việc 1–4 tuần, theo dõi tiến độ thông qua burndown/velocity và carry-over task.

## User stories

- PM tạo phase với ngày bắt đầu/kết thúc, gắn team.
- Khi phase kết thúc, task chưa xong tự động carry sang phase kế tiếp.
- Team xem burndown, velocity, tiêu chí hoàn thành phase.

## API

| Endpoint                      | Chức năng                                    |
| ----------------------------- | -------------------------------------------- |
| GET `/teams/{id}/phases`      | Danh sách phase, filter status.              |
| POST `/phases`                | Tạo phase (name, start/end, strategy carry). |
| PATCH `/phases/{id}`          | Cập nhật thông tin, khóa phase.              |
| POST `/phases/{id}/move-task` | Chuyển task vào/ra phase.                    |
| GET `/phases/{id}/report`     | Burndown, velocity, carry-over.              |

## Logic

- `rollover_strategy`: auto, manual, clone.
- Task done sau deadline => flagged overdue.
- Carry-over ghi log trong activity & phase history.

## UI/UX

- Trang Phases: timeline/đường thời gian, card chi tiết (count todo/in-progress/done).
- Widget burndown (actual vs ideal), velocity (story point/task).
- Filter theo team, quick actions tạo phase mới.

## Acceptance criteria

- Phase không chồng thời gian trong cùng team.
- Carry-over thực hiện đúng chiến lược, log chi tiết.
- Báo cáo hiển thị dữ liệu chính xác (kiểm chuẩn <5% sai lệch).
- Khi phase locked, chỉ đọc; muốn sửa phải reopen.

## Metrics

- Velocity trung bình, trend theo phase.
- % task carry-over.
- Lead time theo phase.
- Tỉ lệ hoàn thành mục tiêu phase.
