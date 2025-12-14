import MainLayout from '@/components/layout/main-layout';
import React, { Suspense } from 'react';
import Header from '@/components/layout/headers/teams/header';
import { MyTasksWidget } from '@/components/dashboards/widgets/my-tasks-widget';

export default async function AllTasksPage({ params }: { params: Promise<{ orgId: string }> }) {
    const { orgId } = await params;

    return (
        <MainLayout header={<Header />} headersNumber={1}>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">All Tasks</h1>
                {/* Reusing MyTasksWidget for now as it lists tasks. 
                 Ideally this should be a full interactive Task List component 
                 like the one in demo/app/[orgId]/tasks/page.tsx */}
                <div className="h-full">
                    <MyTasksWidget workspaceId={orgId} />
                </div>
            </div>
        </MainLayout>
    );
}
