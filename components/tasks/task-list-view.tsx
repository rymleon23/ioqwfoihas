'use client';

import { useTasks } from '@/hooks/use-tasks';
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { Loader2 } from 'lucide-react';

interface TaskListViewProps {
   workspaceId: string;
   teamId?: string;
}

export function TaskListView({ workspaceId, teamId }: TaskListViewProps) {
   const router = useRouter();
   const { data: tasks, isLoading, error } = useTasks({ workspaceId, teamId });

   if (isLoading) {
      return (
         <div className="flex h-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
         </div>
      );
   }

   if (error) {
      return (
         <div className="flex h-full items-center justify-center text-destructive">
            Error loading tasks
         </div>
      );
   }

   return (
      <div className="w-full">
         <Table>
            <TableHeader>
               <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Assignee</TableHead>
                  <TableHead className="text-right">Created</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {tasks?.map((task: any) => (
                  <TableRow
                     key={task.id}
                     className="cursor-pointer hover:bg-muted/50"
                     onClick={() => router.push(`/app/${workspaceId}/${teamId}/task/${task.id}`)}
                  >
                     <TableCell className="font-medium text-muted-foreground">
                        {task.project?.name ? `${task.project.name}-` : ''}
                        {task.number}
                     </TableCell>
                     <TableCell className="font-medium">{task.title}</TableCell>
                     <TableCell>
                        <Badge
                           variant="secondary"
                           style={{
                              backgroundColor: task.workflow_state?.color + '20',
                              color: task.workflow_state?.color,
                           }}
                        >
                           {task.workflow_state?.name}
                        </Badge>
                     </TableCell>
                     <TableCell>
                        <Badge variant="outline" className="capitalize">
                           {task.priority}
                        </Badge>
                     </TableCell>
                     <TableCell>
                        {task.assignee ? (
                           <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                 <AvatarImage src={task.assignee.avatar_url} />
                                 <AvatarFallback>
                                    {task.assignee.display_name?.substring(0, 2).toUpperCase()}
                                 </AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-muted-foreground">
                                 {task.assignee.display_name}
                              </span>
                           </div>
                        ) : (
                           <span className="text-sm text-muted-foreground">Unassigned</span>
                        )}
                     </TableCell>
                     <TableCell className="text-right text-muted-foreground">
                        {formatDistanceToNow(new Date(task.created_at), { addSuffix: true })}
                     </TableCell>
                  </TableRow>
               ))}
               {tasks?.length === 0 && (
                  <TableRow>
                     <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                        No tasks found.
                     </TableCell>
                  </TableRow>
               )}
            </TableBody>
         </Table>
      </div>
   );
}
