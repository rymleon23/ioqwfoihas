'use client';

import { useState } from 'react';
import { ProjectForm } from '@/components/projects/project-form';

export function ProjectFormDemo() {
   return (
      <div className="p-6 bg-background min-h-screen">
         <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-foreground">Project Form Demo</h1>

            <div className="bg-card rounded-lg border border-border p-6">
               <ProjectForm onSubmit={() => {}} onCancel={() => {}} teams={[]} members={[]} />
            </div>
         </div>
      </div>
   );
}
