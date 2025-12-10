'use client';

import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
   Calendar as CalendarIcon,
   Clock,
   MoreHorizontal,
   Instagram,
   Linkedin,
   Facebook,
   Plus,
} from 'lucide-react';
import { format, addDays, startOfWeek } from 'date-fns';

export function SocialScheduler() {
   // Mock data for initial visualization
   const [posts] = React.useState([
      {
         id: '1',
         content: 'Excited to announce our new feature launch! 🚀 #product #launch',
         platform: 'twitter',
         scheduledAt: addDays(new Date(), 1),
         status: 'scheduled',
      },
      {
         id: '2',
         content: 'Behind the scenes at our team retreat.',
         platform: 'instagram',
         scheduledAt: addDays(new Date(), 2),
         status: 'draft',
      },
      {
         id: '3',
         content: 'Q3 Report: Growth is up by 20%. Read the full analysis here.',
         platform: 'linkedin',
         scheduledAt: addDays(new Date(), 0),
         status: 'published',
      },
   ]);

   const PlatformIcon = ({ platform }: { platform: string }) => {
      switch (platform) {
         case 'instagram':
            return <Instagram className="h-4 w-4" />;
         case 'linkedin':
            return <Linkedin className="h-4 w-4" />;
         default:
            return <div className="h-4 w-4 font-bold text-xs">X</div>;
      }
   };

   const StatusBadge = ({ status }: { status: string }) => {
      switch (status) {
         case 'published':
            return (
               <Badge variant="default" className="bg-green-600">
                  Published
               </Badge>
            );
         case 'scheduled':
            return (
               <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                  Scheduled
               </Badge>
            );
         default:
            return <Badge variant="outline">Draft</Badge>;
      }
   };

   return (
      <div className="h-full flex flex-col space-y-6">
         <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Social Scheduler</h2>
            <div className="flex gap-2">
               <Button variant="outline">Connect Account</Button>
               <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Post
               </Button>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Scheduled Posts</CardTitle>
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">+2 from last week</p>
               </CardContent>
            </Card>
            <Card>
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Published (This Week)</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-xs text-muted-foreground">98% success rate</p>
               </CardContent>
            </Card>
            <Card>
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Engagement</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold">1.2k</div>
                  <p className="text-xs text-muted-foreground">+15% vs last week</p>
               </CardContent>
            </Card>
         </div>

         <div className="rounded-md border bg-card">
            <div className="p-4 border-b">
               <h3 className="font-semibold">Timeline</h3>
            </div>
            <ScrollArea className="h-[500px] p-4">
               <div className="space-y-4">
                  {posts.map((post) => (
                     <div
                        key={post.id}
                        className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                     >
                        <div className="flex flex-col items-center gap-1 min-w-[60px]">
                           <span className="text-sm font-bold">
                              {format(post.scheduledAt, 'MMM d')}
                           </span>
                           <span className="text-xs text-muted-foreground">
                              {format(post.scheduledAt, 'HH:mm')}
                           </span>
                        </div>

                        <div className="flex-1 space-y-2">
                           <div className="flex items-center gap-2">
                              <Badge variant="outline" className="gap-1 px-2 py-0.5">
                                 <PlatformIcon platform={post.platform} />
                                 <span className="capitalize">{post.platform}</span>
                              </Badge>
                              <StatusBadge status={post.status} />
                           </div>
                           <p className="text-sm">{post.content}</p>
                        </div>

                        <Button variant="ghost" size="icon">
                           <MoreHorizontal className="h-4 w-4" />
                        </Button>
                     </div>
                  ))}
               </div>
            </ScrollArea>
         </div>
      </div>
   );
}

function CheckCircle(props: any) {
   return (
      <svg
         {...props}
         xmlns="http://www.w3.org/2000/svg"
         width="24"
         height="24"
         viewBox="0 0 24 24"
         fill="none"
         stroke="currentColor"
         strokeWidth="2"
         strokeLinecap="round"
         strokeLinejoin="round"
      >
         <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
         <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
   );
}

function Activity(props: any) {
   return (
      <svg
         {...props}
         xmlns="http://www.w3.org/2000/svg"
         width="24"
         height="24"
         viewBox="0 0 24 24"
         fill="none"
         stroke="currentColor"
         strokeWidth="2"
         strokeLinecap="round"
         strokeLinejoin="round"
      >
         <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
   );
}
