'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
   List,
   Grid3X3,
   // Timeline, // Not available in lucide-react
   BarChart3,
   Layers,
   ArrowUpDown,
   Calendar,
   Users,
   Tag,
   Target,
   Clock,
   CheckCircle,
   FileText,
   AlertTriangle,
} from 'lucide-react';

// Types
export enum ViewType {
   List = 'List',
   Board = 'Board',
   Timeline = 'Timeline',
}

export type GroupingOption =
   | 'none'
   | 'lead'
   | 'member'
   | 'status'
   | 'priority'
   | 'label'
   | 'team'
   | 'health'
   | 'startDate'
   | 'targetDate';

export type ClosedProjectsOption = 'none' | 'week' | 'month' | '3months' | '6months' | 'all';

export type DisplayProperty =
   | 'Milestones'
   | 'Priority'
   | 'Status'
   | 'Health'
   | 'Dependencies'
   | 'Labels';

export interface GroupingControls {
   primaryGrouping: GroupingOption;
   subGrouping: GroupingOption;
   ordering:
      | 'sortOrder'
      | 'name'
      | 'status'
      | 'priority'
      | 'updatedAt'
      | 'createdAt'
      | 'healthUpdatedAt'
      | 'startDate'
      | 'targetDate';
}

export interface ProjectVisibility {
   showClosedProjects: ClosedProjectsOption;
}

export interface DisplayOptions {
   showEmptyGroups: boolean;
   displayProperties: DisplayProperty[];
}

export interface ProjectDisplaySettings {
   viewType: ViewType;
   grouping: GroupingControls;
   visibility: ProjectVisibility;
   display: DisplayOptions;
}

export interface ProjectDisplayModalProps {
   settings: ProjectDisplaySettings;
   onSettingsChange: (settings: ProjectDisplaySettings) => void;
   onReset: () => void;
   onSetDefault: () => void;
   isOpen: boolean;
   onClose: () => void;
}

// Default settings
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
      displayProperties: ['Milestones', 'Priority', 'Status', 'Health', 'Dependencies', 'Labels'],
   },
};

// Available display properties
const allDisplayProperties: DisplayProperty[] = [
   'Milestones',
   'Priority',
   'Status',
   'Health',
   'Dependencies',
   'Labels',
];

// Grouping options
const groupingOptions = [
   { value: 'none', label: 'No grouping' },
   { value: 'lead', label: 'Lead' },
   { value: 'member', label: 'Member' },
   { value: 'status', label: 'Status' },
   { value: 'priority', label: 'Priority' },
   { value: 'label', label: 'Label' },
   { value: 'team', label: 'Team' },
   { value: 'health', label: 'Health' },
   { value: 'startDate', label: 'Start date' },
   { value: 'targetDate', label: 'Target date' },
];

// Ordering options
const orderingOptions = [
   { value: 'sortOrder', label: 'Manual' },
   { value: 'name', label: 'Name' },
   { value: 'status', label: 'Status' },
   { value: 'priority', label: 'Priority' },
   { value: 'updatedAt', label: 'Updated' },
   { value: 'createdAt', label: 'Created' },
   { value: 'healthUpdatedAt', label: 'Health updated' },
   { value: 'startDate', label: 'Start date' },
   { value: 'targetDate', label: 'Target date' },
];

// Closed Projects options
const closedProjectsOptions = [
   { value: 'none', label: 'None' },
   { value: 'week', label: 'Past week' },
   { value: 'month', label: 'Past month' },
   { value: '3months', label: 'Past 3 months' },
   { value: '6months', label: 'Past 6 months' },
   { value: 'all', label: 'All' },
];

export function ProjectDisplayModal({
   settings,
   onSettingsChange,
   onReset,
   onSetDefault,
   isOpen,
   onClose,
}: ProjectDisplayModalProps) {
   const [localSettings, setLocalSettings] = useState<ProjectDisplaySettings>(settings);

   // Update local settings when props change
   useEffect(() => {
      setLocalSettings(settings);
   }, [settings]);

   // Handle view type change
   const handleViewChange = (view: ViewType) => {
      const newSettings = { ...localSettings, viewType: view };
      setLocalSettings(newSettings);
      onSettingsChange(newSettings);
   };

   // Handle grouping change
   const handleGroupingChange = (field: keyof GroupingControls, value: string) => {
      const newSettings = {
         ...localSettings,
         grouping: {
            ...localSettings.grouping,
            [field]: value,
         },
      };
      setLocalSettings(newSettings);
      onSettingsChange(newSettings);
   };

   // Handle visibility change
   const handleVisibilityChange = (value: string) => {
      const newSettings = {
         ...localSettings,
         visibility: {
            ...localSettings.visibility,
            showClosedProjects: value as ClosedProjectsOption,
         },
      };
      setLocalSettings(newSettings);
      onSettingsChange(newSettings);
   };

   // Handle empty groups toggle
   const handleEmptyGroupsToggle = (checked: boolean) => {
      const newSettings = {
         ...localSettings,
         display: {
            ...localSettings.display,
            showEmptyGroups: checked,
         },
      };
      setLocalSettings(newSettings);
      onSettingsChange(newSettings);
   };

   // Handle display property toggle
   const handlePropertyToggle = (property: DisplayProperty) => {
      const currentProperties = localSettings.display.displayProperties;
      const newProperties = currentProperties.includes(property)
         ? currentProperties.filter((p) => p !== property)
         : [...currentProperties, property];

      const newSettings = {
         ...localSettings,
         display: {
            ...localSettings.display,
            displayProperties: newProperties,
         },
      };
      setLocalSettings(newSettings);
      onSettingsChange(newSettings);
   };

   // Handle reset
   const handleReset = () => {
      setLocalSettings(defaultSettings);
      onReset();
   };

   // Handle set default
   const handleSetDefault = () => {
      onSetDefault();
   };

   // Get view icon
   const getViewIcon = (view: ViewType) => {
      switch (view) {
         case ViewType.List:
            return <List className="w-4 h-4" />;
         case ViewType.Board:
            return <Grid3X3 className="w-4 h-4" />;
         case ViewType.Timeline:
            return <BarChart3 className="w-4 h-4" />;
         default:
            return <List className="w-4 h-4" />;
      }
   };

   // Get grouping icon
   const getGroupingIcon = (type: string) => {
      switch (type) {
         case 'lead':
         case 'member':
            return <Users className="w-4 h-4" />;
         case 'status':
            return <BarChart3 className="w-4 h-4" />;
         case 'priority':
            return <AlertTriangle className="w-4 h-4" />;
         case 'label':
            return <Tag className="w-4 h-4" />;
         case 'team':
            return <Users className="w-4 h-4" />;
         case 'health':
            return <CheckCircle className="w-4 h-4" />;
         case 'startDate':
         case 'targetDate':
            return <Calendar className="w-4 h-4" />;
         default:
            return <Layers className="w-4 h-4" />;
      }
   };

   if (!isOpen) return null;

   return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
         {/* Backdrop */}
         <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

         {/* Modal */}
         <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
               <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Display Settings
               </h2>
               <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close modal">
                  ✕
               </Button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
               {/* View Selection */}
               <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                     View Type
                  </Label>
                  <div className="flex space-x-2">
                     {Object.values(ViewType).map((view) => (
                        <Button
                           key={view}
                           variant={localSettings.viewType === view ? 'default' : 'outline'}
                           size="sm"
                           onClick={() => handleViewChange(view)}
                           className="flex items-center space-x-2"
                           aria-label={`Switch to ${view} view`}
                           aria-pressed={localSettings.viewType === view}
                        >
                           {getViewIcon(view)}
                           <span>{view}</span>
                        </Button>
                     ))}
                  </div>
               </div>

               <Separator />

               {/* Grouping Controls */}
               <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     {/* Primary Grouping */}
                     <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-2">
                           {getGroupingIcon(localSettings.grouping.primaryGrouping)}
                           <span>Grouping</span>
                        </Label>
                        <Select
                           value={localSettings.grouping.primaryGrouping}
                           onValueChange={(value) => handleGroupingChange('primaryGrouping', value)}
                        >
                           <SelectTrigger>
                              <SelectValue />
                           </SelectTrigger>
                           <SelectContent>
                              {groupingOptions.map((option) => (
                                 <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                 </SelectItem>
                              ))}
                           </SelectContent>
                        </Select>
                     </div>

                     {/* Sub-grouping */}
                     <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-2">
                           <Layers className="w-4 h-4" />
                           <span>Sub-grouping</span>
                        </Label>
                        <Select
                           value={localSettings.grouping.subGrouping}
                           onValueChange={(value) => handleGroupingChange('subGrouping', value)}
                        >
                           <SelectTrigger>
                              <SelectValue />
                           </SelectTrigger>
                           <SelectContent>
                              {groupingOptions.map((option) => (
                                 <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                 </SelectItem>
                              ))}
                           </SelectContent>
                        </Select>
                     </div>

                     {/* Ordering */}
                     <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center space-x-2">
                           <ArrowUpDown className="w-4 h-4" />
                           <span>Ordering</span>
                        </Label>
                        <Select
                           value={localSettings.grouping.ordering}
                           onValueChange={(value) => handleGroupingChange('ordering', value)}
                        >
                           <SelectTrigger>
                              <SelectValue />
                           </SelectTrigger>
                           <SelectContent>
                              {orderingOptions.map((option) => (
                                 <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                 </SelectItem>
                              ))}
                           </SelectContent>
                        </Select>
                     </div>
                  </div>
               </div>

               <Separator />

               {/* Project Visibility */}
               <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                     Show closed Projects
                  </Label>
                  <Select
                     value={localSettings.visibility.showClosedProjects}
                     onValueChange={handleVisibilityChange}
                  >
                     <SelectTrigger>
                        <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                        {closedProjectsOptions.map((option) => (
                           <SelectItem key={option.value} value={option.value}>
                              {option.label}
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>
               </div>

               <Separator />

               {/* List Options */}
               <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                     List options
                  </h3>

                  {/* Show Empty Groups */}
                  <div className="flex items-center justify-between">
                     <Label
                        htmlFor="empty-groups"
                        className="text-sm text-gray-700 dark:text-gray-300"
                     >
                        Show empty groups
                     </Label>
                     <Switch
                        id="empty-groups"
                        checked={localSettings.display.showEmptyGroups}
                        onCheckedChange={handleEmptyGroupsToggle}
                     />
                  </div>

                  {/* Display Properties */}
                  <div className="space-y-3">
                     <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Display properties
                     </Label>
                     <div className="flex flex-wrap gap-2">
                        {allDisplayProperties.map((property) => {
                           const isSelected =
                              localSettings.display.displayProperties.includes(property);
                           return (
                              <Badge
                                 key={property}
                                 variant={isSelected ? 'default' : 'secondary'}
                                 className={`cursor-pointer transition-colors ${
                                    isSelected
                                       ? 'bg-blue-600 hover:bg-blue-700'
                                       : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'
                                 }`}
                                 onClick={() => handlePropertyToggle(property)}
                                 role="button"
                                 tabIndex={0}
                                 aria-label={`${isSelected ? 'Remove' : 'Add'} ${property} property`}
                                 onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                       e.preventDefault();
                                       handlePropertyToggle(property);
                                    }
                                 }}
                              >
                                 {property}
                              </Badge>
                           );
                        })}
                     </div>
                  </div>
               </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
               <Button variant="outline" onClick={handleReset} aria-label="Reset to view default">
                  Reset
               </Button>
               <Button onClick={handleSetDefault} aria-label="Save as default for view">
                  Set default for everyone
               </Button>
            </div>
         </div>
      </div>
   );
}
