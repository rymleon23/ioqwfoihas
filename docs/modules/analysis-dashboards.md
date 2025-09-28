# Module: Analysis & Dashboards

## Mục đích
Đo lường hiệu suất sản xuất và hiệu quả marketing, hỗ trợ ra quyết định dựa trên dữ liệu.

## User stories
- PM theo dõi velocity, lead time, triage time theo team/project/phase.
- Marketing lead xem số bài đăng, reach/CTR, cadence, time-to-publish.
- Analyst export dữ liệu và chia sẻ dashboard với stakeholders.

## Dữ liệu & pipeline
- Thu thập sự kiện từ Core/Triage/AI/Social (analytics_event).
- Batch job tính toán KPI theo ngày/tuần, lưu vào `metric_snapshot`.
- Hỗ trợ filter team/project/phase, date range.

## UI/UX
- Tab Productivity: velocity, burndown, lead time, triage time, throughput.
- Tab Marketing KPI: post count, reach/CTR (khi API hỗ trợ), cadence, time-to-publish.
- Widget dạng chart + bảng; lưu layout, chia sẻ (roadmap).
- Empty state với hướng dẫn cấu hình tích hợp nếu thiếu dữ liệu.

## Acceptance criteria
- Dữ liệu cập nhật theo lịch (ETL/cron) rõ ràng.
- Sai lệch <5% so với tính tay (đối chiếu mẫu).
- API trả dữ liệu trong SLA (ví dụ <1s cho request chuẩn).
- Filter đồng bộ giữa widget.

## Metrics vận hành
- Dashboard load time.
- Widget error rate.
- Số người truy cập dashboard/tuần, số lượt lưu/chia sẻ.
- Data freshness (tính từ lần cập nhật gần nhất).
