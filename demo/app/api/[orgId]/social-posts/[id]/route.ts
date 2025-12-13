import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { socialMediaPostSchema, validateIncludeParam, handleAPIError } from '@/lib/schemas/api';
import { APIError } from '@/lib/api-utils';

// Validation schemas
const updateSocialMediaPostSchema = socialMediaPostSchema.partial();

const getSocialMediaPostSchema = z.object({
   include: z.string().optional(),
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
   { params }: { params: Promise<{ orgId: string; id: string }> }
) {
   try {
      const { orgId, id } = await params;
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
      const query = getSocialMediaPostSchema.parse({
         include: searchParams.get('include'),
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

      // Get social media post
      const post = await prisma.socialMediaPost.findFirst({
         where: {
            id,
            organizationId: orgId,
         },
         include,
      });

      if (!post) {
         return NextResponse.json(
            {
               ok: false,
               error: { code: 'E_NOT_FOUND', message: 'Social media post not found' },
            },
            { status: 404 }
         );
      }

      return NextResponse.json({
         ok: true,
         data: post,
      });
   } catch (error) {
      console.error('Error fetching social media post:', error);
      return handleAPIError(error);
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

      // Only ADMIN, BRAND_OWNER, and CREATOR can update social media posts
      if (!['ADMIN', 'BRAND_OWNER', 'CREATOR'].includes(membership.role)) {
         return NextResponse.json(
            {
               ok: false,
               error: { code: 'E_INSUFFICIENT_PERMISSIONS', message: 'Insufficient permissions' },
            },
            { status: 403 }
         );
      }

      // Check if post exists
      const existingPost = await prisma.socialMediaPost.findFirst({
         where: {
            id,
            organizationId: orgId,
         },
      });

      if (!existingPost) {
         return NextResponse.json(
            {
               ok: false,
               error: { code: 'E_NOT_FOUND', message: 'Social media post not found' },
            },
            { status: 404 }
         );
      }

      const body = await request.json();
      const validatedData = updateSocialMediaPostSchema.parse(body);

      // Validate social media account exists if provided
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

      // Update social media post
      const post = await prisma.socialMediaPost.update({
         where: { id },
         data: validatedData,
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

      return NextResponse.json({
         ok: true,
         data: post,
      });
   } catch (error) {
      console.error('Error updating social media post:', error);
      return handleAPIError(error);
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

      // Only ADMIN and BRAND_OWNER can delete social media posts
      if (!['ADMIN', 'BRAND_OWNER'].includes(membership.role)) {
         return NextResponse.json(
            {
               ok: false,
               error: { code: 'E_INSUFFICIENT_PERMISSIONS', message: 'Insufficient permissions' },
            },
            { status: 403 }
         );
      }

      // Check if post exists
      const existingPost = await prisma.socialMediaPost.findFirst({
         where: {
            id,
            organizationId: orgId,
         },
      });

      if (!existingPost) {
         return NextResponse.json(
            {
               ok: false,
               error: { code: 'E_NOT_FOUND', message: 'Social media post not found' },
            },
            { status: 404 }
         );
      }

      // Delete social media post
      await prisma.socialMediaPost.delete({
         where: { id },
      });

      return NextResponse.json({
         ok: true,
         data: { message: 'Social media post deleted successfully' },
      });
   } catch (error) {
      console.error('Error deleting social media post:', error);
      return handleAPIError(error);
   }
}
