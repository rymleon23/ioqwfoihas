import { createClient } from '@/utils/supabase/server';
import { OrgRole } from '@/types/roles';

export { OrgRole };

export async function getUserRole(orgId: string): Promise<OrgRole | null> {
   const supabase = await createClient();
   const {
      data: { user },
   } = await supabase.auth.getUser();

   if (!user) return null;

   // Fetch user profile from 'users' table which acts as membership in this schema
   const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .eq('workspace_id', orgId)
      .single();

   if (error || !data) {
      console.warn('Error fetching user role or user not found in workspace', error);
      return null;
   }

   // Return the role as OrgRole enum, strictly typed
   // We cast it to logic-compatible types.
   // Note: If DB has 'admin', it maps to OrgRole.ADMIN.
   return data.role as OrgRole;
}
