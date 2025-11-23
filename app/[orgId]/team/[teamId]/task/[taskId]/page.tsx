import { TaskDetailView } from '@/components/tasks/task-detail-view';

interface TeamTaskPageProps {
   params: Promise<{
      orgId: string;
      teamId: string;
      taskId: string;
   }>;
}

export default async function TeamTaskPage({ params }: TeamTaskPageProps) {
   const { taskId } = await params;

   return <TaskDetailView taskId={taskId} />;
}
