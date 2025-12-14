import { Task as StoreTask } from '@/mock-data/tasks';
import { Task as DBTask } from '@/hooks/use-tasks';
import { status } from '@/mock-data/status';
import { priorities } from '@/mock-data/priorities';
import { labels } from '@/mock-data/labels';

export function dbTaskToStoreTask(dbTask: DBTask): StoreTask {
    // Map Status (Supabase might return 'todo' | 'in_progress' etc, or we map workflow_state)
    // For now, let's assume workflow_state.name maps to our status IDs or we use a default
    // Since the DB query joins workflow_state, we try to match it.
    // Fallback to 'todo' if not found.

    const statusId = dbTask.status || 'todo'; // Or map from dbTask.workflow_state?.name
    const matchedStatus = status.find(s => s.id === statusId) || status[0];

    // Map Priority
    const priorityId = dbTask.priority || 'no_priority';
    const matchedPriority = priorities.find(p => p.id === priorityId) || priorities[0];

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
        icon: undefined,
        status: 'active' as const,
        percentComplete: 0,
        startDate: new Date().toISOString(),
        targetDate: new Date().toISOString(),
        lead: null,
        members: [],
        priority: 'medium' as const, // Added missing field
        health: 'on_track' as const // Added missing field
    } : undefined;

    return {
        id: dbTask.id,
        identifier: `TSK-${dbTask.number}`, // Construct identifier
        title: dbTask.title,
        status: matchedStatus,
        priority: matchedPriority,
        labels: [], // DB doesn't fetch labels yet in useTasks, defaulting to empty
        date: new Date(dbTask.created_at).toLocaleDateString(),
        assignee: assignee,
        project: project,
        rank: dbTask.created_at // Use created_at for ranking for now
    };
}
