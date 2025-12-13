'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SignupPage() {
   const [loading, setLoading] = useState(false);
   const router = useRouter();

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);

      // TODO: Implement signup logic
      console.log('Signup form submitted');

      setLoading(false);
   };

   return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
         <Card className="w-full max-w-md">
            <CardHeader>
               <CardTitle>Create Account</CardTitle>
               <CardDescription>Enter your information to create an account</CardDescription>
            </CardHeader>
            <CardContent>
               <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                     <Label htmlFor="name">Name</Label>
                     <Input id="name" type="text" required />
                  </div>
                  <div className="space-y-2">
                     <Label htmlFor="email">Email</Label>
                     <Input id="email" type="email" required />
                  </div>
                  <div className="space-y-2">
                     <Label htmlFor="password">Password</Label>
                     <Input id="password" type="password" required />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                     {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>
               </form>
            </CardContent>
         </Card>
      </div>
   );
}
