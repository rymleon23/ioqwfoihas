📂 Tài liệu chi tiết

PRD:
Linear‑style Marketing OS — PRD (AiM)
Tầm nhìn

Chúng ta xây dựng một hệ thống quản lý công việc và sản xuất nội dung lấy cảm hứng từ Linear, nhưng được bản địa hoá cho một agency marketing. Sản phẩm cho phép các đội lập kế hoạch, thực thi và phân tích công việc một cách mạch lạc, đồng thời tích hợp các tính năng chuyên biệt như AI hỗ trợ viết nội dung, kết nối mạng xã hội và lên lịch đăng bài, kho tài nguyên và tính năng RAG, cùng với dashboard phân tích hiệu quả. Mục tiêu là tạo ra một "Marketing OS" giúp tăng tốc độ sản xuất, cải thiện chất lượng nội dung và đo lường hiệu quả trong cùng một nền tảng.

Chuẩn hóa thuật ngữ

Để phù hợp với ngữ cảnh marketing, chúng ta đổi tên các khái niệm cốt lõi của Linear như sau. Bản đồ này phải áp dụng cho UI, copy, document và code.

Linear	Aim (dùng trong UI/Docs/Code)
Initiative	Strategic
Issue	Task
Project	Project
Cycle	Phase
Triage	Triage
Phạm vi

Sản phẩm bao gồm hai lớp tính năng chính:

Core Linear‑style: Workspace/Teams/Members (RBAC), Triage Inbox, Task/Project/Strategic, Phase (iteration), Views & Filters, quan hệ giữa Task, Notifications & Activity, Templates & Labels, Search, Command Palette và giao diện responsive.

Lớp Marketing mở rộng: AI Studio ngay trong trang Task (tích hợp GPT/Gemini với RAG từ Drive), Social Integrations (Facebook/Instagram/Zalo) và hệ thống lên lịch & tự động đăng bài, kho lưu trữ + indexing (Drive hub), cùng với dashboard phân tích hiệu quả marketing và năng suất đội ngũ.

Trong giai đoạn tiếp theo, hệ thống sẽ được mở rộng thêm tính năng CRM nhẹ (Customer/Deal) để quản lý mối quan hệ khách hàng và cơ hội bán hàng.

Personas & nhu cầu

Product Manager / Lead – tổ chức và giám sát Strategic/Project, phê duyệt kết quả AI, theo dõi dashboard hiệu suất.

Nhân viên Content / Marketing Ops – sử dụng AI để tạo nội dung trong Task, gắn tài nguyên từ Drive, lên lịch và tự động đăng bài.

Kỹ sư (Engineer) – xây dựng API, engine workflow và queue, tích hợp dịch vụ bên ngoài, triển khai RAG và đảm bảo bảo mật, hiệu năng.

Analyst – phân tích dữ liệu marketing và productivity, xây dựng dashboard và chia sẻ kết quả với toàn team.

Yêu cầu chức năng tổng quan
1. Workspace, Teams & Members (RBAC)

Cho phép tạo và quản lý Workspace, Team và Member với các role: Owner, Admin, Member, Guest. Mỗi Team có key duy nhất (ví dụ AIM2) và cấu hình workflow riêng.

Quản lý quyền hạn: thành viên chỉ truy cập dữ liệu thuộc Team hoặc Project được cấp quyền; khách (Guest) chỉ có quyền đọc.

2. Triage Inbox

Hộp thư đến nhận yêu cầu mới từ nhiều nguồn (quick add, email/API, integration). Người phụ trách có thể Accept/Decline, Merge (duplicate), Assign, Snooze và gắn Priority.

Hỗ trợ rule tự động gắn label/assignee khi nhận issue mới. Theo dõi thời gian xử lý triage và các tỷ lệ chấp nhận/không chấp nhận.

3. Tasks & Relations

Mỗi Task có các thuộc tính: tiêu đề (bắt buộc), trạng thái (theo workflow Team), người thực hiện, nhãn, mức độ ưu tiên (0–4), ước lượng (điểm/giờ), hạn hoàn thành.

Hỗ trợ quan hệ: subtask, duplicate, blocks / blocked‑by, relates‑to. Có thể chặn chuyển trạng thái khi Task đang bị block.

4. Phases (Cycles)

Chu kỳ lặp lại với độ dài cố định (1–4 tuần) tùy Team. Khi phase kết thúc, tự động carry‑over Task chưa hoàn thành sang Phase tiếp theo.

Cung cấp burndown chart, velocity và các thông tin theo dõi tiến độ.

5. Projects & Strategic

Project gom nhiều Task với milestone, chỉ số tiến độ và health (on‑track / at‑risk / off‑track). Strategic gom nhiều Project để phản ánh mục tiêu dài hạn.

Health của Strategic được tổng hợp từ các Project trực thuộc.

6. Views & Filters

Cung cấp các view hệ thống (My Tasks, Active, Backlog, Completed, Due soon) và khả năng tạo Custom View với filter đa điều kiện. Người dùng có thể lưu và chia sẻ view (private, team, workspace).

Các chế độ hiển thị: board (Kanban), list, timeline và swimlanes.

7. Notifications & Activity

Thông báo qua in‑app và email; hỗ trợ @mention và tính năng watch/follow Task/Project để nhận cập nhật.

Lưu trữ log hoạt động và audit log theo từng sự kiện, đảm bảo truy vết thay đổi và phân quyền.

8. Templates, Labels & Custom fields

Cho phép định nghĩa template Task/Project (ví dụ content brief, caption, post plan, finance check). Nhãn (label) được quản lý theo Team, có thể đặt bắt buộc hoặc tùy chọn.

Custom fields được dự kiến ở phiên bản sau.

9. Search & Import/Export

Hỗ trợ tìm kiếm toàn cầu với filter nâng cao; import dữ liệu (CSV → Task); export CSV/JSON ở các phiên bản tiếp theo.

10. Command Palette & Responsive

Palette cho phép thực hiện nhanh các hành động (tạo Task, chuyển trạng thái, điều hướng). Hỗ trợ phím tắt trên cả desktop và mobile. UI tuân thủ chuẩn WCAG 2.1 AA.

11. AI Studio (in‑Task)

Tạo nội dung nháp ngay trong Task bằng các agent preset (content‑creator, designer‑assist, finance‑check, …). Người dùng chọn nguồn RAG (Workspace/Team/Project/Drive folder/attachment).

Luồng làm việc: Generate → Review → Submit (kết quả được đính kèm vào comment hoặc file trong Task). Model text sử dụng GPT, model ảnh sử dụng Gemini; guardrails chống lộ PII.

Phản hồi AI phải có citation nguồn và hoàn thành trong thời gian tối ưu (p50 ≤ 5 s).

12. Social Integrations & Scheduler

Kết nối các nền tảng mạng xã hội như Facebook, Instagram, Zalo bằng OAuth, lưu token mã hoá an toàn. Cho phép chọn tài khoản đích, soạn caption và đính kèm media từ Task.

Hỗ trợ Schedule bài viết theo múi giờ Việt Nam, tự động đăng, retry khi lỗi và phản hồi trạng thái (postId, success/error) về Task. Có rule tự động: khi Task chuyển trạng thái “Ready to Post” thì tự tạo lịch đăng.

13. Drive Hub & RAG

Tổ chức kho lưu trữ chuẩn tại /Company/AiM/{Business, Product, Specs, Templates, Assets} trong Google Drive hoặc hệ thống tương đương. File được index (metadata + embedding) để dùng cho RAG.

Người dùng có thể tìm kiếm, chọn và đính kèm file trực tiếp trong Task và AI Panel. Indexer tôn trọng permission và cập nhật định kỳ.

14. Analysis Dashboards

Dashboard phân tích hiệu suất marketing (post count, reach, CTR, conversion, cadence) và năng suất team (done rate, lead time, triage time, throughput). Hỗ trợ filter theo Team/Project/Phase và export dữ liệu.

15. CRM nhẹ (vNext)

Thêm các thực thể Customer và Deal, quản lý pipeline cơ bản và liên kết với Task/Project.

Yêu cầu phi chức năng

Hiệu năng: API trả về < 500 ms với p95; UI mượt mà; AI draft P50 ≤ 5 giây.

Bảo mật & Quyền: mã hoá token kết nối mạng xã hội; áp dụng RBAC; ngăn chặn rò rỉ PII trong RAG; lưu Audit Log.

Quan sát (Observability): đầy đủ logging, metrics cho các job (posting, AI, errors) và trace toàn bộ queue hệ thống.

Khả năng mở rộng: hệ thống hàng đợi idempotent, tự retry; có backoff và hạn chế tốc độ khi gọi API ngoài (MXH).

Khả năng truy cập: giao diện tuân thủ WCAG 2.1 AA; hỗ trợ nhiều ngôn ngữ; múi giờ cố định Asia/Ho_Chi_Minh.

Chỉ số thành công (KPI)

≥ 60% Task sử dụng AI draft; thời gian tạo nháp giảm ≥ 40% so với quy trình thủ công.

Tỉ lệ đăng bài thành công ≥ 95%, lỗi < 3%.

Năng suất (velocity, lead time, triage time) cải thiện ≥ 20% so với baseline.

≥ 70% người dùng nội bộ truy cập dashboard mỗi tuần.

Roadmap tổng quan

P1 – Linear Shell (~2–3 tuần): triển khai RBAC v1, Triage v1, Views/Filters v1, Workflow & Relations cơ bản, Command Palette sơ khai.

P2 – Phases & Projects (~2–4 tuần): thêm Phases (cycles), burndown/velocity, Projects/Milestones/Strategic, Notifications/Activity, Templates/Labels và hook Drive.

P3 – Marketing layer (~3–5 tuần): triển khai AI Studio v1, Social Scheduler v1, và Analysis v0 (velocity, triage, throughput).

P4 – Mở rộng: phát triển dashboard marketing sâu hơn, bổ sung CRM nhẹ, custom fields, Export/Import hoàn chỉnh.

Rủi ro & biện pháp giảm thiểu

Phạm vi lan rộng: tập trung vào tính năng cốt lõi trước (Linear shell), giới hạn AI PM chỉ trong Task thay vì quản lý toàn bộ Project.

Giới hạn API MXH: xây queue + retry/backoff, monitor lỗi; đặt ngưỡng sử dụng.

Chất lượng RAG: thiết kế template chuẩn, tagging dữ liệu hợp lý; thêm feedback loop và clean data định kỳ.

An toàn dữ liệu: lưu token ở vault, phân quyền rõ ràng; kiểm tra log không chứa thông tin nhạy cảm.

Deliverables

App shell Linear style với sidebar/breadcrumb/3‑panel.

RBAC v1, Triage v1, Views/Filters, Workflow/Relations, Phases v1.

AI Studio in‑Task v1, Drive indexing, Social Scheduler v1, Analysis v0.

Bộ template và nhãn cơ bản; 3 dashboard mặc định; tài liệu kỹ thuật & test.

Kiến trúc tổng quan (ARCHITECTURE.md):
Kiến trúc tổng quan

Tài liệu này mô tả kiến trúc hệ thống cho Marketing OS được xây dựng theo phong cách Linear. Mục tiêu là đảm bảo giải pháp có khả năng mở rộng, dễ bảo trì và hỗ trợ triển khai các tính năng mới một cách linh hoạt.

Phân lớp kiến trúc
Frontend (Web/App)

Shell Linear‑style: cấu trúc ba cột (sidebar, list, detail) với khả năng thu gọn sidebar và breadcrumb cho navigation sâu. Giao diện responsive và hỗ trợ keyboard‑first (command palette, phím tắt).

State management: sử dụng Zustand hoặc Redux Toolkit cho state cục bộ (form, UI) và React Query hoặc SWR cho state từ server. Mỗi Team có workflow riêng được nạp theo context.

AI Panel: một component độc lập, được hiển thị bên phải trên trang Task. Panel này quản lý luồng Generate → Review → Submit và hiển thị nguồn RAG. Nó giao tiếp với backend qua HTTP/GraphQL.

Backend

Hệ thống backend được chia thành các dịch vụ riêng biệt (microservices hoặc modules trong monorepo) giao tiếp qua REST/GraphQL và hàng đợi message (RabbitMQ/Kafka) cho các tác vụ bất đồng bộ.

Service	Chức năng chính
API Gateway	Điểm vào duy nhất; xử lý auth, rate limit, route tới các service nội bộ.
Core Service	CRUD Workspace/Team/Member/Task/Project/Phase; workflow engine.
Triage Service	Nhận issue mới, áp dụng rules, ghi log triage, trả về thống kê.
AI Service	Kết nối với GPT/Gemini, triển khai Agents, thực hiện RAG, trả kết quả.
Social Service	Quản lý OAuth, lên lịch, queue auto‑post, nhận webhook từ FB/IG/Zalo.
Drive Indexer	Kết nối Google Drive, index metadata và embeddings, trả kết quả cho RAG.
Analysis Service	Tính toán KPI, lưu cache dashboards, cung cấp API cho frontend.
Notification Service	Phát sự kiện đến in‑app/email/Slack, tập hợp digest.
Auth Service	Quản lý người dùng, token, RBAC, SSO; hỗ trợ OAuth2 cho các integration.
CRM Service (vNext)	Quản lý Customer/Deal và pipeline.
Data Storage

Database chính: PostgreSQL với schema mô đun; lưu thông tin công việc, người dùng, vai trò, workflow, lịch sử và token OAuth (mã hoá).

Queue & Job store: Redis hoặc RabbitMQ dùng cho các job như auto‑post, index file, gửi notification, retry.

Search index: Elasticsearch hoặc tương tự để phục vụ tìm kiếm toàn cục và filter phức tạp.

Vector store: dùng cho RAG (FAISS hoặc Elasticsearch vector field) để lưu embeddings của file và dữ liệu ngữ nghĩa.

Tích hợp

GPT / Gemini: qua API (OpenAI, Google) với proxy và guardrails; thiết kế cho phép thêm nhà cung cấp mới dễ dàng.

Mạng xã hội: tích hợp bằng OAuth 2.0 (Facebook Graph API, Instagram Basic Display API, Zalo Open Platform). Sử dụng webhooks để nhận phản hồi và cập nhật trạng thái bài đăng.

Drive: Google Drive API hoặc dịch vụ lưu trữ tương tự; indexer chạy định kỳ để cập nhật file mới/chỉnh sửa.

SSO & Auth: hỗ trợ Google OAuth, email/password, và tích hợp SSO doanh nghiệp (Okta, Azure AD) ở phiên bản sau.

Sơ đồ luồng chính

Tạo Task: Người dùng nhập qua UI (hoặc triage) → API Gateway → Core Service lưu Task → Notification Service gửi thông báo.

AI draft: Người dùng mở AI Panel → gửi yêu cầu đến AI Service (chọn nguồn RAG) → AI gọi model, thu thập dữ liệu từ Drive Indexer → trả nháp về UI.

Lên lịch post: Khi Task chuyển sang trạng thái Ready to Post → Social Service đặt lịch & lưu vào queue → khi đến giờ, job thực thi post → nhận webhook kết quả → cập nhật Task & gửi thông báo.

Dashboards: Frontend gọi Analysis Service để lấy dữ liệu; service đọc cache hoặc tính toán từ DB/Search index, trả về charts.

Triển khai & DevOps

CI/CD: sử dụng GitHub Actions/GitLab CI để lint, test, build và deploy. Tách pipeline cho frontend và backend. Deploy lên Kubernetes hoặc serverless (GKE/Cloud Run) tuỳ môi trường.

Monitoring: dùng Prometheus + Grafana để giám sát, Jaeger/Zipkin để trace; cảnh báo qua PagerDuty/Slack.

Secret management: dùng Vault hoặc Secret Manager để lưu token MXH, API keys và thông tin nhạy cảm.

Bảo mật & tuân thủ

Token OAuth và API key được mã hoá và chỉ giải mã trong môi trường server. Không lưu token trên client.

Thực thi RBAC ở tầng API Gateway và trong service; audit trail ghi lại mọi thay đổi quan trọng.

Tuân thủ chuẩn SOC 2 và GDPR: hỗ trợ xoá dữ liệu (Right to be forgotten) và export dữ liệu cá nhân theo yêu cầu.

Khả năng mở rộng

Thiết kế theo mô hình dịch vụ độc lập cho phép mở rộng từng thành phần khi lưu lượng tăng. Công nghệ queue đảm bảo hệ thống vẫn hoạt động ổn định khi có sự cố mạng xã hội hoặc model AI chậm. Sử dụng cache và các layer indexing để giảm tải cho DB.

Mô hình dữ liệu (DATA‑MODEL.md):
Mô hình dữ liệu

Tài liệu này mô tả các thực thể (entity) cốt lõi và mối quan hệ giữa chúng trong Marketing OS. Việc thiết kế schema rõ ràng giúp đảm bảo tính nhất quán dữ liệu và hỗ trợ mở rộng hệ thống trong tương lai.

Thực thể chính
Workspace

id – UUID tự sinh.

name – tên workspace.

slug – định danh rút gọn dùng cho URL.

Team

id – UUID.

workspaceId – FK tới Workspace.

name – tên Team.

key – mã Team (ví dụ “AIM2”) dùng cho mã Task.

workflowId – FK tới Workflow.

defaultPhaseId – FK tới Phase (chu kỳ hiện tại).

Member

id – UUID.

workspaceId – FK tới Workspace.

email, displayName, avatarUrl.

status – active / invited / disabled.

Membership

id – UUID.

memberId – FK tới Member.

teamId – FK tới Team.

role – Owner, Admin, Member, Guest.

RolePermission

role – string.

resource – tên tài nguyên (task, project, team, strategic…).

action – create / read / update / delete / manage.

Workflow

id – UUID.

teamId – FK tới Team.

states – array các trạng thái (bên trong gồm name, category unstarted|started|completed|cancelled, order).

Phase (Cycle)

id – UUID.

teamId – FK tới Team.

name – ví dụ “2025-09 Sprint 1”.

startDate, endDate.

sequenceIndex – thứ tự (tăng dần).

status – planned / active / completed.

rolloverStrategy – carry‑over.

Strategic (Initiative)

id – UUID.

workspaceId – FK tới Workspace.

name, description.

status – on‑track / at‑risk / off‑track.

ownerId – FK tới Member.

Project

id – UUID.

teamId – FK tới Team.

strategicId – FK tới Strategic (nhiều → một).

name, description.

milestones – list; mỗi milestone gồm name, startDate, dueDate, progress (%), status.

health – on‑track / at‑risk / off‑track.

Task (Issue)

id – UUID.

teamId – FK tới Team.

projectId – FK tới Project (nullable).

strategicId – FK tới Strategic (nullable).

phaseId – FK tới Phase (nullable).

title, description.

stateId – FK tới Workflow.states.

assigneeId – FK tới Member.

estimate – số; priority – 0–4.

dueDate, createdAt, updatedAt, completedAt.

parentId – FK tới Task (nullable) để tạo subtask.

priority, labels – array.

relations – many‑to‑many; bảng phụ lưu quan hệ type (blocks, blocked‑by, duplicates, relates‑to).

TriageEvent

id – UUID.

taskId – FK tới Task.

teamId – FK tới Team.

action – accept / decline / snooze / merge / assign / set priority.

performedBy – FK tới Member.

timestamp.

metadata – chứa các giá trị liên quan (nhãn gắn, assignee mới…).

SocialAccount

id – UUID.

workspaceId – FK tới Workspace.

provider – facebook / instagram / zalo / other.

accountId – id trên nền tảng.

displayName.

tokenRef – con trỏ tới vault chứa token mã hoá.

status – active / invalid / revoked.

ScheduledPost

id – UUID.

taskId – FK tới Task.

socialAccountId – FK tới SocialAccount.

scheduledAt – thời gian đăng dự kiến.

caption, mediaRefs – link tới DriveFile.

status – scheduled / published / failed / canceled.

postResultId – FK tới PostResult (nullable).

PostResult

id – UUID.

scheduledPostId – FK tới ScheduledPost.

platformPostId – id từ Facebook/Instagram/Zalo.

url – link bài post.

publishedAt – thời gian đăng thực tế.

error – thông tin lỗi (nếu có).

DriveFolder & DriveFile

DriveFolder{id, name, path, parentId, workspaceId, teamId(nullable)}.

DriveFile{id, name, mimeType, folderId, size, createdAt, modifiedAt, ownerId, url}.

indexed – boolean; vectorId – id trong vector store (nếu dùng RAG).

Template

id – UUID.

type – task / project / content brief / caption…

content – text/JSON; createdBy, createdAt.

AnalyticsEvent & DashboardWidget

AnalyticsEvent{id, teamId, memberId, eventType, payload, timestamp} – lưu các event để tính toán KPI (ví dụ “task_completed”, “post_published”).

DashboardWidget{id, userId, name, config} – cấu hình widget (chart type, filters) cho dashboard cá nhân hoặc chia sẻ.

Customer & Deal (vNext)

Customer{id, workspaceId, name, email, phone, status}.

Deal{id, customerId, projectId, amount, stage, expectedCloseDate, status}.

Quan hệ giữa các thực thể

Workspace có nhiều Teams, Members, SocialAccounts và DriveFolders.

Team thuộc về một Workspace, có nhiều Members (qua Membership), nhiều Projects, Tasks, Phases và một Workflow.

Member có thể thuộc nhiều Teams và đảm nhiệm nhiều Tasks.

Strategic thuộc về một Workspace và liên kết với nhiều Projects; Project có nhiều Tasks và Milestones.

Task có thể liên kết với Project, Strategic, Phase. Task có thể làm parent của các subtask khác; Task có quan hệ many‑to‑many với Task qua bảng Relation.

Phase chứa nhiều Tasks; khi Phase hoàn thành, Task chưa hoàn thành được chuyển sang Phase mới theo chiến lược rollover.

SocialAccount có nhiều ScheduledPosts; mỗi ScheduledPost sinh ra một PostResult sau khi đăng.

DriveFile và DriveFolder tạo thành cây thư mục; DriveFile gắn với Task (qua attachment) và được index để phục vụ RAG.

AnalyticsEvent được tạo bởi các service khác nhau và được xử lý bởi Analysis Service để tính KPI.

Customer có nhiều Deals; Deal có thể liên kết với Project (vNext).

Quy ước trường & naming

Dùng snake_case cho tên trường trong cơ sở dữ liệu và camelCase trong mã nguồn TypeScript/JavaScript.

Mọi timestamp lưu ở định dạng ISO 8601 (UTC) và chuyển đổi theo múi giờ người dùng ở phía client. Múi giờ mặc định: Asia/Ho_Chi_Minh.

Dùng chuẩn UUID v4 cho tất cả khoá chính. Các khoá ngoại tham chiếu tới ID cha rõ ràng.

Lưu trữ lịch sử (soft delete) bằng trường deletedAt; các bản ghi không xóa hẳn, cho phép khôi phục.

Hướng dẫn UX/UI (UX‑UI.md):
Hướng dẫn UX/UI

Tài liệu này mô tả các nguyên tắc và thành phần giao diện người dùng cho Marketing OS. Mục tiêu là giữ phong cách Linear: nhanh, gọn, rõ ràng, tiện dụng và đáp ứng tiêu chuẩn truy cập quốc tế.

Nguyên tắc chung

Tốc độ: mọi thao tác nên phản hồi trong vòng 200 ms; AI Panel trả nháp trong vài giây.

Tối giản: giao diện ưu tiên thông tin quan trọng, tránh rối mắt nhưng vẫn cho phép truy cập chi tiết khi cần.

Phím tắt & Command palette: người dùng có thể thực hiện các thao tác chính bằng phím tắt; palette (Cmd/Ctrl + K) giúp tìm kiếm và điều hướng.

Responsive & A11y: giao diện thích ứng trên desktop, tablet, mobile; tuân theo WCAG 2.1 AA với contrast phù hợp, hỗ trợ bàn phím, mô tả ảnh.

Shell & điều hướng

Sidebar: đặt ở bên trái; hiển thị Strategic, Projects, Phases và Views. Có thể thu gọn và cuộn; highlight mục đang chọn.

Breadcrumb: hiển thị đường dẫn khi truy cập sâu (ví dụ: Strategic › Project › Task) và cho phép click quay lại cấp trên.

Header: chứa logo/workspace, thanh tìm kiếm, command palette, profile. Trên mobile, các mục này co lại thành menu.

Trang Task

Trang Task dùng bố cục ba cột:

Sidebar – danh sách Views/Projects/Phases.

List/Board – hiển thị danh sách Task, board Kanban hoặc timeline; hỗ trợ kéo‑thả khi thích hợp.

Detail panel – hiển thị Task đang chọn, gồm các tab: Details (mô tả, labels, assignee, estimate, priority, due), Comments & Activity (timeline cập nhật, markdown, attachment), AI Panel (Generate → Review → Submit) và Attachments. AI Panel overlay lên phần comments khi mở.

Thành phần cơ bản

Button: phân loại primary/secondary/destructive; luôn ghi rõ hành động.

Form: input có label và placeholder; select hỗ trợ tìm kiếm (async) khi danh sách dài (labels, members).

Modal/Drawer: dùng modal cho thao tác phá huỷ (delete/cancel post) và drawer cho tạo Team/Project/Strategic; giúp giữ ngữ cảnh.

Drag & drop: áp dụng cho board (thay đổi cột), sắp xếp subtask; hiển thị placeholder rõ ràng khi kéo.

Empty & Loading state: hiển thị illustration và nhắc nhở khi không có dữ liệu (“No tasks yet”); dùng skeleton loader khi đang tải hoặc AI đang soạn thảo.

Toast & Notification: mỗi hành động thành công/thất bại hiện toast ngắn; người dùng có thể xem chi tiết trong bảng notification.

UI Kit & Token

Màu sắc: dùng palette trung tính; accent color nhấn mạnh hành động (primary buttons).

Font: sans‑serif (Inter/Roboto); kích thước đa dạng (xl cho tiêu đề, md cho nội dung, sm cho caption).

Spacing: theo thang 4 px; border‑radius 8–12 px; shadow nhẹ cho card & button.

Accessibility

Colour contrast đáp ứng chuẩn AA (≥ 4.5:1 cho văn bản).

Keyboard navigation: mọi thành phần có thể focus bằng phím Tab; dùng Enter để mở chi tiết, Esc để đóng panel; arrow keys điều khiển board.

Alt text cho ảnh/icon giải thích nội dung; đặc biệt trong AI Panel và các post preview.

I18n: hỗ trợ đa ngôn ngữ; tất cả text nằm trong file locale.

Kế hoạch dự án (PROJECT‑PLAN.md):
Kế hoạch dự án

Tài liệu này nêu rõ mốc thời gian, phạm vi công việc và phân bổ nguồn lực cho dự án Marketing OS. Đây không phải là kế hoạch chi tiết từng ngày mà là định hướng cấp cao để đảm bảo tất cả thành viên nắm được tiến độ và ưu tiên.

Mục tiêu chung

Hoàn thiện hạ tầng Linear‑style (Teams/Members, Triage, Workflow, Phases, Projects/Strategic) trong vòng 2–3 tháng.

Tích hợp AI Studio, Social Scheduler và Drive RAG ở giai đoạn kế tiếp để hỗ trợ marketing chuyên sâu.

Cung cấp dashboard phân tích hiệu suất marketing và productivity.

Giai đoạn & timeline
P1 – Linear Shell (2–3 tuần)

Xây dựng mô hình dữ liệu và API cho Workspace/Team/Member, RBAC v1.

Tạo giao diện shell: sidebar, list/board, detail panel, command palette sơ bộ.

Implement Triage v1 (Inbox UI + actions Accept/Decline/Assign/Snooze).

Triển khai Views & Filters v1, Workflow cơ bản và quan hệ (subtask, duplicate, blocks).

Thiết lập CI/CD, lint và test cơ bản.

P2 – Phases & Projects (2–4 tuần)

Implement Phases: tạo chu kỳ, carry‑over, burndown & velocity.

Thêm Projects/Milestones và Strategic; xây dựng trang Project với health và progress.

Hoàn thiện Notifications/Activity (in‑app/email), @mention, watch/follow.

Tạo template & label system; tích hợp Drive Hub basic (upload, attach file).

P3 – Marketing layer (3–5 tuần)

AI Studio v1: cấu hình agent preset, tạo nháp từ RAG (Workspace/Team/Project/Drive), luồng Generate → Review → Submit.

Social Scheduler v1: kết nối OAuth với FB/IG/Zalo; cho phép schedule post, queue & retry, webhook result.

Analysis v0: Dashboard velocity/triage/throughput; hiển thị data theo Team/Project/Phase.

Tối ưu performance, test hệ thống.

P4 – Mở rộng (kế tiếp)

Cải thiện dashboard marketing (reach/CTR/conv/cadence) và productivity (cycle time, issue age).

Thêm CRM nhẹ: thực thể Customer & Deal, pipeline bán hàng đơn giản.

Hỗ trợ custom fields, export/import, public API; nâng cấp i18n và a11y.

Nguồn lực
Vai trò	Người tham gia	Nhiệm vụ chính
Product Manager	[Tên PM]	Điều phối roadmap, viết specs, xác định KPI.
Tech Lead	[Tên TL]	Thiết kế kiến trúc, review code, định hướng kỹ thuật.
FE Engineers	[Danh sách]	Xây dựng UI shell, Task page, AI Panel, Scheduler.
BE Engineers	[Danh sách]	Thiết kế API, mô hình dữ liệu, tích hợp OAuth & Drive.
Designer	[Tên designer]	Thiết kế UI/UX, chuẩn hoá styleguide.
QA/Tester	[Tên]	Viết test, đảm bảo UI & logic hoạt động đúng.
Data Analyst	[Tên]	Xây dựng dashboard, tính toán KPI, hỗ trợ planning.
Quy trình & giao tiếp

Scrum/Kanban với sprint 1–2 tuần; daily stand‑up; weekly demo.

PRD và specs lưu ở thư mục docs/; mô‑đun phân tách rõ trong docs/MODULES/.

Mỗi issue có acceptance criteria rõ ràng; test viết đồng thời với code.

Sử dụng Linear (hoặc tool tương tự) để theo dõi backlog và velocity. Mỗi Epic tương ứng với P1, P2, P3, P4.

Rủi ro dự án & cách xử lý

Phạm vi thay đổi – Định nghĩa kỹ lưỡng acceptance criteria và lock scope trong mỗi sprint; nếu có yêu cầu mới, đẩy sang backlog sau.

Thiếu nhân sự hoặc chậm trễ – Điều chỉnh timeline; ưu tiên chức năng quan trọng; cắt giảm tính năng phụ.

Độ phức tạp tích hợp – Tách nhỏ module; thử nghiệm với môi trường sandbox trước khi triển khai rộng rãi; giữ tầng abstraction rõ ràng.

Bối cảnh & giả định (CONTEXT.md):
Bối cảnh & Giả định

Tài liệu này cung cấp bối cảnh kinh doanh và các giả định kỹ thuật quan trọng cho dự án Marketing OS. Việc hiểu rõ ngữ cảnh giúp toàn đội ra quyết định nhất quán và tránh sai lệch mục tiêu.

Bối cảnh kinh doanh

Công ty/Agency marketing (AiM) cần một công cụ tổng hợp để lập kế hoạch, điều phối công việc và đánh giá hiệu quả chiến dịch. Các giải pháp hiện tại (Spreadsheet, Slack, email) phân tán và thiếu tính tự động.

Các đội ngũ khác nhau (content, design, social media, finance) phải hợp tác chặt chẽ, nhưng ngôn ngữ và quy trình không đồng nhất. Việc đổi tên khái niệm (Initiative → Strategic, Issue → Task, Cycle → Phase) nhằm tạo sự quen thuộc và gần gũi với nghiệp vụ marketing.

Tính năng AI đang trở thành bắt buộc trong sản xuất nội dung. Phần mềm cần tích hợp AI để tạo nháp, tối ưu caption, dự đoán lịch đăng hiệu quả.

Nhu cầu phân tích dữ liệu marketing (reach, CTR, conversion) và productivity để đo lường ROI và cải thiện quy trình làm việc.

Giả định kỹ thuật

Các dịch vụ AI (GPT/Gemini) có sẵn qua API và chi phí sử dụng được duyệt; mô hình có thể thay đổi nhưng giao diện gọi API ổn định.

Các nền tảng mạng xã hội (Facebook, Instagram, Zalo) cho phép truy cập qua OAuth 2.0; chúng cung cấp API đủ để đăng bài, tải media và nhận webhook kết quả.

Người dùng đã có tài khoản Google Drive (hoặc dịch vụ lưu trữ tương đương) và có phân quyền rõ ràng. Drive được sử dụng làm kho lưu trữ tài liệu/sắp xếp template.

Hệ thống có thể sử dụng cơ sở hạ tầng cloud (GCP/AWS/Azure) hỗ trợ container, queue và database tiêu chuẩn.

Ràng buộc & tiêu chuẩn

Luật bảo vệ dữ liệu: cần tuân thủ GDPR và các quy định tương đương (dù khách hàng có thể ở Việt Nam) vì dữ liệu đôi khi đi qua server quốc tế. Phải cung cấp quyền xoá dữ liệu cá nhân khi được yêu cầu.

SOC 2: kế hoạch dài hạn hướng tới chứng nhận SOC 2, yêu cầu audit log, phân quyền chặt chẽ và mã hoá dữ liệu nhạy cảm.

Múi giờ: mặc định Asia/Ho_Chi_Minh; cần quản lý chính xác thời gian đăng bài và sự kiện để tránh lệch múi giờ.

Môi trường đa ngôn ngữ: sản phẩm có thể phát triển ra nước ngoài; cần từ đầu hỗ trợ đa ngôn ngữ (i18n) và cấu trúc file locale.

Phạm vi ngoài (Out of scope)

Thương mại điện tử, thanh toán, hệ thống CRM đầy đủ – chỉ làm CRM nhẹ (Customer/Deal) để hỗ trợ pipeline bán hàng đơn giản.

Quản lý quảng cáo trả phí (Facebook Ads, Google Ads) không thuộc phạm vi hiện tại; có thể mở rộng sau.

Deep personalization bằng AI chưa nằm trong kế hoạch; AI tập trung vào soạn nội dung, phân loại và dự báo lịch đăng.

Lợi ích kỳ vọng

Tăng tốc độ tạo nội dung nhờ AI, giảm thiểu thời gian giao tiếp thủ công giữa các đội.

Minh bạch quy trình và tiến độ dự án; mọi thành viên truy cập thông tin ở cùng một nơi.

Đo lường hiệu quả chiến dịch theo thời gian thực, từ đó tối ưu hoá chiến lược marketing và phân bổ nhân lực.

📑 Module Docs

Teams & Members:
Module: Teams & Members (RBAC)
Mục đích

Cung cấp cơ chế tổ chức người dùng thành các Team trong Workspace, quản lý vai trò và quyền (RBAC) để đảm bảo truy cập đúng phạm vi. Mỗi Team đại diện cho một nhóm chịu trách nhiệm về một phần công việc (ví dụ: Content, Design, Social, Finance…).

User stories

PM muốn tạo Team mới với key duy nhất (AIM2, SOC1…) để gán Task và Project.

Admin muốn mời/đổi role Member hoặc xóa họ khỏi Team.

Member muốn xem những Teams mình tham gia và quyền của mình.

Guest cần tham gia Project với quyền đọc/comment mà không truy cập các Project khác.

API surface (giả định REST)
Method & Endpoint	Mô tả	Yêu cầu quyền
POST /teams	Tạo Team mới (name, key, workflowId)	Owner/Admin
PATCH /teams/{id}	Cập nhật tên/team key, workflow	Owner/Admin
GET /teams/{id}	Lấy thông tin chi tiết Team & member list	Member
DELETE /teams/{id}	Xoá Team và toàn bộ dữ liệu liên quan (cẩn trọng)	Owner
POST /teams/{id}/invite	Mời người dùng (email, role)	Owner/Admin
PATCH /memberships/{id}	Đổi role hoặc disable member	Owner/Admin
GET /workspaces/{id}/members	Danh sách tất cả thành viên trong workspace	Owner/Admin
Quy tắc & xử lý đặc biệt

Team key chỉ gồm chữ hoa và số, dài tối đa 4 ký tự, không trùng trong workspace.

Khi xóa một Team, cần xác nhận hai lần vì mọi Task và Project thuộc Team sẽ bị huỷ hoặc phải được chuyển sang Team khác.

Role matrix cơ bản:

Role	Team Settings	Quản lý thành viên	Tạo/Chỉnh sửa Task/Project	Xem báo cáo
Owner	✓	✓	✓	✓
Admin	✓	✓	✓	✓
Member	✗	✗	✓	✓
Guest	✗	✗	✗ (chỉ comment)	✓ (giới hạn)
UI / UX

Danh sách Teams: tại sidebar/workspace settings, hiển thị các Team user tham gia; có nút tạo Team mới (bật modal/drawer).

Trang Team Settings: gồm thông tin chung (name, key), tab Members (hiển thị danh sách, role, status), tab Workflow (states), tab Permissions & Labels.

Mời thành viên: sử dụng drawer: nhập email + chọn role; gửi mail mời; hiển thị trạng thái “Invited”.

Pagination & Search: khi workspace có nhiều thành viên, hỗ trợ tìm kiếm và phân trang trong trang Members.

Acceptance criteria

Tạo Team mới với key chưa tồn tại. Nếu key bị trùng hoặc chứa ký tự không hợp lệ, trả lỗi rõ ràng.

Mời một email hợp lệ; nếu người dùng chưa có tài khoản, tự động tạo trạng thái “Invited”.

Cập nhật role của thành viên có hiệu lực ngay lập tức; phải log hành động vào audit log.

Member/Gues không thể chỉnh sửa các cài đặt Team, không thể thêm/xóa thành viên.

Khi xóa Team, hệ thống yêu cầu xác nhận và thông báo các dữ liệu liên quan sẽ bị huỷ; xóa thành công phải ghi lại hành động và gửi thông báo tới Owner.

Telemetry & Metrics

Số lượng Team trong mỗi Workspace.

Số người dùng active/invited/disabled.

Tần suất mời thành viên, tỷ lệ chấp nhận lời mời.

Lượng thay đổi role, số lần chuyển Project/Task sang Team khác (nếu có).

Triage Inbox:
Module: Triage Inbox
Mục đích

Triage Inbox là nơi tiếp nhận và xử lý các yêu cầu công việc mới (Task) trước khi chúng được đưa vào backlog hoặc Phase. Tính năng này giúp đội ngũ sắp xếp, ưu tiên và gán công việc đúng người, đúng thời điểm.

Nguồn vào

Quick add / UI: người dùng tạo Task từ form đơn giản (tiêu đề + mô tả).

Email/API: import từ email/ticket system hoặc API bên ngoài.

Integrations: chat bot, form web, mạng xã hội (với các message/bình luận cần follow up).

Hành động

Trong Inbox, mỗi item (Task) có thể:

Action	Kết quả
Accept	Thêm Task vào backlog của Team, gán trạng thái bắt đầu (hoặc Triage → To Do).
Decline	Đánh dấu là không thực hiện; lưu lý do vào comment/log; có thể gửi phản hồi tới nguồn vào.
Merge	Gộp với Task khác; giữ lại một Task chính và chuyển comment/attachment.
Assign	Chọn người chịu trách nhiệm (assignee) và Team, set trạng thái mặc định.
Snooze	Ẩn Task khỏi Inbox trong một khoảng thời gian nhất định (1 ngày, 1 tuần, custom).
Set priority	Gán mức độ ưu tiên (0–4).
Label	Gắn các label liên quan (bug/feature/marketing, medium/high…).
Rules & Automation

Auto‑assignment: cấu hình rule gán Task dựa trên label/keyword (ví dụ: “bug” → assign QA; “SEO” → assign Content).

Auto‑label: khi mô tả chứa từ khoá nhất định, tự gắn label (ví dụ: “facebook ads” → label ads).

Duplicate detection: so sánh tiêu đề + mô tả; gợi ý khi Task trùng lặp đã tồn tại.

Threshold notifications: nếu Inbox có quá n Task chờ xử lý hoặc triage time trung bình vượt ngưỡng, gửi cảnh báo tới PM/Admin.

UI / UX

Inbox view: hiển thị như bảng danh sách, có thể lọc theo nguồn (Email/API/UI), thời gian tạo, label, assign… Sắp xếp theo createdAt (mới nhất trên cùng).

Bulk actions: cho phép chọn nhiều Task và thực hiện Accept/Decline/Assign cùng lúc.

Preview panel: khi click vào một item, mở panel để xem mô tả, attachment, và các thông tin khác (nguồn, submitter).

Action bar: hiển thị nút Accept, Decline, Merge, Assign, Snooze, Set priority và menu mở rộng.

Rules settings: trong Team Settings, tab “Triage Rules” để người quản trị tạo và sắp xếp rule.

Acceptance criteria

Khi một Task mới được tạo qua bất kỳ nguồn nào, nó xuất hiện trong Inbox của đúng Team/Triage board.

Người dùng có quyền triage (Owner/Admin hoặc user được ủy nhiệm) nhìn thấy action bar đầy đủ; Member/Guest chỉ xem.

Accept sẽ di chuyển Task khỏi Inbox và set state đầu tiên của workflow Team; đồng thời log hành động với timestamp và người thực hiện.

Decline yêu cầu nhập lý do; lý do được thêm vào comment của Task và gửi feedback cho nguồn (nếu định nghĩa).

Merge hỏi người dùng chọn Task giữ lại; chuyển comment/attachment sang Task chính.

Snooze cho phép chọn thời gian; sau thời gian snooze, Task xuất hiện lại ở đầu Inbox.

Rule tự động áp dụng đúng khi tạo Task mới (ví dụ auto‑assign). Cần có trang để bật/tắt rule hoặc sắp xếp ưu tiên rule.

Tính năng duplicate detection chỉ gợi ý; quyết định merge thuộc quyền người dùng.

Telemetry & Metrics

Triage time: thời gian trung bình từ khi Task xuất hiện đến khi được Accept/Decline/Merge/Snooze (theo Team và loại nguồn).

Inbox queue size: số lượng Task chưa xử lý theo thời gian.

Accept vs Decline ratio: tỷ lệ Task được tiếp nhận và bị loại bỏ.

Automation effectiveness: % Task được auto‑assign/auto‑label; số lượt duplicate detection xảy ra.

Rule error rate: tỷ lệ rule phát sinh lỗi (vì cấu hình sai, gán sai). Các rule có thể được bật/tắt tạm thời.

Workflow & Status:
Module: Workflow & Status
Mục đích

Workflow định nghĩa chuỗi trạng thái mà một Task có thể đi qua trong vòng đời của nó. Mỗi Team có thể tùy biến workflow phù hợp với quy trình riêng, nhưng luôn gắn với các category chuẩn để đồng bộ dữ liệu (unstarted, started, completed, canceled).

Thực thể liên quan

Workflow – chứa danh sách các State theo thứ tự sắp xếp.

State – mỗi trạng thái có:

id – UUID.

name – tên hiển thị (Ví dụ: “Backlog”, “In Progress”, “Review”).

category – unstarted / started / completed / canceled (dùng để tính toán velocity, lead time).

type – active / non‑active (dùng cho UI board).

color – optional (UI accent).

Mỗi Task có một stateId thuộc workflow của Team.

Mặc định

Template (có thể chỉnh sửa):

Tên	Category
Backlog	unstarted
Selected	unstarted
In Progress	started
Review	started
Done	completed
Canceled	canceled

Team mới được tạo sẽ copy workflow này và có thể chỉnh sửa.

Tùy biến

Admin/Owner có thể:

Thêm trạng thái mới (chọn category).

Xóa trạng thái không dùng (trừ khi còn Task ở trạng thái đó).

Đổi tên và sắp xếp lại thứ tự.

Category không được thay đổi để đảm bảo dữ liệu đồng bộ (unstarted không thể chuyển thành started…)

Có thể gắn auto‑transition: ví dụ khi Merge PR hoặc khi Social post thành công, Task tự chuyển trạng thái (workflow hook).

Quan hệ & giới hạn

Transitions: không giới hạn; người dùng có thể chuyển Task từ bất kỳ trạng thái nào sang bất kỳ trạng thái nào (phù hợp với tính linh hoạt của Linear). Tuy nhiên, có thể cấu hình cảnh báo nếu chuyển từ “Done” về “In Progress”.

Subtask: trạng thái của subtask không ảnh hưởng trực tiếp đến parent; nhưng khi tất cả subtask hoàn thành, UI có thể gợi ý chuyển parent sang “Done”.

Blockers: Task bị block không thể chuyển sang category completed nếu có relation “blocked‑by” chưa hoàn thành (opt‑in). Hệ thống hiển thị cảnh báo và đề xuất chuyển trạng thái blocker.

Estimation & Priority

Estimate: số nguyên (story point) hoặc giờ; có thể ẩn nếu team không dùng. Estimation được sử dụng tính velocity và burn chart.

Priority: giá trị 0–4 (0 = unknown, 1 = lowest, 4 = highest); dùng cho sorting và filter.

UI / UX

Board view: mỗi trạng thái là một cột; Task có thể kéo thả giữa các cột.

List view: cột “Status” có thể click để chuyển trạng thái; sử dụng dropdown hiển thị danh sách đầy đủ.

Workflow settings: tab trong Team Settings; hiển thị danh sách trạng thái theo thứ tự; cho phép drag‑n‑drop để sắp xếp; nút thêm/xóa/trùng tên; hiển thị category.

Estimation: hiển thị icon/số trên Task; edit bằng click vào badge.

Priority: biểu tượng hoặc màu sắc; có filter quick như “High priority”.

Acceptance criteria

Khi Team mới được tạo, workflow mặc định được tạo cùng.

Admin/Owner có thể tạo/xoá/sắp xếp trạng thái; hành động được lưu audit log.

Khi xóa trạng thái, hệ thống yêu cầu chọn trạng thái đích để chuyển Task hoặc từ chối xóa.

Người dùng kéo thả Task sang cột mới, hệ thống cập nhật stateId và log thay đổi.

Khi tất cả subtask hoàn thành, UI gợi ý chuyển parent Task sang trạng thái Done.

Nếu bật tuỳ chọn “Blockers prevent completion”, Task bị block không thể chuyển sang trạng thái thuộc category completed.

Metrics & Reporting

Cycle/Phase time: thời gian Task ở mỗi category; trung bình lead time và cycle time.

Velocity: số điểm (estimate) hoàn thành mỗi Phase; số Task hoàn thành.

Status distribution: phân bổ Task ở mỗi trạng thái; highlight bottleneck (ví dụ quá nhiều Task ở Review).

Priority breakdown: số Task theo từng mức priority.

Phases/Cycles:
Module: Phases (Cycles)
Mục đích

Phases (tương tự cycle hoặc sprint) giúp nhóm chia nhỏ công việc thành các chu kỳ lặp lại, thường từ 1–4 tuần. Việc sử dụng Phases cho phép nhóm đo lường velocity, lập kế hoạch ngắn hạn và cải thiện dự báo.

Cấu trúc dữ liệu

Phase{id, teamId, name, startDate, endDate, sequenceIndex, status, rolloverStrategy} như định nghĩa trong tài liệu Data Model.

status có các giá trị: planned, active, completed.

rolloverStrategy xác định cách chuyển Task chưa hoàn thành sang Phase tiếp theo: carry‑over (mặc định), close‑incomplete (chuyển sang Done) hoặc no‑rollover (bỏ trạng thái Phase).

Thiết lập

Mỗi Team có thể bật hoặc tắt Phases. Khi bật, cần chọn độ dài và ngày bắt đầu. Sau khi cấu hình, Phase tự tái tạo theo lịch.

Phase có thể bị khóa trong khi active để tránh thay đổi thời gian giữa chừng (ngoại trừ Owner/Admin).

Khi khởi tạo, tên phase có thể tự động theo mẫu: YYYY‑MM Sprint N hoặc tuỳ chỉnh.

Tính năng

Scope planning: trước khi Phase bắt đầu, nhóm kéo các Task dự định hoàn thành vào Phase (từ backlog).

Carry‑over: khi Phase kết thúc, tất cả Task chưa hoàn thành được chuyển sang Phase tiếp theo hoặc xử lý theo rolloverStrategy.

Insights: hỗ trợ biểu đồ burndown (Scope vs Completed mỗi ngày) và velocity (Story points hoàn thành).

Phase board: view riêng hiển thị Task trong Phase hiện tại, theo workflow.

UI / UX

Phase Settings: trong Team Settings, tab “Phases” để bật/tắt và thiết lập độ dài (1–4 tuần), ngày bắt đầu.

Phase indicator: hiển thị tên Phase hiện tại ở header và trên Task (badge).

Planning mode: trước khi Phase start, board có trạng thái planning; người dùng kéo Task vào danh sách “Planned for next Phase”.

Reports: trang Phase Report hiển thị burndown chart, velocity, scope creep (change in planned scope), danh sách Task hoàn thành/không hoàn thành.

Carry‑over: khi Phase kết thúc, hiển thị modal cho Owner/Admin với tuỳ chọn rollover strategy nếu muốn thay đổi.

Acceptance criteria

Người dùng có thể bật Phases trong Team Settings; mặc định tắt khi Team mới được tạo.

Sau khi thiết lập, Phase đầu tiên được tạo với ngày bắt đầu và độ dài đã chọn.

Khi Phase hoạt động, hệ thống hiển thị badge Phase trên Task; người dùng có thể kéo Task vào hoặc ra khỏi Phase khi Phase đang ở trạng thái planned hoặc active (tuỳ cài đặt).

Khi Phase kết thúc, Task chưa hoàn thành được xử lý theo rolloverStrategy; log hành động trong activity.

Burndown chart cập nhật theo thời gian thực (gồm scope ban đầu, scope thay đổi, completed).

Velocity được tính bằng tổng estimate hoàn thành; có thể xem velocity trung bình qua nhiều Phase.

Metrics

Velocity (points per Phase): tổng estimation được hoàn thành.

Lead time per Task: thời gian từ khi Task được đưa vào Phase đến khi hoàn thành.

Scope creep: số lượng hoặc điểm Task được thêm vào/loại bỏ giữa chừng.

Carry‑over ratio: % Task chuyển sang Phase tiếp theo.

Projects & Strategic:
Module: Projects & Strategic
Mục đích

Projects và Strategic (sáng kiến) giúp nhóm tổ chức công việc ở cấp độ cao hơn Task. Projects là tập hợp các nhiệm vụ nhằm đạt được một mục tiêu cụ thể; Strategic gom nhiều Projects để thực hiện một mục tiêu dài hạn của công ty. Module này mô tả cách tạo, quản lý và theo dõi Projects cùng với các Milestones và sức khoẻ (health).

Projects
Thuộc tính cơ bản

id, teamId, strategicId, name, description.

health: on‑track / at‑risk / off‑track.

ownerId: người chịu trách nhiệm chính.

milestones: danh sách milestone (xem bên dưới).

progress: % hoàn thành dựa trên số Task đã Done so với tổng Task gắn vào Project.

status: planned / active / completed / on hold.

Milestones

Milestone chia Project thành các giai đoạn nhỏ để dễ quản lý tiến độ.

Thuộc tính: id, projectId, name, description, startDate, dueDate, status (not started / in progress / completed).

Có thể gắn Task vào Milestone (qua field milestoneId trong Task).

UI hiển thị milestone dưới dạng timeline hoặc danh sách, cho phép thay đổi thứ tự và ngày.

Health & Progress

Progress = (số Task Done / tổng số Task trong Project) × 100%.

Health được đánh giá thủ công (PM/Owner chọn) hoặc tự động dựa trên velocity, due date, scope creep.

Khi bất kỳ milestone bị trễ hoặc scope creep vượt ngưỡng, hệ thống có thể gợi ý chuyển health thành at‑risk hoặc off‑track.

UI / UX

Project List: hiển thị Projects theo Team; có filter theo status, owner, strategic.

Project Detail Page: gồm summary (progress, health, due date), danh sách milestones, view Task (board/list) chỉ chứa Task thuộc Project, bảng members và activity.

Milestones timeline: đồ thị hoặc list hiển thị mốc quan trọng; có drag‑n‑drop thay đổi order và due date.

Health indicator: icon màu xanh (on‑track), vàng (at‑risk), đỏ (off‑track); hiển thị tooltip mô tả.

Acceptance criteria

Tạo Project với tên và Team; có thể liên kết với Strategic hoặc để trống.

Thêm milestone mới: nhập tên, startDate, dueDate; milestone hiển thị đúng trên timeline và có thể gán Task vào.

Health có thể thay đổi thủ công bởi Owner/Admin; thay đổi được log.

Progress cập nhật khi Task được tạo, chuyển trạng thái hoặc xoá; hiển thị chính xác % hoàn thành.

Tại trang Project, có thể kéo Task để gán cho milestone hoặc thay đổi order; UI phản hồi ngay và lưu trạng thái.

Strategic (Initiatives)

Strategic giúp nhóm theo dõi các mục tiêu dài hạn, tập hợp nhiều Projects. Cấu trúc đơn giản nhưng cung cấp cái nhìn tổng quan.

Thuộc tính

id, workspaceId, name, description, ownerId.

status: on‑track / at‑risk / off‑track.

projects: danh sách Project thuộc Strategic.

progress: tính trung bình dựa trên progress của Projects.

healthNotes: ghi chú lý do nếu ở trạng thái at‑risk/off‑track.

UI / UX

Strategic Dashboard: hiển thị danh sách Strategic, sức khoẻ và số Project đang chạy; filter by status.

Strategic Detail Page: bảng tổng hợp progress/health của mọi Project; gợi ý hành động (ví dụ Project bị trễ milestone).

Add Project to Strategic: trên trang Project hoặc Strategic, có tùy chọn add/remove Project khỏi Strategic.

Status indicator: giống Projects; support tooltip giải thích.

Acceptance criteria

Tạo Strategic với tên và owner.

Liên kết Project với Strategic và hiển thị ngay trong list.

Tính progress và health của Strategic đúng theo Project.

Thay đổi trạng thái (status) thủ công hoặc gợi ý tự động dựa trên health của Project (vượt ngưỡng warning).

Xóa Strategic yêu cầu xác nhận và không xoá các Project bên trong (chỉ remove liên kết).

Metrics & Reporting

Progress vs health: so sánh progress của Project/Strategic với health để phát hiện mismatch.

Milestone overdue: số milestone quá hạn; % milestone completed on time.

Strategic coverage: % Task/Project được liên kết với Strategic; đảm bảo chiến lược rõ ràng.

Portfolio overview: biểu đồ phân bổ resources theo Strategic, Team hoặc owner.

AI Studio:
Module: AI Studio (In‑Task)
Mục đích

AI Studio cung cấp công cụ tạo nội dung hỗ trợ người dùng ngay trong trang Task. Tính năng này cho phép chọn agent (vai trò AI) phù hợp, cung cấp ngữ cảnh (nguồn RAG) và nhận kết quả với citation. Người dùng có thể chỉnh sửa bản nháp và nộp trực tiếp vào Task.

Agents & khả năng

content‑creator – viết bài blog, caption, mô tả sản phẩm dựa trên brief và dữ liệu từ Drive, Workspace, Team hoặc Project.

designer‑assist – gợi ý ý tưởng hình ảnh, layout, moodboard; tương tác với model hình ảnh (Gemini).

finance‑check – phân tích chi phí marketing, ROI, chi phí trên mỗi lượt chuyển đổi; trả về bảng hoặc insight.

Agents khác có thể được thêm sau (ads copywriter, social engagement analyst, v.v.).

Luồng sử dụng

Chọn agent: ở tab AI Panel trong Task, người dùng chọn loại agent phù hợp với nhu cầu.

Chọn nguồn RAG: tuỳ task, người dùng chọn nguồn: Workspace/Team/Project, Drive folder, hay chỉ tập trung vào file đính kèm. Có thể chọn nhiều nguồn.

Generate: hệ thống gửi yêu cầu tới AI Service; service thu thập dữ liệu theo RAG, soạn prompt và gọi model GPT/Gemini.

Review & Edit: người dùng nhận bản nháp trong editor; có thể chỉnh sửa, thêm bớt, yêu cầu chỉnh sửa tiếp (regenerate).

Submit: sau khi hài lòng, người dùng nhấn Submit; nội dung được chèn vào comment của Task hoặc được lưu dưới dạng file đính kèm. Citation nguồn được thêm vào cuối nội dung. Thao tác được log.

API & Endpoint (giả định)
Endpoint	Mô tả
POST /ai/generate	Body: {taskId, agent, sources, promptOverride?}. Trả về draft.
POST /ai/submit	Body: {taskId, draftId, content}. Lưu nội dung vào Task.
GET /ai/history	Query: taskId. Trả về danh sách draft đã tạo, timestamp, agent.
RAG sources syntax

workspace:// – toàn bộ data workspace (notes, docs).

team://{teamId} – dữ liệu thuộc Team.

project://{projectId} – dữ liệu thuộc Project.

drive://{folderId} – chỉ dữ liệu trong folder.

task://{taskId} – đính kèm/attachment của Task hiện tại.

UI / UX

AI Panel nằm ở tab riêng hoặc overlay; mở bằng nút “AI Assist” trong Task.

Cho phép chọn agent và nguồn trong dropdown đa chọn.

Editor hỗ trợ markdown, có nút “Regenerate” và “Submit”.

Từng draft hiển thị metadata (agent, ngày giờ) và có nút “Load” để chỉnh lại.

Khi submit, hệ thống hiển thị toast xác nhận và cuộn xuống comment vừa tạo.

Guardrails & PII

Không trả về dữ liệu nhạy cảm (PII); AI Service phải filter nội dung và mask thông tin nếu phát hiện dữ liệu cá nhân.

Các prompt và kết quả được log để đánh giá chất lượng nhưng phải xóa thông tin người dùng.

Citation bắt buộc: kèm link hoặc id nguồn RAG (file, doc) ở cuối nháp.

Acceptance criteria

Người dùng có thể mở AI Panel và chọn agent, nguồn RAG.

Draft được tạo trong ≤ 5 giây với p50, p90 ≤ 10 giây; có citation nguồn.

Người dùng có thể chỉnh sửa draft, regenerate; lịch sử lưu tối đa N bản (có thể cấu hình).

Khi submit, nội dung được thêm vào comment hoặc file đính kèm; citation được chèn và version được lưu.

Nếu AI không tìm thấy dữ liệu hoặc model lỗi, hiển thị thông báo rõ ràng và cho phép thử lại.

PII được ẩn hoặc loại bỏ trước khi hiển thị cho người dùng.

Telemetry & Metrics

Generation latency: thời gian từ khi gọi API đến khi nhận kết quả.

Usage rate: số lượt gọi AI theo agent; % Task có AI draft.

Adoption: số draft được submit; feedback rating (nếu thu thập).

Error rate: số lần AI trả lỗi (timeout, invalid source) / tổng số lần gọi.

RAG source distribution: thống kê nguồn được sử dụng (workspace, team, drive…).

Social Integrations & Scheduler:
Module: Social Integrations & Scheduler
Mục đích

Cho phép người dùng kết nối với tài khoản mạng xã hội (Facebook, Instagram, Zalo…), soạn và lên lịch đăng bài trực tiếp từ Task, và tự động đăng theo lịch. Giúp đồng bộ quy trình sản xuất nội dung với việc xuất bản.

Kết nối tài khoản

OAuth: sử dụng OAuth 2.0 để liên kết tài khoản. Người dùng ủy quyền app của chúng ta truy cập Facebook Page/Instagram/Zalo OA.

Token vault: token truy cập được lưu ở vault (ví dụ HashiCorp Vault) dưới dạng mã hoá; chỉ dịch vụ Social có quyền giải mã.

Roles: chỉ Owner/Admin mới có quyền kết nối tài khoản; Member sử dụng token đã kết nối.

Đăng bài và lên lịch
Thuộc tính Scheduled Post

id, taskId, socialAccountId, caption, mediaRefs (danh sách file từ Drive), scheduledAt, status (scheduled/published/failed/canceled), postResultId.

Quy trình

Tạo schedule: trên Task, người dùng chọn tài khoản MXH, viết caption, chọn media từ Drive, chọn thời gian đăng.

Queue: khi bấm “Schedule”, dữ liệu được lưu vào DB và gửi vào hàng đợi (Queue service).

Execution: Worker đọc queue, khi đến thời gian, gọi API của mạng xã hội để đăng; ghi log success/failure.

Webhook: social platform gửi callback về (nếu có); cập nhật status, postResultId, platformPostId, url.

Update Task: link bài post và trạng thái được đính vào Task; nếu lỗi, Task chuyển trạng thái trở lại “In Progress” hoặc tạo notification.

Retry & Error handling

Nếu đăng thất bại do lỗi tạm thời (rate limit, network), worker sẽ retry theo backoff (ví dụ 5 phút, 30 phút, 2 giờ).

Sau N lần retry không thành công, status chuyển thành failed và gửi thông báo tới assignee.

Thông tin lỗi được log và hiển thị trong Task.

UI / UX

Schedule panel: trong Task, tab “Schedule” hoặc panel riêng. Form gồm: chọn tài khoản, nhập caption (markdown hỗ trợ emoji), chọn media (image/video), chọn thời gian đăng (đồng bộ với timezone).

List of scheduled posts: hiển thị trong Task detail và trên trang Social Scheduler; có thể filter theo trạng thái (scheduled/published/failed), tài khoản, thời gian đăng.

Status indicator: icon màu xanh (published), cam (scheduled), đỏ (failed). Hover để xem chi tiết lỗi và link post.

Cancel/Reschedule: khi post chưa đăng, người dùng có thể hủy lịch hoặc chỉnh thời gian; thay đổi được log.

Integration notes

Facebook & Instagram: sử dụng Graph API; yêu cầu quyền pages_manage_posts, publish_pages, instagram_basic…; có khác biệt giữa Page và Personal account (chỉ Page được hỗ trợ).

Zalo: sử dụng Zalo OA API; cần đăng ký OA và cấp quyền.

Rate limits: mỗi nền tảng có giới hạn; cần theo dõi và báo cáo.

Content formats: caption length, loại media, hỗ trợ video: cần tuân thủ guideline từng nền tảng.

Acceptance criteria

Owner/Admin có thể kết nối và quản lý token cho SocialAccount; token lưu trữ an toàn.

Người dùng chọn tài khoản, nhập caption, chọn media và thời gian; khi nhấn Schedule, ScheduledPost được tạo với status scheduled.

Worker đăng bài đúng giờ; cập nhật status thành published và đính link post vào Task.

Nếu lỗi, status đổi sang failed; hiển thị thông báo và lý do.

Có thể hủy hoặc đổi thời gian cho post đang scheduled.

Mọi thao tác đăng/xoá/chỉnh sửa post được log và hiển thị trong Activity của Task.

Metrics

Post success rate: tỷ lệ ScheduledPost được đăng thành công.

Queue latency: chênh lệch giữa thời gian dự kiến và thời gian thực tế đăng bài.

Error types: thống kê lỗi theo loại (token expired, invalid media…).

Account usage: số lần đăng theo từng SocialAccount và nền tảng; monitor quota gần hết.

Drive Hub & RAG:
Module: Drive Hub & RAG
Mục đích

Drive Hub giúp tổ chức, lưu trữ và truy xuất tài liệu (docs, templates, assets) cho Workspace, Team và Project. Kết hợp với RAG (Retrieval‑Augmented Generation), module này cho phép AI tìm kiếm và tham chiếu tài liệu khi tạo nội dung.

Cấu trúc thư mục gợi ý
/Company/AiM
  ├─ Business/       (tài liệu về công ty, quy trình nội bộ)
  ├─ Product/       (spec sản phẩm, roadmap, API docs)
  ├─ Specs/         (Yêu cầu dự án, PRD, kiến trúc)
  ├─ Templates/     (Content brief, caption, post plan…)
  ├─ Assets/        (Hình ảnh, video, audio, slide)
  └─ … (các thư mục khác theo nhu cầu)

DriveFolder & DriveFile

Mỗi thư mục (DriveFolder) có id, name, path, parentId.

Mỗi file (DriveFile) có id, name, mimeType, folderId, url, ownerId, size, createdAt, modifiedAt.

Có thể gắn file với Task bằng attachment; lưu attachmentId trong Task hoặc Activity.

Indexing & RAG

Indexing service quét file mới/cập nhật định kỳ (ví dụ mỗi 5 phút):

Thu thập title, content (với file text, docs), tags (từ metadata hoặc gắn thủ công).

Tạo embedding từ nội dung để lưu vào vector store.

Cập nhật vectorId trong DB để hỗ trợ RAG.

Tôn trọng quyền truy cập: chỉ index file người dùng hiện tại có quyền đọc.

Search & retrieve: khi AI Service nhận yêu cầu RAG, nó sử dụng sources như workspace://, team://, project://, drive://folderId để truy vấn vector store; sau đó lấy nội dung file gốc để sử dụng trong prompt.

Template management

Template được lưu dưới dạng Markdown/JSON trong folder Templates/.

Khi tạo Task/Project, người dùng có thể chọn template; nội dung được copy và chèn vào mô tả Task hoặc Project.

Template có metadata (type, tags, ownerId, version) để dễ tìm kiếm và quản lý; phiên bản mới không ghi đè phiên bản cũ.

Permissions

Quyền truy cập Drive mirror quyền Workspace/Team/Project: nếu người dùng không thuộc Team, họ sẽ không thể tìm kiếm hoặc tải file trong folder Team.

Các file đính kèm Task chỉ hiển thị cho thành viên có quyền xem Task đó.

Indexing service phải kiểm tra quyền người gọi và chỉ trả về embedding cho file được phép.

UI / UX

File picker: khi đính kèm file vào Task hoặc chọn media cho Social Post, hiển thị picker (cây thư mục). Có tìm kiếm theo tên/tag và filter theo loại file.

Drive overview: trang riêng (trong workspace) để quản lý file/folder; hỗ trợ upload, move, rename, delete (nếu quyền cho phép).

Template gallery: hiển thị tất cả template với preview; filter theo loại (content brief, caption).

Attachment display: trong Task, file đính kèm hiển thị thumbnail (hình ảnh) hoặc icon (tài liệu) và có nút mở trực tiếp.

Acceptance criteria

Indexing service quét file mới và cập nhật vector store trong vòng 5 phút.

Khi AI gọi RAG, chỉ nhận được file thuộc nguồn được phép; dữ liệu nhạy cảm không bị leak.

Người dùng có thể tìm kiếm và chọn file từ Drive để đính kèm; action lưu lịch sử.

Template lựa chọn đúng; clone content vào Task/Project mà không sửa bản gốc.

Phân quyền Drive tuân thủ Workspace/Team/Project; không ai ngoài phạm vi được truy cập file.

Metrics

Index latency: thời gian từ lúc file thay đổi tới lúc index cập nhật.

RAG hit rate: % lần AI tìm thấy thông tin hữu ích trong Drive (dựa trên feedback hoặc phân tích).

Template usage: số lần mỗi template được dùng; giúp cải thiện và loại bỏ template ít dùng.

File attachment count: thống kê số file đính kèm trên mỗi Task/Project.

Analysis & Dashboards:
Module: Analysis & Dashboards
Mục đích

Cung cấp cái nhìn trực quan về hiệu quả marketing và năng suất làm việc của đội ngũ. Dashboard hỗ trợ ra quyết định nhanh, theo dõi tiến độ và phát hiện vấn đề tắc nghẽn.

Phân loại dashboard
1. Marketing KPI Dashboard

Post count: số lượng bài đăng (theo nền tảng, thời gian).

Reach/Impressions: tổng số người tiếp cận.

Engagement: lượt thích, bình luận, chia sẻ; tính tỷ lệ tương tác trên lượt xem.

CTR & Conversion: nếu thu thập được, hiển thị click‑through rate và conversion rate.

Posting cadence: biểu đồ lịch đăng bài; thể hiện tần suất và thời điểm đăng.

Top content: bài đăng có hiệu suất cao nhất (reach, engagement).

Platform breakdown: phân tích từng mạng xã hội (FB/IG/Zalo) để so sánh hiệu quả.

2. Productivity Dashboard

Velocity: điểm (estimate) hoàn thành mỗi Phase; so sánh với trung bình 5 phase gần nhất.

Lead time & Cycle time: thời gian trung bình để hoàn thành Task (đồng bộ với workflow).

Triage time: thời gian trung bình từ khi Task vào Inbox đến khi được Accept/Decline.

Throughput: số Task hoàn thành mỗi tuần/Phase.

Member workload: phân bổ Task theo assignee; phát hiện người quá tải.

Bottleneck analysis: số Task ở mỗi trạng thái; highlight cột có nhiều Task bị treo (ví dụ Review).

3. Project & Strategic Dashboard

Progress vs Milestone: tiến độ dự án so với milestone.

Health overview: phân bổ trạng thái health (on‑track, at‑risk, off‑track) của Projects/Strategics.

Scope change: số lượng Task được thêm/xoá trong Project sau khi bắt đầu.

Resource allocation: biểu đồ team/members gắn vào Projects.

Delivery rate: số Project hoàn thành đúng thời hạn.

KPI calculation

Velocity = Σ estimate của Task có state category completed trong Phase.

Lead time = completedAt – createdAt của Task (hoặc – startedAt nếu tính cycle time).

Triage time = firstActionAt (accept/decline) – createdAt của Task.

Reach & Impressions lấy từ API Social khi có; cần mapping postResultId → analytics data.

UI / UX

Dashboard có thể chọn phạm vi (Team/Project/Phase/Strategic, ngày bắt đầu/kết thúc).

Sử dụng biểu đồ cột, đường, pie hoặc biểu đồ burndown tuỳ số liệu. Cần có tiêu đề và chú thích rõ ràng.

Cho phép click drill‑down: ví dụ click vào cột “Phase 5 velocity” để xem danh sách Task đóng góp.

Hỗ trợ lưu và chia sẻ dashboard tùy chỉnh; cho phép export CSV/PDF (vNext).

Responsive để xem trên mobile.

Data & Performance

Caching: Analytical queries có thể nặng; sử dụng caching (Redis/Materialized view) để đáp ứng nhanh.

Realtime & batch: Một số số liệu (velocity, lead time) có thể tính theo batch; số liệu realtime (triage queue) được lấy trực tiếp.

Data warehouse: Lưu log analytics (AnalyticsEvent) vào warehouse (BigQuery, Snowflake) để làm báo cáo phức tạp.

Acceptance criteria

Người dùng có thể mở Dashboard và xem số liệu cho Team/Project/Phase/Strategic tuỳ ý; phản hồi UI < 1 giây với data mẫu.

Đồ thị hiển thị chính xác dữ liệu; trục và nhãn đầy đủ.

Chọn filter (team, date range) sẽ cập nhật tất cả widget trong Dashboard.

Có thể lưu Dashboard với cấu hình (filter, layout) và chia sẻ với đồng nghiệp (vNext).

Khi số liệu marketing chưa có (ví dụ reach không được hỗ trợ), widget hiển thị “No data” hoặc ẩn.

Thống kê sai lệch trong phạm vi <5% so với kiểm đếm thủ công (dựa trên test).

Metrics

Dashboard load time: thời gian phục vụ trang.

Widget error rate: số lần widget fail / tổng số request.

User adoption: số người truy cập dashboard mỗi tuần; số lượt lưu & chia sẻ dashboard.

Data freshness: thời gian cập nhật data marketing và productivity.

🧠 Rule Files (.cursor/rules)

base.mdc: base.mdc

linear-mapping.mdc: linear-mapping.mdc

team-member-rbac.mdc: team-member-rbac.mdc

triage-inbox.mdc: triage-inbox.mdc

workflow-status.mdc: workflow-status.mdc

phases-cycles.mdc: phases-cycles.mdc

views-filters.mdc: views-filters.mdc

notifications.mdc: notifications.mdc

ai-studio.mdc: ai-studio.mdc

social-scheduler.mdc: social-scheduler.mdc

drive-rag.mdc: drive-rag.mdc

analysis.mdc: analysis.mdc

999-mdc-format.mdc: 999-mdc-format.mdc

Các file trên bao gồm đầy đủ mô tả user stories, API surface, UI contracts, acceptance criteria, metrics và rule hướng dẫn AI/code theo đúng yêu cầu. Bạn có thể tải về và sử dụng làm issue/tài liệu nền tảng cho dự án.

Bạn đã nói:
sau đó bạn muốn làm gì tiếp để có app hoạt động được nhanh chóng nhất? Dùng cursor để code, dùng superbase làm backend và vercel để host hay sao?
ChatGPT đã nói:
Thought for 17s

Tuyệt—mình đề xuất đi theo lộ trình “vertical slice” để có app chạy được nhanh nhất (từ Cursor → code, Supabase làm backend, Vercel host). Mục tiêu là ship 1 lát cắt mỏng nhưng đầy đủ: Auth → Team/Task tối thiểu → Inbox (Triage) → Task Detail có AI Panel → Lưu kết quả → View danh sách. Sau đó mới cắm Scheduler & Social/Analysis.

Dưới đây là kế hoạch cụ thể, copy-paste theo thứ tự làm:

0) Quyết định tech ngay từ đầu

Frontend: Next.js 14 (App Router), TypeScript, Tailwind, shadcn/ui, Zustand (state cục bộ), TanStack Query (server state).

Backend: Supabase (Postgres + Auth + RLS + Realtime + Storage + pgvector), Edge Functions (webhooks/adapter khi cần).

AI: OpenAI (content) + Gemini (image ideas). Lưu prompt/response và citation vào Supabase.

Host: Vercel (Edge), Vercel Cron gọi scheduler tick. (Nếu cần job dài → Supabase Functions).

Search/RAG (sau MVP): pgvector; Drive integration nối sau.

1) Khởi tạo repo & Cursor

Tạo repo Next.js (App Router), thêm Tailwind, shadcn/ui, Zustand, TanStack Query.

Commit toàn bộ docs/ và .cursor/rules/ mình đã tạo.

Mở Cursor → Add Project → bật Project Rules (auto include root + nested).

Attach docs/PRD.md, ARCHITECTURE.md, DATA-MODEL.md khi gen code những phần tương ứng.

Cấu trúc src sơ khởi

src/
  app/
    (auth)/sign-in/...
    (dash)/tasks/...
    api/ai/generate/route.ts
    api/tasks/route.ts
    api/triage/route.ts
    api/scheduler/tick/route.ts
  lib/supabase.ts        # server & client
  lib/auth.ts            # session helpers
  lib/rbac.ts            # guard helpers
  components/
    shell/Sidebar.tsx
    tasks/TaskList.tsx
    tasks/TaskDetail.tsx
    ai/Panel.tsx
  stores/
    ui.ts                 # Zustand UI state

2) Supabase: tạo project & schema tối thiểu (MVP)

Tạo project Supabase → bật pgvector (Database → Extensions).

Tạo bảng tối thiểu (copy vào SQL Editor):

-- Roles & membership
create type role as enum ('owner','admin','member','guest');

create table workspace (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null
);

create table team (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspace(id) on delete cascade,
  name text not null,
  key text not null, -- ví dụ AIM
  unique(workspace_id, key)
);

create table member (
  user_id uuid primary key,        -- supabase.auth.users.id
  display_name text,
  avatar_url text
);

create table membership (
  team_id uuid references team(id) on delete cascade,
  user_id uuid references member(user_id) on delete cascade,
  role role not null default 'member',
  primary key (team_id, user_id)
);

-- Core tasking
create type state_category as enum ('unstarted','started','completed','canceled');

create table workflow_state (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references team(id) on delete cascade,
  name text not null,              -- Backlog, In Progress, Done...
  category state_category not null
);

create table project (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references team(id) on delete cascade,
  name text not null
);

create table strategic (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspace(id) on delete cascade,
  name text not null
);

create table strategic_project (
  strategic_id uuid references strategic(id) on delete cascade,
  project_id uuid references project(id) on delete cascade,
  primary key (strategic_id, project_id)
);

create table phase (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references team(id) on delete cascade,
  name text not null,
  start_date date not null,
  end_date date not null
);

create table task (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references team(id) on delete cascade,
  project_id uuid references project(id),
  phase_id uuid references phase(id),
  title text not null,
  description text,
  state_id uuid references workflow_state(id),
  assignee uuid references member(user_id),
  priority int,                     -- 0..4
  due_date timestamptz,
  created_by uuid references member(user_id),
  created_at timestamptz default now()
);

create table task_relation (
  src uuid references task(id) on delete cascade,
  dst uuid references task(id) on delete cascade,
  kind text check (kind in ('subtask','blocks','duplicate','relates')),
  primary key (src,dst,kind)
);

-- Comments & attachments (AI submit đính kèm)
create table task_comment (
  id uuid primary key default gen_random_uuid(),
  task_id uuid references task(id) on delete cascade,
  author uuid references member(user_id),
  body markdown,                    -- dùng text nếu không có ext
  created_at timestamptz default now()
);

-- AI logs
create table ai_generation (
  id uuid primary key default gen_random_uuid(),
  task_id uuid references task(id) on delete cascade,
  agent text not null,              -- content-creator, finance...
  prompt text,
  sources jsonb,                    -- RAG sources
  output_markdown text,
  model text,
  latency_ms int,
  created_by uuid references member(user_id),
  created_at timestamptz default now()
);

-- Social scheduling (placeholder MVP)
create table social_account (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references team(id) on delete cascade,
  platform text check (platform in ('facebook','instagram','zalo')),
  display_name text,
  secret_ref text                   -- key để đọc token từ vault/service
);

create table scheduled_post (
  id uuid primary key default gen_random_uuid(),
  task_id uuid references task(id) on delete cascade,
  account_id uuid references social_account(id),
  caption text,
  media jsonb,                      -- refs to supabase storage or drive
  scheduled_at timestamptz,
  status text default 'queued'      -- queued|posting|done|error
);

create table post_result (
  id uuid primary key default gen_random_uuid(),
  scheduled_id uuid references scheduled_post(id) on delete cascade,
  provider_post_id text,
  status text,
  error text,
  created_at timestamptz default now()
);


RLS bật cho tất cả bảng và tạo policy tối thiểu:

alter table workspace enable row level security;
alter table team enable row level security;
alter table membership enable row level security;
alter table member enable row level security;
alter table task enable row level security;
alter table task_comment enable row level security;
-- ... lặp cho các bảng cần thiết

-- helper: user là member của team?
create or replace function is_team_member(t uuid)
returns boolean language sql stable as $$
  select exists(
    select 1 from membership m
    where m.team_id = t and m.user_id = auth.uid()
  );
$$;

-- Policy ví dụ
create policy "team members can read team"
  on team for select using (is_team_member(id));

create policy "team members can read tasks"
  on task for select using (is_team_member(team_id));

create policy "team members can insert tasks"
  on task for insert with check (is_team_member(team_id));

create policy "author or admin can write comments"
  on task_comment for insert with check (is_team_member(
    (select team_id from task where task.id = task_comment.task_id)
  ));


Auth: dùng Supabase Auth (email magic link + Google). Tạo trigger lên bảng member khi user signup.

3) Vercel: project & env

Tạo project Vercel → link repo.

Thiết lập ENV:

NEXT_PUBLIC_SUPABASE_URL

SUPABASE_SERVICE_ROLE (server only; dùng trong route secure)

SUPABASE_ANON_KEY

OPENAI_API_KEY

GEMINI_API_KEY (hoặc endpoint Banana)

APP_URL (base URL)

Bật Vercel Cron: /api/scheduler/tick mỗi 1–5 phút để scan scheduled_post và bắn.

4) Code “Vertical Slice” (4 màn hình + 3 API)

Màn hình

Sign-in (Supabase auth).

Task List (Board/List) lọc theo Team → load task, click mở detail.

Task Detail: tab Comments; tab AI Panel (Agent + Sources + Generate + Submit → tạo task_comment + ghi ai_generation).

Inbox (Triage): list các task chưa state_id/label “In Triage”; nút Accept/Decline/Assign/Snooze.

API route

POST /api/ai/generate
Input: taskId, agent, sources[]. Gọi OpenAI/Gemini → trả markdown + citations → lưu ai_generation + task_comment.

POST /api/tasks / PATCH /api/tasks/:id
CRUD cơ bản, validate membership phía server.

POST /api/triage/accept etc.
Chuyển state, gán assignee/priority; ghi activity.

Scheduler

GET /api/scheduler/tick
Lấy scheduled_post where status='queued' and scheduled_at <= now() → đổi posting → gọi adapter (mock trước) → ghi post_result → done|error.

5) Thứ tự thực thi (để có demo chạy sớm)

Day 0

Tạo Supabase, chạy schema + policy cơ bản, bật pgvector.

Lập project Vercel, điền ENV.

Init Next.js + Tailwind + shadcn/ui + Supabase client.

Day 1–2

Auth flow + tạo member từ auth.users.

Task List (List view), tạo Task nhanh; Task Detail + Comments.

AI Panel (call OpenAI → ghi comment).

Deploy lên Vercel (đã có slice chạy).

Day 3–4

Inbox (Triage) + actions; Workflow/State tối thiểu (Backlog/In Progress/Done).

Phase v0 (chỉ view và set phase_id).

Saved Filters v0 (URL params).

Day 5–6

Scheduler tick mock + bảng scheduled_post; form schedule trong Task Detail.

Upload Supabase Storage và đính kèm vào Task Comment.

Week 2

Board view (drag & drop), carry-over Phase v1.

Token vault chuẩn bị cho Social OAuth, nhưng chưa cắm API thật.

Dashboard v0: throughput/lead-time/triage time.

6) Vì sao chọn Supabase + Vercel cho “nhanh nhất”

Supabase: auth, postgres, storage, realtime, vector—all-in-one, ship rất nhanh; RLS giúp bảo mật từ sớm.

Vercel: build Next.js tốt, Edge/cron đơn giản, môi trường preview cho review nhanh.

Cursor: đã có rules & docs → sinh code nhất quán; auto-refactor mapping Issue→Task, Cycle→Phase.

7) Hạng mục “cắm thật” sau khi demo ổn

Social OAuth thật (Facebook Graph, Instagram Graph, Zalo OA) + webhook → thay adapter mock.

RAG thật: index Drive/Docs vào pgvector; UI chọn nguồn; citation.

RLS tinh hơn: phân quyền theo Project/Guest; audit log.

Insights nâng cao: thêm KPI marketing (reach/CTR) sau khi có social API thật.

CRM lite: Customer/Deal.

8) Bạn cần gì từ mình ngay bây giờ?

Mình có thể generate code scaffold cho các route, component và Supabase client theo đúng schema trên để bạn paste vào repo (Cursor sẽ tự dựng tiếp).

Hoặc xuất file .sql đầy đủ + .env.example + script seed (Workspace/Team sample) để chạy ngay.

Bạn muốn mình sinh scaffold code (Next.js + API + client Supabase) hay SQL + seed + env trước?

Bạn đã nói:
Tôi đã nhờ 1 Ai agent kiểm tra và phân tích sơ bộ về repo Circle (rymleon23/ioqwfoihas) trên github này để làm mẫu rồi, tôi chỉ cần dựng tiếp trên nó thôi. Đây là repo do indev7 phát triển tên là circle, và nó tương tự như linearr app tuy nhiên nó còn thiếu và tất nhiên là Ai agent đã cần phải xem thật kỹ trước khi gợi ý cho tôi nên làm gì tiếp, phân tích như sau:

1. Những gì Circle đã có

UI giống Linear: Repo sử dụng Next.js, shadcn/ui và Tailwind để dựng UI cho các phần chính như Teams, Projects, Issues (Tasks), Triage (Inbox) và Cycles (Phases). Các trang như team/[teamId], projects, inbox… đã mô phỏng cách bố trí của Linear.

Data tĩnh: Toàn bộ dữ liệu hiện tại đều nằm trong mock-data và được nạp vào Zustand store. Ví dụ: danh sách tasks (issues) có cấu trúc id, identifier, title, status, assignee, project… đều nằm trong file mock-data/issues.ts
raw.githubusercontent.com
; danh sách teams, projects, cycles… tương tự
raw.githubusercontent.com
raw.githubusercontent.com
.

Không có backend / persistence: Không có cơ chế lưu trữ thực. Các phương thức trong store chỉ thao tác trên mảng mock; không có API hay cơ sở dữ liệu. Chức năng như xoá thông báo trong triage chỉ console.log
raw.githubusercontent.com
.

2. Những gì Circle chưa có

Authentication / phân quyền: Chưa có login, role, guest, RBAC.

Cơ sở dữ liệu & API: Chưa có schema thực cho Tasks, Projects, Teams, Cycles, Strategic… và API CRUD.

Triage & Workflow thực tế: Inbox chỉ hiển thị dữ liệu mẫu; chưa có luồng Accept/Duplicate/Snooze, chưa tính triage time.

AI & Automation: Chưa có panel AI, scheduler post, hay phân tích số liệu.

Social integration & Drive: Không có kết nối OAuth tới FB/IG/Zalo hay Google Drive/kvk; chưa có RAG hay lưu trữ file.

Analysis Dashboards: Chưa có bảng điều khiển về velocity, triage time, marketing KPI.

3. Đề xuất lộ trình tiếp tục
Giai đoạn 1: Lên nền tảng

Chuyển dữ liệu mock sang Supabase: Thiết kế schema cho Workspace/Team/Member/Task/Project/Phase/Strategic, áp dụng quy ước Aim (Issue→Task, Cycle→Phase, Initiative→Strategic). Thiết lập RLS để phân quyền theo Team, bật extension pgvector cho future RAG.

Tích hợp Supabase Auth: Sử dụng email magic link/SSO, đồng bộ user vào bảng member. Thiết lập trang đăng nhập/đăng ký.

Refactor store & API: Tạo API route Next.js (hoặc Supabase RPC) cho CRUD Task, Project, Phase…; thay thế Zustand mock store bằng fetch từ Supabase qua Supabase client/TanStack Query.

Triển khai trên Vercel: Khai báo các biến môi trường (SUPABASE_URL, ANON_KEY…) và deploy. Thiết lập cron Vercel (tick function) cho scheduler sau này.

Giai đoạn 2: Mở rộng tính năng Linear

Inbox/Triage thực sự: Tạo bảng notifications hoặc inbox_item; xây dựng API để nhận nhiệm vụ mới, Accept/Decline/Merge/Snooze; tính toán triage_time; hiển thị chỉ số.

Phases & Workflow: Cho phép tạo Phase (sprint) với ngày bắt đầu/kết thúc, carry-over; build burndown & velocity. Cho phép tuỳ chỉnh workflow/state per Team.

Projects & Strategic: Thêm milestone, health, gộp Projects vào Strategic; hiển thị progress tổng hợp.

Saved Views & Filters: Tạo API lưu các filter, chia sẻ view (private/team/workspace).

Giai đoạn 3: Marketing layer & AI

AI Studio in-Task: Tạo panel AI bên phải Task detail: lựa chọn agent (content-creator, finance…), chọn nguồn RAG (Workspace/Team/Project/Drive), gửi prompt tới OpenAI/Gemini, lưu kết quả và cite vào comment/attachment.

Social Integration & Scheduler: Cấu hình OAuth với Facebook, Instagram, Zalo; lưu token an toàn; xây dựng scheduler bảng scheduled_post + cron job; viết UI để chọn caption/media/time. Khi Task chuyển “Ready to Post”, tự tạo lịch; khi post thành công, lưu postId và gắn vào Task.

Drive Hub & RAG: Kết nối Google Drive hoặc Supabase Storage làm hub file; index và lưu vectors; cho phép đính kèm & tra cứu nội dung để RAG.

Analysis: Xây dựng dashboard hiển thị velocity, triage time, throughput, post performance; cho phép export CSV.

Giai đoạn 4: CRM & Future

CRM nhẹ: Thêm bảng customer, deal; liên kết với Task/Project; pipeline cơ bản.

Mobile & Offline: Cải thiện responsive, thêm PWA.

4. Kế hoạch triển khai với Cursor + Supabase + Vercel

Cursor: Dùng bộ docs/ và .cursor/rules đã tạo để hướng dẫn AI khi sinh code. Khi viết code, attach tài liệu tương ứng (PRD, Data Model, Architecture) để Cursor hiểu ngữ cảnh.

Supabase: Thiết lập cấu trúc DB theo DATA-MODEL.md; dùng Supabase Auth; kích hoạt RLS. Bạn có thể dùng Edge Functions cho AI callback & scheduler.

Vercel: Deploy Next.js; dùng Vercel Cron cho /api/scheduler/tick; lưu API keys vào môi trường.

Phát triển theo vertical slice: Xây dựng slice đầu tiên: đăng nhập → danh sách Task từ Supabase → chi tiết Task với AI Panel → comment/submit. Đưa lên staging Vercel để thử nghiệm, sau đó mở rộng thêm Triage, Phase, Social.

Bằng cách này, bạn sẽ biến repo Circle từ một bản UI “mock” thành một sản phẩm đầy đủ tính năng như PRD, tận dụng sẵn các component, layout, và phong cách Linear của Circle, đồng thời bổ sung backend, AI và marketing tool cần thiết.


<goal>
Vậy chúng ta có cần phải viết lại Tài liệu & rules cho Cursor không hay các Tài liệu & rules cho Cursor trên vẫn dùng được ?
ChatGPT đã nói:

Bạn không cần phải viết lại toàn bộ tài liệu & rules cho Cursor — bộ docs và .cursor/rules mình đã tạo trước đó vẫn dùng được để mở rộng từ repo Circle vì:

1. Vì sao docs/rules cũ vẫn dùng được

PRD & Data Model: Circle mới chỉ có UI mock; các file PRD.md, DATA-MODEL.md, ARCHITECTURE.md mình tạo đã mô tả đầy đủ schema thật, API CRUD, AI Panel, Social Scheduler, Drive/RAG, Analysis → có thể dùng trực tiếp để bổ sung backend, auth, automation.

.cursor/rules: Các rule như linear-mapping.mdc, team-member-rbac.mdc, triage-inbox.mdc, ai-studio.mdc… đã mô tả UI contract, API shape, permission, workflow → AI của Cursor sẽ sinh code backend/API từ UI Circle mà không lệch khỏi PRD.

Kiến trúc: Circle có UI Next.js + Zustand → rules cũ đã support Next.js API routes + Supabase + TanStack Query → tương thích hoàn toàn.

2. Chỉ cần bổ sung rất nhỏ

Mapping repo: Thêm file CIRCLE-INTEGRATION.md mô tả repo Circle đang có gì (UI pages, Zustand stores) và map sang API + DB thật mà Supabase cung cấp.

Mock → API: Viết rule nhỏ replace-mock-with-api.mdc hướng dẫn Cursor tự thay toàn bộ mock-data/*.ts và store fake → gọi Supabase client/TanStack Query.

Auth & RLS: Rule supabase-auth.mdc để Cursor sinh login page + sync user → bảng member theo schema cũ.

3. Lộ trình tiếp tục (dựa trên Circle + Docs có sẵn)
Phase 1 – Nâng UI Circle lên real data

Tích hợp Supabase Auth (email magic link).

Chuyển mock-data → Supabase tables theo DATA-MODEL.md.

Refactor Zustand store → TanStack Query + Supabase client.

Deploy lên Vercel → có login + CRUD Task/Project/Phase chạy thật.

Phase 2 – Linear core features

Inbox/Triage thật: Accept/Decline/Snooze/Merge + tính triage_time.

Workflow & Phase: trạng thái tùy chỉnh, burndown, velocity.

Project/Strategic: milestone, health, progress tổng hợp.

Phase 3 – Marketing & AI

AI Panel trong Task: chọn agent, RAG từ Drive, sinh nội dung → comment.

Social Scheduler: OAuth MXH + cron job + auto-post.

Drive Hub + Analysis dashboards.

4. Kết luận

Không cần viết lại toàn bộ docs/rules → chỉ cần bổ sung 2–3 file rule nhỏ cho mapping Circle → Supabase API/Auth.

Tận dụng toàn bộ bộ tài liệu & rules đã có → đảm bảo Cursor sinh code backend/API đúng PRD mà không phá UI Circle.

Mình có thể tạo ngay các file bổ sung như CIRCLE-INTEGRATION.md và replace-mock-with-api.mdc để Cursor biết cách nối UI Circle với Supabase/Auth. Bạn muốn mình làm luôn không?

Bạn đã nói:
Hãy tạo các file bổ sung cho tôi với 
ChatGPT đã nói:
Worked for 2 minutes

Dưới đây là các file bổ sung đã được tạo theo yêu cầu:

docs/CIRCLE‑INTEGRATION.md – hướng dẫn tích hợp repo Circle với Supabase, thay thế mock data bằng API thực, giữ nguyên UI hiện có và chuẩn hóa tên mô‑đun. Xem file tại đây:
Circle Integration Notes
Overview

Circle is a Next.js project built by indev7 that mimics Linear's UI and uses static mock data. It uses Zustand for state and the mock-data/* directory to define tasks, teams, projects and cycles. There is no backend or authentication; it is a pure front‑end demo. We need to adapt Circle to become the foundation of our Linear‑style Marketing OS.

Existing functionality

UI — Circle already has pages for Teams (/teams/[teamId]), Projects (/projects), Issues (Tasks), Triage (Inbox) and Cycles (Phases). The layout uses Next.js 14, shadcn/ui and Tailwind to reproduce Linear's sidebar and content views.

State management — All lists are imported from mock-data/* and stored in a Zustand store. Methods like addTask or removeNotification simply modify in‑memory arrays or log to the console.

No persistence or auth — There is no database, no API and no login. All data resets on page refresh and there is no concept of teams, roles or permissions beyond the hardcoded mock data.

Integration steps

Set up Supabase — Create a Supabase project and implement the tables described in DATA‑MODEL.md: workspace, team, member, task, project, phase, strategic, etc. You can seed these tables with the existing mock data for development.

Add authentication — Use Supabase Auth to let users sign in with magic links or social providers. When a new user signs in, insert a corresponding record into the member table. Store the session using a React context and protect pages for authenticated users only.

Replace mock stores — Remove imports from mock-data/* and the Zustand store. Instead, load data from Supabase via @supabase/supabase-js and TanStack Query or SWR. CRUD operations should call Supabase (insert, update, delete) and invalidate queries to refresh.

Rename concepts — Continue the naming conventions defined in our PRD. Replace occurrences of "Issue" with Task, "Cycle" with Phase and "Initiative" with Strategic in code and UI. Keep the page structure and components; only rename labels and data fields.

Implement triage and workflow — The Inbox page should list tasks with an unset or "Triage" status. Implement actions to Accept, Decline, Merge or Snooze a task, updating the task row in Supabase and recording the triage time. Workflows and statuses should come from the workflow_state table.

Phases, Projects and Strategic — Use the phase, project and strategic tables to model sprints and initiatives. Update the corresponding pages to fetch from these tables rather than arrays.

Prepare for marketing layer — After the core features are connected to Supabase, start implementing the marketing extensions: the AI Studio panel in the task detail page, social integrations with scheduling, a Drive‑based knowledge hub and analysis dashboards. See the module docs under docs/MODULES/ for details.

Developer guidelines

Reuse as many of the existing components and layouts from Circle as possible. Avoid rewriting the UI when not necessary.

Write new API routes under src/app/api/** if you need to perform server‑side actions or complex queries. Otherwise call Supabase directly from the client and manage server state using TanStack Query.

Keep global state minimal. Use the session context for auth and local state for UI concerns; rely on the server for authoritative data.

Follow Tailwind and shadcn/ui best practices. Ensure that new components meet WCAG 2.1 AA accessibility guidelines.

.cursor/rules/replace-mock-with-api.mdc – rule hướng dẫn Cursor bỏ tất cả import từ mock-data/* và Zustand store cũ, chuyển sang dùng Supabase với TanStack Query/SWR và không sao chép dữ liệu vào global store. File rule ở đây: replace-mock-with-api.mdc

.cursor/rules/supabase-auth.mdc – rule định nghĩa luồng auth với Supabase: đăng nhập qua magic link/OAuth, lắng nghe trạng thái auth, tạo bản ghi member, bảo vệ route và tuân thủ RLS. Xem file tại đây: supabase-auth.mdc

Những file trên sẽ giúp bạn nhanh chóng kết nối Circle với backend thật, thay thế mock data và cài đặt auth, đồng thời vẫn phù hợp với toàn bộ PRD và rules hiện có.

Bạn đã nói:
Một Ai Agent bảo tôi cần phải thực hiện các bước này, bạn hãy xem thử nó có thực sự cần thiết không. Và giải thích tường tận cho tôi hiểu nhé
ChatGPT đã nói:
Thought for 28s

Ngắn gọn: Có, rất nên làm — và làm sớm (trước khi viết tiếp backend/API thật). “Terminology map” không phải việc giấy tờ; nó là bộ răng cưa ăn khớp giữa UI, docs, code, DB, analytics và AI trong Cursor. Nếu không chốt sớm, bạn sẽ gặp “naming drift” (Issue↔Task, Cycle↔Phase…), tốn refactor, sai query/metrics, AI gen code lệch, và RAG trộn lẫn thuật ngữ.

Dưới đây là giải thích chi tiết + cách làm nhanh trong 1 ngày.

Vì sao bước này cần thiết

Khóa nghĩa xuyên lớp: UI/Docs/Code/DB/Telemetry/Prompts AI dùng đúng một từ.

Giảm refactor: đổi tên sau khi có dữ liệu thật = đau đớn (migrations, RLS, API).

Đúng với PRD đã chốt: ta đã map Linear→Aim; glossary là artifact chính thức hóa.

Hỗ trợ Cursor: rules .mdc + glossary giúp AI sinh code, review tự động, và phát hiện lệch từ.

RAG/Drive & Analytics: tag/label/thực thể nhất quán mới truy xuất và tính KPI chính xác.

Những rủi ro nếu bỏ qua

DB/API không đồng bộ (ví dụ bảng issues nhưng UI hiển thị Task).

Triage/Workflow lẫn lộn category (unstarted/started…).

Prompts AI lẫn tiếng Anh/VN → kết quả khó kiểm soát.

Dashboard sai định nghĩa (velocity/lead-time).

Search/View miss do field/label khác tên.

Làm “gọn-nhanh” trong 1 ngày (vertical process)

Đầu ra: 1 file docs/GLOSSARY.md + update rules .mdc + “banned terms” lint + codemod.

Auto liệt kê thuật ngữ (1–2h)

Quét repo Circle: tên page, component, store keys, mock fields.

Quét docs hiện có (PRD.md, DATA-MODEL.md, .mdc).

Kết hợp danh sách Linear-core + Marketing layer (AI, Social, Drive, Analysis).

Map & chuẩn hóa (2–3h)

Chọn UI VN, Docs EN/VN, Code/DB (snake/camel), Telemetry event names.

Quy tắc số nhiều, viết hoa, URL path, i18n keys.

Đóng gói & enforce (2–3h)

Viết docs/GLOSSARY.md.

Cập nhật linear-mapping.mdc + thêm “banned terms” (vd. cấm “Issue” trong UI).

Viết eslint custom rule/regex check trong CI (fail nếu thấy từ cấm).

(Tuỳ chọn) codemod rename keys phổ biến.

Acceptance

File glossary tồn tại, review 1 lần.

.mdc cập nhật; chạy thử Cursor → sinh code dùng đúng thuật ngữ.

CI chặn từ cấm trong UI/Docs.

0 warning khi build sau codemod tối thiểu.

Glossary gợi ý (cốt lõi)

(chỉ từ/nhãn ngắn; không câu dài trong bảng)

Linear	Aim (UI VN)	Code/Schema	Ghi chú (ngắn)
Initiative	Strategic	strategic	Nhóm project
Issue	Task	task	Đơn vị công việc
Cycle	Phase	phase	Iteration
Triage	Triage	triage/inbox	Hộp phân loại
Project	Project	project	Giữ nguyên
Milestone	Mốc	milestone	Theo project
Status	Trạng thái	state / workflow_state	Category: unstarted/started/completed/canceled
Workflow	Quy trình	workflow	Per team
Label	Nhãn	label	Taxonomy
Estimate	Ước lượng	estimate/points	Số
Priority	Ưu tiên	priority	0–4
Assignee	Người phụ trách	assignee	Member id
Reporter	Người tạo	created_by	Member id
Due date	Hạn	due_date	ISO
Sub-issue	Subtask	relation:subtask	Quan hệ
Duplicate	Trùng	relation:duplicate	Merge
Blocks	Chặn	relation:blocks	Dependency
View	Chế độ xem	saved_view	Board/List/Timeline
Inbox	Hộp vào	inbox_item	Nguồn vào
AI Agent	Tác vụ AI	ai_generation	content-creator, finance…
Social Account	Tài khoản MXH	social_account	FB/IG/Zalo
Scheduled Post	Lịch đăng	scheduled_post	Queue
Post Result	KQ đăng	post_result	postId/status
Drive File	Tệp Drive	drive_file	RAG
Template	Mẫu	template	Brief/Caption
Customer	Khách hàng	customer	vNext
Deal	Cơ hội	deal	vNext

Bổ sung thêm thuật ngữ cho Notifications, Analytics widget, Command palette, v.v. nếu cần.

Nên đặt ở đâu & tích hợp thế nào

docs/GLOSSARY.md: nguồn chính thức cho đội.

.cursor/rules/linear-mapping.mdc: đã có; bổ sung ban-list & ví dụ đúng/sai.

/locales/vi/common.json: i18n keys theo glossary.

/.github/workflows/lint.yml: bật check từ cấm (regex hoặc eslint plugin nhỏ).

Codemod (tuỳ): jscodeshift/ts-morph cho rename keys thường gặp.

Có cần làm “đúng như ảnh 5 bước” không?

Nội dung 5 bước đúng hướng, nhưng bạn có thể nén thành 3 bước ở trên để nhanh hơn.

Chìa khoá là enforce bằng rule + CI, không chỉ là 1 file ghi chú.

Bạn muốn mình làm gì ngay bây giờ?

Mình có thể tạo luôn docs/GLOSSARY.md (dựa trên bảng trên + mở rộng Marketing layer) và update linear-mapping.mdc để thêm ban-list & ví dụ, kèm eslint rule mẫu.

Hoặc sinh codemod rename nhanh cho một vài key (Issue→Task, Cycle→Phase, …).

Bạn chọn hướng nào, mình làm ngay trong repo hiện tại.

Đã tạo nhánh từ Nhánh · Nhánh · Nhánh · Write PRD for Linear

Bạn đã nói:
Lập kế hoạch lại giúp tôi để bắt đầu dùng codex để thực hiện các công việc trên. Tôi cần bảng kế hoạch chuẩn nhất có thể, có thể là bảng hoặc liệt kê nhưng mà nó sẽ chi tiết tất cả
ChatGPT đã nói:
Worked for 53 seconds

Dưới đây là kế hoạch chi tiết để bạn bắt đầu dùng Codex (qua Cursor) phát triển ứng dụng “Linear‑style Marketing OS” dựa trên repo Circle hiện có. Kế hoạch chia thành các giai đoạn rõ ràng, liệt kê các đầu việc cần làm, mục tiêu và công cụ hỗ trợ. Bạn có thể copy thẳng vào công cụ quản lý dự án (Linear) thành các issue/epic.

1. Chuẩn bị và rà soát

Rà soát tài liệu: Đọc kỹ PRD tổng hợp, Data Model, Architecture và các module docs đã tạo (GLOSSARY, TEAMS‑MEMBERS, TRIAGE‑INBOX, WORKFLOW‑STATUS, v.v.) để nắm yêu cầu và schema thực tế.

Khóa thuật ngữ: Hoàn thành file GLOSSARY.md và bổ sung quy tắc cấm dùng sai tên trong linear‑mapping.mdc để đảm bảo đồng nhất giữa UI, code và DB.

Cấu trúc repo: Xác định thư mục và tệp cần chỉnh (Next.js pages, components, Zustand store, mock‑data, API routes). Chuẩn bị nhánh mới cho refactor Supabase.

2. Thiết lập hạ tầng

Supabase

Tạo project Supabase, kích hoạt pgvector và tạo schema (Workspace/Team/Member/Task/Project/Phase/Strategic, quan hệ, RLS).

Thiết lập Supabase Auth (email magic link + Google) và tạo trigger để sync user vào bảng member.

Bổ sung bảng ai_generation, social_account, scheduled_post, post_result cho các tính năng AI và social sau này.

Môi trường phát triển

Cài Node >= 18, pnpm/npm, Supabase CLI.

Cài mới dependencies: Supabase JS client, TanStack Query, shadcn/ui, Zustand (để giữ UI state nhỏ).

Tạo file .env.local chứa NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE (server), OPENAI_API_KEY, GEMINI_API_KEY.

Vercel

Liên kết repo với Vercel, thiết lập biến môi trường, triển khai thử trang login đơn giản để kiểm tra kết nối Supabase.

Đăng ký cron job (Vercel Cron) cho endpoint /api/scheduler/tick (chưa cần logic, chỉ placeholder).

3. Chuyển dữ liệu mock sang Supabase

Refactor store: Viết rule replace‑mock‑with‑api.mdc (đã tạo) để Cursor nhận biết và chuyển từ import mock‑data sang gọi Supabase qua TanStack Query.

API routes: Tạo các route Next.js trong src/app/api cho CRUD Task/Project/Phase/Strategic, đảm bảo kiểm tra quyền bằng Supabase Service Role.

Zustand → Query: Giữ Zustand cho state UI cục bộ (filter, sidebar), còn dữ liệu lấy qua React Query useQuery/useMutation.

Migration tạm: Viết script seed dữ liệu từ mock‑data vào Supabase để có dữ liệu thực test.

4. Triển khai Authentication & RBAC

Tạo trang /sign‑in sử dụng Supabase Auth UI hoặc form custom; xử lý session (Supabase client auth.onAuthStateChange).

Xây helper getCurrentMember() để fetch bảng member.

Bổ sung middleware để bảo vệ route cần đăng nhập; xác định role (owner/admin/member/guest) theo bảng membership.

Update UI: menu user, sign out, hiển thị tên và avatar.

5. Xây dựng các chức năng “core Linear”

5.1 Inbox/Triage

Tạo bảng inbox_item hoặc dùng trường state=triage.

Tạo trang /inbox hiển thị danh sách Task chưa nhận; thêm nút Accept / Decline / Duplicate / Snooze (thay đổi trạng thái và log).

Tính toán triage_time và hiển thị trên dashboard.

5.2 Workflow & Phases

Cho phép mỗi team có workflow riêng (bảng workflow_state); UI cài đặt trong Team Settings.

Tạo trang /phases (sprint) với timeline, cho phép tạo Phase mới (start/end), chuyển Task sang Phase, auto carry‑over Task chưa xong.

Thêm widget burndown và velocity cho mỗi Phase.

5.3 Projects & Strategic

Thêm trang /projects với danh sách Projects; trong mỗi project hiển thị Milestones, sức khỏe, tiến độ.

Thêm trang /strategic gộp nhiều projects, hiển thị health tổng hợp.

Cho phép tạo Milestone và gắn Task vào Milestone.

5.4 Views & Filters

Xây dựng hệ thống lọc (Team, Assignee, State, Phase, Label) và lưu View (private/team/workspace).

UI: Board, List, Timeline, Swimlanes (sử dụng drag‑and‑drop lib nếu cần).

5.5 Notifications & Activity

Tạo model notification và activity_log.

Xây component toast/inbox thông báo khi được mention hoặc khi Task thay đổi.

Tích hợp webhook Slack (giai đoạn sau).

6. Mở rộng Marketing Layer

6.1 AI Studio (In‑Task)

Thêm panel bên phải trong Task Detail: chọn agent (content‑creator, finance…), chọn nguồn RAG (Workspace/Team/Project/Drive).

Gọi API /api/ai/generate (Next.js Edge function) → sử dụng OpenAI GPT‑4o hoặc Gemini; lưu kết quả vào ai_generation và tạo comment.

UI cho phép người dùng xem/copy kết quả và “Submit to Task” để đính kèm ngay dưới phần comment.

6.2 Social Integration & Scheduler

Tạo bảng social_account với thông tin token, platform; trang /settings/social để kết nối FB/IG/Zalo (OAuth flow).

Trang lên lịch: khi Task chuyển trạng thái “Ready to Post”, hiện modal chọn account, caption, media, thời gian.

API /api/schedule lưu scheduled_post; Cron job scheduler/tick kiểm tra post đến thời điểm → gọi API (mock trước).

Lưu post_result và hiển thị link bài đăng trong Task; nếu lỗi, mở lại Task và gửi thông báo.

6.3 Drive Hub & RAG

Kết nối Google Drive/Dropbox hoặc dùng Supabase Storage làm hub; thiết lập thư mục /Company/AiM/... như PRD.

Index nội dung file (metadata, embedding) vào pgvector; API cho phép tìm file theo từ khóa.

Cho phép đính kèm file vào Task và dùng làm nguồn RAG trong AI Panel.

6.4 Analysis Dashboard

Tạo trang /analysis với 2 tab: Productivity (lead/cycle time, triage time, throughput, phase velocity) và Marketing KPI (số bài đăng, reach/CTR nếu API trả về, cadence, time‑to‑publish).

Dùng charts (recharts) và bảng; API để lấy dữ liệu.

Cho phép filter theo Team/Project/Phase.

7. CRM & kế hoạch tương lai

Thêm schema customer và deal; giao diện pipeline Kanban; liên kết với Task/Project.

Tối ưu PWA cho mobile; thêm offline mode nếu cần.

Nghiên cứu thêm modules bán hàng (inbound/outbound).

8. Kiểm thử & triển khai

Viết test unit/integration (Jest + React Testing Library) cho component UI; test API route (Vitest).

Dùng Playwright/Cypress cho test end‑to‑end (đăng nhập, tạo task, AI generate).

Thiết lập GitHub Actions CI/CD (lint, test, deploy).

Deploy staging (branch staging) và production (branch main); cấu hình preview deployment cho branch review.

9. Sử dụng Codex qua Cursor

Attach docs và rules khi viết code: khi mở file trong Cursor, chọn “Attach docs/PRD.md”, DATA‑MODEL.md, GLOSSARY.md và file rule .mdc tương ứng để Codex hiểu ngữ cảnh.

Chia nhỏ nhiệm vụ: mỗi component/API là một branch hoặc commit; mô tả rõ trong PR/issue.

Review code sinh tự động: so sánh với rules .mdc để kiểm tra naming, RBAC, UI contract.

Sửa khi lệch: update hoặc tạo rule mới (ví dụ team-member-rbac.mdc, triage-inbox.mdc) nếu Codex lặp lại sai lầm.

10. Quản lý công việc trong Linear

Tạo epics/strategic và issue tương ứng với các giai đoạn nêu trên (Core Linear, Triage, Phase, Project, AI Studio, Social Scheduler, Drive & RAG, Analysis).

Mỗi issue nên có mô tả chi tiết, acceptance criteria, link tới docs/rules.

Gán assignee và phase (phase = cycle) phù hợp, theo dõi tiến độ trên board.

Thực hiện theo lộ trình này sẽ giúp bạn chuyển repo Circle từ bản UI mẫu thành ứng dụng “Linear‑style Marketing OS” hoàn chỉnh, có backend thực, có AI hỗ trợ và các công cụ marketing, đồng thời tận dụng tối đa sức mạnh của Codex và Cursor để tự động hóa quá trình phát triển.