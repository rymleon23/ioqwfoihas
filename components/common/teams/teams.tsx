'use client';

import { useTeams } from '@/hooks/use-teams';
import TeamLine from './team-line';
import { useParams } from 'next/navigation';

export default function Teams() {
   const params = useParams();
   const orgId = params.orgId as string;
   const { data: teams, isLoading } = useTeams(orgId);

   if (isLoading) {
      return <div className="p-6 text-sm text-muted-foreground">Loading teams...</div>;
   }

   return (
      <div className="w-full">
         <div className="bg-container px-6 py-1.5 text-sm flex items-center text-muted-foreground border-b sticky top-0 z-10">
            <div className="w-[70%] sm:w-[50%] md:w-[45%] lg:w-[40%]">Name</div>
            <div className="hidden sm:block sm:w-[20%] md:w-[15%]">Membership</div>
            <div className="hidden sm:block sm:w-[20%] md:w-[15%]">Identifier</div>
            <div className="w-[30%] sm:w-[20%] md:w-[15%]">Members</div>
            <div className="hidden sm:block sm:w-[20%] md:w-[15%]">Projects</div>
         </div>

         <div className="w-full">
            {teams?.map((team) => (
               <TeamLine key={team.id} team={team} />
            ))}
            {!teams?.length && (
               <div className="p-6 text-center text-sm text-muted-foreground">
                  No teams found. Create one to get started.
               </div>
            )}
         </div>
      </div>
   );
}
