import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

interface OrgIdPageProps {
   params: Promise<{
      orgId: string;
   }>;
}

export default async function OrgIdPage({ params }: OrgIdPageProps) {
   const { orgId } = await params;
   const supabase = await createClient();

   const { data: teams } = await supabase
      .from('team')
      .select('id')
      .eq('workspace_id', orgId)
      .limit(1);

   if (teams && teams.length > 0) {
      redirect(`/app/${orgId}/team/${teams[0].id}/all`);
   }

   return (
      <div className="flex h-full items-center justify-center">
         <div className="text-center">
            <h2 className="text-lg font-semibold">Welcome to Circle</h2>
            <p className="text-muted-foreground">Create a team to get started.</p>
         </div>
      </div>
   );
}
