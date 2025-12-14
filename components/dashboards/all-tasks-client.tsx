'use client';

import { useEffect } from 'react';
import AllTasks from '@/components/common/tasks/all-tasks';
import { useTasksStore } from '@/store/tasks-store';
import { Task } from '@/mock-data/tasks';

interface AllTasksClientProps {
    tasks: Task[];
}

export function AllTasksClient({ tasks }: AllTasksClientProps) {
    const { setTasks } = useTasksStore();

    useEffect(() => {
        // Hydrate the store with real data on mount
        // We assume 'tasks' are already transformed to the Store Task shape
        setTasks(tasks);
    }, [tasks, setTasks]);

    return <AllTasks />;
}
