'use client';

import { ProjectCard } from '@/components/projects/project-card';
import type { ProjectStatus, ProjectPriority, ProjectHealth } from '@/types';

// Demo page để test Project Card component gốc
export default function ProjectCardDemoPage() {
   const mockProjects = [
      {
         id: '1',
         name: '🚀 Summer Sale 2024',
         description:
            'Boost summer sales with targeted social media campaigns and influencer partnerships. Focus on seasonal products and beach lifestyle content.',
         summary: 'Summer sales campaign for 2024',
         status: 'PLANNING' as ProjectStatus,
         priority: 'HIGH' as ProjectPriority,
         health: 'ON_TRACK' as ProjectHealth,
         organizationId: 'demo-org',
         objectiveId: 'obj-1',
         leadId: 'user-1',
         startDate: new Date('2024-12-30T10:00:00Z'),
         endDate: new Date('2025-01-30T10:00:00Z'),
         targetDate: new Date('2025-01-30T10:00:00Z'),
         phaseId: 'phase-1',
         createdAt: new Date('2024-12-30T10:00:00Z'),
         updatedAt: new Date('2024-12-30T10:00:00Z'),
         contents: [],
         schedules: [],
      },
      {
         id: '2',
         name: '🎯 Q4 Product Launch',
         description:
            'Launch new product line with comprehensive marketing strategy including PR, social media, and influencer campaigns.',
         summary: 'Q4 product launch campaign',
         status: 'PLANNING' as ProjectStatus,
         priority: 'MEDIUM' as ProjectPriority,
         health: 'ON_TRACK' as ProjectHealth,
         organizationId: 'demo-org',
         objectiveId: 'obj-2',
         leadId: 'user-2',
         startDate: new Date('2024-12-28T14:30:00Z'),
         endDate: new Date('2025-02-28T14:30:00Z'),
         targetDate: new Date('2025-02-28T14:30:00Z'),
         phaseId: 'phase-2',
         createdAt: new Date('2024-12-28T14:30:00Z'),
         updatedAt: new Date('2024-12-28T14:30:00Z'),
         contents: [],
         schedules: [],
      },
      {
         id: '3',
         name: '🌟 Brand Awareness Project',
         description:
            'Increase brand visibility through thought leadership content, partnerships, and community engagement.',
         summary: 'Brand awareness initiative',
         status: 'DONE' as ProjectStatus,
         priority: 'LOW' as ProjectPriority,
         health: 'ON_TRACK' as ProjectHealth,
         organizationId: 'demo-org',
         objectiveId: 'obj-3',
         leadId: 'user-3',
         startDate: new Date('2024-12-25T09:15:00Z'),
         endDate: new Date('2025-01-25T09:15:00Z'),
         targetDate: new Date('2025-01-25T09:15:00Z'),
         phaseId: 'phase-3',
         createdAt: new Date('2024-12-25T09:15:00Z'),
         updatedAt: new Date('2024-12-25T09:15:00Z'),
         contents: [],
         schedules: [],
      },
   ];

   return (
      <div className="p-8">
         <div className="max-w-7xl mx-auto">
            <div className="mb-8">
               <h1 className="text-3xl font-bold text-foreground mb-2">
                  Project Card Component Demo
               </h1>
               <p className="text-muted-foreground">
                  Sử dụng trực tiếp ProjectCard component gốc từ
                  components/projects/project-card.tsx
               </p>
            </div>

            {/* Grid Layout */}
            <div className="mb-8">
               <h2 className="text-2xl font-semibold text-foreground mb-4">
                  Grid Layout (Responsive)
               </h2>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockProjects.map((project) => (
                     <ProjectCard key={project.id} project={project} orgId="demo-org" />
                  ))}
               </div>
            </div>

            {/* Single Card Preview */}
            <div className="mb-8">
               <h2 className="text-2xl font-semibold text-foreground mb-4">Single Card Preview</h2>
               <div className="max-w-md">
                  <ProjectCard project={mockProjects[0]} orgId="demo-org" />
               </div>
            </div>

            {/* Component Documentation */}
            <div className="bg-card rounded-lg border border-border p-6">
               <h3 className="text-lg font-semibold text-foreground mb-3">
                  📚 Component Information
               </h3>
               <div className="space-y-2 text-sm text-muted-foreground">
                  <p>
                     <strong>Source File:</strong> components/projects/project-card.tsx
                  </p>
                  <p>
                     <strong>Props:</strong> project (Project), orgId (string)
                  </p>
                  <p>
                     <strong>Features:</strong> Hover effects, responsive design, action buttons
                  </p>
                  <p>
                     <strong>Dependencies:</strong> shadcn/ui components, lucide-react icons
                  </p>
                  <p>
                     <strong>Documentation:</strong> docs/ui/projects.md
                  </p>
               </div>
            </div>

            {/* Testing Instructions */}
            <div className="mt-8 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800 p-6">
               <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
                  🧪 Testing Instructions
               </h3>
               <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                  <p>
                     • <strong>Hover Effects:</strong> Hover vào cards để thấy shadow animation
                  </p>
                  <p>
                     • <strong>Responsive:</strong> Thay đổi browser size để test responsive design
                  </p>
                  <p>
                     • <strong>Actions:</strong> Click "View Details" và "Add Content" buttons
                  </p>
                  <p>
                     • <strong>Menu:</strong> Click menu button (⋮) để test dropdown
                  </p>
                  <p>
                     • <strong>Navigation:</strong> Test các links và routing
                  </p>
               </div>
            </div>
         </div>
      </div>
   );
}
