# Codex Prompt: Glossary Enforcement

```
<task: glossary-enforcement>

# Attach these references
- docs/GLOSSARY.md
- docs/RULES.md
- .cursor/rules/linear-mapping.mdc
- docs/CIRCLE-INTEGRATION.md

# Context
The repo still uses Linear terminology such as "Task" and "Phase" across UI components, Zustand stores, and mock data (for example components/common/tasks, store/tasks-store.ts, mock-data/tasks.ts). According to the glossary and linear-mapping rule, the product vocabulary must use "Task", "Phase", "Strategic", etc. to keep UI, database, and documentation aligned.

# Goal
Apply the glossary rules across the entire codebase (UI, stores, mock data, routes). After the change, all local names, exports, imports, hooks, types, and UI strings should reflect the Marketing OS vocabulary. Do not rename third-party library symbols.

# Detailed requirements
1. **Rename files and folders**
   - components/common/tasks/* -> components/common/tasks/*
   - store/tasks-store.ts -> store/tasks-store.ts
   - mock-data/tasks.ts -> mock-data/tasks.ts
   - Any other project-specific file whose purpose is Task-related (e.g. task-preview, task-line, CreateTaskModalProvider, etc.) should use "task" instead of "task".
2. **Update imports and exports**
   - Fix every import path after renaming.
   - Rename variables/functions/hooks such as useTasksStore, task, tasksByStatus so they use task wording consistently.
3. **UI copy and props**
   - Replace visible strings "Task" -> "Task" and "Tasks" -> "Tasks".
   - Ensure props/context values expose the new naming.
4. **Mock data and types**
   - Rename the Task type to Task (and related interfaces/enums).
   - If a key name is purely UI-facing (e.g. task.identifier), rename it to match the Task vocabulary without breaking logic.
5. **Notes**
   - Do not rename third-party identifiers (e.g. lexorank, react-dnd).
   - Check Next.js routes, layout components, and providers so they all reference the new names.
   - Update barrel files or index exports if they exist.
6. **Verification**
   - Run pnpm lint after renames (add a script invocation if needed) to confirm the codebase builds without errors.
   - Confirm no project-owned code still uses "Task"/"task" (exceptions allowed for comments describing history or third-party names).

# Expected outcome
The repository no longer uses Linear-era terminology in its own code. All names follow the glossary and linear-mapping rule while keeping formatting compliant with the existing Prettier/ESLint setup.
```
