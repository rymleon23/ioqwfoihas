'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';

interface PersonalTask {
    id: string;
    title: string;
    description: string | null;
    priority: number;
    state_id: string;
    assignee_id: string;
    workspace_id: string;
    created_at: string;
    updated_at: string;
    state?: {
        id: string;
        name: string;
        color: string;
        type: string;
    };
}

interface CreatePersonalTaskInput {
    workspaceId: string;
    title: string;
    description?: string;
    priority?: number;
}

export function usePersonalTasks(workspaceId: string) {
    const supabase = createClient();

    return useQuery({
        queryKey: ['personal-tasks', workspaceId],
        queryFn: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { data, error } = await supabase
                .from('task')
                .select(`
               *,
               state:workflow_state(id, name, color, type)
            `)
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

export function usePersonalTaskStats(workspaceId: string) {
    const supabase = createClient();

    return useQuery({
        queryKey: ['personal-tasks-stats', workspaceId],
        queryFn: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { data, error } = await supabase
                .from('task')
                .select(`
               id,
               state:workflow_state(type)
            `)
                .eq('workspace_id', workspaceId)
                .eq('assignee_id', user.id)
                .is('team_id', null);

            if (error) throw error;

            const stats = {
                total: data.length,
                todo: data.filter(t => t.state?.type === 'unstarted').length,
                inProgress: data.filter(t => t.state?.type === 'started').length,
                done: data.filter(t => t.state?.type === 'completed').length,
            };

            return stats;
        },
        enabled: !!workspaceId,
    });
}
