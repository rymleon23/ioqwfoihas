import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schemas
const updateProjectSchema = z.object({
   name: z.string().min(3).max(100).optional(),
   summary: z.string().max(200).optional(),
   description: z.string().max(2000).optional(),
   status: z.enum(['DRAFT', 'PLANNING', 'READY', 'DONE', 'CANCELED']).optional(),
   health: z.enum(['ON_TRACK', 'AT_RISK', 'OFF_TRACK']).optional(),
   priority: z.enum(['NO_PRIORITY', 'LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
   leadId: z.string().cuid().optional(),
   startDate: z.string().datetime().optional(),
   endDate: z.string().datetime().optional(),
});

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

      // Get project with all related data
      const project = await prisma.project.findFirst({
         where: {
            id: id,
            organizationId: orgId,
         },
         include: {
            // Objective relationship
            objective: {
               select: {
                  id: true,
                  title: true,
                  description: true,
                  status: true,
                  priority: true,
                  startDate: true,
                  endDate: true,
                  completedAt: true,
                  createdAt: true,
                  createdBy: {
                     select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                     },
                  },
               },
            },
            // Phase relationship
            phase: {
               select: {
                  id: true,
                  title: true,
                  description: true,
                  status: true,
                  startDate: true,
                  endDate: true,
                  completedAt: true,
                  createdAt: true,
                  createdBy: {
                     select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                     },
                  },
               },
            },
            // Activities relationship
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
               take: 20,
            },
            lead: {
               select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
               },
            },
            members: {
               include: {
                  user: {
                     select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                     },
                  },
               },
            },
            tasks: {
               include: {
                  assignee: {
                     select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                     },
                  },
                  phase: {
                     select: {
                        id: true,
                        title: true,
                        status: true,
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
               orderBy: [{ priority: 'desc' }, { createdAt: 'asc' }],
            },
            labels: true,
            milestones: {
               orderBy: { dueDate: 'asc' },
            },
            contents: {
               select: {
                  id: true,
                  title: true,
                  status: true,
                  createdAt: true,
               },
            },
            schedules: {
               select: {
                  id: true,
                  name: true,
                  status: true,
                  runAt: true,
                  channel: true,
               },
            },
            _count: {
               select: {
                  tasks: true,
                  members: true,
                  labels: true,
                  milestones: true,
                  contents: true,
                  schedules: true,
                  activities: true,
               },
            },
         },
      });

      if (!project) {
         return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }

      return NextResponse.json(project);
   } catch (error) {
      console.error('Error fetching project:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
   }
}

export async function PUT(
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
      const validatedData = updateProjectSchema.parse(body);

      // Validate dates if both are provided
      if (validatedData.startDate && validatedData.endDate) {
         const startDate = new Date(validatedData.startDate);
         const endDate = new Date(validatedData.endDate);

         if (startDate >= endDate) {
            return NextResponse.json(
               { error: 'End date must be after start date' },
               { status: 400 }
            );
         }
      }

      // Update project
      const updatedProject = await prisma.project.update({
         where: {
            id: id,
            organizationId: orgId,
         },
         data: {
            ...validatedData,
            startDate: validatedData.startDate ? new Date(validatedData.startDate) : undefined,
            endDate: validatedData.endDate ? new Date(validatedData.endDate) : undefined,
         },
         include: {
            lead: {
               select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
               },
            },
            members: {
               include: {
                  user: {
                     select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                     },
                  },
               },
            },
            labels: true,
            milestones: true,
            _count: {
               select: {
                  tasks: true,
                  members: true,
                  labels: true,
                  milestones: true,
               },
            },
         },
      });

      return NextResponse.json(updatedProject);
   } catch (error) {
      console.error('Error updating project:', error);

      if (error instanceof z.ZodError) {
         return NextResponse.json(
            { error: 'Invalid request data', details: error.errors },
            { status: 400 }
         );
      }

      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
   }
}

export async function DELETE(
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

      // Only project OWNER or organization ADMIN can delete projects
      const projectMember = await prisma.projectMember.findUnique({
         where: {
            projectId_userId: {
               projectId: id,
               userId: session.user.id,
            },
         },
      });

      const canDelete = projectMember?.role === 'OWNER' || membership.role === 'ADMIN';

      if (!canDelete) {
         return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
      }

      // Delete project (cascades to related data)
      await prisma.project.delete({
         where: {
            id: id,
            organizationId: orgId,
         },
      });

      return NextResponse.json({ message: 'Project deleted successfully' });
   } catch (error) {
      console.error('Error deleting project:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
   }
}
