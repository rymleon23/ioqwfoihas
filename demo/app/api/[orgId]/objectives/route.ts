import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import {
   objectiveSchema,
   paginationSchema,
   validateIncludeParam,
   handleAPIError,
   createPaginationResponse,
} from '@/lib/schemas/api';
import { APIError } from '@/lib/api-utils';

// Validation schemas
const createObjectiveSchema = objectiveSchema;

const getObjectivesSchema = z.object({
   status: z.enum(['DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED']).nullable().optional(),
   priority: z.coerce.number().int().min(1).max(4).nullable().optional(),
   search: z.string().nullable().optional(),
   include: z.string().optional(),
   page: z.coerce.number().min(1).default(1),
   limit: z.coerce.number().min(1).max(100).default(20),
});

// Include relations for objectives
const OBJECTIVE_INCLUDE_RELATIONS = ['projects', 'phases', 'activities', 'createdBy'];

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
      const query = getObjectivesSchema.parse({
         status: searchParams.get('status'),
         priority: searchParams.get('priority'),
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
         ? validateIncludeParam(query.include, OBJECTIVE_INCLUDE_RELATIONS)
         : { projects: true, phases: true, createdBy: true };

      // Build where clause
      const where: any = {
         organizationId: orgId,
      };

      if (query.status) {
         where.status = query.status;
      }

      if (query.priority) {
         where.priority = query.priority;
      }

      if (query.search) {
         where.OR = [
            { title: { contains: query.search, mode: 'insensitive' } },
            { description: { contains: query.search, mode: 'insensitive' } },
         ];
      }

      // Get total count for pagination
      const total = await prisma.objective.count({ where });

      // Build include object for Prisma
      const include: any = {};

      // Add relationships based on include parameter
      if (includeRelations.projects) {
         include.projects = {
            select: { id: true, name: true, status: true, priority: true, health: true },
         };
      }

      if (includeRelations.phases) {
         include.phases = {
            select: { id: true, title: true, status: true },
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

      // Get objectives with pagination
      const objectives = await prisma.objective.findMany({
         where,
         include,
         orderBy: { createdAt: 'desc' },
         skip: (query.page - 1) * query.limit,
         take: query.limit,
      });

      return createPaginationResponse(objectives, query.page, query.limit, total);
   } catch (error) {
      console.error('Error fetching objectives:', error);
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

      // Only ADMIN and BRAND_OWNER can create objectives
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
      const validatedData = createObjectiveSchema.parse(body);

      // Create objective
      const objective = await prisma.objective.create({
         data: {
            ...validatedData,
            organizationId: orgId,
            createdById: session.user.id,
         },
         include: {
            projects: {
               select: { id: true, name: true, status: true, priority: true, health: true },
            },
            phases: {
               select: { id: true, title: true, status: true },
            },
            createdBy: {
               select: { id: true, name: true, email: true, image: true },
            },
         },
      });

      return NextResponse.json(
         {
            ok: true,
            data: objective,
         },
         { status: 201 }
      );
   } catch (error) {
      console.error('Error creating objective:', error);
      return handleAPIError(error);
   }
}
