import React from 'react';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface HeaderProps {
   title: string;
   children?: React.ReactNode;
}

export function Header({ title, children }: HeaderProps) {
   return (
      <div className="flex h-14 items-center justify-between px-4 py-2">
         <div className="flex items-center gap-2">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-sm font-medium">{title}</h1>
         </div>
         <div className="flex items-center gap-2">{children}</div>
      </div>
   );
}
