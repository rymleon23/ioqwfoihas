# Module: Teams & Members (RBAC)

## Mục đích
Tổ chức người dùng theo Workspace/Team, quản lý vai trò và quyền truy cập để đảm bảo bảo mật dữ liệu.

## User stories
- PM tạo team mới với key duy nhất để gán task/project.
- Admin mời thành viên, đổi role hoặc vô hiệu hóa.
- Member xem team mình tham gia và quyền hạn tương ứng.
- Guest truy cập project cụ thể ở chế độ read/comment.

## API đề xuất (REST)
| Method | Endpoint | Mô tả | Quyền |
|--------|----------|-------|-------|
| POST | `/teams` | Tạo team (name, key, workflowId) | Owner/Admin |
| PATCH | `/teams/{id}` | Cập nhật thông tin team | Owner/Admin |
| GET | `/teams/{id}` | Chi tiết team + members | Member |
| DELETE | `/teams/{id}` | Xóa team (cảnh báo dữ liệu) | Owner |
| POST | `/teams/{id}/invite` | Mời thành viên (email, role) | Owner/Admin |
| PATCH | `/memberships/{id}` | Đổi role/disable | Owner/Admin |
| GET | `/workspaces/{id}/members` | Danh sách thành viên workspace | Owner/Admin |

## Quy tắc & xử lý đặc biệt
- Team key: chữ hoa + số, tối đa 4 ký tự, unique trong workspace.
- Xóa team yêu cầu xác nhận kép; task/project phải chuyển sang team khác hoặc bị huỷ.
- Role matrix: Owner/Admin toàn quyền; Member tạo/chỉnh task/project; Guest chỉ đọc/comment.
- Audit log cho mọi thay đổi vai trò.

## UI/UX
- Sidebar hiển thị team tham gia.
- Trang Team Settings: tab General, Members, Workflow, Permissions & Labels.
- Drawer mời thành viên (email + role), hiển thị trạng thái Invited.
- Search/pagination cho danh sách thành viên lớn.

## Acceptance criteria
- Tạo team với key hợp lệ, thông báo lỗi rõ khi trùng/bất hợp lệ.
- Mời email hợp lệ; user mới tạo record trạng thái `invited`.
- Đổi role hiệu lực tức thì; audit log ghi nhận.
- Member/Guest không chỉnh sửa thiết lập team.
- Xóa team cập nhật audit log & thông báo tới owner.

## Metrics
- Số lượng team theo workspace.
- Số user active/invited/disabled.
- Tần suất mời thành viên, tỉ lệ chấp nhận.
- Số lần thay đổi role, chuyển task/project giữa team.
