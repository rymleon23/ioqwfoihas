'use client';

import { CampaignDisplayModal } from './campaign-display-modal';

export function CampaignDisplayModalDemo() {
   return (
      <div className="p-6 bg-background min-h-screen">
         <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-foreground">Campaign Display Modal Demo</h1>

            <div className="bg-card rounded-lg border border-border p-6">
               <p className="text-muted-foreground">Campaign Display Modal Demo Component</p>
            </div>
         </div>
      </div>
   );
}
