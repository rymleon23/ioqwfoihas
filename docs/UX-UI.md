# Hướng dẫn UX/UI

Mục tiêu giữ phong cách Linear: nhanh, gọn, rõ ràng, ưu tiên năng suất và đáp ứng chuẩn truy cập.

## Nguyên tắc chung

- Phản hồi thao tác ≤ 200 ms; AI Panel trả kết quả trong vài giây.
- Ưu tiên thông tin chính, cung cấp chi tiết theo ngữ cảnh khi cần.
- Hỗ trợ phím tắt toàn diện; command palette (Cmd/Ctrl + K) cho điều hướng và hành động nhanh.
- Responsive đa thiết bị (desktop/tablet/mobile), tuân WCAG 2.1 AA.

## Kiến trúc giao diện

- **Sidebar**: hiển thị Strategic, Projects, Phases, Views; thu gọn, highlight mục hiện tại.
- **Breadcrumb**: hiển thị đường dẫn (Strategic → Project → Task), click quay lại tầng trên.
- **Header**: logo/workspace, search, command palette, profile; co rút thành menu trên mobile.
- **Task page**: bố cục ba cột – sidebar (views/projects/phases), list/board/timeline trung tâm, detail panel bên phải (Details, Comments & Activity, AI Panel, Attachments). AI Panel overlay phần comment khi mở.

## Thành phần cơ bản

- **Buttons**: primary/secondary/destructive, nhãn hành động rõ ràng.
- **Form**: label đầy đủ, placeholder gợi ý, select hỗ trợ search async khi danh sách dài (label, member).
- **Modal & Drawer**: modal cho hành động phá hủy, drawer tạo/chỉnh team/project/strategic để giữ ngữ cảnh.
- **Drag & Drop**: board, sắp xếp subtask; hiển thị placeholder rõ ràng.
- **Empty & Loading state**: illustration + hướng dẫn; skeleton loader cho trạng thái fetch/AIGenerate.
- **Toast & Notification**: hành động thành công/thất bại hiển thị toast ngắn, xem chi tiết tại notification center.

## Thiết kế hệ thống

- **Màu sắc**: palette trung tính, accent nhấn hành động chính; đảm bảo contrast ≥ 4.5:1.
- **Typography**: sans-serif (Inter/Roboto). Heading XL, body MD, caption SM.
- **Spacing**: scale 4 px, border radius 8–12 px, shadow nhẹ cho card/button.

## Accessibility & i18n

- Keyboard navigation đầy đủ (Tab/Enter/Esc/Arrow).
- Alt text cho hình/icon, nhất là AI Panel & post preview.
- Nội dung đa ngôn ngữ, text lấy từ file locale (`/locales/vi`, `/locales/en`).

## View cụ thể

- **Inbox/Triage**: bảng hai cột (nguồn, nội dung), action nhanh, hiển thị SLA & triage time.
- **Board View**: cột theo state, drag & drop, badge priority/due, sticky filter.
- **Timeline**: kéo thả task, zoom tuần/tháng, highlight overdue.
- **Dashboard**: chart (line, bar, donut) + bảng; filter nổi bật (team/project/phase, date range).

## AI Panel

- Tabs Generate/Review/Submit.
- Chọn agent (content, finance, social...), chọn nguồn (Workspace/Team/Project/Drive/RAG prompt).
- Hiển thị citation, metadata nguồn, nút "Đưa vào Task" tạo comment + cập nhật trường tương ứng.

## Social Scheduler UI

- Modal khi task chuyển "Ready to Post": chọn account, caption, media, thời gian.
- Timeline lịch đăng, trạng thái queued/posting/done/error, nút retry/cancel.

## Drive Hub UI

- Tree/crumb folder, search theo từ khóa/tag.
- Preview file (doc, image, video) trong drawer, gắn nhanh vào task, đánh dấu nguồn RAG.

## Dashboard trải nghiệm

- Tab **Productivity** (velocity, lead time, triage time, throughput).
- Tab **Marketing KPI** (số bài đăng, reach/CTR, cadence, time-to-publish).
- Lưu cấu hình dashboard, chia sẻ (roadmap).
