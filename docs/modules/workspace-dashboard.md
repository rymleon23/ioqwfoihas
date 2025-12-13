# Module: Workspace Dashboard

> **Tài liệu chi tiết cho AI và Developer** để implement Front-end và Back-end cho Marketing OS App.
> Dựa trên reference: [demo/app/[orgId]](../../demo/app/[orgId])

---

## 1. Tổng quan

Workspace Dashboard là trang landing chính khi user truy cập `/{orgId}`. Trang này:

- Sử dụng **role-based dashboard** (CREATOR, BRAND_OWNER, ADMIN)
- Nằm trong layout với **Sidebar navigation**
- Cung cấp navigation đến các module: Teams, Projects, Members, Inbox, Tasks

---

## 2. Circle UI Components (TÁI SỬ DỤNG)

### 2.1 Base UI Components (shadcn/ui)

Tất cả components sử dụng [shadcn/ui](https://ui.shadcn.com/) đã có sẵn tại `components/ui/`:

| Component     | File                | Mô tả                       |
| ------------- | ------------------- | --------------------------- |
| `Button`      | `button.tsx`        | Primary button với variants |
| `Card`        | `card.tsx`          | Card container              |
| `Badge`       | `badge.tsx`         | Status/label badges         |
| `Avatar`      | `avatar.tsx`        | User avatar                 |
| `Dropdown`    | `dropdown-menu.tsx` | Dropdown menu               |
| `Dialog`      | `dialog.tsx`        | Modal dialogs               |
| `Sidebar`     | `sidebar.tsx`       | Sidebar primitives (23KB)   |
| `Command`     | `command.tsx`       | Command palette             |
| `Popover`     | `popover.tsx`       | Floating content            |
| `Tooltip`     | `tooltip.tsx`       | Hover tooltips              |
| `Table`       | `table.tsx`         | Data tables                 |
| `Tabs`        | `tabs.tsx`          | Tab navigation              |
| `Form`        | `form.tsx`          | Form controls               |
| `Input`       | `input.tsx`         | Text input                  |
| `Select`      | `select.tsx`        | Select dropdowns            |
| `Checkbox`    | `checkbox.tsx`      | Checkboxes                  |
| `Switch`      | `switch.tsx`        | Toggle switches             |
| `Calendar`    | `calendar.tsx`      | Date picker                 |
| `Sheet`       | `sheet.tsx`         | Slide-out panels            |
| `Collapsible` | `collapsible.tsx`   | Collapsible sections        |
| `ScrollArea`  | `scroll-area.tsx`   | Custom scrollbars           |
| `Breadcrumb`  | `breadcrumb.tsx`    | Navigation breadcrumbs      |
| `Sonner`      | `sonner.tsx`        | Toast notifications         |
| `Progress`    | `progress.tsx`      | Progress bars               |
| `Skeleton`    | `skeleton.tsx`      | Loading skeletons           |

### 2.2 Layout Components

```
components/layout/
├── main-layout.tsx           # ⭐ Main wrapper với Sidebar
├── theme-provider.tsx        # Theme context provider
├── theme-toggle.tsx          # Dark/Light mode toggle
│
├── sidebar/                  # ⭐ Sidebar components
│   ├── app-sidebar.tsx       # Main sidebar container
│   ├── org-switcher.tsx      # Workspace/Org switcher dropdown
│   ├── nav-inbox.tsx         # Inbox navigation section
│   ├── nav-workspace.tsx     # Workspace items (Teams, Projects, Members)
│   ├── nav-teams.tsx         # Teams list với collapsible items
│   ├── nav-team-item.tsx     # Individual team item
│   ├── nav-account.tsx       # Account settings nav (for settings page)
│   ├── nav-features.tsx      # Features nav section
│   ├── nav-teams-settings.tsx# Teams settings nav
│   ├── back-to-app.tsx       # Back navigation từ settings
│   ├── help-button.tsx       # Help/support button
│   └── create-new-task/      # Quick create task button
│
└── headers/                  # Page-specific headers
    ├── teams/
    │   ├── header.tsx        # Teams page header
    │   ├── header-nav.tsx    # Navigation + breadcrumb
    │   └── header-options.tsx# Actions (filter, create)
    ├── projects/
    │   ├── header.tsx
    │   ├── header-nav.tsx
    │   └── header-options.tsx
    ├── members/
    │   └── ...
    ├── settings/
    │   └── ...
    └── tasks/
        └── ...
```

### 2.3 AppSidebar Structure

```tsx
// components/layout/sidebar/app-sidebar.tsx

<Sidebar collapsible="offcanvas">
   <SidebarHeader>{isSettings ? <BackToApp /> : <OrgSwitcher />}</SidebarHeader>

   <SidebarContent>
      {isSettings ? (
         <>
            <NavAccount /> {/* Account settings */}
            <NavFeatures /> {/* Feature settings */}
            <NavTeamsSettings />
            {/* Teams settings */}
         </>
      ) : (
         <>
            <NavInbox /> {/* Inbox, My tasks */}
            <NavWorkspace /> {/* Teams, Projects, Members */}
            <NavTeams /> {/* Your teams list */}
         </>
      )}
   </SidebarContent>

   <SidebarFooter>
      <HelpButton />
      <GitHubLink />
   </SidebarFooter>
</Sidebar>
```

### 2.4 OrgSwitcher (Workspace Switcher)

```tsx
// components/layout/sidebar/org-switcher.tsx

Features:
- Workspace name + icon display
- Dropdown menu với:
  - Settings link (G then S shortcut)
  - Invite and manage members
  - Download desktop app
  - Switch Workspace submenu
  - Log out (⌥⇧Q shortcut)
- ThemeToggle button
- CreateNewTask button
```

### 2.5 Navigation Items

```typescript
// mock-data/side-bar-nav.ts

export const inboxItems = [
   { name: 'Inbox', url: '/{orgId}/inbox', icon: Inbox },
   { name: 'My tasks', url: '/{orgId}/my-tasks', icon: FolderKanban },
];

export const workspaceItems = [
   { name: 'Teams', url: '/{orgId}/teams', icon: ContactRound },
   { name: 'Projects', url: '/{orgId}/projects', icon: Box },
   { name: 'Members', url: '/{orgId}/members', icon: Users },
];

export const accountItems = [
   { name: 'Account', url: '/settings/account', icon: UserRound },
   { name: 'Preferences', url: '/settings/preferences', icon: Settings },
   { name: 'Profile', url: '/settings/profile', icon: UserRound },
   { name: 'Notifications', url: '/settings/notifications', icon: Bell },
   { name: 'Security & access', url: '/settings/security', icon: KeyRound },
   { name: 'Connected accounts', url: '/settings/connected-accounts', icon: Users },
];
```

### 2.6 Header Pattern

```tsx
// Pattern cho mỗi page header

// components/layout/headers/teams/header.tsx
export default function Header() {
   return (
      <div className="w-full flex flex-col items-center">
         <HeaderNav /> {/* Breadcrumb + Title */}
         <HeaderOptions /> {/* Actions: Filter, Sort, Create */}
      </div>
   );
}
```

### 2.7 Content Components (Common)

```
components/common/
├── teams/
│   ├── teams.tsx          # Teams list với table view
│   ├── team-line.tsx      # Single team row
│   └── ...
├── projects/
│   ├── projects.tsx       # Projects list với table view
│   ├── project-line.tsx   # Single project row
│   ├── status-with-percent.tsx
│   └── ...
├── members/
│   ├── members.tsx        # Members list
│   └── ...
├── inbox/
│   ├── inbox.tsx          # Triage inbox
│   └── ...
├── tasks/
│   ├── priority-selector.tsx
│   ├── label-badge.tsx
│   ├── create-task-modal-provider.tsx
│   └── ...
├── ai/
│   └── ...
└── settings/
    └── ...
```

---

## 3. MainLayout Usage Pattern

```tsx
// Cách sử dụng MainLayout cho mọi page

import MainLayout from '@/components/layout/main-layout';
import Header from '@/components/layout/headers/{module}/header';
import { ContentComponent } from '@/components/common/{module}/{component}';

export default function SomePage() {
   return (
      <MainLayout header={<Header />} headersNumber={2}>
         <ContentComponent />
      </MainLayout>
   );
}
```

**MainLayout Props:**

```typescript
interface MainLayoutProps {
   children: React.ReactNode;
   header?: React.ReactNode; // Page-specific header
   headersNumber?: 1 | 2; // Height calculation
}
```

**MainLayout Structure:**

```tsx
<SidebarProvider>
   <CreateTaskModalProvider />
   <AppSidebar />
   <div className="h-svh overflow-hidden lg:p-2 w-full">
      <div className="lg:border lg:rounded-md overflow-hidden flex flex-col bg-container h-full w-full">
         {header}
         <div className="overflow-auto w-full {height}">{children}</div>
      </div>
   </div>
</SidebarProvider>
```

---

## 4. Styling & Theme

### 4.1 CSS Variables (Linear-style)

```css
/* demo/app/globals.css */

:root {
   --linear-bg-primary: #0d0d0d;
   --linear-bg-secondary: #1a1a1a;
   --linear-bg-tertiary: #262626;
   --linear-text-primary: #ffffff;
   --linear-text-secondary: #a3a3a3;
   --linear-accent: #5e6ad2;
   --linear-border: #333333;
}

.dark {
   --background: var(--linear-bg-primary);
   --foreground: var(--linear-text-primary);
   --card: var(--linear-bg-secondary);
   --sidebar: var(--linear-bg-secondary);
   --accent: var(--linear-accent);
   /* ... */
}
```

### 4.2 Linear-style CSS Classes

```css
.linear-nav-item { ... }
.linear-nav-item.active { ... }
.linear-section-header { ... }
.linear-toggle { ... }
.linear-button { ... }
.linear-card { ... }
.linear-input { ... }
```

---

## 5. Workspace Page Logic

**File:** `app/[orgId]/page.tsx`

```typescript
import { Suspense } from 'react';
import { getUserRole } from '@/lib/rbac';
import { WorkspaceOverview } from '@/components/dashboards/workspace-overview';
import { redirect } from 'next/navigation';

async function DashboardContent({ orgId }: { orgId: string }) {
   const userRole = await getUserRole(orgId);

   if (!userRole) {
      redirect('/auth/signin');
   }

   return <WorkspaceOverview orgId={orgId} userRole={userRole} />;
}

export default async function OrgIdPage({ params }: OrgIdPageProps) {
    // ...
}
```

---

## 6. Dashboard Components (cần tạo)

```
components/
└── dashboards/
    ├── creator-dashboard.tsx     # Dashboard cho Creator role
    ├── brand-dashboard.tsx       # Dashboard cho Brand Owner role
    └── admin-dashboard.tsx       # Dashboard cho Admin role
```

**Interface:**

```typescript
interface DashboardProps {
   orgId: string;
}

export function CreatorDashboard({ orgId }: DashboardProps) { ... }
export function BrandDashboard({ orgId }: DashboardProps) { ... }
export function AdminDashboard({ orgId }: DashboardProps) { ... }
```

---

## 6. Dashboard Widgets (theo role)

### 6.1 CreatorDashboard

Dành cho Content Creator - người tạo nội dung.

**Widgets:**
| Widget | Mô tả | Data Source |
|--------|-------|-------------|
| My Tasks | Tasks được assign cho user | `useTasks({ assigneeId })` |
| Recent Activity | Activity log gần đây | `useActivityLog()` |
| Scheduled Posts | Các post đã lên lịch | `useScheduledPosts()` |
| Quick Create | Form tạo task nhanh | `useCreateTask()` |

### 6.2 BrandDashboard

Dành cho Brand Owner - chủ thương hiệu.

**Widgets:**
| Widget | Mô tả | Data Source |
|--------|-------|-------------|
| Projects Overview | Tổng quan projects | `useProjects(orgId)` |
| Team Performance | Analytics team | `useTeamStats()` |
| Campaign Status | Trạng thái campaigns | `useCampaigns()` |
| Content Calendar | Lịch nội dung | `useContentCalendar()` |

### 6.3 AdminDashboard

Dành cho Admin - quản trị viên.

**Widgets:**
| Widget | Mô tả | Data Source |
|--------|-------|-------------|
| Workspace Stats | Thống kê workspace | `useWorkspaceStats()` |
| Teams Overview | Danh sách teams | `useTeams(orgId)` |
| Members | Thành viên | `useMembers(orgId)` |
| System Health | Trạng thái hệ thống | `useSystemHealth()` |
| Activity Feed | Hoạt động toàn workspace | `useActivityFeed()` |

---

## 7. Sub-pages Implementation

### 7.1 Teams Page

**Route:** `/{orgId}/teams`

**File:** `app/[orgId]/teams/page.tsx`

```tsx
import Teams from '@/components/common/teams/teams';
import Header from '@/components/layout/headers/teams/header';
import MainLayout from '@/components/layout/main-layout';

export default function TeamsPage() {
   return (
      <MainLayout header={<Header />}>
         <Teams />
      </MainLayout>
   );
}
```

**Component `Teams`:**

- Hook: `useTeams(orgId)`
- Render: Table với columns: Name, Membership, Identifier, Members, Projects
- Empty state: "No teams found. Create one to get started."

---

### 7.2 Projects Page

**Route:** `/{orgId}/projects`

**File:** `app/[orgId]/projects/page.tsx`

```tsx
import Projects from '@/components/common/projects/projects';
import Header from '@/components/layout/headers/projects/header';
import MainLayout from '@/components/layout/main-layout';

export default function ProjectsPage() {
   return (
      <MainLayout header={<Header />}>
         <Projects />
      </MainLayout>
   );
}
```

**Component `Projects`:**

- Hook: `useProjects(orgId)`
- Render: Table với columns: Title, Health, Priority, Lead, Target date, Status
- Empty state: "No projects found."

---

### 7.3 Inbox Page

**Route:** `/{orgId}/inbox`

**File:** `app/[orgId]/inbox/page.tsx`

```tsx
import MainLayout from '@/components/layout/main-layout';
import Inbox from '@/components/common/inbox/inbox';

export default function InboxPage() {
   return (
      <MainLayout>
         <Inbox />
      </MainLayout>
   );
}
```

---

### 7.4 Team Issues Page (Linear-style)

**Route:** `/{orgId}/team/{teamId}/all`

**File:** `app/[orgId]/team/[teamId]/all/page.tsx`

```tsx
import AllIssues from '@/components/common/issues/all-issues';
import Header from '@/components/layout/headers/issues/header';
import MainLayout from '@/components/layout/main-layout';

export default function AllIssuesPage() {
   return (
      <MainLayout header={<Header />}>
         <AllIssues />
      </MainLayout>
   );
}
```

---

### 7.5 Schedules Page

**Route:** `/{orgId}/schedules`

**File:** `app/[orgId]/schedules/page.tsx`

```tsx
import { Suspense } from 'react';
import { ScheduleCalendar } from '@/components/schedules/schedule-calendar';

export default async function SchedulesPage({ params }) {
   const { orgId } = await params;

   return (
      <div className="container mx-auto py-6">
         <div className="mb-6">
            <h1 className="text-3xl font-bold">Content Scheduling</h1>
            <p className="text-gray-600 mt-2">
               Schedule your content for publication and manage your posting calendar.
            </p>
         </div>

         <Suspense fallback={<div>Loading calendar...</div>}>
            <ScheduleCalendar orgId={orgId} />
         </Suspense>
      </div>
   );
}
```

---

## 8. Hooks cần implement

| Hook                | File                           | API Endpoint                   | Return Type       |
| ------------------- | ------------------------------ | ------------------------------ | ----------------- |
| `useTeams`          | `hooks/use-teams.ts`           | `/api/[orgId]/teams`           | `Team[]`          |
| `useProjects`       | `hooks/use-projects.ts`        | `/api/[orgId]/projects`        | `Project[]`       |
| `useMembers`        | `hooks/use-members.ts`         | `/api/[orgId]/members`         | `Member[]`        |
| `useTasks`          | `hooks/use-tasks.ts`           | `/api/[orgId]/tasks`           | `Task[]`          |
| `useWorkspaceStats` | `hooks/use-workspace-stats.ts` | `/api/[orgId]/stats`           | `WorkspaceStats`  |
| `useActivityLog`    | `hooks/use-activity-log.ts`    | `/api/[orgId]/activities`      | `Activity[]`      |
| `useScheduledPosts` | `hooks/use-scheduled-posts.ts` | `/api/[orgId]/scheduled-posts` | `ScheduledPost[]` |

---

## 9. API Routes cần implement

```
demo/app/api/[orgId]/
├── teams/route.ts           # GET: list teams, POST: create team
├── projects/route.ts        # GET: list projects, POST: create project
├── members/route.ts         # GET: list members
├── tasks/route.ts           # GET: list tasks, POST: create task
├── activities/route.ts      # GET: activity log
├── stats/route.ts           # GET: workspace statistics
└── scheduled-posts/route.ts # GET: scheduled posts, POST: schedule post
```

---

## 10. Component Tree

```
[orgId]/page.tsx
└── <Suspense>
    └── <DashboardContent>
        └── <MainLayout>
            ├── <AppSidebar>
            └── <WorkspaceOverview> (Unified)
                ├── <MyTasksWidget> (Always visible)
                ├── <TeamsWidget> (Always visible)
                ├── <StatsWidget> (Admin/Brand only)
                └── <ScheduleWidget> (Creator only)
```

---

## 11. Sidebar Navigation Structure

```typescript
// mock-data/side-bar-nav.ts

export const inboxItems = [
   { name: 'Inbox', url: '/{orgId}/inbox', icon: Inbox },
   { name: 'My tasks', url: '/{orgId}/my-tasks', icon: FolderKanban },
];

export const workspaceItems = [
   { name: 'Teams', url: '/{orgId}/teams', icon: ContactRound },
   { name: 'Projects', url: '/{orgId}/projects', icon: Box },
   { name: 'Members', url: '/{orgId}/members', icon: Users },
];
```

---

## 12. Loading States

**Spinner component:**

```tsx
<div className="min-h-screen flex items-center justify-center bg-background">
   <div className="text-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      <div className="text-lg font-medium">Loading dashboard...</div>
      <div className="text-sm text-muted-foreground">
         Please wait while we set up your workspace
      </div>
   </div>
</div>
```

---

## 13. Implementation Checklist

### Backend

- [ ] `lib/rbac.ts` - `getUserRole(orgId)` function
- [ ] API routes cho teams, projects, members, tasks
- [ ] Database schema với Membership model
- [ ] Activity logging

### Frontend

- [ ] `components/dashboards/creator-dashboard.tsx`
- [ ] `components/dashboards/brand-dashboard.tsx`
- [ ] `components/dashboards/admin-dashboard.tsx`
- [ ] Dashboard widgets cho từng role
- [ ] Loading và error states

### Tái sử dụng từ demo

- [x] `MainLayout` component
- [x] `AppSidebar` component
- [x] `Teams` component
- [x] `Projects` component
- [x] `Members` component
- [x] `Inbox` component
- [x] `AllIssues` component
- [x] Header components

---

## 14. Related Documents

- [CIRCLE-INTEGRATION.md](../CIRCLE-INTEGRATION.md) - Circle UI mapping
- [PRD.md](../PRD.md) - Product requirements
- [GLOSSARY.md](../GLOSSARY.md) - Term mappings
- [teams-and-members.md](./teams-and-members.md) - Teams module
- [analysis-dashboards.md](./analysis-dashboards.md) - Analytics
