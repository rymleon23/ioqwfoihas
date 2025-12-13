import { Suspense } from 'react';
import { ScheduleCalendar } from '@/components/schedules/schedule-calendar';

interface SchedulesPageProps {
   params: Promise<{
      orgId: string;
   }>;
}

export default async function SchedulesPage({ params }: SchedulesPageProps) {
   const resolvedParams = await params;
   const { orgId } = resolvedParams;

   return (
      <div className="container mx-auto py-6">
         <div className="mb-6">
            <h1 className="text-3xl font-bold">Content Scheduling</h1>
            <p className="text-gray-600 mt-2">
               Schedule your content for publication and manage your posting calendar.
            </p>
         </div>

         <Suspense fallback={<div>Loading calendar...</div>}>
            <ScheduleCalendar orgId={orgId} />
         </Suspense>
      </div>
   );
}
