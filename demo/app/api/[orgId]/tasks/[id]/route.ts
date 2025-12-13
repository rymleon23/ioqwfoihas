import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { updateTaskSchema } from '@/lib/schemas';
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

      await requirePermission(session.user.id, orgId, PERMISSIONS.MANAGE_TASKS);

      const task = await prisma.task.findFirst({
         where: { id, project: { organizationId: orgId } },
         include: {
            project: true,
            phase: true,
            assignee: true,
            assets: true,
         },
      });

      if (!task) {
         return NextResponse.json({ error: 'Task not found' }, { status: 404 });
      }

      return NextResponse.json(task);
   } catch (error) {
      console.error('Error fetching task:', error);
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

      await requirePermission(session.user.id, orgId, PERMISSIONS.MANAGE_TASKS);

      const body = await request.json();
      const validatedData = updateTaskSchema.parse(body);

      const task = await prisma.task.update({
         where: { id },
         data: validatedData,
         include: {
            project: true,
            phase: true,
            assignee: true,
            assets: true,
         },
      });

      return NextResponse.json(task);
   } catch (error) {
      console.error('Error updating task:', error);
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

      await requirePermission(session.user.id, orgId, PERMISSIONS.MANAGE_TASKS);

      await prisma.task.delete({
         where: { id },
      });

      return NextResponse.json({ message: 'Task deleted' });
   } catch (error) {
      console.error('Error deleting task:', error);
      if (error instanceof Error && error.message === 'Insufficient permissions') {
         return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      return NextResponse.json(
         { error: error instanceof Error ? error.message : 'Internal server error' },
         { status: 500 }
      );
   }
}
