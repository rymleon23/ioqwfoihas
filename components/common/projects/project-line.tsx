'use client';

import { Project } from '@/hooks/use-projects';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Box, Circle, AlertCircle, CheckCircle2, XCircle, Clock } from 'lucide-react';

interface ProjectLineProps {
   project: Project;
}

const getHealthIcon = (health: string | null) => {
   switch (health) {
      case 'on_track':
         return <CheckCircle2 className="size-4 text-green-500" />;
      case 'at_risk':
         return <AlertCircle className="size-4 text-yellow-500" />;
      case 'off_track':
         return <XCircle className="size-4 text-red-500" />;
      default:
         return <Circle className="size-4 text-muted-foreground" />;
   }
};

const getStateIcon = (state: string | null) => {
   switch (state) {
      case 'completed':
         return <CheckCircle2 className="size-4 text-primary" />;
      case 'started':
         return <Clock className="size-4 text-blue-500" />;
      case 'canceled':
         return <XCircle className="size-4 text-muted-foreground" />;
      default:
         return <Circle className="size-4 text-muted-foreground" />;
   }
};

export default function ProjectLine({ project }: ProjectLineProps) {
   return (
      <div className="w-full flex items-center py-3 px-6 border-b hover:bg-sidebar/50 border-muted-foreground/5 text-sm">
         <div className="w-[60%] sm:w-[70%] xl:w-[46%] flex items-center gap-2">
            <div className="size-6 bg-muted/50 flex items-center justify-center rounded shrink-0 text-xs">
               {project.icon || <Box className="size-3" />}
            </div>
            <span className="font-medium truncate">{project.name}</span>
         </div>
         <div className="w-[20%] sm:w-[10%] xl:w-[13%] pl-2.5 flex items-center">
            {getHealthIcon(project.health)}
         </div>
         <div className="hidden w-[10%] sm:block pl-2 text-muted-foreground">-</div>
         <div className="hidden xl:block xl:w-[13%] pl-2">
            {project.lead ? (
               <div className="flex items-center gap-2">
                  <Avatar className="size-5">
                     <AvatarImage src={project.lead.avatar_url || ''} />
                     <AvatarFallback className="text-[10px]">
                        {project.lead.display_name?.[0] || '?'}
                     </AvatarFallback>
                  </Avatar>
                  <span className="text-xs truncate">{project.lead.display_name}</span>
               </div>
            ) : (
               <span className="text-xs text-muted-foreground">Unassigned</span>
            )}
         </div>
         <div className="hidden xl:block xl:w-[13%] pl-2.5 text-xs text-muted-foreground">
            {project.target_date ? new Date(project.target_date).toLocaleDateString() : '-'}
         </div>
         <div className="w-[20%] sm:w-[10%] pl-2 flex items-center">
            {getStateIcon(project.state)}
         </div>
      </div>
   );
}
