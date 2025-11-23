import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import { User } from './use-users';

export function useCurrentUser() {
   const supabase = createClient();

   return useQuery({
      queryKey: ['current-user'],
      queryFn: async () => {
         const {
            data: { user: authUser },
            error: authError,
         } = await supabase.auth.getUser();
         if (authError || !authUser) return null;

         const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', authUser.id)
            .single();

         if (error) throw error;
         return data as User;
      },
   });
}
