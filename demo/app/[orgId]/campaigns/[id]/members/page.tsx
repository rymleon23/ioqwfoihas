import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { getProject } from '@/lib/projects';
import { ProjectMembersPage as ProjectMembersPageComponent } from '@/components/projects/members/project-members-page';

interface ProjectMembersPageProps {
   params: Promise<{
      orgId: string;
      id: string;
   }>;
}

export default async function ProjectMembersPage({ params }: ProjectMembersPageProps) {
   const resolvedParams = await params;
   const project = await getProject(resolvedParams.orgId, resolvedParams.id);

   if (!project) {
      notFound();
   }

   return (
      <div className="flex flex-col space-y-6">
         <Suspense fallback={<div>Loading member management...</div>}>
            <ProjectMembersPageComponent
               orgId={resolvedParams.orgId}
               projectId={resolvedParams.id}
               project={project as any}
            />
         </Suspense>
      </div>
   );
}
