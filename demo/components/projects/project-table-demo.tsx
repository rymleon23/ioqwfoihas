'use client';

import { useState } from 'react';
import ProjectTable from '@/components/projects/project-table';
import { Project } from '@/types/project';

export function ProjectTableDemo() {
   const mockProjects: Project[] = [
      {
         id: '1',
         name: '🚀 Summer Sale 2024',
         title: '🚀 Summer Sale 2024',
         summary: 'Boost summer sales with targeted social media Projects',
         description:
            'Boost summer sales with targeted social media Projects and influencer partnerships. Focus on seasonal products and beach lifestyle content.',
         status: 'READY',
         health: 'ON_TRACK',
         priority: 'HIGH',
         organizationId: 'demo-org',
         leadId: 'user-1',
         objectiveId: 'obj-1',
         phaseId: 'phase-1',
         startDate: new Date('2024-06-01'),
         endDate: new Date('2024-08-31'),
         createdAt: new Date('2024-12-30T10:00:00Z'),
         updatedAt: new Date('2024-12-30T10:00:00Z'),
         _count: {
            tasks: 5,
            members: 3,
            labels: 2,
            milestones: 3,
            contents: 2,
            schedules: 1,
         },
      },
      {
         id: '2',
         name: '🎯 Q4 Product Launch',
         title: '🎯 Q4 Product Launch',
         summary: 'Launch new product line with comprehensive marketing strategy',
         description:
            'Launch new product line with comprehensive marketing strategy including PR, social media, and influencer Projects.',
         status: 'PLANNING',
         health: 'AT_RISK',
         priority: 'MEDIUM',
         organizationId: 'demo-org',
         leadId: 'user-2',
         objectiveId: 'obj-2',
         phaseId: 'phase-2',
         startDate: new Date('2024-09-01'),
         endDate: new Date('2024-12-31'),
         createdAt: new Date('2024-12-28T14:30:00Z'),
         updatedAt: new Date('2024-12-28T14:30:00Z'),
         _count: {
            tasks: 8,
            members: 5,
            labels: 3,
            milestones: 4,
            contents: 3,
            schedules: 2,
         },
      },
      {
         id: '3',
         name: '🌟 Brand Awareness Project',
         title: '🌟 Brand Awareness Project',
         summary: 'Increase brand visibility through thought leadership content',
         description:
            'Increase brand visibility through thought leadership content, partnerships, and community engagement.',
         status: 'DRAFT',
         health: 'OFF_TRACK',
         priority: 'LOW',
         organizationId: 'demo-org',
         leadId: 'user-3',
         objectiveId: 'obj-3',
         phaseId: 'phase-3',
         startDate: new Date('2024-10-01'),
         endDate: new Date('2024-12-31'),
         createdAt: new Date('2024-12-25T09:15:00Z'),
         updatedAt: new Date('2024-12-25T09:15:00Z'),
         _count: {
            tasks: 12,
            members: 4,
            labels: 2,
            milestones: 6,
            contents: 4,
            schedules: 3,
         },
      },
   ];

   return (
      <div className="p-6 bg-background min-h-screen">
         <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-foreground">Project Table Demo</h1>

            <div className="bg-card rounded-lg border border-border">
               <ProjectTable
                  Projects={mockProjects}
                  onSelect={(Project: Project) => console.log('Select Project:', Project.id)}
                  onEdit={(Project: Project) => console.log('Edit Project:', Project.id)}
                  onDelete={(Project: Project) => console.log('Delete Project:', Project.id)}
                  onCreateProject={() => console.log('Create new Project')}
                  loading={false}
                  orgId="demo-org"
               />
            </div>
         </div>
      </div>
   );
}
