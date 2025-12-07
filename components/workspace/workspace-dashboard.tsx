'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Users, CheckSquare, Inbox, ArrowRight } from 'lucide-react';
import { useCreatePersonalTask, usePersonalTasks, statusColors, statusLabels } from '@/hooks/usePersonalTasks';
import { toast } from 'sonner';
import Link from 'next/link';

interface WorkspaceDashboardProps {
    workspace: {
        id: string;
        name: string;
        slug: string;
    };
    teams: {
        id: string;
        name: string;
        key: string;
    }[];
    personalTasksCount: number;
    userId: string;
}

export function WorkspaceDashboard({
    workspace,
    teams,
    personalTasksCount,
}: WorkspaceDashboardProps) {
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const { data: personalTasks, isLoading: tasksLoading } = usePersonalTasks(workspace.id);
    const createTask = useCreatePersonalTask();

    const handleCreateTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        setIsCreating(true);
        try {
            await createTask.mutateAsync({
                workspaceId: workspace.id,
                title: newTaskTitle.trim(),
            });
            setNewTaskTitle('');
            toast.success('Task created!');
        } catch (error) {
            toast.error('Failed to create task');
            console.error(error);
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="flex h-full flex-col">
            {/* Header */}
            <div className="border-b px-6 py-4">
                <h1 className="text-2xl font-bold">{workspace.name}</h1>
                <p className="text-muted-foreground">Workspace Dashboard</p>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-6">
                <div className="mx-auto max-w-4xl space-y-6">

                    {/* Quick Create Task */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Plus className="h-5 w-5" />
                                Quick Create Task
                            </CardTitle>
                            <CardDescription>
                                Create a personal task - no team required
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleCreateTask} className="flex gap-2">
                                <Input
                                    placeholder="What do you need to do?"
                                    value={newTaskTitle}
                                    onChange={(e) => setNewTaskTitle(e.target.value)}
                                    disabled={isCreating}
                                />
                                <Button type="submit" disabled={isCreating || !newTaskTitle.trim()}>
                                    {isCreating ? 'Creating...' : 'Create'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Stats Cards */}
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">My Tasks</CardTitle>
                                <CheckSquare className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{personalTasksCount}</div>
                                <p className="text-xs text-muted-foreground">Personal tasks</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Teams</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{teams.length}</div>
                                <p className="text-xs text-muted-foreground">
                                    {teams.length === 0 ? 'No teams yet' : 'Active teams'}
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Inbox</CardTitle>
                                <Inbox className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">0</div>
                                <p className="text-xs text-muted-foreground">Pending triage</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Personal Tasks List */}
                    <Card>
                        <CardHeader>
                            <CardTitle>My Tasks</CardTitle>
                            <CardDescription>
                                Your personal tasks that are not assigned to any team
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {tasksLoading ? (
                                <div className="py-4 text-center text-muted-foreground">Loading...</div>
                            ) : personalTasks && personalTasks.length > 0 ? (
                                <div className="space-y-2">
                                    {personalTasks.slice(0, 5).map((task) => (
                                        <div
                                            key={task.id}
                                            className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="h-2 w-2 rounded-full"
                                                    style={{ backgroundColor: statusColors[task.status] || '#6B7280' }}
                                                />
                                                <span>{task.title}</span>
                                            </div>
                                            <span className="text-sm text-muted-foreground">
                                                {statusLabels[task.status] || 'Unknown'}
                                            </span>
                                        </div>
                                    ))}
                                    {personalTasks.length > 5 && (
                                        <Link
                                            href={`/${workspace.id}/my-tasks`}
                                            className="flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground hover:text-foreground"
                                        >
                                            View all {personalTasks.length} tasks
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    )}
                                </div>
                            ) : (
                                <div className="py-8 text-center text-muted-foreground">
                                    <p>No personal tasks yet</p>
                                    <p className="text-sm">Create your first task above</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Teams Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Teams</CardTitle>
                            <CardDescription>
                                Teams in this workspace
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {teams.length > 0 ? (
                                <div className="space-y-2">
                                    {teams.map((team) => (
                                        <Link
                                            key={team.id}
                                            href={`/${workspace.id}/team/${team.id}/all`}
                                            className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10 text-sm font-medium">
                                                    {team.key}
                                                </div>
                                                <span>{team.name}</span>
                                            </div>
                                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-8 text-center text-muted-foreground">
                                    <p>No teams yet</p>
                                    <p className="text-sm">You can create personal tasks without a team</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    );
}
