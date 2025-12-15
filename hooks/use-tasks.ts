import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';

export interface UseTasksOptions {
   workspaceId?: string;
   teamId?: string;
   assigneeId?: string;
}

export interface Task {
   id: string;
   number: number;
   title: string;
   description: string | null;
   status: string;
   priority: string;
   created_at: string;
   team_id: string;
   assignee: {
      display_name: string | null;
      avatar_url: string | null;
   } | null;
   project: {
      name: string;
   } | null;
   workflow_state: {
      name: string;
      color: string;
      type: string;
   } | null;
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
          team(key),
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

         return data as unknown as Task[];
      },
   });
}
