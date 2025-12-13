'use client';

import { OrgRole } from '@/types/roles';
import { MyTasksWidget } from './widgets/my-tasks-widget';
import { TeamsWidget } from './widgets/teams-widget';
import { StatsWidget } from './widgets/stats-widget';
import { ScheduleWidget } from './widgets/schedule-widget';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useCreatePersonalTask } from '@/hooks/usePersonalTasks';
import { useState } from 'react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WorkspaceOverviewProps {
   orgId: string;
   userRole: OrgRole;
   teams: any[];
   personalTasksCount: number;
}

export function WorkspaceOverview({ orgId, userRole, teams }: WorkspaceOverviewProps) {
   // Quick create logic moved here or to a separate widget
   const [newTaskTitle, setNewTaskTitle] = useState('');
   const [isCreating, setIsCreating] = useState(false);
   const createTask = useCreatePersonalTask();

   const handleCreateTask = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!newTaskTitle.trim()) return;

      setIsCreating(true);
      try {
         await createTask.mutateAsync({
            workspaceId: orgId,
            title: newTaskTitle.trim(),
         });
         setNewTaskTitle('');
         toast.success('Task created!');
      } catch (error) {
         toast.error('Failed to create task');
      } finally {
         setIsCreating(false);
      }
   };

   // Determine visibility based on role
   const showStats = userRole === OrgRole.ADMIN || userRole === OrgRole.BRAND_OWNER;
   const showSchedule = userRole === OrgRole.CREATOR || userRole === OrgRole.ADMIN;
   const showTeams = true; // Everyone sees teams
   const showMyTasks = true; // Everyone sees my tasks

   return (
      <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto">
         <div className="flex items-center justify-between">
            <div>
               <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
               <p className="text-muted-foreground">
                  Welcome back! Here's what's happening in your workspace.
               </p>
            </div>
            {/* Action buttons could go here */}
         </div>

         {/* Stats Row (Admin/Brand Only) */}
         {showStats && (
            <div className="w-full">
               <StatsWidget />
            </div>
         )}

         {/* Main Grid */}
         <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Quick Create + My Tasks (Left Column) */}
            <div className="md:col-span-7 lg:col-span-8 flex flex-col gap-6">
               {/* Quick Create Widget - Inline here for simplicity or move to widget */}
               <Card>
                  <CardHeader className="pb-3">
                     <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Plus className="h-4 w-4" /> Quick Create
                     </CardTitle>
                  </CardHeader>
                  <CardContent>
                     <form onSubmit={handleCreateTask} className="flex gap-2">
                        <Input
                           placeholder="What needs to be done?"
                           value={newTaskTitle}
                           onChange={(e) => setNewTaskTitle(e.target.value)}
                           className="bg-muted/50 border-0 focus-visible:ring-1 focus-visible:bg-background transition-all"
                        />
                        <Button
                           size="sm"
                           type="submit"
                           disabled={isCreating || !newTaskTitle.trim()}
                        >
                           Add Task
                        </Button>
                     </form>
                  </CardContent>
               </Card>

               {/* My Tasks */}
               {showMyTasks && <MyTasksWidget workspaceId={orgId} />}
            </div>

            {/* Sidebar Widgets (Right Column) */}
            <div className="md:col-span-5 lg:col-span-4 flex flex-col gap-6">
               {/* Schedule (Creator Only) */}
               {showSchedule && <ScheduleWidget />}

               {/* Teams */}
               {showTeams && <TeamsWidget workspaceId={orgId} teams={teams} />}
            </div>
         </div>
      </div>
   );
}
