import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
   request: NextRequest,
   { params }: { params: Promise<{ orgId: string; id: string }> }
) {
   try {
      const { orgId, id } = await params;
      const session = await auth();
      if (!session?.user?.id) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      // Check if user has access to this organization
      const membership = await prisma.membership.findUnique({
         where: {
            userId_organizationId: {
               userId: session.user.id,
               organizationId: orgId,
            },
         },
      });

      if (!membership) {
         return NextResponse.json({ error: 'Access denied' }, { status: 403 });
      }

      // Fetch contents for the specific project
      const contents = await prisma.content.findMany({
         where: {
            projectId: id,
         },
         include: {
            project: {
               select: {
                  id: true,
                  name: true,
               },
            },
         },
         orderBy: {
            createdAt: 'desc',
         },
      });

      return NextResponse.json({ contents });
   } catch (error) {
      console.error('Error fetching project contents:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
   }
}
