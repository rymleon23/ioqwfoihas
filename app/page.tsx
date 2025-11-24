
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
   const supabase = await createClient();

   const {
      data: { user },
   } = await supabase.auth.getUser();

   if (!user) {
      return redirect('/login');
   }

   // Fetch user profile to check workspace_id
   const { data: userProfile } = await supabase
      .from('users')
      .select('workspace_id')
      .eq('id', user.id)
      .single();

   if (userProfile?.workspace_id) {
      return redirect(`/app/${userProfile.workspace_id}`);
   }

   return redirect('/onboarding');
}
