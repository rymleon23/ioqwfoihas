'use client';

import { status } from '@/mock-data/status';
import { useTasksStore } from '@/store/tasks-store';
import { useSearchStore } from '@/store/search-store';
import { useViewStore } from '@/store/view-store';
import { useFilterStore } from '@/store/filter-store';
import { FC, useMemo } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { GroupTasks } from './group-tasks';
import { SearchTasks } from './search-tasks';
import { CustomDragLayer } from './task-grid';
import { cn } from '@/lib/utils';
import { Task } from '@/mock-data/tasks';

export default function AllTasks() {
   const { isSearchOpen, searchQuery } = useSearchStore();
   const { viewType } = useViewStore();
   const { hasActiveFilters } = useFilterStore();

   const isSearching = isSearchOpen && searchQuery.trim() !== '';
   const isViewTypeGrid = viewType === 'grid';
   const isFiltering = hasActiveFilters();

   return (
      <div className={cn('w-full h-full', isViewTypeGrid && 'overflow-x-auto')}>
         {isSearching ? (
            <SearchTasksView />
         ) : isFiltering ? (
            <FilteredTasksView isViewTypeGrid={isViewTypeGrid} />
         ) : (
            <GroupTasksListView isViewTypeGrid={isViewTypeGrid} />
         )}
      </div>
   );
}

const SearchTasksView = () => (
   <div className="px-6 mb-6">
      <SearchTasks />
   </div>
);

const FilteredTasksView: FC<{
   isViewTypeGrid: boolean;
}> = ({ isViewTypeGrid = false }) => {
   const { filters } = useFilterStore();
   const { filterTasks } = useTasksStore();

   // Apply filters to get filtered tasks
   const filteredTasks = useMemo(() => {
      return filterTasks(filters);
   }, [filterTasks, filters]);

   // Group filtered tasks by status
   const filteredTasksByStatus = useMemo(() => {
      const result: Record<string, Task[]> = {};

      status.forEach((statusItem) => {
         result[statusItem.id] = filteredTasks.filter((task) => task.status.id === statusItem.id);
      });

      return result;
   }, [filteredTasks]);

   return (
      <DndProvider backend={HTML5Backend}>
         <CustomDragLayer />
         <div className={cn(isViewTypeGrid && 'flex h-full gap-3 px-2 py-2 min-w-max')}>
            {status.map((statusItem) => (
               <GroupTasks
                  key={statusItem.id}
                  status={statusItem}
                  tasks={filteredTasksByStatus[statusItem.id] || []}
                  count={filteredTasksByStatus[statusItem.id]?.length || 0}
               />
            ))}
         </div>
      </DndProvider>
   );
};

const GroupTasksListView: FC<{
   isViewTypeGrid: boolean;
}> = ({ isViewTypeGrid = false }) => {
   const { tasksByStatus } = useTasksStore();
   return (
      <DndProvider backend={HTML5Backend}>
         <CustomDragLayer />
         <div className={cn(isViewTypeGrid && 'flex h-full gap-3 px-2 py-2 min-w-max')}>
            {status.map((statusItem) => (
               <GroupTasks
                  key={statusItem.id}
                  status={statusItem}
                  tasks={tasksByStatus[statusItem.id] || []}
                  count={tasksByStatus[statusItem.id]?.length || 0}
               />
            ))}
         </div>
      </DndProvider>
   );
};
