# Module: Drive Hub & RAG

## Mục đích
Xây dựng kho tài nguyên tập trung, index nội dung để phục vụ tìm kiếm và RAG cho AI Studio.

## User stories
- User kết nối Google Drive/Dropbox/Supabase Storage làm nguồn dữ liệu.
- Tự động index metadata, nội dung, embedding để tra cứu nhanh.
- Đính kèm file vào task, đánh dấu dùng làm nguồn RAG.

## Hạ tầng
- Sync service đồng bộ thư mục `/Company/AiM/...` định kỳ.
- Lưu metadata vào `drive_folder`, `drive_file` (external_id, version, mime, size, embedding vector).
- Index nội dung văn bản (doc, sheet, pdf) → vector store.
- API search: theo từ khóa, tag, loại file.

## API
| Endpoint | Chức năng |
|----------|-----------|
| POST `/drive/connect` | Bắt OAuth, lấy refresh token. |
| GET `/drive/files` | Liệt kê thư mục/file, filter. |
| POST `/drive/refresh` | Force re-index.
| POST `/tasks/{id}/attachments` | Gắn file vào task (type drive/upload/link). |
| GET `/ai/sources` | Trả danh sách nguồn RAG khả dụng. |

## UI/UX
- Tree view/folder breadcrumb, quick search.
- Preview trong drawer (doc, image, video) với metadata.
- Toggle "Sử dụng cho AI" và ghi chú.

## Acceptance criteria
- Indexer xử lý incremental, tránh duplicate.
- Lưu version để phát hiện thay đổi, re-embed.
- Quản lý quyền: chỉ thành viên workspace/team được xem file.
- Track usage: file nào được dùng trong AI/Task.

## Metrics
- Thời gian đồng bộ trung bình.
- Số file được index, lỗi sync.
- Tần suất file được dùng làm nguồn AI.
- Search latency.
