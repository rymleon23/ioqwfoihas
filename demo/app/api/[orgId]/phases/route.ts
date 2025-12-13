import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import {
   phaseSchema,
   paginationSchema,
   validateIncludeParam,
   handleAPIError,
   createPaginationResponse,
} from '@/lib/schemas/api';
import { APIError } from '@/lib/api-utils';

// Validation schemas
const createPhaseSchema = phaseSchema;

const getPhasesSchema = z.object({
   status: z
      .enum(['PLANNING', 'IN_PROGRESS', 'REVIEW', 'COMPLETED', 'CANCELLED'])
      .nullable()
      .optional(),
   objectiveId: z.string().nullable().optional(),
   search: z.string().nullable().optional(),
   include: z.string().optional(),
   page: z.coerce.number().min(1).default(1),
   limit: z.coerce.number().min(1).max(100).default(20),
});

// Include relations for phases
const PHASE_INCLUDE_RELATIONS = ['objective', 'projects', 'tasks', 'activities', 'createdBy'];

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
      const query = getPhasesSchema.parse({
         status: searchParams.get('status'),
         objectiveId: searchParams.get('objectiveId'),
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
         ? validateIncludeParam(query.include, PHASE_INCLUDE_RELATIONS)
         : { objective: true, projects: true, createdBy: true };

      // Build where clause
      const where: any = {
         organizationId: orgId,
      };

      if (query.status) {
         where.status = query.status;
      }

      if (query.objectiveId) {
         where.objectiveId = query.objectiveId;
      }

      if (query.search) {
         where.OR = [
            { title: { contains: query.search, mode: 'insensitive' } },
            { description: { contains: query.search, mode: 'insensitive' } },
         ];
      }

      // Get total count for pagination
      const total = await prisma.phase.count({ where });

      // Build include object for Prisma
      const include: any = {};

      // Add relationships based on include parameter
      if (includeRelations.objective) {
         include.objective = {
            select: { id: true, title: true, status: true, priority: true },
         };
      }

      if (includeRelations.projects) {
         include.projects = {
            select: { id: true, name: true, status: true, priority: true, health: true },
         };
      }

      if (includeRelations.tasks) {
         include.tasks = {
            select: { id: true, title: true, status: true, priority: true },
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

      // Get phases with pagination
      const phases = await prisma.phase.findMany({
         where,
         include,
         orderBy: { createdAt: 'desc' },
         skip: (query.page - 1) * query.limit,
         take: query.limit,
      });

      return createPaginationResponse(phases, query.page, query.limit, total);
   } catch (error) {
      console.error('Error fetching phases:', error);
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

      // Only ADMIN and BRAND_OWNER can create phases
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
      const validatedData = createPhaseSchema.parse(body);

      // Validate objective exists if provided
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

      // Create phase
      const phase = await prisma.phase.create({
         data: {
            ...validatedData,
            organizationId: orgId,
            createdById: session.user.id,
         },
         include: {
            objective: {
               select: { id: true, title: true, status: true, priority: true },
            },
            projects: {
               select: { id: true, name: true, status: true, priority: true, health: true },
            },
            createdBy: {
               select: { id: true, name: true, email: true, image: true },
            },
         },
      });

      return NextResponse.json(
         {
            ok: true,
            data: phase,
         },
         { status: 201 }
      );
   } catch (error) {
      console.error('Error creating phase:', error);
      return handleAPIError(error);
   }
}
