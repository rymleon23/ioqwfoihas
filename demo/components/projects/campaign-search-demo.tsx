'use client';

import { useState } from 'react';
import ProjectSearch from '@/components/projects/project-search';
import { Project } from '@/types/project';

export function ProjectSearchDemo() {
   const [searchValue, setSearchValue] = useState('');

   const mockProjects: Project[] = [
      {
         id: '1',
         name: '🚀 Summer Sale 2024',
         title: '🚀 Summer Sale 2024',
         summary: 'Boost summer sales with targeted social media Projects',
         description:
            'Boost summer sales with targeted social media Projects and influencer partnerships.',
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
         _count: { tasks: 5, members: 3, labels: 2, milestones: 3, contents: 2, schedules: 1 },
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
         _count: { tasks: 8, members: 5, labels: 3, milestones: 4, contents: 3, schedules: 2 },
      },
   ];

   return (
      <div className="p-6 bg-background min-h-screen">
         <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-foreground">Project Search Demo</h1>

            <div className="bg-card rounded-lg border border-border p-6">
               <ProjectSearch
                  value={searchValue}
                  onChange={(value: string) => {
                     setSearchValue(value);
                     console.log('Search value changed:', value);
                  }}
                  onSelect={(Project: Project) => {
                     console.log('Project selected:', Project);
                     alert(`Selected Project: ${Project.name}`);
                  }}
                  Projects={mockProjects}
                  placeholder="Search Projects..."
                  className="w-full"
               />
            </div>

            {/* Display current search value */}
            <div className="mt-6 bg-muted/50 rounded-lg border border-border p-4">
               <h3 className="text-lg font-semibold text-foreground mb-3">Current Search Value:</h3>
               <p className="text-muted-foreground">{searchValue || 'No search value'}</p>
            </div>
         </div>
      </div>
   );
}
