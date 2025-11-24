import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';

export interface Project {
    id: string;
    name: string;
    identifier: string;
    workspace_id: string;
    team_id: string;
    created_at: string;
    description: string | null;
    icon: string | null;
    health: string | null;
    start_date: string | null;
    target_date: string | null;
    state: string | null;
    lead: { id: string; avatar_url: string | null; display_name: string | null } | null;
}

export function useProjects(workspaceId?: string, teamId?: string) {
    const supabase = createClient();

    return useQuery({
        queryKey: ['projects', workspaceId, teamId],
        queryFn: async () => {
            if (!workspaceId) return [];

            let query = supabase
                .from('project')
                .select(`
               *,
               lead:users!project_lead_id_fkey(id, avatar_url, display_name)
            `)
                .eq('workspace_id', workspaceId)
                .order('name');

            if (teamId) {
                query = query.eq('team_id', teamId);
            }

            const { data, error } = await query;

            if (error) throw error;
            return data as Project[];
        },
        enabled: !!workspaceId,
    });
}
