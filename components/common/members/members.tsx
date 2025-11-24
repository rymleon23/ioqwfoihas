'use client';

import { useUsers } from '@/hooks/use-users';
import MemberLine from './member-line';
import { useParams } from 'next/navigation';

export default function Members() {
   const params = useParams();
   const orgId = params.orgId as string;
   const { data: users, isLoading } = useUsers(orgId);

   if (isLoading) {
      return <div className="p-6 text-sm text-muted-foreground">Loading members...</div>;
   }

   return (
      <div className="w-full">
         <div className="bg-container px-6 py-1.5 text-sm flex items-center text-muted-foreground border-b sticky top-0 z-10">
            <div className="w-[70%] md:w-[60%] lg:w-[55%]">Name</div>
            <div className="w-[30%] md:w-[20%] lg:w-[15%]">Status</div>
            <div className="hidden lg:block w-[15%]">Joined</div>
            <div className="w-[30%] hidden md:block md:w-[20%] lg:w-[15%]">Teams</div>
         </div>

         <div className="w-full">
            {users?.map((user) => (
               <MemberLine key={user.id} user={user} />
            ))}
            {!users?.length && (
               <div className="p-6 text-center text-sm text-muted-foreground">
                  No members found.
               </div>
            )}
         </div>
      </div>
   );
}
