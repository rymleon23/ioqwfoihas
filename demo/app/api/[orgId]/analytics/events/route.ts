import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import {
   analyticsEventSchema,
   paginationSchema,
   validateIncludeParam,
   ANALYTICS_INCLUDE_RELATIONS,
   handleAPIError,
   createPaginationResponse,
} from '@/lib/schemas/api';
import { APIError } from '@/lib/api-utils';
import { requirePermission, PERMISSIONS } from '@/lib/rbac';
import { z } from 'zod';

// Validation schemas
const createAnalyticsEventSchema = analyticsEventSchema;

const getAnalyticsEventsSchema = z.object({
   event: z.string().nullable().optional(),
   projectId: z.string().nullable().optional(),
   taskId: z.string().nullable().optional(),
   scheduleId: z.string().nullable().optional(),
   activityId: z.string().nullable().optional(),
   from: z.string().datetime().nullable().optional(),
   to: z.string().datetime().nullable().optional(),
   include: z.string().optional(),
   page: z.coerce.number().min(1).default(1),
   limit: z.coerce.number().min(1).max(100).default(20),
});

export async function GET(
   request: NextRequest,
   { params }: { params: Promise<{ orgId: string }> }
) {
   try {
      const { orgId } = await params;
      const session = await auth();
      if (!session?.user?.id) {
         return NextResponse.json(
            {
               ok: false,
               error: { code: 'E_UNAUTHORIZED', message: 'Unauthorized' },
            },
            { status: 401 }
         );
      }

      await requirePermission(session.user.id, orgId, PERMISSIONS.VIEW_ANALYTICS);

      const { searchParams } = new URL(request.url);
      const query = getAnalyticsEventsSchema.parse({
         event: searchParams.get('event'),
         projectId: searchParams.get('projectId'),
         taskId: searchParams.get('taskId'),
         scheduleId: searchParams.get('scheduleId'),
         activityId: searchParams.get('activityId'),
         from: searchParams.get('from'),
         to: searchParams.get('to'),
         include: searchParams.get('include'),
         page: searchParams.get('page'),
         limit: searchParams.get('limit'),
      });

      // Parse include relationships
      const includeRelations = query.include
         ? validateIncludeParam(query.include, ANALYTICS_INCLUDE_RELATIONS)
         : { project: true, task: true, schedule: true, activity: true, user: true };

      const where: any = {
         organizationId: orgId,
      };

      // Add filters
      if (query.event) {
         where.event = query.event;
      }

      if (query.projectId) {
         where.projectId = query.projectId;
      }

      if (query.taskId) {
         where.taskId = query.taskId;
      }

      if (query.scheduleId) {
         where.scheduleId = query.scheduleId;
      }

      if (query.activityId) {
         where.activityId = query.activityId;
      }

      if (query.from && query.to) {
         where.createdAt = {
            gte: new Date(query.from),
            lte: new Date(query.to),
         };
      }

      // Get total count for pagination
      const total = await prisma.analyticsEvent.count({ where });

      // Build include object for Prisma
      const include: any = {
         // Existing relationships
         user: {
            select: { id: true, name: true, email: true, image: true },
         },
         organization: {
            select: { id: true, name: true, slug: true },
         },
      };

      // Add new relationships based on include parameter
      if (includeRelations.project) {
         include.project = {
            select: { id: true, name: true, status: true, priority: true },
         };
      }

      if (includeRelations.task) {
         include.task = {
            select: { id: true, title: true, status: true, priority: true },
         };
      }

      if (includeRelations.schedule) {
         include.schedule = {
            select: { id: true, name: true, status: true, runAt: true },
         };
      }

      if (includeRelations.activity) {
         include.activity = {
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
               objective: {
                  select: {
                     id: true,
                     title: true,
                     status: true,
                     priority: true,
                  },
               },
               phase: {
                  select: {
                     id: true,
                     title: true,
                     status: true,
                  },
               },
               project: {
                  select: {
                     id: true,
                     name: true,
                     status: true,
                     priority: true,
                  },
               },
               task: {
                  select: {
                     id: true,
                     title: true,
                     status: true,
                     priority: true,
                  },
               },
               socialMediaAccount: {
                  select: {
                     id: true,
                     platform: true,
                     username: true,
                     displayName: true,
                  },
               },
               socialMediaPost: {
                  select: {
                     id: true,
                     content: true,
                     status: true,
                     scheduledAt: true,
                     publishedAt: true,
                  },
               },
            },
         };
      }

      const events = await prisma.analyticsEvent.findMany({
         where,
         include,
         orderBy: { createdAt: 'desc' },
         skip: (query.page - 1) * query.limit,
         take: query.limit,
      });

      return createPaginationResponse(events, query.page, query.limit, total);
   } catch (error) {
      console.error('Error fetching analytics events:', error);
      return handleAPIError(error);
   }
}

export async function POST(
   request: NextRequest,
   { params }: { params: Promise<{ orgId: string }> }
) {
   try {
      const { orgId } = await params;
      const session = await auth();
      if (!session?.user?.id) {
         return NextResponse.json(
            {
               ok: false,
               error: { code: 'E_UNAUTHORIZED', message: 'Unauthorized' },
            },
            { status: 401 }
         );
      }

      await requirePermission(session.user.id, orgId, PERMISSIONS.VIEW_ANALYTICS);

      const body = await request.json();
      const validatedData = createAnalyticsEventSchema.parse(body);

      // Validate related entities exist if provided
      if (validatedData.projectId) {
         const project = await prisma.project.findFirst({
            where: { id: validatedData.projectId, organizationId: orgId },
         });
         if (!project) {
            throw new APIError('Project not found', 404, 'PROJECT_NOT_FOUND');
         }
      }

      if (validatedData.taskId) {
         const task = await prisma.task.findFirst({
            where: {
               id: validatedData.taskId,
               project: { organizationId: orgId },
            },
         });
         if (!task) {
            throw new APIError('Task not found', 404, 'TASK_NOT_FOUND');
         }
      }

      if (validatedData.scheduleId) {
         const schedule = await prisma.schedule.findFirst({
            where: {
               id: validatedData.scheduleId,
               project: { organizationId: orgId },
            },
         });
         if (!schedule) {
            throw new APIError('Schedule not found', 404, 'SCHEDULE_NOT_FOUND');
         }
      }

      if (validatedData.activityId) {
         const activity = await prisma.activityLog.findFirst({
            where: {
               id: validatedData.activityId,
               organizationId: orgId,
            },
         });
         if (!activity) {
            throw new APIError('Activity not found', 404, 'ACTIVITY_NOT_FOUND');
         }
      }

      const event = await prisma.analyticsEvent.create({
         data: {
            ...validatedData,
            userId: session.user.id,
            organizationId: orgId,
         },
         include: {
            user: {
               select: { id: true, name: true, email: true, image: true },
            },
            project: {
               select: { id: true, name: true, status: true, priority: true },
            },
            task: {
               select: { id: true, title: true, status: true, priority: true },
            },
            schedule: {
               select: { id: true, name: true, status: true, runAt: true },
            },
            activity: {
               select: { id: true, type: true, description: true, createdAt: true },
            },
         },
      });

      return NextResponse.json(
         {
            ok: true,
            data: event,
         },
         { status: 201 }
      );
   } catch (error) {
      console.error('Error creating analytics event:', error);
      return handleAPIError(error);
   }
}
