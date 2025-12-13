'use client';

import { useState } from 'react';
import ProjectCreationModal from '@/components/projects/project-creation-modal';
import { Button } from '@/components/ui/button';

export function ProjectCreationModalDemo() {
   const [isOpen, setIsOpen] = useState(false);

   // Mock data for demo
   const mockTeams = [
      {
         id: '1',
         name: 'Marketing Team',
         email: 'marketing@example.com',
         image: null,
         createdAt: new Date(),
         updatedAt: new Date(),
         password: null,
         emailVerified: null,
      },
      {
         id: '2',
         name: 'Sales Team',
         email: 'sales@example.com',
         image: null,
         createdAt: new Date(),
         updatedAt: new Date(),
         password: null,
         emailVerified: null,
      },
   ];

   const mockMembers = [
      {
         id: '1',
         name: 'John Doe',
         email: 'john@example.com',
         image: null,
         createdAt: new Date(),
         updatedAt: new Date(),
         password: null,
         emailVerified: null,
      },
      {
         id: '2',
         name: 'Jane Smith',
         email: 'jane@example.com',
         image: null,
         createdAt: new Date(),
         updatedAt: new Date(),
         password: null,
         emailVerified: null,
      },
      {
         id: '3',
         name: 'Bob Johnson',
         email: 'bob@example.com',
         image: null,
         createdAt: new Date(),
         updatedAt: new Date(),
         password: null,
         emailVerified: null,
      },
   ];

   return (
      <div className="p-6 bg-background min-h-screen">
         <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-foreground">Project Creation Modal Demo</h1>

            <div className="bg-card rounded-lg border border-border p-6">
               <Button onClick={() => setIsOpen(true)}>Open Project Creation Modal</Button>

               <ProjectCreationModal
                  isOpen={isOpen}
                  onClose={() => setIsOpen(false)}
                  onSubmit={(data) => {
                     console.log('Project created:', data);
                     alert('Project created! Check console for data.');
                     setIsOpen(false);
                  }}
                  teams={mockTeams}
                  members={mockMembers}
               />
            </div>
         </div>
      </div>
   );
}
