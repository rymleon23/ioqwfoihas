import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getProject } from '@/lib/projects';
import { TaskManagementPage } from '@/components/projects/task-management/task-management-page';

interface ProjectTasksPageProps {
   params: Promise<{
      orgId: string;
      id: string;
   }>;
}

export default async function ProjectTasksPage({ params }: ProjectTasksPageProps) {
   const resolvedParams = await params;
   const project = await getProject(resolvedParams.orgId, resolvedParams.id);

   if (!project) {
      notFound();
   }

   return (
      <div className="flex flex-col space-y-6">
         <Suspense fallback={<div>Loading task management...</div>}>
            <TaskManagementPage
               orgId={resolvedParams.orgId}
               projectId={resolvedParams.id}
               project={project as any}
            />
         </Suspense>
      </div>
   );
}
