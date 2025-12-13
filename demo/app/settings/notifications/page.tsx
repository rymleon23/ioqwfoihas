import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function NotificationsPage() {
   return (
      <div className="min-h-screen bg-gray-900 text-white">
         <div className="max-w-4xl mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold text-white mb-8">Notifications</h1>
            <div className="space-y-8">
               <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white">Email Notifications</h2>
                  <div className="space-y-4">
                     <div className="flex items-center justify-between">
                        <div className="flex-1">
                           <Label
                              htmlFor="project-updates"
                              className="text-sm font-medium text-gray-300"
                           >
                              Project updates
                           </Label>
                           <p className="text-sm text-gray-500 mt-1">
                              Get notified when projects you're assigned to are updated.
                           </p>
                        </div>
                        <Switch id="project-updates" defaultChecked className="linear-toggle" />
                     </div>

                     <div className="flex items-center justify-between">
                        <div className="flex-1">
                           <Label
                              htmlFor="task-assignments"
                              className="text-sm font-medium text-gray-300"
                           >
                              Task assignments
                           </Label>
                           <p className="text-sm text-gray-500 mt-1">
                              Get notified when you're assigned to new tasks.
                           </p>
                        </div>
                        <Switch id="task-assignments" defaultChecked className="linear-toggle" />
                     </div>

                     <div className="flex items-center justify-between">
                        <div className="flex-1">
                           <Label
                              htmlFor="team-mentions"
                              className="text-sm font-medium text-gray-300"
                           >
                              Team mentions
                           </Label>
                           <p className="text-sm text-gray-500 mt-1">
                              Get notified when you're mentioned in comments or discussions.
                           </p>
                        </div>
                        <Switch id="team-mentions" defaultChecked className="linear-toggle" />
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
