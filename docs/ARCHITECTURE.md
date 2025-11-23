# Kiến trúc tổng quan

Tài liệu mô tả kiến trúc hệ thống Marketing OS theo phong cách Linear, bảo đảm khả năng mở rộng, dễ bảo trì và linh hoạt khi bổ sung tính năng mới.

## Phân lớp kiến trúc

### Frontend (Web App)

- **Shell Linear-style**: bố cục ba cột (sidebar, list/board, detail). Sidebar thu gọn, breadcrumb điều hướng sâu, responsive đa thiết bị.
- **State management**: Zustand/Redux cho UI cục bộ, TanStack Query/SWR cho server state. Workflow per-team nạp qua context.
- **AI Panel**: component độc lập bên phải Task detail, quản lý luồng Generate → Review → Submit, hiển thị nguồn RAG, giao tiếp HTTP/GraphQL.

### Backend services

| Service              | Chức năng                                                       |
| -------------------- | --------------------------------------------------------------- |
| API Gateway          | Entry point duy nhất, xử lý auth, rate limit, route request.    |
| Core Service         | CRUD Workspace/Team/Member/Task/Project/Phase; workflow engine. |
| Triage Service       | Tiếp nhận task mới, áp dụng rules, log triage, thống kê.        |
| AI Service           | Tích hợp GPT/Gemini, vận hành agent, RAG, lưu kết quả.          |
| Social Service       | Quản lý OAuth, scheduler, auto-post, webhook.                   |
| Drive Indexer        | Đồng bộ Google Drive/Storage, index metadata & embedding.       |
| Analysis Service     | Tính KPI, cache dashboard, cung cấp API frontend.               |
| Notification Service | Phát thông báo in-app/email/Slack, tổng hợp digest.             |
| Auth Service         | SSO, RBAC, quản lý token.                                       |
| CRM Service (vNext)  | Customer/Deal pipeline.                                         |

### Data storage

- **PostgreSQL**: schema mô-đun, lưu công việc, người dùng, workflow, lịch sử, token OAuth (mã hóa).
- **Redis/RabbitMQ**: job queue cho auto-post, index file, notification, retry/backoff.
- **Elasticsearch/OpenSearch**: search nâng cao & filter phức tạp.
- **Vector store (pgvector/FAISS)**: lưu embedding phục vụ RAG.

### Tích hợp

- **AI Providers**: OpenAI GPT-4o, Gemini; thiết kế abstraction để thay thế linh hoạt, kèm guardrail.
- **Mạng xã hội**: OAuth 2.0 với Facebook Graph API, Instagram, Zalo; webhook phản hồi trạng thái bài đăng.
- **Drive/Storage**: Google Drive API hoặc Supabase Storage; indexer chạy định kỳ cập nhật file mới/chỉnh sửa.
- **SSO/Auth**: Google OAuth, email/password, roadmap hỗ trợ Okta, Azure AD.

## Luồng chính

1. **Tạo Task**: UI → API Gateway → Core Service lưu task → Notification Service gửi thông báo.
2. **AI Draft**: User mở AI Panel → gọi AI Service (chọn nguồn RAG) → AI thu thập dữ liệu từ Drive Indexer → trả nháp về UI.
3. **Lên lịch post**: Task chuyển trạng thái Ready-to-Post → Social Service lưu lịch & queue → Cron kích hoạt → gọi API mạng xã hội → nhận webhook → cập nhật task & thông báo.
4. **Dashboards**: Frontend gọi Analysis Service → lấy dữ liệu/cached metrics → trả charts & bảng.

## DevOps & vận hành

- **CI/CD**: GitHub Actions/GitLab CI lint + test + build + deploy; pipeline riêng frontend/back-end; deploy lên Kubernetes hoặc Cloud Run.
- **Observability**: Prometheus + Grafana (metrics), Jaeger/Zipkin (tracing), structured logging, alert PagerDuty/Slack.
- **Bảo mật**: Vault lưu secret/token, TLS mọi kết nối, audit log và RLS database.
- **Khả năng mở rộng**: job idempotent, retry/backoff, rate limit API ngoài, horizontal scaling cho services.

## Phiên bản & môi trường

- **Local**: docker compose (Postgres, Redis, vector store), Supabase CLI.
- **Staging**: branch `staging`, seed dữ liệu mẫu, enable feature flag thử nghiệm.
- **Production**: branch `main`, monitoring đầy đủ, cấu hình backup database & file storage.
