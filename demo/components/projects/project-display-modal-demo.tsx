'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProjectDisplayModal, ProjectDisplaySettings, ViewType } from './project-display-modal';

export function ProjectDisplayModalDemo() {
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [currentSettings, setCurrentSettings] = useState<ProjectDisplaySettings>({
      viewType: ViewType.List,
      grouping: {
         primaryGrouping: 'status',
         subGrouping: 'none',
         ordering: 'sortOrder',
      },
      visibility: {
         showClosedProjects: 'all',
      },
      display: {
         showEmptyGroups: true,
         displayProperties: [
            'Milestones',
            'Priority',
            'Status',
            'Health',
            'Dependencies',
            'Labels',
         ],
      },
   });

   const [settingsHistory, setSettingsHistory] = useState<ProjectDisplaySettings[]>([]);

   const handleSettingsChange = (newSettings: ProjectDisplaySettings) => {
      setCurrentSettings(newSettings);
      // Add to history for demo purposes
      setSettingsHistory((prev) => [newSettings, ...prev.slice(0, 4)]);
   };

   const handleReset = () => {
      const defaultSettings: ProjectDisplaySettings = {
         viewType: ViewType.List,
         grouping: {
            primaryGrouping: 'status',
            subGrouping: 'none',
            ordering: 'sortOrder',
         },
         visibility: {
            showClosedProjects: 'all',
         },
         display: {
            showEmptyGroups: true,
            displayProperties: [
               'Milestones',
               'Priority',
               'Status',
               'Health',
               'Dependencies',
               'Labels',
            ],
         },
      };
      setCurrentSettings(defaultSettings);
      setSettingsHistory([]);
   };

   const handleSetDefault = () => {
      // In a real app, this would save to backend
      console.log('Settings saved as default for everyone:', currentSettings);
      alert('Settings saved as default for everyone!');
   };

   const openModal = () => setIsModalOpen(true);
   const closeModal = () => setIsModalOpen(false);

   // Helper function to get view icon
   const getViewIcon = (view: ViewType) => {
      switch (view) {
         case ViewType.List:
            return '☰☰☰';
         case ViewType.Board:
            return '███';
         case ViewType.Timeline:
            return '──●──●──';
         default:
            return '☰☰☰';
      }
   };

   // Helper function to get grouping icon
   const getGroupingIcon = (type: string) => {
      switch (type) {
         case 'lead':
         case 'member':
            return '👥';
         case 'status':
            return '📊';
         case 'priority':
            return '⚠️';
         case 'label':
            return '🏷️';
         case 'team':
            return '👥';
         case 'health':
            return '✅';
         case 'startDate':
         case 'targetDate':
            return '📅';
         default:
            return '📋';
      }
   };

   return (
      <div className="container mx-auto p-6 space-y-8">
         {/* Header */}
         <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
               Project Display Modal Demo
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
               Interactive demo of the ProjectDisplayModal component with real-time settings updates
               and configuration options.
            </p>
         </div>

         {/* Demo Controls */}
         <Card>
            <CardHeader>
               <CardTitle>Demo Controls</CardTitle>
               <CardDescription>
                  Click the button below to open the display settings modal
               </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <Button onClick={openModal} size="lg" className="w-full md:w-auto">
                  Open Display Settings Modal
               </Button>

               <div className="flex flex-wrap gap-2">
                  <Button
                     variant="outline"
                     onClick={() =>
                        setCurrentSettings((prev) => ({ ...prev, viewType: ViewType.List }))
                     }
                  >
                     Set List View
                  </Button>
                  <Button
                     variant="outline"
                     onClick={() =>
                        setCurrentSettings((prev) => ({ ...prev, viewType: ViewType.Board }))
                     }
                  >
                     Set Board View
                  </Button>
                  <Button
                     variant="outline"
                     onClick={() =>
                        setCurrentSettings((prev) => ({ ...prev, viewType: ViewType.Timeline }))
                     }
                  >
                     Set Timeline View
                  </Button>
               </div>
            </CardContent>
         </Card>

         {/* Current Settings Display */}
         <Card>
            <CardHeader>
               <CardTitle>Current Settings</CardTitle>
               <CardDescription>Real-time display of current modal settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
               {/* View Type */}
               <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                     View Type
                  </h3>
                  <div className="flex items-center space-x-2">
                     <Badge variant="default" className="text-lg px-4 py-2">
                        {getViewIcon(currentSettings.viewType)} {currentSettings.viewType}
                     </Badge>
                  </div>
               </div>

               {/* Grouping Settings */}
               <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                     Grouping Settings
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div className="flex items-center space-x-2">
                        <span className="text-2xl">
                           {getGroupingIcon(currentSettings.grouping.primaryGrouping)}
                        </span>
                        <div>
                           <p className="text-sm font-medium">Primary</p>
                           <p className="text-sm text-gray-600 dark:text-gray-400">
                              {currentSettings.grouping.primaryGrouping === 'none'
                                 ? 'No grouping'
                                 : currentSettings.grouping.primaryGrouping}
                           </p>
                        </div>
                     </div>
                     <div className="flex items-center space-x-2">
                        <span className="text-2xl">
                           {getGroupingIcon(currentSettings.grouping.subGrouping)}
                        </span>
                        <div>
                           <p className="text-sm font-medium">Sub-grouping</p>
                           <p className="text-sm text-gray-600 dark:text-gray-400">
                              {currentSettings.grouping.subGrouping === 'none'
                                 ? 'No grouping'
                                 : currentSettings.grouping.subGrouping}
                           </p>
                        </div>
                     </div>
                     <div className="flex items-center space-x-2">
                        <span className="text-2xl">↕️</span>
                        <div>
                           <p className="text-sm font-medium">Ordering</p>
                           <p className="text-sm text-gray-600 dark:text-gray-400">
                              {currentSettings.grouping.ordering === 'sortOrder'
                                 ? 'Manual'
                                 : currentSettings.grouping.ordering}
                           </p>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Visibility Settings */}
               <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                     Project Visibility
                  </h3>
                  <Badge variant="secondary">
                     Show closed Projects: {currentSettings.visibility.showClosedProjects}
                  </Badge>
               </div>

               {/* Display Options */}
               <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                     Display Options
                  </h3>
                  <div className="space-y-3">
                     <div className="flex items-center space-x-2">
                        <span className="text-sm">Show empty groups:</span>
                        <Badge
                           variant={
                              currentSettings.display.showEmptyGroups ? 'default' : 'secondary'
                           }
                        >
                           {currentSettings.display.showEmptyGroups ? 'ON' : 'OFF'}
                        </Badge>
                     </div>
                     <div>
                        <p className="text-sm mb-2">Display properties:</p>
                        <div className="flex flex-wrap gap-2">
                           {currentSettings.display.displayProperties.map((property) => (
                              <Badge key={property} variant="default" className="text-xs">
                                 {property}
                              </Badge>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            </CardContent>
         </Card>

         {/* Settings History */}
         {settingsHistory.length > 0 && (
            <Card>
               <CardHeader>
                  <CardTitle>Settings History</CardTitle>
                  <CardDescription>Recent changes to display settings (last 5)</CardDescription>
               </CardHeader>
               <CardContent>
                  <div className="space-y-3">
                     {settingsHistory.map((settings, index) => (
                        <div
                           key={index}
                           className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        >
                           <Badge variant="outline">{index + 1}</Badge>
                           <div className="flex-1">
                              <p className="text-sm font-medium">
                                 {settings.viewType} view • {settings.grouping.primaryGrouping}{' '}
                                 grouping
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                 {settings.display.displayProperties.length} properties • Empty
                                 groups: {settings.display.showEmptyGroups ? 'ON' : 'OFF'}
                              </p>
                           </div>
                           <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setCurrentSettings(settings)}
                           >
                              Restore
                           </Button>
                        </div>
                     ))}
                  </div>
               </CardContent>
            </Card>
         )}

         {/* Component Information */}
         <Card>
            <CardHeader>
               <CardTitle>Component Information</CardTitle>
               <CardDescription>
                  Technical details about the ProjectDisplayModal component
               </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                     <h4 className="font-medium mb-2">Features</h4>
                     <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        <li>• Three view modes: List, Board, Timeline</li>
                        <li>• Configurable grouping and ordering</li>
                        <li>• Project visibility controls</li>
                        <li>• Display property selection</li>
                        <li>• Settings persistence</li>
                        <li>• Full keyboard navigation</li>
                     </ul>
                  </div>
                  <div>
                     <h4 className="font-medium mb-2">Accessibility</h4>
                     <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        <li>• WCAG 2.1 AA compliant</li>
                        <li>• ARIA labels and descriptions</li>
                        <li>• Keyboard navigation support</li>
                        <li>• Screen reader friendly</li>
                        <li>• High contrast support</li>
                        <li>• Focus management</li>
                     </ul>
                  </div>
               </div>

               <div>
                  <h4 className="font-medium mb-2">Usage</h4>
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                     <code className="text-sm text-gray-800 dark:text-gray-200">
                        {`<ProjectDisplayModal
  settings={displaySettings}
  onSettingsChange={handleSettingsChange}
  onReset={handleReset}
  onSetDefault={handleSetDefault}
  isOpen={isModalOpen}
  onClose={handleClose}
/>`}
                     </code>
                  </div>
               </div>
            </CardContent>
         </Card>

         {/* Modal Component */}
         <ProjectDisplayModal
            settings={currentSettings}
            onSettingsChange={handleSettingsChange}
            onReset={handleReset}
            onSetDefault={handleSetDefault}
            isOpen={isModalOpen}
            onClose={closeModal}
         />
      </div>
   );
}
