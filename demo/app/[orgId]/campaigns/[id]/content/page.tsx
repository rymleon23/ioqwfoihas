import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getProject } from '@/lib/projects';
import { ProjectContentPage as ProjectContentPageComponent } from '@/components/projects/content/project-content-page';
import type { Project } from '@/types';

interface ProjectContentPageProps {
   params: Promise<{
      orgId: string;
      id: string;
   }>;
}

export default async function ProjectContentPage({ params }: ProjectContentPageProps) {
   const resolvedParams = await params;
   const projectData = await getProject(resolvedParams.orgId, resolvedParams.id);

   if (!projectData) {
      notFound();
   }

   // Type assertion to match Project interface
   const project = projectData as unknown as Project;

   return (
      <div className="flex flex-col space-y-6">
         <Suspense fallback={<div>Loading content management...</div>}>
            <ProjectContentPageComponent
               orgId={resolvedParams.orgId}
               projectId={resolvedParams.id}
               project={project}
            />
         </Suspense>
      </div>
   );
}
