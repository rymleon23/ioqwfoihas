import { ProjectForm } from '@/components/projects/project-form';
import { PageHeader } from '@/components/ui/page-header';

export default function CreateProjectPage() {
   return (
      <div className="flex flex-col space-y-6">
         <PageHeader title="Create Project" description="Start a new project" />

         <div className="max-w-2xl">
            <ProjectForm onSubmit={() => {}} onCancel={() => {}} teams={[]} members={[]} />
         </div>
      </div>
   );
}
