import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { WorkspaceDashboard } from '@/components/workspace/workspace-dashboard';

interface OrgIdPageProps {
   params: Promise<{
      orgId: string;
   }>;
}

export default async function OrgIdPage({ params }: OrgIdPageProps) {
   const { orgId } = await params;
   const supabase = await createClient();

   // Get current user
   const { data: { user } } = await supabase.auth.getUser();
   if (!user) {
      redirect('/login');
   }

   // Get workspace info
   const { data: workspace } = await supabase
      .from('workspace')
      .select('id, name, slug')
      .eq('id', orgId)
      .single();

   if (!workspace) {
      redirect('/onboarding');
   }

   // Get teams in this workspace
   const { data: teams } = await supabase
      .from('team')
      .select('id, name, key')
      .eq('workspace_id', orgId);

   // Get personal tasks count
   const { count: personalTasksCount } = await supabase
      .from('task')
      .select('id', { count: 'exact', head: true })
      .eq('workspace_id', orgId)
      .eq('assignee_id', user.id)
      .is('team_id', null);

   return (
      <WorkspaceDashboard
         workspace={workspace}
         teams={teams || []}
         personalTasksCount={personalTasksCount || 0}
         userId={user.id}
      />
   );
}
