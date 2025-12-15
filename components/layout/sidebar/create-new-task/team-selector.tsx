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
import { createClient } from '@/utils/supabase/client';
import { CheckIcon, ChevronsUpDown, Users } from 'lucide-react';
import { useEffect, useId, useState } from 'react';
import { useParams } from 'next/navigation';

interface Team {
   id: string;
   name: string;
   key: string;
}

interface TeamSelectorProps {
   teamId: string | null;
   onChange: (teamId: string) => void;
}

export function TeamSelector({ teamId, onChange }: TeamSelectorProps) {
   const id = useId();
   const [open, setOpen] = useState<boolean>(false);
   const [teams, setTeams] = useState<Team[]>([]);
   const params = useParams();
   const orgId = params.orgId as string;

   useEffect(() => {
      const fetchTeams = async () => {
         const supabase = createClient();
         const { data } = await supabase
            .from('team')
            .select('id, name, key')
            .eq('workspace_id', orgId);
         if (data) setTeams(data);
      };
      if (orgId) fetchTeams();
   }, [orgId]);

   // If no team selected and teams loaded, default to first?
   // Logic might be moved to parent, but here we can show "Select Team"

   const selectedTeam = teams.find((t) => t.id === teamId);

   return (
      <Popover open={open} onOpenChange={setOpen}>
         <PopoverTrigger asChild>
            <Button
               id={id}
               size="sm"
               variant="outline"
               className="gap-1.5"
               role="combobox"
               aria-expanded={open}
            >
               <Users className="size-4 text-muted-foreground" />
               <span className="font-medium">
                  {selectedTeam ? selectedTeam.key.toUpperCase() : 'Select Team'}
               </span>
               <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
            </Button>
         </PopoverTrigger>
         <PopoverContent className="w-[200px] p-0" align="start">
            <Command>
               <CommandInput placeholder="Search team..." />
               <CommandList>
                  <CommandEmpty>No team found.</CommandEmpty>
                  <CommandGroup>
                     {teams.map((team) => (
                        <CommandItem
                           key={team.id}
                           value={team.name} // Search by name
                           onSelect={() => {
                              onChange(team.id);
                              setOpen(false);
                           }}
                        >
                           <CheckIcon
                              className={`mr-2 h-4 w-4 ${teamId === team.id ? 'opacity-100' : 'opacity-0'}`}
                           />
                           {team.name} ({team.key})
                        </CommandItem>
                     ))}
                  </CommandGroup>
               </CommandList>
            </Command>
         </PopoverContent>
      </Popover>
   );
}
