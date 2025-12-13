import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import {
   activityLogSchema,
   paginationSchema,
   validateIncludeParam,
   handleAPIError,
   createPaginationResponse,
} from '@/lib/schemas/api';
import { APIError } from '@/lib/api-utils';

// Validation schemas
const createActivityLogSchema = activityLogSchema;

const getActivitiesSchema = z.object({
   type: z
      .enum([
         'CREATE',
         'UPDATE',
         'DELETE',
         'VIEW',
         'SHARE',
         'COMMENT',
         'LIKE',
         'FOLLOW',
         'UNFOLLOW',
         'LOGIN',
         'LOGOUT',
         'UPLOAD',
         'DOWNLOAD',
      ])
      .nullable()
      .optional(),
   userId: z.string().nullable().optional(),
   objectiveId: z.string().nullable().optional(),
   phaseId: z.string().nullable().optional(),
   projectId: z.string().nullable().optional(),
   taskId: z.string().nullable().optional(),
   socialMediaAccountId: z.string().nullable().optional(),
   socialMediaPostId: z.string().nullable().optional(),
   search: z.string().nullable().optional(),
   include: z.string().optional(),
   page: z.coerce.number().min(1).default(1),
   limit: z.coerce.number().min(1).max(100).default(20),
});

// Include relations for activities
const ACTIVITY_INCLUDE_RELATIONS = [
   'user',
   'objective',
   'phase',
   'project',
   'task',
   'projectTask',
   'socialMediaAccount',
   'socialMediaPost',
];

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

      const { searchParams } = new URL(request.url);
      const query = getActivitiesSchema.parse({
         type: searchParams.get('type'),
         userId: searchParams.get('userId'),
         objectiveId: searchParams.get('objectiveId'),
         phaseId: searchParams.get('phaseId'),
         projectId: searchParams.get('projectId'),
         taskId: searchParams.get('taskId'),
         socialMediaAccountId: searchParams.get('socialMediaAccountId'),
         socialMediaPostId: searchParams.get('socialMediaPostId'),
         search: searchParams.get('search'),
         include: searchParams.get('include'),
         page: searchParams.get('page'),
         limit: searchParams.get('limit'),
      });

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
         return NextResponse.json(
            {
               ok: false,
               error: { code: 'E_ACCESS_DENIED', message: 'Access denied' },
            },
            { status: 403 }
         );
      }

      // Parse include relationships
      const includeRelations = query.include
         ? validateIncludeParam(query.include, ACTIVITY_INCLUDE_RELATIONS)
         : { user: true };

      // Build where clause
      const where: any = {
         organizationId: orgId,
      };

      if (query.type) {
         where.type = query.type;
      }

      if (query.userId) {
         where.userId = query.userId;
      }

      if (query.objectiveId) {
         where.objectiveId = query.objectiveId;
      }

      if (query.phaseId) {
         where.phaseId = query.phaseId;
      }

      if (query.projectId) {
         where.projectId = query.projectId;
      }

      if (query.taskId) {
         where.taskId = query.taskId;
      }

      if (query.socialMediaAccountId) {
         where.socialMediaAccountId = query.socialMediaAccountId;
      }

      if (query.socialMediaPostId) {
         where.socialMediaPostId = query.socialMediaPostId;
      }

      if (query.search) {
         where.description = { contains: query.search, mode: 'insensitive' };
      }

      // Get total count for pagination
      const total = await prisma.activityLog.count({ where });

      // Build include object for Prisma
      const include: any = {};

      // Add relationships based on include parameter
      if (includeRelations.user) {
         include.user = {
            select: { id: true, name: true, email: true, image: true },
         };
      }

      if (includeRelations.objective) {
         include.objective = {
            select: { id: true, title: true, status: true, priority: true },
         };
      }

      if (includeRelations.phase) {
         include.phase = {
            select: { id: true, title: true, status: true },
         };
      }

      if (includeRelations.project) {
         include.project = {
            select: { id: true, name: true, status: true, priority: true, health: true },
         };
      }

      if (includeRelations.task) {
         include.task = {
            select: { id: true, title: true, status: true, priority: true },
         };
      }

      if (includeRelations.projectTask) {
         include.projectTask = {
            select: { id: true, title: true, status: true, priority: true },
         };
      }

      if (includeRelations.socialMediaAccount) {
         include.socialMediaAccount = {
            select: { id: true, platform: true, username: true, displayName: true },
         };
      }

      if (includeRelations.socialMediaPost) {
         include.socialMediaPost = {
            select: { id: true, content: true, status: true, scheduledAt: true, publishedAt: true },
         };
      }

      // Get activities with pagination
      const activities = await prisma.activityLog.findMany({
         where,
         include,
         orderBy: { createdAt: 'desc' },
         skip: (query.page - 1) * query.limit,
         take: query.limit,
      });

      return createPaginationResponse(activities, query.page, query.limit, total);
   } catch (error) {
      console.error('Error fetching activities:', error);
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
         return NextResponse.json(
            {
               ok: false,
               error: { code: 'E_ACCESS_DENIED', message: 'Access denied' },
            },
            { status: 403 }
         );
      }

      const body = await request.json();
      const validatedData = createActivityLogSchema.parse(body);

      // Validate related entities exist if provided
      if (validatedData.objectiveId) {
         const objective = await prisma.objective.findFirst({
            where: {
               id: validatedData.objectiveId,
               organizationId: orgId,
            },
         });
         if (!objective) {
            throw new APIError('Objective not found', 404, 'OBJECTIVE_NOT_FOUND');
         }
      }

      if (validatedData.phaseId) {
         const phase = await prisma.phase.findFirst({
            where: {
               id: validatedData.phaseId,
               organizationId: orgId,
            },
         });
         if (!phase) {
            throw new APIError('Phase not found', 404, 'PHASE_NOT_FOUND');
         }
      }

      if (validatedData.projectId) {
         const project = await prisma.project.findFirst({
            where: {
               id: validatedData.projectId,
               organizationId: orgId,
            },
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

      if (validatedData.socialMediaAccountId) {
         const socialMediaAccount = await prisma.socialMediaAccount.findFirst({
            where: {
               id: validatedData.socialMediaAccountId,
               organizationId: orgId,
            },
         });
         if (!socialMediaAccount) {
            throw new APIError('Social media account not found', 404, 'SOCIAL_ACCOUNT_NOT_FOUND');
         }
      }

      if (validatedData.socialMediaPostId) {
         const socialMediaPost = await prisma.socialMediaPost.findFirst({
            where: {
               id: validatedData.socialMediaPostId,
               organizationId: orgId,
            },
         });
         if (!socialMediaPost) {
            throw new APIError('Social media post not found', 404, 'SOCIAL_POST_NOT_FOUND');
         }
      }

      // Create activity log
      const activity = await prisma.activityLog.create({
         data: {
            ...validatedData,
            organizationId: orgId,
            userId: session.user.id,
         },
         include: {
            user: {
               select: { id: true, name: true, email: true, image: true },
            },
            objective: {
               select: { id: true, title: true, status: true, priority: true },
            },
            phase: {
               select: { id: true, title: true, status: true },
            },
            project: {
               select: { id: true, name: true, status: true, priority: true, health: true },
            },
            task: {
               select: { id: true, title: true, status: true, priority: true },
            },
            socialMediaAccount: {
               select: { id: true, platform: true, username: true, displayName: true },
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
      });

      return NextResponse.json(
         {
            ok: true,
            data: activity,
         },
         { status: 201 }
      );
   } catch (error) {
      console.error('Error creating activity:', error);
      return handleAPIError(error);
   }
}
