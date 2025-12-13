import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
   scheduleSchema,
   paginationSchema,
   validateIncludeParam,
   SCHEDULE_INCLUDE_RELATIONS,
   handleAPIError,
   createPaginationResponse,
} from '@/lib/schemas/api';
import { APIError } from '@/lib/api-utils';
import { requirePermission, PERMISSIONS } from '@/lib/rbac';
import { z } from 'zod';

// Validation schemas
const createScheduleSchema = scheduleSchema;

const getSchedulesSchema = z.object({
   from: z.string().datetime().nullable().optional(),
   to: z.string().datetime().nullable().optional(),
   channels: z.string().nullable().optional(),
   projects: z.string().nullable().optional(),
   status: z.enum(['PENDING', 'PUBLISHED', 'FAILED', 'CANCELLED']).nullable().optional(),
   include: z.string().optional(),
   page: z.coerce.number().min(1).default(1),
   limit: z.coerce.number().min(1).max(100).default(20),
});

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

      const query = getSchedulesSchema.parse({
         from: searchParams.get('from'),
         to: searchParams.get('to'),
         channels: searchParams.get('channels'),
         projects: searchParams.get('projects'),
         status: searchParams.get('status'),
         include: searchParams.get('include'),
         page: searchParams.get('page'),
         limit: searchParams.get('limit'),
      });

      await requirePermission(session.user.id, orgId, PERMISSIONS.MANAGE_SCHEDULES);

      // Parse include relationships
      const includeRelations = query.include
         ? validateIncludeParam(query.include, SCHEDULE_INCLUDE_RELATIONS)
         : { project: true, task: true, content: true, socialMediaPosts: true };

      const where: any = {
         project: { organizationId: orgId },
      };

      // Add date range filter
      if (query.from && query.to) {
         where.runAt = {
            gte: new Date(query.from),
            lte: new Date(query.to),
         };
      }

      // Add channel filter
      if (query.channels) {
         const channels = query.channels
            .split(',')
            .map((c) => c.trim())
            .filter((c) => c.length > 0);
         if (channels.length > 0) {
            where.channel = { in: channels };
         }
      }

      // Add project filter
      if (query.projects) {
         const projects = query.projects
            .split(',')
            .map((p) => p.trim())
            .filter((p) => p.length > 0);
         if (projects.length > 0) {
            where.projectId = { in: projects };
         }
      }

      // Add status filter
      if (query.status) {
         where.status = query.status;
      }

      // Get total count for pagination
      const total = await prisma.schedule.count({ where });

      // Build include object for Prisma
      const include: any = {
         // Existing relationships
         project: {
            select: { id: true, name: true, status: true, priority: true },
         },
         content: {
            select: { id: true, title: true, type: true, status: true },
         },
         analytics: {
            select: { id: true, event: true, createdAt: true },
         },
      };

      // Add new relationships based on include parameter
      if (includeRelations.task) {
         include.task = {
            select: { id: true, title: true, status: true, priority: true },
         };
      }

      if (includeRelations.socialMediaPosts) {
         include.socialMediaPosts = {
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
               task: {
                  select: {
                     id: true,
                     title: true,
                     status: true,
                     priority: true,
                     phase: {
                        select: {
                           id: true,
                           title: true,
                           status: true,
                        },
                     },
                  },
               },
               projectTask: {
                  select: {
                     id: true,
                     title: true,
                     status: true,
                     priority: true,
                  },
               },
               createdBy: {
                  select: {
                     id: true,
                     name: true,
                     email: true,
                     image: true,
                  },
               },
               activities: {
                  select: {
                     id: true,
                     type: true,
                     description: true,
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
            orderBy: { scheduledAt: 'asc' },
         };
      }

      const schedules = await prisma.schedule.findMany({
         where,
         include,
         orderBy: { runAt: 'asc' },
         skip: (query.page - 1) * query.limit,
         take: query.limit,
      });

      return createPaginationResponse(schedules, query.page, query.limit, total);
   } catch (error) {
      console.error('Error fetching schedules:', error);
      return handleAPIError(error);
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

      await requirePermission(session.user.id, orgId, PERMISSIONS.MANAGE_SCHEDULES);

      const body = await request.json();
      const validatedData = createScheduleSchema.parse(body);

      // Verify project belongs to org
      const project = await prisma.project.findFirst({
         where: { id: validatedData.projectId, organizationId: orgId },
      });
      if (!project) {
         throw new APIError('Project not found', 404, 'PROJECT_NOT_FOUND');
      }

      // Verify task belongs to project if provided
      if (validatedData.taskId) {
         const task = await prisma.task.findFirst({
            where: { id: validatedData.taskId, projectId: validatedData.projectId },
         });
         if (!task) {
            throw new APIError('Task not found', 404, 'TASK_NOT_FOUND');
         }
      }

      // Verify content belongs to project if provided
      if (validatedData.contentId) {
         const content = await prisma.content.findFirst({
            where: { id: validatedData.contentId, projectId: validatedData.projectId },
         });
         if (!content) {
            throw new APIError('Content not found', 404, 'CONTENT_NOT_FOUND');
         }
      }

      // Check for potential conflicts (same channel at overlapping times)
      const conflictingSchedule = await prisma.schedule.findFirst({
         where: {
            channel: validatedData.channel,
            runAt: {
               gte: new Date(new Date(validatedData.runAt).getTime() - 15 * 60 * 1000), // 15 minutes before
               lte: new Date(new Date(validatedData.runAt).getTime() + 15 * 60 * 1000), // 15 minutes after
            },
            status: { not: 'CANCELLED' },
         },
      });

      if (conflictingSchedule) {
         throw new APIError('Potential scheduling conflict detected', 409, 'CONFLICT_SLOT');
      }

      // Create schedule and update related content/task status in a transaction
      const result = await prisma.$transaction(async (tx) => {
         const schedule = await tx.schedule.create({
            data: {
               name: validatedData.name,
               runAt: new Date(validatedData.runAt),
               timezone: validatedData.timezone,
               channel: validatedData.channel as any,
               status: validatedData.status || 'PENDING',
               projectId: validatedData.projectId!,
               taskId: validatedData.taskId || undefined,
               contentId: validatedData.contentId || undefined,
            },
            include: {
               project: {
                  select: { id: true, name: true, status: true, priority: true },
               },
               task: {
                  select: { id: true, title: true, status: true, priority: true },
               },
               content: {
                  select: { id: true, title: true, type: true, status: true },
               },
               socialMediaPosts: {
                  include: {
                     socialMediaAccount: {
                        select: { id: true, platform: true, username: true, displayName: true },
                     },
                  },
               },
               analytics: {
                  select: { id: true, event: true, createdAt: true },
               },
            },
         });

         // Update content status to SCHEDULED if content is provided
         if (validatedData.contentId) {
            await tx.content.update({
               where: { id: validatedData.contentId },
               data: { status: 'SCHEDULED' },
            });
         }

         // Update task status to IN_PROGRESS if task is provided
         if (validatedData.taskId) {
            await tx.task.update({
               where: { id: validatedData.taskId },
               data: { status: 'IN_PROGRESS' },
            });
         }

         return schedule;
      });

      return NextResponse.json({ ok: true, data: result }, { status: 201 });
   } catch (error) {
      console.error('Error creating schedule:', error);
      return handleAPIError(error);
   }
}
