'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';

export function ScheduleWidget() {
   return (
      <Card className="h-full border-dashed">
         <CardHeader>
            <CardTitle className="flex items-center gap-2">
               <Calendar className="h-5 w-5" />
               Content Schedule
            </CardTitle>
            <CardDescription>Upcoming posts and content</CardDescription>
         </CardHeader>
         <CardContent>
            <div className="flex h-[200px] items-center justify-center text-muted-foreground">
               <div className="text-center">
                  <p>No posts scheduled</p>
                  <p className="text-sm">Create your first post in the Marketing section</p>
               </div>
            </div>
         </CardContent>
      </Card>
   );
}
