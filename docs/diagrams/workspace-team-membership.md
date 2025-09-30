# Workspace-Team-Membership ERD

Relationship snapshot linking Workspace, Team, Member, Membership, and RolePermission for the initial RBAC schema described in `docs/DATA-MODEL.md` and `docs/modules/teams-and-members.md`.

```mermaid
erDiagram
    WORKSPACE {
        uuid id PK
        text name
        text slug
    }
    TEAM {
        uuid id PK
        uuid workspace_id FK
        text name
        text key
        uuid workflow_id FK
    }
    MEMBER {
        uuid id PK
        uuid workspace_id FK
        text email
        text display_name
        text status
    }
    MEMBERSHIP {
        uuid id PK
        uuid member_id FK
        uuid team_id FK
        text role
    }
    ROLE_PERMISSION {
        text role PK
        text resource
        text action
    }

    WORKSPACE ||--o{ TEAM : hosts
    WORKSPACE ||--o{ MEMBER : includes
    TEAM ||--o{ MEMBERSHIP : manages
    MEMBER ||--o{ MEMBERSHIP : participates
    WORKSPACE ||--o{ ROLE_PERMISSION : defines
```

```mermaid
mindmap
  root((RBAC Context))
    Workspace
      Team structure
      Role catalog
    Team
      Workflow config
      Membership roster
    Member
      Profile & status
      Invitations
    Membership
      Role assignment
      RLS policies
```

