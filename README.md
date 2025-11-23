# Circle

<br />
<a href="https://vercel.com/oss">
  <img alt="Vercel OSS Program" src="https://vercel.com/oss/program-badge.svg" />
</a>

<br />
<br />

Project management interface inspired by Linear. Built with Next.js and shadcn/ui, this application allows tracking of tasks, projects and teams with a modern, responsive UI.

## 🛠️ Technologies

- **Framework**: [Next.js](https://nextjs.org/)
- **Langage**: [TypeScript](https://www.typescriptlang.org/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)

### 📦 Installation

```shell
git clone https://github.com/ln-dev7/circle.git
cd circle
```

### Install dependencies

```shell
pnpm install
```

### Start the development server

```shell
pnpm dev
```

## Star History

<a href="https://www.star-history.com/#ln-dev7/circle&Date">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=ln-dev7/circle&type=Date&theme=dark" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=ln-dev7/circle&type=Date" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=ln-dev7/circle&type=Date" />
 </picture>
</a>
## Local Setup
1. Cài đặt [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) (hoặc nvm-windows), sau đó chạy `nvm install` và `nvm use` (file `.nvmrc` đặt Node 18.20.4).
2. Cài [pnpm](https://pnpm.io/installation) nếu chưa có.
3. Sao chép `.env.example` thành `.env.local` và điền các khóa Supabase / AI theo môi trường làm việc.
4. Cài dependencies: `pnpm install`.
5. (Tuỳ chọn) Nếu chạy Supabase cục bộ, chắc chắn đã cài [Supabase CLI](https://supabase.com/docs/guides/cli/getting-started) rồi chạy `pnpm supabase:start` trong terminal khác.
6. Khởi động ứng dụng: `pnpm dev`.

### Scripts hữu ích

- `pnpm typecheck`: chạy TypeScript ở chế độ `--noEmit`.
- `pnpm lint`: lint Next.js/ESLint.
- `pnpm test`: placeholder, in ra thông báo TODO (sẽ thay bằng test runner sau).
- `pnpm supabase:start`: tiện chạy `supabase start` (yêu cầu Supabase CLI).
