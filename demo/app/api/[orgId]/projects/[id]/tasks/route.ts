import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schemas
const createTaskSchema = z.object({
   title: z.string().min(3).max(200),
   description: z.string().max(2000).optional(),
   status: z.enum(['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE', 'CANCELLED']).default('TODO'),
   priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
   assigneeId: z.string().cuid().optional(),
   dueDate: z.string().datetime().optional(),
   parentTaskId: z.string().cuid().optional(),
});

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

      // Get tasks for the project
      const tasks = await prisma.projectTask.findMany({
         where: {
            projectId: id,
            parentTaskId: null, // Only get top-level tasks
         },
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
               orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }],
            },
         },
         orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }],
      });

      return NextResponse.json(tasks);
   } catch (error) {
      console.error('Error fetching project tasks:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
   }
}

export async function POST(
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

      // Check if user is project member with edit permissions
      const projectMember = await prisma.projectMember.findUnique({
         where: {
            projectId_userId: {
               projectId: id,
               userId: session.user.id,
            },
         },
      });

      if (!projectMember || !['OWNER', 'MANAGER'].includes(projectMember.role)) {
         return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
      }

      const body = await request.json();
      const validatedData = createTaskSchema.parse(body);

      // Create task
      const task = await prisma.projectTask.create({
         data: {
            ...validatedData,
            projectId: id,
            dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : null,
         },
         include: {
            assignee: {
               select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
               },
            },
            subtasks: true,
         },
      });

      return NextResponse.json(task, { status: 201 });
   } catch (error) {
      console.error('Error creating project task:', error);

      if (error instanceof z.ZodError) {
         return NextResponse.json(
            { error: 'Invalid request data', details: error.errors },
            { status: 400 }
         );
      }

      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
   }
}
