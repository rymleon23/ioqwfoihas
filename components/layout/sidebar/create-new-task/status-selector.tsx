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
import {
   status as allStatus,
   Status,
   InProgressIcon,
   CompletedIcon,
   ToDoIcon,
   BacklogIcon,
   PausedIcon,
} from '@/mock-data/status';
import { CheckIcon } from 'lucide-react';
import { useEffect, useId, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

interface StatusSelectorProps {
   status: Status;
   onChange: (status: Status) => void;
   teamId?: string | null;
}

export function StatusSelector({ status, onChange, teamId }: StatusSelectorProps) {
   const id = useId();
   const [open, setOpen] = useState<boolean>(false);
   const [value, setValue] = useState<string>(status.id);
   const [workflowStates, setWorkflowStates] = useState<any[]>([]);

   useEffect(() => {
      setValue(status.id);
   }, [status.id]);

   useEffect(() => {
      const fetchStates = async () => {
         if (!teamId) return;
         const supabase = createClient();
         const { data } = await supabase
            .from('workflow_state')
            .select('*')
            .eq('team_id', teamId)
            .order('position');
         if (data) setWorkflowStates(data);
      };
      fetchStates();
   }, [teamId]);

   // Map DB state type to Icon
   const getIcon = (type: string) => {
      switch (type) {
         case 'backlog':
            return BacklogIcon;
         case 'unstarted':
            return ToDoIcon;
         case 'started':
            return InProgressIcon;
         case 'completed':
            return CompletedIcon;
         case 'canceled':
            return PausedIcon;
         default:
            return ToDoIcon;
      }
   };

   const handleStatusChange = (statusId: string) => {
      setValue(statusId);
      setOpen(false);

      // Find from real states if available, else fallback to mock
      const dbState = workflowStates.find((s) => s.id === statusId);
      if (dbState) {
         const mappedStatus: Status = {
            id: dbState.id, // Use UUID as ID
            name: dbState.name,
            color: dbState.color || '#ccc',
            icon: getIcon(dbState.type),
         };
         onChange(mappedStatus);
      } else {
         // Fallback for mock if needed
         const newStatus = allStatus.find((s) => s.id === statusId);
         if (newStatus) onChange(newStatus);
      }
   };

   // Display Logic
   const currentDisplay = (() => {
      // Try finding in DB states first
      if (workflowStates.length > 0) {
         const s = workflowStates.find((item) => item.id === value);
         if (s) {
            const Icon = getIcon(s.type);
            return { name: s.name, Icon };
         }
      }
      // Fallback to mock
      const s = allStatus.find((item) => item.id === value);
      if (s) return { name: s.name, Icon: s.icon };

      return { name: 'To do', Icon: ToDoIcon };
   })();

   const displayItems =
      workflowStates.length > 0
         ? workflowStates.map((s) => ({
              id: s.id,
              name: s.name,
              icon: getIcon(s.type),
           }))
         : allStatus;

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
                  {currentDisplay.Icon && <currentDisplay.Icon />}
                  <span>{currentDisplay.name}</span>
               </Button>
            </PopoverTrigger>
            <PopoverContent
               className="border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0"
               align="start"
            >
               <Command>
                  <CommandInput placeholder="Set status..." />
                  <CommandList>
                     <CommandEmpty>No status found.</CommandEmpty>
                     <CommandGroup>
                        {displayItems.map((item) => (
                           <CommandItem
                              key={item.id}
                              value={item.name} // Search by name
                              onSelect={() => handleStatusChange(item.id)}
                              className="flex items-center justify-between"
                           >
                              <div className="flex items-center gap-2">
                                 <item.icon />
                                 {item.name}
                              </div>
                              {value === item.id && <CheckIcon size={16} className="ml-auto" />}
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
