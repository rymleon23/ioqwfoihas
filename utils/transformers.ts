import { Task as StoreTask } from '@/mock-data/tasks';
import { Task as DBTask } from '@/hooks/use-tasks';
import { status } from '@/mock-data/status';
import { priorities } from '@/mock-data/priorities';
import { labels } from '@/mock-data/labels';
import { Cuboid } from 'lucide-react';
import { users } from '@/mock-data/users';

// Defines a DTO that is safe to pass from Server to Client (no functions/components)
export interface SerializableTask extends Omit<StoreTask, 'status' | 'priority' | 'project'> {
   statusId: string;
   priorityId: string;
   project?: Omit<StoreTask['project'], 'icon' | 'status' | 'lead' | 'priority'> & {
      iconName?: string; // Optional if we want to map it back
      statusId?: string;
   };
   // Re-add potentially complex fields if they need simplification, but mostly status/priority/icon are the blockers
}

export function dbTaskToStoreTask(dbTask: DBTask): SerializableTask {
   // Map Status (Supabase might return 'todo' | 'in_progress' etc, or we map workflow_state)
   // For now, let's assume workflow_state.name maps to our status IDs or we use a default
   // Since the DB query joins workflow_state, we try to match it.
   // Fallback to 'todo' if not found.

   const statusId = dbTask.status || 'todo';

   // Map Priority (DB Integer -> Store String ID)
   const priorityMap: Record<number, string> = {
      0: 'no-priority',
      1: 'urgent',
      2: 'high',
      3: 'medium',
      4: 'low',
   };
   // Ensure priority is treated as number (it might be string from some loose types, but DB sends number)
   // Fallback to 'no-priority' if undefined or not in map
   const priorityId = priorityMap[Number(dbTask.priority)] || 'no-priority';

   // Map Assignee
   const rawTask = dbTask as any;
   const assignee = dbTask.assignee
      ? {
           id: rawTask.assignee_id || 'unknown',
           display_name: dbTask.assignee.display_name || 'Unknown',
           name: dbTask.assignee.display_name || 'Unknown',
           avatar_url: dbTask.assignee.avatar_url || '',
           avatarUrl: dbTask.assignee.avatar_url || '',
           email: '',
           role: 'Member' as const,
           status: 'offline' as const,
           joinedDate: new Date().toISOString(),
           teamIds: [],
           workspaceId: 'mock-ws',
        }
      : null;

   // Map Project
   const project = dbTask.project
      ? {
           id: 'proj_mock', // We need real ID if possible, but name is what we have for now in join
           name: dbTask.project.name,
           statusId: 'to-do',
           percentComplete: 0,
           startDate: new Date().toISOString(),
           targetDate: new Date().toISOString(),
           members: [],
           priorityId: 'medium',
           health: {
              id: 'on-track' as const,
              name: 'On Track',
              color: '#00FF00',
              description: 'The project is on track and on schedule.',
           },
        }
      : undefined;

   // Identifier Construction
   // If team key exists (e.g. 'CORE'), use 'CORE-123'. Else fallback to 'TSK-123'
   const teamKey = (dbTask as any).team?.key || 'TSK';
   const identifier = `${teamKey}-${dbTask.number}`;

   return {
      id: dbTask.id,
      identifier: identifier,
      title: dbTask.title,
      description: dbTask.description || '', // Map description
      statusId: statusId,
      priorityId: priorityId,
      labels: [],
      createdAt: new Date(dbTask.created_at).toISOString().split('T')[0],
      phaseId: '42',
      assignee: assignee,
      project: project,
      rank: dbTask.created_at,
      subtasks: [],
   };
}
