import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import { User } from './use-users';

export interface TeamMember {
   id: string;
   user_id: string;
   team_id: string;
   role: 'owner' | 'admin' | 'member' | 'guest';
   user: User;
}

export function useTeamMembers(teamId?: string) {
   const supabase = createClient();

   return useQuery({
      queryKey: ['team-members', teamId],
      queryFn: async () => {
         if (!teamId) return [];

         const { data, error } = await supabase
            .from('team_member')
            .select(
               `
               *,
               user:users(*)
            `
            )
            .eq('team_id', teamId);

         if (error) throw error;
         return data as unknown as TeamMember[];
      },
      enabled: !!teamId,
   });
}
