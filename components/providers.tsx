'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { useState } from 'react';
import { Toaster } from '@/components/ui/sonner';

export function Providers({ children }: { children: React.ReactNode }) {
   const [queryClient] = useState(
      () =>
         new QueryClient({
            defaultOptions: {
               queries: {
                  staleTime: 60 * 1000, // 1 minute
               },
            },
         })
   );

   return (
      <QueryClientProvider client={queryClient}>
         <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem>
            {children}
            <Toaster />
         </NextThemesProvider>
         <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
   );
}
