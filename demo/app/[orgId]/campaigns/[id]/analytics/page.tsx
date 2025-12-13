import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getProject } from '@/lib/projects';
import { ProjectAnalyticsPage as ProjectAnalyticsPageComponent } from '@/components/projects/analytics/project-analytics-page';
import type { Project } from '@/types';

interface ProjectAnalyticsPageProps {
   params: Promise<{
      orgId: string;
      id: string;
   }>;
}

export default async function ProjectAnalyticsPage({ params }: ProjectAnalyticsPageProps) {
   const resolvedParams = await params;
   const projectData = await getProject(resolvedParams.orgId, resolvedParams.id);

   if (!projectData) {
      notFound();
   }

   // Type assertion to match Project interface
   const project = projectData as unknown as Project;

   return (
      <div className="flex flex-col space-y-6">
         <Suspense fallback={<div>Loading analytics...</div>}>
            <ProjectAnalyticsPageComponent
               orgId={resolvedParams.orgId}
               projectId={resolvedParams.id}
               project={project}
            />
         </Suspense>
      </div>
   );
}
