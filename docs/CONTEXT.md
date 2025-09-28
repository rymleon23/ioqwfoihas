# Bối cảnh & Giả định

## Bối cảnh kinh doanh
- Agency marketing cần công cụ hợp nhất để lập kế hoạch, điều phối công việc và đo hiệu quả chiến dịch.
- Team đa chức năng (content, design, social, finance) cần ngôn ngữ & quy trình thống nhất.
- Đổi thuật ngữ Linear → Marketing (Initiative → Strategic, Issue → Task, Cycle → Phase) nhằm thân thiện với người dùng.
- AI trở thành tiêu chuẩn trong sản xuất nội dung; hệ thống phải hỗ trợ tạo nháp, tối ưu caption, dự đoán lịch đăng.
- Nhu cầu phân tích dữ liệu marketing (reach, CTR, conversion) và productivity để tối ưu ROI & phân bổ nguồn lực.

## Giả định kỹ thuật
- API của nhà cung cấp AI (OpenAI, Gemini) sẵn sàng, chi phí đã được phê duyệt.
- Facebook/Instagram/Zalo hỗ trợ OAuth 2.0, cho phép đăng bài, tải media, nhận webhook.
- Người dùng có tài khoản Google Drive/Supabase Storage với phân quyền rõ ràng.
- Hạ tầng cloud (GCP/AWS/Azure) hỗ trợ container, queue, database chuẩn.

## Ràng buộc & tiêu chuẩn
- Tuân thủ bảo vệ dữ liệu (GDPR tương đương), cung cấp quyền xóa dữ liệu cá nhân.
- Hướng tới SOC 2: cần audit log, RBAC nghiêm ngặt, mã hóa dữ liệu nhạy cảm.
- Múi giờ chuẩn Asia/Ho_Chi_Minh; quản lý chính xác lịch đăng.
- Phát triển đa ngôn ngữ (i18n) từ đầu, chuẩn hoá file locale.

## Phạm vi ngoài
- Thương mại điện tử, thanh toán, CRM đầy đủ (chỉ làm CRM nhẹ, pipeline cơ bản).
- Quản lý quảng cáo trả phí (Facebook Ads, Google Ads) ngoài phạm vi.
- AI cá nhân hóa sâu (beyond content draft & classification) chưa có trong kế hoạch.

## Giá trị kỳ vọng
- Tăng tốc độ tạo nội dung nhờ AI, giảm thời gian phối hợp thủ công.
- Minh bạch quy trình & tiến độ dự án; mọi người truy cập thông tin tại một nơi.
- Đo lường hiệu quả chiến dịch real-time, hỗ trợ ra quyết định nhanh.

## Tài liệu liên quan
- `docs/PRD.md` – yêu cầu sản phẩm & KPI.
- `docs/DATA-MODEL.md` – schema chi tiết.
- `docs/modules/` – đặc tả từng tính năng.
- `docs/IMPLEMENTATION-GUIDE.md` – hướng dẫn vertical slice & thiết lập hạ tầng.
