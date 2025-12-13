'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import ProjectStatusSelector from '@/components/projects/project-status-selector';
import { ProjectStatus } from '@/types/project';

export function ProjectStatusSelectorDemo() {
   const [selectedStatus, setSelectedStatus] = useState<ProjectStatus>('DRAFT');

   return (
      <div className="p-6 bg-background min-h-screen">
         <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-foreground">
               Project Status Selector Demo
            </h1>

            <div className="bg-card rounded-lg border border-border p-6 space-y-6">
               <div>
                  <h3 className="text-lg font-medium mb-2 text-foreground">Status Selection</h3>
                  <ProjectStatusSelector
                     value={selectedStatus}
                     onChange={(status: ProjectStatus) => setSelectedStatus(status)}
                  />
                  <p className="text-sm text-muted-foreground mt-2">Selected: {selectedStatus}</p>
               </div>

               <div>
                  <h3 className="text-lg font-medium mb-2 text-foreground">
                     Current Selection Display
                  </h3>
                  <div className="p-4 bg-muted/50 rounded-lg border border-border">
                     <p className="text-sm text-muted-foreground mb-2">Selected Status:</p>
                     <Badge variant="outline" className="text-lg px-3 py-2">
                        {selectedStatus}
                     </Badge>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
