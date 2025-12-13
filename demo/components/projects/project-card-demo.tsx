'use client';

import { ProjectCard } from '@/components/projects/project-card';

// Demo component để test Project Card
export function ProjectCardDemo() {
   const demoProject = {
      id: 'demo-1',
      name: '🚀 Demo Project 2024',
      summary: 'This is a demo Project to showcase the Project Card component.',
      description:
         'This is a demo Project to showcase the Project Card component. It includes sample content and schedules for testing purposes.',
      organizationId: 'demo-org',
      health: 'HEALTHY' as any,
      status: 'ACTIVE' as any,
      priority: 'MEDIUM' as any,
      createdAt: new Date(),
      updatedAt: new Date(),
      objectiveId: 'demo-objective',
      createdById: 'demo-user',
      leadId: 'demo-lead',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      phaseId: 'demo-phase',
   };

   return (
      <div className="p-6 bg-gray-50 min-h-screen">
         <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Project Card Demo</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <ProjectCard project={demoProject} orgId="demo" />

               <div className="bg-white p-4 rounded-lg border">
                  <h3 className="font-semibold mb-2">Component Details:</h3>
                  <ul className="text-sm space-y-1 text-gray-600">
                     <li>• Hover để thấy shadow effect</li>
                     <li>• Click "View Details" để test navigation</li>
                     <li>• Click "Add Content" để test content creation</li>
                     <li>• Click menu button (⋮) để test actions</li>
                  </ul>
               </div>
            </div>
         </div>
      </div>
   );
}
