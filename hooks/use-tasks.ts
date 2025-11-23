import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';

export interface UseTasksOptions {
   workspaceId?: string;
   teamId?: string;
   assigneeId?: string;
}

export function useTasks({ workspaceId, teamId, assigneeId }: UseTasksOptions = {}) {
   const supabase = createClient();

   return useQuery({
      queryKey: ['tasks', { workspaceId, teamId, assigneeId }],
      queryFn: async () => {
         let query = supabase
            .from('task')
            .select(
               `
          *,
          assignee:users!task_assignee_id_fkey(display_name, avatar_url),
          workflow_state(name, color, type),
          project(name),
          priority,
          number
        `
            )
            .order('created_at', { ascending: false });

         if (workspaceId) {
            query = query.eq('workspace_id', workspaceId);
         }

         if (teamId) {
            query = query.eq('team_id', teamId);
         }

         if (assigneeId) {
            query = query.eq('assignee_id', assigneeId);
         }

         const { data, error } = await query;

         if (error) {
            throw error;
         }

         return data;
      },
   });
}
