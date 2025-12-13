import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import {
   socialMediaAccountSchema,
   paginationSchema,
   validateIncludeParam,
   handleAPIError,
   createPaginationResponse,
} from '@/lib/schemas/api';
import { APIError } from '@/lib/api-utils';

// Validation schemas
const createSocialMediaAccountSchema = socialMediaAccountSchema;

const getSocialMediaAccountsSchema = z.object({
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
   isActive: z.coerce.boolean().nullable().optional(),
   search: z.string().nullable().optional(),
   include: z.string().optional(),
   page: z.coerce.number().min(1).default(1),
   limit: z.coerce.number().min(1).max(100).default(20),
});

// Include relations for social media accounts
const SOCIAL_ACCOUNT_INCLUDE_RELATIONS = ['user', 'posts', 'activities'];

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
      const query = getSocialMediaAccountsSchema.parse({
         platform: searchParams.get('platform'),
         isActive: searchParams.get('isActive'),
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
         ? validateIncludeParam(query.include, SOCIAL_ACCOUNT_INCLUDE_RELATIONS)
         : { user: true, posts: true };

      // Build where clause
      const where: any = {
         organizationId: orgId,
      };

      if (query.platform) {
         where.platform = query.platform;
      }

      if (query.isActive !== null) {
         where.isActive = query.isActive;
      }

      if (query.search) {
         where.OR = [
            { username: { contains: query.search, mode: 'insensitive' } },
            { displayName: { contains: query.search, mode: 'insensitive' } },
         ];
      }

      // Get total count for pagination
      const total = await prisma.socialMediaAccount.count({ where });

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

      // Get social media accounts with pagination
      const accounts = await prisma.socialMediaAccount.findMany({
         where,
         include,
         orderBy: { createdAt: 'desc' },
         skip: (query.page - 1) * query.limit,
         take: query.limit,
      });

      return createPaginationResponse(accounts, query.page, query.limit, total);
   } catch (error) {
      console.error('Error fetching social media accounts:', error);
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

      // Only ADMIN and BRAND_OWNER can create social media accounts
      if (!['ADMIN', 'BRAND_OWNER'].includes(membership.role)) {
         return NextResponse.json(
            {
               ok: false,
               error: { code: 'E_INSUFFICIENT_PERMISSIONS', message: 'Insufficient permissions' },
            },
            { status: 403 }
         );
      }

      const body = await request.json();
      const validatedData = createSocialMediaAccountSchema.parse(body);

      // Check if account already exists for this platform and accountId
      const existingAccount = await prisma.socialMediaAccount.findFirst({
         where: {
            organizationId: orgId,
            platform: validatedData.platform,
            accountId: validatedData.accountId,
         },
      });

      if (existingAccount) {
         return NextResponse.json(
            {
               ok: false,
               error: { code: 'E_CONFLICT', message: 'Account already exists for this platform' },
            },
            { status: 409 }
         );
      }

      // Create social media account
      const account = await prisma.socialMediaAccount.create({
         data: {
            ...validatedData,
            organizationId: orgId,
            userId: session.user.id,
         },
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

      return NextResponse.json(
         {
            ok: true,
            data: account,
         },
         { status: 201 }
      );
   } catch (error) {
      console.error('Error creating social media account:', error);
      return handleAPIError(error);
   }
}
