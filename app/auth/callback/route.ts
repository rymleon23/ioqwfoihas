import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
   const { searchParams, origin } = new URL(request.url);
   const code = searchParams.get('code');
   const next = searchParams.get('next') ?? '/';

   if (code) {
      const supabase = await createClient();
      const { error, data } = await supabase.auth.exchangeCodeForSession(code);
      if (!error && data.user) {
         // Check if user has workspace
         const { data: userProfile } = await supabase
            .from('users')
            .select('workspace_id')
            .eq('id', data.user.id)
            .single();

         // Determine redirect URL
         let redirectPath = next;
         if (next === '/') {
            // If default redirect, check workspace
            if (userProfile?.workspace_id) {
               redirectPath = `/${userProfile.workspace_id}`;
            } else {
               redirectPath = '/onboarding';
            }
         }

         const forwardedHost = request.headers.get('x-forwarded-host'); // original origin before load balancer
         const isLocalEnv = process.env.NODE_ENV === 'development';
         if (isLocalEnv) {
            // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
            return NextResponse.redirect(`${origin}${redirectPath}`);
         } else if (forwardedHost) {
            return NextResponse.redirect(`https://${forwardedHost}${redirectPath}`);
         } else {
            return NextResponse.redirect(`${origin}${redirectPath}`);
         }
      } else {
         console.error('Auth code exchange error:', error);
      }
   }

   // return the user to an error page with instructions
   return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
