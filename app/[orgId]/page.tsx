import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import MainLayout from '@/components/layout/main-layout';
import { WorkspaceOverview } from '@/components/dashboards/workspace-overview';
import { getUserRole } from '@/lib/rbac';
import { OrgRole } from '@/types/roles';
import Header from '@/components/layout/headers/teams/header'; // Using a generic header for now or create a DashboardHeader

interface OrgIdPageProps {
   params: Promise<{
      orgId: string;
   }>;
}

export default async function OrgIdPage({ params }: OrgIdPageProps) {
   const { orgId } = await params;
   const supabase = await createClient();

   // Get current user
   const {
      data: { user },
   } = await supabase.auth.getUser();
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

   // Fetch data needed for widgets
   const { data: teams } = await supabase
      .from('team')
      .select('id, name, key')
      .eq('workspace_id', orgId);

   const { count: personalTasksCount } = await supabase
      .from('task')
      .select('id', { count: 'exact', head: true })
      .eq('workspace_id', orgId)
      .eq('assignee_id', user.id)
      .is('team_id', null);

   // Fetch User Role
   const userRole = (await getUserRole(orgId)) || OrgRole.MEMBER;

   // Temporary Dashboard Header to show Workspace Name
   const DashboardHeader = () => (
      <div className="flex h-[52px] items-center px-4 border-b w-full bg-background">
         <span className="font-semibold text-sm text-foreground">{workspace.name}</span>
         <span className="mx-2 text-muted-foreground">/</span>
         <span className="text-sm text-muted-foreground">Dashboard</span>
      </div>
   );

   return (
      <MainLayout header={<DashboardHeader />} headersNumber={1}>
         <WorkspaceOverview
            orgId={orgId}
            userRole={userRole}
            teams={teams || []}
            personalTasksCount={personalTasksCount || 0}
         />
      </MainLayout>
   );
}
