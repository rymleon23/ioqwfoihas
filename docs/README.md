# Tài liệu Marketing OS

Tập hợp tài liệu đã được tổ chức lại từ `archive/gpt-gen-prd.md`. Sử dụng file này như entry point để tìm đúng nội dung.

## Cấu trúc chính
- `PRD.md` – tầm nhìn, phạm vi, yêu cầu chức năng, KPI, roadmap.
- `ARCHITECTURE.md` – kiến trúc hệ thống, service, tích hợp, DevOps.
- `DATA-MODEL.md` – schema PostgreSQL/Supabase chi tiết.
- `UX-UI.md` – guideline trải nghiệm và thành phần giao diện.
- `PROJECT-PLAN.md` – timeline, nguồn lực, quy trình triển khai.
- `CONTEXT.md` – bối cảnh kinh doanh, giả định, ràng buộc, giá trị.
- `GLOSSARY.md` – bảng thuật ngữ chuẩn hóa UI/Code.
- `RULES.md` – danh sách rule `.cursor` cần attach khi gen code.
- `IMPLEMENTATION-GUIDE.md` – kế hoạch vertical slice, Supabase, Vercel.
- `CIRCLE-INTEGRATION.md` – ánh xạ repo Circle → hệ thống thực tế.
- `DELIVERY-CHECKLIST.md` – checklist phát triển, test, deploy.
- `modules/` – đặc tả chi tiết cho từng tính năng (teams, triage, workflow, phases, projects, ai studio, social scheduler, drive RAG, analysis dashboards).
- `archive/gpt-gen-prd.md` – bản gốc (tham khảo khi cần).

## Cách sử dụng
1. Bắt đầu với `PRD.md` và `GLOSSARY.md` để nắm yêu cầu & thuật ngữ.
2. Đọc module tương ứng trước khi triển khai feature.
3. Khi làm việc với Cursor/Codex, attach PRD + module + rule `.mdc` liên quan.
4. Cập nhật docs & rule sau mỗi sprint nếu behavior thay đổi.

## Liên hệ
- Chủ sản phẩm: Nguyễn Minh Quân (PMO)
- Tech lead: Trần Hoài Nam (Engineering)
- Nơi trao đổi tài liệu: repo `docs/`, Linear project "Marketing OS".
