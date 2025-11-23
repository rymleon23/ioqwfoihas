import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';

export interface Workspace {
   id: string;
   name: string;
   slug: string;
   created_at: string;
}

export function useWorkspace(workspaceId?: string) {
   const supabase = createClient();

   return useQuery({
      queryKey: ['workspace', workspaceId],
      queryFn: async () => {
         if (!workspaceId) return null;

         const { data, error } = await supabase
            .from('workspace')
            .select('*')
            .eq('id', workspaceId)
            .single();

         if (error) throw error;
         return data as Workspace;
      },
      enabled: !!workspaceId,
   });
}
