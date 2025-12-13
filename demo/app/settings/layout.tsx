import React from 'react';
import { SettingsSidebar } from '@/components/settings/settings-sidebar';
import { SettingsMobileToggle } from '@/components/settings/settings-mobile-toggle';

interface SettingsLayoutProps {
   children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
   return (
      <div className="min-h-screen bg-gray-900 text-white">
         <div className="flex">
            {/* Desktop Sidebar */}
            <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
               <SettingsSidebar />
            </div>

            {/* Mobile Toggle */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
               <SettingsMobileToggle />
            </div>

            {/* Main content */}
            <div className="lg:pl-64 flex flex-col flex-1">
               <main className="flex-1">{children}</main>
            </div>
         </div>
      </div>
   );
}
