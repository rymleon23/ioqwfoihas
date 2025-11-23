'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AiPanel } from '@/components/common/ai/ai-panel';
import { cn } from '@/lib/utils';

interface TaskDetailPanelProps {
   workspaceSlug: string;
   taskId: string;
}

export function TaskDetailPanel({ workspaceSlug, taskId }: TaskDetailPanelProps) {
   return (
      <div className="flex h-full flex-col">
         <header className="border-b px-6 py-5">
            <div className="flex items-center gap-3">
               <Badge variant="secondary">Task</Badge>
               <span className="text-xs uppercase tracking-wider text-muted-foreground">
                  {taskId}
               </span>
            </div>
            <h1 className="mt-2 text-2xl font-semibold">Marketing OS Task {taskId}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
               This is a placeholder overview for the task detail. Replace this content with the
               real task summary once the data layer is wired.
            </p>
         </header>

         <Tabs defaultValue="details" className="flex h-full flex-col">
            <TabsList className="flex gap-4 border-b bg-background px-6 py-2 text-sm font-medium">
               <TabsTrigger value="details">Details</TabsTrigger>
               <TabsTrigger value="comments">Comments</TabsTrigger>
               <TabsTrigger value="ai">AI Studio</TabsTrigger>
            </TabsList>
            <div className="flex-1 overflow-auto">
               <TabsContent value="details" className="h-full">
                  <section className="space-y-4 px-6 py-6">
                     <h2 className="text-base font-semibold">Task metadata</h2>
                     <p className="text-sm text-muted-foreground">
                        This space will host the structured task information (status, assignee,
                        workflow state, linked entities). For now it is a static placeholder so we
                        can focus on the AI Studio integration.
                     </p>
                     <Separator />
                     <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-lg border p-4">
                           <h3 className="text-sm font-medium">Workflow</h3>
                           <p className="mt-1 text-sm text-muted-foreground">
                              Workflow data coming from Supabase.
                           </p>
                        </div>
                        <div className="rounded-lg border p-4">
                           <h3 className="text-sm font-medium">Assignment</h3>
                           <p className="mt-1 text-sm text-muted-foreground">
                              Assignee, due date, labels, etc.
                           </p>
                        </div>
                     </div>
                  </section>
               </TabsContent>
               <TabsContent value="comments" className="h-full">
                  <section className="space-y-4 px-6 py-6">
                     <h2 className="text-base font-semibold">Comments timeline</h2>
                     <p className="text-sm text-muted-foreground">
                        Conversation threads will appear here, powered by the Supabase task_comment
                        table. Hook this up when the activity system is ready.
                     </p>
                     <div className="rounded-lg border p-6 text-sm text-muted-foreground">
                        No comments yet. Start integrating the activity log to populate this view.
                     </div>
                  </section>
               </TabsContent>
               <TabsContent value="ai" className="h-full">
                  <div className={cn('px-6 py-6')}>
                     <AiPanel workspaceSlug={workspaceSlug} taskIdentifier={taskId} />
                  </div>
               </TabsContent>
            </div>
         </Tabs>
      </div>
   );
}
