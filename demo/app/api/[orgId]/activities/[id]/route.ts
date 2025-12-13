import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { activityLogSchema, validateIncludeParam, handleAPIError } from '@/lib/schemas/api';
import { APIError } from '@/lib/api-utils';

// Validation schemas
const updateActivityLogSchema = activityLogSchema.partial();

const getActivitySchema = z.object({
   include: z.string().optional(),
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
      const query = getActivitySchema.parse({
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
         ? validateIncludeParam(query.include, ACTIVITY_INCLUDE_RELATIONS)
         : { user: true };

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

      // Get activity
      const activity = await prisma.activityLog.findFirst({
         where: {
            id,
            organizationId: orgId,
         },
         include,
      });

      if (!activity) {
         return NextResponse.json(
            {
               ok: false,
               error: { code: 'E_NOT_FOUND', message: 'Activity not found' },
            },
            { status: 404 }
         );
      }

      return NextResponse.json({
         ok: true,
         data: activity,
      });
   } catch (error) {
      console.error('Error fetching activity:', error);
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

      // Only ADMIN can update activities
      if (membership.role !== 'ADMIN') {
         return NextResponse.json(
            {
               ok: false,
               error: { code: 'E_INSUFFICIENT_PERMISSIONS', message: 'Insufficient permissions' },
            },
            { status: 403 }
         );
      }

      // Check if activity exists
      const existingActivity = await prisma.activityLog.findFirst({
         where: {
            id,
            organizationId: orgId,
         },
      });

      if (!existingActivity) {
         return NextResponse.json(
            {
               ok: false,
               error: { code: 'E_NOT_FOUND', message: 'Activity not found' },
            },
            { status: 404 }
         );
      }

      const body = await request.json();
      const validatedData = updateActivityLogSchema.parse(body);

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

      // Update activity
      const activity = await prisma.activityLog.update({
         where: { id },
         data: validatedData,
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

      return NextResponse.json({
         ok: true,
         data: activity,
      });
   } catch (error) {
      console.error('Error updating activity:', error);
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

      // Only ADMIN can delete activities
      if (membership.role !== 'ADMIN') {
         return NextResponse.json(
            {
               ok: false,
               error: { code: 'E_INSUFFICIENT_PERMISSIONS', message: 'Insufficient permissions' },
            },
            { status: 403 }
         );
      }

      // Check if activity exists
      const existingActivity = await prisma.activityLog.findFirst({
         where: {
            id,
            organizationId: orgId,
         },
      });

      if (!existingActivity) {
         return NextResponse.json(
            {
               ok: false,
               error: { code: 'E_NOT_FOUND', message: 'Activity not found' },
            },
            { status: 404 }
         );
      }

      // Delete activity
      await prisma.activityLog.delete({
         where: { id },
      });

      return NextResponse.json({
         ok: true,
         data: { message: 'Activity deleted successfully' },
      });
   } catch (error) {
      console.error('Error deleting activity:', error);
      return handleAPIError(error);
   }
}
