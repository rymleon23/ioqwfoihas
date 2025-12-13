import { TaskEditor } from '@/components/tasks/task-editor';
import { PageHeader } from '@/components/ui/page-header';

interface CreateTaskPageProps {
   params: Promise<{
      orgId: string;
   }>;
}

export default async function CreateTaskPage({ params }: CreateTaskPageProps) {
   const resolvedParams = await params;
   const { orgId } = resolvedParams;

   return (
      <div className="flex flex-col space-y-6">
         <PageHeader title="Create Task" description="Create new task for your projects" />

         <div className="max-w-4xl">
            <TaskEditor orgId={orgId} />
         </div>
      </div>
   );
}
