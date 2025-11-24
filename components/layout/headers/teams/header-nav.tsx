'use client';

import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useTeams } from '@/hooks/use-teams';
import { Plus } from 'lucide-react';
import { useParams } from 'next/navigation';
import { usePermission } from '@/hooks/use-permission';

export default function HeaderNav() {
   const params = useParams();
   const orgId = params.orgId as string;
   const { data: teams } = useTeams(orgId);
   const { can } = usePermission(); // Note: usePermission usually needs teamId, but for "Add Team" it might be workspace level or just check if user is admin/owner of workspace?
   // The rule says: "The user who creates a team becomes the Owner."
   // "Owner/Admin | Yes (Team settings) | Yes (Manage members) | Yes (Create/Edit Task or Project)"
   // But creating a team is usually a workspace level permission.
   // For now, let's assume any member can create a team or check workspace role if available.
   // The current usePermission is team-scoped.
   // Let's assume for now we show it, or we need a workspace-level permission hook.
   // Given the prompt "Render RBAC-aware UI (hide protected actions)", and "Team-level roles stored in team_member".
   // If creating a team is allowed for everyone, we show it.
   // If it's restricted, we need to check.
   // Let's assume for now we just show it but maybe disable if we had a way to check workspace role.
   // Actually, usePermission implementation I saw earlier:
   // "1. Check if user is workspace admin (optional...)"
   // "For now, we stick to team-level roles".
   // So creating a team might be open to all workspace members?
   // Let's just replace mock data for now and keep the button.

   return (
      <div className="w-full flex justify-between items-center border-b py-1.5 px-6 h-10">
         <div className="flex items-center gap-2">
            <SidebarTrigger className="" />
            <div className="flex items-center gap-1">
               <span className="text-sm font-medium">Teams</span>
               <span className="text-xs bg-accent rounded-md px-1.5 py-1">{teams?.length || 0}</span>
            </div>
         </div>
         <div className="flex items-center gap-2">
            <Button className="relative" size="xs" variant="secondary">
               <Plus className="size-4" />
               Add team
            </Button>
         </div>
      </div>
   );
}
