# Huong dan thuc hien Section 3 - Supabase & Data Layer Initialization

Tai lieu nay tom tat cac buoc thuc te can lam de hoan thanh muc "Project provisioning" trong Section 3 cua `docs/plans/LINEAR-MARKETING-OS-PLAN.md`. Ten rieng bang tieng Anh duoc giu nguyen theo yeu cau.

## 1. Chuan bi truoc khi vao Supabase Dashboard

- Dam bao da dang ky tai khoan Supabase va duoc them vao to chuc phu hop.
- Ghi chu cac thong tin se can: ten project <rymleon23's Project>, khu vuc <Singapore>, luu password Postgres vao bien `SUPABASE_DB_PASSWORD` trong file `.env` hoac trinh quan ly secrets.
- Xac dinh cac bien moi truong se dung tren local va Vercel (dat gia tri trong `.env`/Vercel Secrets): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.

## 2. Tao Supabase project moi

- Trang thai: [DONE] (Project da tao tren Supabase; URL va keys duoc luu trong `.env` va `.mcp/supabase-api.md`).

1. Dang nhap Supabase Dashboard tai https://supabase.com/dashboard, chon to chuc can dung.
2. Bam **New project**. Dien cac truong:
   - **Project name**: giu thong nhat voi repo (goi y: `Marketing OS` hoac `marketing-os-prod`).
   - **Database password**: tao mat khau manh, luu vao trinh quan ly mat khau.
   - **Region**: chon Singapore hoac US East tuy doi tuong nguoi dung.
   - **Pricing plan**: Start voi goi Free, co the nang cap sau.
3. Bam **Create new project** va cho Supabase khoi tao (mat 1-2 phut).
4. Sau khi dashboard mo ra, vao tab **Project Settings -> API** de sao chep `Project URL`, `anon key`, `service_role key` vao file `.env.local` (tam thoi co the dat placeholder, se cap nhat sau khi hoan thanh cac buoc tiep theo).

## 3. Bat extension pgvector

- Trang thai: [DONE] (Da enable pgvector tren Dashboard va chay `select * from pg_extension where extname = 'vector';` de xac nhan).

1. Trong menu ben trai chon **Database -> Extensions**.
2. Tim kiem `pgvector`.
3. Bam **Install** (hoac **Enable**) va xac nhan.
4. Cho Supabase chay migration tu dong (se tao `create extension if not exists vector;`).
5. Mo **SQL Editor**, chay lenh ben duoi de xac nhan:
   ```sql
   select * from pg_extension where extname = 'vector';
   ```
   Neu tra ve 1 dong co `extname = vector` la thanh cong.

## 4. Cau hinh Storage buckets

- Trang thai: [TODO] (Chua xac nhan tao bucket va cai dat storage policies RLS).

1. Dieu huong den **Storage -> Buckets** trong Supabase Dashboard.
2. Tao cac bucket sau (giu ten tieng Anh de dong nhat voi code va docs):
   - `workspace-files` (Private) - luu tai lieu noi bo lam nguon cho Drive Hub & RAG (`docs/modules/drive-rag.md`, bang `drive_file` trong `docs/DATA-MODEL.md`).
   - `task-uploads` (Private) - luu file nguoi dung upload truc tiep lam `task_attachment` kieu `upload` (`docs/DATA-MODEL.md`, ghi chu attachments tai `docs/archive/gpt-gen-prd.md:1712`).
   - `scheduled-media` (Private) - luu anh/video su dung khi lap lich bai dang (`docs/modules/social-scheduler.md`, truong `media` trong `scheduled_post`).
3. Voi tung bucket, mo tab **Policies** va tao rule dua tren `auth.uid()` hoac claims workspace de chi thanh vien workspace doc/ghi, tuan thu `.cursor/rules/supabase-auth.mdc`.
4. Trong muc **Configuration**, dat gioi han kich thuoc phu hop (goi y: workspace-files 25 MB, task-uploads 50 MB, scheduled-media 100 MB) va bat resumable uploads neu can.
5. Thu upload mot file test vao `task-uploads`, lay signed URL de xac nhan policy hoat dong roi xoa file thu.

## 5. Dong bo thong tin moi truong

1. Mo `docs/.env.example` (neu co) va them hoac cap nhat cac dong:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://vtnlrnjpmjajujjuchnm.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<paste anon key>
   SUPABASE_SERVICE_ROLE=<paste service role key>
   ```
2. Cap nhat `.env.local` tren local va Secrets tren Vercel (tab **Settings -> Environment Variables**).
3. Kiem tra script seed: `pnpm seed:supabase` can `SUPABASE_SERVICE_ROLE`; chay thu lenh (tren local) de dam bao key moi hoat dong.

## 6. Kiem tra sau provisioning

- Mo **Table editor**: dam bao cac bang tu migration xuat hien (workspace, team, task, ...). Neu chua, chay `supabase db push` hoac script SQL tu repo.
- Vao **Auth -> Providers**: xac nhan Magic Link da bat, cau hinh Google OAuth neu da co client id/secret.
- Vao **Storage**: thu upload 1 file test vao `task-uploads`, tao signed URL de xac nhan policy hoat dong roi xoa file.

## 7. Tai lieu tham khao tren supabase.com

- Getting Started -> New project: https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs
- Database -> Extensions -> pgvector: https://supabase.com/docs/guides/database/extensions/pgvector
- Storage -> Buckets: https://supabase.com/docs/guides/storage
- Auth -> Providers: https://supabase.com/docs/guides/auth#configure-providers

## 8. Tiep theo trong plan

- Khi cac buoc tren da xong, danh dau muc "Project provisioning" trong Section 3 la hoan thanh.
- Chuyen sang muc tiep theo: chay migrations, seed mock data va kiem tra RLS (cac muc nay trong plan da danh dau DONE, chi can verify nhanh).

```sh
# Lenh goi y de tu kiem tra
pnpm supabase:start
pnpm seed:supabase
```

Tai lieu nay nen duoc commit vao repo de tat ca thanh vien team co chung huong dan.
