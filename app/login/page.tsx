'use client';
// v1.1.0 - Auth features with Password, Register, Onboarding

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [isLoading, setIsLoading] = useState(false);
   const [isGoogleLoading, setIsGoogleLoading] = useState(false);
   const supabase = createClient();
   const router = useRouter();

   const handleEmailLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);

      try {
         const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
               emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
         });

         if (error) {
            toast.error('Error sending magic link', {
               description: error.message,
            });
         } else {
            toast.success('Magic link sent!', {
               description: 'Check your email for the login link.',
            });
         }
      } catch {
         toast.error('Something went wrong. Please try again.');
      } finally {
         setIsLoading(false);
      }
   };

   const handlePasswordLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);

      try {
         const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
         });

         if (error) {
            toast.error('Error signing in', {
               description: error.message,
            });
            return;
         }

         // Check if user has workspace
         const { data: userProfile } = await supabase
            .from('users')
            .select('workspace_id')
            .eq('id', data.user.id)
            .single();

         toast.success('Signed in successfully');

         if (userProfile?.workspace_id) {
            // User has workspace, redirect to workspace (auto-redirects to team)
            router.push(`/${userProfile.workspace_id}`);
         } else {
            // User doesn't have workspace, go to onboarding
            router.push('/onboarding');
         }
      } catch {
         toast.error('Something went wrong. Please try again.');
      } finally {
         setIsLoading(false);
      }
   };

   const handleGoogleLogin = async () => {
      setIsGoogleLoading(true);
      try {
         const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
               redirectTo: `${window.location.origin}/auth/callback`,
            },
         });

         if (error) {
            toast.error('Error signing in with Google', {
               description: error.message,
            });
         }
      } catch {
         toast.error('Something went wrong. Please try again.');
      } finally {
         setIsGoogleLoading(false);
      }
   };

   return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
         <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-sm space-y-8"
         >
            <div className="flex flex-col items-center space-y-2 text-center">
               <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <svg
                     xmlns="http://www.w3.org/2000/svg"
                     viewBox="0 0 24 24"
                     fill="none"
                     stroke="currentColor"
                     strokeWidth="2"
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     className="h-6 w-6"
                  >
                     <circle cx="12" cy="12" r="10" />
                     <circle cx="12" cy="12" r="4" />
                  </svg>
               </div>
               <h1 className="text-2xl font-semibold tracking-tight">Welcome to AiM</h1>
               <p className="text-sm text-muted-foreground">
                  Sign in to your account to continue
               </p>
            </div>

            <Tabs defaultValue="magic-link" className="w-full">
               <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="magic-link">Magic Link</TabsTrigger>
                  <TabsTrigger value="password">Password</TabsTrigger>
               </TabsList>

               <TabsContent value="magic-link">
                  <form onSubmit={handleEmailLogin}>
                     <div className="grid gap-4">
                        <div className="grid gap-2">
                           <Label htmlFor="email-magic">Email</Label>
                           <Input
                              id="email-magic"
                              placeholder="name@example.com"
                              type="email"
                              autoCapitalize="none"
                              autoComplete="email"
                              autoCorrect="off"
                              disabled={isLoading || isGoogleLoading}
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="h-11 bg-background"
                              required
                           />
                        </div>
                        <Button disabled={isLoading || isGoogleLoading} className="h-11">
                           {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                           Send Magic Link
                        </Button>
                     </div>
                  </form>
               </TabsContent>

               <TabsContent value="password">
                  <form onSubmit={handlePasswordLogin}>
                     <div className="grid gap-4">
                        <div className="grid gap-2">
                           <Label htmlFor="email-password">Email</Label>
                           <Input
                              id="email-password"
                              placeholder="name@example.com"
                              type="email"
                              autoCapitalize="none"
                              autoComplete="email"
                              autoCorrect="off"
                              disabled={isLoading || isGoogleLoading}
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="h-11 bg-background"
                              required
                           />
                        </div>
                        <div className="grid gap-2">
                           <div className="flex items-center justify-between">
                              <Label htmlFor="password">Password</Label>
                              <Link
                                 href="/forgot-password"
                                 className="text-xs text-muted-foreground underline-offset-4 hover:underline"
                              >
                                 Forgot password?
                              </Link>
                           </div>
                           <Input
                              id="password"
                              placeholder="••••••••"
                              type="password"
                              autoComplete="current-password"
                              disabled={isLoading || isGoogleLoading}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="h-11 bg-background"
                              required
                           />
                        </div>
                        <Button disabled={isLoading || isGoogleLoading} className="h-11">
                           {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                           Sign In
                        </Button>
                     </div>
                  </form>
               </TabsContent>
            </Tabs>

            <div className="relative">
               <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
               </div>
               <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
               </div>
            </div>

            <Button
               variant="outline"
               type="button"
               disabled={isLoading || isGoogleLoading}
               onClick={handleGoogleLogin}
               className="h-11 w-full"
            >
               {isGoogleLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
               ) : (
                  <svg
                     className="mr-2 h-4 w-4"
                     aria-hidden="true"
                     focusable="false"
                     data-prefix="fab"
                     data-icon="google"
                     role="img"
                     xmlns="http://www.w3.org/2000/svg"
                     viewBox="0 0 488 512"
                  >
                     <path
                        fill="currentColor"
                        d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                     ></path>
                  </svg>
               )}
               Google
            </Button>

            <p className="px-8 text-center text-sm text-muted-foreground">
               Don&apos;t have an account?{' '}
               <Link href="/register" className="underline underline-offset-4 hover:text-primary">
                  Sign up
               </Link>
            </p>

            <p className="px-8 text-center text-sm text-muted-foreground">
               By clicking continue, you agree to our{' '}
               <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
                  Terms of Service
               </Link>{' '}
               and{' '}
               <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
                  Privacy Policy
               </Link>
               .
            </p>
         </motion.div>
      </div>
   );
}
