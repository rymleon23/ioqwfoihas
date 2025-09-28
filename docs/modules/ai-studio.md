# Module: AI Studio (In-Task)

## Mục đích
Cung cấp panel AI ngay trong Task detail để tạo nháp nội dung, review và đẩy vào task cùng citation từ nguồn RAG.

## User stories
- Content specialist chọn agent preset (Content Creator, Social Copy, Finance Review) để sinh nội dung.
- User chọn nguồn dữ liệu (Workspace/Team/Project/Drive) làm RAG context.
- PM phê duyệt kết quả AI, log lại comment.

## Luồng
1. Người dùng mở tab AI Studio trong Task detail.
2. Chọn agent + nguồn RAG + prompt bổ sung.
3. Hệ thống gọi API `/api/ai/generate`, gửi taskId, agent, nguồn.
4. AI Service lấy dữ liệu từ Drive Indexer, gọi GPT/Gemini, trả về markdown + citations.
5. Người dùng review, chỉnh sửa, nhấn "Đưa vào Task" → tạo comment + cập nhật trường liên quan (ví dụ content field).

## API
- `POST /api/ai/generate` → trả `output`, `sources`, `latency`, `model`.
- `POST /api/ai/submit` → lưu comment/task update, ghi `ai_generation` record.
- `GET /api/ai/history?taskId=` → danh sách bản nháp trước.

## UI/UX
- Tab: Generate / Review / Submit.
- Hiển thị danh sách nguồn (Drive file, wiki, comment), toggle include/exclude.
- Citation inline, preview snippet.
- Lưu preset agent & gợi ý prompt mẫu.

## Acceptance criteria
- Lưu lịch sử gọi AI cùng metadata (model, latency, agent, sources).
- Không submit khi thiếu quyền (member guest) → cảnh báo.
- Khi AI lỗi, hiển thị thông báo + tùy chọn retry/feedback.
- Tự động log event analytics (usage, conversion).

## Metrics
- Tỷ lệ task dùng AI draft.
- Thời gian trung bình generate.
- Quality feedback (thumbs up/down).
- Số lượng submit trực tiếp vs cần chỉnh tay.
