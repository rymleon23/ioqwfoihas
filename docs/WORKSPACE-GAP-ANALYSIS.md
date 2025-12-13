# Workspace Implementation Gap Analysis

**Ngày báo cáo:** 12/12/2025
**Người báo cáo:** Marketing OS Fullstack Engineer
**Tài liệu tham chiếu:**

- `docs/modules/workspace-dashboard.md` (Target State)
- `docs/IMPLEMENTATION-GUIDE.md` (Codebase Plan)
- `docs/plans/LINEAR-MARKETING-OS-PLAN.md` (Execution Plan)
- `app/[orgId]/page.tsx` (Current State)

---

## 1. Tóm tắt tình trạng

Hiện tại có sự **XUNG ĐỘT NGHIÊM TRỌNG** giữa tài liệu mô tả (`workspace-dashboard.md`) và code thực tế (`app/[orgId]/page.tsx`).

- **Tài liệu** mô tả lại toàn bộ Dashboard theo phong cách **Linear/Circle** với Role-based layout (Creator/Brand/Admin).
- **Code hiện tại** đang chạy một phiên bản Dashboard đơn giản (Generic Dashboard) dạng Card-based, chưa tích hợp layout chuẩn của Circle (MainLayout/Sidebar).

**Đánh giá chung:** Codebase đang chậm hơn so với tài liệu thiết kế mới cập nhật khoảng 1 sprint lớn.

---

## 2. Chi tiết xung đột (Architecture & UI)

| Hạng mục                | Tài liệu (`workspace-dashboard.md`)                                       | Code thực tế (`app/[orgId]`)                                         | Mức độ xung đột |
| ----------------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------- | --------------- |
| **Kiến trúc Dashboard** | **Role-based** (Switch case theo User Role: Creator, Brand, Admin)        | **Generic** (Dùng chung 1 component `WorkspaceDashboard` cho tất cả) | **High** 🔴     |
| **Logic Layout**        | Dùng `MainLayout` + `AppSidebar` (có Inbox, Teams, Projects)              | Dùng Layout flex đơn giản, Header cứng, Card grid                    | **High** 🔴     |
| **Data Fetching**       | Cần fetch theo Role (Scheduled Posts cho Creator, Analytics cho Admin...) | Fetch chung: Teams list + Personal Tasks count                       | **Medium** 🟠   |
| **Component System**    | Tái sử dụng `components/dashboards/*` (chưa có)                           | Dùng `components/workspace/workspace-dashboard.tsx` (dạng cũ)        | **High** 🔴     |

---

## 3. Các hạng mục còn thiếu (Missing Features)

Dựa trên yêu cầu tái sử dụng `demo/` và `workspace-dashboard.md`, các hạng mục sau chưa được thực hiện:

### A. Backend / API

1. **RBAC Utility**: Chưa có hàm `getUserRole(orgId)` trong `lib/rbac.ts` để phân quyền dashboard.
2. **API Routes**: Thiếu các route cho từng widget của dashboard mới (vd: `api/activities`, `api/stats`).

### B. Frontend Components

1. **Dashboard Containers**: Chưa tạo folder `components/dashboards/` và 3 file chính:
   - `creator-dashboard.tsx`
   - `brand-dashboard.tsx`
   - `admin-dashboard.tsx`
2. **Widgets**: Thiếu các widget con (Recent Activity, Content Calendar view nhỏ, Team Performance chart).

### C. Integration

1. **MainLayout Integration**: Trang `/{orgId}` chưa được wrap bởi `MainLayout` chuẩn của hệ thống.

---

## 4. Rà soát với Implementation Plan

### `LINEAR-MARKETING-OS-PLAN.md`

- **Mục P1.2 (Workspace, Team, User RBAC)**:
   - Plan yêu cầu: _"Render RBAC-aware UI (hide protected actions)"_.
   - Thực tế: Chưa implement logic check role để render Dashboard khác nhau.
- **Mục P1.3 (Task List)**: Đã có vertical slice nhưng chưa được nhúng vào Dashboard mới theo đúng chỗ (ví dụ widget My Tasks).

### `IMPLEMENTATION-GUIDE.md`

- **Bước 3 (Vertical Slice)**: Hướng dẫn tập trung vào "Task list & detail" và "Sidebar navigation". Code hiện tại có Sidebar nhưng chưa đồng bộ vào trang Dashboard chính (Dashboard đang "full width" và không nằm trong `SidebarProvider` context của `MainLayout`).

---

## 5. Khuyến nghị hành động (Action Plan)

Để đồng bộ code với tài liệu mới (Updated Unified Approach), cần thực hiện các bước sau (**Prioritized**):

1. **Refactor Page Structure (Gấp):**
   - Sửa `app/[orgId]/page.tsx`.
   - Implement `getUserRole` trong `lib/rbac.ts`.
2. **Create Unified Dashboard:**
   - Tạo `components/dashboards/workspace-overview.tsx`.
   - Wrap component này bằng `MainLayout`.
3. **Migrate Widgets:**
   - Chuyển logic từ Generic Dashboard hiện tại thành các widget nhỏ (`MyTasksWidget`, `TeamsWidget`).
   - Implement `StatsWidget` (cho Admin) và `ScheduleWidget` (cho Creator).
4. **Conditional Rendering:**
   - Trong `WorkspaceOverview`, kiểm tra `userRole` prop để ẩn hiện các widget tương ứng.

---

**Kết luận:** Đã thống nhất sử dụng **Unified Dashboard** (1 Layout, 1 Page, Conditional Widgets) thay vì tách 3 trang riêng biệt để optimize trải nghiệm người dùng và maintainability.
