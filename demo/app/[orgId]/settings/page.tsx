import React from 'react';
import { PreferencesSettings } from '@/components/settings/preferences-settings';

export default function PreferencesPage() {
   return (
      <div className="min-h-screen bg-gray-900 text-white">
         <div className="max-w-4xl mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold text-white mb-8">Preferences</h1>
            <PreferencesSettings />
         </div>
      </div>
   );
}
