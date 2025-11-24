'use client';

import { useProjects } from '@/hooks/use-projects';
import ProjectLine from '@/components/common/projects/project-line';
import { useParams } from 'next/navigation';

export default function Projects() {
   const params = useParams();
   const orgId = params.orgId as string;
   const { data: projects, isLoading } = useProjects(orgId);

   if (isLoading) {
      return <div className="p-6 text-sm text-muted-foreground">Loading projects...</div>;
   }

   return (
      <div className="w-full">
         <div className="bg-container px-6 py-1.5 text-sm flex items-center text-muted-foreground border-b sticky top-0 z-10">
            <div className="w-[60%] sm:w-[70%] xl:w-[46%]">Title</div>
            <div className="w-[20%] sm:w-[10%] xl:w-[13%] pl-2.5">Health</div>
            <div className="hidden w-[10%] sm:block pl-2">Priority</div>
            <div className="hidden xl:block xl:w-[13%] pl-2">Lead</div>
            <div className="hidden xl:block xl:w-[13%] pl-2.5">Target date</div>
            <div className="w-[20%] sm:w-[10%] pl-2">Status</div>
         </div>

         <div className="w-full">
            {projects?.map((project) => (
               <ProjectLine key={project.id} project={project} />
            ))}
            {!projects?.length && (
               <div className="p-6 text-center text-sm text-muted-foreground">
                  No projects found.
               </div>
            )}
         </div>
      </div>
   );
}
