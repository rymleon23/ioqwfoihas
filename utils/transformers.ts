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

    const statusId = dbTask.status || 'todo'; // Or map from dbTask.workflow_state?.name

    // Map Priority
    const priorityId = dbTask.priority || 'no_priority';

    // Map Assignee
    // We treat dbTask as any here to access assignee_id which comes from '*' but is missing in interface
    const rawTask = dbTask as any;
    const assignee = dbTask.assignee ? {
        id: rawTask.assignee_id || 'unknown',
        display_name: dbTask.assignee.display_name || 'Unknown',
        name: dbTask.assignee.display_name || 'Unknown',
        avatar_url: dbTask.assignee.avatar_url || '',
        avatarUrl: dbTask.assignee.avatar_url || '',
        email: '',
        role: 'Member' as const, // Fixed: Capitalized "Member"
        status: 'offline' as const,
        joinedDate: new Date().toISOString(),
        teamIds: [],
        workspaceId: 'mock-ws'
    } : null;

    // Map Project
    const project = dbTask.project ? {
        id: 'proj_mock',
        name: dbTask.project.name,
        // icon: Cuboid, // REMOVED: Component
        // status: status[0], // REMOVED: Object with Component
        statusId: 'to-do',
        percentComplete: 0,
        startDate: new Date().toISOString(),
        targetDate: new Date().toISOString(),
        // lead: users[0], // Users are data-only, likely safe check mock-data/users.ts? Yes they seem safe.
        // Actually, let's play safe and omit lead for now or flatten it if needed, but error was specifically 'icon: function'
        members: [],
        priorityId: 'medium',
        health: { // Fixed: Match Health interface
            id: 'on-track' as const,
            name: 'On Track',
            color: '#00FF00',
            description: 'The project is on track and on schedule.'
        }
    } : undefined;

    return {
        id: dbTask.id,
        identifier: `TSK-${dbTask.number}`,
        title: dbTask.title,
        description: '', // Mock/Default
        statusId: statusId, // STRING
        priorityId: priorityId, // STRING
        labels: [],
        createdAt: new Date(dbTask.created_at).toISOString().split('T')[0], // Map Date -> createdAt (YYYY-MM-DD)
        phaseId: '42', // Mock
        assignee: assignee,
        project: project,
        rank: dbTask.created_at, // Using created_at as rank proxy
        subtasks: [] // Mock
    };
}
