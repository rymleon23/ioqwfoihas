import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { socialMediaAccountSchema, validateIncludeParam, handleAPIError } from '@/lib/schemas/api';
import { APIError } from '@/lib/api-utils';

// Validation schemas
const updateSocialMediaAccountSchema = socialMediaAccountSchema.partial();

const getSocialMediaAccountSchema = z.object({
   include: z.string().optional(),
});

// Include relations for social media accounts
const SOCIAL_ACCOUNT_INCLUDE_RELATIONS = ['user', 'posts', 'activities'];

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
      const query = getSocialMediaAccountSchema.parse({
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
         ? validateIncludeParam(query.include, SOCIAL_ACCOUNT_INCLUDE_RELATIONS)
         : { user: true, posts: true };

      // Build include object for Prisma
      const include: any = {};

      // Add relationships based on include parameter
      if (includeRelations.user) {
         include.user = {
            select: { id: true, name: true, email: true, image: true },
         };
      }

      if (includeRelations.posts) {
         include.posts = {
            select: { id: true, content: true, status: true, scheduledAt: true, publishedAt: true },
         };
      }

      if (includeRelations.activities) {
         include.activities = {
            select: { id: true, type: true, description: true, createdAt: true },
         };
      }

      // Get social media account
      const account = await prisma.socialMediaAccount.findFirst({
         where: {
            id,
            organizationId: orgId,
         },
         include,
      });

      if (!account) {
         return NextResponse.json(
            {
               ok: false,
               error: { code: 'E_NOT_FOUND', message: 'Social media account not found' },
            },
            { status: 404 }
         );
      }

      return NextResponse.json({
         ok: true,
         data: account,
      });
   } catch (error) {
      console.error('Error fetching social media account:', error);
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

      // Only ADMIN and BRAND_OWNER can update social media accounts
      if (!['ADMIN', 'BRAND_OWNER'].includes(membership.role)) {
         return NextResponse.json(
            {
               ok: false,
               error: { code: 'E_INSUFFICIENT_PERMISSIONS', message: 'Insufficient permissions' },
            },
            { status: 403 }
         );
      }

      // Check if account exists
      const existingAccount = await prisma.socialMediaAccount.findFirst({
         where: {
            id,
            organizationId: orgId,
         },
      });

      if (!existingAccount) {
         return NextResponse.json(
            {
               ok: false,
               error: { code: 'E_NOT_FOUND', message: 'Social media account not found' },
            },
            { status: 404 }
         );
      }

      const body = await request.json();
      const validatedData = updateSocialMediaAccountSchema.parse(body);

      // Check if account already exists for this platform and accountId (if changing platform or accountId)
      if (validatedData.platform || validatedData.accountId) {
         const platform = validatedData.platform || existingAccount.platform;
         const accountId = validatedData.accountId || existingAccount.accountId;

         const duplicateAccount = await prisma.socialMediaAccount.findFirst({
            where: {
               organizationId: orgId,
               platform,
               accountId,
               id: { not: id },
            },
         });

         if (duplicateAccount) {
            return NextResponse.json(
               {
                  ok: false,
                  error: {
                     code: 'E_CONFLICT',
                     message: 'Account already exists for this platform',
                  },
               },
               { status: 409 }
            );
         }
      }

      // Update social media account
      const account = await prisma.socialMediaAccount.update({
         where: { id },
         data: validatedData,
         include: {
            user: {
               select: { id: true, name: true, email: true, image: true },
            },
            posts: {
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
         data: account,
      });
   } catch (error) {
      console.error('Error updating social media account:', error);
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

      // Only ADMIN can delete social media accounts
      if (membership.role !== 'ADMIN') {
         return NextResponse.json(
            {
               ok: false,
               error: { code: 'E_INSUFFICIENT_PERMISSIONS', message: 'Insufficient permissions' },
            },
            { status: 403 }
         );
      }

      // Check if account exists
      const existingAccount = await prisma.socialMediaAccount.findFirst({
         where: {
            id,
            organizationId: orgId,
         },
      });

      if (!existingAccount) {
         return NextResponse.json(
            {
               ok: false,
               error: { code: 'E_NOT_FOUND', message: 'Social media account not found' },
            },
            { status: 404 }
         );
      }

      // Check if account has associated posts
      const associatedPosts = await prisma.socialMediaPost.count({
         where: {
            socialMediaAccountId: id,
         },
      });

      if (associatedPosts > 0) {
         return NextResponse.json(
            {
               ok: false,
               error: {
                  code: 'E_CONFLICT',
                  message: 'Cannot delete account with associated posts',
               },
            },
            { status: 409 }
         );
      }

      // Delete social media account
      await prisma.socialMediaAccount.delete({
         where: { id },
      });

      return NextResponse.json({
         ok: true,
         data: { message: 'Social media account deleted successfully' },
      });
   } catch (error) {
      console.error('Error deleting social media account:', error);
      return handleAPIError(error);
   }
}
