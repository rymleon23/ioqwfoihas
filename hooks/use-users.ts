import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';

export interface User {
   id: string;
   email: string;
   display_name: string | null;
   avatar_url: string | null;
   role: 'admin' | 'member' | 'guest';
   status: 'active' | 'invited' | 'disabled';
   workspace_id: string;
}

export function useUsers(workspaceId?: string) {
   const supabase = createClient();

   return useQuery({
      queryKey: ['users', workspaceId],
      queryFn: async () => {
         if (!workspaceId) return [];

         const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('workspace_id', workspaceId)
            .order('display_name');

         if (error) throw error;
         return data as User[];
      },
      enabled: !!workspaceId,
   });
}
