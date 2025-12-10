import { SocialScheduler } from '@/components/marketing/social-scheduler';
import MainLayout from '@/components/layout/main-layout';
import { Header } from '@/components/marketing/header';

export default function SchedulePage() {
   return (
      <MainLayout header={<Header title="Social Scheduler" />}>
         <div className="h-full flex-1 flex-col space-y-8 p-8 flex">
            <SocialScheduler />
         </div>
      </MainLayout>
   );
}
