'use client';

import { Button } from '@/components/ui/button';
import {
   Command,
   CommandEmpty,
   CommandGroup,
   CommandInput,
   CommandItem,
   CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useTasksStore } from '@/store/tasks-store';
import { Project, projects as mockProjects } from '@/mock-data/projects';
import { Box, CheckIcon, FolderIcon } from 'lucide-react';
import { useEffect, useId, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useParams } from 'next/navigation';
import { priorities } from '@/mock-data/priorities';
import { status } from '@/mock-data/status';

interface ProjectSelectorProps {
   project: Project | undefined;
   onChange: (project: Project | undefined) => void;
}

export function ProjectSelector({ project, onChange }: ProjectSelectorProps) {
   const id = useId();
   const [open, setOpen] = useState<boolean>(false);
   const [value, setValue] = useState<string | undefined>(project?.id);
   const [projects, setProjects] = useState<any[]>([]);
   const params = useParams();
   const orgId = params.orgId as string;

   const { filterByProject } = useTasksStore();

   useEffect(() => {
      setValue(project?.id);
   }, [project]);

   useEffect(() => {
      const fetchProjects = async () => {
         const supabase = createClient();
         const { data } = await supabase.from('project').select('*').eq('workspace_id', orgId);
         if (data) setProjects(data);
      };
      if (orgId) fetchProjects();
   }, [orgId]);

   const handleProjectChange = (projectId: string) => {
      if (projectId === 'no-project') {
         setValue(undefined);
         onChange(undefined);
      } else {
         setValue(projectId);
         const dbProject = projects.find((p) => p.id === projectId);
         if (dbProject) {
            // Map DB Project to Store Project
            const mappedProject: Project = {
               id: dbProject.id,
               name: dbProject.name,
               icon: Box, // Default icon
               status: status[0], // Mock status for now
               percentComplete: 0,
               startDate: '',
               lead: { ...mockProjects[0].lead }, // Fallback mock lead
               priority: priorities[0],
               health: { id: 'on-track', name: 'On Track', color: 'green', description: '' },
            };
            onChange(mappedProject);
         }
      }
      setOpen(false);
   };

   return (
      <div className="*:not-first:mt-2">
         <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
               <Button
                  id={id}
                  className="flex items-center justify-center"
                  size="xs"
                  variant="secondary"
                  role="combobox"
                  aria-expanded={open}
               >
                  {value ? (
                     (() => {
                        const selectedProject = projects.find((p) => p.id === value);
                        if (selectedProject) {
                           return <Box className="size-4" />;
                        }
                        return <Box className="size-4" />;
                     })()
                  ) : (
                     <Box className="size-4" />
                  )}
                  <span>{value ? projects.find((p) => p.id === value)?.name : 'No project'}</span>
               </Button>
            </PopoverTrigger>
            <PopoverContent
               className="border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0"
               align="start"
            >
               <Command>
                  <CommandInput placeholder="Set project..." />
                  <CommandList>
                     <CommandEmpty>No projects found.</CommandEmpty>
                     <CommandGroup>
                        <CommandItem
                           value="no-project"
                           onSelect={() => handleProjectChange('no-project')}
                           className="flex items-center justify-between"
                        >
                           <div className="flex items-center gap-2">
                              <FolderIcon className="size-4" />
                              No Project
                           </div>
                           {value === undefined && <CheckIcon size={16} className="ml-auto" />}
                        </CommandItem>
                        {projects.map((project) => (
                           <CommandItem
                              key={project.id}
                              value={project.name}
                              onSelect={() => handleProjectChange(project.id)}
                              className="flex items-center justify-between"
                           >
                              <div className="flex items-center gap-2">
                                 <Box className="size-4" />
                                 {project.name}
                              </div>
                              {value === project.id && <CheckIcon size={16} className="ml-auto" />}
                           </CommandItem>
                        ))}
                     </CommandGroup>
                  </CommandList>
               </Command>
            </PopoverContent>
         </Popover>
      </div>
   );
}
