'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
   Target,
   Filter,
   Table,
   Search,
   Plus,
   Settings,
   Calendar,
   Users,
   FileText,
   BarChart3,
   Layout,
   ChevronLeft,
   ChevronRight,
   Home,
} from 'lucide-react';

// Demo modules và components
const demoModules = [
   {
      id: 'campaigns',
      name: 'Campaigns',
      icon: Target,
      description: 'Campaign management components',
      components: [
         {
            id: 'campaign-card-demo',
            name: 'Campaign Card',
            description: 'Card layout với hover effects',
            path: '/demo/campaign-card-demo',
            icon: Target,
         },
         {
            id: 'campaign-form-demo',
            name: 'Campaign Form',
            description: 'Form creation với validation',
            path: '/demo/campaign-form-demo',
            icon: Target,
         },
         {
            id: 'campaign-filters-demo',
            name: 'Campaign Filters',
            description: 'Filter options và controls',
            path: '/demo/campaign-filters-demo',
            icon: Filter,
         },
         {
            id: 'campaign-table-demo',
            name: 'Campaign Table',
            description: 'Data table với sorting',
            path: '/demo/campaign-table-demo',
            icon: Table,
         },
         {
            id: 'campaign-search-demo',
            name: 'Campaign Search',
            description: 'Search functionality',
            path: '/demo/campaign-search-demo',
            icon: Search,
         },
         {
            id: 'campaign-creation-modal-demo',
            name: 'Campaign Creation Modal',
            description: 'Modal dialog',
            path: '/demo/campaign-creation-modal-demo',
            icon: Plus,
         },
         {
            id: 'campaign-status-selector-demo',
            name: 'Campaign Status Selector',
            description: 'Status selection',
            path: '/demo/campaign-status-selector-demo',
            icon: Settings,
         },
      ],
   },
   {
      id: 'content',
      name: 'Content',
      icon: FileText,
      description: 'Content management components',
      components: [
         {
            id: 'content-editor-demo',
            name: 'Content Editor',
            description: 'Rich text editor',
            path: '/demo/content-editor-demo',
            icon: FileText,
         },
      ],
   },
   {
      id: 'schedules',
      name: 'Schedules',
      icon: Calendar,
      description: 'Scheduling và calendar components',
      components: [
         {
            id: 'schedule-calendar-demo',
            name: 'Schedule Calendar',
            description: 'Calendar view với schedules',
            path: '/demo/schedule-calendar-demo',
            icon: Calendar,
         },
      ],
   },
   {
      id: 'members',
      name: 'Members',
      icon: Users,
      description: 'Team member management',
      components: [
         {
            id: 'member-selector-demo',
            name: 'Member Selector',
            description: 'Select team members',
            path: '/demo/member-selector-demo',
            icon: Users,
         },
      ],
   },
   {
      id: 'analytics',
      name: 'Analytics',
      icon: BarChart3,
      description: 'Analytics và reporting',
      components: [
         {
            id: 'analytics-chart-demo',
            name: 'Analytics Chart',
            description: 'Data visualization',
            path: '/demo/analytics-chart-demo',
            icon: BarChart3,
         },
      ],
   },
   {
      id: 'ui',
      name: 'UI Components',
      icon: Layout,
      description: 'Basic UI components',
      components: [
         {
            id: 'ui-components-demo',
            name: 'UI Components',
            description: 'Basic UI elements',
            path: '/demo/ui-components-demo',
            icon: Layout,
         },
      ],
   },
];

interface DemoLayoutProps {
   children: React.ReactNode;
}

export default function DemoLayout({ children }: DemoLayoutProps) {
   const [sidebarOpen, setSidebarOpen] = useState(true);
   const pathname = usePathname();

   const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

   return (
      <div className="h-svh overflow-hidden lg:p-2 w-full">
         <div className="lg:border lg:rounded-md overflow-hidden flex flex-col items-center justify-start bg-container h-full w-full">
            {/* Header */}
            <div className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
               <div className="flex h-14 items-center px-4">
                  <div className="flex items-center gap-2">
                     <Link href="/demo" className="flex items-center gap-2 hover:opacity-80">
                        <Home className="h-5 w-5" />
                        <span className="font-semibold">Demo Components</span>
                     </Link>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                     <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleSidebar}
                        className="lg:hidden"
                     >
                        {sidebarOpen ? (
                           <ChevronLeft className="h-4 w-4" />
                        ) : (
                           <ChevronRight className="h-4 w-4" />
                        )}
                     </Button>
                  </div>
               </div>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-1 w-full overflow-hidden">
               {/* Sidebar */}
               <div
                  className={`${sidebarOpen ? 'w-80' : 'w-16'} bg-background border-r transition-all duration-300 flex-shrink-0`}
               >
                  <div className="flex flex-col h-full">
                     {/* Navigation */}
                     <ScrollArea className="flex-1 p-4">
                        <div className="space-y-6">
                           {demoModules.map((module) => (
                              <div key={module.id}>
                                 {/* Module Header */}
                                 <div className="flex items-center gap-2 mb-3">
                                    <module.icon className="h-5 w-5 text-primary" />
                                    {sidebarOpen && (
                                       <div>
                                          <h3 className="font-semibold text-foreground">
                                             {module.name}
                                          </h3>
                                          <p className="text-xs text-muted-foreground">
                                             {module.description}
                                          </p>
                                       </div>
                                    )}
                                 </div>

                                 {/* Module Components */}
                                 <div className="space-y-1">
                                    {module.components.map((component) => {
                                       const isActive = pathname === component.path;
                                       return (
                                          <Link key={component.id} href={component.path}>
                                             <div
                                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                                                   isActive
                                                      ? 'bg-primary/10 text-primary border border-primary/20'
                                                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                                }`}
                                             >
                                                <component.icon className="h-4 w-4" />
                                                {sidebarOpen && (
                                                   <div className="flex-1 min-w-0">
                                                      <div className="font-medium truncate">
                                                         {component.name}
                                                      </div>
                                                      <div className="text-xs text-muted-foreground truncate">
                                                         {component.description}
                                                      </div>
                                                   </div>
                                                )}
                                             </div>
                                          </Link>
                                       );
                                    })}
                                 </div>

                                 <Separator className="mt-4" />
                              </div>
                           ))}
                        </div>
                     </ScrollArea>

                     {/* Footer */}
                     {sidebarOpen && (
                        <div className="p-4 border-t">
                           <div className="text-xs text-muted-foreground text-center">
                              AiM Platform Demo
                           </div>
                        </div>
                     )}
                  </div>
               </div>

               {/* Main Content */}
               <div className="flex-1 overflow-auto">{children}</div>
            </div>
         </div>
      </div>
   );
}
