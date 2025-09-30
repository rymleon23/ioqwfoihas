# Module: Social Integrations & Scheduler

## Mục đích
Kết nối tài khoản mạng xã hội, lập lịch đăng bài tự động và quản lý kết quả đăng.

## User stories
- Social manager liên kết tài khoản Facebook/Instagram/Zalo qua OAuth.
- Khi task đạt trạng thái "Ready to Post", người dùng chọn account, caption, media, thời gian.
- Hệ thống tự đăng theo lịch, ghi lại kết quả, retry khi lỗi.

## API & job
- OAuth callback lưu token vào `vault`/`secret_ref`.
- `POST /api/social/accounts` – lưu thông tin tài khoản.
- `POST /api/schedule` – tạo `scheduled_post` (taskId, accountId, caption, media, scheduledAt).
- `POST /api/scheduler/tick` – cron kiểm tra post đến hạn, queue job.
- Webhook `/api/social/webhook` – nhận kết quả, cập nhật `post_result`.

## Logic
- Trước khi đăng kiểm tra trạng thái task (Ready to Post) và quyền user.
- Queue idempotent, retry với backoff, giới hạn tốc độ theo platform.
- Khi lỗi cho phép requeue thủ công.

## UI/UX
- Trang Settings > Social: danh sách tài khoản, trạng thái kết nối, nút reconnect.
- Modal Schedule Post: chọn account, preview feed, select media (Drive/Upload), pick time (timezone workspace).
- Timeline lịch đăng, badge trạng thái (queued/posting/done/error), nút retry/cancel.

## Acceptance criteria
- Token lưu an toàn, không log plaintext.
- Cron tick chạy định kỳ, đảm bảo không bỏ sót post.
- Webhook xử lý trùng lặp (signature/nonce).
- Khi fail, task reopen/SLA cập nhật, thông báo tới assignee.

## Metrics
- Số post theo platform.
- Tỉ lệ thành công/lỗi, nguyên nhân lỗi phổ biến.
- Thời gian trung bình từ Ready to Post đến posted.
- Tần suất retry, số post phải xử lý thủ công.
