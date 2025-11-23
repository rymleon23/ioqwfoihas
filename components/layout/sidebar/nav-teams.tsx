import { SidebarGroup, SidebarGroupLabel, SidebarMenu } from '@/components/ui/sidebar';
import { useTeams } from '@/hooks/use-teams';
import { useParams } from 'next/navigation';
import { NavTeamItem } from './nav-team-item';

export function NavTeams() {
   const params = useParams();
   const orgId = params.orgId as string;
   const { data: teams } = useTeams(orgId);

   if (!teams?.length) return null;

   return (
      <SidebarGroup>
         <SidebarGroupLabel>Your teams</SidebarGroupLabel>
         <SidebarMenu>
            {teams.map((item) => (
               <NavTeamItem key={item.id} item={item} orgId={orgId} />
            ))}
         </SidebarMenu>
      </SidebarGroup>
   );
}
