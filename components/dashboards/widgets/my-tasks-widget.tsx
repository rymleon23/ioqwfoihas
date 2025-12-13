'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, CheckSquare } from 'lucide-react';
import Link from 'next/link';
import { usePersonalTasks, statusColors, statusLabels } from '@/hooks/usePersonalTasks';

interface MyTasksWidgetProps {
   workspaceId: string;
   userId?: string;
}

export function MyTasksWidget({ workspaceId }: MyTasksWidgetProps) {
   const { data: personalTasks, isLoading: tasksLoading } = usePersonalTasks(workspaceId);

   // We can filter for only tasks assigned to null team (personal) or display all assigned.
   // For this widget, we stick to "Personal Tasks" logic from original dashboard for now.

   return (
      <Card className="h-full">
         <CardHeader>
            <CardTitle className="flex items-center gap-2">
               <CheckSquare className="h-5 w-5" />
               My Tasks
            </CardTitle>
            <CardDescription>Your personal tasks</CardDescription>
         </CardHeader>
         <CardContent>
            {tasksLoading ? (
               <div className="py-4 text-center text-muted-foreground">Loading...</div>
            ) : personalTasks && personalTasks.length > 0 ? (
               <div className="space-y-2">
                  {personalTasks.slice(0, 5).map((task) => (
                     <div
                        key={task.id}
                        className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent/50 transition-colors"
                     >
                        <div className="flex items-center gap-3">
                           <div
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: statusColors[task.status] || '#6B7280' }}
                           />
                           <span className="text-sm font-medium">{task.title}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                           {statusLabels[task.status] || 'Unknown'}
                        </span>
                     </div>
                  ))}
                  {personalTasks.length > 5 && (
                     <Link
                        href={`/${workspaceId}/my-tasks`}
                        className="flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground hover:text-foreground"
                     >
                        View all {personalTasks.length} tasks
                        <ArrowRight className="h-4 w-4" />
                     </Link>
                  )}
               </div>
            ) : (
               <div className="py-8 text-center text-muted-foreground">
                  <p>No personal tasks yet</p>
               </div>
            )}
         </CardContent>
      </Card>
   );
}
