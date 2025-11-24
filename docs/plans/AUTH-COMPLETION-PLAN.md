# Kế hoạch Hoàn thiện Hệ thống Authentication

Tài liệu này mô tả chi tiết kế hoạch bổ sung các tính năng Authentication còn thiếu cho Marketing OS (Circle), bao gồm đăng nhập bằng mật khẩu, đăng ký, quên mật khẩu và xử lý lời mời.

## 1. Tổng quan các tính năng còn thiếu

Hiện tại hệ thống chỉ hỗ trợ Magic Link và Google OAuth. Cần bổ sung:
1.  **Login with Password**: Cho phép đăng nhập bằng Email + Password truyền thống.
2.  **Register**: Trang đăng ký tài khoản mới.
3.  **Forgot Password**: Trang yêu cầu gửi link reset mật khẩu.
4.  **Reset Password**: Trang nhập mật khẩu mới (sau khi click link từ email).
5.  **Invite Acceptance**: Trang nhận lời mời tham gia team (thiết lập mật khẩu cho user mới).

## 2. Chi tiết triển khai

### 2.1. Cập nhật trang Login (`/login`)
*   **Hiện tại**: Chỉ có Input Email + Button "Sign in with Email".
*   **Cập nhật**:
    *   Thêm Tabs: "Magic Link" (hiện tại) và "Password" (mới).
    *   Tab "Password": Input Email + Input Password + Button "Sign In".
    *   Thêm link "Forgot password?" bên dưới input password.
    *   Thêm link "Don't have an account? Sign up" ở dưới cùng.

### 2.2. Trang Đăng ký (`/register`)
*   **Route**: `/register`
*   **UI**:
    *   Input: Full Name (lưu vào `raw_user_meta_data`).
    *   Input: Email.
    *   Input: Password.
    *   Button: "Create Account".
    *   Link: "Already have an account? Sign in".
*   **Logic**: Sử dụng `supabase.auth.signUp()`.

### 2.3. Trang Quên mật khẩu (`/forgot-password`)
*   **Route**: `/forgot-password`
*   **UI**:
    *   Input: Email.
    *   Button: "Send Reset Link".
    *   Link: "Back to Login".
*   **Logic**: Sử dụng `supabase.auth.resetPasswordForEmail()`, redirect về `/auth/reset-password`.

### 2.4. Trang Đặt lại mật khẩu (`/auth/reset-password`)
*   **Route**: `/auth/reset-password` (hoặc `/reset-password` nhưng cần xử lý code từ URL).
*   **UI**:
    *   Input: New Password.
    *   Input: Confirm New Password.
    *   Button: "Update Password".
*   **Logic**: Sử dụng `supabase.auth.updateUser()`. Trang này chỉ truy cập được khi có session (do link reset password của Supabase sẽ tự động log in user vào).

### 2.5. Trang Chấp nhận lời mời (`/invite/accept`)
*   **Route**: `/invite/accept`
*   **Context**: Khi admin mời thành viên qua email, Supabase gửi link mời.
*   **UI**:
    *   Hiển thị: "You have been invited to join [Workspace/Team]".
    *   Nếu user chưa có tài khoản: Form thiết lập Password + Name.
    *   Nếu user đã có tài khoản: Button "Accept & Join".

### 2.6. Trang Onboarding (`/onboarding`)
*   **Trigger**: Sau khi đăng nhập/đăng ký, nếu user chưa thuộc về bất kỳ Workspace nào.
*   **UI**: Trang chào mừng với 2 lựa chọn:
    1.  **Create a new Workspace**:
        *   Form nhập tên Workspace, Slug (URL).
        *   Action: Tạo Workspace mới -> Thêm user làm Owner -> Redirect về Dashboard.
    2.  **Join an existing Workspace**:
        *   Hiển thị danh sách các lời mời đang chờ (Pending Invites) nếu có.
        *   Hướng dẫn user kiểm tra email để nhận link mời từ admin.
        *   (Optional) Nhập Invite Code nếu hệ thống hỗ trợ.

## 3. Lộ trình thực hiện (Roadmap)

### Phase 1: Cơ bản (Password Auth)
- [ ] Tạo trang `/register`.
- [ ] Cập nhật trang `/login` thêm tab Password.
- [ ] Cập nhật `middleware.ts` để update session.

### Phase 1.5: Onboarding
- [ ] Tạo trang `/onboarding` (Lựa chọn Create/Join).
- [ ] Tạo trang `/onboarding/create` (Form tạo Workspace).
- [ ] Cập nhật logic điều hướng: Login -> Check Workspace -> Nếu 0 workspace -> Redirect `/onboarding`.

### Phase 2: Khôi phục tài khoản
- [ ] Tạo trang `/forgot-password`.
- [ ] Tạo trang `/auth/reset-password`.

### Phase 3: Invite Flow (Nâng cao)
- [ ] Tạo trang `/invite/accept`.
- [ ] Xử lý logic `supabase.auth.verifyOtp` cho type `invite`.

## 4. Yêu cầu kỹ thuật
- **Supabase Client**: Sử dụng `utils/supabase/client.ts`.
- **UI Components**: Tận dụng `shadcn/ui` (Input, Button, Tabs, Form).
- **Validation**: Sử dụng `zod` và `react-hook-form`.
