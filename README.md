# Circle

<br />
<a href="https://vercel.com/oss">
  <img alt="Vercel OSS Program" src="https://vercel.com/oss/program-badge.svg" />
</a>

<br />
<br />

Project management interface inspired by Linear. Built with Next.js and shadcn/ui, this application allows tracking of issues, projects and teams with a modern, responsive UI.

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

## Auth + DB + Onboarding

- Credentials login for development only (NextAuth v5)
- Prisma + Postgres schema for User/Organization/Brand/Membership/CreatorProfile
- Health check at /api/health
- Onboarding flow to choose Creator or Brand and set internal role
- Seed script with demo org, brand, and users

### Environment

Copy .env.example to .env.local and adjust values:

`DATABASE_URL="postgresql://postgres:postgres@localhost:5432/circle_dev?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="changeme-in-local"
DEV_LOGIN_PASSWORD="dev"`

Ensure Postgres is running and accessible by DATABASE_URL.

### Database

Generate and push schema, then seed (optional):

`pnpm db:generate
pnpm db:push
pnpm db:seed`

### Dev Login

- Visit /auth/signin
- Use any email and password equal to DEV_LOGIN_PASSWORD
- After first login, go to /onboarding to set role
