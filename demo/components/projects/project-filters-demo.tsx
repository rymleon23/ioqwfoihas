'use client';

import { useState } from 'react';
import ProjectFilters from '@/components/projects/project-filters';
import { ProjectFilters as ProjectFiltersType } from '@/types/project';

export function ProjectFiltersDemo() {
   const [filters, setFilters] = useState<ProjectFiltersType>({
      search: '',
      status: undefined,
      health: undefined,
      priority: undefined,
      startDate: undefined,
      endDate: undefined,
      leadId: undefined,
      memberId: undefined,
   });

   const handleClear = () => {
      setFilters({
         search: '',
         status: undefined,
         health: undefined,
         priority: undefined,
         startDate: undefined,
         endDate: undefined,
         leadId: undefined,
         memberId: undefined,
      });
   };

   return (
      <div className="p-6 bg-background min-h-screen">
         <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-foreground">Project Filters Demo</h1>

            <div className="bg-card rounded-lg border border-border p-6">
               <ProjectFilters
                  filters={filters}
                  onChange={(newFilters) => {
                     console.log('Filters changed:', newFilters);
                     setFilters(newFilters);
                  }}
                  onClear={handleClear}
               />
            </div>

            {/* Display current filters */}
            <div className="mt-6 bg-muted/50 rounded-lg border border-border p-4">
               <h3 className="text-lg font-semibold text-foreground mb-3">Current Filters:</h3>
               <pre className="text-sm text-muted-foreground bg-background p-3 rounded border">
                  {JSON.stringify(filters, null, 2)}
               </pre>
            </div>
         </div>
      </div>
   );
}
