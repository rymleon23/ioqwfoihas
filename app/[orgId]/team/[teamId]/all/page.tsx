import { TaskListView } from '@/components/tasks/task-list-view';

interface TeamAllPageProps {
   params: Promise<{
      orgId: string;
      teamId: string;
   }>;
}

export default async function TeamAllPage({ params }: TeamAllPageProps) {
   const { orgId, teamId } = await params;

   return (
      <div className="flex h-full flex-col">
         <div className="flex items-center justify-between border-b px-6 py-4">
            <h1 className="text-lg font-semibold">All Issues</h1>
         </div>
         <div className="flex-1 overflow-auto p-6">
            <TaskListView workspaceId={orgId} teamId={teamId} />
         </div>
      </div>
   );
}
