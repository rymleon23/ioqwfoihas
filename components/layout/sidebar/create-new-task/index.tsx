'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Heart } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RiEditLine } from '@remixicon/react';
import { useState, useEffect, useCallback } from 'react';
import { Task } from '@/mock-data/tasks';
import { priorities } from '@/mock-data/priorities';
import { status } from '@/mock-data/status';
import { useTasksStore } from '@/store/tasks-store';
import { useCreateTaskStore } from '@/store/create-task-store';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { StatusSelector } from './status-selector';
import { PrioritySelector } from './priority-selector';
import { AssigneeSelector } from './assignee-selector';
import { ProjectSelector } from './project-selector';
import { LabelSelector } from './label-selector';
import { ranks } from '@/mock-data/tasks';
import { DialogTitle } from '@radix-ui/react-dialog';
import { createClient } from '@/utils/supabase/client';
import { useParams, useRouter } from 'next/navigation';
import { TeamSelector } from './team-selector';

export function CreateNewTask() {
   const [createMore, setCreateMore] = useState<boolean>(false);
   const { isOpen, defaultStatus, openModal, closeModal } = useCreateTaskStore();
   const { addTask, getAllTasks } = useTasksStore();
   const params = useParams();
   const router = useRouter();
   const orgId = params.orgId as string;
   const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

   // Load default team
   useEffect(() => {
      const fetchDefaultTeam = async () => {
         const supabase = createClient();
         const { data } = await supabase
            .from('team')
            .select('id')
            .eq('workspace_id', orgId)
            .limit(1);
         if (data && data.length > 0) {
            setSelectedTeamId(data[0].id);
         }
      };
      if (isOpen && !selectedTeamId && orgId) {
         fetchDefaultTeam();
      }
   }, [isOpen, selectedTeamId, orgId]);

   const generateUniqueIdentifier = useCallback(() => {
      const identifiers = getAllTasks().map((task) => task.identifier);
      let identifier = Math.floor(Math.random() * 999)
         .toString()
         .padStart(3, '0');
      while (identifiers.includes(`LNUI-${identifier}`)) {
         identifier = Math.floor(Math.random() * 999)
            .toString()
            .padStart(3, '0');
      }
      return identifier;
   }, [getAllTasks]);

   const createDefaultData = useCallback(() => {
      const identifier = generateUniqueIdentifier();
      return {
         id: uuidv4(),
         identifier: `LNUI-${identifier}`,
         title: '',
         description: '',
         status: defaultStatus || status.find((s) => s.id === 'to-do')!,
         assignee: null,
         priority: priorities.find((p) => p.id === 'no-priority')!,
         labels: [],
         createdAt: new Date().toISOString(),
         phaseId: '',
         project: undefined,
         subtasks: [],
         rank: ranks[ranks.length - 1],
      };
   }, [defaultStatus, generateUniqueIdentifier]);

   const [addTaskForm, setAddTaskForm] = useState<Task>(createDefaultData());

   useEffect(() => {
      setAddTaskForm(createDefaultData());
   }, [createDefaultData]);

   const createTask = async () => {
      console.log('--> EXECUTING NEW CREATE TASK VERSION <--');
      if (!addTaskForm.title) {
         toast.error('Title is required');
         return;
      }

      try {
         const supabase = createClient();
         const teamId = selectedTeamId;
         if (!teamId) {
            toast.error('Please select a team');
            return;
         }

         // 2. Map Priority
         const priorityMap: Record<string, number> = {
            'no-priority': 0,
            'urgent': 1,
            'high': 2,
            'medium': 3,
            'low': 4,
         };
         const priorityInt = priorityMap[addTaskForm.priority.id] ?? 0;

         // 3. Map Status (Use real State ID if available from UI, else fetch/map logic)
         // Since StatusSelector now returns a status with ID = WorkflowState UUID, we can use it directly?
         // Check if ID is UUID (len 36). If not (mock ID), fallback to map.
         let stateId = null;
         if (addTaskForm.status.id && addTaskForm.status.id.length === 36) {
            stateId = addTaskForm.status.id;
         } else {
            // Fallback Mapping logic
            let typeMap: string = 'unstarted';
            switch (addTaskForm.status.id) {
               case 'backlog':
                  typeMap = 'backlog';
                  break;
               case 'to-do':
                  typeMap = 'unstarted';
                  break;
               case 'in-progress':
                  typeMap = 'started';
                  break;
               case 'technical-review':
                  typeMap = 'started';
                  break;
               case 'completed':
                  typeMap = 'completed';
                  break;
               case 'paused':
                  typeMap = 'canceled';
                  break;
               default:
                  typeMap = 'unstarted';
            }
            const { data: states } = await supabase
               .from('workflow_state')
               .select('id')
               .eq('team_id', teamId)
               .eq('type', typeMap)
               .limit(1);
            stateId = states && states.length > 0 ? states[0].id : null;
         }

         // Insert Task
         const { error } = await supabase.from('task').insert({
            id: addTaskForm.id,
            title: addTaskForm.title,
            workspace_id: orgId,
            team_id: teamId,
            state_id: stateId,
            priority: priorityInt,
            assignee_id: addTaskForm.assignee?.id || null,
            description: addTaskForm.description,
         });

         if (error) throw error;

         toast.success('Task created');

         // Refresh router to update server data (specifically identifiers)
         router.refresh();

         // Optimistic update (note: identifier will be wrong until refresh completes or next fetch)
         addTask({
            ...addTaskForm,
            // We could try to construct accurate ID if we fetched team Key, but router.refresh is easier
         });

         if (!createMore) {
            closeModal();
         }
         setAddTaskForm(createDefaultData());
      } catch (e) {
         console.error(e);
         toast.error('Failed to create task');
      }
   };

   return (
      <Dialog open={isOpen} onOpenChange={(value) => (value ? openModal() : closeModal())}>
         <DialogTrigger asChild>
            <Button className="size-8 shrink-0" variant="secondary" size="icon">
               <RiEditLine />
            </Button>
         </DialogTrigger>
         <DialogContent className="w-full sm:max-w-[750px] p-0 shadow-xl top-[30%]">
            <DialogHeader>
               <DialogTitle>
                  <div className="flex items-center px-4 pt-4 gap-2">
                     <TeamSelector teamId={selectedTeamId} onChange={setSelectedTeamId} />
                  </div>
               </DialogTitle>
            </DialogHeader>

            <div className="px-4 pb-0 space-y-3 w-full">
               <Input
                  className="border-none w-full shadow-none outline-none text-2xl font-medium px-0 h-auto focus-visible:ring-0 overflow-hidden text-ellipsis whitespace-normal break-words"
                  placeholder="Task title"
                  value={addTaskForm.title}
                  onChange={(e) => setAddTaskForm({ ...addTaskForm, title: e.target.value })}
               />

               <Textarea
                  className="border-none w-full shadow-none outline-none resize-none px-0 min-h-16 focus-visible:ring-0 break-words whitespace-normal overflow-wrap"
                  placeholder="Add description..."
                  value={addTaskForm.description}
                  onChange={(e) => setAddTaskForm({ ...addTaskForm, description: e.target.value })}
               />

               <div className="w-full flex items-center justify-start gap-1.5 flex-wrap">
                  <StatusSelector
                     status={addTaskForm.status}
                     onChange={(newStatus) => setAddTaskForm({ ...addTaskForm, status: newStatus })}
                     teamId={selectedTeamId}
                  />
                  <PrioritySelector
                     priority={addTaskForm.priority}
                     onChange={(newPriority) =>
                        setAddTaskForm({ ...addTaskForm, priority: newPriority })
                     }
                  />
                  <AssigneeSelector
                     assignee={addTaskForm.assignee}
                     onChange={(newAssignee) =>
                        setAddTaskForm({ ...addTaskForm, assignee: newAssignee })
                     }
                  />
                  <ProjectSelector
                     project={addTaskForm.project}
                     onChange={(newProject) =>
                        setAddTaskForm({ ...addTaskForm, project: newProject })
                     }
                  />
                  <LabelSelector
                     selectedLabels={addTaskForm.labels}
                     onChange={(newLabels) => setAddTaskForm({ ...addTaskForm, labels: newLabels })}
                  />
               </div>
            </div>
            <div className="flex items-center justify-between py-2.5 px-4 w-full border-t">
               <div className="flex items-center gap-2">
                  <div className="flex items-center space-x-2">
                     <Switch
                        id="create-more"
                        checked={createMore}
                        onCheckedChange={setCreateMore}
                     />
                     <Label htmlFor="create-more">Create more</Label>
                  </div>
               </div>
               <Button
                  size="sm"
                  onClick={() => {
                     createTask();
                  }}
               >
                  Create task
               </Button>
            </div>
         </DialogContent>
      </Dialog>
   );
}
