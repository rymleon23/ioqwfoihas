import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import {
   validateIncludeParam,
   USER_INCLUDE_RELATIONS,
   handleAPIError,
   createSuccessResponse,
} from '@/lib/schemas/api';
import { z } from 'zod';

const getUserSchema = z.object({
   include: z.string().optional(),
});

export async function GET(request: NextRequest) {
   try {
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
      const query = getUserSchema.parse({
         include: searchParams.get('include'),
      });

      // Parse include relationships
      const includeRelations = query.include
         ? validateIncludeParam(query.include, USER_INCLUDE_RELATIONS)
         : {
              organizations: true,
              socialMediaAccounts: true,
              objectives: true,
              phases: true,
              activities: true,
           };

      // Build include object for Prisma
      const include: any = {
         // Existing relationships
         accounts: true,
         sessions: true,
      };

      // Add new relationships based on include parameter
      if (includeRelations.organizations) {
         include.memberships = {
            include: {
               organization: {
                  select: { id: true, name: true, slug: true, logo: true },
               },
            },
         };
      }

      if (includeRelations.socialMediaAccounts) {
         include.socialMediaAccounts = {
            select: {
               id: true,
               platform: true,
               accountId: true,
               username: true,
               displayName: true,
               avatarUrl: true,
               isActive: true,
               accessToken: true,
               refreshToken: true,
               tokenExpiresAt: true,
               metadata: true,
               organization: {
                  select: {
                     id: true,
                     name: true,
                     slug: true,
                  },
               },
               posts: {
                  select: {
                     id: true,
                     content: true,
                     status: true,
                     scheduledAt: true,
                     publishedAt: true,
                     platformUrl: true,
                  },
                  orderBy: { createdAt: 'desc' },
                  take: 5,
               },
               activities: {
                  select: {
                     id: true,
                     type: true,
                     description: true,
                     createdAt: true,
                  },
                  orderBy: { createdAt: 'desc' },
                  take: 5,
               },
               createdAt: true,
               updatedAt: true,
            },
            orderBy: { createdAt: 'desc' },
         };
      }

      if (includeRelations.objectives) {
         include.objectives = {
            select: {
               id: true,
               title: true,
               status: true,
               priority: true,
               startDate: true,
               endDate: true,
               createdAt: true,
            },
         };
      }

      if (includeRelations.phases) {
         include.phases = {
            select: {
               id: true,
               title: true,
               status: true,
               startDate: true,
               endDate: true,
               createdAt: true,
            },
         };
      }

      if (includeRelations.activities) {
         include.activities = {
            select: {
               id: true,
               type: true,
               description: true,
               createdAt: true,
               metadata: true,
            },
            orderBy: { createdAt: 'desc' },
            take: 10, // Limit to recent activities
         };
      }

      const user = await prisma.user.findUnique({
         where: { id: session.user.id },
         include,
      });

      if (!user) {
         return NextResponse.json(
            {
               ok: false,
               error: { code: 'E_USER_NOT_FOUND', message: 'User not found' },
            },
            { status: 404 }
         );
      }

      // Get basic membership info for backward compatibility
      const membership = await prisma.membership.findFirst({
         where: { userId: session.user.id },
      });

      const response = {
         id: user.id,
         name: user.name,
         email: user.email,
         image: user.image,
         emailVerified: user.emailVerified,
         createdAt: user.createdAt,
         updatedAt: user.updatedAt,
         hasMembership: !!membership,
         organizationId: membership?.organizationId,
         // Include relationships based on query
         ...(includeRelations.organizations && { memberships: user.memberships }),
         ...(includeRelations.socialMediaAccounts && {
            socialMediaAccounts: user.socialMediaAccounts,
         }),
         ...(includeRelations.objectives && { objectives: user.objectives }),
         ...(includeRelations.phases && { phases: user.phases }),
         ...(includeRelations.activities && { activities: user.activities }),
         ...(includeRelations.accounts && { accounts: user.accounts }),
         ...(includeRelations.sessions && { sessions: user.sessions }),
      };

      return createSuccessResponse(response);
   } catch (error) {
      console.error('Error fetching user:', error);
      return handleAPIError(error);
   }
}
