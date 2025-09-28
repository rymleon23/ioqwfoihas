# Module: Triage Inbox

## Mục đích
Tiếp nhận và xử lý yêu cầu công việc mới trước khi đưa vào backlog/phase, bảo đảm ưu tiên và gán đúng người.

## Nguồn vào
- Quick add/UI form.
- Email/API từ hệ thống bên ngoài.
- Integrations (chatbot, form web, mạng xã hội/comment cần follow-up).

## User stories
- Người phụ trách triage accept/decline/assign/snooze task.
- PM muốn gắn priority, labels tự động theo rule.
- Team lead cần xem SLA xử lý và tỉ lệ chấp nhận.

## API & dữ liệu
| Endpoint | Chức năng |
|----------|-----------|
| GET `/inbox` | Danh sách task trạng thái triage, filter theo nguồn, tuổi yêu cầu. |
| POST `/inbox/{id}/accept` | Chuyển task vào backlog, gán workflow state đầu. |
| POST `/inbox/{id}/decline` | Đánh dấu từ chối, lưu lý do/comment, optional notify nguồn. |
| POST `/inbox/{id}/merge` | Gộp trùng, ghi log liên kết. |
| POST `/inbox/{id}/assign` | Gán assignee, priority. |
| POST `/inbox/{id}/snooze` | Dời xử lý, đặt reminder/timebox. |

- Bảng `triage_event` log action (accept/decline/assign...).
- Auto rule: match theo từ khóa, nguồn, requester → gắn label/assignee.

## UI/UX
- Danh sách hai cột: nguồn + nội dung chi tiết, action nhanh.
- Bộ lọc: nguồn, team, SLA, priority.
- Badge thể hiện thời gian chờ, quy tắc áp dụng.
- Bulk action cho thao tác lặp.

## Acceptance criteria
- Action cập nhật trạng thái task, log đầy đủ.
- SLA hiển thị thời gian từ khi vào inbox đến khi xử lý.
- Rule engine có thể bật/tắt theo team, test rule trước khi áp dụng.
- Merge yêu cầu xác nhận, hiển thị task bị gộp.

## Metrics
- Số item triage theo nguồn.
- Thời gian xử lý trung bình / percentile.
- Tỉ lệ accept vs decline vs snooze.
- Số lượng rule kích hoạt, lỗi rule.
