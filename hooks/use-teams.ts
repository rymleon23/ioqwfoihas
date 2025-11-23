import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';

export interface Team {
   id: string;
   name: string;
   identifier: string;
   workspace_id: string;
   created_at: string;
   icon: string | null;
}

export function useTeams(workspaceId?: string) {
   const supabase = createClient();

   return useQuery({
      queryKey: ['teams', workspaceId],
      queryFn: async () => {
         if (!workspaceId) return [];

         const { data, error } = await supabase
            .from('team')
            .select('*')
            .eq('workspace_id', workspaceId)
            .order('name');

         if (error) throw error;
         return data as Team[];
      },
      enabled: !!workspaceId,
   });
}
