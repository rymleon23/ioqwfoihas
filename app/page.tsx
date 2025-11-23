import MainLayout from '@/components/layout/main-layout';
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

   return (
      <MainLayout>
         <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <h1 className="text-2xl font-semibold text-foreground mb-2">Welcome to Circle</h1>
            <p>Select a team or project from the sidebar to get started.</p>
         </div>
      </MainLayout>
   );
}
