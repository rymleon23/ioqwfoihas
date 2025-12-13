import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { createTaskSchema } from '@/lib/schemas';
import { requirePermission, PERMISSIONS } from '@/lib/rbac';

export async function GET(
   request: NextRequest,
   { params }: { params: Promise<{ orgId: string }> }
) {
   try {
      const session = await auth();
      if (!session?.user?.id) {
         return NextResponse.json(
            { ok: false, error: { code: 'E_UNAUTHORIZED', message: 'Unauthorized' } },
            { status: 401 }
         );
      }

      const resolvedParams = await params;
      const { orgId } = resolvedParams;
      const { searchParams } = new URL(request.url);
      const projectId = searchParams.get('projectId');
      const status = searchParams.get('status');
      const phaseId = searchParams.get('phaseId');

      await requirePermission(session.user.id, orgId, PERMISSIONS.MANAGE_TASKS);

      const where: any = {
         project: { organizationId: orgId },
      };

      if (projectId) {
         where.projectId = projectId;
      }

      if (status) {
         where.status = status;
      }

      if (phaseId) {
         where.phaseId = phaseId;
      }

      const tasks = await prisma.task.findMany({
         where,
         include: {
            project: {
               select: {
                  id: true,
                  name: true,
                  description: true,
                  status: true,
                  priority: true,
                  health: true,
                  objective: {
                     select: {
                        id: true,
                        title: true,
                        status: true,
                        priority: true,
                     },
                  },
               },
            },
            phase: {
               select: {
                  id: true,
                  title: true,
                  description: true,
                  status: true,
                  startDate: true,
                  endDate: true,
                  completedAt: true,
                  objective: {
                     select: {
                        id: true,
                        title: true,
                        status: true,
                     },
                  },
               },
            },
            assignee: {
               select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
               },
            },
            assets: {
               select: {
                  id: true,
                  url: true,
                  name: true,
                  type: true,
                  size: true,
                  description: true,
                  tags: true,
               },
            },
            socialMediaPosts: {
               include: {
                  socialMediaAccount: {
                     select: {
                        id: true,
                        platform: true,
                        username: true,
                        displayName: true,
                        avatarUrl: true,
                        isActive: true,
                     },
                  },
               },
               orderBy: { scheduledAt: 'asc' },
            },
            activities: {
               select: {
                  id: true,
                  type: true,
                  description: true,
                  metadata: true,
                  createdAt: true,
                  user: {
                     select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                     },
                  },
               },
               orderBy: { createdAt: 'desc' },
               take: 10,
            },
            schedules: {
               select: {
                  id: true,
                  name: true,
                  status: true,
                  runAt: true,
                  channel: true,
               },
               orderBy: { runAt: 'asc' },
            },
         },
         orderBy: { createdAt: 'desc' },
      });

      return NextResponse.json({ ok: true, data: tasks });
   } catch (error) {
      console.error('Error fetching tasks:', error);
      return NextResponse.json(
         { ok: false, error: { code: 'E_INTERNAL', message: 'Internal server error' } },
         { status: 500 }
      );
   }
}

export async function POST(
   request: NextRequest,
   { params }: { params: Promise<{ orgId: string }> }
) {
   try {
      const session = await auth();
      if (!session?.user?.id) {
         return NextResponse.json(
            { ok: false, error: { code: 'E_UNAUTHORIZED', message: 'Unauthorized' } },
            { status: 401 }
         );
      }

      const { orgId } = await params;

      await requirePermission(session.user.id, orgId, PERMISSIONS.MANAGE_TASKS);

      const body = await request.json();
      const validatedData = createTaskSchema.parse(body);

      // Verify project belongs to org
      const project = await prisma.project.findFirst({
         where: { id: validatedData.projectId, organizationId: orgId },
      });
      if (!project) {
         return NextResponse.json(
            {
               ok: false,
               error: { code: 'E_NOT_FOUND', message: 'Project not found' },
            },
            { status: 404 }
         );
      }

      // Validate phase exists if provided
      if (validatedData.phaseId) {
         const phase = await prisma.phase.findFirst({
            where: {
               id: validatedData.phaseId,
               organizationId: orgId,
            },
         });
         if (!phase) {
            return NextResponse.json(
               {
                  ok: false,
                  error: { code: 'E_NOT_FOUND', message: 'Phase not found' },
               },
               { status: 404 }
            );
         }
      }

      const task = await prisma.task.create({
         data: {
            ...validatedData,
            projectId: validatedData.projectId,
         },
         include: {
            project: {
               select: {
                  id: true,
                  name: true,
                  description: true,
                  status: true,
                  priority: true,
                  health: true,
                  objective: {
                     select: {
                        id: true,
                        title: true,
                        status: true,
                        priority: true,
                     },
                  },
               },
            },
            phase: {
               select: {
                  id: true,
                  title: true,
                  description: true,
                  status: true,
                  startDate: true,
                  endDate: true,
                  completedAt: true,
                  objective: {
                     select: {
                        id: true,
                        title: true,
                        status: true,
                     },
                  },
               },
            },
            assignee: {
               select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
               },
            },
            assets: {
               select: {
                  id: true,
                  url: true,
                  name: true,
                  type: true,
                  size: true,
                  description: true,
                  tags: true,
               },
            },
            socialMediaPosts: {
               include: {
                  socialMediaAccount: {
                     select: {
                        id: true,
                        platform: true,
                        username: true,
                        displayName: true,
                        avatarUrl: true,
                        isActive: true,
                     },
                  },
               },
            },
            activities: {
               select: {
                  id: true,
                  type: true,
                  description: true,
                  metadata: true,
                  createdAt: true,
                  user: {
                     select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                     },
                  },
               },
               orderBy: { createdAt: 'desc' },
               take: 5,
            },
         },
      });

      return NextResponse.json({ ok: true, data: task }, { status: 201 });
   } catch (error) {
      console.error('Error creating task:', error);
      if (error instanceof Error && error.message === 'Insufficient permissions') {
         return NextResponse.json(
            {
               ok: false,
               error: { code: 'E_FORBIDDEN', message: 'Forbidden' },
            },
            { status: 403 }
         );
      }
      return NextResponse.json(
         { ok: false, error: { code: 'E_INTERNAL', message: 'Internal server error' } },
         { status: 500 }
      );
   }
}
