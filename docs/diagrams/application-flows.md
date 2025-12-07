# Marketing OS - Application Flow Diagrams

Tài liệu mô tả tất cả các luồng (flows) của ứng dụng Marketing OS (AiM) dưới dạng Mermaid diagrams, được tổ chức theo module.

---

# Module 1: Authentication & Authorization

## 1.1 Login Flow

```mermaid
flowchart TD
    A["User visits app"] --> B{"Has session?"}
    B -->|Yes| C{"Has workspace?"}
    B -->|No| D["Login Page"]
    
    C -->|Yes| E["Redirect to Workspace"]
    C -->|No| F["Onboarding Page"]
    
    D --> G{"Login method"}
    G -->|Magic Link| H["Enter email"]
    G -->|Password| I["Enter email and password"]
    G -->|Google OAuth| J["Redirect to Google"]
    
    H --> K["Check email for link"]
    K --> L["Auth Callback"]
    I --> L
    J --> L
    
    L --> C
```

## 1.2 Registration Flow

```mermaid
flowchart TD
    A["Register Page"] --> B["Enter name, email, password"]
    B --> C["supabase.auth.signUp"]
    C --> D{"Success?"}
    D -->|Yes| E["Check email for verification"]
    D -->|No| F["Show error"]
    F --> B
    
    E --> G["Click verification link"]
    G --> H["Auth Callback"]
    H --> I{"Has workspace?"}
    I -->|Yes| J["Workspace Page"]
    I -->|No| K["Onboarding Page"]
```

## 1.3 Password Recovery Flow

```mermaid
flowchart TD
    A["Forgot Password Page"] --> B["Enter email"]
    B --> C["resetPasswordForEmail"]
    C --> D["Check email for reset link"]
    D --> E["Click reset link"]
    E --> F["Reset Password Page"]
    F --> G["Enter new password"]
    G --> H["updateUser"]
    H --> I{"Success?"}
    I -->|Yes| J["Login Page"]
    I -->|No| K["Show error"]
```

## 1.4 Logout Flow

```mermaid
flowchart TD
    A["User clicks Logout"] --> B["supabase.auth.signOut"]
    B --> C["Clear session"]
    C --> D["Redirect to Login"]
```

## 1.5 RBAC Permission Flow

```mermaid
flowchart TD
    A["User Action"] --> B{"Check Permission"}
    
    B --> C["Get user role from workspace"]
    C --> D{"Role?"}
    
    D -->|Owner| E["Full access"]
    D -->|Admin| F["Manage teams, members, tasks"]
    D -->|Member| G["Create and edit own tasks"]
    D -->|Guest| H["View only"]
    
    subgraph Permissions["Role Permissions"]
        I["Owner: All actions"]
        J["Admin: Manage team"]
        K["Member: CRUD tasks"]
        L["Guest: Read only"]
    end
    
    E --> M["Execute action"]
    F --> N{"Admin allowed?"}
    G --> O{"Member allowed?"}
    H --> P{"Guest allowed?"}
    
    N -->|Yes| M
    N -->|No| Q["Access denied"]
    O -->|Yes| M
    O -->|No| Q
    P -->|Yes| M
    P -->|No| Q
```

---

# Module 2: Onboarding & Workspace

## 2.1 Onboarding Flow

```mermaid
flowchart TD
    F["Onboarding Page"] --> M{"Create or Join?"}
    M -->|Create| N["Create Workspace Page"]
    M -->|Join| O["Join Workspace Page"]
    
    N --> P["Create workspace"]
    P --> E["Redirect to Workspace"]
    
    O --> Q["Wait for invite"]
```

## 2.2 Workspace Creation Flow

```mermaid
flowchart TD
    A["Create Workspace Page"] --> B["Enter workspace name and slug"]
    B --> C["Click Create Workspace"]
    C --> D["Insert into workspace table"]
    D --> E{"Success?"}
    E -->|No| F["Show URL taken error"]
    F --> B
    E -->|Yes| G["Call RPC: assign_user_to_workspace"]
    G --> H{"Success?"}
    H -->|No| I["Show error"]
    H -->|Yes| J["Redirect to Workspace"]
    J --> K["Show empty workspace state"]
    K --> L["Welcome to AiM"]
```

## 2.3 Invite Flow

```mermaid
flowchart TD
    A["Admin sends invite"] --> B["User gets email"]
    B --> C["Click invite link"]
    C --> D["Invite Accept Page"]
    D --> E{"User has account?"}
    E -->|No| F["Show register form"]
    E -->|Yes| G["Show Accept button"]
    F --> H["Create account and set password"]
    H --> I["Join workspace team"]
    G --> I
    I --> J["Redirect to workspace"]
```

---

# Module 3: App Shell & Navigation

## 3.1 Main App Navigation (Linear-style Layout)

```mermaid
flowchart TD
    A["/{orgId} Workspace Root"] --> B{"Has teams?"}
    B -->|No| C["Empty State: Welcome to AiM"]
    B -->|Yes| D["Redirect to /{orgId}/team/{teamId}/all"]
    
    D --> E["Three Column Layout"]
    
    subgraph Layout["Linear-style 3-Column Layout"]
        subgraph Col1["Column 1: Sidebar"]
            S1["Workspace Switcher"]
            S2["Teams List"]
            S3["Strategic"]
            S4["Projects"]
            S5["Phases"]
            S6["Views"]
        end
        
        subgraph Col2["Column 2: Content Area"]
            C1["Task List View"]
            C2["Board View"]
            C3["Timeline View"]
        end
        
        subgraph Col3["Column 3: Detail Panel"]
            D1["Task Details"]
            D2["Comments and Activity"]
            D3["AI Panel"]
            D4["Attachments"]
        end
    end
    
    E --> Layout
```

## 3.2 Workspace Routes Structure

```mermaid
flowchart LR
    subgraph Workspace["/{orgId}"]
        R1["/ - Root redirect"]
        R2["/inbox - Triage Inbox"]
        R3["/teams - All Teams"]
        R4["/projects - All Projects"]
        R5["/members - All Members"]  
        R6["/settings - Settings"]
    end
    
    subgraph Team["/{orgId}/team/{teamId}"]
        T1["/all - All Tasks"]
        T2["/active - Active Tasks"]
        T3["/backlog - Backlog"]
    end
    
    subgraph Task["/{orgId}/task/{taskId}"]
        K1["Task Detail Panel"]
    end
    
    R1 --> T1
    T1 --> K1
```

## 3.3 UI Component Hierarchy

```mermaid
flowchart TD
    subgraph Shell["App Shell"]
        H["Header: Logo, Search, Profile"]
        B["Breadcrumb: Strategic > Project > Task"]
    end
    
    subgraph Main["Main Content"]
        subgraph Sidebar["Sidebar - Collapsible"]
            SB1["Workspace Name"]
            SB2["Team Navigation"]
            SB3["Quick Filters"]
        end
        
        subgraph Content["Center Panel"]
            CT1["View Tabs: List / Board / Timeline"]
            CT2["Filter Bar"]
            CT3["Task List or Board"]
        end
        
        subgraph Detail["Right Panel - Slide Out"]
            DT1["Task Title and Status"]
            DT2["Properties: Assignee, Priority, Labels"]
            DT3["Description Editor"]
            DT4["Comments Section"]
            DT5["AI Panel: Generate, Review, Submit"]
        end
    end
    
    Shell --> Main
    Sidebar --> Content
    Content --> Detail
```

---

# Module 4: Team & Member Management

## 4.1 Team Management Flow

```mermaid
flowchart TD
    A["Teams Page"] --> B["View Teams List"]
    
    B --> C{"Action?"}
    C -->|View Team| D["Team Page"]
    C -->|Create Team| E["Open Create Dialog"]
    C -->|Edit Team| F["Open Edit Dialog"]
    
    D --> G["Team Tasks View"]
    
    E --> H["Enter name, key, description"]
    H --> I["Insert team"]
    I --> B
    
    subgraph Views["Team Views"]
        J["All Tasks"]
        K["Active"]
        L["Backlog"]
        M["Board"]
        N["Timeline"]
    end
    
    G --> J
    G --> K
    G --> L
    G --> M
    G --> N
```

---

# Module 5: Task Management

## 5.1 Task CRUD Flow

```mermaid
flowchart TD
    A["Task List View"] --> B{"Action?"}
    
    B -->|View Task| C["Task Detail Page"]
    B -->|Create Task| D["Open Create Form"]
    B -->|Filter| E["Apply Filters"]
    B -->|Sort| F["Change Sort Order"]
    
    C --> G["Task Detail Panel"]
    
    G --> H{"Edit Field?"}
    H -->|Title| I["Update title"]
    H -->|Status| J["Change workflow state"]
    H -->|Assignee| K["Assign member"]
    H -->|Priority| L["Set priority 0-4"]
    H -->|Labels| M["Add or remove labels"]
    H -->|Due Date| N["Set deadline"]
    
    D --> O["Fill task details"]
    O --> P["Submit"]
    P --> Q["Insert task"]
    Q --> A
```

---

# Module 6: System Architecture

## 6.1 Application State Machine

```mermaid
stateDiagram-v2
    [*] --> Unauthenticated
    
    Unauthenticated --> Login : Visit app
    Login --> Authenticated : Login success
    Login --> Register : Create account
    Register --> Authenticated : Registration success
    
    Authenticated --> Onboarding : No workspace
    Authenticated --> Workspace : Has workspace
    
    Onboarding --> CreateWorkspace : Choose create
    Onboarding --> JoinWorkspace : Choose join
    
    CreateWorkspace --> Workspace : Created
    JoinWorkspace --> Workspace : Joined
    
    Workspace --> TeamView : Select team
    Workspace --> TaskDetail : View task
    Workspace --> Settings : Configure
    
    TeamView --> TaskDetail : Click task
    TaskDetail --> TeamView : Back
    
    Workspace --> Unauthenticated : Logout
```

## 6.2 Data Flow - Supabase Architecture

```mermaid
flowchart LR
    subgraph Frontend["Frontend"]
        A["Next.js App"]
        B["TanStack Query"]
    end
    
    subgraph Backend["Supabase"]
        C["Auth"]
        D["Database PostgreSQL"]
        E["RLS Policies"]
        F["RPC Functions"]
    end
    
    A --> C
    A --> B
    B --> D
    D --> E
    E --> F
    
    subgraph Tables["Tables"]
        G["workspace"]
        H["team"]
        I["users"]
        J["task"]
        K["project"]
        L["team_member"]
    end
    
    D --> G
    D --> H
    D --> I
    D --> J
    D --> K
    D --> L
```

---

# Route Map

| Module | Route | Description |
|--------|-------|-------------|
| **Auth** | `/login` | Login page |
| **Auth** | `/register` | Registration page |
| **Auth** | `/forgot-password` | Password recovery |
| **Auth** | `/auth/callback` | OAuth callback |
| **Auth** | `/auth/reset-password` | Reset password form |
| **Onboarding** | `/onboarding` | Choose create or join |
| **Onboarding** | `/onboarding/create` | Create workspace |
| **Onboarding** | `/onboarding/join` | Join workspace |
| **Onboarding** | `/invite/accept` | Accept invitation |
| **Workspace** | `/{workspaceId}` | Workspace root |
| **Team** | `/{workspaceId}/teams` | All teams |
| **Team** | `/{workspaceId}/team/{teamId}` | Team view |
| **Task** | `/{workspaceId}/task/{taskId}` | Task detail |
| **Other** | `/{workspaceId}/projects` | All projects |
| **Other** | `/{workspaceId}/members` | All members |
| **Other** | `/{workspaceId}/inbox` | Triage inbox |
| **Other** | `/{workspaceId}/settings` | Settings |
