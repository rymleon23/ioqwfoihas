import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';

export function useTasks(workspaceId?: string) {
   const supabase = createClient();

   return useQuery({
      queryKey: ['tasks', workspaceId],
      queryFn: async () => {
         let query = supabase
            .from('task')
            .select(
               `
          *,
          users!assignee_id(display_name, avatar_url),
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

         const { data, error } = await query;

         if (error) {
            throw error;
         }

         return data;
      },
   });
}
