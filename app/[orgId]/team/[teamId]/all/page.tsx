import AllTasks from '@/components/common/tasks/all-tasks';
import Header from '@/components/layout/headers/tasks/header';
import MainLayout from '@/components/layout/main-layout';

export default function AllTasksPage() {
   return (
      <MainLayout header={<Header />}>
         <AllTasks />
      </MainLayout>
   );
}
