import { Suspense } from 'react';
import { TaskDetail } from '@/components/tasks/task-detail';
import { notFound } from 'next/navigation';
import { getTask } from '@/lib/tasks';

interface TaskPageProps {
   params: Promise<{
      orgId: string;
      id: string;
   }>;
}

export default async function TaskPage({ params }: TaskPageProps) {
   const resolvedParams = await params;
   const task = await getTask(resolvedParams.orgId, resolvedParams.id);

   if (!task) {
      notFound();
   }

   return (
      <div className="flex flex-col space-y-6">
         <Suspense fallback={<div>Loading task...</div>}>
            <TaskDetail
               task={task.task}
               project={task.project}
               objective={task.objective || undefined}
               phase={task.phase || undefined}
               assignee={task.assignee || undefined}
               activities={task.activities}
            />
         </Suspense>
      </div>
   );
}
