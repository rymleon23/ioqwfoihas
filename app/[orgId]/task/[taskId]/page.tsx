import { TaskDetailPanel } from '@/components/common/tasks/task-detail-panel';

interface TaskPageProps {
   params: Promise<{
      orgId: string;
      taskId: string;
   }>;
}

export default async function TaskPage({ params }: TaskPageProps) {
   const { orgId, taskId } = await params;

   return <TaskDetailPanel workspaceSlug={orgId} taskId={taskId} />;
}
