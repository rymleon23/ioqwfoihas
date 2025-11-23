# Delivery Checklist

## Trước mỗi sprint

- Đảm bảo tài liệu cập nhật: PRD, Data Model, Module specs.
- Đồng bộ glossary và rule `.mdc` nếu có thay đổi thuật ngữ.
- Gắn link docs vào task/Linear ticket.

## Khi phát triển

- Luôn attach `docs/PRD.md`, `ARCHITECTURE.md`, `DATA-MODEL.md`, module liên quan và rule `.mdc` trong Cursor.
- Chia nhỏ công việc: mỗi component/API = 1 branch hoặc PR.
- Kiểm tra RBAC trong API & UI, log activity, test error case.
- Với AI: lưu prompt/output/sources, ghi nhận latency.
- Với Social: monitor queue, log webhook, handle retry/backoff.

## Testing

- Unit & integration test (Jest + RTL) cho component/UI logic.
- API test (Vitest) cho route quan trọng.
- E2E (Playwright/Cypress) cho đường đi chính: login → tạo task → AI generate → schedule post.

## Deployment

- GitHub Actions: lint, test, build, deploy staging/production.
- Deploy staging (branch `staging`) trước, kiểm tra smoke test.
- Production (branch `main`) sau khi QA chấp thuận; enable preview deployment cho PR.

## Sau khi release

- Theo dõi metrics: velocity, triage SLA, AI adoption, social posting success.
- Thu thập feedback, cập nhật docs/rule nếu behavior đổi.
- Lên kế hoạch phase kế tiếp (roadmap P2/P3/P4).

## Branch & Commit checklist

- Trước khi mở PR: cập nhật feature branch từ `staging` và đảm bảo CI xanh.
- Merge flow: feature → `staging` (QA) → `main` (release) với ít nhất 1 review.
- Commit message phải theo Conventional Commits; commit bị hook `pnpm commitlint --edit "$1"` từ Husky.
- Sau release: đồng bộ `staging` với `main`, xóa branch feature đã merge.
