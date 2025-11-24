import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import { useCurrentUser } from './use-current-user';

export interface Team {
   id: string;
   name: string;
   identifier: string;
   workspace_id: string;
   created_at: string;
   icon: string | null;
   color: string | null;
   members: { id: string; avatar_url: string | null; display_name: string | null; email: string; role: string }[];
   projects: { id: string; name: string; icon: string | null }[];
   joined?: boolean;
}

export function useTeams(workspaceId?: string) {
   const supabase = createClient();
   const { data: currentUser } = useCurrentUser();

   return useQuery({
      queryKey: ['teams', workspaceId, currentUser?.id],
      queryFn: async () => {
         if (!workspaceId) return [];

         const { data, error } = await supabase
            .from('team')
            .select(`
               *,
               members:team_member(
                  role,
                  user:users(id, avatar_url, display_name, email)
               ),
               projects:project(id, name, icon)
            `)
            .eq('workspace_id', workspaceId)
            .order('name');

         if (error) throw error;

         // Transform data to include joined status
         return data.map((team: any) => ({
            ...team,
            joined: team.members.some((m: any) => m.user?.id === currentUser?.id),
            members: team.members.map((m: any) => ({
               ...m.user,
               role: m.role,
            })).filter((m: any) => m.id),
         })) as Team[];
      },
      enabled: !!workspaceId,
   });
}
