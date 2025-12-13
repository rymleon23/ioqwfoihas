import React from 'react';
import { SettingsSidebar } from '@/components/settings/settings-sidebar';
import { PreferencesSettings } from '@/components/settings/preferences-settings';

export default function SettingsDemoPage() {
   return (
      <div className="min-h-screen bg-gray-900 text-white">
         <div className="flex">
            {/* Sidebar */}
            <div className="w-64 flex-shrink-0">
               <SettingsSidebar />
            </div>

            {/* Main content */}
            <div className="flex-1">
               <div className="max-w-4xl mx-auto px-6 py-8">
                  <h1 className="text-3xl font-bold text-white mb-8">
                     Settings Demo - Linear Style
                  </h1>
                  <PreferencesSettings />
               </div>
            </div>
         </div>
      </div>
   );
}
