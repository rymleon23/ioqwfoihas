import { createClient } from '@/utils/supabase/server';
import MainLayout from '@/components/layout/main-layout';
import Header from '@/components/layout/headers/tasks/header';
import { AllTasksClient } from '@/components/dashboards/all-tasks-client';
import { dbTaskToStoreTask } from '@/utils/transformers';
import { Task as DBTask } from '@/hooks/use-tasks';

export default async function AllTasksPage({ params }: { params: Promise<{ orgId: string }> }) {
    const { orgId } = await params;
    const supabase = await createClient();

    // Fetch all tasks for the workspace
    // Joining with related tables to get necessary UI data
    const { data: dbTasks, error } = await supabase
        .from('task')
        .select(
            `
      *,
      assignee:users!task_assignee_id_fkey(id, display_name, avatar_url),
      workflow_state(name, color, type),
      project(id, name),
      priority,
      number
    `
        )
        .eq('workspace_id', orgId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching tasks:", error);
        // Handle error gracefully or throw
    }

    // Transform DB tasks to Store tasks
    // @ts-ignore - Supabase type inference for joins can be tricky, casting for now as we validated structure
    const tasks = (dbTasks || []).map(task => dbTaskToStoreTask(task as unknown as DBTask));

    return (
        <MainLayout header={<Header />} headersNumber={1}>
            <div className="h-full w-full">
                <AllTasksClient tasks={tasks} />
            </div>
        </MainLayout>
    );
}
