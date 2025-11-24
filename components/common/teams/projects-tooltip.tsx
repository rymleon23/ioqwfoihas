'use client';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Box } from 'lucide-react';

interface Project {
   id: string;
   name: string;
   icon: string | null;
}

interface ProjectsTooltipProps {
   projects: Project[];
}

export function ProjectsTooltip({ projects }: ProjectsTooltipProps) {
   return (
      <TooltipProvider>
         <Tooltip>
            <TooltipTrigger asChild>
               <div className="flex items-center gap-2 cursor-pointer">
                  <Box className="size-4" />
                  <span>{projects.length}</span>
               </div>
            </TooltipTrigger>
            <TooltipContent className="p-2">
               <div className="flex flex-col gap-1">
                  {projects.map((project, index) => (
                     <div key={index} className="flex items-center gap-1.5">
                        <div className="size-4 shrink-0 flex items-center justify-center text-xs">
                           {project.icon || <Box className="size-3" />}
                        </div>
                        <span className="text-sm w-full text-left">{project?.name}</span>
                     </div>
                  ))}
               </div>
            </TooltipContent>
         </Tooltip>
      </TooltipProvider>
   );
}
