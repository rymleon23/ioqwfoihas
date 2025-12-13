import { Suspense } from 'react';
import { TaskList } from '@/components/tasks/task-list';
import { CreateTaskButton } from '@/components/tasks/create-task-button';
import { PageHeader } from '@/components/ui/page-header';

interface TasksPageProps {
   params: Promise<{
      orgId: string;
   }>;
}

export default async function TasksPage({ params }: TasksPageProps) {
   const resolvedParams = await params;
   const { orgId } = resolvedParams;

   return (
      <div className="flex flex-col space-y-6">
         <PageHeader
            title="Tasks"
            description="Manage your tasks and track progress"
            action={<CreateTaskButton orgId={orgId} />}
         />

         <Suspense fallback={<div>Loading tasks...</div>}>
            <TaskList orgId={orgId} />
         </Suspense>
      </div>
   );
}
