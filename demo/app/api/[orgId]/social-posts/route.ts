import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import {
   socialMediaPostSchema,
   paginationSchema,
   validateIncludeParam,
   handleAPIError,
   createPaginationResponse,
} from '@/lib/schemas/api';
import { APIError } from '@/lib/api-utils';

// Validation schemas
const createSocialMediaPostSchema = socialMediaPostSchema;

const getSocialMediaPostsSchema = z.object({
   status: z.enum(['DRAFT', 'SCHEDULED', 'PUBLISHED', 'FAILED', 'CANCELLED']).nullable().optional(),
   platform: z
      .enum([
         'FACEBOOK',
         'INSTAGRAM',
         'TWITTER',
         'LINKEDIN',
         'YOUTUBE',
         'TIKTOK',
         'PINTEREST',
         'SNAPCHAT',
      ])
      .nullable()
      .optional(),
   socialMediaAccountId: z.string().nullable().optional(),
   taskId: z.string().nullable().optional(),
   scheduleId: z.string().nullable().optional(),
   search: z.string().nullable().optional(),
   include: z.string().optional(),
   page: z.coerce.number().min(1).default(1),
   limit: z.coerce.number().min(1).max(100).default(20),
});

// Include relations for social media posts
const SOCIAL_POST_INCLUDE_RELATIONS = [
   'socialMediaAccount',
   'task',
   'projectTask',
   'schedule',
   'createdBy',
   'activities',
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
      const query = getSocialMediaPostsSchema.parse({
         status: searchParams.get('status'),
         platform: searchParams.get('platform'),
         socialMediaAccountId: searchParams.get('socialMediaAccountId'),
         taskId: searchParams.get('taskId'),
         scheduleId: searchParams.get('scheduleId'),
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
         ? validateIncludeParam(query.include, SOCIAL_POST_INCLUDE_RELATIONS)
         : { socialMediaAccount: true, task: true, createdBy: true };

      // Build where clause
      const where: any = {
         organizationId: orgId,
      };

      if (query.status) {
         where.status = query.status;
      }

      if (query.socialMediaAccountId) {
         where.socialMediaAccountId = query.socialMediaAccountId;
      }

      if (query.taskId) {
         where.taskId = query.taskId;
      }

      if (query.scheduleId) {
         where.scheduleId = query.scheduleId;
      }

      if (query.search) {
         where.content = { contains: query.search, mode: 'insensitive' };
      }

      // If platform filter is provided, filter by social media account platform
      if (query.platform) {
         where.socialMediaAccount = {
            platform: query.platform,
         };
      }

      // Get total count for pagination
      const total = await prisma.socialMediaPost.count({ where });

      // Build include object for Prisma
      const include: any = {};

      // Add relationships based on include parameter
      if (includeRelations.socialMediaAccount) {
         include.socialMediaAccount = {
            select: { id: true, platform: true, username: true, displayName: true, isActive: true },
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

      if (includeRelations.schedule) {
         include.schedule = {
            select: { id: true, name: true, runAt: true, status: true },
         };
      }

      if (includeRelations.createdBy) {
         include.createdBy = {
            select: { id: true, name: true, email: true, image: true },
         };
      }

      if (includeRelations.activities) {
         include.activities = {
            select: { id: true, type: true, description: true, createdAt: true },
         };
      }

      // Get social media posts with pagination
      const posts = await prisma.socialMediaPost.findMany({
         where,
         include,
         orderBy: { createdAt: 'desc' },
         skip: (query.page - 1) * query.limit,
         take: query.limit,
      });

      return createPaginationResponse(posts, query.page, query.limit, total);
   } catch (error) {
      console.error('Error fetching social media posts:', error);
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

      // Only ADMIN, BRAND_OWNER, and CREATOR can create social media posts
      if (!['ADMIN', 'BRAND_OWNER', 'CREATOR'].includes(membership.role)) {
         return NextResponse.json(
            {
               ok: false,
               error: { code: 'E_INSUFFICIENT_PERMISSIONS', message: 'Insufficient permissions' },
            },
            { status: 403 }
         );
      }

      const body = await request.json();
      const validatedData = createSocialMediaPostSchema.parse(body);

      // Validate social media account exists
      const socialMediaAccount = await prisma.socialMediaAccount.findFirst({
         where: {
            id: validatedData.socialMediaAccountId,
            organizationId: orgId,
         },
      });
      if (!socialMediaAccount) {
         throw new APIError('Social media account not found', 404, 'SOCIAL_ACCOUNT_NOT_FOUND');
      }

      // Validate task exists if provided
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

      // Validate schedule exists if provided
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

      // Create social media post
      const post = await prisma.socialMediaPost.create({
         data: {
            ...validatedData,
            organizationId: orgId,
            createdById: session.user.id,
         },
         include: {
            socialMediaAccount: {
               select: {
                  id: true,
                  platform: true,
                  username: true,
                  displayName: true,
                  isActive: true,
               },
            },
            task: {
               select: { id: true, title: true, status: true, priority: true },
            },
            projectTask: {
               select: { id: true, title: true, status: true, priority: true },
            },
            schedule: {
               select: { id: true, name: true, runAt: true, status: true },
            },
            createdBy: {
               select: { id: true, name: true, email: true, image: true },
            },
         },
      });

      return NextResponse.json(
         {
            ok: true,
            data: post,
         },
         { status: 201 }
      );
   } catch (error) {
      console.error('Error creating social media post:', error);
      return handleAPIError(error);
   }
}
