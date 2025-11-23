'use client';

import { Task } from '@/mock-data/tasks';
import { format } from 'date-fns';
import { AssigneeUser } from './assignee-user';
import { LabelBadge } from './label-badge';
import { PrioritySelector } from './priority-selector';
import { ProjectBadge } from './project-badge';
import { StatusSelector } from './status-selector';
import { motion } from 'motion/react';

import { ContextMenu, ContextMenuTrigger } from '@/components/ui/context-menu';
import { TaskContextMenu } from './task-context-menu';

export function TaskLine({ task, layoutId = false }: { task: Task; layoutId?: boolean }) {
   return (
      <ContextMenu>
         <ContextMenuTrigger asChild>
            <motion.div
               {...(layoutId && { layoutId: `task-line-${task.identifier}` })}
               //href={`/lndev-ui/task/${task.identifier}`}
               className="w-full flex items-center justify-start h-11 px-6 hover:bg-sidebar/50"
            >
               <div className="flex items-center gap-0.5">
                  <PrioritySelector priority={task.priority} taskId={task.id} />
                  <span className="text-sm hidden sm:inline-block text-muted-foreground font-medium w-[66px] truncate shrink-0 mr-0.5">
                     {task.identifier}
                  </span>
                  <StatusSelector status={task.status} taskId={task.id} />
               </div>
               <span className="min-w-0 flex items-center justify-start mr-1 ml-0.5">
                  <span className="text-xs sm:text-sm font-medium sm:font-semibold truncate">
                     {task.title}
                  </span>
               </span>
               <div className="flex items-center justify-end gap-2 ml-auto sm:w-fit">
                  <div className="w-3 shrink-0"></div>
                  <div className="-space-x-5 hover:space-x-1 lg:space-x-1 items-center justify-end hidden sm:flex duration-200 transition-all">
                     <LabelBadge label={task.labels} />
                     {task.project && <ProjectBadge project={task.project} />}
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0 hidden sm:inline-block">
                     {format(new Date(task.createdAt), 'MMM dd')}
                  </span>
                  <AssigneeUser user={task.assignee} />
               </div>
            </motion.div>
         </ContextMenuTrigger>
         <TaskContextMenu taskId={task.id} />
      </ContextMenu>
   );
}
