import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'node:crypto';

import { users } from '../mock-data/users';
import { teams as mockTeams } from '../mock-data/teams';
import { labels as mockLabels } from '../mock-data/labels';
import { phases as mockPhases } from '../mock-data/phases';
import { projects as mockProjects } from '../mock-data/projects';
import { tasks as mockTasks } from '../mock-data/tasks';
import { status as mockStatuses } from '../mock-data/status';

const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
   console.error(
      'Missing Supabase credentials. Ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE are set.'
   );
   process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE, {
   auth: {
      persistSession: false,
      autoRefreshToken: false,
   },
});

const WORKSPACE_SLUG = 'marketing-os-demo';
const WORKSPACE_NAME = 'Marketing OS Demo Workspace';

const statusCategoryMap: Record<
   string,
   'backlog' | 'unstarted' | 'started' | 'completed' | 'cancelled'
> = {
   'backlog': 'backlog',
   'to-do': 'unstarted',
   'in-progress': 'started',
   'technical-review': 'started',
   'paused': 'started',
   'completed': 'completed',
};

const toISO = (value?: string | null) => {
   if (!value) return null;
   const date = new Date(value);
   if (Number.isNaN(date.getTime())) return null;
   return date.toISOString();
};

const slugify = (input: string) =>
   input
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

const toTeamKey = (input: string) =>
   input
      .replace(/[^a-zA-Z0-9]/g, '')
      .slice(0, 8)
      .toUpperCase();

async function main() {
   console.log('[seed] Seeding Supabase with Marketing OS mock data...');

   // Clean up existing data (optional, be careful in production)
   await supabase.from('workspace').delete().eq('slug', WORKSPACE_SLUG);

   // 1. Workspace
   const workspaceId = randomUUID();
   const workspaceRow = {
      id: workspaceId,
      name: WORKSPACE_NAME,
      slug: WORKSPACE_SLUG,
   };

   const { error: workspaceError } = await supabase.from('workspace').insert(workspaceRow);
   if (workspaceError) throw workspaceError;
   console.log('[seed] Workspace created:', WORKSPACE_NAME);

   // 2. Users (formerly Member)
   const memberByEmail = new Map<string, string>();
   const userRows: any[] = [];

   for (const user of users) {
      // Check if user exists in Auth (optional, or just create)
      // For seeding, we'll try to create. If exists, we might need to fetch.
      // To keep it simple, we'll try create and catch error, or list users.

      // Actually, for a clean seed, we want to create them.
      // But we can't easily delete auth users via client without admin rights (which we have).

      // Let's try to create user.
      const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
         email: user.email,
         password: 'password123', // Default password
         email_confirm: true,
         user_metadata: { display_name: user.name, avatar_url: user.avatarUrl },
      });

      let userId = authUser.user?.id;

      if (authError) {
         // If user already exists, try to find it?
         // Or just ignore if we can't get the ID?
         // For now, let's log and skip or try to fetch.
         console.warn(
            `[seed] User ${user.email} creation failed (maybe exists):`,
            authError.message
         );
         // Try to fetch user by email? Admin API listUsers?
         // Not efficient.
         // Let's assume clean DB or handle manually.
         // If we can't get ID, we can't insert into public.users.
         continue;
      }

      if (userId) {
         memberByEmail.set(user.email, userId);
         userRows.push({
            id: userId,
            workspace_id: workspaceId,
            email: user.email,
            display_name: user.name,
            avatar_url: user.avatarUrl,
            status: 'active',
            role: 'member',
         });
      }
   }

   if (userRows.length > 0) {
      // Note: The trigger handle_new_user might have already created the user in public.users!
      // If so, we should UPSERT or update.
      // The trigger creates user with default workspace.
      // We are creating a specific workspace here.
      // So we might have duplicate records if we don't handle it.
      // But public.users PK is id. So one user = one record?
      // Wait, public.users has (id, workspace_id).
      // PK is id. So one user can only be in ONE workspace?
      // My schema: `id uuid not null primary key references auth.users(id)`
      // Yes, 1:1 mapping between Auth User and Public User Profile.
      // And `workspace_id` is a column. So a user belongs to ONE workspace (the active one?).
      // If I want multi-workspace, I need a `workspace_member` table.
      // My schema has `team_member` but `users` table has `workspace_id`.
      // This implies a user is "homed" in one workspace?
      // Or `users` is just the profile, and `workspace_id` is the "default" or "owner" workspace?
      // The trigger `handle_new_user` inserts into `public.users`.

      // So `createUser` -> Trigger -> Insert `public.users`.
      // So `userRows` insert will fail with "duplicate key" if trigger ran.

      // We should UPDATE the existing record created by trigger, or UPSERT.

      const { error: userError } = await supabase.from('users').upsert(userRows);
      if (userError) throw userError;
      console.log(`[seed] Upserted ${userRows.length} users`);
   }

   // 3. Teams
   const teamIdByKey = new Map<string, string>();
   const teamIdBySlug = new Map<string, string>();
   const teamRows = mockTeams.map((team) => {
      const id = randomUUID();
      const key = toTeamKey(team.id || team.name);
      const slug = slugify(team.name);
      teamIdByKey.set(team.id, id);
      teamIdBySlug.set(slug, id);
      return {
         id,
         workspace_id: workspaceId,
         name: team.name,
         key,
         color: team.color ?? null,
         icon: null,
      };
   });

   const { error: teamError } = await supabase.from('team').insert(teamRows);
   if (teamError) throw teamError;
   console.log(`[seed] Inserted ${teamRows.length} teams`);

   // 4. Workflow States
   const stateIdByTeam = new Map<string, Map<string, string>>();
   const workflowStateRows: any[] = [];

   for (const team of teamRows) {
      const stateMap = new Map<string, string>();
      mockStatuses.forEach((status, index) => {
         const stateId = randomUUID();
         let type = statusCategoryMap[status.id] ?? 'started';
         // Map 'technical-review' etc to standard types
         if (status.id === 'backlog') type = 'backlog';
         if (status.id === 'to-do') type = 'unstarted';
         if (status.id === 'completed') type = 'completed';

         workflowStateRows.push({
            id: stateId,
            team_id: team.id,
            name: status.name,
            type,
            position: index * 1000, // Float position
            color: status.color ?? '#ccc',
         });
         stateMap.set(status.id, stateId);
      });
      stateIdByTeam.set(team.id, stateMap);
   }

   const { error: wfError } = await supabase.from('workflow_state').insert(workflowStateRows);
   if (wfError) throw wfError;
   console.log(`[seed] Inserted ${workflowStateRows.length} workflow states`);

   // 5. Phases (Cycles)
   const phaseRows: any[] = [];
   const phaseIdMap = new Map<string, string>();

   mockPhases.forEach((phase, index) => {
      const teamSlug = slugify(phase.teamId ?? '');
      const teamId = teamIdBySlug.get(teamSlug);
      if (!teamId) return;

      const id = randomUUID();
      phaseRows.push({
         id,
         team_id: teamId,
         name: phase.name,
         sequence_index: phase.number ?? index,
         start_date: toISO(phase.startDate),
         end_date: toISO(phase.endDate),
         status: phase.progress >= 100 ? 'completed' : 'active',
      });
      phaseIdMap.set(phase.id, id);
   });

   if (phaseRows.length) {
      const { error: phaseError } = await supabase.from('phase').insert(phaseRows);
      if (phaseError) throw phaseError;
   }
   console.log(`[seed] Inserted ${phaseRows.length} phases`);

   // 6. Labels
   const labelRows: any[] = [];
   const labelIdByTeam = new Map<string, Map<string, string>>();

   for (const team of teamRows) {
      const map = new Map<string, string>();
      mockLabels.forEach((label) => {
         const id = randomUUID();
         labelRows.push({
            id,
            team_id: team.id,
            name: label.name,
            color: label.color ?? null,
         });
         map.set(label.name, id);
      });
      labelIdByTeam.set(team.id, map);
   }

   const { error: labelError } = await supabase.from('label').insert(labelRows);
   if (labelError) throw labelError;
   console.log(`[seed] Inserted ${labelRows.length} labels`);

   // 7. Team Members (Membership)
   const membershipRows: any[] = [];
   for (const team of mockTeams) {
      const teamId = teamIdByKey.get(team.id);
      if (!teamId) continue;

      const members = team.members ?? [];
      members.forEach((user, index) => {
         const userId = memberByEmail.get(user.email);
         if (!userId) return;

         let role = 'member';
         if (index === 0) role = 'owner';
         else if (user.role === 'Admin') role = 'admin';
         else if (user.role === 'Guest') role = 'guest';

         membershipRows.push({
            id: randomUUID(),
            user_id: userId,
            team_id: teamId,
            role,
         });
      });
   }

   if (membershipRows.length) {
      const { error: memError } = await supabase.from('team_member').insert(membershipRows);
      if (memError) throw memError;
   }
   console.log(`[seed] Linked ${membershipRows.length} team memberships`);

   // 8. Projects
   const projectRows: any[] = [];
   const projectIdMap = new Map<string, string>();
   const projectTeamMap = new Map<string, string>(); // Main team for project

   for (const project of mockProjects) {
      const candidateTeamKeys = project.lead?.teamIds ?? [];
      let teamId: string | undefined;
      for (const key of candidateTeamKeys) {
         teamId = teamIdByKey.get(key);
         if (teamId) break;
      }
      if (!teamId) teamId = teamRows[0]?.id;
      if (!teamId) continue;

      const id = randomUUID();
      projectIdMap.set(project.id, id);
      projectTeamMap.set(project.id, teamId);

      projectRows.push({
         id,
         workspace_id: workspaceId,
         team_ids: [teamId], // Array
         name: project.name,
         description: project.status?.name ?? null,
         state: 'planned', // Default
         health: 'on_track',
         start_date: toISO(project.startDate),
      });
   }

   if (projectRows.length) {
      const { error: projError } = await supabase.from('project').insert(projectRows);
      if (projError) throw projError;
   }
   console.log(`[seed] Inserted ${projectRows.length} projects`);

   // 9. Tasks
   const taskRows: any[] = [];
   const taskIdMap = new Map<string, string>();
   const parentAllocations: Array<{ childId: string; parentId: string }> = [];
   const taskLabelAllocations: Array<{ taskId: string; labelId: string }> = [];

   for (const task of mockTasks) {
      let teamId: string | undefined;
      if (task.project) teamId = projectTeamMap.get(task.project.id);
      if (!teamId && task.assignee) {
         for (const teamKey of task.assignee.teamIds) {
            teamId = teamIdByKey.get(teamKey);
            if (teamId) break;
         }
      }
      if (!teamId) teamId = teamRows[0]?.id;
      if (!teamId) continue;

      const stateId = stateIdByTeam.get(teamId)?.get(task.status.id) ?? null;
      const assigneeId = task.assignee ? (memberByEmail.get(task.assignee.email) ?? null) : null;
      const projectId = task.project ? (projectIdMap.get(task.project.id) ?? null) : null;
      const phaseId = phaseIdMap.get(task.phaseId) ?? null;

      const id = randomUUID();
      taskIdMap.set(task.id, id);

      // Labels
      const labelMap = labelIdByTeam.get(teamId);
      if (task.labels && labelMap) {
         task.labels.forEach((l) => {
            const labelId = labelMap.get(l.name);
            if (labelId) taskLabelAllocations.push({ taskId: id, labelId });
         });
      }

      taskRows.push({
         id,
         workspace_id: workspaceId,
         team_id: teamId,
         // number: auto-generated by trigger
         title: task.title,
         description: task.description ?? '',
         priority: task.priority?.id === 'urgent' ? 1 : task.priority?.id === 'high' ? 2 : 3,
         state_id: stateId,
         assignee_id: assigneeId,
         project_id: projectId,
         phase_id: phaseId,
         due_date: toISO(task.dueDate),
         created_at: toISO(task.createdAt) ?? new Date().toISOString(),
      });

      if (task.subtasks?.length) {
         const parentId = id;
         for (const subId of task.subtasks) {
            parentAllocations.push({ childId: subId, parentId });
         }
      }
   }

   if (taskRows.length) {
      const { error: taskError } = await supabase.from('task').insert(taskRows);
      if (taskError) throw taskError;
   }
   console.log(`[seed] Inserted ${taskRows.length} tasks`);

   // 10. Task Relations (Subtasks)
   const relationRows: any[] = [];
   for (const allocation of parentAllocations) {
      const childTaskId = taskIdMap.get(allocation.childId);
      const parentTaskId = allocation.parentId;
      if (!childTaskId) continue;

      // Update parent_id column
      await supabase.from('task').update({ parent_id: parentTaskId }).eq('id', childTaskId);

      // Add to relation table
      relationRows.push({
         id: randomUUID(),
         task_id: parentTaskId,
         related_task_id: childTaskId,
         type: 'subtask',
      });
   }

   if (relationRows.length) {
      const { error: relError } = await supabase.from('task_relation').insert(relationRows);
      if (relError) throw relError;
   }
   console.log(`[seed] Linked ${relationRows.length} task relations`);

   // 11. Task Labels
   if (taskLabelAllocations.length) {
      const { error: tlError } = await supabase
         .from('task_label')
         .insert(taskLabelAllocations.map((a) => ({ task_id: a.taskId, label_id: a.labelId })));
      if (tlError) throw tlError;
   }
   console.log(`[seed] Linked ${taskLabelAllocations.length} task labels`);

   console.log('[seed] Supabase seeding completed successfully.');
}

main()
   .catch((error) => {
      console.error('[seed] Seeding failed:', error);
      process.exit(1);
   })
   .finally(() => {
      process.exit(0);
   });
