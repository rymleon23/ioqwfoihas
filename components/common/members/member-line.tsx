'use client';

import { User } from '@/hooks/use-users';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface MemberLineProps {
   user: User;
}

export default function MemberLine({ user }: MemberLineProps) {
   return (
      <div className="w-full flex items-center py-3 px-6 border-b hover:bg-sidebar/50 border-muted-foreground/5 text-sm">
         <div className="w-[70%] md:w-[60%] lg:w-[55%] flex items-center gap-2">
            <Avatar className="size-6">
               <AvatarImage src={user.avatar_url || ''} />
               <AvatarFallback className="text-xs">{user.display_name?.[0] || '?'}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
               <span className="font-medium truncate">{user.display_name}</span>
               <span className="text-xs text-muted-foreground">{user.email}</span>
            </div>
         </div>
         <div className="w-[30%] md:w-[20%] lg:w-[15%]">
            <Badge variant="secondary" className="capitalize font-normal text-xs">
               {user.status}
            </Badge>
         </div>
         <div className="hidden lg:block w-[15%] text-xs text-muted-foreground">
            -
         </div>
         <div className="w-[30%] hidden md:block md:w-[20%] lg:w-[15%]">
            <span className="text-xs text-muted-foreground">-</span>
         </div>
      </div>
   );
}
