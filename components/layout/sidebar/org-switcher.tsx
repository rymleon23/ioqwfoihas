'use client';

import * as React from 'react';
import { ChevronsUpDown, Check, Plus } from 'lucide-react';

import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuGroup,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuPortal,
   DropdownMenuSeparator,
   DropdownMenuShortcut,
   DropdownMenuSub,
   DropdownMenuSubContent,
   DropdownMenuSubTrigger,
   DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { CreateNewTask } from './create-new-task';
import { ThemeToggle } from '../theme-toggle';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { useRouter, useParams } from 'next/navigation';
import { useWorkspace } from '@/hooks/use-workspace';
import { useCurrentUser } from '@/hooks/use-current-user';

export function OrgSwitcher() {
   const router = useRouter();
   const params = useParams();
   const orgId = params.orgId as string;
   const supabase = createClient();

   const { data: workspace, isLoading: isLoadingWorkspace } = useWorkspace(orgId);
   const { data: user, isLoading: isLoadingUser } = useCurrentUser();

   const handleLogout = async () => {
      await supabase.auth.signOut();
      router.push('/login');
      router.refresh();
   };

   // Display values
   const workspaceName = workspace?.name || 'Workspace';
   const workspaceLogo = workspaceName.charAt(0).toUpperCase();
   const userEmail = user?.email || 'Loading...';

   return (
      <SidebarMenu>
         <SidebarMenuItem>
            <DropdownMenu>
               <div className="w-full flex gap-1 items-center pt-2">
                  <DropdownMenuTrigger asChild>
                     <SidebarMenuButton
                        size="lg"
                        className="h-8 p-1 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                     >
                        <div className="flex aspect-square size-6 items-center justify-center rounded bg-orange-500 text-sidebar-primary-foreground font-bold">
                           {isLoadingWorkspace ? '' : workspaceLogo}
                        </div>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                           <span className="truncate font-semibold">
                              {isLoadingWorkspace ? 'Loading...' : workspaceName}
                           </span>
                        </div>
                        <ChevronsUpDown className="ml-auto" />
                     </SidebarMenuButton>
                  </DropdownMenuTrigger>

                  <ThemeToggle />

                  <CreateNewTask />
               </div>
               <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-60 rounded-lg"
                  side="bottom"
                  align="end"
                  sideOffset={4}
               >
                  {/* User Email Label */}
                  <DropdownMenuLabel className="font-normal">
                     <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">Account</p>
                        <p className="text-xs leading-none text-muted-foreground">
                           {isLoadingUser ? '...' : userEmail}
                        </p>
                     </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {/* Active Workspace Highlight */}
                  <DropdownMenuGroup>
                     <DropdownMenuItem className="gap-2 p-2 cursor-pointer">
                        <div className="flex aspect-square size-6 items-center justify-center rounded bg-orange-500 text-sidebar-primary-foreground text-xs">
                           {workspaceLogo}
                        </div>
                        <div className="flex flex-col flex-1">
                           <span className="text-sm font-medium">{workspaceName}</span>
                           <span className="text-[10px] text-muted-foreground">Active Workspace</span>
                        </div>
                        <Check className="h-4 w-4 ml-auto" />
                     </DropdownMenuItem>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />

                  <DropdownMenuGroup>
                     <DropdownMenuItem asChild>
                        <Link href={`/${orgId}/settings`}>
                           Settings
                           <DropdownMenuShortcut>G then S</DropdownMenuShortcut>
                        </Link>
                     </DropdownMenuItem>
                     <DropdownMenuItem>Invite and manage members</DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                     <DropdownMenuItem>Download desktop app</DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuSub>
                     <DropdownMenuSubTrigger>Switch Workspace</DropdownMenuSubTrigger>
                     <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                           {/* Future: Map through user's workspaces list here */}
                           <DropdownMenuLabel>Your Workspaces</DropdownMenuLabel>
                           <DropdownMenuSeparator />
                           <DropdownMenuItem>
                              <div className="flex aspect-square size-6 items-center justify-center rounded bg-orange-500 text-sidebar-primary-foreground mr-2">
                                 {workspaceLogo}
                              </div>
                              {workspaceName}
                              <Check className="h-4 w-4 ml-auto" />
                           </DropdownMenuItem>
                           <DropdownMenuSeparator />
                           <DropdownMenuItem>
                              <Plus className="mr-2 h-4 w-4" />
                              Create workspace
                           </DropdownMenuItem>
                           <DropdownMenuItem>Add an account</DropdownMenuItem>
                        </DropdownMenuSubContent>
                     </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuItem onClick={handleLogout}>
                     Log out
                     <DropdownMenuShortcut>⌥⇧Q</DropdownMenuShortcut>
                  </DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>
         </SidebarMenuItem>
      </SidebarMenu>
   );
}
