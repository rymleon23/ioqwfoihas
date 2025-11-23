import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';

export interface TaskDetail {
   id: string;
   task_number: number;
   title: string;
   description: string | null;
   priority: string;
   status: string;
   created_at: string;
   updated_at: string;
   due_date: string | null;
   assignee: {
      id: string;
      display_name: string | null;
      avatar_url: string | null;
   } | null;
   project: {
      id: string;
      name: string;
   } | null;
   workflow_state: {
      id: string;
      name: string;
      color: string;
      type: string;
   } | null;
   team_id: string;
}

const fetchTask = async (taskId: string) => {
   const supabase = createClient();
   const { data, error } = await supabase
      .from('task')
      .select(
         `
         *,
         assignee:users!task_assignee_id_fkey(id, display_name, avatar_url),
         project(id, name),
         workflow_state(id, name, color, type)
      `
      )
      .eq('id', taskId)
      .single();

   if (error) throw error;
   return data as unknown as TaskDetail;
};

export function useTask(taskId: string) {
   return useQuery({
      queryKey: ['task', taskId],
      queryFn: () => fetchTask(taskId),
      enabled: !!taskId,
   });
}
