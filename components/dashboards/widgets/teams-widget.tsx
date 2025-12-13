'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Users } from 'lucide-react';
import Link from 'next/link';

interface Team {
   id: string;
   name: string;
   key: string;
}

interface TeamsWidgetProps {
   workspaceId: string;
   teams: Team[];
}

export function TeamsWidget({ workspaceId, teams }: TeamsWidgetProps) {
   return (
      <Card className="h-full">
         <CardHeader>
            <CardTitle className="flex items-center gap-2">
               <Users className="h-5 w-5" />
               Teams Overview
            </CardTitle>
            <CardDescription>Active teams in this workspace</CardDescription>
         </CardHeader>
         <CardContent>
            {teams.length > 0 ? (
               <div className="space-y-2">
                  {teams.map((team) => (
                     <Link
                        key={team.id}
                        href={`/${workspaceId}/team/${team.id}/all`}
                        className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent/50 transition-colors group"
                     >
                        <div className="flex items-center gap-3">
                           <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10 text-xs font-bold group-hover:bg-primary/20">
                              {team.key}
                           </div>
                           <span className="text-sm font-medium">{team.name}</span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                     </Link>
                  ))}
               </div>
            ) : (
               <div className="py-8 text-center text-muted-foreground">
                  <p>No teams yet</p>
               </div>
            )}
         </CardContent>
      </Card>
   );
}
