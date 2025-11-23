'use client';

import { usePermission } from '@/hooks/use-permission';
import { useTask, TaskDetail } from '@/hooks/use-task';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Loader2, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface TaskDetailViewProps {
   taskId: string;
}

export function TaskDetailView({ taskId }: TaskDetailViewProps) {
   const { data: task, isLoading, error } = useTask(taskId);
   // Note: We need teamId to check permissions. task object has team_id?
   // Let's assume task object has team_id or we can get it from task.
   // Looking at useTask hook, it selects *, so team_id should be there.
   // But TypeScript interface might need update if it's not there.
   // Let's check use-task.ts interface. It has project, assignee etc.
   // It selects *, so team_id is in data but maybe not in interface.
   // I will cast it or update interface later. For now let's assume it's accessible.
   const { can } = usePermission((task as TaskDetail)?.team_id);

   if (isLoading) {
      return (
         <div className="flex h-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
         </div>
      );
   }

   if (error || !task) {
      return (
         <div className="flex h-full items-center justify-center text-destructive">
            Error loading task details
         </div>
      );
   }

   const canEdit = can('edit_task');

   return (
      <div className="flex h-full flex-col lg:flex-row">
         {/* Main Content */}
         <div className="flex-1 space-y-6 p-6">
            <div className="space-y-2">
               <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{task.project?.name}</span>
                  <span>/</span>
                  <span>
                     {task.project?.name}-{task.task_number}
                  </span>
               </div>
               {canEdit ? (
                  <h1 className="text-3xl font-bold tracking-tight">{task.title}</h1>
               ) : (
                  <div className="flex items-center gap-2">
                     <h1 className="text-3xl font-bold tracking-tight opacity-80">{task.title}</h1>
                     <Badge variant="outline" className="text-xs">
                        Read Only
                     </Badge>
                  </div>
               )}
            </div>

            <div className="prose prose-sm max-w-none dark:prose-invert">
               <p className="whitespace-pre-wrap text-muted-foreground">
                  {task.description || 'No description provided.'}
               </p>
            </div>

            <Separator />

            <div>
               <h3 className="mb-4 font-semibold">Activity</h3>
               <div className="text-sm text-muted-foreground">Activity log coming soon...</div>
            </div>
         </div>

         {/* Sidebar */}
         <div className="w-full border-l bg-muted/10 p-6 lg:w-80 space-y-6">
            <div className="space-y-4">
               <div>
                  <label className="text-xs font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">
                     <Badge
                        variant="secondary"
                        style={{
                           backgroundColor: task.workflow_state?.color + '20',
                           color: task.workflow_state?.color,
                        }}
                     >
                        {task.workflow_state?.name}
                     </Badge>
                  </div>
               </div>

               <div>
                  <label className="text-xs font-medium text-muted-foreground">Priority</label>
                  <div className="mt-1">
                     <Badge variant="outline" className="capitalize">
                        {task.priority}
                     </Badge>
                  </div>
               </div>

               <div>
                  <label className="text-xs font-medium text-muted-foreground">Assignee</label>
                  <div className="mt-1 flex items-center gap-2">
                     {task.assignee ? (
                        <>
                           <Avatar className="h-6 w-6">
                              <AvatarImage src={task.assignee.avatar_url || undefined} />
                              <AvatarFallback>
                                 {task.assignee.display_name?.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                           </Avatar>
                           <span className="text-sm">{task.assignee.display_name}</span>
                        </>
                     ) : (
                        <span className="text-sm text-muted-foreground">Unassigned</span>
                     )}
                  </div>
               </div>

               <div>
                  <label className="text-xs font-medium text-muted-foreground">Due Date</label>
                  <div className="mt-1 flex items-center gap-2 text-sm">
                     <Calendar className="h-4 w-4 text-muted-foreground" />
                     <span>
                        {task.due_date
                           ? format(new Date(task.due_date), 'MMM d, yyyy')
                           : 'No due date'}
                     </span>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
