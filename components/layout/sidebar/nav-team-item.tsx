'use client';

import {
   Archive,
   Bell,
   Box,
   ChevronRight,
   CopyMinus,
   Layers,
   Link as LinkIcon,
   MoreHorizontal,
   Settings,
} from 'lucide-react';
import Link from 'next/link';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
   SidebarMenuAction,
   SidebarMenuButton,
   SidebarMenuItem,
   SidebarMenuSub,
   SidebarMenuSubButton,
   SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { RiDonutChartFill } from '@remixicon/react';
import { usePermission } from '@/hooks/use-permission';
import { Team } from '@/hooks/use-teams';

interface NavTeamItemProps {
   item: Team;
   orgId: string;
}

export function NavTeamItem({ item, orgId }: NavTeamItemProps) {
   const { can } = usePermission(item.id);

   return (
      <Collapsible asChild defaultOpen={false} className="group/collapsible">
         <SidebarMenuItem>
            <CollapsibleTrigger asChild>
               <SidebarMenuButton tooltip={item.name}>
                  <div className="inline-flex size-6 bg-muted/50 items-center justify-center rounded shrink-0">
                     <div className="text-sm">{item.icon || '👥'}</div>
                  </div>
                  <span className="text-sm">{item.name}</span>
                  <span className="w-3 shrink-0">
                     <ChevronRight className="w-full transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </span>
                  <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                        <SidebarMenuAction asChild showOnHover>
                           <div>
                              <MoreHorizontal />
                              <span className="sr-only">More</span>
                           </div>
                        </SidebarMenuAction>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent className="w-48 rounded-lg" side="right" align="start">
                        {can('manage_team') && (
                           <DropdownMenuItem>
                              <Settings className="size-4" />
                              <span>Team settings</span>
                           </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>
                           <LinkIcon className="size-4" />
                           <span>Copy link</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                           <Archive className="size-4" />
                           <span>Open archive</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                           <Bell className="size-4" />
                           <span>Subscribe</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                           <span>Leave team...</span>
                        </DropdownMenuItem>
                     </DropdownMenuContent>
                  </DropdownMenu>
               </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
               <SidebarMenuSub>
                  <SidebarMenuSubItem>
                     <SidebarMenuSubButton asChild>
                        <Link href={`/app/${orgId}/team/${item.id}/all`}>
                           <CopyMinus size={14} />
                           <span>Tasks</span>
                        </Link>
                     </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                     <SidebarMenuSubButton asChild>
                        <Link href={`/app/${orgId}/team/${item.id}/phases`}>
                           <RiDonutChartFill size={14} />
                           <span>Phases</span>
                        </Link>
                     </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                     <SidebarMenuSubButton asChild>
                        <Link href={`/app/${orgId}/team/${item.id}/projects`}>
                           <Box size={14} />
                           <span>Projects</span>
                        </Link>
                     </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                     <SidebarMenuSubButton asChild>
                        <Link href="#">
                           <Layers size={14} />
                           <span>Views</span>
                        </Link>
                     </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
               </SidebarMenuSub>
            </CollapsibleContent>
         </SidebarMenuItem>
      </Collapsible>
   );
}
