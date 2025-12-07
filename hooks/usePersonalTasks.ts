'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';

interface PersonalTask {
    id: string;
    title: string;
    description: string | null;
    priority: number;
    status: 'todo' | 'in_progress' | 'done' | 'canceled';
    assignee_id: string;
    workspace_id: string;
    created_at: string;
    updated_at: string;
}

interface CreatePersonalTaskInput {
    workspaceId: string;
    title: string;
    description?: string;
    priority?: number;
}

const statusColors: Record<string, string> = {
    todo: '#3B82F6',
    in_progress: '#F59E0B',
    done: '#10B981',
    canceled: '#EF4444',
};

const statusLabels: Record<string, string> = {
    todo: 'Todo',
    in_progress: 'In Progress',
    done: 'Done',
    canceled: 'Canceled',
};

export function usePersonalTasks(workspaceId: string) {
    const supabase = createClient();

    return useQuery({
        queryKey: ['personal-tasks', workspaceId],
        queryFn: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { data, error } = await supabase
                .from('task')
                .select('*')
                .eq('workspace_id', workspaceId)
                .eq('assignee_id', user.id)
                .is('team_id', null)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data as PersonalTask[];
        },
        enabled: !!workspaceId,
    });
}

export function useCreatePersonalTask() {
    const supabase = createClient();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ workspaceId, title, description, priority = 0 }: CreatePersonalTaskInput) => {
            const { data, error } = await supabase.rpc('create_personal_task', {
                p_workspace_id: workspaceId,
                p_title: title,
                p_description: description || null,
                p_priority: priority,
            });

            if (error) throw error;
            if (!data.success) throw new Error(data.error);

            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['personal-tasks', variables.workspaceId]
            });
        },
    });
}

export function useUpdatePersonalTaskStatus() {
    const supabase = createClient();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            taskId,
            status,
            workspaceId
        }: {
            taskId: string;
            status: 'todo' | 'in_progress' | 'done' | 'canceled';
            workspaceId: string;
        }) => {
            const { error } = await supabase
                .from('task')
                .update({ status })
                .eq('id', taskId);

            if (error) throw error;
            return { taskId, status };
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ['personal-tasks', variables.workspaceId]
            });
        },
    });
}

export function usePersonalTaskStats(workspaceId: string) {
    const supabase = createClient();

    return useQuery({
        queryKey: ['personal-tasks-stats', workspaceId],
        queryFn: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { data, error } = await supabase
                .from('task')
                .select('id, status')
                .eq('workspace_id', workspaceId)
                .eq('assignee_id', user.id)
                .is('team_id', null);

            if (error) throw error;

            const stats = {
                total: data.length,
                todo: data.filter(t => t.status === 'todo').length,
                inProgress: data.filter(t => t.status === 'in_progress').length,
                done: data.filter(t => t.status === 'done').length,
            };

            return stats;
        },
        enabled: !!workspaceId,
    });
}

export { statusColors, statusLabels };
