import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(
   request: NextRequest,
   { params }: { params: Promise<{ orgId: string; id: string; taskId: string }> }
) {
   try {
      const session = await auth();
      if (!session?.user?.id) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const resolvedParams = await params;
      const { orgId, id, taskId } = resolvedParams;

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

      const body = await request.json();

      // Update the task
      const updatedTask = await prisma.projectTask.update({
         where: {
            id: taskId,
            projectId: id,
         },
         data: body,
         include: {
            assignee: {
               select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
               },
            },
            subtasks: {
               include: {
                  assignee: {
                     select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                     },
                  },
               },
            },
         },
      });

      return NextResponse.json({ task: updatedTask });
   } catch (error) {
      console.error('Error updating task:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
   }
}

export async function DELETE(
   request: NextRequest,
   { params }: { params: Promise<{ orgId: string; id: string; taskId: string }> }
) {
   try {
      const session = await auth();
      if (!session?.user?.id) {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const resolvedParams = await params;
      const { orgId, id, taskId } = resolvedParams;

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

      // Delete the task and all its subtasks
      await prisma.projectTask.deleteMany({
         where: {
            OR: [{ id: taskId }, { parentTaskId: taskId }],
            projectId: id,
         },
      });

      return NextResponse.json({ message: 'Task deleted successfully' });
   } catch (error) {
      console.error('Error deleting task:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
   }
}
