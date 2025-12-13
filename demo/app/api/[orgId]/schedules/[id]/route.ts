import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { updateScheduleSchema } from '@/lib/schemas';
import { requirePermission, PERMISSIONS } from '@/lib/rbac';

export async function GET(
   request: NextRequest,
   { params }: { params: Promise<{ orgId: string; id: string }> }
) {
   try {
      const session = await auth();
      if (!session?.user?.id) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const resolvedParams = await params;
      const { orgId, id } = resolvedParams;

      await requirePermission(session.user.id, orgId, PERMISSIONS.MANAGE_SCHEDULES);

      const schedule = await prisma.schedule.findFirst({
         where: { id, project: { organizationId: orgId } },
         include: {
            project: true,
            content: true,
         },
      });

      if (!schedule) {
         return NextResponse.json({ error: 'Schedule not found' }, { status: 404 });
      }

      return NextResponse.json(schedule);
   } catch (error) {
      console.error('Error fetching schedule:', error);
      return NextResponse.json(
         { error: error instanceof Error ? error.message : 'Internal server error' },
         { status: 500 }
      );
   }
}

export async function PUT(
   request: NextRequest,
   { params }: { params: Promise<{ orgId: string; id: string }> }
) {
   try {
      const session = await auth();
      if (!session?.user?.id) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const resolvedParams = await params;
      const { orgId, id } = resolvedParams;

      await requirePermission(session.user.id, orgId, PERMISSIONS.MANAGE_SCHEDULES);

      const body = await request.json();
      const validatedData = updateScheduleSchema.parse(body);

      const schedule = await prisma.schedule.update({
         where: { id },
         data: validatedData,
         include: {
            project: true,
         },
      });

      return NextResponse.json(schedule);
   } catch (error) {
      console.error('Error updating schedule:', error);
      if (error instanceof Error && error.message === 'Insufficient permissions') {
         return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      return NextResponse.json(
         { error: error instanceof Error ? error.message : 'Internal server error' },
         { status: 500 }
      );
   }
}

export async function DELETE(
   request: NextRequest,
   { params }: { params: Promise<{ orgId: string; id: string }> }
) {
   try {
      const session = await auth();
      if (!session?.user?.id) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const resolvedParams = await params;
      const { orgId, id } = resolvedParams;

      await requirePermission(session.user.id, orgId, PERMISSIONS.MANAGE_SCHEDULES);

      await prisma.schedule.delete({
         where: { id },
      });

      return NextResponse.json({ message: 'Schedule deleted' });
   } catch (error) {
      console.error('Error deleting schedule:', error);
      if (error instanceof Error && error.message === 'Insufficient permissions') {
         return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      return NextResponse.json(
         { error: error instanceof Error ? error.message : 'Internal server error' },
         { status: 500 }
      );
   }
}
