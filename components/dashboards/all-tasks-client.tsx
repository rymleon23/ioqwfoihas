'use client';

import { useEffect } from 'react';
import AllTasks from '@/components/common/tasks/all-tasks';
import { useTasksStore } from '@/store/tasks-store';
import { Task } from '@/mock-data/tasks';
import { SerializableTask } from '@/utils/transformers';
import { status } from '@/mock-data/status';
import { priorities } from '@/mock-data/priorities';
import { Cuboid } from 'lucide-react';
import { users } from '@/mock-data/users';

interface AllTasksClientProps {
    tasks: SerializableTask[];
}

export function AllTasksClient({ tasks }: AllTasksClientProps) {
    const { setTasks } = useTasksStore();

    useEffect(() => {
        // Reconstitute SerializableTask -> StoreTask (with Icons/Functions)
        const hydratedTasks: Task[] = tasks.map(t => {
            const matchedStatus = status.find(s => s.id === t.statusId) || status[0];
            const matchedPriority = priorities.find(p => p.id === t.priorityId) || priorities[0];

            // Re-construct project if exists
            const project = t.project ? {
                ...t.project,
                icon: Cuboid,
                status: status.find(s => s.id === (t.project?.statusId || 'to-do')) || status[0],
                // Add missing required fields from Project interface if any
                lead: users[0], // Mock
                members: [],
                priority: priorities[0],
            } : undefined;

            return {
                ...t,
                status: matchedStatus,
                priority: matchedPriority,
                project: project as any, // Cast to any or match Project type strictly
            } as Task;
        });

        setTasks(hydratedTasks);
    }, [tasks, setTasks]);

    return <AllTasks />;
}
