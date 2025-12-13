import React from 'react';
import { GuestPermissionsSettings } from '@/components/settings/guest-permissions-settings';

export default function GuestPermissionsPage() {
   return (
      <div className="min-h-screen bg-gray-900 text-white">
         <div className="max-w-4xl mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold text-white mb-8">Guest Permissions</h1>
            <GuestPermissionsSettings />
         </div>
      </div>
   );
}
