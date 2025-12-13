import { Suspense } from 'react';
import { ProjectDetail } from '@/components/projects/project-detail';
import { notFound } from 'next/navigation';
import { getProject } from '@/lib/projects';
import { ProjectDetailWrapper } from '@/components/projects/project-detail-wrapper';

interface ProjectPageProps {
   params: Promise<{
      orgId: string;
      id: string;
   }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
   const resolvedParams = await params;
   const project = await getProject(resolvedParams.orgId, resolvedParams.id);

   if (!project) {
      notFound();
   }

   return (
      <div className="flex flex-col space-y-6">
         <Suspense fallback={<div>Loading project...</div>}>
            <ProjectDetailWrapper project={project as any} />
         </Suspense>
      </div>
   );
}
