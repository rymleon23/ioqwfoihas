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
import { CheckIcon, UserCircle } from 'lucide-react';
import { useEffect, useId, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { createClient } from '@/utils/supabase/client';
import { useParams } from 'next/navigation';
import { User } from '@/mock-data/users'; // Keep interface for now or define new one

// Should ideally use DB User type, but for UI compatibility we might map it
interface AssigneeSelectorProps {
   assignee: User | null;
   onChange: (assignee: User | null) => void;
}

export function AssigneeSelector({ assignee, onChange }: AssigneeSelectorProps) {
   const id = useId();
   const [open, setOpen] = useState<boolean>(false);
   const [value, setValue] = useState<string | null>(assignee?.id || null);
   const [users, setUsers] = useState<any[]>([]); // Use DB user type
   const params = useParams();
   const orgId = params.orgId as string;

   const { filterByAssignee } = useTasksStore();

   useEffect(() => {
      setValue(assignee?.id || null);
   }, [assignee]);

   useEffect(() => {
      const fetchUsers = async () => {
         const supabase = createClient();
         const { data } = await supabase.from('users').select('*').eq('workspace_id', orgId);
         if (data) setUsers(data);
      };
      if (orgId) fetchUsers();
   }, [orgId]);

   const handleAssigneeChange = (userId: string) => {
      if (userId === 'unassigned') {
         setValue(null);
         onChange(null);
      } else {
         setValue(userId);
         const dbUser = users.find((u) => u.id === userId);
         if (dbUser) {
            // Map DB user to Mock user shape expected by Store/UI for now
            // Or update the form to store partial user
            const mappedUser: User = {
               id: dbUser.id,
               name: dbUser.display_name || dbUser.email,
               avatarUrl: dbUser.avatar_url || '',
               email: dbUser.email,
               role: 'Member',
               status: 'offline',
               joinedDate: '',
               teamIds: [],
            };
            onChange(mappedUser);
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
                        const selectedUser = users.find((user) => user.id === value);
                        if (selectedUser) {
                           return (
                              <Avatar className="size-5">
                                 <AvatarImage
                                    src={selectedUser.avatar_url}
                                    alt={selectedUser.display_name}
                                 />
                                 <AvatarFallback>
                                    {(selectedUser.display_name || 'U').charAt(0)}
                                 </AvatarFallback>
                              </Avatar>
                           );
                        }
                        return <UserCircle className="size-5" />;
                     })()
                  ) : (
                     <UserCircle className="size-5" />
                  )}
                  <span>
                     {value ? users.find((user) => user.id === value)?.display_name : 'Unassigned'}
                  </span>
               </Button>
            </PopoverTrigger>
            <PopoverContent
               className="border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0"
               align="start"
            >
               <Command>
                  <CommandInput placeholder="Assign to..." />
                  <CommandList>
                     <CommandEmpty>No users found.</CommandEmpty>
                     <CommandGroup>
                        <CommandItem
                           value="unassigned"
                           onSelect={() => handleAssigneeChange('unassigned')}
                           className="flex items-center justify-between"
                        >
                           <div className="flex items-center gap-2">
                              <UserCircle className="size-5" />
                              Unassigned
                           </div>
                           {value === null && <CheckIcon size={16} className="ml-auto" />}
                        </CommandItem>
                        {users.map((user) => (
                           <CommandItem
                              key={user.id}
                              value={user.display_name || user.email}
                              onSelect={() => handleAssigneeChange(user.id)}
                              className="flex items-center justify-between"
                           >
                              <div className="flex items-center gap-2">
                                 <Avatar className="size-5">
                                    <AvatarImage src={user.avatar_url} alt={user.display_name} />
                                    <AvatarFallback>
                                       {(user.display_name || '?').charAt(0)}
                                    </AvatarFallback>
                                 </Avatar>
                                 {user.display_name || user.email}
                              </div>
                              {value === user.id && <CheckIcon size={16} className="ml-auto" />}
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
