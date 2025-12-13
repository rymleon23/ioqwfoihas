'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestPage() {
   const [count, setCount] = useState(0);

   return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
         <Card className="w-full max-w-md">
            <CardHeader>
               <CardTitle>Test Page</CardTitle>
               <CardDescription>This is a test page for development purposes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="text-center">
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-muted-foreground">Click count</p>
               </div>
               <Button onClick={() => setCount(count + 1)} className="w-full">
                  Increment
               </Button>
            </CardContent>
         </Card>
      </div>
   );
}
